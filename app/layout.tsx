import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexis Alessandro — Wild One",
  description: "A wild first birthday adventure for Alexis Alessandro — September 20, 2026 in Margate, Florida.",
  metadataBase: new URL("https://wild-one-chumbertolgz-7444.vercel.app"),
  openGraph: {
    title: "Alexis Alessandro — Wild One",
    description: "Our little explorer is turning one. Join the adventure on September 20, 2026.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexis Alessandro — Wild One",
    description: "Our little explorer is turning one. Join the adventure.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
