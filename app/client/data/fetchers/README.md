# Live data fetchers

Server-side modules that pull real metrics into `ClientData` at request time.
Each fetcher is **env-var gated** — absence of credentials returns null and
the dashboard falls back to the hardcoded values in `data/<slug>.ts`.

## Why not write directly to TS files?

We considered a cron that rewrites `polycloud.ts` nightly. Rejected because:
1. Every data refresh = a git commit and deploy (noise + quota burn)
2. No fresh data between syncs
3. Loses the type-safe hardcode as baseline

Runtime fetch + hardcoded fallback gives us freshness + resilience.

## Implemented fetchers

### `ga4.ts` — Google Analytics 4 Data API
Live site traffic, top pages, top referrers, session counts.

**Env vars required:**
- `GA4_PROPERTY_ID` — numeric property ID (find in GA → Admin → Property Settings)
- `GA4_SERVICE_ACCOUNT_KEY` — JSON-encoded service account key with GA Reader role

**Setup:** GCP Console → Create service account → Download JSON key → Paste into env var → In GA → Admin → Property Access Management → Add service account's email with Reader role.

### `vercel-analytics.ts` — Vercel Web Analytics
Page view counts, device breakdown, geography.

**Env vars required:**
- `VERCEL_ACCESS_TOKEN` — Personal access token from vercel.com/account/tokens
- `VERCEL_PROJECT_ID` — `prj_o9xnq4hIB1xOByHQHyUqizDbXa6z` (from `.vercel/project.json`)
- `VERCEL_TEAM_ID` — `team_IOg3Xvssr5P5GKJ1fuLazWfO`

### `formsubmit.ts` — Formsubmit email webhook
Incoming form submissions to polycloud.in/api/book.

Formsubmit doesn't expose a REST API. Instead we point Formsubmit's "webhook"
field at `polycloud.in/api/formsubmit-hook` and tally submissions in a
Supabase/KV table. **Not yet implemented.**

## How fetchers get called

See `app/api/live/[slug]/route.ts` — a server route that:
1. Reads base `ClientData` from `registry.ts`
2. For each section, attempts to merge in live fetcher results
3. Returns the merged object

The dashboard page then uses this API instead of reading the registry directly.

## Adding a new fetcher

1. Create `app/client/data/fetchers/<name>.ts` exporting `fetchX(): Promise<Partial<ClientData> | null>`
2. Add env-var check at top; return null early if not configured
3. Register in `app/api/live/[slug]/route.ts`
4. Document env vars in this README

## Not yet connected

These need VK's hands:
- [ ] GA4 service account — needs GCP project + downloaded JSON key
- [ ] Vercel access token — paste into env
- [ ] Formsubmit webhook — requires Supabase/KV setup first
- [ ] X API — paid tier ($100/mo) or browser-harness scraper
- [ ] LinkedIn API — Marketing Platform approval (2-4 weeks)

Until then, `polycloud.ts` shows the hardcoded starter data.
