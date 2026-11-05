# Architecture

How the site is put together: where the data comes from, how pages are built, and what runs in the browser.

## Overview

- **Next.js 16 static export** (`output: "export"` in `next.config.ts`): `next build` writes plain HTML, CSS, JS
  and images to `out/`. There is no server; Cloudflare Workers serves the files as static assets
  (see [deploy.md](deploy.md)).
- **Content from a Google Sheet** at build time, with a few values refreshed in the browser (see below and
  [content.md](content.md)).
- **Three languages**: Ukrainian at the root (`/`), Russian at `/ru/`, English at `/en/`.
- React 19, TypeScript, plain CSS (`src/app/globals.css`), no UI framework. Fonts via `next/font` (Inter; Fira Sans
  Extra Condensed for the logo wordmark).

This is Next.js 16, which differs from older versions: read the guides in `node_modules/next/dist/docs/` before
relying on older habits (see `AGENTS.md`).

## Directory layout

```
src/
  app/          routes; (uk)/ = Ukrainian at the root, [lang]/ = /ru and /en; sitemap, robots, icons,
                global-not-found.tsx (root 404), globals.css
  views/        page bodies shared by both route trees: pages.tsx (home, services, contacts, info pages),
                landings.tsx (/marky, /avto), articles.tsx (/statti), RootShell.tsx (html, head, header, footer),
                ogImage.tsx (link preview images)
  components/   UI pieces (header, footer, calculator, trust blocks, background effects, cookie banner, Google tags…)
  config/       types.ts (config shape), default.ts (bundled defaults), sheet.ts (Google Sheet loader),
                index.ts (getConfig for the build)
  i18n/         interface strings in three languages, localePath(), price and date formatting
  lib/          schema.ts (structured data), hours.ts (opening hours), logo.ts (logo mark), theme.ts,
                consent.ts (cookie consent)
  assets/fonts/ fonts for link preview images
public/         files served as is: photos (JPG + WebP copies), logo.png
scripts/        build adapter for localized 404 pages, sheet seed, icon and WebP generators
docs/           this documentation and the content brief
```

## Config: from the sheet to the page

The whole site is driven by one object, `SiteConfig` (`src/config/types.ts`).

1. **Build time.** `getConfig()` (`src/config/index.ts`) loads it once per build:
   - with `NEXT_PUBLIC_SHEET_ID` set, `loadSiteConfig()` (`src/config/sheet.ts`) reads every tab through
     Google's CSV export (`/gviz/tq?tqx=out:csv`) and maps the rows onto `SiteConfig`, falling back to
     `src/config/default.ts` for missing values;
   - without it, the bundled defaults are used as they are.

   Google answers parallel requests with "429 Too Many Requests" now and then, so each tab is retried with
   backoff (5 attempts). If the sheet still can't be read, a production build fails, and Cloudflare keeps the
   previous version online instead of publishing placeholder data; `next dev` falls back to the defaults. Every
   build request carries a new `SHEET_BUILD_STAMP` (from `next.config.ts`), so Next never reuses sheet data cached
   by an earlier build. The build log says `[config] Loaded from the Google Sheet` and prints warnings for skipped
   rows and invalid values.

2. **In the browser.** The frequently changing values form `LiveConfig`: contacts, time zone, opening hours, Nova
   Poshta details, prices, calculator extras, `pulseInterval`, `pulseSpeed` and `cursorGlow`. `LiveConfigProvider`
   (`src/components/LiveConfig.tsx`) starts from the build-time values (already in the HTML) and then calls
   `loadLiveConfig()`, which re-reads the `settings`, `schedule`, `services` and `addons` tabs, so these edits
   show without a rebuild. Components read them with `useLive()`; `Live.tsx` has the ready-made pieces
   (`Price`, `PhoneLink`, `MessengerLink`, `HoursList`…). On a network error the build-time values stay.

## Routes and languages

Each language has its own root layout: `src/app/(uk)/layout.tsx` for Ukrainian and `src/app/[lang]/layout.tsx`
for `ru` and `en`. Both route trees contain the same thin `page.tsx` files, which call shared views from
`src/views/` with the language. `localePath(lang, path)` builds addresses (`/poslugy/` → `/ru/poslugy/`).

| Path | View |
|---|---|
| `/` | `HomePage` (pages.tsx) |
| `/poslugy/`, `/poslugy/<slug>/` | services list and service page (pages.tsx) |
| `/marky/…`, `/avto/…` | `LandingRoute` (landings.tsx), one optional catch-all route per section |
| `/statti/…` | `ArticleRoute` (articles.tsx) |
| `/dostavka/`, `/pro-nas/`, `/konfidentsiinist/` | info pages from the `pages` tab (pages.tsx) |
| `/kontakty/` | contacts (pages.tsx) |
| `/og.png`, `/poslugy/<slug>/og.png` | link preview images (ogImage.tsx), rendered at build time |

The landing and article sections use optional catch-all routes (`[[...slug]]`) because a static export needs at
least one page per route: the list page is always built, and stays `noindex` and out of menus and the sitemap
until the section has pages.

**404 pages.** Cloudflare serves the nearest `404.html`. The root one is Ukrainian (`app/global-not-found.tsx`).
`/ru/404/` and `/en/404/` are built as normal pages and copied to `ru/404.html` and `en/404.html` by
`scripts/localized-404-adapter.mjs` at the end of `next build`, so a missing `/ru/…` page gets the Russian header
and text.

Interface strings (buttons, headings, labels) live in `src/i18n/index.ts`, one object per language with the same
shape; content strings come from the sheet.

## SEO

- **Metadata**: `rootMetadata()` and `pageMetadata()` (`src/views/RootShell.tsx`) give every page a title
  (`<page> | DieselMedic`), a description, a canonical URL and hreflang alternates for all three languages plus
  `x-default`, and Open Graph tags with the page's own URL.
- **Link previews**: `/og.png` per language and `/poslugy/<slug>/og.png` per service, drawn by `next/og` at build
  time with Inter loaded from `src/assets/fonts` (the bundled font has no Cyrillic). Other pages use the home one.
- **Structured data** (`src/lib/schema.ts`, rendered by `JsonLd`): `AutoRepair` business with address, phone and
  hours (and coordinates once `texts` → `street` is set) on every page; `WebSite` (site name for Google results) on the home page; `Service` with an
  `Offer` on service pages; `BreadcrumbList`; `FAQPage` where there are questions; `BlogPosting` for articles.
- **Sitemap and robots** (`src/app/sitemap.ts`, `src/app/robots.ts`): every page in every language with its
  alternates; empty sections are left out. Robots allows everything and points to the sitemap.

## Browser-side features

All of these are client components that enhance the static HTML; the content itself is in the HTML from the
start.

- **Open status** (`OpenStatus.tsx`, `lib/hours.ts`): "Open until 19:00" / "Closed, opening tomorrow at 09:00",
  computed in the browser in the business time zone and refreshed every minute.
- **Calculator** (`PriceCalculator.tsx`): service, quantity (`perUnitOptions`) and extras; total = price ×
  quantity + extras, using live prices.
- **Theme** (`ThemeToggle.tsx`, `lib/theme.ts`): light/dark switch; without a saved choice the system theme
  applies. The choice is kept in `localStorage` (`theme`) and applied by an inline script in `<head>` before the
  first paint, so the page never flashes in the other theme.
- **Background** (`MouseBackground.tsx`): a fixed dot grid (CSS, 24px tiles) whose dots light up and glow around
  the pointer; the position goes into CSS variables, so React never re-renders. `cursorGlow = 0` in the sheet
  leaves only the plain grid. With reduced motion the glow stays put.
- **Pulse** (`PulseBackground.tsx`): now and then the logo's pulse (the beat parsed from `logoPulse` in
  `lib/logo.ts`) sweeps left to right along a random row of that grid, lighting dots that then fade. Drawn on a
  canvas only while a run is on screen; the pause and speed come from `pulseInterval` and `pulseSpeed`. Off with
  reduced motion; runs don't start while the tab is hidden.
- **Cookie consent** (`CookieBanner.tsx`, `lib/consent.ts`): shown only when `settings` → `gaId` or `adsId` is set.
  The answer (`granted` / `denied`) is kept in `localStorage` (`cookie-consent`) and announced with a
  `cookie-consent` window event; "Cookie settings" in the footer clears it.
- **Google tags** (`GoogleTags.tsx`): Analytics 4 and Ads as one `gtag.js`, injected only after consent is granted
  ("basic" consent mode: before that nothing is sent and no script loads) and only on the `url` host, so previews
  stay out of the statistics. Declining later sets consent to denied, turns the tags off (`ga-disable-<id>`) and
  deletes the `_ga*` / `_gcl*` cookies. Clicks on `tel:`, Telegram and Viber links go out as the `contact` event
  with `method`; client-side page views are counted by Analytics' history-change tracking.
- **Reveal** (`Reveal.tsx`): content fades in when scrolled into view (shown at once without JS or with reduced
  motion).
- **IntentLink** (`IntentLink.tsx`): links that prefetch a page only on hover, focus or touch, so a grid of service
  cards doesn't download every service photo up front.
- **Nova Poshta details** (`ShippingDetails.tsx`): recipient, phone and branch with copy buttons.

## Styling

One stylesheet, `src/app/globals.css`, with colours as CSS variables on `:root` and redefined for the dark theme
(`prefers-color-scheme` and `[data-theme]`):

| Variable | Use |
|---|---|
| `--bg`, `--surface`, `--border` | page, cards, borders |
| `--fg`, `--muted` | text, secondary text |
| `--brand` | logo orange (`#e8590c`) |
| `--accent` | orange for text and outlines (deeper in the light theme to keep 4.5:1 contrast) |
| `--accent-bg`, `--accent-fg` | filled buttons and their text |
| `--ok`, `--closed` | open/closed status |

Text colours are kept at WCAG AA contrast (4.5:1) against `--bg` and `--surface` in both themes; check new colour
pairs before using them. Mobile layout has a fixed call bar at the bottom (Call / Viber / Telegram), and fixed
elements above it (the cookie banner) leave room for it.

## Images

`SheetImage` (`src/components/SheetImage.tsx`) renders a sheet image path. For a JPG or PNG in `public/` it looks
for WebP copies named `<name>-<width>.webp` next to it at build time and outputs a `<picture>` with a `srcset`, so
phones get a small file; the hero photo is loaded with high priority. The copies are made by
`scripts/make-webp.ts` (see [development.md](development.md#images)).

The favicons, `apple-icon.png` and `public/logo.png` are generated from the logo mark in `src/lib/logo.ts` by
`scripts/make-icons.ts`.
