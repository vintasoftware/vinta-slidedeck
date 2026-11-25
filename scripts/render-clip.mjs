// Records an animated Storybook story as a looping MP4 video (frame by frame, with virtual time),
// for use outside the deck (email, Google Slides, another tool) together with a cover image. In the deck,
// its build-deck artifact and the dev server the animations already run live.
// Prerequisites: `npm run storybook` running and `ffmpeg` installed (macOS: `brew install ffmpeg`).
// Story ids: the part after `?path=/story/` in Storybook's URL (e.g. patterns-slidebuildingblocks--animated).
//
// Usage: npm run render-clip -- <story-id> [options]
//   --out <name>         base name of the files (default: the story id)       → output/exports/clips/<name>.mp4 + <name>.png
//   --seconds <n>        loop duration (default 21)
//   --fps <n>            frames per second (default 30)
//   --fade <s>           crossfade that stitches the end onto the start (default 1.5; 0 = no stitch)
//   --args "a:1;b:!true" story args (Storybook syntax: booleans with !)
//   --selector "<css>"   records a single element (default: the whole 1920×1080 frame)
//   --width/--height     viewport (default 1920×1080)
//   --crf <n>            x264 quality (default 20; higher = smaller file)
//   --transparent        transparent background: records VP9 WebM with alpha (instead of opaque MP4) and a PNG cover with alpha
//   --skip <s>           advances the clock before recording (skips the intro; to start at the beginning of a cycle)
//   --pad <px>           margin around the --selector (to include the shadow; default 0)
// Ex.: npm run render-clip -- patterns-slidebuildingblocks--animated --out building-blocks-field --args "countUp:!false"
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const argv = process.argv.slice(2)
const id = argv[0]
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : fallback
}
if (!id || id.startsWith('--')) {
  console.error('Usage: npm run render-clip -- <story-id> [--out name] [--seconds 21] [--fps 30] [--fade 1.5] [--args "a:1"] [--selector css]')
  process.exit(1)
}
if (spawnSync('ffmpeg', ['-version']).error) {
  console.error('ffmpeg is not installed (macOS: brew install ffmpeg). render-clip needs it to encode the video.')
  process.exit(1)
}
const BASE = process.env.STORYBOOK_URL ?? 'http://localhost:6006'
const out = opt('out', id)
const seconds = Number(opt('seconds', 21))
const fps = Number(opt('fps', 30))
const fade = Number(opt('fade', 1.5))
const crf = opt('crf', '20')
const width = Number(opt('width', 1920))
const height = Number(opt('height', 1080))
const storyArgs = opt('args', '')
const selector = opt('selector', '')
const transparent = argv.includes('--transparent')
const pad = Number(opt('pad', 0))
const skip = Number(opt('skip', 0))

const dir = `output/exports/clips/${out}-frames`
const finalWebm = `output/exports/clips/${out}.webm`
const final = `output/exports/clips/${out}.mp4`
mkdirSync(dir, { recursive: true })

const ok = await fetch(`${BASE}/index.json`).catch(() => null)
if (!ok?.ok) {
  console.error(`Storybook is not responding on ${BASE}. Run "npm run storybook" first.`)
  process.exit(1)
}

const total = Math.round((seconds + fade) * fps)
const step = 1000 / fps
const padN = String(total).length
const withTimeout = (promise, ms, what) => Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error(`hung on: ${what}`)), ms))])

// A browser session records from frame `from`. If it hangs (happens with virtual time), the session
// is discarded and a new one resumes from the last saved frame, advancing the clock back to it.
async function session(from) {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    // rAF follows the virtual clock (the browser's runs slower while time is paused)
    await page.addInitScript(() => { window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); window.cancelAnimationFrame = (id) => clearTimeout(id) })
    const url = `${BASE}/iframe.html?id=${id}&viewMode=story${storyArgs ? `&args=${encodeURIComponent(storyArgs)}` : ''}`
    await page.goto(url)
    await page.waitForSelector('#storybook-root *')
    await page.evaluate(() => document.fonts.ready)
    if (transparent) await page.addStyleTag({ content: 'html,body,#storybook-root{background:transparent!important}' })

    // Virtual time: the page clock only moves as much as we tell it (timers, rAF, Date, CSS animations).
    const cdp = await page.context().newCDPSession(page)
    if (transparent) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })
    await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pause' })
    const advance = (ms) =>
      withTimeout(new Promise((resolve) => {
        cdp.once('Emulation.virtualTimeBudgetExpired', resolve)
        cdp.send('Emulation.setVirtualTimePolicy', { policy: 'advance', budget: ms })
      }), 20000, 'clock advance')

    const lead = (skip + from / fps) * 1000
    for (let t = 0; t < lead; t += 500) {
      // renders a light frame at each step so observers (IntersectionObserver) keep moving
      await withTimeout(cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 5, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 0.05 } }), 20000, 'light capture')
      await advance(Math.min(500, lead - t))
    }
    const target = selector ? page.locator(selector).first() : null
    for (let i = from; i < total; i++) {
      const file = `${dir}/f${String(i).padStart(padN, '0')}.png`
      // direct capture through CDP: Playwright's screenshot waits for fonts/timers and hangs with time paused
      const clip = target ? await withTimeout(target.evaluate((el, pd) => { const r = el.getBoundingClientRect(); const x = Math.max(0, r.x - pd), y = Math.max(0, r.y - pd); return { x, y, width: Math.min(innerWidth - x, r.width + 2 * pd), height: Math.min(innerHeight - y, r.height + 2 * pd), scale: 1 } }, pad), 20000, 'element measurement') : undefined
      const shot = await withTimeout(cdp.send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) }), 20000, 'frame capture')
      writeFileSync(file, Buffer.from(shot.data, 'base64'))
      await advance(step)
      if (i % 60 === 0) process.stdout.write(`\rframes ${i}/${total}`)
    }
    return total
  } finally {
    await browser.close().catch(() => {})
  }
}

let next = 0
for (let attempt = 0; attempt < 12 && next < total; attempt++) {
  try {
    next = await session(next)
  } catch (e) {
    let n = 0
    while (existsSync(`${dir}/f${String(n).padStart(padN, '0')}.png`)) n++
    next = Math.max(0, n - 1)
    process.stdout.write(`\n${e.message}; restarting from frame ${next}\n`)
  }
}
if (next < total) { console.error('could not record all frames'); process.exit(1) }
process.stdout.write(`\rframes ${total}/${total}\n`)

const run = (args) =>
  new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' })
    p.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${c}`))))
  })

const frames = `${dir}/f%0${padN}d.png`
// loop stitch: the last stretch (fade s) dissolves over the start. With alpha, the filter works in rgba.
const px = (transparent ? 'format=rgba,' : '') + 'crop=trunc(iw/2)*2:trunc(ih/2)*2,'
const loopGraph = (() => {
  const main = Math.round(seconds * fps)
  const f = Math.round(fade * fps)
  return (
    `[0:v]${px}split=2[a][b];[a]trim=start_frame=0:end_frame=${main},setpts=PTS-STARTPTS[head];[b]trim=start_frame=${main},setpts=PTS-STARTPTS[tail];` +
    `[head]split=2[h1][h2];[h1]trim=start_frame=0:end_frame=${f},setpts=PTS-STARTPTS[intro];[h2]trim=start_frame=${f},setpts=PTS-STARTPTS[rest];` +
    `[tail][intro]xfade=transition=fade:duration=${fade}:offset=0[blend];[blend][rest]concat=n=2:v=1:a=0[v]`
  )
})()
const mp4Enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const webmEnc = ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', crf, '-auto-alt-ref', '0']
const encode = async (enc, file) => {
  if (fade > 0) await run(['-framerate', String(fps), '-i', frames, '-filter_complex', loopGraph, '-map', '[v]', '-r', String(fps), ...enc, file])
  else await run(['-framerate', String(fps), '-i', frames, '-vf', `${transparent ? 'format=rgba,' : ''}crop=trunc(iw/2)*2:trunc(ih/2)*2`, ...enc, file])
}
// with alpha only the WebM (MP4 does not keep transparency); without alpha only the MP4
if (transparent) await encode(webmEnc, finalWebm)
else await encode(mp4Enc, final)
const primary = transparent ? finalWebm : final
// cover: the first frame (with alpha when --transparent; libvpx decodes the WebM alpha, the native VP9 decoder drops it)
await run([...(transparent ? ['-c:v', 'libvpx-vp9'] : []), '-i', primary, '-frames:v', '1', ...(transparent ? ['-c:v', 'png'] : []), `output/exports/clips/${out}.png`])
rmSync(dir, { recursive: true, force: true })
const mb = (statSync(primary).size / 1048576).toFixed(1)
console.log(`✔ ${primary} (${mb} MB, ${seconds}s at ${fps}fps${transparent ? ', with alpha' : ''}) and output/exports/clips/${out}.png`)
if (Number(mb) > 20) console.warn('⚠ over 20 MB: Slides rejects it. Raise --crf (e.g. 26) or lower --seconds.')
if (!existsSync(primary)) process.exit(1)
