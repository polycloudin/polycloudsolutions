import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../../components/SiteNav";
import SiteFooter from "../../../components/SiteFooter";
import DepthDemoWrapper from "./DepthDemoWrapper";

export const metadata: Metadata = {
  title: "Live depth · 3D point-cloud in-browser — PolyCloud Digital",
  description:
    "A real-time Depth-Anything-V2 demo running locally in your browser. No backend. 12,288 points, WebGPU-accelerated. Built by PolyCloud Digital as a proof of what web can do in 2026.",
};

export default function DepthDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="digital" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-10 md:pb-16 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Link
              href="/digital"
              className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              ← Digital
            </Link>
            <span className="text-[var(--color-line)]">/</span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Demo · Real-time depth
            </span>
          </div>

          <h1 className="text-display text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] md:leading-[0.98] mb-5 md:mb-6 max-w-[1100px]">
            A website that turns your webcam into a{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">3D point cloud</span>.
          </h1>

          <p className="text-[15.5px] md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            No server. No upload. A 24.8M-parameter Vision Transformer
            (Depth-Anything-V2-Small) ships with the page, loads in your
            browser, and reprojects each camera frame into 12,288 points
            that you can orbit. This is the kind of thing we build for
            Digital clients when a brochure site isn't enough.
          </p>
        </div>
      </section>

      {/* Demo */}
      <section className="px-6 md:px-10 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <DepthDemoWrapper />
          <p className="mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mt-4 text-center">
            Works in Chrome / Edge / Arc. WebGPU preferred; WASM fallback. Camera never leaves the device.
          </p>
        </div>
      </section>

      {/* Explainer */}
      <section className="px-6 md:px-10 py-16 md:py-28 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            How it works
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] mb-10 md:mb-14 max-w-3xl">
            Four moving parts, zero infrastructure.
          </h2>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {PARTS.map((p, i) => (
              <div
                key={p.title}
                className="p-6 md:p-7 border border-[var(--color-line)] rounded-xl bg-[var(--color-surface)]"
              >
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                  {String(i + 1).padStart(2, "0")} · {p.tag}
                </p>
                <h3 className="text-[18px] md:text-[20px] font-medium mb-2 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this matters for SMBs */}
      <section className="px-6 md:px-10 py-16 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            Why it matters for your site
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] mb-8 md:mb-10 max-w-3xl">
            The rules of what a web page can do just changed.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {USES.map((u) => (
              <div key={u.title} className="border-t border-[var(--color-ink)]/80 pt-5 md:pt-6">
                <p className="font-medium text-[16px] md:text-[17px] mb-2 tracking-tight">{u.title}</p>
                <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 md:mt-14 text-[var(--color-text-secondary)] text-[14px] leading-relaxed max-w-2xl">
            We don&apos;t ship this on every Digital site — it&apos;s overkill for a
            dentist clinic. But when a brand wants to feel like it belongs
            in 2026, we have the toolkit. Template sites stop at carousels;
            we don&apos;t.
          </p>
          <div className="mt-10 md:mt-12 flex flex-wrap gap-3">
            <Link href="/digital" className="btn-primary">
              Back to Digital
            </Link>
            <Link href="/#paths" className="btn-secondary">
              Other practices →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const PARTS = [
  {
    tag: "Model",
    title: "Depth Anything V2 Small",
    body:
      "A 24.8M-parameter Vision Transformer from ByteDance + HKU. Outputs a relative depth map from a single RGB frame. ONNX-quantised to ~80 MB, cached by the browser after first load.",
  },
  {
    tag: "Runtime",
    title: "Transformers.js + WebGPU",
    body:
      "The same HuggingFace pipeline API you'd use in Python, compiled to JavaScript. Runs on WebGPU when available (Chrome, Edge), falls back to WebAssembly SIMD on everything else. No Python, no server.",
  },
  {
    tag: "Geometry",
    title: "Three.js point cloud",
    body:
      "Each frame's 256×192 depth map is downsampled to a 128×96 = 12,288-point buffer. Z-positions are written in-place into a Float32Array attribute, uploaded to GPU, and rendered with vertex-coloured Points.",
  },
  {
    tag: "Privacy",
    title: "The camera stays local",
    body:
      "No frame is ever uploaded. Inference runs in your tab, in the GPU you already own. When you click Stop, the video track ends and the stream is released. This is a privacy feature, not just an engineering choice.",
  },
];

const USES = [
  {
    title: "Configurators that feel alive",
    body:
      "Product customisers, virtual showrooms, AR try-ons — without an app download and without sending pixels to a third-party service. The browser is the runtime.",
  },
  {
    title: "Brand moments that compound",
    body:
      "A single surprising interaction is worth ten carousels. People share the URL. The bounce rate drops. You stop losing visitors to Instagram within 8 seconds.",
  },
  {
    title: "Edge intelligence, not cloud bills",
    body:
      "Inference cost ₹0. No GPU cluster. No API billing. The model ships with the page and runs on the visitor's device — same model of autonomy we bring to every Digital system.",
  },
];
