export const eventConfig = {
  name: "Juan Alexander",
  displayName: "Juan Alexander",
  title: "Wild One",
  age: 1,
  startsAt: "2026-09-26T13:00:00-06:00",
  provisionalEnd: "2026-09-26T16:00:00-06:00",
  timeZone: "America/El_Salvador",
  date: { en: "September 26 · 2026", es: "26 de septiembre · 2026" },
  time: "1:00 PM",
  address: {
    street: "Lotificación Castilla, lote #13, Polígono V",
    city: "San Miguel",
    region: "",
    postalCode: "",
    country: "El Salvador",
    full: "Lotificación Castilla, lote #13, Polígono V, San Miguel, El Salvador",
  },
  whatsapp: "",
  journeyVersion: "juan-alexander-official-v1",
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
  google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Juan Alexander — Wild One")}&dates=20260926T190000Z/20260926T220000Z&ctz=America%2FEl_Salvador&details=${encodeURIComponent("Juan Alexander te invita a celebrar su primer año de aventuras.")}&location=${query}`,
  outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent("Juan Alexander — Wild One")}&startdt=2026-09-26T13%3A00%3A00-06%3A00&enddt=2026-09-26T16%3A00%3A00-06%3A00&location=${query}`,
};
