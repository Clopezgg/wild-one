# Alexis Alessandro — Wild One

A bilingual, mobile-first living safari invitation for Alexis Alessandro’s first birthday.

## Production

Canonical production: `https://alexis-wild-one-guided-safari-v4.vercel.app`

Event details are centralized in `lib/eventConfig.ts`:

- September 20, 2026
- 5:00 PM, America/New_York
- 581 Kathy Lane, Margate, FL 33068, USA
- RSVP: +1 754 610 6574

The public end time is intentionally not displayed. `provisionalEnd` is isolated for calendar formats that require `DTEND`.

## Architecture

- Next.js App Router with a real Vercel build; no HTML loader or GitHub runtime dependency.
- One React Three Fiber Canvas and one WebGL context control the camera, lighting, world, companions, particles, quest objects and finale.
- A journey state machine maps visible stations to choreographed camera stops rather than mapping raw scroll position to camera depth.
- Seven coherent procedural soft-sculpture animals are built from smooth production geometry in `components/safari/SoftSafariAnimals.tsx`.
- The 2D fallback is present before hydration and remains the full experience if WebGL is unavailable or lost.
- HTML controls provide accessible equivalents for date, time, maps, calendar and RSVP.

## Personalization

`GET /api/expedition` creates a cryptographically random opaque cookie. Supabase stores only its SHA-256 digest. The assigned animal, role and route remain stable on return. Local storage mirrors the guest’s non-secret journey state for instant recovery during temporary network failures.

The private Explorer Code can move an expedition to another device without putting a guest name in a URL. Recovery rotates the opaque token and invalidates the prior device token.

## Supabase

Project: `sqchlnhkceztcznkjctg`

- Existing `public.wild_one_rsvps` data is preserved.
- `public.wild_one_guest_expeditions` stores private identity and quest state.
- RLS is enabled and forced. `anon` and `authenticated` have no table grants and an explicit deny policy. Only server credentials may access expedition records.
- Migration files are under `supabase/migrations/` and match the applied production migrations.

Required Vercel variables:

```text
SUPABASE_URL=https://sqchlnhkceztcznkjctg.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SUPABASE_URL=https://sqchlnhkceztcznkjctg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://alexis-wild-one-guided-safari-v4.vercel.app
```

The secret key is server-only. Never prefix it with `NEXT_PUBLIC_`.

## Assets and sound

- `public/images/safari-world.webp`: original project-specific art used for progressive first paint and WebGL fallback.
- `public/images/og-safari.webp`: local crop of that artwork for social previews.
- `public/audio/`: original locally generated soundscape and event stingers. Audio begins only after the entry gesture.
- Asset provenance and licenses are documented in `public/ASSET_LICENSES.md`.

No production asset loads from raw.githubusercontent.com, jsDelivr, Google Actions or a model CDN.

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright covers Chromium and WebKit at iPhone dimensions plus desktop Chromium. The suite includes entry, language switching, map, RSVP/fallback, returning identity, reduced motion and WebGL fallback.

## Updating the event

Edit only `lib/eventConfig.ts` for the public name, date, time, location, WhatsApp number and canonical URL. Keep `provisionalEnd` private unless the real end time is confirmed.

## Updating music or animals

- Replace audio files in `public/audio/` without changing their filenames, then update `public/ASSET_LICENSES.md`.
- Character materials, proportions and animation are centralized in `components/safari/SoftSafariAnimals.tsx`.
- Route palette and terrain assignment are centralized in `lib/safariRoles.ts`.
