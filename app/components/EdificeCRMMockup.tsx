// Snapshot of the Edifice luxury-real-estate CRM built for a Hyderabad builder.
// Stage counts, agent names, properties, and revenue match the shipped mock dataset.
// Matches the polycloud.in theme — sibling to DashboardMockup (CA firm).

const kpis = [
  { label: "Total leads · Q1", value: "324", delta: "+18% vs Q4", trend: "up" as const, muted: true },
  { label: "Conversion", value: "22%", delta: "14 closed", trend: "up" as const, muted: true },
  { label: "Avg lead → booking", value: "18 days", delta: "−4d vs Q4", trend: "down" as const, muted: true },
  { label: "Closed value · Apr", value: "₹8.5 Cr", delta: "2 bookings", trend: "up" as const, muted: false },
];

const stages = [
  {
    name: "New",
    count: 86,
    leads: [
      { name: "Priya Sharma", prop: "Skyline Towers", budget: "₹2.5 Cr", score: 85, src: "website" },
      { name: "Arjun Kumar", prop: "Eden Gardens", budget: "₹1.8 Cr", score: 72, src: "99acres" },
    ],
  },
  {
    name: "Contacted",
    count: 62,
    leads: [
      { name: "Neha Gupta", prop: "The Meridian", budget: "₹3.2 Cr", score: 78, src: "magicbricks" },
    ],
  },
  {
    name: "Site visit",
    count: 48,
    leads: [
      { name: "Ananya Reddy", prop: "Skyline Towers", budget: "₹2.1 Cr", score: 88, src: "whatsapp" },
    ],
  },
  {
    name: "Negotiation",
    count: 24,
    leads: [
      { name: "Ravi Desai", prop: "Prestige Heights", budget: "₹4.5 Cr", score: 92, src: "website" },
    ],
  },
  {
    name: "Booked",
    count: 14,
    leads: [
      { name: "Deepika Singh", prop: "Eden Gardens", budget: "₹1.9 Cr", score: 95, src: "99acres" },
    ],
  },
];

const sourceMeta: Record<string, { label: string; color: string }> = {
  website: { label: "Web", color: "#1A5FD4" },
  "99acres": { label: "99A", color: "#F46B2C" },
  magicbricks: { label: "MB", color: "#B45309" },
  whatsapp: { label: "WA", color: "#15803D" },
};

export default function EdificeCRMMockup() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-hidden shadow-[0_24px_80px_-30px_rgba(10,10,10,0.18)]">
      {/* Window chrome — matches DashboardMockup */}
      <div className="flex items-center gap-2 px-5 py-3 bg-[#F6F3EA] border-b border-[var(--color-line)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E0]" />
        </div>
        <span className="mono text-[11px] text-[var(--color-text-muted)] ml-3 flex items-center gap-2">
          <span>edifice.polycloud.in</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
          <span>crm / leads</span>
        </span>
        <span className="ml-auto mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">
          Q1 · APR 2026
        </span>
      </div>

      <div className="grid grid-cols-[160px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-6 hidden md:block">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4">
            Builder
          </p>
          <p className="text-[13px] font-medium leading-tight mb-6">
            [Edifice · Hyderabad]<br />
            <span className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">
              3 projects · 22 units
            </span>
          </p>
          <nav className="space-y-1">
            {[
              { label: "Pipeline", active: true },
              { label: "Leads" },
              { label: "Agents" },
              { label: "Properties" },
              { label: "Analytics" },
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
            Inventory
          </p>
          <div className="space-y-1 text-[12px]">
            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[var(--color-surface-warm)]">
              <span className="font-medium">Skyline Towers</span>
              <span className="mono text-[10px] text-[var(--color-primary-orange)]">4</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded">
              <span className="text-[var(--color-text-secondary)]">Eden Gardens</span>
              <span className="mono text-[10px] text-[var(--color-text-muted)]">11</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded">
              <span className="text-[var(--color-text-secondary)]">The Meridian</span>
              <span className="mono text-[10px] text-[var(--color-text-muted)]">7</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="p-6 md:p-8">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                Q1 2026 · Apr pipeline
              </p>
              <h3 className="text-display text-xl md:text-2xl leading-tight">
                Lead pipeline
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="mono text-[11px] border border-[var(--color-line)] px-2.5 py-1 rounded">
                Filter · 6
              </span>
              <span className="mono text-[11px] bg-[var(--color-ink)] text-white px-2.5 py-1 rounded">
                + New lead
              </span>
            </div>
          </div>

          {/* KPI strip — identical shape to DashboardMockup */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {kpis.map((k) => {
              const accentColor = k.muted ? "var(--color-ink)" : "#15803D";
              const deltaColor = k.muted
                ? "var(--color-text-secondary)"
                : "#15803D";
              return (
                <div
                  key={k.label}
                  className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
                >
                  <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
                    {k.label}
                  </p>
                  <p
                    className="text-display text-lg md:text-xl leading-none mb-1"
                    style={{ color: accentColor }}
                  >
                    {k.value}
                  </p>
                  <p className="mono text-[10px] tracking-[0.08em]" style={{ color: deltaColor }}>
                    {k.trend === "up" ? "↑" : "↓"} {k.delta}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Kanban */}
          <div className="grid grid-cols-5 gap-2.5 mb-8">
            {stages.map((s, i) => (
              <div key={i} className="min-w-0">
                <div className="flex items-baseline justify-between mb-2 px-1">
                  <p className="mono text-[9.5px] text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                    {s.name}
                  </p>
                  <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-surface-warm)] text-[var(--color-primary-orange)]">
                    {s.count}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {s.leads.map((l, li) => {
                    const src = sourceMeta[l.src];
                    return (
                      <div
                        key={li}
                        className="rounded-lg p-2.5 bg-white border border-[var(--color-line)]"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-medium text-[var(--color-ink)] truncate">
                            {l.name}
                          </span>
                          <span
                            className="mono text-[8.5px] px-1 py-0.5 rounded tracking-[0.05em] shrink-0"
                            style={{ color: src.color, background: `${src.color}15` }}
                          >
                            {src.label}
                          </span>
                        </div>
                        <p className="text-[10px] mb-1.5 text-[var(--color-text-secondary)] truncate">
                          {l.prop}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="mono text-[10px] text-[var(--color-ink)] font-medium">
                            {l.budget}
                          </span>
                          <span
                            className={`mono text-[9px] px-1 py-0.5 rounded ${
                              l.score >= 85
                                ? "bg-[#ECFDF3] text-[#15803D]"
                                : "bg-[var(--color-surface-warm)] text-[var(--color-text-muted)]"
                            }`}
                          >
                            {l.score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="rounded-lg py-1.5 text-center border border-dashed border-[var(--color-line)]">
                    <span className="mono text-[9px] text-[var(--color-text-muted)]">
                      +{s.count - s.leads.length} more
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer — source attribution */}
          <div className="pt-5 border-t border-[var(--color-line)]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                Lead sources · YTD
              </p>
              <div className="flex items-center gap-4 text-[10.5px]">
                {[
                  { src: "Website", pct: 45, color: "#1A5FD4" },
                  { src: "99acres", pct: 28, color: "#F46B2C" },
                  { src: "Magicbricks", pct: 18, color: "#B45309" },
                  { src: "WhatsApp", pct: 9, color: "#15803D" },
                ].map((s) => (
                  <div key={s.src} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-[var(--color-text-secondary)]">{s.src}</span>
                    <span className="mono" style={{ color: s.color }}>
                      {s.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
