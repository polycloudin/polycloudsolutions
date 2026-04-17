import type { Metadata } from "next";
import Link from "next/link";
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
              Get audit <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Article header */}
      <article className="pt-36 md:pt-44">
        <header className="px-6 md:px-10 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="text-eyebrow text-[var(--color-text-secondary)] mb-8 inline-flex items-center gap-2 link-underline">
              ← All articles
            </Link>
            <p className="text-eyebrow text-[var(--color-primary-orange)] mb-6 mt-6">
              {post.category} · {post.readTime}
            </p>
            <h1 className="text-[clamp(2.25rem,6vw,4.75rem)] mb-8 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              {post.description}
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="px-6 md:px-10 pb-20">
          <div className="max-w-3xl mx-auto space-y-16">
            {post.sections.map((section, i) => (
              <section key={i}>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="mono text-xs text-[var(--color-primary-orange)] pt-1">
                    0{i + 1}
                  </span>
                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] flex-1">
                    {section.heading}
                  </h2>
                </div>
                <ul className="space-y-4 pl-10">
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="text-[17px] text-[var(--color-text)] leading-relaxed relative before:content-['→'] before:absolute before:-left-6 before:text-[var(--color-primary-blue)] before:font-mono before:text-sm before:top-1"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {/* CTA card */}
            <div className="p-8 md:p-12 bg-[var(--color-ink)] text-white rounded-2xl mt-20">
              <p className="text-eyebrow text-[var(--color-primary-orange)] mb-4">Take action</p>
              <p className="text-xl md:text-2xl leading-snug mb-8 font-[Plus_Jakarta_Sans] font-bold tracking-tight">
                {post.cta}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/919876543210" className="btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-orange)] hover:!border-[var(--color-primary-orange)] hover:!text-white">
                  Start on WhatsApp <span className="text-lg">→</span>
                </a>
                <a href="mailto:hello@polycloudsolutions.com" className="btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]">
                  Email us
                </a>
              </div>
            </div>

            {/* Related */}
            <div className="border-t border-[var(--color-line)] pt-12">
              <p className="text-eyebrow text-[var(--color-text-secondary)] mb-6">Keep reading</p>
              <div className="grid md:grid-cols-2 gap-6">
                {post.internalLinks.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/blog/${l.slug}`}
                    className="card-hover group p-6 border border-[var(--color-line)] rounded-2xl hover:border-[var(--color-ink)]"
                  >
                    <p className="text-eyebrow text-[var(--color-primary-orange)] mb-3">Related</p>
                    <h3 className="text-lg font-[Plus_Jakarta_Sans] font-bold leading-tight group-hover:text-[var(--color-primary-blue)] transition-colors">
                      {l.label}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
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
          </div>
        </div>
      </footer>
    </div>
  );
}
