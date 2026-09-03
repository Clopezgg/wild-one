# Alexis Alessandro — Wild One

Personalized real-time 3D first-birthday safari journey for Alexis Alessandro.

## Live production
https://alexis-wild-one-guided-safari-v4.vercel.app

## Event
- September 20, 2026
- 5:00 PM (America/New_York)
- 581 Kathy Lane, Margate, FL 33068
- RSVP WhatsApp: +1 (754) 610-6574

## Current experience
**V4 — Guided Safari Journey**

The visual reference is the bright organic safari-party installation: sage / cream / sand / caramel balloons, giraffe-print balloons, lush leaves, foreground animals, cake, gifts and a physical celebration stage. The V4 turns that party installation into an explorable WebGL world instead of a landing page.

## V4 highlights
- Real-time WebGL / Three.js world visible from the first frame
- Organic 3D balloon portal with varied scale and giraffe-print materials
- 3D party stage, tropical backdrop, cake, flame, gifts, signage and camp objects
- Real GLB safari animals inside the environment
- Persistent animal companion assignment per browser/device
- Seven routes: Lion, Elephant, Giraffe, Monkey, Parrot, Wild Cat and Zebra
- The assigned animal is rendered as an actual 3D model in the reveal, HUD, hero identity and Safari Pass
- A companion animal model physically travels ahead of the camera through the jungle route
- Route-specific names and colors such as Sky Trail, Pride Trail and Memory Trail
- Curved golden 3D expedition path through multiple stations
- Interactive 3D expedition map with current-position marker and unlocked stations
- Destination links for Google Maps, Apple Maps and Waze
- Safari Chic camp integrated into the route
- Calendar observatory with Apple / ICS, Google Calendar and Outlook
- Countdown temple
- RSVP outpost backed by Supabase
- Three Golden Leaves exist as clickable 3D objects inside the world
- Golden Explorer upgrade when all three leaves are discovered
- Personalized Safari Pass with the actual 3D animal, role, route and RSVP status
- Shareable Safari Pass image using the rendered animal
- Bilingual EN / ES browser-language detection with manual switch
- Safari ambience and generative musical layer
- Warm daylight lighting, fog, bloom, moving foliage, butterflies and pollen particles
- Mobile-first rendering optimized for iPhone

## Persistence
The browser stores a random guest token and the assigned safari animal in local storage. Returning from the same browser preserves the animal, route, collected Golden Leaves, guest name and RSVP state.

## Supabase
RSVP responses are stored in `public.wild_one_rsvps`. V4 records can include `animal_key`, `animal_role`, `guest_token`, `route_name`, `golden_leaves` and `journey_version`. Public clients can insert RSVP records but cannot read other guests' responses.

## Source
The production V4 bundle is `public/v4/index.html`. `app/page.tsx` redirects the root Next.js route to `/v4/index.html`. The V3 React implementation remains under `components/` as the previous iteration.
