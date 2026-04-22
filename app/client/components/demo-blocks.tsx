import type { Transformation, MoneyStory, ActivityEntry } from "../data/types";

/**
 * Blocks used by the public demo (Kumar Textiles). Private dashboards skip
 * these — they show a focused ops view, not a sales story.
 */

export function TransformationHero({ t }: { t: Transformation }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--color-line)] bg-[#0A0A0A] text-white">
      <div className="p-6 md:p-8 pb-5">
        <p className="mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
          {t.window}
        </p>
        <h2 className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] mb-3 tracking-tight">
          {t.headline}
        </h2>
        <p className="text-[14.5px] text-white/75 max-w-2xl leading-relaxed">{t.story}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-white/10">
        {t.metrics.map((m, i) => (
          <div
            key={m.label}
            className={`p-4 md:p-5 border-white/10 ${
              i > 0 ? "md:border-l" : ""
            } ${i >= 2 ? "border-t md:border-t-0" : ""}`}
          >
            <p className="mono text-[9.5px] uppercase tracking-[0.18em] text-white/45 mb-2 leading-tight">
              {m.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-white/40 mono text-[11px] line-through">{m.before}</span>
              <span className="text-white/40 mono text-[10px]">→</span>
            </div>
            <p className="text-xl md:text-2xl font-medium tracking-tight mt-0.5">{m.after}</p>
            <p
              className="mono text-[11px] mt-1"
              style={{ color: m.tone === "risk" ? "#F87171" : "#4ADE80" }}
            >
              {m.delta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MoneyStrip({ m }: { m: MoneyStory }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-white overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-[var(--color-line)]">
        <div className="p-5">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
            Ad spend · 7d
          </p>
          <p className="text-display text-xl md:text-2xl">{m.adSpend}</p>
        </div>
        <div className="p-5 bg-[#F8F6F1]">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
            Attributed revenue · 7d
          </p>
          <p className="text-display text-xl md:text-2xl" style={{ color: "#15803D" }}>
            {m.attributedRevenue}
          </p>
        </div>
        <div className="p-5">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">
            Gross margin captured
          </p>
          <p className="text-display text-xl md:text-2xl">{m.margin}</p>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-[var(--color-line)] bg-[var(--color-surface)] flex flex-wrap items-center gap-x-6 gap-y-1">
        <span className="mono text-[11px]">
          Blended ROAS <span className="text-[#15803D] font-medium">{m.blendedRoas}</span>
        </span>
        {m.benchmark && (
          <span className="mono text-[10.5px] text-[var(--color-text-muted)]">{m.benchmark}</span>
        )}
        {m.note && (
          <span className="text-[11px] text-[var(--color-text-secondary)] ml-auto leading-snug max-w-md">
            {m.note}
          </span>
        )}
      </div>
    </div>
  );
}

function kindBadge(kind?: ActivityEntry["kind"]) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    urgent: { label: "Urgent", color: "#DC2626", bg: "#FEF2F2" },
    needs: { label: "Needs you", color: "#B45309", bg: "#FFFBEB" },
    ship: { label: "Shipped", color: "#15803D", bg: "#ECFDF3" },
    build: { label: "Built", color: "#1A5FD4", bg: "#EEF4FF" },
    auto: { label: "Auto", color: "var(--color-text-secondary)", bg: "var(--color-surface-warm)" },
  };
  const c = cfg[kind || "auto"];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium mono uppercase tracking-wider"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {c.label}
    </span>
  );
}

/**
 * Narrative activity card — signal → action → outcome. Falls back to the
 * legacy single-line layout if the entry only has `text`.
 */
export function ActivityCard({ a }: { a: ActivityEntry }) {
  const isNarrative = !!(a.signal || a.action || a.outcome);
  if (!isNarrative) {
    return (
      <div className="flex items-start gap-4 py-3">
        <span className="mono text-[11px] text-[var(--color-text-muted)] w-24 shrink-0">
          {a.time}
        </span>
        <p className="flex-1 text-[13.5px] leading-relaxed">{a.text}</p>
        {kindBadge(a.kind)}
      </div>
    );
  }
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="mono text-[11px] text-[var(--color-text-muted)]">{a.time}</span>
        {kindBadge(a.kind)}
        <span className="text-[13.5px] font-medium tracking-tight flex-1">{a.text}</span>
      </div>
      <div className="pl-[88px] space-y-1.5">
        {a.signal && (
          <div className="flex gap-3">
            <span className="mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] w-16 shrink-0 pt-[2px]">
              Signal
            </span>
            <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
              {a.signal}
            </p>
          </div>
        )}
        {a.action && (
          <div className="flex gap-3">
            <span className="mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] w-16 shrink-0 pt-[2px]">
              Action
            </span>
            <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
              {a.action}
            </p>
          </div>
        )}
        {a.outcome && (
          <div className="flex gap-3">
            <span
              className="mono text-[9.5px] uppercase tracking-[0.18em] w-16 shrink-0 pt-[2px] font-medium"
              style={{ color: "#15803D" }}
            >
              Outcome
            </span>
            <p
              className="text-[12.5px] leading-relaxed font-medium"
              style={{ color: "#15803D" }}
            >
              {a.outcome}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
