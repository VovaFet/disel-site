# Deploy

The site is hosted on Cloudflare Workers as static assets: the Worker `disel-site` (note the spelling) serves the
`out/` folder of `next build`, with no server code (`wrangler.jsonc`).

## Sites

| Address | What |
|---|---|
| https://dieselmedic.com.ua | Production: branch `main` |
| https://disel-site.f-vladimir97.workers.dev | The same production build at its Cloudflare address |
| https://dev-disel-site.f-vladimir97.workers.dev | Preview of branch `dev` |
| `https://<branch>-disel-site.f-vladimir97.workers.dev` | Previews of other branches while they exist |

## How builds run

Cloudflare Workers Builds is connected to the GitHub repository (Workers → disel-site → Settings → Builds):

- **Production**: every push to `main` (i.e. every merged release pull request) runs `npm run build` and
  `npx wrangler deploy`. It takes about 3 minutes.
- **Previews**: pushes to other branches build a preview version with its own URL (the defaults are on the
  "Previews Base" tab; `dev` has its own preview settings). A branch's preview is deleted together with the branch.

**Build variables are set per trigger.** `NEXT_PUBLIC_SHEET_ID` (the Google Sheet ID, also in `.env.example`) must
be set for Production, for the `dev` preview and in Previews Base. A build without it ignores the sheet and shows
the bundled placeholder data (for example the phone `+380000000000`).

If the sheet can't be read during a production build, the build fails and the previous version stays online
(see [architecture.md](architecture.md#config-from-the-sheet-to-the-page)). The build log in Cloudflare should show
`[config] Loaded from the Google Sheet`.

## Rebuilding after sheet edits

Content that is not live (see [content.md](content.md#when-an-edit-shows)) changes only when production is
rebuilt:

**GitHub → Actions → Rebuild site → Run workflow.** The workflow (`.github/workflows/rebuild-site.yml`) calls a
Cloudflare deploy hook for `main`, stored as the repository secret `CF_DEPLOY_HOOK_URL` (Settings → Secrets and
variables → Actions; the hook itself is under Workers → disel-site → Settings → Builds → Deploy Hooks). A release
rebuilds the site too, so sheet edits made before a release go live with it.

The `dev` preview doesn't rebuild on sheet edits either: use Retry build on its latest build in Cloudflare, or
push to `dev`.

## Releasing

1. Merge the changes into `dev` (see [development.md](development.md#branches-and-releases)) and check them on the
   `dev` preview.
2. Open a pull request from `dev` into `main` titled `Release 2.0.x`, listing the merged pull requests, and merge
   it.
3. Wait for the production build (about 3 minutes) and check https://dieselmedic.com.ua: the changed pages, and
   the phone and prices from the sheet.

## Rolling back

- **Fastest**: Cloudflare → Workers → disel-site → Deployments → pick the previous version → Rollback. It takes
  effect at once and doesn't touch the code; the next build deploys `main` again.
- **In the code**: open the merged pull request into `dev` on GitHub and press Revert. Merge the revert pull
  request into `dev`, then release as usual. (Reverting a release pull request directly into `main` is blocked
  by the `from-dev` check.)
- A deleted branch can be restored from its pull request page (Restore branch).

## Static file details

- `wrangler.jsonc`: `assets.directory` is `./out`; `not_found_handling: "404-page"` makes Cloudflare serve the
  nearest `404.html` (root, `ru/404.html`, `en/404.html`) with status 404.
- `trailingSlash: true` in `next.config.ts`: every page is a folder with `index.html` (`/poslugy/`).
- Robots allow indexing everywhere, including previews; every page's canonical URL points to
  dieselmedic.com.ua, so search engines treat previews as duplicates of production.
