import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";
import ProjectCard from "../components/ProjectCard";
import { projects, verticals } from "./projects";

export const metadata: Metadata = {
  title: "Work — Shipped projects across verticals",
  description:
    "A selection of shipped work — D2C storefronts, SaaS dashboards, law firms, healthcare booking, real estate platforms, local-business portfolios.",
  alternates: { canonical: "/work" },
};

export default function Work() {
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
            <p className="text-eyebrow text-[var(--color-text-secondary)]">Work</p>
          </div>
          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1100px] leading-[0.95]">
            Shipped across{" "}
            <span className="text-serif-accent text-[var(--color-primary-blue)]">ten verticals</span>.
          </h1>
          <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
            A selection of engagements. D2C jewelry storefronts, SaaS dashboards, law firm directories, healthcare booking, real estate maps, local-business portfolios, industrial-group holdings. Each one designed and built end-to-end.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 py-12 border-y border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div>
            <p className="text-display text-[clamp(2rem,4vw,3rem)] leading-none mb-1">{projects.length}+</p>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Shipped projects</p>
          </div>
          <div>
            <p className="text-display text-[clamp(2rem,4vw,3rem)] leading-none mb-1">{verticals.length}</p>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Verticals</p>
          </div>
          <div>
            <p className="text-display text-[clamp(2rem,4vw,3rem)] leading-none mb-1">2–6</p>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Weeks to launch</p>
          </div>
          <div>
            <p className="text-display text-[clamp(2rem,4vw,3rem)] leading-none mb-1">100%</p>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Client-owned</p>
          </div>
        </div>
      </section>

      {/* All projects */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">All projects</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#0A0A0A" }}
        className="px-6 md:px-10 py-24 md:py-32 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 100%, rgba(244, 107, 44, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Build with us</p>
          <h2 className="text-display text-[clamp(2.25rem,6vw,4.5rem)] mb-10 leading-[0.95]">
            Your site ships in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">weeks, not quarters</span>.
          </h2>
          <BookButton variant="light-primary">Book a discovery call ↗</BookButton>
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
          <Link href="/work" className="link-underline text-[var(--color-ink)] font-medium">Work</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline">About</Link>
          <BookButton variant="primary" className="!py-2 !px-4 !text-[13px]">Book a call</BookButton>
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
          <Link href="/work" className="hover:text-white transition-colors">Work</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
