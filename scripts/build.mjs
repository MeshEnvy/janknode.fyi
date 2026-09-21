#!/usr/bin/env node
/**
 * Build index.html from data/data.yaml + index.template.html.
 * Run after any catalog row change: npm run build
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { applyTemplate, renderPage } from './render.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const amazonUrl = (asin) => `https://www.amazon.com/dp/${asin}`

const displayForm = (form) => {
  if (form == null) return null
  return String(form)
    .replace(/-/g, ' ')
    .replace(/\bpir\b/gi, 'PIR')
}

const enrichAmazon = (item, { profilePrefix = 'gear' } = {}) => {
  const out = { ...item }
  if (out.asin && !out.amazon) out.amazon = amazonUrl(out.asin)
  if (!out.profile && out.asin) out.profile = `${profilePrefix}/${out.asin}/profile.jpg`
  return out
}

const enrichVswrShots = (item) => {
  if (!item.vswr_shots?.length) return item
  return {
    ...item,
    vswr_shots: item.vswr_shots.map((shot) => ({
      ...shot,
      alt: shot.alt || `${item.brand} VSWR sweep, ${shot.label}`,
    })),
  }
}

function loadCatalog() {
  const doc = parseYaml(readFileSync(join(root, 'data/data.yaml'), 'utf8'))
  const kingAsin = doc.king
  const shellRows = doc.shells || doc.lights || []

  const lights = shellRows.map((row) => {
    const item = enrichAmazon({ ...row }, { profilePrefix: 'lights' })
    item.king = !!row.king || row.asin === kingAsin
    item.form = displayForm(row.form)
    return item
  })

  const boards = (doc.boards || []).map((row) => {
    const item = { ...row }
    if (!item.profile && item.sku) item.profile = `kits/${item.sku}/profile.jpg`
    return item
  })

  const antennas = (doc.antennas || []).map((row) =>
    enrichVswrShots(enrichAmazon(row)),
  )

  const consumables = (doc.consumables || []).map((row) => enrichAmazon(row))
  const tools = (doc.tools || []).map((row) => enrichAmazon(row))

  return {
    last_verified: doc.last_verified,
    king_shell_asin: kingAsin,
    lights,
    boards,
    antennas,
    consumables,
    tools,
    hero: doc.hero || {},
  }
}

const catalog = loadCatalog()
const parts = renderPage(catalog)
const template = readFileSync(join(root, 'index.template.html'), 'utf8')
const html = applyTemplate(template, parts)

writeFileSync(join(root, 'index.html'), html)

console.log(
  `index.html: ${catalog.lights.length} shells, ${catalog.boards.length} boards, ${catalog.antennas.length} antennas, ${catalog.consumables.length} consumables, ${catalog.tools.length} tools, BOM ${parts.title.match(/\$[\d,.]+/)?.[0] || ''}`,
)
