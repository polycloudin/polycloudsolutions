import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import EcommerceMockup from "../../components/EcommerceMockup";
import MockupLightbox from "../../components/MockupLightbox";

export const metadata: Metadata = {
  title: "D2C solutions — Storefronts, ads, WhatsApp post-purchase",
  description:
    "Full-funnel growth for D2C brands: Next.js storefront, Meta + Google ads, WhatsApp post-purchase flows, attribution pipelines, CRM automation.",
  alternates: { canonical: "/solutions/d2c" },
  keywords: [
    "D2C ecommerce agency India",
    "Shopify alternative Next.js",
    "WhatsApp Business D2C",
    "D2C attribution",
    "Meta ads D2C",
  ],
};

const pillars = [
  {
    num: "01",
    name: "Storefront",
    tagline: "Next.js or Shopify, fast and owned.",
    body: "Product catalog, cart, checkout, payment gateway (Razorpay + Stripe), CMS for merchandising. Mobile-first, under 2s LCP, SEO-clean.",
  },
  {
    num: "02",
    name: "Paid acquisition",
    tagline: "Meta + Google, managed monthly.",
    body: "Campaign setup, creative refresh, audience targeting, A/B testing, retargeting, weekly optimization. Ad spend paid directly to platforms.",
  },
  {
    num: "03",
    name: "WhatsApp post-purchase",
    tagline: "Order confirmation → review → reorder.",
    body: "Confirmation, shipping updates, review requests, restock alerts, birthday offers — all on WhatsApp Business API. Industry benchmark: 25-40% reorder lift on post-purchase messaging flows.",
  },
  {
    num: "04",
    name: "Attribution + reports",
    tagline: "One dashboard. Every channel. No noise.",
    body: "Meta + Google Ads + GA4 + WhatsApp events stitched into a single attribution model. Monthly report with what worked, what didn't, and next month's plan.",
  },
];

const outcomes = [
  { stat: "3.2×", label: "Average return on ad spend", sub: "measured on live dashboards" },
  { stat: "25-40%", label: "Reorder lift benchmark", sub: "from WhatsApp post-purchase flows" },
  { stat: "2–6 weeks", label: "Launch to live storefront", sub: "depending on catalog size" },
];

export default function D2C() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Solution · D2C</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,9rem)] mb-10 max-w-[1250px] leading-[0.95]">
            From ad-click to{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">repeat purchase</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Full-funnel D2C: storefront that ships in weeks, paid acquisition that pays back, WhatsApp post-purchase that turns first-time buyers into repeat customers, and an attribution pipeline that tells you which ad rupee actually worked.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">Book a discovery call ↗</BookButton>
              <Link href="#pricing" className="btn-secondary">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">Typical outcomes</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {outcomes.map((o) => (
              <div key={o.label} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3rem,7vw,5.5rem)] leading-none mb-4">{o.stat}</div>
                <p className="text-[var(--color-text)] font-medium text-[15px] mb-1">{o.label}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] uppercase">{o.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / The stack</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl leading-[1]">
                Four <span className="text-serif-accent">pillars</span>. One system.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Each pillar ships as a standalone. Together, they replace a 5-person growth team's worth of output.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {pillars.map((p) => (
              <div key={p.num} className="bg-white p-10 md:p-12 hover:bg-[var(--color-surface)] transition-colors">
                <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{p.num}</p>
                <h3 className="text-display text-[clamp(1.5rem,2.3vw,2rem)] mb-3 leading-tight">{p.name}</h3>
                <p className="text-display text-serif-accent text-[var(--color-primary-blue)] text-[clamp(1rem,1.3vw,1.15rem)] mb-5">
                  {p.tagline}
                </p>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / The system</p>
              <h2 className="text-[clamp(2rem,5vw,4rem)] max-w-2xl leading-[1]">
                Storefront → <span className="text-serif-accent text-[var(--color-primary-blue)]">WhatsApp</span>. One system.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Product catalog on your domain. Checkout on Razorpay. Post-purchase entirely on WhatsApp Business API — confirmation, tracking, review, reorder nudge, all automated.
            </p>
          </div>
          <MockupLightbox caption="D2C storefront + WhatsApp post-purchase flow · click to expand">
            <EcommerceMockup />
          </MockupLightbox>
          <p className="mt-6 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
            ILLUSTRATIVE — real builds ship with your brand system, product catalog, and inventory integration.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Pricing</p>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] mb-14 leading-[1]">
            Launch for <span className="text-serif-accent">₹1.5L</span>. Run for <span className="text-serif-accent">₹32K/mo</span>.
          </h2>
          <div
            style={{ backgroundColor: "#0A0A0A" }}
            className="rounded-xl p-10 md:p-14 text-white relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(244, 107, 44, 0.25) 0%, transparent 60%)",
              }}
            />
            <div className="relative grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
              <div>
                <p className="text-eyebrow text-white/50 mb-5">Growth bundle</p>
                <p className="text-display text-[clamp(2.5rem,5vw,4rem)] leading-none mb-3">₹1,50,000</p>
                <p className="mono text-sm text-white/60 tracking-[0.1em] mb-3">one-time build</p>
                <p className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-3">+ ₹32,000</p>
                <p className="mono text-sm text-white/60 tracking-[0.1em] mb-10">per month · ongoing</p>
                <BookButton variant="light-primary">Start a D2C engagement ↗</BookButton>
              </div>
              <div>
                <p className="text-eyebrow text-white/50 mb-5">Includes</p>
                <ul className="space-y-3">
                  {[
                    "Advanced storefront (up to 15 pages) with CMS and blog",
                    "Domain + hosting + SSL + business email (first year included)",
                    "Google + Meta (FB/Instagram) ad management",
                    "WhatsApp Business post-purchase flows",
                    "Email marketing with automated nurture sequence",
                    "CRM integration + lead-to-customer tracking",
                    "4 blog posts per month + 8 social ad captions",
                    "Monthly performance report with insights",
                  ].map((inc) => (
                    <li key={inc} className="text-white/80 text-[14px] leading-relaxed flex gap-3">
                      <span className="text-[var(--color-primary-orange)]">—</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[var(--color-text-muted)] text-[13px]">
            Ad spend paid directly to platforms. Prices exclusive of GST. Larger catalogs or custom scopes land in the Total Growth bundle (₹3L + ₹65K/mo).
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Next step</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Your storefront in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">2-6 weeks</span>.
          </h2>
          <BookButton variant="light-primary">Book a discovery call ↗</BookButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <BookButton variant="primary" className="!py-2 !px-4 !text-[13px]">Book a call</BookButton>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-10 py-14 bg-[var(--color-ink)] border-t border-white/10 text-white/60">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-display text-lg text-white">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </span>
          <span className="text-white/30">·</span>
          <span>© 2026 · Est. 2020</span>
        </div>
        <div className="flex gap-8">
          <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
          <Link href="/consulting" className="hover:text-white transition-colors">Consulting</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
