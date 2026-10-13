"use client";

import { useMemo, useState } from "react";
import { formatPrice, t } from "@/i18n";
import { ContactActions } from "./Live";
import { useLive } from "./LiveConfig";

export type CalcItem = { slug: string; title: string; perUnitOptions?: number[]; perUnitLabel?: string };

export function PriceCalculator({ items, initialSlug }: { items: CalcItem[]; initialSlug?: string }) {
  const { live, lang } = useLive();
  const d = t(lang);
  const [slug, setSlug] = useState(initialSlug ?? items[0].slug);
  const [qty, setQty] = useState(4);
  // Text of the quantity field while it is being typed in (it may be briefly empty)
  const [qtyDraft, setQtyDraft] = useState<string | null>(null);
  const maxQty = 24; // enough for a batch from a garage
  const pickQty = (n: number) => {
    setQty(Math.min(Math.max(n, 1), maxQty));
    setQtyDraft(null);
  };
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
            <div className="qty">
              <div className="chips">
                {item.perUnitOptions.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`chip ${qty === n ? "is-active" : ""}`}
                    aria-pressed={qty === n}
                    onClick={() => pickQty(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {/* Any other count (5, 7, a batch of 12): step or type it */}
              <div className="stepper">
                <button type="button" aria-label={d.decreaseQty} disabled={qty <= 1} onClick={() => pickQty(qty - 1)}>
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={maxQty}
                  aria-label={item.perUnitLabel}
                  value={qtyDraft ?? String(qty)}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setQtyDraft(e.target.value);
                    if (Number.isInteger(n) && n >= 1) setQty(Math.min(n, maxQty));
                  }}
                  onBlur={() => setQtyDraft(null)}
                />
                <button type="button" aria-label={d.increaseQty} disabled={qty >= maxQty} onClick={() => pickQty(qty + 1)}>
                  +
                </button>
              </div>
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
        <ContactActions label={d.book} className="calc-actions" />
      </div>
    </div>
  );
}
