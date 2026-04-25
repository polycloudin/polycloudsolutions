import { safeDb } from "./db/schema";

/**
 * Per-tenant configuration the API surface needs to know about: which
 * Digital bundle they're on, which modules are enabled, GA4 / Vercel
 * project IDs, WhatsApp provider, monthly retainer.
 *
 * Two-tier resolution:
 *
 *   1. CLIENT_REGISTRY in this file — source of truth, in-code, edited
 *      via PR. Covers every tenant we know exists.
 *   2. libsql `tenants` table — per-row JSON override for fields that
 *      change at runtime (e.g. operator flips a module on, retainer
 *      bumps mid-month). Override is shallow-merged on top of the
 *      registry entry.
 *
 * Returns null for unknown slugs — never auto-creates. Adding a new
 * tenant goes via PR so the caps registry, sales surface, and billing
 * all line up.
 */

export type TenantBundle =
  | "internal"
  | "local-starter"
  | "growth"
  | "total-growth";

export type WhatsAppProvider = "interakt.ai" | "msg91";

export interface TenantConfig {
  slug: string;
  name: string;
  bundle: TenantBundle;
  /** Whitelist of modules the tenant has paid for / opted into. */
  modules_enabled: string[];
  ga4_property_id?: string;
  vercel_project_id?: string;
  wa_provider?: WhatsAppProvider;
  retainer_monthly?: number;
}

/**
 * In-code source of truth. Add a new tenant here, then PR.
 *
 * Slug rule: kebab-case, matches the /client/<slug> path + the /api/auth
 * `ten` claim used by proxy.ts.
 */
export const CLIENT_REGISTRY: Record<string, TenantConfig> = {
  "kumar-textiles": {
    slug: "kumar-textiles",
    name: "Kumar Textiles",
    bundle: "growth",
    modules_enabled: ["ads", "social", "whatsapp", "reviews", "outreach"],
    ga4_property_id: "533972528",
    vercel_project_id: "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
    wa_provider: "interakt.ai",
    retainer_monthly: 32000,
  },
  polycloud: {
    slug: "polycloud",
    name: "PolyCloud Solutions LLP",
    bundle: "internal",
    modules_enabled: [
      "ads",
      "social",
      "whatsapp",
      "reviews",
      "outreach",
      "ca-firm",
      "labs",
    ],
    ga4_property_id: "533972528",
    vercel_project_id: "prj_o9xnq4hIB1xOByHQHyUqizDbXa6z",
    retainer_monthly: 0,
  },
  "pkb-associates": {
    slug: "pkb-associates",
    name: "PKB Associates",
    bundle: "local-starter",
    modules_enabled: ["ca-firm", "outreach"],
    retainer_monthly: 0, // pilot
  },
  "pharma-fund-x": {
    slug: "pharma-fund-x",
    name: "Pharma Fund X (Labs anchor)",
    bundle: "internal",
    modules_enabled: ["labs"],
    retainer_monthly: 0, // founding subscriber
  },
  viratkota: {
    slug: "viratkota",
    name: "Virat Kota — personal brand",
    bundle: "internal",
    modules_enabled: ["social", "outreach"],
    retainer_monthly: 0,
  },
};

/**
 * Resolve a tenant config: registry → libsql override → null.
 *
 * Override shape stored in tenants.config_json: a partial TenantConfig
 * (any subset of fields). Slug always comes from the row's primary key,
 * not the JSON, so the JSON never lies about identity.
 */
export async function getTenantConfig(slug: string): Promise<TenantConfig | null> {
  if (!slug) return null;
  const base = CLIENT_REGISTRY[slug] ?? null;
  const override = await getTenantOverride(slug);
  if (!base && !override) return null;
  if (!override) return base;

  // Override case — shallow merge on top of base (or use override-as-full
  // when registry has no entry for this slug, treating libsql as authoritative).
  if (!base) {
    if (!isCompleteConfig(override, slug)) return null;
    return { ...override, slug };
  }
  return { ...base, ...override, slug };
}

/** List every known tenant (registry + libsql), de-duped by slug. */
export async function listTenants(): Promise<TenantConfig[]> {
  const seen = new Map<string, TenantConfig>();
  for (const cfg of Object.values(CLIENT_REGISTRY)) {
    seen.set(cfg.slug, cfg);
  }
  const overrides = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `SELECT slug, config_json FROM tenants`,
      args: [],
    });
    return r.rows;
  });
  if (overrides) {
    for (const row of overrides) {
      const slug = String(row.slug);
      const partial = parseConfigJson(row.config_json);
      if (!partial) continue;
      const base = seen.get(slug);
      if (base) {
        seen.set(slug, { ...base, ...partial, slug });
      } else if (isCompleteConfig(partial, slug)) {
        seen.set(slug, { ...partial, slug });
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Persist (insert or update) an override for a tenant. Returns true on
 * success, false if DB is unconfigured. Operator-only — gated upstream.
 */
export async function upsertTenantOverride(
  slug: string,
  partial: Partial<TenantConfig>,
): Promise<boolean> {
  if (!slug) return false;
  const ok = await safeDb(async (db) => {
    await db.execute({
      sql: `INSERT INTO tenants (slug, config_json)
            VALUES (?, ?)
            ON CONFLICT(slug) DO UPDATE SET
              config_json = excluded.config_json,
              updated_at = datetime('now')`,
      args: [slug, JSON.stringify(partial)],
    });
    return true;
  });
  return ok ?? false;
}

// ----------------------------------------------------------------
// Internals
// ----------------------------------------------------------------

async function getTenantOverride(slug: string): Promise<Partial<TenantConfig> | null> {
  const raw = await safeDb(async (db) => {
    const r = await db.execute({
      sql: `SELECT config_json FROM tenants WHERE slug = ? LIMIT 1`,
      args: [slug],
    });
    return r.rows[0]?.config_json ?? null;
  });
  if (raw === null || raw === undefined) return null;
  return parseConfigJson(raw);
}

function parseConfigJson(raw: unknown): Partial<TenantConfig> | null {
  try {
    const obj = JSON.parse(String(raw));
    if (!obj || typeof obj !== "object") return null;
    return obj as Partial<TenantConfig>;
  } catch {
    return null;
  }
}

function isCompleteConfig(
  partial: Partial<TenantConfig>,
  slug: string,
): partial is TenantConfig {
  return (
    typeof partial.name === "string" &&
    !!partial.name &&
    typeof partial.bundle === "string" &&
    Array.isArray(partial.modules_enabled) &&
    typeof slug === "string" &&
    !!slug
  );
}
