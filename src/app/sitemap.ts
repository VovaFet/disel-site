import type { MetadataRoute } from "next";
import { getConfig } from "@/config";
import { locales } from "@/config/types";
import { localePath } from "@/i18n";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getConfig();
  const paths = ["/", "/poslugy/", "/kontakty/", "/dostavka/", "/pro-nas/", ...c.services.map((s) => `/poslugy/${s.slug}/`)];
  const abs = (lang: (typeof locales)[number], path: string) => `${c.url}${localePath(lang, path)}`;
  // One entry per language version, each listing all its hreflang alternates
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: abs(lang, path),
      lastModified: new Date(),
      priority: path === "/" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, abs(l, path)])) },
    })),
  );
}
