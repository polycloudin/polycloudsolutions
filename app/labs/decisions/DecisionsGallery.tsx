"use client";

import { useMemo, useState } from "react";

export type ChainType =
  | "cliff-to-ftf"
  | "483-to-anda-exposure"
  | "nppa-margin-impact"
  | "cdsco-approval-cluster"
  | "ctri-completion-imminent"
  | "orange-book-delisting"
  | "warning-letter-to-483"
  | "patent-cliff-trifecta"
  | "regulatory-convergence"
  | "trial-failure-to-competitor";

export interface DecisionOutput {
  id: string;
  title: string;
  template_name: string;
  confidence: number; // 0..1
  generated_at: string; // ISO 8601
  citations_count?: number;
  pdf_url?: string;
  subject_entity?: string;
}

interface ChainMeta {
  slug: ChainType;
  label: string;
  tag: string;
}

interface Props {
  outputs: DecisionOutput[];
  chainTypes: ChainMeta[];
  chainCounts: Record<string, number>;
  apiBase: string;
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function fmtConfidence(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function tagColor(tag: string): { bg: string; text: string } {
  switch (tag) {
    case "cliff":
      return { bg: "rgba(244, 107, 44, 0.10)", text: "var(--color-primary-orange)" };
    case "quality":
      return { bg: "rgba(207, 64, 64, 0.10)", text: "#cf4040" };
    case "pricing":
      return { bg: "rgba(64, 110, 207, 0.10)", text: "var(--color-primary-blue)" };
    case "competition":
      return { bg: "rgba(124, 64, 207, 0.10)", text: "#7c40cf" };
    case "trials":
      return { bg: "rgba(40, 140, 90, 0.10)", text: "#288c5a" };
    case "patent":
      return { bg: "rgba(128, 128, 128, 0.10)", text: "var(--color-text-secondary)" };
    default:
      return { bg: "rgba(128, 128, 128, 0.10)", text: "var(--color-text-secondary)" };
  }
}

export default function DecisionsGallery({
  outputs,
  chainTypes,
  chainCounts,
  apiBase,
}: Props) {
  const [activeChain, setActiveChain] = useState<ChainType | "all">("all");

  const filtered = useMemo(() => {
    if (activeChain === "all") return outputs;
    return outputs.filter((o) => o.template_name === activeChain);
  }, [outputs, activeChain]);

  const isEmpty = outputs.length === 0;

  return (
    <section className="px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto pb-16 md:pb-24">
        {/* Filter strip */}
        {!isEmpty && (
          <div className="flex flex-wrap gap-2 mb-8">
            <FilterChip
              active={activeChain === "all"}
              count={outputs.length}
              label="All chains"
              onClick={() => setActiveChain("all")}
            />
            {chainTypes.map((c) => {
              const count = chainCounts[c.slug] ?? 0;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={c.slug}
                  active={activeChain === c.slug}
                  count={count}
                  label={c.label}
                  onClick={() => setActiveChain(c.slug)}
                />
              );
            })}
          </div>
        )}

        {isEmpty ? (
          <EmptyState chainTypes={chainTypes} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((o) => {
              const meta = chainTypes.find((c) => c.slug === o.template_name);
              const tag = meta?.tag ?? "other";
              const colors = tagColor(tag);
              const pdfHref = o.pdf_url
                ? o.pdf_url.startsWith("http")
                  ? o.pdf_url
                  : `${apiBase}${o.pdf_url}`
                : `${apiBase}/api/decision-chains/outputs/${o.id}/pdf`;
              return (
                <article
                  key={o.id}
                  className="border border-[var(--color-line)] bg-[var(--color-surface)] p-6 flex flex-col gap-4 hover:border-[var(--color-text-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="mono text-[10px] uppercase tracking-[0.16em] px-2 py-0.5"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {meta?.label ?? o.template_name}
                    </span>
                    <span className="mono text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.14em] ml-auto">
                      {fmtDate(o.generated_at)}
                    </span>
                  </div>

                  <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">
                    {o.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-line)]">
                    <ConfidenceBar value={o.confidence} />
                    {typeof o.citations_count === "number" && (
                      <span className="mono text-[11px] text-[var(--color-text-secondary)]">
                        {o.citations_count} sources
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href={pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium hover:text-[var(--color-primary-orange)] transition-colors inline-flex items-center gap-1"
                    >
                      Download PDF →
                    </a>
                    <a
                      href={`${apiBase}/api/decision-chains/outputs/${o.id}/markdown`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors"
                    >
                      Raw markdown
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 border transition-colors ${
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-surface)]"
          : "border-[var(--color-line)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)] hover:text-[var(--color-ink)]"
      }`}
    >
      {label}
      <span className="ml-2 opacity-60">{count}</span>
    </button>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  // Color shifts: <0.5 muted, 0.5-0.75 orange, >0.75 green
  const color =
    pct >= 0.75
      ? "#288c5a"
      : pct >= 0.5
        ? "var(--color-primary-orange)"
        : "var(--color-text-secondary)";
  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="mono text-[11px] text-[var(--color-text-secondary)] uppercase tracking-[0.14em]">
        Conf
      </span>
      <div className="flex-1 h-1 bg-[var(--color-line)] relative overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
      <span className="mono text-[11px] font-semibold" style={{ color }}>
        {fmtConfidence(value)}
      </span>
    </div>
  );
}

function EmptyState({ chainTypes }: { chainTypes: ChainMeta[] }) {
  return (
    <div className="border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-8 md:p-12">
      <p className="mono text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.16em] mb-4">
        Composer · standby
      </p>
      <h3 className="text-[22px] md:text-[26px] leading-snug font-semibold tracking-[-0.01em] mb-3 max-w-[40ch]">
        First memo lands when a trigger fires.
      </h3>
      <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-6">
        The 10 templates are registered. Each watches for a specific event signature — a Para IV
        filing, a USFDA 483 issuance, an NPPA ceiling cut over 5%. Typical cadence once feeds wire
        up: <strong className="text-[var(--color-ink)]">15-20 memos per week.</strong>
      </p>

      <p className="mono text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.16em] mb-3">
        Templates registered
      </p>
      <div className="flex flex-wrap gap-2 max-w-3xl">
        {chainTypes.map((c) => {
          const colors = tagColor(c.tag);
          return (
            <span
              key={c.slug}
              className="mono text-[10px] uppercase tracking-[0.14em] px-2 py-1"
              style={{ background: colors.bg, color: colors.text }}
            >
              {c.label}
            </span>
          );
        })}
      </div>

      <p className="text-[13px] text-[var(--color-text-secondary)] mt-8 leading-relaxed">
        Memos persist with deterministic hashes — once one fires, this gallery becomes a permanent
        public record of the call we made + the evidence we made it on. Track our accuracy at{" "}
        <a
          href="/labs"
          className="underline underline-offset-2 hover:text-[var(--color-ink)] transition-colors"
        >
          /labs
        </a>
        .
      </p>
    </div>
  );
}
