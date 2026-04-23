import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import DashboardMockup from "../../components/DashboardMockup";
import MockupLightbox from "../../components/MockupLightbox";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "CA Firm AI Employee — 10 tools, from GSTR-2B to Form 3CD",
  description:
    "A 10-tool AI employee installed on your firm's laptop: GSTR-2B recon, bank-statement → Tally vouchers, TDS 26Q + FVU, compliance calendar, Form 3CD auto-docs, client MIS dashboard, receivables chasing. ₹15-45K/month + per-audit SKU. Live demo at polycloud.in/ca-firm.",
  alternates: { canonical: "/solutions/ca-firm" },
  keywords: [
    "CA firm automation",
    "GSTR-2B reconciliation",
    "bank statement to Tally",
    "TDS 26Q FVU",
    "Form 3CD auto documentation",
    "compliance calendar CA",
    "Tally automation",
    "GST compliance automation",
    "AI for CA firms",
    "invoice OCR Tally",
    "client MIS dashboard",
    "receivables automation",
    "WhatsApp vendor follow-up",
  ],
};

type Tool = {
  num: string;
  tier: "Starter" | "Growth" | "Pro";
  name: string;
  tagline: string;
  description: string;
  deliverable: string;
};

const tools: Tool[] = [
  {
    num: "01",
    tier: "Starter",
    name: "Reconciliation engine",
    tagline: "GSTR-2B ↔ Tally purchase register in minutes.",
    description:
      "Ingests GSTR-2B JSON from the GST portal and the purchase register from Tally, matches on GSTIN + invoice number + amount with tolerance, outputs a 5-sheet Excel: Summary, Matched, Mismatches, Only-in-Books, Vendor Follow-up. Every row tagged with the reason and the ITC-at-risk rupee amount.",
    deliverable: "One Excel file per filing cycle. Runs in 90 seconds on 5,000-invoice registers.",
  },
  {
    num: "02",
    tier: "Starter",
    name: "WhatsApp vendor follow-up",
    tagline: "Three templates, Meta-approved, one command to send.",
    description:
      "Pulls the Vendor Follow-up sheet from the reconciliation output and generates personalized WhatsApp messages per vendor — missing invoice request, amount mismatch query, GSTIN correction ask. Templates are pre-approved by Meta. Every send is logged to a CSV audit trail.",
    deliverable: "Automated vendor outreach. CAs stop chasing invoices over email.",
  },
  {
    num: "03",
    tier: "Starter",
    name: "Invoice OCR to Tally",
    tagline: "Client sends a photo. You get a voucher draft.",
    description:
      "Clients WhatsApp invoice images to a dedicated business number. OCR extracts the raw text; a frontier vision-LLM structures vendor, GSTIN, invoice number, HSN codes, line items, and taxes. A balanced double-entry Tally XML voucher is drafted and queued for CA review before posting. Accuracy: 92%+ on 25 real Indian invoices in sprint testing.",
    deliverable: "No more manual data entry. Clients contribute to bookkeeping without training.",
  },
  {
    num: "04",
    tier: "Starter",
    name: "ITC risk dashboard",
    tagline: "One screen. Real-time. Runs locally.",
    description:
      "FastAPI backend + SQLite + Next.js frontend, installed on the CA's laptop. Shows monthly ITC claimed vs available vs at-risk, top-10 leaking vendors, trend chart across the last 12 months. No data leaves the firm — everything runs on localhost.",
    deliverable: "Partners get a morning dashboard. CFO clients can log in to their own slice.",
  },
  {
    num: "05",
    tier: "Growth",
    name: "Bank statement → Tally voucher",
    tagline: "Bank PDF in. Tally Prime XML out.",
    description:
      "Ingests ICICI CSV, HDFC XLSX, SBI text, Axis/Kotak statements (plus RBI Account Aggregator JSON). Classifies each debit into 6 categories — vendor payment, salary, GST challan, loan EMI, inter-account, bank charges — using Gemma 4 locally or a deterministic rule engine. Joins vendor payments back to the GSTR-2B recon (GSTIN → fuzzy name → amount). Outputs Tally Prime import XML + a CA review spreadsheet with yellow-highlighted edge cases.",
    deliverable: "3–5 hrs/month/client of manual voucher entry collapses to a one-click review.",
  },
  {
    num: "06",
    tier: "Growth",
    name: "TDS tracker + 26Q FVU draft",
    tagline: "Deductions in. NSDL-ready FVU out.",
    description:
      "Pulls TDS deductions from Tally across sections 194A/C/H/J/I/Q, computes quarterly 26Q, generates the NSDL FVU upload file with proper BATCHA / CD / DD / BATCHB records and MD5 checksum. Flags PAN mismatches (no-PAN → 20% rate), short deductions, and calculates Section 201(1A) interest on late deposits (1.5%/month, calendar-month math, March → 30 April CBDT extension).",
    deliverable: "4–6 hrs/quarter per company client gone. Interest-penalty surprises gone.",
  },
  {
    num: "07",
    tier: "Growth",
    name: "Compliance calendar + WhatsApp alerts",
    tagline: "Every deadline, every client, every month. No spreadsheet.",
    description:
      "Per-client state machine for GSTR-1 (11th), GSTR-3B (20th / QRMP 22nd), TDS deposit (7th), advance tax (15 Jun/Sep/Dec/Mar), 26Q return, ROC AOC-4 (30 Oct), MGT-7 (29 Nov), ITR (31 Jul / 31 Oct), GSTR-9/9C (31 Dec). WhatsApp reminders escalate through UPCOMING → DUE_SOON → REMINDED → CONFIRMED → FILED / OVERDUE. Inbound reply classifier understands English + Hindi (\"done\" / \"ho gaya\" / \"kal karenge\") via Gemma 4 local, keyword fallback when offline.",
    deliverable: "Partner sees month-at-a-glance for every client. Zero missed deadlines.",
  },
  {
    num: "08",
    tier: "Pro",
    name: "Form 3CD auto-documentation",
    tagline: "44 clauses. 6 auto-filled. 38 honestly scaffolded.",
    description:
      "Pulls Tally trial balance + ledgers to auto-populate the six clauses that eat 70% of audit hours — cl.18 depreciation (block-wise, WDV, half-year rule), cl.21(a) disallowable u/s 40(a)/40A(3)/43B, cl.22 MSMED 45-day Section 23, cl.23 40A(2)(b) related-party (flags >15% over market), cl.27(a) ITC, cl.34 TDS compliance with interest. The other 38 clauses are modelled + marked MANUAL_ONLY — we're honest about what's not automated. Exports JSON (IT-portal ready), HTML (browser-print), XLSX (yellow/red status review).",
    deliverable: "Tax audit season compresses from 50–70 hrs/client to 10–15 hrs/client.",
  },
  {
    num: "09",
    tier: "Pro",
    name: "Client MIS dashboard",
    tagline: "White-labeled. Multi-tenant. Shipped monthly.",
    description:
      "One SQLite per client at ~/.ca-firm/clients/<slug>/mis.db — zero cross-tenant leakage. Monthly snapshot of revenue, net profit, GST liability vs paid, TDS deducted vs deposited, closing cash. 30/60/90-day cash flow projection using 6-month rolling average + Indian seasonality (Mar advance-tax, Nov Diwali spike, Sep-Oct inventory build). Confidence score + HEALTHY / ADEQUATE / TIGHT / CRITICAL tier. White-labeled with the firm's logo + colours.",
    deliverable: "Client CFOs stop calling the partner weekly. See a live demo at polycloud.in/ca-firm.",
  },
  {
    num: "10",
    tier: "Pro",
    name: "Receivables automation",
    tagline: "The firm's own invoices, chased on a cadence.",
    description:
      "Ingests firm-raised invoices from Zoho Books / QuickBooks / Tally exports. Five aging buckets (0–30 / 31–45 / 46–60 / 61–75 / 76+), each with a Meta-approval-style WhatsApp template — polite nudge, firm reminder (3-day ultimatum), urgent (48-hour ultimatum), partner escalation (internal, no message). 7-day cooldown with escalation-override semantics. Partner dashboard surfaces top debtors + recovery trend.",
    deliverable: "15–25% fee leakage to chase-fatigue recovered. Pays for itself on the first stuck invoice.",
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

const pricingTiers: Array<{
  name: string;
  price: string;
  unit: string;
  toolCount: string;
  summary: string;
  includes: string[];
  accent?: boolean;
}> = [
  {
    name: "Starter",
    price: "₹15 – 25K",
    unit: "per month",
    toolCount: "Tools 01 – 04",
    summary:
      "The reconciliation stack — enough to collapse a junior's week of data work into an afternoon.",
    includes: [
      "GSTR-2B ↔ Tally recon (5-sheet Excel, every filing cycle)",
      "WhatsApp vendor follow-up (3 Meta-approved templates)",
      "Invoice OCR → Tally XML voucher (92%+ accuracy)",
      "Local ITC risk dashboard — FastAPI + SQLite, runs on your laptop",
      "Unified ca-firm CLI, one-command updates",
      "Fortnightly office hours",
    ],
  },
  {
    name: "Growth",
    price: "₹25 – 35K",
    unit: "per month",
    toolCount: "Tools 01 – 07",
    summary:
      "Starter plus the tools that close the book. Bank → Tally vouchering, quarterly TDS filing, calendar-driven reminders.",
    accent: true,
    includes: [
      "Everything in Starter",
      "Bank statement → Tally Prime voucher XML (ICICI / HDFC / SBI / Axis / Kotak / AA)",
      "TDS tracker — 26Q + NSDL FVU file, Section 201(1A) interest math",
      "Compliance calendar with per-client state machine + WhatsApp alerts",
      "English + Hindi reply classifier (\"done\" / \"ho gaya\" → filed)",
      "Priority support in tax-filing weeks",
    ],
  },
  {
    name: "Pro",
    price: "₹35 – 45K",
    unit: "per month",
    toolCount: "All 10 tools + audit SKU",
    summary:
      "Growth plus tax audit, receivables, and a white-labeled client MIS. Add-on: ₹15–25K per tax-audit engagement during season.",
    includes: [
      "Everything in Growth",
      "Form 3CD auto-documentation — 6 high-value clauses auto-filled, 38 scaffolded",
      "Client MIS dashboard — multi-tenant, per-client SQLite, white-labeled",
      "Receivables automation — aging buckets + WhatsApp escalation ladder",
      "Dedicated Slack channel + partner pairing for the first two audit cycles",
      "Tax-audit SKU (₹15–25K per client per season, Jul – Oct)",
    ],
  },
];

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
              A ten-tool AI employee installed on your firm&apos;s laptop — GSTR-2B recon, WhatsApp vendor follow-up, invoice OCR, bank → Tally vouchering, TDS 26Q + FVU, compliance calendar, Form 3CD auto-draft, multi-tenant client MIS, and receivables chasing. One unified CLI. 90-minute install. Three tiers from ₹15K to ₹45K/month. You stop doing data entry. Juniors stop chasing invoices. Partners get their evenings back.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">
                Pilot on your firm ↗
              </BookButton>
              <Link href="/ca-firm" className="btn-secondary">
                See a live demo ↗
              </Link>
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
              FastAPI + SQLite bundled with a single install. Partners open localhost in a browser — no cloud, no accounts, no vendor lock-in. The white-labeled client MIS variant ships monthly to each client.
            </p>
          </div>
          <MockupLightbox caption="ITC risk dashboard · runs locally on the firm's laptop. Click to collapse.">
            <DashboardMockup />
          </MockupLightbox>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/ca-firm"
              className="btn-primary !text-[13px] !px-5 !py-2.5"
            >
              See the client MIS live ↗
            </Link>
            <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
              Live demo with synthetic data at polycloud.in/ca-firm — same engine, real Chart.js
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / The stack</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-3xl leading-[1]">
                Ten tools, one{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">install</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Unified under a single <code className="mono text-[13px] bg-[var(--color-line)] px-1.5 py-0.5 rounded">ca-firm</code> CLI — 12 subcommands across three tiers. Each tool stands alone; together they replace one junior associate&apos;s week of work every week.
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
                    <div className="flex items-center gap-3 mb-4">
                      <p className="mono text-xs text-[var(--color-primary-orange)]">{t.num} / Tool</p>
                      <span className="mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-text-muted)]">
                        {t.tier}
                      </span>
                    </div>
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
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Pricing</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] leading-[1] max-w-3xl">
                Three tiers. <span className="text-serif-accent">One retainer per tier</span>. No surprises.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Start at Starter, upgrade in place when the next stack earns it. Every tool ships as a signed install — no subscription lock-in.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 md:p-10 relative overflow-hidden ${
                  tier.accent
                    ? "text-white"
                    : "bg-white border border-[var(--color-line)]"
                }`}
                style={tier.accent ? { backgroundColor: "#0A0A0A" } : undefined}
              >
                {tier.accent && (
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(244, 107, 44, 0.25) 0%, transparent 60%)",
                    }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className={`text-eyebrow ${
                        tier.accent
                          ? "text-white/50"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {tier.name}
                    </p>
                    {tier.accent && (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
                      {tier.price}
                    </span>
                  </div>
                  <p
                    className={`mono text-[12px] tracking-[0.1em] mb-2 ${
                      tier.accent ? "text-white/60" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {tier.unit} · {tier.toolCount}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed mb-7 ${
                      tier.accent
                        ? "text-white/75"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {tier.summary}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {tier.includes.map((inc) => (
                      <li
                        key={inc}
                        className={`text-[13px] leading-relaxed flex gap-3 ${
                          tier.accent ? "text-white/80" : "text-[var(--color-text)]"
                        }`}
                      >
                        <span className="text-[var(--color-primary-orange)] shrink-0">—</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <BookButton
                    variant={tier.accent ? "light-primary" : "primary"}
                    topic="consulting"
                  >
                    Start with {tier.name} ↗
                  </BookButton>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] text-center">
            Tax-audit SKU adds ₹15–25K per client per season (Jul–Oct) on Pro · cancel any time
          </p>
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
