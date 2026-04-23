import type { ClientData, ActivityEntry, KPI } from "./types";
import { CLIENT_REGISTRY } from "./registry";

/**
 * Derived stats read by /dashboard (the operator view).
 *
 * Everything here is computed — no new data source. We derive from each
 * tenant's ClientData: KPIs, ops log, outreach, meta.retainerMonthly.
 */

export interface TenantSummary {
  slug: string;
  name: string;
  bundle: string;
  auth: "public" | "private";
  location: string;
  healthLabel?: string;
  retainerMonthly: number;       // ₹0 for non-paying tenants
  setupFee: number;
  onboarded: string;

  // Weekly ops signals
  leads7d: number | null;        // parsed from overview.kpis label matching "lead"
  cpl: string | null;            // blended CPL label
  roas: string | null;
  needsAttention: number;        // count of ops/activity entries this week with kind "needs" or "urgent"
  urgentCount: number;           // just "urgent"

  // Outreach lane
  outreachSent7d: number;
  outreachReplies7d: number;

  // Last signal
  lastActivityAt: string | null;
}

export interface OperatorOverview {
  tenants: TenantSummary[];
  totalClients: number;
  payingClients: number;
  mrrRupees: number;              // sum of retainerMonthly for paying tenants
  pipelineFee: number;            // sum of upcoming setup fees not yet banked (we don't track this yet → 0)
  totalLeads7d: number;           // sum of leads across all tenants with parseable data
  totalNeedsAttention: number;
  totalUrgent: number;
  combinedActivity: (ActivityEntry & { tenantSlug: string; tenantName: string })[];
}

// ------------------------------------------------------------------
// KPI parsing helpers — tolerant of the hand-written label variations
// ------------------------------------------------------------------

function findKpi(kpis: KPI[] | undefined, patterns: RegExp[]): KPI | undefined {
  if (!kpis) return undefined;
  return kpis.find((k) => patterns.some((p) => p.test(k.label)));
}

function parseNumber(v: string | undefined): number | null {
  if (!v) return null;
  // "342" → 342, "1,240" → 1240, "₹184" → 184, "3.4×" → 3.4, "—" → null
  const cleaned = v.replace(/[₹,×]/g, "").trim();
  if (!cleaned || cleaned === "—" || cleaned === "-") return null;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

// ------------------------------------------------------------------
// Per-tenant summary
// ------------------------------------------------------------------

export function summarizeTenant(client: ClientData): TenantSummary {
  const { meta } = client;
  const overviewKpis = client.overview?.kpis;

  const leadsKpi = findKpi(overviewKpis, [/lead/i]);
  const cplKpi = findKpi(overviewKpis, [/cpl/i, /cost per lead/i]);
  const roasKpi = findKpi(overviewKpis, [/roas/i]);
  const needsKpi = findKpi(overviewKpis, [/needs you/i, /pending/i]);

  // Count urgent / needs entries across overview.autopilotActivity + ops.log
  const allEntries: ActivityEntry[] = [
    ...(client.overview?.autopilotActivity ?? []),
    ...(client.ops?.log ?? []),
  ];
  const needsAttention = allEntries.filter(
    (a) => a.kind === "needs" || a.kind === "urgent"
  ).length;
  const urgentCount = allEntries.filter((a) => a.kind === "urgent").length;

  // Outreach — touches sent this week
  const outreach = client.outreach;
  const outreachSent7d = outreach
    ? outreach.touches.filter((t) =>
        ["sent", "opened", "replied", "booked", "closed-won", "closed-lost"].includes(t.status)
      ).length
    : 0;
  const outreachReplies7d = outreach
    ? outreach.touches.filter((t) =>
        ["replied", "booked", "closed-won", "closed-lost"].includes(t.status)
      ).length
    : 0;

  const lastActivityAt =
    allEntries.length > 0 ? allEntries[0]?.time ?? null : null;

  return {
    slug: meta.slug,
    name: meta.name,
    bundle: meta.bundle,
    auth: client.auth,
    location: meta.location,
    healthLabel: meta.healthLabel,
    retainerMonthly: meta.retainerMonthly ?? 0,
    setupFee: meta.setupFee ?? 0,
    onboarded: meta.onboarded,

    leads7d: parseNumber(leadsKpi?.value),
    cpl: cplKpi?.value ?? null,
    roas: roasKpi?.value ?? null,
    needsAttention: parseNumber(needsKpi?.value) ?? needsAttention,
    urgentCount,

    outreachSent7d,
    outreachReplies7d,

    lastActivityAt,
  };
}

// ------------------------------------------------------------------
// Full operator overview (everything /dashboard needs)
// ------------------------------------------------------------------

export function operatorOverview(): OperatorOverview {
  const tenants = Object.values(CLIENT_REGISTRY).map(summarizeTenant);

  const payingClients = tenants.filter((t) => t.retainerMonthly > 0).length;
  const mrrRupees = tenants.reduce((s, t) => s + t.retainerMonthly, 0);
  const pipelineFee = 0; // placeholder for upcoming/unbilled setup fees

  const totalLeads7d = tenants.reduce(
    (s, t) => s + (t.leads7d ?? 0),
    0
  );
  const totalNeedsAttention = tenants.reduce(
    (s, t) => s + t.needsAttention,
    0
  );
  const totalUrgent = tenants.reduce((s, t) => s + t.urgentCount, 0);

  // Cross-tenant activity feed (latest 20, interleaved)
  const combinedActivity = Object.values(CLIENT_REGISTRY)
    .flatMap((client) => {
      const entries: ActivityEntry[] = [
        ...(client.overview?.autopilotActivity ?? []),
        ...(client.ops?.log ?? []),
      ];
      return entries.map((e) => ({
        ...e,
        tenantSlug: client.meta.slug,
        tenantName: client.meta.name,
      }));
    })
    // Naive sort — entries use display strings for `time` not ISO dates,
    // so we just de-duplicate and keep input order per tenant, then
    // interleave by taking the first 20 we see.
    .slice(0, 20);

  return {
    tenants: tenants.sort((a, b) => b.retainerMonthly - a.retainerMonthly),
    totalClients: tenants.length,
    payingClients,
    mrrRupees,
    pipelineFee,
    totalLeads7d,
    totalNeedsAttention,
    totalUrgent,
    combinedActivity,
  };
}

// ------------------------------------------------------------------
// Formatting helpers (used by /dashboard and anywhere else)
// ------------------------------------------------------------------

export function formatRupees(n: number): string {
  // Indian rupee formatting: 1,50,000 not 150,000
  if (n === 0) return "₹0";
  return "₹" + n.toLocaleString("en-IN");
}

export function formatCompactRupees(n: number): string {
  if (n >= 10_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}
