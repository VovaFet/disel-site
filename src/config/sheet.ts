// Reads the site config from a Google Sheet shared as "Anyone with the link: Viewer".
// Used at build time (content baked into HTML) and in the browser (live prices/contacts/hours).
//
// Tabs (first row = headers):
//   settings  key | value                       (url, phone, phoneDisplay, telegram, viber, timeZone, lat, lng, postalCode, country,
//                                              npRecipient, npPhone, npBranch — Nova Poshta details for shipping parts in)
//   texts     key | uk | ru | en                (name, city, cityIn, street, region, description, shipping)
//   schedule  days | from | to                  (days: "1-5", "6" or "1,3"; 1 = Monday)
//   services  slug | group | priceFrom | perUnitOptions | <field>_uk | <field>_ru | <field>_en ...
//             group: injectors | pumps | testing
//             fields: perUnitLabel, title, h1, short, description, includes (one item per line), body
//   pages     slug | title_* | description_* | body_*   (slug: dostavka | pro-nas)
//   body format: blank line = new block, "## " = heading, lines starting with "- " = list
//   faq       slug | q_uk | a_uk | q_ru | a_ru | q_en | a_en   (slug "*" = every service)
//   addons    id | price | label_uk | label_ru | label_en
//   Trust blocks on the home page (optional; empty = hidden):
//   settings  brands (comma-separated), heroImage, protocolImage (an image URL or a /path from public/)
//   stats     value | label_uk | label_ru | label_en          ("12" | "років досвіду")
//   reviews   name | car | rating | text                      (rating 1–5, may be empty; text as written)
//   Landing pages (optional; empty tab = no section): series → /marky/<slug>/, vehicles → /avto/<slug>/
//   series, vehicles   slug | services | units | <field>_uk | <field>_ru | <field>_en ...
//             services: related service slugs, comma-separated (the first gives price and calculator)
//             units: calculator quantity, e.g. 6 injectors; fields: title, h1, short, description, body
//             FAQ for these pages goes to the faq tab with the page slug
import { defaultConfig } from "./default";
import {
  infoPageSlugs,
  locales,
  serviceGroups,
  type Addon,
  type Faq,
  type InfoPage,
  type L10n,
  type Landing,
  type LandingSection,
  type LiveConfig,
  type NovaPoshta,
  type ScheduleEntry,
  type Service,
  type ServiceGroup,
  type SiteConfig,
  type Trust,
} from "./types";

type Row = Record<string, string>;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const toObjects = (table: string[][]): Row[] => {
  const [header, ...body] = table;
  if (!header) return [];
  const keys = header.map((h) => h.trim());
  return body
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
};

async function fetchTab(sheetId: string, tab: string): Promise<Row[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
  // The browser skips its HTTP cache so live values are fresh. At build time "no-store" would make
  // the static export fail (the build used to fall back to the bundled defaults without a word);
  // instead the per-build stamp from next.config.ts keeps Next from reusing an older build's response.
  const res =
    typeof window === "undefined"
      ? await fetch(`${url}&build=${process.env.SHEET_BUILD_STAMP}`)
      : await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheet tab "${tab}": HTTP ${res.status}`);
  return toObjects(parseCsv(await res.text()));
}

// Google returns the first tab when the named one is missing, so an optional tab
// counts only when its header has the expected columns
async function fetchOptionalTab(sheetId: string, tab: string, columns: string[]): Promise<Row[]> {
  const rows = await fetchTab(sheetId, tab).catch(() => []);
  return rows.length > 0 && columns.every((c) => c in rows[0]) ? rows : [];
}

// Falls back to Ukrainian when a translation cell is empty
const l10n = (row: Row, field: string): L10n => {
  const uk = row[`${field}_uk`] ?? "";
  return Object.fromEntries(locales.map((l) => [l, row[`${field}_${l}`] || uk])) as L10n;
};

const parseDays = (s: string): number[] =>
  s.split(",").flatMap((part) => {
    const [a, b] = part.split("-").map((x) => Number(x.trim()));
    if (!b) return [a];
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  });

const num = (s: string | undefined, fallback: number) => (s && !Number.isNaN(Number(s)) ? Number(s) : fallback);

const toSettings = (rows: Row[]) => Object.fromEntries(rows.map((r) => [r.key, r.value]));

const toNovaPoshta = (s: Record<string, string>, d: NovaPoshta): NovaPoshta => ({
  recipient: s.npRecipient || d.recipient,
  phone: s.npPhone || d.phone,
  branch: s.npBranch || d.branch,
});

const toSchedule = (rows: Row[]): ScheduleEntry[] =>
  rows.map((r) => ({ days: parseDays(r.days), from: r.from, to: r.to }));

const toAddons = (rows: Row[]): Addon[] =>
  rows.map((r) => ({ id: r.id, price: num(r.price, 0), label: l10n(r, "label") }));

const toFaq = (f: Row): Faq => ({ q: l10n(f, "q"), a: l10n(f, "a") });

const toPages = (rows: Row[]): InfoPage[] =>
  rows
    .filter((r) => (infoPageSlugs as readonly string[]).includes(r.slug))
    .map((r) => ({
      slug: r.slug as InfoPage["slug"],
      title: l10n(r, "title"),
      description: l10n(r, "description"),
      body: l10n(r, "body"),
    }));

const toTrust = (s: Record<string, string>, stats: Row[], reviews: Row[]): Trust => ({
  brands: (s.brands ?? "").split(",").map((b) => b.trim()).filter(Boolean),
  heroImage: s.heroImage ?? "",
  protocolImage: s.protocolImage ?? "",
  stats: stats.filter((r) => r.value && r.label_uk).map((r) => ({ value: r.value, label: l10n(r, "label") })),
  reviews: reviews
    .filter((r) => r.name && r.text)
    .map((r) => ({
      name: r.name,
      car: r.car ?? "",
      rating: Math.min(5, Math.max(0, Math.round(num(r.rating, 0)))),
      text: r.text,
    })),
});

function toLandings(section: LandingSection, rows: Row[], faqRows: Row[], serviceSlugs: string[]): Landing[] {
  return rows
    .filter((r) => r.slug && r.title_uk)
    .map((r) => {
      const services = (r.services ?? "").split(",").map((x) => x.trim()).filter(Boolean);
      const unknown = services.filter((x) => !serviceSlugs.includes(x));
      if (unknown.length) console.warn(`[config] ${section}/${r.slug}: unknown services ${unknown.join(", ")}`);
      const title = l10n(r, "title");
      const h1 = l10n(r, "h1");
      return {
        section,
        slug: r.slug,
        services: services.filter((x) => serviceSlugs.includes(x)),
        units: r.units && Number(r.units) > 0 ? Math.round(Number(r.units)) : undefined,
        title,
        h1: h1.uk ? h1 : title,
        short: l10n(r, "short"),
        description: l10n(r, "description"),
        body: l10n(r, "body"),
        faq: faqRows.filter((f) => f.slug === r.slug).map(toFaq),
      };
    });
}

function toServices(rows: Row[], faqRows: Row[]): Service[] {
  // A row without a slug has no page address (e.g. a service still being filled in): skip it
  const withSlug = rows.filter((r) => {
    if (!r.slug) console.warn(`[config] services: row without slug skipped ("${r.title_uk ?? ""}")`);
    return Boolean(r.slug);
  });
  return withSlug.map((r) => {
    const includes = l10n(r, "includes");
    const options = r.perUnitOptions ? r.perUnitOptions.split(",").map((x) => Number(x.trim())) : undefined;
    // An empty price usually means mixed number/text cells in the column: Google then blanks one kind
    if (!r.priceFrom || Number.isNaN(Number(r.priceFrom))) console.warn(`[config] services: no valid priceFrom for "${r.slug}"`);
    return {
      slug: r.slug,
      group: (serviceGroups as readonly string[]).includes(r.group) ? (r.group as ServiceGroup) : "injectors",
      priceFrom: num(r.priceFrom, 0),
      perUnitOptions: options,
      perUnitLabel: options ? l10n(r, "perUnitLabel") : undefined,
      title: l10n(r, "title"),
      h1: l10n(r, "h1"),
      short: l10n(r, "short"),
      description: l10n(r, "description"),
      includes: Object.fromEntries(
        locales.map((l) => [l, includes[l].split("\n").map((x) => x.trim()).filter(Boolean)]),
      ) as Service["includes"],
      body: l10n(r, "body"),
      faq: faqRows.filter((f) => f.slug === r.slug).map(toFaq),
    };
  });
}

export async function loadSiteConfig(sheetId: string): Promise<SiteConfig> {
  const [settingsRows, texts, schedule, services, faq, addons, pages] = await Promise.all(
    ["settings", "texts", "schedule", "services", "faq", "addons", "pages"].map((t) => fetchTab(sheetId, t)),
  );
  const [stats, reviews] = await Promise.all([
    fetchOptionalTab(sheetId, "stats", ["value", "label_uk"]),
    fetchOptionalTab(sheetId, "reviews", ["name", "text"]),
  ]);
  const [series, vehicles] = await Promise.all([
    fetchOptionalTab(sheetId, "series", ["slug", "title_uk"]),
    fetchOptionalTab(sheetId, "vehicles", ["slug", "title_uk"]),
  ]);
  const s = toSettings(settingsRows);
  const d = defaultConfig;
  const svc = services.length ? toServices(services, faq) : d.services;
  const svcSlugs = svc.map((x) => x.slug);
  const text = (key: keyof SiteConfig["texts"]): L10n => {
    const row = texts.find((r) => r.key === key);
    if (!row?.uk) return d.texts[key];
    return Object.fromEntries(locales.map((l) => [l, row[l] || row.uk])) as L10n;
  };
  return {
    url: s.url || d.url,
    geo: { lat: num(s.lat, d.geo.lat), lng: num(s.lng, d.geo.lng) },
    postalCode: s.postalCode || d.postalCode,
    country: s.country || d.country,
    phone: s.phone || d.phone,
    phoneDisplay: s.phoneDisplay || d.phoneDisplay,
    telegram: s.telegram || d.telegram,
    viber: s.viber || d.viber,
    timeZone: s.timeZone || d.timeZone,
    schedule: schedule.length ? toSchedule(schedule) : d.schedule,
    novaPoshta: toNovaPoshta(s, d.novaPoshta),
    texts: {
      name: text("name"),
      city: text("city"),
      cityIn: text("cityIn"),
      street: text("street"),
      region: text("region"),
      description: text("description"),
      shipping: text("shipping"),
    },
    services: svc,
    commonFaq: faq.some((f) => f.slug === "*") ? faq.filter((f) => f.slug === "*").map(toFaq) : d.commonFaq,
    // Missing pages in the sheet fall back to the bundled text
    pages: d.pages.map((p) => toPages(pages).find((x) => x.slug === p.slug) ?? p),
    addons: addons.length ? toAddons(addons) : d.addons,
    trust: toTrust(s, stats, reviews),
    landings: [...toLandings("marky", series, faq, svcSlugs), ...toLandings("avto", vehicles, faq, svcSlugs)],
  };
}

// Lightweight read for the browser: only the frequently changing values
export async function loadLiveConfig(sheetId: string, fallback: LiveConfig): Promise<LiveConfig> {
  const [settingsRows, schedule, services, addons] = await Promise.all(
    ["settings", "schedule", "services", "addons"].map((t) => fetchTab(sheetId, t)),
  );
  const s = toSettings(settingsRows);
  return {
    phone: s.phone || fallback.phone,
    phoneDisplay: s.phoneDisplay || fallback.phoneDisplay,
    telegram: s.telegram || fallback.telegram,
    viber: s.viber || fallback.viber,
    timeZone: s.timeZone || fallback.timeZone,
    schedule: schedule.length ? toSchedule(schedule) : fallback.schedule,
    novaPoshta: toNovaPoshta(s, fallback.novaPoshta),
    prices: { ...fallback.prices, ...Object.fromEntries(services.map((r) => [r.slug, num(r.priceFrom, fallback.prices[r.slug] ?? 0)])) },
    addons: addons.length ? toAddons(addons) : fallback.addons,
  };
}
