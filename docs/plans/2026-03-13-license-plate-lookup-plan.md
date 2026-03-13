# License Plate Lookup — Implementation Plan

## Tasks

### Task 1: API route (`/api/kenteken`)
- Create `src/app/api/kenteken/route.ts`
- Accept GET with `?plate=` query param
- Strip dashes/spaces, uppercase the plate
- Call RDW API: `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken={PLATE}`
- Extract `merk`, `handelsbenaming`, `datum_eerste_toelating` (year)
- Match against vehicle data mapping (brand → model lookup)
- Return JSON: `{ brand, model, year }` on success, `{ error }` on failure

### Task 2: License plate input component
- Create `src/components/selector/license-plate-input.tsx`
- Client component ("use client")
- Only renders when locale is "nl" (passed as prop)
- Dutch plate styling: yellow bg, blue NL strip, bold uppercase input
- Auto-strips dashes/spaces, uppercases
- Calls `/api/kenteken?plate=...` on submit
- On success: `router.push()` to config step
- Error states: not found, unsupported, API error
- Loading state with spinner

### Task 3: Add translations
- Add license plate keys to nl.json selector section
- Add empty/placeholder keys to en/de/fr (component won't render, but keys should exist for type safety)

### Task 4: Integrate into hero + wizard
- Hero: add LicensePlateInput below subtitle (nl locale only)
- Wizard brand step: add LicensePlateInput above brand cards with "of selecteer handmatig" divider

### Task 5: Copy to Carro
- Copy API route (adjust vehicle mapping for Carro's models)
- Copy component (adjust redirect URL to include model step)
- Copy translations
- Integrate into Carro hero + wizard brand step

### Task 6: Build, test, commit & push both projects
