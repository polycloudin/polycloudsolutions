"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  tenants: string[]; // tenants present in current result set
  accessibleTenants: string[] | null; // null = operator (all tenants); else allowlist
  currentTenant?: string;
  currentSeverity?: "low" | "medium" | "high" | "critical";
  currentUnreadOnly: boolean;
}

const SEVERITIES = ["low", "medium", "high", "critical"] as const;

const SEVERITY_LABEL: Record<(typeof SEVERITIES)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export default function InboxControls({
  tenants,
  accessibleTenants,
  currentTenant,
  currentSeverity,
  currentUnreadOnly,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    router.push(qs ? `/portal/inbox?${qs}` : "/portal/inbox");
  }

  // Tenant chips: accessible tenants (full list) plus any tenant currently
  // showing (in case the user's scope was wider when notifications were
  // generated). For operators, show whatever tenants are in the current
  // result set.
  const tenantChips =
    accessibleTenants !== null
      ? Array.from(new Set([...accessibleTenants, ...tenants])).sort()
      : tenants;

  const hasFilter = Boolean(currentTenant || currentSeverity || currentUnreadOnly);

  return (
    <nav className="sticky top-[57px] z-10 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-line)]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-3 space-y-2.5">
        {/* Severity row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] mr-2 shrink-0">
            Severity
          </span>
          <Chip
            label="All"
            active={!currentSeverity}
            onClick={() => setParam("severity", undefined)}
          />
          {SEVERITIES.map((s) => (
            <Chip
              key={s}
              label={SEVERITY_LABEL[s]}
              active={currentSeverity === s}
              onClick={() => setParam("severity", s)}
            />
          ))}
        </div>

        {/* Tenant row */}
        {tenantChips.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] mr-2 shrink-0">
              Tenant
            </span>
            <Chip
              label="All"
              active={!currentTenant}
              onClick={() => setParam("tenant", undefined)}
            />
            {tenantChips.map((t) => (
              <Chip
                key={t}
                label={t}
                active={currentTenant === t}
                onClick={() => setParam("tenant", t)}
              />
            ))}
          </div>
        )}

        {/* Read state row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.16em] shrink-0">
            Show
          </span>
          <Chip
            label="All"
            active={!currentUnreadOnly}
            onClick={() => setParam("unread", undefined)}
          />
          <Chip
            label="Unread only"
            active={currentUnreadOnly}
            onClick={() => setParam("unread", "1")}
          />

          {hasFilter && (
            <button
              type="button"
              onClick={() => router.push("/portal/inbox")}
              className="ml-auto mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary-orange)] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
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
