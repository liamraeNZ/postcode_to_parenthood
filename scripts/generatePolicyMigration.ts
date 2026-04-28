/**
 * Generates migrations/0003_icb_policies.sql from the extracted policy JSON.
 *
 * Reads documents/extracted-policies.json and produces INSERT statements
 * for every extracted policy (all treatment types).
 *
 * Run with: npx tsx scripts/generatePolicyMigration.ts
 *
 * Options:
 *   --input path.json       Custom input path (default: documents/extracted-policies.json)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
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
  document_files: string[];
  document_year: string;
  extracted_at: string;
  policies: ExtractedPolicy[];
  extraction_confidence: 'high' | 'medium' | 'low';
  extraction_notes: string | null;
}

const FOLDER_TO_ICB: Record<string, { where: string }> = {
  'Bath and North East Somerset, Swindon and Wiltshire': { where: "id = 'QOX' AND sub_icb_code IS NULL" },
  'Bedfordshire, Luton and Milton Keynes': { where: "sub_icb_code = 'M1J4Y'" },
  'Birmingham and Solihull': { where: "id = 'QHL' AND sub_icb_code IS NULL" },
  'Black Country': { where: "id = 'QUA' AND sub_icb_code IS NULL" },
  'Bristol, North Somerset and South Gloucestershire': { where: "id = 'QUY' AND sub_icb_code IS NULL" },
  'Buckinghamshire, Oxfordshire and Berkshire West': { where: "sub_icb_code = '10Q'" },
  'Cambridgeshire and Peterborough': { where: "sub_icb_code = '06H'" },
  'Cornwall and the Isles of Scilly': { where: "id = 'QT6' AND sub_icb_code IS NULL" },
  'Coventry and Warwickshire': { where: "id = 'QWU' AND sub_icb_code IS NULL" },
  'Derby and Derbyshire': { where: "id = 'QJ2' AND sub_icb_code IS NULL" },
  'Devon': { where: "id = 'QJK' AND sub_icb_code IS NULL" },
  'Dorset': { where: "id = 'QVV' AND sub_icb_code IS NULL" },
  'Frimley': { where: "sub_icb_code = 'D4U1Y'" },
  'Gloucestershire': { where: "id = 'QR1' AND sub_icb_code IS NULL" },
  'Hampshire and Isle of Wight': { where: "id = 'QRL' AND sub_icb_code IS NULL" },
  'Herefordshire and Worcestershire': { where: "id = 'QGH' AND sub_icb_code IS NULL" },
  'Hertfordshire and West Essex': { where: "id = 'QM7' AND sub_icb_code IS NULL" },
  'Kent and Medway': { where: "id = 'QKS' AND sub_icb_code IS NULL" },
  'Lancashire and South Cumbria': { where: "id = 'QE1' AND sub_icb_code IS NULL" },
  'Lincolnshire': { where: "id = 'QJM' AND sub_icb_code IS NULL" },
  'Mid and South Essex': { where: "sub_icb_code = '99E'" },
  'Norfolk and Waveney': { where: "sub_icb_code = '06L'" },
  'North Central London': { where: "sub_icb_code = '07P'" },
  'North East and North Cumbria': { where: "id = 'QHM' AND sub_icb_code IS NULL" },
  'North East London': { where: "id = 'QMF' AND sub_icb_code IS NULL" },
  'North West London': { where: "sub_icb_code = '08Y'" },
  'Northamptonshire': { where: "id = 'QPM' AND sub_icb_code IS NULL" },
  'Nottingham and Nottinghamshire': { where: "id = 'QT1' AND sub_icb_code IS NULL" },
  'Shropshire, Telford and Wrekin': { where: "id = 'QOC' AND sub_icb_code IS NULL" },
  'Somerset': { where: "id = 'QSL' AND sub_icb_code IS NULL" },
  'South East London': { where: "id = 'QKK' AND sub_icb_code IS NULL" },
  'South West London': { where: "id = 'QWE' AND sub_icb_code IS NULL" },
  'South Yorkshire': { where: "id = 'QF7' AND sub_icb_code IS NULL" },
  'Staffordshire and Stoke-on-Trent': { where: "id = 'QNC' AND sub_icb_code IS NULL" },
  'Suffolk and North East Essex': { where: "sub_icb_code = '07K'" },
  'Surrey Heartlands': { where: "sub_icb_code = '92A'" },
  'Sussex': { where: "sub_icb_code = '09D'" },
  'West Yorkshire': { where: "id = 'QWO' AND sub_icb_code IS NULL" },
};

const TREATMENT_TYPE_MAP: Record<string, string> = {
  'IVF': 'ivf',
  'ICSI': 'icsi',
  'IUI': 'iui',
  'DI': 'di',
  'FET': 'fet',
};

function sqlVal(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'number') return String(v);
  return `'${v.replace(/'/g, "''")}'`;
}

function generateInserts(extraction: IcbExtraction): string[] {
  const icbLookup = FOLDER_TO_ICB[extraction.icb_folder_name];
  if (!icbLookup) {
    return [`-- ⚠ No ICB mapping for folder: ${extraction.icb_folder_name}`];
  }

  const statements: string[] = [];
  statements.push(`-- ${extraction.icb_folder_name} (${extraction.extraction_confidence} confidence, ${extraction.document_year})`);

  for (const p of extraction.policies) {
    const typeId = TREATMENT_TYPE_MAP[p.treatment_type];
    if (!typeId) {
      statements.push(`-- ⚠ Unknown treatment type: ${p.treatment_type}`);
      continue;
    }

    const slug = extraction.icb_folder_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').slice(0, 30);
    const id = `pol-${typeId}-${slug}`;

    const cols = [
      'id', 'icb_id', 'treatment_type_id', 'effective_from',
      'cycles_offered', 'min_age', 'max_age', 'bmi_min', 'bmi_max',
      'amh_min_pmol', 'fsh_max_iu',
      'iui_rounds_required',
      'endometriosis_priority_access', 'smoking_restricted',
      'living_children_rule',
    ];

    const vals = [
      sqlVal(id),
      'id', // selected from icbs
      sqlVal(typeId),
      "'2025-09-11'",
      sqlVal(p.cycles_offered ?? 0),
      sqlVal(p.min_age),
      sqlVal(p.max_age ?? 0),
      sqlVal(p.bmi_min),
      sqlVal(p.bmi_max),
      sqlVal(p.amh_min_pmol),
      sqlVal(p.fsh_max_iu),
      sqlVal(p.iui_rounds_required ?? 0),
      sqlVal(p.endometriosis_priority_access ?? false),
      sqlVal(p.smoking_restricted ?? true),
      sqlVal(p.living_children_rule),
    ];

    statements.push(
      `INSERT OR IGNORE INTO icb_policies (${cols.join(', ')})`,
      `SELECT ${vals.join(', ')}`,
      `FROM icbs WHERE ${icbLookup.where} LIMIT 1; --> statement-breakpoint`,
      '',
    );
  }

  return statements;
}

function main() {
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf('--input');
  const inputPath = inputIdx !== -1
    ? args[inputIdx + 1]
    : join(__dirname, '..', 'scripts', 'output', 'extracted-policies.json');

  const outputPath = join(__dirname, '..', 'migrations', '0003_icb_policies.sql');

  const data: IcbExtraction[] = JSON.parse(readFileSync(inputPath, 'utf-8'));
  console.log(`Loaded ${data.length} ICB extractions`);

  const lines: string[] = [
    '-- ICB policy seed data (generated from extracted PDF policies)',
    `-- Generated: ${new Date().toISOString()}`,
    `-- Source: ${data.length} ICB policy documents via scripts/extractPolicies.ts`,
    '',
  ];

  let insertCount = 0;
  for (const extraction of data) {
    const stmts = generateInserts(extraction);
    lines.push(...stmts);
    insertCount += stmts.filter(s => s.startsWith('INSERT')).length;
  }

  // Remove trailing statement-breakpoint from last statement
  const sql = lines.join('\n').replace(/--> statement-breakpoint\n*$/, '').trimEnd() + '\n';

  writeFileSync(outputPath, sql);
  console.log(`Written ${insertCount} INSERT statements to ${outputPath}`);
}

main();
