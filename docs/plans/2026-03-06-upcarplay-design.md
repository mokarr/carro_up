# UpCarPlay — Design Document

## Overview

Sister site to Carro, same company, same branding. Sells CarPlay screens for the VW Up, Seat Mii, and Skoda Citigo (2011–2023). Identical tech stack and design language as Carro.

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- next-intl v4 (NL default, EN, DE, FR)
- Stripe Checkout (hosted), Redis (ioredis), Resend
- Vercel deployment
- Data as JSON files (no database)

## Vehicle Data

Three brands, one model each:

| Brand | Model | Years |
|-------|-------|-------|
| Volkswagen | Up | 2011–2023 |
| Seat | Mii | 2011–2023 |
| Skoda | Citigo | 2011–2023 |

### Configurations

The configuration a user has depends on their build year and dashboard setup. Two eras:

**Pre-facelift (2011–2016):**

| Config ID | Description | Key trait |
|-----------|-------------|-----------|
| `without-garmin` | No Garmin/Navigon navigation | Simpler install |
| `with-garmin` | Has Garmin/Navigon navigation | Requires install kit, ~45 min |

**Facelift (2016–2023):**

| Config ID | Description | Key traits |
|-----------|-------------|------------|
| `low-with-holder` | Low dashboard, with phone holder + USB | Plug & play, <5 min |
| `low-without-holder-bt` | Low dashboard, no phone holder, radio with Bluetooth | Needs phone holder accessory |
| `low-without-holder-no-bt` | Low dashboard, no phone holder, radio without Bluetooth | Needs phone holder + AUX |
| `high-with-holder` | High dashboard, with phone holder + USB | Plug & play, <5 min |
| `high-without-holder-bt` | High dashboard, no phone holder, radio with Bluetooth | Needs phone holder accessory |
| `high-without-holder-no-bt` | High dashboard, no phone holder, radio without Bluetooth | Needs phone holder + AUX |

## Wizard Flow (4 steps)

Since there is only one model per brand, the model step is skipped.

| Step | URL pattern | What user picks |
|------|------------|-----------------|
| 1. Merk | `/selecteer` | VW Up, Seat Mii, Skoda Citigo |
| 2. Bouwjaar | `/selecteer/{brand}` | Year (2011–2023) |
| 3. Configuratie | `/selecteer/{brand}/{year}` | Dashboard configuration |
| 4. Resultaat | `/selecteer/{brand}/{year}/{config}` | Compatible screen + accessories |

All steps statically generated. URL-based navigation (no client-side state machine).

Step 3 shows configuration images so the user can visually match their dashboard. Pre-facelift users see 2 options (with/without Garmin). Facelift users see up to 6 options based on dashboard height, phone holder presence, and radio Bluetooth.

## Products

### Screens (~18 total, 6 per brand)

All screens are the same physical 11.25" IPS display (1920x720), but branded per car model. Each configuration maps to exactly one screen product.

**Pricing per configuration:**

| Configuration | Price | Compare-at |
|--------------|-------|------------|
| Pre-facelift without Garmin | €349.99 (34999) | €379.99 (37999) |
| Pre-facelift with Garmin | €429.99 (42999) | €499.99 (49999) |
| Facelift low/high + with holder | €299.99 (29999) | €349.99 (34999) |
| Facelift low/high + no holder + BT | €329.99 (32999) | €379.99 (37999) |
| Facelift low/high + no holder + no BT | €339.99 (33999) | €379.99 (37999) |

**Screen variants (startup logo):**

| Variant | Price modifier |
|---------|---------------|
| Standard logo | +€0 |
| E-UP logo | +€25 (2500) |
| GTI logo | +€35 (3500) |
| VW logo | +€25 (2500) |
| Seat logo | +€25 (2500) |
| Skoda logo | +€25 (2500) |

**Screen specs (shared across all screens):**

- Display: 11.25" IPS touchscreen
- Resolution: 1920 x 720 pixels
- Dimensions: 260 x 105 mm
- Startup time: ~5-10 seconds
- Dashcam: 3840 x 2160 (4K)
- RAM: 6 GB
- Brightness: 100–1000 nits adjustable
- Wireless: Apple CarPlay, Android Auto, Bluetooth 5.0, AirPlay, Mirroring
- OS: UpYourCarPlay Software
- Power: 5V / max 3A
- Connections: USB-C, AUX, microSD (max 128GB), rear camera input
- Warranty: 1 year
- Operating temp: -20°C to 75°C

### Accessories (~10)

| Product | Price | Compare-at | Category |
|---------|-------|------------|----------|
| Original Phone Holder + Bracket | €75.99 (7599) | €88.99 (8899) | Required for "without holder" configs |
| Replacement Phone Holder (Loose) | €15.99 (1599) | €29.35 (2935) | Optional |
| MicroSD Card 64GB (dashcam) | €33.99 (3399) | — | Optional |
| OBD2 Diagnostic Scanner | €39.99 (3999) | — | Optional |
| OEM USB Insert (Replacement) | €45.99 (4599) | — | Optional |
| Center Console Storage Box | €29.99 (2999) | €38.99 (3899) | Optional |
| 2-in-1 Ice Scraper & Window Wiper | €7.95 (795) | — | Optional |
| 3D-Printed Grille | €39.99 (3999) | — | Optional |
| 3D-Printed Cold Air Intake | €69.99 (6999) | — | Optional |
| Build-in Kit USB (2016-2023) | €129.99 (12999) | — | Required for some installs |

### Configuration → Product mapping

Each configuration links to:
- `compatibleProducts`: exactly 1 screen product
- `requiredAccessories`: depends on config (e.g. "without holder" configs require Phone Holder)
- `optionalAccessories`: SD card, OBD scanner, storage box, ice scraper, etc.

## Pages

Identical page structure to Carro:

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, USPs, featured products, CTA |
| Wizard | `/selecteer/...` | 4-step vehicle selector |
| Products | `/producten` | All products with filter tabs |
| Product detail | `/product/[slug]` | Specs, images, variants, accessories, order |
| Cart | `/winkelwagen` | Full cart page |
| Checkout success | `/bestelling/succes` | Order confirmation |
| Checkout cancelled | `/bestelling/geannuleerd` | Cancelled order |
| FAQ | `/faq` | Frequently asked questions (from UpYourCarPlay) |
| Contact | `/contact` | Contact form |
| Terms | `/voorwaarden` | Terms & conditions |

### Pages NOT included (simplification vs Carro)

- No installation service pages (UpCarPlay handles this via contact)
- No installation guides/codes (simpler product, plug & play)
- No partner sign-up

## Data Architecture

Same pattern as Carro:

```
src/data/
  vehicles/
    _schema.json
    volkswagen.json      # VW Up with 8 configurations
    seat.json            # Seat Mii with 8 configurations
    skoda.json           # Skoda Citigo with 8 configurations
  products/
    _schema.json
    # 18 screen products (6 per brand)
    vw-up-screen-facelift-low-holder.json
    vw-up-screen-facelift-low-no-holder-bt.json
    vw-up-screen-facelift-low-no-holder-no-bt.json
    vw-up-screen-facelift-high-holder.json
    vw-up-screen-facelift-high-no-holder-bt.json
    vw-up-screen-facelift-high-no-holder-no-bt.json
    seat-mii-screen-facelift-low-holder.json
    ... (same pattern for Seat and Skoda)
    vw-up-screen-pre-facelift-no-garmin.json
    vw-up-screen-pre-facelift-garmin.json
    ... (same pattern for Seat and Skoda)
    # Accessories
    phone-holder-bracket.json
    phone-holder-loose.json
    microsd-card-64gb.json
    obd2-scanner.json
    oem-usb-insert.json
    storage-box.json
    ice-scraper.json
    grille-3d.json
    cold-air-intake.json
    build-in-kit-usb.json
```

Vehicle JSON schema: same as Carro but without models array nesting (brand → configurations directly, since 1 model per brand). Actually, keep the same schema with 1 model per brand for code compatibility.

## Design / Branding

- Same color tokens as Carro (accent red, dark bg, card bg, etc.)
- Same component library (Button, Badge, Card, etc.)
- Same layout (header, nav, footer, cart sidebar)
- Same minimalist step indicator
- Placeholder logo text "UpCarPlay" until final branding decided
- Same font (Inter)

## Cart & Checkout

Identical to Carro:
- localStorage cart with React Context
- Bundled cart items (1 product + variant + accessories)
- Slide-out sidebar + full cart page
- "Add to Cart" + "Direct Order" buttons
- Stripe Checkout (hosted) with inline price_data
- Webhook → email confirmation via Resend

## Differences from Carro

| Aspect | Carro | UpCarPlay |
|--------|-------|-----------|
| Wizard steps | 5 (brand→model→year→config→result) | 4 (brand→year→config→result) |
| Brands | VW, Seat, Skoda (many models) | VW Up, Seat Mii, Skoda Citigo only |
| Products | RCD radios + H270 nav systems | CarPlay screens (1 type, brand-specific) |
| Installation pages | Yes (service + partners) | No (contact-based) |
| Guide codes | Yes (Redis + email) | No |
| Product groups | rcd, rcd-polo, h270 | Not needed (1 screen per config) |
| Model selector | Yes (switch between RCD models) | No |
