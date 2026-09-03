import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexis Alessandro — Wild One: The Forbidden Safari",
  description: "A cinematic exotic-fantasy first birthday experience for Alexis Alessandro — September 20, 2026 in Margate, Florida.",
  metadataBase: new URL("https://alexis-wild-one-cinematic.vercel.app"),
  openGraph: {
    title: "Alexis Alessandro — Wild One",
    description: "Enter The Forbidden Safari. September 20, 2026 · Margate, Florida.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexis Alessandro — Wild One",
    description: "Enter The Forbidden Safari.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
