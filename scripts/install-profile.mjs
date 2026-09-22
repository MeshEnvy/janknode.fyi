#!/usr/bin/env node
/**
 * Resize a generated product photo to 512×512 and stamp the folder done.
 * Usage: node scripts/install-profile.mjs <generated.jpg> <folder>
 * Folder is lights/<ASIN>, gear/<ASIN>, or kits/<SKU> (repo-relative or absolute).
 */
import { existsSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SIZE = 512
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const [src, folderArg] = process.argv.slice(2)
if (!src || !folderArg) {
  console.error('Usage: node scripts/install-profile.mjs <generated.jpg> <folder>')
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

const dest = join(folder, 'profile.jpg')
const tmp = `${dest}.tmp`
await sharp(src).resize(SIZE, SIZE).jpeg({ quality: 86, mozjpeg: true }).toFile(tmp)
renameSync(tmp, dest)
const meta = await sharp(dest).metadata()
if (meta.width !== SIZE || meta.height !== SIZE) {
  console.error(`${dest}: ${meta.width}×${meta.height} (expected ${SIZE}×${SIZE})`)
  process.exit(1)
}

writeFileSync(join(folder, 'profile.ai'), '')
console.log(`wrote ${relative(root, dest)} ${SIZE}×${SIZE}`)
