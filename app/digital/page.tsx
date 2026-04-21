import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Digital — Nine services. Three bundles. | PolyCloud",
  description:
    "Everything your business needs online: Ads, SEO, websites, social, WhatsApp, reviews, CRM. AI does the work. A human reviews before anything ships.",
};

type Bundle = "local-starter" | "growth" | "total-growth";

interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bundles: Bundle[];
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
    bundles: ["local-starter", "growth", "total-growth"],
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
    bundles: ["growth", "total-growth"],
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
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "+40% direction requests",
    stack: ["Google Business API", "Claude Opus"],
    icon: "⊙",
  },
  {
    slug: "websites",
    name: "Website Development",
    tagline: "Ship in 3-7 days, not 3-7 weeks",
    description:
      "Business website (Local Starter), advanced website + blog (Growth), or full e-commerce / custom app (Total Growth). Next.js, mobile-first, UPI payments.",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "<2.5s page speed",
    stack: ["Next.js 15", "Tailwind", "Vercel"],
    icon: "◢",
  },
  {
    slug: "social-posts",
    name: "Social Content",
    tagline: "Instagram, Facebook, LinkedIn — done",
    description:
      "Captions + blog posts (Growth), plus branded graphics and video ads (Total Growth). Festival-aware calendar (Diwali, Holi, Eid). Auto-scheduled.",
    bundles: ["growth", "total-growth"],
    kpi: "3-5% engagement",
    stack: ["Meta Business API", "LinkedIn API", "Claude Opus"],
    icon: "◇",
  },
  {
    slug: "whatsapp",
    name: "WhatsApp Business",
    tagline: "Your #1 sales channel, automated",
    description:
      "Click-to-chat widget (Local Starter), trained chatbot (Growth), or full automated flows + broadcasts (Total Growth). Because India = WhatsApp.",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "<2 min response",
    stack: ["Interakt/Meta Cloud API", "Razorpay", "Claude Opus"],
    icon: "◉",
  },
  {
    slug: "crm",
    name: "CRM + Email/SMS",
    tagline: "HubSpot is overkill. This is enough.",
    description:
      "Lead capture CRM + nurture sequences (Growth). Lead scoring + pipeline automation + re-engagement sequences (Total Growth). Resend + MSG91 (DLT-compliant).",
    bundles: ["growth", "total-growth"],
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
    bundles: ["total-growth"],
    kpi: "+0.3 avg rating",
    stack: ["GMB API", "Facebook Graph", "Playwright"],
    icon: "◑",
  },
  {
    slug: "analytics",
    name: "Analytics Dashboard",
    tagline: "One dashboard. Every channel.",
    description:
      "Monthly performance report (all bundles) with insights (Growth+) and competitor analysis + quarterly strategy review (Total Growth).",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "99% report accuracy",
    stack: ["Next.js", "Recharts", "Supabase"],
    icon: "◆",
  },
];

const bundlePricing = [
  {
    slug: "local-starter",
    name: "Local Starter",
    oneTime: "₹70,000",
    monthly: "₹12,000",
    notice: "+ ad spend paid directly to platforms",
    tagline: "Restaurants, salons, clinics, local services",
    featured: false,
  },
  {
    slug: "growth",
    name: "Growth",
    oneTime: "₹1,50,000",
    monthly: "₹32,000",
    notice: "+ ad spend paid to platforms",
    tagline: "Coaching centres, agencies, B2B firms, professional services",
    featured: true,
  },
  {
    slug: "total-growth",
    name: "Total Growth",
    oneTime: "₹3,00,000",
    monthly: "₹65,000",
    notice: "+ ad spend paid to platforms",
    tagline: "Businesses that want everything handled end-to-end",
    featured: false,
  },
];

function bundleBadge(bundle: Bundle) {
  const styles: Record<Bundle, string> = {
    "local-starter":
      "bg-[var(--color-primary-blue)]/10 text-[var(--color-primary-blue)]",
    growth:
      "bg-[var(--color-primary-orange)]/10 text-[var(--color-primary-orange)]",
    "total-growth": "bg-black/5 text-black",
  };
  return styles[bundle];
}

function bundleLabel(bundle: Bundle) {
  const labels: Record<Bundle, string> = {
    "local-starter": "Local Starter",
    growth: "Growth",
    "total-growth": "Total Growth",
  };
  return labels[bundle];
}

export default function DigitalPage() {
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
              PolyCloud Digital · 9 services · 3 bundles
            </p>
          </div>

          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1200px] leading-[0.95]">
            <span className="block">The nine things</span>
            <span className="block text-serif-accent text-[var(--color-primary-blue)]">
              we actually run for you.
            </span>
          </h1>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-20 items-end">
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Ads, SEO, websites, social, WhatsApp, reviews, CRM. AI does the
              work. A human reviews before anything ships. Pick a bundle, we
              run the rest.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">
                Book a free audit
                <span className="text-base opacity-70">↗</span>
              </BookButton>
              <Link href="#pricing" className="btn-secondary">
                See bundles
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
                Nine services. One team.{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  Compounding outcomes.
                </span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-sm">
              Each service is templated, measured, and integrated. We don't do
              one-offs — everything feeds everything else. Badges show which
              bundle includes each service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group relative p-7 border border-[var(--color-line)] rounded-2xl bg-white hover:border-[var(--color-primary-blue)]/30 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-6 gap-3">
                  <span className="text-4xl leading-none text-[var(--color-primary-blue)]">
                    {service.icon}
                  </span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {service.bundles.map((b) => (
                      <span
                        key={b}
                        className={`text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded ${bundleBadge(
                          b
                        )}`}
                      >
                        {bundleLabel(b)}
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
                    href="#pricing"
                    className="text-sm text-[var(--color-primary-blue)] font-medium group-hover:translate-x-0.5 transition-transform"
                  >
                    In which bundle? →
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
            Services that{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              feed each other.
            </span>
          </h2>

          <div className="space-y-6 text-[17px] leading-relaxed">
            {[
              [
                "01",
                <>
                  <strong className="text-[var(--color-ink)]">
                    Website + SEO + GMB
                  </strong>{" "}
                  drive traffic. Mobile-first, local-ranked.
                </>,
              ],
              [
                "02",
                <>
                  <strong>Ads (Meta + Google)</strong> accelerate what's
                  already converting. No guessing — every campaign is analysed
                  daily by Claude.
                </>,
              ],
              [
                "03",
                <>
                  <strong>WhatsApp + CRM</strong> captures every lead.
                  Auto-replies 24/7. Follow-up sequences run themselves.
                </>,
              ],
              [
                "04",
                <>
                  <strong>Social + Reviews</strong> build trust. Every review
                  responded to in hours, not weeks.
                </>,
              ],
              [
                "05",
                <>
                  <strong>Analytics Dashboard</strong> shows everything in one
                  place. You see what's working Monday morning. We iterate
                  Tuesday.
                </>,
              ],
            ].map(([num, body], i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="text-[var(--color-primary-orange)] font-mono text-sm mt-1 shrink-0">
                  {num}
                </span>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Bundles */}
      <section
        id="pricing"
        className="px-6 md:px-10 py-20 md:py-32 border-t border-[var(--color-line)]"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
              Bundles
            </p>
            <h2 className="text-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] mb-5">
              Three bundles.{" "}
              <span className="text-serif-accent text-[var(--color-primary-blue)]">
                Pick one.
              </span>
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              One-time setup covers the build. Monthly covers the run (ads
              management, content, reviews, reports). Ad spend is paid
              directly to platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
            {bundlePricing.map((bundle) => {
              const servicesInBundle = services.filter((s) =>
                s.bundles.includes(bundle.slug as Bundle)
              );
              return (
                <div
                  key={bundle.slug}
                  className={`relative p-8 md:p-10 rounded-2xl border transition-all ${
                    bundle.featured
                      ? "border-[var(--color-primary-blue)] bg-white shadow-xl md:scale-105"
                      : "border-[var(--color-line)] bg-white hover:border-[var(--color-primary-blue)]/30"
                  }`}
                >
                  {bundle.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary-blue)] text-white text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}

                  <p className="text-eyebrow text-[var(--color-primary-orange)] mb-2">
                    {bundle.name}
                  </p>
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-medium tracking-tight">
                        {bundle.oneTime}
                      </span>
                      <span className="text-[var(--color-text-secondary)] text-xs">
                        one-time setup
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-medium tracking-tight text-[var(--color-text-secondary)]">
                        + {bundle.monthly}
                      </span>
                      <span className="text-[var(--color-text-secondary)] text-xs">
                        /month
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[var(--color-text-secondary)] italic mb-6">
                    {bundle.notice}
                  </p>
                  <p className="text-[15px] text-[var(--color-text-secondary)] mb-6">
                    {bundle.tagline}
                  </p>

                  <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
                    Includes {servicesInBundle.length} services
                  </p>
                  <ul className="space-y-2 mb-8 text-sm">
                    {servicesInBundle.map((s) => (
                      <li key={s.slug} className="flex gap-2.5 items-start">
                        <span className="text-[var(--color-primary-blue)] mt-0.5 shrink-0">
                          ✓
                        </span>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>

                  <BookButton
                    variant={bundle.featured ? "primary" : "secondary"}
                    className="w-full justify-center"
                  >
                    Start {bundle.name}
                  </BookButton>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)] mt-10">
            Need something custom? That's a Consulting scope — starts at ₹3L. <Link href="/consulting" className="underline decoration-[var(--color-primary-orange)]/40 underline-offset-4">See Consulting</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)]">
        <div className="max-w-[900px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6">
            Questions
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] mb-14">
            Things operators{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              actually ask.
            </span>
          </h2>

          <div className="space-y-10">
            {[
              {
                q: "Is this an agency?",
                a: "No. Agencies have account managers running spreadsheets. We have Claude Opus analysing your ads every hour, drafting every response, and flagging what needs human decisions. You get agency-level service at SaaS prices.",
              },
              {
                q: "What's the difference between the bundles and these 9 services?",
                a: "The 9 services are what we actually do. The 3 bundles (Local Starter, Growth, Total Growth) are ways to buy them — bundled by who you are. A restaurant doesn't need a CRM; a B2B firm does.",
              },
              {
                q: "Can I buy just one service?",
                a: "Not usually — that's what agencies do and it doesn't compound. If you really need a one-off (e.g. a website only), that's a custom scope and lives in Consulting.",
              },
              {
                q: "What if my ROAS doesn't improve?",
                a: "We run in dry-run mode for the first 2 weeks so you see every recommendation before anything executes. Every action is logged (audit trail). If we can't prove value in 60 days, you walk.",
              },
              {
                q: "Can I see what Claude recommends before it runs?",
                a: "Yes. Dry-run mode is default. You approve or auto-approve for low-risk changes (pause under-performers). Budget moves and copy rewrites always need a human green-light first.",
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
