import type { ReactNode } from "react";
import type { Locale } from "@/config/types";
import { t } from "@/i18n";
import { ContactActions } from "./Live";
import { OpenStatus } from "./OpenStatus";

// Wide screens only: price and contact buttons stay in view next to a long page text
export function PriceAside({ lang, price, note }: { lang: Locale; price?: ReactNode; note?: string }) {
  const d = t(lang);
  return (
    <aside className="service-aside" aria-label={d.book}>
      {price && (
        <>
          <span className="muted">{d.priceLabel}</span>
          <strong className="aside-price">{price}</strong>
          {note && <span className="discount-note">{note}</span>}
        </>
      )}
      <OpenStatus />
      <ContactActions label={d.book} className="aside-actions" />
    </aside>
  );
}
