// Builds a deck as a single self-contained HTML (the normal deck runtime: arrows/click/swipe navigation,
// overview, fullscreen; fonts and images embedded), ready to publish as a Claude artifact.
// Ported from vinta-slidedeck-deprecated's build-deck; the publish-deck skill is the guide.
//
// Usage:
//   npm run build-deck                       your deck (src/slides/, served at /)
//   npm run build-deck -- samples            the sample presentations (or: patterns)
//   npm run build-deck -- --shots            also save one PNG per slide, rendered from the final HTML
//   npm run build-deck -- --name "Q3 Review" artifact title (default: the <title> in index.html)
//
// Output in output/exports/<name>/ (gitignored): <name>.html, text.txt (each slide's words and links, to scan
// before publishing), artifact.json (what to pass to the Artifact tool) and, with --shots, artifact-preview/.
//
// Size: a Claude artifact page holds at most 16 MB, so each image is embedded once (by content) and PNGs over
// 100 KB are re-encoded to WebP with `cwebp` (brew install webp; cached in output/.cache/webp/), keeping the PNG
// when WebP isn't smaller. Without cwebp the PNGs go in as they are. A build over the limit fails before writing.
import { execFile, execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { build } from 'vite'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const PUBLIC = path.join(ROOT, 'public')
const DECKS = ['main', 'patterns', 'samples']
const WAIT_MS = 1500 // time per slide for animations to load their images
const LIMIT_MB = 16 // Claude artifact page limit; MB here is 10^6 bytes, the conservative reading
const WEBP_MIN_BYTES = 100 * 1024 // smaller PNGs (logos, icons) stay lossless
const WEBP_ARGS = ['-q', '88', '-m', '6', '-alpha_q', '100', '-metadata', 'none'] // no visible loss on the backgrounds
const WEBP_CACHE = path.join(ROOT, 'output', '.cache', 'webp')
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm' }

const argv = process.argv.slice(2)
const shots = argv.includes('--shots')
const nameAt = argv.indexOf('--name')
const nameArg = nameAt !== -1 ? argv[nameAt + 1] : undefined
const deckName = argv.filter((a, i) => !a.startsWith('--') && (nameAt === -1 || i !== nameAt + 1))[0] ?? 'main'
if (!DECKS.includes(deckName)) fail(`Unknown deck "${deckName}". Use one of: ${DECKS.join(', ')}`)

const indexTitle = readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/<title>([^<]*)<\/title>/)?.[1]?.trim()
const title =
  nameArg ?? { main: indexTitle || 'Vinta deck', patterns: 'Vinta patterns', samples: 'Vinta sample presentations' }[deckName]
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck'
const dir = path.join(ROOT, 'output', 'exports', slug)
mkdirSync(dir, { recursive: true })

// 1. Bundle the app (JS and CSS in memory; fonts inlined as data URIs)
const ENTRY = 'virtual:artifact-entry'
const entryCode = `
import '/src/artifact/assets.ts'
import '/src/main.tsx'
`
const result = await build({
  configFile: path.join(ROOT, 'vite.config.ts'),
  root: ROOT,
  publicDir: false,
  // 'error': public/ is left out on purpose, so Vite would warn about every CSS url(/assets/...); step 3 embeds them.
  logLevel: 'error',
  plugins: [
    {
      name: 'artifact-entry',
      resolveId: (id) => (id === ENTRY ? '\0' + ENTRY : null),
      load: (id) => (id === '\0' + ENTRY ? entryCode : null),
    },
  ],
  build: {
    write: false,
    cssCodeSplit: false,
    modulePreload: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: Number.MAX_SAFE_INTEGER,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      input: ENTRY,
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'deck.js', assetFileNames: 'deck[extname]' },
    },
  },
})
const output = (Array.isArray(result) ? result[0] : result).output
const js = output.find((o) => o.type === 'chunk')?.code ?? ''
let css = output
  .filter((o) => o.type === 'asset' && o.fileName.endsWith('.css'))
  .map((o) => String(o.source))
  .join('\n')

// 2. Find the images in use by rendering each slide and recording the requests to /assets/
const browser = await chromium.launch()
const used = new Set()
for (const [, , p] of css.matchAll(/url\((['"]?)(\/assets\/[^'")]+)\1\)/g)) used.add(p)
{
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = trackErrors(page)
  await page.route('http://deck.local/**', async (route) => {
    const { pathname } = new URL(route.request().url())
    if (pathname === '/index.html') return route.fulfill({ contentType: 'text/html', body: renderHtml(title, css, js, null) })
    const asset = decodeURIComponent(pathname)
    const file = path.join(PUBLIC, asset)
    if (asset.startsWith('/assets/') && existsSync(file)) {
      used.add(asset)
      return route.fulfill({ path: file })
    }
    errors.push(`file not found: ${asset}`)
    return route.fulfill({ status: 404, body: '' })
  })
  await page.goto('http://deck.local/index.html#/1')
  const count = await slideCount(page)
  for (let i = 1; i <= count; i++) await showSlide(page, i)
  await page.close()
  if (errors.length) fail(`Errors rendering the deck:\n- ${[...new Set(errors)].join('\n- ')}`)
}

// 3. Assemble the final HTML with the path → data URI map (each image once, heavy PNGs as WebP)
const images = await embedImages([...used].sort())
css = css.replace(/url\((['"]?)(\/assets\/[^'")]+)\1\)/g, (m, _q, p) =>
  p in images.index ? `url("${images.uris[images.index[p]]}")` : m,
)
const html = renderHtml(title, css, js, images)
const mb = Buffer.byteLength(html) / 1e6
if (mb > LIMIT_MB) {
  const heaviest = [...images.list]
    .sort((a, b) => b.size - a.size)
    .slice(0, 8)
    .map((e) => `- ${(e.size / 1e6).toFixed(1)} MB  ${e.paths.join(', ')}${e.webp ? ' (as WebP)' : ''}`)
  fail(
    `The HTML would be ${mb.toFixed(1)} MB, over the ${LIMIT_MB} MB a Claude artifact page holds; nothing was written.\n` +
      (images.cwebp ? '' : 'cwebp was not found, so PNGs went in uncompressed: install it (brew install webp) and build again.\n') +
      `Heaviest embedded images:\n${heaviest.join('\n')}\n` +
      'Shrink or drop images in public/assets (WebP or JPEG for photos), or split the deck.',
  )
}
const outFile = path.join(dir, `${slug}.html`)
const outUrl = pathToFileURL(outFile).href
// The HTML may have been edited by hand since the last build: keep that version instead of overwriting it.
const manifestFile = path.join(dir, 'artifact.json')
const editedFile = path.join(dir, `${slug}.edited.html`)
if (existsSync(outFile) && existsSync(manifestFile)) {
  const built = JSON.parse(readFileSync(manifestFile, 'utf8')).sha256
  if (built && sha256(readFileSync(outFile)) !== built) {
    copyFileSync(outFile, editedFile)
    console.warn(`The HTML was edited after the last build; that version is kept in ${path.relative(ROOT, editedFile)}`)
  }
}
writeFileSync(outFile, html)
// Record this build's hash right away: a run that stops before step 4 must not leave artifact.json pointing at the
// previous HTML, or the next build would take this one for a hand edit.
const branch = git('branch', '--show-current')
const commit = git('rev-parse', '--short', 'HEAD')
const repo = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')).name
writeManifest({})

// 4. Check the final HTML offline (no network request, no error), save previews and the text to scan
{
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = trackErrors(page)
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.split('#')[0] === outUrl) return route.continue()
    errors.push(`external request: ${url.startsWith('file://') ? url.slice(7) : url}`)
    return route.abort()
  })
  await page.goto(`${outUrl}#/1`)
  const count = await slideCount(page)
  if (shots) mkdirSync(path.join(dir, 'artifact-preview'), { recursive: true })
  // The previews show the slide alone, without the navigation bar.
  await page.addStyleTag({ content: '[data-deck-hud]{display:none!important}' })
  const sections = []
  const links = new Set()
  for (let i = 1; i <= count; i++) {
    await showSlide(page, i)
    if (shots) await page.screenshot({ path: path.join(dir, 'artifact-preview', `${String(i).padStart(2, '0')}.png`) })
    // The words and addresses a viewer sees, for the scan before publishing (publish-deck skill).
    const slide = await page.evaluate(() => {
      const stage = document.querySelector('[data-deck-index] [data-slide]')
      const name = document.querySelector('[data-deck-hud] .truncate')?.textContent ?? ''
      return {
        name,
        text: (stage?.innerText ?? '').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim(),
        links: [...(stage?.querySelectorAll('a[href]') ?? [])].map((a) => a.href).filter((href) => /^(https?|mailto|tel):/.test(href)),
      }
    })
    sections.push(`## ${String(i).padStart(2, '0')}${slide.name ? ` · ${slide.name}` : ''}\n${slide.text}`)
    slide.links.forEach((href) => links.add(href))
  }
  await page.close()
  await browser.close()
  if (errors.length) fail(`The final HTML is not self-contained:\n- ${[...new Set(errors)].join('\n- ')}`)
  const textFile = path.join(dir, 'text.txt')
  writeFileSync(textFile, `${sections.join('\n\n')}\n\n# Links\n${[...links].sort().join('\n')}\n`)

  writeManifest({
    description: `${title}: Vinta deck, ${count} slides, from ${repo}${branch ? ` (branch ${branch})` : ''}.`,
    slides: count,
    mb: Number(mb.toFixed(1)),
  })

  const webp = images.list.filter((e) => e.webp)
  const saved = webp.reduce((sum, e) => sum + e.originalSize - e.size, 0)
  console.log(`\nArtifact: ${path.relative(ROOT, outFile)} (${count} slides, ${used.size} images, ${mb.toFixed(1)} MB of ${LIMIT_MB})`)
  if (webp.length) console.log(`Images: ${webp.length} PNGs embedded as WebP, ${(saved / 1e6).toFixed(1)} MB smaller`)
  console.log(`Scan: ${path.relative(ROOT, textFile)} · Publish: ${path.relative(ROOT, manifestFile)}`)
  if (shots) console.log(`Preview: ${path.relative(ROOT, path.join(dir, 'artifact-preview'))}/`)
}

// The data URIs for the images in use: one per distinct content (paths with the same bytes share it), PNGs over
// WEBP_MIN_BYTES re-encoded to WebP when cwebp is installed and the WebP is smaller.
async function embedImages(paths) {
  const cwebp = cwebpVersion()
  if (!cwebp) console.warn('cwebp not found (brew install webp): PNGs are embedded uncompressed.')
  const byHash = new Map()
  for (const p of paths) {
    const file = path.join(PUBLIC, p)
    const bytes = readFileSync(file)
    const hash = sha256(bytes)
    if (byHash.has(hash)) byHash.get(hash).paths.push(p)
    else byHash.set(hash, { paths: [p], file, bytes, hash })
  }
  const list = await Promise.all(
    [...byHash.values()].map(async ({ paths, file, bytes, hash }) => {
      let type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
      let data = bytes
      if (cwebp && type === 'image/png' && bytes.length > WEBP_MIN_BYTES) {
        const webp = await toWebp(file, hash, cwebp)
        if (webp.length < bytes.length) [type, data] = ['image/webp', webp]
      }
      const uri = `data:${type};base64,${data.toString('base64')}`
      return { paths, uri, size: uri.length, originalSize: Math.ceil(bytes.length / 3) * 4, webp: data !== bytes }
    }),
  )
  const index = {}
  list.forEach((e, i) => e.paths.forEach((p) => (index[p] = i)))
  return { uris: list.map((e) => e.uri), index, list, cwebp }
}

// Cached by PNG content, cwebp version and settings, so rebuilding a deck doesn't re-encode.
async function toWebp(file, hash, version) {
  const key = sha256(`${hash} ${version} ${WEBP_ARGS.join(' ')}`).slice(0, 32)
  const out = path.join(WEBP_CACHE, `${key}.webp`)
  if (!existsSync(out)) {
    mkdirSync(WEBP_CACHE, { recursive: true })
    const tmp = `${out}.${process.pid}.tmp`
    try {
      await promisify(execFile)('cwebp', ['-quiet', ...WEBP_ARGS, file, '-o', tmp])
    } catch (err) {
      fail(`cwebp failed on ${path.relative(ROOT, file)}: ${err.stderr || err.message}`)
    }
    renameSync(tmp, out)
  }
  return readFileSync(out)
}

function cwebpVersion() {
  try {
    return execFileSync('cwebp', ['-version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

function renderHtml(docTitle, styles, script, images) {
  const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1')
  const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c')
  // Path → data URI, written as path → index into the list of URIs so an image shared by several paths goes in once.
  const map = images
    ? `window.__DECK_ASSETS__=(function(d,m){for(var k in m)m[k]=d[m[k]];return m})(${json(images.uris)},${json(images.index)});`
    : ''
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${docTitle.replace(/</g, '&lt;')}</title>
<style>${safe(styles)}</style>
<script>window.__DECK_NAME__=${json(deckName)};${map}</script>
</head>
<body>
<div id="root"></div>
<script>${safe(script)}</script>
</body>
</html>
`
}

async function slideCount(page) {
  await page.waitForSelector('[data-deck-count]')
  return Number(await page.getAttribute('[data-deck-count]', 'data-deck-count'))
}

async function showSlide(page, n) {
  await page.evaluate((i) => (window.location.hash = `#/${i}`), n)
  await page.waitForSelector(`[data-deck-index="${n - 1}"]`)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
  })
  await page.waitForTimeout(WAIT_MS)
}

function trackErrors(page) {
  const errors = []
  page.on('pageerror', (err) => errors.push(`script error: ${err.message}`))
  page.on('console', (msg) => msg.type() === 'error' && !msg.text().includes('ERR_FAILED') && errors.push(`console: ${msg.text()}`))
  return errors
}

// What to pass to the Artifact tool; the description's fixed shape finds the artifact again from another session.
function writeManifest(extra) {
  const manifest = {
    title,
    deck: deckName,
    ...extra,
    page: path.relative(ROOT, outFile),
    branch,
    commit,
    // tells a hand edit of the HTML from the build's own output
    sha256: sha256(html),
  }
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

function git(...args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
