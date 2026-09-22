# Columns

How we fill the table. Listing claims are a start. Measured beats claimed.

## Hard gate

| Column | Meaning |
|---|---|
| Works? | **pass** = 1S Li-ion (~3.7 V) with enough capacity for repeater duty. **fail** = wrong chemistry (1.2 V NiMH, etc.) or hard blocker (sealed shell). **maybe** = chemistry OK but suspect (tiny mAh, unverified keep-up). **likely** / **unknown** = not bench-settled. No boost assumed unless measured. |

Do not score keep-up, cavity, or mount on a fail. Fail rows stay on the page so people stop buying them.

## Shopping list

| Column | How to fill |
|---|---|
| Brand | Listing brand. Confirm OCR. |
| Form | path / stake, fence wedge, fence cap, PIR wall, flood. |
| Cost | **$/unit from the pack**, plus pack size. |
| Cell | Stock cell form when known (14500, 18650, AAA, …). |
| Capacity | Chemistry + nominal V + mAh (label or measured). |
| Panel voltage | Voc / Vmp of the **integrated panel**. Describes harvest into that light's charger, not a RAK solar jack. |
| IP rating | Stock claim. After-mod seal is a separate note (SMA drill kills factory IP). |
| Room | Cavity fit: 18650 / 21700 / RAK19003 / RAK19007 / BMS. External listing size is a hypothesis only. |
| Modifications | Teardown: panel / cavity / lens as separate parts vs glued. |
| Ease of access | Field reopen + USB after convert. |
| Panel quality | Measured area + encapsulant when you have them. Photos lie. |
| Ease of mounting | T-post + hose clamp. Thin plastic crushes. Keyholes or a flat back that takes a mending plate win. |
| Ease of antenna | Whip vs panel. Panel on the top face means elbow or rotate a side face up. |
| Amazon | ASIN link. In-stock + last checked. Dead SKUs stay; strike the buy link. |
| Video | Optional **Review** + **Build** YouTube links per shell (`youtube_review`, `youtube_assembly` in `listing.md` / `data/data.yaml`). Empty until we publish. No fleet IDs or site names in titles. |

## Batteries

| Column | How to fill |
|---|---|
| Cell | Model name + brand (e.g. Samsung 25R). |
| Form | 18650, 14500, … Must match shell bay. |
| Chemistry | Same gate as shells: **1S Li-ion (~3.7 V)** only. |
| V | Nominal V (datasheet). Listing may say 3.7 V; spec is often 3.6 V. |
| mAh | Label or measured. |
| Top | **flat** or **button**. Flat top is the usual 18650 shell fit. |
| Protected | **No** for bare cells in path-light chargers. Shell TP4056-style board is the protection. |
| Days | `mAh ÷ radio_daily_mah` from `data/data.yaml` (default 220 mAh/day RAK4631 slim, powersaving on). |
| Buy | Vendor link + $/cell. Not always Amazon. |

## Field extras (only when we have data)

Keep-up (dawn-to-dawn) is the winner metric. Also: nights of reserve, cell form (cradle vs glued pouch), stock charger IC, panel orientation after mount, clamp / backplate, listing honesty (measured size vs photos).

Voltage rise in sun is not mAh recovery. A fat cell that cannot charge is a brick.

## Provenance

Every field uses `source` in `listing.md`: `listing`, `measured`, `review`, `qa`, `agent`, or `unknown`. A screenshot is listing. Amazon customer text is `review` or `qa`. Do not promote listing or review claims to `measured` without bench work.

Batch harvest workflow: `.cursor/skills/harvest-shell-listing/SKILL.md`.
