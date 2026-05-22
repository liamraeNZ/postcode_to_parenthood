import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import * as fc from "fast-check";
import { loader as sitemapLoader } from "../app/routes/sitemap[.]xml";

/**
 * Feature: production-readiness, Property 6: Sitemap dates are deterministic
 *
 * Static page dates come from a Vite `define` compile-time constant
 * (`__SITE_LAST_UPDATED__`), not runtime `Date.now()`, ensuring consistent
 * output across requests within the same deployment.
 *
 * We verify:
 * 1. Multiple requests return identical <lastmod> values for static pages
 * 2. Static page dates match the __SITE_LAST_UPDATED__ constant (build date)
 * 3. Dates are in YYYY-MM-DD format
 * 4. Static page dates do NOT change between requests (deterministic)
 *
 * **Validates: Requirements 10.1, 10.3, 10.4**
 */
describe("Property 6: Sitemap dates are deterministic", () => {
  const YYYY_MM_DD_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  // Static pages that should use the compile-time constant
  const STATIC_PATHS = [
    "https://postcodetoparenthood.org.uk",
    "https://postcodetoparenthood.org.uk/map",
    "https://postcodetoparenthood.org.uk/search",
    "https://postcodetoparenthood.org.uk/boards",
    "https://postcodetoparenthood.org.uk/policies",
    "https://postcodetoparenthood.org.uk/privacy",
    "https://postcodetoparenthood.org.uk/terms",
  ];

  /** Create a mock context matching what React Router loaders expect */
  function createMockContext() {
    return {
      cloudflare: {
        env,
        ctx: { waitUntil: () => {}, passThroughOnException: () => {} } as any,
      },
    };
  }

  /**
   * Parse all <url> entries from the sitemap XML and return an array of
   * { loc, lastmod } objects.
   */
  function parseSitemapEntries(xml: string): Array<{ loc: string; lastmod: string }> {
    const entries: Array<{ loc: string; lastmod: string }> = [];
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
      if (locMatch && lastmodMatch) {
        entries.push({ loc: locMatch[1], lastmod: lastmodMatch[1] });
      }
    }
    return entries;
  }

  async function fetchSitemapXml(): Promise<string> {
    const response = await sitemapLoader({
      context: createMockContext(),
      request: new Request("https://test.local/sitemap.xml"),
      params: {},
    } as any);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/xml");
    return response.text();
  }

  it("static page lastmod dates are in YYYY-MM-DD format", async () => {
    const xml = await fetchSitemapXml();
    const entries = parseSitemapEntries(xml);

    for (const staticPath of STATIC_PATHS) {
      const entry = entries.find((e) => e.loc === staticPath);
      expect(entry, `Expected sitemap entry for ${staticPath}`).toBeDefined();
      expect(
        entry!.lastmod,
        `Static page ${staticPath} lastmod should be YYYY-MM-DD format`
      ).toMatch(YYYY_MM_DD_REGEX);
    }
  });

  it("static page lastmod dates match the __SITE_LAST_UPDATED__ compile-time constant", async () => {
    const xml = await fetchSitemapXml();
    const entries = parseSitemapEntries(xml);

    // The compile-time constant is injected by Vite's define option
    const expectedDate = __SITE_LAST_UPDATED__;
    expect(expectedDate).toMatch(YYYY_MM_DD_REGEX);

    for (const staticPath of STATIC_PATHS) {
      const entry = entries.find((e) => e.loc === staticPath);
      expect(entry, `Expected sitemap entry for ${staticPath}`).toBeDefined();
      expect(
        entry!.lastmod,
        `Static page ${staticPath} should use __SITE_LAST_UPDATED__ (${expectedDate})`
      ).toBe(expectedDate);
    }
  });

  it("multiple requests return identical lastmod values for static pages (deterministic)", () => {
    // Use property-based testing to verify across a random number of request pairs
    const requestCountArb = fc.integer({ min: 2, max: 5 });

    return fc.assert(
      fc.asyncProperty(requestCountArb, async (requestCount) => {
        const responses: string[] = [];
        for (let i = 0; i < requestCount; i++) {
          responses.push(await fetchSitemapXml());
        }

        // Parse all responses
        const allEntries = responses.map(parseSitemapEntries);

        // For each static path, all requests must return the same lastmod
        for (const staticPath of STATIC_PATHS) {
          const dates = allEntries.map((entries) => {
            const entry = entries.find((e) => e.loc === staticPath);
            expect(entry, `Expected sitemap entry for ${staticPath}`).toBeDefined();
            return entry!.lastmod;
          });

          // All dates for this static path must be identical
          const uniqueDates = new Set(dates);
          expect(
            uniqueDates.size,
            `Static page ${staticPath} should have identical lastmod across ${requestCount} requests, got: ${[...uniqueDates].join(", ")}`
          ).toBe(1);
        }
      }),
      { numRuns: 20 }
    );
  });

  it("all static pages share the same lastmod value (single shared constant)", async () => {
    const xml = await fetchSitemapXml();
    const entries = parseSitemapEntries(xml);

    const staticDates = STATIC_PATHS.map((path) => {
      const entry = entries.find((e) => e.loc === path);
      expect(entry, `Expected sitemap entry for ${path}`).toBeDefined();
      return entry!.lastmod;
    });

    // All static pages should use the same date (from the single shared constant)
    const uniqueDates = new Set(staticDates);
    expect(
      uniqueDates.size,
      `All static pages should share the same lastmod date, got: ${[...uniqueDates].join(", ")}`
    ).toBe(1);
  });
});
