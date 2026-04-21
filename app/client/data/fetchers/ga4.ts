import type { KPI, SiteTraffic } from "../types";

/**
 * Google Analytics 4 Data API fetcher — reusable across clients.
 *
 * Called per-client with a propertyId from data/<slug>.ts.liveFeeds.ga4.
 * Uses one shared service account (env var) with Reader role on each
 * client's property. To onboard a new client: add their property ID to
 * their config + add the service-account email to their GA Reader list.
 *
 * Shared env var (one per PolyCloud, not per-client):
 *   GA4_SERVICE_ACCOUNT_KEY   — full service-account JSON, minified
 */

interface Ga4Section {
  overviewKpis?: KPI[];
  siteTraffic?: SiteTraffic;
}

export async function fetchGa4(propertyId: string): Promise<Ga4Section | null> {
  const saKey = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!propertyId || !saKey) return null;

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(saKey);
  } catch {
    console.error("GA4: GA4_SERVICE_ACCOUNT_KEY is not valid JSON");
    return null;
  }

  const token = await getAccessToken(credentials);
  if (!token) return null;

  const body = {
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
    ],
    dimensions: [],
  };

  try {
    const resp = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        // Edge runtime: needs explicit cache setting
        cache: "no-store",
      }
    );
    if (!resp.ok) {
      console.error("GA4 runReport failed", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json();
    const row = data.rows?.[0]?.metricValues ?? [];
    const [sessions, users, pageviews, avgDuration] = row.map((m: { value: string }) => m.value);

    const overviewKpis: KPI[] = [
      { label: "polycloud.in sessions (7d)", value: sessions ?? "—", tone: "ink" },
      { label: "Active users (7d)", value: users ?? "—", tone: "ink" },
      { label: "Pageviews (7d)", value: pageviews ?? "—", tone: "ink" },
      {
        label: "Avg session duration",
        value: avgDuration ? `${Math.round(Number(avgDuration))}s` : "—",
        tone: "ink",
      },
    ];

    // Also fetch top pages separately
    const topPages = await fetchTopPages(token, propertyId);
    const topReferrers = await fetchTopReferrers(token, propertyId);

    return {
      overviewKpis,
      siteTraffic: {
        visits7d: sessions ? Number(sessions) : null,
        topPages: topPages || [],
        topReferrers: topReferrers || [],
      },
    };
  } catch (err) {
    console.error("GA4 fetch error:", err);
    return null;
  }
}

async function fetchTopPages(token: string, propertyId: string) {
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
      cache: "no-store",
    }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return (data.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
    path: r.dimensionValues[0]?.value ?? "/",
    pageviews: Number(r.metricValues[0]?.value ?? 0),
  }));
}

async function fetchTopReferrers(token: string, propertyId: string) {
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 5,
      }),
      cache: "no-store",
    }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return (data.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
    source: r.dimensionValues[0]?.value ?? "direct",
    visits: Number(r.metricValues[0]?.value ?? 0),
  }));
}

// Sign a JWT with the service account private key, exchange for an access token.
async function getAccessToken(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string | null> {
  // Edge runtime supports Web Crypto but not Node's crypto.
  // This lives in a Route Handler (Node runtime) so we can use the `jose` package.
  // Install separately: npm install jose
  try {
    const { SignJWT, importPKCS8 } = await import("jose");
    const now = Math.floor(Date.now() / 1000);
    const alg = "RS256";
    const privateKey = await importPKCS8(credentials.private_key, alg);
    const jwt = await new SignJWT({
      scope: "https://www.googleapis.com/auth/analytics.readonly",
    })
      .setProtectedHeader({ alg, typ: "JWT" })
      .setIssuedAt(now)
      .setIssuer(credentials.client_email)
      .setAudience("https://oauth2.googleapis.com/token")
      .setExpirationTime(now + 3600)
      .sign(privateKey);

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    if (!tokenResp.ok) {
      console.error("GA4 token exchange failed", tokenResp.status, await tokenResp.text());
      return null;
    }
    const { access_token } = (await tokenResp.json()) as { access_token: string };
    return access_token;
  } catch (err) {
    console.error("GA4 getAccessToken:", err);
    return null;
  }
}
