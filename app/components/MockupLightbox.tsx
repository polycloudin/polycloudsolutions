"use client";

import { useEffect, useState } from "react";

export default function MockupLightbox({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Clickable wrapper */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Expand to full size"
        className="block w-full text-left cursor-zoom-in group relative"
      >
        <div className="relative">
          {children}
          {/* Hover affordance */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md bg-[var(--color-ink)]/85 backdrop-blur-sm text-white text-[11px] mono uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click to expand ↗
          </div>
        </div>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-10 anim-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[var(--color-ink)]/85 backdrop-blur-md cursor-zoom-out"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>

          <div className="relative w-full max-w-[1400px] max-h-[88vh] overflow-auto rounded-xl anim-fade-up shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]">
            {children}
          </div>

          {caption && (
            <p className="relative mt-4 mono text-[11px] text-white/60 tracking-[0.15em] text-center max-w-xl">
              {caption}
            </p>
          )}
          <p className="relative mt-2 mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
            Press Esc or click anywhere to close
          </p>
        </div>
      )}
    </>
  );
}
