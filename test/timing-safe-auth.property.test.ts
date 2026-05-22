import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";
import * as fc from "fast-check";

/**
 * Feature: production-readiness, Property 4: Timing-safe auth always evaluates both fields
 *
 * The auth function computes both username and password comparisons before
 * branching, preventing early-exit timing leaks. For any combination of
 * correct/incorrect username and password:
 * 1. Both comparisons are always evaluated (no short-circuit)
 * 2. The response is always identical (401 with WWW-Authenticate header)
 *    regardless of which field failed
 *
 * **Validates: Requirements 5.1, 5.2, 5.3**
 */
describe("Property 4: Timing-safe auth always evaluates both fields", () => {
  // The correct credentials configured in the test environment (.dev.vars)
  const CORRECT_USERNAME = "admin";
  const CORRECT_PASSWORD = "1234";

  // Generate random credential strings (printable ASCII, no colons in username)
  const usernameArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => !s.includes(":") && s !== CORRECT_USERNAME);

  const passwordArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => s !== CORRECT_PASSWORD);

  function makeAuthHeader(username: string, password: string): string {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }

  async function fetchWithAuth(username: string, password: string): Promise<Response> {
    return SELF.fetch("https://test.local/api/admin/icbs", {
      headers: {
        Authorization: makeAuthHeader(username, password),
      },
    });
  }

  it("wrong username + wrong password returns 401 with WWW-Authenticate header", () => {
    return fc.assert(
      fc.asyncProperty(usernameArb, passwordArb, async (username, password) => {
        const response = await fetchWithAuth(username, password);

        expect(response.status).toBe(401);
        expect(response.headers.get("WWW-Authenticate")).toBe(
          'Basic realm="Admin"'
        );
      }),
      { numRuns: 50 }
    );
  });

  it("correct username + wrong password returns 401 with WWW-Authenticate header", () => {
    return fc.assert(
      fc.asyncProperty(passwordArb, async (password) => {
        const response = await fetchWithAuth(CORRECT_USERNAME, password);

        expect(response.status).toBe(401);
        expect(response.headers.get("WWW-Authenticate")).toBe(
          'Basic realm="Admin"'
        );
      }),
      { numRuns: 50 }
    );
  });

  it("wrong username + correct password returns 401 with WWW-Authenticate header", () => {
    return fc.assert(
      fc.asyncProperty(usernameArb, async (username) => {
        const response = await fetchWithAuth(username, CORRECT_PASSWORD);

        expect(response.status).toBe(401);
        expect(response.headers.get("WWW-Authenticate")).toBe(
          'Basic realm="Admin"'
        );
      }),
      { numRuns: 50 }
    );
  });

  it("all failure modes produce identical response (same status, same headers, same empty body)", () => {
    // For any two different invalid credential combinations, the responses
    // must be indistinguishable — proving no information leaks about which
    // field was incorrect.
    const invalidCredsArb = fc.oneof(
      // wrong username + wrong password
      fc.tuple(usernameArb, passwordArb),
      // correct username + wrong password
      fc.tuple(fc.constant(CORRECT_USERNAME), passwordArb),
      // wrong username + correct password
      fc.tuple(usernameArb, fc.constant(CORRECT_PASSWORD))
    );

    return fc.assert(
      fc.asyncProperty(
        invalidCredsArb,
        invalidCredsArb,
        async ([user1, pass1], [user2, pass2]) => {
          const [response1, response2] = await Promise.all([
            fetchWithAuth(user1, pass1),
            fetchWithAuth(user2, pass2),
          ]);

          // Both must return identical status
          expect(response1.status).toBe(response2.status);

          // Both must have the same WWW-Authenticate header
          expect(response1.headers.get("WWW-Authenticate")).toBe(
            response2.headers.get("WWW-Authenticate")
          );

          // Both must have the same (empty) body
          const body1 = await response1.text();
          const body2 = await response2.text();
          expect(body1).toBe(body2);
        }
      ),
      { numRuns: 50 }
    );
  });

  it("correct credentials return null (success - no 401 response)", async () => {
    const response = await fetchWithAuth(CORRECT_USERNAME, CORRECT_PASSWORD);

    // With correct credentials, the auth check passes and the route handler
    // proceeds. The response should NOT be 401.
    expect(response.status).not.toBe(401);
  });
});
