# AGENTS.md — Janknode Review Guide

Janknode review guide: **shells**, **boards**, **antennas**, **consumables**, **tools**. Single static page: build-time SSG from `index.template.html` + `data/data.yaml` → generated `index.html`.

Read `MEMORY.md` then `docs/columns.md` before adding or scoring a shell. Amazon parts: `gear/<ASIN>/`. Rokland RAK kits: `kits/<SKU>/`. Catalog: `data/data.yaml`. Clean product tiles: [extract-profile](.cursor/skills/extract-profile/SKILL.md).

## Power path

Panel → the light's own charger → cell. The radio solders to the **battery leads** and only draws. WisBlock 5 V solar-port limits do not apply.

Radio needs **1S Li-ion (~3.7 V)**. **1.2 V NiMH** (and 2S/3S NiMH) = **Won't work**. Do not assume a boost. Only score Li-ion rows.

## Ingest a screenshot

1. Copy `lights/_template/` to `lights/<ASIN>/`.
2. Save the PDP (or bay / cavity / back) as `shots/YYYY-MM-DD-pdp.jpg` (or `-bay`, `-cavity`, `-back`).
3. Save the Amazon/PDP capture as `product-detail-snapshot.jpg` (store chrome is fine; this is the raw snapshot).
4. Extract a clean **512×512** `profile.jpg` with the `extract-profile` skill (white background, product only, no store UI).
5. Fill `listing.md` front matter. Every field has `value` + `source: listing | measured | unknown`. Do not guess chemistry.
6. Add or update the row in `data/data.yaml` under `shells:`, then `npm run build`.
7. Only one king shell. Set top-level `king:` ASIN in `data/data.yaml` or `king: true` on one shell row.
8. When a shell gets a YouTube **review** or **assembly** video, set `youtube_review` and/or `youtube_assembly` in `data/data.yaml`. The table **Review** column updates automatically.

Full-browser PDP preferred (URL bar = ASIN). Incomplete shots are normal.

## Ingest build gear

1. **Amazon:** copy `gear/_template/` → `gear/<ASIN>/`. **Rokland kits:** copy `kits/_template/` → `kits/<SKU>/`.
2. Save PDP as `shots/YYYY-MM-DD-pdp.jpg`. Save the product-detail capture as `product-detail-snapshot.jpg`.
3. Extract a clean **512×512** `profile.jpg` with the `extract-profile` skill (white background, product only).
4. Fill `listing.md`. Kits: `kind: kit`. Gear: `kind: antenna | consumable | tool`. Tools also need `group` (`solder`, `measure`, `fabrication`, `hand`).
5. Update `data/data.yaml` (`boards`, `antennas`, `consumables`, `tools`), then `npm run build`.
   - One `king: true` row per category (shells, boards, antennas). King sorts first; green row + 👑 in table.
   - Hero consumables: `hero.consumables` in `data/data.yaml` (asin + short role label; item title from catalog).
   - Rokland boards: `sku`, `vendor`, `buy_url` (no `asin`). Build adds `profile: kits/<SKU>/profile.jpg`.
   - Amazon gear: build adds `amazon` and `profile: gear/<ASIN>/profile.jpg` unless overridden in yaml.
6. Bench solder iron is **ANBES 90W kit (B0CGHD7GW5)** — corded, no separate PSU row. Pair with MAIYUM spool (B075WB98FJ) in notes if needed.

## Build

```bash
npm install
npm run profile-queue  # pending AI extracts (no profile.ai stamp)
npm run dev            # watch + rebuild + live reload at http://localhost:5173
npm run build          # one-shot: data/data.yaml + index.template.html → index.html
```

Snapshot vs profile: `product-detail-snapshot.jpg` is the raw PDP capture. `profile.jpg` is the 512×512 product tile. Do not crop the snapshot. Use the `extract-profile` skill. Commit `profile.jpg` with catalog changes.

Edit layout/CSS in `index.template.html`. Edit row HTML in `scripts/render.mjs`. Commit `data/data.yaml`, template changes, and the generated `index.html` together. CI runs build before deploy (must match committed output).

## Privacy

No fleet unit IDs, site names, or coordinates. Hardware class only.

## Voice

**Janknode** is the build. The Amazon product is the **shell**. Site title: **Janknode Review Guide**. Say "shell" in the table.
