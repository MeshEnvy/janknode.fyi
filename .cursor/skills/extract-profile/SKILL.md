---
name: extract-profile
description: >-
  Isolate a product from a PDP/snapshot onto white for profile.jpg (512×512).
  Background removal and crop only — do not re-render the product. Also
  standardizes VNA sweep shots. Use for profile extract loop or regen.
---

# Extract catalog profile

`profile.jpg` is a 512×512 tile: **one product (or full set) cut out from a real photo on white**. Not a new render.

Stamp: `profile.ai` + `profile.meta.yaml`.

## Job (in order)

1. **Isolate** the product from the best source photo.
2. **Remove background** → pure white (`#FFFFFF`).
3. **Crop / compose** to square with margin. Resize on install.

Only if the source cannot work (store chrome fills frame, wrong pack count with no single-unit shot, hands blocking product): minimal edit to drop chrome or pick one unit. **Do not change viewing angle, connector geometry, labels, or colors** unless the source truly lacks that detail.

## Source pick

1. `profile_source` in `listing.md` if set (repo-relative path under the folder).
2. Else `product-detail-snapshot.jpg`.
3. Else newest `shots/*pdp*`.

Prefer a **clean product-on-white hero** over a full Amazon page capture when both exist.

## Queue

```bash
npm run profile-queue
```

`pending` = source image exists, no `profile.ai`. Prints `profile_source`, `connector`, `profile_extract` snippets.

## Loop

1. Next `pending` row (or the folder the user named).
2. Read `listing.md` (+ `profile.meta.yaml` fallback). Open the source image.
3. `GenerateImage` — **cutout prompt only** (see **Prompt**). Pass the source as `reference_image_paths`. `aspect_ratio: "1:1"`, `filename: "profile.jpg"`.
4. `node scripts/install-profile.mjs <generated.jpg> <folder>`.
5. **Verify** the output against the source photo (not against imagination):
   - Same product type, angle, proportions, colors, printed text.
   - Antennas/pigtails: connector gender matches `connector` and the source.
   - Tool sets: same pieces as `profile_extract` / listing, not substitutes.
   - No store UI, prices, hands, watermarks.
6. Fail → retry once with **stricter cutout language** ("copy pixels", "do not redraw"). Still bad → delete `profile.ai`, leave pending.

To redo: delete `profile.ai`, fix `listing.md`, re-run.

## Listing hints (`listing.md`)

| Field | When |
|---|---|
| `profile_source` | Best file to cut from (e.g. `shots/2026-09-21-pdp.jpg`) |
| `connector` | RF parts where gender must survive cutout |
| `profile_extract` | Which unit from a multi-pack, which items in a set, what not to drop |

`install-profile.mjs` copies all three into `profile.meta.yaml`.

## What to show (isolation rules)

| Category | Isolate |
|---|---|
| Lights | **One** shell from a multi-pack hero. No lawn/scene. |
| Tools | **Every** piece in the set, same layout as source when possible. NanoVNA: restyle LCD only (see **VNA sweeps**). |
| Consumables | Full set if the SKU is a set (pigtail fan, solder kit pieces). |
| Antennas | **One** antenna unless pigtail is in-frame and part of SKU. Never redraw the connector — preserve from source. |
| Kits | Kit as photographed. |

## Prompt (cutout — default)

Use this shape. Do not swap in "photorealistic catalog photo" or "studio render" language.

```
Product cutout from the reference image only. Task: background removal and isolation — NOT a new product render.

Preserve the product exactly as photographed: same angle, shape, colors, labels, connector, and proportions. Copy from the reference; do not redraw or simplify.

[profile_extract if set]

Replace background with pure white. Remove store UI / hands / text outside the product. [If multi-pack: isolate ONE unit / or ALL pieces per rules above.]

Do NOT invent details. Do NOT change connector gender. Do NOT change viewing angle unless impossible otherwise.
```

**Forbidden prompt words:** "photorealistic catalog photo", "studio shot", "generate a product photo", "match Amazon hero layout" (when that implies redraw).

## VNA sweeps

Restyle `shots/*vna*` to simulated NanoVNA-H S11 SWR (see prior skill). That is the one case we **do** redraw content (meter LCD), not product cutouts.

## Do not

- Re-render products when a clean PDP exists
- Run `normalize-profiles.mjs` / `npm run profiles`
- Overwrite `profile.ai` unless redo requested
- Commit unless asked
