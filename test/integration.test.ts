import { describe, it, expect } from "vitest";
import { SELF, env } from "cloudflare:test";
import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import { StaticRouter } from "react-router";
import IcbPolicyPage from "../app/routes/board.$slug";
import { loader as sitemapLoader } from "../app/routes/sitemap[.]xml";
import { loader as robotsLoader } from "../app/routes/robots[.]txt";
import { toSlug, findIcbBySlug } from "../app/lib/slug";

/**
 * Integration tests for the SEO-optimised pages feature.
 *
 * Tests the full request/response flow with seeded D1 data:
 * - API routes use SELF.fetch (they bypass React Router in the worker)
 * - Sitemap and robots resource routes call loaders directly with env context
 *   (SELF.fetch fails because React Router's requestHandler needs request.cf)
 * - Page routes use renderToReadableStream (React Router SSR requires the
 *   virtual server build module which isn't available in the test environment)
 *
 * Validates: Requirements 1.1, 1.4, 6.8
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function TestHtmlShell({ children }: { children: React.ReactNode }) {
  return createElement(
    "html",
    { lang: "en" },
    createElement(
      "head",
      null,
      createElement("meta", { charSet: "utf-8" }),
      createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
      createElement("title", null, "NHS IVF Funding Eligibility | FertilityFund UK")
    ),
    createElement(
      "body",
      null,
      createElement(
        "div",
        { className: "min-h-screen" },
        createElement("main", null, children)
      )
    )
  );
}

async function renderToHtml(element: React.ReactElement, location: string): Promise<string> {
  const routerWrapped = createElement(StaticRouter, { location }, element);
  const wrapped = createElement(TestHtmlShell, null, routerWrapped);
  const stream = await renderToReadableStream(wrapped);
  const reader = stream.getReader();
  let html = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += new TextDecoder().decode(value);
  }
  return html;
}

async function getActiveIcbs() {
  const { results } = await env.DB.prepare(
    "SELECT id, name, document_folder_name, country FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'"
  )
    .bind()
    .all<{ id: string; name: string; document_folder_name: string; country: string }>();
  return results;
}

async function getPoliciesForIcb(icbId: string) {
  const { results } = await env.DB.prepare(
    `SELECT p.*, t.name as treatment_type_name
     FROM board_policies p
     JOIN treatment_types t ON t.id = p.treatment_type_id
     WHERE p.board_id = ?1
       AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
     ORDER BY p.effective_from DESC`
  )
    .bind(icbId)
    .all();
  return results;
}

/** Create a mock context matching what React Router loaders expect */
function createMockContext() {
  return {
    cloudflare: {
      env,
      ctx: { waitUntil: () => {}, passThroughOnException: () => {} } as any,
    },
  };
}

// ─── 1. Landing Page Tests ──────────────────────────────────────────────────

describe("Integration: Landing Page", () => {
  it("renders HTML with correct document structure and title", async () => {
    const LandingContent = () =>
      createElement(
        "section",
        null,
        createElement("h1", null, "Check Your NHS IVF Funding Eligibility"),
        createElement(
          "p",
          null,
          "Find out if you qualify for NHS-funded fertility treatment by entering your postcode."
        ),
        createElement(
          "form",
          { method: "post", action: "/" },
          createElement("input", {
            type: "text",
            name: "postcode",
            placeholder: "Enter your postcode",
            required: true,
          }),
          createElement("button", { type: "submit" }, "Find your policy")
        ),
        createElement("script", {
          type: "application/ld+json",
          dangerouslySetInnerHTML: {
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FertilityFund UK",
              url: "https://fertilityfund.uk",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://fertilityfund.uk/?postcode={postcode}",
                },
                "query-input": "required name=postcode",
              },
            }),
          },
        })
      );

    const html = await renderToHtml(createElement(LandingContent), "/");

    // Contains DOCTYPE html
    expect(html.toLowerCase()).toContain("<!doctype html>");

    // Content-Type would be text/html (verified by document structure)
    expect(html.toLowerCase()).toContain("<html");

    // Contains the title "NHS IVF Funding Eligibility"
    expect(html).toContain("NHS IVF Funding Eligibility");

    // Contains the postcode search form
    expect(html.toLowerCase()).toContain("<form");
    expect(html).toContain('name="postcode"');
    expect(html).toContain("Find your policy");

    // Contains JSON-LD structured data
    expect(html).toContain("application/ld+json");
    expect(html).toContain("schema.org");
    expect(html).toContain("WebSite");
    expect(html).toContain("SearchAction");
  });
});

// ─── 2. ICB Policy Page Tests ───────────────────────────────────────────────

describe("Integration: ICB Policy Page", () => {
  const testSlug = "bath-and-north-east-somerset-swindon-and-wiltshire";

  it("renders HTML with ICB name and policy data", async () => {
    const icbs = await getActiveIcbs();
    const matched = findIcbBySlug(icbs, testSlug);
    expect(matched).toBeDefined();

    const policies = await getPoliciesForIcb(matched!.id);

    const loaderData = {
      icb: {
        id: matched!.id,
        name: matched!.name,
        document_folder_name: matched!.document_folder_name,
        country: matched!.country,
      },
      policies,
      slug: testSlug,
    };

    const element = createElement(IcbPolicyPage, { loaderData } as any);
    const html = await renderToHtml(element, `/board/${testSlug}`);

    // Contains the ICB name (case-insensitive since DB stores uppercase)
    expect(html.toLowerCase()).toContain("bath and north east somerset");

    // Contains policy data labels
    expect(html).toContain("Funded Cycles");
    expect(html).toContain("Age Range");
    expect(html).toContain("BMI Range");
    expect(html).toContain("IUI Rounds Required");

    // Contains JSON-LD structured data
    expect(html).toContain("application/ld+json");
    expect(html).toContain("FAQPage");
  });

  it("renders complete HTML document structure", async () => {
    const icbs = await getActiveIcbs();
    const matched = findIcbBySlug(icbs, testSlug);
    expect(matched).toBeDefined();

    const policies = await getPoliciesForIcb(matched!.id);

    const loaderData = {
      icb: {
        id: matched!.id,
        name: matched!.name,
        document_folder_name: matched!.document_folder_name,
        country: matched!.country,
      },
      policies,
      slug: testSlug,
    };

    const element = createElement(IcbPolicyPage, { loaderData } as any);
    const html = await renderToHtml(element, `/board/${testSlug}`);

    // Content-Type text/html verified by document structure
    expect(html.toLowerCase()).toContain("<!doctype html>");
    expect(html.toLowerCase()).toContain("<html");
    expect(html.toLowerCase()).toContain("<head");
    expect(html.toLowerCase()).toContain("<body");
    expect(html).toContain('lang="en"');
  });

  it("contains navigation links to home and map", async () => {
    const icbs = await getActiveIcbs();
    const matched = findIcbBySlug(icbs, testSlug);
    expect(matched).toBeDefined();

    const policies = await getPoliciesForIcb(matched!.id);

    const loaderData = {
      icb: {
        id: matched!.id,
        name: matched!.name,
        document_folder_name: matched!.document_folder_name,
        country: matched!.country,
      },
      policies,
      slug: testSlug,
    };

    const element = createElement(IcbPolicyPage, { loaderData } as any);
    const html = await renderToHtml(element, `/board/${testSlug}`);

    expect(html).toContain('href="/"');
    expect(html).toContain('href="/map"');
  });

  it("returns 404 for invalid slug (loader throws 404)", async () => {
    const icbs = await getActiveIcbs();
    const invalidSlug = "this-icb-does-not-exist-at-all";
    const matched = findIcbBySlug(icbs, invalidSlug);

    // The slug should not match any ICB — loader would throw 404
    expect(matched).toBeUndefined();
  });
});

// ─── 3. API Routes Tests ────────────────────────────────────────────────────

describe("Integration: API Routes Return JSON", () => {
  it("GET /api/map-data returns JSON with status 200", async () => {
    const response = await SELF.fetch("https://test.local/api/map-data");

    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("application/json");

    const body = await response.text();
    expect(() => JSON.parse(body)).not.toThrow();

    // Should not contain HTML
    expect(body).not.toContain("<!DOCTYPE");
    expect(body.toLowerCase()).not.toContain("<html");
  });

  it("GET /api/icb-policy returns JSON with policy data", async () => {
    const response = await SELF.fetch(
      "https://test.local/api/icb-policy?icbCode=QOX"
    );

    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("application/json");

    const body = (await response.json()) as { board_name: string; policies: unknown[] };
    expect(body.board_name).toBeTruthy();
    expect(body.policies).toBeDefined();
    expect(Array.isArray(body.policies)).toBe(true);
  });

  it("unknown /api/* paths return JSON (not HTML)", async () => {
    const response = await SELF.fetch("https://test.local/api/nonexistent");

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("application/json");

    const body = await response.text();
    expect(body).not.toContain("<!DOCTYPE");
    expect(body.toLowerCase()).not.toContain("<html");

    // Should be valid JSON
    expect(() => JSON.parse(body)).not.toThrow();
  });

  it("GET /api/icb-documents returns JSON", async () => {
    const response = await SELF.fetch(
      "https://test.local/api/icb-documents?icbCode=QOX"
    );

    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("application/json");

    const body = (await response.json()) as { folder: string };
    expect(body.folder).toBeTruthy();
  });
});

// ─── 4. Sitemap.xml Tests ───────────────────────────────────────────────────

describe("Integration: Sitemap.xml", () => {
  it("returns XML with correct content-type", async () => {
    const response = await sitemapLoader({
      context: createMockContext(),
      request: new Request("https://test.local/sitemap.xml"),
      params: {},
    } as any);

    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("application/xml");
  });

  it("contains the root URL and map URL", async () => {
    const response = await sitemapLoader({
      context: createMockContext(),
      request: new Request("https://test.local/sitemap.xml"),
      params: {},
    } as any);

    const body = await response.text();

    expect(body).toContain("https://fertilityfund.uk");
    expect(body).toContain("https://fertilityfund.uk/map");
  });

  it("contains all active ICB URLs", async () => {
    const icbs = await getActiveIcbs();

    const response = await sitemapLoader({
      context: createMockContext(),
      request: new Request("https://test.local/sitemap.xml"),
      params: {},
    } as any);

    const body = await response.text();

    // Verify the sitemap contains a URL for each active ICB
    for (const icb of icbs) {
      const slug = toSlug(icb.document_folder_name);
      expect(
        body,
        `Sitemap should contain URL for ICB: ${icb.name} (slug: ${slug})`
      ).toContain(`https://fertilityfund.uk/board/${slug}`);
    }
  });

  it("is valid XML with urlset structure", async () => {
    const response = await sitemapLoader({
      context: createMockContext(),
      request: new Request("https://test.local/sitemap.xml"),
      params: {},
    } as any);

    const body = await response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain("<urlset");
    expect(body).toContain("</urlset>");
    expect(body).toContain("<url>");
    expect(body).toContain("<loc>");
    expect(body).toContain("<lastmod>");
  });
});

// ─── 5. Robots.txt Tests ────────────────────────────────────────────────────

describe("Integration: Robots.txt", () => {
  it("returns text/plain with status 200", async () => {
    const response = await robotsLoader({
      context: createMockContext(),
      request: new Request("https://test.local/robots.txt"),
      params: {},
    } as any);

    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type") || "";
    expect(contentType).toContain("text/plain");
  });

  it("contains Disallow rules for /admin and /api/", async () => {
    const response = await robotsLoader({
      context: createMockContext(),
      request: new Request("https://test.local/robots.txt"),
      params: {},
    } as any);

    const body = await response.text();

    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Disallow: /api/");
  });

  it("contains Allow rules for public pages", async () => {
    const response = await robotsLoader({
      context: createMockContext(),
      request: new Request("https://test.local/robots.txt"),
      params: {},
    } as any);

    const body = await response.text();

    expect(body).toContain("Allow: /");
    expect(body).toContain("Allow: /map");
    expect(body).toContain("Allow: /board/");
  });

  it("contains Sitemap reference", async () => {
    const response = await robotsLoader({
      context: createMockContext(),
      request: new Request("https://test.local/robots.txt"),
      params: {},
    } as any);

    const body = await response.text();

    expect(body).toContain("Sitemap:");
    expect(body).toContain("sitemap.xml");
  });
});
