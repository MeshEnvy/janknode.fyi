/**
 * Read listing.md YAML front matter for profile extract hints.
 * Also reads profile.meta.yaml (written by install-profile) as regen fallback.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse, parseDocument } from 'yaml'

function scalar(node) {
  if (!node) return null
  if (typeof node === 'string') return node
  if (typeof node === 'object' && node.value != null) return String(node.value)
  return null
}

function fromListing(folder) {
  const path = join(folder, 'listing.md')
  let raw
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return null
  }
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const doc = parseDocument(match[1])
  const root = doc.toJSON()
  if (!root || typeof root !== 'object') return null
  return {
    profile_source: scalar(root.profile_source),
    connector: scalar(root.connector),
    profile_extract: scalar(root.profile_extract),
    kind: scalar(root.kind),
    title: scalar(root.title),
    brand: scalar(root.brand),
  }
}

function fromProfileMeta(folder) {
  const path = join(folder, 'profile.meta.yaml')
  if (!existsSync(path)) return null
  try {
    const root = parse(readFileSync(path, 'utf8'))
    if (!root || typeof root !== 'object') return null
    return {
      profile_source: root.profile_source ?? null,
      connector: root.connector ?? null,
      profile_extract: root.profile_extract ?? null,
      kind: root.kind ?? null,
      title: root.title ?? null,
      brand: root.brand ?? null,
    }
  } catch {
    return null
  }
}

/** Prefer listing.md; fill gaps from profile.meta.yaml. */
export function readListingMeta(folder) {
  const listing = fromListing(folder) ?? {}
  const saved = fromProfileMeta(folder) ?? {}
  const merged = {
    profile_source: listing.profile_source || saved.profile_source || null,
    connector: listing.connector || saved.connector || null,
    profile_extract: listing.profile_extract || saved.profile_extract || null,
    kind: listing.kind || saved.kind || null,
    title: listing.title || saved.title || null,
    brand: listing.brand || saved.brand || null,
  }
  return Object.values(merged).some(Boolean) ? merged : null
}
