import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolyCloud | Your business, on autopilot.",
  description: "Automation infrastructure for modern operators. Systems that run workflows, campaigns, and customer interactions at machine speed — so you scale output, not headcount.",
  metadataBase: new URL("https://polycloud.in"),
  openGraph: {
    title: "PolyCloud | Your business, on autopilot.",
    description: "Automation infrastructure for modern operators. Scale output, not headcount.",
    type: "website",
    url: "https://polycloud.in",
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
