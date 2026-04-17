"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  occupation: string;
  theoretical: number;
  observed: number;
};

// Data from the Anthropic Economic Index
// Theoretical = share of tasks LLMs could perform (GPT-4 / BLS mapping)
// Observed = actual task coverage from Claude usage data
const rows: Row[] = [
  { occupation: "Computer & math", theoretical: 94, observed: 33 },
  { occupation: "Legal", theoretical: 88, observed: 20 },
  { occupation: "Architecture & engineering", theoretical: 85, observed: 5 },
  { occupation: "Business & financial ops", theoretical: 82, observed: 27 },
  { occupation: "Life, physical & social science", theoretical: 76, observed: 15 },
  { occupation: "Management", theoretical: 68, observed: 18 },
  { occupation: "Sales & related", theoretical: 62, observed: 27 },
  { occupation: "Office & admin support", theoretical: 58, observed: 38 },
];

export default function AIGapChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-10 pb-6 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-8 h-2.5 rounded-sm"
            style={{ backgroundColor: "rgba(26, 95, 212, 0.22)" }}
          />
          <span className="mono text-[11px] tracking-[0.1em] text-[var(--color-text-secondary)]">
            Theoretical — what AI could do
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-8 h-2.5 rounded-sm"
            style={{ backgroundColor: "#F46B2C" }}
          />
          <span className="mono text-[11px] tracking-[0.1em] text-[var(--color-ink)]">
            Observed — what AI is actually doing
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-5">
        {rows.map((r, i) => {
          const gap = r.theoretical - r.observed;
          const delay = i * 110;
          return (
            <div
              key={r.occupation}
              className="grid grid-cols-[1fr_2fr_auto] md:grid-cols-[1.2fr_2.5fr_auto] gap-4 md:gap-6 items-center"
            >
              <div className="text-[13px] md:text-[14px] font-medium text-[var(--color-ink)] leading-tight">
                {r.occupation}
              </div>
              <div className="relative h-8">
                {/* Theoretical band */}
                <div
                  className="absolute inset-y-0 left-0 rounded-sm"
                  style={{
                    width: revealed ? `${r.theoretical}%` : "0%",
                    backgroundColor: "rgba(26, 95, 212, 0.18)",
                    transition: `width 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                  }}
                />
                {/* Theoretical label */}
                <span
                  className="absolute top-1/2 -translate-y-1/2 mono text-[10px] text-[var(--color-primary-blue)]/80 tracking-[0.08em]"
                  style={{
                    left: `calc(${r.theoretical}% + 6px)`,
                    opacity: revealed ? 1 : 0,
                    transition: `opacity 400ms ease ${delay + 900}ms`,
                  }}
                >
                  {r.theoretical}%
                </span>
                {/* Observed bar */}
                <div
                  className="absolute inset-y-1 left-0 rounded-sm"
                  style={{
                    width: revealed ? `${r.observed}%` : "0%",
                    backgroundColor: "#F46B2C",
                    transition: `width 1300ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 250}ms`,
                  }}
                />
                {/* Observed label — inside bar if wide enough, outside otherwise */}
                {r.observed >= 12 && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 mono text-[10px] font-semibold text-white tracking-[0.08em]"
                    style={{
                      left: `calc(${r.observed}% - 34px)`,
                      opacity: revealed ? 1 : 0,
                      transition: `opacity 400ms ease ${delay + 1100}ms`,
                    }}
                  >
                    {r.observed}%
                  </span>
                )}
                {r.observed < 12 && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 mono text-[10px] font-semibold text-[var(--color-primary-orange)] tracking-[0.08em]"
                    style={{
                      left: `calc(${r.observed}% + 6px)`,
                      opacity: revealed ? 1 : 0,
                      transition: `opacity 400ms ease ${delay + 1100}ms`,
                    }}
                  >
                    {r.observed}%
                  </span>
                )}
              </div>
              <div className="mono text-[11px] text-[var(--color-text-muted)] tracking-[0.08em] whitespace-nowrap">
                −{gap} pt gap
              </div>
            </div>
          );
        })}
      </div>

      {/* Source */}
      <div className="mt-10 pt-6 border-t border-[var(--color-line)]">
        <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.15em] uppercase mb-2">
          Source
        </p>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
          Anthropic Economic Index · &ldquo;Labor market impacts of AI&rdquo; (Mar 2026). Theoretical exposure from GPT-4/BLS task mapping; observed exposure from Claude usage data across US occupations.
        </p>
      </div>
    </div>
  );
}
