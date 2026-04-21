# Activating live GA4 + Vercel feeds — last-mile setup

Everything below is a **one-time setup** per shared service account + Vercel token.
After this, every client you add with a `liveFeeds` block just works.

Status as of Apr 21, 2026:
- ✅ GCP project `polycloud-analytics` created, Analytics Data API enabled
- ✅ Service account `polycloud-dashboard-fetcher@polycloud-analytics.iam.gserviceaccount.com` created
- ✅ JSON key downloaded → `~/.secrets/polycloud-ga4-fetcher.json` (chmod 600)
- ⏳ **Pending:** Grant the service account Viewer access on GA4 property 533972528
- ⏳ **Pending:** Paste the key as `GA4_SERVICE_ACCOUNT_KEY` env var on Vercel
- ⏳ **Pending:** Create + paste a `VERCEL_ACCESS_TOKEN`

---

## Step 1 — Grant GA4 property access (2 min)

Google Analytics → Admin → Property access management → `+` (top right) → Add users

**Email:** `polycloud-dashboard-fetcher@polycloud-analytics.iam.gserviceaccount.com`
**Role:** Viewer
**Uncheck:** "Notify new users by email" (it's a service account, no inbox)

Click **Add** (top-right blue button).

Why manual: Angular Material's chip input doesn't reliably accept programmatic values — the chip shows in DOM but the form control's internal model stays empty, so the submit fails silently. Real keyboard works; synthesised keyboard doesn't.

## Step 2 — Paste the service-account key into Vercel (1 min)

1. `cat ~/.secrets/polycloud-ga4-fetcher.json | pbcopy`
2. Vercel → polycloud-web → Settings → Environment Variables
3. Add new var:
   - Name: `GA4_SERVICE_ACCOUNT_KEY`
   - Value: *(paste — it's the full JSON blob)*
   - Environments: Production, Preview, Development
4. Save

## Step 3 — Create + paste the Vercel access token (1 min)

1. Vercel → Settings (account) → Tokens → Create
   - Name: `polycloud-dashboard-fetcher`
   - Scope: Full account (or team `polycloudins-projects` if available)
   - Expiration: No expiration (or 1 year)
2. Copy the token
3. Back to polycloud-web → Settings → Environment Variables → add:
   - Name: `VERCEL_ACCESS_TOKEN`
   - Value: *(the token)*
   - Environments: Production, Preview, Development

## Step 4 — Trigger a deploy

Push any commit (or Vercel dashboard → Redeploy latest). On load:

```bash
curl -u "polycloud:$PRIVATE_DASH_PASS" https://www.polycloud.in/client/polycloud \
  | grep -o 'data-live-status="[^"]*"'
# expect: data-live-status="live"
```

Or just open `https://www.polycloud.in/client/polycloud` in a browser — the pill next to the client name will say **live** instead of **fallback**.

## Adding a new client afterwards

Per `ONBOARDING.md` step 4, each new client needs:
1. Their own GA4 property ID added to their `<slug>.ts`
2. The service account email added as Viewer on *their* GA4 property

No new secrets per client. One service account, many properties.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Pill shows `fallback` | env var not set, or deploy cached | Force redeploy |
| Pill shows `fetching` forever | `/api/live/<slug>` timing out | Check Vercel Functions logs |
| GA4 call returns 403 | SA not granted on that property | Redo Step 1 for this property |
| Vercel Analytics returns 401 | Token scope too narrow | Regenerate with broader scope |
