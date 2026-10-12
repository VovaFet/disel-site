# DieselMedic — website

Static Next.js site (`output: "export"`) in Ukrainian (`/`), Russian (`/ru/`) and English (`/en/`).

## Content: Google Sheet

All business data lives in a Google Sheet (tabs `settings`, `texts`, `schedule`, `services`, `faq`, `addons`;
the column format is described at the top of `src/config/sheet.ts`).

- **Build time**: the whole sheet is read and baked into the HTML (what search engines index).
- **In the browser**: prices, phone/messengers, opening hours and calculator extras are re-read on page load,
  so those edits are live immediately. Edits to texts/services appear after the next build.
- If the sheet is unreachable, `src/config/default.ts` is used (the build never fails).

Setup: copy `.env.example` to `.env.local`, share the sheet as "Anyone with the link: Viewer".
To refill the sheet from the defaults: `npx tsx scripts/sheet-seed.ts` prints the rows per tab.

## Commands

```bash
npm run dev     # local dev server
npm run build   # static site in ./out
```

Deploy `out/` to any static host (Cloudflare Pages, Netlify, Vercel). On Cloudflare Pages set
`NEXT_PUBLIC_SHEET_ID` in the project settings and add a Deploy Hook to rebuild after text edits.
