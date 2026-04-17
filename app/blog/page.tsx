import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Insights — Automation playbooks | PolyCloud",
  description:
    "Long-form essays on automation infrastructure, messaging systems, and the economics of scaling output without scaling headcount.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-20 md:pb-28 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 30% 0%, rgba(26, 95, 212, 0.05) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Insights</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1100px] leading-[0.95]">
            The playbook, <span className="text-serif-accent text-[var(--color-primary-blue)]">public</span>.
          </h1>
          <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Long-form essays on automation infrastructure, messaging systems, and the economics of scaling output without scaling headcount.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-xl overflow-hidden">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative bg-[var(--color-surface)] p-10 md:p-14 min-h-[340px] flex flex-col justify-between hover:bg-white transition-colors"
              >
                <div>
                  <div className="flex items-baseline gap-5 mb-6">
                    <span className="mono text-xs text-[var(--color-primary-orange)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-eyebrow text-[var(--color-text-secondary)]">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] mb-6 leading-[1.1] group-hover:text-[var(--color-primary-blue)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-6 max-w-lg">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono text-xs text-[var(--color-text-muted)]">{post.readTime}</span>
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

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-32 text-white relative overflow-hidden mt-16"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Apply it</p>
          <h2 className="text-display text-[clamp(2.25rem,6vw,4.5rem)] mb-10 leading-[0.95]">
            Reading isn't shipping. <span className="text-serif-accent text-[var(--color-primary-orange)]">Let's talk</span>.
          </h2>
          <a
            href="mailto:hello@polycloud.in"
            className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white"
          >
            Book a call ↗
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
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/blog" className="link-underline text-[var(--color-ink)] font-medium">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <a href="mailto:hello@polycloud.in" className="btn-primary !py-2 !px-4 !text-[13px]">
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
