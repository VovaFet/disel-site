import type { Locale } from "@/config/types";
import { serviceOgImage } from "@/views/ogImage";
import { serviceSlugs } from "@/views/pages";

// Link preview image for a service page, rendered once at build time
export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await serviceSlugs();
  return ["ru", "en"].flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function GET(_req: Request, ctx: RouteContext<"/[lang]/poslugy/[slug]/og.png">) {
  const { lang, slug } = await ctx.params;
  return serviceOgImage(lang as Locale, slug);
}
