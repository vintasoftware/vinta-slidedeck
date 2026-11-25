# Vinta Slidedeck — Harness v4

> **Ported from vinta-slidedeck-deprecated** as reference for the `@/components` patterns. In this repo the tokens live in
> `src/components/tokens.css`, the catalog and rules in `src/components/CATALOG.md`, and every pattern renders at
> `/patterns`. Mentions of Storybook, `CLAUDE.md` and `npm run` scripts (other than `build-deck`) refer to
> vinta-slidedeck-deprecated; this repo's team guide is `team-guide.md`, next to this file.

**What it is:** the foundation (rules + tokens) of the sales-deck design system.
Source of truth — Claude follows this; Figma reflects this.

**Where it came from:** extracted from the screens on the *Auditoria Business Proposal* page (VWDS.fig),
read with Claude. Not inherited from the website; VWDS is only a sensory reference.
**Companions:** `layout.md` (slide anatomy) · `../CLAUDE.md` (how to build) ·
`team-guide.md` (team usage). The full token reference is in §8 and is generated from code.

**Core rule:** richness is intentional. Keep the range of the screens; cut only duplicates and
freestyle leftovers. A value not listed here is not invented — it becomes a token or stays out.

**Palette in 3 tiers** (decision 2026-10-29):
- **Tier 1 · Primary** — deck structure: blue ramp, neutrals, surfaces, status, white.
- **Tier 2 · Secondary** — supporting accents (cyan/purple/mint/rose/orange + pairs and tints). Specific moments, one per item.
- **Tier 3 · Tertiary** — exact Figma values with no match in the DS. They live inside the element/pattern they came from; never in new content.
- **Snap rule:** a color within **ΔE 3** of a Tier 1/2 token uses the existing token and does not become tertiary.
  This keeps the primaries from getting messy.

**Scope:** every Vinta presentation (sales, planning, partnerships, internal reviews), generated in Claude.

> **Harness layers** (why v1 felt shallow): 1) primitives · 2) semantics + modes ·
> 3) layout/grid · 4) typography by role · 5) image & icon · 6) component anatomy · 7) guardrails.

---

## 1. Primitives

### 1.1 Color — blue ramp (primary)
`050 #f1f6ff` · `100 #e5ecf6` · `300 #5fb7ff` · `400 #3083ff` · `500 #0d8cfe` ·
`600 #0050ff` ← Vinta primary/brand · `700 #005acf` · `800 #0026ff` · `900 #0d2645` · `white #ffffff`

### 1.2 SECONDARY accents — Tier 2 (the richness the website lacks)
Use in specific moments, never as the main color. The main color is blue #0050ff.
- `accent-cyan` #02effe
- `accent-purple` #6146c7 · light #dabcff
- `accent-mint` #a2e6d8 · dark #2a594c
- `accent-rose` #f7cacf · dark #592a35
- `accent-orange` #F26A1C · light #fdb58f

### Status (semantic)
- `status-success` #1e9f74 · surface `#adeadc` (mint-light)
- `status-danger` #c23535 · surface `#f7cacf` (rose-light)

### 1.3 Neutrals / slate
`ink #050508` · `slate-700 #2a4059` · `slate-500 #4c5564` · `slate-400 #5b738d` · `border #cdd8e5`

### 1.4 Surfaces (real, by mode)
- **Light:** `surface-page #ffffff` · `surface-soft #fafcff` · `surface-tint #f1f6ff` · `surface-mist #edf6fd` · `surface-gray #f8f8f8`
- **Inverted:** `surface-invert-blue #0058e9` (alt #2c63f1) · `surface-invert-navy #1e304c`

### 1.4b Status (semantic — outside the accent palette)
- `status-success` #1e9f74  (e.g.: Coverage / check icon)
- `status-danger`  #c23535  (e.g.: Exclusions / x icon)
> Use only for state/semantics (positive/negative). Do not confuse with accents.

### 1.4c Tertiary — Tier 3
~30 exact values required by the screens copied from Figma (phase titles, solid cards, gradients, text
shades in cards). Full list and the use of each one in §8. Rules: only inside the source pattern/element;
never for new content; do not promote to primary without a team decision.
On 2026-10-29, 10 tokens and 17 loose hex values within ΔE<3 of an existing token were snapped to it
(e.g.: `ink-navy`→`blue-900`, `slate-note`→`slate-400`, `accent-mint-soft`→`accent-mint`).

### 1.5 Radius (real)
`none 0` · `sm 13` · `md 24` · `lg 36` · `pill 9999`

### 1.6 Shadow (real — soft, low alpha, high blur)
`sm 0 6px 24px rgba(5,5,8,.04)` · `md 0 9px 36px rgba(5,5,8,.06)` · `lg 0 15px 48px rgba(5,5,8,.08)`

### 1.7 Spacing (real)
`space` 6 · 14 · 24 · 40  (dominant gap = 14). Real component paddings: tag 6×17, card 13×25, block 27.

---

## 2. Semantics + modes  *(what stops Claude from hallucinating)*

24 screens: **17 light, 7 inverted**. Slides are light by default; covers and dividers use invert.

| Role | Light mode | Inverted mode |
|---|---|---|
| text-primary | ink #050508 / #0d2645 | #ffffff |
| text-secondary | slate-500 #4c5564 | #fafcff |
| text-muted | slate-400 #5b738d | rgba(255,255,255,.7) |
| text-accent | blue-600 #0050ff | cyan #02effe |
| surface | #ffffff / #f1f6ff | #0058e9 / #1e304c |
| border | #cdd8e5 | rgba(255,255,255,.16) |

Contrast: ink/slate on light, white on invert (target AA — the deck goes on a projector).
**Accent (cyan) is a detail/marker — never text on a light background or on blue (no contrast). As text, only on dark navy. Text emphasis on a colored surface = white.**

---

## 3. Slide grid

Frame **1920×1080**. Margins by slide type (`safeArea` prop of `SlideShell`):
- `"dense"` **64px** — dense screens (Who is Vinta, Client case).
- **144px** — generic text slides (recurring harness range: 144–165).
- `"hero"` **200px** — covers, dividers, quote.
- Covers/dividers can go **full-bleed**. Base gap 14 (`space-2`); larger blocks 24/40.

---

## 4. Typography by role — DM Sans + DM Mono
**Decision (Farias):** Moderat leaves the deck (stays on the website only). Official font = **DM Sans** (Google Font, zero install pain). Mono = **DM Mono**.
Migrate the strays: **Roboto → DM Sans** (same sizes) · **JetBrains Mono → DM Mono** · **Inter → remove**.

| Role | Font · size / line-height / tracking |
|---|---|
| stat-mega | DM Sans Regular 206 / solid |
| display | DM Sans (thin weight) 120 / auto / −2.2% |
| h1 | DM Sans Light 60 — default content-slide title (`DisplayTitle scale="h1"`) |
| h2 | DM Sans Bold 50 / 60 / −0.8px |
| h4 | DM Sans Medium 30 / 40 |
| subtitle | DM Sans Regular·Light 22–28 / 30 |
| body | DM Sans Regular 20 (migrated from Roboto) |
| caption/label | DM Sans Bold 18 / 26 / +0.6px |
| overline | DM Sans Bold 30 / +2.9px (tracked) |
| quote | DM Sans Italic 22 (quote); on a quote slide the text uses the h1 scale (60) in italic |
| mono-xl | DM Mono 500 · 57 / 61 |
| mono-md | DM Mono Medium 24–27 / solid |
| mono-label | DM Mono Regular 18 / +3% |

> Mono (DM Mono) is a deck signature (set solid), not decoration. Moderat and Spectral stay on the website.

---

## 5. Image & icon

- **Real aspect ratios:** 16:9 (default), 1:1 (avatar/logo), 2:3 (portrait / client-case).
- **Text over photo:** apply a scrim/tint for legibility. Placeholder = surface-mist.
- **Icons:** 4 sets already exist in the screens (Medical, Tech, AI Web, General) in navy #1e304c, white color.
  Standardize on 1 library, 24×24 grid. Status colors seen: green #1e9f74, red #c23535.

---

## 6. Components (where the screens proved reuse)
Build our own by copying (never link the website's). Each one with **variants + states**.
Full inventory and props: `CLAUDE.md` §3–4 and the *Docs* tab of each story in Storybook.

- **Divider** — 4 schemes (light / invert-blue / invert-navy)
- **Stat / KPI** — mono-xl number + label
- **Timeline** (Alt 01/02/03) + **Journey** (single / overall): PhaseHeader, TimelineBar, StepCard, StepRail, JourneyStep
- **Cards:** IconCard, TagCard, InsightCard, ArtCard, PricingCard, CoverageCard, PersonCard, ContactCard
- **Text and lists (v4):** Body, BulletList, NumberedRow, Quote, DataTable
- **Client-case**, **Logo strip**, **Slide-shell** (light / tint / invert-blue / invert-navy tone + safe-area)
- **Generic patterns (v4):** SlideAgenda, SlideContent, SlideTwoColumn, SlideQuote, SlideTeam, SlideComparison, SlideBigStat

A whole slide reusable as a unit → **template** ("use these"), not DS.
Rule: simplify heavy construction, **keeping the look**.

---

## 7. Guardrails (for Claude)
- Never invent a font, color or icon. When in doubt, use a token; if one is missing, ask.
- Only DM Sans + DM Mono. Color only from the ramps/accents. Icons only from the library.
- Tiers: primitive → semantic → component. Always choose by semantic role, not by raw hex.
- Content limit per slide (anti-wall-of-text): title + up to ~3 blocks; lists ≤ 5 items; tables ≤ 4×6.
- Color: Tier 1 first, Tier 2 in specific moments, Tier 3 never in new content. A color close (ΔE<3) to an existing token uses the token.
- Sample data always fictional; never PHI.

---

## Decisions
- ✅ **Pipeline:** code-first — generate the components directly in Storybook (Farias).
- ✅ **Font:** DM Sans + DM Mono (Moderat stays on the website).
- ✅ **Primary / brand color:** `#0050ff` (Vinta main blue) — the deck's default highlight color.
- ✅ **Secondary accents:** cyan / purple / mint / rose / orange (#F26A1C) — same usage, only in specific moments.
- ✅ **Status:** success #1e9f74 · danger #c23535 (semantic, outside the accents).
- ✅ **Icons:** Lucide, stroke 1.5, 24px.

- ✅ **Color in 3 tiers + ΔE<3 rule** (2026-10-29): exact Figma variations go in as tertiary; very close colors use the existing token.
- ✅ **Generic patterns** (2026-10-29): Agenda, Content, TwoColumn, Quote, Team, Comparison, BigStat, with `tone` (light/tint/invert-blue/invert-navy).
- ✅ **Delivery as a Claude artifact** (2026-11-18): Claude Design left the flow. The user's Claude Code builds the deck in this repo and publishes the HTML from `npm run build-deck` as an artifact.
- ⏳ **Git / GitHub:** only after the deck-generation test and explicit approval.

---

## 8. Token reference

<!-- tokens:start -->
_Generated from `src/components/tokens.css` on 2026-11-19 by `npm run sync-harness`. Do not edit by hand._

### Tier 1 · Primary (26)

| Token | Value | Usage |
|---|---|---|
| `--blue-050` | `#f1f6ff` |  |
| `--blue-100` | `#e5ecf6` |  |
| `--blue-300` | `#5fb7ff` |  |
| `--blue-400` | `#3083ff` |  |
| `--blue-500` | `#0d8cfe` |  |
| `--blue-600` | `#0050ff` | Vinta primary/brand |
| `--blue-700` | `#005acf` |  |
| `--blue-800` | `#0026ff` |  |
| `--blue-900` | `#0d2645` |  |
| `--white` | `#ffffff` | text/icon on dark or colored background |
| `--status-success` | `#1e9f74` |  |
| `--status-danger` | `#c23535` |  |
| `--ink` | `#050508` |  |
| `--slate-700` | `#2a4059` |  |
| `--slate-500` | `#4c5564` |  |
| `--slate-400` | `#5b738d` |  |
| `--border-color` | `#cdd8e5` |  |
| `--surface-page` | `#ffffff` |  |
| `--surface-soft` | `#fafcff` |  |
| `--surface-tint` | `#f1f6ff` |  |
| `--surface-mist` | `#edf6fd` |  |
| `--surface-gray` | `#f8f8f8` |  |
| `--surface-invert-blue` | `#0058e9` |  |
| `--surface-invert-blue-alt` | `#2c63f1` |  |
| `--surface-invert-navy` | `#1e304c` |  |
| `--surface-footer` | `#f5f8ff` |  |

### Tier 2 · Secondary (32)

| Token | Value | Usage |
|---|---|---|
| `--accent-cyan` | `#02effe` |  |
| `--accent-purple` | `#6146c7` |  |
| `--accent-purple-light` | `#dabcff` |  |
| `--accent-mint` | `#a2e6d8` |  |
| `--accent-mint-dark` | `#2a594c` |  |
| `--accent-rose` | `#f7cacf` |  |
| `--accent-rose-dark` | `#592a35` |  |
| `--accent-orange` | `#f26a1c` |  |
| `--accent-orange-light` | `#fdb58f` |  |
| `--tint-purple` | `#f5ecff` |  |
| `--tint-mint` | `#ecfff4` |  |
| `--tint-blue` | `#ecf7ff` |  |
| `--vivid-blue` | `#005ff8` | blue mesh background base |
| `--vivid-feature-blue` | `#186dff` | highlight word in title (light background) |
| `--vivid-indigo` | `#000ab7` | dark corners of the blue mesh |
| `--vivid-navy` | `#071a5c` | dark base (block field), chips |
| `--vivid-ink` | `#050842` | title on light "vivid" background |
| `--vivid-azure` | `#3095ff` | blue glow |
| `--vivid-sky` | `#55bcff` | light glow / icon on blue |
| `--vivid-turquoise` | `#7fe6f5` | highlight word on blue |
| `--vivid-aqua` | `#b1fffd` | light blob |
| `--vivid-teal-deep` | `#0a7d99` | teal panel (base) |
| `--vivid-teal-bright` | `#13a9c8` | teal panel (shine) |
| `--vivid-teal-night` | `#04334a` | teal panel (dark corner) |
| `--vivid-teal-glow` | `#c2eef6` | teal panel (light) and end of the counter gradient |
| `--vivid-violet-deep` | `#4741d9` | violet panel (base) |
| `--vivid-violet-mid` | `#9051dd` | violet panel (middle) |
| `--vivid-violet-glow` | `#f3b8f2` | violet panel (light) |
| `--vivid-wash-light` | `#f3fbff` | light background with flavor (start) |
| `--vivid-wash-cyan` | `#dcf2fc` | light background with flavor (cyan blob) |
| `--vivid-wash-lilac` | `#e8ecfd` | light background with flavor (lilac blob) |
| `--vivid-highlight` | `#c0f0ff` | highlighted row/card on light background |

### Tier 3 · Tertiary (58)

| Token | Value | Usage |
|---|---|---|
| `--accent-purple-vivid` | `#9452ff` | phase title (Journey / Single Step) |
| `--accent-indigo` | `#5432ff` | solid "Integrations" card |
| `--accent-lilac` | `#d5d4ff` | soft "Nice-to-have" card |
| `--accent-purple-deep` | `#5919ba` | label/dot of the lilac card |
| `--accent-blue-bright` | `#0099ff` | solid "Must-have" card |
| `--accent-blue-navy-text` | `#00409d` | pill text on blue card |
| `--accent-orange-sand` | `#e09f59` | orange section bar |
| `--accent-orange-heading` | `#d78e49` | concern card title |
| `--ink-card` | `#1e3354` | main phrase in card |
| `--slate-heading` | `#3a506b` | secondary label/phrase |
| `--slate-caption` | `#7a8fab` | subtle note in card |
| `--accent-blue-card-text` | `#287dde` | mono title of What we heard cards |
| `--ink-blue-soft` | `#3c6696` | description of What we heard cards |
| `--accent-mint-vivid` | `#44b99c` | phase 02 title (Timeline) |
| `--accent-blue-light` | `#9ebdff` | Timeline blue bar (used at 85%) |
| `--ink-soft` | `#303030` | Timeline phase/week labels |
| `--accent-teal` | `#32b7a2` | rail step 01 (Timeline Alt 02) |
| `--accent-aqua` | `#13b8c9` | rail step 02 |
| `--blue-deep` | `#0047b8` | rail step 05 / gradient end |
| `--accent-blue-gradient-start` | `#4a76fb` | gradient start of the featured plan |
| `--ink-table-value` | `#1c3353` | pricing row values |
| `--border-card-concern` | `#d6e2f0` |  |
| `--card-shadow-ink` | `30, 90, 168` | rgb of the card shadow blue (use in rgba()) |
| `--blue-logo` | `#115ae5` | Vinta wordmark blue and ContactCard links |
| `--accent-lilac-chip` | `#decdf1` | TagCard lilac chip |
| `--accent-blue-section-dark` | `#1e5aa8` | blue section bar (gradient start) |
| `--accent-blue-section-light` | `#4a8fe7` | blue section bar (gradient end) |
| `--accent-blue-section-bright` | `#006eff` | section bar dot |
| `--slate-contact` | `#4c6691` | role in ContactCard |
| `--blue-contact-ink` | `#1e4991` | name in ContactCard |
| `--tint-mint-soft` | `#e8f5f2` | stage 01 background (Alt 03) |
| `--tint-blue-soft` | `#e0edfd` | stage 02 background (Alt 03) |
| `--accent-teal-label` | `#1c8b78` | "01 · VALIDATE" label |
| `--slate-label-gray` | `#8c96a0` | UNKNOWNS / ROUGH ESTIMATE labels |
| `--accent-track-start` | `#89d3c9` | confidence track gradient start |
| `--accent-track-end` | `#7aacfb` | confidence track gradient end |
| `--accent-orange-amber` | `#f5871f` | milestone divider and label |
| `--accent-orange-coral` | `#ff8052` | phase 01 title (Journey / Overall) |
| `--accent-emerald` | `#2bb986` | phase 02 title (Journey / Overall) |
| `--accent-violet-electric` | `#5e00ff` | phase 04 title (Journey / Overall) |
| `--ink-violet-deep` | `#2e1890` | phase 04 label (Journey / Overall) |
| `--field-turquoise` | `#7fe6f5` | "patient" cubes/chip, 50+ counter |
| `--field-teal-glow` | `#c2eef6` | counter gradient end |
| `--field-sky` | `#55bcff` | "practice" cubes (mixed with white) |
| `--field-azure` | `#3095ff` | background glow |
| `--field-blue` | `#005ff8` | section background base |
| `--field-indigo` | `#000ab7` | cube face shadows and background blobs |
| `--field-navy` | `#071a5c` | dark field base, chips, filter pill |
| `--field-ink` | `#050842` | text on the white/turquoise pill |
| `--field-aqua` | `#b1fffd` | light blob in the background corner |
| `--vivid-mesh-top` | `#0b45e6` | top-left of the blue mesh background |
| `--vivid-night-top` | `#0a2a9c` | top of the night background |
| `--glass-green-top` | `#2f7560` | SlideGlassRows green background (start) |
| `--glass-green-bottom` | `#1f5a49` | SlideGlassRows green background (end) |
| `--glass-purple-top` | `#6038b0` | SlideGlassRows purple background (start) |
| `--glass-purple-bottom` | `#46288a` | SlideGlassRows purple background (end) |
| `--tint-peach` | `#fff1e8` | IconBadge pale tile, orange accent |
| `--accent-green-ink` | `#1e7f68` | IconBadge pale/white tile icon, mint accent |

### Non-color (radius, shadow, spacing, grid, typography) (77)

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | `0px` |  |
| `--radius-sm` | `13px` |  |
| `--radius-md` | `24px` |  |
| `--radius-lg` | `36px` |  |
| `--radius-pill` | `9999px` |  |
| `--shadow-sm` | `0 6px 24px rgba(5, 5, 8, 0.04)` |  |
| `--shadow-md` | `0 9px 36px rgba(5, 5, 8, 0.06)` |  |
| `--shadow-lg` | `0 15px 48px rgba(5, 5, 8, 0.08)` |  |
| `--space-1` | `6px` |  |
| `--space-2` | `14px` |  |
| `--space-3` | `24px` |  |
| `--space-4` | `40px` | slide composition: header → content (stacked) and between side-by-side columns |
| `--gap-header` | `56px` |  |
| `--gap-columns` | `96px` | real component paddings, quoted literally in the harness (not a scale) |
| `--padding-tag-y` | `6px` |  |
| `--padding-tag-x` | `17px` |  |
| `--padding-card-y` | `13px` |  |
| `--padding-card-x` | `25px` |  |
| `--padding-block` | `27px` |  |
| `--slide-width` | `1920px` |  |
| `--slide-height` | `1080px` |  |
| `--slide-safe-area` | `160px` | larger hero/Divider margin — layout.md §"Global layout rules" |
| `--slide-safe-area-hero` | `200px` |  |
| `--chip-invert-bg` | `#d2e7ff` |  |
| `--scheme-01-pill-text` | `#0d1f79` |  |
| `--scheme-02-bg` | `#fbfdff` |  |
| `--scheme-02-title` | `#478dff` |  |
| `--scheme-03-title` | `#0059e9` |  |
| `--font-sans` | `'DM Sans', sans-serif` |  |
| `--font-mono` | `'DM Mono', monospace` | stat-mega — DM Sans Regular 206 / solid |
| `--font-size-stat-mega` | `206px` |  |
| `--font-weight-stat-mega` | `400` |  |
| `--line-height-stat-mega` | `1` | "solid" |
| `--font-size-stat-hero` | `300px` | display — DM Sans (thin weight) 120 / auto / -2.2% |
| `--font-size-display` | `120px` |  |
| `--font-weight-display` | `300` | thin weight |
| `--line-height-display` | `normal` | "auto" |
| `--tracking-display` | `-2.2%` |  |
| `--font-size-display-cover` | `150px` | h1 — DM Sans Thin·Light 60 (lh/tracking unspecified in the harness) |
| `--font-size-h1` | `60px` |  |
| `--font-weight-h1` | `300` | Thin·Light — Light (300) chosen as base weight |
| `--font-size-h2` | `50px` |  |
| `--font-weight-h2` | `700` |  |
| `--line-height-h2` | `60px` |  |
| `--tracking-h2` | `-0.8px` | h4 — DM Sans Medium 30 / 40 (tracking unspecified) |
| `--font-size-h4` | `30px` |  |
| `--font-weight-h4` | `500` |  |
| `--line-height-h4` | `40px` |  |
| `--font-size-subtitle` | `22px` |  |
| `--font-weight-subtitle` | `400` |  |
| `--line-height-subtitle` | `30px` |  |
| `--font-size-subtitle-hero` | `40px` |  |
| `--font-weight-subtitle-hero` | `300` | Regular·Light, same as base subtitle |
| `--font-size-body` | `20px` |  |
| `--font-weight-body` | `400` | caption/label — DM Sans Bold 18 / 26 / +0.6px |
| `--font-size-caption` | `18px` |  |
| `--font-weight-caption` | `700` |  |
| `--line-height-caption` | `26px` |  |
| `--tracking-caption` | `0.6px` | overline — DM Sans Bold 30 / +2.9% tracked (lh unspecified) |
| `--font-size-overline` | `30px` |  |
| `--font-weight-overline` | `700` |  |
| `--tracking-overline` | `2.9%` | quote — DM Sans Italic 22 (lh/tracking unspecified) |
| `--font-size-quote` | `22px` |  |
| `--font-weight-quote` | `400` |  |
| `--font-style-quote` | `italic` | mono-xl — DM Mono 500 · 57 / 61 |
| `--font-size-mono-xl` | `57px` |  |
| `--font-weight-mono-xl` | `500` |  |
| `--line-height-mono-xl` | `61px` | mono-md — DM Mono Medium 24-27 / solid. Floor (24) as default — see harness §4. |
| `--font-size-mono-md` | `24px` |  |
| `--font-weight-mono-md` | `500` |  |
| `--line-height-mono-md` | `1` | "solid" |
| `--tracking-mono-md` | `0.06em` | eyebrow size md (vivid slides) |
| `--font-size-mono-label` | `18px` |  |
| `--font-weight-mono-label` | `400` |  |
| `--tracking-mono-label` | `3%` |  |
| `--font-size-metric-label` | `34px` |  |
| `--font-weight-metric-label` | `500` |  |
<!-- tokens:end -->

*v4 — 3 color tiers, ΔE<3 snap rule, generic patterns, token reference generated from code. Version on every change.*
