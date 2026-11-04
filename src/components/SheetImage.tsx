// Images are any URL from the sheet (or a /path from public/); next/image adds nothing in a static export.
// `ratio` sets the width/height attributes (4:3 by default) so the browser reserves the space before loading;
// the CSS still decides the displayed size.
export function SheetImage({
  src,
  alt,
  className,
  lazy,
  ratio = [4, 3],
}: {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  ratio?: [number, number];
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={ratio[0] * 200}
      height={ratio[1] * 200}
      loading={lazy ? "lazy" : undefined}
      decoding="async"
    />
  );
}
