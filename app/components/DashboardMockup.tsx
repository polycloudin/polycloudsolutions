"use client";

// Stylized mockup of the ITC Risk Dashboard installed on the CA firm's laptop.
// Illustrative — structure matches the real Next.js + Recharts dashboard from the sprint.

const kpis = [
  { label: "Total purchases", value: "₹48,72,500", delta: "+8.2%", trend: "up" as const, muted: true },
  { label: "ITC claimed", value: "₹7,42,380", delta: "+6.4%", trend: "up" as const, muted: true },
  { label: "ITC available", value: "₹7,58,715", delta: "+7.1%", trend: "up" as const, muted: true },
  { label: "ITC at risk", value: "₹2,685", delta: "−42%", trend: "down" as const, muted: false },
];

const trend = [18.4, 22.1, 19.8, 16.5, 14.3, 12.8, 11.2, 9.6, 7.4, 5.8, 4.1, 2.7];
const trendMax = Math.max(...trend);
const trendMin = Math.min(...trend);

const vendors = [
  { name: "Vendor A · ABC Traders", gstin: "29ABCDE••••F1Z5", outstanding: "₹1,24,500", action: "Follow-up sent 2d ago", status: "pending" },
  { name: "Vendor B · XYZ Supplies", gstin: "36GHIJK••••L2Z7", outstanding: "₹86,200", action: "Reply received · reviewing", status: "active" },
  { name: "Vendor C · Delta Industries", gstin: "27MNOPQ••••R3Z9", outstanding: "₹3,40,000", action: "Awaiting corrected invoice", status: "pending" },
  { name: "Vendor D · Orion Materials", gstin: "33STUVW••••X4Z1", outstanding: "₹19,750", action: "Auto-resolved · matched", status: "resolved" },
  { name: "Vendor E · Sigma Trading", gstin: "24YZABC••••D5Z3", outstanding: "₹2,15,000", action: "Escalated · partner review", status: "escalated" },
];

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "#B45309", bg: "#FFFBEB", label: "Pending" },
  active: { color: "#1A5FD4", bg: "#EEF4FF", label: "Active" },
  resolved: { color: "#15803D", bg: "#ECFDF3", label: "Resolved" },
  escalated: { color: "#DC2626", bg: "#FEF2F2", label: "Escalated" },
};

export default function DashboardMockup() {
  const width = 640;
  const height = 120;
  const padX = 16;
  const padY = 12;
  const range = trendMax - trendMin || 1;
  const points = trend
    .map((v, i) => {
      const x = padX + (i * (width - padX * 2)) / (trend.length - 1);
      const y = height - padY - ((v - trendMin) / range) * (height - padY * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const firstX = padX;
  const lastX = padX + (width - padX * 2);
  const areaPath = `M ${firstX},${height - padY} L ${points.replace(/ /g, " L ")} L ${lastX},${height - padY} Z`;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
      <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
        </div>
        <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 flex items-center gap-2">
          <span>localhost:8787</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
          <span>ca-firm / dashboard</span>
        </span>
        <span className="ml-auto mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">
          LAST SYNC · 42s AGO
        </span>
      </div>

      <div className="grid grid-cols-[160px_1fr]">
        <aside className="border-r border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-6 hidden md:block">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4">
            Firm
          </p>
          <p className="text-[13px] font-medium leading-tight mb-6">
            [Firm name]<br />
            <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">
              GSTIN ••••••12345
            </span>
          </p>
          <nav className="space-y-1">
            {[
              { label: "Dashboard", active: true },
              { label: "Reconciliation" },
              { label: "Vendors" },
              { label: "OCR queue" },
              { label: "Settings" },
            ].map((n) => (
              <div
                key={n.label}
                className={`px-2 py-1.5 rounded text-[12px] ${
                  n.active
                    ? "bg-[var(--color-ink)] text-white font-medium"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-line)]"
                }`}
              >
                {n.label}
              </div>
            ))}
          </nav>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-8 mb-3">
            Period
          </p>
          <div className="space-y-1 text-[12px]">
            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[var(--color-surface-warm)]">
              <span className="font-medium">Apr 2026</span>
              <span className="mono text-[10px] text-[var(--color-primary-orange)]">●</span>
            </div>
            <div className="px-2 py-1.5 rounded text-[var(--color-text-muted)]">Mar 2026</div>
            <div className="px-2 py-1.5 rounded text-[var(--color-text-muted)]">Feb 2026</div>
          </div>
        </aside>

        <div className="p-6 md:p-8">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                Filing cycle · Apr 2026
              </p>
              <h3 className="text-display text-xl md:text-2xl leading-tight">
                ITC risk overview
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="mono text-[11px] border border-[var(--color-line)] px-2.5 py-1 rounded">
                Download report
              </span>
              <span className="mono text-[11px] bg-[var(--color-ink)] text-white px-2.5 py-1 rounded">
                Run recon →
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {kpis.map((k) => {
              const accentColor = k.muted ? "var(--color-ink)" : "#DC2626";
              const deltaColor = k.trend === "down" && !k.muted ? "#15803D" : k.muted ? "var(--color-text-secondary)" : "#DC2626";
              return (
                <div
                  key={k.label}
                  className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
                >
                  <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                    {k.label}
                  </p>
                  <p className="text-display text-lg md:text-xl leading-none mb-1" style={{ color: accentColor }}>
                    {k.value}
                  </p>
                  <p className="mono text-[10px] tracking-[0.08em]" style={{ color: deltaColor }}>
                    {k.trend === "up" ? "↑" : "↓"} {k.delta} vs Mar
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mb-8 border border-[var(--color-line)] rounded-lg p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
                  ITC at risk · 12-month trend
                </p>
                <p className="text-[12px] text-[var(--color-text-secondary)]">
                  Values in ₹ thousands. Trend is down — recon + vendor follow-up catching leaks earlier.
                </p>
              </div>
              <span className="mono text-[10px] text-[var(--color-primary-orange)] tracking-[0.1em]">
                ▼ 85% from May '25
              </span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
              <defs>
                <linearGradient id="itcArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F46B2C" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#F46B2C" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#itcArea)" />
              <polyline fill="none" stroke="#F46B2C" strokeWidth="1.8" strokeLinejoin="round" points={points} />
              {trend.map((v, i) => {
                const x = padX + (i * (width - padX * 2)) / (trend.length - 1);
                const y = height - padY - ((v - trendMin) / range) * (height - padY * 2);
                const isLast = i === trend.length - 1;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isLast ? 3.5 : 1.8}
                    fill={isLast ? "#F46B2C" : "#FAFAF8"}
                    stroke="#F46B2C"
                    strokeWidth={isLast ? 0 : 1.2}
                  />
                );
              })}
            </svg>
            <div className="flex justify-between mono text-[9px] text-[var(--color-text-muted)] tracking-[0.08em] mt-2 px-4">
              <span>May '25</span>
              <span>Aug '25</span>
              <span>Nov '25</span>
              <span>Feb '26</span>
              <span className="text-[var(--color-primary-orange)]">Apr '26</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                Top risk vendors · Apr 2026
              </p>
              <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.08em]">
                5 of 14 →
              </span>
            </div>
            <div className="border border-[var(--color-line)] rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1.2fr_0.8fr] px-4 py-2 bg-[var(--color-surface-warm)] border-b border-[var(--color-line)] mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                <span>Vendor</span>
                <span>GSTIN</span>
                <span className="text-right">Outstanding</span>
                <span>Last action</span>
                <span className="text-right">Status</span>
              </div>
              {vendors.map((v, i) => {
                const s = statusStyles[v.status];
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1.6fr_1fr_0.8fr_1.2fr_0.8fr] px-4 py-2.5 text-[11px] items-center ${
                      i % 2 === 1 ? "bg-[var(--color-surface)]" : "bg-white"
                    } border-b border-[var(--color-line)] last:border-b-0`}
                  >
                    <span className="font-medium text-[var(--color-ink)] truncate">{v.name}</span>
                    <span className="mono text-[10px] text-[var(--color-text-secondary)] truncate">
                      {v.gstin}
                    </span>
                    <span className="mono text-right">{v.outstanding}</span>
                    <span className="text-[var(--color-text-secondary)] truncate">{v.action}</span>
                    <span className="flex justify-end">
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium mono"
                        style={{ color: s.color, backgroundColor: s.bg }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
