import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "PolyCloud Insights | Automation playbooks for modern operators",
  description:
    "Long-form playbooks on AI automation, messaging infrastructure, and operational systems for growth-stage operators.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-4 md:px-8 py-4 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-[Plus Jakarta Sans] text-[var(--color-primary-blue)]">
            PolyCloud
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/digital" className="hover:text-[var(--color-primary-blue)]">Digital</Link>
            <Link href="/consulting" className="hover:text-[var(--color-primary-blue)]">Consulting</Link>
            <Link href="/blog" className="text-[var(--color-primary-blue)] font-semibold">Blog</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-4 md:px-8 py-16 bg-gradient-to-b from-[var(--color-surface)] to-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-[var(--color-primary-orange)] mb-3 tracking-widest uppercase">
            Insights
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-[Plus Jakarta Sans] tracking-tight mb-4">
            The playbook, public.
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Long-form essays on automation infrastructure, messaging systems, and the economics of scaling output without scaling headcount.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="px-4 md:px-8 pb-20 bg-white flex-1">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-8 border border-gray-200 rounded-lg hover:border-[var(--color-primary-blue)] hover:shadow-lg transition-all"
            >
              <p className="text-xs font-semibold text-[var(--color-primary-orange)] mb-3 tracking-widest uppercase">
                {post.category}
              </p>
              <h2 className="text-xl md:text-2xl font-bold font-[Plus Jakarta Sans] mb-3 group-hover:text-[var(--color-primary-blue)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-4 text-sm">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] font-[JetBrains_Mono]">
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.searchVolume} searches</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-8 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center text-[var(--color-text-secondary)] text-sm">
          <p>© 2026 PolyCloud Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
