# AGENTS.md — Janknode Review Guide

Janknode review guide: solar light **shells** and **build gear**. Single static page: `index.html`.

Read `MEMORY.md` then `docs/columns.md` before adding or scoring a shell. Gear lives in `gear/<ASIN>/` and `data/gear.yaml`.

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

1. Copy `gear/_template/` to `gear/<ASIN>/`.
2. Save PDP as `shots/YYYY-MM-DD-pdp.jpg`. Crop `profile.jpg`.
3. Fill `listing.md`. Set `kind: consumable | tool` and `group` for tools (`solder`, `measure`, `fabrication`, `hand`).
4. Update `data/gear.yaml` and the matching `GEAR_CONSUMABLES` or `GEAR_TOOLS` array in `index.html`.
5. **Pinecil (B096X6SG13)** must stay paired with a USB-C PD 60W+ listing (`pairs_with`, currently B07G61YB6S). No PSU ships in the Pinecil box.

## Privacy

No fleet unit IDs, site names, or coordinates. Hardware class only.

## Voice

**Janknode** is the build. The Amazon product is the **shell**. Site title: **Janknode Review Guide**. Say "shell" in the table.
