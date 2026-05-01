/**
 * Generate ONS-to-ODS Code Lookup JSON
 *
 * Reads the TopoJSON boundary file and the ICB migrations SQL to produce
 * a mapping from ONS geography codes (E54000xxx) to ODS codes (the icbs.id
 * primary key in D1).
 *
 * The boundary file uses April 2023 ICB boundaries (42 individual ICBs),
 * while the database may have merged ICBs (e.g. "Central East", "Essex",
 * "Norfolk and Suffolk", "Surrey and Sussex", "Thames Valley",
 * "West and North London"). For merged ICBs, we map boundary features to
 * the appropriate parent or sub-ICB ODS code.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TOPOJSON_PATH = "public/data/icb-boundaries.topojson";
const SQL_PATH = "migrations/0002_icbs.sql";
const OUTPUT_PATH = "app/data/ons-to-ods.json";

interface TopoGeometry {
  properties: {
    icb23cd: string;
    icb23nm: string;
    [key: string]: unknown;
  };
}

interface TopoJSON {
  objects: {
    icbs: {
      geometries: TopoGeometry[];
    };
  };
}

interface DbIcb {
  id: string;
  name: string;
  subIcbCode: string | null;
  parentIcbCode: string | null;
}

/**
 * Normalise an ICB name for fuzzy matching:
 * - lowercase
 * - remove "nhs" prefix
 * - remove "integrated care board" suffix
 * - remove extra whitespace
 * - trim
 */
function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bnhs\b/g, "")
    .replace(/\bintegrated care board\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse the SQL file to extract ICB records (id, name, sub_icb_code, parent_icb_code)
 */
function parseIcbsFromSql(sqlContent: string): DbIcb[] {
  const icbs: DbIcb[] = [];

  // Match INSERT VALUES tuples
  const valuePattern =
    /\('([^']+)',\s*'([^']+)',\s*(NULL|'[^']*'),\s*(NULL|'[^']*'),/g;
  let match: RegExpExecArray | null;

  while ((match = valuePattern.exec(sqlContent)) !== null) {
    const id = match[1];
    const name = match[2];
    const subIcbCode = match[3] === "NULL" ? null : match[3].replace(/'/g, "");
    const parentIcbCode =
      match[4] === "NULL" ? null : match[4].replace(/'/g, "");

    icbs.push({ id, name, subIcbCode, parentIcbCode });
  }

  return icbs;
}

/**
 * Manual overrides for boundary names that don't match database names
 * due to ICB mergers/renames in April 2026.
 *
 * Maps normalised boundary name → ODS code
 */
const MANUAL_OVERRIDES: Record<string, string> = {
  // Merged into "NHS Central East ICB" (S1Y5D) — sub-ICBs:
  // - Bedfordshire, Luton and Milton Keynes (M1J4Y)
  // - Cambridgeshire and Peterborough (06H)
  "bedfordshire, luton and milton keynes": "M1J4Y",
  "cambridgeshire and peterborough": "06H",

  // Merged into "NHS Essex ICB" (D7T5G) — sub-ICB:
  // - Mid and South Essex (99E)
  "mid and south essex": "99E",

  // Merged into "NHS Norfolk and Suffolk ICB" (T6Y0W) — sub-ICBs:
  // - Norfolk and Waveney (06L)
  // - Suffolk and North East Essex (07K)
  "norfolk and waveney": "06L",
  "suffolk and north east essex": "07K",

  // Merged into "NHS Surrey and Sussex ICB" (S9B9J) — sub-ICBs:
  // - Surrey Heartlands (92A)
  // - Sussex (09D)
  "surrey heartlands": "92A",
  "sussex": "09D",

  // Merged into "NHS Thames Valley ICB" (S0E4D) — sub-ICBs:
  // - Buckinghamshire, Oxfordshire and Berkshire West (10Q)
  // - Frimley (D4U1Y) — note: Frimley is under Hampshire parent but also sub of Thames Valley
  "buckinghamshire, oxfordshire and berkshire west": "10Q",

  // Merged into "NHS West and North London ICB" (Z9B2Z) — sub-ICBs:
  // - North Central London (07P)
  // - North West London (08Y)
  "north central london": "07P",
  "north west london": "08Y",

  // Frimley is a sub-ICB of Hampshire and Isle of Wight (QRL)
  "frimley": "D4U1Y",
};

function main() {
  console.log("Generating ONS-to-ODS code mapping...\n");

  // 1. Read TopoJSON
  const topoContent = readFileSync(TOPOJSON_PATH, "utf-8");
  const topo: TopoJSON = JSON.parse(topoContent);
  const geometries = topo.objects.icbs.geometries;
  console.log(`Read ${geometries.length} boundary features from TopoJSON`);

  // 2. Read SQL and parse ICBs
  const sqlContent = readFileSync(SQL_PATH, "utf-8");
  const dbIcbs = parseIcbsFromSql(sqlContent);
  const parentIcbs = dbIcbs.filter((icb) => icb.parentIcbCode === null);
  const subIcbs = dbIcbs.filter((icb) => icb.parentIcbCode !== null);
  console.log(
    `Parsed ${dbIcbs.length} ICB records from SQL (${parentIcbs.length} parents, ${subIcbs.length} sub-ICBs)`
  );

  // 3. Build normalised name → ODS code lookup from all ICBs
  const nameToOds = new Map<string, string>();
  for (const icb of dbIcbs) {
    const normalised = normaliseName(icb.name);
    nameToOds.set(normalised, icb.id);
  }

  // 4. Match each boundary feature
  const mapping: Record<string, string> = {};
  const unmatched: Array<{ code: string; name: string }> = [];

  for (const geom of geometries) {
    const onsCode = geom.properties.icb23cd;
    const boundaryName = geom.properties.icb23nm;
    const normBoundary = normaliseName(boundaryName);

    // Try manual override first
    if (MANUAL_OVERRIDES[normBoundary]) {
      mapping[onsCode] = MANUAL_OVERRIDES[normBoundary];
      continue;
    }

    // Try exact normalised match against all DB ICBs
    if (nameToOds.has(normBoundary)) {
      mapping[onsCode] = nameToOds.get(normBoundary)!;
      continue;
    }

    // Try substring matching: find a DB ICB whose normalised name contains
    // the boundary name or vice versa
    let found = false;
    for (const [dbNorm, odsCode] of nameToOds.entries()) {
      if (dbNorm.includes(normBoundary) || normBoundary.includes(dbNorm)) {
        mapping[onsCode] = odsCode;
        found = true;
        break;
      }
    }

    if (!found) {
      unmatched.push({ code: onsCode, name: boundaryName });
    }
  }

  // 5. Log results
  console.log(`\nMatched: ${Object.keys(mapping).length} / ${geometries.length}`);

  if (unmatched.length > 0) {
    console.warn("\n⚠ Unmatched boundary features:");
    for (const { code, name } of unmatched) {
      console.warn(`  ${code} — ${name}`);
    }
  }

  // 6. Write output
  const outputDir = OUTPUT_PATH.substring(0, OUTPUT_PATH.lastIndexOf("/"));
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(mapping, null, 2), "utf-8");
  console.log(`\n✓ Written ${Object.keys(mapping).length} entries to ${OUTPUT_PATH}`);
}

main();
