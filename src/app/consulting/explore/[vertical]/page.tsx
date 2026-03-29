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
import type { GovernanceDetailData } from "@/lib/governance";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";
import VerticalHero from "@/components/golden-flows/VerticalHero";
import RealityReveal from "@/components/golden-flows/RealityReveal";
import VerticalTabs from "@/components/golden-flows/VerticalTabs";
import GoldenFlowsCTA from "@/components/golden-flows/GoldenFlowsCTA";
import GovernanceProgressBar from "@/components/golden-flows/GovernanceProgressBar";
import DecisionLog from "@/components/golden-flows/DecisionLog";
import GovernanceDetailProvider from "@/components/golden-flows/GovernanceDetailProvider";
import ReportPreview from "@/components/golden-flows/ReportPreview";
import DashboardGrid from "@/components/golden-flows/DashboardGrid";
import WhyThisMatters from "@/components/golden-flows/WhyThisMatters";
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
    title: `Explore a Live Engagement: ${vertical.display_name} — BayesIQ`,
    description:
      "Walk through a real governed analytics engagement end-to-end. Scored audits, board reports, and governance workflows — powered by BayesIQ.",
    openGraph: {
      title: `Explore a Live Engagement: ${vertical.display_name} — BayesIQ`,
      description:
        "Walk through a real governed analytics engagement end-to-end. Scored audits, board reports, and governance workflows — powered by BayesIQ.",
    },
  };
}

export default async function ExploreVerticalPage({ params }: Props) {
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

  // Pre-compute governance detail data (serializable for client GovernanceDetailPanel)
  const governanceDetailData: GovernanceDetailData | null = governance
    ? serializeGovernanceForClient(governance)
    : null;

  // Decision Log — human-reviewed governance decisions (excludes system records)
  const verticalPrefix = slug.replace(/-gf$/, "");
  const decisionLogEntries = governance ? serializeDecisionLog(governance, verticalPrefix) : [];

  // ── Tab content ──────────────────────────────────────────────

  // Dashboard tab: screenshot preview + explore link
  const dashboardScreenshot = screenshotManifest?.screenshots.find(
    (s) => s.type === "dashboard"
  ) ?? null;
  const dashboardLink =
    discoverInsights?.insights[0]?.dashboard_link ??
    artifactLinks?.artifacts.find((a) => a.type === "dashboard")?.url ??
    null;

  const dashboardContent = boardReport && trajectory ? (
    <DashboardGrid
      boardReport={boardReport}
      snapshots={trajectory.snapshots}
      screenshotUrl={dashboardScreenshot?.url || null}
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
    <div data-testid="workflow-tab">
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight text-biq-text-primary">
          Governance
        </h2>
        <p className="text-sm text-biq-text-muted mt-1">
          Every metric change is reviewed, attributed, and traceable.
        </p>
        <p className="text-xs text-biq-text-muted mt-2 italic">
          Illustrative example — shows how BayesIQ governs metric changes with named reviewers, decisions, and evidence trails.
        </p>
      </div>

      <GovernanceProgressBar entries={decisionLogEntries} />

      {decisionLogEntries.length > 0 && boardReport ? (
        <>
          <p className="text-sm text-biq-text-secondary mb-3">
            The {boardReport.total_findings} discrepanc{boardReport.total_findings === 1 ? "y" : "ies"} identified in the Board Report {boardReport.total_findings === 1 ? "was" : "were"} routed for governance review:
          </p>
          <DecisionLog entries={decisionLogEntries} />
        </>
      ) : (
        <p className="text-sm text-biq-text-muted italic">
          Governance decisions for this vertical will appear here as findings are reviewed.
        </p>
      )}

      {/* Bridge to Dashboard tab */}
      <div className="mt-8 pt-6 border-t border-biq-border-subtle text-center">
        <p className="text-sm text-biq-text-secondary">
          Once all findings are reviewed and remediated, corrected data flows into the certified dashboard →
        </p>
      </div>
    </div>
  );

  // ── Page layout ──────────────────────────────────────────────

  return (
    <GovernanceDetailProvider data={governanceDetailData}>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Framing copy */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-biq-text-primary sm:text-4xl">
            Explore a Live Engagement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-biq-text-secondary">
            This is what a governed analytics engagement looks like end-to-end.
            Select an industry to walk through real findings, board reports, and
            governance workflows.
          </p>
        </div>

        <VerticalSelector
          verticals={verticals}
          hookMetrics={hookMetrics}
          currentSlug={slug}
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
            risks={boardReport.top_risks}
            headlineFinding={narrative?.headline_finding ?? null}
          />
        )}

        <VerticalTabs
          dashboard={dashboardContent}
          report={reportContent}
          workflow={workflowContent}
        />

        {/* Deliverables bar */}
        <div className="mt-10 rounded-xl border border-biq-border bg-white px-6 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-biq-text-muted mb-3">
            Deliverables
          </p>
          <div className="flex flex-wrap gap-3">
            {dashboardLink && (
              <a
                href={dashboardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-biq-border px-4 py-2 text-sm font-medium text-biq-text-secondary hover:bg-biq-surface-1 transition-colors"
              >
                <svg className="h-4 w-4 text-biq-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 4 2 5-6" />
                </svg>
                Live Dashboard
              </a>
            )}
            <a
              href={`/golden-flows/${slug}/audit_report.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-biq-border px-4 py-2 text-sm font-medium text-biq-text-secondary hover:bg-biq-surface-1 transition-colors"
            >
              <svg className="h-4 w-4 text-biq-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Audit Report
            </a>
          </div>
        </div>

        {boardReport && boardReport.top_risks.length > 0 && (
          <WhyThisMatters risks={boardReport.top_risks} />
        )}

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
