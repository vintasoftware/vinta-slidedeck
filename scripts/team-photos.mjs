// Team photos: an optimized library in the repo and the crops the slides use.
// The full-size originals (15–20 MB each) stay in the Drive folder "team-photos-originals".
//
//   npm run team-photos -- library <originals-dir>   originals (JPG) → assets/team-photos/<name>.webp (long side 2400, q82), duplicates skipped
//   npm run team-photos -- crops                     assets/team-photos/crops.json → public/assets/team/<key>.webp
//
// Options: --dry-run (print what would be written) · --force (rewrite files that already exist).
// Re-running is safe: existing outputs are kept unless --force.
// Needs `cwebp` (brew install webp) and macOS `sips` (reads image sizes).
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const LIBRARY = 'assets/team-photos'
const CROPS_OUT = 'public/assets/team'
const LONG_SIDE = 2400
const QUALITY = '82'

const argv = process.argv.slice(2)
const command = argv[0]
const dryRun = argv.includes('--dry-run')
const force = argv.includes('--force')

function run(bin, args) {
  if (dryRun) {
    console.log(`[dry-run] ${bin} ${args.join(' ')}`)
    return
  }
  execFileSync(bin, args, { stdio: ['ignore', 'ignore', 'inherit'] })
}

function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
  return {
    width: Number(out.match(/pixelWidth: (\d+)/)[1]),
    height: Number(out.match(/pixelHeight: (\d+)/)[1]),
  }
}

function library(dir) {
  if (!dir || !existsSync(dir)) {
    console.error('Usage: npm run team-photos -- library <originals-dir>')
    process.exit(1)
  }
  mkdirSync(LIBRARY, { recursive: true })
  const seen = new Map()
  const names = new Set()
  const files = readdirSync(dir)
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort()
  let written = 0
  for (const file of files) {
    const src = path.join(dir, file)
    const hash = createHash('sha1').update(readFileSync(src)).digest('hex')
    // "VINTA__13 (1).jpg" is a download copy of "VINTA__13.jpg"
    const base = file
      .replace(/\s*\(\d+\)(?=\.jpe?g$)/i, '')
      .replace(/\.jpe?g$/i, '')
      .replace(/\s+/g, '-')
    if (seen.has(hash)) {
      console.log(`skip ${file}: same file as ${seen.get(hash)}`)
      continue
    }
    seen.set(hash, file)
    // Two different photos can share a base name ("X.jpg" and "X (1).jpg"): number the second one.
    let name = base
    for (let n = 2; names.has(name); n++) name = `${base}-${n}`
    names.add(name)
    const out = path.join(LIBRARY, `${name}.webp`)
    if (existsSync(out) && !force) {
      console.log(`keep ${out}`)
      continue
    }
    const { width, height } = size(src)
    const resize = width >= height ? [String(Math.min(width, LONG_SIDE)), '0'] : ['0', String(Math.min(height, LONG_SIDE))]
    run('cwebp', ['-quiet', '-q', QUALITY, '-metadata', 'none', '-resize', ...resize, src, '-o', out])
    console.log(`${dryRun ? 'would write' : 'wrote'} ${out}`)
    written++
  }
  console.log(`${files.length} originals, ${seen.size} unique, ${written} written`)
}

// crops.json: { "<key>": { "source": "<library name without .webp>", "x": 0, "y": 0, "w": 1200, "h": 800,
//                          "slot": [W, H], "note": "what it shows" } }
// x/y/w/h are in library-image pixels; w/h must match the slot ratio. Output is the slot size × 2, capped at the crop size.
function crops() {
  const manifest = JSON.parse(readFileSync(path.join(LIBRARY, 'crops.json'), 'utf8'))
  mkdirSync(CROPS_OUT, { recursive: true })
  for (const [key, c] of Object.entries(manifest)) {
    const src = path.join(LIBRARY, `${c.source}.webp`)
    const out = path.join(CROPS_OUT, `${key}.webp`)
    if (!existsSync(src)) {
      console.error(`missing ${src} (run "library" first)`)
      process.exitCode = 1
      continue
    }
    if (existsSync(out) && !force) {
      console.log(`keep ${out}`)
      continue
    }
    const [slotW, slotH] = c.slot
    const scale = Math.min(2, c.w / slotW)
    const outW = Math.round(slotW * scale)
    const outH = Math.round(slotH * scale)
    run('cwebp', ['-quiet', '-q', QUALITY, '-metadata', 'none', '-crop', c.x, c.y, c.w, c.h, '-resize', outW, outH, src, '-o', out].map(String))
    console.log(`${dryRun ? 'would write' : 'wrote'} ${out} (${outW}×${outH})`)
  }
}

if (command === 'library') library(argv[1])
else if (command === 'crops') crops()
else {
  console.error('Usage: npm run team-photos -- library <originals-dir> | crops [--dry-run] [--force]')
  process.exit(1)
}
