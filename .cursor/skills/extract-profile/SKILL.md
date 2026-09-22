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
2. Read `listing.md` (brand, title, `kind`) and the snapshot image. If `product-detail-snapshot.jpg` is missing, use the newest `shots/*pdp*`. Pick the extract rule from **What to show**.
3. `GenerateImage` with that file as `reference_image_paths`, `aspect_ratio: "1:1"`, `filename: "profile.jpg"`.
4. `node scripts/install-profile.mjs <generated.jpg> <folder>` → writes 512×512 `profile.jpg` + `profile.ai`.
5. Read the written `profile.jpg`. Fail if it has store chrome, prices, ratings, invented logos/text, the wrong product, a **pack of lights**, or a **tool/supply set missing pieces**. Retry once with a tighter prompt. Still bad → leave pending, continue.
6. Next item immediately. Do not wait for a timer.

Stop after one item only when the user named a single listing.

## What to show

Read `kind` (and folder) before writing the prompt. Only include objects that are actually in the snapshot. Do not invent extras.

| Category | Folders / `kind` | Extract |
|---|---|---|
| **Lights** | `lights/` | A **single** instance of the light. Never the 6-pack / 12-pack grid. No fence, lawn, or house scene. |
| **Tools** | `gear/` `kind: tool` | The **main tool(s) plus main accessories** in the picture. If the listing is a **collection** (pliers set, drill kit, step-bit case, solder kit), show **every tool in the set**, not one hero piece. |
| **Supplies** | `gear/` `kind: consumable` | The **main supply plus related accessories** shown with it (caps, extra pens, pigtails in a fan). Same rule as tools: if the pack is a set, show the set. |
| Antennas | `gear/` `kind: antenna` | One antenna of that listing. Include the pigtail only if it is in the snapshot and part of the SKU. |
| Boards | `kits/` | The kit as sold (base + module + antenna if they are in the snapshot). |

Examples: one ROSHWEY wedge, not six. WORKPRO 6-piece → all pliers and the wrench. ANBES iron → iron, stand, solder tube, flux. HiLetgo pigtails → the fan of cables, not one connector.

## Prompt

Photorealistic square catalog photo of the exact product in the reference, pure white background. Compose per **What to show**. Everything in the composition fully in frame with margin. Match real shape and colors. No store UI, no prices, no watermarks, no hands, no readable invented labels.

Name the object from `listing.md`. Leave LCDs blank. Blank lids if the model keeps inventing text.

## Do not

- Run or restore `normalize-profiles.mjs` / `npm run profiles`
- Overwrite a folder that already has `profile.ai` unless the user asked to redo it
- Commit unless asked
