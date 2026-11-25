// Regenerates the "Token reference" in docs/foundations.md from src/components/tokens.css. Ported from vinta-slidedeck-deprecated;
// the tokens here are scoped to `.vds` instead of :root (see src/index.css).
// Usage: npm run sync-harness   (only touches the block between the markers)
import { readFileSync, writeFileSync } from 'node:fs'

const TOKENS = 'src/components/tokens.css'
const css = readFileSync(TOKENS, 'utf8')
const open = css.indexOf('\n.vds {')
if (open < 0) throw new Error(`.vds { … } block not found in ${TOKENS}`)
const root = css.slice(open, css.indexOf('\n}\n', open))

const sections = [
  { key: 'TIER 1', title: 'Tier 1 · Primary' },
  { key: 'TIER 2', title: 'Tier 2 · Secondary' },
  { key: 'TIER 3', title: 'Tier 3 · Tertiary' },
  { key: 'NON-COLOR', title: 'Non-color (radius, shadow, spacing, grid, typography)' },
]
const marks = sections.map((s) => root.indexOf(s.key + ' —'))
const out = []
sections.forEach((s, i) => {
  const start = marks[i]
  if (start < 0) return
  const end = marks.slice(i + 1).find((m) => m > start) ?? root.length
  const body = root.slice(start, end)
  const rows = []
  for (const m of body.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);(?:\s*\/\*\s*(.*?)\s*\*\/)?/gm)) {
    rows.push(`| \`${m[1]}\` | \`${m[2].trim()}\` | ${(m[3] ?? '').replace(/\|/g, '/')} |`)
  }
  out.push(`### ${s.title} (${rows.length})\n\n| Token | Value | Usage |\n|---|---|---|\n${rows.join('\n')}\n`)
})

const stamp = new Date().toISOString().slice(0, 10)
const block = `<!-- tokens:start -->\n_Generated from \`${TOKENS}\` on ${stamp} by \`npm run sync-harness\`. Do not edit by hand._\n\n${out.join('\n')}<!-- tokens:end -->`
const harness = readFileSync('docs/foundations.md', 'utf8')
const re = /<!-- tokens:start -->[\s\S]*?<!-- tokens:end -->/
if (!re.test(harness)) throw new Error('tokens:start/end markers not found in docs/foundations.md')
writeFileSync('docs/foundations.md', harness.replace(re, block))
console.log('docs/foundations.md updated:', out.map((o) => o.split('\n')[0]).join(' · '))
