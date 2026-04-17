import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import ProjectCard from "../components/ProjectCard";
import { featuredProjects } from "../work/projects";

export const metadata: Metadata = {
  title: "Digital — Websites, ads, automation | PolyCloud",
  description:
    "Websites, digital marketing, and business automation. Built and run by PolyCloud. Pre-configured bundles or fully custom scopes.",
};

const bundles = [
  {
    name: "Local Starter",
    tagline: "Restaurants, salons, clinics, local services",
    oneTime: "₹70,000",
    monthly: "₹12,000",
    notice: "+ ad spend paid directly to platforms",
    includes: [
      "Business website (up to 8 pages) with professional content & visuals",
      "Domain + Hosting + SSL (first year included)",
      "Google Business Profile setup & optimization",
      "Google Ads management for local search",
      "Smart chatbot for enquiries and appointments",
      "WhatsApp click-to-chat integration",
      "Monthly performance report",
    ],
  },
  {
    name: "Growth",
    tagline: "Coaching centres, agencies, B2B firms, professional services",
    oneTime: "₹1,50,000",
    monthly: "₹32,000",
    notice: "+ ad spend paid to platforms",
    featured: true,
    includes: [
      "Advanced website (up to 15 pages) with blog",
      "Domain + Hosting + SSL + Business Email (first year included)",
      "Google Ads + Meta (Facebook/Instagram) management",
      "Smart chatbot trained on your business",
      "Email marketing setup + automated nurture sequence",
      "CRM integration with lead capture",
      "4 blog posts/month + 8 social ad captions",
      "Monthly performance report with insights",
    ],
  },
  {
    name: "Total Growth",
    tagline: "Businesses that want everything handled end-to-end",
    oneTime: "₹3,00,000",
    monthly: "₹65,000",
    notice: "+ ad spend paid to platforms",
    includes: [
      "Advanced or E-Commerce website, fully custom",
      "Domain + Hosting + SSL + Business Email (first year included)",
      "Google Ads + Meta with cross-platform strategy",
      "SEO with monthly blog content and backlinks",
      "Smart chatbot for enquiries, lead capture, and support",
      "WhatsApp Business with automated flows and broadcasts",
      "Email marketing: welcome, nurture, re-engagement sequences",
      "CRM with lead scoring and pipeline automation",
      "Branded graphics and video ads (monthly)",
      "Google Business Profile management",
      "Monthly performance report with competitor insights",
      "Quarterly strategy review call",
    ],
  },
];

const websiteTiers = [
  {
    type: "Business Website",
    ideal: "Local businesses, freelancers, consultants",
    features: "5–10 pages · Contact forms · Google Maps",
    price: "From ₹30,000",
  },
  {
    type: "Advanced Website",
    ideal: "Growing businesses, multi-location, service firms",
    features: "10–25 pages · Blog · Booking · Dashboards",
    price: "From ₹60,000",
  },
  {
    type: "E-Commerce Store",
    ideal: "Product businesses, D2C brands, online retail",
    features: "Product catalog · Payments · Inventory · Orders",
    price: "From ₹1,00,000",
  },
  {
    type: "Custom Web App",
    ideal: "SaaS products, portals, internal tools",
    features: "Custom features · User accounts · APIs · Admin panels",
    price: "From ₹2,50,000",
  },
];

const marketingServices = [
  {
    service: "Google Ads",
    detail: "Search, Display, and Performance Max campaigns. Keyword research, ad copy, tracking, weekly optimization.",
    fee: "₹8,000 – 25,000/mo",
    minSpend: "Min. ad spend ₹20,000/mo",
  },
  {
    service: "Meta Ads",
    detail: "Facebook + Instagram paid campaigns. Creatives, audience targeting, retargeting, A/B testing.",
    fee: "₹8,000 – 20,000/mo",
    minSpend: "Min. ad spend ₹15,000/mo",
  },
  {
    service: "Google + Meta",
    detail: "Cross-platform campaigns, unified strategy. Combined reporting, cross-channel retargeting.",
    fee: "₹15,000 – 35,000/mo",
    minSpend: "Min. ad spend ₹30,000/mo",
  },
  {
    service: "SEO",
    detail: "Rank organically on Google. Technical SEO, blog content, backlinks, rank tracking.",
    fee: "₹15,000 – 40,000/mo",
    minSpend: "—",
  },
];

const addOns = [
  { name: "Smart Chatbot", price: "₹15–40K setup · ₹5–15K/mo" },
  { name: "Content Writing", price: "₹8–25K/mo" },
  { name: "Creative Studio", price: "₹5–30K/mo" },
  { name: "WhatsApp Business API", price: "₹5–20K setup · ₹3–10K/mo" },
  { name: "Google Business Profile", price: "₹3–5K" },
  { name: "CRM Integration (HubSpot / Zoho)", price: "₹5–10K" },
  { name: "Booking System", price: "₹3–5K" },
  { name: "Payment Gateway (Razorpay / Stripe)", price: "₹5–10K" },
  { name: "Email Marketing Setup", price: "₹5–12K" },
  { name: "Monthly Reports Dashboard", price: "₹5–10K/mo" },
];

const process = [
  {
    num: "01",
    name: "Discovery call",
    body: "We understand your business, goals, audience, and budget. No sales pitch — just an honest conversation about what makes sense.",
  },
  {
    num: "02",
    name: "Custom proposal",
    body: "Within 48 hours, you receive a tailored plan with clear deliverables, timeline, and pricing. No surprises.",
  },
  {
    num: "03",
    name: "Build & launch",
    body: "We build your website and set up all integrations. Most projects launch in 2–4 weeks.",
  },
  {
    num: "04",
    name: "Grow & optimize",
    body: "For clients on monthly plans, we continuously optimize ads, content, and performance. Monthly reports with actionable insights.",
  },
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
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Digital — Services & Pricing</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,8.5rem)] mb-10 max-w-[1200px] leading-[0.95]">
            Websites, ads, and automation — <span className="text-serif-accent text-[var(--color-primary-blue)]">ran as infrastructure</span>.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              We build the website, run the ads, create the content, and keep everything optimized monthly. You get a system that grows quietly — while you focus on the business.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="digital">Book a discovery call ↗</BookButton>
              <Link href="#bundles" className="btn-secondary">
                See bundles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="px-6 md:px-10 py-24 md:py-36 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Bundles</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Three ways to <span className="text-serif-accent">start</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Pre-configured packages for common business needs. Bundled pricing saves 15–25% compared to buying each service à la carte.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {bundles.map((b, i) => (
              <div
                key={i}
                style={
                  b.featured
                    ? { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A", color: "white" }
                    : {}
                }
                className={`card-hover rounded-xl border p-10 flex flex-col ${
                  b.featured ? "" : "bg-white border-[var(--color-line)]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p
                    className="text-eyebrow"
                    style={{ color: b.featured ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                  >
                    {b.name}
                  </p>
                  {b.featured && (
                    <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-[var(--color-primary-orange)]">
                      Most common
                    </span>
                  )}
                </div>
                <h3
                  className="text-[clamp(1.35rem,2.3vw,1.85rem)] mb-8 leading-tight min-h-[60px]"
                  style={{ color: b.featured ? "white" : "inherit" }}
                >
                  {b.tagline}
                </h3>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-display text-3xl md:text-4xl">{b.oneTime}</span>
                    <span
                      className="text-sm"
                      style={{ color: b.featured ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                    >
                      one-time
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-xl md:text-2xl font-medium"
                      style={{ color: b.featured ? "rgba(255,255,255,0.9)" : "var(--color-text)" }}
                    >
                      + {b.monthly}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: b.featured ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className="text-xs italic"
                    style={{ color: b.featured ? "rgba(255,255,255,0.5)" : "var(--color-text-muted)" }}
                  >
                    {b.notice}
                  </p>
                </div>
                <ul
                  className="space-y-3 mb-10 flex-1"
                  style={{ color: b.featured ? "rgba(255,255,255,0.8)" : "var(--color-text-secondary)" }}
                >
                  {b.includes.map((inc, j) => (
                    <li key={j} className="text-[13.5px] leading-relaxed flex gap-3">
                      <span
                        style={{
                          color: b.featured ? "var(--color-primary-orange)" : "var(--color-primary-blue)",
                        }}
                      >
                        —
                      </span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <BookButton
                  variant={b.featured ? "light-primary" : "primary"}
                  topic="digital"
                >
                  Start this bundle ↗
                </BookButton>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[var(--color-text-secondary)] text-sm max-w-xl">
            Need something different? Every business is unique — we'll put together a custom package based on your specific goals and budget.
          </p>
        </div>
      </section>

      {/* Website types */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Websites — à la carte</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                From landing page to <span className="text-serif-accent">custom platform</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Every website includes professional copy, custom visuals, mobile-responsive design, on-page SEO, analytics, speed optimization, SSL, and a contact form.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {websiteTiers.map((w, i) => (
              <div
                key={i}
                className="bg-white p-10 md:p-12 hover:bg-[var(--color-surface)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-tight">{w.type}</h3>
                  <span className="text-display text-xl shrink-0 text-[var(--color-primary-blue)]">
                    {w.price}
                  </span>
                </div>
                <p className="mono text-xs text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-4">
                  {w.ideal}
                </p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{w.features}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing services */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Digital marketing</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Traffic, leads, <span className="text-serif-accent">sales</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Strategy, setup, creative, optimization, and reporting — done monthly. Ad spend is paid directly to platforms by you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {marketingServices.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[var(--color-line)] p-10 card-hover"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-tight">{m.service}</h3>
                  <span className="text-display text-base text-[var(--color-primary-blue)] shrink-0 whitespace-nowrap">
                    {m.fee}
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">{m.detail}</p>
                <p className="mono text-xs text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                  {m.minSpend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">04 / Add-ons</p>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl mb-16">
            Plug these into any <span className="text-serif-accent">scope</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
            {addOns.map((a, i) => (
              <div key={i} className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line)] pb-4">
                <span className="text-[15px] font-medium">{a.name}</span>
                <span className="text-[var(--color-text-secondary)] text-sm mono shrink-0 text-right">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference builds */}
      <section className="px-6 md:px-10 py-24 md:py-36 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">05 / Reference builds</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                What we build, <span className="text-serif-accent">by vertical</span>.
              </h2>
            </div>
            <Link href="/work" className="btn-secondary">All reference builds →</Link>
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-[15px] leading-relaxed mb-10">
            Reference implementations of the kind of site we ship in each vertical. Production client work is under NDA — these templates show what you get.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">06 / How we work</p>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl mb-16">
            From discovery to <span className="text-serif-accent">live in four steps</span>.
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {process.map((p, i) => (
              <div key={i} className="bg-[var(--color-surface)] p-10 hover:bg-white transition-colors">
                <span className="mono text-xs text-[var(--color-primary-orange)]">{p.num}</span>
                <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] mt-4 mb-5 leading-tight">{p.name}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Good to know */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">07 / Good to know</p>
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Pricing</p>
              <p>All prices are in INR and exclusive of GST (18%). Final pricing depends on scope — the figures above are starting points.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Ad spend</p>
              <p>Platform ad budgets (Google, Meta) are paid directly by you. Our fee covers strategy, setup, management, and optimization.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Timeline</p>
              <p>Business websites: 2–3 weeks. Advanced/E-Commerce: 3–6 weeks. Custom apps: 6–12 weeks. Depends on content readiness.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Ownership</p>
              <p>You own your website, domain, hosting account, ad accounts, and all content. Everything is in your name.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Payment</p>
              <p>50% advance to begin, 50% on delivery for one-time work. Monthly retainers billed at the start of each month.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Domain & hosting</p>
              <p>Domain (~₹800–1,500/year) and hosting (₹3,000–15,000/year) are annual. First year included in bundle pricing; renewals billed separately.</p>
            </div>
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
            Let's talk about what your <span className="text-serif-accent text-[var(--color-primary-orange)]">business needs</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            A 15-minute call tells us — and you — whether a bundle fits, whether a custom scope makes more sense, or whether you should do something else entirely.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary">Book a call ↗</BookButton>
            <a
              href="mailto:hello@polycloud.in"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              hello@polycloud.in
            </a>
          </div>
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
          <Link href="/work" className="link-underline">Work</Link>
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
          <Link href="/work" className="link-underline">Work</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
