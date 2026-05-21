/**
 * Generate OG image (1200x630 PNG) from the SVG template.
 *
 * Usage: npx tsx scripts/generate-og-image.ts
 *
 * Requires: sharp (install with `npm install --save-dev sharp`)
 * Or alternatively, open public/og-image.svg in a browser and screenshot at 1200x630.
 *
 * For now, the SVG is served directly. Most modern platforms (Twitter, LinkedIn, Slack)
 * support SVG OG images, but Facebook requires PNG/JPG. Generate the PNG for full
 * compatibility before launch.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    const sharp = await import("sharp");
    const svgPath = resolve(__dirname, "../public/og-image.svg");
    const pngPath = resolve(__dirname, "../public/og-image.png");

    const svgBuffer = readFileSync(svgPath);
    await sharp.default(svgBuffer).resize(1200, 630).png().toFile(pngPath);

    console.log("✓ Generated public/og-image.png (1200x630)");
  } catch (err) {
    console.error(
      "Could not generate PNG. Install sharp (`npm install --save-dev sharp`) or manually export the SVG.\n",
      err
    );
    process.exit(1);
  }
}

main();
