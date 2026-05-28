/**
 * Extracts publication dates from ICB policy PDFs using Gemini via Vertex AI.
 *
 * For each ICB folder under documents/policies/, uploads the most recent PDF(s)
 * to Gemini and asks it to find the document's publication/effective date.
 * Results are written to scripts/output/extracted-policy-dates.json for review,
 * then can be used to generate a migration updating health_boards.policy_date.
 *
 * Prerequisites:
 *   - Application Default Credentials configured (run: gcloud auth application-default login)
 *   - GOOGLE_CLOUD_PROJECT env var or --project flag
 *   - Vertex AI API enabled on the project
 *
 * Run with: npx tsx scripts/extractPolicyDates.ts
 *
 * Options:
 *   --icb "Sussex"          Process a single ICB folder only
 *   --limit N               Process at most N pending ICBs (default: all)
 *   --dry-run               List files that would be processed without calling Gemini
 *   --output path.json      Custom output path (default: scripts/output/extracted-policy-dates.json)
 *   --project <id>          Google Cloud project ID (or set GOOGLE_CLOUD_PROJECT)
 *   --location <region>     Vertex AI region (default: europe-west2)
 */
import { GoogleGenAI, Type } from '@google/genai';
import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const MODEL = 'gemini-3.5-flash';

// ── Types ──────────────────────────────────────────────────────────────────

interface ExtractedDate {
  icb_folder_name: string;
  document_files: string[];
  publication_date: string | null; // ISO date string YYYY-MM-DD, or null if not found
  date_precision: 'day' | 'month' | 'year'; // how precise the extracted date is
  date_source: string | null; // where in the document the date was found
  confidence: 'high' | 'medium' | 'low';
  extracted_at: string;
}

// ── Config ─────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCUMENTS_DIR = join(__dirname, '..', 'documents', 'policies');
const DEFAULT_OUTPUT = join(__dirname, 'output', 'extracted-policy-dates.json');

// Resolve project and location from CLI args or environment
const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const locationIdx = args.indexOf('--location');

const PROJECT = projectIdx !== -1 ? args[projectIdx + 1] : process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = locationIdx !== -1 ? args[locationIdx + 1] : (process.env.GOOGLE_CLOUD_LOCATION || 'global');

if (!PROJECT) {
  console.error('Missing Google Cloud project. Set GOOGLE_CLOUD_PROJECT or pass --project <id>');
  process.exit(1);
}

const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });

// ── Prompt ─────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are analysing an NHS policy document (or set of documents) to find the publication date of the FERTILITY or ASSISTED CONCEPTION policy specifically.

IMPORTANT: Some documents are compendiums containing many different clinical policies (e.g. hip replacements, cataracts, fertility, etc.). You MUST find the date for the fertility/assisted conception section ONLY. Ignore dates from other policy sections.

Your ONLY task is to find the publication date, effective date, or approval date of the fertility/assisted conception policy.

CRITICAL RULES:
- You MUST only return a date that is EXPLICITLY written in the document text.
- Do NOT infer, estimate, or guess a date. If no date is clearly stated, return null.
- The date_source field must quote the exact text from the document where you found the date.
- If you cannot point to specific text containing the date, return null.
- If the document has a VERSION CONTROL TABLE or REVISION HISTORY, use the date of the MOST RECENT version/revision entry. This takes priority over all other dates as it represents when the document was last updated.

Look for sections with titles like:
- "Specialist Fertility Services"
- "Assisted Conception"
- "IVF", "ICSI", "IUI"
- "Infertility"
- "Subfertility"

Within that section, look for:
- "Date produced", "Date of publication", "Published", "Date published"
- "Effective from", "Effective date", "Implementation date"
- "Approved", "Date approved", "Ratified"
- "Review date" — only use this if you can calculate backwards using a stated review period. Mark confidence as medium.

Priority order (use the first one you find within the fertility section):
1. Most recent entry in a version control table or revision history
2. Explicit publication or effective date from the fertility policy section
3. Approval/ratification date from the fertility policy section
4. Document-level date (header/footer) only if the document is solely about fertility
5. Calculated from review date minus stated review period (medium confidence)

If multiple documents are provided, use the most recent one's date.

Return the date as precisely as you can determine it. If you can only determine the month and year, use day 1. If you can only determine the year, use January 1.
If NO date is found anywhere in the document, return null for publication_date.`;

// ── Response Schema ────────────────────────────────────────────────────────

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    publication_date: {
      type: Type.STRING,
      nullable: true,
      description: 'ISO date YYYY-MM-DD. Null only if absolutely no date can be determined.',
    },
    date_precision: {
      type: Type.STRING,
      enum: ['day', 'month', 'year'],
      description: 'How precise the date is. "day" if exact date found, "month" if only month/year, "year" if only year.',
    },
    date_source: {
      type: Type.STRING,
      nullable: true,
      description: 'Brief description of where the date was found, e.g. "Footer: Published March 2024" or "Page 1: Effective from 1 April 2023"',
    },
    confidence: {
      type: Type.STRING,
      enum: ['high', 'medium', 'low'],
      description: 'high = explicit date clearly stated, medium = inferred from context, low = best guess',
    },
  },
  required: ['publication_date', 'date_precision', 'date_source', 'confidence'],
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

/** Get PDF/DOCX files from the most recent year folder for an ICB. */
function getMostRecentDocuments(icbFolder: string): { files: string[]; year: string } {
  const icbPath = join(DOCUMENTS_DIR, icbFolder);
  const years = readdirSync(icbPath)
    .filter(f => statSync(join(icbPath, f)).isDirectory())
    .sort()
    .reverse(); // most recent first

  if (years.length === 0) return { files: [], year: '' };

  const mostRecentYear = years[0];
  const yearPath = join(icbPath, mostRecentYear);
  const files = readdirSync(yearPath)
    .filter(f => {
      const ext = extname(f).toLowerCase();
      return ext === '.pdf' || ext === '.docx';
    })
    .map(f => join(yearPath, f));

  return { files, year: mostRecentYear };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main extraction ────────────────────────────────────────────────────────

async function extractDateFromIcb(icbFolder: string): Promise<ExtractedDate | null> {
  const { files, year } = getMostRecentDocuments(icbFolder);

  if (files.length === 0) {
    console.log(`  ⚠ No documents found for ${icbFolder}`);
    return null;
  }

  console.log(`  📄 ${files.length} file(s) from ${year}`);

  // Read files and inline as base64 (Vertex AI doesn't support the Files API)
  const parts: Array<{ inlineData: { data: string; mimeType: string } } | { text: string }> = [];
  for (const filePath of files) {
    const mimeType = extname(filePath).toLowerCase() === '.pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const fileName = filePath.split('/').pop();
    const fileBuffer = readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    parts.push({ inlineData: { data: base64Data, mimeType } });
    console.log(`    ✓ loaded ${fileName} (${(fileBuffer.length / 1024).toFixed(0)} KB)`);
  }
  parts.push({ text: `Find the publication or effective date of this ${icbFolder} fertility policy document.` });

  // Call Gemini
  console.log(`    🤖 extracting date...`);
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
    config: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      systemInstruction: EXTRACTION_PROMPT,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    const finishReason = response.candidates?.[0]?.finishReason;
    const safetyRatings = response.candidates?.[0]?.safetyRatings;
    console.error(`    ✗ empty response from Gemini (finishReason: ${finishReason || 'unknown'})`);
    if (safetyRatings) {
      console.error(`      safety: ${JSON.stringify(safetyRatings)}`);
    }
    return null;
  }

  let parsed: {
    publication_date: string | null;
    date_precision: 'day' | 'month' | 'year';
    date_source: string | null;
    confidence: 'high' | 'medium' | 'low';
  };
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error(`    ✗ failed to parse JSON:`, text.slice(0, 200));
    return null;
  }

  // If confidence is not high, or no date found, fall back to the folder year
  if (parsed.confidence !== 'high' || !parsed.publication_date) {
    const reason = !parsed.publication_date ? 'no date found' : `${parsed.confidence} confidence`;
    console.log(`    ⚠ ${reason} — falling back to folder year (${year})`);
    return {
      icb_folder_name: icbFolder,
      document_files: files.map(f => f.split('/documents/')[1] || f),
      publication_date: `${year}-01-01`,
      date_precision: 'year',
      date_source: `Folder year fallback (${reason}${parsed.date_source ? ': ' + parsed.date_source : ''})`,
      confidence: 'low',
      extracted_at: new Date().toISOString(),
    };
  }

  return {
    icb_folder_name: icbFolder,
    document_files: files.map(f => f.split('/documents/')[1] || f),
    publication_date: parsed.publication_date,
    date_precision: parsed.date_precision,
    date_source: parsed.date_source,
    confidence: parsed.confidence,
    extracted_at: new Date().toISOString(),
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

async function main() {
  const icbFilter = args.includes('--icb') ? args[args.indexOf('--icb') + 1] : null;
  const dryRun = args.includes('--dry-run');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
  const outputIdx = args.indexOf('--output');
  const outputPath = outputIdx !== -1 ? args[outputIdx + 1] : DEFAULT_OUTPUT;

  const folders = icbFilter
    ? getIcbFolders().filter(f => f.toLowerCase().includes(icbFilter.toLowerCase()))
    : getIcbFolders();

  console.log(`\nFound ${folders.length} ICB folder(s) to process\n`);

  if (dryRun) {
    for (const folder of folders) {
      const { files, year } = getMostRecentDocuments(folder);
      console.log(`${folder} (${year}): ${files.map(f => f.split('/').pop()).join(', ') || 'no files'}`);
    }
    return;
  }

  // Load existing results if resuming
  let results: ExtractedDate[] = [];
  if (existsSync(outputPath)) {
    try {
      results = JSON.parse(readFileSync(outputPath, 'utf-8'));
      console.log(`Loaded ${results.length} existing result(s) from ${outputPath}\n`);
    } catch { /* start fresh */ }
  }

  const alreadyDone = new Set(results.map(r => r.icb_folder_name));
  const pending = folders.filter(f => !alreadyDone.has(f));

  for (const folder of folders.filter(f => alreadyDone.has(f))) {
    console.log(`⏭ ${folder} (already extracted)`);
  }

  // Process sequentially, respecting --limit
  let processed = 0;
  for (const folder of pending) {
    if (processed >= limit) break;
    console.log(`\n🔍 ${folder}`);
    try {
      const result = await extractDateFromIcb(folder);
      if (result) {
        results.push(result);
        const dateDisplay = result.publication_date || 'not found';
        const precisionNote = result.date_precision !== 'day' ? ` (${result.date_precision} precision)` : '';
        const { year } = getMostRecentDocuments(folder);
        const extractedYear = result.publication_date?.split('-')[0];
        const yearMismatch = extractedYear && extractedYear !== year ? ` ⚠️  folder is ${year}/` : '';
        console.log(`  ✅ ${dateDisplay}${precisionNote} [${result.confidence}]${yearMismatch}`);
      }
    } catch (err) {
      console.error(`  ✗ Error:`, (err as Error).message);
    }

    // Save after each ICB so we can resume
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    processed++;

    // Small delay to avoid rate limits
    await sleep(1000);
  }

  // Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✅ Done. ${results.length} ICBs processed.`);
  console.log(`   Output: ${outputPath}`);

  const withDate = results.filter(r => r.publication_date);
  const dayPrecision = results.filter(r => r.date_precision === 'day');
  const monthPrecision = results.filter(r => r.date_precision === 'month');
  const yearOnly = results.filter(r => r.date_precision === 'year');

  console.log(`   Dates found: ${withDate.length}/${results.length}`);
  console.log(`   Precision: ${dayPrecision.length} day, ${monthPrecision.length} month, ${yearOnly.length} year-only`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
