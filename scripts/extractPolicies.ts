/**
 * Extracts ICB eligibility criteria from policy PDFs using Gemini's native PDF support.
 *
 * For each ICB folder under documents/policies/, uploads the PDF(s) to Gemini
 * and asks it to extract structured eligibility criteria. Results are written
 * to documents/extracted-policies.json for human review, then can be used to
 * generate a migration.
 *
 * Prerequisites:
 *   - GEMINI_API_KEY in .dev.vars or environment
 *
 * Run with: npx tsx scripts/extractPolicies.ts
 *
 * Options:
 *   --icb "Sussex"          Process a single ICB folder only
 *   --dry-run               List files that would be processed without calling Gemini
 *   --output path.json      Custom output path (default: documents/extracted-policies.json)
 */
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const MODEL = 'gemini-3.1-pro-preview';

// ── Types ──────────────────────────────────────────────────────────────────

interface ExtractedPolicy {
  treatment_type: string; // e.g. "IVF", "ICSI", "IUI", "IVF/ICSI"
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

// ── Config ─────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCUMENTS_DIR = join(__dirname, '..', 'documents', 'policies');

config({ path: join(__dirname, '..', '.dev.vars') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .dev.vars or environment');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ── Prompt ─────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `Role: You are a specialized medical policy analyst expert in NHS Integrated Care Board (ICB) fertility documents. 
Your task is to extract unstructured policy text for each of the assister fertility treatments, to aid patients in finding their eligibility for NHS.

Task Objectives:
1. Deduplicate & Version Control: Process multiple documents. If documents conflict, the newest version takes precedence. If an older document contains a treatment type (e.g., IUI) not mentioned in the newer one, retain the older policy. Never output more than one entry per treatment_type.
2. Inheritance Logic: Most ICBs list "General Criteria" (Age, BMI, Smoking, Living Children) in a shared section. You MUST carry these rules forward to every specific treatment (IVF, ICSI, IUI, etc.) unless a specific section explicitly overrides them. Do not leave these as null in the specific treatment entries.
3. Treatment Splitting: Each entry must have exactly one treatment_type. If a policy covers "IVF/ICSI," you MUST create two separate entries: one for "IVF" and one for "ICSI," even if the criteria are identical.

Data Extraction Schema:
For every treatment found, extract:
- treatment_type: Use exactly "IVF", "ICSI", "IUI", "DI", or "FET". No combined types like "IVF/ICSI".
  IMPORTANT guidance on DI (Donor Insemination) vs IUI:
  - Only extract DI as a SEPARATE entry if the document explicitly defines distinct eligibility criteria or cycle counts for donor insemination that differ from IUI.
  - If the document describes IUI as available with either partner sperm or donor sperm (same criteria, same cycle count), do NOT create a separate DI entry — it's just IUI.
  - If the document mentions donor sperm only in the context of eligibility (e.g. "same-sex couples must complete X self-funded AI/DI cycles"), that is a prerequisite for IVF/IUI, not a separate funded DI treatment.
  - A separate DI entry is appropriate when the document says something like "6 cycles of donor insemination are funded for patients with azoospermia" with its own criteria.
- cycles_offered: Integer. This MUST always be populated. If the document doesn't state a specific number for a treatment, look for it in the general criteria or infer from context (e.g. "up to 6 cycles of IUI/DI" means both IUI and DI get 6). If truly not determinable, use the same value as the most similar treatment (e.g. DI inherits from IUI).
- max_age: Integer (Female). Calculation: "Up to 40" = 40; "Under 40" = 39. This MUST always be populated — inherit from general criteria if not stated in the treatment-specific section.
- min_age: Integer or null.
- bmi_min / bmi_max: Numeric (Female partner).
- amh_min_pmol / fsh_max_iu: Numeric or null.
- iui_rounds_required: Integer (Specifically for IVF/ICSI eligibility). Use 0 if not required.
- endometriosis_priority_access: Boolean.
- smoking_restricted: Boolean (True if "non-smoker" or "must quit" is required).
- living_children_rule: The rule about existing children. Common patterns:
  - "No children from current or previous relationships"
  - "No children from current relationship"
  - "At least one person should have no children from current or previous relationships"
  - "No living children" (either partner)
  Use the exact wording from the document where possible, normalised to a short summary.
- additional_notes: String, max 80 words. MUST include:
  - Referral pathway nuances (e.g. "Referral for assessment after 6 self-funded IUI cycles, or 3 if aged 36+")
  - Clinical-cause bypass rules (e.g. "IVF without delay if known clinical cause and IVF is only effective treatment")
  - Age-dependent cycle variations (e.g. "Under 40: 3 cycles; 40-42: 1 cycle")
  - Same-sex/single person provisions and any self-funded cycle prerequisites
  - Sterilisation exclusions, alcohol rules, or other notable restrictions

Output Requirements:
- Nulls: Use null for any field not found in any provided text.
- Include your confidence score
- Confidence Levels:
  - HIGH: All fields populated, clear treatment sections, no ambiguity
  - MEDIUM: Some fields null, but enough context to infer or make reasonable assumptions
  - LOW: Missing key info, ambiguous treatment definitions, or unclear age/bmi ranges
`;

// ── Response Schema (Controlled Generation) ────────────────────────────────

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    policies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          treatment_type: { type: Type.STRING },
          cycles_offered: { type: Type.INTEGER, nullable: true, minimum: 0, maximum: 20 },
          max_age: { type: Type.INTEGER, nullable: true, minimum: 0, maximum: 100 },
          min_age: { type: Type.INTEGER, nullable: true, minimum: 0, maximum: 100 },
          bmi_min: { type: Type.NUMBER, nullable: true, minimum: 0, maximum: 100 },
          bmi_max: { type: Type.NUMBER, nullable: true, minimum: 0, maximum: 100 },
          amh_min_pmol: { type: Type.NUMBER, nullable: true, minimum: 0, maximum: 200 },
          fsh_max_iu: { type: Type.NUMBER, nullable: true, minimum: 0, maximum: 200 },
          iui_rounds_required: { type: Type.INTEGER, nullable: true, minimum: 0, maximum: 20 },
          endometriosis_priority_access: { type: Type.BOOLEAN, nullable: true },
          smoking_restricted: { type: Type.BOOLEAN, nullable: true },
          living_children_rule: { type: Type.STRING, nullable: true, maxLength: 150 },
          additional_notes: { type: Type.STRING, nullable: true, maxLength: 500 },
        },
        required: [
          'treatment_type',
          'cycles_offered',
          'max_age',
          'min_age',
          'bmi_min',
          'bmi_max',
          'iui_rounds_required',
          'amh_min_pmol',
          'fsh_max_iu',
          'endometriosis_priority_access',
          'smoking_restricted',
          'living_children_rule',
          'additional_notes',
        ],
      },
    },
    extraction_confidence: {
      type: Type.STRING,
      enum: ['high', 'medium', 'low'],
    },
    extraction_notes: { type: Type.STRING, nullable: true, maxLength: 500 },
  },
  required: ['policies', 'extraction_confidence'],
};

// ── Helpers ────────────────────────────────────────────────────────────────

function getIcbFolders(): string[] {
  return readdirSync(DOCUMENTS_DIR)
    .filter(f => {
      const full = join(DOCUMENTS_DIR, f);
      return statSync(full).isDirectory() && f !== '.DS_Store';
    })
    .sort();
}

/** Find all PDF and DOCX files across all year folders for an ICB. Returns { files, years } */
function getDocumentFiles(icbFolder: string): { files: string[]; years: string[] } {
  const icbPath = join(DOCUMENTS_DIR, icbFolder);
  const years = readdirSync(icbPath)
    .filter(f => statSync(join(icbPath, f)).isDirectory())
    .sort(); // ascending — oldest first so Gemini sees them in chronological order

  if (years.length === 0) return { files: [], years: [] };

  const files: string[] = [];
  for (const year of years) {
    const yearPath = join(icbPath, year);
    const yearFiles = readdirSync(yearPath)
      .filter(f => {
        const ext = extname(f).toLowerCase();
        return ext === '.pdf' || ext === '.docx';
      })
      .map(f => join(yearPath, f));
    files.push(...yearFiles);
  }

  return { files, years };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main extraction ────────────────────────────────────────────────────────

async function extractFromIcb(icbFolder: string): Promise<IcbExtraction | null> {
  const { files, years } = getDocumentFiles(icbFolder);

  if (files.length === 0) {
    console.log(`  ⚠ No documents found for ${icbFolder}`);
    return null;
  }

  console.log(`  📄 ${files.length} file(s) from ${years.join(', ')}`);

  // Upload files to Gemini
  const uploadStart = performance.now();
  const uploadedFiles = [];
  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    const mimeType = 'application/pdf';
    const fileName = filePath.split('/').pop();
    const fileSize = statSync(filePath).size;

    try {
      const t0 = performance.now();
      const uploaded = await ai.files.upload({
        file: filePath,
        config: { mimeType },
      });
      uploadedFiles.push(uploaded);
      console.log(`    ✓ uploaded ${fileName} (${(fileSize / 1024).toFixed(0)} KB) in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
    } catch (err) {
      console.error(`    ✗ upload failed for ${fileName}:`, (err as Error).message);
    }
  }
  console.log(`    ⏱ uploads total: ${((performance.now() - uploadStart) / 1000).toFixed(1)}s`);

  if (uploadedFiles.length === 0) {
    return null;
  }

  // Wait for files to be processed
  const processingStart = performance.now();
  for (const file of uploadedFiles) {
    if (!file.name) continue;
    let status = file.state;
    let polls = 0;
    while (status === 'PROCESSING') {
      polls++;
      await sleep(2000);
      const updated = await ai.files.get({ name: file.name });
      status = updated.state;
    }
    if (status === 'FAILED') {
      console.error(`    ✗ processing failed for ${file.name}`);
    } else if (polls > 0) {
      console.log(`    ⏱ ${file.name?.split('/').pop()} processing settled after ${polls} poll(s) (${((performance.now() - processingStart) / 1000).toFixed(1)}s)`);
    }
  }
  if (uploadedFiles.length > 0) {
    console.log(`    ⏱ file processing total: ${((performance.now() - processingStart) / 1000).toFixed(1)}s`);
  }

  // Build content parts — just the files, system instruction handles the prompt
  const parts: Array<{ fileData: { fileUri: string; mimeType: string } } | { text: string }> = [];
  for (const file of uploadedFiles) {
    if (file.uri && file.mimeType) {
      parts.push({ fileData: { fileUri: file.uri, mimeType: file.mimeType } });
    }
  }
  parts.push({ text: `Extract the fertility eligibility policies from these ${icbFolder} ICB documents.` });

  // Call Gemini with controlled generation
  console.log(`    🤖 calling ${MODEL} with ${uploadedFiles.length} file(s) and schema enforcement...`);
  const inferenceStart = performance.now();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
    config: {
      temperature: 0.1, // low temperature for factual extraction
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      systemInstruction: EXTRACTION_PROMPT,
      maxOutputTokens: 16384
    },
  });
  const inferenceTime = ((performance.now() - inferenceStart) / 1000).toFixed(1);

  const usage = response.usageMetadata;
  if (usage) {
    console.log(`    ⏱ inference: ${inferenceTime}s | tokens — prompt: ${usage.promptTokenCount ?? '?'}, response: ${usage.candidatesTokenCount ?? '?'}, total: ${usage.totalTokenCount ?? '?'}`);
  } else {
    console.log(`    ⏱ inference: ${inferenceTime}s (no usage metadata returned)`);
  }

  const text = response.text?.trim();
  if (!text) {
    console.error(`    ✗ empty response from Gemini`);
    return null;
  }

  // Parse the guaranteed-valid JSON response
  let parsed: { policies: ExtractedPolicy[]; extraction_confidence: 'high' | 'medium' | 'low'; extraction_notes: string | null };
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error(`    ✗ failed to parse JSON response:`, text.slice(0, 200));
    return null;
  }

  // Deduplicate by treatment_type — keep the last occurrence (Gemini lists most recent last)
  const seen = new Map<string, ExtractedPolicy>();
  for (const policy of parsed.policies) {
    seen.set(policy.treatment_type, policy);
  }
  parsed.policies = [...seen.values()];

  // Clean up uploaded files
  for (const file of uploadedFiles) {
    if (file.name) {
      try { await ai.files.delete({ name: file.name }); } catch { /* ignore */ }
    }
  }

  return {
    icb_folder_name: icbFolder,
    document_files: files.map(f => f.split('/documents/')[1] || f),
    document_year: years.join(', '),
    extracted_at: new Date().toISOString(),
    policies: parsed.policies,
    extraction_confidence: parsed.extraction_confidence,
    extraction_notes: parsed.extraction_notes,
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const icbFilter = args.includes('--icb') ? args[args.indexOf('--icb') + 1] : null;
  const dryRun = args.includes('--dry-run');
  const outputIdx = args.indexOf('--output');
  const outputPath = outputIdx !== -1
    ? args[outputIdx + 1]
    : join(__dirname, 'output', `extracted-policies-${MODEL}.json`);

  const folders = icbFilter
    ? getIcbFolders().filter(f => f.toLowerCase().includes(icbFilter.toLowerCase()))
    : getIcbFolders();

  console.log(`\nFound ${folders.length} ICB folder(s) to process\n`);

  if (dryRun) {
    for (const folder of folders) {
      const { files, years } = getDocumentFiles(folder);
      console.log(`${folder} (${years.join(', ')}): ${files.map(f => f.split('/').pop()).join(', ') || 'no files'}`);
    }
    return;
  }

  // Load existing results if resuming
  let results: IcbExtraction[] = [];
  if (existsSync(outputPath)) {
    try {
      results = JSON.parse(readFileSync(outputPath, 'utf-8'));
      console.log(`Loaded ${results.length} existing result(s) from ${outputPath}\n`);
    } catch { /* start fresh */ }
  }

  const BATCH_SIZE = 5;
  const alreadyDone = new Set(results.map(r => r.icb_folder_name));
  const pending = folders.filter(f => !alreadyDone.has(f));

  for (const folder of folders.filter(f => alreadyDone.has(f))) {
    console.log(`⏭ ${folder} (already extracted)`);
  }

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    console.log(`\n── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} ICBs) ──`);

    const batchResults = await Promise.allSettled(
      batch.map(async (folder) => {
        console.log(`\n🔍 ${folder}`);
        const result = await extractFromIcb(folder);
        if (result) {
          console.log(`  ✅ ${result.policies.length} policy/policies extracted (${result.extraction_confidence} confidence)`);
        }
        return result;
      })
    );

    for (const settled of batchResults) {
      if (settled.status === 'fulfilled' && settled.value) {
        results.push(settled.value);
      } else if (settled.status === 'rejected') {
        console.error(`  ✗ Error:`, (settled.reason as Error).message);
      }
    }

    // Save after each batch
    writeFileSync(outputPath, JSON.stringify(results, null, 2));


  }

  console.log(`\n✅ Done. ${results.length} ICBs extracted to ${outputPath}`);
  console.log('Review the output and then run: npx tsx scripts/generatePolicyMigration.ts');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
