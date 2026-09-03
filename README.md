# Alexis Alessandro — Wild One

Personalized real-time 3D first-birthday invitation experience for Alexis Alessandro.

## Live production
https://alexis-wild-one-magical-safari-v3.vercel.app

## Event
- September 20, 2026
- 5:00 PM (America/New_York)
- 581 Kathy Lane, Margate, FL 33068
- RSVP WhatsApp: +1 (754) 610-6574

## Current art direction
**Daylight Magical Safari — Wild One V3**

The visual reference is the bright organic safari-party installation: sage / cream / sand / caramel balloons, giraffe-print balloons, lush leaves, foreground animals, cake, gifts and a physical celebration stage. The experience is intentionally bright, playful, dimensional and premium rather than dark or ceremonial.

## Experience
- Real-time WebGL / Three.js world visible from the first screen
- Organic 3D balloon arch with varied scale and giraffe-print materials
- 3D party stage, tropical backdrop, cake, candle flame and gifts
- Real GLB safari animals placed inside the environment
- Camera physically travels through the world as the guest scrolls
- Warm daylight lighting, fog, shadows, moving foliage and firefly particles
- Browser-language detection with EN / ES switch
- Persistent guest identity stored locally
- Deterministic animal companion assignment per device
- Six safari identities and roles: Lion, Elephant, Giraffe, Monkey, Parrot and Wild Cat
- Personalized role reveal and role-colored UI accents
- Three hidden Golden Leaves to discover throughout the expedition
- Golden Explorer upgrade when all leaves are found
- Live countdown
- Google Maps route
- Add to Apple Calendar / ICS, Google Calendar and Outlook
- Supabase-backed RSVP
- RSVP records include animal key, animal role and guest token
- Personalized Safari Pass after confirmation
- Native share action for the guest's safari identity
- WhatsApp confirmation fallback
- Mobile-first presentation optimized for iPhone

## Persistence
The browser stores a random guest token and the assigned safari animal in local storage. Returning on the same browser preserves the guest's animal identity and collected Golden Leaves. The guest name and RSVP status are also remembered locally after successful confirmation.

## Supabase
RSVP responses are stored in `public.wild_one_rsvps`. The V3 schema extends each RSVP with optional `animal_key`, `animal_role` and `guest_token` fields. Public clients can insert RSVP records but cannot read other guests' responses.

## Source
The Next.js V3 source is under `components/MagicalSafari3D.tsx` and `components/MagicalSafari.module.css`; `app/page.tsx` points to the V3 experience.
