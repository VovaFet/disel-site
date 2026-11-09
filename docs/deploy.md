# Deploy

The site is hosted on Cloudflare Workers as static assets: the Worker `disel-site` (note the spelling) serves the
`out/` folder of `next build` (`wrangler.jsonc`). The only server code, `worker/index.ts`, runs for `/api/*` (the
chat form, see [Chat form](#chat-form)).

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

## Chat form

Messages from the site's chat form (see [architecture.md](architecture.md#chat-form)) go to a Telegram chat and to
the Google Sheet "Заявки з сайту DieselMedic" (tab «Заявки»). Both are set up once, with secrets in Cloudflare →
Workers → disel-site → Settings → Variables and Secrets (type **Secret**; they survive deploys, and branch
previews use the same ones, so their test messages arrive in the same chat and sheet, marked as tests):

| Secret | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | The bot's token from @BotFather (`/newbot`) |
| `TELEGRAM_CHAT_ID` | The chat that receives messages: press Start in the bot (a private chat) or add the bot to a group and send `/start` there, then open `https://api.telegram.org/bot<token>/getUpdates` and copy `"chat":{"id":…}` (negative for a group) |
| `LEADS_SHEET_URL` | The sheet's web app address, ending in `/exec` (below) |
| `LEADS_SHEET_KEY` | The key printed by `setup()` (below) |

The sheet's web app: open the sheet → Extensions → Apps Script, replace the code with `scripts/leads-sheet.gs`,
save, run `setup` (allow access when asked) and copy the key from the log, then Deploy → New deployment → type Web
app, Execute as: Me, Who has access: Anyone → Deploy, and copy the Web app URL. After editing the script, publish
it with Deploy → Manage deployments → edit → Version: New version (the URL stays the same).

Either pair of secrets is enough for the form to work. Failed deliveries are logged: Workers → disel-site →
Observability.

## Static file details

- `wrangler.jsonc`: `assets.directory` is `./out`; `not_found_handling: "404-page"` makes Cloudflare serve the
  nearest `404.html` (root, `ru/404.html`, `en/404.html`) with status 404. `run_worker_first: ["/api/*"]` sends
  only those paths to the Worker script.
- `trailingSlash: true` in `next.config.ts`: every page is a folder with `index.html` (`/poslugy/`).
- Robots allow indexing everywhere, including previews; every page's canonical URL points to
  dieselmedic.com.ua, so search engines treat previews as duplicates of production.
