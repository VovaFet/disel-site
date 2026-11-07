// Search landing pages (content plan stages 2–3): brands and series under /marky/, vehicles and
// engines under /avto/. One template for both; the content comes from the sheet tabs series and
// vehicles. Each section also has a list page.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarPicker, type PickerTab } from "@/components/CarPicker";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { LinkCards } from "@/components/LinkCards";
import { ContactActions, PhoneLink, Price, SetPrice } from "@/components/Live";
import { PriceAside } from "@/components/PriceAside";
import { PriceCalculator, type CalcItem } from "@/components/PriceCalculator";
import { RichText } from "@/components/RichText";
import { ServiceList } from "@/components/ServiceList";
import { getConfig } from "@/config";
import type { Landing, LandingSection, Locale, SiteConfig } from "@/config/types";
import { formatPrice, localePath, t } from "@/i18n";
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

// "From" price of the first related service (or the page's own price), for the whole set when the
// page has a quantity
function LandingPrice({ landing }: { landing: Landing }) {
  const slug = landing.services[0];
  return landing.units && landing.units > 1 ? (
    <SetPrice slug={slug} units={landing.units} amount={landing.priceFrom} />
  ) : (
    <Price slug={slug} amount={landing.priceFrom} />
  );
}

// Home page block: a tab per section (cars first), a tile per make, and the make's pages under it.
// Pages without makes stay out of it; they are still in their section's list.
export function LandingPicker({ c, lang }: { c: SiteConfig; lang: Locale }) {
  const d = t(lang);
  const tabs: PickerTab[] = (["avto", "marky"] as const)
    .map((section) => {
      const byMake = new Map<string, PickerTab["makes"][number]["items"]>();
      for (const l of landingsIn(c, section)) {
        for (const make of l.makes) {
          const items = byMake.get(make) ?? [];
          items.push({
            href: localePath(lang, sectionPath(section, l.slug)),
            title: l.title[lang],
            text: l.short[lang],
            price: l.services.length > 0 ? <LandingPrice landing={l} /> : undefined,
          });
          byMake.set(make, items);
        }
      }
      const makes = [...byMake].map(([name, items]) => ({ name, items })).sort((a, b) => a.name.localeCompare(b.name, lang));
      return { id: section, label: d.sections[section].title, href: localePath(lang, sectionPath(section)), makes };
    })
    .filter((tab) => tab.makes.length > 0);
  if (!tabs.length) return null;
  return (
    <section className="container section">
      <h2>{d.picker.heading}</h2>
      <p className="lead">{d.picker.lead}</p>
      <CarPicker tabs={tabs} back={d.picker.back} />
      <NotFoundNote lang={lang} />
    </section>
  );
}

// The picker and the section lists don't cover every car or pump yet: say so quietly and give the phone
function NotFoundNote({ lang }: { lang: Locale }) {
  return (
    <p className="info-note">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 11v6M12 7.5v.01" />
      </svg>
      <span>
        {t(lang).picker.notFound} <PhoneLink />
      </span>
    </p>
  );
}

// A page with its own price is added to the calculator as an item of its first service's group,
// so the estimate starts from that price
const pageCalcSlug = (l: Landing) => `${l.section}/${l.slug}`;
function landingCalcItems(c: SiteConfig, lang: Locale, l: Landing): CalcItem[] {
  const items = calcItems(c, lang);
  const base = items.find((i) => i.slug === l.services[0]);
  if (!l.priceFrom || !base) return items;
  return [{ ...base, slug: pageCalcSlug(l), title: l.title[lang], price: l.priceFrom }, ...items];
}

export async function landingMetadata(lang: Locale, section: LandingSection, slug?: string[]): Promise<Metadata> {
  const c = await getConfig();
  const d = t(lang);
  if (!slug?.length) {
    const meta = pageMetadata(c, lang, sectionPath(section), {
      title: d.sections[section].title,
      description: d.sections[section].intro,
    });
    return landingsIn(c, section).length ? meta : { ...meta, robots: { index: false } };
  }
  const l = landingsIn(c, section).find((x) => x.slug === slug[0]);
  if (!l) return {};
  const from = l.priceFrom ?? c.services.find((s) => s.slug === l.services[0])?.priceFrom ?? 0;
  const price = from > 0 ? ` — ${d.from} ${formatPrice(lang, from)}` : "";
  return pageMetadata(c, lang, sectionPath(section, l.slug), {
    title: `${l.title[lang]} ${c.texts.area[lang]}${price}`,
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
          level={2}
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
      <NotFoundNote lang={lang} />
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
        {l.h1[lang]} {c.texts.area[lang]}
      </h1>
      {l.description[lang] && <p className="lead">{l.description[lang]}</p>}
      {services.length > 0 && (
        <p className="price">
          {d.priceLabel}: <LandingPrice landing={l} />
        </p>
      )}
      {services.length > 0 && c.texts.discount[lang] && <p className="discount-note">{c.texts.discount[lang]}</p>}

      <div className="service-layout">
        <div>{l.body[lang] && <RichText text={l.body[lang]} />}</div>
        <PriceAside
          lang={lang}
          price={services.length > 0 ? <LandingPrice landing={l} /> : undefined}
          note={c.texts.discount[lang]}
          footnote={c.texts.removedOnly[lang]}
        />
      </div>

      {services.length > 0 && (
        <>
          <h2>{d.estimate}</h2>
          <PriceCalculator
            items={landingCalcItems(c, lang, l)}
            initialSlug={l.priceFrom ? pageCalcSlug(l) : l.services[0]}
            initialQty={l.units}
            discount={c.texts.discount[lang]}
          />
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
