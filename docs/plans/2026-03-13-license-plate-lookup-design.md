# License Plate Lookup — Design

## Overview

Add a Dutch license plate (kenteken) lookup feature to both UpCarPlay and Carro. Users enter their license plate, we call the RDW open data API to identify their car (brand, model, year), match it against our vehicle data, and skip them directly to the configuration selection step in the wizard.

## Scope

- **Netherlands only** — RDW API is free, open, no API key needed
- **Both projects** — UpCarPlay and Carro
- **Placement** — Homepage hero section + wizard brand selection page
- **Locale** — Only shown when locale is `nl` (Dutch). Other locales see the normal wizard flow.

## RDW API

**Endpoint:** `https://opendata.rdw.nl/resource/m9d7-ebf2.json`

**Query:** `?kenteken={PLATE}` (uppercase, no dashes/spaces)

**Response fields we use:**
- `merk` — brand name, e.g. `"VOLKSWAGEN"`, `"SEAT"`, `"SKODA"`
- `handelsbenaming` — model name, e.g. `"UP"`, `"POLO"`, `"SEAT MII"`, `"CITIGO"`
- `datum_eerste_toelating` — first registration date, format `"YYYYMMDD"`, gives us the year

**Important notes:**
- VW Up appears as `handelsbenaming: "UP"` (not "UP!")
- Seat Mii appears as `"SEAT MII"` (includes brand prefix)
- License plate must be sent uppercase, stripped of dashes/spaces
- API is free, no rate limits documented, CORS-enabled
- Returns `[]` for unknown plates

## Vehicle Matching

### UpCarPlay brand/model mapping:
| RDW merk | RDW handelsbenaming (contains) | Our brand | Our model |
|---|---|---|---|
| VOLKSWAGEN | UP | volkswagen | up |
| SEAT | MII | seat | mii |
| SKODA | CITIGO | skoda | citigo |

### Carro brand/model mapping:
| RDW merk | RDW handelsbenaming (contains) | Our brand | Our model ID |
|---|---|---|---|
| VOLKSWAGEN | POLO | volkswagen | polo-6r or polo-6c (by year) |
| VOLKSWAGEN | GOLF | volkswagen | golf-5 or golf-6 (by year) |
| VOLKSWAGEN | GOLF PLUS | volkswagen | golf-plus |
| VOLKSWAGEN | PASSAT | volkswagen | passat-b6 or passat-b7 (by year) |
| VOLKSWAGEN | PASSAT CC | volkswagen | passat-cc |
| VOLKSWAGEN | SCIROCCO | volkswagen | scirocco |
| VOLKSWAGEN | TIGUAN | volkswagen | tiguan |
| VOLKSWAGEN | TOURAN | volkswagen | touran |
| VOLKSWAGEN | JETTA | volkswagen | jetta |
| VOLKSWAGEN | EOS | volkswagen | eos |
| VOLKSWAGEN | CADDY | volkswagen | caddy |
| VOLKSWAGEN | TRANSPORTER | volkswagen | transporter-t5 |
| SEAT | LEON | seat | leon |
| SEAT | ALTEA | seat | altea or altea-xl |
| SEAT | TOLEDO | seat | toledo |
| SKODA | OCTAVIA | skoda | octavia-2 or octavia-combi |
| SKODA | SUPERB | skoda | superb |
| SKODA | FABIA | skoda | fabia |
| SKODA | ROOMSTER | skoda | roomster |
| SKODA | YETI | skoda | yeti |

Note: Some models share a name across generations (Polo 6R vs 6C, Golf 5 vs 6). We determine the correct generation by cross-referencing the RDW year against each model's `yearRange`. If a year matches multiple models of the same name, we pick the first match.

## User Flow

### Happy path:
1. User sees license plate input (hero or wizard page, nl locale only)
2. User types `AB-123-CD` (dashes are stripped automatically)
3. Clicks "Zoek op" or presses Enter
4. Loading spinner shown
5. API returns match → we find brand + model + year in our data
6. **UpCarPlay:** Redirect to `/selecteer/{brand}/{year}` (config step, since 1 model per brand)
7. **Carro:** Redirect to `/selecteer/{brand}/{model}/{year}` (config step)

### Error states:
- **Unknown plate** (RDW returns `[]`): "Kenteken niet gevonden"
- **Unsupported car** (car found but not in our catalog): "Helaas, we ondersteunen dit model niet. Probeer de handmatige selectie."
- **API error**: "Er ging iets mis. Probeer het opnieuw."

## Architecture

### API Route: `/api/kenteken/route.ts`
- Server-side proxy to RDW API (avoids CORS issues on some browsers, lets us add caching later)
- Input: `GET /api/kenteken?plate=AB123CD`
- Calls RDW API, extracts merk + handelsbenaming + year
- Matches against our vehicle data mapping
- Returns: `{ brand, model, year }` or `{ error: "not_found" | "unsupported" }`

### Client Component: `LicensePlateInput`
- Shared component used in both hero and wizard brand step
- Only renders when locale is `nl`
- Input field styled as a Dutch license plate (yellow background, bold text, NL country badge)
- Formats input automatically (uppercase, strips dashes)
- Calls `/api/kenteken?plate=...` on submit
- On success: redirects via `router.push()` to the config step
- On error: shows inline error message

### Integration points:
1. **Hero component** — Add `LicensePlateInput` below the subtitle, above the CTA button
2. **Wizard brand step** — Add `LicensePlateInput` above the brand cards, with a divider "of selecteer handmatig" (or select manually)

## UI Design

The license plate input should look like a Dutch license plate for instant recognition:

```
┌─────────────────────────────────┐
│ NL │  AB · 123 · CD    │ Zoek  │
│ 🇪🇺 │                    │   →   │
└─────────────────────────────────┘
```

- Yellow background (`#F7B731`) with dark text, bold, rounded
- Left side: blue strip with "NL" and EU stars (like a real plate)
- Input auto-formats to uppercase
- Button: "Zoek op" (Look up)
- Below: small text "Voer je kenteken in voor direct resultaat" (Enter your plate for instant results)

## Translations

Only Dutch translations needed since the feature is NL-only. Add to `selector` namespace:

```json
{
  "licensePlateTitle": "Voer je kenteken in",
  "licensePlateSubtitle": "We zoeken direct het juiste scherm voor jouw auto",
  "licensePlatePlaceholder": "Bijv. AB-123-CD",
  "licensePlateLookup": "Zoek op",
  "licensePlateNotFound": "Kenteken niet gevonden. Controleer het kenteken en probeer opnieuw.",
  "licensePlateUnsupported": "Helaas ondersteunen we dit model nog niet. Selecteer hieronder handmatig je auto.",
  "licensePlateError": "Er ging iets mis. Probeer het opnieuw.",
  "licensePlateOr": "of selecteer handmatig",
  "licensePlateFound": "gevonden! Even geduld..."
}
```

For en/de/fr — no translations needed since the component only renders for nl locale.

## Both Projects

The implementation is identical in structure for both projects. The only differences are:
1. **Vehicle matching map** — UpCarPlay has 3 models, Carro has ~20
2. **Redirect URL** — UpCarPlay skips model step (`/selecteer/{brand}/{year}`), Carro includes it (`/selecteer/{brand}/{model}/{year}`)
3. **Translations** — site name references differ

We implement UpCarPlay first, then copy to Carro with the adjusted mapping.
