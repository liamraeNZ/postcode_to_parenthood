import { describe, it, expect } from "vitest";
import { renderToReadableStream } from "react-dom/server";
import React, { createElement } from "react";
import { StaleDataWarning } from "./StaleDataWarning";

/**
 * Tests for StaleDataWarning component.
 * Uses server-side rendering since the project runs in Cloudflare's workerd environment.
 */

async function renderToString(element: React.ReactElement): Promise<string> {
  const stream = await renderToReadableStream(element);
  const reader = stream.getReader();
  let html = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += new TextDecoder().decode(value);
  }
  return html;
}

describe("StaleDataWarning", () => {
  it("renders nothing when last_verified is less than 6 months ago", async () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: threeMonthsAgo.toISOString(),
        icbName: "NHS North West London ICB",
      })
    );
    expect(html).toBe("");
  });

  it("renders nothing when last_verified is exactly 6 months ago", async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: sixMonthsAgo.toISOString(),
        icbName: "NHS North West London ICB",
      })
    );
    expect(html).toBe("");
  });

  it("renders warning when last_verified is more than 6 months ago", async () => {
    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: eightMonthsAgo.toISOString(),
        icbName: "NHS North West London ICB",
      })
    );

    // React SSR inserts <!-- --> comment nodes around interpolated values
    expect(html).toMatch(/last verified.*8.*months ago/);
    expect(html).toContain("NHS North West London ICB");
  });

  it("displays the correct number of months", async () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: twelveMonthsAgo.toISOString(),
        icbName: "Surrey Heartlands ICB",
      })
    );

    expect(html).toMatch(/last verified.*12.*months ago/);
  });

  it("uses subtle, muted styling (italic, small text, reduced opacity)", async () => {
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: nineMonthsAgo.toISOString(),
        icbName: "NHS Sussex ICB",
      })
    );

    expect(html).toContain("text-xs");
    expect(html).toContain("italic");
    expect(html).toContain("text-deep-slate/50");
  });

  it("includes recommendation to check with ICB or GP", async () => {
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    const html = await renderToString(
      createElement(StaleDataWarning, {
        lastVerified: sevenMonthsAgo.toISOString(),
        icbName: "NHS Kent ICB",
      })
    );

    expect(html).toContain("NHS Kent ICB");
    expect(html).toContain("your GP");
    expect(html).toContain("most current information");
  });
});
