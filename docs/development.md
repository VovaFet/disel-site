# Development

Working on the code: local setup, the branch and release flow, checks before a pull request, and recipes for
common changes.

## Setup

```bash
npm install
cp .env.example .env.local     # NEXT_PUBLIC_SHEET_ID: the production sheet (shared as "Anyone with the link: Viewer")
git config core.hooksPath .githooks   # once per clone: blocks direct pushes to main
npm run dev                    # http://localhost:3000
```

Without `NEXT_PUBLIC_SHEET_ID` the site runs on the bundled defaults (`src/config/default.ts`, placeholder
contacts). `next dev` also falls back to them if the sheet can't be read.

This is Next.js 16: read the relevant guide in `node_modules/next/dist/docs/` before writing code that relies on
older Next.js behaviour (see `AGENTS.md`).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Static site in `out/` (reads the sheet when `NEXT_PUBLIC_SHEET_ID` is set) |
| `npx serve out` | Serve the built site locally, as Cloudflare would |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npx tsx scripts/sheet-seed.ts` | Print every sheet tab from the bundled defaults (JSON) |
| `npx tsx scripts/make-webp.ts` | WebP copies of the photos in `public/photos/` |
| `npx tsx scripts/make-icons.ts` | Favicons, `apple-icon.png` and `public/logo.png` from the logo mark |

## Branches and releases

```
feature/… or fix/… ──PR──▶ dev ──PR "Release 2.0.x"──▶ main ──▶ production
```

- **One change, one branch.** Branch off `dev`: `feature/<name>`, `fix/<name>` or `docs/<name>`. Unrelated changes
  go to separate branches and pull requests.
- **Pull request into `dev`**, merged with a merge commit. GitHub deletes the branch after the merge ("Automatically
  delete head branches" is on), and with it Cloudflare's preview of that branch. Never delete `dev` or `main`.
- **Release**: a pull request from `dev` into `main` titled `Release 2.0.x` (the patch number goes up by one each
  time), listing the merged pull requests. Merging it deploys production (see [deploy.md](deploy.md)).
- **`main` is protected.** The `protect-main` ruleset requires a pull request; the `from-dev` check
  (`.github/workflows/main-from-dev.yml`) fails pull requests into `main` from any branch other than `dev`; the
  `.githooks/pre-push` hook stops direct pushes locally.

Commit messages: a short imperative subject saying what changes for the site ("Hide the background glow entirely
when the pointer glow is turned off"), then a body explaining why and how it was checked.

## Before a pull request

1. `npx tsc --noEmit` and `npm run lint` pass.
2. `npm run build` with `NEXT_PUBLIC_SHEET_ID` set passes, without new `[config]` warnings.
3. Check the change in the built site (`npx serve out`): both themes, a phone width (390px) and a desktop width,
   and the Russian and English versions if texts changed.
4. Pages you touched keep their Lighthouse scores: accessibility 100 in both themes, performance close to 100 on
   mobile. Lighthouse runs from Chrome DevTools or `npx lighthouse <url>`; for the dark theme pass
   `--chrome-flags="--blink-settings=preferredColorScheme=0"`.
5. Docs updated: [content.md](content.md) for anything the sheet controls, [architecture.md](architecture.md) for
   new mechanisms.

There are no automated tests; the checks above are the safety net.

## Recipes

### A new setting in the sheet

1. `src/config/types.ts`: add the field to `SiteConfig` with a comment. If the browser should pick it up without a
   rebuild, add it to `LiveConfig` and to `toLive()` too.
2. `src/config/default.ts`: its default value.
3. `src/config/sheet.ts`: describe it in the header comment and read it in `loadSiteConfig()` (and in
   `loadLiveConfig()` if live). Validate it: an invalid value should fall back to the default with a
   `console.warn("[config] …")`, not break the build.
4. `scripts/sheet-seed.ts`: add the row.
5. Use it: server components get `config` from `getConfig()`; client components read live values with `useLive()`.
6. Add the row to the `settings` tab with a description in column C, and document it in [content.md](content.md).

### A new page

1. The view in `src/views/` (a function taking `lang`), with metadata from `pageMetadata()`.
2. A thin `page.tsx` in both route trees: `src/app/(uk)/<path>/` and `src/app/[lang]/<path>/`.
3. Interface strings in `src/i18n/index.ts` for all three languages.
4. Add the path to `src/app/sitemap.ts`, and to the menus and footer in `src/components/SiteHeader.tsx` /
   `MobileMenu.tsx` if it should be linked there.

### Interface text

Strings that are not content (buttons, headings, labels) are in `src/i18n/index.ts`. Add a key to all three
language objects; TypeScript checks that `ru` and `en` have the same shape as `uk`.

### Images

Put the photo (a horizontal JPG, ideally 1600px or wider) into `public/photos/`, run
`npx tsx scripts/make-webp.ts` (480px and 960px WebP copies, never wider than the original) and commit both. Then
reference it from the sheet as `/photos/<name>.jpg`. `SheetImage` picks up the WebP copies by name.

### Logo and icons

The mark is defined in `src/lib/logo.ts` (gauge arc and pulse on a 64×64 grid) and used by the header logo, link
preview images, the background pulse and the icons. After changing it, run `npx tsx scripts/make-icons.ts`.

## Conventions

- Comments explain why, not what, in the style of the surrounding code; every component file starts with a short
  comment on what it is for.
- Colours only through the CSS variables in `globals.css`, keeping text at WCAG AA contrast in both themes.
- Client components (`"use client"`) only where the browser is needed; content stays in the static HTML.
- Animations respect `prefers-reduced-motion` and must not hurt Lighthouse (no layout shifts, nothing heavy before
  the main content has loaded).
