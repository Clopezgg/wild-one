export const eventConfig = {
  name: "Alexis Alessandro Lopez",
  displayName: "Alexis Alessandro",
  title: "Wild One",
  age: 1,
  startsAt: "2026-09-20T17:00:00-04:00",
  provisionalEnd: "2026-09-20T20:00:00-04:00",
  timeZone: "America/New_York",
  date: { en: "September 20 · 2026", es: "20 de septiembre · 2026" },
  time: "5:00 PM",
  address: {
    street: "581 Kathy Lane",
    city: "Margate",
    region: "FL",
    postalCode: "33068",
    country: "USA",
    full: "581 Kathy Lane, Margate, FL 33068, USA",
  },
  whatsapp: "17546106574",
  journeyVersion: "living-safari-v5",
  canonicalUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
} as const;

const query = encodeURIComponent(eventConfig.address.full);

export const destinationLinks = {
  google: `https://www.google.com/maps/search/?api=1&query=${query}`,
  apple: `https://maps.apple.com/?q=${query}`,
  waze: `https://waze.com/ul?q=${query}&navigate=yes`,
};

export const calendarLinks = {
  google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Alexis Alessandro — Wild One")}&dates=20260920T210000Z/20260921T000000Z&ctz=America%2FNew_York&details=${encodeURIComponent("A daylight magical safari celebration.")}&location=${query}`,
  outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent("Alexis Alessandro — Wild One")}&startdt=2026-09-20T17%3A00%3A00-04%3A00&enddt=2026-09-20T20%3A00%3A00-04%3A00&location=${query}`,
};

