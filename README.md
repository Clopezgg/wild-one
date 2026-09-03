# Alexis Alessandro — Wild One

Premium bilingual first-birthday invitation experience for Alexis Alessandro.

## Event
- September 20, 2026
- 5:00 PM (America/New_York)
- 581 Kathy Lane, Margate, FL 33068
- RSVP WhatsApp: +1 (754) 610-6574

## Experience
- Cinematic jungle entry gate
- Browser-language detection with EN/ES switch
- Procedural safari ambience with no external audio dependency
- Animated Wild One hero
- Temporary safari imagery ready to be replaced by Alexis' real photos
- Event details and Google Maps navigation
- Safari Chic dress-code palette
- Live countdown
- RSVP stored in Supabase with RLS
- Personalized Safari Pass after confirmation
- WhatsApp fallback confirmation
- Optional gift note
- Responsive mobile-first layout with reduced-motion support

## Stack
- Next.js
- React
- TypeScript
- Supabase REST + Row Level Security
- Vercel

## Supabase
The RSVP table is `public.wild_one_rsvps`. Public clients can insert valid RSVP responses only. They cannot read, update, or delete guest responses.

## Photos
The three current safari photos are temporary placeholders. Replace the URLs in `components/InvitationExperience.tsx` with Alexis' real photos when available.

## Development
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npm start
```
