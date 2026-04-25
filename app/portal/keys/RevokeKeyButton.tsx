"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RevokeKeyButton({ hash }: { hash: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!confirm("Revoke this key? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/keys/${hash}`, { method: "DELETE" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Revoke failed: ${j.error ?? res.statusText}`);
        return;
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="mono text-[10px] uppercase tracking-[0.16em] text-[#7C3AED] border border-[#7C3AED] hover:bg-[#F3E8FF] rounded-full px-3 py-1 transition-colors disabled:opacity-50"
    >
      {busy ? "Revoking…" : "Revoke"}
    </button>
  );
}
