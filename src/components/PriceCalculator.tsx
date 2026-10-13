"use client";

import { useId, useState } from "react";
import { serviceGroups, type ServiceGroup } from "@/config/types";
import { formatPrice, t } from "@/i18n";
import { ContactActions } from "./Live";
import { useLive } from "./LiveConfig";

export type CalcItem = {
  slug: string;
  group: ServiceGroup;
  title: string;
  perUnitOptions?: number[];
  perUnitLabel?: string;
};

export function PriceCalculator({ items, initialSlug }: { items: CalcItem[]; initialSlug?: string }) {
  const { live, lang } = useLive();
  const d = t(lang);
  const [slug, setSlug] = useState(initialSlug ?? items[0].slug);
  const [qty, setQty] = useState(4);
  const [picked, setPicked] = useState<string[]>([]);

  const radioName = useId();

  const item = items.find((s) => s.slug === slug)!;
  const units = item.perUnitOptions ? qty : 1;
  const price = (s: string) => live.prices[s] ?? 0;
  const extras = live.addons.filter((a) => picked.includes(a.id));
  const total = price(slug) * units + extras.reduce((sum, a) => sum + a.price, 0);
  const groups = serviceGroups
    .map((g) => ({ g, list: items.filter((s) => s.group === g) }))
    .filter((x) => x.list.length > 0);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="calc">
      <div className="calc-fields">
        {/* Phones get the native select; wider screens list every service with its price */}
        <fieldset className="field">
          <legend>{d.service}</legend>
          <select className="svc-select" aria-label={d.service} value={slug} onChange={(e) => setSlug(e.target.value)}>
            {groups.map(({ g, list }) => (
              <optgroup key={g} label={d.groups[g]}>
                {list.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="svc-options">
            {groups.map(({ g, list }) => (
              <div key={g} className="svc-group">
                <span className="svc-group-title">{d.groups[g]}</span>
                <div className="svc-grid">
                  {list.map((s) => (
                    <label key={s.slug} className={`svc-option ${s.slug === slug ? "is-active" : ""}`}>
                      <input
                        type="radio"
                        name={radioName}
                        value={s.slug}
                        checked={s.slug === slug}
                        onChange={() => setSlug(s.slug)}
                      />
                      <span className="svc-title">{s.title}</span>
                      <span className="svc-price">
                        {d.from} {formatPrice(lang, price(s.slug))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

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
        {(item.perUnitOptions || extras.length > 0) && (
          <ul className="calc-lines">
            <li>
              <span>
                {item.title}
                {item.perUnitOptions && (
                  <span className="calc-line-unit muted">
                    {formatPrice(lang, price(slug))} × {units}
                  </span>
                )}
              </span>
              <span>{formatPrice(lang, price(slug) * units)}</span>
            </li>
            {extras.map((a) => (
              <li key={a.id}>
                <span>{a.label[lang]}</span>
                <span>+{formatPrice(lang, a.price)}</span>
              </li>
            ))}
          </ul>
        )}
        <span className="muted small">{d.estimateNote}</span>
        <ContactActions label={d.book} className="calc-actions" />
      </div>
    </div>
  );
}
