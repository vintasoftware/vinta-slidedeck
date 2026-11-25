// The Vinta design system (ported from vinta-slidedeck-deprecated): site-look slide patterns + the elements
// they are built from. A single import surface (the deck runtime itself is @/lib):
//   import { SlideCover, SlideAgenda, Highlight } from "@/components";
// Catalog, limits and rules: src/components/CATALOG.md. Browse every pattern at /patterns.

// Patterns — full 1920×1080 slides
export * from "./patterns/SlideAgenda";
export * from "./patterns/SlideBarChart";
export * from "./patterns/SlideBeforeAfter";
export * from "./patterns/SlideBigStat";
export * from "./patterns/SlideBlocksCompare";
export * from "./patterns/SlideBookCall";
export * from "./patterns/SlideBuildingBlocks";
export * from "./patterns/SlideCaseHighlight";
export * from "./patterns/SlideCaseStudy";
export * from "./patterns/SlideClientCase";
export * from "./patterns/SlideClientsWall";
export * from "./patterns/SlideClosing";
export * from "./patterns/SlideCode";
export * from "./patterns/SlideComparison";
export * from "./patterns/SlideContent";
export * from "./patterns/SlideCover";
export * from "./patterns/SlideDataTable";
export * from "./patterns/SlideDeliverables";
export * from "./patterns/SlideDonutChart";
export * from "./patterns/SlideFaq";
export * from "./patterns/SlideFeatureCards";
export * from "./patterns/SlideFeaturePhoto";
export * from "./patterns/SlideFunnel";
export * from "./patterns/SlideGlassRows";
export * from "./patterns/SlideHeroNumber";
export * from "./patterns/SlideIconCards";
export * from "./patterns/SlideIntro";
export * from "./patterns/SlideInvestmentPlans";
export * from "./patterns/SlideInvestmentSummary";
export * from "./patterns/SlideJourneyOverall";
export * from "./patterns/SlideJourneySingleStep";
export * from "./patterns/SlideKpiScorecard";
export * from "./patterns/SlideLineChart";
export * from "./patterns/SlideMaintenanceServices";
export { SlideMonthTimeline } from "./patterns/SlideMonthTimeline";
// Renamed here: the TimelineBar *element* below owns that name in the barrel.
export type {
  SlideMonthTimelineProps,
  TimelineColumn as MonthTimelineColumn,
  TimelineBar as MonthTimelineBar,
} from "./patterns/SlideMonthTimeline";
export * from "./patterns/SlideNumberedGrid";
export * from "./patterns/SlideNumberedList";
export * from "./patterns/SlideOrgTeam";
export * from "./patterns/SlidePhotoBand";
export * from "./patterns/SlidePointsPhoto";
export * from "./patterns/SlideProductShowcase";
export * from "./patterns/SlideProductTimeline";
export * from "./patterns/SlideProfileCards";
export * from "./patterns/SlideProgressRings";
export * from "./patterns/SlideProposedApproach";
export * from "./patterns/SlideQuote";
export * from "./patterns/SlideQuotePhoto";
export * from "./patterns/SlideRankingBars";
export * from "./patterns/SlideReviews";
export * from "./patterns/SlideScopeReview";
export * from "./patterns/SlideServiceMenu";
export * from "./patterns/SlideShell";
export * from "./patterns/SlideSphereList";
export * from "./patterns/SlideSprintSteps";
export * from "./patterns/SlideStackedBars";
export * from "./patterns/SlideStatCards";
export * from "./patterns/SlideStatRows";
export * from "./patterns/SlideStatTable";
export * from "./patterns/SlideStatement";
export * from "./patterns/SlideStepFocus";
export * from "./patterns/SlideStepPath";
export * from "./patterns/SlideStoryStats";
export * from "./patterns/SlideTeam";
export * from "./patterns/SlideTeamPhotos";
export * from "./patterns/SlideTwoColumn";
export * from "./patterns/SlideTwoPanels";
export * from "./patterns/SlideVersus";
export * from "./patterns/SlideVsTable";
export * from "./patterns/SlideWhatWeHeardCards";
export * from "./patterns/SlideWhatWeHeardGrid";
export * from "./patterns/SlideWhoIsVinta";

// Elements — the atomic pieces patterns compose
export * from "./elements/ArtCard";
export * from "./elements/Badge";
export * from "./elements/BlockPreviews";
export * from "./elements/Body";
export * from "./elements/BulletList";
export * from "./elements/CardHeader";
export * from "./elements/ChevronStage";
export * from "./elements/ClientLogos";
export * from "./elements/CodeWindow";
export * from "./elements/ConcentricRings";
export * from "./elements/ContactCard";
export * from "./elements/CoverageCard";
export * from "./elements/CoverageRow";
export * from "./elements/DataTable";
export * from "./elements/DisplayTitle";
export * from "./elements/Divider";
export * from "./elements/Eyebrow";
export * from "./elements/Highlight";
export * from "./elements/IconBadge";
export * from "./elements/IconCard";
export * from "./elements/ImageFrame";
export * from "./elements/InsightCard";
export * from "./elements/JourneyStep";
export * from "./elements/Kicker";
export * from "./elements/Logo";
export * from "./elements/LogoStrip";
export * from "./elements/MetricGrid";
export * from "./elements/MetricItem";
export * from "./elements/NumberedRow";
export * from "./elements/PersonCard";
export * from "./elements/PhaseHeader";
export * from "./elements/PhotoSlot";
export * from "./elements/PricingCard";
export * from "./elements/Quote";
export * from "./elements/SectionLabel";
export * from "./elements/SlideHeader";
export * from "./elements/SpectrumTrack";
export * from "./elements/SplitCallout";
export * from "./elements/Stat";
export * from "./elements/StepCard";
export * from "./elements/StepRail";
export * from "./elements/Subtitle";
export * from "./elements/Tag";
export * from "./elements/TagCard";
export * from "./elements/TagGroup";
export * from "./elements/TextLink";
export * from "./elements/TimelineBar";
export * from "./elements/VividBackground";
export * from "./elements/VividCard";

// Shared helpers (tone resolution, accent/mode types)
export * from "./shared/slideTone";
export * from "./shared/types";
