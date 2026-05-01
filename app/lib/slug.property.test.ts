import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { toSlug, findIcbBySlug } from "./slug";

/**
 * Feature: seo-optimized-pages, Property 1: Slug round-trip
 *
 * For any ICB record with a non-null document_folder_name, converting the name
 * to a slug via toSlug() and then looking up that slug via findIcbBySlug()
 * against the full list of ICBs should return the original ICB record.
 *
 * Validates: Requirements 3.1, 3.10
 */
describe("Property 1: Slug Round-Trip", () => {
  // Arbitrary that generates strings resembling document_folder_names:
  // alphabetic words separated by spaces, optionally with commas
  const wordArb = fc
    .array(fc.constantFrom(...("abcdefghijklmnopqrstuvwxyz".split(""))), {
      minLength: 2,
      maxLength: 12,
    })
    .map((chars) => chars.join(""));

  const documentFolderNameArb = fc
    .array(
      fc.tuple(wordArb, fc.constantFrom("", ",")),
      { minLength: 1, maxLength: 6 }
    )
    .map((parts) =>
      parts
        .map(([word, sep]) => word + sep)
        .join(" ")
        .trim()
    )
    .filter((name) => name.length > 0 && /[a-z]/.test(name));

  it("findIcbBySlug(icbs, toSlug(name)) returns the correct ICB for any valid name", () => {
    fc.assert(
      fc.property(documentFolderNameArb, (name) => {
        const icb = { id: "test-id", document_folder_name: name };
        const icbs = [
          { id: "other-1", document_folder_name: "Some Other ICB" },
          icb,
          { id: "other-2", document_folder_name: "Another ICB Name" },
        ];

        const slug = toSlug(name);
        const result = findIcbBySlug(icbs, slug);

        // The result should exist and match our ICB
        expect(result).toBeDefined();
        expect(result!.id).toBe("test-id");
        expect(result!.document_folder_name).toBe(name);
      }),
      { numRuns: 200 }
    );
  });

  it("toSlug always produces a non-empty string for non-empty alphabetic input", () => {
    fc.assert(
      fc.property(documentFolderNameArb, (name) => {
        const slug = toSlug(name);
        expect(slug.length).toBeGreaterThan(0);
        // Slug should only contain lowercase alphanumeric and hyphens
        expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }),
      { numRuns: 200 }
    );
  });

  it("toSlug is deterministic - same input always produces same output", () => {
    fc.assert(
      fc.property(documentFolderNameArb, (name) => {
        expect(toSlug(name)).toBe(toSlug(name));
      }),
      { numRuns: 100 }
    );
  });

  it("round-trip works with multiple ICBs having distinct slugs", () => {
    // Generate a list of distinct names and verify each can be found
    const distinctNamesArb = fc
      .uniqueArray(documentFolderNameArb, {
        minLength: 2,
        maxLength: 10,
        comparator: (a, b) => toSlug(a) === toSlug(b),
      })
      .filter((names) => names.length >= 2);

    fc.assert(
      fc.property(distinctNamesArb, (names) => {
        const icbs = names.map((name, i) => ({
          id: `id-${i}`,
          document_folder_name: name,
        }));

        for (const icb of icbs) {
          const slug = toSlug(icb.document_folder_name);
          const found = findIcbBySlug(icbs, slug);
          expect(found).toBeDefined();
          expect(found!.id).toBe(icb.id);
        }
      }),
      { numRuns: 100 }
    );
  });
});
