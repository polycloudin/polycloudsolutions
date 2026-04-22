"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavKey = "digital" | "consulting" | "labs" | "insights" | "about";

export default function MobileMenu({
  links,
  active,
}: {
  links: { key: NavKey; href: string; label: string }[];
  active?: NavKey;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while menu open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-[var(--color-surface-warm)] transition-colors"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className="relative block w-5 h-3.5">
          <span
            className={`absolute left-0 right-0 h-[1.5px] bg-[var(--color-ink)] transition-all duration-200 ${
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 right-0 h-[1.5px] bg-[var(--color-ink)] top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 right-0 h-[1.5px] bg-[var(--color-ink)] transition-all duration-200 ${
              open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
            }`}
          />
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`md:hidden fixed top-[61px] left-0 right-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-line)] shadow-xl transition-all duration-250 origin-top ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="px-6 py-5 flex flex-col gap-1">
          {links.map((l) => {
            const isActive = active === l.key;
            return (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between py-3 px-3 -mx-1 rounded-md text-[17px] transition-colors ${
                  isActive
                    ? "text-[var(--color-ink)] font-medium bg-[var(--color-surface-warm)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-surface-warm)]"
                }`}
              >
                <span>{l.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-orange)]" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pb-6 pt-2 border-t border-[var(--color-line)]">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Hyderabad · India
          </p>
        </div>
      </div>
    </>
  );
}
