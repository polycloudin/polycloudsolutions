# PolyCloud Portal — Integration Brief

> For: CA Firm Toolkit · Labs (Nexus) · Realty Platform
> Audience: app teams that need to read from / write to the portal at polycloud.in
> Status: v0.2 · the **shipped** sections work today; the **planned** sections need a sprint each

---

## 1 · What you can call today

Base URL: `https://www.polycloud.in`

| Method | Path | Auth | Purpose | Status |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | none (sets cookie) | Sign in with email + password → 14d JWT cookie | shipped |
| `POST` | `/api/auth/logout` | cookie | Clear the session cookie | shipped |
| `POST` | `/api/onboard` | none | Submit a 3-screen client intake → structured-log only (libsql table planned) | shipped |
| `GET`  | `/api/live/[slug]` | none | Live overlay (GA4 + Vercel Analytics) for a tenant's `/client/[slug]` dashboard | shipped (env-pending: needs `GA4_SERVICE_ACCOUNT_KEY` + `VERCEL_ACCESS_TOKEN` to return real numbers; otherwise returns the hardcoded baseline) |
| `GET`  | `/api/health` | none | Liveness + DB-ready check (`{ "ok": true, "ts": "...", "db": "ok", "version": "v0.2" }`) — apps poll before batched writes | planned · 1 hour |

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

#### Retry safety — idempotency keys
Every write endpoint accepts an optional `Idempotency-Key: <uuid>` header. Same key + same body within 24h returns the original response code + body — never a duplicate write. Apps SHOULD send a UUID per logical operation.

```http
POST /api/v1/events HTTP/1.1
X-PolyCloud-Key: pck_live_...
X-PolyCloud-Tenant: kumar-textiles
Idempotency-Key: 8f6c3a4e-d3b2-4f8a-9e1c-7b5d2a1c3e4f
Content-Type: application/json
{ ... }
```

Portal stores `(tenant, key) → (status, body, ts)` for dedup. Critical for the CA toolkit and Realty agents which retry on flaky links.

#### Rate limiting
Per-tenant + per-scope. Default budgets:

| Scope | Per minute | Per hour |
|---|---|---|
| `events:write` | 60 | 1,000 |
| `notifications:write` | 30 | 200 |
| `usage:write` | 30 | 500 |

Portal returns standard `RateLimit-*` headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`) on every response. On overage: `429 Too Many Requests` with `Retry-After: <seconds>`. Platform Premium tier gets 10× headroom (negotiable per contract).

### 2c · Versioning
All new machine-to-machine endpoints (sections 3+) live under `/api/v1/`. The legacy browser-auth surface (`/api/auth/*`, `/api/onboard`) stays unversioned for now to avoid breaking the marketing site; it folds into `/api/v2/` when those routes evolve.

**Breaking-change policy:**
- Additive changes (new fields, new event kinds, new optional headers) are **not** breaking — stay on `v1`
- Removed fields, type changes, semantic shifts → bumped to `/api/v2/...`
- 6-month deprecation window on retired endpoints, signalled via `Deprecation: <date>` response header + `Sunset: <date>` header

---

## 3 · Endpoints each app will need

### 3a · `POST /api/v1/events` — cross-product event stream (planned)
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

### 3b · `GET /api/v1/tenant/<slug>` — tenant config (planned)
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

### 3c · `POST /api/v1/notifications` — unified inbox (planned)
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

### 3d · `POST /api/v1/usage` — telemetry (planned)
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

### 3e · Outbound webhooks — portal → app (planned)
Apps that need to react to portal-side events (partner approves a review-queue item, operator updates a tenant's bundle, deadline alarm fires) register a webhook URL:

```http
PUT /api/v1/tenant/<slug>/webhook
X-PolyCloud-Key: pck_live_...
Content-Type: application/json

{
  "url": "https://firm-server.local:8443/polycloud-webhook",
  "events": ["notification:approved", "notification:dismissed", "tenant:updated", "review:partner-signed"],
  "secret": "wh_<32-char-token>",
  "active": true
}
```

Portal POSTs to the URL with HMAC-SHA256 signature over the raw body in `X-PolyCloud-Signature: t=<unix>,v1=<hex>`. App verifies with the shared secret. Standard at-least-once delivery + 5-attempt exponential backoff (1s, 5s, 30s, 2m, 10m). After 5 failures the webhook is auto-disabled with a `kind: alert` row in `/portal/inbox`.

### 3f · Polling fallback — for apps behind firewalls (planned)

Originally specced for the CLI version of the CA Firm Toolkit (firm laptop, no public IP). After the toolkit's pivot to webapp on 2026-04-26, webhooks work fine for it. The polling endpoint is still useful for **truly local-only consumers** like the Realty platform's local agent on a builder's laptop.

```http
GET /api/v1/notifications?since=<iso-ts>&kind=approval-needed&limit=100
X-PolyCloud-Key: pck_live_...
X-PolyCloud-Tenant: <tenant-slug>
```

Returns ordered notifications since the timestamp. App stores the last-seen `ts` and polls every 30-60s.

---

## 4 · Per-app integration plans

### 4a · CA Firm Toolkit (`polycloudin/ca-firm-toolkit`)

**Today:** Webapp at `ca-firm-toolkit.vercel.app` · proxied through `polycloud.in/ca-firm/app/*` via Next.js multi-zone rewrite (this repo's `next.config.ts`). Both repos and Vercel projects independent. Same-origin SSO works because the rewrite preserves the `polycloud.in` origin — `polycloud_session` cookie reaches the toolkit transparently.

The pivot from CLI → webapp happened 2026-04-26. The CLI scaffolds (Python tools/, audit.jsonl) still exist in the repo but are no longer the primary surface.

**Architecture:**

```
Customer browser sees:                    Actually served by:
polycloud.in/                          →  polycloud-web (this repo)
polycloud.in/ca-firm/app/inbox         →  ca-firm-toolkit (separate Vercel project)
polycloud.in/ca-firm/app/api/recon-run →  ca-firm-toolkit (Python serverless)
ca-firm-toolkit.vercel.app/*           →  ca-firm-toolkit (still works, old URLs redirect)
```

The toolkit's `next.config.js` reads `NEXT_PUBLIC_BASE_PATH=/ca-firm/app` in production so its routes resolve under that prefix; preview deploys leave the var unset so they work standalone.

**To wire portal events (when `/api/v1/events` ships):**

1. **Operator generates an API key** for the firm via `/portal/keys` (when shipped):
   - Tenant: `<firm-slug>` (e.g. `pkb-associates`, `polycloud-llp`)
   - Scopes: `events:write`, `notifications:write`
2. **Set `POLYCLOUD_KEY` + `POLYCLOUD_TENANT`** as Vercel env vars on the `ca-firm-toolkit` project
3. **Add a `pushEvent()` helper in TypeScript** (the toolkit is Node now, not Python):
   ```typescript
   // dashboard/frontend/lib/portal.ts
   export async function pushEvent(kind: string, payload: Record<string, unknown>) {
     const key = process.env.POLYCLOUD_KEY;
     const tenant = process.env.POLYCLOUD_TENANT;
     if (!key || !tenant) return;  // local-only mode is fine
     try {
       await fetch("https://polycloud.in/api/v1/events", {
         method: "POST",
         headers: {
           "X-PolyCloud-Key": key,
           "X-PolyCloud-Tenant": tenant,
           "Idempotency-Key": crypto.randomUUID(),
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ kind, payload }),
       });
     } catch {
       // never block the user
     }
   }
   ```
4. **Call from each Route Handler** at completion:
   - `/api/recon/run/route.ts` → `pushEvent("recon-run", { ... })` after engine returns
   - `/api/approvals/[id]/sign/route.ts` → `pushEvent("udin-issued", { ... })`
   - `/api/approvals/[id]/reject/route.ts` → `pushEvent("review-rejected", { ... })`
5. **For owner-approval items** (ITC at risk > ₹10K, low-confidence OCR), POST to `/api/v1/notifications` with `kind: "approval-needed"`.
6. **For inbound webhooks** (operator approves a UDIN-eligible item from the portal), the toolkit accepts `POST /ca-firm/app/api/portal-webhook` with HMAC validation. Polling fallback (§3f) is **not needed** — the toolkit has a public HTTPS endpoint.

**Data sovereignty:** since the pivot to webapp, all data flows through Vercel serverless functions. The "nothing leaves the firm" framing from v0.1 of this brief no longer applies — the recon engine runs on Vercel Python, GSTR-2B JSON and Tally CSVs are uploaded to it. Marketing copy on `/solutions/ca-firm` has been updated accordingly.

### 4b · Labs / Nexus

**Today:** Standalone Next.js app. The polycloud-web repo only has the Labs marketing pages + `/labs/dashboard` (which currently isn't auth-gated for Labs subscribers — that just landed in PR #99).

**To wire up:**

1. **Generate a Labs-tier API key** per analyst tenant
2. **From the Decision Composer (A3) in Nexus**: push memo-completion events:
   ```http
   POST /api/v1/events
   X-PolyCloud-Key: pck_live_...
   X-PolyCloud-Tenant: pharma-fund-x
   Idempotency-Key: <uuid>
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
3. **Per-company drill-down** at `/labs/dashboard/company/[slug]` should be a thin renderer over `GET /api/v1/labs/company/<slug>` (planned) which composes Nexus tables.
4. **Cross-link the dossier (A4)** generation events the same way — surfaces in the Labs subscriber's portal feed.

**Decision (per Labs adversarial review · 23 Apr):** position as "Decision Composer + 10 alt-data feeds" in all UI strings. NOT "11 scrapers". The portal already follows this naming on the `/portal#labs` section.

### 4c · Realty Platform (`polycloudin/realty-platform`)

**Today:** FastAPI + SQLite-per-builder + HTML dashboard at `localhost:8787` (PR #1 open · `feat/phase-0-intel-wedge`). Fully local.

**To wire up:**

1. **Local agent provisions itself** by hitting (planned) `POST /api/v1/realty/builders` with the operator's setup token (Aasrith's onboarding flow). Returns `builder_slug` + `POLYCLOUD_KEY`.
2. **Local agent runs scheduled scrapes** (Dharani / 99acres / SRO) entirely on the builder's machine. Raw data NEVER leaves.
3. **`cohort/anonymizer.py` (already merged)** strips PII + IDs, gates on `≥5 contributors`, then pushes to `POST /api/v1/realty/cohort/push`:
   ```json
   {
     "module": "land-intel",
     "metric_key": "median_price_per_sqyd_madhapur_2BHK_2024Q4",
     "cohort_value": 38500,
     "n_contributors": 7,
     "ts_window": "2024-Q4"
   }
   ```
4. **Builder usage telemetry** → `POST /api/v1/usage` (anonymized) so the operator sees per-builder engagement on `/admin/realty` (planned) without seeing builder identity in the cohort feed.

**Hard rule:** the portal NEVER accepts raw scrape output from Realty. If the request body matches the shape of a Dharani plot list or a 99acres listing, drop it on the floor and 422. Enforced via input schema validation on `/api/v1/realty/cohort/push`.

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

### 5b · Tenant slug schema + lifecycle

**Slug regex:** `^[a-z][a-z0-9-]{2,40}$` — lowercase, alphanumeric + hyphens, 3-41 chars, must start with a letter.

Examples: `acme-imports`, `sharma-co-llp`, `polycloud-llp`, `kumar-textiles`, `pkb-associates`.

**Lifecycle:**
1. `POST /api/onboard` creates a `tenant_pending` row with auto-generated slug suggestion + name. Status = `PENDING_APPROVAL`.
2. Operator reviews on `/portal/onboard-queue` (planned), edits slug if needed, approves → status = `ACTIVE`.
3. On approval, portal auto-issues the first `pck_live_*` key + provisions tenant config row.
4. `DELETE /api/v1/tenant/<slug>` is **soft delete** — sets `deleted_at`, revokes all API keys, retains 90-day audit history. Hard purge requires manual operator action via `/portal/audit/purge`.

**Reserved slugs** (operator-only assignment): `polycloud`, `polycloud-llp`, `internal`, `admin`, `api`, `portal`, `dashboard`, `health`, `docs`.

---

## 6 · What gets built next (in order)

The portal session priorities, ranked by what unblocks the most:

1. **API keys** — `app/lib/api-keys.ts` + `/api/v1/keys` issue endpoint + `/portal/keys` UI. ~1 day.
2. **libsql migration for `users`** (currently TS array) — RBAC across tenants needs joins; migrate before second real firm onboards. ~1 day. *Bumped from #7; doing it earlier saves a painful re-migration once events start flowing.*
3. **`GET /api/health`** — basic liveness for app pre-flight checks. ~1 hour.
4. **`POST /api/v1/events`** with idempotency keys + per-tenant rate limiting — accept events, write to libsql, emit to in-memory feed for SSE. ~1.5 days (added idempotency dedup table + rate-limit middleware).
5. **`POST /api/v1/notifications`** + `/portal/inbox` UI — write to libsql `notifications` table. ~0.5 day.
6. **`GET /api/v1/notifications`** polling endpoint — for CA toolkit / Realty agents behind firewalls. ~2 hours.
7. **Outbound webhooks** — `PUT /api/v1/tenant/<slug>/webhook` + delivery worker with HMAC signing + retry. ~1 day.
8. **`GET /api/v1/tenant/<slug>`** — read from existing `CLIENT_REGISTRY` + libsql overrides. ~2 hours.
9. **Provision `polycloud-llp` as tenant 001 + dogfood the CA toolkit on it** — wire PolyCloud LLP's own TAN HYDP15059C (the one that just got the TDS notice) through the toolkit, push events to portal, validate the entire integration end-to-end on our own books before any external firm. ~0.5 day.
10. **`POST /api/v1/usage`** — Realty cohort feed with the ≥5-contributors gate. ~1 day.
11. **Realty-specific:** `POST /api/v1/realty/cohort/push` + `POST /api/v1/realty/builders` provisioning. ~1 day.

Total: ~7-8 days of focused work to unlock all three integrations on a foundation that won't break later.

Why the bumps:
- **libsql users migration earlier** — TS array doesn't support cross-tenant joins; breaks at second firm onboard.
- **Health endpoint up front** — every app should pre-flight before batched writes; trivial to ship.
- **Polling fallback** — CA toolkit on a partner's laptop has no public IP; webhooks won't work for them.
- **Dogfood PolyCloud LLP first** — every integration bug surfaces on our own book before a paying firm sees it.

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

Health check (after `/api/health` ships — pre-flight before batched writes):

```bash
curl https://www.polycloud.in/api/health
# → {"ok":true,"ts":"2026-04-24T...","db":"ok","version":"v0.2"}
```

Once `/api/v1/events` ships — push an event with idempotency key + observe rate-limit headers:

```bash
curl -i -X POST https://www.polycloud.in/api/v1/events \
  -H "X-PolyCloud-Key: pck_live_..." \
  -H "X-PolyCloud-Tenant: polycloud-llp" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "recon-run",
    "payload": {
      "ts": "2026-04-24T05:00:00Z",
      "actor": "ca-firm-toolkit@polycloud-llp",
      "summary": "Demo recon — 16 invoices · 81.2% match · ₹2,685 ITC at risk",
      "signal": "16 in 2B, 16 in books",
      "action": "Matched 13 · flagged 2 · only-in-books 1 · only-in-2B 1",
      "outcome": "5-sheet Excel ready",
      "tags": ["gstr-2b","tally","demo"]
    }
  }'

# Response headers include:
#   RateLimit-Limit: 60
#   RateLimit-Remaining: 59
#   RateLimit-Reset: 60
# Replaying the same Idempotency-Key returns the original 201 + same evt_id (no duplicate write).
```

Polling for partner approvals (CA toolkit pattern):

```bash
curl "https://www.polycloud.in/api/v1/notifications?since=2026-04-24T00:00:00Z&kind=approval-decided" \
  -H "X-PolyCloud-Key: pck_live_..." \
  -H "X-PolyCloud-Tenant: pkb-associates"
# → {"items":[...], "next_since":"2026-04-24T05:23:00Z"}
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
