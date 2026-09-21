#!/usr/bin/env node
/**
 * Dev server: rebuild on catalog/template changes, live-reload browser.
 * Usage: npm run dev
 */
import { execFileSync, spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync, watch } from 'node:fs'
import { dirname, extname, join, normalize, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT) || 5173
const url = `http://localhost:${port}`

function openBrowser() {
  if (process.env.NO_OPEN) return
  const cmd =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open'
  const args =
    process.platform === 'win32' ? ['/c', 'start', '', url] : process.platform === 'darwin' ? [url] : [url]
  spawn(cmd, args, { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref()
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
  '.yaml': 'text/plain; charset=utf-8',
  '.yml': 'text/plain; charset=utf-8',
}

const reloadSnippet =
  '<script>new EventSource("/__dev_reload").onmessage=function(){location.reload()};</script>'

/** @type {Set<import('node:http').ServerResponse>} */
const reloadClients = new Set()
let rebuildTimer = null
let reloadTimer = null
let building = false

function notifyReload() {
  for (const res of reloadClients) {
    res.write('data: reload\n\n')
  }
}

function runBuild() {
  if (building) return
  building = true
  try {
    execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], {
      cwd: root,
      stdio: 'inherit',
    })
    notifyReload()
  } catch {
    console.error('Build failed — fix errors and save again.')
  } finally {
    building = false
  }
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer)
  rebuildTimer = setTimeout(runBuild, 120)
}

function scheduleReload() {
  clearTimeout(reloadTimer)
  reloadTimer = setTimeout(notifyReload, 120)
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const rel = decoded === '/' ? 'index.html' : decoded.replace(/^\//, '')
  const abs = normalize(join(root, rel))
  const relToRoot = relative(root, abs)
  if (relToRoot.startsWith('..') || relToRoot.includes('..')) return null
  if (!existsSync(abs) || statSync(abs).isDirectory()) return null
  return abs
}

function watchPath(path, { rebuild = false } = {}) {
  const abs = join(root, path)
  if (!existsSync(abs)) return

  watch(abs, { recursive: true }, (_event, filename) => {
    if (!filename) return
    const base = String(filename).split(/[/\\]/).pop() || ''
    if (base.startsWith('.')) return
    if (rebuild) {
      console.log(`[dev] ${path}/${filename} → rebuild`)
      scheduleRebuild()
    } else {
      console.log(`[dev] ${path}/${filename} → reload`)
      scheduleReload()
    }
  })
}

runBuild()

watchPath('data', { rebuild: true })
watchPath('scripts', { rebuild: true })
watchPath('index.template.html', { rebuild: true })
watchPath('lights', { rebuild: false })
watchPath('gear', { rebuild: false })
watchPath('kits', { rebuild: false })

createServer((req, res) => {
  if (req.url === '/__dev_reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.write(': connected\n\n')
    reloadClients.add(res)
    req.on('close', () => reloadClients.delete(res))
    return
  }

  const filePath = safePath(req.url || '/')
  if (!filePath) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const ext = extname(filePath)
  const type = MIME[ext] || 'application/octet-stream'
  let body = readFileSync(filePath)

  if (ext === '.html' && filePath.endsWith('index.html')) {
    const html = body.toString('utf8')
    body = Buffer.from(
      html.includes('</body>') ? html.replace('</body>', `${reloadSnippet}</body>`) : html + reloadSnippet,
      'utf8',
    )
  }

  res.writeHead(200, { 'Content-Type': type })
  res.end(body)
}).listen(port, () => {
  console.log(`[dev] ${url}`)
  console.log('[dev] watching data/, scripts/, index.template.html, lights/, gear/, kits/')
  openBrowser()
})
