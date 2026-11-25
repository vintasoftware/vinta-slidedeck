// Curated catalog of the template gallery (scripts/gallery.mjs): categories by use, in
// the order of a sales deck, with a plain-language label and hint per template. Maintained by hand: every pattern in
// Storybook must be here (the gallery lists the missing ones under "Uncategorized"). `pattern` = folder name in src/components/patterns
// (or an element with a full-screen story, e.g. Divider). `groups` splits a template's variants into labelled lists.
import { CASE_STUDIES } from '../src/components/patterns/SlideCaseStudy/cases.ts'

const caseGroups = [
  { label: 'Healthcare', ids: CASE_STUDIES.filter((c) => c.sector === 'health').map((c) => `patterns-slidecasestudy--${c.slug}`) },
  { label: 'Other industries', ids: CASE_STUDIES.filter((c) => c.sector !== 'health').map((c) => `patterns-slidecasestudy--${c.slug}`) },
]

export const catalog = [
  {
    title: 'Openers',
    hint: 'Covers and section openers.',
    items: [
      { pattern: 'SlideCover', label: 'Cover', hint: 'Deck cover: photo, live product or night versions.' },
      { pattern: 'SlideIntro', label: 'Cover (classic)', hint: 'The original Figma cover with the screenshot frame.' },
      { pattern: 'SlideStatement', label: 'Section opener', hint: 'One big claim with a few chips.' },
      { pattern: 'SlidePhotoBand', label: 'Section opener with photo', hint: 'Team photo band plus three cards.' },
      { pattern: 'Divider', label: 'Divider', hint: 'Full-screen divider in four color schemes.' },
    ],
  },
  {
    title: 'Agenda',
    hint: 'What the meeting covers.',
    items: [
      { pattern: 'SlideAgenda', label: 'Agenda', hint: 'Numbered topics with duration.' },
      { pattern: 'SlideSphereList', label: 'Agenda on the blue sphere', hint: 'Agenda or key numbers beside a blue sphere.' },
      { pattern: 'SlideNumberedList', label: 'Principles list', hint: 'Habits, principles or steps on a vertical rail.' },
    ],
  },
  {
    title: 'Who we are',
    hint: 'Vinta, the team and the clients.',
    items: [
      { pattern: 'SlideStoryStats', label: 'Our story + numbers', hint: 'Short story, four numbers and a photo.' },
      { pattern: 'SlideWhoIsVinta', label: 'Who is Vinta (classic)', hint: 'The approved Figma screen with metrics and logos.' },
      { pattern: 'SlideClientsWall', label: 'Client logos', hint: 'Logo wall on navy.' },
      { pattern: 'SlideTeam', label: 'Team cards', hint: 'Portrait ring, name, role and bio.' },
      { pattern: 'SlideTeamPhotos', label: 'Team with photos', hint: 'Studio portraits in cards.' },
      { pattern: 'SlideOrgTeam', label: 'Team by area', hint: 'Org chart with open seats.' },
    ],
  },
  {
    title: 'The problem',
    hint: 'What we heard and who the client is.',
    items: [
      { pattern: 'SlideWhatWeHeardCards', label: 'What we heard (3 cards)', hint: 'Classic Figma screen.' },
      { pattern: 'SlideWhatWeHeardGrid', label: 'What we heard (4 cards)', hint: 'Classic Figma screen with a summary.' },
      { pattern: 'SlideStatRows', label: 'Facts in rows', hint: 'Number, title and one sentence per row; progress or risk.' },
      { pattern: 'SlideProfileCards', label: 'Customer profile', hint: 'ICP or persona: attributes and pains on one slide.' },
      { pattern: 'SlideScopeReview', label: 'Scope review (classic)', hint: 'Coverage, concerns and approach.' },
    ],
  },
  {
    title: 'What we do',
    hint: 'Services, offer and why Vinta.',
    items: [
      { pattern: 'SlideServiceMenu', label: 'Services menu', hint: 'Services in groups, one highlighted.' },
      { pattern: 'SlideVsTable', label: 'Us vs the alternative', hint: 'Row-by-row comparison table.' },
      { pattern: 'SlideVersus', label: 'Two options side by side', hint: 'Left vs right lists.' },
      { pattern: 'SlidePointsPhoto', label: 'Points + photo', hint: 'Three or four points beside a big photo.' },
      { pattern: 'SlideFeaturePhoto', label: 'Offer + proof points', hint: 'One offer, three proofs, a stat chip.' },
      { pattern: 'SlideFeatureCards', label: 'Feature cards with photos', hint: 'Three or four cards with a photo header.' },
      { pattern: 'SlideIconCards', label: 'Pillars', hint: 'Three or four numbered cards.' },
      { pattern: 'SlideGlassRows', label: 'Layers (green / purple)', hint: 'Four rows on a colored panel.' },
      { pattern: 'SlideTwoPanels', label: 'Two audiences', hint: 'Two columns with tabs, e.g. practice vs patient.' },
      { pattern: 'SlideContent', label: 'Idea + points', hint: 'Title on the left, points card on the right.' },
      { pattern: 'SlideTwoColumn', label: 'Text + image', hint: 'Text and bullets beside a photo.' },
      { pattern: 'SlideProductShowcase', label: 'Product showcase', hint: 'The live product mock on blue.' },
      { pattern: 'SlideBuildingBlocks', label: 'Building blocks map', hint: 'The animated cube map from the site.' },
      { pattern: 'SlideBlocksCompare', label: 'Same block, different product', hint: 'Animated product carousel.' },
      { pattern: 'SlideCode', label: 'Code snippet', hint: 'A highlighted code window: an API, a config, a rule.' },
    ],
  },
  {
    title: 'How we work',
    hint: 'Approach, phases, timeline and deliverables.',
    items: [
      { pattern: 'SlideStepPath', label: 'Steps', hint: 'Three to five steps on a line.' },
      { pattern: 'SlideStepFocus', label: 'One step in detail', hint: 'Same stepper, one slide per phase.' },
      { pattern: 'SlideMonthTimeline', label: 'Timeline by month', hint: 'Columns per period with milestone bars.' },
      { pattern: 'SlideNumberedGrid', label: 'Action cards', hint: 'Numbered cards with bullet lists.' },
      { pattern: 'SlideDeliverables', label: 'Deliverables', hint: 'What the client gets, on blue.' },
      { pattern: 'SlideProposedApproach', label: 'Proposed approach (classic)', hint: 'Three stages and an estimate.' },
      { pattern: 'SlideProductTimeline', label: 'MVP journey (classic)', hint: 'Three phases with tasks.' },
      { pattern: 'SlideSprintSteps', label: 'Sprint steps (classic)', hint: 'Four steps of the sprint.' },
      { pattern: 'SlideJourneyOverall', label: 'Journey overview (classic)', hint: 'All phases on the blue arc.' },
      { pattern: 'SlideJourneySingleStep', label: 'Journey phase (classic)', hint: 'One phase with photos.' },
    ],
  },
  {
    title: 'Numbers & charts',
    hint: 'Results, KPIs and data.',
    items: [
      { pattern: 'SlideBigStat', label: 'Big numbers', hint: 'One to three impact numbers.' },
      { pattern: 'SlideStatCards', label: 'Three stat cards', hint: 'Three numbers in glass cards on blue.' },
      { pattern: 'SlideHeroNumber', label: 'One number (before → after)', hint: 'The number that matters, with points.' },
      { pattern: 'SlideKpiScorecard', label: 'KPI scorecard', hint: 'Grid of KPIs with deltas.' },
      { pattern: 'SlideStatTable', label: 'Number + table', hint: 'Headline number with a breakdown table.' },
      { pattern: 'SlideBarChart', label: 'Bar chart', hint: 'Values per period, grouped.' },
      { pattern: 'SlideStackedBars', label: 'Stacked bars', hint: 'Share per period (100% bars).' },
      { pattern: 'SlideLineChart', label: 'Line chart', hint: 'Trend vs a reference.' },
      { pattern: 'SlideDonutChart', label: 'Donut chart', hint: 'Parts of a whole plus takeaways.' },
      { pattern: 'SlideProgressRings', label: 'Percent rings', hint: 'Two or three percentages.' },
      { pattern: 'SlideFunnel', label: 'Funnel', hint: 'Pipeline stages.' },
      { pattern: 'SlideRankingBars', label: 'Ranking', hint: 'Ranked reasons with a callout.' },
      { pattern: 'SlideBeforeAfter', label: 'Before / after', hint: 'Metrics before and after.' },
      { pattern: 'SlideDataTable', label: 'Data table', hint: 'Rows with tags and badges.' },
    ],
  },
  {
    title: 'Investment',
    hint: 'Plans, prices and support.',
    items: [
      { pattern: 'SlideComparison', label: 'Plans comparison', hint: 'Options in a table, one highlighted.' },
      { pattern: 'SlideInvestmentPlans', label: 'Investment plans (classic)', hint: 'Two plans side by side.' },
      { pattern: 'SlideInvestmentSummary', label: 'Investment summary (classic)', hint: 'Price, timeline, scope, start date.' },
      { pattern: 'SlideMaintenanceServices', label: 'Maintenance (classic)', hint: 'Coverage vs exclusions.' },
    ],
  },
  {
    title: 'Cases & testimonials',
    hint: 'Proof from past work.',
    items: [
      { pattern: 'SlideCaseStudy', label: 'Case study', hint: 'One published case with photo, summary and numbers (30 ready).', groups: caseGroups },
      { pattern: 'SlideCaseHighlight', label: 'Case highlight', hint: 'One case told with a photo and numbers.' },
      { pattern: 'SlideClientCase', label: 'Client case (classic)', hint: 'Title, text and link over the hero photo.' },
      { pattern: 'SlideQuote', label: 'Testimonial', hint: 'One quote, full screen.' },
      { pattern: 'SlideQuotePhoto', label: 'Testimonial with photo', hint: 'Quote over a photo or beside a portrait.' },
      { pattern: 'SlideReviews', label: 'Three testimonials', hint: 'Three review cards.' },
    ],
  },
  {
    title: 'Closing',
    hint: 'Questions and next step.',
    items: [
      { pattern: 'SlideFaq', label: 'FAQ', hint: 'Questions with one answer open.' },
      { pattern: 'SlideBookCall', label: 'Book a call', hint: 'Closing with contact card and team avatars.' },
      { pattern: 'SlideClosing', label: 'Thank you (classic)', hint: 'The Figma closing screen.' },
    ],
  },
]
