# DieselMedic — website

Static Next.js site (`output: "export"`) in Ukrainian (`/`), Russian (`/ru/`) and English (`/en/`).

## Content: Google Sheet

All business data lives in a Google Sheet (tabs `settings`, `texts`, `schedule`, `services`, `faq`, `addons`, `pages`, and the optional `stats`, `reviews`,
`series` (pages under `/marky/`), `vehicles` (pages under `/avto/`), `articles` (under `/statti/`);
the column format is described at the top of `src/config/sheet.ts`).

- **Build time**: the whole sheet is read and baked into the HTML (what search engines index).
- **In the browser**: prices, phone/messengers, opening hours and calculator extras are re-read on page load,
  so those edits are live immediately. Everything else (texts, services, FAQ, pages) appears after a rebuild:
  run the **Rebuild site** action (see Deploy). Prices in page titles and link previews also refresh then.
- Without `NEXT_PUBLIC_SHEET_ID` the bundled `src/config/default.ts` is used. With it, the build retries
  Google's "too many requests" answers; if the sheet still can't be read, the build fails, so Cloudflare
  keeps the previous version instead of publishing placeholder data. `next dev` falls back to the defaults.
- Keep the cells formatted as plain text (`settings` and `services` already are). Phone numbers like
  `+38 (0..) ...` otherwise turn into formulas (`#ERROR!`) or lose the `+`, and a column that mixes numbers
  with text comes back from Google with one kind blanked (e.g. some prices empty). The build log warns
  about empty prices and says `[config] Loaded from the Google Sheet` when the sheet was read.

Setup: copy `.env.example` to `.env.local`, share the sheet as "Anyone with the link: Viewer".
To refill the sheet from the defaults: `npx tsx scripts/sheet-seed.ts` prints the rows per tab.

## Commands

```bash
npm run dev     # local dev server
npm run build   # static site in ./out
```

## Branches

Each change goes to its own branch off `dev`, then a pull request into `dev`; `dev` goes to `main` by a pull
request. Direct pushes to `main` are stopped by the `.githooks/pre-push` hook (`git config core.hooksPath .githooks`)
and by GitHub; the `from-dev` check fails pull requests into `main` from any other branch.

## Deploy

Cloudflare Workers Builds deploys `main` as static assets from `out/` (see `wrangler.jsonc`); other branches
get preview builds.

- 404 pages: Cloudflare serves the nearest `404.html`. The root one is Ukrainian (`app/global-not-found.tsx`);
  `/ru/404/` and `/en/404/` are copied to `ru/404.html` and `en/404.html` by `scripts/localized-404-adapter.mjs`
  at the end of `next build`, so a missing `/ru/...` page gets the Russian header and text.
- `NEXT_PUBLIC_SHEET_ID` must be set as a build variable of the Worker (Settings → Builds). Without it the site
  ignores the sheet and shows the defaults.
- **Rebuild after sheet edits**: GitHub → Actions → **Rebuild site** → Run workflow. It calls a Cloudflare
  deploy hook for `main` (Workers → disel-site → Settings → Builds → Deploy Hooks), stored as the repository
  secret `CF_DEPLOY_HOOK_URL` (Settings → Secrets and variables → Actions).
