import type { BoardReport } from "@/lib/golden-flows";
import type { TrajectorySnapshot } from "@/types/golden-flows/contract-b/trajectory";
import DashboardScreenshot from "./DashboardScreenshot";

interface Props {
  boardReport: BoardReport;
  snapshots: TrajectorySnapshot[];
  screenshotUrl: string | null;
  screenshotAlt: string | null;
  dashboardLink: string | null;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-biq-status-success";
  if (score >= 60) return "text-amber-500";
  return "text-biq-status-error";
}

function formatMetricValue(value: number): string {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (value < 1) return (value * 100).toFixed(1) + "%";
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function DashboardGrid({
  boardReport,
  snapshots,
  screenshotUrl,
  screenshotAlt,
  dashboardLink,
}: Props) {
  const first = snapshots[0];
  const latest = snapshots[snapshots.length - 1];
  const metric = boardReport.key_metrics[0] ?? null;

  return (
    <div data-testid="dashboard-grid">
      {/* Before / After comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Before */}
        <div className="rounded-xl border border-biq-status-error-subtle bg-biq-status-error-subtle/50 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-3">
            Before BayesIQ
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-biq-status-error">Reliability Score</span>
              <span className="text-xl font-bold tabular-nums text-biq-status-error">{first.score}</span>
            </div>
            {metric && (
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-biq-status-error">{metric.metric.replace(/_/g, " ")}</span>
                <span className="text-sm font-semibold tabular-nums text-biq-status-error">
                  {formatMetricValue(metric.reported)}
                  <span className="text-[10px] font-normal ml-1 text-red-400">reported</span>
                </span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-biq-status-error">Findings</span>
              <span className="text-sm font-semibold text-biq-status-error">
                {boardReport.total_findings} unresolved
              </span>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="rounded-xl border border-biq-status-success-subtle bg-biq-status-success-subtle/50 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-biq-status-success mb-3">
            After BayesIQ
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-biq-status-success">Reliability Score</span>
              <span className={`text-xl font-bold tabular-nums ${scoreColor(latest.score)}`}>{latest.score}</span>
            </div>
            {metric && (
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-biq-status-success">{metric.metric.replace(/_/g, " ")}</span>
                <span className="text-sm font-semibold tabular-nums text-green-800">
                  {formatMetricValue(metric.audited)}
                  <span className="text-[10px] font-normal ml-1 text-green-500">verified ✓</span>
                </span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-biq-status-success">Findings</span>
              <span className="text-sm font-semibold text-green-800">
                {boardReport.total_findings} reviewed ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard preview with real screenshot */}
      <div className="rounded-xl border border-biq-border bg-biq-surface-0 shadow-sm overflow-hidden">
        <DashboardScreenshot
          screenshot={screenshotUrl ? { url: screenshotUrl, alt_text: screenshotAlt ?? "Dashboard preview", type: "dashboard" } : null}
        />
        {dashboardLink && (
          <div className="border-t border-biq-border-subtle px-5 py-3 flex items-center justify-between bg-biq-surface-1/50">
            <span className="text-xs text-biq-text-muted">Live interactive dashboard — certified data</span>
            <a
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-biq-text-secondary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-biq-text-secondary transition-colors"
            >
              Open Live Dashboard
              <svg className="ml-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Forward-looking: ongoing monitoring */}
      <div className="mt-4 rounded-lg border border-biq-border-subtle bg-biq-surface-1/30 px-5 py-3">
        <p className="text-sm text-biq-text-secondary">
          <span className="font-semibold">Going forward:</span>{" "}
          BayesIQ continuously validates metric calculations and flags discrepancies before they reach reporting. New data quality issues are surfaced within hours, not quarters.
        </p>
      </div>
    </div>
  );
}
