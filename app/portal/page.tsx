import type { Metadata } from "next";
import Link from "next/link";
import SignOutButton from "../dashboard/SignOutButton";

/**
 * Operator portal — single launchpad for every product/surface under
 * polycloudin. Auth-gated alongside /dashboard via proxy.ts. Not in
 * nav, not in sitemap, robots noindex.
 *
 * Positioning rule: one product per pitch line, then list inputs.
 * "Decision Composer + 10 alt-data feeds" beats "11 scrapers + a
 * templating engine" (per Labs adversarial review · 23 Apr).
 *
 * Source of truth lives in this file so it can't drift from the
 * running site. Add a surface? Append to a SECTIONS array.
 */

export const metadata: Metadata = {
  title: "Portal · Everything we run — PolyCloud",
  robots: { index: false, follow: false, nocache: true },
};

type Status = "live" | "private" | "hidden" | "planned" | "pending";

interface Surface {
  name: string;
  href: string;
  external?: boolean;
  status: Status;
  description: string;
  badge?: string;
}

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  surfaces: Surface[];
}

const SECTIONS: Section[] = [
  {
    id: "operator",
    eyebrow: "01",
    title: "Operator cockpit",
    intro: "Cross-tenant view + private dashboards. Auth-gated via cookie session (Basic Auth fallback).",
    surfaces: [
      {
        name: "Operator dashboard",
        href: "/dashboard",
        status: "private",
        description: "Cross-tenant cockpit. MRR · leads · urgent queue · unified Autopilot feed for every client.",
      },
      {
        name: "PolyCloud Solutions · dogfood",
        href: "/client/polycloud",
        status: "private",
        description: "We use this dashboard before we sell it. Outreach, pipeline, ops log, ca-firm-toolkit milestones.",
        badge: "₹0 retainer · internal",
      },
      {
        name: "Virat Kota · personal brand",
        href: "/client/viratkota",
        status: "private",
        description: "Personal brand track on X + LinkedIn. Drafts, outreach, content schedule.",
      },
    ],
  },
  {
    id: "ca-firm",
    eyebrow: "02",
    title: "CA Firm Toolkit",
    intro: "One product · four tools that share config + audit log. Local-first; data never leaves the firm's laptop.",
    surfaces: [
      {
        name: "Operator dashboard · /portal/ca-firm",
        href: "/portal/ca-firm",
        status: "live",
        description: "Every firm, one screen. Cross-firm activity feed, approval queue, per-tenant deep-dive at /portal/ca-firm/<slug>. Reads from fixture today; swaps to /api/v1/events when shipped.",
        badge: "new",
      },
      {
        name: "Live case · /solutions/ca-firm",
        href: "/solutions/ca-firm",
        status: "live",
        description: "Sales surface. Line-by-line month-end close — 7 manual steps → 4 parallel lanes, 8h → 45min per client. ROI calculator + FAQ.",
      },
      {
        name: "Kumar Textiles dashboard",
        href: "/client/kumar-textiles",
        status: "live",
        description: "Public Growth-bundle demo. Transformation hero, money strip, narrative Autopilot log, owner-approval queue.",
        badge: "₹32K/mo · 76 days",
      },
      {
        name: "PolyCloud LLP (own dogfood) · /portal/ca-firm/polycloud-llp",
        href: "/portal/ca-firm/polycloud-llp",
        status: "live",
        description: "Tenant 001 — our own LLP. TDS notice on TAN HYDP15059C in feed; first real notice the toolkit will fix on our own books.",
        badge: "tenant 001",
      },
      {
        name: "polycloudin/ca-firm-toolkit",
        href: "https://github.com/polycloudin/ca-firm-toolkit",
        external: true,
        status: "private",
        description: "37 tools · 353 tests. --demo: 81.2% match, ITC ₹2,685.57. Pushes events to portal once /api/v1/events ships.",
      },
      {
        name: "Tools catalog · 37 subcommands",
        href: "https://github.com/polycloudin/ca-firm-toolkit#tools",
        external: true,
        status: "planned",
        description: "Web-exposed launcher for every CLI subcommand · run --demo in browser, render output preview (Excel/HTML/JSON). Today: CLI only.",
      },
    ],
  },
  {
    id: "labs",
    eyebrow: "03",
    title: "Labs · Decision Composer + alt-data feeds",
    intro: "One product (decision-chain composer for Indian pharma intel) · 10 input feeds. Per Labs adversarial review: avoid pitching as '10 scrapers'.",
    surfaces: [
      {
        name: "Labs landing",
        href: "/labs",
        status: "live",
        description: "Vertical pitch. Eight research agents, six-phase pipeline, KG memory.",
      },
      {
        name: "Pharma intel dashboard",
        href: "/labs/dashboard",
        status: "live",
        description: "Live demo · Indian pharma intelligence surface. Section 03 NPPA · §04 Para IV overlay · §05 Biosimilar matrix.",
      },
      {
        name: "Per-company drill-down",
        href: "/labs/dashboard/company/cipla",
        status: "live",
        description: "Honest sparse-data widgets that fill in as feeds land. Sample slug shown — dynamic at /labs/dashboard/company/[slug].",
      },
      {
        name: "Decision Composer (A3)",
        href: "/labs",
        status: "planned",
        description: "10-template memo gallery currently in Nexus repo. Once 6 of 10 chains wire up to scrapers → 15-20 memos/week. Lives at /labs/decisions when ported.",
        badge: "Ships in Nexus",
      },
      {
        name: "Pre-call dossier (A4)",
        href: "/labs",
        status: "planned",
        description: "One-click pre-call dossier for 22 Indian pharma companies. Single artifact CFOs land on. /labs/dossier when ported.",
        badge: "Ships in Nexus",
      },
    ],
  },
  {
    id: "realty",
    eyebrow: "04",
    title: "Realty Platform",
    intro: "Hybrid stack — local agent on builder's laptop (scrapes Dharani / 99acres / SRO) + cloud portal for cohort intel. Founding-partner pilot stage.",
    surfaces: [
      {
        name: "Realty marketing landing",
        href: "/solutions/real-estate",
        status: "live",
        description: "Marketing page. Pitch deck CTA. Refund-guarantee block adds when pilot 1 signs.",
      },
      {
        name: "Builder app · /realty",
        href: "/solutions/real-estate",
        status: "planned",
        description: "Six intel cards: Land · Demand · Supply · Policy · Comparables · Channel+Risk. Each with confidence chip + source chip. Multi-tenant.",
        badge: "Founding-partner pilot",
      },
      {
        name: "Internal console · /admin/realty",
        href: "/dashboard",
        status: "planned",
        description: "VK + Aasrith view. All builders + lifecycle (lead → trial → paying → churned), per-builder usage telemetry, manual report trigger.",
      },
      {
        name: "polycloudin/realty-platform",
        href: "https://github.com/polycloudin/realty-platform",
        external: true,
        status: "private",
        description: "FastAPI + SQLite-per-builder + HTML dashboard at localhost:8787. PR #1 open · feat/phase-0-intel-wedge.",
      },
    ],
  },
  {
    id: "marketing",
    eyebrow: "05",
    title: "Marketing site",
    intro: "Top-of-funnel pages. SiteNav + sitemap.xml. Indexed.",
    surfaces: [
      { name: "Homepage", href: "/", status: "live", description: "Hero · three practices bento · McKinsey integration-gap stats · final CTA." },
      { name: "Digital", href: "/digital", status: "live", description: "Vertical pitch for SMBs. Bundles, services, dashboard mockup, pricing." },
      { name: "Consulting", href: "/consulting", status: "live", description: "Mid-market AI integration pitch. Engagement models, verticals, case studies." },
      { name: "About", href: "/about", status: "live", description: "Firm narrative, founders, manifesto." },
      { name: "Insights · blog", href: "/blog", status: "live", description: "20 posts (16 evergreen + 4 recent · ca-firm-toolkit, dashboard anatomy, intake design, month-end)." },
      { name: "3-min intake", href: "/onboard", status: "live", description: "Self-serve client onboarding. 3 screens → /api/onboard → 24-hour signed-scope SLA." },
      { name: "D2C solution", href: "/solutions/d2c", status: "live", description: "Direct-to-consumer SMB pitch. Catalog, ads, WhatsApp, returns." },
      { name: "Local business solution", href: "/solutions/local-business", status: "live", description: "Single-location service-business pitch. GMB, reviews, WhatsApp, basic SEO." },
    ],
  },
  {
    id: "auth",
    eyebrow: "06",
    title: "Auth + meta",
    intro: "Sign-in surfaces and structural endpoints.",
    surfaces: [
      { name: "Sign in", href: "/login", status: "live", description: "Branded form. Posts to /api/auth/login → JWT cookie (HS256, HttpOnly, 14d TTL)." },
      { name: "Sitemap", href: "/sitemap.xml", status: "live", description: "13 static + 20 blog routes. Auto-generated from posts.map." },
      { name: "Robots.txt", href: "/robots.txt", status: "live", description: "Allow all crawlers. /dashboard, /portal, /playground/* carry per-page noindex." },
    ],
  },
  {
    id: "hidden",
    eyebrow: "07",
    title: "Hidden / playground",
    intro: "Routes that exist but aren't linked from nav. For 1:1 demos.",
    surfaces: [
      {
        name: "Depth point cloud",
        href: "/playground/depth",
        status: "hidden",
        description: "Webcam → 12,288-point Three.js cloud via Depth-Anything-V2 (WebGPU/WASM). Robots noindex; only reachable by typing URL.",
      },
    ],
  },
  {
    id: "infra",
    eyebrow: "08",
    title: "Connected infrastructure",
    intro: "External accounts and data feeds wired into the site.",
    surfaces: [
      { name: "Google Analytics 4", href: "https://analytics.google.com/analytics/web/?authuser=3#/a392133724p533972528/", external: true, status: "live", description: "Property G-SJ69BM14MB. Tracking script in components/GoogleAnalytics.tsx." },
      { name: "Vercel · polycloud-web", href: "https://vercel.com/polycloudins-projects/polycloud-web", external: true, status: "live", description: "Project prj_o9xnq4hIB1xOByHQHyUqizDbXa6z under team polycloudins-projects." },
      { name: "GA4 service-account fetcher", href: "/api/live/kumar-textiles", status: "pending", description: "Server-side GA4 Data API → /api/live/[slug] overlay. Needs GA4_SERVICE_ACCOUNT_KEY env var." },
      { name: "Vercel Analytics overlay", href: "/api/live/polycloud", status: "pending", description: "Vercel Analytics → /api/live/[slug]. Needs VERCEL_ACCESS_TOKEN env var." },
    ],
  },
];

// Cross-product capabilities that DON'T exist yet but earn a portal slot
// because they only make sense at the aggregator level.
const ROADMAP: { title: string; rationale: string }[] = [
  {
    title: "Single sign-on across products",
    rationale: "Partner logs in once → hops CA-firm toolkit ↔ MIS ↔ DMS ↔ trading admin without re-auth. Pre-req for everything below.",
  },
  {
    title: "Unified notification hub",
    rationale: "Every deadline, review-queue item, CPE deficit, receivables flag, notice severity surfaces in one inbox per role.",
  },
  {
    title: "Cross-product audit log",
    rationale: "Every action across every tool flows into one append-only log. Today each tool writes its own ~/.<tool>/audit.jsonl.",
  },
  {
    title: "Search across everything",
    rationale: "'Find every UDIN issued for Acme in 2024' hits UDIN ledger + DMS + audit log + working papers in one query.",
  },
  {
    title: "Tool launcher catalog",
    rationale: "37-card grid for ca-firm-toolkit subcommands. Click → run --demo in browser → render Excel/HTML/JSON output preview.",
  },
  {
    title: "PolyCloud LLP as first tenant",
    rationale: "Dogfood the toolkit on our own firm — TDS, GST, ROC, compliance. The TDS notice we got recently? Should land in inbox above, not just in the CA-firm CLI.",
  },
];

// Architectural decisions that need to land before serious portal sprint
const OPEN_QUESTIONS: { question: string; why: string }[] = [
  {
    question: "Data sovereignty — local agent or PolyCloud SaaS?",
    why: "ca-firm-toolkit and Realty both sell 'nothing leaves the firm/builder'. SaaS portal breaks that promise; hybrid (local agent + cloud aggregator with anonymized data) preserves it.",
  },
  {
    question: "Multi-tenancy strategy — DB per firm vs shared?",
    why: "Affects audit-log design, billing, backup model, GDPR-equivalent posture. Realty has already chosen SQLite-per-builder; portal should mirror.",
  },
  {
    question: "Real-time vs polling for review queue",
    why: "Live-update via SSE/WS adds backend complexity but is meaningfully better UX. Polling every 30s is fine for v1.",
  },
  {
    question: "Identity provider — extend /login or external (Clerk/Supabase)?",
    why: "Current /login is a single-shared-password JWT. Multi-user / multi-tenant portal needs at minimum role-based JWT claims; external IdP simplifies SSO + SAML for enterprise CA firms later.",
  },
  {
    question: "Mobile UX — PWA or responsive-only?",
    why: "Marketing pages are read-mostly so responsive suffices. Portal is the first surface where partners might actually need mobile (notifications, approvals on the go). Plan PWA from day 1.",
  },
];

const STATUS_STYLE: Record<Status, { label: string; color: string; bg: string }> = {
  live: { label: "Live", color: "#15803D", bg: "#ECFDF3" },
  private: { label: "Private", color: "#1A5FD4", bg: "#EEF4FF" },
  hidden: { label: "Hidden", color: "#7C3AED", bg: "#F3E8FF" },
  planned: { label: "Planned", color: "#B45309", bg: "#FFFBEB" },
  pending: { label: "Env-pending", color: "#B45309", bg: "#FFFBEB" },
};

export default function PortalPage() {
  const allSurfaces = SECTIONS.flatMap((s) => s.surfaces);
  const total = allSurfaces.length;
  const live = allSurfaces.filter((u) => u.status === "live").length;
  const planned = allSurfaces.filter((u) => u.status === "planned").length;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Portal · Operator launchpad
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 md:px-8 py-8 md:py-12 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Index of every product/surface under polycloudin
        </p>
        <h1 className="text-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] mb-5 max-w-3xl">
          Everything we run, on one page.
        </h1>
        <p className="text-[14.5px] md:text-[15.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mb-6">
          Not in nav. Not in sitemap. This is the launchpad for operators
          — every URL, every repo, every connector. Source of truth lives
          in <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">app/portal/page.tsx</code> so it can&apos;t drift from
          the running site.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[var(--color-text-secondary)]">
          <span className="mono">
            <span className="font-medium text-[var(--color-ink)]">{total}</span> surfaces
          </span>
          <span className="mono">
            <span className="font-medium text-[#15803D]">{live}</span> live
          </span>
          <span className="mono">
            <span className="font-medium text-[#B45309]">{planned}</span> planned
          </span>
          <span className="mono text-[var(--color-text-muted)]">
            · 4 products · 1 hidden · 4 connectors
          </span>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav className="sticky top-[57px] z-10 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3 py-1.5 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-warm)] rounded whitespace-nowrap transition-colors"
            >
              {s.eyebrow} · {s.title}
            </a>
          ))}
          <a
            href="#roadmap"
            className="px-3 py-1.5 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary-orange)] hover:bg-[var(--color-surface-warm)] rounded whitespace-nowrap transition-colors"
          >
            09 · Roadmap
          </a>
        </div>
      </nav>

      {/* Sections */}
      <main className="px-5 md:px-8 max-w-[1280px] mx-auto py-10 md:py-14 space-y-12 md:space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <div className="mb-5 md:mb-6">
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                {section.eyebrow}
              </p>
              <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
                {section.title}
              </h2>
              <p className="text-[13.5px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
                {section.intro}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {section.surfaces.map((surface) => (
                <SurfaceCard key={surface.href + surface.name} surface={surface} />
              ))}
            </div>
          </section>
        ))}

        {/* Roadmap — cross-product features that need a portal sprint */}
        <section id="roadmap" className="scroll-mt-32 border-t border-[var(--color-line)] pt-12 md:pt-16">
          <div className="mb-5 md:mb-6">
            <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">
              09
            </p>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
              Roadmap · cross-product
            </h2>
            <p className="text-[13.5px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              Features that don&apos;t exist as standalone tools — they only make sense at the
              aggregator level. Capture-stage; not built yet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {ROADMAP.map((r) => (
              <div
                key={r.title}
                className="bg-[var(--color-surface-warm)] border border-[var(--color-line)] rounded-xl p-4 md:p-5"
              >
                <p className="text-[14px] font-medium tracking-tight leading-snug mb-2">
                  {r.title}
                </p>
                <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
                  {r.rationale}
                </p>
              </div>
            ))}
          </div>

          {/* Open architecture questions */}
          <div className="mt-10 md:mt-14">
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-4">
              Open architecture questions
            </p>
            <div className="space-y-3">
              {OPEN_QUESTIONS.map((q) => (
                <details
                  key={q.question}
                  className="group bg-white border border-[var(--color-line)] rounded-lg overflow-hidden"
                >
                  <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 hover:bg-[var(--color-surface-warm)] transition-colors">
                    <span className="text-[13px] font-medium tracking-tight">
                      {q.question}
                    </span>
                    <span className="mono text-[10px] text-[var(--color-text-muted)] group-open:rotate-90 transition-transform">
                      ▸
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
                    {q.why}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.16em] text-center uppercase pt-8 border-t border-[var(--color-line)]">
          To add a surface · edit <code className="font-mono">app/portal/page.tsx</code> · push
        </p>
      </main>
    </div>
  );
}

function SurfaceCard({ surface }: { surface: Surface }) {
  const s = STATUS_STYLE[surface.status];
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-medium tracking-tight leading-snug">
          {surface.name}
        </p>
        <span
          className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded shrink-0"
          style={{ color: s.color, backgroundColor: s.bg }}
        >
          {s.label}
        </span>
      </div>
      <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed flex-1">
        {surface.description}
      </p>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-line)]">
        <code className="font-mono text-[10.5px] text-[var(--color-text-muted)] truncate">
          {surface.external ? surface.href.replace(/^https?:\/\//, "") : surface.href}
        </code>
        <span className="text-[var(--color-primary-blue)] group-hover:translate-x-0.5 transition-transform shrink-0">
          {surface.external ? "↗" : "→"}
        </span>
      </div>
      {surface.badge && (
        <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-primary-orange)]">
          {surface.badge}
        </span>
      )}
    </>
  );

  const className =
    "group bg-white border border-[var(--color-line)] rounded-xl p-4 md:p-5 hover:border-[var(--color-ink)] hover:-translate-y-0.5 transition-all flex flex-col gap-3";

  if (surface.external) {
    return (
      <a href={surface.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={surface.href} className={className}>
      {inner}
    </Link>
  );
}
