#!/usr/bin/env node
/**
 * Crop profile.jpg from a source photo — pixels only, no AI.
 * Usage: node scripts/crop-profile.mjs <folder>
 *
 * Reads profile_source + profile_crop from listing.md (or profile.meta.yaml).
 * profile_crop: "left,top,width,height" in source pixels.
 */
import { existsSync, unlinkSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { readListingMeta } from './listing-meta.mjs'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function parseCrop(raw) {
  if (!raw) return null
  const parts = String(raw)
    .split(',')
    .map((s) => Number(s.trim()))
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0)) return null
  const [left, top, width, height] = parts
  return { left, top, width, height }
}

async function main() {
  const folderArg = process.argv[2]
  if (!folderArg) {
    console.error('Usage: node scripts/crop-profile.mjs <folder>')
    process.exit(1)
  }

  const folder = resolve(root, folderArg)
  const meta = readListingMeta(folder)
  if (!meta?.profile_source) {
    console.error('Missing profile_source in listing.md')
    process.exit(1)
  }

  const src = join(folder, meta.profile_source)
  if (!existsSync(src)) {
    console.error(`Missing source: ${src}`)
    process.exit(1)
  }

  const crop = parseCrop(meta.profile_crop)
  if (!crop) {
    console.error('Missing or invalid profile_crop (left,top,width,height)')
    process.exit(1)
  }

  const img = sharp(src)
  const { width: sw, height: sh } = await img.metadata()
  if (crop.left + crop.width > sw || crop.top + crop.height > sh) {
    console.error(`Crop ${JSON.stringify(crop)} outside ${sw}×${sh} source`)
    process.exit(1)
  }

  const tmp = join(folder, 'profile.crop.tmp.jpg')
  await img
    .extract(crop)
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(tmp)

  const install = join(root, 'scripts/install-profile.mjs')
  try {
    const r = spawnSync(process.execPath, [install, tmp, folderArg], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(r.status ?? 1)
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp)
  }

  console.log(`cropped ${relative(root, src)} → ${relative(root, join(folder, 'profile.jpg'))}`)
}

main()
