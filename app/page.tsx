import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-md bg-[var(--color-surface)]/70 border-b border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--color-ink)] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-[Plus_Jakarta_Sans]">P</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight font-[Plus_Jakarta_Sans]">PolyCloud</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/digital" className="link-underline">Digital</Link>
            <Link href="/consulting" className="link-underline">Consulting</Link>
            <Link href="/blog" className="link-underline">Blog</Link>
            <a href="https://wa.me/919876543210" className="btn-primary !py-2.5 !px-5 !text-sm">
              Get audit
              <span className="text-lg">→</span>
            </a>
          </div>
          <a href="https://wa.me/919876543210" className="md:hidden btn-primary !py-2 !px-4 !text-xs">
            WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-36 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="anim-fade-up delay-1 flex items-center gap-3 mb-10">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">
              Hyderabad → Pan-India · Est. 2020
            </p>
          </div>

          <h1 className="text-display text-[clamp(3rem,11vw,10.5rem)] mb-8 max-w-[1200px]">
            <span className="block anim-fade-up delay-2">Your business,</span>
            <span className="block anim-fade-up delay-3 text-[var(--color-primary-blue)]">on autopilot.</span>
          </h1>

          <p className="text-hindi anim-fade-up delay-4 text-xl md:text-2xl mb-14 max-w-xl">
            Aapka business, autopilot par.
          </p>

          <div className="anim-fade-up delay-5 grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-end">
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              We build digital systems that run while you sleep — websites that convert, ads that pay back, AI employees that answer customers at 3 AM. No marketing magic-talk. Just measurable outcomes.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/919876543210" className="btn-primary">
                Start on WhatsApp
                <span className="text-lg">→</span>
              </a>
              <Link href="#paths" className="btn-secondary">
                See what we do
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-[var(--color-line)] py-6 overflow-hidden bg-[var(--color-surface-warm)]">
        <div className="flex marquee gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center shrink-0">
              {[
                "CA firms",
                "Textile traders",
                "D2C brands",
                "Clinics",
                "Law firms",
                "Coaching centers",
                "Restaurants",
                "Manufacturers",
              ].map((cat, idx) => (
                <span key={idx} className="text-eyebrow text-[var(--color-ink)] flex items-center gap-4">
                  {cat}
                  <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Two paths — asymmetric bento */}
      <section id="paths" className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">01 — Two paths</p>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] max-w-2xl">
                Pick your weight class.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md">
              We serve small businesses with the Digital stack, and mid-market companies with custom AI consulting. Two different problems. Two different teams.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 md:gap-5">
            {/* Small business — wide */}
            <Link
              href="/digital"
              style={{ backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" }}
              className="card-hover md:col-span-3 relative overflow-hidden rounded-2xl p-8 md:p-12 text-white group aspect-[4/3] md:aspect-auto flex flex-col justify-between border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6">
                    For Small Business
                  </p>
                  <h3 className="text-[clamp(2rem,4vw,3.5rem)] mb-5 max-w-lg">
                    Digital that prints money while you sleep.
                  </h3>
                </div>
                <div className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm text-white/70">
                  <span>Websites</span>
                  <span>WhatsApp bots</span>
                  <span>Paid ads</span>
                  <span>SEO</span>
                  <span>GST automation</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="mono text-xs text-white/50">FROM</span>
                  <span className="text-display text-4xl md:text-5xl">₹5K</span>
                  <span className="text-white/60 text-sm">/month</span>
                </div>
              </div>
            </Link>

            {/* Larger company */}
            <Link
              href="/consulting"
              style={{ backgroundColor: "#1A5FD4", borderColor: "#1A5FD4" }}
              className="card-hover md:col-span-2 relative overflow-hidden rounded-2xl p-8 md:p-12 text-white group flex flex-col justify-between border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-eyebrow text-white/70 mb-6">
                    For Larger Company
                  </p>
                  <h3 className="text-[clamp(2rem,3vw,2.75rem)] mb-5">
                    Consulting for mid-market operators.
                  </h3>
                </div>
                <div className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8 text-sm text-white/80">
                  <span>Audits</span>
                  <span>Sprints</span>
                  <span>Platform builds</span>
                  <span>Retainers</span>
                </div>
                <span className="mono text-xs text-white/70">CUSTOM PRICING →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — editorial */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-primary-orange)] mb-16">02 — Proof</p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-6">
            {[
              { n: "50+", label: "Indian businesses automated", detail: "From 10-person clinics to 200-person law firms." },
              { n: "₹5Cr+", label: "Client revenue added", detail: "Measured on paid-ad dashboards, not testimonials." },
              { n: "70%", label: "Ops time eliminated", detail: "Manual work replaced by systems that never sleep." },
            ].map((s, i) => (
              <div key={i} className="border-t border-[var(--color-ink)] pt-6">
                <div className="text-display text-[clamp(4rem,9vw,7rem)] leading-none mb-4 text-[var(--color-ink)]">
                  {s.n}
                </div>
                <p className="font-semibold text-lg mb-2">{s.label}</p>
                <p className="text-[var(--color-text-secondary)] text-sm">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-20 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">03 — Resources</p>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] max-w-2xl">
                Guides that actually help.
              </h2>
            </div>
            <Link href="/blog" className="btn-secondary">
              All articles →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden">
            {[
              { slug: "small-business-ai-automation", title: "AI automation for Indian small business", meta: "6 min · 1,200 searches/mo" },
              { slug: "whatsapp-chatbots", title: "WhatsApp AI chatbots for 24/7 customer service", meta: "6 min · 2,100 searches/mo" },
              { slug: "gst-filing-automation", title: "Automate GST filing — save 15 hrs/month", meta: "8 min · 1,500 searches/mo" },
            ].map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative bg-[var(--color-surface)] p-8 md:p-10 min-h-[320px] flex flex-col justify-between hover:bg-white transition-colors"
              >
                <p className="mono text-xs text-[var(--color-text-muted)]">
                  0{i + 1} / {p.meta}
                </p>
                <div>
                  <h3 className="text-[clamp(1.5rem,2vw,2rem)] mb-5 leading-tight group-hover:text-[var(--color-primary-blue)] transition-colors">
                    {p.title}
                  </h3>
                  <span className="text-sm font-semibold flex items-center gap-2">
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
      <section style={{ backgroundColor: "#0A0A0A" }} className="px-6 md:px-10 py-24 md:py-36 text-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative">
          <p className="text-eyebrow text-[var(--color-primary-orange)] mb-8">04 — Start</p>
          <h2 className="text-display text-[clamp(2.75rem,9vw,8.5rem)] mb-10 max-w-[1100px]">
            Ship the first automation in <span className="text-[var(--color-primary-orange)]">14 days.</span>
          </h2>
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-end">
            <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed">
              Book a 15-minute call. We'll tell you — honestly — whether AI or automation can help your business, or whether you should do something else entirely.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919876543210"
                className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)] hover:!text-white"
              >
                WhatsApp us
                <span className="text-lg">→</span>
              </a>
              <a
                href="mailto:hello@polycloudsolutions.com"
                className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
              >
                hello@polycloudsolutions.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-12 bg-[var(--color-ink)] border-t border-white/10 text-white/70">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
              <span className="text-[var(--color-ink)] text-[10px] font-bold font-[Plus_Jakarta_Sans]">P</span>
            </div>
            <span className="font-semibold text-white">PolyCloud Solutions</span>
            <span className="text-white/40">·</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-8">
            <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
            <Link href="/consulting" className="hover:text-white transition-colors">Consulting</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <a href="https://wa.me/919876543210" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
