import type { Tone, SourceStatus, KPI } from "../data/types";

export function Pill({
  tone,
  children,
}: {
  tone: Exclude<Tone, "ink">;
  children: React.ReactNode;
}) {
  const styles: Record<Exclude<Tone, "ink">, { color: string; bg: string }> = {
    success: { color: "#15803D", bg: "#ECFDF3" },
    warn: { color: "#B45309", bg: "#FFFBEB" },
    risk: { color: "#DC2626", bg: "#FEF2F2" },
    neutral: { color: "var(--color-text-secondary)", bg: "var(--color-surface-warm)" },
  };
  const s = styles[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium mono"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: s.color }} />
      {children}
    </span>
  );
}

export function SourceStatusPill({ status }: { status: SourceStatus }) {
  if (status === "live") return <Pill tone="success">Live</Pill>;
  if (status === "pending")
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium mono"
        style={{ color: "#1A5FD4", backgroundColor: "#EEF4FF" }}
      >
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#1A5FD4" }} />
        Connect
      </span>
    );
  if (status === "manual") return <Pill tone="warn">Manual</Pill>;
  return <Pill tone="neutral">Not yet</Pill>;
}

export function KpiGrid({ kpis }: { kpis: KPI[] }) {
  const cols = Math.min(kpis.length, 5);
  return (
    <div
      className={`grid grid-cols-2 border border-[var(--color-line)] rounded-xl overflow-hidden bg-white`}
      style={{ gridTemplateColumns: `repeat(var(--cols), minmax(0, 1fr))`, ["--cols" as any]: cols } as React.CSSProperties}
    >
      {kpis.map((k, i) => (
        <div
          key={i}
          className={`p-4 md:p-5 ${i < kpis.length - 1 ? "md:border-r" : ""} border-[var(--color-line)]`}
        >
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
            {k.label}
          </p>
          <p
            className="text-display text-xl md:text-2xl mb-1"
            style={{
              color:
                k.tone === "success"
                  ? "#15803D"
                  : k.tone === "risk"
                  ? "#DC2626"
                  : "var(--color-ink)",
            }}
          >
            {k.value}
          </p>
          {k.delta && <p className="text-[11px] text-[var(--color-text-secondary)]">{k.delta}</p>}
        </div>
      ))}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
      <div>
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
          {eyebrow}
        </p>
        <h2 className="text-xl md:text-2xl font-medium tracking-tight">{title}</h2>
      </div>
      {right && <div className="text-xs text-[var(--color-text-secondary)]">{right}</div>}
    </div>
  );
}
