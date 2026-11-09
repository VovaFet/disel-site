import type { Metadata } from "next";
import { Fira_Sans_Extra_Condensed, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ChatWidget } from "@/components/ChatWidget";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleTags } from "@/components/GoogleTags";
import { JsonLd } from "@/components/JsonLd";
import { LiveConfigProvider } from "@/components/LiveConfig";
import { MouseBackground } from "@/components/MouseBackground";
import { PulseBackground } from "@/components/PulseBackground";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { getConfig, sheetId } from "@/config";
import { toLive, type Locale, type SiteConfig } from "@/config/types";
import { languageAlternates, localePath, ogLocale, t } from "@/i18n";
import { businessSchema } from "@/lib/schema";
import { themeScript } from "@/lib/theme";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });
// Only for the logo wordmark (Latin caps)
const logoFont = Fira_Sans_Extra_Condensed({ weight: "800", subsets: ["latin"], display: "swap", variable: "--font-logo" });

export async function rootMetadata(lang: Locale): Promise<Metadata> {
  const c = await getConfig();
  const name = c.texts.name[lang];
  return {
    metadataBase: new URL(c.url),
    title: {
      default: `${name} — ${t(lang).homeTitle} ${c.texts.area[lang]}`,
      // Page titles already name the city where it matters
      template: `%s | ${name}`,
    },
    description: c.texts.description[lang],
    openGraph: openGraph(lang, name, localePath(lang, "/og.png")),
    twitter: { card: "summary_large_image" },
  };
}

// Link previews in messengers. A page that sets openGraph replaces the layout's one
// entirely (metadata is merged shallowly), so it is always built here in full.
// Images come from the og.png routes (see src/views/ogImage.tsx).
export const openGraph = (lang: Locale, siteName: string, imagePath: string, url?: string): Metadata["openGraph"] => ({
  type: "website",
  locale: ogLocale[lang],
  siteName,
  ...(url && { url }),
  images: [{ url: imagePath, width: 1200, height: 630, type: "image/png" }],
});

// Per-page metadata: canonical URL, hreflang alternates for all languages and the link preview with
// the page's own URL (`image` is the og.png path; the home page preview by default)
export function pageMetadata(
  c: SiteConfig,
  lang: Locale,
  path: string,
  meta: { title?: string; description?: string },
  image = "/og.png",
): Metadata {
  return {
    ...(meta.title && { title: meta.title }),
    ...(meta.description && { description: meta.description }),
    alternates: { canonical: localePath(lang, path), languages: languageAlternates(path) },
    openGraph: openGraph(lang, c.texts.name[lang], localePath(lang, image), localePath(lang, path)),
  };
}

export async function RootShell({ lang, notFound, children }: { lang: Locale; notFound?: boolean; children: ReactNode }) {
  const config = await getConfig();
  return (
    // suppressHydrationWarning: themeScript may set data-theme on <html> before React hydrates.
    // data-scroll-behavior: Next.js turns the smooth scrolling of globals.css off while it moves to the top of a
    // new page; otherwise its scroll calls animate over each other and the page stops halfway (Next.js 16 upgrade
    // guide, "Scroll Behavior Override")
    <html
      lang={lang}
      className={`${inter.className} ${logoFont.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the App Router root layout (rendered from app/), where <head> is right; the rule targets pages/ */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <JsonLd data={businessSchema(config, lang)} />
        <LiveConfigProvider initial={toLive(config)} lang={lang} sheetId={sheetId}>
          <MouseBackground />
          <PulseBackground />
          <SiteHeader lang={lang} config={config} notFound={notFound} />
          <main>{children}</main>
          <SiteFooter lang={lang} config={config} />
          <ChatWidget />
          {(config.gaId || config.adsId) && (
            <>
              <GoogleTags gaId={config.gaId} adsId={config.adsId} host={new URL(config.url).hostname} />
              <CookieBanner />
            </>
          )}
        </LiveConfigProvider>
      </body>
    </html>
  );
}
