import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../components/BookButton";

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
    body: "Paid-acquisition dashboards, server logs, conversion funnels, actual Claude usage data. We plan from what the instruments show, not from what sounds right in a meeting.",
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
  { category: "AI & Agents", items: ["Claude", "OpenAI", "custom agent framework"] },
  { category: "Frontend", items: ["Next.js", "TypeScript", "Tailwind"] },
  { category: "Backend", items: ["Python", "FastAPI", "Postgres", "Redis"] },
  { category: "Infrastructure", items: ["Vercel", "AWS", "Cloudflare"] },
  { category: "Integrations", items: ["WhatsApp Business API", "Tally", "Zoho", "Stripe", "GSTN"] },
  { category: "Analytics", items: ["GA4", "PostHog", "custom attribution"] },
];

const facts = [
  { label: "Founded", value: "2020" },
  { label: "Headquarters", value: "Hyderabad, India" },
  { label: "Clients served", value: "Selective — small by design" },
  { label: "Engagement length", value: "From 2-week audits to multi-year retainers" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-10 overflow-hidden">
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
          <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] mb-10 max-w-[1200px] leading-[0.95]">
            An automation firm — <span className="text-serif-accent text-[var(--color-primary-blue)]">small by design</span>.
          </h1>
          <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            We started PolyCloud because we kept watching good businesses scale by throwing bodies at problems that were really systems problems. Six years in, we're still building the same thing — infrastructure that operators can hire instead of headcount.
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
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">01 / Principles</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
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
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 md:px-10 py-24 md:py-36 bg-[var(--color-surface-warm)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">02 / Stack</p>
              <h2 className="text-[clamp(2.25rem,6vw,5rem)] max-w-2xl">
                What we <span className="text-serif-accent">build on</span>.
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-md text-[15px] leading-relaxed">
              Opinionated, not religious. The stack updates when something cleaner ships. Tool-agnostic on the parts that matter — we pick the cleanest tool for the workflow, never the one with the biggest margin for us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {stack.map((s) => (
              <div
                key={s.category}
                className="bg-white rounded-xl border border-[var(--color-line)] p-8 card-hover"
              >
                <p className="text-eyebrow text-[var(--color-primary-orange)] mb-5">{s.category}</p>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="text-[var(--color-text)] text-[15px] flex gap-3 items-baseline">
                      <span className="text-[var(--color-primary-blue)] text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
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
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(26, 95, 212, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <p className="text-eyebrow text-white/50 mb-8">Work with us</p>
          <h2 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
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
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 backdrop-blur-xl bg-[var(--color-surface)]/75 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-display text-xl tracking-tight">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/digital" className="link-underline">Digital</Link>
          <Link href="/consulting" className="link-underline">Consulting</Link>
          <Link href="/blog" className="link-underline">Insights</Link>
          <Link href="/about" className="link-underline text-[var(--color-ink)] font-medium">About</Link>
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
          <Link href="/blog" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
