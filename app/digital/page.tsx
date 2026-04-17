import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital — Productized automation | PolyCloud",
  description:
    "Growth systems that ship in weeks, not quarters. Websites, paid acquisition, messaging automation, CRM infrastructure — built and run by PolyCloud.",
};

const tiers = [
  {
    name: "Starter",
    subtitle: "For teams shipping their first growth systems",
    price: "₹5,000",
    cadence: "per month",
    includes: [
      "Business website (single-page, production-ready)",
      "Messaging automation (WhatsApp Business + templated flows)",
      "Analytics instrumentation (GA4, conversion events)",
      "Monthly content refresh & SEO baseline",
      "Email support, 48-hour response",
    ],
    cta: "Book an intro",
  },
  {
    name: "Growth",
    subtitle: "For teams ready to compound paid + organic",
    price: "₹12,000",
    cadence: "per month",
    featured: true,
    includes: [
      "Everything in Starter",
      "Multi-page marketing site with CMS",
      "Paid acquisition management (Meta + Google)",
      "AI-powered lead qualification and routing",
      "CRM integration and workflow automation",
      "Weekly performance reports",
      "Priority support, 12-hour response",
    ],
    cta: "Book a planning call",
  },
  {
    name: "Platform",
    subtitle: "For operators running multi-channel ops",
    price: "₹25,000",
    cadence: "per month",
    includes: [
      "Everything in Growth",
      "Custom AI agent build (support, sales, or ops)",
      "Advanced attribution and cohort analytics",
      "Bespoke dashboard on PolyCloud JARVIS",
      "Integration engineering (Tally, Zoho, Shopify, Stripe)",
      "Fortnightly strategy reviews",
      "Dedicated Slack channel, 4-hour response",
    ],
    cta: "Schedule a technical review",
  },
];

const outcomes = [
  { metric: "3.2×", label: "Average return on paid acquisition spend" },
  { metric: "14 days", label: "From engagement to first system shipped" },
  { metric: "72%", label: "Reduction in time-to-respond on inbound" },
];

export default function Digital() {
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
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Digital — Productized</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,8.5rem)] mb-10 max-w-[1200px] leading-[0.95]">
            Growth systems that <span className="text-serif-accent text-[var(--color-primary-blue)]">ship</span>{" "}
            in weeks.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Productized engagements that collapse the discovery-to-launch cycle. You get websites that convert, ads that return, messaging that responds, and analytics that explain why — delivered as infrastructure, not deliverables.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://cal.com/polycloud/intro" className="btn-primary">
                Book a call ↗
              </a>
              <Link href="#tiers" className="btn-secondary">
                See tiers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-6 md:px-10 py-20 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-14">Typical outcomes</p>
          <div className="grid md:grid-cols-3 gap-10">
            {outcomes.map((o, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none mb-4">{o.metric}</div>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Engagement tiers</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Three tiers. One <span className="text-serif-accent">standard</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Each tier is a complete system, not a feature list. Upgrade when the system outgrows the scope — not before.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <div
                key={i}
                style={
                  t.featured
                    ? { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A", color: "white" }
                    : {}
                }
                className={`card-hover rounded-xl border p-10 flex flex-col ${
                  t.featured ? "" : "bg-white border-[var(--color-line)]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p
                    className="text-eyebrow"
                    style={{ color: t.featured ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                  >
                    {t.name}
                  </p>
                  {t.featured && (
                    <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-[var(--color-primary-orange)]">
                      Most common
                    </span>
                  )}
                </div>
                <h3
                  className="text-[clamp(1.75rem,3vw,2.5rem)] mb-8 leading-tight"
                  style={{ color: t.featured ? "white" : "inherit" }}
                >
                  {t.subtitle}
                </h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-display text-4xl md:text-5xl">{t.price}</span>
                  <span
                    className="text-sm"
                    style={{ color: t.featured ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                  >
                    {t.cadence}
                  </span>
                </div>
                <ul
                  className="space-y-3 mb-10 flex-1"
                  style={{ color: t.featured ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)" }}
                >
                  {t.includes.map((inc, j) => (
                    <li key={j} className="text-[14px] leading-relaxed flex gap-3">
                      <span style={{ color: t.featured ? "var(--color-primary-orange)" : "var(--color-primary-blue)" }}>
                        —
                      </span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://cal.com/polycloud/intro"
                  className={t.featured ? "btn-primary !bg-white !text-[var(--color-ink)] !border-white" : "btn-primary"}
                >
                  {t.cta} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-36 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 100%, rgba(26, 95, 212, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Next step</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Pick the system, not the <span className="text-serif-accent text-[var(--color-primary-orange)]">pitch</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            A 15-minute call diagnoses which tier fits, what to ship first, and where the real compounding happens. No sales deck. No scope creep.
          </p>
          <a
            href="https://cal.com/polycloud/intro"
            className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
          >
            Book a call ↗
          </a>
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
          <Link href="/digital" className="link-underline text-[var(--color-ink)] font-medium">Digital</Link>
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <a href="https://cal.com/polycloud/intro" className="btn-primary !py-2 !px-4 !text-[13px]">
            Book a call
          </a>
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
