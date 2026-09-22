# Janknode Review Guide (janknode.fyi)

GitHub: `MeshEnvy/janknode.fyi`. Local: `/Volumes/Code/repos/meshenvy/janknode.fyi/`.

Living catalog state. Keep this short. Shell detail lives in `lights/<ASIN>/listing.md`.

**Last updated:** 2026-09-21

## What this is

Static review guide for janknode builds: **shells**, **boards**, **antennas**, **consumables**, and **tools**. Five table sections; king row per category where we have a field pick. **Build:** `data/data.yaml` + `index.template.html` → `scripts/render.mjs` → `npm run build` → `index.html` (committed, full SEO HTML, no client JS). Screenshots and agent notes live in this repo so others can PR.

## King

**Shell: vacant.** HMCITY **B0DT95J4QC** failed bench teardown 2026-09-21 (molded shut, no enclosure access; listing screw photos wrong). Next king needs a field-proven openable shell.

## Catalog (16 shells)

Sorted by $/shell in `index.html`. Spotlight stake units are filed for comparison but are unlikely repeater shells.

| ASIN | Brand | Class | $/shell | Works? |
|---|---|---|---|---|
| B08H81Z1RW | SOLPEX | fence wedge | $2.50 | unknown |
| B0GH63TL8H | AUDERWIN | fence step | $2.75 | unknown |
| B0DRNRZV32 | TECKNET | fence cap | $2.75 | unknown |
| B0DT95J4QC | HMCITY | wall wedge | $3.33 | **fail** (molded shut) |
| B0G2BKN15W | NIORSUN | fence wedge | $3.83 | unknown |
| B0C7B2Z39G | CLAONER | PIR wall | $4.17 | unknown |
| B07WPHTWBP | ROSHWEY | fence wedge | $4.67 | unknown |
| B0H3LWZHHW | Toeuitie | fence wedge | $5.00 | unknown |
| B0C813SJXP | FLITI | fence wedge | $5.00 | unknown |
| B0FGCM9TBN | JOFIOS | fence step | $5.00 | unknown |
| B0DMNH8QDN | WENATY | spotlight | $5.42 | unknown |
| B0FHQH9LPQ | NACINIC | spotlight | $6.25 | unknown |
| B085242PLC | LECLESTAR | flood | $15.99 | unknown |
| B0D78HJYJ1 | VOLISUN | spotlight | — | pass (OOS) |
| B0D78KYJDC | VOLISUN | spotlight | — | pass (OOS) |
| B0D99X4M48 | NACINIC | spotlight | — | pass (OOS) |

## Boards (2 listings)

`index.html` § Boards. YAML: `data/data.yaml` `boards`. Detail: `kits/<SKU>/listing.md`.

**King board:** Mini RAK19003 + RAK4631 (115093, $31.97). Alt: WisBlock RAK19007 + RAK4631 (116016, $34.97).

## Antennas (4 listings)

**King antenna:** XWXGG 20 cm whip + pigtail (B0FQK27BSP, 6 dBi listed, VSWR 1.00 @ 915 MHz, $6.50). Alts: XWXGG 19.5 cm 5 dBi duck (B0DY7KSYTV), Tenmory 3 dBi short duck (B0CTXL61LY), muzi 17 cm whip (B0FSTD4BYM, no listing gain).

**Hero BOM:** board + antenna + required consumables only until a shell king returns (was ≈ $42.52 with HMCITY shell). Optional pigtail, JST 1.25, flux excluded (RAK/antenna include pigtail). Catalog `$/unit` is pack price ÷ qty. Buy buttons show pack price. BOM `/node` is estimated usage.

## Consumables + tools (15 listings)

YAML: `data/data.yaml` `consumables` + `tools`. Detail: `gear/<ASIN>/listing.md`.

**Consumables (6):** HiLetgo IPEX→SMA pigtails (B01HXU1PKS), E6000+, JST 1.25, JST PH 2.0, flux pens, MAIYUM solder (B075WB98FJ).

**Tools (9):** ANBES 90W solder kit (B0CGHD7GW5), Kaisi mat, AstroAI DMM, NanoVNA-H (optional), AVID 20V drill, COMOWARE step bits, SEESII spot welder (optional), KAIWEETS stripper, WORKPRO pliers.

## Active threads

- Listing-only until bay photos. Chemistry gate still open on unknown shells.
- SOLPEX cheapest $/shell on paper; no field king until teardown proves access.
- HMCITY B0DT95J4QC: fail — sealed monolith, do not buy.
- Gear gaps: heat-shrink, bench supply PDPs.
- Profile tiles: AI extract (`extract-profile` skill + GenerateImage). `profile_extract` / `connector` in `listing.md` steer isolation. No manual crops. `profile.meta.yaml` stores the hints used. PDPs filed for MAIYUM solder (B075WB98FJ) and FainWan JST PH 2.0 (B09JZC28DP).
