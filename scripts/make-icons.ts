// Generates the favicons and the logo image from the mark in src/lib/logo.ts:
// src/app/icon.svg, src/app/favicon.ico (16/32/48 px), src/app/apple-icon.png (180 px) and
// public/logo.png (512 px, for structured data). Run after changing the mark: `npx tsx scripts/make-icons.ts`
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { logoArc, logoColors as c, logoPulse, logoStrokes } from "../src/lib/logo";

// The mark on a dark tile, so it reads on light and dark backgrounds alike (browser tabs, search results)
function tile(size: number, radius: number) {
  const scale = 0.8;
  const [arc, pulse] = logoStrokes(Math.round(size * scale));
  // centre the mark's visual box (≈ y 3.5–53.5) in the tile
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="${radius}" fill="${c.tile}"/>
  <g transform="translate(6.4 9.2) scale(${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${logoArc}" stroke="${c.accent}" stroke-width="${arc}"/>
    <path d="${logoPulse}" stroke="${c.light}" stroke-width="${pulse}"/>
  </g>
</svg>
`;
}

const png = (svg: string) => sharp(Buffer.from(svg)).png().toBuffer();

// ICO container holding PNG images (supported by every current browser)
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size, e);
    header.writeUInt8(size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((x) => x.data)]);
}

async function main() {
  await writeFile("src/app/icon.svg", tile(32, 14));
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(tile(size, 14)) })));
  await writeFile("src/app/favicon.ico", ico(images));
  // iOS rounds the corners itself
  await writeFile("src/app/apple-icon.png", await png(tile(180, 0)));
  await writeFile("public/logo.png", await png(tile(512, 0)));
  console.log("icons written");
}

main();
