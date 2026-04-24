import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { lookup } from "mime-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .dev.vars as env
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

function getFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    if (entry === ".DS_Store") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function upload() {
  const files = getFiles(LOCAL_DIR);
  console.log(`Found ${files.length} files to upload.\n`);

  for (const file of files) {
    const key = relative(LOCAL_DIR, file); // preserves folder structure as the R2 key
    const contentType = lookup(file) || "application/octet-stream";

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: readFileSync(file),
        ContentType: contentType,
      })
    );

    console.log(`✓ ${key}`);
  }

  console.log(`\nDone. Uploaded ${files.length} files to r2://${BUCKET}`);
}

upload().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
