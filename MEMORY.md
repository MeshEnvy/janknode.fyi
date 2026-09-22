# Janknode Review Guide (janknode.fyi)

GitHub: `MeshEnvy/janknode.fyi`. Local: `/Volumes/Code/repos/meshenvy/janknode.fyi/`.

Living catalog state. Keep this short. Shell detail lives in `lights/<ASIN>/listing.md`.

**Last updated:** 2026-09-22

## What this is

Static review guide for janknode builds: **shells**, **boards**, **antennas**, **batteries**, **consumables**, and **tools**. Six table sections; king row per category where we have a field pick. **Build:** `data/data.yaml` + `index.template.html` → `scripts/render.mjs` → `npm run build` → `index.html` (committed, full SEO HTML, no client JS). Screenshots and agent notes live in this repo so others can PR.

## King

**Shell: vacant.** HMCITY **B0DT95J4QC** failed bench teardown 2026-09-21 (molded shut, no enclosure access; listing screw photos wrong). Next king needs a field-proven openable shell.

## Catalog (16 shells)

Sorted by $/shell within each block in `index.html`. Three tiers: **Passing** (`pass`, `likely`), **Under evaluation** (`maybe`, `unknown`), collapsed **failed** (`fail` + `fail_reason`). Spotlight stake units are filed for comparison but are unlikely repeater shells.

| ASIN | Brand | Class | $/shell | Works? |
|---|---|---|---|---|
| B08H81Z1RW | SOLPEX | fence wedge | $2.50 | **NiMH** (AAA, bench) |
| B0GH63TL8H | AUDERWIN | fence step | $2.75 | maybe (14500, 500 mAh) |
| B0DRNRZV32 | TECKNET | fence cap | $2.75 | maybe (600 mAh listing) |
| B0DT95J4QC | HMCITY | wall wedge | $3.33 | **sealed** (molded shut) |
| B0G2BKN15W | NIORSUN | fence wedge | $3.83 | maybe (500 mAh listing) |
| B0C7B2Z39G | CLAONER | PIR wall | $4.17 | **likely** (18650, 1200 mAh) |
| B0GDWFY3MJ | NIORSUN | fence step | $4.50 | maybe (1200 mAh, 3.7 V) |
| B07WPHTWBP | ROSHWEY | fence wedge | $4.67 | **NiMH** (1.2 V listing) |
| B0H3LWZHHW | Toeuitie | fence wedge | $5.00 | unknown (PDP silent) |
| B0C813SJXP | FLITI | fence wedge | $5.00 | maybe (1200 mAh listing) |
| B0FGCM9TBN | JOFIOS | fence step | $5.00 | maybe (Li-ion, 1200 mAh) |
| B0DMNH8QDN | WENATY | spotlight | $5.42 | maybe (LiPo, 1500 mAh) |
| B0C5J9Z4ZY | Tadyreal | spotlight | $5.70 | maybe (3.7 V, mAh unknown) |
| B0FHQH9LPQ | NACINIC | spotlight | $6.25 | **sealed** (bench) |
| B09XM9GZ5F | Bridika | fence wedge | $6.67 | maybe (replaceable 18650) |
| B085242PLC | LECLESTAR | flood | $15.99 | maybe (4400 mAh listing) |
| B0D78HJYJ1 | VOLISUN | spotlight | — | pass (OOS) |
| B0D78KYJDC | VOLISUN | spotlight | — | pass (OOS) |
| B0D99X4M48 | NACINIC | spotlight | — | pass (OOS) |

## Boards (2 listings)

`index.html` § Boards. YAML: `data/data.yaml` `boards`. Detail: `kits/<SKU>/listing.md`.

**King board:** Mini RAK19003 + RAK4631 (115093, $31.97). Alt: WisBlock RAK19007 + RAK4631 (116016, $34.97).

## Antennas (4 listings)

**King antenna:** XWXGG 20 cm whip + pigtail (B0FQK27BSP, 6 dBi listed, VSWR 1.00 @ 915 MHz, $6.50). Alts: XWXGG 19.5 cm 5 dBi duck (B0DY7KSYTV), Tenmory 3 dBi short duck (B0CTXL61LY), muzi 17 cm whip (B0FSTD4BYM, no listing gain).

## Batteries (2 listings)

YAML: `data/data.yaml` `batteries`. Detail: `batteries/<slug>/listing.md`.

**King 18650:** Samsung INR18650-25R (25R), 2500 mAh → **11 days** at 220 mAh/day RAK4631 draw.

**King 21700:** Samsung INR21700-58E (58E), 5330 mAh → **24 days** at 220 mAh/day. 21700 bay only; verify cavity fit.

**Runtime basis:** `radio_daily_mah: 220` in `data/data.yaml` (RAK4631 slim, powersaving on, planning estimate until bench logged).

**Hero BOM:** board + antenna + required consumables only until a shell king returns (was ≈ $42.52 with HMCITY shell). Optional pigtail, JST 1.25, flux excluded (RAK/antenna include pigtail). Catalog `$/unit` is pack price ÷ qty. Buy buttons show pack price. BOM `/node` is estimated usage.

## Consumables + tools (15 listings)

YAML: `data/data.yaml` `consumables` + `tools`. Detail: `gear/<ASIN>/listing.md`.

**Consumables (6):** HiLetgo IPEX→SMA pigtails (B01HXU1PKS), E6000+, JST 1.25, JST PH 2.0, flux pens, MAIYUM solder (B075WB98FJ).

**Tools (9):** ANBES 90W solder kit (B0CGHD7GW5), Kaisi mat, AstroAI DMM, NanoVNA-H (optional), AVID 20V drill, COMOWARE step bits, SEESII spot welder (optional), KAIWEETS stripper, WORKPRO pliers.

## Active threads

- Listing-only until bay photos. Chemistry gate still open on unknown shells.
- SOLPEX B08H81Z1RW: fail — 1.2 V NiMH 700 mAh, do not buy.
- No field king until teardown proves 1S Li-ion access on a candidate shell.
- HMCITY B0DT95J4QC: fail — sealed monolith, do not buy.
- Gear gaps: heat-shrink, bench supply PDPs.
- Profile tiles: AI extract (`extract-profile` skill + GenerateImage). `profile_extract` / `connector` in `listing.md` steer isolation. No manual crops. `profile.meta.yaml` stores the hints used. PDPs filed for MAIYUM solder (B075WB98FJ) and FainWan JST PH 2.0 (B09JZC28DP).
