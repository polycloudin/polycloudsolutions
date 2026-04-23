import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import OnboardFlow from "./OnboardFlow";

export const metadata: Metadata = {
  title: "Get started with PolyCloud Digital",
  description:
    "3-minute intake — tell us about your business, pick a bundle, see what we'll build by Monday morning.",
};

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(26, 95, 212, 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 85% 100%, rgba(244, 107, 44, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        <header className="px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-tight">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </Link>
          <Link
            href="/login"
            className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Already a client? Sign in →
          </Link>
        </header>

        <main className="flex-1 px-6 py-8 md:py-14">
          <div className="max-w-[720px] mx-auto">
            <div className="mb-8 md:mb-12">
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-3">
                Digital · 3-minute intake
              </p>
              <h1 className="text-display text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] tracking-tight">
                Tell us about your business.{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  Your dashboard goes live Monday.
                </span>
              </h1>
              <p className="text-[14.5px] text-[var(--color-text-secondary)] leading-relaxed mt-4 max-w-xl">
                No demos. No discovery calls. Fill this form, and within
                5 working days you have a live client URL showing your
                ads, GMB, WhatsApp, and reviews in one place — approved
                by you before anything runs.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-96 rounded-xl bg-[var(--color-surface-warm)] animate-pulse" />
              }
            >
              <OnboardFlow />
            </Suspense>
          </div>
        </main>

        <footer className="px-6 md:px-10 py-6 mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] text-center md:text-left">
          Polycloud Solutions · Hyderabad · hello@polycloud.in
        </footer>
      </div>
    </div>
  );
}
