export const locales = ["uk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

export type L10n = Record<Locale, string>;

export type ScheduleEntry = { days: number[]; from: string; to: string };

export type Faq = { q: L10n; a: L10n };

export const serviceGroups = ["injectors", "pumps", "testing"] as const;
export type ServiceGroup = (typeof serviceGroups)[number];

export type Service = {
  slug: string;
  group: ServiceGroup;
  priceFrom: number;
  // When set, the price is per item and the calculator asks for a quantity
  perUnitOptions?: number[];
  perUnitLabel?: L10n;
  title: L10n;
  h1: L10n;
  short: L10n;
  description: L10n;
  includes: Record<Locale, string[]>;
  // Long-form page text in "rich text lite": blank line = new block, "## " = heading, "- " lines = list
  body: L10n;
  faq: Faq[];
};

// Static info pages (delivery, about). Routes are fixed; content comes from the config.
export const infoPageSlugs = ["dostavka", "pro-nas"] as const;
export type InfoPageSlug = (typeof infoPageSlugs)[number];
export type InfoPage = { slug: InfoPageSlug; title: L10n; description: L10n; body: L10n };

export type Addon = { id: string; price: number; label: L10n };

// Values that may change often (prices, contacts, hours). The browser re-reads
// them from the remote config at runtime, so they update without a rebuild.
export type LiveConfig = {
  phone: string;
  phoneDisplay: string;
  telegram: string;
  viber: string;
  timeZone: string;
  schedule: ScheduleEntry[];
  prices: Record<string, number>;
  addons: Addon[];
};

export type SiteConfig = {
  url: string;
  geo: { lat: number; lng: number };
  postalCode: string;
  country: string;
  phone: string;
  phoneDisplay: string;
  telegram: string;
  viber: string;
  timeZone: string;
  schedule: ScheduleEntry[];
  texts: {
    name: L10n;
    city: L10n;
    // City with preposition in the locative case: "в Одесі", "в Одессе", "in Odesa"
    cityIn: L10n;
    street: L10n;
    region: L10n;
    description: L10n;
    shipping: L10n;
  };
  services: Service[];
  // FAQ shown on every service page (slug "*" in the sheet)
  commonFaq: Faq[];
  pages: InfoPage[];
  addons: Addon[];
};

export const toLive = (c: SiteConfig): LiveConfig => ({
  phone: c.phone,
  phoneDisplay: c.phoneDisplay,
  telegram: c.telegram,
  viber: c.viber,
  timeZone: c.timeZone,
  schedule: c.schedule,
  prices: Object.fromEntries(c.services.map((s) => [s.slug, s.priceFrom])),
  addons: c.addons,
});
