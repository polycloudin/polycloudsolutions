import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Labs — Scientific + regulatory intelligence for pharma, biotech, and the capital that backs them",
  description:
    "India-specific scientific due diligence and regulatory intelligence. 48,083 FDA Orange Book products and 16,724 active US patents under monitoring; live CDSCO India filings ingestion. We fill the 2-4 week gaps Cortellis and Citeline miss — patent cliff calendars, biosimilar landscapes, contested-science analysis. Three case studies shipped.",
  alternates: { canonical: "/labs" },
  keywords: [
    "pharma competitive intelligence India",
    "biotech due diligence India",
    "CDSCO regulatory intelligence",
    "Indian patent cliff analysis",
    "FDA Orange Book monitoring",
    "ANDA filing intelligence",
    "biosimilar competitive landscape",
    "clinical trial monitoring India",
    "contested science due diligence",
    "deep-tech DD India",
  ],
};

const outputs = [
  {
    num: "01",
    name: "Technical + scientific DD",
    tagline: "Two weeks. One asset. One verdict.",
    body:
      "Past the pitch deck. Published science evaluated at PhD depth with four-panel adversarial review. Competitor pipelines mapped. Artifact risks flagged with named mechanisms, not vague skepticism. One written verdict with cited sources — every claim traceable to a source corpus.",
    deliverable: "Diagnostic report + plausibility score + IP + regulatory path + team + market — 10-17 pages, citation-grounded.",
  },
  {
    num: "02",
    name: "CDSCO + regulatory intelligence feed",
    tagline: "India-specific where the global tools lag 2-4 weeks.",
    body:
      "Cortellis and Citeline miss Indian regulatory granularity — CDSCO filings, DCGI approval letters, biosimilar import licences. We scrape, classify, and monitor four CDSCO surfaces (notifications, approved drugs, biologicals, clinical-trial permissions). Live ingestion is running for design-partner tenants — first April 2026 CT-05 / CT-10 / CT-12 circulars are already in the database.",
    deliverable: "Daily alerts + monthly digest + on-demand competitive summary — JSON, markdown, or PDF, your choice.",
  },
  {
    num: "03",
    name: "Patent cliff calendar",
    tagline: "FDA Orange Book × your portfolio. 24-month window, monthly refresh.",
    body:
      "48,083 FDA Orange Book products and 16,724 active US patents indexed and joined to the cliff date. Filter by therapeutic area or originator (Otsuka 45 patents cliffing, Takeda 37, Bausch 24). Substring-match against your CDSCO drug-name register — surface every patent expiring in your filing window. Built for Indian generic formulators timing ANDA submissions for Day-1 entry.",
    deliverable: "Monthly markdown / PDF report + JSON feed + tenant-scoped match list against your filings.",
  },
  {
    num: "04",
    name: "Custom DD — domain of your choice",
    tagline: "Pick a therapeutic area, a contested claim, or a pipeline thesis.",
    body:
      "If the domain isn't one we've shipped publicly, we scope a custom engagement. Biotech, pharma, materials, contested physics — the pipeline generalises. Ten days to a written deliverable, NVIDIA-tier compute cost, citation-grounded output with an honest 'insufficient data' flag where the corpus is thin.",
    deliverable: "10-day turn · 10-15 page report + source corpus + dashboard (for repeat engagements).",
  },
];

const capabilities = [
  { stat: "66,777", label: "Records under monitoring", sub: "48,083 FDA Orange Book products · 16,724 active US patents · 1,980 exclusivities · 10 live CDSCO filings — refreshed monthly, dedup-safe, tenant-scoped" },
  { stat: "3", label: "Case studies shipped", sub: "LENR (contested physics, 37yr open) · LK-99 (closed case, 6-week resolution) · Indian biosimilars (live biotech pipeline) — 4th case (Alzheimer's amyloid) queued" },
  { stat: "249", label: "Tests passing in 4.7s", sub: "Real-DB integration tests · async conftest with TRUNCATE cleanup · scraper + service + route + agent layers — the pipeline is provable, not vibes" },
  { stat: "4-layer", label: "Citation grounding", sub: "strict prompt + indexed source corpus [S#] + citation validator + honest insufficient-data flags — 0 hallucinated claims in shipped reports" },
  { stat: "3-tier", label: "LLM routing", sub: "Gemma 4 local ($0) for classification, Claude for synthesis, NVIDIA Qwen3-480B ($0) as production fallback — no OpenAI dependency" },
  { stat: "~$5", label: "Compute per report", sub: "Versus ₹12-15 Cr/year for Cortellis + Citeline + Clarivate India seats. We complement, we don't replace — we fill their India gap." },
];

const useCases = [
  { who: "Pharma competitive intelligence teams", needs: "CDSCO + DCGI filings 48+ hrs ahead of manual pull · Indian Ph-3 competitor monitoring · patent cliff calendar · biosimilar landscape" },
  { who: "Biotech VCs (India-focused)", needs: "Scientific DD on portfolio candidates · gap analysis on emerging therapeutic areas · Indian regulatory trajectory · 22 peer-VC intel indexed" },
  { who: "Corporate R&D + business development", needs: "Competitive pipeline monitoring · in-licensing candidate evaluation · prior-art defensibility · Indian clinical site intel" },
  { who: "Family offices + allocators", needs: "Therapeutic-area thesis builds · co-investment screening on biotech/pharma deals · management-grade contested-claim risk memos" },
  { who: "Contested-science evaluators (labs, reinsurance, foundations)", needs: "Independent artifact-risk analysis · resolution-speed scoring · specialist literature reviews (LENR, superconductivity, novel claims)" },
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
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Labs — Scientific + regulatory intelligence for pharma, biotech & the capital behind them</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,10vw,8.5rem)] mb-8 md:mb-10 max-w-[1250px] leading-[0.95]">
            India-specific intelligence, where the global feeds go{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">stale</span>.
          </h1>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Cortellis and Citeline cover the world. They lag 2-4 weeks on Indian regulatory. We fill that gap — CDSCO filings, DCGI letters, Indian Ph-3 trials, patent cliffs — plus contested-science DD on the edge cases your internal team doesn&apos;t have the time or specialist depth to run. Three case studies shipped. Every finding citation-grounded. Built to complement your Cortellis seat, not replace it.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">Scope a DD ↗</BookButton>
              <Link href="#cases" className="btn-secondary">See the work</Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-16 md:mt-24 pt-10 border-t border-[var(--color-line)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Case 01 · contested physics</p>
              <p className="text-[15px] text-[var(--color-ink)] leading-snug">
                <span className="font-semibold">LENR / cold fusion.</span> 9,795 papers analyzed. 37-year open case. Contested-science pattern match. Full PDF below.
              </p>
            </div>
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Case 02 · closed case</p>
              <p className="text-[15px] text-[var(--color-ink)] leading-snug">
                <span className="font-semibold">LK-99 superconductor.</span> 48 papers classified. 6-week resolution. Cu₂S artifact identified. PDF downloadable.
              </p>
            </div>
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Case 03 · live commercial</p>
              <p className="text-[15px] text-[var(--color-ink)] leading-snug">
                <span className="font-semibold">Indian oncology biosimilars.</span> 80 PubMed papers · 66 Ph-3 trials · 22 biotech VCs indexed · citation-grounded.
              </p>
            </div>
          </div>

          {/* Live production strip — added Apr 24 with Patent Cliff v10 ship */}
          <div className="mt-8 md:mt-10 px-5 py-4 rounded-xl border border-[var(--color-primary-orange)]/30 bg-[var(--color-primary-orange)]/5">
            <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Live this week — verified Apr 24 2026</p>
            <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">
              <span className="font-semibold">48,083 FDA Orange Book products</span> · <span className="font-semibold">16,724 active US patents</span> · <span className="font-semibold">1,980 drug-product exclusivities</span> indexed and joined to expiry dates — refreshed monthly.{" "}
              <span className="font-semibold">10 CDSCO India circulars</span> ingested live for the first design-partner tenant. <span className="font-semibold">249 / 249 tests</span> green in 4.7s. Three production agents on cron — daily 09:30 IST for India regulatory, monthly for the patent cliff.
            </p>
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
            We complement Cortellis, Citeline, and Clarivate — we don&apos;t replace them. Our wedge is India-specific regulatory granularity and specialist contested-claim depth on the questions your internal team doesn&apos;t have the bandwidth to run. Corpora per domain persist across engagements — a second run in the same therapeutic area starts from the indexed source base, not from zero.
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

      {/* Case study — LENR */}
      <section id="cases" className="px-6 md:px-10 py-16 md:py-36 bg-[#0A0A0A] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 10% 20%, rgba(26, 95, 212, 0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(244, 107, 44, 0.15) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <p className="text-eyebrow text-white/40 mb-5">Case study 01 / Contested physics · open case</p>
          <h2 className="text-[clamp(1.875rem,6vw,5rem)] mb-6 leading-[1]">
            LENR field <span className="text-serif-accent text-[var(--color-primary-blue)]">intelligence</span>.
          </h2>
          <p className="text-white/50 text-[17px] max-w-3xl leading-relaxed mb-12">
            We analyzed the entire published literature on Low Energy Nuclear Reactions — 37 years of contested science
            that mainstream physics dismisses and believers oversell. Four-panel adversarial methodology. Every finding
            stress-tested from both sides.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8 mb-14">
            {[
              { stat: "9,795", label: "Papers analyzed" },
              { stat: "396", label: "Experiments graded A-F" },
              { stat: "1,774", label: "Patents mapped" },
              { stat: "223", label: "Researcher profiles" },
              { stat: "193", label: "Cathode recipes clustered" },
              { stat: "10,300+", label: "Total across 4 domains" },
              { stat: "~$5", label: "Total analytical cost" },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-1 text-white">{c.stat}</p>
                <p className="mono text-[10px] text-white/40 uppercase tracking-[0.18em]">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Signal co-occurrence paradox</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                Transmutation co-occurs with excess heat in 67 papers vs 11 for helium-4.
                The field&apos;s theoretical mainstream models the minority pathway. Never formally published before this analysis.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Chemistry ruled out</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                PdH formation enthalpy verified at 37 kJ/mol (Flanagan &amp; Oates 1991). Total chemical energy for a typical cell: ~2 kJ. Reported excess heat: 1,300+ kJ. Chemistry is orders of magnitude too small.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Adversarial methodology</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                Four-panel review: steelman, attack, blind-spot, and proponent-calibrated agent.
                Probability estimate: 10-30% genuine nuclear phenomenon. Three independent methods converge.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-blue)] mb-3">Cathode recipe analysis</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                193 cathode recipes — first systematic ML analysis ever performed on LENR preparation data.
                Powder/nano cathodes succeed at 3x the rate of thin films. Heat treatment is the only prep that improves outcomes (+14%).
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-blue)] mb-3">COP by calorimetry method</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                Better instruments produce lower results. Flow calorimetry: median COP 1.24. Isoperibolic: 1.33. Pd + flow (most rigorous): 1.20. The &apos;real&apos; effect, if it exists, is at COP ~1.2.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <p className="text-eyebrow text-[var(--color-primary-blue)] mb-3">Contested science pattern match</p>
              <p className="text-white/80 text-[14px] leading-relaxed">
                Scored LENR against 17 historical cases — continental drift, H. pylori, prions, polywater, N-rays. LENR scores 6/20 on vindication factors. Closer to polywater than any vindicated case.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="/lenr-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Download the full report (PDF)
            </a>
            <span className="mono text-[10px] text-white/30 uppercase tracking-[0.18em] ml-2">
              18 primary sources cited · 4-panel adversarial review · 50 hrs processing
            </span>
          </div>
          <div className="mt-14 pt-10 border-t border-white/10">
            <p className="mono text-[10px] text-white/40 uppercase tracking-[0.18em] mb-4">Two more case studies, same pipeline — keep scrolling</p>
            <p className="text-white/50 text-[13px] leading-relaxed max-w-2xl">
              LK-99 (closed in 6 weeks, Cu₂S artifact) and Indian oncology biosimilars (live biotech pipeline, 66 Ph-3 trials, citation-grounded). Same source→classify→synthesize→deliver stack, different domains.
            </p>
          </div>
        </div>
      </section>

      {/* Case study — LK-99 (closed case, fast resolution) */}
      <section className="px-6 md:px-10 py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">Case study 02 / Superconductivity · closed case</p>
          <h2 className="text-[clamp(1.875rem,6vw,5rem)] mb-6 leading-[1]">
            LK-99 — resolved in <span className="text-serif-accent text-[var(--color-primary-blue)]">six weeks</span>.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[17px] max-w-3xl leading-relaxed mb-12">
            Same pipeline, different regime. The July 2023 Korean room-temperature superconductor claim went from arXiv posting to community rejection in 6 weeks. We built the post-mortem: 48 papers classified, artifact named, resolution mechanism mapped, Langmuir pathological-science score applied.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10 mb-12">
            {[
              { stat: "48", label: "Papers classified" },
              { stat: "6 wks", label: "Claim → consensus" },
              { stat: "Cu₂S", label: "Artifact identified" },
              { stat: "4 / 6", label: "Langmuir pathological" },
              { stat: "4-factor", label: "Resolution-speed framework" },
              { stat: "10 pp", label: "Full report PDF" },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-1">{c.stat}</p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">The artifact, named</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                Cu₂S impurity at ~1.5% of sample mass, with a first-order phase transition at ~377 K. That transition produces both the &quot;resistance drop&quot; and the &quot;half-levitation&quot; signal the original team interpreted as superconductivity. Textbook mechanism, well-documented — once you looked.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Verdict distribution</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                4 supports, 25 neutral, 12 contradicts, 7 identifies-artifact. All 4 supports came from the original team or earliest replicators. By end August 2023, supporter base in condensed-matter physics was effectively zero.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">4-factor resolution speed</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                Synthesis cost (low), artifact specificity (Cu₂S, textbook), institutional engagement (MPI, LBNL, Beijing active), venue openness (arXiv). All four low-friction → 6-week close. Same framework applied to LENR: all four high-friction → 37 years open.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="/lk99-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-white rounded-lg text-sm font-semibold hover:bg-black transition-colors"
            >
              Download the LK-99 report (PDF)
            </a>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
              48 papers · citation-grounded · 10 pages · reusable pipeline
            </span>
          </div>
        </div>
      </section>

      {/* Case study — Biotech (DeepSight) */}
      <section className="px-6 md:px-10 py-16 md:py-28 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">Case study 03 / Indian biotech · live pipeline</p>
          <h2 className="text-[clamp(1.875rem,6vw,5rem)] mb-6 leading-[1]">
            Biotech — the commercial <span className="text-serif-accent text-[var(--color-primary-blue)]">case</span>.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[17px] max-w-3xl leading-relaxed mb-12">
            A pitch-ready oncology gap analysis built on the same pipeline adapted for biotech. PubMed + ClinicalTrials.gov + Indian pharma entity universe + biotech VC index. 4-layer citation grounding — every factual claim traceable to an indexed source. This is the template for the pharma CI wedge: India-specific, cite-defensible, 10-day turnaround.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-10 mb-12">
            {[
              { stat: "80", label: "PubMed papers" },
              { stat: "66", label: "Indian Ph-3 trials" },
              { stat: "22", label: "Biotech VCs indexed" },
              { stat: "20", label: "Pharma companies" },
              { stat: "11", label: "In-text citations · 0 broken" },
              { stat: "33 s", label: "NVIDIA Qwen gen time" },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-1">{c.stat}</p>
                <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">4-layer citation grounding</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                Grounding prompt + indexed source corpus with <span className="mono text-[12px]">[S#]</span> references + citation validator + honest <span className="mono text-[12px]">insufficient_data</span> flags where the corpus is thin. Caught an LLM hallucination (&quot;10,000+ China oncology patents&quot; when the DB had zero) and re-engineered. Reports ship with 0 broken citations.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">The CDSCO wedge</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                Cortellis and Citeline have global coverage but lag Indian regulatory granularity by 2-4 weeks. CDSCO filings, DCGI approval letters, state-FDA inspection reports. That gap is the moat — foreign tools don&apos;t do it, generic Indian tools don&apos;t have the AI pipeline. We build into that gap.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Production economics</p>
              <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
                NVIDIA Qwen3-Coder-480B as production fallback when the Anthropic key rate-limits. ₹0 marginal compute cost per report. 33-second generation time on the 10-page gap analysis. No OpenAI dependency. Pipeline tests: 25 passing. Dashboard: zero-dep static HTML over a Postgres-backed FastAPI.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <BookButton variant="primary">Request a biotech sample ↗</BookButton>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
              sample available on request · pitch-ready PDF · 10 days to a custom commission
            </span>
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
                Pharma, biotech, and the <span className="text-serif-accent">capital</span> behind them.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              CI teams at top-10 Indian pharma, biotech VCs, corporate R&amp;D, family offices, and contested-science evaluators. Anyone whose next decision depends on Indian regulatory granularity or specialist scientific depth.
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
              <p className="font-semibold text-[var(--color-ink)] mb-2">Bulk extraction at $0</p>
              <p>Gemma 4 running locally processes thousands of papers in batches — 487 mainstream Pd-H papers in 6 hours, 9,795 LENR papers in 42 hours. Total cost: zero. We read 2,000 papers in a week for the cost of one junior analyst month.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Cross-domain verification</p>
              <p>Every finding is cross-referenced against mainstream physics, meta-science failure modes, and 17 historical cases of contested science. We caught a 3-4x enthalpy error that would have shipped in any single-source analysis.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Four-panel adversarial review</p>
              <p>Every major finding goes through a steelman agent, an attack agent, a blind-spot agent, and a proponent-calibrated agent. No claim ships at a confidence level it cannot support. The LENR probability estimate (10-30%) came from four independent methods converging.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)] mb-2">Structured outputs, not just a PDF</p>
              <p>Every engagement produces a graded dataset alongside the written report — experiments, patents, COP measurements, researcher network. Structured so a second run in the same domain compounds rather than starts fresh. Delivered as PDF + CSV + JSON; a queryable dashboard is available on request for repeat engagements.</p>
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
            One pilot. One therapeutic{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">area</span>. Ten days.
          </h2>
          <p className="text-white/60 text-[17px] max-w-2xl leading-relaxed mb-10">
            Pick a therapeutic area, a contested claim, or an India-specific regulatory question your internal team doesn&apos;t have the specialist depth to close. Ten days, fixed scope, citation-grounded deliverable, NVIDIA-tier compute cost. If the output doesn&apos;t pay back an hour of your Associate Director&apos;s time, we refund. Sample our work below.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <BookButton variant="light-primary">Scope a pilot DD ↗</BookButton>
            <a
              href="/lk99-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg text-sm font-medium hover:border-white/40 transition-colors"
            >
              LK-99 report (10 pp, PDF)
            </a>
            <a
              href="/lenr-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg text-sm font-medium hover:border-white/40 transition-colors"
            >
              LENR report (17 pp, PDF)
            </a>
          </div>
          <div className="pt-8 border-t border-white/10 grid md:grid-cols-2 gap-8">
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Free · monthly · lead-gen</p>
              <p className="text-white/70 text-[14px] leading-relaxed mb-4">
                <span className="font-semibold text-white/90">CDSCO + Indian biotech digest.</span> Five bullets, first Monday of each month. India-specific filings, Ph-3 moves, competitive intel your Cortellis seat missed. No pitch, no pricing page, just the intel.
              </p>
              <BookButton variant="light-secondary">Join the digest waitlist</BookButton>
            </div>
            <div>
              <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-2">Paid · monthly · live this week</p>
              <p className="text-white/70 text-[14px] leading-relaxed mb-4">
                <span className="font-semibold text-white/90">Patent cliff calendar feed.</span> 48K FDA Orange Book products, 16,724 active patents joined to your CDSCO drug-name register. 24-month forward window. Built for Indian generic formulators timing ANDA filings for Day-1 entry.
              </p>
              <BookButton variant="light-secondary">Request a sample feed</BookButton>
            </div>
          </div>
          <p className="mt-10 mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Three cases shipped · LENR · LK-99 · Biotech · plus the live Patent Cliff Calendar feed · domain pickable on commissioned DDs
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
