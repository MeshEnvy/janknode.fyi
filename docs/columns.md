# Columns

How we fill the table. Listing claims are a start. Measured beats claimed.

## Hard gate

| Column | Meaning |
|---|---|
| Works? | Pass only for **1S Li-ion (~3.7 V)** on the leads the radio would tap. 1.2 V NiMH (and 2S/3S NiMH) = Won't work. No boost assumed unless measured. |

Do not score keep-up, cavity, or mount on a fail. Fail rows stay on the page so people stop buying them.

## Shopping list

| Column | How to fill |
|---|---|
| Brand | Listing brand. Confirm OCR. |
| Form | path / stake, fence wedge, fence cap, PIR wall, flood. |
| Cost | **$/unit from the pack**, plus pack size. |
| Capacity | Chemistry + nominal V first. Then stock mAh (label) and measured mAh if you have a drain test. |
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

## Field extras (only when we have data)

Keep-up (dawn-to-dawn) is the winner metric. Also: nights of reserve, cell form (cradle vs glued pouch), stock charger IC, panel orientation after mount, clamp / backplate, listing honesty (measured size vs photos).

Voltage rise in sun is not mAh recovery. A fat cell that cannot charge is a brick.

## Provenance

Every cell is `listing`, `measured`, or `unknown`. A screenshot is listing. Do not promote it to measured.
