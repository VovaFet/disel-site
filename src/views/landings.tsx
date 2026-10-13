// Search landing pages (content plan stages 2–3): brands and series under /marky/, vehicles and
// engines under /avto/. One template for both; the content comes from the sheet tabs series and
// vehicles. Each section also has a list page.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { LinkCards } from "@/components/LinkCards";
import { ContactActions, Price, SetPrice } from "@/components/Live";
import { PriceAside } from "@/components/PriceAside";
import { PriceCalculator } from "@/components/PriceCalculator";
import { RichText } from "@/components/RichText";
import { ServiceList } from "@/components/ServiceList";
import { getConfig } from "@/config";
import type { Landing, LandingSection, Locale, SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { calcItems } from "./pages";
import { pageMetadata } from "./RootShell";

export const sectionPath = (section: LandingSection, slug?: string) => `/${section}/${slug ? `${slug}/` : ""}`;

export const landingsIn = (c: SiteConfig, section: LandingSection) => c.landings.filter((l) => l.section === section);

// The list page is always built (a static export needs at least one page per route); it stays
// out of the menus, the sitemap and search results until the section has pages
export async function landingParams(section: LandingSection) {
  const c = await getConfig();
  return [{ slug: [] as string[] }, ...landingsIn(c, section).map((l) => ({ slug: [l.slug] }))];
}

// "From" price of the first related service, for the whole set when the page has a quantity
function LandingPrice({ landing }: { landing: Landing }) {
  const slug = landing.services[0];
  return landing.units && landing.units > 1 ? <SetPrice slug={slug} units={landing.units} /> : <Price slug={slug} />;
}

export async function landingMetadata(lang: Locale, section: LandingSection, slug?: string[]): Promise<Metadata> {
  const c = await getConfig();
  const d = t(lang);
  if (!slug?.length) {
    const meta = pageMetadata(lang, sectionPath(section), {
      title: d.sections[section].title,
      description: d.sections[section].intro,
    });
    return landingsIn(c, section).length ? meta : { ...meta, robots: { index: false } };
  }
  const l = landingsIn(c, section).find((x) => x.slug === slug[0]);
  if (!l) return {};
  const service = c.services.find((s) => s.slug === l.services[0]);
  const price = service ? ` — ${d.from} ${service.priceFrom} ${d.currency}` : "";
  return pageMetadata(lang, sectionPath(section, l.slug), {
    title: `${l.title[lang]} ${c.texts.cityIn[lang]}${price}`,
    description: l.description[lang] || l.short[lang],
  });
}

export function LandingRoute({ lang, section, slug }: { lang: Locale; section: LandingSection; slug?: string[] }) {
  return slug?.length ? (
    <LandingPage lang={lang} section={section} slug={slug[0]} />
  ) : (
    <LandingIndex lang={lang} section={section} />
  );
}

async function LandingIndex({ lang, section }: { lang: Locale; section: LandingSection }) {
  const c = await getConfig();
  const d = t(lang);
  const list = landingsIn(c, section);
  return (
    <section className="container section">
      <h1>{d.sections[section].title}</h1>
      <p className="lead">{d.sections[section].intro}</p>
      {list.length > 0 ? (
        <LinkCards
          items={list.map((l) => ({
            href: localePath(lang, sectionPath(section, l.slug)),
            title: l.title[lang],
            text: l.short[lang],
            meta: l.services.length > 0 ? <LandingPrice landing={l} /> : undefined,
          }))}
        />
      ) : (
        <p className="muted">{d.sectionEmpty}</p>
      )}
    </section>
  );
}

async function LandingPage({ lang, section, slug }: { lang: Locale; section: LandingSection; slug: string }) {
  const c = await getConfig();
  const l = landingsIn(c, section).find((x) => x.slug === slug);
  if (!l) notFound();
  const d = t(lang);
  const p = (path: string) => localePath(lang, path);
  const services = c.services.filter((s) => l.services.includes(s.slug));
  const faq = [...l.faq, ...c.commonFaq];

  return (
    <article className="container section">
      <JsonLd
        data={[
          breadcrumbSchema(c, lang, [
            [d.nav.home, "/"],
            [d.sections[section].title, sectionPath(section)],
            [l.title[lang], sectionPath(section, l.slug)],
          ]),
          ...faqSchema(faq, lang),
        ]}
      />
      <nav aria-label={d.breadcrumbs} className="breadcrumbs">
        <Link href={p("/")}>{d.nav.home}</Link> / <Link href={p(sectionPath(section))}>{d.sections[section].title}</Link>{" "}
        / <span>{l.title[lang]}</span>
      </nav>

      <h1>
        {l.h1[lang]} {c.texts.cityIn[lang]}
      </h1>
      {l.description[lang] && <p className="lead">{l.description[lang]}</p>}
      {services.length > 0 && (
        <p className="price">
          {d.priceLabel}: <LandingPrice landing={l} />
        </p>
      )}

      <div className="service-layout">
        <div>{l.body[lang] && <RichText text={l.body[lang]} />}</div>
        <PriceAside lang={lang} price={services.length > 0 ? <LandingPrice landing={l} /> : undefined} />
      </div>

      {services.length > 0 && (
        <>
          <h2>{d.estimate}</h2>
          <PriceCalculator items={calcItems(c, lang)} initialSlug={l.services[0]} initialQty={l.units} />
        </>
      )}

      {faq.length > 0 && (
        <>
          <h2>{d.faq}</h2>
          <FaqList items={faq} lang={lang} />
        </>
      )}

      <ContactActions label={d.book} />

      {services.length > 0 && (
        <section className="related">
          <h2>{d.relatedServices}</h2>
          <ServiceList lang={lang} services={services} />
        </section>
      )}
    </article>
  );
}
