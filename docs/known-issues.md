# Known issues

## Design system

- Team photos in `public/assets/team/` are real Vinta employees; the names next to the portraits in stories are
  examples. Never pair a team photo with a client's name (quotes, cases). The optimized source library is in
  `assets/team-photos/` (12 MB, cut with `npm run team-photos`); full-size originals are in the Drive folder
  `team-photos-originals`.
- Carta, PlusPlus, Lastmile, Tesorio and Splendid Spoon only have a white logo in `Logo/clients.ts` (from the case
  library): use them on dark backgrounds.
- The vivid patterns use the DS title size (H1, 60px) instead of the templates' 64px, and the vivid layouts
  (`SlideCover`, `SlideStatement`, `SlideFeatureCards`… and `tone="vivid"`) use the DS type scale, so their text is
  smaller than in the Claude Design templates they came from (titles 76 → 60, card text 26–28 → 30, numbers 104–176
  → 120).
- Some vivid layouts approximate a template detail with the nearest element style: `VividCard` always has the large
  shadow, the navy review card is flat (template: gradient), the glass number chips are lighter than the template's
  navy-tinted ones, and `IconBadge` `ring` has a single blue.
- `SlideCode` / `CodeWindow` use only existing
  tokens, but the syntax colors (several accents on one slide) are pending design review. The highlighter has no
  `bash`/shell grammar: those snippets render as plain text.

## Artifacts (`npm run build-deck`)

- Images are embedded as base64, so every 1920×1080 background photo adds to the file (the starter deck is ~2 MB).
  The script warns above 25 MB.
- `build-deck` finds images by rendering each slide for 1.5 s. An animation that loads an image after that ends up
  without it, and the script's offline check reports the missing path.
- The presenter window (`p`) opens a second window of the same page; inside a claude.ai artifact, pop-ups may be
  blocked. Present from `npm run dev` when you need speaker notes.

## Exports (`npm run export`)

- Animated product mocks are captured with reduced motion (a still frame).
- Box shadows are dropped in the PDF (Chromium prints large blurred shadows as gray boxes); the PPTX background keeps them.

## Storybook and the gallery

- `npm run test-storybook` renders every story in headless Chromium; a11y violations are reported, not failures
  (`a11y.test: 'todo'` in `.storybook/preview.tsx`). The Chromatic addon is installed, but publishing to Chromatic
  needs a Chromatic project and its token (`npx chromatic --project-token …`).
- The first `npm run test-storybook` right after installing the packages reported 5 unhandled "Cannot read properties
  of null (reading 'useRef')" errors with every test passing; it didn't happen again in 4 runs, cold caches included.
- `npm run render-clip` records through Storybook's dev server with virtual time; it restarts a session that hangs
  and keeps going from the last saved frame. Over 20 MB, Google Slides rejects the MP4 (raise `--crf` or lower
  `--seconds`).
- Storybook's dev server compiles each story on first open, so the first `npm run gallery` takes a few minutes;
  later runs can use `--skip-existing`.

## Repository

- `output/` (artifacts), `export/` (PDF/PPTX), `gallery/` and `storybook-static/` are gitignored.
