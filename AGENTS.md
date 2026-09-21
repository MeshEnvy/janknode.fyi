# AGENTS.md — Janknode Review Guide

Janknode review guide: **shells**, **boards**, **antennas**, **consumables**, **tools**. Single static page: `index.html`.

Read `MEMORY.md` then `docs/columns.md` before adding or scoring a shell. Amazon parts: `gear/<ASIN>/`. Rokland RAK kits: `kits/<SKU>/`. Catalog: `data/gear.yaml`.

## Power path

Panel → the light's own charger → cell. The radio solders to the **battery leads** and only draws. WisBlock 5 V solar-port limits do not apply.

Radio needs **1S Li-ion (~3.7 V)**. **1.2 V NiMH** (and 2S/3S NiMH) = **Won't work**. Do not assume a boost. Only score Li-ion rows.

## Ingest a screenshot

1. Copy `lights/_template/` to `lights/<ASIN>/`.
2. Save the PDP (or bay / cavity / back) as `shots/YYYY-MM-DD-pdp.jpg` (or `-bay`, `-cavity`, `-back`).
3. Crop `profile.jpg` from the product. No Amazon chrome, no URL bar, no "Ask Alexa".
4. Fill `listing.md` front matter. Every field has `value` + `source: listing | measured | unknown`. Do not guess chemistry.
5. Add or update the row in `data/lights.yaml`.
6. Update the inline `LIGHTS` and `KING` objects in `index.html` in the same change set.
7. Only one `king: true` row. Changing the king updates `data/lights.yaml` `king:` ASIN, the hero `KING` block, and the table crown.
8. When a shell gets a YouTube **review** or **assembly** video, set `youtube_review` and/or `youtube_assembly` (full watch URL) in `listing.md`, `data/lights.yaml`, and the matching `LIGHTS` / `KING` row. The table **Video** column and king hero buttons appear automatically.

Full-browser PDP preferred (URL bar = ASIN). Incomplete shots are normal.

## Ingest build gear

1. **Amazon:** copy `gear/_template/` → `gear/<ASIN>/`. **Rokland kits:** copy `kits/_template/` → `kits/<SKU>/`.
2. Save PDP as `shots/YYYY-MM-DD-pdp.jpg`. Crop `profile.jpg` (product on white, no store chrome).
3. Fill `listing.md`. Kits: `kind: kit`. Gear: `kind: antenna | consumable | tool`. Tools also need `group` (`solder`, `measure`, `fabrication`, `hand`).
4. Update `data/gear.yaml` and the matching array in `index.html`: `LIGHTS`, `BOARDS`, `GEAR_ANTENNAS`, `GEAR_CONSUMABLES`, `GEAR_TOOLS`.
   - One `king: true` row per category (shells, boards, antennas). King sorts first; green row + 👑 in table.
   - Rokland boards: `sku`, `vendor`, `buy_url` (no `asin` / `amazon`). Antennas: `vswr_min` + `vswr_min_mhz` when a bench sweep exists; plots under `gear/<ASIN>/shots/`.
5. Bench solder iron is **ANBES 90W kit (B0CGHD7GW5)** — corded, no separate PSU row. Pair with MAIYUM spool (B075WB98FJ) in notes if needed.

## Privacy

No fleet unit IDs, site names, or coordinates. Hardware class only.

## Voice

**Janknode** is the build. The Amazon product is the **shell**. Site title: **Janknode Review Guide**. Say "shell" in the table.
