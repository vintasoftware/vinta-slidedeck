// Builds the template gallery: a single page for non-technical users with every slide
// template grouped by the curated categories of scripts/gallery-catalog.mjs (by use, in deck order), one screenshot
// per variant and a link to the Storybook story, then the sample presentations and your own deck (src/slides/).
// "Use when" comes from the catalog; limits from the "Pattern catalog" tables in src/components/CATALOG.md.
// Usage: npm run gallery                 (build + serve on http://localhost:6007 + open the browser)
//        npm run gallery:build           (build only → gallery/index.html + gallery/shots/)
//        ... -- --skip-existing          (keep screenshots already on disk; shoot only new stories)
// Uses Storybook on :6006 and the deck on :5173 when running; otherwise starts temporary ones on :6016 / :6017.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { spawn, exec } from 'node:child_process'
import path from 'node:path'
import { chromium } from 'playwright'
import { catalog } from './gallery-catalog.mjs'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'gallery')
const SHOTS = path.join(OUT, 'shots')
const argv = process.argv.slice(2)
const serve = argv.includes('--serve')
const skipExisting = argv.includes('--skip-existing')
const PORT = 6007

// 1. Limits per pattern, from the "Pattern catalog" tables in src/components/CATALOG.md.
const catalogMd = readFileSync(path.join(ROOT, 'src/components/CATALOG.md'), 'utf8')
const section = catalogMd.slice(catalogMd.indexOf('## Pattern catalog'), catalogMd.indexOf('## Elements'))
const info = new Map()
for (const line of section.split('\n')) {
  const row = line.match(/^\| `(\w+)`(?: \(.*?\))? \| (.+?) \| (.+?) \|(?: (.+?) \|)?$/)
  if (row) info.set(row[1], { useWhen: strip(row[2]), limits: strip(row[4] ?? '') })
}
function strip(md) {
  return md.replace(/\\\|/g, '|').replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}
// Categories: the curated catalog (by use), each item with its label, hint and the §3 limits.
const categories = catalog.map((c) => ({
  title: c.title,
  intro: c.hint,
  patterns: c.items.map((it) => ({ name: it.pattern, label: it.label, useWhen: it.hint, groups: it.groups, limits: info.get(it.pattern)?.limits ?? '' })),
}))

// 2. Stories from Storybook (reuse :6006 or start a temporary one).
let base = 'http://localhost:6006'
// Links in the page always target :6006 (`npm run storybook`): the temporary :6016 instance stops after the screenshots.
const linkBase = 'http://localhost:6006'
let child = null
if (!(await fetch(`${base}/index.json`).then((r) => r.ok).catch(() => false))) {
  base = 'http://localhost:6016'
  console.log('Storybook is not running on :6006, starting a temporary one on :6016…')
  child = spawn('npx', ['storybook', 'dev', '-p', '6016', '--ci', '--no-open'], { stdio: 'ignore' })
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    if (await fetch(`${base}/index.json`).then((r) => r.ok).catch(() => false)) break
  }
}
const index = await fetch(`${base}/index.json`).then((r) => r.json())
const stories = Object.values(index.entries).filter((e) => e.type === 'story')
const byTitle = new Map()
for (const s of stories) {
  if (!byTitle.has(s.title)) byTitle.set(s.title, [])
  byTitle.get(s.title).push(s)
}
const titleFor = (name) => (byTitle.has(`Patterns/${name}`) ? `Patterns/${name}` : byTitle.has(`Elements/${name}`) ? `Elements/${name}` : null)

// Patterns in Storybook but not in the catalog → "Uncategorized" (the agent must add them to scripts/gallery-catalog.mjs).
const listed = new Set(categories.flatMap((c) => c.patterns.map((p) => p.name)))
const unlisted = [...byTitle.keys()].filter((t) => t.startsWith('Patterns/') && !listed.has(t.slice(9)) && t !== 'Patterns/SlideShell')
if (unlisted.length) categories.push({ title: 'Uncategorized', intro: 'In Storybook but missing from scripts/gallery-catalog.mjs. Add them to the catalog.', patterns: unlisted.map((t) => ({ name: t.slice(9), label: t.slice(9), useWhen: '', limits: '' })) })
// Sample presentations (src/samples, title "Samples/<name>"): full decks with fictional data, shown before the client decks.
const samples = [...byTitle.keys()].filter((t) => t.startsWith('Samples/')).map((t) => ({ name: t.slice(8), stories: byTitle.get(t) }))

// 3. Screenshots (960×540 JPEG per story).
mkdirSync(SHOTS, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 })
async function shoot(story) {
  const file = path.join(SHOTS, `${story.id}.jpg`)
  if (skipExisting && existsSync(file)) return
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`)
  await page.waitForSelector('#storybook-root *').catch(() => {})
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
  })
  await page.waitForTimeout(600)
  await page.screenshot({ path: file, type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1920, height: 1080 } })
}
let n = 0
const all = [...categories.flatMap((c) => c.patterns.flatMap((p) => (titleFor(p.name) ? byTitle.get(titleFor(p.name)) : []))), ...samples.flatMap((d) => d.stories)]
for (const s of all) {
  await shoot(s)
  if (++n % 20 === 0) console.log(`  ${n}/${all.length} shots`)
}
if (child) child.kill()

// 3b. Your deck (src/slides/), shot from the app: reuse :5173 (npm run dev) or start a temporary one on :6017.
// Always reshot: it is the deck being worked on. Links open the slide in the app.
const deckLink = 'http://localhost:5173'
let deckBase = deckLink
let deckChild = null
if (!(await fetch(deckBase).then((r) => r.ok).catch(() => false))) {
  deckBase = 'http://localhost:6017'
  deckChild = spawn('npx', ['vite', '--port', '6017', '--strictPort'], { stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    if (await fetch(deckBase).then((r) => r.ok).catch(() => false)) break
  }
}
const deckSlides = []
await page.goto(`${deckBase}/#/1`)
await page.waitForSelector('[data-deck-count]')
await page.addStyleTag({ content: '[data-deck-hud]{display:none!important}' })
const deckCount = Number(await page.getAttribute('[data-deck-count]', 'data-deck-count'))
for (let i = 1; i <= deckCount; i++) {
  await page.evaluate((n) => (window.location.hash = `#/${n}`), i)
  await page.waitForSelector(`[data-deck-index="${i - 1}"]`)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
  })
  await page.waitForTimeout(600)
  const title = await page.evaluate(() => document.querySelector('[data-deck-hud] .truncate')?.textContent ?? '')
  const id = `deck-${String(i).padStart(2, '0')}`
  await page.screenshot({ path: path.join(SHOTS, `${id}.jpg`), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1920, height: 1080 } })
  deckSlides.push({ id, name: `${String(i).padStart(2, '0')} ${title}`.trim(), href: `${deckLink}/#/${i}` })
}
if (deckChild) deckChild.kill()
await browser.close()

// 4. HTML.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const storyName = (s) => s.name.replace(/^\d+\s*/, '')
const variantButton = (s, on) => `<button class="${on ? 'on' : ''}" data-id="${s.id}" title="${esc(storyName(s))}"><img src="shots/${s.id}.jpg" alt="" loading="lazy"><span>${esc(storyName(s))}</span></button>`
const card = (name, label, useWhen, limits, list, groups) => {
  if (!list.length) return `<article class="card missing" id="${name}"><h3>${esc(label)}</h3><p>No story in Storybook yet.</p></article>`
  // Grouped variants (e.g. the case library by sector): one labelled list per group, in the group order.
  if (groups) {
    const byId = new Map(list.map((s) => [s.id, s]))
    const grouped = groups.map((g) => ({ label: g.label, stories: g.ids.map((id) => byId.get(id)).filter(Boolean) })).filter((g) => g.stories.length)
    const rest = list.filter((s) => !groups.some((g) => g.ids.includes(s.id)))
    if (rest.length) grouped.push({ label: 'Other', stories: rest })
    list = grouped.flatMap((g) => g.stories)
    const first = list[0]
    return `<article class="card" id="${name}">
  <a class="main" href="${linkBase}/?path=/story/${first.id}" target="_blank" title="Open in Storybook"><img src="shots/${first.id}.jpg" alt="${esc(label)}" loading="lazy" data-main></a>
  <div class="text">
    <h3>${esc(label)} <code>${esc(name)}</code></h3>
    ${useWhen ? `<p class="use">${esc(useWhen)}</p>` : ''}
    ${limits ? `<p class="limits">${esc(limits)}</p>` : ''}
    ${grouped.map((g) => `<p class="group">${esc(g.label)} <small>${g.stories.length}</small></p><div class="variants">${g.stories.map((s) => variantButton(s, s === first)).join('')}</div>`).join('')}
    <a class="sb" href="${linkBase}/?path=/story/${first.id}" target="_blank">Open in Storybook ↗</a>
  </div>
</article>`
  }
  const first = list[0]
  return `<article class="card" id="${name}">
  <a class="main" href="${linkBase}/?path=/story/${first.id}" target="_blank" title="Open in Storybook"><img src="shots/${first.id}.jpg" alt="${esc(name)}" loading="lazy" data-main></a>
  <div class="text">
    <h3>${esc(label)} <code>${esc(name)}</code></h3>
    ${useWhen ? `<p class="use">${esc(useWhen)}</p>` : ''}
    ${limits ? `<p class="limits">${esc(limits)}</p>` : ''}
    ${list.length > 1 ? `<div class="variants">${list.map((s, i) => variantButton(s, i === 0)).join('')}</div>` : ''}
    <a class="sb" href="${linkBase}/?path=/story/${first.id}" target="_blank">Open in Storybook ↗</a>
  </div>
</article>`
}
const sections = categories
  .map((c) => ({ ...c, html: c.patterns.map((p) => card(p.name, p.label, p.useWhen, p.limits, titleFor(p.name) ? byTitle.get(titleFor(p.name)) : [], p.groups)).join('\n') }))
const deckStrips = (list, prefix) => list
  .map((d) => `<article class="deck" id="${prefix}-${esc(d.name)}"><h3>${esc(d.name)}</h3><div class="strip">${d.stories.map((s) => `<a href="${s.href ?? `${linkBase}/?path=/story/${s.id}`}" target="_blank"><img src="shots/${s.id}.jpg" alt="" loading="lazy"><span>${esc(s.name)}</span></a>`).join('')}</div></article>`)
  .join('\n')
const decks = deckSlides.length ? [{ name: 'Your deck (src/slides/)', stories: deckSlides }] : []
const deckHtml = deckStrips(decks, 'deck')
const sampleHtml = deckStrips(samples, 'sample')
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const total = categories.reduce((a, c) => a + c.patterns.length, 0)
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Vinta Slides — template gallery</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--blue:#0050ff;--ink:#050842;--text:#4c5564;--line:#e5ecf6;--bg:#f7f9fd;--white:#fff}
*{box-sizing:border-box}body{margin:0;font-family:"DM Sans",sans-serif;color:var(--ink);background:var(--bg)}
a{color:var(--blue);text-decoration:none}
header{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:24px;padding:16px 32px;background:var(--white);border-bottom:1px solid var(--line)}
header .brand{display:flex;align-items:center;gap:12px;color:var(--ink)}header .mark{height:22px;width:auto;animation:rise .7s cubic-bezier(.2,.8,.2,1) both}header .dot{width:8px;height:8px;border-radius:999px;background:var(--blue);animation:rise .7s .15s cubic-bezier(.2,.8,.2,1) both,pulse 2.4s 1s ease-in-out infinite}header h1{margin:0;font-size:20px;font-weight:300;letter-spacing:-.01em;animation:rise .7s .25s cubic-bezier(.2,.8,.2,1) both}header .brand:hover .mark{animation:bounce .6s cubic-bezier(.3,1.5,.5,1)}@keyframes rise{from{opacity:0;transform:translateY(10px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}@keyframes pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,80,255,.35)}50%{transform:scale(1.15);box-shadow:0 0 0 8px rgba(0,80,255,0)}}@keyframes bounce{30%{transform:translateY(-4px) rotate(-3deg)}60%{transform:translateY(1px) rotate(1deg)}100%{transform:none}}@media (prefers-reduced-motion:reduce){header *{animation:none!important}}header .meta{font-family:"DM Mono",monospace;font-size:12px;color:var(--text)}
header input{margin-left:auto;width:320px;padding:10px 14px;border:1px solid var(--line);border-radius:999px;font:inherit;font-size:14px}
.layout{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:100vh}
nav{position:sticky;top:61px;align-self:start;height:calc(100vh - 61px);overflow:auto;padding:24px;border-right:1px solid var(--line);background:var(--white)}
nav a{display:block;padding:12px 14px;margin-bottom:4px;border-radius:10px;color:var(--ink);font-size:15px}nav a:hover,nav a.on{background:var(--bg)}nav a b{font-weight:600}nav a small{color:var(--text);font-family:"DM Mono",monospace;font-size:11px;margin-left:8px}nav a span{display:block;font-size:12px;color:var(--text);margin-top:2px}
main{padding:32px 40px;max-width:1500px;min-width:0}
section{margin-bottom:56px}section h2{font-size:28px;font-weight:300;margin:0 0 6px}section .intro{color:var(--text);margin:0 0 20px;max-width:900px;font-size:15px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(440px,100%),1fr));gap:24px}
.card{min-width:0;background:var(--white);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(5,5,8,.04)}
.card .main img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#dfe7f3}
.card .text{padding:16px 18px 18px}.card h3{margin:0 0 6px;font-size:17px;font-weight:600}.card h3 code{font-family:"DM Mono",monospace;font-size:11px;font-weight:400;color:var(--text);margin-left:8px}
.card .use{margin:0;font-size:14px;color:var(--text)}.card .limits{margin:6px 0 0;font-family:"DM Mono",monospace;font-size:12px;color:var(--text)}.card .group{margin:14px 0 0;font-size:13px;font-weight:600;color:var(--ink)}.card .group small{font-family:"DM Mono",monospace;font-weight:400;color:var(--text);margin-left:6px}
.card.missing{padding:18px;color:var(--text)}
.variants{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.variants button{display:flex;flex-direction:column;align-items:center;gap:4px;width:104px;padding:0;border:2px solid transparent;border-radius:8px;background:none;cursor:pointer;font:inherit}
.variants button img{width:100px;aspect-ratio:16/9;object-fit:cover;border-radius:6px;border:1px solid var(--line)}.variants button span{font-size:11px;color:var(--text);max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.variants button.on{border-color:var(--blue)}.sb{display:inline-block;margin-top:12px;font-size:13px}
.deck{background:var(--white);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:20px}.deck h3{margin:0 0 12px;font-size:17px;font-weight:600}
.strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.strip a{min-width:0;color:var(--text);font-size:12px}.strip img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:1px solid var(--line);margin-bottom:4px}
.hidden{display:none}
</style></head><body>
<header><a class="brand" href="#"><img class="mark" src="vinta-wordmark-blue.svg" alt="Vinta"><span class="dot"></span><h1>Slides</h1></a><span class="meta">${total} templates · ${samples.length} samples · built ${stamp}</span><input id="q" type="search" placeholder="Search templates…"></header>
<div class="layout">
<nav>
${sections.map((c) => `<a href="#${slug(c.title)}"><b>${esc(c.title)}</b><small>${c.patterns.length}</small><span>${esc(c.intro)}</span></a>`).join('')}
<a href="#samples"><b>Sample presentations</b><small>${samples.length}</small><span>Full decks with fictional data.</span></a>
${decks.length ? `<a href="#decks"><b>Your deck</b><small>${deckSlides.length}</small><span>The slides in src/slides/.</span></a>` : ''}
</nav>
<main>
<p class="intro">Every slide template, grouped by what it is for, in the order of a deck. Click a thumbnail to switch the variant; click the big image to open it in Storybook. To build a deck, open Claude Code here and ask for one (<code>/create-deck</code>).</p>
${sections.map((c) => `<section id="${slug(c.title)}"><h2>${esc(c.title)}</h2>${c.intro ? `<p class="intro">${esc(c.intro)}</p>` : ''}<div class="grid">${c.html}</div></section>`).join('\n')}
<section id="samples"><h2>Sample presentations</h2><p class="intro">Complete presentations built only from these templates, with fictional data: a partnership conversation, a board review and a planning-week summary. Copy the structure for a new deck.</p>${sampleHtml || '<p class="intro">No sample yet.</p>'}</section>
${decks.length ? `<section id="decks"><h2>Your deck</h2><p class="intro">The slides in src/slides/, in presentation order. Click one to open it in the app (npm run dev).</p>${deckHtml}</section>` : ''}
</main></div>
<script>
document.querySelectorAll('.card').forEach(card=>card.addEventListener('click',e=>{const b=e.target.closest('.variants button');if(!b)return;card.querySelector('[data-main]').src='shots/'+b.dataset.id+'.jpg';card.querySelector('.main').href='${linkBase}/?path=/story/'+b.dataset.id;card.querySelector('.sb').href='${linkBase}/?path=/story/'+b.dataset.id;card.querySelectorAll('.variants button').forEach(x=>x.classList.toggle('on',x===b))}));
document.getElementById('q').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.card').forEach(c=>c.classList.toggle('hidden',q&&!c.textContent.toLowerCase().includes(q)));document.querySelectorAll('main section').forEach(s=>{if(s.id==='decks'||s.id==='samples')return;s.classList.toggle('hidden',q&&![...s.querySelectorAll('.card')].some(c=>!c.classList.contains('hidden')))})});
const links=[...document.querySelectorAll('nav a')];new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))})},{rootMargin:'-20% 0px -70% 0px'}).observe&&document.querySelectorAll('main section').forEach(s=>new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))})},{rootMargin:'-20% 0px -70% 0px'}).observe(s));
</script></body></html>`
writeFileSync(path.join(OUT, 'index.html'), html)
copyFileSync(path.join(ROOT, 'public/assets/shared/vinta-wordmark-blue.svg'), path.join(OUT, 'vinta-wordmark-blue.svg'))
console.log(`Gallery: gallery/index.html (${total} templates, ${all.length} shots, ${deckSlides.length} deck slides${unlisted.length ? `, ${unlisted.length} UNCATEGORIZED: ${unlisted.map((t) => t.slice(9)).join(', ')}` : ''})`)

// 5. Serve.
if (serve) {
  const MIME = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
  createServer((req, res) => {
    const file = path.join(OUT, decodeURIComponent(new URL(req.url, 'http://x').pathname.replace(/\/$/, '/index.html')))
    if (!file.startsWith(OUT) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end() }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  }).listen(PORT, () => {
    console.log(`Serving http://localhost:${PORT} (Ctrl+C to stop)`)
    if (process.platform === 'darwin') exec(`open http://localhost:${PORT}`)
  })
}
