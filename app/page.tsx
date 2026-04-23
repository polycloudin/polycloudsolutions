import Link from "next/link";
import VerticalTabs from "./components/VerticalTabs";
import BookButton from "./components/BookButton";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import { posts } from "./blog/posts";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-28 md:pt-44 pb-20 md:pb-40 px-6 md:px-10 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(26, 95, 212, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(244, 107, 44, 0.04) 0%, transparent 55%)",
          }}
        />

        <div className="max-w-[1440px] mx-auto relative">
          <div className="anim-fade-up delay-1 flex items-center gap-3 mb-8 md:mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              AI-native automation firm · Since 2020
            </p>
          </div>

          <h1 className="text-display text-[clamp(2.75rem,13vw,12rem)] mb-8 md:mb-12 max-w-[1300px]">
            <span className="block anim-fade-up delay-2">Your business,</span>
            <span className="block anim-fade-up delay-3 text-serif-accent text-[var(--color-primary-blue)]">
              on autopilot.
            </span>
          </h1>

          <div className="anim-fade-up delay-5 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-24 items-end">
            <p className="text-[16px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              88% of companies use AI. Only 6% see bottom-line impact. The difference is implementation — the invisible work of redesigning how tasks move, who makes decisions, and where the AI actually fits. That's what we build.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="primary">
                Book a call
                <span className="text-base opacity-70">↗</span>
              </BookButton>
              <Link href="#paths" className="btn-secondary">
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical tabs */}
      <section className="px-6 md:px-10 py-14 md:py-28 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">
            Trusted by operators across
          </p>
          <VerticalTabs />
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 md:px-10 py-16 md:py-32">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6 md:mb-8">A note on how we work</p>
          <p className="text-display text-[clamp(1.5rem,3.5vw,3rem)] leading-[1.2] md:leading-[1.15] tracking-tight">
            We don't build marketing funnels. We build <span className="text-serif-accent text-[var(--color-primary-blue)]">infrastructure</span> that operators can hire instead of headcount — systems that compound quietly, while teams focus on what only humans can do.
          </p>
        </div>
      </section>

      {/* Two paths — asymmetric bento */}
      <section id="paths" className="px-6 md:px-10 py-16 md:py-36 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4 md:mb-5">01 / The firm</p>
              <h2 className="text-[clamp(2rem,6.5vw,5.5rem)] max-w-3xl leading-[1.05] md:leading-[1.02]">
                Three practices. One <span className="text-serif-accent">operating system</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[14px] md:text-[15px] leading-relaxed">
              Different customers, one shared engine. Digital sharpens SMB commercial intelligence. Consulting exposes workflow patterns across mid-market operators. Labs distills deep-tech signals for capital allocators and operators. Every engagement trains the next.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {/* Digital */}
            <Link
              href="/digital"
              style={{ backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" }}
              className="card-hover relative overflow-hidden rounded-xl p-8 md:p-10 text-white group flex flex-col justify-between border md:min-h-[440px]"
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(244, 107, 44, 0.25) 0%, transparent 60%)",
                }}
              />
              <div className="flex items-start justify-between relative">
                <p className="text-eyebrow text-white/60">
                  Digital — For SMBs
                </p>
                <div className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  ↗
                </div>
              </div>
              <div className="relative">
                <h3 className="text-[clamp(1.5rem,2.5vw,2.1rem)] mb-5 leading-[1.1]">
                  Websites, ads, automation — for any SMB.
                </h3>
                <p className="text-white/60 text-[14px] mb-8 leading-relaxed">
                  Pre-configured bundles for local businesses, D2C brands, coaching centres, professional services. From ₹70K + ₹12K/month.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/50">
                  <span>Websites</span>
                  <span>Ads</span>
                  <span>SEO</span>
                  <span>WhatsApp</span>
                  <span>CRM</span>
                </div>
              </div>
            </Link>

            {/* Consulting */}
            <Link
              href="/consulting"
              style={{ backgroundColor: "#1A5FD4", borderColor: "#1A5FD4" }}
              className="card-hover relative overflow-hidden rounded-xl p-8 md:p-10 text-white group flex flex-col justify-between border md:min-h-[440px]"
            >
              <div className="flex items-start justify-between">
                <p className="text-eyebrow text-white/70">
                  Consulting — For Operators
                </p>
                <div className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  ↗
                </div>
              </div>
              <div>
                <h3 className="text-[clamp(1.5rem,2.5vw,2.1rem)] mb-5 leading-[1.1]">
                  AI integration across verticals.
                </h3>
                <p className="text-white/75 text-[14px] mb-8 leading-relaxed">
                  Rebuild workflows around AI. Finance, SaaS, D2C, healthcare, manufacturing, professional services. From ₹1L audit · ₹50K–5L builds.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/70">
                  <span>Audits</span>
                  <span>Builds</span>
                  <span>Platforms</span>
                  <span>Retainers</span>
                </div>
              </div>
            </Link>

            {/* Research */}
            <Link
              href="/labs"
              style={{ backgroundColor: "#F46B2C", borderColor: "#F46B2C" }}
              className="card-hover relative overflow-hidden rounded-xl p-8 md:p-10 text-white group flex flex-col justify-between border md:min-h-[440px]"
            >
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(10, 10, 10, 0.35) 0%, transparent 60%)",
                }}
              />
              <div className="flex items-start justify-between relative">
                <p className="text-eyebrow text-white/80">
                  Labs — Deep-tech intelligence
                </p>
                <div className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  ↗
                </div>
              </div>
              <div className="relative">
                <h3 className="text-[clamp(1.5rem,2.5vw,2.1rem)] mb-5 leading-[1.1]">
                  Deep-tech intelligence, on tap.
                </h3>
                <p className="text-white/80 text-[14px] mb-8 leading-relaxed">
                  Eight research agents, six-phase pipeline, knowledge-graph memory — pointed at any sector. Technical DD, cohort screens, IP landscapes, and sector thesis work for VCs, incubators, and deep-tech operators. Delivered in weeks.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/70">
                  <span>DD reports</span>
                  <span>Cohort screens</span>
                  <span>IP landscape</span>
                  <span>Sector thesis</span>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* Stats — integration gap */}
      <section className="px-6 md:px-10 py-16 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10 md:mb-20">02 / The integration gap</p>
          <div className="grid md:grid-cols-3 gap-10 md:gap-10">
            {[
              {
                n: "88%",
                label: "Companies using AI today",
                detail: "Adoption is near-universal across mid-market operators and SMBs alike.",
              },
              {
                n: "6%",
                label: "See bottom-line impact",
                detail: "The vast majority bolt AI onto existing processes and see no measurable return.",
              },
              {
                n: "21%",
                label: "Redesign workflows around it",
                detail: "Where the real returns live — and where most firms never go.",
              },
            ].map((s, i) => (
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-6 md:pt-8">
                <div className="text-display text-[clamp(3.5rem,10vw,8rem)] leading-none mb-4 md:mb-6 text-[var(--color-ink)]">
                  {s.n}
                </div>
                <p className="font-medium text-base md:text-lg mb-2 md:mb-3 tracking-tight">{s.label}</p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 md:mt-14 mono text-xs text-[var(--color-text-muted)] tracking-[0.15em]">
            SOURCES — McKinsey State of AI 2025, Libertify, RAND AI Failure Analysis.
          </p>
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 md:px-10 py-16 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-4 md:mb-5">03 / Insights</p>
              <h2 className="text-[clamp(2rem,6.5vw,5.5rem)] max-w-2xl leading-[1.05]">
                The playbook, <span className="text-serif-accent">public</span>.
              </h2>
            </div>
            <Link href="/blog" className="btn-secondary">
              All insights →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {posts.slice(-3).reverse().map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative bg-[var(--color-surface)] p-8 md:p-12 md:min-h-[340px] flex flex-col justify-between gap-8 hover:bg-white transition-colors"
              >
                <p className="mono text-xs text-[var(--color-text-muted)]">
                  0{i + 1} / {p.readTime}
                </p>
                <div>
                  <h3 className="text-[clamp(1.5rem,2.2vw,2.1rem)] mb-6 leading-[1.15] group-hover:text-[var(--color-primary-blue)] transition-colors">
                    {p.title}
                  </h3>
                  <span className="text-sm font-medium flex items-center gap-2">
                    Read
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-16 md:py-40 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 0%, rgba(26, 95, 212, 0.15) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-6 md:mb-10">04 / Engage</p>
          <h2 className="text-display text-[clamp(2.25rem,10vw,9.5rem)] mb-8 md:mb-12 max-w-[1200px] leading-[1] md:leading-[0.95]">
            Ship the first system in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">fourteen days</span>.
          </h2>
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 items-end">
            <p className="text-white/60 text-[16px] md:text-lg max-w-xl leading-relaxed">
              A 15-minute call tells us — and you — whether automation is worth building, what to ship first, and where the real leverage lives. No decks. No discovery-call theater.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton variant="light-primary">
                Book a call ↗
              </BookButton>
              <a
                href="mailto:hello@polycloud.in"
                className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
              >
                hello@polycloud.in
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
