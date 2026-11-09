// A message from the chat form: checking it and the text that goes to Telegram (kept apart from index.ts,
// whose named exports Cloudflare would read as entrypoints)
import { toUaPhone } from "../src/lib/phone";

export type Lead = { name: string; phone: string; message: string; page: string; lang: string };

// Messages from any other host (branch previews) are marked as tests
export const PRODUCTION_HOST = "dieselmedic.com.ua";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Bots fill in the hidden field or send the form within a second and a half of opening it
export const isBot = (body: Record<string, unknown>) => Boolean(text(body.website, 100)) || !(Number(body.elapsed) >= 1500);

// The phone is checked with the form's own rule and goes on as +380XXXXXXXXX, which Telegram turns into a
// tap-to-call link
export function parseLead(body: Record<string, unknown>): Lead | null {
  const phone = toUaPhone(text(body.phone, 30));
  if (!phone) return null;
  return {
    name: text(body.name, 80),
    phone,
    message: text(body.message, 2000),
    page: text(body.page, 300),
    lang: ["uk", "ru", "en"].includes(body.lang as string) ? (body.lang as string) : "uk",
  };
}

export function telegramText(lead: Lead, host: string) {
  const lines = [
    host === PRODUCTION_HOST ? null : `[тест: ${host}]`,
    "💬 Повідомлення з сайту",
    lead.name ? `Ім'я: ${lead.name}` : null,
    `Телефон: ${lead.phone}`,
    `Сторінка: https://${host}${lead.page}`,
    lead.lang === "uk" ? null : `Мова: ${lead.lang}`,
    "",
    lead.message || "(без тексту: просить передзвонити)",
  ];
  return lines.filter((l) => l !== null).join("\n");
}
