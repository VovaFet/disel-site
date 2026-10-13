# DieselMedic — website

Static Next.js site (`output: "export"`) in Ukrainian (`/`), Russian (`/ru/`) and English (`/en/`).

## Content: Google Sheet

All business data lives in a Google Sheet (tabs `settings`, `texts`, `schedule`, `services`, `faq`, `addons`, `pages`, and the optional `stats`, `reviews`;
the column format is described at the top of `src/config/sheet.ts`).

- **Build time**: the whole sheet is read and baked into the HTML (what search engines index).
- **In the browser**: prices, phone/messengers, opening hours and calculator extras are re-read on page load,
  so those edits are live immediately. Everything else (texts, services, FAQ, pages) appears after a rebuild:
  run the **Rebuild site** action (see Deploy). Prices in page titles and link previews also refresh then.
- If the sheet is unreachable, `src/config/default.ts` is used (the build never fails).
- The `value` column of `settings` is formatted as plain text, so phone numbers like `+38 (0..) ...`
  are not turned into formulas (`#ERROR!`) or numbers that lose the `+`.

Setup: copy `.env.example` to `.env.local`, share the sheet as "Anyone with the link: Viewer".
To refill the sheet from the defaults: `npx tsx scripts/sheet-seed.ts` prints the rows per tab.

## Commands

```bash
npm run dev     # local dev server
npm run build   # static site in ./out
```

## Deploy

Cloudflare Workers Builds deploys `main` as static assets from `out/` (see `wrangler.jsonc`); other branches
get preview builds.

- `NEXT_PUBLIC_SHEET_ID` must be set as a build variable of the Worker (Settings → Builds). Without it the site
  ignores the sheet and shows the defaults.
- **Rebuild after sheet edits**: GitHub → Actions → **Rebuild site** → Run workflow. It calls a Cloudflare
  deploy hook for `main` (Workers → disel-site → Settings → Builds → Deploy Hooks), stored as the repository
  secret `CF_DEPLOY_HOOK_URL` (Settings → Secrets and variables → Actions).
