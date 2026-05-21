import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { standardMeta } from "./meta";

/**
 * Feature: production-readiness, Property 5: Hreflang tags are conditional
 *
 * Only rendered when a route provides a canonical URL via `standardMeta()`,
 * preventing invalid hreflang tags on non-public routes. For any valid
 * canonical URL string:
 * 1. standardMeta(url) returns descriptors that include hreflang en-GB and x-default
 *    tags with the correct href
 * 2. The hreflang tags always use the exact canonical URL passed in (no transformation)
 * 3. The function always returns both en-GB and x-default hreflang tags together
 *    (never one without the other)
 *
 * **Validates: Requirements 11.3, 11.4**
 */
describe("Property 5: Hreflang tags are conditional", () => {
  // Generate valid canonical URLs (absolute URLs with https scheme)
  const canonicalUrlArb = fc
    .tuple(
      fc.webUrl({ validSchemes: ["https"] }),
      fc.option(
        fc.array(
          fc.stringMatching(/^[a-z0-9-]{1,20}$/),
          { minLength: 1, maxLength: 4 }
        ).map((segments) => "/" + segments.join("/")),
        { nil: undefined }
      )
    )
    .map(([base, path]) => (path ? base + path : base));

  it("standardMeta always includes both en-GB and x-default hreflang tags for any canonical URL", () => {
    fc.assert(
      fc.property(canonicalUrlArb, (url) => {
        const descriptors = standardMeta(url);

        const enGBTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "en-GB"
        );
        const xDefaultTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "x-default"
        );

        // Both hreflang tags must be present
        expect(enGBTag).toBeDefined();
        expect(xDefaultTag).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it("hreflang tags use the exact canonical URL passed in without transformation", () => {
    fc.assert(
      fc.property(canonicalUrlArb, (url) => {
        const descriptors = standardMeta(url);

        const enGBTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "en-GB"
        ) as any;
        const xDefaultTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "x-default"
        ) as any;

        // The href must be the exact URL passed in — no normalisation or transformation
        expect(enGBTag.href).toBe(url);
        expect(xDefaultTag.href).toBe(url);
      }),
      { numRuns: 100 }
    );
  });

  it("en-GB and x-default hreflang tags always appear together (never one without the other)", () => {
    fc.assert(
      fc.property(canonicalUrlArb, (url) => {
        const descriptors = standardMeta(url);

        const enGBTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "en-GB"
        );
        const xDefaultTag = descriptors.find(
          (d: any) => d.tagName === "link" && d.rel === "alternate" && d.hrefLang === "x-default"
        );

        // Both must be present or both must be absent — never one without the other
        const hasEnGB = enGBTag !== undefined;
        const hasXDefault = xDefaultTag !== undefined;
        expect(hasEnGB).toBe(hasXDefault);
      }),
      { numRuns: 100 }
    );
  });
});
