import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { LiveConfigProvider } from "@/components/LiveConfig";
import { MouseBackground } from "@/components/MouseBackground";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { getConfig, sheetId } from "@/config";
import { toLive, type Locale } from "@/config/types";
import { languageAlternates, localePath, ogLocale, t } from "@/i18n";
import { businessSchema } from "@/lib/schema";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export async function rootMetadata(lang: Locale): Promise<Metadata> {
  const c = await getConfig();
  const name = c.texts.name[lang];
  return {
    metadataBase: new URL(c.url),
    title: {
      default: `${name} — ${t(lang).homeTitle} ${c.texts.cityIn[lang]}`,
      template: `%s | ${name}, ${c.texts.city[lang]}`,
    },
    description: c.texts.description[lang],
    openGraph: openGraph(lang, name, localePath(lang, "/og.png")),
    twitter: { card: "summary_large_image" },
  };
}

// Link previews in messengers. A page that sets openGraph replaces the layout's one
// entirely (metadata is merged shallowly), so it is always built here in full.
// Images come from the og.png routes (see src/views/ogImage.tsx).
export const openGraph = (lang: Locale, siteName: string, imagePath: string): Metadata["openGraph"] => ({
  type: "website",
  locale: ogLocale[lang],
  siteName,
  images: [{ url: imagePath, width: 1200, height: 630, type: "image/png" }],
});

// Per-page metadata with canonical URL and hreflang alternates for all languages
export function pageMetadata(lang: Locale, path: string, meta: { title?: string; description?: string }): Metadata {
  return {
    ...(meta.title && { title: meta.title }),
    ...(meta.description && { description: meta.description }),
    alternates: { canonical: localePath(lang, path), languages: languageAlternates(path) },
  };
}

export async function RootShell({ lang, notFound, children }: { lang: Locale; notFound?: boolean; children: ReactNode }) {
  const config = await getConfig();
  return (
    <html lang={lang} className={inter.className}>
      <body>
        <MouseBackground />
        <JsonLd data={businessSchema(config, lang)} />
        <LiveConfigProvider initial={toLive(config)} lang={lang} sheetId={sheetId}>
          <SiteHeader lang={lang} config={config} notFound={notFound} />
          <main>{children}</main>
          <SiteFooter lang={lang} config={config} />
        </LiveConfigProvider>
      </body>
    </html>
  );
}
