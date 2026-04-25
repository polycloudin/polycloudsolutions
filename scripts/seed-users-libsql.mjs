#!/usr/bin/env node
/**
 * Seed the libsql `users` table from the in-code USERS array.
 *
 * Idempotent. Skips entries with placeholder hashes. Usage:
 *
 *   TURSO_DATABASE_URL=libsql://… TURSO_AUTH_TOKEN=… \
 *     node scripts/seed-users-libsql.mjs
 *
 * Output: per-user "inserted" / "exists" / "skipped (placeholder)" status.
 */
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("Set TURSO_DATABASE_URL (and optionally TURSO_AUTH_TOKEN).");
  process.exit(1);
}

// Avoid importing the TS module — read the array data directly via a
// TypeScript-aware loader. Simpler: use Node 22's native TS stripping.
async function loadUsers() {
  // Use dynamic import with --experimental-strip-types (Node 22+).
  // Fall back to manual fetch from the file if the import fails.
  try {
    const mod = await import("../app/lib/users.ts");
    return mod.USERS;
  } catch (e) {
    console.error(
      "Could not import app/lib/users.ts — run with Node 22+ and " +
        "--experimental-strip-types, or mirror the seed list inline.",
    );
    throw e;
  }
}

async function main() {
  const db = createClient({ url, authToken });

  // Make sure the table exists. Mirror the schema in app/lib/db/schema.ts.
  await db.execute(`CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL,
    caps_json TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  const USERS = await loadUsers();
  let inserted = 0;
  let existed = 0;
  let skipped = 0;

  for (const u of USERS) {
    if (u.salt === "REPLACE_ME" || u.hash === "REPLACE_ME") {
      console.log(`skipped (placeholder): ${u.email}`);
      skipped++;
      continue;
    }
    const existing = await db.execute({
      sql: `SELECT 1 FROM users WHERE lower(email) = ? LIMIT 1`,
      args: [u.email.toLowerCase()],
    });
    if (existing.rows.length > 0) {
      console.log(`exists: ${u.email}`);
      existed++;
      continue;
    }
    await db.execute({
      sql: `INSERT INTO users (email, salt, hash, caps_json, notes)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        u.email.toLowerCase(),
        u.salt,
        u.hash,
        JSON.stringify(u.caps),
        u.notes ?? null,
      ],
    });
    console.log(`inserted: ${u.email}`);
    inserted++;
  }

  console.log("");
  console.log(`done · inserted=${inserted} existed=${existed} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
