import sharp from "sharp";
import path from "node:path";

const INPUT = path.resolve("public/favicon.svg");
const SIZES = [192, 512] as const;

async function main() {
  for (const size of SIZES) {
    await sharp(INPUT)
      .resize(size, size)
      .png()
      .toFile(path.resolve(`public/icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
}

main().catch(console.error);
