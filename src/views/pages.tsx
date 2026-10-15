// Page bodies shared by the Ukrainian routes (site root) and the /ru, /en routes.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ContactActions, MessengerLink, PhoneLink, Price, HoursList, PhoneText } from "@/components/Live";
import { OpenStatus } from "@/components/OpenStatus";
import { PriceAside } from "@/components/PriceAside";
import { PriceCalculator, type CalcItem } from "@/components/PriceCalculator";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { ServiceList } from "@/components/ServiceList";
import { ShippingDetails } from "@/components/ShippingDetails";
import { Brands, HeroImage, ProtocolSample, Reviews, Stats } from "@/components/Trust";
import { getConfig } from "@/config";
import { serviceGroups, type InfoPageSlug, type Locale, type SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { ArticleCards } from "./articles";
import { openGraph, pageMetadata } from "./RootShell";

export const calcItems = (c: SiteConfig, lang: Locale): CalcItem[] =>
  c.services.map((s) => ({
    slug: s.slug,
    group: s.group,
    title: s.title[lang],
    perUnitOptions: s.perUnitOptions,
    perUnitLabel: s.perUnitLabel?.[lang],
  }));

/* ---------- Home ---------- */

export const homeMetadata = (lang: Locale): Metadata => pageMetadata(lang, "/", {});

export async function HomePage({ lang }: { lang: Locale }) {
  const c = await getConfig();
  const d = t(lang);
  return (
    <>
      <section className={`hero ${c.trust.heroImage ? "hero-with-image" : ""}`}>
        <div className="container hero-grid">
          <div>
            <OpenStatus />
            <h1>
              {d.homeH1} {c.texts.cityIn[lang]}
            </h1>
            <p className="lead">{c.texts.description[lang]}</p>
            <p className="badge">📦 {c.texts.shipping[lang]}</p>
            {c.texts.discount[lang] && <p className="badge badge-discount">{c.texts.discount[lang]}</p>}
            <div className="actions">
              <PhoneLink className="btn">
                {d.book}: <PhoneText />
              </PhoneLink>
              <a href="#calculator" className="btn btn-outline">
                {d.estimate}
              </a>
            </div>
          </div>
          <HeroImage src={c.trust.heroImage} lang={lang} />
        </div>
        <Stats stats={c.trust.stats} lang={lang} />
      </section>
      <Brands brands={c.trust.brands} lang={lang} />

      <section className="container section">
        <h2>{d.servicesHeading}</h2>
        <ServiceList lang={lang} services={c.services} />
      </section>

      {c.services.length > 0 && (
        <section id="calculator" className="container section">
          <h2>{d.calculatorHeading}</h2>
          <Reveal>
            <PriceCalculator items={calcItems(c, lang)} discount={c.texts.discount[lang]} />
          </Reveal>
        </section>
      )}

      <section className="container section">
        <h2>{d.shippingHeading}</h2>
        <ol className="steps">
          {d.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 80}>
                <div className="step">
                  <span className="step-num">{i + 1}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <ShippingDetails />
      </section>

      <section className="container section">
        <h2>{d.whyHeading}</h2>
        <ul className="feature-grid">
          {d.features.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 80}>
                <div className="feature">
                  <strong>{f.title}</strong>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <ProtocolSample src={c.trust.protocolImage} lang={lang} />
      </section>

      <Reviews reviews={c.trust.reviews} lang={lang} />

      {c.articles.length > 0 && (
        <section className="container section">
          <h2>{d.usefulArticles}</h2>
          <ArticleCards lang={lang} articles={c.articles.slice(0, 3)} />
          <p>
            <Link href={localePath(lang, "/statti/")}>{d.articles.title} →</Link>
          </p>
        </section>
      )}

      {c.commonFaq.length > 0 && (
        <section className="container section">
          <JsonLd data={faqSchema(c.commonFaq, lang)} />
          <h2>{d.faq}</h2>
          <FaqList items={c.commonFaq} lang={lang} />
        </section>
      )}
    </>
  );
}

/* ---------- Services list ---------- */

export async function servicesMetadata(lang: Locale): Promise<Metadata> {
  const c = await getConfig();
  const d = t(lang);
  return pageMetadata(lang, "/poslugy/", {
    title: d.servicesHeading,
    description: `${d.servicesDescription} ${c.texts.cityIn[lang]}. ${c.texts.shipping[lang]}.`,
  });
}

export async function ServicesPage({ lang }: { lang: Locale }) {
  const c = await getConfig();
  return (
    <section className="container section">
      <h1>{t(lang).servicesHeading}</h1>
      {serviceGroups.map((g) => {
        const list = c.services.filter((s) => s.group === g);
        return list.length ? (
          <section key={g}>
            <h2>{t(lang).groups[g]}</h2>
            <ServiceList lang={lang} services={list} />
          </section>
        ) : null;
      })}
    </section>
  );
}

/* ---------- Single service ---------- */

export const serviceSlugs = async () => (await getConfig()).services.map((s) => s.slug);

export async function serviceMetadata(lang: Locale, slug: string): Promise<Metadata> {
  const c = await getConfig();
  const s = c.services.find((x) => x.slug === slug);
  if (!s) return {};
  const d = t(lang);
  const price = `${d.from} ${s.priceFrom} ${d.currency}`;
  return {
    ...pageMetadata(lang, `/poslugy/${slug}/`, {
      title: `${s.title[lang]} ${c.texts.cityIn[lang]} — ${price}`,
      description: `${s.short[lang]} ${c.texts.city[lang]}, ${price}.`,
    }),
    openGraph: openGraph(lang, c.texts.name[lang], localePath(lang, `/poslugy/${slug}/og.png`)),
  };
}

export async function ServicePage({ lang, slug }: { lang: Locale; slug: string }) {
  const c = await getConfig();
  const s = c.services.find((x) => x.slug === slug);
  if (!s) notFound();
  const d = t(lang);
  const p = (path: string) => localePath(lang, path);
  // Same group first, then the rest
  const related = [
    ...c.services.filter((x) => x.group === s.group && x.slug !== s.slug),
    ...c.services.filter((x) => x.group !== s.group),
  ].slice(0, 3);
  // Brand/series and vehicle pages that belong to this service
  const landingLinks = c.landings.filter((l) => l.services.includes(s.slug));
  const articleLinks = c.articles.filter((a) => a.services.includes(s.slug)).slice(0, 4);

  return (
    <article className="container section">
      <JsonLd data={serviceSchema(c, s, lang)} />
      <nav aria-label={d.breadcrumbs} className="breadcrumbs">
        <Link href={p("/")}>{d.nav.home}</Link> / <Link href={p("/poslugy/")}>{d.nav.services}</Link> /{" "}
        <span>{s.title[lang]}</span>
      </nav>

      <h1>
        {s.h1[lang]} {c.texts.cityIn[lang]}
      </h1>
      <p className="lead">{s.description[lang]}</p>
      <p className="price">
        {d.priceLabel}: <Price slug={s.slug} />
      </p>
      {c.texts.discount[lang] && <p className="discount-note">{c.texts.discount[lang]}</p>}

      <div className="service-layout">
        <div>
          <h2>{d.includes}</h2>
          <ul className="features">
            {s.includes[lang].map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>

          {s.body[lang] && <RichText text={s.body[lang]} />}
        </div>
        <PriceAside lang={lang} price={<Price slug={s.slug} />} note={c.texts.discount[lang]} />
      </div>

      {landingLinks.length > 0 && (
        <nav className="landing-links" aria-label={d.landingLinks}>
          <h2>{d.landingLinks}</h2>
          <ul>
            {landingLinks.map((l) => (
              <li key={`${l.section}/${l.slug}`}>
                <Link href={p(`/${l.section}/${l.slug}/`)}>{l.title[lang]}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <h2>{d.estimate}</h2>
      <PriceCalculator items={calcItems(c, lang)} initialSlug={s.slug} discount={c.texts.discount[lang]} />

      {s.faq.length + c.commonFaq.length > 0 && (
        <>
          <h2>{d.faq}</h2>
          <FaqList items={[...s.faq, ...c.commonFaq]} lang={lang} />
        </>
      )}

      <ContactActions label={d.book} />

      {articleLinks.length > 0 && (
        <section className="related">
          <h2>{d.usefulArticles}</h2>
          <ArticleCards lang={lang} articles={articleLinks} />
        </section>
      )}

      {related.length > 0 && (
        <section className="related">
          <h2>{d.otherServices}</h2>
          <ServiceList lang={lang} services={related} />
        </section>
      )}
    </article>
  );
}

/* ---------- Contacts ---------- */

export async function contactsMetadata(lang: Locale): Promise<Metadata> {
  const c = await getConfig();
  const d = t(lang);
  return pageMetadata(lang, "/kontakty/", {
    title: d.contactsTitle,
    description: `${d.contactsDescription} ${c.texts.name[lang]} ${c.texts.cityIn[lang]}.`,
  });
}

export async function ContactsPage({ lang }: { lang: Locale }) {
  const c = await getConfig();
  const d = t(lang);
  const mapSrc = `https://www.google.com/maps?q=${c.geo.lat},${c.geo.lng}&z=16&hl=${lang}&output=embed`;
  // Opens turn-by-turn navigation in the Google Maps app on phones
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${c.geo.lat},${c.geo.lng}`;
  return (
    <section className="container section">
      <h1>{d.nav.contacts}</h1>
      <address className="contacts">
        <p>
          {c.texts.city[lang]}, {c.texts.street[lang]}
        </p>
        <p>
          {d.phone}: <PhoneLink />
        </p>
        <p>
          <MessengerLink kind="telegram">{d.writeTelegram}</MessengerLink>
        </p>
        <p>
          <MessengerLink kind="viber">{d.writeViber}</MessengerLink>
        </p>
        <OpenStatus />
        <HoursList />
      </address>
      <div className="actions">
        <a href={directionsUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
          {d.directions}
        </a>
      </div>
      <iframe
        title={`${c.texts.name[lang]} ${d.onMap}`}
        src={mapSrc}
        className="map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}

/* ---------- Info pages (delivery, about) ---------- */

const infoPath = (slug: InfoPageSlug) => `/${slug}/`;

export async function infoMetadata(lang: Locale, slug: InfoPageSlug): Promise<Metadata> {
  const page = (await getConfig()).pages.find((p) => p.slug === slug)!;
  return pageMetadata(lang, infoPath(slug), { title: page.title[lang], description: page.description[lang] });
}

export async function InfoPageView({ lang, slug }: { lang: Locale; slug: InfoPageSlug }) {
  const page = (await getConfig()).pages.find((p) => p.slug === slug)!;
  return (
    <article className="container section">
      <h1>{page.title[lang]}</h1>
      <RichText text={page.body[lang]} />
      {slug === "dostavka" && <ShippingDetails />}
      <ContactActions label={t(lang).call} />
    </article>
  );
}
