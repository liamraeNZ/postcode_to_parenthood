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
import { GoogleGenAI } from '@google/genai';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

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
  wait_time_months: number | null;
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

const MODEL = 'gemini-3.1-flash-lite-preview';

// ── Prompt ─────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are an expert at reading NHS Integrated Care Board (ICB) fertility policy documents.

Extract ALL distinct treatment eligibility policies from these documents. Many ICBs have separate criteria for different treatment types (IVF, ICSI, IUI, etc.). Extract each as a separate policy entry.

IMPORTANT: You may receive multiple documents from different years for the same ICB. When the same treatment type is covered in more than one document, always use the criteria from the MOST RECENT document. However, if an older document covers a treatment type that the newer document does not mention at all, include that older policy too. Never output more than one entry per treatment_type — each treatment_type must appear exactly once in the output.

For each treatment policy found, extract these fields:

- treatment_type: The treatment this policy covers. Use one of: "IVF", "ICSI", "IUI", "DI" (donor insemination), "FET" (frozen embryo transfer), or describe if other. IMPORTANT: If the policy covers IVF and ICSI together (which is common), you MUST output TWO separate entries — one with treatment_type "IVF" and one with treatment_type "ICSI". Even if the criteria are identical, always split them into separate entries. Never use "IVF/ICSI" as a combined type.
- cycles_offered: Number of funded cycles/attempts offered (integer). For IUI this is often 6.
- max_age: Maximum age for the female partner at time of treatment (integer). Look for phrases like "up to X", "under X", "not yet reached Xth birthday". "Up to 40" means max_age=40. "Under 40" means max_age=39.
- min_age: Minimum age if specified (integer), often not stated.
- bmi_min: Minimum BMI required for the female partner (number). Often 19 or not specified.
- bmi_max: Maximum BMI for the female partner (number). Often 30 but can be 35 or other values. Some policies specify different BMI for male vs female — extract the FEMALE partner's BMI max.
- amh_min_pmol: Minimum AMH level in pmol/L if specified (number).
- fsh_max_iu: Maximum FSH level in IU/L if specified (number).
- iui_rounds_required: Number of IUI rounds required before IVF funding (integer). 0 if not required. This only applies to IVF/ICSI policies.
- wait_time_months: Months of trying to conceive naturally before eligible (integer). Often 24 or 36 months.
- endometriosis_priority_access: Whether patients with endometriosis get priority/expedited access (true/false).
- smoking_restricted: Whether there is a smoking restriction — e.g. must be non-smoker or have quit (true/false).
- living_children_rule: The rule about existing children. Common patterns:
  - "No children from current or previous relationships"
  - "No children from current relationship"
  - "At least one person should have no children from current or previous relationships"
  - "No living children" (either partner)
  Use the exact wording from the document where possible, normalised to a short summary.
- additional_notes: Any other notable eligibility criteria not captured above (e.g. alcohol restrictions, specific medical conditions, same-sex couple provisions, previous sterilisation rules).

Also provide:
- extraction_confidence: "high" if the document clearly states criteria, "medium" if some interpretation was needed, "low" if the document is vague or criteria are unclear.
- extraction_notes: Any notes about ambiguity, missing information, or assumptions made.

Respond with valid JSON only, no markdown fencing. Use this exact structure:
{
  "policies": [ ... array of policy objects ... ],
  "extraction_confidence": "high|medium|low",
  "extraction_notes": "string or null"
}

If a field cannot be determined from the document, use null.`;

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
  const uploadedFiles = [];
  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    const mimeType = ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    try {
      const uploaded = await ai.files.upload({
        file: filePath,
        config: { mimeType },
      });
      uploadedFiles.push(uploaded);
      console.log(`    ✓ uploaded ${filePath.split('/').pop()}`);
    } catch (err) {
      console.error(`    ✗ upload failed for ${filePath.split('/').pop()}:`, (err as Error).message);
    }
  }

  if (uploadedFiles.length === 0) {
    return null;
  }

  // Wait for files to be processed
  for (const file of uploadedFiles) {
    if (!file.name) continue;
    let status = file.state;
    while (status === 'PROCESSING') {
      await sleep(2000);
      const updated = await ai.files.get({ name: file.name });
      status = updated.state;
    }
    if (status === 'FAILED') {
      console.error(`    ✗ processing failed for ${file.name}`);
    }
  }

  // Build content parts
  const parts: Array<{ fileData: { fileUri: string; mimeType: string } } | { text: string }> = [];
  for (const file of uploadedFiles) {
    if (file.uri && file.mimeType) {
      parts.push({ fileData: { fileUri: file.uri, mimeType: file.mimeType } });
    }
  }
  parts.push({ text: EXTRACTION_PROMPT });

  // Call Gemini
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
    config: {
      temperature: 0.1, // low temperature for factual extraction
    },
  });

  const text = response.text?.trim();
  if (!text) {
    console.error(`    ✗ empty response from Gemini`);
    return null;
  }

  // Parse JSON response (strip markdown fencing if present)
  let parsed: { policies: ExtractedPolicy[]; extraction_confidence: 'high' | 'medium' | 'low'; extraction_notes: string | null };
  try {
    const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    parsed = JSON.parse(jsonStr);
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
    : join(__dirname, '..', 'documents', 'extracted-policies.json');

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
