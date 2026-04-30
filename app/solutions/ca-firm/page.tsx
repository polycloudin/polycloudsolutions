import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "PolyCloud CA Practice OS — 37 tools, Firm + Managed mode",
  description:
    "One web app for the Indian CA practice + SME finance workflow. 37 tools across reconciliation, tax, audit, compliance, client ops. Two modes — Firm (your CA practice signs) or Managed (we sign as your in-house CA). Hosted by PolyCloud · per-firm tenant · live preview at polycloud.in/ca-firm/app.",
  alternates: { canonical: "/solutions/ca-firm" },
  keywords: [
    "CA practice OS",
    "CA firm automation India",
    "GSTR-2B reconciliation",
    "Form 3CD",
    "TDS 26Q FVU",
    "MCA21 ROC AOC-4 MGT-7",
    "Form 15CB DTAA",
    "Form 3CEB transfer pricing",
    "FEMA FC-GPR",
    "ICAI peer review",
    "managed CFO India SME",
    "outsourced CA India",
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Two-mode framing — keep tight; this is positioning, not a full section.
// ─────────────────────────────────────────────────────────────────────────

const modes: {
  name: string;
  audience: string;
  signs: string;
  pricing: string;
  href: string;
  cta: string;
}[] = [
  {
    name: "Firm mode",
    audience: "CA practices · 3–25 staff",
    signs: "Your partners sign UDINs · COP liability stays with you",
    pricing: "From ₹15K/mo",
    href: "#pricing",
    cta: "See Firm pricing",
  },
  {
    name: "Managed mode",
    audience: "SMEs ₹5–100Cr revenue",
    signs: "PolyCloud's in-house CA signs your filings",
    pricing: "Talk to us · scoped per engagement",
    href: "/managed",
    cta: "Open Managed mode →",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// 5 capability groups — every group lists the form codes inline so a CA
// partner can grep for "is Form 15CB / 3CEB / DRC-03 in there." That
// 5-second scan is the domain-trust unlock.
// ─────────────────────────────────────────────────────────────────────────

const capabilityGroups: {
  num: string;
  name: string;
  toolCount: number;
  forms: string;
  blurb: string;
}[] = [
  {
    num: "01",
    name: "Reconciliation & banking",
    toolCount: 6,
    forms:
      "GSTR-2B recon · GSTR-9C reco · bank-statement → Tally · vendor follow-up · invoice OCR · Tally ODBC",
    blurb:
      "Every monthly close ends here. GSTR-2B JSON + Tally exports + bank PDFs (ICICI / HDFC / SBI / Axis / Kotak) → matched-mismatched-leaking exception sheet inside 90 seconds. WhatsApp follow-up to vendors fires from the same engine.",
  },
  {
    num: "02",
    name: "Direct + indirect tax",
    toolCount: 6,
    forms:
      "Form 3CD · 26Q FVU · 24Q · DRC-03 · FC-GPR · 3CEB",
    blurb:
      "TDS deductions pulled from Tally → quarterly 26Q with NSDL FVU file + Section 201(1A) interest math. Form 3CD auto-fills 6 high-value clauses. Transfer pricing 3CEB and FEMA FC-GPR for international clients.",
  },
  {
    num: "03",
    name: "Audit & assurance",
    toolCount: 6,
    forms:
      "Form 3CA-3CD · ITR-6 · statutory audit · CARO 2020 · working papers (SA 230) · client acceptance (SA 220)",
    blurb:
      "Tax audit season collapses from 50–70 hrs/client to 10–15 hrs/client. CARO 2020 auto-fill, Schedule III auto-classification, full SA-230 working-paper trail. ICAI peer-review-ready by construction.",
  },
  {
    num: "04",
    name: "Compliance & lifecycle",
    toolCount: 9,
    forms:
      "AOC-4 XBRL · MGT-7 · DPT-3 · DIR-3 KYC · UDIN · 15CA / 15CB · e-invoice IRN · payroll + Form 16 · fixed assets",
    blurb:
      "Per-client state machine across every statutory deadline. UDIN ledger that mints + persists on every signed output. 15CB with DTAA rate engine for cross-border remittances. Payroll Form 16 + 24Q + PF/ESI math.",
  },
  {
    num: "05",
    name: "Client & firm ops",
    toolCount: 8,
    forms:
      "client MIS (white-label) · receivables · CMA reports · time + WIP · review queue · DMS · advisory copilot · e-signature",
    blurb:
      "White-labeled client MIS shipped monthly to each client. Firm's own receivables chased on a 5-bucket aging cadence. Partner approval queue mints UDINs on sign. Advisory copilot returns 30-second precedent-backed answers from your firm's own audit history + ICAI / ITAT / CBDT corpus.",
  },
];

// 3 firm-internal hygiene tools that sit alongside but don't fit the 5 groups
const firmInternalTools = "+ peer review · CPE / articleship tracking · registrations (entity setup)";

// ─────────────────────────────────────────────────────────────────────────
// 22-step workflow strip — flagship visual. Each step shows AI level +
// who signs. The reviewer who flagged this said it's insightful IFF the
// AI/sign columns are honest about where AI stops. Honest framing below.
// ─────────────────────────────────────────────────────────────────────────

const workflowSteps: {
  cadence: "MONTHLY" | "QUARTERLY" | "ANNUAL" | "AS-NEEDED";
  step: string;
  ai: "EXTRACT" | "DRAFT" | "COMPUTE" | "AUTONOMOUS" | "—";
  who: "Article" | "Senior" | "Partner CA" | "Founder";
}[] = [
  { cadence: "MONTHLY", step: "Capture purchase invoices", ai: "EXTRACT", who: "Article" },
  { cadence: "MONTHLY", step: "Bank statement → Tally vouchers", ai: "DRAFT", who: "Article" },
  { cadence: "MONTHLY", step: "TDS payment (7th)", ai: "COMPUTE", who: "Senior" },
  { cadence: "MONTHLY", step: "GSTR-1 outward supplies (11th)", ai: "DRAFT", who: "Senior" },
  { cadence: "MONTHLY", step: "IMS dashboard actions", ai: "DRAFT", who: "Article" },
  { cadence: "MONTHLY", step: "GSTR-2B 3-way reconciliation", ai: "AUTONOMOUS", who: "Article" },
  { cadence: "MONTHLY", step: "Vendor follow-up WhatsApps", ai: "DRAFT", who: "Article" },
  { cadence: "MONTHLY", step: "GSTR-3B summary + payment (20th)", ai: "DRAFT", who: "Partner CA" },
  { cadence: "MONTHLY", step: "Payroll · PF / ESI / PT + 24Q", ai: "COMPUTE", who: "Senior" },
  { cadence: "MONTHLY", step: "Client MIS dispatch (5th of next)", ai: "AUTONOMOUS", who: "Article" },
  { cadence: "QUARTERLY", step: "TDS return 26Q + NSDL FVU", ai: "COMPUTE", who: "Senior" },
  { cadence: "QUARTERLY", step: "Advance tax computation", ai: "COMPUTE", who: "Partner CA" },
  { cadence: "QUARTERLY", step: "Receivables ageing + chase", ai: "DRAFT", who: "Senior" },
  { cadence: "ANNUAL", step: "Form 3CD tax audit", ai: "DRAFT", who: "Partner CA" },
  { cadence: "ANNUAL", step: "Statutory audit + CARO 2020", ai: "DRAFT", who: "Partner CA" },
  { cadence: "ANNUAL", step: "ITR-6 / 3CB-3CD filing", ai: "DRAFT", who: "Partner CA" },
  { cadence: "ANNUAL", step: "ROC · AOC-4 XBRL (30 Oct)", ai: "DRAFT", who: "Senior" },
  { cadence: "ANNUAL", step: "ROC · MGT-7 (29 Nov)", ai: "DRAFT", who: "Senior" },
  { cadence: "ANNUAL", step: "DIR-3 KYC", ai: "EXTRACT", who: "Article" },
  { cadence: "AS-NEEDED", step: "Notice response (DRC-01 / ASMT-10 / 143(1)(a))", ai: "DRAFT", who: "Partner CA" },
  { cadence: "AS-NEEDED", step: "Form 15CB cross-border + DTAA", ai: "COMPUTE", who: "Partner CA" },
  { cadence: "AS-NEEDED", step: "Transfer pricing 3CEB / FEMA FC-GPR", ai: "DRAFT", who: "Partner CA" },
];

const aiLevelMeta: Record<
  "EXTRACT" | "DRAFT" | "COMPUTE" | "AUTONOMOUS" | "—",
  { label: string; color: string; bg: string }
> = {
  EXTRACT: { label: "Extract", color: "#1A5FD4", bg: "#EEF4FF" },
  DRAFT: { label: "AI drafts", color: "#B45309", bg: "#FFFBEB" },
  COMPUTE: { label: "Compute", color: "#15803D", bg: "#ECFDF3" },
  AUTONOMOUS: { label: "Autonomous", color: "#9D174D", bg: "#FDF2F8" },
  "—": { label: "Manual", color: "var(--color-text-muted)", bg: "var(--color-surface)" },
};

// ─────────────────────────────────────────────────────────────────────────
// 4-step "How it works" — specific, not generic SaaS template.
// ─────────────────────────────────────────────────────────────────────────

const howItWorks: { num: string; title: string; time: string; body: string }[] = [
  {
    num: "01",
    title: "Onboard",
    time: "~5 minutes",
    body:
      "Paste your firm GSTIN + Tally export + ICAI Membership No. We provision a per-firm tenant under polycloud.in/ca-firm/app/<your-slug>. First reconciliation runs against last month's data within 60 minutes.",
  },
  {
    num: "02",
    title: "Run",
    time: "Daily",
    body:
      "Auto-recon every morning. Exception inbox sorts mismatches by severity. WhatsApp templates queued for vendor follow-up. Compliance calendar nudges every client deadline (GSTR-1 11th · TDS 7th · GSTR-3B 20th).",
  },
  {
    num: "03",
    title: "Sign",
    time: "Per output",
    body:
      "Every UDIN-bearing output gates on partner sign-off. The OS drafts, you review, you sign. UDIN minted automatically and persisted to your firm's ledger. Your COP liability is unchanged.",
  },
  {
    num: "04",
    title: "Bill",
    time: "Monthly",
    body:
      "One flat invoice on the 1st. Includes the OS, the in-house support, the Meta-template renewals, the office hours. No per-filing surprise. No tool licences to track.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Pricing — flat anchor per tier so co-partners can budget.
// Add-ons collapsed to one line. Managed pricing → /managed sidebar.
// ─────────────────────────────────────────────────────────────────────────

const tiers: {
  name: string;
  price: string;
  anchor: string;
  summary: string;
  includes: string[];
  recommended?: boolean;
}[] = [
  {
    name: "Starter",
    price: "₹15K /month",
    anchor: "10 clients · 1 article seat",
    summary: "The reconciliation stack — enough to collapse a junior's week of data work into an afternoon.",
    includes: [
      "GSTR-2B ↔ Tally reconciliation (every filing cycle)",
      "WhatsApp vendor follow-up (3 Meta-approved templates)",
      "Invoice OCR → Tally voucher draft",
      "Local ITC risk dashboard at /clients/[id]",
      "Fortnightly office hours",
    ],
  },
  {
    name: "Growth",
    price: "₹30K /month",
    anchor: "25 clients · 3 article seats",
    summary: "Starter plus the tools that close the book — bank → Tally vouchering, quarterly TDS, calendar-driven reminders.",
    recommended: true,
    includes: [
      "Everything in Starter",
      "Bank statement → Tally voucher (ICICI / HDFC / SBI / Axis / Kotak)",
      "TDS tracker — 26Q + NSDL FVU + Section 201(1A) interest",
      "Compliance calendar + WhatsApp alerts per client",
      "English + Hindi reply classifier (\"done\" / \"ho gaya\" → filed)",
      "Priority support in tax-filing weeks",
    ],
  },
  {
    name: "Pro",
    price: "₹55K /month",
    anchor: "60 clients · 5 article seats",
    summary: "Every workflow a mid-size practice runs — tax audit, client MIS, receivables, e-invoice, payroll, UDIN, notice response, CARO, transfer pricing, FEMA, peer review, CPE.",
    includes: [
      "Everything in Growth",
      "Form 3CD auto-fill + Schedule III auto-classification",
      "Statutory audit + CARO 2020 + working papers (SA 230)",
      "White-labeled client MIS shipped monthly",
      "MCA21 ROC tracker + DIR-3 KYC",
      "UDIN ledger + notice response engine (DRC / ASMT / 143)",
      "Form 15CB with DTAA rate engine + 3CEB + FEMA",
      "Receivables automation · time + WIP · partner review queue",
      "Tax-audit SKU: ₹20K per client per season (Jul–Oct)",
    ],
  },
];

const addOnsLine =
  "+ Optional add-ons: Intelligence seats (Article workbench / Partner advisory copilot · ₹15-25K per seat) · Platform premium (cross-firm anomaly + cohort benchmarks · activates at 10+ firms).";

// ─────────────────────────────────────────────────────────────────────────
// Proof strip — keeps the canonical 3 facts + plain-English data residency
// + the two live-product links.
// ─────────────────────────────────────────────────────────────────────────

const proofFacts = [
  { label: "Tools running today", value: "37" },
  { label: "Onboarding", value: "~5 minutes · we provision your tenant" },
  { label: "Local piece", value: "Tally Bridge agent · runs where Tally runs" },
  {
    label: "Data residency",
    value: "AWS Mumbai · per-firm tenant · your firm holds decryption keys",
  },
];

// ─────────────────────────────────────────────────────────────────────────

export default function CaFirmSolution() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* 01 / Hero ──────────────────────────────────────────────────── */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(244, 107, 44, 0.05) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="anim-fade-up flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Solution · CA Practice OS
            </p>
          </div>
          <h1 className="anim-fade-up delay-1 text-display text-[clamp(2.25rem,10vw,9rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            Your CA firm,{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              on autopilot
            </span>
            .
          </h1>
          <div className="anim-fade-up delay-2 grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              <span className="font-medium text-[var(--color-ink)]">8 hours → 45 minutes</span>{" "}
              <span className="text-[var(--color-text-muted)]">per monthly close per client.</span>{" "}
              37 workflows live across reconciliation, tax, audit, compliance and client ops. One web app, two modes —{" "}
              <span className="font-medium text-[var(--color-ink)]">Firm</span> (your CA practice signs UDINs) or{" "}
              <span className="font-medium text-[var(--color-ink)]">Managed</span> (we sign as your in-house CA). Hosted by PolyCloud · per-firm tenant · starts at ₹15K/month.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <BookButton variant="primary" topic="consulting">
                Book a 30-min call ↗
              </BookButton>
              <Link
                href="/ca-firm/app"
                className="text-[14px] text-[var(--color-text-secondary)] link-underline hover:text-[var(--color-ink)]"
              >
                or browse the live OS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / Two modes ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-12 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-[0.6fr_1fr_1fr] gap-6 md:gap-10">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-3">
                Pick your mode
              </p>
              <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight">
                Same OS.<br />
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  Different signers
                </span>
                .
              </h2>
            </div>
            {modes.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-xl border border-[var(--color-line)] p-6 md:p-8 flex flex-col"
              >
                <h3 className="text-display text-[clamp(1.25rem,1.8vw,1.75rem)] mb-4">
                  {m.name}
                </h3>
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
                  Audience
                </p>
                <p className="text-[14px] text-[var(--color-ink)] mb-4">{m.audience}</p>
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
                  Who signs
                </p>
                <p className="text-[14px] text-[var(--color-ink)] mb-4">{m.signs}</p>
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
                  Pricing
                </p>
                <p className="text-[14px] text-[var(--color-ink)] mb-6">{m.pricing}</p>
                <Link
                  href={m.href}
                  className="mt-auto text-[13px] font-medium link-underline text-[var(--color-primary-blue)]"
                >
                  {m.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 / What's in the box ─────────────────────────────────────── */}
      <section id="capabilities" className="px-6 md:px-10 py-16 md:py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                01 / What&apos;s in the box
              </p>
              <h2 className="text-[clamp(1.875rem,5vw,4rem)] max-w-3xl leading-[1.05]">
                37 tools, 5 capability groups,{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  one operator console
                </span>
                .
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Every group lists the form codes inline so you can verify in five seconds — Form 3CD, 26Q, AOC-4 XBRL, 15CB, 3CEB. We&apos;ve sat with CA partners through enough closes to know which forms matter.{" "}
              <Link
                href="/ca-firm/app"
                className="link-underline text-[var(--color-primary-blue)]"
              >
                See all 37 in the live OS →
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            {capabilityGroups.map((g) => (
              <div
                key={g.num}
                className="bg-white rounded-xl border border-[var(--color-line)] p-7 md:p-9 grid md:grid-cols-[0.5fr_1.4fr_1fr] gap-6 md:gap-10 card-hover"
              >
                <div>
                  <p className="mono text-xs text-[var(--color-primary-orange)] mb-3">
                    {g.num} / {g.toolCount} tools
                  </p>
                  <h3 className="text-display text-[clamp(1.25rem,2vw,1.65rem)] leading-tight">
                    {g.name}
                  </h3>
                </div>
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
                    Forms / workflows
                  </p>
                  <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">
                    {g.forms}
                  </p>
                </div>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                  {g.blurb}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] text-[var(--color-text-muted)] text-center">
            {firmInternalTools}
          </p>

          {/* Flagship visual — 22-step workflow strip with honest AI/sign columns */}
          <div className="mt-16 md:mt-24">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-eyebrow text-[var(--color-text-secondary)] mb-3">
                  The 22-step Indian CA cycle, modelled
                </p>
                <h3 className="text-[clamp(1.25rem,2.5vw,2rem)] leading-tight max-w-2xl">
                  Honest about{" "}
                  <span className="text-serif-accent text-[var(--color-primary-blue)]">
                    where AI stops
                  </span>{" "}
                  on every step.
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {(["EXTRACT", "DRAFT", "COMPUTE", "AUTONOMOUS"] as const).map((k) => {
                  const m = aiLevelMeta[k];
                  return (
                    <span
                      key={k}
                      className="mono uppercase tracking-[0.1em] px-2 py-1 rounded"
                      style={{ color: m.color, background: m.bg }}
                    >
                      {m.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_2.4fr_1fr_1fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                {["Cadence", "Step", "AI level", "Owner"].map((h) => (
                  <div
                    key={h}
                    className="px-4 md:px-5 py-2.5 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]"
                  >
                    {h}
                  </div>
                ))}
              </div>
              {workflowSteps.map((s, i) => {
                const m = aiLevelMeta[s.ai];
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1fr_2.4fr_1fr_1fr] ${
                      i < workflowSteps.length - 1 ? "border-b border-[var(--color-line)]" : ""
                    }`}
                  >
                    <div className="px-4 md:px-5 py-3 mono text-[11px] tracking-[0.06em] text-[var(--color-text-muted)] uppercase self-center">
                      {s.cadence}
                    </div>
                    <div className="px-4 md:px-5 py-3 text-[13.5px] text-[var(--color-ink)] self-center">
                      {s.step}
                    </div>
                    <div className="px-4 md:px-5 py-3 self-center">
                      <span
                        className="mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded"
                        style={{ color: m.color, background: m.bg }}
                      >
                        {m.label}
                      </span>
                    </div>
                    <div className="px-4 md:px-5 py-3 mono text-[11px] tracking-[0.04em] text-[var(--color-text-secondary)] self-center">
                      {s.who}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 mono text-[11px] text-[var(--color-text-muted)] tracking-[0.08em]">
              Source: <code className="font-mono">lib/workflow.ts</code> in the toolkit. Live-OS view at{" "}
              <Link href="/ca-firm/app" className="link-underline text-[var(--color-primary-blue)]">
                polycloud.in/ca-firm/app/workflow
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 04 / How it works ──────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-32 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                02 / How it works
              </p>
              <h2 className="text-[clamp(1.875rem,5vw,4rem)] max-w-2xl leading-[1.05]">
                Onboard. Run. <span className="text-serif-accent">Sign.</span> Bill.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Four steps from your first Tally export to your first signed UDIN. Partner sign-off gates every output — your COP liability is unchanged.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {howItWorks.map((s) => (
              <div
                key={s.num}
                className="bg-white rounded-xl border border-[var(--color-line)] p-7 md:p-8 flex flex-col"
              >
                <p className="mono text-xs text-[var(--color-primary-orange)] mb-4 tracking-[0.12em]">
                  {s.num}
                </p>
                <h3 className="text-display text-[clamp(1.25rem,1.8vw,1.65rem)] mb-1 leading-tight">
                  {s.title}
                </h3>
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-4">
                  {s.time}
                </p>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 / Pricing ───────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 md:px-10 py-16 md:py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                03 / Pricing · Firm mode
              </p>
              <h2 className="text-[clamp(1.875rem,5vw,4rem)] leading-[1.05] max-w-3xl">
                Three flat anchors.{" "}
                <span className="text-serif-accent">No per-filing surprise</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              One monthly invoice. Cancel any month. Running an SME instead of a CA practice?{" "}
              <Link href="/managed" className="link-underline text-[var(--color-primary-blue)]">
                See Managed mode →
              </Link>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl p-8 md:p-10 relative overflow-hidden ${
                  t.recommended
                    ? "text-white"
                    : "bg-white border border-[var(--color-line)]"
                }`}
                style={t.recommended ? { backgroundColor: "#0A0A0A" } : undefined}
              >
                {t.recommended && (
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
                        t.recommended
                          ? "text-white/55"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {t.name}
                    </p>
                    {t.recommended && (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary-orange)]">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="text-display text-[clamp(2rem,3.5vw,3rem)] leading-none mb-1">
                    {t.price}
                  </p>
                  <p
                    className={`mono text-[12px] tracking-[0.08em] mb-2 ${
                      t.recommended ? "text-white/65" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {t.anchor}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed mb-7 ${
                      t.recommended
                        ? "text-white/80"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {t.summary}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {t.includes.map((inc) => (
                      <li
                        key={inc}
                        className={`text-[13px] leading-relaxed flex gap-3 ${
                          t.recommended ? "text-white/85" : "text-[var(--color-text)]"
                        }`}
                      >
                        <span className="text-[var(--color-primary-orange)] shrink-0">—</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <BookButton
                    variant={t.recommended ? "light-primary" : "primary"}
                    topic="consulting"
                  >
                    Start with {t.name} ↗
                  </BookButton>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            {addOnsLine}
          </p>
        </div>
      </section>

      {/* 06 / Proof ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-12 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-10 mb-10">
            {proofFacts.map((f) => (
              <div key={f.label}>
                <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] mb-2">
                  {f.label}
                </p>
                <p className="text-[14px] md:text-[15px] font-medium leading-snug text-[var(--color-ink)]">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-line)] pt-6 flex flex-wrap items-center gap-6 justify-between">
            <p className="mono text-[11px] tracking-[0.1em] text-[var(--color-text-muted)]">
              Real product, synthetic data. Browse before you book.
            </p>
            <div className="flex flex-wrap gap-4 text-[13px]">
              <Link
                href="/ca-firm/app"
                className="link-underline font-medium text-[var(--color-primary-blue)]"
              >
                Open the live operator console →
              </Link>
              <Link
                href="/ca-firm"
                className="link-underline font-medium text-[var(--color-primary-blue)]"
              >
                See the white-label client dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 07 / CTA ───────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/55 mb-8">04 / Next step</p>
          <h2 className="text-display text-[clamp(2rem,6vw,5rem)] mb-10 leading-[0.95]">
            Two more pilot CA firms{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">
              this quarter
            </span>
            .
          </h2>
          <p className="text-white/65 text-[17px] max-w-2xl leading-relaxed mb-10">
            Onboarding takes five minutes — paste GSTIN + Tally export and your tenant is live. Starter stack runs your first reconciliation cycle inside 60 minutes. If it doesn&apos;t save you 8+ hours vs baseline that month, weeks 3-4 are free.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <BookButton variant="light-primary" topic="consulting">
              Book a 30-min call ↗
            </BookButton>
            <a
              href="mailto:hello@polycloud.in?subject=CA%20Firm%20Pilot"
              className="text-[14px] text-white/65 link-underline hover:text-white"
            >
              or email hello@polycloud.in
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
