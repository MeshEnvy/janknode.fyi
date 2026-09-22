---
name: extract-profile
description: >-
  Isolate a product from a PDP/snapshot onto white for profile.jpg (512×512).
  Prefer pixel crop; AI cutout only for messy backgrounds. Do not re-render
  products. Also standardizes VNA sweep shots.
---

# Extract catalog profile

`profile.jpg` is a 512×512 tile: **real pixels from a source photo on white**. Not a new render.

Stamp: `profile.ai` + `profile.meta.yaml`.

## Method pick (strict order)

1. **`profile_method: crop`** (or `profile_crop` set) → `node scripts/crop-profile.mjs <folder>`. **No GenerateImage.**
2. **Clean product-on-white hero** → crop if you can determine bounds; else AI **background removal only** (see **Cutout prompt**).
3. **Messy snapshot** (store chrome, hands) → AI cutout to drop chrome; still **do not redraw the product**.

If the hero **does not show a connector** (smooth plastic base), output the hero as-is. **Never invent a metal connector** — models default to female bulkhead (external threads), which is wrong for SMA-male whips like muzi.

## Source pick

1. `profile_source` in `listing.md`
2. Else `product-detail-snapshot.jpg`
3. Else newest `shots/*pdp*`

## Queue

```bash
npm run profile-queue
```

Prints `method`, `source`, `crop`, `connector`, `profile_extract`.

## Loop

1. Next `pending` row (or folder the user named).
2. Read `listing.md` (+ `profile.meta.yaml` fallback). Open the source image.
3. **If `profile_method: crop` or `profile_crop` set:** run `crop-profile.mjs`. Skip GenerateImage.
4. **Else:** GenerateImage with **cutout prompt only**. Pass source as `reference_image_paths`. `aspect_ratio: "1:1"`.
5. `node scripts/install-profile.mjs <file> <folder>` (crop script calls this automatically).
6. **Verify against source pixels:**
   - Same angle, colors, labels, piece count.
   - RF: if connector visible in source, gender must match. If **not** visible, base must stay smooth — no added metal jack.
   - No store UI, hands, watermarks.
7. Fail → for cutout, tighten prompt ("copy pixels, do not redraw"). For crop, fix `profile_crop`. Delete `profile.ai` if still bad.

## Listing hints

| Field | When |
|---|---|
| `profile_method` | `crop` (pixel extract) or `cutout` (AI bg removal) |
| `profile_source` | File to cut from |
| `profile_crop` | `left,top,width,height` in source pixels (crop method) |
| `connector` | RF gender — metadata only; do not paint from imagination |
| `profile_extract` | Which unit from pack, set pieces, **do not invent connector** |

## What to show

| Category | Isolate |
|---|---|
| Lights | One shell from multi-pack hero |
| Tools | Every piece in the set |
| Consumables | Full set if SKU is a set |
| Antennas | One antenna. **No invented connector.** |
| Kits | Kit as photographed |

## Cutout prompt (AI — last resort)

```
Product cutout from the reference image only. Background removal — NOT a new product render.

Preserve the product exactly as photographed: same angle, shape, colors, labels, and proportions. Copy pixels; do not redraw.

[profile_extract]

Replace background with pure white. Remove store UI / hands only.

Do NOT invent connectors, threads, or metal parts not visible in the source.
```

**Forbidden:** "photorealistic catalog photo", "studio shot", "generate a product photo", naming connector geometry the source does not show.

## VNA sweeps

Restyle `shots/*vna*` to simulated NanoVNA-H S11 SWR. Only case we redraw content.

## Do not

- Use GenerateImage when `profile_method: crop`
- Invent SMA connectors when the hero shows a smooth plastic base
- Re-render products when a clean PDP exists
- Commit unless asked
