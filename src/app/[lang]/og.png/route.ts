import type { Locale } from "@/config/types";
import { homeOgImage } from "@/views/ogImage";

// Link preview image for the /ru and /en pages, rendered once at build time
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }];
}

export async function GET(_req: Request, ctx: RouteContext<"/[lang]/og.png">) {
  const { lang } = await ctx.params;
  return homeOgImage(lang as Locale);
}
