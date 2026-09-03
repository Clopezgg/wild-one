import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { eventConfig } from "@/lib/eventConfig";
import "./globals.css";
import "./premium.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700"], display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Alexis Alessandro — Wild One",
  description: "Enter Alexis Alessandro’s living safari world — September 20, 2026 in Margate, Florida.",
  metadataBase: new URL(eventConfig.canonicalUrl),
  applicationName: "Alexis Alessandro — Wild One",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon", apple: "/icon" },
  openGraph: {
    title: "Alexis Alessandro — Wild One",
    description: "A living safari invitation. September 20, 2026 · Margate, Florida.",
    type: "website",
    images: [{ url: "/images/og-safari.webp", width: 1200, height: 630, alt: "Alexis Alessandro Wild One safari celebration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexis Alessandro — Wild One",
    description: "A living safari invitation.",
    images: ["/images/og-safari.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#173b2c", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
