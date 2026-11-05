import { readdirSync } from "node:fs";
import path from "node:path";

// Images are any URL from the sheet (or a /path from public/); next/image adds nothing in a static export.
// `ratio` sets the width/height attributes (4:3 by default) so the browser reserves the space before loading;
// the CSS still decides the displayed size.
// A /path photo with WebP copies from scripts/make-webp.ts goes out as <picture>: the browser picks the
// smallest copy that fills `sizes` (the displayed width), and the original stays as the fallback.
// `priority` is for the image that is the page's largest paint (the home hero).
export function SheetImage({
  src,
  alt,
  className,
  lazy,
  priority,
  sizes = "(min-width: 792px) 760px, calc(100vw - 32px)",
  ratio = [4, 3],
}: {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  ratio?: [number, number];
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={ratio[0] * 200}
      height={ratio[1] * 200}
      loading={lazy ? "lazy" : undefined}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
  const srcSet = webpSrcSet(src);
  return srcSet ? (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  ) : (
    img
  );
}

// "<name>-<width>.webp <width>w, …" for the copies next to a public/ photo; read at build time
function webpSrcSet(src: string) {
  const m = src.match(/^(\/.*\/)([^/]+)\.(jpe?g|png)$/i);
  if (!m) return null;
  const [, dir, name] = m;
  let files: string[];
  try {
    files = readdirSync(path.join(process.cwd(), "public", dir));
  } catch {
    return null;
  }
  const copies = files
    .filter((f) => f.startsWith(`${name}-`) && f.endsWith(".webp"))
    .map((file) => ({ file, width: Number(file.slice(name.length + 1, -".webp".length)) }))
    .filter((c) => Number.isInteger(c.width) && c.width > 0)
    .sort((a, b) => a.width - b.width);
  return copies.length ? copies.map((c) => `${dir}${c.file} ${c.width}w`).join(", ") : null;
}
