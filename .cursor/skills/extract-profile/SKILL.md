---
name: extract-profile
description: >-
  AI-extract a 512x512 catalog profile.jpg from a product photo. Isolate one
  product (or a full set) onto white. Use for the profile queue, ingest, or
  regen. Do not manually crop.
---

# Extract catalog profile

`product-detail-snapshot.jpg` (or `profile_source`) is the raw capture. `profile.jpg` is the 512×512 tile. **Always use GenerateImage (agentic prompt + reference photo).** No other path.

**Forbidden on source/reference photos:** sharp, ImageMagick, ffmpeg, trim/crop/extract, pixel coordinates, photo-crop scripts, `extract-profile.mjs`, `crop-profile.mjs`, or any manual image edit. Agents must not run shell/node one-liners that manipulate `shots/` or snapshots.

`install-profile.mjs` is allowed **only** on GenerateImage output (resize to 512×512 + stamp). Never pass a source shot to it.

Some shots are full Amazon pages, multi-packs, or busy scenes. The model has to pull the product out. A rectangle crop cannot.

Stamp: `profile.ai` + `profile.meta.yaml` (written by `install-profile.mjs`).

## Queue

```bash
npm run profile-queue
```

`pending` = source image, no `profile.ai`. Prints `profile_source`, `connector`, and a `profile_extract` snippet.

## Loop

Until the queue is empty or the user stops:

1. Next `pending` row (or the folder the user named).
2. Read `listing.md` (`kind`, `connector`, `profile_extract`, brand, title). Fallback: `profile.meta.yaml`. Open the source image (`profile_source`, else `product-detail-snapshot.jpg`, else newest `shots/*pdp*`). **Confirm the reference matches this SKU** (form factor, color, markings) before generating.
3. `GenerateImage` with that file as `reference_image_paths`, `aspect_ratio: "1:1"`, `filename: "profile.jpg"`. Use **Prompt** below. Paste `profile_extract` and `connector` into it.
4. `node scripts/install-profile.mjs <generated.jpg> <folder>`.
5. Read `profile.jpg`. Fail if store chrome, prices, wrong product, a **pack of identical lights**, a **set missing pieces**, a **duplicated tool**, or a **connector the source does not show** (invented jack, flipped SMA gender, external threads on a male whip). Retry **once** with the same prompt plus the specific failure. Still bad → delete `profile.ai`, leave pending.
6. Next item. Do not wait.

Stop after one item only when the user named a single listing.

Redo: delete `profile.ai`, tighten `profile_extract` in `listing.md`, re-run. Do not add pixel crop coordinates.

## Prompt

```
Extract the catalog product from the reference photo onto a pure white background.

Job: isolate the product. Remove store UI, prices, ratings, hands, scenery, and duplicate copies. This is not a new product design.

What to keep:
- Same shape, colors, labels, and viewing angle as the photo.
- Connector and threads only if they are actually visible. If the base is smooth plastic, leave it smooth. Do not add a metal jack. Do not add external threads.
- One instance when the photo is a multi-pack of the same item (lights, identical whips).
- Every distinct piece when the SKU is a set (pliers set, solder kit, pigtail pack).

[If connector is set: Connector on this part: <connector>. Match the photo. Do not flip gender.]
[If profile_extract is set: <profile_extract>]

Square frame, product fully in frame with margin. No watermarks. No invented logos or text.
```

Forbidden: "photorealistic catalog photo", "studio shot of a new antenna", "draw an SMA connector". Those make the model invent hardware.

## What to show

| Category | Isolate |
|---|---|
| Lights | One shell. Never the 6-pack grid. No lawn or house. |
| Tools | Every tool in the set, once each. |
| Consumables | The supply plus accessories in the photo. A pigtail 5-pack stays five cables. |
| Antennas | One antenna. Pigtail only if it is in the photo and part of the SKU. |
| Kits | The kit as photographed. |
| Batteries | One cell. Match form factor (18650 vs 21700) and markings (+5330mAh, CC5493F, etc.) from the reference. Never swap in another cell size. |

## Listing hints

| Field | Role |
|---|---|
| `profile_source` | Which file to pass as the reference |
| `connector` | Gender constraint when the photo shows a connector |
| `profile_extract` | Extra isolation rules for this SKU (one from a 4-pack, do not invent threads, list the six tools) |

Both `connector` and `profile_extract` are pasted into the prompt. They are not a crop recipe.

## YouTube shell thumb (16:9)

When a shell has `youtube_review` or `youtube_assembly` and **`profile_video: true`**, the catalog **thumb column** is the video link (not `profile.jpg`). Other shells keep the square product tile.

### Branded theme (default)

Catalog thumbs match the **review channel look**, not raw YouTube CDN frames.

| Piece | Source |
|---|---|
| Face | `assets/operator-face.jpg` — **cut out**, background removed, not pasted with original sky/desert |
| Pose | Person **looks at** the product (reviewing / presenting), left or lower-left |
| Product | `profile.jpg` or a filed still under `shots/` — hero subject, right or center-right |
| Tagline | `youtube_thumb_tagline` in `listing.md` — short quote, verdict, or hook per video |

Set one tagline per shell video, e.g. `This actually works!`, `Molded shut.`, `Cheapest shell on paper.`

1. Read `youtube_thumb_tagline`, `youtube_thumb_extract`, `profile.jpg`.
2. `GenerateImage` with `aspect_ratio: "16:9"`, `reference_image_paths`: `[assets/operator-face.jpg, profile or still]`.
3. `node scripts/install-youtube-thumb.mjs <generated.jpg> <folder>` → `youtube-thumb.jpg` (1280×720), `youtube-thumb.ai`, `youtube-thumb.meta.yaml`.
4. `youtube_thumb` + `profile_video: true` in `listing.md` and `data/data.yaml`. Rebuild.

Prompt:

```
YouTube review thumbnail, 16:9, bright and saturated, full contrast (not faded).
Cut out the person from the face reference with background removed. Person looks at
the product from the product reference (reviewing pose). Product is the hero subject.
Bold white headline with dark outline, exact text: [youtube_thumb_tagline]
Readable at small size. No YouTube logo, no baked play button.
[youtube_thumb_extract]
```

YouTube CDN (`i.ytimg.com/vi/{id}/hqdefault.jpg`) is a fallback only when no branded thumb is needed. Private or fresh uploads may 404 for an hour.

## VNA sweeps

Restyle `shots/*vna*` to a simulated NanoVNA-H S11 SWR screen (dark LCD, cyan grid, yellow trace, marker at `vswr_min` @ `vswr_min_mhz`). That is the only redraw. Product tiles are extracts.

## Do not

- Manual pixel crops, `profile_crop`, sharp, or any image tool on source photos
- Generate a product that is not in the reference
- Use the wrong listing's reference image (18650 shot for 21700, etc.)
- Invent connectors
- Commit unless asked
