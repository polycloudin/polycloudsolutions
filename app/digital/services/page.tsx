import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Digital Services — 9 services that run your growth | PolyCloud",
  description:
    "Complete catalog: Ads, SEO, GMB, Websites, Social, WhatsApp, CRM, Reviews, Analytics. Built for Indian SMBs. Claude Opus does the work, humans supervise.",
};

type Tier = "starter" | "growth" | "scale";

interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tiers: Tier[];
  kpi: string;
  stack: string[];
  icon: string;
}

const services: Service[] = [
  {
    slug: "ads-management",
    name: "Ads Management",
    tagline: "Meta + Google, on autopilot",
    description:
      "Claude Opus analyses your ad accounts daily. Recommends pause-worthy campaigns, budget shifts, and copy fixes. Average 20% ROAS improvement.",
    tiers: ["growth", "scale"],
    kpi: "+20% ROAS",
    stack: ["Meta Graph API", "Google Ads API", "Claude Opus 4.7"],
    icon: "◎",
  },
  {
    slug: "seo",
    name: "SEO",
    tagline: "Rank without hiring an agency",
    description:
      "On-page, technical, and local SEO audit. Claude-generated content briefs monthly. India-specific (JustDial, IndiaMART, regional keywords).",
    tiers: ["starter", "growth", "scale"],
    kpi: "+30% organic traffic",
    stack: ["BeautifulSoup", "GSC API", "Ahrefs"],
    icon: "◈",
  },
  {
    slug: "gmb",
    name: "Google Business Profile",
    tagline: "Dominate local searches",
    description:
      "Weekly posts, photo uploads, Q&A management, review responses. Plus competitor benchmarking for Tier 1-3 cities.",
    tiers: ["starter", "growth", "scale"],
    kpi: "+40% direction requests",
    stack: ["Google Business API", "Claude Opus"],
    icon: "⊙",
  },
  {
    slug: "websites",
    name: "Website Development",
    tagline: "Ship in 3-7 days, not 3-7 weeks",
    description:
      "Five proven templates (services, retail, restaurant, real estate, B2B). WhatsApp CTA, UPI payments, mobile-first. Vercel hosted.",
    tiers: ["starter", "growth", "scale"],
    kpi: "<2.5s page speed",
    stack: ["Next.js 15", "Tailwind", "Vercel"],
    icon: "◢",
  },
  {
    slug: "social-posts",
    name: "Social Content",
    tagline: "Instagram, Facebook, LinkedIn — done",
    description:
      "8-30 posts per month (tier-based). Festival-aware calendar (Diwali, Holi, Eid). AI visuals via Midjourney. Auto-scheduled.",
    tiers: ["starter", "growth", "scale"],
    kpi: "3-5% engagement",
    stack: ["Meta Business API", "LinkedIn API", "Claude Opus"],
    icon: "◇",
  },
  {
    slug: "whatsapp",
    name: "WhatsApp Business",
    tagline: "Your #1 sales channel, automated",
    description:
      "Chat widget, auto-replies 24/7, broadcast campaigns, chatbot with UPI payments. Because India = WhatsApp.",
    tiers: ["growth", "scale"],
    kpi: "<2 min response",
    stack: ["Interakt/Meta Cloud API", "Razorpay", "Claude Opus"],
    icon: "◉",
  },
  {
    slug: "crm",
    name: "CRM + Email/SMS",
    tagline: "HubSpot is overkill. This is enough.",
    description:
      "Simple CRM (SQLite/Postgres). Email via Resend. SMS via MSG91 (DLT-compliant). Drip automation + lead scoring.",
    tiers: ["scale"],
    kpi: "5-8% lead-to-customer",
    stack: ["Resend", "MSG91", "SQLite"],
    icon: "◐",
  },
  {
    slug: "reviews",
    name: "Review Management",
    tagline: "Never miss a review again",
    description:
      "Monitor Google, Facebook, JustDial, IndiaMART. Claude drafts responses. Owner approves via WhatsApp. Negative reviews trigger alerts.",
    tiers: ["scale"],
    kpi: "+0.3 avg rating",
    stack: ["GMB API", "Facebook Graph", "Playwright"],
    icon: "◑",
  },
  {
    slug: "analytics",
    name: "Analytics Dashboard",
    tagline: "One dashboard. Every channel.",
    description:
      "Unified weekly reports across all services. Ads, SEO, GMB, Social, WhatsApp, Reviews — one view. Anomaly detection built in.",
    tiers: ["scale"],
    kpi: "99% report accuracy",
    stack: ["Next.js", "Recharts", "Supabase"],
    icon: "◆",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "₹5,000",
    period: "/month",
    tagline: "Local visibility, foundation",
    includes: ["GMB Optimization", "Basic SEO", "8 social posts/mo"],
    bestFor: "Clinics, salons, local retail",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹12,000",
    period: "/month",
    tagline: "Most chosen. Lead-generating.",
    includes: [
      "Everything in Starter",
      "Meta + Google Ads management",
      "Landing page",
      "WhatsApp automation",
      "16 social posts/mo",
    ],
    bestFor: "Professional services, B2B, coaching",
    featured: true,
  },
  {
    name: "Scale",
    price: "₹25,000",
    period: "/month",
    tagline: "Full marketing stack",
    includes: [
      "Everything in Growth",
      "Full website (5-10 pages)",
      "CRM + Email/SMS campaigns",
      "Review management",
      "Weekly analytics dashboard",
      "30 social posts/mo",
    ],
    bestFor: "D2C brands, established SMBs",
    featured: false,
  },
];

function tierBadge(tier: Tier) {
  const styles: Record<Tier, string> = {
    starter: "bg-[var(--color-primary-blue)]/10 text-[var(--color-primary-blue)]",
    growth: "bg-[var(--color-primary-orange)]/10 text-[var(--color-primary-orange)]",
    scale: "bg-black/5 text-black",
  };
  return styles[tier];
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(26, 95, 212, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(244, 107, 44, 0.04) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              PolyCloud Digital · 9 services · One invoice
            </p>
          </div>

          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1200px] leading-[0.95]">
            <span className="block">Everything your business</span>
            <span className="block text-serif-accent text-[var(--color-primary-blue)]">
              needs to grow online.
            </span>
          </h1>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-20 items-end">
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Ads, SEO, websites, social, WhatsApp, reviews, CRM. AI does the
              work. A human reviews before anything ships. Three tiers. No
              custom projects. Starting ₹5,000/month.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">
                Book a free audit
                <span className="text-base opacity-70">↗</span>
              </BookButton>
              <Link href="#pricing" className="btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section
        id="services"
        className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)]"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
                The catalog
              </p>
              <h2 className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
                Nine services. One team. <span className="text-serif-accent text-[var(--color-primary-blue)]">Compounding outcomes.</span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-sm">
              Every service is templated, measured, and integrated. We don't
              do one-offs — everything feeds everything else.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group relative p-7 border border-[var(--color-line)] rounded-2xl bg-white hover:border-[var(--color-primary-blue)]/30 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl leading-none text-[var(--color-primary-blue)]">
                    {service.icon}
                  </span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {service.tiers.map((t) => (
                      <span
                        key={t}
                        className={`text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded ${tierBadge(t)}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-[22px] font-medium mb-1.5 tracking-tight">
                  {service.name}
                </h3>
                <p className="text-sm text-[var(--color-primary-orange)] mb-4 font-medium">
                  {service.tagline}
                </p>

                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-[var(--color-line)]">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] mb-0.5">
                      Target KPI
                    </p>
                    <p className="text-sm font-medium">{service.kpi}</p>
                  </div>
                  <Link
                    href={`/digital/services/${service.slug}`}
                    className="text-sm text-[var(--color-primary-blue)] font-medium group-hover:translate-x-0.5 transition-transform"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Integration Map) */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6">
            How it compounds
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] mb-14">
            Services that <span className="text-serif-accent text-[var(--color-primary-blue)]">feed each other.</span>
          </h2>

          <div className="space-y-6 text-[17px] leading-relaxed">
            <div className="flex gap-6 items-start">
              <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                01
              </span>
              <p>
                <strong className="text-[var(--color-ink)]">Website + SEO + GMB</strong> drive traffic. Mobile-first, local-ranked.
              </p>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                02
              </span>
              <p>
                <strong>Ads (Meta + Google)</strong> accelerate what's already converting. No guessing — every campaign is analysed daily by Claude.
              </p>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                03
              </span>
              <p>
                <strong>WhatsApp + CRM</strong> captures every lead. Auto-replies 24/7. Follow-up sequences run themselves.
              </p>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                04
              </span>
              <p>
                <strong>Social + Reviews</strong> build trust. 30 posts a month. Every review responded to in hours, not weeks.
              </p>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                05
              </span>
              <p>
                <strong>Analytics Dashboard</strong> shows everything in one place. You see what's working Monday morning. We iterate Tuesday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="px-6 md:px-10 py-20 md:py-32 border-t border-[var(--color-line)]"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
              Pricing
            </p>
            <h2 className="text-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] mb-5">
              Three tiers. <span className="text-serif-accent text-[var(--color-primary-blue)]">No custom work.</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Custom scopes start at ₹3L and live in Consulting. Digital is templates done right.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-8 md:p-10 rounded-2xl border transition-all ${
                  tier.featured
                    ? "border-[var(--color-primary-blue)] bg-white shadow-xl md:scale-105"
                    : "border-[var(--color-line)] bg-white hover:border-[var(--color-primary-blue)]/30"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary-blue)] text-white text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}

                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-2">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-medium tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-[var(--color-text-secondary)] text-sm">
                    {tier.period}
                  </span>
                </div>
                <p className="text-[15px] text-[var(--color-text-secondary)] mb-8">
                  {tier.tagline}
                </p>

                <ul className="space-y-3 mb-8 text-sm">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 items-start">
                      <span className="text-[var(--color-primary-blue)] mt-0.5 shrink-0">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[var(--color-text-secondary)] mb-6 italic">
                  Best for: {tier.bestFor}
                </p>

                <BookButton
                  variant={tier.featured ? "primary" : "secondary"}
                  className="w-full justify-center"
                >
                  Start {tier.name}
                </BookButton>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)] mt-10">
            All plans include: human review, audit trail, WhatsApp support, and 90-day money-back if ROAS doesn't improve.
          </p>
        </div>
      </section>

      {/* Pilot CTA */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)] bg-[var(--color-ink)] text-white">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-eyebrow text-white/60 mb-6">Q2 2026 · 5 slots</p>
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] mb-6">
            Free <span className="text-serif-accent text-[var(--color-primary-orange)]">Hyderabad pilot</span> — 4 weeks.
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            We're picking 5 Hyderabad SMBs for free pilots. You give access to ad accounts + GMB. We run it for a month. If ROAS doesn't improve, you walk — no strings.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookButton variant="primary">
              Apply for pilot
              <span className="text-base opacity-70">↗</span>
            </BookButton>
            <a
              href="https://wa.me/919876543210?text=Hi,%20interested%20in%20PolyCloud%20Digital%20pilot"
              className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/15"
            >
              WhatsApp us
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-white/10 pt-12">
            <div>
              <p className="text-3xl font-medium mb-1">5</p>
              <p className="text-xs text-white/60 uppercase tracking-wider">Free pilots</p>
            </div>
            <div>
              <p className="text-3xl font-medium mb-1">4 weeks</p>
              <p className="text-xs text-white/60 uppercase tracking-wider">Duration</p>
            </div>
            <div>
              <p className="text-3xl font-medium mb-1">+20%</p>
              <p className="text-xs text-white/60 uppercase tracking-wider">ROAS target</p>
            </div>
            <div>
              <p className="text-3xl font-medium mb-1">₹0</p>
              <p className="text-xs text-white/60 uppercase tracking-wider">Cost to you</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (quick) */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)]">
        <div className="max-w-[900px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6">
            Questions
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] mb-14">
            Things operators <span className="text-serif-accent text-[var(--color-primary-blue)]">actually ask.</span>
          </h2>

          <div className="space-y-10">
            {[
              {
                q: "Is this an agency?",
                a: "No. Agencies have account managers running spreadsheets. We have Claude Opus analysing your ads every hour, drafting every response, and flagging what needs human decisions. You get agency-level service at SaaS prices.",
              },
              {
                q: "What's different from Suvit, ClearTax, or a freelancer?",
                a: "Those tools do one thing. A freelancer ghosts you. We run nine services together — and they compound. Your ads improve when reviews improve. Your SEO ranks when social engages. All in one dashboard.",
              },
              {
                q: "Do you work outside Hyderabad?",
                a: "We do, but pilots are Hyderabad-first. Tier 2/3 city targeting built in (PIN codes, regional languages, local directories).",
              },
              {
                q: "What if my ROAS doesn't improve?",
                a: "90-day money back. We're that confident. In dry-run mode for 2 weeks, you see every recommendation before anything executes.",
              },
              {
                q: "Can I see what Claude recommends before it runs?",
                a: "Yes. Dry-run mode is default. You approve or auto-approve for low-risk changes. Every action is logged (audit trail).",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="text-xl md:text-2xl font-medium mb-3 tracking-tight">
                  {item.q}
                </h3>
                <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
