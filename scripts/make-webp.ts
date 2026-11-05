// Generates WebP copies of the photos in public/photos, which SheetImage serves through <picture> (the
// JPEG/PNG stays as the fallback): <name>-<width>.webp for each width below, never wider than the original.
// Run after adding or replacing a photo: `npx tsx scripts/make-webp.ts`
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = "public/photos";
// Phones and the 440 px hero column at 1x; the same at 2x
const widths = [480, 960];

async function main() {
  for (const file of await readdir(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const src = path.join(dir, file);
    const { width = 0 } = await sharp(src).metadata();
    const base = src.replace(/\.\w+$/, "");
    for (const w of new Set(widths.map((w) => Math.min(w, width)))) {
      const out = `${base}-${w}.webp`;
      const { size } = await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(out);
      console.log(`${out} ${Math.round(size / 1024)} KiB`);
    }
  }
}

main();
