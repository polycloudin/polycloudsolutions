"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TenantOpt {
  slug: string;
  name: string;
  bundle: string;
}

interface IssuedKeyResult {
  token: string;
  hash: string;
  tenant: string;
  scopes: string[];
  label?: string;
}

export default function KeyIssueForm({
  tenants,
  scopes: allScopes,
}: {
  tenants: TenantOpt[];
  scopes: string[];
}) {
  const router = useRouter();
  const [tenant, setTenant] = useState(tenants[0]?.slug ?? "");
  const [scopes, setScopes] = useState<string[]>([]);
  const [label, setLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issued, setIssued] = useState<IssuedKeyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleScope(scope: string) {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIssued(null);
    setCopied(false);
    if (!tenant) return setError("Pick a tenant.");
    if (scopes.length === 0) return setError("Select at least one scope.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant,
          scopes,
          label: label.trim() || undefined,
        }),
      });
      const json = (await res.json()) as IssuedKeyResult | { error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Failed.");
        return;
      }
      if ("token" in json) {
        setIssued(json);
        // Reset form for next issuance.
        setScopes([]);
        setLabel("");
        // Refresh server-rendered list below.
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyToken() {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can fail in non-https / sandbox; fall back to selecting.
      const el = document.getElementById("issued-token-text");
      if (el && "select" in el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="tenant"
            className="block mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1.5"
          >
            Tenant
          </label>
          <select
            id="tenant"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full bg-white border border-[var(--color-line)] rounded-md px-3 py-2 text-[14px]"
          >
            {tenants.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name} · {t.slug} · {t.bundle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="label"
            className="block mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1.5"
          >
            Label (optional)
          </label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. ca-firm-toolkit prod"
            className="w-full bg-white border border-[var(--color-line)] rounded-md px-3 py-2 text-[14px]"
          />
        </div>
      </div>

      <div>
        <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
          Scopes (multi-select)
        </p>
        <div className="flex flex-wrap gap-2">
          {allScopes.map((s) => {
            const active = scopes.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleScope(s)}
                className={`mono text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                    : "bg-white text-[var(--color-text-secondary)] border-[var(--color-line)] hover:border-[var(--color-ink)]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded-md px-3 py-2 text-[13px]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[var(--color-ink)] text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {submitting ? "Issuing…" : "Issue key"}
      </button>

      {issued && (
        <div className="mt-4 border-2 border-[var(--color-primary-orange)] bg-[#FFFBEB] rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary-orange)]">
              ⚠ Token shown ONCE — copy now
            </p>
            <button
              type="button"
              onClick={copyToken}
              className="mono text-[10px] uppercase tracking-[0.16em] px-3 py-1 border border-[var(--color-primary-orange)] text-[var(--color-primary-orange)] rounded-full hover:bg-white transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <code
            id="issued-token-text"
            className="block font-mono text-[13px] break-all bg-white border border-[var(--color-line)] rounded px-3 py-2 select-all"
          >
            {issued.token}
          </code>
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Tenant: <strong>{issued.tenant}</strong> · Scopes:{" "}
            <strong>{issued.scopes.join(", ")}</strong>
            {issued.label ? (
              <>
                {" "}
                · Label: <strong>{issued.label}</strong>
              </>
            ) : null}
            <br />
            Set this in the app&apos;s env as{" "}
            <code className="font-mono">POLYCLOUD_KEY</code> (and{" "}
            <code className="font-mono">POLYCLOUD_TENANT={issued.tenant}</code>).
            We won&apos;t show it again.
          </p>
        </div>
      )}
    </form>
  );
}
