import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import DashboardMockup from "../../components/DashboardMockup";
import MockupLightbox from "../../components/MockupLightbox";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "CA Firm AI Employee — 18 tools, from GSTR-2B to Form 3CD",
  description:
    "An 18-tool AI employee installed on your firm's laptop: GSTR-2B recon, bank → Tally vouchers, TDS + FVU, compliance calendar, Form 3CD auto-docs, client MIS, receivables, e-invoice IRN, AIS → ITR pre-fill, ICAI peer review pack, MCA21 ROC tracker, audit workbench, advisory copilot. ₹15-45K/mo + Article/partner seats. Live demo at polycloud.in/ca-firm.",
  alternates: { canonical: "/solutions/ca-firm" },
  keywords: [
    "CA firm automation",
    "GSTR-2B reconciliation",
    "bank statement to Tally",
    "TDS 26Q FVU",
    "Form 3CD auto documentation",
    "compliance calendar CA",
    "e-invoice IRN",
    "AIS ITR pre-fill",
    "ICAI peer review",
    "MCA21 ROC tracker",
    "audit workbench",
    "advisory copilot",
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
  tier: "Starter" | "Growth" | "Pro" | "Seats" | "Platform";
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
  {
    num: "11",
    tier: "Pro",
    name: "E-Invoice IRN at scale",
    tagline: "NIC IRP integration. Bulk IRNs. GSP-ready.",
    description:
      "Pulls sales invoices from Tally → submits to NIC IRP → collects IRN + signed QR code per invoice → writes back to Tally-importable JSON. Covers B2B / B2C / SEZ / export supply types, intra-state (CGST+SGST) + inter-state (IGST), HSN + UQC validation. Sandbox-ready today; production goes live when the firm's GSP partnership lands (3-4 month NIC application).",
    deliverable: "E-invoicing automation at threshold-drop scale. ~₹0.20-0.50 per IRN or ₹5K/mo flat.",
  },
  {
    num: "12",
    tier: "Pro",
    name: "AIS → ITR pre-fill",
    tagline: "Notice prevention. Refuses to file on mismatch.",
    description:
      "Loads AIS JSON from income-tax.gov.in → compares category-by-category against client-declared income → classifies mismatches on a 5-tier severity ladder (OK / TRIVIAL / MATERIAL / SIGNIFICANT / NOTICE_RISK). Drafts ITR XML skeleton + auto-generated client clarification letter. Blocks filing when any NOTICE_RISK mismatch exists — that's the moat.",
    deliverable: "Prevents the ITR notice before it happens. ₹2–5K per ITR-3/4/5/6 filing or included in Pro retainer.",
  },
  {
    num: "13",
    tier: "Pro",
    name: "ICAI Peer Review pack",
    tagline: "Phase IV mandate deadline: 31 Dec 2026.",
    description:
      "24-entry working-paper catalogue mapping every SA (210/220/230/240/250/260/315/330/500/530/700) to engagement types + tax-audit + GST-audit variants. Engagement letter generator (7 client types × 7 engagement types). SQC 1 20-item quality-control checklist. Firm readiness score (0–100) that predicts peer review outcome BEFORE booking the review.",
    deliverable: "₹25–50K one-time setup + ₹3K/mo maintenance. Break-even on one avoided review-failure.",
  },
  {
    num: "14",
    tier: "Pro",
    name: "MCA21 ROC tracker",
    tagline: "Every filing. Every fee. Every penalty. Formula-based.",
    description:
      "Deterministic deadline engine for AOC-4 / AOC-4 XBRL / MGT-7 / MGT-7A / DIR-3 KYC / DPT-3 / MSME-1 / Form 11 / Form 8. Fee-slab calculator by paid-up capital + per-form late penalties (₹100/day for corporate filings, flat ₹5K for DIR-3, 12×/18× slab for DPT-3). MCA21 portal scraper stubbed — firm enables with their own DSC + Playwright for filed-history lookups.",
    deliverable: "One prevented DIN deactivation pays for a year of the tool. +₹3–5K/mo per company client.",
  },
  {
    num: "15",
    tier: "Growth",
    name: "Tally ODBC connector",
    tagline: "Live queries. No more XML exports.",
    description:
      "Graceful fallback: ODBC (pyodbc, port 9000) → Tally XML HTTP → deterministic mock. Handles trial balance, ledger-group fuzzy mapping (GST/TDS/Duties auto-classified), voucher extraction. Every other tool pulls live Tally data through this — no more manual Excel exports before each recon run.",
    deliverable: "Saves 30 min/tool-run across 10+ monthly runs. Universal data plumbing.",
  },
  {
    num: "16",
    tier: "Seats",
    name: "Audit workbench (Article assistant)",
    tagline: "Five detectors. Replaces an Article's week.",
    description:
      "Statistical voucher sampling + vendor-ledger scrutiny (duplicates, round amounts, outstanding > 90 days, GSTIN state mismatch) + MSMED 45-day verifier with Section 23 indicative interest + related-party 40A(2)(b) flagging with >15% excess test + stock-count reconciliation (2% qty OR ₹10K value threshold). Every finding generates an auditable task linked to the right working paper code.",
    deliverable: "Article hours per engagement 40 → 15. +₹15K/mo per Article seat. Typical 3-5 seats/firm.",
  },
  {
    num: "17",
    tier: "Seats",
    name: "Advisory copilot (Partner assistant)",
    tagline: "30-second answer with cited precedent.",
    description:
      "Retrieval across firm's own audit log + bundled ICAI/ITAT/CBDT/GST corpus + extensible drop-in JSON. Deterministic synthesis (first-sentence answer + \"must/shall\" assumption extraction) — no hallucinated summaries. Optional Ollama Gemma 4 for tighter synthesis. Every answer ships with top-3 cited precedents + assumptions to verify.",
    deliverable: "Partner saves 2+ hrs/week of research. +₹15–25K/mo per partner seat. Typical 3-5 seats/firm.",
  },
  {
    num: "18",
    tier: "Platform",
    name: "Cross-firm intelligence layer",
    tagline: "Activates at cohort-scale. Honestly gated today.",
    description:
      "Three modules that refuse to run until PolyCloud's federated dataset crosses threshold: (D1) cross-client anomaly detection — vendor fraud + invoice inflation + revenue-recognition patterns; (D3) predictive peer review radar; (D5) cohort benchmarks (the 'Bloomberg for Indian CA' play). Each module's stub logs attempted access — that becomes our signal for demand. No fabricated cross-firm signals, ever.",
    deliverable: "Activates at 10+ firms (D1/D3) and 50+ firms (D5). Premium pricing ₹50K–1L/mo when live.",
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Install + pick tier",
    body:
      "On-site (or remote via AnyDesk). The full stack installs on your primary laptop in 90 minutes — Tally integration included. We walk you through all 18 tools, you pick Starter / Growth / Pro (and whether to add seats), and we configure what you'll use in week 1.",
  },
  {
    week: "Week 2",
    title: "Starter stack live",
    body:
      "Reconciliation engine runs on this month's actual GSTR-2B + Tally data. Vendor follow-up WhatsApp templates approved by Meta. Invoice OCR webhook wired to your clients. ITC risk dashboard on localhost — partners get a morning view. 10 hours collapses to under 2.",
  },
  {
    week: "Week 3",
    title: "Growth tier if you're on it",
    body:
      "Bank statement parser ingests last month's ICICI / HDFC / SBI statements → Tally Prime vouchers. TDS tracker computes 26Q + NSDL FVU file. Compliance calendar sends the first WhatsApp reminder batch across every client. English + Hindi reply classifier active.",
  },
  {
    week: "Week 4",
    title: "Pro tier + handoff",
    body:
      "Form 3CD auto-fills its 6 high-value clauses on one test client. Client MIS dashboard white-labeled with your firm's logo. Receivables automation loads your firm's own outstanding invoices. Every tool lives behind one command the partner runs. Monthly retainer begins.",
  },
];

type BaseTier = {
  name: string;
  price: string;
  unit: string;
  toolCount: string;
  summary: string;
  includes: string[];
  accent?: boolean;
};

const baseTiers: BaseTier[] = [
  {
    name: "Starter",
    price: "₹15 – 25K",
    unit: "per month",
    toolCount: "4 tools",
    summary:
      "The reconciliation stack — enough to collapse a junior's week of data work into an afternoon.",
    includes: [
      "GSTR-2B ↔ Tally reconciliation (every filing cycle)",
      "WhatsApp vendor follow-up (3 Meta-approved templates)",
      "Invoice OCR → Tally voucher draft (92%+ accuracy)",
      "ITC risk dashboard — runs on your laptop",
      "Fortnightly office hours",
    ],
  },
  {
    name: "Growth",
    price: "₹25 – 35K",
    unit: "per month",
    toolCount: "7 tools",
    summary:
      "Starter plus the tools that close the book. Bank → Tally vouchering, quarterly TDS filing, calendar-driven reminders.",
    accent: true,
    includes: [
      "Everything in Starter",
      "Bank statement → Tally voucher (ICICI / HDFC / SBI / Axis / Kotak)",
      "TDS tracker — 26Q + NSDL FVU, Section 201(1A) interest",
      "Compliance calendar + WhatsApp alerts per client",
      "English + Hindi reply classifier (\"done\" / \"ho gaya\" → filed)",
      "Priority support in tax-filing weeks",
    ],
  },
  {
    name: "Pro",
    price: "₹35 – 45K",
    unit: "per month",
    toolCount: "15 tools + audit SKU",
    summary:
      "Growth plus tax audit, receivables, client MIS, e-invoice IRN, AIS → ITR, ICAI peer review, MCA21 ROC, and live Tally queries. The complete practice stack.",
    includes: [
      "Everything in Growth",
      "Form 3CD auto-documentation — 6 high-value clauses filled",
      "White-labeled client MIS dashboard, shipped monthly",
      "Receivables automation with escalation ladder",
      "E-invoice IRN via NIC IRP (sandbox now, live on GSP)",
      "AIS → ITR pre-fill with refuse-to-file mismatch guard",
      "ICAI peer review pack (letters · SQC-1 · readiness score)",
      "MCA21 ROC tracker (AOC-4 / MGT-7 / DIR-3 KYC / DPT-3)",
      "Live Tally data queries (with fallback)",
      "Tax-audit SKU: ₹15–25K per client per season (Jul–Oct)",
    ],
  },
];

type AddOn = {
  name: string;
  price: string;
  unit: string;
  summary: string;
  includes: string[];
};

const addOns: AddOn[] = [
  {
    name: "Intelligence seats",
    price: "+₹15 – 25K",
    unit: "per seat · per month",
    summary:
      "Stack seats on any tier. Articles get an audit workbench, partners get an advisory copilot. Typical 3–5 seats each at a mid-size firm.",
    includes: [
      "Article seat · audit workbench — 5 detectors replace the junior's week",
      "Partner seat · advisory copilot — 30-second precedent-backed answers",
      "Firm's own audit log + bundled ICAI / ITAT / CBDT / GST circulars",
      "Everything runs locally. No cloud, no data egress.",
    ],
  },
  {
    name: "Platform premium",
    price: "₹50K – 1L",
    unit: "per firm · per month · when live",
    summary:
      "Cross-firm intelligence: anomaly detection, predictive peer review radar, industry benchmarks. Gated honestly — activates when the cohort crosses threshold.",
    includes: [
      "Cross-client anomaly detection — activates at 10+ firms",
      "Predictive peer review radar — activates with ICAI observations corpus",
      "Cohort benchmarks (Bloomberg for Indian CA) — activates at 50+ firms",
      "Early-adopter pricing locked before threshold crosses. No fabricated signals.",
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
              A month-end close that used to take <span className="font-medium text-[var(--color-ink)]">8 hours per client</span> now takes <span className="font-medium text-[var(--color-ink)]">45 minutes</span>. GST reconciliation, Tally vouchering, TDS filing, Form 3CD, ROC compliance, e-invoicing, client MIS — all run from one laptop install, with the partner&apos;s sign-off at every step. Starts at <span className="font-medium text-[var(--color-ink)]">₹15K/month</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">
                Start a 30-day pilot ↗
              </BookButton>
              <Link href="/ca-firm" className="btn-secondary">
                See a live client dashboard ↗
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
                The math
              </p>
              <h2 className="text-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] max-w-3xl">
                8 hours per client →{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  45 minutes
                </span>
                .
              </h2>
              <p className="mt-4 text-[17px] md:text-[19px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                Same firm, same clients, same compliance outcome. Same regulator. Less than a tenth of the time.
              </p>
            </div>
          </div>

          {/* Headline impact cards — at-a-glance before the granular table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--color-line)] rounded-2xl overflow-hidden bg-white mb-8 md:mb-10">
            {[
              { label: "Per client · per month", before: "8 hours", after: "45 min", benefit: "91% time saved" },
              { label: "Margin recovered", before: "—", after: "₹10,900", benefit: "per client per month" },
              { label: "At 40 clients", before: "—", after: "₹4.4 L", benefit: "recovered monthly" },
              { label: "Annually across book", before: "—", after: "₹52.8 L", benefit: "billable capacity" },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className={`p-5 md:p-7 ${i < 3 ? "border-b md:border-b-0 md:border-r border-[var(--color-line)]" : ""} ${i < 2 ? "border-r border-[var(--color-line)]" : ""}`}
              >
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
                  {kpi.label}
                </p>
                {kpi.before !== "—" && (
                  <p className="mono text-[13px] text-[#B91C1C] line-through mb-1">
                    was {kpi.before}
                  </p>
                )}
                <p className="text-display text-[28px] md:text-[36px] text-[var(--color-ink)] leading-none mb-2">
                  {kpi.after}
                </p>
                <p className="text-[12px] md:text-[13px] text-[var(--color-text-secondary)] leading-snug">
                  {kpi.benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
            <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)]">
              <span className="font-medium text-[var(--color-ink)]">Step by step — one client&apos;s close.</span> Every row is from a 4-partner Hyderabad firm&apos;s own time-tracking, not ours.
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

          <p className="mt-6 md:mt-8 text-[14px] md:text-[15px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            Either bank the ₹52.8L as margin, or use it to take on 8–12 more clients with the same team. At a ₹18K/month retainer, the math breaks even at two clients — by week one.
          </p>
        </div>
      </section>

      {/* Demo metrics */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">First reconciliation · a real client&apos;s April 2026 data</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {demoMetrics.map((m, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6">
                <div className="text-display text-[clamp(3rem,7vw,5.5rem)] leading-none mb-4">{m.stat}</div>
                <p className="text-[var(--color-text)] font-medium text-[15px] mb-1">{m.label}</p>
                <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] uppercase">{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[13px] text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Ninety seconds on a 5,000-invoice register. Every tool in the stack runs the same way — on your laptop, with a demo cycle you can reproduce before we touch a real client&apos;s books.
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
              One install, opens in any browser. No cloud, no logins, no vendor lock-in. The white-labeled client version ships to each client monthly with your firm&apos;s logo.
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
              See a live client dashboard ↗
            </Link>
            <p className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
              Working demo at polycloud.in/ca-firm — built on synthetic client data
            </p>
          </div>
        </div>
      </section>

      {/* Tools — compact grid, grouped by tier */}
      <section id="tools" className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-14 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / What&apos;s in the box</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-3xl leading-[1]">
                Everything a CA firm runs,{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">one install</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Eighteen tools in three tiers. Each stands alone; together they replace a junior associate&apos;s week of work every week. Every output crosses a partner desk before it ships.
            </p>
          </div>

          {(["Starter", "Growth", "Pro", "Seats", "Platform"] as const).map((tier) => {
            const tierTools = tools.filter((t) => t.tier === tier);
            if (tierTools.length === 0) return null;
            const tierMeta: Record<
              typeof tier,
              { label: string; note: string; accent: string }
            > = {
              Starter: {
                label: "Starter tier",
                note: "The monthly recon stack",
                accent: "var(--color-primary-blue)",
              },
              Growth: {
                label: "Growth tier",
                note: "Closes the book end-to-end",
                accent: "var(--color-primary-blue)",
              },
              Pro: {
                label: "Pro tier",
                note: "The complete practice",
                accent: "var(--color-primary-blue)",
              },
              Seats: {
                label: "Add-on seats",
                note: "Per Article / per partner",
                accent: "var(--color-primary-orange)",
              },
              Platform: {
                label: "Platform premium",
                note: "Activates at cohort-scale",
                accent: "var(--color-primary-orange)",
              },
            };
            const meta = tierMeta[tier];
            return (
              <div key={tier} className="mb-10 md:mb-14 last:mb-0">
                <div className="flex items-baseline gap-4 mb-5">
                  <p
                    className="mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: meta.accent }}
                  >
                    {meta.label}
                  </p>
                  <p className="text-[13px] text-[var(--color-text-secondary)]">
                    {meta.note}
                  </p>
                  <div className="flex-1 h-px bg-[var(--color-line)]" />
                  <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em]">
                    {tierTools.length} {tierTools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
                  {tierTools.map((t) => (
                    <div
                      key={t.num}
                      className="bg-white p-5 md:p-6 hover:bg-[var(--color-surface)] transition-colors"
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em]">
                          {t.num}
                        </span>
                        <h3 className="text-[15px] md:text-[16px] font-medium text-[var(--color-ink)] leading-tight">
                          {t.name}
                        </h3>
                      </div>
                      <p className="text-[13px] text-[var(--color-text-secondary)] leading-snug">
                        {t.tagline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="mt-8 text-[13px] text-[var(--color-text-muted)] tracking-[0.02em] max-w-2xl">
            Need the full spec — what each tool ingests, what it outputs, where it plugs into Tally?{" "}
            <a
              href="https://github.com/polycloudin/ca-firm-toolkit#the-stack"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-primary-blue)] link-underline"
            >
              See the technical breakdown ↗
            </a>
          </p>
        </div>
      </section>

      {/* Proof strip — shipped, not promised */}
      <section className="px-6 md:px-10 py-10 md:py-14 border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-8 flex-wrap">
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-primary-orange)]">
              Shipped · not promised
            </span>
            <span className="text-[13.5px] text-[var(--color-text)]">
              <span className="font-medium">18 tools running today</span>
              <span className="text-[var(--color-text-muted)] mx-2">·</span>
              <span className="font-medium">Installed on-site in 90 minutes</span>
              <span className="text-[var(--color-text-muted)] mx-2">·</span>
              <span className="font-medium">Your data never leaves the firm</span>
            </span>
          </div>
          <Link
            href="/ca-firm"
            className="mono text-[11px] text-[var(--color-primary-blue)] tracking-[0.1em] link-underline"
          >
            See the live dashboard →
          </Link>
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
                Pick a tier. <span className="text-serif-accent">Add seats if you want them</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Three tiers cover the practice. Two optional add-ons stack on top. One flat retainer each month — no per-client, per-filing, or per-seat surprises.
            </p>
          </div>

          {/* Three base tiers — headline grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {baseTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 md:p-10 relative overflow-hidden ${
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
                  <div className="flex items-center justify-between mb-5">
                    <p
                      className={`text-eyebrow ${
                        tier.accent ? "text-white/50" : "text-[var(--color-text-muted)]"
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
                    <span className="text-display text-[clamp(2.5rem,4.5vw,3.5rem)] leading-none">
                      {tier.price}
                    </span>
                  </div>
                  <p
                    className={`mono text-[12px] tracking-[0.1em] mb-4 ${
                      tier.accent ? "text-white/60" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {tier.unit} · {tier.toolCount}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed mb-7 ${
                      tier.accent ? "text-white/75" : "text-[var(--color-text-secondary)]"
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

          {/* Optional add-ons — visually subordinate */}
          <div className="mt-14 md:mt-20">
            <div className="flex items-center gap-4 mb-6">
              <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Optional · stackable on any tier
              </p>
              <div className="flex-1 h-px bg-[var(--color-line)]" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {addOns.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl p-7 md:p-8 bg-[var(--color-surface-warm)] border border-[var(--color-line)]"
                >
                  <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
                    <h3 className="text-display text-[clamp(1.25rem,2vw,1.75rem)] leading-none">
                      {a.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-display text-[clamp(1.25rem,2vw,1.75rem)] leading-none">
                        {a.price}
                      </p>
                      <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em] mt-1">
                        {a.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-5">
                    {a.summary}
                  </p>
                  <ul className="space-y-2">
                    {a.includes.map((inc) => (
                      <li
                        key={inc}
                        className="text-[13px] leading-relaxed text-[var(--color-text)] flex gap-3"
                      >
                        <span className="text-[var(--color-primary-orange)] shrink-0">—</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.1em] text-center">
            Upgrade tiers in place · cancel any time · first 30 days are a pilot, not a contract
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
            First install in week one. Starter stack live in week two. If the first reconciliation cycle doesn&apos;t save you 8+ hours vs baseline, we don&apos;t charge for weeks 3–4. Upgrade to Growth or Pro in place when the next stack earns it.
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
