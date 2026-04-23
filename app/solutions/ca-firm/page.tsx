import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import DashboardMockup from "../../components/DashboardMockup";
import MockupLightbox from "../../components/MockupLightbox";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "CA Firm AI Employee — GSTR-2B, OCR, ITC dashboard",
  description:
    "A 4-tool AI employee installed on your firm's laptop: GSTR-2B reconciliation, WhatsApp vendor follow-up, invoice OCR into Tally, and ITC risk dashboard. ₹15-25K/month.",
  alternates: { canonical: "/solutions/ca-firm" },
  keywords: [
    "CA firm automation",
    "GSTR-2B reconciliation",
    "Tally automation",
    "GST compliance automation",
    "AI for CA firms",
    "invoice OCR Tally",
    "ITC reconciliation",
    "WhatsApp vendor follow-up",
  ],
};

const tools = [
  {
    num: "01",
    name: "Reconciliation engine",
    tagline: "GSTR-2B ↔ Tally purchase register in minutes.",
    description:
      "Ingests GSTR-2B JSON from the GST portal and the purchase register from Tally, matches on GSTIN + invoice number + amount with tolerance, outputs a 5-sheet Excel: Summary, Matched, Mismatches, Only-in-Books, Vendor Follow-up. Every row tagged with the reason and the ITC-at-risk rupee amount.",
    deliverable: "One Excel file per filing cycle. Runs in 90 seconds on 5,000-invoice registers.",
  },
  {
    num: "02",
    name: "WhatsApp vendor follow-up",
    tagline: "Three templates, Meta-approved, one command to send.",
    description:
      "Pulls the Vendor Follow-up sheet from the reconciliation output and generates personalized WhatsApp messages per vendor — missing invoice request, amount mismatch query, GSTIN correction ask. Templates are pre-approved by Meta. Every send is logged to a CSV audit trail.",
    deliverable: "Automated vendor outreach. CAs stop chasing invoices over email.",
  },
  {
    num: "03",
    name: "Invoice OCR to Tally",
    tagline: "Client sends a photo. You get a voucher draft.",
    description:
      "Clients WhatsApp invoice images to a dedicated business number. OCR extracts the raw text; a frontier vision-LLM structures vendor, GSTIN, invoice number, HSN codes, line items, and taxes. A balanced double-entry Tally XML voucher is drafted and queued for CA review before posting. Accuracy: 92%+ on 25 real Indian invoices in sprint testing.",
    deliverable: "No more manual data entry. Clients contribute to bookkeeping without training.",
  },
  {
    num: "04",
    name: "ITC risk dashboard",
    tagline: "One screen. Real-time. Runs locally.",
    description:
      "FastAPI backend + SQLite + Next.js frontend, installed on the CA's laptop. Shows monthly ITC claimed vs available vs at-risk, top-10 leaking vendors, trend chart across the last 12 months. No data leaves the firm — everything runs on localhost.",
    deliverable: "Partners get a morning dashboard. CFO clients can log in to their own slice.",
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Install + map the workflow",
    body:
      "We come on-site (or remote via AnyDesk), run `install.sh` on your primary laptop, and map one full reconciliation cycle with your senior associate. First recon runs against last month's data within 90 minutes of install.",
  },
  {
    week: "Week 2",
    title: "First real cycle",
    body:
      "We run the full reconciliation on this month's GSTR-2B + Tally data. You get the 5-sheet Excel. We sit together and go through mismatches. That's the moment the math clicks — 10 hours collapses to under 2.",
  },
  {
    week: "Week 3",
    title: "Enable vendor follow-up and OCR",
    body:
      "WhatsApp Business number configured and Meta templates approved. Invoice OCR webhook wired to your clients' WhatsApp. Junior associates stop doing data entry entirely.",
  },
  {
    week: "Week 4",
    title: "Dashboard + handoff",
    body:
      "ITC risk dashboard live on your laptop. Operator manual handed over. Unified CLI (`ca-firm recon`, `ca-firm followup`, etc.) works. Monthly retainer begins.",
  },
];

const pricing = {
  retainer: "₹15,000 – 25,000",
  unit: "per month",
  includes: [
    "All four tools installed and running on your laptop",
    "Unified CLI + one-command updates",
    "Meta WhatsApp templates maintained and renewed",
    "Monthly reconciliation cycle run with your team in month 1",
    "Dashboard access for firm partners and senior clients",
    "Fortnightly office hours for scope additions and edge cases",
    "Audit log of every AI action — auditable, reviewable, reversible",
  ],
};

// Month-end close — step-by-step hours. Before = real 4-partner Hyderabad firm;
// After = same firm after ca-firm-toolkit is installed.
const CLOSE_STEPS: {
  step: string;
  detail: string;
  before: string;
  beforeWho: string;
  after: string;
  afterWho: string;
  eliminated?: boolean;
}[] = [
  {
    step: "Ingest GSTR-2B + purchase register",
    detail: "Client sends JSON + Tally export; data gets into the firm's workspace.",
    before: "0.5 h",
    beforeWho: "Junior · inbox hunt + Excel reformat",
    after: "0.0 h",
    afterWho: "Auto · WhatsApp intake → cli",
  },
  {
    step: "Match GSTIN × invoice × amount",
    detail: "Reconcile every line with tolerance on amount and fuzzy on invoice no.",
    before: "3.5 h",
    beforeWho: "Junior · manual VLOOKUP",
    after: "< 30 s",
    afterWho: "Auto · rapidfuzz engine",
    eliminated: true,
  },
  {
    step: "Flag mismatches + classify reason",
    detail: "Tag each break as amount-diff / invoice-miss / amended / vendor-not-filed.",
    before: "1.0 h",
    beforeWho: "Junior · copy-paste classifications",
    after: "Auto",
    afterWho: "In recon output",
    eliminated: true,
  },
  {
    step: "Follow up with vendors for missing GSTR-1",
    detail: "3–8 calls per client, repeat weekly until month-end.",
    before: "2.5 h",
    beforeWho: "Junior · phone + email chase",
    after: "0.0 h",
    afterWho: "Auto · WhatsApp templates queued",
    eliminated: true,
  },
  {
    step: "Draft summary for partner review",
    detail: "Consolidate findings into an Excel the partner can sign off.",
    before: "0.5 h",
    beforeWho: "Junior · Excel collation",
    after: "Auto",
    afterWho: "5-sheet output ready",
    eliminated: true,
  },
  {
    step: "Partner review + exceptions",
    detail: "Read-only pass: check ITC-at-risk > ₹10K and OCR confidence < 90%.",
    before: "0.5 h",
    beforeWho: "Partner · full read-through",
    after: "12 min",
    afterWho: "Partner · flagged items only",
  },
  {
    step: "File return + invoice the client",
    detail: "Final filing + client billing — the one step we don't touch.",
    before: "0.5 h",
    beforeWho: "Partner",
    after: "33 min",
    afterWho: "Partner · unchanged",
  },
];

const facts = [
  { label: "Installed on", value: "Your firm's laptop" },
  { label: "Install time", value: "90 minutes, on-site or remote" },
  { label: "Integration stack", value: "Tally, GSTN portal, WhatsApp Business API" },
  { label: "Data stays with", value: "You — nothing leaves the firm" },
];

const demoMetrics = [
  { stat: "16", label: "Invoices processed", sub: "in the first demo cycle" },
  { stat: "81.2%", label: "Match rate", sub: "first pass, no corrections" },
  { stat: "₹2,685", label: "ITC-at-risk caught", sub: "in the first run alone" },
];

export default function CaFirmSolution() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(244, 107, 44, 0.05) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Solution · CA Firm AI Employee</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,10vw,9rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            Your CA firm, <span className="text-serif-accent text-[var(--color-primary-blue)]">on autopilot</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              A four-tool AI employee installed on your firm's laptop — GSTR-2B reconciliation, WhatsApp vendor follow-up, invoice OCR into Tally, and an ITC risk dashboard. One unified CLI. 90-minute install. You stop doing data entry. Juniors stop chasing invoices. Partners get their evenings back.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">
                Pilot on your firm ↗
              </BookButton>
              <Link href="#tools" className="btn-secondary">
                See the stack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Month-end close — before vs. after (static, no JS hydration) */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4">
                The close, line by line
              </p>
              <h2 className="text-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.05] max-w-3xl">
                One client&apos;s monthly close —{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  8 hours becomes 45 minutes
                </span>
                .
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-sm text-[14px] leading-relaxed">
              Same firm, same clients, same compliance outcome. Each row is a
              step from a real 4-partner Hyderabad CA practice shadowed during
              design. Hours are from their own time-tracking, not ours.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] overflow-hidden bg-white">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Step
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)]">
                Before
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)]">
                After
              </div>
            </div>
            {CLOSE_STEPS.map((step, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.5fr_1fr_1fr] ${
                  i < CLOSE_STEPS.length - 1
                    ? "border-b border-[var(--color-line)]"
                    : ""
                }`}
              >
                <div className="px-4 md:px-6 py-4 md:py-5">
                  <p className="text-[13.5px] md:text-[14.5px] font-medium text-[var(--color-ink)] mb-1 leading-snug">
                    {step.step}
                  </p>
                  <p className="text-[11.5px] md:text-[12px] text-[var(--color-text-secondary)] leading-snug">
                    {step.detail}
                  </p>
                </div>
                <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)] bg-[#FEF8F8]">
                  <p
                    className={`mono text-[13px] md:text-[14px] font-medium text-[#B91C1C] ${
                      step.eliminated ? "line-through opacity-60" : ""
                    }`}
                  >
                    {step.before}
                  </p>
                  <p className="text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
                    {step.beforeWho}
                  </p>
                </div>
                <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)] bg-[#F0FDF4]">
                  <p className="mono text-[13px] md:text-[14px] font-medium text-[#15803D]">
                    {step.after}
                  </p>
                  <p className="text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
                    {step.afterWho}
                  </p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] border-t-2 border-[var(--color-ink)] bg-[var(--color-surface-warm)]">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
                  Per client · per month
                </p>
                <p className="text-display text-[18px] md:text-[22px]">
                  Total hours
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)]">
                <p className="text-display text-[24px] md:text-[30px] text-[#B91C1C] leading-none">
                  8 h
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  At ₹1.5K loaded · ₹12K
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)]">
                <p className="text-display text-[24px] md:text-[30px] text-[#15803D] leading-none">
                  45 min
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  At ₹1.5K loaded · ₹1.1K
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 md:mt-8 text-[13.5px] md:text-[14.5px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            <span className="font-medium text-[var(--color-ink)]">
              Margin recovered per client per month: ~₹10,900.
            </span>{" "}
            A 40-client firm recovers{" "}
            <span className="font-medium text-[var(--color-ink)]">
              ₹4.4L of billable capacity every month
            </span>{" "}
            — either bank as margin, or sell as capacity to take on 8–12 more
            clients with the same team. Toolkit retainer: ₹18K/mo. Break-even:
            first two clients in week one.
          </p>
        </div>
      </section>

      {/* Demo metrics */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">Reconciliation engine · --demo mode</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {demoMetrics.map((m, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3rem,7vw,5.5rem)] leading-none mb-4">{m.stat}</div>
                <p className="text-[var(--color-text)] font-medium text-[15px] mb-1">{m.label}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] uppercase">{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
            Numbers reproducible locally: <code className="font-mono">python3 recon.py --demo</code>
          </p>
        </div>
      </section>

      {/* Dashboard mockup */}
      <section className="px-6 md:px-10 py-16 md:py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">The dashboard</p>
              <h2 className="text-[clamp(1.75rem,5vw,4rem)] max-w-2xl leading-[1]">
                Runs on your <span className="text-serif-accent text-[var(--color-primary-blue)]">laptop</span>. Data never leaves the firm.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              FastAPI + SQLite + Next.js, bundled in a Docker compose. Partners open localhost in a browser — no cloud, no accounts, no vendor lock-in.
            </p>
          </div>
          <MockupLightbox caption="ITC risk dashboard · runs locally on the firm's laptop. Click to collapse.">
            <DashboardMockup />
          </MockupLightbox>
          <p className="mt-6 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
            ILLUSTRATIVE — real dashboard renders live Recharts, updates on every reconciliation run. Click to expand.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / The stack</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-3xl leading-[1]">
                Four tools, one{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">install</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Unified under a single <code className="mono text-[13px] bg-[var(--color-line)] px-1.5 py-0.5 rounded">ca-firm</code> CLI. Each tool stands alone; together they replace one junior associate's worth of weekly work.
            </p>
          </div>

          <div className="space-y-5">
            {tools.map((t) => (
              <div
                key={t.num}
                className="bg-white rounded-xl border border-[var(--color-line)] p-8 md:p-12 card-hover"
              >
                <div className="grid md:grid-cols-[0.5fr_1.2fr_1fr] gap-8 md:gap-12">
                  <div>
                    <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{t.num} / Tool</p>
                    <h3 className="text-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-none mb-4">
                      {t.name}
                    </h3>
                  </div>
                  <div>
                    <p className="text-display text-serif-accent text-[clamp(1.15rem,1.5vw,1.35rem)] text-[var(--color-primary-blue)] mb-4">
                      {t.tagline}
                    </p>
                    <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-text-muted)] mb-3">What you get</p>
                    <p className="text-[var(--color-text)] text-[14px] leading-relaxed">
                      {t.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / The 30-day pilot</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl leading-[1]">
                Four weeks, four <span className="text-serif-accent">wins</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Each week ends with a measurable output on your actual data. If week 2's reconciliation doesn't save you 8+ hours vs baseline, we don't charge for weeks 3–4.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {timeline.map((t) => (
              <div
                key={t.week}
                className="bg-white p-10 md:p-14 hover:bg-[var(--color-surface)] transition-colors"
              >
                <p className="mono text-xs text-[var(--color-primary-orange)] mb-5 tracking-[0.15em]">{t.week}</p>
                <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] mb-6 leading-tight">{t.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-md">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Pricing</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] leading-[1]">
                One monthly retainer. <span className="text-serif-accent">No surprises</span>.
              </h2>
            </div>
          </div>

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
                <p className="text-eyebrow text-white/50 mb-5">Monthly retainer</p>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none">
                    {pricing.retainer}
                  </span>
                </div>
                <p className="mono text-sm text-white/60 tracking-[0.1em] mb-10">{pricing.unit}</p>
                <BookButton variant="light-primary" topic="consulting">
                  Start a 30-day pilot ↗
                </BookButton>
              </div>
              <div>
                <p className="text-eyebrow text-white/50 mb-5">What's included</p>
                <ul className="space-y-3">
                  {pricing.includes.map((inc) => (
                    <li key={inc} className="text-white/80 text-[14px] leading-relaxed flex gap-3">
                      <span className="text-[var(--color-primary-orange)]">—</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="px-6 md:px-10 py-20 md:py-24 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-4 gap-8 md:gap-10">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-2">
                {f.label}
              </p>
              <p className="text-[15px] md:text-[16px] font-medium leading-tight">{f.value}</p>
            </div>
          ))}
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
          <p className="text-eyebrow text-white/50 mb-8">Get on the pilot list</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            We're taking two more pilot <span className="text-serif-accent text-[var(--color-primary-orange)]">CA firms</span> this quarter.
          </h2>
          <p className="text-white/60 text-[17px] max-w-2xl leading-relaxed mb-10">
            First install in week one. First reconciliation in week two. If it doesn't save you 8+ hours the first month, we don't charge for the next three weeks.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary" topic="consulting">
              Apply for pilot ↗
            </BookButton>
            <a
              href="mailto:hello@polycloud.in?subject=CA%20Firm%20Pilot"
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
