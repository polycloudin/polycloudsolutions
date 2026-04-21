import type { ClientData } from "./types";
import { kumarTextiles } from "./kumar-textiles";
import { polycloud } from "./polycloud";

/**
 * Single registry of every client dashboard.
 * To add a new client: create a data/<slug>.ts file and register it here.
 */
export const CLIENT_REGISTRY: Record<string, ClientData> = {
  [kumarTextiles.meta.slug]: kumarTextiles,
  [polycloud.meta.slug]: polycloud,
};

export function getClient(slug: string): ClientData | null {
  return CLIENT_REGISTRY[slug] ?? null;
}

export function listPublicSlugs(): string[] {
  return Object.values(CLIENT_REGISTRY)
    .filter((c) => c.auth === "public")
    .map((c) => c.meta.slug);
}

export function listPrivateSlugs(): string[] {
  return Object.values(CLIENT_REGISTRY)
    .filter((c) => c.auth === "private")
    .map((c) => c.meta.slug);
}
