"use client";

import { usePathname } from "next/navigation";
import { locales } from "@/config/types";
import { langLabel, localePath } from "@/i18n";
import { useLive } from "./LiveConfig";

// Links to the same page in the other languages. Plain <a> on purpose: each
// language has its own root layout (<html lang>), so it's a full page load anyway.
export function LangSwitcher() {
  const { lang } = useLive();
  const pathname = usePathname() || "/";
  const basePath = pathname.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";

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
