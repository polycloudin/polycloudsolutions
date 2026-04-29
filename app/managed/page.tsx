import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Managed mode — your finance function, run by PolyCloud",
  description:
    "For SMEs ₹5–100Cr. PolyCloud's in-house CA + the 37-tool Practice OS run your finance function — GST, TDS, MCA21, Tally, payroll, audit. You see one dashboard, sign off monthly, get one invoice. No hiring a CFO + 3 staff to do the same.",
  alternates: { canonical: "/managed" },
  keywords: [
    "outsourced CFO India",
    "managed finance India SME",
    "outsourced finance function India",
    "fractional CFO India",
    "AI-powered CA service",
    "India SME accounting outsource",
    "GST + TDS + MCA21 outsource",
    "PolyCloud managed mode",
  ],
};

const pains = [
  {
    num: "01",
    label: "Three vendors, three excuses",
    body:
      "Your accountant works for one firm, your tax consultant for another, your auditor a third. Mismatches surface during filing — never before. Every closing month is a fire drill.",
  },
  {
    num: "02",
    label: "No real-time visibility",
    body:
      "MIS arrives 15 days after month-end, in a format your finance team built. By the time you see ITC at risk, the period is closed and recovery is harder.",
  },
  {
    num: "03",
    label: "Hiring a CFO is ₹40L+/year",
    body:
      "A senior FP&A hire is ₹15–25L. A controller is ₹12–18L. A CFO is ₹40–80L. Plus benches for tax, audit, payroll. The fully-loaded cost runs ₹60L–1.5Cr/year before any tools.",
  },
  {
    num: "04",
    label: "Your data scattered across 12 tools",
    body:
      "Tally on a desktop. GSTN on the partner CA's laptop. Bank statements in the founder's email. Payroll on a separate vendor portal. Reconciliation lives in spreadsheets nobody trusts.",
  },
];

const whatYouGet = [
  {
    name: "A signing CA",
    line: "PolyCloud's in-house Chartered Accountant signs your filings — GSTR-1, GSTR-3B, 26Q, 24Q, ITR, Form 3CD, all of it. Their UDIN, their PAN, their Membership Number. We are your CA, not your tooling vendor.",
  },
  {
    name: "The full Practice OS, run for you",
    line: "All 37 tools — recon, bank → Tally, TDS, compliance calendar, Form 3CD, MCA21, payroll, UDIN, 15CA/CB, notice response, peer review — running on your data daily. You see the outputs. We run the engine.",
  },
  {
    name: "One dashboard, daily",
    line: "Real-time view of cash, GST liability vs paid, TDS deducted vs deposited, receivables ageing, vendor reconciliation status, upcoming filings. Not a 15-day-late MIS — a live operational view.",
  },
  {
    name: "One monthly review call",
    line: "30-minute call on the 5th of every month. Partner CA walks you through last month's close, this month's cash forecast, any flags (notices received, vendors out of compliance, ITC at risk). You sign off; we file.",
  },
  {
    name: "One invoice",
    line: "Flat monthly fee. No per-filing surprise. No tool licences to track. No 'discuss with auditor' billing creep. The CA, the engine, the dashboard, the calls — one line item.",
  },
];

const replacedBy = [
  { what: "Internal accountant + bookkeeper", typicalCost: "₹6–12L/yr loaded", replaced: true },
  { what: "Tax consultant retainer", typicalCost: "₹2–6L/yr", replaced: true },
  { what: "Statutory auditor (annual)", typicalCost: "₹2–8L/yr", replaced: true },
  { what: "Tally / Zoho Books licence", typicalCost: "₹15K–60K/yr", replaced: true },
  { what: "Compliance / GST portal tools", typicalCost: "₹50K–1.5L/yr", replaced: true },
  { what: "Payroll vendor", typicalCost: "₹50K–2L/yr", replaced: true },
  { what: "MIS / dashboarding tools", typicalCost: "₹1L–3L/yr", replaced: true },
  { what: "Fractional CFO consultant", typicalCost: "₹6–18L/yr", replaced: true },
];

const facts = [
  { label: "Audience", value: "SMEs ₹5–100Cr revenue" },
  { label: "Signs as your CA", value: "PolyCloud-employed Chartered Accountant" },
  { label: "Onboarding", value: "Week 1: data ingest · Week 2: first close" },
  { label: "Switching cost", value: "Zero — you own your data, can move out any month" },
];

export default function ManagedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-28 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1280px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Managed mode · For SMEs ₹5–100Cr
            </p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,8vw,7rem)] mb-8 md:mb-10 max-w-[1200px] leading-[0.95]">
            Your{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              finance function
            </span>
            , run by PolyCloud.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Not consulting. Not software. Not a fractional CFO advice deck. We are your CA — our in-house Chartered Accountant signs your filings — and the 37-tool Practice OS that backs us runs against your books daily. You see one live dashboard, sign off monthly, get one invoice. The cost of a mid-level finance hire, replacing five vendors and the tools that go with them.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary" topic="consulting">
                Scope a Managed engagement ↗
              </BookButton>
              <Link
                href="/ca-firm/app/inbox"
                className="btn-secondary"
              >
                See the OS we run for you ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pains */}
      <section className="px-6 md:px-10 py-14 md:py-20 border-t border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                Why most SME finance is broken
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-2xl leading-[1.05]">
                You don&apos;t have a CFO problem. You have a{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  fragmentation
                </span>{" "}
                problem.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Hiring a CFO doesn&apos;t fix it. They&apos;ll inherit the same fragmented stack — three vendors, scattered data, late MIS — and spend their first six months reconstructing it. Managed mode fixes the substrate so a CFO becomes optional, not urgent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {pains.map((p) => (
              <div key={p.num} className="bg-white p-7 md:p-8">
                <p className="mono text-[10px] text-[var(--color-primary-orange)] tracking-[0.18em] mb-3">
                  {p.num}
                </p>
                <h3 className="text-[clamp(1.1rem,1.5vw,1.3rem)] mb-3 leading-tight font-medium">
                  {p.label}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 md:px-10 py-16 md:py-24 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                What you actually get
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-2xl leading-[1.05]">
                A CA who signs.{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  An OS that runs.
                </span>{" "}
                One dashboard.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We are not a SaaS subscription. We are not an advisory retainer. We are the function — the human who signs and the system they sign on top of, both PolyCloud, both yours.
            </p>
          </div>

          <div className="space-y-4">
            {whatYouGet.map((w, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[var(--color-line)] p-6 md:p-8 grid md:grid-cols-[0.5fr_1.5fr] gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="mono text-xs text-[var(--color-primary-orange)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[clamp(1.15rem,1.6vw,1.35rem)] leading-tight font-medium">
                    {w.name}
                  </h3>
                </div>
                <p className="text-[var(--color-text-secondary)] text-[14.5px] leading-relaxed">
                  {w.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you replace */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">
                The math
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,3.75rem)] max-w-3xl leading-[1.05]">
                Eight line items. <span className="text-serif-accent text-[var(--color-primary-blue)]">One.</span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              The math doesn&apos;t need a deck. Total today vs. one Managed engagement. Real CFO + finance team is still useful when the numbers stop fitting on this page — typically ₹100Cr+ revenue or active fundraise.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] overflow-hidden bg-white">
            <div className="grid grid-cols-[1.5fr_1fr_0.6fr] bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                What you pay for today
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)]">
                Typical cost (loaded)
              </div>
              <div className="px-4 md:px-6 py-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] border-l border-[var(--color-line)] text-center">
                Replaced
              </div>
            </div>
            {replacedBy.map((r, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.5fr_1fr_0.6fr] ${
                  i < replacedBy.length - 1 ? "border-b border-[var(--color-line)]" : ""
                }`}
              >
                <div className="px-4 md:px-6 py-3.5 text-[14px] text-[var(--color-ink)]">
                  {r.what}
                </div>
                <div className="px-4 md:px-6 py-3.5 border-l border-[var(--color-line)] mono text-[13px] text-[var(--color-text-secondary)]">
                  {r.typicalCost}
                </div>
                <div className="px-4 md:px-6 py-3.5 border-l border-[var(--color-line)] text-center text-[#15803D]">
                  ✓
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[1.5fr_1fr_0.6fr] border-t-2 border-[var(--color-ink)] bg-[var(--color-surface-warm)]">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1">
                  Total today (typical SME ₹20-50Cr)
                </p>
                <p className="text-display text-[18px] md:text-[22px]">
                  Eight vendors · Eight invoices
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)]">
                <p className="text-display text-[24px] md:text-[30px] text-[#B91C1C] leading-none">
                  ₹20–50L/yr
                </p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  All-in (people + tools)
                </p>
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 border-l border-[var(--color-line)] text-center">
                <p className="text-display text-[20px] md:text-[24px] text-[#15803D] leading-none">
                  →
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[14px] md:text-[15px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            <span className="font-medium text-[var(--color-ink)]">
              Managed mode lands materially below this for most SMEs.
            </span>{" "}
            Pricing is scoped per engagement — depends on filing volume, client base, NCE / international footprint. We&apos;ll cost it on the first call. No commitment.
          </p>
        </div>
      </section>

      {/* Facts */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-8 md:gap-10">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-2">
                {f.label}
              </p>
              <p className="text-[15px] md:text-[16px] font-medium leading-tight">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-20 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 100%, rgba(26, 95, 212, 0.28) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">First five SME engagements</p>
          <h2 className="text-display text-[clamp(2rem,6vw,5rem)] mb-10 leading-[0.95]">
            Founding-five terms,{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              locked forward
            </span>
            .
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            We&apos;re scoping the first five Managed engagements. Founding-five terms lock forward — your monthly fee carries even as the platform matures. Ninety-day cancellation, no lock-in beyond. Book a call, we&apos;ll send a costed scope inside 72 hours.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookButton variant="light-primary" topic="consulting">
              Scope a Managed engagement ↗
            </BookButton>
            <Link
              href="/solutions/ca-firm"
              className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
            >
              ← I run a CA practice instead (Firm mode)
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
