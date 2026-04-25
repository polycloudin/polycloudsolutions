import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "../../dashboard/SignOutButton";
import { currentClaims } from "../../lib/route-auth";
import { listKeys, VALID_SCOPES } from "../../lib/api-keys";
import { CLIENT_REGISTRY } from "../../lib/tenants";
import KeyIssueForm from "./KeyIssueForm";
import RevokeKeyButton from "./RevokeKeyButton";

export const metadata: Metadata = {
  title: "API keys · Portal — PolyCloud",
  robots: { index: false, follow: false, nocache: true },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Operator-only API key management.
 *
 * Lists every key (including revoked, with a strikethrough), shows
 * tenant + scopes + label + last_used_at, and renders an issue form +
 * per-row revoke button.
 *
 * Auth: proxy.ts gates /portal/* on ops === true. Belt-and-braces:
 * we re-check claims here too so the page can't be accidentally exposed
 * if proxy matchers shift.
 */
export default async function KeysPage() {
  const claims = await currentClaims();
  if (!claims) {
    redirect("/login?next=/portal/keys");
  }
  if (!claims.ops) {
    redirect("/dashboard");
  }

  const keys = await listKeys();
  const tenants = Object.values(CLIENT_REGISTRY).map((t) => ({
    slug: t.slug,
    name: t.name,
    bundle: t.bundle,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Top bar — mirrors /portal page */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-serif text-lg font-medium tracking-tight"
            >
              Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
            </Link>
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] hidden md:inline">
              Portal · API keys
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="text-[12px] font-medium text-[var(--color-primary-blue)]"
            >
              ← Portal
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 md:px-8 py-8 md:py-12 max-w-[1280px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-3">
          Per-tenant API keys for machine-to-machine calls
        </p>
        <h1 className="text-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.05] mb-5 max-w-3xl">
          Issue, list, and revoke keys.
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Pattern matches Stripe / Anthropic — token shown once at
          issuance, server only stores <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">sha256(token)</code>.
          Inbound apps send <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">X-PolyCloud-Key</code> +{" "}
          <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">X-PolyCloud-Tenant</code> headers
          to <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">/api/events</code>,{" "}
          <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">/api/notifications</code>,{" "}
          <code className="font-mono text-[12.5px] bg-[var(--color-surface-warm)] px-1.5 py-0.5 rounded">/api/usage</code>.
        </p>
      </section>

      <main className="px-5 md:px-8 max-w-[1280px] mx-auto pb-20 space-y-12">
        {/* Issue form */}
        <section>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
            01
          </p>
          <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
            Issue a new key
          </h2>
          <p className="text-[13.5px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed mb-5">
            Pick a tenant from CLIENT_REGISTRY, select scopes, give it a
            label so future-you knows where it&apos;s used. Token shown
            once — copy it into the app&apos;s <code className="font-mono text-[12px]">POLYCLOUD_KEY</code> env immediately.
          </p>
          <div className="bg-white border border-[var(--color-line)] rounded-xl p-5 md:p-6">
            <KeyIssueForm
              tenants={tenants}
              scopes={[...VALID_SCOPES]}
            />
          </div>
        </section>

        {/* Existing keys */}
        <section>
          <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
            02
          </p>
          <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
            Existing keys ({keys.length})
          </h2>
          <p className="text-[13.5px] text-[var(--color-text-secondary)] max-w-3xl leading-relaxed mb-5">
            Hashes only — plaintext is never persisted. Revoke immediately
            if a key is suspected of being leaked. To rotate: issue a new
            key, swap into env, revoke the old one.
          </p>

          {keys.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="bg-white border border-[var(--color-line)] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--color-surface-warm)] border-b border-[var(--color-line)]">
                  <tr className="text-left">
                    <Th>Tenant</Th>
                    <Th>Scopes</Th>
                    <Th>Label</Th>
                    <Th>Created</Th>
                    <Th>Last used</Th>
                    <Th>Hash (8…)</Th>
                    <Th>Status</Th>
                    <Th>{" "}</Th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => {
                    const revoked = !!k.revoked_at;
                    return (
                      <tr
                        key={k.hash}
                        className={`border-t border-[var(--color-line)] ${
                          revoked
                            ? "text-[var(--color-text-muted)] line-through"
                            : ""
                        }`}
                      >
                        <Td className="font-medium">{k.tenant}</Td>
                        <Td>
                          <span className="mono text-[11px]">
                            {k.scopes.join(", ")}
                          </span>
                        </Td>
                        <Td>{k.label || <span className="text-[var(--color-text-muted)]">—</span>}</Td>
                        <Td>
                          <span className="mono text-[11px]">{k.created_at.slice(0, 16)}</span>
                        </Td>
                        <Td>
                          <span className="mono text-[11px]">
                            {k.last_used_at ? k.last_used_at.slice(0, 16) : <span className="text-[var(--color-text-muted)]">never</span>}
                          </span>
                        </Td>
                        <Td>
                          <code className="font-mono text-[11px] text-[var(--color-text-muted)]">
                            {k.hash.slice(0, 8)}…
                          </code>
                        </Td>
                        <Td>
                          <StatusPill revoked={revoked} />
                        </Td>
                        <Td>
                          {!revoked && <RevokeKeyButton hash={k.hash} />}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mono text-[10px] text-[var(--color-text-muted)] tracking-[0.16em] text-center uppercase pt-8 border-t border-[var(--color-line)]">
          Source · <code className="font-mono">app/lib/api-keys.ts</code> ·{" "}
          <code className="font-mono">app/api/keys/route.ts</code>
        </p>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-dashed border-[var(--color-line)] rounded-xl p-10 text-center">
      <p className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
        No keys yet
      </p>
      <p className="text-[13.5px] text-[var(--color-text-secondary)]">
        Issue your first key above. If you see this even after issuing,
        check that <code className="font-mono">TURSO_DATABASE_URL</code> is set in env.
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] font-medium">
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2.5 ${className ?? ""}`}>{children}</td>;
}

function StatusPill({ revoked }: { revoked: boolean }) {
  if (revoked) {
    return (
      <span
        className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
        style={{ color: "#7C3AED", backgroundColor: "#F3E8FF" }}
      >
        Revoked
      </span>
    );
  }
  return (
    <span
      className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
      style={{ color: "#15803D", backgroundColor: "#ECFDF3" }}
    >
      Active
    </span>
  );
}
