# Vinta Slidedeck — instructions for AI agents

`CLAUDE.md` is a symlink to this file: edit only `AGENTS.md`.

Design system for Vinta's presentations (sales, planning, partnerships, internal reviews) as a React slide deck.
Slides are **1920×1080**, React + CSS Modules, written as markdown (`.md`) or `.tsx` files in `src/slides/` and shown
at `/` by `npm run dev` (port 5173). Patterns are documented in Storybook (`npm run storybook`, port 6006; internal)
and shown to the team in the template gallery (`npm run gallery`, port 6007, generated from Storybook and the §3
catalog). Final destination: the deck becomes a **Claude artifact** (a self-contained, navigable HTML file) built by
the user's own Claude Code from this repo (`npm run build-deck`, §2.6). Do not run git/push/GitHub or publish an
artifact without an explicit request from the user (a yes to the sample offer in §2.7 counts as one).

**One repository per deck.** Each deck is its own copy of the template repository `vintasoftware/vinta-slidedeck`
(GitHub's "Use this template"). If the git remote is the template itself, don't build a client deck here: ask the
user to create a repository from the template first, unless they are only trying things out or improving the
template.

**Language:** always talk to the user in **Brazilian Portuguese (pt-BR)**: questions, summaries, status updates,
errors. Everything written to the repo stays in **English**: code, comments, docs, commit messages, story names.
Slide copy is the user's choice: **English or Portuguese**, whichever they ask for; if the brief doesn't say, ask.
Portuguese runs longer than English, so check the §8 text limits after writing it.

**Working style: be opportunistic, ask early, write less.**
- **Move with what you have.** Reuse what exists (patterns, `src/samples/` examples, client logos in
  `src/components/elements/Logo/clients.ts`) and fill gaps with clearly fictitious placeholders instead of blocking
  on them.
- **Ask only questions whose answers change the work**, and ask them *before* writing: deck language, section
  sequence, item counts in Figma patterns, anything that would force a rewrite. Batch them in one round, give
  options with a recommended default (use the question tool when available), and skip what you can infer.
- **Confirm cheaply before building.** Propose the slide outline (one line per slide: pattern + gist) and get an OK
  before writing the slides. Fix only what fails; don't regenerate whole slides or decks.
- **Write less.** Short status updates, no recaps of what the user already said, no new docs or files nobody asked for.

**To build a deck, read this file plus `src/components/CATALOG.md`** (rules, catalog, elements and limits: §1, §3–§8
below point into it), `MARKDOWN.md` (how a `.md` slide fills a pattern) and the examples in `src/samples/` and in each
pattern's stories. `AUTHORING.md` covers `.tsx` and bespoke slides. `docs/foundations.md` (tokens) and
`docs/layout.md` (anatomy) are reference: consult them when you need a value or a measurement.

---

## 1. Rules that never change

The ten rules are in **`src/components/CATALOG.md` → "Rules that never change"**: fonts (DM Sans/DM Mono only),
icons (Lucide, `strokeWidth={1.5}`), color in 3 tiers with one accent per slide, never invent a value (tokens only,
from `src/components/tokens.css`), color by semantic role, text scale and composition, ≤ ~3 blocks per slide,
**always fictional data and never PHI**, tokens → elements → patterns, and Figma copy = exact copy.

---

## 2. How to build a deck (recipe)

1. **Pick the pattern** from the §3 catalog. If a pattern covers the case, use it and only pass content. When two
   fit equally, pick the one markdown can fill.
2. **Generic slide** (Agenda, Content, TwoColumn, Quote, Team, Comparison, BigStat): takes `tone`. Every tone uses
   the site look; the tone only picks the background: `light`/`tint` → light wash, `invert-blue` → blue mesh,
   `invert-navy` → navy; `vivid` = the pattern's own default. Change the tone instead of touching color.
3. **Write the slide** as one file per slide in `src/slides/` (two-digit prefix = order; auto-discovered).
   **Markdown by default** (`NN-name.md`: frontmatter `template: <Pattern>`, the body fills it; mapping per pattern in
   `MARKDOWN.md`). Use `.tsx` only when markdown can't express the slide (a component as a prop, such as Lucide
   icons or a `media` node; logic; a bespoke composition) and say in one line why. Speaker notes go in the closing
   `<!-- … -->` comment (`meta.notes` in `.tsx`).
4. **Slide without a pattern** (only when the user agrees none fits): compose inside
   `<SlideShell mode safeArea background={<VividBackground …/>}>` using only elements (§4), with `SlideHeader` for the
   header. Margins: `safeArea={144}` for text slides, `"hero"` (200) for covers/quotes, `"dense"` (64) for dense
   screens like Who is Vinta. Use `resolveTone` (`src/components/shared/slideTone.tsx`) to align shell mode, text
   mode and background. Never per-deck CSS; if you need something that does not exist, stop and tell the user (§1).
   Details in `AUTHORING.md`.
5. **Check:** `npx tsc -b` (checks `.tsx` slides). Look at every slide at native size,
   `http://localhost:5173/?shot=N` (or `?print` for all): no markdown "couldn't be rendered" card, no text
   overflowing its box, no dead space, no leftover starter or SAMPLE text.
6. **Deliver as an artifact.** Follow the `publish-deck` skill: `npm run build-deck -- --shots --name "<Deck>"`
   writes one self-contained HTML to `output/exports/<name>/` (slides scaled to the window, arrow/click navigation,
   embedded fonts and images, running animations), `text.txt` (each slide's words and links) to scan, and one
   preview PNG per slide to check. Get the user's OK, publish with Claude Code's artifact tool and hand over the
   link. To update an already published deck, run it again: it republishes to the same link.
7. **Offer an anonymized sample.** When the user is done with a deck, ask once whether they'd like to contribute an
   anonymized version to the sample presentations. Only with a yes: the sample goes to the template repository as
   `src/samples/<Name>.stories.tsx` (title `Samples/<Name>`), with every client name, logo, client image, person,
   contact, price, real number, date and internal project name replaced by fictional content (never PHI; team photos
   only per §8). Keep the structure and pattern choices, show the user what changed, then open a PR from a new branch
   off `main` with only the sample. Steps in the `create-deck` skill.

Typical sales deck sequence (site look): `SlideCover` → `SlideAgenda` → `SlideStoryStats` (who we are) →
`SlideIconCards` (what we heard) → `SlideVsTable` / `SlideServiceMenu` (why us, what we do) → `SlideStepPath` +
`SlideStepFocus` per phase (approach / timeline) → `SlideComparison` (investment) → `SlideCaseStudy` /
`SlideCaseHighlight` → `SlideFaq` → `SlideBookCall` (closing). `SlideStatement` opens sections. The Figma screens (§3,
"Classic") are for when the user asks for the original approved screens.

**Shortcuts:** the `create-deck` skill runs briefing → outline → slides → verification → artifact; `publish-deck`
builds, scans, publishes or updates a deck's artifact and hands over the link. `npm run export` writes an editable
PPTX and a PDF to `export/`. `npm run render-clip -- <story-id> --out <name>` records a story's animation as a looping
MP4 (or WebM with alpha) in `output/exports/clips/` for use outside the deck (Storybook running; needs `ffmpeg`); in
the artifact the animations already run live. Client images: `public/assets/clients/<client>/`. All commands are in
the README.

---

## 3. Pattern catalog

**`src/components/CATALOG.md` → "Pattern catalog"**: site look, planning deck, generic, vivid, vivid layouts and the
Figma "Classic" screens, each with when to use it, main props and limits. Every pattern renders at `/patterns`, and
its props are in Storybook's *Docs* tab.

## 4. Elements (the atomic base)

**`src/components/CATALOG.md` → "Elements (the atomic base)"**, all imported from `@/components`.

## 5. Creating a new element or pattern

**`src/components/CATALOG.md` → "Creating a new element or pattern"**. Stop and show the user before continuing when
a token is missing, you need an element that does not exist, or a pattern requires a Tier 3 color.

## 6. Importing from Figma (exact copy)

**`src/components/CATALOG.md` → "Importing from Figma (exact copy)"**.

## 7. Verification and maintenance

**`src/components/CATALOG.md` → "Verification and maintenance"**: clean `npx tsc -b`, `npm run build-storybook`,
`npm run test-storybook` and `npm run build` before calling anything done; rebuild the gallery after changing a
pattern or a sample; `npm run sync-harness` after changing a token.

## 8. Content and asset limits

**`src/components/CATALOG.md` → "Content and asset limits"**: Figma pattern slots, embedded SVG art, text limits
per slot and usable height. **Team photos** (`/assets/team/<key>.webp`) are real Vinta people: studio portraits are
for team slides only, and a team photo is **never** paired with a client's name (quotes, cases).
