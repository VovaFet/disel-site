"use client";

import { usePathname } from "next/navigation";
import { locales } from "@/config/types";
import { langLabel, localePath } from "@/i18n";
import { useLive } from "./LiveConfig";
import { usePathLocale } from "./usePathLocale";

// Links to the same page in the other languages. Plain <a> on purpose: each
// language has its own root layout (<html lang>), so it's a full page load anyway.
// On the 404 page there is no same page to switch to, so it links to the home pages.
export function LangSwitcher({ notFound = false }: { notFound?: boolean }) {
  const liveLang = useLive().lang;
  const pathLang = usePathLocale();
  const lang = notFound ? pathLang : liveLang;
  const pathname = usePathname() || "/";
  const basePath = notFound ? "/" : pathname.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";

  return (
    <div className="lang" role="navigation" aria-label="Language">
      {locales.map((l) =>
        l === lang ? (
          <span key={l} className="lang-current" aria-current="true">
            {langLabel[l]}
          </span>
        ) : (
          <a key={l} href={localePath(l, basePath)} hrefLang={l} lang={l}>
            {langLabel[l]}
          </a>
        ),
      )}
    </div>
  );
}
