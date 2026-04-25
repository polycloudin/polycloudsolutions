/**
 * Tiny Node ESM resolver for `node --test --experimental-strip-types`.
 *
 * Adds `.ts` extensions to extensionless relative imports so test files
 * can `import { foo } from "../api-keys"` without writing `.ts`.
 * Runs before Node's default resolver — only intercepts when the
 * default would 404, and only for `./` or `../` specifiers.
 *
 * Used via:
 *   node --experimental-strip-types --import ./scripts/test-loader.mjs --test ...
 */
import { register } from "node:module";

register(
  // Inline data URL — no second file needed.
  "data:text/javascript," +
    encodeURIComponent(`
      import { existsSync } from "node:fs";
      import { fileURLToPath, pathToFileURL } from "node:url";
      import path from "node:path";
      export async function resolve(specifier, context, nextResolve) {
        if (specifier.startsWith("./") || specifier.startsWith("../")) {
          if (!/\\.[a-zA-Z]+$/.test(specifier)) {
            try {
              const parentDir = path.dirname(fileURLToPath(context.parentURL));
              const candidate = path.resolve(parentDir, specifier + ".ts");
              if (existsSync(candidate)) {
                return { url: pathToFileURL(candidate).href, format: "module-typescript", shortCircuit: true };
              }
              const idx = path.resolve(parentDir, specifier, "index.ts");
              if (existsSync(idx)) {
                return { url: pathToFileURL(idx).href, format: "module-typescript", shortCircuit: true };
              }
            } catch {}
          }
        }
        return nextResolve(specifier, context);
      }
    `),
  import.meta.url,
);
