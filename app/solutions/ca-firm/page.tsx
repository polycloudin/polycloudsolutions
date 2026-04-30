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
  engagement: string;
}[] = [
  {
    name: "Firm mode",
    audience: "CA practices · 3–25 staff",
    signs: "Your partners sign UDINs · COP liability stays with you",
    engagement: "Scoped to your firm size on a 30-min call",
  },
  {
    name: "Managed mode",
    audience: "SMEs ₹5–100Cr revenue",
    signs: "PolyCloud's in-house CA signs your filings",
    engagement: "Scoped per engagement on a 30-min call",
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
// AI vs CA split — replaces the generic 4-step. The point is to make the
// human/judgment vs machine/mechanical line visible. Lifted from the MAP
// walkthrough — this is the bridge between "What's in the box" and Pricing.
// ─────────────────────────────────────────────────────────────────────────

const aiHandles: { title: string; body: string }[] = [
  {
    title: "Reads the invoice",
    body: "Vision extraction — vendor, GSTIN, line items, CGST/SGST/IGST split.",
  },
  {
    title: "Matches against your books",
    body: "Fuzzy invoice-number match, ₹1 amount tolerance, GSTIN-grouped 3-way recon against Tally + GSTR-2B.",
  },
  {
    title: "Computes the math",
    body: "Tax payable, ITC available, RCM, Section 50 interest, DTAA rates, e-invoice IRN payload.",
  },
  {
    title: "Drafts the document",
    body: "GSTR-1 · GSTR-3B summary · 26Q FVU · Form 3CD scaffolding · CARO 2020 working papers · 15CB.",
  },
  {
    title: "Sends the follow-up",
    body: "WhatsApp blast to mismatched vendors with the exact discrepancy. English + Hindi reply classifier.",
  },
];

const caHandles: { title: string; body: string }[] = [
  {
    title: "Signs the GSTR-3B submit",
    body: "Hard-locked from 2B since June 2025. Your name on the irreversible filing. We do not sign for you.",
  },
  {
    title: "Mints the UDIN",
    body: "Form 3CD · CARO · 15CB · statutory audit reports. Partner reviews, partner clicks, UDIN minted.",
  },
  {
    title: "Decides on flagged exceptions",
    body: "Suspended GSTIN vendors · disputed amounts · advisory opinions. The queue surfaces them; you call it.",
  },
  {
    title: "Responds to notices",
    body: "AI drafts the reply (DRC-01 / ASMT-10 / 143(1)(a)). You decide the strategy and represent.",
  },
  {
    title: "Gives actual advice",
    body: "Tax planning · structuring · due diligence · representation — the work clients pay you for.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Proof strip — canonical 4 facts + the single "Open the live OS" CTA.
// Pricing tiers and the /managed sub-page were removed per VK call —
// engagement is consultative; both modes scope on a 30-min call.
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
              One web app for the day-to-day finance work of an Indian SME — and Chartered Accountants click{" "}
              <span className="font-medium text-[var(--color-ink)]">Sign</span> on the things only a CA is legally allowed to sign. Two modes —{" "}
              <span className="font-medium text-[var(--color-ink)]">Firm</span> (your practice signs UDINs) or{" "}
              <span className="font-medium text-[var(--color-ink)]">Managed</span> (we sign as your in-house CA).
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
                  Engagement
                </p>
                <p className="text-[14px] text-[var(--color-ink)]">{m.engagement}</p>
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

        </div>
      </section>

      {/* 02 / The honest split — what AI does vs what the CA does ──── */}
      <section className="px-6 md:px-10 py-16 md:py-32 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                02 / The honest split
              </p>
              <h2 className="text-[clamp(1.875rem,5vw,4rem)] max-w-2xl leading-[1.05]">
                What the AI does. <span className="text-serif-accent">What the CA does.</span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We don&apos;t replace the Chartered Accountant. We replace the typing. UDIN-bearing outputs always gate on partner sign-off — your COP liability is unchanged.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
            {/* AI side */}
            <div className="bg-[#FFFBEB] p-8 md:p-10">
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#B45309] mb-3">
                AI handles
              </p>
              <h3 className="text-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight mb-7">
                The mechanical work
              </h3>
              <ul className="space-y-5">
                {aiHandles.map((item) => (
                  <li key={item.title}>
                    <p className="text-[15px] font-medium text-[var(--color-ink)] mb-1">
                      {item.title}
                    </p>
                    <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            {/* CA side */}
            <div className="bg-[#FDF2F8] p-8 md:p-10">
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#9D174D] mb-3">
                Partner CA handles
              </p>
              <h3 className="text-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight mb-7">
                The judgment
              </h3>
              <ul className="space-y-5">
                {caHandles.map((item) => (
                  <li key={item.title}>
                    <p className="text-[15px] font-medium text-[var(--color-ink)] mb-1">
                      {item.title}
                    </p>
                    <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 03 / Proof ─────────────────────────────────────────────────── */}
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
              Real product · synthetic data · click around before you talk to us
            </p>
            <Link
              href="/ca-firm/app"
              className="text-[13px] font-medium link-underline text-[var(--color-primary-blue)]"
            >
              Open the live OS →
            </Link>
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
          <p className="text-eyebrow text-white/55 mb-8">03 / Next step</p>
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
