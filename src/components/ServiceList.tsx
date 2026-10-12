import Link from "next/link";
import type { Locale, Service } from "@/config/types";
import { localePath } from "@/i18n";
import { Price } from "./Live";

export function ServiceList({ lang, services }: { lang: Locale; services: Service[] }) {
  return (
    <ul className="cards">
      {services.map((s) => (
        <li key={s.slug} className="card">
          <h3>
            <Link href={localePath(lang, `/poslugy/${s.slug}/`)}>{s.title[lang]}</Link>
          </h3>
          <p>{s.short[lang]}</p>
          <p className="price">
            <Price slug={s.slug} />
          </p>
        </li>
      ))}
    </ul>
  );
}
