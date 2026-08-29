"use client";

import { useMemo, useRef, useState } from "react";
import type { IndianPharmaCompany } from "../../../lib/labs/indian-pharma";

type Company = Pick<IndianPharmaCompany, "slug" | "name" | "legalName" | "cin" | "ddGrade">;

interface DossierFormProps {
  companies: Company[];
  apiBase: string;
}

// Normalised-substring match over name + legalName + slug + cin — mirrors
// the backend resolver so the frontend surfaces the same fuzzy behaviour.
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export default function DossierForm({ companies, apiBase }: DossierFormProps) {
  const [query, setQuery] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo<Company[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const qn = normalize(q);
    if (!qn) return [];
    return companies
      .filter((c) => {
        const hay = normalize(`${c.name}${c.legalName}${c.slug}${c.cin}`);
        return hay.includes(qn);
      })
      .slice(0, 8);
  }, [query, companies]);

  const exactMatch = useMemo<Company | null>(() => {
    const q = query.trim();
    if (!q) return null;
    const qLower = q.toLowerCase();
    const qNorm = normalize(q);
    return (
      companies.find(
        (c) =>
          c.cin.toLowerCase() === qLower ||
          c.slug.toLowerCase() === qLower ||
          c.name.toLowerCase() === qLower ||
          normalize(c.name) === qNorm ||
          normalize(c.legalName) === qNorm,
      ) ?? null
    );
  }, [query, companies]);

  async function submit(identifier: string) {
    setError(null);
    setIsBusy(true);
    try {
      const url = `${apiBase}/api/labs/dossier/${encodeURIComponent(identifier)}?inline=0`;
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Dossier request failed: ${res.status} ${body.slice(0, 200)}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${identifier.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}-dossier.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsBusy(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = exactMatch?.slug ?? query.trim();
    if (!identifier) {
      setError("Enter a company name, slug, or CIN.");
      return;
    }
    submit(identifier);
  }

  function pick(company: Company) {
    setQuery(company.name);
    setFocused(false);
    submit(company.slug);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Company name, slug, or CIN (try 'cipla', 'Dr Reddys', 'L24239MH1935PLC002380')"
            autoComplete="off"
            spellCheck={false}
            disabled={isBusy}
            className="w-full rounded-lg border border-[var(--color-line)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/20 transition-colors disabled:opacity-60"
          />
          {focused && matches.length > 0 && (
            <ul
              role="listbox"
              className="absolute z-20 mt-2 w-full rounded-lg border border-[var(--color-line)] bg-white shadow-xl overflow-hidden"
            >
              {matches.map((c) => (
                <li
                  key={c.slug}
                  role="option"
                  aria-selected={exactMatch?.slug === c.slug}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(c)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface-warm)] transition-colors flex items-center justify-between gap-4 border-b border-[var(--color-line)] last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[var(--color-ink)]">{c.name}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                        {c.cin}
                      </span>
                    </div>
                    <span className="text-[10px] mono uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      DD {c.ddGrade}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          disabled={isBusy || !query.trim()}
          className="shrink-0 rounded-lg bg-[var(--color-primary-orange)] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-orange)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
        >
          {isBusy ? "Generating…" : "Generate dossier ↓"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <p className="mt-4 text-[12px] text-[var(--color-text-muted)]">
        {companies.length} companies indexed. Live CDSCO + CTRI + Orange Book cliff data layered in
        where available; static snapshot otherwise. PDF typically ready in under 10 seconds.
      </p>
    </div>
  );
}
