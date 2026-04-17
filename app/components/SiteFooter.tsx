import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="px-6 md:px-10 py-14 md:py-20 bg-[var(--color-ink)] border-t border-white/10 text-white/60">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr] gap-10 md:gap-16 pb-12 border-b border-white/10">
          <div>
            <span className="text-display text-xl text-white">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </span>
            <p className="mt-5 text-[14px] text-white/60 max-w-md leading-relaxed">
              AI-native automation firm. We sit with operators, find where time and money leak, then design, build, and run the fix end-to-end.
            </p>
            <a
              href="mailto:hello@polycloud.in"
              className="mt-5 inline-block text-[12px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              hello@polycloud.in
            </a>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mb-5">Work</p>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/digital" className="hover:text-white transition-colors">Digital</Link></li>
              <li><Link href="/consulting" className="hover:text-white transition-colors">Consulting</Link></li>
              <li><Link href="/labs" className="hover:text-white transition-colors">Labs</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mb-5">Company</p>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Insights</Link></li>
              <li><a href="mailto:hello@polycloud.in" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[12px] text-white/40">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2026 PolyCloud Solutions LLP</span>
            <span className="text-white/20">·</span>
            <span>Est. 2020</span>
            <span className="text-white/20">·</span>
            <span>Hyderabad, India</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            India · GCC · Southeast Asia · English-first
          </p>
        </div>
      </div>
    </footer>
  );
}
