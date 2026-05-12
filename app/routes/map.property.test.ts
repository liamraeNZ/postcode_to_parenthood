import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import { StaticRouter } from "react-router";
import MapPage from "./map";

/**
 * Feature: seo-optimized-pages, Property 11: Server render of map does not execute window-dependent code
 *
 * For any server-side render of the /map route, the render should complete without
 * referencing window, document, or other browser-only globals — Leaflet code should
 * not be imported or executed during SSR.
 *
 * The Cloudflare Workers environment (where vitest runs) does NOT have window or document
 * globals. If Leaflet code were to execute during SSR, it would throw a ReferenceError
 * about window not being defined. The test verifies this doesn't happen.
 *
 * We generate random sets of ICBs (to vary the loader data), render the MapPage component
 * using renderToReadableStream, and verify:
 * 1. The render completes successfully without throwing errors
 * 2. The output contains the placeholder/fallback content (not the actual map)
 *
 * Validates: Requirements 7.4
 */
describe("Property 11: Server Render of Map Does Not Execute Window-Dependent Code", () => {
  // Helper to render MapPage to HTML string
  async function renderMapPageToHtml(icbs: Array<{ name: string; slug: string }>): Promise<string> {
    const loaderData = { icbs };
    const element = createElement(MapPage, { loaderData } as any);
    // Wrap in StaticRouter to provide navigation context for <Link> components
    const routerWrapped = createElement(StaticRouter, { location: "/map" }, element);
    const stream = await renderToReadableStream(routerWrapped);
    const reader = stream.getReader();
    let html = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    return html;
  }

  // Arbitrary for generating a valid slug (lowercase alphanumeric with hyphens)
  const slugArb = fc
    .array(
      fc.oneof(
        fc.stringMatching(/^[a-z]{2,8}$/),
        fc.constantFrom("and", "the", "of", "in")
      ),
      { minLength: 1, maxLength: 5 }
    )
    .map((words) => words.join("-"));

  // Arbitrary for generating an ICB name
  const icbNameArb = fc
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
          "Yorkshire"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 1, maxLength: 4 }
    )
    .map((words) => words.join(" "));

  // Arbitrary for generating a set of ICBs with unique slugs
  const icbSetArb = fc
    .array(
      fc.tuple(icbNameArb, slugArb),
      { minLength: 0, maxLength: 20 }
    )
    .map((pairs) => {
      const seen = new Set<string>();
      return pairs
        .filter(([, slug]) => {
          if (seen.has(slug)) return false;
          seen.add(slug);
          return true;
        })
        .map(([name, slug]) => ({ name, slug }));
    });

  it("server render completes without throwing window/document ReferenceErrors for any ICB set", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        // If Leaflet code executes during SSR, it will throw a ReferenceError
        // because window/document are not available in the Workers environment.
        // The render should complete successfully without any such errors.
        const html = await renderMapPageToHtml(icbs);

        // Verify we got a non-empty HTML string back (render succeeded)
        expect(html.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("server-rendered output contains the map placeholder fallback, not actual Leaflet content", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const html = await renderMapPageToHtml(icbs);

        // The placeholder text "Loading map…" should be present (from MapPlaceholder)
        expect(html).toContain("Loading map");

        // Leaflet-specific markers should NOT be present in server-rendered HTML
        // If Leaflet rendered, we'd see elements like leaflet-container, leaflet-map-pane, etc.
        expect(html).not.toContain("leaflet-container");
        expect(html).not.toContain("leaflet-map-pane");
        expect(html).not.toContain("L.map");
      }),
      { numRuns: 100 }
    );
  });

  it("server-rendered output does not contain any inline scripts referencing window or document for map initialization", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const html = await renderMapPageToHtml(icbs);

        // Ensure no inline script blocks that reference window.L or document.createElement
        // for Leaflet initialization leaked into the SSR output
        expect(html).not.toContain("window.L");
        expect(html).not.toContain("document.createElement");
        expect(html).not.toContain("new L.Map");
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: seo-optimized-pages, Property 9: Map page contains links to all active ICB pages
 *
 * For any set of active ICBs with non-null document_folder_name values, the server-rendered
 * HTML of the map page should contain an <a> element with href="/board/{slug}" for each ICB.
 *
 * We generate random sets of active ICBs (name + slug pairs), render the MapPage component
 * using renderToReadableStream, and verify the HTML contains a link for each ICB.
 *
 * Note: The MapPage component uses React.lazy for the map content and ClientOnly wrapper
 * with useState/useEffect. During SSR, useEffect doesn't run so the fallback is shown.
 * The hidden nav links should still be present in the server-rendered HTML.
 *
 * Validates: Requirements 4.7
 */
describe("Property 9: Map Page Contains Links to All Active ICB Pages", () => {
  // Helper to render MapPage to HTML string
  async function renderMapPage(icbs: Array<{ name: string; slug: string }>): Promise<string> {
    const loaderData = { icbs };
    const element = createElement(MapPage, { loaderData } as any);
    // Wrap in StaticRouter to provide navigation context for <Link> components
    const routerWrapped = createElement(StaticRouter, { location: "/map" }, element);
    const stream = await renderToReadableStream(routerWrapped);
    const reader = stream.getReader();
    let html = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    return html;
  }

  // Arbitrary for generating a valid slug (lowercase alphanumeric with hyphens)
  const slugArb = fc
    .array(
      fc.oneof(
        fc.stringMatching(/^[a-z]{2,8}$/),
        fc.constantFrom("and", "the", "of", "in")
      ),
      { minLength: 1, maxLength: 5 }
    )
    .map((words) => words.join("-"));

  // Arbitrary for generating an ICB name
  const icbNameArb = fc
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
          "Yorkshire"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 1, maxLength: 4 }
    )
    .map((words) => words.join(" "));

  // Arbitrary for generating a set of ICBs with unique slugs
  const icbSetArb = fc
    .array(
      fc.tuple(icbNameArb, slugArb),
      { minLength: 1, maxLength: 20 }
    )
    .map((pairs) => {
      // Ensure unique slugs
      const seen = new Set<string>();
      return pairs
        .filter(([, slug]) => {
          if (seen.has(slug)) return false;
          seen.add(slug);
          return true;
        })
        .map(([name, slug]) => ({ name, slug }));
    })
    .filter((icbs) => icbs.length > 0);

  it("rendered HTML contains an <a> with href=\"/board/{slug}\" for each health board", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const html = await renderMapPage(icbs);

        for (const icb of icbs) {
          expect(html).toContain(`href="/board/${icb.slug}"`);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered HTML contains the ICB name and 'IVF Funding Policy' text for each ICB link", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const html = await renderMapPage(icbs);

        for (const icb of icbs) {
          // React SSR may insert <!-- --> comments between text nodes,
          // so we strip them for cleaner matching
          const cleanHtml = html.replace(/<!--.*?-->/g, "");
          expect(cleanHtml).toContain(`${icb.name} IVF Funding Policy`);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered HTML contains a nav element with aria-label for health board links", async () => {
    await fc.assert(
      fc.asyncProperty(icbSetArb, async (icbs) => {
        const html = await renderMapPage(icbs);

        expect(html).toContain('aria-label="Health Board Policy Pages"');
      }),
      { numRuns: 100 }
    );
  });
});
