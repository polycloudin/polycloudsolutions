"use client";

import { useState } from "react";
import Link from "next/link";

type Bundle = "local-starter" | "growth" | "total-growth" | "internal";

interface SuccessResult {
  slug: string;
  dashboardUrl: string;
  email: string;
  password: string; // shown once, in this session only — not persisted client-side
}

const BUNDLE_LABELS: Record<Bundle, string> = {
  "local-starter": "Local Starter",
  growth: "Growth",
  "total-growth": "Total Growth",
  internal: "Internal (no billing)",
};

/**
 * Operator-facing form. Posts to /api/admin/clients. On 201 it shows the
 * one-time credentials block (operator copies email + password and hands
 * to the customer). Errors are surfaced inline; the operator can retry
 * without losing what they typed.
 */
export default function OnboardForm() {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bundle, setBundle] = useState<Bundle>("growth");
  const [location, setLocation] = useState("");
  const [retainerMonthly, setRetainerMonthly] = useState<string>("");
  const [setupFee, setSetupFee] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessResult | null>(null);

  function autoSlugFromName(value: string) {
    setName(value);
    if (!slug) {
      const auto = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (auto) setSlug(auto);
    }
  }

  function generatePassword() {
    // 16 chars, alpha-num + specials. Not cryptographically tuned for high-
    // entropy use cases — operator can replace if they want a passphrase.
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#%&*-_";
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    setPassword(
      Array.from(arr)
        .map((b) => chars[b % chars.length])
        .join(""),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          email,
          password,
          bundle,
          location: location || undefined,
          retainerMonthly: retainerMonthly ? Number(retainerMonthly) : undefined,
          setupFee: setupFee ? Number(setupFee) : undefined,
        }),
      });
      const json = await res.json();
      if (res.status === 201 && json.ok) {
        setSuccess({
          slug: json.slug,
          dashboardUrl: json.dashboardUrl,
          email: json.login.email,
          password,
        });
        return;
      }
      if (res.status === 409) {
        setError(
          json.error === "slug_taken"
            ? `Slug "${slug}" is already in use.`
            : `Email "${email}" already has an account.`,
        );
        return;
      }
      if (res.status === 400 && Array.isArray(json.details)) {
        setError(`Validation: ${json.details.join("; ")}`);
        return;
      }
      if (res.status === 503) {
        setError(
          json.partial?.dashboard_created
            ? `Dashboard created (${slug}) but login failed: ${json.reason}. Retry from the API or set the password manually.`
            : `Database unavailable: ${json.reason ?? "unknown"}`,
        );
        return;
      }
      setError(json.error ?? `Unexpected ${res.status} response`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <SuccessBlock result={success} onAddAnother={() => setSuccess(null)} />;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[var(--color-line)] rounded-xl p-6 md:p-8 space-y-5"
    >
      <Section title="Customer">
        <Field
          label="Customer name"
          hint="Their company or brand name. Auto-generates a slug below."
          required
        >
          <input
            type="text"
            value={name}
            onChange={(e) => autoSlugFromName(e.target.value)}
            placeholder="Acme Cement Pvt Ltd"
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="Slug"
          hint={`Used in URL: /client/${slug || "<slug>"}. Kebab-case only.`}
          required
        >
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="acme-cement"
            pattern="[a-z0-9\-]+"
            required
            className={inputClass + " font-mono text-[13px]"}
          />
        </Field>

        <Field label="Location" hint="City · area. Shown on their dashboard.">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Hyderabad · Banjara Hills"
            className={inputClass}
          />
        </Field>

        <Field label="Bundle" required>
          <select
            value={bundle}
            onChange={(e) => setBundle(e.target.value as Bundle)}
            className={inputClass}
          >
            {(Object.keys(BUNDLE_LABELS) as Bundle[]).map((b) => (
              <option key={b} value={b}>
                {BUNDLE_LABELS[b]}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Login">
        <Field
          label="Customer email"
          hint="They sign in at polycloud.in/login with this. Stored lowercased."
          required
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@acmecement.com"
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="Initial password"
          hint="Hand to the customer over a private channel. They can rotate later (once self-serve rotation ships)."
          required
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className={inputClass + " font-mono text-[13px]"}
              placeholder="≥ 8 characters"
            />
            <button
              type="button"
              onClick={generatePassword}
              className="shrink-0 px-3 py-2 border border-[var(--color-line)] rounded-md text-[12px] hover:bg-[var(--color-surface-warm)]"
            >
              Generate
            </button>
          </div>
        </Field>
      </Section>

      <Section title="Billing (optional)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Retainer / month (₹)">
            <input
              type="number"
              min={0}
              value={retainerMonthly}
              onChange={(e) => setRetainerMonthly(e.target.value)}
              placeholder="32000"
              className={inputClass + " font-mono text-[13px]"}
            />
          </Field>
          <Field label="Setup fee (₹)">
            <input
              type="number"
              min={0}
              value={setupFee}
              onChange={(e) => setSetupFee(e.target.value)}
              placeholder="150000"
              className={inputClass + " font-mono text-[13px]"}
            />
          </Field>
        </div>
      </Section>

      {error && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-md p-3 text-[13px] text-[#991B1B]">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--color-line)]">
        <Link
          href="/admin/clients"
          className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="bg-[var(--color-ink)] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[var(--color-primary-blue)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Onboarding…" : "Onboard customer"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-3 py-2 border border-[var(--color-line)] rounded-md text-[13.5px] bg-white focus:outline-none focus:border-[var(--color-primary-blue)] focus:ring-1 focus:ring-[var(--color-primary-blue)]";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.18em] mb-2">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium block mb-1">
        {label}
        {required && <span className="text-[var(--color-primary-orange)] ml-1">*</span>}
      </span>
      {children}
      {hint && (
        <span className="text-[11.5px] text-[var(--color-text-muted)] block mt-1">
          {hint}
        </span>
      )}
    </label>
  );
}

function SuccessBlock({
  result,
  onAddAnother,
}: {
  result: SuccessResult;
  onAddAnother: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(value: string, label: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    });
  }
  const handoff = `Hi ${result.slug},

Your PolyCloud workspace is ready.

Sign in at:  https://polycloud.in/login
Email:       ${result.email}
Password:    ${result.password}

After login you'll land on your private dashboard. Save this email —
the password isn't recoverable from our side.`;

  return (
    <div className="bg-white border border-[var(--color-line)] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#15803D]" />
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#15803D] font-medium">
          Onboarded
        </p>
      </div>
      <h2 className="text-display text-2xl mb-2">
        {result.slug} is live.
      </h2>
      <p className="text-[13.5px] text-[var(--color-text-secondary)] mb-6">
        Dashboard row + login created. Hand the credentials below to the customer
        — they&apos;re shown <strong>once</strong> and never recoverable from our side.
        Copy them now.
      </p>

      <div className="bg-[var(--color-surface-warm)] border border-[var(--color-line)] rounded-lg p-4 mb-5 font-mono text-[12.5px] space-y-2">
        <CopyRow label="Dashboard" value={result.dashboardUrl} onCopy={copy} copied={copied === "Dashboard"} />
        <CopyRow label="Email" value={result.email} onCopy={copy} copied={copied === "Email"} />
        <CopyRow label="Password" value={result.password} onCopy={copy} copied={copied === "Password"} />
      </div>

      <div className="bg-white border border-[var(--color-line)] rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Handoff message (paste into Slack / WhatsApp / email)
          </span>
          <button
            type="button"
            onClick={() => copy(handoff, "Handoff")}
            className="text-[11.5px] text-[var(--color-primary-blue)] hover:underline"
          >
            {copied === "Handoff" ? "Copied ✓" : "Copy all"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
{handoff}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={result.dashboardUrl}
          className="bg-[var(--color-ink)] text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[var(--color-primary-blue)] transition-colors"
        >
          Open {result.dashboardUrl} →
        </Link>
        <button
          type="button"
          onClick={onAddAnother}
          className="border border-[var(--color-line)] px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[var(--color-surface-warm)]"
        >
          Onboard another
        </button>
        <Link
          href="/admin/clients"
          className="border border-[var(--color-line)] px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[var(--color-surface-warm)]"
        >
          Back to client list
        </Link>
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: (v: string, label: string) => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-3 min-w-0 flex-1">
        <span className="mono text-[10.5px] uppercase tracking-wider text-[var(--color-text-muted)] w-[88px] shrink-0">
          {label}
        </span>
        <span className="truncate">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value, label)}
        className="text-[11.5px] text-[var(--color-primary-blue)] shrink-0 hover:underline"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
