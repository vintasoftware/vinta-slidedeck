# Vinta Slides — team guide

Adapted from the Vinta sales team guide (owner: Felipe Farias).

## How it works

You build the deck by talking to **Claude Code** inside this repository. It uses the ready-made slides from the
Vinta design system and delivers the deck as a **Claude artifact**: a private link to a navigable, on-brand Vinta
presentation. You never edit code.

- Visual catalog of every slide template: the gallery (`npm run gallery`, opens http://localhost:6007), grouped by
  what each template is for, with its limits. It also shows the sample presentations (complete decks with fictional
  data) and your own deck. Storybook (`npm run storybook`, port 6006) is the internal tool behind it.
- **One repository per deck:** every new deck starts as a copy of the template repository
  (`vintasoftware/vinta-slidedeck`). Your slides live in `src/slides/` of that copy; the published
  artifact is what you share.

## Set up your machine (once)

Install Node.js (version 20 or newer) and Claude Code.

## Start a new deck

1. On GitHub, open `vintasoftware/vinta-slidedeck` and click **Use this template → Create a new
   repository** (name it after the deck, e.g. `northwind-proposal`). Clone it and, in its folder, run:

```bash
npm install
```

2. Optional: browse the templates with `npm run gallery` (the first build takes a few minutes). To look at your deck
   while it's built: `npm run dev`, then open http://localhost:5173.
3. Open Claude Code in the deck's folder and ask for a deck (or type `/create-deck`).
4. Answer the briefing questions, or paste one of the prompts below with the client's details.
5. Review the outline and the previews Claude shows you, ask for changes in the same chat and, when it looks right,
   approve publishing. You get the artifact link to present or share.

In the artifact: arrow keys or a click to change slides (a click on the left third goes back), **O** for the overview, **F** for full screen.
Presenting from your own machine instead (`npm run dev`)? **P** opens the presenter window with your speaker notes.

## Ready-made prompts

Replace what's in brackets. The more real content you provide (numbers, phases, prices), the better the result.

**Sales proposal**

```markdown
Build a deck for [client].
Sales presentation in English.
Client: [name], [what they do, size].
Goal: [what we want to sell or get decided].
Sequence: cover, agenda, who we are, what we heard, proposed approach, journey, investment, closing.
Content: [paste numbers, phase names, prices].
Where data is missing, use a fictional example in brackets and tell me which images are missing.
```

**Discovery readout**

```markdown
Build a deck for [client].
Discovery readout in English.
Sequence: cover, agenda, what we heard, key findings, proposed approach, next steps, closing.
Conversation notes: [paste your notes].
Use dividers between sections.
```

**Technical walkthrough**

```markdown
Build a short technical deck for [audience].
Sequence: cover, the problem, how it works (with 2 code slides), results, next steps.
Code: [paste the snippets, ≤ 20 lines each].
```

**Change a slide**

```markdown
On slide [number], replace [what] with [the new content]. Keep the slide template.
Then rebuild the artifact and republish it at the same link.
```

**PDF or PowerPoint to attach**

```markdown
Export the deck as a PDF (or: as an editable PowerPoint).
```

**An animation as a video** (for an email or Google Slides)

```markdown
Record the building blocks animation as a 20-second looping video.
```

## What the design system includes

Ask for the type of slide; Claude picks the right template. The full list, with text limits, is in
`src/components/CATALOG.md`.

| Family | What it includes | Use it for |
| --- | --- | --- |
| Cover and dividers | Covers (blue mesh, photo, navy), statements and color dividers | Opening the deck and separating sections |
| Content slides | Agenda, idea with supporting points, text with image, highlighted numbers, comparison, FAQ | Benefits, results, options |
| Proposal screens | Who we are, what we heard, approach, journey, timelines, scope | Proposals and discovery |
| Investment and case | Plans, pricing summary, maintenance, client case, testimonials | Closing the deal and showing proof |
| Client cases | 30 ready case slides from vintasoftware.com/clients (photo, logo, summary, 3 numbers) | Showing proof with a real client |
| Data | Bar, stacked, line, donut and ring charts, funnel, ranking, big number, before/after, versus, KPI scorecard, table, logo wall | Results, pipeline, comparisons |
| Code | Code window with syntax colors | Technical walkthroughs, APIs |
| Product (animated) | Building blocks map and product carousel, running live in the artifact | Showing the platform |
| Closing | Book-a-call and thank-you slides with a contact card | Last slide |

## Rules for a good result

- **Use the templates.** Ask for a type of slide, not a slide "from scratch".
- **One slide, one idea.** Short title and at most 3 blocks per slide.
- **Provide real content.** Anything missing stays in brackets for you to fill in.
- **Images are on you.** Send the client's logo and photos; Claude puts them in `public/assets/clients/[client]/`.
- **No real patient data.** Examples are always fictional: never a real name, date or exam.
- **Publishing creates a link.** Claude always scans the text and asks before publishing; check the content before
  saying yes. The link is private until you share it.

## How to request design system changes

Send them to Jason Santos or Felipe Farias, who approve and prioritize. Attach a screenshot when the problem is visual.

```markdown
Slide: [template name or deck + slide number]
What's wrong: [short description]
What it should look like: [what you expected]
Urgency: [need it today / this week / no rush]
```

## Known limits

- **Screens copied from Figma have a fixed number of items** (for example 3 phases or 4 cards). For a different
  number, ask for a content slide.
- **Published artifacts don't update themselves:** after changing the deck, ask Claude to rebuild and republish at
  the same link.
- **Large photos add weight:** the artifact is a single file with the images inside.
- More in [known-issues.md](known-issues.md).
