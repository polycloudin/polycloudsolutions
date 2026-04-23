import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Labs — Deep-tech intelligence for investors, incubators, and deep-tech operators",
  description:
    "Institutional-grade due diligence, cohort screening, IP landscape, sector thesis, and technical strategy. Eight research agents running a six-phase pipeline with knowledge-graph memory. Delivered in weeks, not months.",
  alternates: { canonical: "/labs" },
  keywords: [
    "deep-tech due diligence",
    "VC technical DD",
    "cohort screening incubator",
    "IP landscape analysis",
    "sector thesis research",
    "technical strategy deep-tech",
    "research as a service",
  ],
};

const outputs = [
  {
    num: "01",
    name: "Technical due diligence",
    tagline: "Two weeks. One deal. One verdict.",
    body:
      "Deep-tech DD that goes past the founder's pitch. Published science evaluated at PhD depth. Competing teams mapped. IP conflicts flagged. Regulatory path scored. One written verdict with cited sources.",
    deliverable: "Diagnostic report + technical plausibility score + IP + regulatory + team + market assessment.",
  },
  {
    num: "02",
    name: "Cohort screening",
    tagline: "200 applicants → 40 technically plausible in 48 hours.",
    body:
      "Batch-screen an applicant pool at the depth a human analyst applies to one deal. Each founder gets a scored card: technical plausibility · IP strength · market sizing · regulatory + team. Filtered, sorted, comparable.",
    deliverable: "Ranked shortlist + per-applicant scorecard + comparison matrix.",
  },
  {
    num: "03",
    name: "IP + patent landscape",
    tagline: "Prior art, white space, litigation exposure.",
    body:
      "We map what's already patented, who's suing whom, and where the defensible white space lives. Goes beyond the USPTO — EPO, JPO, SIPO, and tracked litigation — pulled live per engagement.",
    deliverable: "Patent landscape map + prior-art conflict list + defensibility score.",
  },
  {
    num: "04",
    name: "Sector thesis builds",
    tagline: "What's real, what's hype, where the money is moving.",
    body:
      "Full-spectrum sector analysis for thesis-driven funds. Published research + funding flows + talent migration + regulatory signals + researcher networks. One document you can brief your IC with.",
    deliverable: "Sector thesis doc + investment map + network graph + public-vs-PE-vs-VC flow analysis.",
  },
];

const capabilities = [
  { stat: "8", label: "Research agents", sub: "academic, patent, grant, VC, regulatory, talent, market, competitor" },
  { stat: "6-phase", label: "Pipeline", sub: "plan → search → cross-pollinate → iterate → verify → synthesize" },
  { stat: "12+", label: "Sources in parallel", sub: "arXiv, Semantic Scholar, USPTO, EPO, JPO, SIPO, grant DBs, VC press, regulatory bulletins" },
  { stat: "KG", label: "Knowledge-graph memory", sub: "every run compounds — paper, patent, author, and deal links persist across engagements" },
  { stat: "PhD-grade", label: "Depth, not breadth", sub: "published science evaluated at specialist depth, not abstract-level skims" },
  { stat: "Weeks", label: "Turnaround", sub: "one week for screens, two weeks for full DD — months of work compressed" },
];

const useCases = [
  { who: "VCs", needs: "Deep-tech DD · technical plausibility · IP landscape · sector thesis" },
  { who: "Incubators", needs: "Cohort screening · mentorship matching · IP conflict checks · regulatory scan" },
  { who: "Deep-tech operators", needs: "Competitive intel · prior-art defensibility · technical strategy · regulatory path · team benchmarking" },
  { who: "Family offices", needs: "Sector thesis · co-investment screening · due diligence for deep-tech deals" },
  { who: "Rating agencies + research desks", needs: "Sector coverage · primitive data feeds · white-label research" },
];

export default function Labs() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="labs" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(244, 107, 44, 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(26, 95, 212, 0.04) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Labs — Research for capital allocators & deep-tech operators</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,10vw,8.5rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            Deep-tech intelligence, delivered in{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">weeks</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Institutional-grade due diligence, cohort screening, IP landscaping, technical strategy, and sector thesis — for investors, incubators, and the deep-tech operators building the next platform shifts. Eight research agents, six-phase pipeline, knowledge-graph memory. Built to replace six-week Big 4 DD with two-week outputs that go deeper.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">Scope a DD ↗</BookButton>
              <Link href="#capability" className="btn-secondary">The capability</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities strip */}
      <section id="capability" className="px-6 md:px-10 py-14 md:py-24 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">The research infrastructure</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {capabilities.map((c) => (
              <div key={c.label}>
                <p className="text-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-none mb-2">{c.stat}</p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-1">
                  {c.label}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{c.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[var(--color-text-secondary)] text-[13px] max-w-3xl leading-relaxed">
            Every run compounds the graph. A week of compute can ingest thousands of papers and patents at specialist depth, for a marginal cost that makes month-long human research engagements look expensive by an order of magnitude.
          </p>
        </div>
      </section>

      {/* Outputs */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / What comes back</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl leading-[1]">
                Four <span className="text-serif-accent">outputs</span>. One stack.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Every engagement is fixed-scope, fixed-fee. A written deliverable in your hands in two weeks, not six. Defensible under IC scrutiny.
            </p>
          </div>
          <div className="space-y-5">
            {outputs.map((o) => (
              <div
                key={o.num}
                className="bg-white rounded-xl border border-[var(--color-line)] p-8 md:p-12 card-hover"
              >
                <div className="grid md:grid-cols-[0.5fr_1.2fr_1fr] gap-8 md:gap-12">
                  <div>
                    <p className="mono text-xs text-[var(--color-primary-orange)] mb-4">{o.num} / Output</p>
                    <h3 className="text-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-none mb-4">
                      {o.name}
                    </h3>
                  </div>
                  <div>
                    <p className="text-display text-serif-accent text-[clamp(1.15rem,1.5vw,1.35rem)] text-[var(--color-primary-blue)] mb-4">
                      {o.tagline}
                    </p>
                    <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                      {o.body}
                    </p>
                  </div>
                  <div>
                    <p className="text-eyebrow text-[var(--color-text-muted)] mb-3">Deliverable</p>
                    <p className="text-[var(--color-text)] text-[14px] leading-relaxed">
                      {o.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Who we serve</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl leading-[1]">
                Capital <span className="text-serif-accent">allocators</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              VCs, family offices, incubators, rating agencies. Anyone whose decisions depend on whether the underlying science holds up.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {useCases.map((u) => (
              <div key={u.who} className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">{u.who}</p>
                <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{u.needs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Methodology</p>
          <h2 className="text-[clamp(1.875rem,6vw,5rem)] mb-14 leading-[1]">
            A six-phase <span className="text-serif-accent">pipeline</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Plan → Search → Cross-pollinate</p>
              <p>Research agents parallel-search across 12 sources (arXiv, Semantic Scholar, Google Scholar, USPTO, grant databases, VC deals, press, regulatory bulletins). Cross-references close the gaps any single source misses.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Iterate → Verify → Synthesize</p>
              <p>Every claim gets a citation. Every citation gets verified. Uncertainty is flagged, not smoothed. The final synthesis is a written document you can defend under IC scrutiny — not a dashboard.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">LLM tier routing</p>
              <p>Frontier-grade reasoning routed only where it pays, bulk generation on the next tier, classification run locally. Cost-controlled, reproducible, auditable — so the economics work on long horizons, not just one-off reports.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Dogfooded before delivery</p>
              <p>The full-domain synthesis format — hundreds of papers read at specialist depth, researcher profiles, materials-and-signals matrices, publishable follow-ups — has been shipped on our own research. Your sector is next.</p>
            </div>
          </div>
          <p className="mt-14 pt-8 border-t border-[var(--color-line)] text-display text-serif-accent text-[clamp(1.25rem,2vw,1.65rem)] text-[var(--color-primary-blue)] leading-[1.2]">
            Every engagement produces a citable, defensible artifact. Every source is tracked. Every finding is reversible.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-36 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Engage</p>
          <h2 className="text-display text-[clamp(2rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Pilot on one deal in your{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">pipeline</span>.
          </h2>
          <p className="text-white/60 text-[17px] max-w-2xl leading-relaxed mb-10">
            Two weeks. Fixed fee. Written DD in your hands by Friday of week two. If it doesn't match what your in-house analyst would have produced, we refund the engagement.
          </p>
          <BookButton variant="light-primary">Scope a DD ↗</BookButton>
          <p className="mt-10 mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Nexus research platform · separate brand launching at polycloud.ai · Q3 2026
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-[48px] md:top-[52px] left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/labs" className="link-underline text-[var(--color-ink)] font-medium">Labs</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return <SiteFooter />;
}
