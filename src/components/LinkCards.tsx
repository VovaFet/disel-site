import Link from "next/link";
import type { ReactNode } from "react";

// Cards linking to pages (landing and article lists); the whole card is clickable like ServiceList
export function LinkCards({ items }: { items: { href: string; title: string; text: string; meta?: ReactNode }[] }) {
  return (
    <ul className="cards">
      {items.map((i) => (
        <li key={i.href} className="card">
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
