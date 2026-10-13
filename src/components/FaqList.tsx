import type { Faq, Locale } from "@/config/types";

// Questions as native <details> accordions: they work without JS and stay in the HTML for search
export function FaqList({ items, lang }: { items: Faq[]; lang: Locale }) {
  return (
    <>
      {items.map((f) => (
        <details key={f.q[lang]} className="faq">
          <summary>{f.q[lang]}</summary>
          <p>{f.a[lang]}</p>
        </details>
      ))}
    </>
  );
}
