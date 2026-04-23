import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — PolyCloud",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] relative overflow-hidden">
      {/* Background ambience */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 0%, rgba(26, 95, 212, 0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 85% 100%, rgba(244, 107, 44, 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        <header className="px-6 md:px-10 py-6">
          <a href="/" className="font-serif text-xl tracking-tight">
            Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
          </a>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 md:mb-10">
              <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.22em] mb-3">
                Internal access
              </p>
              <h1 className="text-display text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.05] tracking-tight">
                Sign in to your{" "}
                <span className="text-serif-accent text-[var(--color-primary-blue)]">
                  cockpit
                </span>
                .
              </h1>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mt-3">
                Operator dashboard, private client views, and outreach queue.
                Not a public customer area.
              </p>
            </div>

            <Suspense fallback={<FormSkeleton />}>
              <LoginForm />
            </Suspense>

            <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                New to PolyCloud?{" "}
                <a
                  href="/onboard"
                  className="text-[var(--color-primary-blue)] font-medium link-underline"
                >
                  Start onboarding →
                </a>
              </p>
            </div>
          </div>
        </main>

        <footer className="px-6 md:px-10 py-6 flex items-center justify-between">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
            Polycloud Solutions · Hyderabad
          </p>
          <a
            href="mailto:hello@polycloud.in"
            className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hover:text-[var(--color-ink)] transition-colors"
          >
            Need help?
          </a>
        </footer>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 rounded-lg bg-[var(--color-surface-warm)] animate-pulse" />
      <div className="h-12 rounded-lg bg-[var(--color-surface-warm)] animate-pulse" />
      <div className="h-11 rounded-lg bg-[var(--color-surface-warm)] animate-pulse" />
    </div>
  );
}
