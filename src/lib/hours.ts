import type { Locale, ScheduleEntry } from "@/config/types";
import { t } from "@/i18n";

const shortEn = ["", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const dayRange = (days: readonly number[], names: readonly string[], sep: string) =>
  days.length > 1 ? `${names[days[0]]}${sep}${names[days[days.length - 1]]}` : names[days[0]];

// schema.org openingHours, e.g. "Mo-Fr 09:00-18:00"
export const openingHoursSchema = (schedule: ScheduleEntry[]) =>
  schedule.map((s) => `${dayRange(s.days, shortEn, "-")} ${s.from}-${s.to}`);

// Human-readable lines, e.g. "Пн–Пт: 09:00–18:00", plus closed days
export function openingHoursDisplay(schedule: ScheduleEntry[], lang: Locale) {
  const { days, dayOff } = t(lang);
  const lines = schedule.map((s) => `${dayRange(s.days, days, "–")}: ${s.from}–${s.to}`);
  const open = new Set<number>(schedule.flatMap((s) => s.days));
  const closed = [1, 2, 3, 4, 5, 6, 7].filter((d) => !open.has(d));
  if (closed.length) lines.push(`${closed.map((d) => days[d]).join(", ")}: ${dayOff}`);
  return lines;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Current weekday (1–7) and minutes since midnight in the business time zone
function nowIn(timeZone: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")) + 1;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus = { open: boolean; text: string };

export function getOpenStatus(schedule: ScheduleEntry[], timeZone: string, lang: Locale, date = new Date()): OpenStatus {
  const d = t(lang);
  const { day, minutes } = nowIn(timeZone, date);
  const entryFor = (wd: number) => schedule.find((s) => s.days.includes(wd));
  const today = entryFor(day);
  if (today && minutes >= toMinutes(today.from) && minutes < toMinutes(today.to)) {
    return { open: true, text: d.openUntil(today.to) };
  }
  // Next opening within the coming week
  for (let i = 0; i < 8; i++) {
    const wd = ((day - 1 + i) % 7) + 1;
    const s = entryFor(wd);
    if (!s || (i === 0 && minutes >= toMinutes(s.from))) continue;
    const when = i === 0 ? d.today : i === 1 ? d.tomorrow : d.days[wd];
    return { open: false, text: d.closedOpens(when, s.from) };
  }
  return { open: false, text: d.closed };
}
