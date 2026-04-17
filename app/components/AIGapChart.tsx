"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  stage: string;
  expected: number;
  actual: number;
  note: string;
  source: string;
};

const rows: Row[] = [
  {
    stage: "Using AI in some form",
    expected: 100,
    actual: 88,
    note: "Near-universal adoption across mid-market and SMBs.",
    source: "Libertify · McKinsey State of AI 2025",
  },
  {
    stage: "Reaching production",
    expected: 88,
    actual: 48,
    note: "Gartner — only half of AI pilots cross into production deployments.",
    source: "Gartner AI Readiness 2025",
  },
  {
    stage: "Workflows actually redesigned",
    expected: 48,
    actual: 21,
    note: "McKinsey — bolting AI onto existing processes is why most projects flatline.",
    source: "McKinsey State of AI 2025",
  },
  {
    stage: "Measurable bottom-line impact",
    expected: 21,
    actual: 6,
    note: "RAND — 80% of AI projects fail, twice the failure rate of non-AI IT projects.",
    source: "RAND · Libertify",
  },
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
      { threshold: 0.25 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-8">
      {rows.map((r, i) => {
        const expectedWidth = revealed ? `${r.expected}%` : "0%";
        const actualWidth = revealed ? `${r.actual}%` : "0%";
        const gap = r.expected - r.actual;
        const delay = i * 180;

        return (
          <div key={r.stage} className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-10">
            {/* Left: stage label + note + source */}
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] tracking-[0.2em] mb-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h4 className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.2] font-medium mb-3">
                {r.stage}
              </h4>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-2">
                {r.note}
              </p>
              <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.1em]">
                {r.source}
              </p>
            </div>

            {/* Right: bars */}
            <div>
              {/* Expected row */}
              <div className="flex items-center gap-4 mb-3">
                <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] w-[68px] shrink-0">
                  Previous
                </span>
                <div className="relative flex-1 h-7 bg-[var(--color-line)]/60 rounded-sm overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{
                      width: expectedWidth,
                      backgroundColor: "rgba(10,10,10,0.18)",
                      transition: `width 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                    }}
                  />
                </div>
                <span className="mono text-[12px] text-[var(--color-text-secondary)] w-[42px] text-right shrink-0">
                  {r.expected}%
                </span>
              </div>

              {/* Actual row */}
              <div className="flex items-center gap-4">
                <span className="mono text-[10px] text-[var(--color-primary-blue)] uppercase tracking-[0.15em] w-[68px] shrink-0">
                  Actual
                </span>
                <div className="relative flex-1 h-7 bg-[var(--color-line)]/60 rounded-sm overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{
                      width: actualWidth,
                      background:
                        "linear-gradient(90deg, #1A5FD4 0%, #1A5FD4 75%, #F46B2C 100%)",
                      transition: `width 1300ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 100}ms`,
                    }}
                  />
                </div>
                <span
                  className="mono text-[12px] w-[42px] text-right shrink-0 font-medium"
                  style={{ color: "#1A5FD4" }}
                >
                  {r.actual}%
                </span>
              </div>

              {/* Gap annotation */}
              <div className="mt-2 pl-[84px] flex items-center gap-2">
                <span className="mono text-[10px] text-[var(--color-primary-orange)] tracking-[0.1em]">
                  ↓ {gap} pts lost at this step
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
