---
asin: B0EXAMPLE
brand:
  value:
  source: listing
title:
  value:
  source: listing
kind:
  value: consumable # consumable | tool | antenna
  source: agent
connector:
  value: # antennas only — SMA male | SMA female | RP-SMA male | RP-SMA female
  source: listing
profile_source:
  value: # optional — reference image, e.g. shots/YYYY-MM-DD-pdp.jpg
  source: agent
profile_extract:
  value: # optional — pasted into the GenerateImage prompt (one from pack, set contents, connector rules)
  source: agent
group:
  value: # solder | measure | hand | null
  source: agent
pack_qty:
  value:
  source: listing
pack_price_usd:
  value:
  source: listing
unit_price_usd:
  value:
  source: listing
unit_label:
  value:
  source: agent
amazon: https://www.amazon.com/dp/B0EXAMPLE
pairs_with:
  value:
  source: agent
optional:
  value: false
  source: agent
last_verified: YYYY-MM-DD
notes: |
  One line for the table Notes column.
---

# B0EXAMPLE

Paste PDP into `shots/`. Save the product-detail capture as `product-detail-snapshot.jpg`. Extract a clean 512×512 `profile.jpg` with the extract-profile skill.
