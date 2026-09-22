---
name: extract-profile
description: >-
  Extract a clean 512x512 catalog profile.jpg from a product-detail-snapshot.jpg
  using image generation. Use when ingesting Amazon or PDP screenshots, replacing
  crop-script profiles, running the profile extract loop, or when the user asks
  for a clean product photo.
---

# Extract catalog profile

`product-detail-snapshot.jpg` is the raw store capture. `profile.jpg` is the 512×512 tile. Do not crop or letterbox the snapshot. Generate a clean product photo from it.

Done example: `gear/B0CGHD7GW5/` (white studio shot, no Amazon chrome). Stamp: `profile.ai`.

## Queue

```bash
npm run profile-queue
```

`pending` = snapshot (or PDP shot) and no `profile.ai`. `done` = stamp present. One named ASIN/SKU → that folder only.

## Loop

Until the queue is empty or the user stops:

1. Take the next `pending` row.
2. Read `listing.md` (brand, title) and the snapshot image. If `product-detail-snapshot.jpg` is missing, use the newest `shots/*pdp*`.
3. `GenerateImage` with that file as `reference_image_paths`, `aspect_ratio: "1:1"`, `filename: "profile.jpg"`.
4. `node scripts/install-profile.mjs <generated.jpg> <folder>` → writes 512×512 `profile.jpg` + `profile.ai`.
5. Read the written `profile.jpg`. Fail if it has store chrome, prices, ratings, invented logos/text, or the wrong product. Retry once with a tighter prompt. Still bad → leave pending, continue.
6. Next item immediately. Do not wait for a timer.

Stop after one item only when the user named a single listing.

## Prompt

Photorealistic square catalog photo of the exact product in the reference, pure white background. Product fully in frame with margin. Match real shape and colors. No store UI, no prices, no watermarks, no hands, no extra SKUs, no readable invented labels on accessories.

Name the actual object from `listing.md` (shell, antenna, iron, connector). For kits, include the real accessories visible in the snapshot. Leave LCDs blank. Blank lids if the model keeps inventing text.

## Do not

- Run or restore `normalize-profiles.mjs` / `npm run profiles`
- Overwrite a folder that already has `profile.ai` unless the user asked to redo it
- Commit unless asked
