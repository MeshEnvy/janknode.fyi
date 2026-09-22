---
asin: B0EXAMPLE
brand:
  value:
  source: unknown # listing | measured | review | qa | agent | unknown
title:
  value:
  source: listing
form:
  value: # path | fence-wedge | fence-cap | pir-wall | flood
  source: listing
pack_qty:
  value:
  source: listing
pack_price_usd:
  value:
  source: listing
unit_price_usd:
  value:
  source: listing
ip:
  value:
  source: listing
color:
  value:
  source: listing
size_in:
  value:
  source: unknown
weight:
  value:
  source: unknown
cell:
  value: # 14500 | 18650 | AAA | unknown
  source: unknown
chemistry:
  value: # 1S-li-ion | 1.2V-nimh | unknown
  source: unknown
nominal_v:
  value:
  source: unknown
mah_label:
  value:
  source: unknown
works:
  value: unknown # pass | fail | maybe | likely | unknown
  source: unknown
fail_reason:
  value: # when works is fail: sealed | nimh | underpowered | alkaline
  source: unknown
amazon: https://www.amazon.com/dp/B0EXAMPLE
youtube_review:
  value: # full https://youtube.com/watch?v=… or youtu.be/… URL; null until published
  source: unknown # meshenvy | community | unknown
youtube_assembly:
  value: # build walkthrough for this shell as a janknode; null until published
  source: unknown
in_stock:
  value:
  source: listing
last_verified: YYYY-MM-DD
notes: |
  Listing only until a battery-bay shot.
---

# B0EXAMPLE

Paste PDP into `shots/`. Save the product-detail capture as `product-detail-snapshot.jpg`. Extract a clean 512×512 `profile.jpg` with the extract-profile skill.
