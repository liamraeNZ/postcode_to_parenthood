/**
 * Fetch ICB Boundaries and convert to TopoJSON
 *
 * Downloads GeoJSON from the NIHR Open Data API, converts to TopoJSON
 * with quantization/simplification to keep the file ≤300KB gzipped.
 *
 * Data source: NIHR Open Data Soft — ICB Boundaries
 * License: Open Government Licence v3.0
 * https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { topology } from "topojson-server";
import { presimplify, simplify, quantile } from "topojson-simplify";

const GEOJSON_URL =
  "https://nihr.opendatasoft.com/api/explore/v2.1/catalog/datasets/icb-boundaries/exports/geojson/";
const OUTPUT_DIR = "static/data";
const OUTPUT_PATH = `${OUTPUT_DIR}/icb-boundaries.topojson`;
const MAX_GZIPPED_BYTES = 300 * 1024; // 300KB

async function main() {
  console.log("Fetching ICB boundary GeoJSON from NIHR Open Data API...");
  const response = await fetch(GEOJSON_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GeoJSON: ${response.status} ${response.statusText}`
    );
  }

  const geojson = await response.json();
  console.log(
    `Downloaded GeoJSON with ${geojson.features?.length ?? 0} features`
  );

  // Normalise property names to lowercase for consistency
  for (const feature of geojson.features) {
    const props = feature.properties;
    const normalised: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      normalised[key.toLowerCase()] = value;
    }
    feature.properties = normalised;
  }

  // Convert to TopoJSON with quantization for smaller file size
  console.log("Converting to TopoJSON...");
  let topo = topology({ icbs: geojson }, 1e4);

  // Check gzipped size and only simplify if needed
  let gzipped = gzipSync(JSON.stringify(topo));
  console.log(`Initial gzipped size: ${(gzipped.length / 1024).toFixed(1)}KB`);

  if (gzipped.length > MAX_GZIPPED_BYTES) {
    console.log("Applying simplification to reduce file size...");
    topo = presimplify(topo as any) as any;

    // Try progressively more aggressive simplification
    const thresholds = [0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.03, 0.01];
    for (const p of thresholds) {
      const minWeight = quantile(topo as any, p);
      const simplified = simplify(topo as any, minWeight) as any;
      const testGzipped = gzipSync(JSON.stringify(simplified));
      console.log(
        `  Simplification (p=${p}): ${(testGzipped.length / 1024).toFixed(1)}KB`
      );

      // Verify arcs are not all empty
      const hasValidArcs = simplified.arcs.some((arc: number[][]) => arc.length >= 2);
      if (testGzipped.length <= MAX_GZIPPED_BYTES && hasValidArcs) {
        topo = simplified;
        gzipped = testGzipped;
        console.log(`  ✓ Using p=${p} (${(gzipped.length / 1024).toFixed(1)}KB, valid geometry)`);
        break;
      } else if (!hasValidArcs) {
        console.log(`  ✗ p=${p} removed too much geometry, skipping`);
      }
    }
  }

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write the TopoJSON file
  const output = JSON.stringify(topo);
  writeFileSync(OUTPUT_PATH, output, "utf-8");

  const fileSizeKB = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
  const gzippedSizeKB = (gzipped.length / 1024).toFixed(1);

  console.log(`\n✓ Written to ${OUTPUT_PATH}`);
  console.log(`  Raw size:    ${fileSizeKB}KB`);
  console.log(`  Gzipped:     ${gzippedSizeKB}KB`);
  console.log(
    `  Features:    ${geojson.features.length} ICB boundaries`
  );
  console.log(`  License:     Open Government Licence v3.0`);

  if (gzipped.length > MAX_GZIPPED_BYTES) {
    console.warn(
      `\n⚠ Warning: Gzipped size (${gzippedSizeKB}KB) exceeds 300KB target`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
