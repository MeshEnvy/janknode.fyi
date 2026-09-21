# Janknode Review Guide (meshlight.dev repo)

Living catalog state. Keep this short. Shell detail lives in `lights/<ASIN>/listing.md`.

**Last updated:** 2026-09-21

## What this is

Static review guide for janknode builds: solar light **shells** plus **build gear** (consumables and bench tools). `index.html` is the site. Screenshots and agent notes live in this repo so others can PR. Optional per shell: `youtube_review` + `youtube_assembly` URLs (table **Video** column; king hero buttons when set).

## King

**B0DT95J4QC** — HMCITY 120 LED wall wedge, 6-pack $19.98 ($3.33/shell). Current field pick. Real PDP + profile on file.

## Catalog (16 shells)

Sorted by $/shell in `index.html`. Spotlight stake units are filed for comparison but are unlikely repeater shells.

| ASIN | Brand | Class | $/shell | Works? |
|---|---|---|---|---|
| B08H81Z1RW | SOLPEX | fence wedge | $2.50 | unknown |
| B0GH63TL8H | AUDERWIN | fence step | $2.75 | unknown |
| B0D0RNV327 | TECKNET | fence cap | $2.75 | unknown |
| B0DT95J4QC | HMCITY | wall wedge | $3.33 | likely |
| B0G2BKN15W | NIORSUN | fence wedge | $3.83 | unknown |
| B0C7B2Z39G | CLAONER | PIR wall | $4.17 | unknown |
| B07WPHTWBP | ROSHWEY | fence wedge | $4.67 | unknown |
| B0H3LWZHHW | Toeuitie | fence wedge | $5.00 | unknown |
| B0C813SJXP | FLITI | fence wedge | $5.00 | unknown |
| B0FGCM9TBN | JOFIOS | fence step | $5.00 | unknown |
| B0DMNH8QDN | WENATY | spotlight | $5.42 | unknown |
| B0FHQH9LPQ | NACINIC | spotlight | $6.25 | unknown |
| B085242PLC | LECLESTAR | flood | $15.99 | unknown |
| B0D78HJYJ1 | VOLISUN | spotlight | — | unknown (OOS) |
| B0D78KYJDC | VOLISUN | spotlight | — | unknown (OOS) |
| B0D99X4M48 | NACINIC | spotlight | — | unknown (OOS) |

## Build gear (16 listings)

`index.html` § Build gear. YAML: `data/gear.yaml`. Detail: `gear/<ASIN>/listing.md`.

**Consumables (6):** muzi whip, E6000+, JST 1.25, JST PH 2.0, flux pens, MAIYUM solder (B075WB98FJ).

**Tools (10):** Pinecil + Ubearkk 60W PD 2-pack (B07G61YB6S), Kaisi mat, AstroAI DMM, NanoVNA-H (optional), AVID 20V drill, COMOWARE step bits, SEESII spot welder (optional), KAIWEETS stripper, WORKPRO pliers.

Keep `GEAR_*` arrays in `index.html` in sync with `data/gear.yaml`.

## Active threads

- Listing-only until bay photos. Chemistry gate still open on all non-king rows.
- SOLPEX cheapest $/shell on paper; king stays field-proven HMCITY.
- `index.html` embeds `LIGHTS` by hand. Keep in sync with `data/lights.yaml`.
- Gear gaps: heat-shrink, IPEX→SMA pigtails, bench supply PDPs.
