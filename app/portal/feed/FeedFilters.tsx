"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EVENT_KINDS, type EventKind } from "../../lib/events";

interface Props {
  tenants: string[];
  currentTenant?: string;
  currentKind?: EventKind;
}

const KIND_LABELS: Record<EventKind, string> = {
  "recon-run": "Recon",
  "vendor-followup": "Vendor",
  "ocr-result": "OCR",
  "memo-shipped": "Memo",
  "agent-run": "Agent",
  "scrape-completed": "Scrape",
  "user-action": "User",
  alert: "Alert",
  "signal-detected": "Signal",
};

export default function FeedFilters({
  tenants,
  currentTenant,
  currentKind,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // Auto-refresh every 30s — polling, per INTEGRATION.md §8.
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30_000);
    return () => clearInterval(interval);
  }, [router]);

  function setParam(key: "tenant" | "kind", value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    router.push(qs ? `/portal/feed?${qs}` : "/portal/feed");
  }

  const hasFilter = Boolean(currentTenant || currentKind);

  return (
    <nav className="sticky top-[57px] z-10 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-line)]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-3 space-y-2.5">
        {/* Kinds row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] mr-2 shrink-0">
            Kind
          </span>
          <Chip
            label="All"
            active={!currentKind}
            onClick={() => setParam("kind", undefined)}
          />
          {EVENT_KINDS.map((k) => (
            <Chip
              key={k}
              label={KIND_LABELS[k]}
              active={currentKind === k}
              onClick={() => setParam("kind", k)}
            />
          ))}
        </div>

        {/* Tenants row — only show when tenants exist */}
        {tenants.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] mr-2 shrink-0">
              Tenant
            </span>
            <Chip
              label="All"
              active={!currentTenant}
              onClick={() => setParam("tenant", undefined)}
            />
            {tenants.map((t) => (
              <Chip
                key={t}
                label={t}
                active={currentTenant === t}
                onClick={() => setParam("tenant", t)}
              />
            ))}
          </div>
        )}

        {hasFilter && (
          <button
            type="button"
            onClick={() => router.push("/portal/feed")}
            className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary-orange)] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </nav>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3 py-1 mono text-[10px] uppercase tracking-[0.16em] rounded-full whitespace-nowrap transition-colors border " +
        (active
          ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
          : "bg-white text-[var(--color-text-secondary)] border-[var(--color-line)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]")
      }
    >
      {label}
    </button>
  );
}
