import Link from "next/link";
import type { ReactNode } from "react";

// Cards linking to pages (landing and article lists); the whole card is clickable like ServiceList.
// kicker goes above the title (e.g. a date), meta below the text (e.g. a price).
export function LinkCards({
  items,
}: {
  items: { href: string; title: string; text: string; kicker?: ReactNode; meta?: ReactNode }[];
}) {
  return (
    <ul className="cards">
      {items.map((i) => (
        <li key={i.href} className="card">
          {i.kicker && <p className="card-kicker">{i.kicker}</p>}
          <h3>
            <Link href={i.href}>{i.title}</Link>
          </h3>
          {i.text && <p>{i.text}</p>}
          {i.meta && <p className="price">{i.meta}</p>}
        </li>
      ))}
    </ul>
  );
}
