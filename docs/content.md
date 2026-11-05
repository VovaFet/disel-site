# Content: the Google Sheet

All site content and settings live in one Google Sheet; the site has no admin panel. This page lists every tab
and column, says when an edit shows up on the site, and covers the usual tasks and pitfalls.

The sheet ID is in the `NEXT_PUBLIC_SHEET_ID` build variable (see [deploy.md](deploy.md)). The column formats
are also summarised at the top of `src/config/sheet.ts`, and `npx tsx scripts/sheet-seed.ts` prints the rows of
every tab from the bundled defaults (`src/config/default.ts`), which is how the sheet was first filled.

## When an edit shows

- **Live**: the browser re-reads the value from the sheet on every page load, so the change is visible after a
  page reload. The page first renders with the build-time value, then switches.
- **Rebuild**: the value is baked into the static pages. It shows after a rebuild: GitHub → Actions →
  **Rebuild site** → Run workflow (a few minutes), or with the next release.

Live values: contacts (`phone`, `phoneDisplay`, `telegram`, `viber`), `timeZone`, Nova Poshta details,
`pulseInterval`, `cursorGlow` (tab `settings`), opening hours (`schedule`), prices (`services` → `priceFrom`) and
calculator extras (`addons`). Everything else needs a rebuild. Even live values reach search engines, page
titles and link previews only with a rebuild (a price in a page title, the phone in the structured data).

## Rules for every tab

- **The first row is the header.** Don't rename tabs or header cells; the site finds columns by their names.
  Extra columns are ignored (the `settings` tab has a description column for people).
- **Translations**: columns ending in `_uk`, `_ru`, `_en`. An empty `_ru` or `_en` cell falls back to Ukrainian.
- **Order**: rows show on the site in sheet order. Empty rows are skipped.
- **Slugs** (`slug` columns) become page addresses: lowercase Latin letters, digits and hyphens
  (`remont-forsunok`). Changing the slug of a published page changes its URL and loses its search ranking.
- **Plain text format**: keep cells formatted as plain text (Format → Number → Plain text). Otherwise a phone like
  `+38 (050) …` turns into a formula (`#ERROR!`) or loses the `+`. Google also returns a column that mixes numbers
  and text with one kind blanked, e.g. some prices empty; the build warns about services without a valid price.
- **Images**: a `/path` of a file in the repository's `public/` folder (`/photos/injector-repair.jpg`) or a direct
  image URL. Google Drive share links don't work as images. Photos in `public/photos/` get WebP copies for faster
  loading (see [development.md](development.md#images)).
- **Sharing**: the sheet must stay shared as "Anyone with the link: Viewer". Moving it to another Drive folder is
  fine; its ID doesn't change.

### Long texts

`body` columns, `pages` and `articles` use a small text format:

```
## Heading

A paragraph. A blank line starts the next block.

- a list item
- another item
```

A block whose lines all start with `- ` becomes a list; a line starting with `## ` becomes a heading. Bold,
links, tables and emoji are not supported.

## Tabs

### `settings`: key | value | опис

One setting per row. Column C (`опис`) explains each key in Ukrainian; the site ignores it.

| Key | What it does | Shows |
|---|---|---|
| `url` | Site address, no trailing slash (`https://dieselmedic.com.ua`). Canonical URLs, sitemap, structured data. Don't change. | rebuild |
| `phone` | Phone for `tel:` links, `+380XXXXXXXXX` | live |
| `phoneDisplay` | The phone as written on the site, `+38 (050) 922-27-72` | live |
| `telegram` | Telegram link, `https://t.me/…` | live |
| `viber` | Viber link, `viber://chat?number=%2B380…` | live |
| `timeZone` | Time zone for the open/closed badge (`Europe/Kyiv`). Don't change. | live |
| `lat`, `lng` | Map point and coordinates in the structured data. The map shows only once `texts` → `street` is set. | rebuild |
| `postalCode`, `country` | Postal address in the structured data (`country` = `UA`, don't change) | rebuild |
| `npRecipient`, `npPhone`, `npBranch` | Nova Poshta recipient, phone and branch number in the "How to send parts" block, each with a copy button | live |
| `brands` | "Brands we repair" chips on the home page, comma-separated; empty = hidden | rebuild |
| `heroImage` | Photo next to the home page heading; empty = text only | rebuild |
| `protocolImage` | Sample test report photo on the home page; empty = hidden | rebuild |
| `gaId` | Google Analytics 4 ID (`G-…`). Turns on the cookie consent banner; empty = no banner. An ID in another format is ignored with a build warning. | rebuild |
| `pulseInterval` | Background pulse: average pause between runs, seconds (each pause is 60–140% of it, at least 1 s). `0` = off, empty = 10. | live |
| `cursorGlow` | Background dots and glow following the pointer: `1` or empty = on; `0` (or `ні`, `no`, `off`, `false`) = off, only the plain dot grid is left | live |

### `texts`: key | uk | ru | en

Workshop texts in three languages. Rebuild.

| Key | Where it shows |
|---|---|
| `name` | Workshop name: logo, page titles, structured data |
| `city`, `cityIn` | City ("Київ") and the city with a preposition ("в Києві") |
| `area` | Where parts come from, appended to page headings and titles instead of the city: "з усієї України" |
| `street` | Street address. Empty = no address line, map or directions button |
| `region` | Region in the structured data |
| `description` | Site description: the home page lead and the search result snippet |
| `shipping` | The "we accept parts by Nova Poshta" line on the home page |
| `discount` | Discount offer under prices and in the calculator, e.g. "Знижка 10% для УБД, медиків і волонтерів"; empty = hidden |
| `slogan` | Slogan above the home page heading, under the footer logo and in link previews |
| `removedOnly` | "We only work with removed parts" notice on the home page, contacts and next to prices; empty = hidden |

### `schedule`: days | from | to

Opening hours, one row per group of days. `days`: `1-5`, `6` or `1,3` (1 = Monday, 7 = Sunday); `from`, `to`:
`09:00`. Days not listed are shown as days off. Live: the open/closed badge in the header is computed in the
visitor's browser in the `settings` → `timeZone` time zone.

### `services`

One row per service; each gets a page at `/poslugy/<slug>/`, a card on the home page and the services list, and
an entry in the calculator. Only `priceFrom` is live.

| Column | What it is |
|---|---|
| `slug` | Page address. A row without a slug is skipped with a build warning. |
| `group` | `injectors`, `pumps`, `turbo` or `testing`: the section on the services page and the card icon |
| `priceFrom` | "From" price in UAH, a number. `0` shows as "від 0 грн". |
| `perUnitOptions` | Quantities for the calculator, e.g. `1,2,3,4,6,8`: the price is then per unit. Empty = one price per service. |
| `perUnitLabel_*` | Name of the quantity in the calculator, "Кількість форсунок" (needed with `perUnitOptions`) |
| `title_*` | Short name: cards, menus, calculator, breadcrumbs |
| `h1_*` | Page heading; `area` is appended ("… з усієї України") |
| `short_*` | One line under the name on cards |
| `description_*` | Page lead and search result snippet, 150–220 characters |
| `includes_*` | "What's included", one item per line |
| `symptoms_*` | "When to bring it in", one fault sign per line; empty = no block. In "Title. Explanation" the first sentence (or the part before a colon) is shown in bold. |
| `body_*` | Main text (long text format) |
| `image` | Photo on the service page; empty = none |

### `faq`: slug | q_uk | a_uk | q_ru | a_ru | q_en | a_en

Questions and answers. `slug` is the page the question belongs to: a service, brand/series or vehicle page slug,
or `*` for general questions shown on the home page and on every service and landing page. Answers should be short (1–3 sentences): they go
into FAQ structured data too.

### `addons`: id | price | label_uk | label_ru | label_en

Calculator extras (urgent repair, return shipping). `id` is any unique word, `price` is added once per order.
Live.

### `pages`: slug | title_* | description_* | body_*

The information pages: `dostavka` (delivery & payment), `pro-nas` (about us) and `konfidentsiinist` (privacy
policy). Other slugs are ignored; a missing row falls back to the bundled text.

### `stats`: value | label_uk | label_ru | label_en

Optional numbers under the home page hero, e.g. `12` | "років досвіду". Empty tab = no block. Only real figures.

### `reviews`: name | car | rating | text

Optional customer reviews on the home page. `rating` 1–5 or empty; `text` as the customer wrote it. Empty tab =
no block. Only real reviews.

### `series` and `vehicles`

Landing pages for search queries with a brand or series (`series` → `/marky/<slug>/`, e.g. "Bosch CP3") or a
vehicle or engine (`vehicles` → `/avto/<slug>/`, e.g. "Sprinter 2.2 CDI"). An empty tab hides its section from
menus and the sitemap, and its list page is `noindex`.

| Column | What it is |
|---|---|
| `slug` | Page address |
| `services` | Related service slugs, comma-separated. The first one gives the price and the calculator preset; every listed service page links back to this page. |
| `units` | Quantity for the price and calculator, e.g. `4` injectors: the page then shows "від 4 800 грн за 4 шт." Empty = the price per unit. |
| `title_*` | Name on cards, in breadcrumbs and the page title (start with "Ремонт …": `area` and the price are appended to the title) |
| `h1_*` | Page heading (`area` is appended) |
| `short_*` | One line on the list page card |
| `description_*` | Page lead and search snippet |
| `body_*` | Main text (long text format) |

FAQ for these pages goes to the `faq` tab with the page slug.

### `articles`: slug | date | kind | services | image | title_* | description_* | body_*

Articles and repair case studies at `/statti/<slug>/`, newest first; the home page shows the latest three.
`date`: `YYYY-MM-DD` (a row without a valid date or `title_uk` is skipped with a warning). `kind`: `case` for a
case study, empty for an article. `services`: related service slugs, whose pages then link the article. `image`:
cover photo. An empty tab hides the section.

## Common tasks

- **Change a price**: `services` → `priceFrom`. Live; page titles and link previews update on the next rebuild.
- **Change the phone or messengers**: `settings` → `phone`, `phoneDisplay`, `telegram`, `viber`. Live.
- **Change opening hours**: `schedule`. Live.
- **Add a service**: a new `services` row with a unique `slug`, a `group`, `priceFrom` and at least the Ukrainian
  texts, then rebuild.
- **Add a brand, series or vehicle page**: a new row in `series` or `vehicles` with `services` pointing at existing
  service slugs, then rebuild.
- **Publish an article**: a new `articles` row with a `date`, then rebuild.
- **Show a discount**: `texts` → `discount`, then rebuild; empty it to hide.
- **Hide a block**: empty its tab or setting, then rebuild.
- **Turn on the cookie banner**: `settings` → `gaId`, then rebuild.
- **Tune the background**: `settings` → `pulseInterval` (`0` = no pulse) and `cursorGlow` (`0` = no pointer glow).
  Live.

## Writing guidelines

The content brief `docs/TZ-kontent-PNVT-forsunky.docx` has the full guide; in short:

- Ukrainian first; Russian and English as natural translations ("ПНВТ (ТНВД)" in Ukrainian, "ТНВД" in Russian).
- Each page has one main search query, in its H1 and first paragraph.
- Concrete over promotional: brands, series, what is tested, terms in days.
- No made-up figures, years in business, client counts or reviews; no "100% guarantee"; no competitor
  comparisons. Business facts come from the owner.
