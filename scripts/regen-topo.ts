import { writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { topology } from "topojson-server";

async function main() {
  console.log("Fetching GeoJSON...");
  const res = await fetch(
    "https://nihr.opendatasoft.com/api/explore/v2.1/catalog/datasets/icb-boundaries/exports/geojson/"
  );
  const geojson = await res.json();
  console.log(`Got ${geojson.features.length} features`);

  // Strip to only needed properties to reduce file size
  for (const feature of geojson.features) {
    const props = feature.properties;
    feature.properties = {
      icb23cd: (props.icb23cd || props.ICB23CD || "").toString(),
      icb23nm: (props.icb23nm || props.ICB23NM || "").toString(),
    };
  }

  // Convert with quantization
  const topo = topology({ icbs: geojson }, 1e4);
  const output = JSON.stringify(topo);
  const gzipped = gzipSync(output);
  console.log(`Raw: ${(output.length / 1024).toFixed(1)}KB`);
  console.log(`Gzipped: ${(gzipped.length / 1024).toFixed(1)}KB`);
  writeFileSync("static/data/icb-boundaries.topojson", output);
  console.log("Done!");
}

main().catch(console.error);
