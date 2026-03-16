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
import ScoreTrajectory from "@/components/golden-flows/ScoreTrajectory";

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

  const dashboardContent = (
    <div>
      {trajectory && (
        <div className="flex justify-center">
          <ScoreTrajectory snapshots={trajectory.snapshots} />
        </div>
      )}
      {boardReport && boardReport.top_risks.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-400">
            Key Findings
          </h3>
          {boardReport.top_risks.map((risk) => (
            <div
              key={risk.title}
              className="rounded-lg border border-bayesiq-200 bg-white px-4 py-3"
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    risk.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : risk.severity === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {risk.severity}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bayesiq-900 leading-snug">
                    {risk.title}
                  </p>
                  <p className="mt-1 text-xs text-bayesiq-500 leading-relaxed">
                    {risk.business_impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const reportContent = (
    <>
      {boardReport && <ReportPreview report={boardReport} />}
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

        <GoldenFlowsCTA
          ctaLabel={narrative?.cta_label}
          vertical={vertical.display_name}
        />
      </main>
    </GovernanceDetailProvider>
  );
}
