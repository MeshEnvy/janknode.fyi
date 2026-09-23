---
name: harvest-shell-listing
description: >-
  Harvest stock battery specs from Amazon shell PDPs (About this item, product
  details, Q&A, reviews) into lights/<ASIN>/listing.md and data/data.yaml.
  Use when filling cell/chemistry/V/mAh gaps, batch-updating shells, or the
  user asks to scrape or harvest Amazon listing info.
---

# Harvest shell listing (Amazon)

Fill **Cell**, **Chemistry**, **V**, **mAh**, and **Works?** from public Amazon text. Read [docs/columns.md](../../../docs/columns.md) first.

**Listing only** until bench teardown. Reviews and Q&A are hints — never `measured`.

## When to run

- Shell row has `unknown` or blank `cell`, `chemistry`, `nominal_v`, `mah_label`, or `works`
- User names an ASIN or says "harvest listings" / "fill battery columns"
- After adding a new shell row to `data/data.yaml`

## Pick targets

```bash
# Shells missing any battery field (manual scan of data/data.yaml shells:)
# Prefer: works unknown + no chemistry, then partial rows
```

Skip shells already **fail** or **pass** from bench (`source: measured` in `listing.md`).

## Per-ASIN loop

For each target ASIN:

1. Read `lights/<ASIN>/listing.md` and the matching `data/data.yaml` `shells:` row.
2. Fetch `https://www.amazon.com/dp/<ASIN>` with **WebFetch** (or browser if fetch is thin).
3. Harvest in **source priority** (stop at first hit per field, but collect all mentions for notes):

   | Priority | Where on PDP | Typical fields |
   |---|---|---|
   | 1 | **About this item** bullets | mAh, "14500", "18650", "rechargeable battery" |
   | 2 | **Product information** / **Technical details** table | Battery Cell Composition, Voltage, Capacity, Number of Batteries |
   | 3 | **Product description** (long prose below fold) | same keywords |
   | 4 | **Customer questions & answers** | cell size, replacement battery, "what battery" |
   | 5 | **Customer reviews** (search review body text) | "18650", "AAA", "NiMH", "dead battery", teardown hints |

4. Parse with [patterns.md](patterns.md). Record **exact quote** (≤15 words) in `notes` when a field comes from review or Q&A.
5. Map to front matter (`value` + `source`):

   | Field | YAML keys | Allowed `source` |
   |---|---|---|
   | Cell form | `cell` | `listing`, `review`, `qa` |
   | Chemistry | `chemistry` | `listing`, `review`, `qa` — use `1S-li-ion`, `1.2V-nimh`, or leave unknown |
   | Nominal V | `nominal_v` | `listing`, `review`, `qa` |
   | Capacity | `mah_label` | `listing`, `review`, `qa` |
   | Works gate | `works` | `listing`, `review`, `qa`, `agent` (see scoring) |

6. **Do not guess.** If PDP only says "500mAh battery" with no chemistry, set `mah_label` only; leave `cell` / `chemistry` unknown unless Q&A or reviews name them.
7. Set `last_verified` to today in `listing.md`.
8. Mirror the same fields into `data/data.yaml` `shells:` row (flat keys: `cell`, `chemistry`, `nominal_v`, `mah_label`, `works`).
9. Append a dated line to `notes` citing what was found and where (bullet, table row, review snippet).
10. `npm run build` after each batch (or every 5 ASINs).

## Chemistry normalization

| Amazon text | `chemistry` |
|---|---|
| Lithium Ion / Li-ion / rechargeable lithium | `1S-li-ion` |
| NiMH / Ni-MH / 1.2V / AA or AAA rechargeable (no Li-ion) | `1.2V-nimh` |
| Alkaline / non-rechargeable | note in `notes`; usually **fail** for janknode |

| Amazon text | `nominal_v` |
|---|---|
| 3.7 V / 3.6 V / lithium | 3.7 (prefer listing number) |
| 1.2 V / NiMH | 1.2 |

| Amazon text | `cell` |
|---|---|
| 14500 / AA-size lithium | `14500` |
| 18650 | `18650` |
| 21700 | `21700` |
| AAA / AA (with NiMH context) | `AAA` / `AA` |

Strip "mAh" to integer for `mah_label`.

## Works? scoring (after fields filled)

Apply only from **listing-derived** facts (not bench):

| `works` | Condition |
|---|---|
| **fail** | `1.2V-nimh`, AAA/AA NiMH, alkaline, or listing says non-rechargeable. Set **`fail_reason`**: `nimh`, `alkaline`, `sealed` (reviews/listing), `underpowered` (Li-ion but tiny mAh), `no-space` (cavity will not take the radio; operator or bench), or `too-big` (shell is too large to pack; operator or bench). |
| **maybe** | `1S-li-ion` but `mah_label` ≤ 600 **or** cell form unknown with only mAh claim |
| **likely** | `1S-li-ion`, mAh ≥ 800, cell 18650/14500 stated on PDP |
| **unknown** | No chemistry signal, or conflicting review vs listing |

Never set **pass** from Amazon text alone. **pass** requires bench teardown.

## Review / Q&A search

In fetched markdown, search (case-insensitive):

- Cell: `18650`, `21700`, `14500`, `\bAAA\b`, `\bAA\b`, `button top`, `flat top`
- Chemistry: `lithium`, `li-ion`, `nimh`, `ni-mh`, `1.2v`, `3.7v`, `alkaline`
- Capacity: `(\d{3,4})\s*mah`
- Red flags: `sealed`, `glued shut`, `cannot open`, `no screws`

If **review** or **qa** is the only source for a field, set that `source` and quote the snippet in `notes`.

## Conflicts

- Listing beats review unless 3+ reviews agree on a concrete spec listing omits (e.g. multiple "takes AAA" vs silent listing → use `qa`/`review` with note).
- Conflicting chemistry → `works: unknown`, explain in `notes`.

## Batch mode

User says "harvest all shells":

1. List ASINs from `data/data.yaml` `shells:` where `works: unknown` or missing battery columns.
2. Process in catalog order; one WebFetch per ASIN.
3. Summarize table: ASIN | cell | chemistry | mAh | works | source |
4. Do not commit unless asked.

## Do not

- Set `source: measured` without bench work
- Infer Li-ion from "solar" or "500mAh" alone
- Scrape non-Amazon URLs in this skill (use vendor ingest for batteries)
- Commit unless asked

## See also

- [patterns.md](patterns.md) — regex and table row labels
- [extract-profile](../extract-profile/SKILL.md) — product photos only
