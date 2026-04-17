import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "../../components/BookButton";
import { notFound } from "next/navigation";
import { getPost, posts } from "../posts";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} | PolyCloud`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "PolyCloud" },
    publisher: {
      "@type": "Organization",
      name: "PolyCloud",
      logo: { "@type": "ImageObject", url: "https://polycloud.in/icon.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://polycloud.in/blog/${post.slug}`,
    },
    articleSection: post.category,
    inLanguage: "en-IN",
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Nav />

      {/* Article header */}
      <article className="pt-36 md:pt-44">
        <header className="relative px-6 md:px-10 pb-16 md:pb-20 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(26, 95, 212, 0.04) 0%, transparent 60%)",
            }}
          />
          <div className="max-w-[960px] mx-auto relative">
            <Link href="/blog" className="text-eyebrow text-[var(--color-text-secondary)] mb-10 inline-flex items-center gap-2 link-underline">
              ← All insights
            </Link>
            <div className="mt-8 flex items-baseline gap-5 mb-8">
              <span className="mono text-xs text-[var(--color-primary-orange)]">
                {String(posts.findIndex((p) => p.slug === post.slug) + 1).padStart(2, "0")}
              </span>
              <span className="text-eyebrow text-[var(--color-text-secondary)]">
                {post.category} · {post.readTime}
              </span>
            </div>
            <h1 className="text-display text-[clamp(2.25rem,7vw,5.5rem)] mb-10 leading-[0.95]">
              {post.title}
            </h1>
            <p className="text-[17px] md:text-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              {post.description}
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="px-6 md:px-10 pb-24 md:pb-32 border-t border-[var(--color-line)] pt-16 md:pt-24">
          <div className="max-w-[760px] mx-auto space-y-20">
            {post.sections.map((section, i) => (
              <section key={i}>
                <div className="flex items-baseline gap-5 mb-8">
                  <span className="mono text-xs text-[var(--color-primary-orange)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] flex-1 leading-[1.1]">
                    {section.heading}
                  </h2>
                </div>
                <ul className="space-y-5 pl-11">
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="text-[17px] text-[var(--color-text)] leading-relaxed relative before:content-['—'] before:absolute before:-left-8 before:text-[var(--color-primary-blue)] before:font-mono before:top-0"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {/* CTA card */}
            <div
              style={{ backgroundColor: "#0A0A0A" }}
              className="relative overflow-hidden p-10 md:p-14 rounded-2xl mt-24 text-white"
            >
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 90% 10%, rgba(244, 107, 44, 0.2) 0%, transparent 60%)",
                }}
              />
              <div className="relative">
                <p className="text-eyebrow text-white/50 mb-6">Apply it</p>
                <p className="text-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] mb-10 max-w-2xl">
                  {post.cta}
                </p>
                <div className="flex flex-wrap gap-3">
                  <BookButton variant="light-primary">Book a call ↗</BookButton>
                  <a
                    href="mailto:hello@polycloud.in"
                    className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]"
                  >
                    hello@polycloud.in
                  </a>
                </div>
              </div>
            </div>

            {/* Related */}
            <div className="border-t border-[var(--color-line)] pt-14">
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-8">Keep reading</p>
              <div className="grid md:grid-cols-2 gap-5">
                {post.internalLinks.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/blog/${l.slug}`}
                    className="card-hover group bg-white p-8 border border-[var(--color-line)] rounded-xl hover:border-[var(--color-ink)]"
                  >
                    <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">Related</p>
                    <h3 className="text-[clamp(1.15rem,1.6vw,1.35rem)] leading-tight mb-5 group-hover:text-[var(--color-primary-blue)] transition-colors">
                      {l.label}
                    </h3>
                    <span className="text-sm font-medium flex items-center gap-2">
                      Read
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

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
