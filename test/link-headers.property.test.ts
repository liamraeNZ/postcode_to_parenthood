import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { addLinkHeaders } from "../worker/links";

/**
 * Feature: agent-readiness, Property 2: Header preservation invariant
 *
 * For any response with arbitrary pre-existing headers, applying `addLinkHeaders`
 * SHALL preserve all original headers — no header is removed or modified, and
 * Link headers are appended additively.
 *
 * **Validates: Requirements 1.3**
 */
describe("Property 2: Header preservation invariant", () => {
  // Generate arbitrary HTTP header name/value pairs.
  // Header names: lowercase alpha + hyphens (valid HTTP token chars)
  const headerNameArb = fc
    .array(fc.constantFrom(...("abcdefghijklmnopqrstuvwxyz-".split(""))), {
      minLength: 1,
      maxLength: 20,
    })
    .map((chars) => chars.join(""))
    .filter((name) => /^[a-z]/.test(name) && !name.endsWith("-") && name !== "link");

  // Header values: printable ASCII (no control chars), trimmed to avoid
  // whitespace-only values that get normalized by the Headers API
  const headerValueArb = fc
    .tuple(
      fc.constantFrom(...("abcdefghijklmnopqrstuvwxyz0123456789".split(""))),
      fc.string({ minLength: 0, maxLength: 48 }).map((s) =>
        s.replace(/[\x00-\x1f\x7f]/g, "x")
      ),
      fc.constantFrom(...("abcdefghijklmnopqrstuvwxyz0123456789".split("")))
    )
    .map(([first, middle, last]) => `${first}${middle}${last}`);

  // Generate a list of unique header entries
  const headersArb = fc
    .uniqueArray(fc.tuple(headerNameArb, headerValueArb), {
      minLength: 1,
      maxLength: 10,
      comparator: (a, b) => a[0] === b[0],
    })
    .filter((entries) => entries.length >= 1);

  it("all original headers are preserved after applying addLinkHeaders on root path", () => {
    fc.assert(
      fc.property(headersArb, (headerEntries) => {
        // Build a response with the generated headers
        const originalHeaders = new Headers();
        for (const [name, value] of headerEntries) {
          originalHeaders.set(name, value);
        }

        const originalResponse = new Response("test body", {
          status: 200,
          headers: originalHeaders,
        });

        // Apply addLinkHeaders with root path (which adds Link headers)
        const result = addLinkHeaders(originalResponse, "/");

        // Assert every original header is preserved in the result
        for (const [name, value] of headerEntries) {
          expect(result.headers.get(name)).toBe(value);
        }
      }),
      { numRuns: 200 }
    );
  });

  it("all original headers are preserved after applying addLinkHeaders on non-root path", () => {
    const pathArb = fc
      .string({ minLength: 1, maxLength: 30 })
      .map((s) => "/" + s.replace(/[\x00-\x1f\x7f]/g, "a"))
      .filter((p) => p !== "/");

    fc.assert(
      fc.property(headersArb, pathArb, (headerEntries, pathname) => {
        const originalHeaders = new Headers();
        for (const [name, value] of headerEntries) {
          originalHeaders.set(name, value);
        }

        const originalResponse = new Response("test body", {
          status: 200,
          headers: originalHeaders,
        });

        // Apply addLinkHeaders with non-root path (returns original response)
        const result = addLinkHeaders(originalResponse, pathname);

        // Assert every original header is preserved
        for (const [name, value] of headerEntries) {
          expect(result.headers.get(name)).toBe(value);
        }
      }),
      { numRuns: 200 }
    );
  });

  it("Link headers are appended additively (not replacing pre-existing Link headers)", () => {
    const existingLinkValueArb = fc
      .string({ minLength: 1, maxLength: 40 })
      .map((s) => `</${s.replace(/[\x00-\x1f\x7f<>]/g, "x")}>; rel="alternate"`);

    fc.assert(
      fc.property(headersArb, existingLinkValueArb, (headerEntries, existingLink) => {
        const originalHeaders = new Headers();
        for (const [name, value] of headerEntries) {
          originalHeaders.set(name, value);
        }
        // Add a pre-existing Link header
        originalHeaders.append("Link", existingLink);

        const originalResponse = new Response("test body", {
          status: 200,
          headers: originalHeaders,
        });

        const result = addLinkHeaders(originalResponse, "/");

        // The result's Link header should contain the original Link value
        const resultLinkHeader = result.headers.get("Link") ?? "";
        expect(resultLinkHeader).toContain(existingLink);

        // All other original headers should still be present
        for (const [name, value] of headerEntries) {
          expect(result.headers.get(name)).toBe(value);
        }
      }),
      { numRuns: 200 }
    );
  });
});
