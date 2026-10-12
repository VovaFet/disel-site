"use client";

import { useMemo, useState } from "react";
import { formatPrice, t } from "@/i18n";
import { useLive } from "./LiveConfig";

export type CalcItem = { slug: string; title: string; perUnitOptions?: number[]; perUnitLabel?: string };

export function PriceCalculator({ items, initialSlug }: { items: CalcItem[]; initialSlug?: string }) {
  const { live, lang } = useLive();
  const d = t(lang);
  const [slug, setSlug] = useState(initialSlug ?? items[0].slug);
  const [qty, setQty] = useState(4);
  const [picked, setPicked] = useState<string[]>([]);

  const item = items.find((s) => s.slug === slug)!;
  const units = item.perUnitOptions ? qty : 1;

  const total = useMemo(
    () =>
      (live.prices[slug] ?? 0) * units +
      live.addons.filter((a) => picked.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
    [live, slug, units, picked],
  );

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="calc">
      <div className="calc-fields">
        <label className="field">
          <span>{d.service}</span>
          <select value={slug} onChange={(e) => setSlug(e.target.value)}>
            {items.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </label>

        {item.perUnitOptions && (
          <fieldset className="field">
            <legend>{item.perUnitLabel}</legend>
            <div className="chips">
              {item.perUnitOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`chip ${qty === n ? "is-active" : ""}`}
                  aria-pressed={qty === n}
                  onClick={() => setQty(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {live.addons.length > 0 && (
          <fieldset className="field">
            <legend>{d.extras}</legend>
            {live.addons.map((a) => (
              <label key={a.id} className="check">
                <input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />
                <span>{a.label[lang]}</span>
                <span className="muted">+{formatPrice(lang, a.price)}</span>
              </label>
            ))}
          </fieldset>
        )}
      </div>

      <div className="calc-total" aria-live="polite">
        <span className="muted">{d.estimateLabel}</span>
        <strong key={total} className="total-value">
          {d.from} {formatPrice(lang, total)}
        </strong>
        <span className="muted small">{d.estimateNote}</span>
        <a href={`tel:${live.phone}`} className="btn">
          {d.book}
        </a>
      </div>
    </div>
  );
}
