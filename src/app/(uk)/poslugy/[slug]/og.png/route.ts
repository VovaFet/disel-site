import { serviceOgImage } from "@/views/ogImage";
import { serviceSlugs } from "@/views/pages";

// Link preview image for a service page, rendered once at build time
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await serviceSlugs()).map((slug) => ({ slug }));
}

export async function GET(_req: Request, ctx: RouteContext<"/poslugy/[slug]/og.png">) {
  const { slug } = await ctx.params;
  return serviceOgImage("uk", slug);
}
