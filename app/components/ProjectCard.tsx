import Link from "next/link";
import type { Project } from "../work/projects";

// Compact preview card for showing a shipped project.
// Used on /work, /digital selected-work strip, /solutions/* case studies, and home "selected work".

export default function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`card-hover group block bg-white rounded-xl border border-[var(--color-line)] overflow-hidden hover:border-[var(--color-ink)] transition-all ${
        compact ? "" : "h-full"
      }`}
    >
      {/* Visual slab — stylized preview */}
      <div
        className="relative aspect-[16/10] border-b border-[var(--color-line)] overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(26, 95, 212, 0.04) 0%, transparent 60%), var(--color-surface-warm)",
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F6F3EA] border-b border-[var(--color-line)]">
          <span className="w-2 h-2 rounded-full bg-[#E5E5E0]" />
          <span className="w-2 h-2 rounded-full bg-[#E5E5E0]" />
          <span className="w-2 h-2 rounded-full bg-[#E5E5E0]" />
          <span className="mono text-[9px] text-[var(--color-text-muted)] ml-2 tracking-[0.08em] lowercase">
            {project.slug}.polycloud.build
          </span>
        </div>

        {/* Stylized site preview */}
        <div className="p-5 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary-orange)]" />
              <span className="mono text-[8px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                {project.verticalSlug}
              </span>
            </div>
            <p className="text-display text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.05] text-[var(--color-ink)] max-w-[85%]">
              {project.name}
            </p>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1 max-w-[70%]">
              {project.stack.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="mono text-[8px] text-[var(--color-text-secondary)] tracking-[0.05em] bg-white px-1.5 py-0.5 rounded border border-[var(--color-line)]"
                >
                  {s}
                </span>
              ))}
            </div>
            <span className="mono text-[9px] text-[var(--color-text-muted)]">{project.year}</span>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em]">
            {project.vertical}
          </p>
          <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-blue)] group-hover:translate-x-1 transition-all">
            ↗
          </span>
        </div>
        <h3
          className={`leading-tight group-hover:text-[var(--color-primary-blue)] transition-colors ${
            compact ? "text-[15px] font-medium mb-1" : "text-[clamp(1.15rem,1.6vw,1.4rem)] mb-3"
          }`}
        >
          {project.name}
        </h3>
        {!compact && (
          <p className="text-[var(--color-text-secondary)] text-[14px] leading-relaxed">
            {project.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
