// A message from the chat form: checking it and the text that goes to Telegram (kept apart from index.ts,
// whose named exports Cloudflare would read as entrypoints)

export type Lead = { name: string; phone: string; message: string; page: string; lang: string };

// Messages from any other host (branch previews) are marked as tests
export const PRODUCTION_HOST = "dieselmedic.com.ua";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// A phone number as people type it: digits with spaces, brackets, dashes and a leading +; 10 to 13 digits.
// The form checks it with the same rule (src/components/ChatWidget.tsx).
export const isPhone = (v: string) => /^\+?[\d\s()-]{10,20}$/.test(v) && /^\d{10,13}$/.test(v.replace(/\D/g, ""));

// Bots fill in the hidden field or send the form within a second and a half of opening it
export const isBot = (body: Record<string, unknown>) => Boolean(text(body.website, 100)) || !(Number(body.elapsed) >= 1500);

export function parseLead(body: Record<string, unknown>): Lead | null {
  const lead = {
    name: text(body.name, 80),
    phone: text(body.phone, 20),
    message: text(body.message, 2000),
    page: text(body.page, 300),
    lang: ["uk", "ru", "en"].includes(body.lang as string) ? (body.lang as string) : "uk",
  };
  return isPhone(lead.phone) ? lead : null;
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
