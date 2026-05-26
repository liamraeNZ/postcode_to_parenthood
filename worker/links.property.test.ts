import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { addLinkHeaders, LINK_HEADER_VALUES } from "./links";

/**
 * Feature: agent-readiness, Property 1: Link headers present if and only if root path
 *
 * For any HTTP request processed by the Worker, the response contains Link
 * headers advertising machine-readable resources if and only if the request
 * pathname is exactly "/".
 *
 * Validates: Requirements 1.1, 1.2
 */
describe("Property 1: Link headers present if and only if root path", () => {
  // Generate arbitrary pathname strings that are NOT "/"
  const nonRootPathnameArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => s !== "/");

  // Generate arbitrary pathname strings (any string, including "/")
  const anyPathnameArb = fc.oneof(
    fc.constant("/"),
    nonRootPathnameArb
  );

  /**
   * Helper to check if Link headers are present in a response.
   * Uses headers.get("Link") which returns comma-joined values when
   * multiple Link headers were appended.
   */
  function getLinkHeaderValue(response: Response): string | null {
    return response.headers.get("Link");
  }

  it("Link headers are present when pathname is '/'", () => {
    fc.assert(
      fc.property(fc.constant("/"), (pathname) => {
        const response = new Response("OK", { status: 200 });
        const result = addLinkHeaders(response, pathname);

        const linkHeader = getLinkHeaderValue(result);
        expect(linkHeader).not.toBeNull();

        // Each Link header value should be present in the combined header
        for (const value of LINK_HEADER_VALUES) {
          expect(linkHeader).toContain(value);
        }
      }),
      { numRuns: 10 }
    );
  });

  it("Link headers are absent when pathname is not '/'", () => {
    fc.assert(
      fc.property(nonRootPathnameArb, (pathname) => {
        const response = new Response("OK", { status: 200 });
        const result = addLinkHeaders(response, pathname);

        const linkHeader = getLinkHeaderValue(result);
        expect(linkHeader).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it("Link headers present iff pathname === '/' for any pathname", () => {
    fc.assert(
      fc.property(anyPathnameArb, (pathname) => {
        const response = new Response("OK", { status: 200 });
        const result = addLinkHeaders(response, pathname);

        const linkHeader = getLinkHeaderValue(result);

        if (pathname === "/") {
          expect(linkHeader).not.toBeNull();
          for (const value of LINK_HEADER_VALUES) {
            expect(linkHeader).toContain(value);
          }
        } else {
          expect(linkHeader).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });
});
