// Images are any URL from the sheet (or a /path from public/); next/image adds nothing in a static export
export function SheetImage({ src, alt, className, lazy }: { src: string; alt: string; className?: string; lazy?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading={lazy ? "lazy" : undefined} decoding="async" />;
}
