#!/usr/bin/env node
/**
 * Resize a generated still to 1280×720 (16:9) and stamp youtube-thumb done.
 * Usage: node scripts/install-youtube-thumb.mjs <generated.jpg> <folder>
 */
import { existsSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stringify } from 'yaml'
import sharp from 'sharp'
import { readListingMeta } from './listing-meta.mjs'

const WIDTH = 1280
const HEIGHT = 720
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const [src, folderArg] = process.argv.slice(2)
if (!src || !folderArg) {
  console.error('Usage: node scripts/install-youtube-thumb.mjs <generated.jpg> <folder>')
  process.exit(1)
}

const folder = resolve(root, folderArg)
if (!existsSync(src)) {
  console.error(`Missing generated image: ${src}`)
  process.exit(1)
}
if (!existsSync(folder)) {
  console.error(`Missing folder: ${folder}`)
  process.exit(1)
}

const dest = join(folder, 'youtube-thumb.jpg')
const tmp = `${dest}.tmp`
await sharp(src)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(tmp)
renameSync(tmp, dest)
const meta = await sharp(dest).metadata()
if (meta.width !== WIDTH || meta.height !== HEIGHT) {
  console.error(`${dest}: ${meta.width}×${meta.height} (expected ${WIDTH}×${HEIGHT})`)
  process.exit(1)
}

writeFileSync(join(folder, 'youtube-thumb.ai'), '')

const listing = readListingMeta(folder)
const thumbMeta = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'listing.md',
  aspect: '16:9',
  size: `${WIDTH}x${HEIGHT}`,
}
if (listing?.youtube_review) thumbMeta.youtube_review = listing.youtube_review
if (listing?.youtube_assembly) thumbMeta.youtube_assembly = listing.youtube_assembly
if (listing?.youtube_thumb_tagline) {
  thumbMeta.youtube_thumb_tagline = listing.youtube_thumb_tagline
}
if (listing?.youtube_thumb_extract) {
  thumbMeta.youtube_thumb_extract = listing.youtube_thumb_extract
}
writeFileSync(join(folder, 'youtube-thumb.meta.yaml'), stringify(thumbMeta))

console.log(`wrote ${relative(root, dest)} ${WIDTH}×${HEIGHT}`)
