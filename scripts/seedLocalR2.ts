/**
 * Syncs the local miniflare R2 bucket with the documents/ folder.
 * - Skips files that already exist in the bucket
 * - Uploads new files that don't exist in the bucket
 * - Removes bucket files that no longer exist locally
 *
 * Run with: npx tsx scripts/seedLocalR2.ts
 */
import { readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = join(__dirname, '..', 'documents');
const BUCKET_NAME = 'fertilityfund';
const R2_SQLITE_DIR = join(__dirname, '..', '.wrangler/state/v3/r2/miniflare-R2BucketObject');

function getLocalFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    if (entry === '.DS_Store') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getLocalFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

/** Query existing keys from the local miniflare R2 SQLite store */
function getExistingKeys(): Set<string> {
  if (!existsSync(R2_SQLITE_DIR)) return new Set();
  const sqliteFiles = readdirSync(R2_SQLITE_DIR).filter(
    f => f.endsWith('.sqlite') && f !== 'metadata.sqlite'
  );
  const keys = new Set<string>();
  for (const file of sqliteFiles) {
    const dbPath = join(R2_SQLITE_DIR, file);
    try {
      const output = execSync(
        `sqlite3 "${dbPath}" "SELECT key FROM _mf_objects"`,
        { stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf-8' }
      );
      for (const line of output.trim().split('\n')) {
        if (line) keys.add(line);
      }
    } catch { /* empty db or table doesn't exist yet */ }
  }
  return keys;
}

const localFiles = getLocalFiles(LOCAL_DIR);
const localKeys = new Set(localFiles.map(f => relative(LOCAL_DIR, f)));
const existingKeys = getExistingKeys();

// Upload new files only
const toUpload = localFiles.filter(f => !existingKeys.has(relative(LOCAL_DIR, f)));
const toDelete = [...existingKeys].filter(k => !localKeys.has(k));

console.log(`Local: ${localKeys.size} files | Bucket: ${existingKeys.size} files`);
console.log(`To upload: ${toUpload.length} | To delete: ${toDelete.length}\n`);

// Upload new files
for (const file of toUpload) {
  const key = relative(LOCAL_DIR, file);
  try {
    execSync(
      `npx wrangler r2 object put "${BUCKET_NAME}/${key}" --file="${file}" --local`,
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(`✓ uploaded: ${key}`);
  } catch (err) {
    console.error(`✗ upload failed: ${key}:`, (err as Error).message);
  }
}

// Delete orphaned files from bucket
for (const key of toDelete) {
  try {
    execSync(
      `npx wrangler r2 object delete "${BUCKET_NAME}/${key}" --local`,
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(`✓ deleted: ${key}`);
  } catch (err) {
    console.error(`✗ delete failed: ${key}:`, (err as Error).message);
  }
}

// Fix URL-encoded keys created by wrangler CLI for paths with spaces/commas
if (toUpload.length > 0) {
  console.log('\nFixing URL-encoded keys in local R2 store...');
  const sqliteEntries = readdirSync(R2_SQLITE_DIR).filter(
    f => f.endsWith('.sqlite') && f !== 'metadata.sqlite'
  );
  for (const file of sqliteEntries) {
    const dbPath = join(R2_SQLITE_DIR, file);
    execSync(
      `sqlite3 "${dbPath}" "UPDATE _mf_objects SET key = REPLACE(REPLACE(key, '%20', ' '), '%2C', ',')"`,
      { stdio: 'pipe' }
    );
  }
}

console.log('\nSync complete.');
