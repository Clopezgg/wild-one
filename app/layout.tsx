import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { eventConfig } from "@/lib/eventConfig";
import "./globals.css";
import "./premium.css";
import "./official.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700"], display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const analyticsEnabled = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: "Juan Alexander — Wild One",
  description: "Juan Alexander te invita a celebrar su primer cumpleaños el 26 de septiembre de 2026 a la 1:00 PM en San Miguel, El Salvador.",
  metadataBase: new URL(eventConfig.canonicalUrl),
  applicationName: "Juan Alexander — Wild One",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon", apple: "/icon" },
  openGraph: {
    title: "Juan Alexander — Wild One",
    description: "Una aventura safari para celebrar el primer cumpleaños de Juan Alexander · 26 de septiembre de 2026 · San Miguel, El Salvador.",
    type: "website",
    images: [{ url: "/images/og-safari.webp", width: 1200, height: 630, alt: "Juan Alexander Wild One safari celebration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan Alexander — Wild One",
    description: "Te invito a celebrar mi primer año de aventuras.",
    images: ["/images/og-safari.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#183f2d", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        {children}
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
