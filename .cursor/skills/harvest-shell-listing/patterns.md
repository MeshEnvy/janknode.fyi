# Harvest patterns — Amazon PDP text

Use on WebFetch markdown output. Case-insensitive unless noted.

## Product details table rows

Common Amazon labels → field:

| Row label (substring) | Field |
|---|---|
| Battery Cell Composition | chemistry |
| Batteries Required | cell / chemistry |
| Battery Capacity | mah_label |
| Voltage | nominal_v |
| Number of Batteries | count only (notes) |

## About this item / description bullets

```text
(\d{3,4})\s*mAh                           → mah_label
(\d{3,4})\s*mAh\s*battery                 → mah_label
includes?\s+a?\s*(\d{3,4})\s*mAh          → mah_label
\b18650\b                                 → cell
\b21700\b                                 → cell
\b14500\b                                 → cell
\bAAA\b                                   → cell (check NiMH vs Li-ion context)
\bAA\b                                    → cell
lithium[- ]?ion|li[- ]?ion               → chemistry 1S-li-ion
\bNiMH\b|\bNi-MH\b|nickel[- ]metal       → chemistry 1.2V-nimh
\b1\.2\s*V\b                               → nominal_v 1.2 + likely NiMH
\b3\.7\s*V\b|\b3\.6\s*V\b                 → nominal_v 3.7 + likely Li-ion
rechargeable                              → hint only (not chemistry alone)
non-rechargeable|disposable               → fail hint in notes
```

## Q&A and reviews

Search fetched **Customer questions** and **Customer reviews** sections:

```text
what (battery|cell)|which battery|replace (the )?battery
takes? (a |an )?(18650|14500|AAA|AA)
(18650|14500|AAA|AA) (battery|cell)
(\d{3,4}) mah
nimh|ni-mh|lithium
glued|sealed|cannot (open|replace)
```

Prefer Q&A accepted answers over single review. Weight reviews that mention opening the unit or measuring voltage.

## mAh sanity

| mAh | Typical cell |
|---:|---|
| 300–600 | 14500 or small pouch |
| 600–1200 | small 18650 or inflated claim |
| 1200–2600 | 18650 |
| 4000+ | 21700 or bogus listing |

Tiny mAh on Li-ion → `works: maybe` per main skill.
