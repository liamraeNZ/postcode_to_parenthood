/**
 * Seeds the local miniflare R2 bucket with policy documents from the documents/ folder.
 * Run with: npx tsx scripts/seedLocalR2.ts
 *
 * After seeding, fixes URL-encoded keys that wrangler CLI creates for paths with spaces.
 */
import { readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = join(__dirname, '..', 'documents');
const BUCKET_NAME = 'fertilityfund';
const R2_SQLITE_DIR = join(__dirname, '..', '.wrangler/state/v3/r2/miniflare-R2BucketObject');

function getFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    if (entry === '.DS_Store') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

const files = getFiles(LOCAL_DIR);
console.log(`Found ${files.length} files to seed into local R2.\n`);

for (const file of files) {
  const key = relative(LOCAL_DIR, file);
  try {
    execSync(
      `npx wrangler r2 object put "${BUCKET_NAME}/${key}" --file="${file}" --local`,
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(`✓ ${key}`);
  } catch (err) {
    console.error(`✗ ${key}:`, (err as Error).message);
  }
}

// Fix URL-encoded keys created by wrangler CLI for paths with spaces/commas
console.log('\nFixing URL-encoded keys in local R2 store...');
const sqliteEntries = readdirSync(R2_SQLITE_DIR).filter(f => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
for (const file of sqliteEntries) {
  const dbPath = join(R2_SQLITE_DIR, file);
  execSync(
    `sqlite3 "${dbPath}" "UPDATE _mf_objects SET key = REPLACE(REPLACE(key, '%20', ' '), '%2C', ',')"`,
    { stdio: 'pipe' }
  );
}

console.log(`Done. Seeded ${files.length} files into local R2.`);
