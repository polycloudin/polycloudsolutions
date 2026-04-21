import type { ChartBundle } from "../data/types";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function LeadsChart({ data, label = "Leads · This week" }: { data: number[]; label?: string }) {
  const max = Math.max(...data);
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          {label}
        </p>
        <p className="mono text-[10px] text-[#15803D] font-medium">+28% vs last week</p>
      </div>
      <div>
        <div className="flex items-end gap-2 h-32">
          {data.map((v, i) => {
            const h = (v / max) * 100;
            const isPeak = v === max;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: isPeak ? "var(--color-primary-blue)" : "rgba(26, 95, 212, 0.35)",
                }}
              />
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          {days.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center mono text-[10px] text-[var(--color-text-muted)]"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CplChart({
  data,
  label = "Blended CPL · 7 weeks",
}: {
  data: number[];
  label?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  const gradId = `cplGrad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          {label}
        </p>
        <p className="mono text-[10px] text-[#15803D] font-medium">
          ₹{max} → ₹{min} ({Math.round(((max - min) / max) * -100)}%)
        </p>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-28">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline
          points={points}
          fill="none"
          stroke="#15803D"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((v - min) / (max - min)) * 100;
          const isLast = i === data.length - 1;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isLast ? "2" : "1"}
              fill={isLast ? "#15803D" : "#fff"}
              stroke="#15803D"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function ChannelMix({ channels }: { channels: NonNullable<ChartBundle["channelMix"]> }) {
  const max = Math.max(...channels.map((c) => c.leads));
  const total = channels.reduce((s, c) => s + c.leads, 0);
  return (
    <div className="p-5 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
          Leads by channel · 7 days
        </p>
        <p className="mono text-[10px] text-[var(--color-text-muted)]">{total} total</p>
      </div>
      <div className="space-y-2.5">
        {channels.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] text-[var(--color-text-secondary)]">{c.name}</span>
            <div className="flex-1 h-5 bg-[var(--color-surface-warm)] rounded-sm overflow-hidden relative">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(c.leads / max) * 100}%`,
                  backgroundColor: c.color,
                  opacity: 0.85,
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10px] text-[var(--color-ink)] font-medium">
                {c.leads}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
