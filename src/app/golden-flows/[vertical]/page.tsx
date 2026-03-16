import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerticalBySlug,
  getVerticals,
  getAllVerticalSlugs,
  getAllHookMetrics,
  getNarrative,
  getExecutiveQuestions,
  getTrajectory,
  getCascadeData,
  getDiscoverInsights,
  getBoardReport,
} from "@/lib/golden-flows";
import {
  loadGovernance,
  serializeGovernanceForClient,
} from "@/lib/governance";
import type { ApprovalStatusValue, GovernanceDetailData } from "@/lib/governance";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";
import StatusQuoComparison from "@/components/golden-flows/StatusQuoComparison";
import VerticalLanding from "@/components/golden-flows/VerticalLanding";
import AskButtons from "@/components/golden-flows/AskButtons";
import AskAndCascadeSection from "@/components/golden-flows/AskAndCascadeSection";
import GoldenFlowsCTA from "@/components/golden-flows/GoldenFlowsCTA";
import DiscoverInsights from "@/components/golden-flows/DiscoverInsights";
import FeedbackThreadList from "@/components/golden-flows/FeedbackThreadList";
import BusinessEventList from "@/components/golden-flows/BusinessEventList";
import TrustSummaryBar from "@/components/golden-flows/TrustSummaryBar";
import GovernanceDetailProvider from "@/components/golden-flows/GovernanceDetailProvider";
import ReportPreview from "@/components/golden-flows/ReportPreview";

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
  const narrative = getNarrative(slug);
  const executiveQuestions = getExecutiveQuestions(slug);
  const trajectory = getTrajectory(slug);
  const cascadeData = getCascadeData(slug);
  const discoverInsights = getDiscoverInsights(slug);
  const boardReport = getBoardReport(slug);

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

        <TrustSummaryBar summary={governance?.trustBadgeSummary ?? null} />

        {trajectory && executiveQuestions && (
          <VerticalLanding
            trajectory={trajectory}
            questions={executiveQuestions.questions}
            verticalName={vertical.display_name}
          />
        )}

        {narrative && <StatusQuoComparison narrative={narrative} />}

        {boardReport && <ReportPreview report={boardReport} />}

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-bayesiq-900 sm:text-4xl">
          {vertical.display_name}
        </h1>

        {/* If cascade data exists, render combined ask+cascade section;
            otherwise fall back to ask buttons only */}
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

        {/* Feedback Threads — GF-17 */}
        {feedbackItems.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-4">
              Feedback Threads
            </h2>
            <FeedbackThreadList feedbackItems={feedbackItems} />
          </section>
        )}

        {/* Business Events — GF-20 */}
        {businessEvents.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-4">
              Business Events
            </h2>
            <p className="text-sm text-bayesiq-500 mb-4">
              Metric changes and restatements flowing through governance review.
            </p>
            <BusinessEventList events={businessEvents} />
          </section>
        )}

        <GoldenFlowsCTA
          ctaLabel={narrative?.cta_label}
          vertical={vertical.display_name}
        />
      </main>
    </GovernanceDetailProvider>
  );
}
