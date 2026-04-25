import { defineConfig } from "vitest/config";

/**
 * Minimal Vitest setup for lib-level tests (events, notifications).
 * Node env (no jsdom needed). Only picks up __tests__ folders so we don't
 * accidentally compile JSX-heavy files.
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
});
