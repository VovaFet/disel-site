// Cloudflare Worker in front of the static site (wrangler.jsonc). It runs only for /api/*; every other request
// is served from the static files in out/ without it.
//
// POST /api/message: a message from the chat form (src/components/ChatWidget.tsx). It goes to the workshop's
// Telegram chat through a bot and is added as a row to the leads sheet through its Apps Script web app
// (scripts/leads-sheet.gs). Secrets, set in Cloudflare → Workers → disel-site → Settings → Variables and Secrets:
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  where the message goes
//   LEADS_SHEET_URL, LEADS_SHEET_KEY      the web app's /exec address and the key it checks
// Either pair is enough: the visitor gets "sent" when at least one of them took the message.
import { isBot, parseLead, PRODUCTION_HOST, telegramText, type Lead } from "./lead";

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  LEADS_SHEET_URL?: string;
  LEADS_SHEET_KEY?: string;
  // a few messages a minute from one address (ratelimits in wrangler.jsonc)
  MESSAGE_LIMIT?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

type Context = { waitUntil(promise: Promise<unknown>): void };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

// The secrets as set, without the spaces or line breaks a pasted value can bring along; empty = not set
const secrets = (env: Env) => {
  const value = (v?: string) => v?.trim() || undefined;
  return {
    token: value(env.TELEGRAM_BOT_TOKEN),
    chat: value(env.TELEGRAM_CHAT_ID),
    sheetUrl: value(env.LEADS_SHEET_URL),
    sheetKey: value(env.LEADS_SHEET_KEY),
  };
};

async function sendTelegram(token: string, chat: string, lead: Lead, host: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text: telegramText(lead, host),
      link_preview_options: { is_disabled: true },
    }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function saveToSheet(sheetUrl: string, sheetKey: string, lead: Lead, host: string) {
  const url = new URL(sheetUrl);
  url.searchParams.set("key", sheetKey);
  // Apps Script answers a POST with a redirect to the result, which fetch follows
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...lead, page: `https://${host}${lead.page}`, test: host !== PRODUCTION_HOST }),
  });
  const answer = (await res.text()).trim();
  if (!res.ok || answer !== "ok") throw new Error(`Sheet ${res.status}: ${answer.slice(0, 200)}`);
}

// true once the message is delivered; a failure is logged (Workers Logs), added to `errors` and gives false
const settle = (p: Promise<void> | null, what: string, errors: string[]) =>
  p
    ? p.then(
        () => true,
        (e) => {
          const error = `${what}: ${e instanceof Error ? e.message : e}`;
          console.error(error);
          errors.push(error);
          return false;
        },
      )
    : Promise.resolve(false);

async function handleMessage(request: Request, env: Env, ctx: Context) {
  const url = new URL(request.url);
  // Only the site's own pages may post here
  if (request.headers.get("origin") !== url.origin) return json({ ok: false, error: "origin" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return json({ ok: false, error: "size" }, 413);
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (env.MESSAGE_LIMIT && !(await env.MESSAGE_LIMIT.limit({ key: ip })).success) {
    return json({ ok: false, error: "rate" }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "json" }, 400);
  }
  // Bots get "sent" so they don't retry, and nothing goes anywhere
  if (isBot(body)) return json({ ok: true });
  const lead = parseLead(body);
  if (!lead) return json({ ok: false, error: "phone" }, 400);

  const host = url.hostname;
  const { token, chat, sheetUrl, sheetKey } = secrets(env);
  const telegram = token && chat ? sendTelegram(token, chat, lead, host) : null;
  const sheet = sheetUrl && sheetKey ? saveToSheet(sheetUrl, sheetKey, lead, host) : null;
  if (!telegram && !sheet) return json({ ok: false, error: "not configured" }, 503);
  const errors: string[] = [];
  const telegramDone = settle(telegram, "telegram", errors);
  const sheetDone = settle(sheet, "sheet", errors);

  // Answer as soon as Telegram has the message; the sheet row may finish after the response
  if (await telegramDone) {
    ctx.waitUntil(sheetDone);
    return json({ ok: true });
  }
  if (await sheetDone) return json({ ok: true });
  // Previews say why, to set up the secrets; production keeps the answers of Telegram and the sheet to itself
  return json({ ok: false, error: "delivery", ...(host !== PRODUCTION_HOST && { details: errors }) }, 502);
}

const worker = {
  async fetch(request: Request, env: Env, ctx: Context) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/message") {
      return request.method === "POST" ? handleMessage(request, env, ctx) : json({ ok: false }, 405);
    }
    return json({ ok: false }, 404);
  },
};

export default worker;
