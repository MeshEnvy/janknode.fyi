# Janknode Review Guide

Single-page guide at [janknode.fyi](https://janknode.fyi): solar light **shells** and **build gear** (consumables + bench tools).

Open `index.html` locally. Add a shell with a screenshot per `AGENTS.md`.

## Deploy

Static site, no build step. Cloudflare Pages project `janknode`, custom domain `janknode.fyi`.

GitHub Actions (`.github/workflows/deploy.yml`) runs on push to `main` when these repo secrets exist:

- `CLOUDFLARE_API_TOKEN` — Pages Edit (+ Account read)
- `CLOUDFLARE_ACCOUNT_ID`

Manual deploy from repo root:

```bash
npx wrangler pages deploy . --project-name=janknode --branch=main
```

Add the custom domain once in the Cloudflare dashboard (Pages → janknode → Custom domains → `janknode.fyi`) or:

```bash
npx wrangler pages domain add janknode.fyi --project-name=janknode
```

Domain must use Cloudflare nameservers (or a CNAME to the Pages hostname).
