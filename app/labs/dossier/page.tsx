import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import { INDIAN_PHARMA_ALL } from "../../../lib/labs/indian-pharma";
import DossierForm from "./DossierForm";

export const metadata: Metadata = {
  title: "Pre-call dossier generator — PolyCloud Labs",
  description:
    "One-click warm-intro dossier — CIN, board, CDSCO filings, CTRI trials, patent cliffs, 3 fact-grounded talking points. Built for pharma CI + BD teams running prospect pre-calls in 20 minutes.",
  alternates: { canonical: "/labs/dossier" },
  robots: { index: true, follow: true },
};

// Nexus backend host — overridable via NEXUS_API_BASE for deploys
const API_BASE = process.env.NEXT_PUBLIC_NEXUS_API_BASE || "http://localhost:8002";

export default function DossierPage() {
  const companies = INDIAN_PHARMA_ALL.map((c) => ({
    slug: c.slug,
    name: c.name,
    legalName: c.legalName,
    cin: c.cin,
    ddGrade: c.ddGrade,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="labs" />

      <section className="relative pt-28 md:pt-40 pb-12 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(244, 107, 44, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1080px] mx-auto relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Labs · tools · Pre-call dossier generator
            </p>
          </div>
          <h1 className="text-display text-[clamp(2rem,7vw,5.5rem)] leading-[1.02] mb-8">
            One click. A <span className="text-serif-accent text-[var(--color-primary-blue)]">pitch-grade</span> dossier.
          </h1>
          <p className="text-[17px] md:text-[19px] text-[var(--color-text-secondary)] max-w-[780px] leading-relaxed mb-10">
            Showing up to a Cipla, Dr. Reddy&apos;s, or Biocon CI team with printed generic slides
            loses. Showing up with a 2-page dossier on <em>their</em> live regulatory + IP + governance
            state wins. Type the company. Get the PDF. Read it on the walk to the meeting.
          </p>

          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 md:p-8 shadow-sm">
            <DossierForm companies={companies} apiBase={API_BASE} />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-14 md:py-24 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">
            What&apos;s in the dossier
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                num: "01",
                title: "Hero snapshot",
                body:
                  "Legal name, CIN, market cap, incorporated year, paid-up capital, directors count, and a 30-day live-signal tally (CDSCO + CTRI + cliff + USFDA + NPPA).",
              },
              {
                num: "02",
                title: "Board & governance",
                body:
                  "Named directors (Chair, MD/CEO, CFO) + governance flags from the MCA snapshot — Big 4 auditor continuity, promoter pledge policy, ESOP reserve, recent charges filed.",
              },
              {
                num: "03",
                title: "CDSCO filings · 90 days",
                body:
                  "Top 5 most-recent CDSCO filings where the applicant or title matches this sponsor. Notifications, biologicals, approved new drugs, clinical-trial permissions.",
              },
              {
                num: "04",
                title: "CTRI trials · active + recent",
                body:
                  "Top 5 registered trials — CTRI ID, phase, status, indication. Demonstrates Ph-3 capacity + therapeutic-area direction.",
              },
              {
                num: "05",
                title: "USFDA 483 · 24-month window",
                body:
                  "Inspection actions, warning letters, import alerts against this sponsor. Renders 'no data' when the module hasn't been ingested — honest vs. invented content.",
              },
              {
                num: "06",
                title: "Patent cliff exposure",
                body:
                  "FDA Orange Book patents where the applicant matches a name variant and the patent expires in the next 24 months. Joined to urgent/hot/warm/scout priority buckets.",
              },
              {
                num: "07",
                title: "3 fact-grounded talking points",
                body:
                  "LLM-generated, cited against the evidence above. Each talking point ships with a rationale and a follow-up question the prospect would want to discuss. Deterministic fallback when the LLM is offline.",
              },
              {
                num: "08",
                title: "Close-the-loop ask",
                body:
                  "One concrete sentence to end the meeting with — phrased as an open question tied to the top cliff or highest-priority signal. Turns the dossier into a CRM-ready follow-up hook.",
              },
            ].map((s) => (
              <div
                key={s.num}
                className="rounded-xl border border-[var(--color-line)] bg-white p-6 md:p-7 card-hover"
              >
                <p className="mono text-[10px] text-[var(--color-primary-orange)] mb-2">
                  {s.num} / Section
                </p>
                <h3 className="text-display text-[clamp(1rem,1.4vw,1.25rem)] mb-2">{s.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-[13px] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-10 md:py-16">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] text-[var(--color-text-muted)]">
            API endpoint: <span className="mono text-[12px]">GET /api/labs/dossier/{`{identifier}`}</span> ·
            returns <span className="mono text-[12px]">application/pdf</span> with
            {` `}
            <span className="mono text-[12px]">Content-Disposition</span>. See the{" "}
            <Link
              href="/labs"
              className="text-[var(--color-primary-blue)] underline underline-offset-2 hover:no-underline"
            >
              Labs landing
            </Link>{" "}
            for the broader intelligence stack.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
