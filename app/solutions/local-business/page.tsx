import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";

export const metadata: Metadata = {
  title: "Local business — Websites, Google, WhatsApp, done",
  description:
    "Everything a local business needs to show up online and stay booked: website, Google Business Profile, Google Ads for local search, WhatsApp chat, monthly reports. From ₹70K.",
  alternates: { canonical: "/solutions/local-business" },
  keywords: [
    "local business website India",
    "Google Business Profile Hyderabad",
    "WhatsApp Business for clinic salon restaurant",
    "local SEO India",
    "small business website design",
  ],
};

const deliverables = [
  {
    num: "01",
    name: "Your website",
    tagline: "Professional, fast, and fully yours.",
    body: "Up to 8 pages with professional copy, custom visuals, mobile-responsive, on-page SEO, analytics, SSL, and a contact form wired to WhatsApp. Most launches in 2–3 weeks.",
  },
  {
    num: "02",
    name: "Google Business Profile",
    tagline: "Show up when they search your service.",
    body: "Full setup, categories, hours, photos, review templates, and ongoing optimization. The single biggest lever for walk-ins from search.",
  },
  {
    num: "03",
    name: "Google Ads for local search",
    tagline: "₹ad-in, ₹revenue-out — managed monthly.",
    body: "Search ads targeting your exact services + area. Weekly optimization, keyword expansion, and transparent monthly reports. Ad spend starts at ₹20K/mo.",
  },
  {
    num: "04",
    name: "WhatsApp click-to-chat + smart chatbot",
    tagline: "Every inquiry answered, every appointment captured.",
    body: "One-click WhatsApp button on the site, a smart chatbot for after-hours enquiries, and flows for appointment booking + confirmation.",
  },
];

const outcomes = [
  { stat: "2–3", label: "Weeks to launch", sub: "from handshake to live site" },
  { stat: "24/7", label: "Customer response", sub: "chatbot + WhatsApp flow" },
  { stat: "1 report", label: "Every month", sub: "what worked, what didn't, what's next" },
];

const industries = ["Clinics", "Salons", "Restaurants", "Interior studios", "Law firms", "Landscaping", "Coaching centres", "Boutiques"];

export default function LocalBusiness() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(244, 107, 44, 0.05) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Solution · Local business</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,9rem)] mb-10 max-w-[1250px] leading-[0.95]">
            Your local business, online and{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">booked</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Website, Google Business Profile, local search ads, and WhatsApp chat — one bundle, one monthly fee, one team. Built for clinics, salons, restaurants, interior studios, and every other service business that gets discovered on Google and booked on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">Book a discovery call ↗</BookButton>
              <Link href="#pricing" className="btn-secondary">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries strip */}
      <section className="px-6 md:px-10 py-10 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-eyebrow text-[var(--color-text-secondary)]">Who we build for</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-ink)]/80">
            {industries.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">What you get</p>
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

      {/* Deliverables */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / The bundle</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl leading-[1]">
                Four pieces. <span className="text-serif-accent">One fee</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Bought separately, these cost more and coordinate worse. Bundled, they ship as one system and report on one dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {deliverables.map((d) => (
              <div key={d.num} className="bg-white p-10 md:p-12 hover:bg-[var(--color-surface)] transition-colors">
                <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{d.num}</p>
                <h3 className="text-display text-[clamp(1.5rem,2.3vw,2rem)] mb-3 leading-tight">{d.name}</h3>
                <p className="text-display text-serif-accent text-[var(--color-primary-blue)] text-[clamp(1rem,1.3vw,1.15rem)] mb-5">
                  {d.tagline}
                </p>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-10 py-24 md:py-32 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Pricing</p>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] mb-14 leading-[1]">
            Launch for <span className="text-serif-accent">₹70K</span>. Run for <span className="text-serif-accent">₹12K/mo</span>.
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
                <p className="text-eyebrow text-white/50 mb-5">Local Starter bundle</p>
                <p className="text-display text-[clamp(2.5rem,5vw,4rem)] leading-none mb-3">₹70,000</p>
                <p className="mono text-sm text-white/60 tracking-[0.1em] mb-3">one-time build</p>
                <p className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-3">+ ₹12,000</p>
                <p className="mono text-sm text-white/60 tracking-[0.1em] mb-10">per month · ongoing</p>
                <BookButton variant="light-primary">Start this bundle ↗</BookButton>
              </div>
              <div>
                <p className="text-eyebrow text-white/50 mb-5">Includes</p>
                <ul className="space-y-3">
                  {[
                    "Business website (up to 8 pages) with professional content & visuals",
                    "Domain + hosting + SSL (first year included)",
                    "Google Business Profile setup + optimization",
                    "Google Ads management for local search",
                    "Smart chatbot for enquiries and appointments",
                    "WhatsApp click-to-chat + templated response flows",
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
            Ad spend paid directly to Google. Prices exclusive of GST. If you need a bigger site, CRM, or creative production monthly, move up to the Growth bundle (₹1.5L + ₹32K/mo).
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
          <p className="text-eyebrow text-white/50 mb-8">Get online</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Live in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">two weeks</span>.
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
