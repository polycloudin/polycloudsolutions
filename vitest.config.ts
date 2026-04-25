import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Minimal Vitest setup for lib-level tests (events, notifications, realty, usage).
 * Node env (no jsdom needed). Only picks up __tests__ folders so we don't
 * accidentally compile JSX-heavy files.
 *
 * Path alias `@/*` mirrors tsconfig.json so route handlers that import
 * `@/app/lib/usage` resolve correctly inside test runs.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/__tests__/**/*.test.ts"],
    // Keep tests isolated from real Turso — each test wires its own in-memory DB.
    env: {
      TURSO_DATABASE_URL: "",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
