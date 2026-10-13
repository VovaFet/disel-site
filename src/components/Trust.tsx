// Trust blocks for the home page. Each one renders nothing until the sheet has data for it.
import type { Locale, Review, Stat } from "@/config/types";
import { t } from "@/i18n";
import { SheetImage } from "./SheetImage";

export function HeroImage({ src, lang }: { src: string; lang: Locale }) {
  return src ? <SheetImage src={src} alt={t(lang).heroImageAlt} className="hero-image" /> : null;
}

export function Stats({ stats, lang }: { stats: Stat[]; lang: Locale }) {
  if (!stats.length) return null;
  return (
    <ul className="stats">
      {stats.map((s) => (
        <li key={s.value + s.label.uk}>
          <strong>{s.value}</strong>
          <span>{s.label[lang]}</span>
        </li>
      ))}
    </ul>
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
