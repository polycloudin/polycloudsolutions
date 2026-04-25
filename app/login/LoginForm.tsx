"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass, next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign-in failed.");
        return;
      }
      // Hard navigation — proxy.ts will now see the cookie and let us through.
      // /api/auth/login picks the right destination based on the user's caps:
      //   ops      → /dashboard
      //   tenant   → /client/<their first slug>
      //   labs-only → /labs/dashboard
      window.location.href = data.next || "/";
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="email"
          className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5 block"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="you@polycloud.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-lg bg-white text-[14.5px] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/10 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="pass"
          className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5 block"
        >
          Password
        </label>
        <input
          id="pass"
          name="pass"
          type="password"
          autoComplete="current-password"
          required
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-lg bg-white text-[14.5px] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/10 transition-all"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email || !pass}
        className="w-full mt-2 px-5 py-3 bg-[var(--color-ink)] text-white rounded-lg text-[14px] font-medium tracking-tight hover:bg-[var(--color-primary-blue)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <span className="opacity-70">↗</span>
          </>
        )}
      </button>

      <p className="text-[11.5px] text-[var(--color-text-muted)] mt-3 text-center">
        Signed sessions last 14 days. Cookie is HttpOnly + Secure + SameSite.
      </p>
    </form>
  );
}
