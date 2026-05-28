/**
 * Applies extracted policy dates to the project:
 *
 * 1. Generates a D1 migration to update health_boards.policy_date
 * 2. Renames local year folders where the extracted year differs from the current folder
 * 3. Prints instructions for syncing R2
 *
 * Prerequisites:
 *   - scripts/output/extracted-policy-dates.json must exist (run extractPolicyDates.ts first)
 *
 * Run with: npx tsx scripts/applyPolicyDates.ts
 *
 * Options:
 *   --dry-run               Show what would change without making modifications
 *   --skip-migration        Skip generating the SQL migration
 *   --skip-rename           Skip renaming local folders
 */
import { readFileSync, readdirSync, renameSync, existsSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT_PATH = join(__dirname, 'output', 'extracted-policy-dates.json');
const DOCUMENTS_DIR = join(__dirname, '..', 'documents', 'policies');
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

interface ExtractedDate {
  icb_folder_name: string;
  document_files: string[];
  publication_date: string | null;
  date_precision: 'day' | 'month' | 'year';
  date_source: string | null;
  confidence: 'high' | 'medium' | 'low';
  extracted_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getNextMigrationNumber(): string {
  const existing = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  if (existing.length === 0) return '0001';
  const last = existing[existing.length - 1];
  const num = parseInt(last.split('_')[0], 10);
  return String(num + 1).padStart(4, '0');
}

function getCurrentYearFolder(icbFolder: string): string | null {
  const icbPath = join(DOCUMENTS_DIR, icbFolder);
  if (!existsSync(icbPath)) return null;
  const years = readdirSync(icbPath).filter(f => {
    const full = join(icbPath, f);
    return statSync(full).isDirectory() && /^\d{4}$/.test(f);
  });
  return years.sort().reverse()[0] || null;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipMigration = args.includes('--skip-migration');
  const skipRename = args.includes('--skip-rename');

  if (!existsSync(INPUT_PATH)) {
    console.error(`Missing input: ${INPUT_PATH}`);
    console.error('Run extractPolicyDates.ts first.');
    process.exit(1);
  }

  const results: ExtractedDate[] = JSON.parse(readFileSync(INPUT_PATH, 'utf-8'));
  console.log(`\nLoaded ${results.length} extracted date(s)\n`);

  // ── 1. Generate migration ──────────────────────────────────────────────

  if (!skipMigration) {
    const migrationLines: string[] = [
      '-- Update policy_date with extracted publication dates from source PDFs.',
      `-- Generated: ${new Date().toISOString()}`,
      `-- Source: scripts/output/extracted-policy-dates.json`,
      '',
    ];

    for (const result of results) {
      if (!result.publication_date) continue;
      migrationLines.push(
        `UPDATE health_boards SET policy_date = '${result.publication_date}', last_verified = '${new Date().toISOString().split('T')[0]}'`
      );
      migrationLines.push(
        `WHERE document_folder_name = '${result.icb_folder_name}'; --> statement-breakpoint`
      );
      migrationLines.push('');
    }

    const migrationNum = getNextMigrationNumber();
    const migrationFile = join(MIGRATIONS_DIR, `${migrationNum}_update_policy_dates.sql`);

    if (dryRun) {
      console.log('── Migration (dry run) ──');
      console.log(`Would write: ${migrationFile}`);
      console.log(`${results.filter(r => r.publication_date).length} UPDATE statements\n`);
    } else {
      writeFileSync(migrationFile, migrationLines.join('\n'));
      console.log(`✅ Migration written: ${migrationFile}`);
      console.log(`   ${results.filter(r => r.publication_date).length} UPDATE statements\n`);
    }
  }

  // ── 2. Rename local year folders ───────────────────────────────────────

  if (!skipRename) {
    const renames: Array<{ icb: string; from: string; to: string; fromPath: string; toPath: string }> = [];

    for (const result of results) {
      if (!result.publication_date) continue;

      const extractedYear = result.publication_date.split('-')[0];
      const currentYear = getCurrentYearFolder(result.icb_folder_name);

      if (!currentYear) continue;
      if (currentYear === extractedYear) continue;

      const icbPath = join(DOCUMENTS_DIR, result.icb_folder_name);
      const fromPath = join(icbPath, currentYear);
      const toPath = join(icbPath, extractedYear);

      // Don't rename if target already exists (multiple year folders)
      if (existsSync(toPath)) {
        console.log(`  ⚠ ${result.icb_folder_name}: target folder ${extractedYear}/ already exists, skipping`);
        continue;
      }

      renames.push({ icb: result.icb_folder_name, from: currentYear, to: extractedYear, fromPath, toPath });
    }

    if (renames.length === 0) {
      console.log('── Folder renames ──');
      console.log('No folders need renaming.\n');
    } else {
      console.log(`── Folder renames (${renames.length}) ──`);
      for (const r of renames) {
        if (dryRun) {
          console.log(`  Would rename: ${r.icb}/${r.from}/ → ${r.icb}/${r.to}/`);
        } else {
          renameSync(r.fromPath, r.toPath);
          console.log(`  ✓ ${r.icb}/${r.from}/ → ${r.icb}/${r.to}/`);
        }
      }
      console.log('');
    }
  }

  // ── 3. R2 sync instructions ────────────────────────────────────────────

  console.log('── R2 sync ──');
  console.log('Local folders have been updated. To sync R2:');
  console.log('  Local:  npx tsx scripts/seedLocalR2.ts');
  console.log('  Remote: npx tsx scripts/seedRemoteR2.ts');
  console.log('');
  console.log('The seed scripts will detect renamed paths as new uploads + orphan deletions.');

  // ── 4. Apply migration ─────────────────────────────────────────────────

  if (!skipMigration && !dryRun) {
    console.log('\n── Apply migration ──');
    console.log('  Local:  npm run cf:migrate:local');
    console.log('  Remote: npm run cf:migrate:remote');
  }
}

main();
