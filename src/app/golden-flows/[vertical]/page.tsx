import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerticalBySlug,
  getVerticals,
  getAllVerticalSlugs,
  getAllHookMetrics,
  getHookMetrics,
  getNarrative,
  getExecutiveQuestions,
  getTrajectory,
  getCascadeData,
  getDiscoverInsights,
  getBoardReport,
  getScreenshotManifest,
  getArtifactLinks,
} from "@/lib/golden-flows";
import {
  loadGovernance,
  serializeGovernanceForClient,
} from "@/lib/governance";
import type { ApprovalStatusValue, GovernanceDetailData } from "@/lib/governance";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";
import VerticalHero from "@/components/golden-flows/VerticalHero";
import RealityReveal from "@/components/golden-flows/RealityReveal";
import VerticalTabs from "@/components/golden-flows/VerticalTabs";
import AskButtons from "@/components/golden-flows/AskButtons";
import AskAndCascadeSection from "@/components/golden-flows/AskAndCascadeSection";
import GoldenFlowsCTA from "@/components/golden-flows/GoldenFlowsCTA";
import DiscoverInsights from "@/components/golden-flows/DiscoverInsights";
import FeedbackThreadList from "@/components/golden-flows/FeedbackThreadList";
import BusinessEventList from "@/components/golden-flows/BusinessEventList";
import TrustSummaryBar from "@/components/golden-flows/TrustSummaryBar";
import GovernanceDetailProvider from "@/components/golden-flows/GovernanceDetailProvider";
import ReportPreview from "@/components/golden-flows/ReportPreview";
import DashboardGrid from "@/components/golden-flows/DashboardGrid";
import RemediationArc from "@/components/golden-flows/RemediationArc";
import BayesIQDifference from "@/components/golden-flows/BayesIQDifference";

interface Props {
  params: Promise<{ vertical: string }>;
}

export async function generateStaticParams() {
  return getAllVerticalSlugs().map((slug) => ({ vertical: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical: slug } = await params;
  const vertical = getVerticalBySlug(slug);
  if (!vertical) return {};

  return {
    title: `${vertical.display_name} — Golden Flows — BayesIQ`,
    description: `See what BayesIQ found auditing ${vertical.display_name.toLowerCase()} data. Governed results, executive-ready.`,
    openGraph: {
      title: `${vertical.display_name} — Golden Flows — BayesIQ`,
      description: `See what BayesIQ found auditing ${vertical.display_name.toLowerCase()} data. Governed results, executive-ready.`,
    },
  };
}

export default async function VerticalPage({ params }: Props) {
  const { vertical: slug } = await params;
  const vertical = getVerticalBySlug(slug);

  if (!vertical) {
    notFound();
  }

  const verticals = getVerticals();
  const hookMetrics = getAllHookMetrics();
  const verticalHookMetrics = getHookMetrics(slug);
  const narrative = getNarrative(slug);
  const executiveQuestions = getExecutiveQuestions(slug);
  const trajectory = getTrajectory(slug);
  const cascadeData = getCascadeData(slug);
  const discoverInsights = getDiscoverInsights(slug);
  const boardReport = getBoardReport(slug);
  const screenshotManifest = getScreenshotManifest(slug);
  const artifactLinks = getArtifactLinks(slug);

  // Load governance data (null-safe — returns empty maps if unavailable)
  const governance = (() => {
    try {
      return loadGovernance();
    } catch {
      return null;
    }
  })();

  // Feedback threads (GF-17)
  const feedbackItems = governance?.feedbackById
    ? Array.from(governance.feedbackById.values())
    : [];

  // Business events (GF-20) — filter by vertical prefix
  const verticalPrefix = slug.replace(/-gf$/, "");
  const businessEvents = governance?.businessEventById
    ? Array.from(governance.businessEventById.values()).filter(
        (e) => e.event_id.startsWith(verticalPrefix + "_")
      )
    : [];

  // Pre-compute trust statuses as plain objects (serializable for client components)
  const trustStatuses: Record<string, ApprovalStatusValue> = {};
  if (governance) {
    for (const v of verticals) {
      const badge = governance.badgesByObjectId.get(v.slug);
      if (badge) {
        trustStatuses[v.slug] = badge.approval_status;
      }
    }
  }

  // Pre-compute trust badge object IDs (C-002, C-015: keys match vertical slugs)
  const trustBadgeObjectIds: Record<string, string> = {};
  if (governance) {
    for (const v of verticals) {
      const badge = governance.badgesByObjectId.get(v.slug);
      if (badge) {
        trustBadgeObjectIds[v.slug] = badge.object_id;
      }
    }
  }

  // Pre-compute cascade governance statuses
  const cascadeGovernanceStatuses: Record<string, ApprovalStatusValue> = {};
  if (governance && cascadeData) {
    for (const questionId of Object.keys(cascadeData.cascades)) {
      const item = governance.cascadeGovernanceByQuestionId.get(questionId);
      if (item) {
        cascadeGovernanceStatuses[questionId] = item.approval_status;
      }
    }
  }
  const hasCascades = cascadeData && Object.keys(cascadeData.cascades).length > 0;

  // Pre-compute governance detail data (serializable for client GovernanceDetailPanel)
  const governanceDetailData: GovernanceDetailData | null = governance
    ? serializeGovernanceForClient(governance)
    : null;

  // ── Tab content ──────────────────────────────────────────────

  // Dashboard tab: 2×2 widget grid + footer bar
  const dashboardScreenshot = screenshotManifest?.screenshots.find(
    (s) => s.type === "dashboard"
  ) ?? null;
  // Streamlit URL: prefer discover_insights dashboard_link, fall back to artifact_links
  const dashboardLink =
    discoverInsights?.insights[0]?.dashboard_link ??
    artifactLinks?.artifacts.find((a) => a.type === "dashboard")?.url ??
    null;

  const dashboardContent = boardReport && trajectory ? (
    <DashboardGrid
      boardReport={boardReport}
      snapshots={trajectory.snapshots}
      screenshotUrl={dashboardScreenshot?.url ?? null}
      screenshotAlt={dashboardScreenshot?.alt_text ?? null}
      dashboardLink={dashboardLink}
    />
  ) : null;

  const reportContent = (
    <>
      {boardReport && <ReportPreview report={boardReport} narrative={narrative} verticalName={vertical.display_name} />}
    </>
  );

  const workflowContent = (
    <div className="space-y-8">
      <TrustSummaryBar summary={governance?.trustBadgeSummary ?? null} />

      {executiveQuestions && hasCascades ? (
        <AskAndCascadeSection
          questions={executiveQuestions.questions}
          cascades={cascadeData.cascades}
          cascadeGovernanceStatuses={cascadeGovernanceStatuses}
        />
      ) : executiveQuestions ? (
        <AskButtons questions={executiveQuestions.questions} />
      ) : null}

      {discoverInsights && <DiscoverInsights data={discoverInsights} />}

      {feedbackItems.length > 0 && (
        <section>
          <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-4">
            Feedback Threads
          </h2>
          <FeedbackThreadList feedbackItems={feedbackItems} />
        </section>
      )}

      {businessEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-4">
            Business Events
          </h2>
          <p className="text-sm text-bayesiq-500 mb-4">
            Metric changes and restatements flowing through governance review.
          </p>
          <BusinessEventList events={businessEvents} />
        </section>
      )}
    </div>
  );

  // ── Page layout ──────────────────────────────────────────────

  return (
    <GovernanceDetailProvider data={governanceDetailData}>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <VerticalSelector
          verticals={verticals}
          hookMetrics={hookMetrics}
          currentSlug={slug}
          trustStatuses={trustStatuses}
          trustBadgeObjectIds={trustBadgeObjectIds}
        />

        {trajectory && (
          <VerticalHero
            trajectory={trajectory}
            boardReport={boardReport}
            narrative={narrative}
            hookMetrics={verticalHookMetrics}
            verticalName={vertical.display_name}
          />
        )}

        {boardReport && (
          <RealityReveal
            metrics={boardReport.key_metrics}
            topRisk={boardReport.top_risks[0] ?? null}
            headlineFinding={narrative?.headline_finding ?? null}
          />
        )}

        <VerticalTabs
          dashboard={dashboardContent}
          report={reportContent}
          workflow={workflowContent}
        />

        {trajectory && boardReport && (
          <RemediationArc
            snapshots={trajectory.snapshots}
            totalFindings={boardReport.total_findings}
            topAction={boardReport.recommended_actions[0] ?? null}
          />
        )}

        <BayesIQDifference />

        <GoldenFlowsCTA
          ctaLabel={narrative?.cta_label}
          vertical={vertical.display_name}
        />
      </main>
    </GovernanceDetailProvider>
  );
}
