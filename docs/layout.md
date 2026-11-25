# Vinta Slidedeck — Layout / Archetype anatomy (v2)

> **Ported from vinta-slidedeck-deprecated** as reference for the `@/components` patterns. In this repo the tokens live in
> `src/components/tokens.css`, the catalog and rules in `src/components/CATALOG.md`, and every pattern renders at
> `/patterns`. Mentions of Storybook, `CLAUDE.md` and `npm run` scripts (other than `build-deck`) refer to
> vinta-slidedeck-deprecated; this repo's team guide is `team-guide.md`, next to this file.

Companion to `foundations.md`. The harness provides the **tokens**; this one provides the **composition** —
position, proportion and what sits where in each slide type. Extracted from the real screens
(1920×1080 frame).

**Global layout rules**
- Slide = **1920×1080**. Content margin: **~64px** on dense slides; **~200px** on hero/Divider.
- Eyebrow (pre-title): mono, **brand #0050ff**, ~22px → `deck/mono-label`.
- **Required migration when generating:** Roboto → DM Sans · JetBrains Mono → DM Mono · any #0061fe → **#0050ff**.
  The screens were made in Moderat/Roboto; **follow the composition in the screenshot, but render in the new font (DM Sans/DM Mono)** — do not copy the font from the image.
- **Accent-tint surfaces** (new): cards can use the light tint of the accent — purple `#f5ecff`, mint `#ecfff4`, blue `#ecf7ff`.

---

## Divider  (mode: invert-blue, full-bleed)
- **#0058e9** background covering everything + decorative **blobs/gradient** layer (soft ellipses in several blues).
- Content left-aligned, ~200px margin.
- **Pre-title:** pill (light chip ~#d2e7ff, dark text) in `deck/mono-md` + arrow-right icon inside. ~y280.
- **Title:** `deck/display` (DM Sans Thin ~120), white #fafcff, below the pill.
- Minimal composition: solid color + background art + pill + giant title.

## Product Timeline (Alt 01)  (mode: light, with colored header band)
- **Header band** at the top (~180px) with title `~60` (white) + subtitle `~30`.
- **3 phase columns** (x≈75 / 667 / 1256, each ~591 wide), cards **591×528** at y≈409.
- Each column carries **one accent** (phase 01 purple, 02 mint, 03 blue):
  - card with **bg = light tint of the accent** (#f5ecff / #ecfff4 / #ecf7ff)
  - label `phase 0X` in `deck/mono-sm`
  - phase title in **mono-bold ~30 in the accent color** (#9452ff / #44b99c / #0050ff)
  - `WEEK X` in condensed italic ~22 (map to the quote/italic style)
  - tags = pills on **accent-light bg**, slate text.
- This is where the secondary accents shine — one per phase.

## Investment / Pricing (01)  (mode: light, bg #f1f6ff)
- **Centered eyebrow** at the top (mono, #0050ff). **Centered title** `deck/h1`~74 (#0d2645).
- **2 plan cards side by side** (~780×684): **left light** (white) · **right inverted** (blue/dark, white text).
- Inside each card, **labeled rows** (~80px rhythm at y≈522/602/682/762/842):
  - left label: mono ~22, muted (#5b738d) → `deck/mono-label`
  - right value (x≈398): `deck/body` ~26; **PRICE is larger**, mono ~36.
  - plan name at the top (~40) + description (~25 secondary).
- Pattern: light card vs inverted card, same row structure.

## Client case (With Photo)  (mode: light, bg #f1f6ff)
- Left margin **64px**. Everything left-aligned.
- **Eyebrow** "CASE STUDY | LOCAL" mono #0050ff (y≈93).
- **Title** `deck/h1`~76, 2 lines (#0d2645).
- **Body** ~4 lines `deck/body`~26 (secondary #5b738d).
- **CTA** "VIEW THE FULL CASE STUDY" mono #0050ff + small logo/icon on the left.
- **Full-bleed photo at the bottom:** **1920×430** band (letterbox ~4.5:1), flush with the bottom edge.

---

## Suggested build order
Divider (simple) → Stat ✅ → Timeline step → Pricing row → Client-case → Slide-shell (the frame with safe-area that wraps all of them).

*v1 — anatomy of the first 4 archetypes. v2 (2026-10-29) adds the generic layouts and the note on screens copied from Figma, at the end of the file.*

---

## Divider — color schemes (1 layout, 4 tones)
They are not 4 components: it is the **same Divider** with a `scheme` prop. Inversion = token swap.

| scheme | bg | title | blobs (deco) | relation |
|---|---|---|---|---|
| `01` | `#0058e9` (dark) | `#fafcff` white | blues + cyan `#02effe` | dark base A |
| `02` | `#fbfdff` (light) | `#478dff` blue | light blues `#81b1ff`/`#d2e7ff` | **inverse of 01** |
| `03` | `#fafcff` (light) | `#0059e9` blue | very light `#eef4ff`/`#eaeff9` | **inverse of 04** |
| `04` | `#2c63f1` (dark) | `#ffffff` white | blues + cyan `#02effe` + deco green `#4fffb5` | dark base B |

- Pre-title pill in scheme 01: light chip, text `#0d1f79`.
- **Blobs are decorative** (background ellipses/gradient) — cyan `#02effe` and green `#4fffb5` appear only as blob colors, they do **not** become new tokens.
- Define 01 and 04 in full; **02 and 03 derive by inversion** (bg ↔ light/dark title).

---

## Elements (the atomic base) — build BEFORE the composition screens
Extracted from Intro to project. Screens like the Intro are an **assembly** of these, not a single block.
- **Eyebrow** (pre-title): mono ~21 + accent tick (configurable accent color). White on dark / ink on light.
- **DisplayTitle**: DM Sans, multi-line. **Scale goes up to 150 on covers** (beyond the base display 120).
- **Subtitle**: DM Sans ~40, with keyword in accent + underline.
- **Tag/Pill**: **outline** variant (border, mono ~22) + **filled** variant (accent-tint, from the Timeline).
- **TagGroup**: row of tags (gap ~16).
- **ImageFrame / Placeholder**: card on the right (~892×485) + dot-grid + decorative blobs.
- (Stat/KPI already done.)

## Intro to project  (pattern = composition, NOT a monolithic component)
- Background: blue cover (gradient) + decorative blobs/dot-grid. Left margin ~118.
- Stacked left column: Eyebrow (y≈279) → DisplayTitle 150 (y≈302) → Subtitle 40 (y≈660) → TagGroup (y≈748).
- ImageFrame on the right (x≈949, y≈343).
- Rule: the screen reuses the elements above; other screens assemble the same elements in a different way.

## Orange accent (confirmed)
`accent-orange` = **#F26A1C** · `#fdb58f` (light). **Same use as the other accents** (cyan/purple/mint/rose) — support, small elements, tints. The Intro tick/underline is just one usage example, not exclusive to orange.
Split: **#0050ff = structural primary · cyan/purple/mint/rose/orange = secondary accents (equivalent use).**

---

## Who is Vinta  (pattern — light mode)
- light bg `#f1f6ff`; left margin **64**; footer with "trusted by" band.
- Vinta **Logo** (x64 y88, ~192×44) — [placeholder].
- **Title** DM Sans ~46, 2 lines (#0d2645).
- **Body** DM Sans ~22 secondary (#5b738d), 2 lines.
- **MetricGrid 2×2** (rows y≈482 / y≈606, columns x≈64 / x≈502): each item = mono label in accent ~34 (#0050ff) + description ~24 (#0d2645).
- Browser/product-style **ImageFrame** on the right (x966 y186, 840×542) overlapping another card — [placeholder].
- **Badge** (award/Clutch) top-right (x1667 y96) — [placeholder].
- **LogoStrip** in the footer (#f5f8ff band, y844): eyebrow "TRUSTED BY…" mono ~20 + 6 logos — [placeholders].

## Additional elements (from Who is Vinta)
- **MetricItem**: mono label in accent (~34) + description (~24). Forms a 2-column grid (MetricGrid).
- **Logo**: wordmark — [placeholder, slot for SVG].
- **LogoStrip**: eyebrow + row of logos — [placeholders].
- **Badge**: seal/award — [placeholder].
- **ImageFrame** gains a **browser/product** variant (chrome with 3 dots), in addition to the plain card.
- Reused from the Intro: Eyebrow · DisplayTitle · Subtitle · ImageFrame.

> Placeholders (Logo, LogoStrip, Badge, ImageFrame): render a neutral box with a slot,
> to swap for the real asset later. Usual migration: Roboto→DM Sans, JetBrains→DM Mono, #0061fe→#0050ff.

---

## Timeline — these are 3 DIFFERENT screens (not variants of one)

### Alt 01 — "MVP Journey" (3 phases, accent-tint cards)
- **Header band** at the top (~182px, blue gradient): title "MVP Journey" (display ~60, white) + subtitle ~30 (#ecf5fd).
- **3 PhaseCards** (591×528, y≈409) in accent tint: phase01 purple #f5ecff · phase02 mint #ecfff4 · phase03 blue #ecf7ff.
- **PhaseHeader** (above each card, y≈304): "phase 0X" mono ~22 (#303030) + mono-bold title ~30 **in the accent color** (purple #9452ff / teal #44b99c / blue #0050ff) + "WEEK X" condensed italic ~22.
- **Tag** inside the card: accent-light bg (#dabcff / #9ebdff…) + arrow-right → reuse Tag filled.

### Alt 02 — "How the sprint works" (4 numbered steps + track)
- **Eyebrow** "MVP AI FAST-TRACK" (mono #0050ff) + **Title** "How the sprint works" (~92) + **Subtitle** (~28 secondary).
- Horizontal **Track** at the top (y≈382): nodes/dots joined by a line, one per step, in the step's accent color.
- **4 StepCards** (339×504 white, y≈496; x 64/427/790/1154): numbered badge (accent shape + "0X" white mono) + icon (accent) + step title (~34, accent #0050ff) + multi-line description (~24, secondary #4c5564).
- Accent per step (rotation): teal #32b7a2 · cyan #13b8c9 · blue #0099ff · blue #0050ff.
- **Real content (DO NOT simplify):** Map / Shape / Build / Reality Check + the full descriptions of each card.

### Alt 03 — "Our proposed approach" (confidence progression) — RECREATE (raster, not editable)
- **Header:** DisplayTitle "Our proposed approach" (2 lines, navy) + Subtitle "A focused path to a production-ready V1" (muted); on the right, Body "We will build on the existing product, focusing the engagement on the work required to launch a secure and dependable V1 with real users and real PHI."
- **ConfidenceTrack:** horizontal bar, mint→blue gradient, with label "UNKNOWNS" (left, muted) → "CONFIDENCE" (right, blue), in mono.
- **3 ChevronStages** (chevron/arrow segments, increasing saturation left→right):
  - 01 · VALIDATE — mint tint bg, teal label — "Validate the existing V1" + desc.
  - 02 · HARDEN — blue tint bg, blue label — "Harden for real-world use" + desc.
  - 03 · LAUNCH — saturated blue bg #0050ff, WHITE text — "Launch a reliable V1" + desc.
  - Each stage: "0X · LABEL" (mono, accent color) + title + multi-line description. Chevron = notch on the left, point on the right.
- **EstimateFooter** (white card at the bottom): "ROUGH ESTIMATE / ~1-2 months" (mono, blue) | orange vertical divider | "FIRST WEEK MILESTONE" (mono, orange) + description.
- Full real content in the descriptions (do not simplify).

## New elements (timeline)
- **PhaseCard**: card in accent tint (accent-light bg). Props: accent, children.
- **PhaseHeader**: mono label + mono-bold title in accent + week (italic).
- **StepCard**: numbered badge + icon + accent title + multi-line description.
- **StepBadge**: number in a shape in the accent color (white mono).
- **TimelineConnector**: line + nodes per step (accent per node).
- **SectionHeaderBand** (Alt 01): header in a colored band (title + subtitle).
- Reuse: **Tag** (filled + arrow), **Eyebrow**, **DisplayTitle**, **Subtitle**, **Icon**.
- **ConfidenceTrack** (Alt 03): gradient bar with end labels (mono).
- **ChevronStage** (Alt 03): chevron segment with saturation level (tint/mid/saturated), mono+accent label, title, description; white text on saturated.
- **EstimateFooter** (Alt 03): card with estimate (mono) + orange divider + milestone (orange mono) + text.
- **accentByIndex**: util that rotates the secondary accents per phase/step (purple→teal→blue…).

> Usual migration: Moderat→DM Sans · JetBrains→DM Mono · #0061fe→#0050ff. Do not oversimplify content.

---

## Other screens — elements (locked naming)

### What we heard  (blue bg + blobs → background asset)
- DisplayTitle "What we heard" (120, white).
- Grid of **IconCard** (white card): **IconBadge** (colored shape + icon) + title (~30, accent #287dde) + description (~22, #3c6696).
- Variant B: larger IconBadge (245px) at the top of the card + title ~36.

### Journey | Overall  (light bg + blob art → background asset)
- DisplayTitle "The Journey" (120).
- List of **JourneyStep**: circular **IconBadge** in the accent color + label "phase 0X | X weeks" (mono) + phase title (~42, accent). Accent per step (orange #ff8052 / blue #0061ff…).

### Maintenance services | Cards  (blue bg + ellipse → background asset)
- DisplayTitle "Maintenance Services" (120, white) + Subtitle (~30, white).
- 2× **CoverageCard** (white card): **CardHeader** (check/x icon + label in status color) + divider + list of **CoverageRow** (full-width pill, accent-light bg + text).
  - Coverage: green header #1e9f74, mint-light rows #adeadc / text #2a594c.
  - Exclusions: red header #c23535, rose-light rows #f7cacf / text #592a35.
- Note (white text) in the footer.

### Client case | With Photo  (light bg)
- Eyebrow "CASE STUDY | LOCAL" (mono, #0050ff).
- DisplayTitle (~76, 2 lines) + Body (~26, secondary, multi-line).
- **TextLink** "VIEW THE FULL CASE STUDY" (mono, accent, arrow) + small logo.
- Full-width **hero photo** (1920×430) with scrim = image asset + ImageFrame fullbleed variant.

## New elements (names defined)
- **IconBadge** — icon inside a colored shape. Props: shape (square | circle), tone/accent, icon. (What we heard + Journey)
- **IconCard** — white card: IconBadge + title (accent) + description. Variants: icon-inline / icon-top.
- **JourneyStep** — circular IconBadge + label (mono) + title (accent). Vertical list.
- **CardHeader** — icon (check/x) + label in status color + divider.
- **CoverageRow** — full-width pill (accent-light bg + text). Supports multi-line.
- **CoverageCard** — CardHeader + list of CoverageRow.
- **TextLink** — link in mono/accent + arrow-right (Lucide).
- Reuse: DisplayTitle · Subtitle · Body · Eyebrow · Tag · Icon · ImageFrame.

## Assets to export (images/backgrounds — they do NOT become components)
- What we heard: background (blue + blobs).
- Journey Overall: background (blob art).
- Maintenance: background (blue + ellipse).
- Client case: hero photo (1920×430) + small logo.
- They follow the Divider pattern: I export from Figma → they come in as background image/asset.

## To confirm — status colors
Maintenance uses **green #1e9f74** (coverage) and **red #c23535** (exclusions) — these are STATUS (success/danger), outside the accent palette. Add them as status tokens?


---

## v2 — Generic layouts (new content)

Seven patterns that do **not** copy a Figma screen: they accept new content and a `tone`
(`light` · `tint` · `invert-blue` · `invert-navy`). All of them only compose elements and Tier 1/2 tokens.
Common rules: horizontal margin **144px** (hero 200), content vertically centered, title in H1 (`DisplayTitle scale="h1"`),
descriptive text in H4 (`Body`), optional mono eyebrow above the title.

| Pattern | Composition | Margin | Limit |
|---|---|---|---|
| **SlideAgenda** | 600px left column: eyebrow + `display` title (120). Right: list of `NumberedRow` (mono index 34 in accent + H4 title + detail + meta), divider at the top | 144 | 3–6 items |
| **SlideContent** | left: eyebrow + H1 title + H4 lead. Right 820px: `surface-alt` card, radius lg, with `BulletList` (check/dot/number). Total height = 1080 − 240 | 144 | 3–5 points |
| **SlideTwoColumn** | text (eyebrow, H1, body, bullets, button CTA) + 840×760 media radius lg; `mediaSide` left/right; without media shows `ImageFrame` | 144 | media 840×760 |
| **SlideQuote** | `Quote` vertically centered (accent quote mark 150, text 60 Light italic, author H4 + role mono); logo in the bottom-left corner | hero 200 | 1 quote |
| **SlideTeam** | eyebrow + H1 title; grid of `PersonCard` (avatar 160, name H4, role mono, bio) with one accent per card (purple→mint→blue→orange) | 144 | 3–4 people |
| **SlideComparison** | eyebrow + H1 title; full-width `DataTable` (header mono 24, rows H4, highlighted column in `surface-alt`, ✓ = `status-success`) + note 20 muted | 144 | ≤ 4 col × 6 rows |
| **SlideBigStat** | eyebrow + H1 title; 1–3 `Stat` (206) in equal columns | 144 | value ≤ ~5 characters with 3 numbers |

New v2 elements: `Body`, `BulletList`, `Quote`, `DataTable`, `PersonCard`, `NumberedRow`;
`DisplayTitle` gained `scale="h1"`.

## v2 — Screens copied from Figma

Sixteen screens are an **exact copy** of Figma (absolute geometry on a 1920×1080 canvas, background art exported to
`public/assets/<screen>/`). They are for swapping text and images; **the number of items is fixed**
(e.g. 3 phases in Alt 01, 4 steps in Alt 02, 2 plans in Investment 01). Exact coordinates are in each pattern's CSS.
For content with a different number of items, use a generic pattern or ask for a new one.
Font: Moderat/Roboto/JetBrains → DM Sans/DM Mono (DM Sans is wider: titles may need a slightly larger box).
