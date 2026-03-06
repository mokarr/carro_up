# UpCarPlay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multilingual e-commerce site for CarPlay screens (VW Up / Seat Mii / Skoda Citigo), replicating Carro's architecture with a 4-step wizard and different product data.

**Architecture:** Next.js 16 App Router with static generation. Vehicle/product data as JSON files. Stripe Checkout for payments. Cart in localStorage with React Context. Copy Carro's component library and adapt for UpCarPlay's product catalog.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, next-intl v4, Stripe, ioredis, Resend

**Source project (to copy from):** `C:\Users\Moka\Dev\carro`
**Target project:** `C:\Users\Moka\Dev\upcarplay`

---

### Task 1: Project Scaffolding

**Goal:** Initialize Next.js 16 project with all dependencies and config files.

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `.env.local` (gitignored, for local dev)

**Step 1: Initialize Next.js project**

Run in `C:\Users\Moka\Dev\upcarplay`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack
```

If it complains about existing files, use `--yes` or handle accordingly. The key is getting the right `package.json` scaffold.

**Step 2: Install additional dependencies**

```bash
npm install next-intl stripe ioredis resend
npm install -D @types/node
```

**Step 3: Copy and adapt `next.config.ts` from Carro**

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

**Step 4: Copy `.gitignore` from Carro**

Ensure it includes `.env.local`, `node_modules`, `.next`, `nul` (Windows artifact).

**Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts .gitignore
git commit -m "feat: initialize next.js 16 project with dependencies"
```

---

### Task 2: Theme, Globals & UI Components

**Goal:** Copy Carro's design system — Tailwind v4 theme tokens, global CSS, and all UI components.

**Files:**
- Copy: `src/app/globals.css` (Tailwind v4 `@theme` config with color tokens)
- Copy: `src/components/ui/button.tsx`
- Copy: `src/components/ui/badge.tsx`
- Copy: `src/components/ui/input.tsx`
- Copy: `src/components/ui/progress-bar.tsx`
- Copy: any other UI primitives from Carro's `src/components/ui/`

**Step 1: Copy `globals.css` from Carro**

This contains the `@theme` block with all color tokens: `--color-accent`, `--color-background`, `--color-card`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-dark`, `--color-success`, `--color-error`, etc.

Copy verbatim — same branding.

**Step 2: Copy all UI components from `src/components/ui/`**

Copy every file from Carro's `src/components/ui/` directory. These are brand-agnostic primitives.

**Step 3: Verify the components compile**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/app/globals.css src/components/ui/
git commit -m "feat: add design system — theme tokens and UI components"
```

---

### Task 3: i18n Setup & Translation Files

**Goal:** Set up next-intl with 4 locales (nl, en, de, fr) and create all translation files.

**Files:**
- Copy: `src/i18n/config.ts`
- Copy: `src/i18n/routing.ts`
- Copy: `src/i18n/request.ts`
- Create: `src/i18n/messages/nl.json`
- Create: `src/i18n/messages/en.json`
- Create: `src/i18n/messages/de.json`
- Create: `src/i18n/messages/fr.json`
- Copy: `src/proxy.ts` (Next.js 16 middleware for locale routing)

**Step 1: Copy i18n config files from Carro**

Copy `config.ts`, `routing.ts`, `request.ts` verbatim — same locale setup.

**Step 2: Copy `proxy.ts` from Carro**

This handles locale-based routing in Next.js 16. Copy verbatim.

**Step 3: Create translation files**

Start from Carro's translation files as base. Adapt:
- `common.siteName`: "UpCarPlay" (temporary)
- `common.siteDescription`: Update for CarPlay screens
- `home.*`: Rewrite hero text for CarPlay screens
- `selector.*`: Adapt for 4-step wizard (remove `stepModel`, rename steps)
  - Step labels: "Merk", "Bouwjaar", "Configuratie", "Resultaat"
  - Step titles: "Welk merk heb je?", "Wat is je bouwjaar?", "Welke configuratie heb je?", "Jouw scherm"
- `product.*`: Keep mostly same
- `cart.*`: Keep same
- `products.*`: Keep same
- `faq.*`: Rewrite with UpYourCarPlay FAQ content
- Remove: `installation.*`, `guides.*` (not used)
- Keep: `contact.*`, `order.*`, `terms.*`, `footer.*`

The `selector` namespace needs new keys:
```json
{
  "selector": {
    "stepBrand": "Merk",
    "stepYear": "Bouwjaar",
    "stepConfig": "Configuratie",
    "stepResult": "Resultaat",
    "step1Title": "Welk merk heb je?",
    "step2Title": "Wat is je bouwjaar?",
    "step3Title": "Welke configuratie heb je?",
    "resultTitle": "Jouw scherm",
    "chooseProduct": "Bekijk product",
    "requiredAccessory": "Vereiste accessoires",
    "optionalAccessories": "Optionele accessoires",
    "included": "Inbegrepen",
    "chooseVariant": "Kies je opstart-logo"
  }
}
```

Translate all 4 locales.

**Step 4: Commit**

```bash
git add src/i18n/ src/proxy.ts
git commit -m "feat: add i18n setup with 4 locale translation files"
```

---

### Task 4: Vehicle Data

**Goal:** Create vehicle JSON files for VW Up, Seat Mii, and Skoda Citigo with all configurations.

**Files:**
- Create: `src/data/vehicles/_schema.json`
- Create: `src/data/vehicles/volkswagen.json`
- Create: `src/data/vehicles/seat.json`
- Create: `src/data/vehicles/skoda.json`

**Step 1: Copy `_schema.json` from Carro**

Same schema. Each brand has `models[]`, each model has `configurations[]`.

**Step 2: Create `volkswagen.json`**

```json
{
  "brand": "volkswagen",
  "displayName": { "nl": "Volkswagen", "en": "Volkswagen", "de": "Volkswagen", "fr": "Volkswagen" },
  "logo": "/images/brands/volkswagen.svg",
  "models": [
    {
      "id": "up",
      "displayName": { "nl": "Up", "en": "Up", "de": "Up", "fr": "Up" },
      "subtitle": { "nl": "2011–2023", "en": "2011–2023", "de": "2011–2023", "fr": "2011–2023" },
      "image": "/images/vehicles/vw-up.png",
      "yearRange": { "from": 2011, "to": 2023 },
      "configurations": [
        {
          "id": "pre-facelift-no-garmin",
          "displayName": { "nl": "Zonder Garmin/Navigon", "en": "Without Garmin/Navigon", ... },
          "description": { "nl": "Originele radio zonder navigatie", ... },
          "image": "/images/configs/pre-facelift-no-garmin.png",
          "availableYears": [2011, 2012, 2013, 2014, 2015, 2016],
          "compatibleProducts": ["vw-up-screen-pre-facelift-no-garmin"],
          "requiredAccessories": [],
          "optionalAccessories": ["microsd-card-64gb", "obd2-scanner", "storage-box", "ice-scraper", "grille-3d", "cold-air-intake"],
          "notes": null
        },
        {
          "id": "pre-facelift-garmin",
          "displayName": { "nl": "Met Garmin/Navigon", ... },
          "availableYears": [2011, 2012, 2013, 2014, 2015, 2016],
          "compatibleProducts": ["vw-up-screen-pre-facelift-garmin"],
          "requiredAccessories": ["build-in-kit-usb"],
          "optionalAccessories": ["microsd-card-64gb", "obd2-scanner", "storage-box", "ice-scraper"],
          ...
        },
        {
          "id": "low-with-holder",
          "displayName": { "nl": "Laag dashboard — met telefoonhouder", ... },
          "availableYears": [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
          "compatibleProducts": ["vw-up-screen-facelift-low-holder"],
          "requiredAccessories": [],
          "optionalAccessories": ["microsd-card-64gb", "obd2-scanner", "phone-holder-bracket", "storage-box", "ice-scraper"],
          ...
        },
        {
          "id": "low-without-holder-bt",
          "displayName": { "nl": "Laag dashboard — zonder telefoonhouder — radio met Bluetooth", ... },
          "availableYears": [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
          "compatibleProducts": ["vw-up-screen-facelift-low-no-holder-bt"],
          "requiredAccessories": ["phone-holder-bracket"],
          "optionalAccessories": ["microsd-card-64gb", "obd2-scanner", "storage-box", "ice-scraper"],
          ...
        },
        ... (4 more facelift configs: low-without-holder-no-bt, high-with-holder, high-without-holder-bt, high-without-holder-no-bt)
      ]
    }
  ]
}
```

**Step 3: Create `seat.json` and `skoda.json`**

Same structure, different brand name, logo, model name ("Mii" / "Citigo"), and product IDs (prefixed with `seat-mii-` / `skoda-citigo-`).

**Step 4: Commit**

```bash
git add src/data/vehicles/
git commit -m "feat: add vehicle data for VW Up, Seat Mii, Skoda Citigo"
```

---

### Task 5: Product Data

**Goal:** Create all product JSON files — 18 screens + 10 accessories.

**Files:**
- Create: `src/data/products/_schema.json`
- Create: 18 screen product files (6 per brand)
- Create: 10 accessory product files

**Step 1: Copy `_schema.json` from Carro**

Same schema (id, slug, name, price, variants, specs, etc.). Remove `group` field (not needed).

**Step 2: Create screen product files**

Example: `src/data/products/vw-up-screen-facelift-low-holder.json`:
```json
{
  "id": "vw-up-screen-facelift-low-holder",
  "category": "screen",
  "slug": "vw-up-screen-2016-2023-low-dashboard-with-phone-holder",
  "name": {
    "nl": "UpCarPlay Scherm VW Up (2016–2023) — Laag Dashboard — Met Telefoonhouder",
    "en": "UpCarPlay Screen VW Up (2016–2023) — Low Dashboard — With Phone Holder",
    "de": "UpCarPlay Bildschirm VW Up (2016–2023) — Niedriges Armaturenbrett — Mit Telefonhalter",
    "fr": "Écran UpCarPlay VW Up (2016–2023) — Tableau de bord bas — Avec support téléphone"
  },
  "shortDescription": { ... },
  "description": { ... },
  "price": 29999,
  "compareAtPrice": 34999,
  "currency": "EUR",
  "images": ["/images/products/screen-facelift-low-holder.png"],
  "specs": {
    "display": "11.25\" IPS",
    "resolution": "1920 x 720",
    "dimensions": "260 x 105 mm",
    "dashcam": "4K (3840 x 2160)",
    "ram": "6 GB",
    "brightness": "100–1000 nits",
    "wireless": "CarPlay, Android Auto, BT 5.0, AirPlay",
    "connections": "USB-C, AUX, microSD, rear camera",
    "power": "5V / 3A",
    "warranty": "1 year"
  },
  "packageContents": {
    "nl": ["UpCarPlay scherm", "USB-C kabel", "AUX kabel (90°)", "Montagehandleiding"],
    "en": ["UpCarPlay screen", "USB-C cable", "AUX cable (90°)", "Installation guide"],
    ...
  },
  "features": {
    "nl": ["Draadloos Apple CarPlay & Android Auto", "Ingebouwde 4K dashcam", "Plug & play installatie", "11.25\" IPS touchscreen"],
    ...
  },
  "recommended": true,
  "variants": [
    { "id": "logo-standard", "name": { "nl": "Standaard logo", ... }, "priceModifier": 0 },
    { "id": "logo-eup", "name": { "nl": "E-UP logo", ... }, "priceModifier": 2500 },
    { "id": "logo-gti", "name": { "nl": "GTI logo", ... }, "priceModifier": 3500 },
    { "id": "logo-vw", "name": { "nl": "VW logo", ... }, "priceModifier": 2500 },
    { "id": "logo-seat", "name": { "nl": "Seat logo", ... }, "priceModifier": 2500 },
    { "id": "logo-skoda", "name": { "nl": "Skoda logo", ... }, "priceModifier": 2500 }
  ],
  "stripeProductId": "",
  "stripePriceId": ""
}
```

Create all 18 screens following this pattern. Prices vary by configuration:
- facelift + holder: 29999 (compare 34999)
- facelift + no holder + BT: 32999 (compare 37999)
- facelift + no holder + no BT: 33999 (compare 37999)
- pre-facelift no garmin: 34999 (compare 37999)
- pre-facelift garmin: 42999 (compare 49999)

**Step 3: Create accessory product files**

10 accessories, each as a separate JSON. Use same schema but `category: "accessory"`, no variants, simpler data. Prices as documented in the design doc.

**Step 4: Commit**

```bash
git add src/data/products/
git commit -m "feat: add product data — 18 screens and 10 accessories"
```

---

### Task 6: Data Loading Libraries

**Goal:** Create TypeScript libraries for loading vehicle and product data.

**Files:**
- Create: `src/lib/vehicles.ts` (copy from Carro, adapt imports)
- Create: `src/lib/products.ts` (copy from Carro, adapt imports)
- Create: `src/lib/stripe.ts` (copy from Carro verbatim)
- Create: `src/lib/cart.ts` (copy from Carro, change localStorage key)
- Create: `src/lib/seo.ts` (copy from Carro, change site name)

**Step 1: Copy `vehicles.ts` from Carro**

Adapt the imports to load VW Up, Seat Mii, Skoda Citigo JSON files. Key exports:
- `getAllBrands()`, `getBrand()`, `getModel()`, `getConfiguration()`
- `getConfigurationsForYear()`
- `TranslatedString` type, `t()` helper

Since UpCarPlay has no model step in the wizard but keeps the same data schema (1 model per brand), the data loading code stays the same.

**Step 2: Copy `products.ts` from Carro**

Adapt the imports to load all 28 product JSON files. Key exports:
- `getAllProducts()`, `getProduct()`, `getProductBySlug()`
- `Product` type, `ProductVariant` type
- `formatPrice()`
- Remove `getGroupSiblings()` (not needed)

**Step 3: Copy utility libs from Carro**

- `stripe.ts`: verbatim (lazy `getStripe()` init)
- `cart.ts`: change localStorage key from `"carro-cart"` to `"upcarplay-cart"`
- `seo.ts`: change site name

**Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add data loading libraries and utility modules"
```

---

### Task 7: Layout Components

**Goal:** Create header, nav, footer, language switcher, cart sidebar, cart icon.

**Files:**
- Copy & adapt: `src/components/layout/header.tsx`
- Copy & adapt: `src/components/layout/nav.tsx`
- Copy & adapt: `src/components/layout/footer.tsx`
- Copy: `src/components/layout/language-switcher.tsx`
- Copy & adapt: `src/components/cart/cart-provider.tsx`
- Copy: `src/components/cart/cart-sidebar.tsx`
- Copy: `src/components/cart/cart-icon.tsx`
- Copy: `src/components/cart/cart-page-content.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/layout.tsx` (root layout)

**Step 1: Copy layout components from Carro**

Adapt nav links — remove installation/guides pages. Keep: home, selecteer, producten, faq, contact.

**Step 2: Copy cart components from Carro**

Copy verbatim: `cart-provider.tsx`, `cart-sidebar.tsx`, `cart-icon.tsx`, `cart-page-content.tsx`.

**Step 3: Create root layout and locale layout**

Copy from Carro. The locale layout wraps children with `CartProvider` and includes `CartSidebar`.

**Step 4: Commit**

```bash
git add src/components/layout/ src/components/cart/ src/app/layout.tsx src/app/[locale]/layout.tsx
git commit -m "feat: add layout components — header, nav, footer, cart"
```

---

### Task 8: Home Page

**Goal:** Create the landing page with hero, USPs, featured products, and CTA.

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Copy & adapt: `src/components/home/product-highlight.tsx`
- Create: hero section, USP section

**Step 1: Create home page**

Copy Carro's home page structure. Adapt:
- Hero text: Focus on CarPlay screens for VW Up / Seat Mii / Skoda Citigo
- USPs: Plug & play, wireless CarPlay/Android Auto, 4K dashcam, 1 year warranty
- Featured product: Show the most popular screen
- CTA: "Vind jouw scherm" → wizard

**Step 2: Commit**

```bash
git add src/app/[locale]/page.tsx src/components/home/
git commit -m "feat: add home page with hero, USPs, and product highlight"
```

---

### Task 9: Wizard (4-Step Vehicle Selector)

**Goal:** Build the 4-step wizard: Brand → Year → Configuration → Result.

**Files:**
- Copy & adapt: `src/components/selector/step-indicator.tsx` (4 steps instead of 5)
- Copy & adapt: `src/components/selector/wizard-container.tsx`
- Create: `src/components/selector/brand-step.tsx`
- Create: `src/components/selector/year-step.tsx`
- Create: `src/components/selector/config-step.tsx`
- Create: `src/components/selector/result-step.tsx`
- Create: `src/app/[locale]/selecteer/page.tsx` (step 1)
- Create: `src/app/[locale]/selecteer/[...steps]/page.tsx` (steps 2-4)

**Step 1: Adapt step indicator for 4 steps**

Copy from Carro. Change `totalSteps` default to 4. Update label keys:
- `stepBrand`, `stepYear`, `stepConfig`, `stepResult`

**Step 2: Copy wizard container**

Copy from Carro verbatim.

**Step 3: Create brand-step.tsx**

Show 3 cards: VW Up, Seat Mii, Skoda Citigo. Each links to `/selecteer/{brand}`.
Copy from Carro's brand-step and adapt — same visual style.

**Step 4: Create year-step.tsx**

Show year buttons from the model's `yearRange`. Each links to `/selecteer/{brand}/{year}`.
Copy from Carro's year-step. Note: since there's only 1 model per brand, we skip the model step. The URL goes directly from brand to year.

In the catch-all route, `steps[0]` = brand, `steps[1]` = year, `steps[2]` = config.

**Step 5: Create config-step.tsx**

Show configuration options filtered by selected year. Uses `getConfigurationsForYear()`.
Copy from Carro's config-step. Pre-facelift years show 2 options, facelift years show up to 6.

**Step 6: Create result-step.tsx**

Show the compatible screen product with accessories. Simpler than Carro's — no product grouping needed (1 screen per config).
Links to `/product/{slug}` for full product page.

**Step 7: Create wizard route pages**

`/selecteer/page.tsx` — renders `BrandStep` with `currentStep={1}`.
`/selecteer/[...steps]/page.tsx` — parses steps array:
- `[brand]` → `YearStep` with `currentStep={2}`
- `[brand, year]` → `ConfigStep` with `currentStep={3}`
- `[brand, year, config]` → `ResultStep` with `currentStep={4}`

Implement `generateStaticParams()` to statically generate all permutations.

**Step 8: Verify wizard builds**

```bash
npx next build
```

**Step 9: Commit**

```bash
git add src/components/selector/ src/app/[locale]/selecteer/
git commit -m "feat: add 4-step vehicle selector wizard"
```

---

### Task 10: Product Pages

**Goal:** Product listing page + product detail page with variants, accessories, and order section.

**Files:**
- Create: `src/app/[locale]/producten/page.tsx`
- Create: `src/app/[locale]/product/[slug]/page.tsx`
- Copy & adapt: `src/components/product/product-order-section.tsx`
- Copy: `src/components/product/image-carousel.tsx`
- Copy: `src/components/product/spec-table.tsx`
- Copy: `src/components/product/package-list.tsx`
- Copy: `src/components/product/compatible-vehicles.tsx`
- Copy: `src/components/product/product-grid.tsx`
- Remove (not needed): `src/components/product/model-selector.tsx`, `src/components/product/order-button.tsx`

**Step 1: Copy product components from Carro**

Copy all product components except `model-selector.tsx` and `order-button.tsx`.
`product-order-section.tsx`: Copy the updated version (with inline checkout including cart items).

**Step 2: Create products listing page**

Copy from Carro. Filter tabs: "Alles", "Schermen", "Accessoires".

**Step 3: Create product detail page**

Copy from Carro. Remove model selector logic. Keep vehicle context from query params.

**Step 4: Commit**

```bash
git add src/app/[locale]/producten/ src/app/[locale]/product/ src/components/product/
git commit -m "feat: add product listing and detail pages"
```

---

### Task 11: Checkout API & Webhook

**Goal:** Stripe checkout session creation and webhook for order processing.

**Files:**
- Copy: `src/app/api/checkout/route.ts`
- Copy & adapt: `src/app/api/webhook/route.ts` (simplified — no guide codes)
- Create: `src/app/[locale]/bestelling/succes/page.tsx`
- Create: `src/app/[locale]/bestelling/geannuleerd/page.tsx`

**Step 1: Copy checkout API from Carro**

Copy verbatim — supports both single-product and cart `items[]` format.

**Step 2: Simplify webhook**

Copy from Carro but remove guide code generation/Redis storage. Just send order confirmation email via Resend.

**Step 3: Create order result pages**

Copy from Carro. Remove guide code references from success page.

**Step 4: Commit**

```bash
git add src/app/api/ src/app/[locale]/bestelling/
git commit -m "feat: add Stripe checkout API, webhook, and order pages"
```

---

### Task 12: Remaining Pages

**Goal:** FAQ, contact, terms, cart page.

**Files:**
- Create: `src/app/[locale]/faq/page.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/voorwaarden/page.tsx`
- Create: `src/app/[locale]/winkelwagen/page.tsx`
- Create: `src/app/sitemap.ts`

**Step 1: Create FAQ page**

Copy from Carro's structure. Replace FAQ content with UpYourCarPlay's FAQ (translated to all 4 locales in the messages files).

**Step 2: Create contact page**

Copy from Carro.

**Step 3: Create terms page**

Copy from Carro, adapt company name.

**Step 4: Create cart page**

Copy from Carro — renders `CartPageContent`.

**Step 5: Create sitemap**

Copy from Carro, adapt for UpCarPlay's page structure (4-step wizard, different products).

**Step 6: Commit**

```bash
git add src/app/[locale]/faq/ src/app/[locale]/contact/ src/app/[locale]/voorwaarden/ src/app/[locale]/winkelwagen/ src/app/sitemap.ts
git commit -m "feat: add FAQ, contact, terms, and cart pages"
```

---

### Task 13: Static Assets & Images

**Goal:** Add placeholder images for vehicles, configurations, products, and brand logos.

**Files:**
- Create: `public/images/brands/volkswagen.svg`
- Create: `public/images/brands/seat.svg`
- Create: `public/images/brands/skoda.svg`
- Create: `public/images/vehicles/vw-up.png` (placeholder)
- Create: `public/images/vehicles/seat-mii.png` (placeholder)
- Create: `public/images/vehicles/skoda-citigo.png` (placeholder)
- Create: `public/images/configs/` (configuration photos — placeholder)
- Create: `public/images/products/` (product photos — placeholder)

**Step 1: Copy brand logos from Carro**

Same brands (VW, Seat, Skoda) — same SVG logos.

**Step 2: Create placeholder images**

For vehicle/config/product images, use placeholder files initially. The user will supply real images later.

**Step 3: Commit**

```bash
git add public/images/
git commit -m "feat: add brand logos and placeholder images"
```

---

### Task 14: Build, Test & Deploy Setup

**Goal:** Verify the full build passes and set up for Vercel deployment.

**Step 1: Full build**

```bash
npx next build
```

Fix any errors.

**Step 2: Create GitHub repository**

```bash
gh repo create mohamed-karroumi/upcarplay --private --source=. --push
```

**Step 3: Set up Vercel project**

This requires the user to:
1. Import the repo on Vercel
2. Set environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `REDIS_URL`, `NEXT_PUBLIC_SITE_URL`

**Step 4: Deploy**

```bash
git push
```

Vercel auto-deploys on push.

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: finalize build and deployment configuration"
```
