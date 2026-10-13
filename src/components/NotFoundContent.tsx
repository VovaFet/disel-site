"use client";

import type { Locale } from "@/config/types";
import { localePath, t } from "@/i18n";
import { usePathLocale } from "./usePathLocale";

// `lang` is known on the /ru/404/ and /en/404/ pages; the root 404.html takes it from the address
export function NotFoundContent({ lang: pageLang }: { lang?: Locale }) {
  const pathLang = usePathLocale();
  const lang = pageLang ?? pathLang;
  const d = t(lang);
  return (
    <section className="container section not-found" lang={lang}>
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <h1>{d.notFound}</h1>
      <p className="lead">{d.notFoundText}</p>
      <div className="actions">
        <a href={localePath(lang, "/")} className="btn">
          {d.toHome}
        </a>
        <a href={localePath(lang, "/poslugy/")} className="btn btn-outline">
          {d.nav.servicesFull}
        </a>
      </div>
    </section>
  );
}
