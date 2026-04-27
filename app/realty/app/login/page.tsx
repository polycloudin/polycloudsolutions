import type { Metadata } from "next";

/**
 * /realty/app/login — exchange a pck_live_<token> for a session cookie.
 *
 * The form POSTs to /api/realty/builder-session, which validates the
 * api_key against realty_builders (sha256 lookup), mints a JWT with
 * `ten: [<builder_slug>]`, sets the cookie, and redirects to
 * /realty/app/<slug>.
 *
 * Honest framing: this is a builder-self-service login, not the
 * operator login at /login. Operators with `ops === true` see all
 * tenants; builders only see their own.
 */

export const metadata: Metadata = {
  title: "Realty · Builder login",
  robots: { index: false, follow: false, nocache: true },
};

interface PageProps {
  searchParams: Promise<{ slug?: string; error?: string }>;
}

export default async function BuilderLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const requestedSlug = sp.slug || "";
  const errorCode = sp.error;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] flex items-center justify-center px-5">
      <div className="max-w-md w-full">
        <p className="mono text-[10px] text-[var(--color-primary-orange)] uppercase tracking-[0.18em] mb-3">
          PolyCloud Realty
        </p>
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-serif font-medium leading-tight tracking-tight mb-4">
          Builder login
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mb-8">
          Paste the <code className="mono text-[12px]">pck_live_</code> key VK or
          Aasrith provisioned for your account. We&apos;ll mint a 14-day session.
        </p>

        {errorCode === "forbidden" && (
          <div className="mb-5 border border-[#FECACA] bg-[#FEF2F2] rounded-md p-3 text-[12px] text-[#991B1B]">
            That session doesn&apos;t have access to <strong>{requestedSlug}</strong>.
            Re-login with that builder&apos;s api_key.
          </div>
        )}
        {errorCode === "invalid" && (
          <div className="mb-5 border border-[#FECACA] bg-[#FEF2F2] rounded-md p-3 text-[12px] text-[#991B1B]">
            api_key not recognized. Verify it&apos;s the full
            <code className="mono"> pck_live_</code>… string and not truncated.
          </div>
        )}

        <form
          action="/api/realty/builder-session"
          method="POST"
          className="bg-white border border-[var(--color-line)] rounded-lg p-5 space-y-4"
        >
          <label className="block">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              api_key
            </span>
            <input
              name="api_key"
              type="password"
              required
              autoFocus
              placeholder="pck_live_…"
              className="mt-1 w-full border border-[var(--color-line)] rounded px-3 py-2 mono text-[12px]"
            />
          </label>
          <input type="hidden" name="next_slug" value={requestedSlug} />
          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-[var(--color-ink)] text-white rounded text-[13px] font-medium hover:bg-[var(--color-primary-blue-deep)] transition-colors"
          >
            Sign in →
          </button>
        </form>

        <p className="mt-6 text-[11px] text-[var(--color-text-muted)] mono">
          Operators sign in at <a href="/login" className="underline">/login</a>.
        </p>
      </div>
    </div>
  );
}
