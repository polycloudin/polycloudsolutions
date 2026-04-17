import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "../../components/BookButton";
import ProjectCard from "../../components/ProjectCard";
import { projects } from "../projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} — ${p.vertical} | PolyCloud Work`,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = projects.filter((p) => p.verticalSlug === project.verticalSlug && p.slug !== project.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.04) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <Link href="/work" className="text-eyebrow text-[var(--color-text-secondary)] mb-10 inline-flex items-center gap-2 link-underline">
            ← All work
          </Link>
          <div className="mt-8 flex items-baseline gap-5 mb-8">
            <span className="text-eyebrow text-[var(--color-primary-orange)]">{project.vertical}</span>
            <span className="mono text-xs text-[var(--color-text-muted)]">{project.year}</span>
          </div>
          <h1 className="text-display text-[clamp(2.5rem,7vw,6rem)] mb-8 leading-[0.95]">
            {project.name}
          </h1>
          <p className="text-display text-serif-accent text-[var(--color-primary-blue)] text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.15] mb-8 max-w-3xl">
            {project.tagline}
          </p>
          <p className="text-[17px] text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>
      </section>

      {/* What we shipped */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-[var(--color-line)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20">
          <div>
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">Engagement</p>
            <dl className="space-y-6 text-[14px]">
              <div>
                <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                  Vertical
                </dt>
                <dd className="font-medium">{project.vertical}</dd>
              </div>
              <div>
                <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                  Year
                </dt>
                <dd className="font-medium">{project.year}</dd>
              </div>
              <div>
                <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                  Stack
                </dt>
                <dd className="flex flex-wrap gap-1.5 mt-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="mono text-[11px] bg-white px-2 py-1 rounded border border-[var(--color-line)]"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              {project.liveUrl && (
                <div>
                  <dt className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1">
                    Live
                  </dt>
                  <dd>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-medium text-[var(--color-primary-blue)]"
                    >
                      View live ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div>
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-5">What we shipped</p>
            <ul className="space-y-4">
              {project.delivered.map((d) => (
                <li
                  key={d}
                  className="text-[16px] leading-relaxed flex gap-4 items-baseline border-b border-[var(--color-line)] pb-4 last:border-b-0"
                >
                  <span className="text-[var(--color-primary-orange)] mono text-sm">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 md:px-10 py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto">
            <p className="text-eyebrow text-[var(--color-text-secondary)] mb-10">
              More in {project.vertical.split(" · ")[0]}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
          <p className="text-eyebrow text-white/50 mb-8">Something similar?</p>
          <h2 className="text-display text-[clamp(2.25rem,6vw,4.5rem)] mb-10 leading-[0.95]">
            We can ship yours in{" "}
            <span className="text-serif-accent text-[var(--color-primary-orange)]">weeks</span>.
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
