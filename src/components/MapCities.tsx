"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// A flag on the map, placed by UkraineMap in % of the map box
export type MapCity = {
  key: string;
  name: string;
  style: CSSProperties;
  className: string;
  caption?: string;
};

type Box = { x1: number; y1: number; x2: number; y2: number };
const overlaps = (a: Box, b: Box) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;

// Boxes inside the map from offsets, so the scroll-reveal slide (a transform) doesn't count
function labelBox(li: HTMLElement): Box {
  const name = li.querySelector<HTMLElement>(".ua-city-name")!;
  const x = li.offsetLeft + name.offsetLeft;
  const y = li.offsetTop + name.offsetTop;
  return { x1: x, y1: y, x2: x + name.offsetWidth, y2: y + name.offsetHeight };
}

// The pole with its cloth (a pseudo-element, so its size comes from the computed style) and the dot under it
function flagBox(li: HTMLElement): Box {
  const flag = li.querySelector<HTMLElement>(".ua-flag")!;
  const cloth = getComputedStyle(flag, "::after");
  const x = li.offsetLeft + flag.offsetLeft;
  const y = li.offsetTop + flag.offsetTop;
  return { x1: x - 3, y1: y, x2: x + parseFloat(cloth.left) + parseFloat(cloth.width), y2: li.offsetTop + 3 };
}

// Names go on the map as long as they fit: the workshop's always, then the big cities, then the rest. A name that
// would run into another name or flag, or off the map, tries the other side of its flag and is hidden if that doesn't
// fit either; a hidden name shows on a tap on its flag. Laid out again when the map changes size.
export function MapCities({ cities }: { cities: MapCity[] }) {
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ul = list.current!;
    const map = ul.parentElement!;
    let frame = 0;
    const fit = () => {
      const items = [...ul.querySelectorAll<HTMLElement>(".ua-city")];
      items.forEach((li) => li.classList.remove("is-flipped", "is-hidden"));
      ul.classList.add("is-fitted");
      const rank = (li: HTMLElement) =>
        li.classList.contains("ua-workshop") ? 0 : li.classList.contains("ua-city-major") ? 1 : 2;
      const flags = new Map(items.map((li) => [li, flagBox(li)]));
      const width = map.clientWidth;
      const placed: Box[] = [];
      for (const li of [...items].sort((a, b) => rank(a) - rank(b))) {
        // The workshop's name always shows; the others keep clear of it
        if (rank(li) === 0) {
          placed.push(labelBox(li));
          continue;
        }
        const fits = () => {
          const box = labelBox(li);
          return (
            box.x1 >= 0 &&
            box.x2 <= width &&
            !placed.some((p) => overlaps(box, p)) &&
            !items.some((other) => other !== li && overlaps(box, flags.get(other)!))
          );
        };
        let fitted = fits();
        if (!fitted) {
          li.classList.add("is-flipped");
          fitted = fits();
        }
        if (fitted) {
          placed.push(labelBox(li));
          continue;
        }
        // Hidden, on whichever side stays on the map when a tap shows it
        li.classList.remove("is-flipped");
        const box = labelBox(li);
        if (box.x1 < 0 || box.x2 > width) li.classList.add("is-flipped");
        li.classList.add("is-hidden");
      }
    };
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    fit();
    // the web font changes the names' widths once it loads
    document.fonts?.ready.then(refit);
    const observer = new ResizeObserver(refit);
    observer.observe(map);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // A name shown by a tap goes away on a tap elsewhere or after a few seconds
  useEffect(() => {
    if (!active) return;
    const close = (e: PointerEvent) => {
      if (!(e.target instanceof Element && e.target.closest(".ua-city-hit"))) setActive(null);
    };
    const timer = setTimeout(() => setActive(null), 4000);
    document.addEventListener("pointerdown", close);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", close);
    };
  }, [active]);

  return (
    <ul ref={list} className="ua-map-cities">
      {cities.map((c) => (
        // The fitting adds is-flipped / is-hidden to the class list itself; the className here never changes, so
        // React leaves them alone
        <li key={c.key} className={c.className} style={c.style} data-active={active === c.key || undefined}>
          <span className="ua-flag" />
          <span className="ua-city-name">
            {c.name}
            {c.caption && <small>{c.caption}</small>}
          </span>
          {/* Touch target for a hidden name; screen readers have the name in the list already */}
          <button
            type="button"
            className="ua-city-hit"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setActive((a) => (a === c.key ? null : c.key))}
          />
        </li>
      ))}
    </ul>
  );
}
