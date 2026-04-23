import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import AIGapChart from "../components/AIGapChart";
import EdificeCRMMockup from "../components/EdificeCRMMockup";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Consulting — AI integration across verticals | PolyCloud",
  description:
    "AI integration for operators across any vertical. We map workflows, build custom automations, and embed until the systems compound. Finance, SaaS, D2C, healthcare, manufacturing, professional services.",
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
    pitch: "One workflow, shipped to production. Built on our agent runtime with frontier-grade LLMs, integrated with your Tally/Zoho/banking stack. Most builds go live in under 14 days.",
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

const flagships = [
  {
    eyebrow: "For CA Firms",
    title: "The CA Firm AI Employee",
    market: "100,138 registered CA firms in India. 72% solo practices. ₹15–25K/mo retainer.",
    pain: "40–60 hours/month manually matching purchase registers against GSTR-2B. Data-entry errors cause 40% of GST compliance issues. Reconciliation alone consumes 8+ hours per filing cycle.",
    result: "Demo data: 16 invoices processed, 81.2% match rate, ₹2,685 ITC-at-risk caught on first run. Target: 10+ hours/month reclaimed per filing cycle, validated against baseline.",
    ctaTopic: "consulting" as const,
    ctaLabel: "Pilot on your firm ↗",
  },
  {
    eyebrow: "For Real Estate Developers",
    title: "The OS for Indian builders",
    market: "Mid-tier developers run 12 disconnected tools. 63% leads leak between WhatsApp and site visit. 18-month RERA slippage is routine. Founding terms open to first 5 builders.",
    pain: "No incumbent has built end-to-end for the Indian developer lifecycle — from Dharani land DD through AOA handover. Western SaaS dies in week two: it doesn't know vastu is 60–80% of the decision, that Sunday is the big sales day, that one GO can shift land values overnight, or that every lead has 4–6 stakeholders.",
    result: "Ten phases, shipped in sequence. Phase 0 — a 49-module market-intelligence layer — goes live in 30 days with zero integration and pays for itself by preventing one bad land deal. Sales modules (WhatsApp bot, multi-portal, 3D tours, CRM) follow at day 90. Construction and asset management follow demand.",
    ctaTopic: "consulting" as const,
    ctaLabel: "Request the platform deck ↗",
  },
];

const flagshipTools = [
  {
    num: "01",
    name: "Reconciliation engine",
    detail: "GSTR-2B JSON + Tally purchase register → 5-sheet Excel with matched, mismatched, and only-in-books rows, ITC-at-risk flagged.",
  },
  {
    num: "02",
    name: "Vendor follow-up bot",
    detail: "Mismatch rows auto-generate personalized WhatsApp messages to vendors. Three Meta-approved templates cover missing invoice, amount mismatch, and GSTIN mismatch.",
  },
  {
    num: "03",
    name: "Invoice OCR to Tally",
    detail: "Client WhatsApps an invoice photo → OCR + vision-LLM extract fields → balanced double-entry Tally XML voucher draft queued for CA review.",
  },
  {
    num: "04",
    name: "ITC risk dashboard",
    detail: "Monthly MIS: ITC claimed vs available vs at-risk, top-10 leaking vendors, trend chart. Runs on the CA's laptop — no data leaves the firm.",
  },
];

const verticals = [
  {
    name: "Finance & Compliance",
    detail: "CA firms, NBFCs, fintechs. GSTR-2B reconciliation, bank-statement analysis, KYC automation, compliance audit trails.",
    status: "shipped" as const,
    statusNote: "CA firm stack live",
  },
  {
    name: "Real Estate & Property",
    detail: "An operating system for Indian developers — market intelligence, land due-diligence, sales CRM, approvals whispering, drone progress capture, asset management. Ten phases, shipped sequentially.",
    status: "shipped" as const,
    statusNote: "Platform build · first 5 founding builders open",
  },
  {
    name: "D2C & Retail",
    detail: "WhatsApp post-purchase engines, attribution pipelines, inventory + reorder automation, creative production at scale.",
    status: "pilot" as const,
    statusNote: "First pilots opening",
  },
  {
    name: "SaaS & Digital Products",
    detail: "Lead routing, CRM automation, messaging-first sales engines, onboarding flows, churn prediction.",
    status: "design" as const,
    statusNote: "Scoping with 2 firms",
  },
  {
    name: "Manufacturing & Supply Chain",
    detail: "Invoice OCR, three-way match, vendor comms, ERP integration, live MIS dashboards.",
    status: "scope" as const,
    statusNote: "Ready to scope · audit-first",
  },
  {
    name: "Healthcare & Clinics",
    detail: "WhatsApp-based appointment booking, payment reminders, EHR integration, patient-data workflows.",
    status: "scope" as const,
    statusNote: "Ready to scope · audit-first",
  },
  {
    name: "Professional Services",
    detail: "Law firms, consultancies, advisories. Document processing, client communication, research agents, compliance tracking.",
    status: "scope" as const,
    statusNote: "Ready to scope · audit-first",
  },
];

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  shipped: { label: "Shipped", color: "#15803D", bg: "#ECFDF3" },
  pilot: { label: "In pilot", color: "#B45309", bg: "#FFFBEB" },
  design: { label: "In design", color: "#1A5FD4", bg: "#EEF4FF" },
  scope: { label: "Ready to scope", color: "var(--color-text-muted)", bg: "var(--color-surface)" },
};

// India connectors — the actual moat. Shipped = production in CA-firm stack;
// Pilot = partial integration in an active engagement; Ready = designed, awaits first engagement.
const connectors = [
  {
    name: "Tally ERP",
    use: "Purchase register ingest, voucher draft via XML, ODBC live sync.",
    status: "shipped" as const,
    depth: "Used live in the CA firm reconciliation pipeline.",
  },
  {
    name: "GST Portal (GSTR-2B)",
    use: "JSON ingest, fuzzy invoice matching, ITC-at-risk flagging.",
    status: "shipped" as const,
    depth: "5-sheet Excel output, reproducible via `python3 demo.py`.",
  },
  {
    name: "WhatsApp Business API",
    use: "Meta-approved templates, vendor follow-up send + audit log, inbound OCR webhook.",
    status: "shipped" as const,
    depth: "interakt.ai + msg91 dual-adapter, rate-limited.",
  },
  {
    name: "UPI · Razorpay · Cashfree",
    use: "Payment collection, subscription billing, reconciliation against bank statements.",
    status: "pilot" as const,
    depth: "Live in D2C checkout flows; reconciliation adapter in design.",
  },
  {
    name: "MCA · Company registry",
    use: "AOC-4, MGT-7 filing status, director KYC lookups, LLP compliance tracker.",
    status: "ready" as const,
    depth: "Scraper + ingest designed. Awaiting first engagement.",
  },
  {
    name: "EPFO / ESIC",
    use: "PF challan verification, contribution reconciliation, employee-level audit trails.",
    status: "ready" as const,
    depth: "Portal access patterns mapped. Compliance review in progress.",
  },
  {
    name: "eCourts · Judgments",
    use: "Case tracking, hearing reminders, judgment search for professional services + legal ops.",
    status: "ready" as const,
    depth: "Indexed dataset prepared. Agent layer on roadmap.",
  },
];

const connectorStatus: Record<string, { label: string; color: string; bg: string }> = {
  shipped: { label: "Shipped", color: "#15803D", bg: "#ECFDF3" },
  pilot: { label: "In pilot", color: "#B45309", bg: "#FFFBEB" },
  ready: { label: "Ready to wire", color: "var(--color-text-muted)", bg: "var(--color-surface)" },
};

const gapData = [
  { stat: "88%", label: "of organizations use AI today" },
  { stat: "6%", label: "see meaningful bottom-line impact" },
  { stat: "21%", label: "have actually redesigned workflows around it" },
];

export default function Consulting() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
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
          <h1 className="text-display text-[clamp(2.25rem,10vw,8.5rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            Most companies bolt AI on. We rebuild the{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">workflow</span> around it.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              88% of firms use AI. Only 6% see bottom-line impact. The difference is implementation — the invisible work of redesigning how tasks move, who makes decisions, and where the AI actually fits. That's what we do.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">Scope an audit ↗</BookButton>
              <Link href="#engagements" className="btn-secondary">
                Engagement models
              </Link>
            </div>
          </div>

          {/* Proof strip — points to CA-firm case */}
          <Link
            href="/solutions/ca-firm"
            className="group mt-12 md:mt-16 inline-flex items-center gap-3 md:gap-4 pl-4 md:pl-5 pr-4 py-3 md:py-3.5 border border-[var(--color-line)] hover:border-[var(--color-ink)] rounded-full bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-orange)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary-orange)]" />
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] hidden md:inline">
              Case · shipped
            </span>
            <span className="text-[13px] md:text-[14.5px] font-medium tracking-tight">
              CA firm month-end close · 8 hrs → 45 min per client.
            </span>
            <span className="text-[var(--color-primary-blue)] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Gap stats */}
      <section className="px-6 md:px-10 py-14 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">The integration gap</p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-2xl leading-[1]">
                Where companies <span className="text-serif-accent">actually lose</span> the AI race.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Adoption is near-universal. Measurable impact is not. Each step below is where companies drop out — and where the real work lives.
            </p>
          </div>
          <AIGapChart />
          <p className="mt-14 text-[var(--color-text-muted)] text-[13px] leading-relaxed max-w-2xl">
            The integration gap isn't a technology problem. It's a workflow problem — which is why frontier-lab model releases don't close it.
          </p>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Engagement models</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl">
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
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Who we work with</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl">
                Across <span className="text-serif-accent">verticals</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We work across verticals. Finance is where our deepest flagship lives, but the same engagement shape (audit → sprint → retainer) applies to SaaS, D2C, manufacturing, healthcare, and professional services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verticals.map((v, i) => {
              const b = statusBadge[v.status];
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover"
                >
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-eyebrow text-[var(--color-primary-orange)]">{String(i + 1).padStart(2, "0")}</p>
                    <span
                      className="mono text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded"
                      style={{ color: b.color, backgroundColor: b.bg }}
                    >
                      {b.label}
                    </span>
                  </div>
                  <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] mb-3 leading-tight">{v.name}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">{v.detail}</p>
                  <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.08em]">
                    {v.statusNote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* India connectors — the moat */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / The moat</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-3xl leading-[1]">
                Seven <span className="text-serif-accent text-[var(--color-primary-blue)]">India connectors</span> — the thing no US shop has.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Every Indian operations workflow hits Tally, GSTN, WhatsApp, or a payments rail within the first week. We&apos;ve built the ingest, reconciliation, and write-back layer for each — so you don&apos;t wait on a vendor for the adapter that unblocks your whole sprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {connectors.map((c, i) => {
              const b = connectorStatus[c.status];
              return (
                <div key={i} className="bg-white p-7 md:p-8 hover:bg-[var(--color-surface)] transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-[10px] text-[var(--color-primary-orange)] tracking-[0.18em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="mono text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded"
                      style={{ color: b.color, backgroundColor: b.bg }}
                    >
                      {b.label}
                    </span>
                  </div>
                  <h3 className="text-[clamp(1.1rem,1.5vw,1.3rem)] mb-3 leading-tight">{c.name}</h3>
                  <p className="text-[var(--color-text-secondary)] text-[13.5px] leading-relaxed mb-3">{c.use}</p>
                  <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.06em] leading-relaxed">
                    {c.depth}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[var(--color-text-muted)] text-[13px] leading-relaxed max-w-2xl">
            &quot;Shipped&quot; means running in production today. &quot;In pilot&quot; means active in a live engagement. &quot;Ready to wire&quot; means designed — first engagement turns the key.
          </p>
        </div>
      </section>

      {/* Flagship — GSTR-2B */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">04 / Two shipped platforms</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl">
                From GST recon to{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">luxury CRMs</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Two production platforms in two different verticals, built on the same engagement shape — audit → sprint → platform → retainer. What the stack looks like varies; how we deliver does not.
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
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6">{flagships[0].eyebrow}</p>
                <h3 className="text-display text-[clamp(1.75rem,3vw,2.5rem)] mb-8 leading-[1.05]">
                  {flagships[0].title}
                </h3>
                <p className="mono text-xs text-white/50 uppercase tracking-[0.2em] mb-10">
                  {flagships[0].market}
                </p>
                <div className="space-y-6 mb-10 flex-1">
                  <div>
                    <p className="text-eyebrow text-white/50 mb-2">The pain</p>
                    <p className="text-white/80 text-[14px] leading-relaxed">{flagships[0].pain}</p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-primary-orange)] mb-2">Outcome</p>
                    <p className="text-white font-medium text-[14px] leading-relaxed">{flagships[0].result}</p>
                  </div>
                </div>
                <BookButton variant="light-primary" topic="consulting" className="self-start hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)]">{flagships[0].ctaLabel}</BookButton>
              </div>
            </div>

            {/* Excel mockup */}
            <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
              {/* File chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
                </div>
                <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 truncate">
                  GSTR2B_Recon_Oct2026_[Redacted-Client].xlsx
                </span>
              </div>

              {/* Summary bar */}
              <div className="grid grid-cols-3 border-b border-[var(--color-line)]">
                {[
                  { label: "Total invoices", value: "1,284", tone: "ink" },
                  { label: "Matched", value: "94.3%", tone: "success" },
                  { label: "ITC at risk", value: "₹2,41,380", tone: "risk" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-5 ${i < 2 ? "border-r border-[var(--color-line)]" : ""}`}
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

              {/* Column headers */}
              <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.9fr] gap-3 px-5 py-2.5 bg-[var(--color-surface-warm)] border-b border-[var(--color-line)] mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                <span>Vendor / Invoice</span>
                <span>GSTIN</span>
                <span className="text-right">Invoice Amt</span>
                <span className="text-right">ITC</span>
                <span className="text-right">Status</span>
              </div>

              {/* Rows */}
              {[
                {
                  v: "Vendor A · INV-10428",
                  g: "29ABCDE••••F1Z5",
                  amt: "₹1,24,500",
                  itc: "₹18,950",
                  status: "matched",
                },
                {
                  v: "Vendor B · INV/2026/031",
                  g: "36GHIJK••••L2Z7",
                  amt: "₹86,200",
                  itc: "₹13,120",
                  status: "matched",
                },
                {
                  v: "Vendor C · 441",
                  g: "27MNOPQ••••R3Z9",
                  amt: "₹3,40,000",
                  itc: "₹51,780",
                  status: "mismatch",
                },
                {
                  v: "Vendor D · INV-22",
                  g: "33STUVW••••X4Z1",
                  amt: "₹19,750",
                  itc: "₹3,010",
                  status: "matched",
                },
                {
                  v: "Vendor E · PO-1807",
                  g: "24YZABC••••D5Z3",
                  amt: "₹2,15,000",
                  itc: "₹32,750",
                  status: "unmatched",
                },
                {
                  v: "Vendor F · INV/10/A",
                  g: "32EFGHI••••J6Z5",
                  amt: "₹58,900",
                  itc: "₹8,970",
                  status: "matched",
                },
              ].map((r, i) => {
                const statusColor =
                  r.status === "matched"
                    ? "#15803D"
                    : r.status === "mismatch"
                    ? "#DC2626"
                    : "#B45309";
                const statusBg =
                  r.status === "matched"
                    ? "#ECFDF3"
                    : r.status === "mismatch"
                    ? "#FEF2F2"
                    : "#FFFBEB";
                const statusLabel =
                  r.status === "matched"
                    ? "Matched"
                    : r.status === "mismatch"
                    ? "Mismatch"
                    : "Unmatched";
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.9fr] gap-3 px-5 py-3 text-[12.5px] ${
                      i % 2 === 1 ? "bg-[var(--color-surface)]" : "bg-white"
                    } border-b border-[var(--color-line)] items-center`}
                  >
                    <span className="text-[var(--color-ink)] font-medium truncate">{r.v}</span>
                    <span className="mono text-[11px] text-[var(--color-text-secondary)] truncate">
                      {r.g}
                    </span>
                    <span className="mono text-right text-[var(--color-text)]">{r.amt}</span>
                    <span className="mono text-right text-[var(--color-text-secondary)]">{r.itc}</span>
                    <span className="flex justify-end">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium mono"
                        style={{ color: statusColor, backgroundColor: statusBg }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: statusColor }}
                        />
                        {statusLabel}
                      </span>
                    </span>
                  </div>
                );
              })}

              {/* Sheet tabs */}
              <div className="flex items-center gap-1 px-3 py-2 bg-[#F6F3EA] border-t border-[var(--color-line)] overflow-x-auto">
                {[
                  { name: "Summary", active: true },
                  { name: "Matched" },
                  { name: "Mismatches" },
                  { name: "Unmatched" },
                  { name: "Vendor Follow-up" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1 text-[11px] rounded ${
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

          <p className="mt-6 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
            ILLUSTRATIVE — Client names + GSTINs redacted. Amounts and structure reflect real engine output.
          </p>

          {/* The 4-tool stack */}
          <div className="mt-20">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <p className="text-eyebrow text-[var(--color-text-secondary)]">The stack — four tools, one install</p>
              <Link
                href="/solutions/ca-firm"
                className="text-sm font-medium link-underline"
              >
                Full product page →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {flagshipTools.map((t) => (
                <div
                  key={t.num}
                  className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover"
                >
                  <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{t.num}</p>
                  <h4 className="text-[clamp(1.15rem,1.5vw,1.35rem)] leading-tight mb-4">{t.name}</h4>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider between flagships */}
          <div className="my-20 md:my-28 border-t border-[var(--color-line)] relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface)] px-4 mono text-[10px] tracking-[0.25em] text-[var(--color-text-muted)] uppercase">
              And in a completely different vertical
            </span>
          </div>

          {/* Second flagship — Edifice real-estate CRM */}
          <div className="grid md:grid-cols-[1fr_1.15fr] gap-8 items-stretch">
            <div
              style={{ backgroundColor: "#0A0A0A" }}
              className="rounded-xl p-10 md:p-14 text-white relative overflow-hidden order-2 md:order-1"
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 10% 90%, rgba(26, 95, 212, 0.35) 0%, transparent 60%)",
                }}
              />
              <div className="relative flex flex-col h-full">
                <p className="text-eyebrow text-[var(--color-primary-blue)] mb-6">{flagships[1].eyebrow}</p>
                <h3 className="text-display text-[clamp(1.75rem,3vw,2.5rem)] mb-8 leading-[1.05]">
                  {flagships[1].title}
                </h3>
                <p className="mono text-xs text-white/50 uppercase tracking-[0.2em] mb-10">
                  {flagships[1].market}
                </p>
                <div className="space-y-6 mb-10 flex-1">
                  <div>
                    <p className="text-eyebrow text-white/50 mb-2">The pain</p>
                    <p className="text-white/80 text-[14px] leading-relaxed">{flagships[1].pain}</p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-primary-blue)] mb-2">Outcome</p>
                    <p className="text-white font-medium text-[14px] leading-relaxed">{flagships[1].result}</p>
                  </div>
                </div>
                <BookButton variant="light-primary" topic="consulting" className="self-start hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)]">{flagships[1].ctaLabel}</BookButton>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <EdificeCRMMockup />
            </div>
          </div>

          <p className="mt-6 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
            ILLUSTRATIVE — the sales CRM shown above is one module inside Phase 4. The full platform spans ten phases.
          </p>

          {/* 10-phase platform timeline */}
          <div className="mt-14 md:mt-20">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <p className="text-eyebrow text-[var(--color-text-secondary)]">The ten-phase platform · shipped in sequence</p>
              <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
                Phase 0 ships first · rest follows demand
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-10 gap-1.5 min-w-[900px]">
                {[
                  { ph: "PH 0", name: "Market Intel", when: "Day 0–30", wedge: true },
                  { ph: "PH 1", name: "Land DD", when: "Day 30+" },
                  { ph: "PH 2", name: "Approvals", when: "Day 60+" },
                  { ph: "PH 3", name: "Pre-Launch", when: "Day 60–90" },
                  { ph: "PH 4", name: "Sales", when: "Day 90–180" },
                  { ph: "PH 5", name: "Construction", when: "Day 180+" },
                  { ph: "PH 6", name: "Handover", when: "Year 1+" },
                  { ph: "PH 7", name: "Asset Mgmt", when: "Year 2" },
                  { ph: "PH 8", name: "Operations", when: "Year 2" },
                  { ph: "PH 9", name: "Strategic", when: "Year 2+" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`rounded-md p-3 ${
                      p.wedge
                        ? "bg-[var(--color-ink)] text-white"
                        : "bg-white border border-[var(--color-line)]"
                    }`}
                  >
                    <p
                      className={`mono text-[9px] uppercase tracking-[0.14em] mb-1 ${
                        p.wedge ? "text-[var(--color-primary-orange)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {p.ph}
                    </p>
                    <p
                      className={`text-[12.5px] font-medium leading-tight mb-1 ${
                        p.wedge ? "text-white" : "text-[var(--color-ink)]"
                      }`}
                    >
                      {p.name}
                    </p>
                    <p
                      className={`mono text-[9.5px] tracking-[0.04em] ${
                        p.wedge ? "text-white/60" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {p.when}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Phase 0 contains */}
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <p className="text-eyebrow text-[var(--color-text-secondary)]">Phase 0 · the intelligence wedge · 49 modules · 6 categories</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
              {[
                { cat: "Land & Site Intel", count: 10, detail: "Dharani ownership chain, EC, litigation, GO 111 zoning, infrastructure proximity." },
                { cat: "Demand-Side Intel", count: 8, detail: "NRI pulse, BHK mix, vastu compliance, festival-cycle demand." },
                { cat: "Supply-Side Intel", count: 7, detail: "Live inventory scan, sell-through rates, builder-reputation index." },
                { cat: "Policy & Regulatory", count: 8, detail: "Government Order tracking, state policy shifts, infrastructure pipeline." },
                { cat: "Comparables & Premium", count: 6, detail: "Sub-registrar data, view/floor/corner premium decomposition." },
                { cat: "Channel + Risk", count: 10, detail: "Broker network map, litigation watch, regime-change exposure." },
              ].map((c, i) => (
                <div key={i} className="bg-white p-6 md:p-7">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">{c.cat}</p>
                    <span className="mono text-[10px] bg-[var(--color-surface-warm)] text-[var(--color-primary-orange)] px-2 py-0.5 rounded tracking-[0.05em]">
                      {c.count} modules
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-[13px] leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seven unfair advantages */}
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <p className="text-eyebrow text-[var(--color-text-secondary)]">Seven features no incumbent can ship</p>
              <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
                Each one a moat by itself
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { name: "Hyderabad Land Brain", line: "Real-time map of every plot — ownership chain, litigation, conversion potential, builder overlays.", tag: "Standalone moat" },
                { name: "NRI Remote Closing", line: "Dubai/US → full purchase. Live video site visit, DigiLocker KYC, e-stamp + e-registration.", tag: "15–20% dead leads recaptured" },
                { name: "Cement Hedger", line: "Commodity intel + procurement timing AI. 5–15% material savings across project lifetime.", tag: "Material cost edge" },
                { name: "Drone Time Machine", line: "Weekly aerial capture compiled into growth GIFs. Auto-WhatsApped to 200 buyers monthly.", tag: "Buyer NPS +30" },
                { name: "Approval Whisperer", line: "Predicts which officer or document will cause delay. Built on 500+ Hyderabad project histories.", tag: "Saves 3–12 months" },
                { name: "Future Site View", line: "Greenfield land photo → photoreal AI render of the completed building. JDA negotiation weapon.", tag: "Unlock JDA terms" },
                { name: "Resale Arbitrage Engine", line: "Alert when an owner in your project lists below market. Auto-bid, recapture, re-sell at premium.", tag: "Secondary market" },
                { name: "India-native by design", line: "Vastu-weighted unit recommender. 4–6 stakeholder CRM. Telugu-first WhatsApp. Festival-cycle scheduling. GO 111 political-shock alerts in 48 hours.", tag: "What Silicon Valley misses" },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl border border-[var(--color-line)] p-6 card-hover">
                  <h4 className="text-[clamp(1rem,1.4vw,1.2rem)] leading-tight mb-3 font-medium">{f.name}</h4>
                  <p className="text-[var(--color-text-secondary)] text-[13px] leading-relaxed mb-4">{f.line}</p>
                  <p className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary-orange)]">
                    {f.tag}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Founding partner offer */}
          <div className="mt-12 bg-[var(--color-surface-warm)] rounded-xl border border-[var(--color-line)] p-8 md:p-10 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Founding partner · 90-day pilot · first 5 builders only</p>
              <h4 className="text-display text-[clamp(1.25rem,2.25vw,1.75rem)] leading-tight mb-2">
                You steer the roadmap. Founding terms lock forward.
              </h4>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                25 highest-value Phase 0 modules at launch · weekly Monday intel reports · direct Slack/WhatsApp with the build team · quarterly business review · first-look at Phases 3-4 in beta · one complimentary 3D tour of an active project. No long-term lock-in — cancel any month after the pilot.
              </p>
            </div>
            <BookButton variant="primary" topic="consulting">Request founding terms ↗</BookButton>
          </div>
        </div>
      </section>

      {/* How we deliver */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">05 / How we deliver</p>
          <h2 className="text-[clamp(1.875rem,6vw,5rem)] mb-16 max-w-2xl">
            Senior-led, tool-agnostic, <span className="text-serif-accent">fast</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Senior-led engagements</p>
              <p>No bait-and-switch with junior staff. The people who scope the work are the people who ship it. You get senior engineers and strategists on every call.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Tool-agnostic stack</p>
              <p>Frontier LLMs, agent runtimes, Python, Next.js, and the workflow-automation primitives that actually ship. We pick the cleanest tool for the job — never the one with the biggest margin for us.</p>
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
          <p className="mt-14 pt-8 border-t border-[var(--color-line)] text-display text-serif-accent text-[clamp(1.25rem,2vw,1.65rem)] text-[var(--color-primary-blue)] leading-[1.2]">
            Every engagement produces a reusable asset. Every output is documented. Every result is measured.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-36 text-white relative overflow-hidden"
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
          <h2 className="text-display text-[clamp(2rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Start with a 2-week <span className="text-serif-accent text-[var(--color-primary-orange)]">audit</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            Fixed scope. Fixed fee. Written diagnostic and roadmap at the end — whether or not you continue with PolyCloud. A good audit pays for itself in avoided mistakes alone.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary">Scope an audit ↗</BookButton>
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
    <nav className="fixed top-[48px] md:top-[52px] left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline text-[var(--color-ink)] font-medium">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return <SiteFooter />;
}
