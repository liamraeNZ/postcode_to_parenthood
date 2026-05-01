import path from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

/**
 * Read D1 migration files and return them in the format expected by
 * `applyD1Migrations()` from `cloudflare:test`.
 */
function readD1Migrations(migrationsPath: string) {
  const files = readdirSync(migrationsPath)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return files.map((file) => {
    const sql = readFileSync(path.join(migrationsPath, file), "utf-8");
    // Split on the --> statement-breakpoint marker used by this project
    const queries = sql
      .split(/-->\s*statement-breakpoint/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return { name: file, queries };
  });
}

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrationsPath = path.join(__dirname, "migrations");
      const migrations = readD1Migrations(migrationsPath);
      return {
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations },
        },
      };
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  test: {
    testTimeout: 30_000,
    setupFiles: ["./test/apply-migrations.ts"],
    exclude: [
      "node_modules/**",
      "app/components/map/TreatmentToggle.test.tsx",
    ],
  },
});
