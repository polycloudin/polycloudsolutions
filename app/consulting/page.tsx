import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import AIGapChart from "../components/AIGapChart";

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
  title: "The CA Firm AI Employee",
  market: "100,138 registered CA firms in India. 72% solo practices. ₹15–25K/mo retainer.",
  pain: "40–60 hours/month manually matching purchase registers against GSTR-2B. Data-entry errors cause 40% of GST compliance issues. Reconciliation alone consumes 8+ hours per filing cycle.",
  solution: "A 4-tool stack, unified under one CLI and installed on the CA's laptop via Docker compose. Reconciliation engine + WhatsApp vendor follow-up + invoice OCR into Tally + ITC risk dashboard — each one replacing a measurable piece of junior-associate work.",
  result: "Demo data: 16 invoices processed, 81.2% match rate, ₹2,685 ITC-at-risk caught on first run. Target: 10+ hours/month reclaimed per filing cycle, validated against baseline.",
};

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
    detail: "Client WhatsApps an invoice photo → Tesseract + Claude Vision extract fields → balanced double-entry Tally XML voucher draft queued for CA review.",
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
  },
  {
    name: "SaaS & Digital Products",
    detail: "Lead routing, CRM automation, messaging-first sales engines, onboarding flows, churn prediction.",
  },
  {
    name: "D2C & Retail",
    detail: "WhatsApp post-purchase engines, attribution pipelines, inventory + reorder automation, creative production at scale.",
  },
  {
    name: "Manufacturing & Supply Chain",
    detail: "Invoice OCR, three-way match, vendor comms, ERP integration, live MIS dashboards.",
  },
  {
    name: "Healthcare & Clinics",
    detail: "WhatsApp-based appointment booking, payment reminders, EHR integration, patient-data workflows.",
  },
  {
    name: "Professional Services",
    detail: "Law firms, consultancies, advisories. Document processing, client communication, research agents, compliance tracking.",
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
              <BookButton variant="primary" topic="consulting">Scope an audit ↗</BookButton>
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
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">The integration gap</p>
              <h2 className="text-[clamp(2rem,5vw,3.75rem)] max-w-2xl leading-[1]">
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

      {/* Flagship — GSTR-2B */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / One deep example</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                The{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">GSTR-2B</span>{" "}
                reconciliation engine.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              One deep example of what we ship. Built for CA firms, but the same engagement shape applies across verticals — audit, sprint, platform, retainer.
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
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6">For CA Firms</p>
                <h3 className="text-display text-[clamp(1.75rem,3vw,2.5rem)] mb-8 leading-[1.05]">
                  {flagship.title}
                </h3>
                <p className="mono text-xs text-white/50 uppercase tracking-[0.2em] mb-10">
                  {flagship.market}
                </p>
                <div className="space-y-6 mb-10 flex-1">
                  <div>
                    <p className="text-eyebrow text-white/50 mb-2">The pain</p>
                    <p className="text-white/80 text-[14px] leading-relaxed">{flagship.pain}</p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-primary-orange)] mb-2">Outcome</p>
                    <p className="text-white font-medium text-[14px] leading-relaxed">{flagship.result}</p>
                  </div>
                </div>
                <BookButton variant="light-primary" topic="consulting" className="self-start hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)]">Pilot on your firm ↗</BookButton>
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
                Across <span className="text-serif-accent">verticals</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We work across verticals. Finance is where our deepest flagship lives, but the same engagement shape (audit → sprint → retainer) applies to SaaS, D2C, manufacturing, healthcare, and professional services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <p className="font-semibold text-[var(--color-ink)] mb-2">Senior-led engagements</p>
              <p>No bait-and-switch with junior staff. The people who scope the work are the people who ship it. You get senior engineers and strategists on every call.</p>
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
          <p className="mt-14 pt-8 border-t border-[var(--color-line)] text-display text-serif-accent text-[clamp(1.25rem,2vw,1.65rem)] text-[var(--color-primary-blue)] leading-[1.2]">
            Every engagement produces a reusable asset. Every output is documented. Every result is measured.
          </p>
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
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Deployable across India · GCC · Southeast Asia · English-first delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
