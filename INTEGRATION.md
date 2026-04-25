# PolyCloud Portal — Integration Brief

> For: CA Firm Toolkit · Labs (Nexus) · Realty Platform
> Audience: app teams that need to read from / write to the portal at polycloud.in
> Status: v0.1 · the **shipped** sections work today; the **planned** sections need a sprint each

---

## 1 · What you can call today

Base URL: `https://www.polycloud.in`

| Method | Path | Auth | Purpose | Status |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | none (sets cookie) | Sign in with email + password → 14d JWT cookie | shipped |
| `POST` | `/api/auth/logout` | cookie | Clear the session cookie | shipped |
| `POST` | `/api/onboard` | none | Submit a 3-screen client intake → structured-log only (libsql table planned) | shipped |
| `GET`  | `/api/live/[slug]` | none | Live overlay (GA4 + Vercel Analytics) for a tenant's `/client/[slug]` dashboard | shipped (env-pending: needs `GA4_SERVICE_ACCOUNT_KEY` + `VERCEL_ACCESS_TOKEN` to return real numbers; otherwise returns the hardcoded baseline) |

**Everything else in this doc is the planned API surface — needs a sprint to land.**

---

## 2 · Auth model

### 2a · Browser users (today)
Email + password → POST `/api/auth/login` → HTTP-only `polycloud_session` cookie carrying a JWT signed with `AUTH_SECRET` (or the legacy `PRIVATE_DASH_PASS` fallback).

JWT payload:
```json
{
  "sub": "vk@polycloud.in",
  "ops": true,
  "ten": ["kumar-textiles"],
  "lab": false,
  "iat": 1745442195,
  "exp": 1746651795
}
```

Per-route enforcement in `proxy.ts`:
- `/dashboard`, `/portal` → require `ops === true`
- `/client/<private-slug>` → require `ops || ten.includes(slug)`
- `/labs/dashboard`, `/labs/dashboard/*` → require `ops || lab === true`

User store is a single TypeScript array (`app/lib/users.ts`). Migrate to libsql when user count > ~10.

### 2b · External apps (planned · needs a sprint)
Per-tenant API keys for machine-to-machine calls.

```http
POST /api/events HTTP/1.1
Host: www.polycloud.in
X-PolyCloud-Key: pck_live_<32-char-token>
X-PolyCloud-Tenant: kumar-textiles
Content-Type: application/json

{ "kind": "recon-run", "payload": { ... } }
```

Issuance flow:
1. Operator visits `/portal/keys` (planned page)
2. Picks a tenant (`kumar-textiles`) and a scope (`events:write`, `notifications:write`, `usage:write`)
3. Server generates `pck_live_<32-char>`, stores `sha256(token)` against `(tenant, scope, created_at, last_used)` in libsql
4. Token shown ONCE; operator copies it into the app's env (`POLYCLOUD_KEY`)

Server validates by hashing the inbound key and looking up the row — same pattern as Stripe / Anthropic. Rotation = generate a new key, swap, revoke the old one.

---

## 3 · Endpoints each app will need

### 3a · `POST /api/events` — cross-product event stream (planned)
Single firehose every app writes to. Becomes the source of truth for the unified Autopilot feed on `/dashboard` and per-tenant `/client/[slug]` dashboards.

**Request:**
```json
{
  "kind": "recon-run" | "vendor-followup" | "ocr-result" | "memo-shipped" | "agent-run" | "scrape-completed" | "user-action" | "alert",
  "payload": {
    "ts": "2026-04-23T15:30:00Z",
    "actor": "ca-firm-toolkit@polycloud-llp",
    "summary": "GSTR-2B recon complete · 81.2% match · ₹2,685 ITC at risk",
    "signal": "16 invoices in 2B, 16 in books",
    "action": "Matched 13 · flagged 2 · only-in-books 1 · only-in-2B 1",
    "outcome": "5-sheet Excel ready at ~/.ca-firm/recon/2026-04/kumar-textiles.xlsx",
    "links": [
      { "label": "Excel report", "href": "file:///.../kumar-textiles.xlsx" }
    ],
    "tags": ["gstr-2b", "tally"]
  }
}
```

**Response:** `{ "ok": true, "id": "evt_01HX..." }` · 201 on success.

The portal renders these as **narrative Activity cards** (signal → action → outcome) on the relevant dashboard.

### 3b · `GET /api/tenant/<slug>` — tenant config (planned)
Lets an app know what's configured for a given tenant (without hardcoding).

```json
{
  "slug": "kumar-textiles",
  "name": "Kumar Textiles",
  "bundle": "growth",
  "modules_enabled": ["ads", "social", "whatsapp", "reviews", "outreach"],
  "ga4_property_id": "533972528",
  "vercel_project_id": "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
  "wa_provider": "interakt.ai",
  "retainer_monthly": 32000
}
```

### 3c · `POST /api/notifications` — unified inbox (planned)
For deadlines, owner-approval queue items, alerts. Surfaces in `/portal/inbox` (planned) and the per-tenant dashboard's "Needs you" KPI.

```json
{
  "kind": "approval-needed" | "deadline-warn" | "deadline-due" | "alert" | "review",
  "tenant": "polycloud",
  "title": "TDS 24Q deadline in 7 days",
  "body": "Q4 24Q filing due 31 May. Last quarter: filed 2 days late.",
  "severity": "high",
  "link": "/client/polycloud?tab=ops"
}
```

### 3d · `POST /api/usage` — telemetry (planned)
For Realty's anonymized cohort feed and per-tenant module-usage tracking.

```json
{
  "tenant": "<anonymized-builder-id>",
  "module": "land-intel",
  "event": "card-opened",
  "ts": "2026-04-23T08:14:00Z",
  "payload": { "duration_s": 47 }
}
```

For Realty the key gate: **never accept a request whose payload has fewer than 5 contributing tenants** (the "≥5 contributors" cohort rule). Realty's local agent already has `assert_min_contributors` — same logic enforced server-side here.

---

## 4 · Per-app integration plans

### 4a · CA Firm Toolkit (`polycloudin/ca-firm-toolkit`)

**Today:** Local CLI · writes to `~/.ca-firm/audit.jsonl` · no portal connection.

**To wire up:**

1. **Operator generates an API key** for the firm via `/portal/keys` (when shipped):
   - Tenant: `<firm-slug>` (e.g. `pkb-associates`)
   - Scopes: `events:write`, `notifications:write`
2. **Set `POLYCLOUD_KEY` + `POLYCLOUD_TENANT`** in the firm's `~/.ca-firm/config.yaml`
3. **Append to `audit_log()` helper** to optionally POST to `/api/events`:
   ```python
   # tools/_shared/portal.py
   def push_event(kind: str, payload: dict):
       key = os.environ.get("POLYCLOUD_KEY")
       tenant = os.environ.get("POLYCLOUD_TENANT")
       if not key or not tenant: return  # local-only mode is fine
       requests.post(
           "https://www.polycloud.in/api/events",
           headers={
               "X-PolyCloud-Key": key,
               "X-PolyCloud-Tenant": tenant,
           },
           json={"kind": kind, "payload": payload},
           timeout=5,
       )
   ```
4. **Call from each tool** at completion:
   - `recon` → after 5-sheet Excel saves
   - `followup` → after WhatsApp send batch completes
   - `ocr` → per invoice, with OCR confidence
   - `dashboard` → on partner sign-off
5. **For owner-approval items** (recon flagged ITC > ₹10K, low-confidence OCR), use `/api/notifications` with `kind: "approval-needed"` so the firm's portal `/inbox` lights up.

**Data sovereignty preserved:** raw GSTR-2B JSON, Tally exports, OCR images NEVER leave the firm. Only summary events + counts + flags go to the portal.

### 4b · Labs / Nexus

**Today:** Standalone Next.js app. The polycloud-web repo only has the Labs marketing pages + `/labs/dashboard` (which currently isn't auth-gated for Labs subscribers — that just landed in PR #99).

**To wire up:**

1. **Generate a Labs-tier API key** per analyst tenant
2. **From the Decision Composer (A3) in Nexus**: push memo-completion events:
   ```http
   POST /api/events
   X-PolyCloud-Key: pck_live_...
   X-PolyCloud-Tenant: pharma-fund-x
   {
     "kind": "memo-shipped",
     "payload": {
       "ts": "2026-04-23T...",
       "summary": "Patent cliff trifecta · Cipla Q3 → 3 generic entrants",
       "chain": "patent-cliff-trifecta",
       "company": "cipla",
       "links": [{ "label": "Memo", "href": "https://nexus.../memos/..." }]
     }
   }
   ```
3. **Per-company drill-down** at `/labs/dashboard/company/[slug]` should be a thin renderer over `GET /api/labs/company/<slug>` (planned) which composes Nexus tables.
4. **Cross-link the dossier (A4)** generation events the same way — surfaces in the Labs subscriber's portal feed.

**Decision (per Labs adversarial review · 23 Apr):** position as "Decision Composer + 10 alt-data feeds" in all UI strings. NOT "11 scrapers". The portal already follows this naming on the `/portal#labs` section.

### 4c · Realty Platform (`polycloudin/realty-platform`)

**Today:** FastAPI + SQLite-per-builder + HTML dashboard at `localhost:8787` (PR #1 open · `feat/phase-0-intel-wedge`). Fully local.

**To wire up:**

1. **Local agent provisions itself** by hitting (planned) `POST /api/realty/builders` with the operator's setup token (Aasrith's onboarding flow). Returns `builder_slug` + `POLYCLOUD_KEY`.
2. **Local agent runs scheduled scrapes** (Dharani / 99acres / SRO) entirely on the builder's machine. Raw data NEVER leaves.
3. **`cohort/anonymizer.py` (already merged)** strips PII + IDs, gates on `≥5 contributors`, then pushes to `POST /api/realty/cohort/push`:
   ```json
   {
     "module": "land-intel",
     "metric_key": "median_price_per_sqyd_madhapur_2BHK_2024Q4",
     "cohort_value": 38500,
     "n_contributors": 7,
     "ts_window": "2024-Q4"
   }
   ```
4. **Builder usage telemetry** → `POST /api/usage` (anonymized) so the operator sees per-builder engagement on `/admin/realty` (planned) without seeing builder identity in the cohort feed.

**Hard rule:** the portal NEVER accepts raw scrape output from Realty. If the request body matches the shape of a Dharani plot list or a 99acres listing, drop it on the floor and 422. Enforced via input schema validation on `/api/realty/cohort/push`.

---

## 5 · Schemas (TypeScript / JSON)

Drop these into a shared `polycloud-core` package eventually so all three apps can import them.

```typescript
// app/lib/api-types.ts (planned)
export interface PortalEvent {
  kind: EventKind;
  payload: {
    ts: string;          // ISO 8601
    actor: string;       // "ca-firm-toolkit@<tenant>" / "nexus@<tenant>" / "realty-agent@<tenant>"
    summary: string;     // one-line for activity feed
    signal?: string;     // signal → action → outcome (narrative card)
    action?: string;
    outcome?: string;
    links?: Array<{ label: string; href: string }>;
    tags?: string[];
  };
}

export type EventKind =
  | "recon-run"
  | "vendor-followup"
  | "ocr-result"
  | "memo-shipped"
  | "agent-run"
  | "scrape-completed"
  | "user-action"
  | "alert";

export interface Notification {
  kind: "approval-needed" | "deadline-warn" | "deadline-due" | "alert" | "review";
  tenant: string;
  title: string;
  body: string;
  severity: "low" | "medium" | "high" | "critical";
  link?: string;          // path on polycloud.in (eg "/client/<slug>?tab=outreach")
  expires_at?: string;    // ISO 8601 — when to auto-dismiss
}

export interface TenantConfig {
  slug: string;
  name: string;
  bundle: "internal" | "local-starter" | "growth" | "total-growth";
  modules_enabled: string[];
  ga4_property_id?: string;
  vercel_project_id?: string;
  wa_provider?: "interakt.ai" | "msg91";
  retainer_monthly?: number;
}
```

---

## 6 · What gets built next (in order)

The portal session priorities, ranked by what unblocks the most:

1. **API keys** — `app/lib/api-keys.ts` + `/api/keys` issue endpoint + `/portal/keys` UI. ~1 day.
2. **`POST /api/events`** — accept events, write to libsql, emit to in-memory feed for SSE. ~1 day. Unblocks all three apps.
3. **`POST /api/notifications`** — write to libsql `notifications` table, surface in `/portal/inbox` (new). ~0.5 day.
4. **`GET /api/tenant/<slug>`** — read from existing `CLIENT_REGISTRY` + libsql overrides. ~2 hours.
5. **`POST /api/usage`** — Realty cohort feed with the ≥5-contributors gate. ~1 day.
6. **Realty-specific: `POST /api/realty/cohort/push`** + `POST /api/realty/builders` provisioning. ~1 day.
7. **libsql migration** for `users` (currently a TS array). ~1 day.

Total: ~6-7 days of focused work to unlock all three integrations.

Until then, all three apps run local-only (which is fine — the toolkit is sold on data sovereignty, Labs has its own portal in Nexus, Realty's local agent is the product).

---

## 7 · Quick reference (for app authors today)

Auth check while you wait for API keys:

```bash
# Sign in
curl -i -X POST https://www.polycloud.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"polycloud","pass":"<env PRIVATE_DASH_PASS>"}'
# → Set-Cookie: polycloud_session=...

# Use the cookie
curl -b "polycloud_session=<jwt>" https://www.polycloud.in/dashboard
```

Submit an intake (already shipped, public):

```bash
curl -X POST https://www.polycloud.in/api/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Acme Trading",
    "contact_name": "Rajesh Kumar",
    "email": "rajesh@acme.in",
    "phone": "+91 98xxxxxxx",
    "vertical": "retail-other",
    "bundle": "growth",
    "pain_point": "Spending 4 hrs/day on WhatsApp enquiries"
  }'
```

Live data overlay for an existing tenant:

```bash
curl https://www.polycloud.in/api/live/kumar-textiles
# → JSON ClientData with overview.kpis + organic.siteTraffic merged from GA4 + Vercel
```

---

## 8 · Open architecture questions (decisions needed before scaling)

Captured in `~/.claude/.../memory/project/polycloud_portal_spec.md`:

- **Data sovereignty** — local agent + cloud aggregator (current bias) vs SaaS. Affects all three apps.
- **Multi-tenant DB** — Realty uses SQLite-per-builder; portal needs to mirror the same shape so the local→cloud sync is 1-to-1, not a translation layer.
- **Real-time vs polling** for the activity feed — SSE/WS adds backend complexity; polling every 30s is fine for v1.
- **Identity provider** — extend the in-code `users.ts` or move to Clerk/Supabase before SSO across products?
- **Mobile** — portal is the first surface where partners actually need mobile. Plan PWA from day 1.

When portal session decides on auth model + multi-tenant DB schema, send those decisions back to the CA / Labs / Realty session leads. All three local schemas need to mirror so push endpoints are 1-to-1.

---

## 9 · Source files

- `app/api/auth/login/route.ts` · login API · shipped
- `app/api/auth/logout/route.ts` · logout · shipped
- `app/api/onboard/route.ts` · intake submit · shipped
- `app/api/live/[slug]/route.ts` · live data overlay · shipped (env-pending for real numbers)
- `app/lib/auth.ts` · JWT sign + verify
- `app/lib/users.ts` · RBAC user store
- `proxy.ts` · per-route capability enforcement
- `~/.claude/.../memory/project/polycloud_portal_spec.md` · cross-product spec + open questions
- `INTEGRATION.md` (this file) · API integration brief for app teams
