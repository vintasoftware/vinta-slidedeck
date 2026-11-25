---
name: publish-deck
description: >-
  Publishes a Vinta deck as a private claude.ai artifact, or updates one already
  published - builds it as one self-contained HTML, scans its text, publishes
  with the user's OK and hands over the link. Use when the user asks to publish,
  share, update or republish a deck, and from create-deck's delivery step.
---

# Publish a deck as an artifact

The artifact is the deck `npm run build-deck` draws: one self-contained HTML with the normal deck runtime (arrows,
click and swipe navigation, `o` overview, `f` fullscreen), fonts and images embedded, animations running. The
Artifact tool publishes it; only Claude Code has that tool. Another agent builds and scans, then says publishing
needs Claude Code.

## Edits go wherever the user wants

The deck comes from `src/slides/` (or `src/samples/` for the samples), but the user may edit anything, including the
exported HTML in `output/exports/`, and you make those edits when asked. Don't block or push back mid-work.
`artifact.json` keeps the build's `sha256`: if the HTML no longer matches it, it was edited by hand, so publish that
version as it is and don't rebuild over it. If a rebuild does run, `build-deck` saves the edited version to
`<name>.edited.html` first.

Be opportunistic only **at the end**, once the deck is published or the user says it's done: if there were edits
to the export, propose the matching change to the slides (or, for a pattern gap, the pattern, per
`src/components/CATALOG.md`), list it slide by slide, and apply it only once the user approves. With the edits in
the slides, the next build keeps them.

## Steps

1. **Build**: `npm run build-deck -- --shots` for the deck at `/` (add `--name "Client deck"` for the artifact's
   title; default: the `<title>` in `index.html`; `samples` instead builds the sample presentations), unless the
   HTML was edited by hand (above). It fails on a missing image, a script error or any network request: fix it
   and run again. In `output/exports/<name>/` it writes the HTML, `text.txt` (each slide's words and links) and
   `artifact.json` (what to publish).
   **Size:** an artifact page holds at most 16 MB. The build embeds each image once and PNGs over 100 KB as WebP
   (with `cwebp`; if it says cwebp is missing, ask the user to `brew install webp`), and when the HTML would be over
   16 MB it fails without writing anything and lists the heaviest images. Then shrink or drop those images in
   `public/assets` (WebP or JPEG for photos) or split the deck; never publish an HTML over the limit.
2. **Scan before publishing.** Read `text.txt` whole, plus any text edited in the HTML by hand since (`text.txt`
   doesn't have it). Stop, publish nothing and tell the user if it has:
   - patient or health data, real or simulated (never PHI);
   - a client name or logo the user hasn't cleared for this deck;
   - a credential, key, internal URL or private contact;
   - a figure no source supports, or a leftover "SAMPLE DATA / SAMPLE COPY" or starter text the user didn't intend.
3. **Look** at every PNG in `output/exports/<name>/artifact-preview/`: they are exactly what the artifact shows.
   Point out cut text, overflow, dead space or a wrong logo, and fix it wherever the user prefers.
4. **Ask for the OK** to publish, unless the user already asked for it in this request. Never publish without an
   explicit request.
5. **Publish** with the Artifact tool, from `artifact.json`: `file_path` its `page`, `description` its `description`,
   `icon: "slides"`. To update a deck published earlier in this session, publish the same `file_path` again. From
   another session, find it with `action: "list"` (its description starts with the deck's title and says "Vinta
   deck"), read it first (`action: "read"` with that `url`, or the publish is refused) and then publish with the same
   `url`; never create a second link for the same deck.
6. **Hand it over**: the link; that it is private until they share it; whom to invite (below), done from the
   artifact's Share menu; what in the deck is still a fictitious placeholder. The presenter window (`p`) and PDF/PPTX
   are for presenting from this repo (`npm run dev`, `npm run export`); the artifact is for sharing.

## Whom to invite

Suggest named people from this list, picking those who fit the deck, without the person who asked. The invitation is
done from the artifact's Share menu. Never suggest "anyone with the link".

Roger Lima, Beatriz Betta, Flávio Juvenal, Hugo Bessa, Lais Varejão, Matheus Nager, Amanda Savluchinske.

## Never

- Publish without the scan, or after a hit.
- Rebuild over an HTML edited by hand without saying so, or block an edit because it isn't in the slides.
- Share the artifact yourself, or suggest sharing by link: sharing is the user's.
- Run git, push or open a PR because the artifact is up; that waits for the user to ask.
