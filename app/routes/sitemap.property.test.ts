import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { loader } from "./sitemap[.]xml";
import { toSlug } from "../lib/slug";

/**
 * Feature: seo-optimized-pages, Property 10: Sitemap contains all active ICB URLs with lastmod
 *
 * For any set of active ICBs with non-null document_folder_name values, the sitemap.xml
 * response should contain a <url> entry with a <loc> matching the ICB's policy page URL
 * and a <lastmod> element with a valid date string (YYYY-MM-DD format).
 *
 * We generate random sets of active ICBs (document_folder_name + updated_at), mock the D1
 * database to return them, call the loader directly, parse the XML response, and verify
 * each ICB has a corresponding <url> entry with correct <loc> and valid <lastmod>.
 *
 * Validates: Requirements 5.2, 5.3
 */
describe("Property 10: Sitemap Contains All Active ICB URLs With Lastmod", () => {
  // Arbitrary for generating a document_folder_name (words with spaces and optional commas)
  const documentFolderNameArb = fc
    .array(
      fc.oneof(
        fc.constantFrom(
          "North",
          "South",
          "East",
          "West",
          "Central",
          "Greater",
          "Hampshire",
          "Somerset",
          "Devon",
          "Kent",
          "Surrey",
          "Norfolk",
          "Suffolk",
          "Dorset",
          "Cornwall",
          "Wiltshire",
          "Lancashire",
          "Yorkshire",
          "Birmingham",
          "Manchester",
          "Bristol",
          "Leeds",
          "Sheffield",
          "Liverpool",
          "Nottingham",
          "Leicester"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 1, maxLength: 5 }
    )
    .map((words) => {
      // Optionally insert a comma after the first few words to mimic real names
      if (words.length >= 3) {
        return words.slice(0, 2).join(" ") + ", " + words.slice(2).join(" ");
      }
      return words.join(" ");
    });

  // Arbitrary for generating a valid updated_at timestamp (ISO format)
  // We build the date string manually to avoid issues with fc.date() in Workers runtime
  const updatedAtArb = fc
    .tuple(
      fc.integer({ min: 2020, max: 2025 }), // year
      fc.integer({ min: 1, max: 12 }),       // month
      fc.integer({ min: 1, max: 28 }),       // day (use 28 to avoid invalid dates)
      fc.integer({ min: 0, max: 23 }),       // hour
      fc.integer({ min: 0, max: 59 }),       // minute
      fc.integer({ min: 0, max: 59 })        // second
    )
    .map(([year, month, day, hour, minute, second]) => {
      const m = String(month).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      const h = String(hour).padStart(2, "0");
      const min = String(minute).padStart(2, "0");
      const s = String(second).padStart(2, "0");
      return `${year}-${m}-${d}T${h}:${min}:${s}.000Z`;
    });

  // Arbitrary for generating a set of ICBs with unique document_folder_names
  const icbSetArb = fc
    .array(
      fc.tuple(documentFolderNameArb, updatedAtArb),
      { minLength: 1, maxLength: 15 }
    )
    .map((pairs) => {
      const seen = new Set<string>();
      return pairs
        .filter(([name]) => {
          const slug = toSlug(name);
          if (slug === "" || seen.has(slug)) return false;
          seen.add(slug);
          return true;
        })
        .map(([document_folder_name, updated_at]) => ({
          document_folder_name,
          updated_at,
        }));
    })
    .filter((icbs) => icbs.length > 0);

  /**
   * Create a mock D1 database that returns the given ICBs from the sitemap query.
   */
  function createMockDB(icbs: Array<{ document_folder_name: string; updated_at: string }>) {
    return {
      prepare: () => ({
        bind: () => ({
          all: async () => ({ results: icbs }),
        }),
      }),
    };
  }

  /**
   * Call the sitemap loader with a mocked context and return the response text.
   */
  async function callSitemapLoader(
    icbs: Array<{ document_folder_name: string; updated_at: string }>
  ): Promise<string> {
    const mockContext = {
      cloudflare: {
        env: {
          DB: createMockDB(icbs),
        },
      },
    };

    const response = await loader({ context: mockContext } as any);
    return response.text();
  }

  it("sitemap XML contains a <url> entry with correct <loc> for each active ICB", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const xml = await callSitemapLoader(icbs);

        for (const icb of icbs) {
          const expectedSlug = toSlug(icb.document_folder_name);
          const expectedLoc = `https://fertilityfund.uk/icb/${expectedSlug}`;
          expect(xml).toContain(`<loc>${expectedLoc}</loc>`);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("sitemap XML contains a valid <lastmod> (YYYY-MM-DD) for each active ICB entry", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const xml = await callSitemapLoader(icbs);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        for (const icb of icbs) {
          const expectedSlug = toSlug(icb.document_folder_name);
          const expectedLoc = `https://fertilityfund.uk/icb/${expectedSlug}`;

          // Extract the <url> block containing this ICB's loc
          const urlBlockRegex = new RegExp(
            `<url><loc>${expectedLoc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc><lastmod>([^<]+)</lastmod>`
          );
          const match = xml.match(urlBlockRegex);
          expect(match).not.toBeNull();

          // Verify lastmod is a valid YYYY-MM-DD date
          const lastmod = match![1];
          expect(lastmod).toMatch(dateRegex);

          // Verify it's a parseable date
          const parsed = new Date(lastmod);
          expect(parsed.toString()).not.toBe("Invalid Date");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("sitemap XML lastmod for each ICB matches the updated_at date from the database", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const xml = await callSitemapLoader(icbs);

        for (const icb of icbs) {
          const expectedSlug = toSlug(icb.document_folder_name);
          const expectedLoc = `https://fertilityfund.uk/icb/${expectedSlug}`;
          const expectedLastmod = icb.updated_at.slice(0, 10);

          // Verify the lastmod in the XML matches the expected date from updated_at
          const urlBlockRegex = new RegExp(
            `<url><loc>${expectedLoc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc><lastmod>([^<]+)</lastmod>`
          );
          const match = xml.match(urlBlockRegex);
          expect(match).not.toBeNull();
          expect(match![1]).toBe(expectedLastmod);
        }
      }),
      { numRuns: 100 }
    );
  });
});
