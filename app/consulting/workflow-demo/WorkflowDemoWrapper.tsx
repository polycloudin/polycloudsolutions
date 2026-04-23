"use client";

import dynamic from "next/dynamic";

// Client-only — React Flow needs `window` / `document` at hydrate time.
const WorkflowDemo = dynamic(() => import("./WorkflowDemo"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-[var(--color-line)] bg-white h-[560px] md:h-[680px] flex items-center justify-center">
      <p className="mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
        Loading diagram…
      </p>
    </div>
  ),
});

export default function WorkflowDemoWrapper() {
  return <WorkflowDemo />;
}
