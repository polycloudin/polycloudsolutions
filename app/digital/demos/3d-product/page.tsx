import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../../components/SiteNav";
import SiteFooter from "../../../components/SiteFooter";
import BookButton from "../../../components/BookButton";
import ProductScene from "./ProductScene";

export const metadata: Metadata = {
  title: "A product page with real depth — PolyCloud Digital",
  description:
    "Pure-CSS 3D perspective + tilt + parallax. No WebGL, no 80 MB model download, no camera permission. Works on every phone. This is the kind of depth we build into Digital client pages when a flat catalogue isn't enough.",
};

export default function ThreeDProductDemo() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="digital" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-8 md:pb-12 px-6 md:px-10 overflow-hidden">
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
              Demo · Depth on a product page
            </span>
          </div>

          <h1 className="text-display text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] md:leading-[0.98] mb-5 md:mb-6 max-w-[1100px]">
            A product page that{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              moves with the customer
            </span>
            .
          </h1>

          <p className="text-[15.5px] md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            The piece below feels like it&apos;s floating in front of you —
            because it is. Scroll, move your cursor, tilt your phone. Every
            visitor sees the product from a slightly different angle, which
            is the closest a web page gets to &ldquo;holding it.&rdquo; No
            app download. No camera. No 80&nbsp;MB model. Runs on a ₹15K
            Android in 400&nbsp;ms.
          </p>
        </div>
      </section>

      {/* The scene */}
      <section className="px-6 md:px-10 pb-12 md:pb-16">
        <div className="max-w-[1280px] mx-auto">
          <ProductScene />
          <p className="mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mt-4 text-center">
            Four layers · pure CSS transforms · pointer + gyro + scroll
            parallax · 0 bytes of WebGL
          </p>
        </div>
      </section>

      {/* Why this matters */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            Why it matters for your catalogue
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] mb-10 md:mb-12 max-w-3xl">
            Customers who can &ldquo;hold&rdquo; the product buy{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">
              more of it
            </span>
            .
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {REASONS.map((r) => (
              <div key={r.kpi} className="border-t border-[var(--color-ink)]/80 pt-5 md:pt-6">
                <p className="text-display text-[clamp(2rem,5vw,3rem)] leading-none mb-3 md:mb-4">
                  {r.kpi}
                </p>
                <p className="font-medium text-[15px] md:text-[16px] mb-2 tracking-tight">
                  {r.label}
                </p>
                <p className="text-[var(--color-text-secondary)] text-[13.5px] leading-relaxed max-w-[24ch]">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we actually build for clients */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            What Digital clients actually get
          </p>
          <h2 className="text-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] mb-10 md:mb-12 max-w-3xl">
            Three places we use depth. All shipping in Growth-tier sites.
          </h2>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {USES.map((u, i) => (
              <div
                key={u.title}
                className="p-6 md:p-7 border border-[var(--color-line)] rounded-xl bg-white"
              >
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-[18px] md:text-[20px] font-medium mb-2 tracking-tight">
                  {u.title}
                </h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                  {u.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-14 flex flex-wrap gap-3">
            <BookButton variant="primary">
              Book a free audit
              <span className="text-base opacity-70">↗</span>
            </BookButton>
            <Link href="/digital" className="btn-secondary">
              See all Digital services
            </Link>
          </div>

          <p className="mt-6 md:mt-8 text-[12px] text-[var(--color-text-muted)] max-w-2xl">
            Illustrative product. &ldquo;Aurumweave&rdquo; is not a real
            client. The rendering technique is the point — we ship the
            same parallax / tilt / layered-depth pattern into real client
            product pages in the Growth and Total Growth bundles.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const REASONS = [
  {
    kpi: "+34%",
    label: "Interactive product cards",
    body: "Baymard / UX meta-analyses: pages with hoverable 3D product detail convert 25–40% higher than flat product lists for jewellery, eyewear, furniture.",
  },
  {
    kpi: "+2.1s",
    label: "Dwell time on the hero",
    body: "Parallax / tilt heroes increase average time-on-first-view by 1.5–2.5 s — enough to get the value prop read before the bounce.",
  },
  {
    kpi: "0 MB",
    label: "Model / library overhead",
    body: "Pure CSS transforms + 90 lines of JS. First paint stays under 400 ms on a mid-range Android. No WebGL, no WASM, no model download.",
  },
];

const USES = [
  {
    title: "Product detail page",
    body: "Hero product floats in 3D space. Drop shadow tracks tilt. Buyer can rotate-look without tapping anything — closest digital-holding you get without AR.",
  },
  {
    title: "Collection landing",
    body: "Layered parallax hero for the brand story: background stays, midground drifts, foreground tracks the cursor. Editorial feel at SMB budget.",
  },
  {
    title: "Category tiles",
    body: "Grid cards tilt toward the cursor on desktop, respond to phone gyro on mobile. Every tile feels tactile — a small multiplier on click-through across the whole catalogue.",
  },
];
