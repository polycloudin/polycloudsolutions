import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/app/lib/auth";
import { listClients } from "@/app/lib/clients";
import SignOutButton from "@/app/dashboard/SignOutButton";

/**
 * /admin/clients — operator-only list of every customer dashboard.
 *
 * One row per slug, showing where the data lives (DB or static .ts file),
 * bundle, auth posture, and a link to /client/<slug>.
 *
 * Onboarding new customers happens at /admin/clients/onboard.
 */

export const metadata: Metadata = {
  title: "Clients · operator",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

function fmtTs(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export default async function AdminClientsPage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? null;
  const claims = await readSession(token);
  if (!claims || !claims.ops) notFound();

  const clients = await listClients();
  const dbCount = clients.filter((c) => c.source === "db").length;
  const staticCount = clients.filter((c) => c.source === "static").length;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-medium tracking-tight">
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Operator · Clients
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
              Customer dashboards
            </p>
            <h1 className="text-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05]">
              Clients
            </h1>
            <p className="text-[13.5px] text-[var(--color-text-secondary)] mt-2 max-w-2xl">
              {clients.length} total · {dbCount} live in DB · {staticCount} hand-curated.
              New onboardings land in the DB. The static three (kumar-textiles, polycloud,
              viratkota) stay in code.
            </p>
          </div>
          <Link
            href="/admin/clients/onboard"
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white px-4 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[var(--color-primary-blue)] transition-colors"
          >
            Onboard customer
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="bg-white border border-[var(--color-line)] rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--color-surface-warm)] text-left">
              <tr className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Bundle</th>
                <th className="px-4 py-3 font-medium">Auth</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-[var(--color-text-muted)]"
                  >
                    No clients yet — onboard the first one.
                  </td>
                </tr>
              )}
              {clients.map((c) => (
                <tr
                  key={c.slug}
                  className="border-t border-[var(--color-line)] hover:bg-[var(--color-surface-warm)]/40"
                >
                  <td className="px-4 py-3 font-mono text-[12px]">{c.slug}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="mono text-[10.5px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                      {c.bundle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mono text-[10.5px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        c.auth === "private"
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : "bg-[#DCFCE7] text-[#15803D]"
                      }`}
                    >
                      {c.auth}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mono text-[10.5px] uppercase tracking-wider ${
                        c.source === "db"
                          ? "text-[var(--color-primary-blue)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {c.source === "db" ? "● libsql" : "● code"}
                    </span>
                  </td>
                  <td className="px-4 py-3 mono text-[11px] text-[var(--color-text-secondary)]">
                    {fmtTs(c.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/client/${c.slug}`}
                      className="text-[var(--color-primary-blue)] font-medium hover:underline"
                    >
                      /client/{c.slug} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
