/**
 * Syncs the remote R2 bucket with the documents/ folder.
 * - Skips files that already exist in the bucket
 * - Uploads new files that don't exist in the bucket
 * - Removes bucket files that no longer exist locally
 *
 * Run with: npx tsx scripts/seedRemoteR2.ts
 */
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { lookup } from "mime-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: ".dev.vars" });

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error("Missing R2 credentials in .dev.vars");
}

const client = new S3Client({
  region: "auto",
  endpoint: "https://942566510de7d893dee1da18a2d8cd7b.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = "fertilityfund";
const LOCAL_DIR = join(__dirname, "..", "documents");

function getLocalFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    if (entry === ".DS_Store") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getLocalFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

/** List all keys currently in the remote R2 bucket */
async function listRemoteKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  let continuationToken: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.add(obj.Key);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return keys;
}

async function sync() {
  const localFiles = getLocalFiles(LOCAL_DIR);
  const localKeys = new Set(localFiles.map(f => relative(LOCAL_DIR, f)));
  const remoteKeys = await listRemoteKeys();

  const toUpload = localFiles.filter(f => !remoteKeys.has(relative(LOCAL_DIR, f)));
  const toDelete = [...remoteKeys].filter(k => !localKeys.has(k));

  console.log(`Local: ${localKeys.size} files | Remote: ${remoteKeys.size} files`);
  console.log(`To upload: ${toUpload.length} | To delete: ${toDelete.length}\n`);

  // Upload new files
  for (const file of toUpload) {
    const key = relative(LOCAL_DIR, file);
    const contentType = lookup(file) || "application/octet-stream";
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: readFileSync(file),
        ContentType: contentType,
      })
    );
    console.log(`✓ uploaded: ${key}`);
  }

  // Delete orphaned files (batch delete, max 1000 per request)
  if (toDelete.length > 0) {
    for (let i = 0; i < toDelete.length; i += 1000) {
      const batch = toDelete.slice(i, i + 1000);
      await client.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: batch.map(k => ({ Key: k })) },
        })
      );
      for (const key of batch) {
        console.log(`✓ deleted: ${key}`);
      }
    }
  }

  console.log("\nSync complete.");
}

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
