import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-display text-xl tracking-tight">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm text-[var(--color-text)]">
            <Link href="/digital" className="link-underline">Digital</Link>
            <Link href="/consulting" className="link-underline">Consulting</Link>
            <Link href="/blog" className="link-underline">Insights</Link>
            <Link href="/about" className="link-underline">About</Link>
            <a href="https://cal.com/polycloud/intro" className="btn-primary !py-2 !px-4 !text-[13px]">
              Book a call
            </a>
          </div>
          <a href="https://cal.com/polycloud/intro" className="md:hidden btn-primary !py-2 !px-3 !text-xs">
            Book
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-28 md:pb-40 px-6 md:px-10 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(26, 95, 212, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(244, 107, 44, 0.04) 0%, transparent 55%)",
          }}
        />

        <div className="max-w-[1440px] mx-auto relative">
          <div className="anim-fade-up delay-1 flex items-center gap-3 mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Automation Infrastructure — Since 2020
            </p>
          </div>

          <h1 className="text-display text-[clamp(3.25rem,13vw,12rem)] mb-12 max-w-[1300px]">
            <span className="block anim-fade-up delay-2">Your business,</span>
            <span className="block anim-fade-up delay-3 text-serif-accent text-[var(--color-primary-blue)]">
              on autopilot.
            </span>
          </h1>

          <div className="anim-fade-up delay-5 grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-24 items-end">
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              88% of companies use AI. Only 6% see bottom-line impact. The difference is implementation — the invisible work of redesigning how tasks move, who makes decisions, and where the AI actually fits. That's what we build.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://cal.com/polycloud/intro" className="btn-primary">
                Book a call
                <span className="text-base opacity-70">↗</span>
              </a>
              <Link href="#paths" className="btn-secondary">
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proof line — replaces marquee */}
      <section className="px-6 md:px-10 py-10 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-eyebrow text-[var(--color-text-secondary)]">
            Trusted by operators across
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-[var(--color-ink)]/80">
            <span>SaaS</span>
            <span>D2C brands</span>
            <span>Fintech</span>
            <span>Professional services</span>
            <span>Healthcare</span>
            <span>Manufacturing</span>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">A note on how we work</p>
          <p className="text-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.15] tracking-tight">
            We don't build marketing funnels. We build <span className="text-serif-accent text-[var(--color-primary-blue)]">infrastructure</span> that operators can hire instead of headcount — systems that compound quietly, while teams focus on what only humans can do.
          </p>
        </div>
      </section>

      {/* Two paths — asymmetric bento */}
      <section id="paths" className="px-6 md:px-10 py-24 md:py-36 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Two practices</p>
              <h2 className="text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-2xl">
                Pick the one that <span className="text-serif-accent">fits</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Two real businesses, honestly split. Digital is productized services for any SMB. Consulting is AI integration concentrated on finance operators. Different buyers. Shared standard.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-5">
            {/* Digital */}
            <Link
              href="/digital"
              style={{ backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" }}
              className="card-hover md:col-span-3 relative overflow-hidden rounded-xl p-10 md:p-14 text-white group aspect-[4/3] md:aspect-auto flex flex-col justify-between border min-h-[440px]"
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
                <h3 className="text-[clamp(2.25rem,4.5vw,4rem)] mb-6 max-w-xl leading-[1.02]">
                  Websites, ads, automation — for any SMB.
                </h3>
                <p className="text-white/60 text-[15px] mb-10 max-w-md leading-relaxed">
                  Pre-configured bundles for local businesses, D2C brands, coaching centres, professional services. Starting at ₹70K one-time + ₹12K/month.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                  <span>Websites</span>
                  <span>Google + Meta ads</span>
                  <span>SEO</span>
                  <span>WhatsApp Business</span>
                  <span>CRM</span>
                </div>
              </div>
            </Link>

            {/* Consulting */}
            <Link
              href="/consulting"
              style={{ backgroundColor: "#1A5FD4", borderColor: "#1A5FD4" }}
              className="card-hover md:col-span-2 relative overflow-hidden rounded-xl p-10 md:p-14 text-white group flex flex-col justify-between border min-h-[440px]"
            >
              <div className="flex items-start justify-between">
                <p className="text-eyebrow text-white/70">
                  Consulting — For Finance Operators
                </p>
                <div className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  ↗
                </div>
              </div>
              <div>
                <h3 className="text-[clamp(1.75rem,3vw,2.75rem)] mb-6 leading-[1.05]">
                  AI integration for CA firms, NBFCs, fintechs.
                </h3>
                <p className="text-white/75 text-[15px] mb-10 max-w-md leading-relaxed">
                  We rebuild workflows around AI — starting with a 2-week audit. Flagship: GSTR-2B reconciliation. From ₹1L audit · ₹50K–5L builds.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                  <span>Audits</span>
                  <span>Builds</span>
                  <span>Platforms</span>
                  <span>Retainers</span>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* Stats — integration gap */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-20">02 / The integration gap</p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-10">
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
              <div key={i} className="border-t border-[var(--color-ink)]/80 pt-8">
                <div className="text-display text-[clamp(4.5rem,10vw,8rem)] leading-none mb-6 text-[var(--color-ink)]">
                  {s.n}
                </div>
                <p className="font-medium text-lg mb-3 tracking-tight">{s.label}</p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-14 mono text-xs text-[var(--color-text-muted)] tracking-[0.15em]">
            SOURCES — McKinsey State of AI 2025, Libertify, RAND AI Failure Analysis.
          </p>
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">03 / Insights</p>
              <h2 className="text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-2xl">
                The playbook, <span className="text-serif-accent">public</span>.
              </h2>
            </div>
            <Link href="/blog" className="btn-secondary">
              All insights →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {[
              { slug: "small-business-ai-automation", title: "The automation stack for growth-stage operators", meta: "6 min read" },
              { slug: "whatsapp-chatbots", title: "Messaging automation as a conversion engine", meta: "6 min read" },
              { slug: "ai-vs-hiring", title: "When to build automation vs. hire humans", meta: "7 min read" },
            ].map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative bg-[var(--color-surface)] p-10 md:p-12 min-h-[340px] flex flex-col justify-between hover:bg-white transition-colors"
              >
                <p className="mono text-xs text-[var(--color-text-muted)]">
                  0{i + 1} / {p.meta}
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
        className="px-6 md:px-10 py-24 md:py-40 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 0%, rgba(26, 95, 212, 0.15) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-10">04 / Engage</p>
          <h2 className="text-display text-[clamp(2.75rem,10vw,9.5rem)] mb-12 max-w-[1200px] leading-[0.95]">
            Ship the first system in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">fourteen days</span>.
          </h2>
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-end">
            <p className="text-white/60 text-[17px] md:text-lg max-w-xl leading-relaxed">
              A 15-minute call tells us — and you — whether automation is worth building, what to ship first, and where the real leverage lives. No decks. No discovery-call theater.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://cal.com/polycloud/intro"
                className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
              >
                Book a call ↗
              </a>
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

      {/* Footer */}
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
            <a href="mailto:hello@polycloud.in" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
