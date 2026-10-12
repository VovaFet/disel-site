import type { Locale, Service, SiteConfig } from "@/config/types";
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

export function serviceSchema(c: SiteConfig, service: Service, lang: Locale) {
  const d = t(lang);
  const abs = (path: string) => `${c.url}${localePath(lang, path)}`;
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: d.nav.home, item: abs("/") },
        { "@type": "ListItem", position: 2, name: d.nav.services, item: abs("/poslugy/") },
        { "@type": "ListItem", position: 3, name: service.title[lang], item: abs(`/poslugy/${service.slug}/`) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [...service.faq, ...c.commonFaq].map((f) => ({
        "@type": "Question",
        name: f.q[lang],
        acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
      })),
    },
  ];
}
