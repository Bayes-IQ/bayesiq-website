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
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-600";
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
  const delta = latest.score - first.score;
  const metric = boardReport.key_metrics[0] ?? null;

  return (
    <div data-testid="dashboard-grid">
      {/* Stat bar — score, key metric, top finding in one horizontal row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Score */}
        <div className="rounded-xl border border-bayesiq-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400">
            Reliability Score
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-extrabold tabular-nums ${scoreColor(boardReport.score)}`}>
              {boardReport.score}
            </span>
            {snapshots.length > 1 && (
              <span className={`text-xs font-medium ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                {first.score} → {latest.score}
              </span>
            )}
          </div>
          <p className="text-[11px] text-bayesiq-500 mt-0.5">{boardReport.interpretation}</p>
        </div>

        {/* Key Metric */}
        <div className="rounded-xl border border-bayesiq-200 bg-white px-4 py-3 shadow-sm">
          {metric ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400">
                {metric.metric.replace(/_/g, " ")}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold tabular-nums text-bayesiq-900">
                  {formatMetricValue(metric.audited)}
                </span>
                <span className={`text-[11px] font-semibold ${
                  Math.abs(metric.delta_pct) > 10 ? "text-red-600"
                    : Math.abs(metric.delta_pct) > 5 ? "text-amber-600"
                    : "text-green-600"
                }`}>
                  {metric.delta_pct > 0 ? "overstated" : "understated"} {Math.abs(metric.delta_pct)}%
                </span>
              </div>
              <p className="text-[11px] text-bayesiq-500 mt-0.5">{metric.period} · audited value</p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400">Assessment</p>
              <p className="text-sm text-bayesiq-700 mt-1">{boardReport.interpretation}</p>
            </>
          )}
        </div>

        {/* Status — post-remediation */}
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
            Post-Remediation
          </p>
          <p className="text-sm font-semibold text-green-800 mt-1">
            Data certified
          </p>
          <p className="text-[11px] text-green-600 mt-0.5">
            {boardReport.total_findings} finding{boardReport.total_findings !== 1 ? "s" : ""} reviewed · metrics verified
          </p>
        </div>
      </div>

      {/* Dashboard preview — full width, prominent */}
      <div className="mt-4 rounded-xl border border-bayesiq-200 bg-white shadow-sm overflow-hidden">
        <div className="min-h-[240px]">
          <DashboardScreenshot
            screenshot={screenshotUrl ? { url: screenshotUrl, alt_text: screenshotAlt ?? "Dashboard preview", type: "dashboard" } : null}
          />
        </div>
        {dashboardLink && (
          <div className="border-t border-bayesiq-100 px-4 py-2.5 flex items-center justify-between bg-bayesiq-50/50">
            <span className="text-xs text-bayesiq-500">Live interactive dashboard</span>
            <a
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-bayesiq-600 hover:text-bayesiq-800 transition-colors"
            >
              Open Live Dashboard →
            </a>
          </div>
        )}
      </div>

      {/* Explore bar */}
      {dashboardLink && (
        <div className="mt-3 flex items-center justify-center rounded-lg bg-bayesiq-50 border border-bayesiq-200 px-4 py-3">
          <a
            href={dashboardLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-bayesiq-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-bayesiq-700 transition-colors"
          >
            Explore Full Dashboard
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
