import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "About — How we think, what we build",
  description:
    "PolyCloud is an automation firm based in Hyderabad, founded 2020. We build AI and automation infrastructure for SMBs and finance-sector operators — so teams scale output, not headcount.",
  alternates: { canonical: "/about" },
  keywords: [
    "automation agency Hyderabad",
    "AI consulting firm India",
    "workflow automation company",
    "GST automation firm",
    "PolyCloud company",
  ],
};

const principles = [
  {
    num: "01",
    name: "Systems over deliverables",
    body: "A report tells you what's broken. A system fixes it — continuously. Every engagement ends with something running, not something documented.",
  },
  {
    num: "02",
    name: "We decline most engagements",
    body: "Fit matters more than revenue. We've said no to roughly 60% of intros — not because we're precious, but because we couldn't believe the underlying thesis, or the client wanted AI-as-decoration, not AI-as-infrastructure. Short list of clients, longer time per client.",
  },
  {
    num: "03",
    name: "Data over opinions",
    body: "Paid-acquisition dashboards, server logs, conversion funnels, actual production telemetry. We plan from what the instruments show, not from what sounds right in a meeting.",
  },
  {
    num: "04",
    name: "Quiet compounding",
    body: "The best systems we've built aren't visible. They run in the background while teams sleep — and the operator notices only because the dashboard kept moving up.",
  },
  {
    num: "05",
    name: "No magic-talk",
    body: "If a technique sounds magical, we can't defend it under a CFO's scrutiny. We work in mechanisms — input, transform, output — and name them in plain language.",
  },
];

const stack = [
  {
    category: "Research, on tap",
    body: "Weekly intel and deep due-diligence reports that would take a human analyst months. You get defensible, cited, PhD-grade synthesis across your sector — delivered in days.",
    tag: "Labs",
  },
  {
    category: "AI employees that fit your team",
    body: "Agents trained on your vocabulary, your data, and your approval gates — not a generic copilot. They fill a real seat on your ops team, and they come with the audit trail a CFO can defend.",
    tag: "Consulting",
  },
  {
    category: "India data, ready to ship",
    body: "Live access to Tally, GSTN, MCA, eCourts, EPFO, Vahan, DGCA, and WhatsApp Business — the data sources most SaaS vendors leave on the table. You move first on things competitors can't even see.",
    tag: "Digital + Consulting",
  },
  {
    category: "Forty-hour workflows, done overnight",
    body: "GSTR-2B reconciliation, ITC-at-risk flagging, vendor follow-ups — the monthly grind collapses from a week of CA hours into an evening of review. Output is the audit-trail-ready artefact your filing team expected.",
    tag: "Digital",
  },
  {
    category: "Alt-data signals, before the market sees them",
    body: "Private pipelines from aviation, mobility, retail, and regulatory disclosures — turned into signals that appear in portfolio briefings before they show up in price charts. Backtested, deployed, and monitored.",
    tag: "Labs + ops",
  },
  {
    category: "Decisions with a paper trail",
    body: "Every recommendation you get is defended by an adversarial review — the logic is written down, the sources are cited, and anyone on your team can trace the reasoning. Scrutiny-proof by design.",
    tag: "All engagements",
  },
];

const substrate = "We own the logic, we rent the substrate — so the artefacts you take home are yours, and the compute bill doesn't move the needle on your ROI.";

const facts = [
  { label: "Founded", value: "2020" },
  { label: "Headquarters", value: "Hyderabad, India" },
  { label: "Clients served", value: "Selective — small by design" },
  { label: "Engagement length", value: "From 2-week audits to multi-year retainers" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav active="about" />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26, 95, 212, 0.05) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">About</p>
          </div>
          <h1 className="text-display text-[clamp(2.25rem,9vw,8rem)] mb-8 md:mb-10 max-w-[1200px] leading-[0.95]">
            Most companies don't need another tool — they need the{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">work done</span>.
          </h1>
          <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            PolyCloud is a firm built on a simple idea. We sit down with business owners to find where time, money, or attention is leaking — including the gaps they haven't spotted themselves — then design, build, and operate the fix end-to-end.
          </p>
          <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed mt-6">
            That could mean a machine learning model forecasting which customers will churn, a deep-research agent tracking competitor moves every morning, a data pipeline turning raw operations numbers into weekly decisions, a workflow automation removing hours of manual work, a dashboard replacing ten spreadsheets, or taking over the digital marketing entirely.
          </p>
          <p className="text-[18px] md:text-2xl text-[var(--color-ink)] max-w-3xl leading-relaxed mt-8 font-[var(--font-display)]">
            You get the outcome. We handle everything behind it.
          </p>
        </div>
      </section>

      {/* Facts strip */}
      <section className="px-6 md:px-10 py-14 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-4 gap-8 md:gap-10">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-2">
                {f.label}
              </p>
              <p className="text-[15px] md:text-[16px] font-medium leading-tight">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Principles</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl">
                How we <span className="text-serif-accent">think</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Five operating principles that govern what we build, what we decline, and how we decide. We'd rather be specific and wrong than vague and safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {principles.map((p) => (
              <div
                key={p.num}
                className="bg-[var(--color-surface)] p-10 md:p-14 hover:bg-white transition-colors"
              >
                <span className="mono text-xs text-[var(--color-primary-orange)]">{p.num}</span>
                <h3 className="text-[clamp(1.5rem,2.5vw,2.25rem)] mt-4 mb-6 leading-tight">
                  {p.name}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed max-w-md">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            <span className="text-[var(--color-ink)] font-medium">Dogfooded internally.</span> The same framework we deploy for clients — AgentOS — runs PolyCloud's own operations. We do not ship anything we wouldn't trust with our own work.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / What we&apos;ve built</p>
              <h2 className="text-[clamp(1.875rem,6vw,5rem)] max-w-2xl">
                The <span className="text-serif-accent">proprietary</span> layer.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Most firms describe their stack as a list of public tools anyone can rent. Our moat is the layer above it — data pipelines, agent runtimes, and decision systems we own. Each engagement makes the next one faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {stack.map((s) => (
              <div
                key={s.category}
                className="relative bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                  style={{
                    background:
                      "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(26, 95, 212, 0.04) 0%, transparent 60%)",
                  }}
                />
                <div className="flex items-center justify-between mb-5 relative">
                  <p className="text-eyebrow text-[var(--color-primary-orange)]">{s.category}</p>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] px-2 py-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-warm)]">
                    {s.tag}
                  </span>
                </div>
                <p className="text-[var(--color-text)] text-[14.5px] leading-relaxed relative">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[13px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)] text-center md:text-left">
            {substrate}
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
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(26, 95, 212, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Work with us</p>
          <h2 className="text-display text-[clamp(2rem,7vw,5.5rem)] mb-10 leading-[0.95]">
            Most engagements start with a{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">conversation</span>.
          </h2>
          <p className="text-white/60 text-[17px] max-w-2xl leading-relaxed mb-10">
            Fifteen minutes to tell us what you're building. Fifteen more to tell you — honestly — whether we're the right team for it, or whether you should talk to someone else entirely.
          </p>
          <BookButton variant="light-primary">Book a call ↗</BookButton>
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
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline text-[var(--color-ink)] font-medium">About</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return <SiteFooter />;
}
