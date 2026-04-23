"use client";

import { useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  async function onClick() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors border border-[var(--color-line)] hover:border-[var(--color-ink)] rounded-full px-3 py-1.5 disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
