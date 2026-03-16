import type { BoardReport, BoardReportSeverity } from "@/lib/golden-flows";
import type { TrajectorySnapshot } from "@/types/golden-flows/contract-b/trajectory";
import ScoreTrajectory from "./ScoreTrajectory";
import DashboardScreenshot from "./DashboardScreenshot";

interface Props {
  boardReport: BoardReport;
  snapshots: TrajectorySnapshot[];
  screenshotUrl: string | null;
  screenshotAlt: string | null;
  dashboardLink: string | null;
}

function severityBadge(severity: BoardReportSeverity): string {
  switch (severity) {
    case "high": return "bg-red-100 text-red-700";
    case "medium": return "bg-amber-100 text-amber-700";
    case "low": return "bg-green-100 text-green-700";
  }
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
  const topRisk = boardReport.top_risks[0] ?? null;

  const cardClass = "rounded-xl border border-bayesiq-200 bg-white p-5 shadow-sm";

  return (
    <div data-testid="dashboard-grid">
      {/* 2×2 widget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Widget 1 — Score Gauge */}
        <div className={cardClass}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400 mb-2">
            Reliability Score
          </p>
          <p className={`text-4xl font-extrabold tabular-nums ${scoreColor(boardReport.score)}`}>
            {boardReport.score}
          </p>
          <p className="text-sm text-bayesiq-600 mt-1">{boardReport.interpretation}</p>
          {snapshots.length > 1 && (
            <p className={`text-xs font-medium mt-2 ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
              {first.score} → {latest.score} ({delta >= 0 ? "+" : ""}{delta} pts)
            </p>
          )}
        </div>

        {/* Widget 2 — Key Metric */}
        <div className={cardClass}>
          {metric ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400 mb-2">
                {metric.metric.replace(/_/g, " ")}
              </p>
              <p className="text-3xl font-bold tabular-nums text-bayesiq-900">
                {formatMetricValue(metric.audited)}
              </p>
              <p className="text-xs text-bayesiq-500 mt-1">{metric.period} · audited</p>
              <span className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                Math.abs(metric.delta_pct) > 10 ? "bg-red-100 text-red-700"
                  : Math.abs(metric.delta_pct) > 5 ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {metric.delta_pct > 0 ? "+" : ""}{metric.delta_pct}% vs reported
              </span>
            </>
          ) : (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400 mb-2">
                Assessment
              </p>
              <p className="text-sm text-bayesiq-700">{boardReport.interpretation}</p>
              <p className="text-xs text-bayesiq-500 mt-2">
                {boardReport.total_findings} finding{boardReport.total_findings !== 1 ? "s" : ""} identified
              </p>
            </>
          )}
        </div>

        {/* Widget 3 — Top Finding */}
        <div className={cardClass}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400 mb-2">
            Top Finding
          </p>
          {topRisk ? (
            <>
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityBadge(topRisk.severity)}`}>
                  {topRisk.severity}
                </span>
                <p className="text-sm font-semibold text-bayesiq-900 leading-snug">
                  {topRisk.title}
                </p>
              </div>
              <p className="mt-2 text-xs text-bayesiq-500 leading-relaxed">
                {topRisk.business_impact}
              </p>
            </>
          ) : (
            <p className="text-sm text-bayesiq-500">No findings</p>
          )}
        </div>

        {/* Widget 4 — Dashboard Preview */}
        <div className={cardClass + " flex flex-col"}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bayesiq-400 mb-2">
            Live Dashboard
          </p>
          <div className="flex-1 min-h-[120px]">
            <DashboardScreenshot
              screenshot={screenshotUrl ? { url: screenshotUrl, alt_text: screenshotAlt ?? "Dashboard preview", type: "dashboard" } : null}
            />
          </div>
          {dashboardLink && (
            <a
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs font-medium text-bayesiq-600 hover:text-bayesiq-800 transition-colors"
            >
              Open Live Dashboard →
            </a>
          )}
        </div>
      </div>

      {/* Footer bar — findings summary + explore button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-bayesiq-50 border border-bayesiq-200 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-bayesiq-600">
            {boardReport.total_findings} finding{boardReport.total_findings !== 1 ? "s" : ""}
          </span>
          {Object.entries(boardReport.findings_by_severity).map(([sev, count]) => (
            <span
              key={sev}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${severityBadge(sev as BoardReportSeverity)}`}
            >
              {count} {sev}
            </span>
          ))}
        </div>
        {dashboardLink ? (
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
        ) : (
          <span className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed">
            Explore Full Dashboard
          </span>
        )}
      </div>
    </div>
  );
}
