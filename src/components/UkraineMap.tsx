import type { CSSProperties } from "react";
import type { L10n, Locale } from "@/config/types";
import { t } from "@/i18n";
import { MapCities } from "./MapCities";
import { mapSize, outline, project } from "./ukraineOutline";

// Cities with a flag on the map. "left" puts the name left of the flag and "high" level with its top, where it would
// run into a neighbour; "major" names are placed first (MapCities fits the names in the browser and hides those that
// don't fit, shown on a tap) and are the only ones on phones until then.
type City = { name: L10n; lat: number; lon: number; left?: boolean; high?: boolean; major?: boolean };

const workshop: City = { name: { uk: "Київ", ru: "Киев", en: "Kyiv" }, lat: 50.45, lon: 30.523, major: true };

const cities: City[] = [
  { name: { uk: "Ужгород", ru: "Ужгород", en: "Uzhhorod" }, lat: 48.621, lon: 22.288 },
  { name: { uk: "Львів", ru: "Львов", en: "Lviv" }, lat: 49.84, lon: 24.03, left: true, major: true },
  { name: { uk: "Луцьк", ru: "Луцк", en: "Lutsk" }, lat: 50.747, lon: 25.325, left: true },
  { name: { uk: "Рівне", ru: "Ровно", en: "Rivne" }, lat: 50.62, lon: 26.252 },
  { name: { uk: "Тернопіль", ru: "Тернополь", en: "Ternopil" }, lat: 49.554, lon: 25.595, left: true },
  { name: { uk: "Івано-Франківськ", ru: "Ивано-Франковск", en: "Ivano-Frankivsk" }, lat: 48.923, lon: 24.711 },
  { name: { uk: "Чернівці", ru: "Черновцы", en: "Chernivtsi" }, lat: 48.292, lon: 25.936 },
  { name: { uk: "Хмельницький", ru: "Хмельницкий", en: "Khmelnytskyi" }, lat: 49.423, lon: 26.987, high: true },
  { name: { uk: "Житомир", ru: "Житомир", en: "Zhytomyr" }, lat: 50.255, lon: 28.659, left: true },
  { name: { uk: "Вінниця", ru: "Винница", en: "Vinnytsia" }, lat: 49.233, lon: 28.468 },
  { name: { uk: "Чернігів", ru: "Чернигов", en: "Chernihiv" }, lat: 51.498, lon: 31.289 },
  { name: { uk: "Черкаси", ru: "Черкассы", en: "Cherkasy" }, lat: 49.444, lon: 32.06 },
  { name: { uk: "Кропивницький", ru: "Кропивницкий", en: "Kropyvnytskyi" }, lat: 48.508, lon: 32.262, left: true },
  { name: { uk: "Одеса", ru: "Одесса", en: "Odesa" }, lat: 46.483, lon: 30.723, left: true, major: true },
  { name: { uk: "Миколаїв", ru: "Николаев", en: "Mykolaiv" }, lat: 46.975, lon: 31.995, left: true },
  { name: { uk: "Херсон", ru: "Херсон", en: "Kherson" }, lat: 46.635, lon: 32.617 },
  { name: { uk: "Кривий Ріг", ru: "Кривой Рог", en: "Kryvyi Rih" }, lat: 47.91, lon: 33.392, left: true },
  { name: { uk: "Полтава", ru: "Полтава", en: "Poltava" }, lat: 49.588, lon: 34.551 },
  { name: { uk: "Суми", ru: "Сумы", en: "Sumy" }, lat: 50.908, lon: 34.798 },
  { name: { uk: "Харків", ru: "Харьков", en: "Kharkiv" }, lat: 49.994, lon: 36.23, major: true },
  { name: { uk: "Дніпро", ru: "Днепр", en: "Dnipro" }, lat: 48.465, lon: 35.046, major: true },
  { name: { uk: "Запоріжжя", ru: "Запорожье", en: "Zaporizhzhia" }, lat: 47.839, lon: 35.14 },
];

// Where a city sits on the map, in % of the map box, for absolutely placed markers
const place = ({ lat, lon }: City) => {
  const [x, y] = project(lon, lat);
  return { left: `${((x / mapSize.width) * 100).toFixed(2)}%`, top: `${((y / mapSize.height) * 100).toFixed(2)}%` };
};

// Map of Ukraine with flags on the cities parts come from and the workshop in Kyiv. The outline is an inline
// SVG; the flags and names are HTML on top (MapCities), so they stay the same size on any screen.
export function UkraineMap({ lang }: { lang: Locale }) {
  const d = t(lang);
  return (
    <div className="ua-map">
      <svg viewBox={`0 0 ${mapSize.width} ${mapSize.height}`} aria-hidden="true" focusable="false">
        <defs>
          <pattern id="ua-map-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1.6" />
          </pattern>
          <path id="ua-map-outline" d={outline} />
        </defs>
        <use href="#ua-map-outline" className="ua-map-land" />
        <use href="#ua-map-outline" fill="url(#ua-map-dots)" />
        <use href="#ua-map-outline" className="ua-map-border" />
      </svg>
      <MapCities
        cities={[
          ...cities.map((c, i) => ({
            key: c.name.en,
            name: c.name[lang],
            className: `ua-city${c.left ? " ua-city-left" : ""}${c.high ? " ua-city-high" : ""}${c.major ? " ua-city-major" : ""}`,
            style: { ...place(c), "--i": i } as CSSProperties,
          })),
          {
            key: workshop.name.en,
            name: workshop.name[lang],
            className: "ua-city ua-city-major ua-workshop",
            style: place(workshop),
            caption: d.mapWorkshop,
          },
        ]}
      />
    </div>
  );
}
