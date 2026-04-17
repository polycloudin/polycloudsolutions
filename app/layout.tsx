import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolyCloud Solutions | Your Business, On Autopilot",
  description: "Digital automation and AI consulting for small businesses and enterprises. Increase revenue, save time, reduce costs.",
  metadataBase: new URL("https://polycloudsolutions.com"),
  openGraph: {
    title: "PolyCloud Solutions | Your Business, On Autopilot",
    description: "Digital automation and AI consulting for small businesses and enterprises.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}
