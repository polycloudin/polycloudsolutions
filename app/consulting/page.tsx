import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consulting — Platform-grade systems | PolyCloud",
  description:
    "Custom AI and automation consulting for serious operators. Audits, sprints, platform builds, and long-term retainers.",
};

const engagements = [
  {
    num: "01",
    name: "Audit",
    duration: "2 weeks · fixed fee",
    pitch: "A hard look at where your operation bleeds hours, margin, or leverage — and which systems would compound if built.",
    deliverable: "Diagnostic report + prioritized roadmap + ROI model.",
  },
  {
    num: "02",
    name: "Sprint",
    duration: "4 weeks · fixed scope",
    pitch: "One system, shipped to production. A contained engagement that proves the playbook before committing to the full build.",
    deliverable: "Live system + ops documentation + handover or retainer option.",
  },
  {
    num: "03",
    name: "Platform build",
    duration: "8–12 weeks · phased",
    pitch: "Multi-system infrastructure designed for your operation. Custom AI agents, data pipelines, internal tools, and the integration layer between them.",
    deliverable: "Production platform + team training + 90-day hypercare.",
  },
  {
    num: "04",
    name: "Retainer",
    duration: "Quarterly · rolling",
    pitch: "Embedded automation partner. We run the systems we build, iterate them quarterly, and stay close enough to spot the next leverage point before you do.",
    deliverable: "Ongoing ops + monthly performance reviews + on-call engineering.",
  },
];

const cases = [
  {
    vertical: "Professional services",
    subtitle: "Mid-market advisory",
    headline: "300% client throughput, same headcount",
    summary:
      "Built a compliance-filing pipeline that replaced 10 hours of weekly manual reconciliation per associate. Freed senior time for complex casework while AI absorbed volume.",
  },
  {
    vertical: "D2C brand",
    subtitle: "Apparel, multi-city",
    headline: "₹1.2Cr incremental revenue in Q3",
    summary:
      "Designed and deployed a messaging-first sales engine on WhatsApp Business API. AI-qualified leads, human-closed high-intent traffic, full attribution on the back end.",
  },
  {
    vertical: "Manufacturing",
    subtitle: "B2B distribution",
    headline: "72% reconciliation time reclaimed",
    summary:
      "Rebuilt invoice-to-ledger reconciliation as an AI-first pipeline with exception routing. Finance team moved from data-entry to decision-making inside a quarter.",
  },
];

export default function Consulting() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Consulting — Custom</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,10vw,8.5rem)] mb-10 max-w-[1200px] leading-[0.95]">
            Platform-grade systems for serious{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">operators</span>.
          </h1>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Bespoke engagements for mid-market companies shipping real infrastructure. We diagnose, design, and build — then stay embedded long enough to prove the systems compound.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://cal.com/polycloud/intro" className="btn-primary">
                Book a call ↗
              </a>
              <Link href="#engagements" className="btn-secondary">
                Engagement models
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="px-6 md:px-10 py-24 md:py-36 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Four ways to start</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                Diagnose, sprint, ship, <span className="text-serif-accent">stay</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Most partnerships start with an Audit or Sprint. The best ones become Retainers — because the systems we build keep paying back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {engagements.map((e, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface)] p-10 md:p-14 hover:bg-white transition-colors group"
              >
                <div className="flex items-baseline gap-5 mb-6">
                  <span className="mono text-xs text-[var(--color-primary-orange)]">{e.num}</span>
                  <span className="mono text-xs text-[var(--color-text-muted)]">{e.duration}</span>
                </div>
                <h3 className="text-[clamp(2rem,3.5vw,3rem)] mb-6 leading-tight">{e.name}</h3>
                <p className="text-[var(--color-text)] text-[15px] leading-relaxed mb-6 max-w-md">
                  {e.pitch}
                </p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-md">
                  <span className="text-[var(--color-ink)] font-medium">Deliverable —</span> {e.deliverable}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies — directional, not specific names */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Engagement outcomes</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                What <span className="text-serif-accent">compounds</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              We don't run case studies with logos — most clients prefer quiet. Here's what the systems do, by vertical.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[var(--color-line)] p-10 card-hover"
              >
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">{c.vertical}</p>
                <p className="text-[var(--color-text-muted)] text-xs mb-6 font-mono">{c.subtitle}</p>
                <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] mb-5 leading-tight">{c.headline}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-36 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Next step</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Start with a 2-week <span className="text-serif-accent text-[var(--color-primary-orange)]">audit</span>.
          </h2>
          <p className="text-white/60 text-[17px] md:text-lg max-w-2xl leading-relaxed mb-10">
            Fixed scope. Fixed fee. Written diagnostic and roadmap at the end — whether or not you continue with PolyCloud. A good audit pays for itself in avoided mistakes alone.
          </p>
          <a
            href="https://cal.com/polycloud/intro"
            className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
          >
            Scope an audit ↗
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline text-[var(--color-ink)] font-medium">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <a href="https://cal.com/polycloud/intro" className="btn-primary !py-2 !px-4 !text-[13px]">
            Book a call
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-10 py-14 bg-[var(--color-ink)] border-t border-white/10 text-white/60">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-display text-lg text-white">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </span>
          <span className="text-white/30">·</span>
          <span>© 2026 · Est. 2020</span>
        </div>
        <div className="flex gap-8">
          <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
          <Link href="/consulting" className="hover:text-white transition-colors">Consulting</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
