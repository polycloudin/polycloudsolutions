/**
 * Fixture data for /portal/ca-firm and /portal/ca-firm/[slug].
 *
 * Today: hardcoded events shaped like the v0.2 INTEGRATION.md spec.
 * Tomorrow: swap to a server fetch from `/api/v1/events?tenant=...`
 *           and `/api/v1/notifications?kind=approval-needed&tenant=...`.
 *
 * The shape here mirrors PortalEvent + Notification from app/lib/api-types.ts
 * (planned), so the swap is a one-liner — replace `EVENTS_FIXTURE` with a
 * `fetchEvents()` server-side call.
 */

export type EventKind =
  | "recon-run"
  | "vendor-followup"
  | "ocr-result"
  | "form-3cd"
  | "tds-return"
  | "udin-issued"
  | "notice-drafted"
  | "client-mis"
  | "review-approved"
  | "review-pending"
  | "alert";

export interface CAFirmEvent {
  id: string;
  ts: string; // ISO 8601
  tenant: string; // firm slug
  kind: EventKind;
  actor: string; // ca-firm-toolkit@<tenant>
  summary: string;
  signal?: string;
  action?: string;
  outcome?: string;
  tags?: string[];
  link?: string;
  amount_inr?: number; // for approval thresholds
  confidence?: number; // 0-1, for AI outputs
}

export interface ApprovalItem {
  id: string;
  ts: string;
  tenant: string;
  kind: "approval-needed";
  title: string;
  body: string;
  severity: "low" | "medium" | "high" | "critical";
  link?: string;
  amount_inr?: number;
}

export interface CAFirmTenant {
  slug: string;
  name: string;
  status: "ACTIVE" | "PILOT" | "PILOT_PENDING";
  bundle: "internal" | "starter" | "growth" | "pro" | "full-practice";
  retainer_monthly: number; // INR
  partner_count: number;
  client_count: number;
  toolkit_version: string;
  tan?: string;
  gstin?: string;
  enrolled_at: string; // ISO date
  api_key_status: "ACTIVE" | "REVOKED" | "PENDING";
  last_event_ts?: string; // ISO 8601
  notes?: string;
}

// ---- Tenants -----------------------------------------------------------

export const TENANTS_FIXTURE: CAFirmTenant[] = [
  {
    slug: "polycloud-llp",
    name: "PolyCloud Solutions LLP",
    status: "ACTIVE",
    bundle: "internal",
    retainer_monthly: 0, // dogfood
    partner_count: 2,
    client_count: 0,
    toolkit_version: "v0.4",
    tan: "HYDP15059C",
    enrolled_at: "2026-04-24",
    api_key_status: "PENDING", // /api/v1/keys not built yet
    last_event_ts: "2026-04-25T08:14:00Z",
    notes:
      "Dogfood tenant 001. The TDS notice on TAN HYDP15059C (received 24 Apr) is the first real notice in this dashboard.",
  },
  {
    slug: "kumar-textiles",
    name: "Kumar Textiles (showcase)",
    status: "ACTIVE",
    bundle: "growth",
    retainer_monthly: 32_000,
    partner_count: 1,
    client_count: 1,
    toolkit_version: "v0.4",
    enrolled_at: "2026-02-09",
    api_key_status: "PENDING",
    last_event_ts: "2026-04-23T15:30:00Z",
    notes: "Public Growth-bundle demo at /client/kumar-textiles.",
  },
  {
    slug: "pkb-associates",
    name: "PKB Associates (Hyderabad pilot prospect)",
    status: "PILOT_PENDING",
    bundle: "pro",
    retainer_monthly: 55_000,
    partner_count: 4,
    client_count: 38,
    toolkit_version: "—",
    enrolled_at: "2026-04-20",
    api_key_status: "PENDING",
    notes:
      "Sample firm for Q2 2026 pilot list. Partner met 18 Apr; awaiting engagement letter signature.",
  },
  {
    slug: "sharma-co-llp",
    name: "Sharma & Co LLP (Hyderabad pilot prospect)",
    status: "PILOT_PENDING",
    bundle: "pro",
    retainer_monthly: 55_000,
    partner_count: 3,
    client_count: 22,
    toolkit_version: "—",
    enrolled_at: "2026-04-22",
    api_key_status: "PENDING",
    notes: "Met at ICAI Hyderabad chapter mixer. Sent INTEGRATION.md.",
  },
];

// ---- Events ------------------------------------------------------------
// Most recent first. Each event mirrors what tools/_shared/portal.py would
// push via POST /api/v1/events when that ships.

export const EVENTS_FIXTURE: CAFirmEvent[] = [
  {
    id: "evt_01HX_001",
    ts: "2026-04-25T08:14:00Z",
    tenant: "polycloud-llp",
    kind: "alert",
    actor: "manual@polycloud-llp",
    summary: "TDS arrear-demand notice on TAN HYDP15059C — recovery stage",
    signal: "AO Hyderabad sent recovery notice; 20-Apr deadline missed",
    action: "Logged in ledger; pulling Default Summary from TRACES today",
    outcome: "Bank-attachment risk u/s 222 — must resolve in 24-48h",
    tags: ["tds", "recovery", "critical", "self"],
    amount_inr: 0,
  },
  {
    id: "evt_01HX_002",
    ts: "2026-04-23T15:30:00Z",
    tenant: "kumar-textiles",
    kind: "recon-run",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "GSTR-2B recon · 81.2% match · ₹2,685 ITC at risk",
    signal: "16 invoices in 2B, 16 in books",
    action: "Matched 13 · flagged 2 · only-in-books 1 · only-in-2B 1",
    outcome: "5-sheet Excel ready",
    tags: ["gstr-2b", "tally", "demo"],
    amount_inr: 2_685,
  },
  {
    id: "evt_01HX_003",
    ts: "2026-04-23T15:32:00Z",
    tenant: "kumar-textiles",
    kind: "vendor-followup",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "Vendor follow-up · 2 WhatsApp messages queued",
    signal: "2 vendors flagged in recon (missing GSTR-1 + amount mismatch)",
    action: "3 Meta-approved templates · partner reviewing dry-run",
    outcome: "Pending partner sign-off before live send",
    tags: ["whatsapp", "vendor", "demo"],
  },
  {
    id: "evt_01HX_004",
    ts: "2026-04-22T11:05:00Z",
    tenant: "kumar-textiles",
    kind: "client-mis",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "April MIS dashboard generated · cash-flow projection updated",
    signal: "₹4.8L cash position · 67-day runway · TIGHT",
    action: "30/60/90-day forecast updated with March seasonality",
    outcome: "PDF ready · auto-shared to client portal at /client/kumar-textiles",
    tags: ["mis", "client", "demo"],
  },
  {
    id: "evt_01HX_005",
    ts: "2026-04-22T09:30:00Z",
    tenant: "kumar-textiles",
    kind: "review-pending",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "OCR confidence below threshold · partner review required",
    signal: "1 invoice OCR confidence 0.68 (threshold 0.70)",
    action: "Voucher draft ready in ~/.ca-firm/ocr/drafts/",
    outcome: "Awaiting partner confirmation before Tally import",
    tags: ["ocr", "review", "demo"],
    confidence: 0.68,
  },
  {
    id: "evt_01HX_006",
    ts: "2026-04-21T16:45:00Z",
    tenant: "kumar-textiles",
    kind: "tds-return",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "Form 26Q FVU draft · Q4 FY2024-25",
    signal: "8 deductee rows · ₹47,250 total TDS",
    action: "PAN validation passed · Section 201(1A) interest computed",
    outcome: "FVU file generated · ready for NSDL upload",
    tags: ["tds", "26q", "fvu"],
    amount_inr: 47_250,
  },
];

// ---- Approval queue (planned: /api/v1/notifications?kind=approval-needed) ----

export const APPROVALS_FIXTURE: ApprovalItem[] = [
  {
    id: "apv_001",
    ts: "2026-04-22T09:30:00Z",
    tenant: "kumar-textiles",
    kind: "approval-needed",
    title: "OCR voucher draft below confidence threshold",
    body: "Invoice from MetroPrint Co (₹18,400) parsed with 0.68 confidence. Vendor name + GSTIN match historical, but HSN code is new. Approve to import to Tally; reject to re-shoot photo.",
    severity: "medium",
    amount_inr: 18_400,
  },
  {
    id: "apv_002",
    ts: "2026-04-23T15:32:00Z",
    tenant: "kumar-textiles",
    kind: "approval-needed",
    title: "Vendor follow-up batch ready to send (2 messages)",
    body: "Recon flagged 2 vendors. Templates pre-approved by Meta. Dry-run preview queued. Approve to send live; reject to skip this cycle.",
    severity: "low",
  },
  {
    id: "apv_003",
    ts: "2026-04-25T08:14:00Z",
    tenant: "polycloud-llp",
    kind: "approval-needed",
    title: "TDS recovery — pull Default Summary from TRACES",
    body: "Recovery notice on TAN HYDP15059C. Need to pull TRACES Default Summary and identify root cause (most likely NIL non-filing, s.234E fee). Coercive action risk after 20 Apr.",
    severity: "critical",
  },
];

// ---- Helpers -----------------------------------------------------------

export function tenantBySlug(slug: string): CAFirmTenant | undefined {
  return TENANTS_FIXTURE.find((t) => t.slug === slug);
}

export function eventsForTenant(slug: string, limit = 50): CAFirmEvent[] {
  return EVENTS_FIXTURE.filter((e) => e.tenant === slug).slice(0, limit);
}

export function approvalsForTenant(slug: string): ApprovalItem[] {
  return APPROVALS_FIXTURE.filter((a) => a.tenant === slug);
}

export function summaryStats() {
  const enrolled = TENANTS_FIXTURE.filter(
    (t) => t.status === "ACTIVE" || t.status === "PILOT",
  ).length;
  const pendingPilots = TENANTS_FIXTURE.filter(
    (t) => t.status === "PILOT_PENDING",
  ).length;
  const oneDayAgo = Date.now() - 24 * 3600 * 1000;
  const recon24h = EVENTS_FIXTURE.filter(
    (e) => e.kind === "recon-run" && new Date(e.ts).getTime() > oneDayAgo,
  ).length;
  const approvalsPending = APPROVALS_FIXTURE.length;
  const critical = APPROVALS_FIXTURE.filter(
    (a) => a.severity === "critical",
  ).length;
  return {
    enrolled,
    pendingPilots,
    recon24h,
    approvalsPending,
    critical,
  };
}

export function formatRelativeTs(iso: string): string {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.floor((now - t) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}
