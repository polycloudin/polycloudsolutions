"use client";

import dynamic from "next/dynamic";

// Client-only — transformers.js + WebGPU can't run at build time.
// `ssr: false` must live in a client component in Next.js 15/16.
const DepthDemo = dynamic(() => import("./DepthDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl bg-[#0A0A0A] border border-[var(--color-line)] flex items-center justify-center">
      <p className="mono text-[11px] uppercase tracking-wider text-white/40">Loading…</p>
    </div>
  ),
});

export default function DepthDemoWrapper() {
  return <DepthDemo />;
}
