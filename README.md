# DieselMedic — website

Website of DieselMedic, a workshop that repairs removed diesel fuel pumps (ПНВТ/ТНВД), injectors and
turbochargers sent in by Nova Poshta from all over Ukraine: https://dieselmedic.com.ua

- Static Next.js 16 site (`output: "export"`) in Ukrainian (`/`), Russian (`/ru/`) and English (`/en/`)
- All content and settings come from a Google Sheet; prices, contacts and hours also refresh in the browser
- Hosted on Cloudflare Workers as static files; `main` is production, `dev` and other branches get previews

## Documentation

| Doc | For |
|---|---|
| [docs/content.md](docs/content.md) | Editing the site: every sheet tab and column, when edits show, common tasks |
| [docs/architecture.md](docs/architecture.md) | How the site works: config pipeline, routes and languages, SEO, browser-side features, styling |
| [docs/development.md](docs/development.md) | Working on the code: setup, branches and releases, checks, recipes |
| [docs/deploy.md](docs/deploy.md) | Cloudflare builds and previews, rebuilding after sheet edits, releasing, rollback |
| `docs/TZ-kontent-PNVT-forsunky.docx` | Content brief: what to write for each page and how |

## Quick start

```bash
npm install
cp .env.example .env.local            # NEXT_PUBLIC_SHEET_ID of the Google Sheet
git config core.hooksPath .githooks   # blocks direct pushes to main
npm run dev                           # http://localhost:3000
npm run build                         # static site in ./out
```

This is Next.js 16: read `node_modules/next/dist/docs/` before relying on older Next.js habits (see `AGENTS.md`).

## Pages

| Path | What | From the sheet |
|---|---|---|
| `/` | Hero, services, calculator, shipping steps, why us, trust blocks, latest articles, FAQ | everything |
| `/poslugy/`, `/poslugy/<slug>/` | Services list and service pages | `services`, `faq` |
| `/marky/`, `/marky/<slug>/` | Brand and series pages (Bosch CP3, VP44…) | `series`, `faq` |
| `/avto/`, `/avto/<slug>/` | Vehicle and engine pages (Sprinter 2.2 CDI…) | `vehicles`, `faq` |
| `/statti/`, `/statti/<slug>/` | Articles and repair case studies | `articles` |
| `/dostavka/`, `/pro-nas/`, `/konfidentsiinist/` | Delivery & payment, About us, Privacy policy | `pages` |
| `/kontakty/` | Contacts | `settings`, `texts`, `schedule` |

## Everyday tasks

- **Edit content**: change the Google Sheet. Prices, contacts, hours and the background settings show after a page
  reload; everything else after GitHub → Actions → **Rebuild site** (see [docs/content.md](docs/content.md)).
- **Change the code**: a branch off `dev`, a pull request into `dev`, then a `Release 2.0.x` pull request from
  `dev` into `main` (see [docs/development.md](docs/development.md)).
- **Something broke in production**: Cloudflare → Workers → disel-site → Deployments → Rollback (see
  [docs/deploy.md](docs/deploy.md#rolling-back)).
