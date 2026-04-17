import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consulting — AI integration for finance operators | PolyCloud",
  description:
    "AI integration for CA firms, NBFCs, and fintechs. We map workflows, build custom automations, and embed until the systems compound.",
};

const engagements = [
  {
    num: "01",
    name: "AI Readiness Audit",
    duration: "2 weeks · fixed fee",
    price: "₹1L – 5L",
    pitch: "A workflow-first diagnostic — we map how work actually flows through your firm, find the 40-60 hour/month tasks, and show exactly where AI replaces labor without breaking the process.",
    deliverable: "Diagnostic report + prioritized automation roadmap + ROI model + 30-day pilot scope.",
  },
  {
    num: "02",
    name: "Automation Build",
    duration: "4 weeks · fixed scope",
    price: "₹50K – 5L / project",
    pitch: "One workflow, shipped to production. Built in n8n + OpenAI/Claude APIs, integrated with your Tally/Zoho/banking stack. Most builds go live in under 14 days.",
    deliverable: "Live automation + ops documentation + handover or retainer option.",
  },
  {
    num: "03",
    name: "Platform Build",
    duration: "8–12 weeks · phased",
    price: "₹5L – 15L",
    pitch: "Multi-system infrastructure: GSTR-2B reconciliation, document processing, MIS dashboards, compliance tracking. Integrated and unified, not stitched together from point tools.",
    deliverable: "Production platform + API integrations + team training + 90-day hypercare.",
  },
  {
    num: "04",
    name: "Retainer / Fractional AI Officer",
    duration: "Quarterly · rolling",
    price: "₹50K – 2L / month",
    pitch: "Embedded AI partner. We run the systems we build, monitor them, iterate quarterly, and stay close enough to catch the next leverage point before you do.",
    deliverable: "Ongoing ops + monthly performance reviews + priority engineering + new automations as scope evolves.",
  },
];

const flagship = {
  title: "GSTR-2B reconciliation for CA firms",
  market: "100,138 registered CA firms in India. 72% solo practices.",
  pain: "40–60 hours/month spent manually matching purchase registers against GSTR-2B. Data-entry errors cause 40% of GST compliance issues. Manual reconciliation alone consumes 8+ hours per filing cycle.",
  solution: "A fuzzy-matching reconciliation engine that ingests GSTR-2B JSON + Tally purchase register, matches on GSTIN + invoice + amount tolerance, and outputs a 5-sheet Excel with ITC-at-risk flagged. Plus vendor follow-up automation via WhatsApp.",
  result: "Filing time drops from 10+ hours to under 2. CAs handle 3× more clients per partner without adding junior staff.",
};

const verticals = [
  {
    name: "CA Firms",
    detail: "GST reconciliation, document processing, MIS automation.",
  },
  {
    name: "Small NBFCs",
    detail: "Bank statement analysis, alternative credit scoring, compliance audit trails.",
  },
  {
    name: "Fintech Startups",
    detail: "RBI FREE-AI compliance, KYC automation, regulatory reporting.",
  },
  {
    name: "D2C & Professional Services",
    detail: "Messaging-first sales engines, CRM automation, attribution pipelines.",
  },
];

const gapData = [
  { stat: "88%", label: "of organizations use AI today" },
  { stat: "6%", label: "see meaningful bottom-line impact" },
  { stat: "21%", label: "have actually redesigned workflows around it" },
];

export default function Consulting() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Consulting — AI Integration</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,8.5rem)] mb-10 max-w-[1250px] leading-[0.95]">
            Most companies bolt AI on. We rebuild the{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">workflow</span> around it.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              88% of firms use AI. Only 6% see bottom-line impact. The difference is implementation — the invisible work of redesigning how tasks move, who makes decisions, and where the AI actually fits. That's what we do.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://cal.com/polycloud/intro" className="btn-primary">
                Scope an audit ↗
              </a>
              <Link href="#engagements" className="btn-secondary">
                Engagement models
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gap stats */}
      <section className="px-6 md:px-10 py-20 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-14">The integration gap</p>
          <div className="grid md:grid-cols-3 gap-10">
            {gapData.map((g, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none mb-4">{g.stat}</div>
                <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-xs">
                  {g.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-16 text-[var(--color-text-secondary)] text-sm max-w-2xl leading-relaxed">
            Sources: McKinsey State of AI 2025, Libertify, RAND AI Failure Analysis. The integration gap isn't a technology problem. It's a workflow problem.
          </p>
        </div>
      </section>

      {/* Flagship — GSTR-2B */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Flagship system</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                The{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">GSTR-2B</span>{" "}
                reconciliation engine.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Our first fully-productized consulting engagement. Built for CA firms. Shipping in weeks, not quarters.
            </p>
          </div>

          <div
            style={{ backgroundColor: "#0A0A0A" }}
            className="rounded-xl p-10 md:p-16 text-white relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 40% 50% at 90% 10%, rgba(244, 107, 44, 0.3) 0%, transparent 60%)",
              }}
            />
            <div className="relative grid md:grid-cols-2 gap-14 md:gap-20">
              <div>
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6">For CA Firms</p>
                <h3 className="text-display text-[clamp(2rem,3.5vw,3rem)] mb-8 leading-[1.05]">
                  {flagship.title}
                </h3>
                <p className="mono text-xs text-white/50 uppercase tracking-[0.2em] mb-10">
                  {flagship.market}
                </p>
                <a
                  href="https://cal.com/polycloud/intro"
                  className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)] hover:!text-white"
                >
                  Pilot on your firm ↗
                </a>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-eyebrow text-white/50 mb-3">The pain</p>
                  <p className="text-white/80 text-[15px] leading-relaxed">{flagship.pain}</p>
                </div>
                <div>
                  <p className="text-eyebrow text-white/50 mb-3">What we built</p>
                  <p className="text-white/80 text-[15px] leading-relaxed">{flagship.solution}</p>
                </div>
                <div>
                  <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Outcome</p>
                  <p className="text-white font-medium text-[15px] leading-relaxed">{flagship.result}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Engagement models</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Four ways to <span className="text-serif-accent">work with us</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Most engagements start with an Audit or a single Automation build. The best ones become Retainers — because the systems we build keep paying back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {engagements.map((e, i) => (
              <div
                key={i}
                className="bg-white p-10 md:p-14 hover:bg-[var(--color-surface)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-baseline gap-5">
                    <span className="mono text-xs text-[var(--color-primary-orange)]">{e.num}</span>
                    <span className="mono text-xs text-[var(--color-text-muted)]">{e.duration}</span>
                  </div>
                  <span className="text-display text-sm text-[var(--color-primary-blue)] whitespace-nowrap">
                    {e.price}
                  </span>
                </div>
                <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] mb-6 leading-tight">{e.name}</h3>
                <p className="text-[var(--color-text)] text-[15px] leading-relaxed mb-6 max-w-lg">
                  {e.pitch}
                </p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-lg">
                  <span className="text-[var(--color-ink)] font-medium">Deliverable —</span> {e.deliverable}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verticals */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Who we work with</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Finance-first, by <span className="text-serif-accent">design</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We lead with finance-adjacent verticals because that's where both founders' domain expertise is deepest — and where the regulatory and workflow complexity creates the highest switching costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {verticals.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover"
              >
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-5">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] mb-4 leading-tight">{v.name}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we deliver */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">04 / How we deliver</p>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] mb-16 max-w-2xl">
            Senior-led, tool-agnostic, <span className="text-serif-accent">fast</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Co-founders do the work</p>
              <p>No bait-and-switch with junior staff. Virat architects the systems. Aasrith runs the engagement. You get both on every call.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Tool-agnostic stack</p>
              <p>n8n, Claude, OpenAI, Python, Next.js. We pick the cleanest tool for the workflow — never the one with the biggest margin for us.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Speed as a feature</p>
              <p>Most automations go live in 14 days. Audits in 2 weeks. Platform builds in 8–12 weeks. If we can't ship in that window, we won't take the engagement.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Reusable assets</p>
              <p>Every engagement produces a template, connector, or dataset we keep — so the next similar client starts at 60% done, not zero.</p>
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
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Next step</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Start with a 2-week <span className="text-serif-accent text-[var(--color-primary-orange)]">audit</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            Fixed scope. Fixed fee. Written diagnostic and roadmap at the end — whether or not you continue with PolyCloud. A good audit pays for itself in avoided mistakes alone.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://cal.com/polycloud/intro"
              className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
            >
              Scope an audit ↗
            </a>
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
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline text-[var(--color-ink)] font-medium">Consulting</Link>
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
