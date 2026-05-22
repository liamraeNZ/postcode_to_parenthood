import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["app/components/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup-dom.ts"],
  },
});
