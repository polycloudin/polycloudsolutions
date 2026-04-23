import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import BookButton from "../../components/BookButton";
import WorkflowDemoWrapper from "./WorkflowDemoWrapper";

export const metadata: Metadata = {
  title: "Workflow demo · Before / After — PolyCloud Consulting",
  description:
    "Interactive before/after diagram of a 4-partner CA firm's month-end close. Drag nodes, draw new edges. The kind of sales artefact a deck can't be.",
};

export default function WorkflowDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="consulting" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-10 md:pb-16 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Link
              href="/consulting"
              className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              ← Consulting
            </Link>
            <span className="text-[var(--color-line)]">/</span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Workflow demo
            </span>
          </div>

          <h1 className="text-display text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] md:leading-[0.98] mb-5 md:mb-6 max-w-[1100px]">
            A CA firm&apos;s month-end close —{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              before and after
            </span>
            .
          </h1>

          <p className="text-[15.5px] md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            Static consulting decks are lies of omission — they don&apos;t
            show where work actually breaks. This is an interactive diagram
            of the same firm, before and after we installed the{" "}
            <span className="font-medium text-[var(--color-ink)]">
              ca-firm-toolkit
            </span>
            . Drag nodes. Draw your own edges. Find the bottleneck.
          </p>
        </div>
      </section>

      {/* Diagram */}
      <section className="px-6 md:px-10 pb-16 md:pb-20">
        <div className="max-w-[1400px] mx-auto">
          <WorkflowDemoWrapper />
        </div>
      </section>

      {/* Numbers strip */}
      <section className="px-6 md:px-10 py-16 md:py-28 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            What the diagram is actually showing
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] mb-10 md:mb-14 max-w-3xl">
            7 steps collapse to 4. 8 hours collapse to under 1.
          </h2>
          <div className="grid md:grid-cols-4 gap-8 md:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="border-t border-[var(--color-ink)]/80 pt-5 md:pt-6">
                <p className="text-display text-[clamp(2.25rem,6vw,3.5rem)] leading-none mb-3 md:mb-4">
                  {s.value}
                </p>
                <p className="font-medium text-[15px] md:text-[16px] mb-2 tracking-tight">
                  {s.label}
                </p>
                <p className="text-[var(--color-text-secondary)] text-[13.5px] leading-relaxed max-w-[22ch]">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we build this for you */}
      <section className="px-6 md:px-10 py-16 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            How we build this for your firm
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] mb-10 md:mb-14 max-w-3xl">
            Three weeks. Same outcome. New workflow.
          </h2>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="p-6 md:p-7 border border-[var(--color-line)] rounded-xl bg-white"
              >
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                  {String(i + 1).padStart(2, "0")} · {step.tag}
                </p>
                <h3 className="text-[18px] md:text-[20px] font-medium mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-14 flex flex-wrap gap-3">
            <BookButton variant="primary" topic="consulting">
              Book a ₹1L audit
              <span className="text-base opacity-70">↗</span>
            </BookButton>
            <Link href="/consulting" className="btn-secondary">
              Back to Consulting
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const STATS = [
  { value: "7 → 4", label: "Process steps", detail: "Two parallel automation lanes replace five sequential manual ones." },
  { value: "8h → <1h", label: "Partner + junior time / client / month", detail: "Per-client labour, measured from inbound to filed." },
  { value: "~₹6.5K", label: "Margin recovered / client / month", detail: "At a ₹1.5K-loaded junior hour, net of the ca-firm-toolkit retainer." },
  { value: "100%", label: "Audit trail", detail: "Every match, flag, WhatsApp send is in an append-only JSONL ready for scrutiny." },
];

const STEPS = [
  {
    tag: "Week 1 · Shadow",
    title: "We map your actual process",
    body:
      "Half a day with your juniors and partners. We capture every manual step, every spreadsheet, every WhatsApp loop. The diagram on this page was built from a real firm's shadow.",
  },
  {
    tag: "Week 2 · Install",
    title: "ca-firm-toolkit deploys on your laptop",
    body:
      "One command. 90 seconds. Runs locally, writes into Tally, hooks into a WhatsApp Business number you already own. No data leaves your firm. We sit next to you while it processes this month's first client.",
  },
  {
    tag: "Week 3 · Handoff",
    title: "You take the wheel",
    body:
      "By week three, juniors only touch flagged rows. Partners only approve edge cases. You've recovered 7 hours per client per month — which we can help you either sell as capacity, or bank as margin.",
  },
];
