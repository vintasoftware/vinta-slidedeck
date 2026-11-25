# Pattern catalog — the Vinta design system (site look)

`src/components/` is the Vinta presentation design system, ported from **vinta-slidedeck-deprecated**: **patterns**
(full 1920×1080 slides) built from **elements** (atomic pieces), styled with CSS Modules and the tokens in
`src/components/tokens.css`. It is the Vinta presentation look (vintasoftware.com) and the only slide system in
this repo: every slide in a deck is one of these patterns.

- **Browse:** the **template gallery** (`npm run gallery`, port 6007) shows every template by use with
  plain-language labels — the page for non-technical users. **Storybook** (`npm run storybook`, port 6006) has
  every pattern and element with its props (*Docs* tab) and the foundations pages. In the deck app, `/patterns`
  shows every example as a slide (press `o` for the grid, `p` for the presenter window) and `/samples` the sample
  presentations.
- **Use in a `.tsx` slide:** import from the single entrypoint `@/components`:

  ```tsx
  // src/slides/01-cover.tsx
  import { SlideCover } from "@/components";

  export const meta = { title: "Cover", notes: "Open with the 4-week promise." };

  export default function Cover() {
    return (
      <SlideCover variant="mesh" eyebrow="A FOCUSED SPRINT" title="MVP AI" accent="Fast-track" lede="A working MVP in 4 weeks" />
    );
  }
  ```

- **Use in a `.md` slide:** `template: SlideCover` (or `cover`) in the frontmatter — see MARKDOWN.md.
- **Examples:** every pattern and element has a Storybook story next to it (`<Name>.stories.tsx`). Copy their props
  as a starting point. `src/samples/*.stories.tsx` are whole decks (one story per slide). The deck app reads the
  same pattern and sample stories for `/patterns` and `/samples` (`story.tsx`).
- **Everything else works on every slide:** speaker notes (`meta.notes`), presenter window, overview,
  `?shot=N` / `?print`, PDF/PPTX (`npm run export`) and the Claude artifact (`npm run build-deck`, publish-deck skill).
- **Integration notes:** every pattern renders inside `SlideShell` (or the full-screen `Divider`), whose root
  carries the `vds` class (scopes the tokens and opts out of the Tailwind reset the deck chrome uses; see
  `src/index.css`) and `data-slide` (the slide root the exporters capture). A bespoke slide composed from elements
  must sit inside a `SlideShell` too. Animated product mocks (`BlockPreviews`) honour `prefers-reduced-motion`,
  which the PDF/PPTX exporter sets; in the artifact they run live.
- **Added here (not in vinta-slidedeck-deprecated):** `SlideCode` + the `CodeWindow` element, for code snippets. Built only
  from existing tokens; its syntax colors are pending design review.
- **Reference docs:** `docs/foundations.md` (tokens and the 3-tier palette) and `docs/layout.md` (slide anatomy),
  both carried over from vinta-slidedeck-deprecated.

**Composing a slide without a pattern:** use `<SlideShell mode safeArea background={<VividBackground …/>}>` with
`SlideHeader` for the header (padding `112px 144px 120px`) and only elements inside. Margins: `safeArea={144}`
for text slides, `"hero"` (200) for covers/quotes, `"dense"` (64) for dense screens. `resolveTone`
(`shared/slideTone.tsx`) aligns shell mode, text mode and background.

**Typical sales deck sequence:** `SlideCover` → `SlideAgenda` → `SlideStoryStats` (who we are) →
`SlideIconCards` (what we heard) → `SlideVsTable` / `SlideServiceMenu` (why us, what we do) → `SlideStepPath` +
`SlideStepFocus` per phase (approach / timeline) → `SlideComparison` (investment) → `SlideCaseStudy` /
`SlideCaseHighlight` → `SlideFaq` → `SlideBookCall` (closing). `SlideStatement` opens sections.

---

## Rules that never change

1. **Fonts:** only DM Sans and DM Mono (both bundled offline). Moderat/Roboto/JetBrains/Inter do not exist here.
2. **Icons:** only Lucide (`lucide-react`), `strokeWidth={1.5}`. Custom icons only when they already
   exist as an SVG exported from Figma inside a copied pattern.
3. **Color in 3 tiers** (details in `docs/foundations.md` §1):
   - **Tier 1 primary:** blue ramp (`--blue-600` `#0050ff` = brand), neutrals, surfaces, status, `--white`. The deck's structure.
   - **Tier 2 secondary:** cyan, purple, mint, rose, orange (+ light/dark pairs, tints) and the `--vivid-*` palette from the new homepage (mesh backgrounds, teal/violet panels, turquoise/blue accent). Only at specific moments; **one accent per slide** (brand blue by default); a second color only when it encodes meaning (them vs us, before/after, risk). Never a different color per card or row, and never as the slide's main color.
   - **Tier 3 tertiary:** exact Figma values with no match in the DS. **Only inside the element/pattern they came from. Never in new content.**
   - `#0061fe` always becomes `#0050ff`.
4. **Never invent a value.** Color, size, radius, shadow, spacing: only from `src/components/tokens.css`.
   No loose hex, no loose font `px` in component CSS. Something missing? **Stop and tell the user**
   ("let's talk it through") instead of silently approximating. A new color within ΔE 3 of an existing token uses the token.
5. **Pick color by semantic role** (`--color-text-primary`, `--color-surface`…) and by `data-mode`, not by hex.
6. **Text scale:** slide title = H1 (`DisplayTitle scale="h1"`, 60 Light), **two-tone like the site**: `title` (line 1, ink) +
   `accent` (line 2, blue; turquoise on dark), rendered by `SlideHeader`; cover/divider = `display`/`cover`;
   descriptive text = H4 (30 Medium, `<Body>`); notes = `Body size="body"`; CTA = button (`TextLink variant="button"`).
   The user complains about small text and dead space: fill the frame, check at 100%.
   **Composition rules (every content slide):** header at the top (`112px`), never vertically centered; header → content gap
   `var(--gap-header)` (56), side-by-side columns `var(--gap-columns)` (96); icon tiles 72px; mono labels inside cards 24
   (`mono-md`); slide-level cards radius `lg`, nested rows `md`; numbers in solid color (no gradient text). **No icon per
   bullet:** lists use dots or numbers; tiles only where the pattern is built on them (IconCards, FeatureCards, StepPath…),
   and then every icon different and concrete (no Rocket / Sparkles / ShieldCheck trio).
7. **Content per slide (anti-wall-of-text):** title + up to ~3 blocks. Lists ≤ 5 items.
8. **Always fictional data** in examples and stories. No real patient name, date or exam. Never PHI.
9. **Layers:** tokens → elements → patterns. Patterns **only compose** elements; do not recreate or restyle
   elements inside a slide. Element lacking a capability: apply tokens locally and **report the gap**.
10. **Figma copy = exact copy.** When importing a screen, do not "improve" anything; textures/art go in as an
    exported image (`public/assets/<screen>/`). Details in "Importing from Figma" below.

---

## Pattern catalog

Everything except the Figma screens follows the **site look** (vintasoftware.com): `SlideHeader` (eyebrow without tick,
two-tone title, lede), three backgrounds (`wash`, `mesh`, `night`; no bottom strip), quiet icon tiles (white on light,
glass on dark), white/glass cards, small chips. All these patterns take `eyebrow`, `title`, `accent` (title line 2) and
usually `lede`; a `title` that already holds `<Highlight>` still works. **Generic** ones take `tone`. **Figma screens
("Classic")** are exact copies with fixed geometry: swap text and images, **keep the number of items**.

### Site look (from vintasoftware.com pages)
Built from the home, services, service-detail, About and Fast-track pages.
| Pattern | Use when | Main props | Limits |
|---|---|---|---|
| `SlideServiceMenu` | what we do: services in groups, one highlighted | `groups[{label, items[{icon,name,text,highlight,chips}]}], sideCard, background` | 2–3 groups; item line ≤ ~24 chars with 3 groups |
| `SlideStepFocus` | one phase in detail (one slide per phase) | `steps[{label,duration,title,text,yourPart,milestone,rows}], active, variant` focus \| stages, `deliverables[], background` | 3–5 steps; keep `steps`, change `active` |
| `SlideVsTable` | us vs the alternative, row by row | `rows[{icon,label,them,us}], themLabel, usLabel, caption` | 3–5 rows; cell ≤ ~60 chars (one line with 5) |
| `SlideFaq` | questions with one answer open | `items[{question,answer}], open` | 4–6 questions |
| `SlideStoryStats` | who we are: story + 2×2 numbers + photo | `paragraphs[], stats[{value,label,link}], photo, badge` | ≤ ~260 chars of text, 4 stats |
| `SlideNumberedList` | habits, principles, steps on a vertical rail | `items[{title,text}], activeIndex` | 3–5 items |
| `SlideBookCall` | closing: book a call, team avatars, contact card | `text, email, avatars[], contact{name,role,email,phone,link,photo}, card` | — |

### Planning deck (dense, from the Expansion 2027 planning deck)
Single-ink H1 (no `accent`) with a mono eyebrow using `·` separators, white cards with a blue edge, text at 22–30px, the frame
filled. All take `grid` (64px grid over the wash, off by default). Stories carry "SAMPLE DATA / SAMPLE COPY".
| Pattern | Use when | Main props | Limits |
|---|---|---|---|
| `SlideStatRows` | facts in rows: number + title + sentence (progress, risks) | `rows[{value,unit,title,text}], tone` blue \| danger | 3–5 rows; 5 rows = one-line title, no lede |
| `SlideNumberedGrid` | actions of a plan, workstreams, options | `cards[{title,bullets[]}]` | 2–4 cards, 2–4 bullets ≤ ~90 chars |
| `SlideStatTable` | headline number + breakdown table | `hero{value,caption}, stats[≤2], table{columns,rows,total}, badge` | ≤ 4 columns × 5 rows; chips `{chip,tone}` |
| `SlideProfileCards` | ICP / persona / segment on one slide | `persona{label,value,icon}, lede, attributes[{icon,label,value,big,detail}], pains[{icon,text}]` | 4–5 attributes, 2–3 pains |
| `SlideMonthTimeline` | a period in columns with floating milestone bars | `columns[{label,items[]}], bars[{label,from,to}]` | 2–4 columns, ≤ 4 bars |
| `SlideOrgTeam` | team by area, open seats | `groups[{label,people[{name,role,photo,open}]}]` | 2–4 groups, ≤ 10 people; studio portraits only |

### Generic (new content)
| Pattern | Use when | Main props | Limits |
|---|---|---|---|
| `SlideAgenda` | agenda/table of contents | `tone, eyebrow, title[], items[{title,detail,meta,accent}]` | 3–6 items |
| `SlideContent` | idea + supporting points | `tone, eyebrow, title[], lead, bullets[], bulletVariant, accent` | 3–5 points |
| `SlideTwoColumn` | text + image | `tone, eyebrow, title[], body, bullets, cta, media, mediaSide, accent` | media 840×760 |
| `SlideQuote` | testimonial | `tone, quote, author, role, logo, accent` | 1 quote, ≤ ~140 characters |
| `SlideTeam` | team / who will work on it | `tone, eyebrow, title[], people[{name,role,bio,src,accent}]` | 3–4 people |
| `SlideComparison` | plans/options | `tone, eyebrow, title[], table{columns,rows,labelHeader}, note` | ≤ 4 columns × 6 rows |
| `SlideBigStat` | impact numbers | `tone, eyebrow, title[], stats[{value,label}]` | 1–3 numbers; value ≤ ~5 characters with 3 |
| `SlideBuildingBlocks` | animated building blocks map (site) | `count, claim, lede, blocks[[name, patient|practice]], slots, filter, autoplay, cycleFilters` | 42 blocks, 16 named cubes; `autoplay={false}` for a static image |
| `SlideBlocksCompare` | "Same block, a different product every time" carousel (site) | `title, accent, lede, deck{blocks, autoplay, live, startIndex}` | 4 cards (Provider Experience, AI Concierge, Patient Intake, Provider Payouts) with animated tour |
| `SlideCode` | a code snippet: an API, a config, a rule (added in this repo) | `tone, eyebrow, title, accent, lede, code, language, filename, density, layout` split \| stacked | split ≤ ~22 lines × ~60 chars (compact ~30 × 80); stacked ≤ ~13 × ~110 |

### Vivid (case library and data slides)
Ported from the approved Claude Design templates. Light `wash`, blue `mesh` or `night` background
(`VividBackground`), titles take a `ReactNode`: wrap the highlighted words in `<Highlight>`. Stories carry
fictional "SAMPLE DATA"; replace it with the client's.
| Pattern | Use when | Main props | Limits |
|---|---|---|---|
| `SlideCaseStudy` | a published client case | `{...getCaseStudy('medplum')}` or `client, phrase, location, duration, summary, tags[], highlights[{value,label}], hero, logo{src,tone}` | 30 cases in `SlideCaseStudy/cases.ts` (one story each); 3 highlights, value ≤ 8 characters, label ≤ 28 |
| `SlideBarChart` | values per period, grouped | `eyebrow, title, groups[{label, bars[{label,value,projected}]}], max, legend` | ≤ 3 groups × 4 bars |
| `SlideStackedBars` | mix/share per period (100% bars) | `eyebrow, title, columns[{label,caption}], series[{label,values,color}], formatValue` | 2–6 columns, ≤ 4 series |
| `SlideFunnel` | pipeline stages | `eyebrow, title, description, stages[{label,value,description,variant}]` | 3–4 stages |
| `SlideRankingBars` | ranked reasons/items | `eyebrow, title, rows[{label,value,valueLabel}], max, highlightIndex, callout` | ≤ 6 rows |
| `SlideLineChart` | trend over time vs a reference | `eyebrow, title, labels[], primary{label,values}, reference, max, stats[]` | ≤ 12 points, ≤ 2 stats |
| `SlideDonutChart` | parts of a whole + takeaways | `eyebrow, title, segments[{label,value,detail,color}], takeawaysTitle, takeaways[]` | 2–5 segments, ≤ 3 takeaways |
| `SlideProgressRings` | 2–3 percentages | `eyebrow, title, rings[{value,label,description}]` | values 0–100 |
| `SlideHeroNumber` | one number that matters (with before → after) | `eyebrow, title, value, previous, caption, points[], background` | ≤ 3 points |
| `SlideBeforeAfter` | before/after metrics | `eyebrow, title, rows[{icon,label,before,after,unit,delta}], beforeLabel, afterLabel` | ≤ 3 rows |
| `SlideVersus` | two options side by side | `eyebrow, title, left{title,items}, right{title,items}, vsLabel` | ≤ 4 items per side |
| `SlideKpiScorecard` | KPI grid with deltas | `eyebrow, title, kpis[{icon,label,value,delta,trend}]` | 3–6 KPIs |
| `SlideDataTable` | rows with tags/badges | `eyebrow, title, columns[{header,width,style}], rows[][]` | ≤ 6 columns × 6 rows |
| `SlideClientsWall` | logo wall | `eyebrow, title, clients[]` (names from `Logo/clients.ts`) | ≤ 12 logos |

### Vivid layouts (new content, homepage look)
Ported from the Claude Design "rich" and "vivid" templates. Titles take a `ReactNode` with `<Highlight>`; on dark
slides pass `<Highlight mode="invert-blue">` (or `invert-navy`). Photo slots take `/assets/team/<key>.webp` (see "Content and asset limits")
and show a dashed placeholder when omitted. Wordmarks: `/assets/shared/vinta-wordmark-{white,blue}.svg`.
| Pattern | Use when | Main props | Limits |
|---|---|---|---|
| `SlideCover` | deck cover (B/C/D; `SlideIntro` is A) | `variant` mesh (UI slot, live product block) \| split (photo) \| night (centered), `eyebrow, title, subtitle, tags, media, photo, preparedFor` | title 2 lines ≤ ~12 chars (night ~16) |
| `SlideStatement` | section opener, key claim | `background` mesh (rings) \| blue-art, `eyebrow, title, text, pills[{icon,label}]` | title ≤ ~45 (mesh) / ~60 chars |
| `SlideStatCards` | 3 results on blue mesh | `eyebrow, title, stats[{icon,value,label}]` | 3 stats, value ≤ 5 chars |
| `SlideSphereList` | agenda or stats on the blue sphere | `emphasis` title \| number, `eyebrow, title, subtitle, items[{icon,accent,title,detail,meta}]` | 3–5 rows (stats 2–4) |
| `SlideFeatureCards` | features, benefits, pillars with photos | `eyebrow, title, cards[{photo,icon,accent,title,text}]` | 3–4 cards, title ≤ ~24 chars |
| `SlideIconCards` | what we add, scope, pillars | `eyebrow, title, lead, cards[{icon,accent,label,title,text}]` | 3–4 cards |
| `SlidePointsPhoto` | why Vinta, how we work, services | `frame` bleed \| card, `eyebrow, title, points[{icon,accent,title,text}], photo` | bleed 3–4 rows, card 3 |
| `SlideFeaturePhoto` | one offer + 3 proof points | `eyebrow, title, points[{icon,accent,text}], photo, stat{label,value}` | 3 rows |
| `SlideProductShowcase` | a product block, the live UI | `eyebrow, title, text, media` (default: live Provider Experience) | — |
| `SlidePhotoBand` | section opening with a team photo band | `photo, eyebrow, title, cards[{icon,accent,title,text}]` | 3 cards |
| `SlideStepPath` | process, phases, timeline | `eyebrow, title, steps[{icon,accent,label,title,text}]` | 3–5 steps |
| `SlideDeliverables` | what the client gets | `eyebrow, title, photo, lead, deliverables[{icon,label}]` | 4 deliverables |
| `SlideTwoPanels` | two audiences / two sides | `eyebrow, title, tabs[], activeTab, panels[2]{label,accent,items[{icon,text}]}` | 4–6 items per panel, tab ≤ ~20 chars |
| `SlideGlassRows` | foundation, layers (color variation slide) | `color` green \| purple, `eyebrow, title, text, photo, rows[{icon,title,text}]` | 4 rows, ≤ ~45 chars each |
| `SlideTeamPhotos` | who will work on it, with portraits | `eyebrow, title, people[{photo,role,name,text,accent}]` | 3–4 people |
| `SlideReviews` | 3 client testimonials | `eyebrow, title, reviews[{quote,name,role,logo,portrait,highlight}]` | 3 cards, one `highlight` (navy) |
| `SlideQuotePhoto` | one testimonial with a photo | `variant` bleed \| portrait, `quote, author, role, photo, logo` | quote ≤ ~140 chars |
| `SlideCaseHighlight` | one case told with a photo + numbers | `variant` split \| band, `eyebrow, title, text, numbers[], photo, logo` | split 2 numbers, band 3 |

### Figma screens ("Classic", exact copy; not in the site look)
| Pattern | Screen | Fixed content |
|---|---|---|
| `SlideIntro` | "Intro to project" cover | eyebrow, title, subtitle, tags, image |
| `SlideClosing` | closing | title + `ContactCard` |
| `SlideWhoIsVinta` | Who is Vinta | 4 metrics, badge, logo strip (gray); the product screenshots are part of the exported background |
| `SlideWhatWeHeardGrid` | What we heard (A) | 4 cards + summary |
| `SlideWhatWeHeardCards` | What we heard (B) | 3 cards |
| `SlideProposedApproach` | Alt 03 — approach | 3 stages + estimate |
| `SlideProductTimeline` | Alt 01 — MVP Journey | 3 phases |
| `SlideSprintSteps` | Alt 02 — how the sprint works | 4 steps |
| `SlideJourneyOverall` | Journey overall | list of phases |
| `SlideJourneySingleStep` | Journey — single phase | phases 01/02/03 |
| `SlideScopeReview` | Scope review | coverage, concerns, approaches |
| `SlideInvestmentPlans` | Investment 01 | 2 plans |
| `SlideInvestmentSummary` | Investment 02 | rows + start date |
| `SlideMaintenanceServices` | Maintenance | coverage × exclusions + note |
| `SlideClientCase` | Client case | title, text, CTA; the hero photo with blue tint is part of the exported background |
| `Divider` (full-screen element) | divider | 4 `scheme`s |

Each pattern's props are documented with JSDoc in `patterns/<Name>/<Name>.tsx`; its examples are in `<Name>.stories.tsx` and render at `/patterns`.

---

## Elements (the atomic base)

Header: `SlideHeader` (eyebrow + two-tone `title`/`accent` + `lede`; `layout` stacked/split, `align`, `scale` h1/display/cover). Use it for every new slide header.
Text: `DisplayTitle` (scales display/cover/h1/h2; `ink="vivid"` on vivid slides) · `Subtitle`/`SubtitleAccent` · `Body` (h4/body; `weight="regular"`, `ink="vivid"`) ·
`Eyebrow` (`size` label/md; `tick={false}` in the site look) · `Kicker` · `SectionLabel` · `TextLink` (text/button) · `Tag`/`TagGroup` (outline/filled/glass/white, optional `icon`, `size` md/sm) · `Quote`.
Lists and data: `BulletList` (dot/check/number) · `NumberedRow` · `DataTable` · `Stat` · `MetricItem`/`MetricGrid`.
Cards: `IconCard` · `IconBadge` (`variant` solid/gradient/glass/pale/white/ring) · `TagCard` · `InsightCard` · `ArtCard` · `PricingCard` · `StepCard` · `PersonCard` ·
`ContactCard` · `CoverageCard`/`CoverageRow`/`CardHeader`.
Sequence: `JourneyStep` · `PhaseHeader` · `TimelineBar` · `StepRail` · `ChevronStage` · `SpectrumTrack` · `SplitCallout`.
Vivid: `VividBackground` (`wash`/`mesh`/`night`/`green`/`purple`, `glow="horizon"`; grid only on dark, `strip` off by default) · `Highlight` (highlighted words in a title; `variant="gradient"`) ·
`VividCard` (white/glass/navy card surface) · `PhotoSlot` (photo cropped to its slot, overlay blue/veil/fade, dashed placeholder without `src`) ·
`ConcentricRings` (decorative rings + glow on mesh).
Brand/media: `Logo`/`LogoStrip` · `Badge` · `ImageFrame` (card/browser) · `Divider` · `BlockPreviews` (the site's animated product mocks, standalone: `ProviderExperience`, `Intake`, `Concierge`, `Payouts`, `CompareFrame`, `BlocksDeck`, `PreviewCard`, `ProductSlot` (the live mock sized for a slide's UI slot); site CSS in `BlockPreviews/blocks.css`, classes `homepage-bb-*`) · `ClientLogos` (catalog of client logos by name; `clientLogo('Medplum')`, `getClient('Everself')` in `Logo/clients.ts`, with the link to the case on the site).
Code: `CodeWindow` (navy code card with a mono file label and syntax colors from tokens; `density` regular/compact, `surface` light/dark).

Common props: `mode` (`light | light-tint | invert-blue | invert-navy`) and `accent`
(`blue | cyan | purple | mint | rose | orange`). The accent resolves to the right shade for the mode
(see `tokens.css`, "Configurable accent"); cyan and blue fall back to white in `invert-blue`.

---

## Creating a new element or pattern

- **Name by function** (`SpectrumTrack`, not `ConfidenceTrack`); patterns may be named after a screen.
- Folder with `X.tsx`, `X.module.css`, `index.ts`, `X.stories.tsx`. Props with JSDoc (feeds Storybook's autodocs).
  Export it from `src/components/index.ts`.
- Tokens only. No literal color/font/size. Mode and accent via `data-mode` / `data-accent`.
- A new element needs a story with the relevant modes and variants. A new pattern's stories (`title: 'Patterns/X'`,
  `parameters: { layout: 'fullscreen' }`) also become its slides at `/patterns`.
- Stop and show the user before continuing when: a token is missing, you need an element that does not exist,
  or a pattern requires a Tier 3 color.

## Importing from Figma (exact copy)

File `0S546H4QgffNj4L22cMxUQ`, page "Auditoria Business Proposal" (node `426:202`).
`get_design_context` + `get_screenshot` for the screen; `download_assets` for images (the URLs expire in 7 days:
download them with `curl` to `public/assets/<screen>/`). For a clean background: clone the frame onto a temporary Figma
page, delete text and elements, export PNG, **delete the temporary page and confirm**. Frames from HTML imports
have insets in % (×19.2 horizontal, ×10.8 vertical) and `scale-65` wrappers that shrink the text (50px → 32.5px).
Font becomes DM Sans/DM Mono; an exact color within ΔE<3 of a token uses the token, otherwise it goes in as Tier 3.

## Verification and maintenance

- Clean `npx tsc -b`, passing `npm run build-storybook` and `npm run test-storybook` (every story rendered in
  headless Chromium), and `npm run build`, before calling anything done.
- **Template gallery** (`gallery/`, the page non-technical users open with `npm run gallery`): after adding or
  changing a pattern, a story or a sample, run `npm run gallery:build` (`--skip-existing` to reshoot only new
  stories). The gallery's categories (by use, in deck order) and plain-language labels live in
  `scripts/gallery-catalog.mjs`: a new pattern must be added there (and to the pattern catalog tables above, where
  the limits come from), or it lands in "Uncategorized" and the script prints a warning.
- `docs/foundations.md` and `docs/layout.md` are the written source of truth; Storybook is the visual truth.
  If they diverge, tell the user.
- Changed a token? Run `npm run sync-harness` (regenerates the token reference in `docs/foundations.md` from
  `tokens.css`) and review the text.
- New or different team photo crop? Edit `assets/team-photos/crops.json` and run `npm run team-photos -- crops`
  (`--force` to rewrite existing crops; `library <originals-dir>` adds photos to the optimized library). Needs
  `cwebp` (`brew install webp`) and macOS `sips`.

---

## Content and asset limits (read before using the Figma patterns)

**Backgrounds and slots:** the patterns copied from Figma already carry the default background (`background`/`footerStrip`/`header`
have defaults). Backgrounds are decoration only (gradients, shapes, dots). **Photos, logos and screenshots are slots** (`ReactNode`
props): when omitted, they show the original Figma asset; pass `<img src="..." />` (or any node) to swap.
| Pattern | Slots |
|---|---|
| `SlideClientCase` | `photo` (hero photo 1920×430), `photoOverlay` (blue tint; `false` turns it off), `logo` |
| `SlideWhoIsVinta` | `image` (840×542, behind), `secondaryImage` (558×456, in front) — each replaces the whole window (use `<ImageFrame variant="browser">` for another screenshot), `logo`, `badge`, `logos[]` |
| `SlideJourneySingleStep` | `photos` (pair of 641/756 px circles), `photoTreatment` (`none` \| `duotone`; `duotone` approximates Figma's gray+tint on a raw photo), `phase.badge` |
| `SlideIntro` | `image` (with the default `imageFrame` it goes inside the `ImageFrame`; with `imageFrame={false}` it fills 892×485 at x949 y343), `background` |
| `SlideClosing` | `contact.avatar`, `logo`, `background` |
Client images: `public/assets/clients/<client>/`.

**Team photos:** `public/assets/team/<key>.webp`, cut by `npm run team-photos -- crops` from the optimized library in
`assets/team-photos/` (`crops.json` says which photo and box each key uses). Keys: `cover-split`, `cover-mesh`, `card-a/b/c`,
`points`, `rich-feature`, `rich-band`, `rich-list`, `rich-glass-a/b`, `rich-deliver`, `teamph-1/2/3`, `team-1/2/3`, `agenda`,
`big-stat`, `content`, `two-column`, `quote-panel`, `quote-bleed`, `quote-circle`, `case-split`, `case-band`. Studio portraits
(`team-*`, `teamph-*`) are for team slides only; names next to them in stories are examples. Never pair a team photo with a
client's name (quotes, cases).

**Art embedded in SVG (not generic):** `SlideWhatWeHeardCards` and `SlideWhatWeHeardGrid` take `art`
per card, and the icon and shape come **inside** the exported SVG (`public/assets/what-we-heard/card-a1..a4.svg`,
`card-b1..b3.svg`, `badge-b3.svg`). They only work for the original content (document, code, chip). For other
topics, use `SlideContent`, `SlideTwoColumn` or ask for a new card pattern with Lucide `IconBadge`.
`SlideProductTimeline`: `guides` = `column-1..3.svg`. `SlideJourneySingleStep`: the phase 01 badge is an SVG
(`phase-badge.svg`); phases 02/03 use `IconBadge`. `SlideClosing`: `avatar.png` is the original contact's photo;
without a photo, omit `avatar` (the card adjusts).

**Limits per slot (measured with DM Sans):**
| Slot | Limit |
|---|---|
| H1 title on 2 lines | ~30 characters per line |
| `SlideContent` point | ~70 characters (2 lines) |
| `SlideAgenda` title / detail | ~40 / ~60 characters |
| `SlideQuote` | ~140 characters |
| `SlideComparison` | 2-line title + up to 5 table rows (up to 4 rows the table is comfortable, beyond that it compacts) |
| `SlideBigStat` value | ≤ 5 characters with 3 numbers (206px font) |
| `ArtCard` / `SlideWhatWeHeard*` title | ≤ 3 lines; the 3rd card's fits ~2 |
| `SlideIntro` title | ≤ ~12 characters per line (collides with the dot-grid) |

**Usable height:** 1080 − the pattern's vertical margins. A 2-line title + 5 table rows already uses almost all of it;
if it overflows, cut the content, not the font size.

**Generic text slides** are for new content; the Figma ones are for reproducing approved screens.
