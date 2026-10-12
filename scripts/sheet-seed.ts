// Prints the bundled default config as Google Sheet tabs (JSON: { tab: rows[][] }).
// Used to create/refill the config sheet: `npx tsx scripts/sheet-seed.ts`
import { defaultConfig as c } from "../src/config/default";
import { locales } from "../src/config/types";

const daysToText = (days: number[]) =>
  days.length > 1 && days.every((d, i) => i === 0 || d === days[i - 1] + 1)
    ? `${days[0]}-${days[days.length - 1]}`
    : days.join(",");

const l10nCols = (field: string) => locales.map((l) => `${field}_${l}`);
const serviceFields = ["perUnitLabel", "title", "h1", "short", "description", "includes", "body"] as const;

const tabs: Record<string, (string | number)[][]> = {
  settings: [
    ["key", "value"],
    ["url", c.url],
    ["phone", c.phone],
    ["phoneDisplay", c.phoneDisplay],
    ["telegram", c.telegram],
    ["viber", c.viber],
    ["timeZone", c.timeZone],
    ["lat", c.geo.lat],
    ["lng", c.geo.lng],
    ["postalCode", c.postalCode],
    ["country", c.country],
  ],
  texts: [["key", ...locales], ...Object.entries(c.texts).map(([k, v]) => [k, ...locales.map((l) => v[l])])],
  schedule: [["days", "from", "to"], ...c.schedule.map((s) => [daysToText(s.days), s.from, s.to])],
  services: [
    ["slug", "group", "priceFrom", "perUnitOptions", ...serviceFields.flatMap(l10nCols)],
    ...c.services.map((s) => [
      s.slug,
      s.group,
      s.priceFrom,
      s.perUnitOptions?.join(",") ?? "",
      ...serviceFields.flatMap((f) =>
        locales.map((l) => (f === "includes" ? s.includes[l].join("\n") : (s[f]?.[l] ?? ""))),
      ),
    ]),
  ],
  faq: [
    ["slug", ...locales.flatMap((l) => [`q_${l}`, `a_${l}`])],
    ...c.services.flatMap((s) => s.faq.map((f) => [s.slug, ...locales.flatMap((l) => [f.q[l], f.a[l]])])),
    ...c.commonFaq.map((f) => ["*", ...locales.flatMap((l) => [f.q[l], f.a[l]])]),
  ],
  pages: [
    ["slug", ...(["title", "description", "body"] as const).flatMap(l10nCols)],
    ...c.pages.map((p) => [p.slug, ...(["title", "description", "body"] as const).flatMap((f) => locales.map((l) => p[f][l]))]),
  ],
  addons: [["id", "price", ...l10nCols("label")], ...c.addons.map((a) => [a.id, a.price, ...locales.map((l) => a.label[l])])],
};

console.log(JSON.stringify(tabs));
