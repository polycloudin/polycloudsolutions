#!/usr/bin/env node
/**
 * Generate a salt + SHA-256 password hash to paste into app/lib/users.ts.
 *
 * Usage:
 *   node scripts/hash-password.mjs <plaintext-password>
 *   node scripts/hash-password.mjs "my password with spaces"
 *
 * Output:
 *   salt: <hex>
 *   hash: <hex>
 *
 * Mirrors the same `salt + ":" + plain` SHA-256 scheme that
 * `verifyUser()` in app/lib/users.ts uses at login time.
 */
import { webcrypto } from "node:crypto";

const HEX = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function main() {
  const plain = process.argv.slice(2).join(" ");
  if (!plain) {
    console.error("Usage: node scripts/hash-password.mjs <password>");
    process.exit(1);
  }

  // 16-byte random salt → 32 hex chars
  const saltBytes = webcrypto.getRandomValues(new Uint8Array(16));
  const salt = HEX(saltBytes);

  const data = new TextEncoder().encode(salt + ":" + plain);
  const digest = await webcrypto.subtle.digest("SHA-256", data);
  const hash = HEX(digest);

  console.log(`salt: "${salt}",`);
  console.log(`hash: "${hash}",`);
  console.log("");
  console.log("Paste both lines into the user's entry in app/lib/users.ts.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
