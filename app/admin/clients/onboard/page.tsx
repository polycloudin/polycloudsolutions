import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";
import SignOutButton from "@/app/dashboard/SignOutButton";
import OnboardForm from "./OnboardForm";

/**
 * /admin/clients/onboard — operator-only customer onboarding wizard.
 *
 * Fills in slug, name, bundle, login email + initial password. Posts to
 * /api/admin/clients which:
 *   1. Creates a clients row with a skeleton ClientData (DB)
 *   2. Creates an app_users row with the chosen password (DB)
 *   3. Returns the dashboard URL + the email so the operator can hand
 *      both to the customer.
 *
 * Operator hands the customer:
 *   - Email + password (Slack/WhatsApp/in-person — out of band, on us)
 *   - URL: polycloud.in (login button top right) → workspace
 */

export const metadata: Metadata = {
  title: "Onboard customer · operator",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function OnboardPage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? null;
  const claims = await readSession(token);
  if (!claims || !claims.ops) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Operator · Onboard customer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/clients"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Clients
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="mb-8">
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
            New customer
          </p>
          <h1 className="text-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] mb-3">
            Onboard customer
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
            Creates a private dashboard at <code className="font-mono text-[12px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">/client/&lt;slug&gt;</code>{" "}
            and a login the customer can use at <code className="font-mono text-[12px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">polycloud.in/login</code>.
            Both rows land in the DB — no code change, no deploy.
          </p>
        </div>

        <OnboardForm />
      </main>
    </div>
  );
}
