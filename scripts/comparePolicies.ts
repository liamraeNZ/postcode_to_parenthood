/**
 * Compares two extracted-policies JSON files to find differences between model outputs.
 *
 * Run with: npx tsx scripts/comparePolicies.ts
 *
 * Options:
 *   --a path.json    First file (default: output/extracted-policies-gemin-3.1-pro-preview.json)
 *   --b path.json    Second file (default: output/extracted-policies-gemini-3.1-flash-lite-preview.json)
 */
import { readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ExtractedPolicy {
  treatment_type: string;
  cycles_offered: number | null;
  max_age: number | null;
  min_age: number | null;
  bmi_min: number | null;
  bmi_max: number | null;
  amh_min_pmol: number | null;
  fsh_max_iu: number | null;
  iui_rounds_required: number | null;
  endometriosis_priority_access: boolean | null;
  smoking_restricted: boolean | null;
  living_children_rule: string | null;
  additional_notes: string | null;
}

interface IcbExtraction {
  icb_folder_name: string;
  policies: ExtractedPolicy[];
  extraction_confidence: 'high' | 'medium' | 'low';
  extraction_notes: string | null;
}

const args = process.argv.slice(2);
const aIdx = args.indexOf('--a');
const bIdx = args.indexOf('--b');
const fileA = aIdx !== -1 ? args[aIdx + 1] : join(__dirname, 'output', 'extracted-policies-gemin-3.1-pro-preview.json');
const fileB = bIdx !== -1 ? args[bIdx + 1] : join(__dirname, 'output', 'extracted-policies-gemini-3.1-flash-lite-preview.json');

const dataA: IcbExtraction[] = JSON.parse(readFileSync(fileA, 'utf-8'));
const dataB: IcbExtraction[] = JSON.parse(readFileSync(fileB, 'utf-8'));

const nameA = basename(fileA);
const nameB = basename(fileB);

console.log(`\nComparing:\n  A: ${nameA} (${dataA.length} ICBs)\n  B: ${nameB} (${dataB.length} ICBs)\n`);

// Index by ICB folder name
const mapA = new Map(dataA.map(d => [d.icb_folder_name, d]));
const mapB = new Map(dataB.map(d => [d.icb_folder_name, d]));

const allIcbs = [...new Set([...mapA.keys(), ...mapB.keys()])].sort();

const POLICY_FIELDS: (keyof ExtractedPolicy)[] = [
  'treatment_type', 'cycles_offered', 'max_age', 'min_age',
  'bmi_min', 'bmi_max', 'amh_min_pmol', 'fsh_max_iu',
  'iui_rounds_required', 'endometriosis_priority_access',
  'smoking_restricted',
];

let totalDiffs = 0;
let totalFields = 0;
let icbsWithDiffs = 0;
const confidenceMismatches: string[] = [];

for (const icb of allIcbs) {
  const a = mapA.get(icb);
  const b = mapB.get(icb);

  if (!a && b) {
    console.log(`⚠ ${icb}: only in B`);
    continue;
  }
  if (a && !b) {
    console.log(`⚠ ${icb}: only in A`);
    continue;
  }
  if (!a || !b) continue;

  // Compare confidence
  if (a.extraction_confidence !== b.extraction_confidence) {
    confidenceMismatches.push(`${icb}: A=${a.extraction_confidence}, B=${b.extraction_confidence}`);
  }

  // Index policies by treatment_type
  const policiesA = new Map(a.policies.map(p => [p.treatment_type, p]));
  const policiesB = new Map(b.policies.map(p => [p.treatment_type, p]));
  const allTreatments = [...new Set([...policiesA.keys(), ...policiesB.keys()])].sort();

  const icbDiffs: string[] = [];

  for (const treatment of allTreatments) {
    const pA = policiesA.get(treatment);
    const pB = policiesB.get(treatment);

    if (!pA && pB) {
      icbDiffs.push(`  ${treatment}: only in B`);
      continue;
    }
    if (pA && !pB) {
      icbDiffs.push(`  ${treatment}: only in A`);
      continue;
    }
    if (!pA || !pB) continue;

    for (const field of POLICY_FIELDS) {
      if (field === 'treatment_type') continue;
      const valA = pA[field];
      const valB = pB[field];
      totalFields++;

      if (JSON.stringify(valA) !== JSON.stringify(valB)) {
        totalDiffs++;
        icbDiffs.push(`  ${treatment}.${field}: A=${JSON.stringify(valA)} | B=${JSON.stringify(valB)}`);
      }
    }
  }

  if (icbDiffs.length > 0) {
    icbsWithDiffs++;
    console.log(`\n── ${icb} ──`);
    icbDiffs.forEach(d => console.log(d));
  }
}

// Summary
console.log(`\n${'═'.repeat(60)}`);
console.log(`SUMMARY`);
console.log(`${'═'.repeat(60)}`);
console.log(`ICBs compared: ${allIcbs.length}`);
console.log(`ICBs with differences: ${icbsWithDiffs}`);
console.log(`Total field comparisons: ${totalFields}`);
console.log(`Total differences: ${totalDiffs} (${totalFields > 0 ? ((totalDiffs / totalFields) * 100).toFixed(1) : 0}%)`);

if (confidenceMismatches.length > 0) {
  console.log(`\nConfidence mismatches (${confidenceMismatches.length}):`);
  confidenceMismatches.forEach(m => console.log(`  ${m}`));
}

console.log('');
