# Janknode Review Guide

Single-page guide at [janknode.fyi](https://janknode.fyi): solar light **shells** and **build gear** (consumables + bench tools).

```bash
npm install
npm run dev     # watch yaml/template/scripts; live reload at http://localhost:5173
npm run build   # one-shot: data/data.yaml + index.template.html → index.html
```

`npm run dev` rebuilds when `data/data.yaml`, `index.template.html`, or `scripts/` change, and reloads when images under `lights/`, `gear/`, or `kits/` change. Open `index.html` directly for a static preview without the dev server. Edit `data/data.yaml` and/or `index.template.html`, rebuild, commit yaml + template + generated `index.html`. Add a shell with a screenshot per `AGENTS.md`.

## Deploy

Static site. CI runs `npm run build` before Cloudflare Pages deploy. Project `janknode`, custom domain `janknode.fyi`.

GitHub Actions (`.github/workflows/deploy.yml`) runs on push to `main`. **Both secrets must exist** or deploy fails immediately:

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens) → Create Token → **Edit Cloudflare Workers** template (includes Pages deploy), or custom token with Account + Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → any zone → Overview → **Account ID** in the right sidebar |

Add both under GitHub repo **Settings → Secrets and variables → Actions → New repository secret**.

Re-run from **Actions → Deploy to Cloudflare Pages → Run workflow** after secrets are set.

Manual deploy from repo root:

```bash
npx wrangler pages deploy . --project-name=janknode --branch=main
```

Add the custom domain once in the Cloudflare dashboard (Pages → janknode → Custom domains → `janknode.fyi`) or:

```bash
npx wrangler pages domain add janknode.fyi --project-name=janknode
```

Domain must use Cloudflare nameservers (or a CNAME to the Pages hostname).
