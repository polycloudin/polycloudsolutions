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
  // One-line depth per bundle — shown on the pricing card
  depth: Partial<Record<Bundle, string>>;
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
    depth: {
      "local-starter": "Google Ads only · local search",
      growth: "Meta + Google · daily AI optimization",
      "total-growth": "Meta + Google + Performance Max · cross-platform strategy",
    },
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
    depth: {
      growth: "On-page + 4 content briefs/mo",
      "total-growth": "Technical + backlinks + 8 blog posts/mo",
    },
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
    depth: {
      "local-starter": "Setup + weekly posts",
      growth: "Weekly posts + Q&A responses",
      "total-growth": "Full management + competitor tracking",
    },
  },
  {
    slug: "websites",
    name: "Website Development",
    tagline: "Ship in 3-7 days, not 3-7 weeks",
    description:
      "Next.js, mobile-first, UPI payments. Depth scales with bundle — template up to custom app.",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "<2.5s page speed",
    stack: ["Next.js 15", "Tailwind", "Vercel"],
    icon: "◢",
    depth: {
      "local-starter": "Business site · 8 pages",
      growth: "Advanced site · 15 pages + blog",
      "total-growth": "E-commerce or custom web app",
    },
  },
  {
    slug: "social-posts",
    name: "Social Content",
    tagline: "Instagram, Facebook, X, LinkedIn — done",
    description:
      "Festival-aware calendar (Diwali, Holi, Eid). Auto-scheduled across platforms. AI visuals via Midjourney (Total Growth).",
    bundles: ["growth", "total-growth"],
    kpi: "3-5% engagement",
    stack: ["Meta Business API", "LinkedIn API", "X API", "Claude Opus"],
    icon: "◇",
    depth: {
      growth: "16 captions/mo · auto-scheduled",
      "total-growth": "30 posts/mo + branded graphics + video ads",
    },
  },
  {
    slug: "whatsapp",
    name: "WhatsApp Business",
    tagline: "Your #1 sales channel, automated",
    description:
      "Because India = WhatsApp. Depth scales from a click-to-chat button up to full automated sales flows.",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "<2 min response",
    stack: ["Interakt/Meta Cloud API", "Razorpay", "Claude Opus"],
    icon: "◉",
    depth: {
      "local-starter": "Click-to-chat widget",
      growth: "Trained chatbot + auto-replies",
      "total-growth": "Automated flows + broadcast campaigns",
    },
  },
  {
    slug: "crm",
    name: "CRM + Email/SMS",
    tagline: "HubSpot is overkill. This is enough.",
    description:
      "Resend for email, MSG91 (DLT-compliant) for SMS. Every inbound lead captured, tagged, nurtured automatically.",
    bundles: ["growth", "total-growth"],
    kpi: "5-8% lead-to-customer",
    stack: ["Resend", "MSG91", "SQLite"],
    icon: "◐",
    depth: {
      growth: "Capture + 5-step nurture sequence",
      "total-growth": "Lead scoring + pipeline + re-engagement flows",
    },
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
    depth: {
      "total-growth": "4 platforms monitored · AI-drafted replies · owner alerts",
    },
  },
  {
    slug: "analytics",
    name: "Analytics Dashboard",
    tagline: "One dashboard. Every channel.",
    description:
      "Unified reporting across every service. Anomaly detection built in — you see what broke before clients call.",
    bundles: ["local-starter", "growth", "total-growth"],
    kpi: "99% report accuracy",
    stack: ["Next.js", "Recharts", "Supabase"],
    icon: "◆",
    depth: {
      "local-starter": "Monthly PDF report",
      growth: "Monthly report + insights",
      "total-growth": "Weekly live dashboard + quarterly strategy review",
    },
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
              PolyCloud Digital · We run your marketing. You read the dashboard.
            </p>
          </div>

          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1200px] leading-[0.95]">
            <span className="block">We run it.</span>
            <span className="block text-serif-accent text-[var(--color-primary-blue)]">
              You read it.
            </span>
          </h1>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-20 items-end">
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Other tools let you build dashboards and tweak ads yourself.
              We're not a tool. We're the operator. We run your ads, reviews,
              WhatsApp, GMB — nine channels, daily. Monday morning you open
              one URL and see what we did while you slept.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">
                Book a free audit
                <span className="text-base opacity-70">↗</span>
              </BookButton>
              <Link href="/client/demo" className="btn-secondary">
                See the live dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid — reframed as dashboard modules */}
      <section
        id="modules"
        className="px-6 md:px-10 py-20 md:py-28 border-t border-[var(--color-line)]"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
                01 / What we track
              </p>
              <h2 className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
                Nine modules.{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  One source of truth.
                </span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-sm">
              Each module is a channel we run. Numbers flow into your
              dashboard nightly. Depth scales with your bundle — badges show
              which tier includes each module.
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
            02 / How it compounds
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

      {/* Product demo — Weekly dashboard */}
      <section
        id="dashboard"
        className="px-6 md:px-10 py-24 md:py-36 border-t border-[var(--color-line)]"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                03 / The product you see
              </p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-3xl">
                Your whole business{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  on one URL.
                </span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              One deep example of the product you log into every Monday — all 9 modules, one URL, updated nightly.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.15fr] gap-8 items-stretch">
            {/* Info card */}
            <div
              style={{ backgroundColor: "#0A0A0A" }}
              className="rounded-xl p-10 md:p-14 text-white relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 90% 10%, rgba(244, 107, 44, 0.3) 0%, transparent 60%)",
                }}
              />
              <div className="relative flex flex-col h-full">
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6">
                  For every Digital client
                </p>
                <h3 className="text-display text-[clamp(1.75rem,3vw,2.5rem)] mb-8 leading-[1.05]">
                  One dashboard. Every Monday.
                </h3>
                <p className="mono text-xs text-white/50 uppercase tracking-[0.2em] mb-10">
                  9 services · 1 URL · Updated nightly
                </p>
                <div className="space-y-6 mb-10 flex-1">
                  <div>
                    <p className="text-eyebrow text-white/50 mb-2">The pain</p>
                    <p className="text-white/80 text-[14px] leading-relaxed">
                      Agencies send a PDF once a month. By the time you see it, the budget is spent and the leads are cold. You're the last one to know when something's broken.
                    </p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-primary-orange)] mb-2">
                      Outcome
                    </p>
                    <p className="text-white font-medium text-[14px] leading-relaxed">
                      5 minutes to read, 4 decisions per week. Everything else runs on autopilot — and every action Claude took is logged right there.
                    </p>
                  </div>
                </div>
                <BookButton
                  variant="light-primary"
                  topic="digital"
                  className="self-start hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)]"
                >
                  Get your own dashboard ↗
                </BookButton>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                </div>
                <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 truncate">
                  dash.polycloudsolutions.com / kumar-textiles · week-of-14-Apr
                </span>
              </div>

              {/* Summary bar */}
              <div className="grid grid-cols-3 border-b border-[var(--color-line)]">
                {[
                  { label: "Leads (7d)", value: "342", tone: "ink" },
                  { label: "Blended CPL", value: "₹184", tone: "success" },
                  { label: "Needs you", value: "4", tone: "risk" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-5 ${
                      i < 2 ? "border-r border-[var(--color-line)]" : ""
                    }`}
                  >
                    <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                      {s.label}
                    </p>
                    <p
                      className="text-display text-2xl"
                      style={{
                        color:
                          s.tone === "success"
                            ? "#15803D"
                            : s.tone === "risk"
                            ? "#DC2626"
                            : "var(--color-ink)",
                      }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Graphs */}
              {(() => {
                const leadsDaily = [42, 51, 48, 56, 63, 58, 24];
                const leadsMax = Math.max(...leadsDaily);
                const days = ["M", "T", "W", "T", "F", "S", "S"];

                const cplTrend = [320, 294, 268, 241, 220, 198, 184];
                const cplMax = Math.max(...cplTrend);
                const cplMin = Math.min(...cplTrend);
                const cplPoints = cplTrend
                  .map((v, i) => {
                    const x = (i / (cplTrend.length - 1)) * 100;
                    const y = 100 - ((v - cplMin) / (cplMax - cplMin)) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ");
                const cplArea = `0,100 ${cplPoints} 100,100`;

                const channelMix = [
                  { name: "Meta Ads", leads: 148, color: "#1A5FD4" },
                  { name: "Google Ads", leads: 112, color: "#F46B2C" },
                  { name: "Organic / SEO", leads: 48, color: "#15803D" },
                  { name: "WhatsApp", leads: 21, color: "#7C3AED" },
                  { name: "GMB / Local", leads: 13, color: "#B45309" },
                ];
                const channelMax = Math.max(...channelMix.map((c) => c.leads));

                return (
                  <div className="p-5 md:p-6 space-y-6 border-b border-[var(--color-line)]">
                    {/* Leads bar chart */}
                    <div>
                      <div className="flex items-baseline justify-between mb-3">
                        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                          Leads · This week
                        </p>
                        <p className="mono text-[10px] text-[#15803D] font-medium">
                          +28% vs last week
                        </p>
                      </div>
                      <div>
                        <div className="flex items-end gap-2 h-20">
                          {leadsDaily.map((v, i) => {
                            const h = (v / leadsMax) * 100;
                            const isPeak = v === leadsMax;
                            return (
                              <div
                                key={i}
                                className="flex-1 rounded-t-sm"
                                style={{
                                  height: `${h}%`,
                                  backgroundColor: isPeak
                                    ? "var(--color-primary-blue)"
                                    : "rgba(26, 95, 212, 0.35)",
                                }}
                              />
                            );
                          })}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {days.map((d, i) => (
                            <span
                              key={i}
                              className="flex-1 text-center mono text-[9px] text-[var(--color-text-muted)]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CPL trend */}
                    <div>
                      <div className="flex items-baseline justify-between mb-3">
                        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                          Blended CPL · 7 weeks
                        </p>
                        <p className="mono text-[10px] text-[#15803D] font-medium">
                          ₹320 → ₹184 (−43%)
                        </p>
                      </div>
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="w-full h-20"
                      >
                        <defs>
                          <linearGradient id="cplGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon points={cplArea} fill="url(#cplGrad)" />
                        <polyline
                          points={cplPoints}
                          fill="none"
                          stroke="#15803D"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        {cplTrend.map((v, i) => {
                          const x = (i / (cplTrend.length - 1)) * 100;
                          const y = 100 - ((v - cplMin) / (cplMax - cplMin)) * 100;
                          const isLast = i === cplTrend.length - 1;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r={isLast ? "2" : "1"}
                              fill={isLast ? "#15803D" : "#fff"}
                              stroke="#15803D"
                              strokeWidth="1"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Channel mix */}
                    <div>
                      <div className="flex items-baseline justify-between mb-3">
                        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                          Leads by channel · 7 days
                        </p>
                        <p className="mono text-[10px] text-[var(--color-text-muted)]">
                          342 total
                        </p>
                      </div>
                      <div className="space-y-2">
                        {channelMix.map((c) => (
                          <div key={c.name} className="flex items-center gap-3">
                            <span className="w-24 shrink-0 text-[11px] text-[var(--color-text-secondary)]">
                              {c.name}
                            </span>
                            <div className="flex-1 h-5 bg-[var(--color-surface-warm)] rounded-sm overflow-hidden relative">
                              <div
                                className="h-full rounded-sm transition-all"
                                style={{
                                  width: `${(c.leads / channelMax) * 100}%`,
                                  backgroundColor: c.color,
                                  opacity: 0.85,
                                }}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10px] text-[var(--color-ink)] font-medium">
                                {c.leads}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 bg-[#F6F3EA] border-t border-[var(--color-line)] overflow-x-auto">
                {[
                  { name: "Overview", active: true },
                  { name: "Ads" },
                  { name: "Organic" },
                  { name: "Social" },
                  { name: "WhatsApp" },
                  { name: "Reviews" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1 text-[11px] rounded whitespace-nowrap ${
                      t.active
                        ? "bg-white border border-[var(--color-line)] text-[var(--color-ink)] font-medium"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
              ILLUSTRATIVE — Client names + metrics redacted. Structure and data ranges reflect real dashboard output.
            </p>
            <Link
              href="/client/demo"
              className="btn-secondary text-sm"
            >
              Open the full demo
              <span className="ml-1 opacity-70">↗</span>
            </Link>
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
              04 / Bundles
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
                  <ul className="space-y-3 mb-8 text-sm">
                    {servicesInBundle.map((s) => {
                      const depth = s.depth[bundle.slug as Bundle];
                      return (
                        <li key={s.slug} className="flex gap-2.5 items-start">
                          <span className="text-[var(--color-primary-blue)] mt-0.5 shrink-0">
                            ✓
                          </span>
                          <span className="flex-1">
                            <span className="block font-medium">{s.name}</span>
                            {depth && (
                              <span className="block text-[12px] text-[var(--color-text-secondary)] leading-snug mt-0.5">
                                {depth}
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
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
            05 / Questions
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
                q: "Why not just use Ryze AI, Claude directly, or a marketing SaaS tool?",
                a: "Those are tools — you still do the work. Ryze builds dashboards for marketers who tweak their own ads. Claude Cowork generates artifacts when you prompt it. We're the opposite: you don't prompt anything. We run the campaigns, respond to reviews, post on WhatsApp, handle the ad platforms — the dashboard is just how you check our work. If you want to do it yourself, the tools are cheaper. If you want someone else to do it and just see the result, that's us.",
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
