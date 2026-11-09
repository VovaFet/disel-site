// Trust blocks for the home page. Each one renders nothing until the sheet has data for it.
import type { Locale, Review, Stat } from "@/config/types";
import { t } from "@/i18n";
import { SheetImage } from "./SheetImage";

export function HeroImage({ src, lang }: { src: string; lang: Locale }) {
  return src ? (
    <SheetImage
      src={src}
      alt={t(lang).heroImageAlt}
      className="hero-image"
      priority
      sizes="(min-width: 900px) 440px, calc(100vw - 32px)"
    />
  ) : null;
}

// The hero's four points, each with its icon: bench test, repair time, warranty, Nova Poshta
const pointIcons = [
  <path key="gauge" d="M4 16a8 8 0 1 1 16 0M12 16l4-5M12 16h.01" />,
  <path key="clock" d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  <path key="shield" d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4" />,
  <path key="box" d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />,
];

export function HeroPoints({ points }: { points: readonly string[] }) {
  return (
    <ul className="hero-points">
      {points.map((p, i) => (
        <li key={p}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {pointIcons[i]}
          </svg>
          {p}
        </li>
      ))}
    </ul>
  );
}

// A separate panel under the hero, full container width
export function Stats({ stats, lang }: { stats: Stat[]; lang: Locale }) {
  if (!stats.length) return null;
  return (
    <div className="container">
      <ul className="stats">
        {stats.map((s) => (
          <li key={s.value + s.label.uk}>
            <strong>{s.value}</strong>
            <span>{s.label[lang]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Brands({ brands, lang }: { brands: string[]; lang: Locale }) {
  if (!brands.length) return null;
  return (
    <div className="container brands">
      <span className="muted">{t(lang).brandsHeading}</span>
      <ul>
        {brands.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProtocolSample({ src, lang }: { src: string; lang: Locale }) {
  if (!src) return null;
  const caption = t(lang).protocolCaption;
  return (
    <figure className="protocol">
      <SheetImage src={src} alt={caption} lazy />
      <figcaption className="muted small">{caption}</figcaption>
    </figure>
  );
}

export function Reviews({ reviews, lang }: { reviews: Review[]; lang: Locale }) {
  if (!reviews.length) return null;
  const d = t(lang);
  return (
    <section className="container section">
      <h2>{d.reviewsHeading}</h2>
      <ul className="reviews">
        {reviews.map((r) => (
          <li key={r.name + r.text} className="review">
            {r.rating > 0 && (
              <span className="stars" role="img" aria-label={d.rating(r.rating)}>
                {"★".repeat(r.rating)}
                <span className="stars-off">{"★".repeat(5 - r.rating)}</span>
              </span>
            )}
            <blockquote>{r.text}</blockquote>
            <p className="muted small">
              {r.name}
              {r.car && ` · ${r.car}`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
