import Link from "next/link";
import type { ReactNode } from "react";

// Cards linking to pages (landing and article lists); the whole card is clickable like ServiceList.
// kicker goes above the title (e.g. a date), meta below the text (e.g. a price).
// Card titles are h3 under a section heading; a list page that shows the cards right under its h1 passes level 2,
// and cards under an h3 (the home page picker's make) pass level 4.
export function LinkCards({
  items,
  level = 3,
}: {
  items: { href: string; title: string; text: string; kicker?: ReactNode; meta?: ReactNode }[];
  level?: 2 | 3 | 4;
}) {
  const Heading = `h${level}` as const;
  return (
    <ul className="cards">
      {items.map((i) => (
        <li key={i.href} className="card">
          {i.kicker && <p className="card-kicker">{i.kicker}</p>}
          <Heading>
            <Link href={i.href}>{i.title}</Link>
          </Heading>
          {i.text && <p>{i.text}</p>}
          {i.meta && <p className="price">{i.meta}</p>}
        </li>
      ))}
    </ul>
  );
}
