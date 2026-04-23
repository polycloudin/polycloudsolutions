import type { Metadata } from "next";
import Link from "next/link";
import DepthDemoWrapper from "./DepthDemoWrapper";

/**
 * Hidden playground. Not in navigation. Not in sitemap. No sibling page
 * links here. Only reachable by someone who types the URL.
 *
 * Why it exists: the public Digital funnel doesn't benefit from this demo
 * (adversarial review scored the marketing-page version 42/100 for
 * exactly that reason — WebGPU flex on an SMB sales page). But the tech
 * itself is real and sometimes we want to show it to a developer-audience
 * prospect in a 1:1 context. Keep it here, link to it manually when it
 * helps, don't let search engines index it.
 */
export const metadata: Metadata = {
  title: "Playground · depth — PolyCloud",
  robots: { index: false, follow: false, nocache: true },
};

export default function DepthPlayground() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="font-serif text-xl tracking-tight text-white">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Playground · not indexed
        </span>
      </header>

      <main className="flex-1 px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-6 md:mb-8">
            <p className="mono text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
              Depth Anything V2 · Transformers.js · Three.js
            </p>
            <h1 className="text-display text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.1] tracking-tight">
              Webcam →{" "}
              <span className="text-serif-accent text-[var(--color-primary-orange)]">
                12,288-point
              </span>{" "}
              cloud, in your browser.
            </h1>
            <p className="text-[14px] text-white/60 leading-relaxed mt-3 max-w-2xl">
              No backend. No upload. The ML model loads once (~100 MB fp32
              on first load, cached after), runs locally, and re-projects
              each camera frame as a 12,288-point depth field you can orbit.
              First run on a fresh device takes 30–60 s; subsequent loads
              are instant.
            </p>
          </div>

          <DepthDemoWrapper />

          <p className="mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 mt-4 text-center">
            WebGPU preferred · WASM fallback · camera never leaves the device
          </p>
        </div>
      </main>

      <footer className="px-6 md:px-10 py-5 border-t border-white/10 text-center">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          Hidden route · for internal demos and dev-audience prospect calls
        </span>
      </footer>
    </div>
  );
}
