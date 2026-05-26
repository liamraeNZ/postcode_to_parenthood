import { describe, it, expect, beforeAll } from "vitest";
import { loader as robotsLoader } from "../app/routes/robots[.]txt";

/**
 * Unit tests for robots.txt Content-Signal directives.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function createMockContext() {
  return {
    context: {
      cloudflare: {
        env: {},
        ctx: { waitUntil: () => {}, passThroughOnException: () => {} } as any,
      },
    },
    request: new Request("https://test.local/robots.txt"),
    params: {},
  } as any;
}

let body: string;

beforeAll(async () => {
  const response = await robotsLoader(createMockContext());
  body = await response.text();
});

// ─── Property 3: Content-Signal directives present in robots.txt ────────────

describe("Property 3: Content-Signal directives present in robots.txt", () => {
  it("contains Content-Signal: ai-train=no", () => {
    expect(body).toContain("Content-Signal: ai-train=no");
  });

  it("contains Content-Signal: search=yes", () => {
    expect(body).toContain("Content-Signal: search=yes");
  });

  it("contains Content-Signal: ai-input=yes", () => {
    expect(body).toContain("Content-Signal: ai-input=yes");
  });

  it("contains Content-Signal: agent=yes", () => {
    expect(body).toContain("Content-Signal: agent=yes");
  });
});

// ─── Property 4: Content-Signal ordering after standard directives ──────────

describe("Property 4: Content-Signal ordering after standard directives", () => {
  it("all Content-Signal lines appear after all standard directives", () => {
    const lines = body.split("\n");

    // Find the indices of the last standard directive and first Content-Signal
    const standardPrefixes = ["User-agent:", "Allow:", "Disallow:", "Sitemap:"];

    let lastStandardIndex = -1;
    let firstContentSignalIndex = lines.length;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (standardPrefixes.some((prefix) => trimmed.startsWith(prefix))) {
        lastStandardIndex = index;
      }
      if (trimmed.startsWith("Content-Signal:") && index < firstContentSignalIndex) {
        firstContentSignalIndex = index;
      }
    });

    expect(lastStandardIndex).toBeGreaterThan(-1);
    expect(firstContentSignalIndex).toBeLessThan(lines.length);
    expect(firstContentSignalIndex).toBeGreaterThan(lastStandardIndex);
  });

  it("Content-Signal block is separated from preceding directives by a blank line", () => {
    const lines = body.split("\n");

    // Find the first Content-Signal line
    const firstContentSignalIndex = lines.findIndex((line) =>
      line.trim().startsWith("Content-Signal:")
    );

    expect(firstContentSignalIndex).toBeGreaterThan(0);

    // The line immediately before the first Content-Signal should be blank
    const precedingLine = lines[firstContentSignalIndex - 1].trim();
    expect(precedingLine).toBe("");
  });
});

// ─── Property 5: Existing robots.txt directives preserved ───────────────────

describe("Property 5: Existing robots.txt directives preserved", () => {
  it("preserves User-agent wildcard directive", () => {
    expect(body).toContain("User-agent: *");
  });

  it("preserves all Allow directives unchanged", () => {
    const expectedAllows = [
      "Allow: /",
      "Allow: /map",
      "Allow: /board/",
      "Allow: /boards",
      "Allow: /search",
      "Allow: /policies",
      "Allow: /policy/",
      "Allow: /about",
      "Allow: /what-next/",
      "Allow: /updates",
      "Allow: /privacy",
      "Allow: /terms",
    ];

    for (const directive of expectedAllows) {
      expect(body).toContain(directive);
    }
  });

  it("preserves all Disallow directives unchanged", () => {
    const expectedDisallows = [
      "Disallow: /admin",
      "Disallow: /api/",
      "Disallow: /documents/",
    ];

    for (const directive of expectedDisallows) {
      expect(body).toContain(directive);
    }
  });

  it("preserves Sitemap directive unchanged", () => {
    expect(body).toContain("Sitemap: https://postcodetoparenthood.org.uk/sitemap.xml");
  });

  it("preserves ordering of standard directives (User-agent first, then Allow/Disallow, then Sitemap)", () => {
    const lines = body.split("\n").filter((l) => l.trim().length > 0);

    const userAgentIndex = lines.findIndex((l) => l.startsWith("User-agent:"));
    const firstAllowIndex = lines.findIndex((l) => l.startsWith("Allow:"));
    const firstDisallowIndex = lines.findIndex((l) => l.startsWith("Disallow:"));
    const sitemapIndex = lines.findIndex((l) => l.startsWith("Sitemap:"));

    // User-agent comes first
    expect(userAgentIndex).toBe(0);
    // Allow/Disallow come after User-agent
    expect(firstAllowIndex).toBeGreaterThan(userAgentIndex);
    expect(firstDisallowIndex).toBeGreaterThan(userAgentIndex);
    // Sitemap comes after all Allow/Disallow
    expect(sitemapIndex).toBeGreaterThan(firstDisallowIndex);
  });
});
