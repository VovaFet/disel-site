"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LinkCards } from "./LinkCards";

export type PickerTab = {
  id: string;
  label: string;
  // The section's list page
  href: string;
  makes: { name: string; items: { href: string; title: string; text: string; price?: ReactNode }[] }[];
};

// Home page picker: a tab per landing section, a tile per make; a tile swaps the grid for that make's
// pages. Every list is in the HTML (hidden until picked), so the links are there without JavaScript.
export function CarPicker({ tabs, back }: { tabs: PickerTab[]; back: string }) {
  const [tabId, setTabId] = useState(tabs[0]?.id);
  const [make, setMake] = useState<string | null>(null);
  // The make whose tile gets focus back after "All makes"
  const lastMake = useRef<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (make) el.querySelector<HTMLElement>(`[data-pages="${CSS.escape(make)}"] h3`)?.focus();
    else if (lastMake.current) el.querySelector<HTMLElement>(`[data-tile="${CSS.escape(lastMake.current)}"]`)?.focus();
  }, [make]);

  const open = (name: string) => {
    lastMake.current = name;
    setMake(name);
  };

  return (
    <div ref={root}>
      {tabs.length > 1 && (
        <div className="chips">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip ${t.id === tabId ? "is-active" : ""}`}
              aria-pressed={t.id === tabId}
              onClick={() => {
                setTabId(t.id);
                lastMake.current = null;
                setMake(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {tabs.map((t) => (
        <div key={t.id} className="picker-panel" hidden={t.id !== tabId}>
          <ul className="make-grid" hidden={make !== null}>
            {t.makes.map((m) => (
              <li key={m.name}>
                <button type="button" className="make-tile" data-tile={m.name} onClick={() => open(m.name)}>
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
          {t.makes.map((m) => (
            <div key={m.name} className="make-pages" data-pages={m.name} hidden={make !== m.name}>
              <button type="button" className="link-button" onClick={() => setMake(null)}>
                ← {back}
              </button>
              <h3 tabIndex={-1}>{m.name}</h3>
              <LinkCards level={4} items={m.items.map((i) => ({ href: i.href, title: i.title, text: i.text, meta: i.price }))} />
            </div>
          ))}
          <p>
            <Link href={t.href}>{t.label} →</Link>
          </p>
        </div>
      ))}
    </div>
  );
}
