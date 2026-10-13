// Page bodies shared by the Ukrainian routes (site root) and the /ru, /en routes.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ContactActions, MessengerLink, PhoneLink, Price, HoursList, PhoneText } from "@/components/Live";
import { OpenStatus } from "@/components/OpenStatus";
import { PriceCalculator, type CalcItem } from "@/components/PriceCalculator";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { ServiceList } from "@/components/ServiceList";
import { ShippingDetails } from "@/components/ShippingDetails";
import { getConfig } from "@/config";
import { serviceGroups, type InfoPageSlug, type Locale, type SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { serviceSchema } from "@/lib/schema";
import { openGraph, pageMetadata } from "./RootShell";

const calcItems = (c: SiteConfig, lang: Locale): CalcItem[] =>
  c.services.map((s) => ({
    slug: s.slug,
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
      <section className="hero">
        <div className="container">
          <OpenStatus />
          <h1>
            {d.homeH1} {c.texts.cityIn[lang]}
          </h1>
          <p className="lead">{c.texts.description[lang]}</p>
          <p className="badge">📦 {c.texts.shipping[lang]}</p>
          <div className="actions">
            <PhoneLink className="btn">
              {d.book}: <PhoneText />
            </PhoneLink>
            <a href="#calculator" className="btn btn-outline">
              {d.estimate}
            </a>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>{d.servicesHeading}</h2>
        <ServiceList lang={lang} services={c.services} />
      </section>

      <section id="calculator" className="container section">
        <h2>{d.calculatorHeading}</h2>
        <Reveal>
          <PriceCalculator items={calcItems(c, lang)} />
        </Reveal>
      </section>

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
      </section>
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

      <h2>{d.includes}</h2>
      <ul className="features">
        {s.includes[lang].map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      {s.body[lang] && <RichText text={s.body[lang]} />}

      <h2>{d.estimate}</h2>
      <PriceCalculator items={calcItems(c, lang)} initialSlug={s.slug} />

      {s.faq.length + c.commonFaq.length > 0 && (
        <>
          <h2>{d.faq}</h2>
          {[...s.faq, ...c.commonFaq].map((f) => (
            <details key={f.q[lang]} className="faq">
              <summary>{f.q[lang]}</summary>
              <p>{f.a[lang]}</p>
            </details>
          ))}
        </>
      )}

      <ContactActions label={d.book} />
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
