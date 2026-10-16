# DieselMedic — website

Static Next.js 16 site (`output: "export"`) for a diesel fuel pump, injector and turbocharger repair workshop in Odesa,
in Ukrainian (`/`), Russian (`/ru/`) and English (`/en/`). The content comes from a Google Sheet; the site is
deployed to Cloudflare Workers as static files.

## Pages

| Path | What | From the sheet |
|---|---|---|
| `/` | Hero, services, calculator, shipping steps with Nova Poshta details, why us, trust blocks, latest articles, FAQ | everything below |
| `/poslugy/`, `/poslugy/<slug>/` | Services list and service pages | `services`, `faq` |
| `/marky/`, `/marky/<slug>/` | Brand and series pages (Bosch CP3, VP44…) | `series`, `faq` |
| `/avto/`, `/avto/<slug>/` | Vehicle and engine pages (Sprinter 2.2 CDI…) | `vehicles`, `faq` |
| `/statti/`, `/statti/<slug>/` | Articles and repair case studies | `articles` |
| `/dostavka/`, `/pro-nas/` | Delivery & payment, About us | `pages` |
| `/kontakty/` | Contacts, map, directions | `settings`, `texts`, `schedule` |

Every page exists in the three languages; an empty translation cell falls back to Ukrainian. A section whose
tab is empty (`series`, `vehicles`, `articles`) stays out of the menus and the sitemap, and its list page is
`noindex`. Missing pages get a 404 page in their language (see Deploy).

## Content: the Google Sheet

The column formats are listed at the top of `src/config/sheet.ts`; `npx tsx scripts/sheet-seed.ts` prints the
rows of every tab from the bundled defaults.

| Tab | What it controls | When edits show |
|---|---|---|
| `settings` | Site url, phone, Telegram, Viber, time zone, map point; Nova Poshta details `npRecipient`, `npPhone`, `npBranch`; trust blocks `brands`, `heroImage`, `protocolImage` | contacts and Nova Poshta: live; the rest: rebuild |
| `texts` | Workshop name, city, address, site description, shipping line, `discount` | rebuild |
| `schedule` | Opening hours (days `1-5`, `6`; 1 = Monday) | live |
| `services` | Services: `slug`, `group` (`injectors`, `pumps`, `turbo`, `testing`), `priceFrom`, calculator quantities, texts | `priceFrom`: live; the rest: rebuild |
| `faq` | Questions by page `slug` (a service, brand or vehicle page); `*` = on every service page | rebuild |
| `addons` | Calculator extras (express service, return shipping) | live |
| `pages` | Delivery & payment and About us texts | rebuild |
| `stats`, `reviews` | Home page numbers and customer reviews (optional) | rebuild |
| `series`, `vehicles` | Brand/series and vehicle pages: same fields as services plus `services` (related service slugs, the first gives the price and the calculator) and `units` (calculator quantity) | rebuild |
| `articles` | Articles: `slug`, `date` (`YYYY-MM-DD`), `kind` (`case` for a case study), `services`, `image`, texts | rebuild |

**Live** = the browser re-reads it on every page load. **Rebuild** = after GitHub → Actions → **Rebuild site**
(a few minutes, see Deploy). Prices in page titles and link previews also update only on a rebuild.

Common tasks:

- **Change a price**: `services` → `priceFrom`. `0` shows as "від 0 грн" until a real price is set.
- **Add a service**: a new `services` row with a unique `slug` (it becomes the page address `/poslugy/<slug>/`),
  its `group` and at least the Ukrainian texts, then rebuild. Rows are shown in sheet order; a row without a
  slug is skipped with a build warning.
- **Discount**: `texts` → `discount`, e.g. "Знижка 10% для УБД, медиків і волонтерів". It shows on the home
  page, under the prices and in the calculator; empty = hidden.
- **Hide a section or block**: empty its tab (or `settings` value) and rebuild.
- **Images** (`heroImage`, `protocolImage`, an article's `image`): a direct image URL or a `/path` of a file in
  `public/`. Google Drive share links don't work as images.
- **Long texts** (`body`, `pages`, `articles`): a blank line starts a new paragraph, `## ` a heading, `- ` a list item.

Keep the cells formatted as plain text (`settings`, `services`, `schedule`, `addons` and the optional tabs
already are). Phone numbers like `+38 (0..) ...` otherwise turn
into formulas (`#ERROR!`) or lose the `+`, and a column that mixes numbers with text comes back from Google
with one kind blanked (e.g. some prices empty).

How the build reads the sheet: without `NEXT_PUBLIC_SHEET_ID` the bundled `src/config/default.ts` is used.
With it, the build retries Google's "too many requests" answers; if the sheet still can't be read, the build
fails, so Cloudflare keeps the previous version instead of publishing placeholder data (`next dev` falls back
to the defaults). The build log says `[config] Loaded from the Google Sheet` and warns about services without
a valid price.

## Development

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SHEET_ID; the sheet is shared as "Anyone with the link: Viewer"
npm run dev                  # local dev server
npm run build                # static site in ./out
```

This is Next.js 16: read `node_modules/next/dist/docs/` before relying on older Next.js habits (see `AGENTS.md`).

- `src/config/` — config types, bundled defaults, the Google Sheet loader
- `src/app/` — routes: `(uk)/` for Ukrainian at the root, `[lang]/` for `/ru` and `/en`; sitemap, robots, 404
- `src/views/` — page bodies shared by both route trees (pages, landings, articles, link preview images)
- `src/components/` — UI pieces; `Live*` and the calculator use the values the browser refreshes
- `src/i18n/` — interface strings in three languages
- `scripts/` — sheet seed, the build adapter that writes per-language 404 pages

## Branches

Each change goes to its own branch off `dev`, then a pull request into `dev`; `dev` goes to `main` by a pull
request. Direct pushes to `main` are stopped by the `.githooks/pre-push` hook (`git config core.hooksPath .githooks`)
and by GitHub; the `from-dev` check fails pull requests into `main` from any other branch.

## Deploy

Cloudflare Workers Builds deploys `main` as static assets from `out/` (see `wrangler.jsonc`); other branches
get preview builds.

- `NEXT_PUBLIC_SHEET_ID` must be set as a build variable of the Worker (Settings → Builds). Without it the site
  ignores the sheet and shows the defaults.
- **Rebuild after sheet edits**: GitHub → Actions → **Rebuild site** → Run workflow. It calls a Cloudflare
  deploy hook for `main` (Workers → disel-site → Settings → Builds → Deploy Hooks), stored as the repository
  secret `CF_DEPLOY_HOOK_URL` (Settings → Secrets and variables → Actions).
- 404 pages: Cloudflare serves the nearest `404.html`. The root one is Ukrainian (`app/global-not-found.tsx`);
  `/ru/404/` and `/en/404/` are copied to `ru/404.html` and `en/404.html` by `scripts/localized-404-adapter.mjs`
  at the end of `next build`, so a missing `/ru/...` page gets the Russian header and text.
