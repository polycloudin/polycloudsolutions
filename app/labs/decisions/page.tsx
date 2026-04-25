import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import DecisionsGallery, {
  type DecisionOutput,
  type ChainType,
} from "./DecisionsGallery";

export const metadata: Metadata = {
  title: "Decision memos — PolyCloud Labs",
  description:
    "Filing-grade memos generated when triggers fire. Patent cliff trifectas, USFDA 483 exposure, NPPA margin impact, Para IV positioning. PDF + markdown for every memo, citation-grounded.",
  alternates: { canonical: "/labs/decisions" },
  robots: { index: true, follow: true },
};

// Force dynamic — backend feed is live + tenant-scoped at deploy.
export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_NEXUS_API_BASE || "http://localhost:8002";

// 10 templates registered by A3 composer · names match Nexus DB
const CHAIN_TYPES: { slug: ChainType; label: string; tag: string }[] = [
  { slug: "cliff-to-ftf", label: "Cliff → FTF", tag: "cliff" },
  { slug: "483-to-anda-exposure", label: "483 → ANDA exposure", tag: "quality" },
  { slug: "nppa-margin-impact", label: "NPPA margin impact", tag: "pricing" },
  { slug: "cdsco-approval-cluster", label: "CDSCO approval cluster", tag: "competition" },
  { slug: "ctri-completion-imminent", label: "CTRI trial completion", tag: "trials" },
  { slug: "orange-book-delisting", label: "Orange Book delisting", tag: "patent" },
  { slug: "warning-letter-to-483", label: "WL → 483 escalation", tag: "quality" },
  { slug: "patent-cliff-trifecta", label: "Patent-cliff trifecta", tag: "cliff" },
  { slug: "regulatory-convergence", label: "Regulatory convergence", tag: "quality" },
  { slug: "trial-failure-to-competitor", label: "Trial failure → competitor", tag: "trials" },
];

interface OutputsResponse {
  outputs: DecisionOutput[];
  total: number;
}

async function fetchOutputs(): Promise<OutputsResponse | null> {
  // Nexus may be unreachable in dev / before deploy. Render empty-state
  // gracefully — never blow up the page.
  try {
    const r = await fetch(`${API_BASE}/api/decision-chains/outputs?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as OutputsResponse;
    return j;
  } catch {
    return null;
  }
}

function describeShipped(count: number): string {
  if (count === 0) return "No memos yet — first lands when a trigger fires.";
  if (count === 1) return "1 memo shipped this month.";
  return `${count} memos shipped this month.`;
}

export default async function DecisionsPage() {
  const data = await fetchOutputs();
  const outputs = data?.outputs ?? [];

  // Aggregate chain usage for the filter strip
  const chainCounts: Record<string, number> = {};
  for (const o of outputs) {
    chainCounts[o.template_name] = (chainCounts[o.template_name] ?? 0) + 1;
  }

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
        <div className="max-w-[1200px] mx-auto relative">
          <p className="mono text-[11px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-4">
            Labs · 03 · Decision memos
          </p>
          <h1 className="text-[44px] md:text-[64px] leading-[0.96] tracking-[-0.025em] font-semibold mb-8 max-w-[18ch]">
            Filing-grade memos. Generated when signals fire.
            <br />
            <span className="text-[var(--color-text-secondary)]">Not when consultants write them.</span>
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[16px] md:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              The Decision Composer watches every Nexus event — patent expiries, USFDA 483s,
              NPPA ceiling notifications, CTRI trial completions, Para IV filings — and fires
              one of <strong className="text-[var(--color-ink)]">10 chain templates</strong> when
              evidence converges. Each output is a 1-page PDF + markdown with reasoning,
              confidence, and citations.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/labs/dossier"
                className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1"
              >
                Pre-call dossier generator →
              </Link>
              <Link
                href="/labs/dashboard"
                className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1"
              >
                Live dashboard →
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-16 md:mt-24 pt-10 border-t border-[var(--color-line)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">
                Memos
              </p>
              <p className="text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold">
                {outputs.length}
              </p>
              <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                {describeShipped(outputs.length)}
              </p>
            </div>
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">
                Templates registered
              </p>
              <p className="text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold">
                10
              </p>
              <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                Each fires on a defined event signature, with confidence weights and an evidence query.
              </p>
            </div>
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">
                Source signals
              </p>
              <p className="text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold">
                10
              </p>
              <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                Scrapers feeding the composer · CDSCO · CTRI · FDA OB · USFDA 483 · NPPA · Para IV · State FDA · Trade · Indian Patent · Biosimilar · Litigation · KOL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <DecisionsGallery
        outputs={outputs}
        chainTypes={CHAIN_TYPES}
        chainCounts={chainCounts}
        apiBase={API_BASE}
      />

      {/* Methodology / footer pitch */}
      <section className="px-6 md:px-10 pb-20 md:pb-32">
        <div className="max-w-[1200px] mx-auto pt-16 border-t border-[var(--color-line)]">
          <p className="mono text-[11px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-4">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <h3 className="text-[18px] leading-snug font-semibold mb-3">
                01 · Trigger event
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                A Nexus scraper writes a row — new Para IV filing, new USFDA 483, NPPA ceiling cut.
                The event-bus emits a <code className="mono text-[12px] bg-[var(--color-line)]/40 px-1 py-0.5 rounded">NexusEvent</code>{" "}
                with the row payload.
              </p>
            </div>
            <div>
              <h3 className="text-[18px] leading-snug font-semibold mb-3">
                02 · Chain match + evidence
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                The Decision Composer post-emit hook checks 10 templates for trigger match. On match,
                runs the chain&apos;s evidence query (joins across CDSCO, FDA OB, NPPA, Para IV, etc.)
                and computes a confidence score from weighted evidence factors.
              </p>
            </div>
            <div>
              <h3 className="text-[18px] leading-snug font-semibold mb-3">
                03 · Memo generation
              </h3>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                Renders a Jinja2 markdown template with the evidence dict, then converts to a branded
                PDF via WeasyPrint. Both versions persist with deterministic hashes (idempotent across
                re-fires). Subscribed tenants see the memo in their portal inbox.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-[var(--color-line)] flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
            <div>
              <p className="text-[14px] text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
                Memos that match your tracked-entity watchlist hit your portal inbox. Cross-cutting
                memos (e.g. patent-cliff-trifecta on a blockbuster) are visible to all Labs subscribers.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/labs"
                className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1"
              >
                Labs overview ↩
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
