#!/usr/bin/env node
/**
 * List catalog folders waiting for an AI profile extract.
 * Usage: npm run profile-queue
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readListingMeta } from './listing-meta.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CATALOG_DIRS = ['lights', 'gear', 'kits']
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i

function newestPdp(folder) {
  const shots = join(folder, 'shots')
  if (!existsSync(shots)) return null
  const candidates = readdirSync(shots)
    .filter((name) => /pdp/i.test(name) && IMAGE_EXT.test(name))
    .map((name) => join(shots, name))
  if (!candidates.length) return null
  candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return candidates[0]
}

function listFolders() {
  const folders = []
  for (const dir of CATALOG_DIRS) {
    const abs = join(root, dir)
    if (!existsSync(abs)) continue
    for (const name of readdirSync(abs)) {
      if (name.startsWith('_') || name.startsWith('.')) continue
      folders.push(join(abs, name))
    }
  }
  return folders
}

function main() {
  let done = 0
  let pending = 0
  let skipped = 0

  for (const folder of listFolders()) {
    const rel = relative(root, folder)
    const stamp = existsSync(join(folder, 'profile.ai'))
    const snapshot = existsSync(join(folder, 'product-detail-snapshot.jpg'))
    const pdp = newestPdp(folder)

    if (stamp) {
      console.log(`done     ${rel}`)
      done++
      continue
    }
    if (snapshot || pdp) {
      const src = snapshot ? 'snapshot' : basename(pdp)
      const meta = readListingMeta(folder)
      const hints = []
      if (meta?.profile_method) hints.push(`method=${meta.profile_method}`)
      if (meta?.profile_source) hints.push(`source=${meta.profile_source}`)
      if (meta?.profile_crop) hints.push(`crop=${meta.profile_crop}`)
      if (meta?.connector) hints.push(`connector=${meta.connector}`)
      if (meta?.profile_extract) hints.push(`extract: ${meta.profile_extract.slice(0, 80)}…`)
      const hint = hints.length ? `  [${hints.join('; ')}]` : ''
      console.log(`pending  ${rel}  (${src})${hint}`)
      pending++
      continue
    }
    console.log(`skipped  ${rel}  (no snapshot or PDP)`)
    skipped++
  }

  console.log(`${done} done, ${pending} pending, ${skipped} skipped`)
  if (pending) process.exitCode = 1
}

main()
