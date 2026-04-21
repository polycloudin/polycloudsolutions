# Onboarding a new client dashboard

The `/client/[slug]` route is fully data-driven. To add a new client:

## 1. Copy the template (2 min)

```bash
cp app/client/data/_template.ts app/client/data/<slug>.ts
```

Edit `<slug>.ts`:
- Replace the `_template` export name + import alias with a descriptive camelCase name (e.g. `kumarTextiles`)
- Fill in `meta` (slug, display name, city, bundle, dates)
- Set `auth` — `"public"` for sharable demos, `"private"` for internal / paying-client data

Pick which tabs to enable by keeping or deleting the optional sections. Every tab you delete is one fewer thing to maintain.

## 2. Register it (30 sec)

Add two lines to `app/client/data/registry.ts`:

```ts
import { myNewClient } from "./<slug>";

export const CLIENT_REGISTRY: Record<string, ClientData> = {
  [kumarTextiles.meta.slug]: kumarTextiles,
  [polycloud.meta.slug]: polycloud,
  [myNewClient.meta.slug]: myNewClient,   // ← new line
};
```

## 3. Gate it if private (10 sec)

If `auth: "private"`, add the slug to `PRIVATE_CLIENT_SLUGS` in `/proxy.ts` (project root):

```ts
const PRIVATE_CLIENT_SLUGS = new Set<string>(["polycloud", "<slug>"]);
```

Private routes require HTTP Basic auth via `PRIVATE_DASH_USER` + `PRIVATE_DASH_PASS` env vars (already set in Vercel).

## 4. Wire live data (optional, 5 min)

In the client's `<slug>.ts`, add a `liveFeeds` block:

```ts
liveFeeds: {
  ga4: { propertyId: "123456789" },                     // client's GA4 numeric id
  vercelAnalytics: {                                     // their Vercel project
    projectId: "prj_XXX",
    teamId: "team_XXX",
    siteUrl: "client.com",
  },
},
```

### GA4 setup per client
1. Go to GA → Admin → Property Access Management
2. Add our shared service-account email (see Vercel env `GA4_SERVICE_ACCOUNT_KEY`) as **Reader**
3. Paste the property ID into `<slug>.ts`

### Vercel setup per client
If their Vercel project is in **our** team, no new creds needed — the shared `VERCEL_ACCESS_TOKEN` works.
If their Vercel project is in **their** team:
- Add us as a team member with Viewer role, OR
- Generate a project-scoped read token and store per-client (future work — not yet supported)

## 5. Ship

```bash
git add app/client/data/<slug>.ts app/client/data/registry.ts proxy.ts
git commit -m "Add <slug> dashboard"
git push
```

Vercel auto-deploys. Client visits `/client/<slug>`. Done.

---

## What the customer sees vs. what you edit

| Customer sees            | You edit                                         |
|--------------------------|--------------------------------------------------|
| Tab list                 | Presence/absence of optional sections in `<slug>.ts` |
| KPI numbers              | Either hardcoded values, or live-overlay from GA4/Vercel |
| Campaign rows            | `ads.campaigns` array                            |
| SEO keyword ranks        | `organic.seoKeywords` array (manual for now)     |
| Review cards             | `reviews.stream` array (manual for now)          |
| Outreach drafts          | `outreach.drafts` array — pulls from your `marketing/content/` files |
| Leads list               | `leads.leads` array                              |
| "Autopilot activity" log | `overview.autopilotActivity` array               |
| "This week's focus"      | `overview.weeklyFocus` array                     |
| Live status pill (top)   | Auto — reflects whether `/api/live/<slug>` returned overlay |

Everything else is auto — tab routing, charts, layout, auth gate.

## Why this shape

- **One file per client** = trivial diffs, clean git history, easy to audit
- **Types enforced** = can't ship a broken KPI or a misspelled status
- **Live overlay is optional** = start with hardcoded numbers day 1, wire live feeds later
- **Private slugs isolated in proxy.ts** = auth list is the source of truth, not scattered across components

## Anti-patterns

- ❌ Don't put client data in the component files (breaks the contract)
- ❌ Don't hardcode auth checks in page.tsx (use proxy.ts)
- ❌ Don't duplicate KPIs across sections — use overview for summary, drill into specific tabs for detail
- ❌ Don't invent new `tone` values — stick to the `Tone` union in types.ts (breaks the Pill renderer otherwise)
