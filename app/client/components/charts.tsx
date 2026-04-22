import type { ChartBundle } from "../data/types";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const dayFull = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function LeadsChart({ data, label = "Leads · This week" }: { data: number[]; label?: string }) {
  const max = Math.max(...data);
  const total = data.reduce((s, v) => s + v, 0);
  return (
    <div className="p-5 md:p-6 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em] mb-1">
            {label}
          </p>
          <p className="text-display text-xl md:text-2xl">{total} <span className="text-[12px] text-[var(--color-text-muted)] mono font-normal">leads</span></p>
        </div>
        <p className="mono text-[10.5px] text-[#15803D] font-medium">+28% vs last week</p>
      </div>
      <div>
        <div className="flex items-end gap-2 h-40">
          {data.map((v, i) => {
            const h = (v / max) * 100;
            const isPeak = v === max;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span
                  className={`mono text-[10px] tabular-nums ${
                    isPeak ? "text-[var(--color-primary-blue)] font-medium" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {v}
                </span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor: isPeak ? "var(--color-primary-blue)" : "rgba(26, 95, 212, 0.3)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--color-line)]">
          {days.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center mono text-[10px] text-[var(--color-text-muted)]"
              title={dayFull[i]}
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
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10; // pad top/bottom
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  const gradId = `cplGrad-${Math.random().toString(36).slice(2, 8)}`;
  const drop = Math.round(((max - min) / max) * 100);

  return (
    <div className="p-5 md:p-6 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em] mb-1">
            {label}
          </p>
          <p className="text-display text-xl md:text-2xl">₹{data[data.length - 1]} <span className="text-[12px] text-[var(--color-text-muted)] mono font-normal">per lead</span></p>
        </div>
        <p className="mono text-[10.5px] text-[#15803D] font-medium">
          ₹{max} → ₹{min} (−{drop}%)
        </p>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-36">
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
          const y = 100 - ((v - min) / range) * 80 - 10;
          const isLast = i === data.length - 1;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isLast ? "2.5" : "1.2"}
                fill={isLast ? "#15803D" : "#fff"}
                stroke="#15803D"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between pt-2 border-t border-[var(--color-line)]">
        {data.map((v, i) => (
          <span
            key={i}
            className="mono text-[9.5px] tabular-nums text-[var(--color-text-muted)]"
          >
            ₹{v}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChannelMix({ channels }: { channels: NonNullable<ChartBundle["channelMix"]> }) {
  const max = Math.max(...channels.map((c) => c.leads));
  const total = channels.reduce((s, c) => s + c.leads, 0);
  return (
    <div className="p-5 md:p-6 border border-[var(--color-line)] rounded-xl bg-white">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.14em] mb-1">
            Leads by channel · 7 days
          </p>
          <p className="text-display text-xl md:text-2xl">
            {total} <span className="text-[12px] text-[var(--color-text-muted)] mono font-normal">total across {channels.length} channels</span>
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {channels.map((c) => {
          const pct = Math.round((c.leads / total) * 100);
          return (
            <div key={c.name} className="flex items-center gap-4">
              <span className="w-32 shrink-0 text-[12px] text-[var(--color-text-secondary)]">{c.name}</span>
              <div className="flex-1 h-6 bg-[var(--color-surface-warm)] rounded-sm overflow-hidden relative">
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${(c.leads / max) * 100}%`,
                    backgroundColor: c.color,
                    opacity: 0.88,
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10.5px] text-[var(--color-ink)] font-medium">
                  {c.leads} · {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
