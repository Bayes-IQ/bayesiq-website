import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerticalBySlug,
  getVerticals,
  getAllVerticalSlugs,
  getAllHookMetrics,
  getHookMetrics,
  getNarrative,
  getTrajectory,
  getDiscoverInsights,
  getBoardReport,
  getScreenshotManifest,
  getArtifactLinks,
} from "@/lib/golden-flows";
import {
  loadGovernance,
  serializeGovernanceForClient,
  serializeDecisionLog,
} from "@/lib/governance";
import type { ApprovalStatusValue, GovernanceDetailData } from "@/lib/governance";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";
import VerticalHero from "@/components/golden-flows/VerticalHero";
import RealityReveal from "@/components/golden-flows/RealityReveal";
import VerticalTabs from "@/components/golden-flows/VerticalTabs";
import GoldenFlowsCTA from "@/components/golden-flows/GoldenFlowsCTA";
import GovernanceProgressBar from "@/components/golden-flows/GovernanceProgressBar";
import DecisionLog from "@/components/golden-flows/DecisionLog";
import GovernanceDetailProvider from "@/components/golden-flows/GovernanceDetailProvider";
import ReportPreview from "@/components/golden-flows/ReportPreview";
import DashboardScreenshot from "@/components/golden-flows/DashboardScreenshot";

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
  const trajectory = getTrajectory(slug);
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

  // Pre-compute governance detail data (serializable for client GovernanceDetailPanel)
  const governanceDetailData: GovernanceDetailData | null = governance
    ? serializeGovernanceForClient(governance)
    : null;

  // Decision Log — human-reviewed governance decisions (excludes system records)
  const decisionLogEntries = governance ? serializeDecisionLog(governance) : [];

  // ── Tab content ──────────────────────────────────────────────

  // Dashboard tab: screenshot preview + explore link
  const dashboardScreenshot = screenshotManifest?.screenshots.find(
    (s) => s.type === "dashboard"
  ) ?? null;
  const dashboardLink =
    discoverInsights?.insights[0]?.dashboard_link ??
    artifactLinks?.artifacts.find((a) => a.type === "dashboard")?.url ??
    null;

  const dashboardContent = (
    <div data-testid="dashboard-grid">
      <div className="rounded-xl border border-bayesiq-200 bg-white shadow-sm overflow-hidden">
        <div className="min-h-[280px]">
          <DashboardScreenshot
            screenshot={dashboardScreenshot ? { url: dashboardScreenshot.url, alt_text: dashboardScreenshot.alt_text, type: "dashboard" } : null}
          />
        </div>
        {dashboardLink && (
          <div className="border-t border-bayesiq-100 px-5 py-3 flex items-center justify-between bg-bayesiq-50/50">
            <span className="text-xs text-bayesiq-500">Live interactive dashboard</span>
            <a
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-bayesiq-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-bayesiq-700 transition-colors"
            >
              Explore Full Dashboard
              <svg className="ml-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );

  const reportContent = (
    <>
      {boardReport && <ReportPreview report={boardReport} narrative={narrative} verticalName={vertical.display_name} />}
    </>
  );

  const workflowContent = (
    <div data-testid="workflow-tab">
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight text-bayesiq-900">
          Review &amp; Approval Log
        </h2>
        <p className="text-sm text-bayesiq-500 mt-1">
          Decisions and reviewer attribution for this audit.
        </p>
      </div>

      <GovernanceProgressBar summary={governance?.trustBadgeSummary ?? null} />

      {decisionLogEntries.length > 0 && (
        <DecisionLog entries={decisionLogEntries} />
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
