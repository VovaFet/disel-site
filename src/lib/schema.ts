import type { Faq, Locale, Service, SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { openingHoursSchema } from "./hours";

export const businessId = (c: SiteConfig) => `${c.url}/#business`;

export function businessSchema(c: SiteConfig, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": businessId(c),
    name: c.texts.name[lang],
    url: `${c.url}${localePath(lang, "/")}`,
    telephone: c.phone,
    description: c.texts.description[lang],
    inLanguage: lang,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.texts.street[lang],
      addressLocality: c.texts.city[lang],
      addressRegion: c.texts.region[lang],
      postalCode: c.postalCode,
      addressCountry: c.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng },
    openingHours: openingHoursSchema(c.schedule),
    areaServed: [c.texts.city[lang], c.country],
    priceRange: "₴₴",
  };
}

// Breadcrumbs from [name, path] pairs, home first
export function breadcrumbSchema(c: SiteConfig, lang: Locale, items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${c.url}${localePath(lang, path)}`,
    })),
  };
}

export function serviceSchema(c: SiteConfig, service: Service, lang: Locale) {
  const d = t(lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title[lang],
      description: service.description[lang],
      inLanguage: lang,
      provider: { "@id": businessId(c) },
      areaServed: c.country,
      offers: {
        "@type": "Offer",
        priceCurrency: "UAH",
        priceSpecification: { "@type": "PriceSpecification", minPrice: service.priceFrom, priceCurrency: "UAH" },
      },
    },
    breadcrumbSchema(c, lang, [
      [d.nav.home, "/"],
      [d.nav.services, "/poslugy/"],
      [service.title[lang], `/poslugy/${service.slug}/`],
    ]),
    ...faqSchema([...service.faq, ...c.commonFaq], lang),
  ];
}

// FAQPage markup; nothing when there are no questions (an empty FAQPage is invalid)
export function faqSchema(items: Faq[], lang: Locale) {
  if (!items.length) return [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((f) => ({
        "@type": "Question",
        name: f.q[lang],
        acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
      })),
    },
  ];
}
