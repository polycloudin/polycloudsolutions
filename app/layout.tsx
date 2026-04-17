import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://polycloud.in";
const SITE_NAME = "PolyCloud";
const SITE_TAGLINE = "Your business, on autopilot.";
// Short — Google meta description (opening hook of the manifesto)
const SITE_DESCRIPTION =
  "Polycloud is a firm built on a simple idea: most companies don't need another tool — they need the work done.";
// Long — full manifesto for OpenGraph / social shares
const SITE_MANIFESTO =
  "Most companies don't need another tool — they need the work done. PolyCloud sits with operators to find where time, money, or attention is leaking, then designs, builds, and runs the fix end-to-end. ML models, deep-research agents, data pipelines, workflow automation, dashboards, digital marketing — whatever the job needs. You get the outcome. We handle everything behind it.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AI automation",
    "digital agency India",
    "AI consulting",
    "GST automation",
    "CA firm automation",
    "WhatsApp Business automation",
    "website development Hyderabad",
    "AI integration",
    "Google Ads agency",
    "Meta ads agency",
    "business automation India",
    "digital marketing Hyderabad",
    "AI employee",
    "workflow automation",
    "GSTR-2B reconciliation",
  ],
  authors: [{ name: "PolyCloud Solutions LLP" }],
  creator: "PolyCloud",
  publisher: "PolyCloud Solutions LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_MANIFESTO,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_MANIFESTO,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "technology",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PolyCloud Solutions LLP",
  alternateName: "PolyCloud",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE_DESCRIPTION,
  slogan: SITE_TAGLINE,
  foundingDate: "2020",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@polycloud.in",
    contactType: "Customer Support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: ["https://github.com/polycloudin"],
  knowsAbout: [
    "AI Automation",
    "Digital Marketing",
    "AI Consulting",
    "GST Compliance Automation",
    "WhatsApp Business Automation",
    "CA Firm Automation",
    "Workflow Automation",
    "Finance Technology",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "PolyCloud Solutions LLP",
  image: `${SITE_URL}/opengraph-image`,
  url: SITE_URL,
  telephone: "",
  email: "hello@polycloud.in",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.385,
    longitude: 78.4867,
  },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "City", name: "Hyderabad" },
    { "@type": "City", name: "Bangalore" },
    { "@type": "City", name: "Mumbai" },
    { "@type": "City", name: "Delhi" },
    { "@type": "City", name: "Chennai" },
  ],
  serviceType: [
    "AI Automation",
    "Digital Marketing",
    "AI Consulting",
    "GST Automation",
    "Website Development",
    "Workflow Automation",
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "19:00",
  },
  foundingDate: "2020",
  slogan: SITE_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}
