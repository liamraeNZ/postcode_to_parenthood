import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";
import * as fc from "fast-check";

/**
 * Feature: seo-optimized-pages, Property 7: API routes return JSON without HTML
 *
 * For any request to a path starting with /api/, the response Content-Type
 * should be application/json and the response body should not contain an HTML
 * document structure (no <!DOCTYPE or <html> tags).
 *
 * Validates: Requirements 1.4, 6.8
 */
describe("Property 7: API Routes Return JSON Without HTML", () => {
  // Generate random API path segments (alphanumeric + hyphens)
  const pathSegmentArb = fc
    .array(
      fc.constantFrom(
        ...("abcdefghijklmnopqrstuvwxyz0123456789-".split(""))
      ),
      { minLength: 1, maxLength: 20 }
    )
    .map((chars) => chars.join(""))
    .filter((seg) => seg.length > 0 && !seg.startsWith("-") && !seg.endsWith("-"));

  // Generate random /api/* paths with 1-3 segments
  const apiPathArb = fc
    .array(pathSegmentArb, { minLength: 1, maxLength: 3 })
    .map((segments) => `/api/${segments.join("/")}`);

  // Also include known API routes to ensure they return JSON
  const knownApiPaths = [
    "/api/icbs",
    "/api/admin/icbs",
    "/api/gp-practices",
    "/api/gp-icb",
    "/api/icb-policy",
    "/api/icb-documents",
    "/api/map-data",
    "/api/client-log",
  ];

  const allApiPathsArb = fc.oneof(
    apiPathArb,
    fc.constantFrom(...knownApiPaths)
  );

  it("all /api/* requests return application/json content-type", () => {
    fc.assert(
      fc.asyncProperty(allApiPathsArb, async (path) => {
        const response = await SELF.fetch(`https://test.local${path}`);

        const contentType = response.headers.get("content-type") || "";
        expect(
          contentType.startsWith("application/json"),
          `Expected application/json for ${path}, got: ${contentType}`
        ).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("all /api/* responses do not contain HTML document structure", () => {
    fc.assert(
      fc.asyncProperty(allApiPathsArb, async (path) => {
        const response = await SELF.fetch(`https://test.local${path}`);

        const body = await response.text();
        expect(
          body.includes("<!DOCTYPE"),
          `Response for ${path} should not contain <!DOCTYPE`
        ).toBe(false);
        expect(
          body.toLowerCase().includes("<html"),
          `Response for ${path} should not contain <html>`
        ).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it("/api/* responses are valid JSON", () => {
    fc.assert(
      fc.asyncProperty(allApiPathsArb, async (path) => {
        const response = await SELF.fetch(`https://test.local${path}`);

        const body = await response.text();
        // Should parse as valid JSON without throwing
        expect(() => JSON.parse(body)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});
