import type {
  BoardReport,
  BoardReportMetric,
  BoardReportRisk,
  BoardReportAction,
  BoardReportSeverity,
} from "@/lib/golden-flows";

interface Props {
  report: BoardReport;
}

// --------------- Severity helpers ---------------

function severityBadge(severity: BoardReportSeverity): string {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-green-100 text-green-700";
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-600";
}

function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function effortLabel(effort: "S" | "M" | "L"): string {
  switch (effort) {
    case "S":
      return "Small";
    case "M":
      return "Medium";
    case "L":
      return "Large";
  }
}

// --------------- Sub-components ---------------

function ScoreBadge({ score, interpretation }: { score: number; interpretation: string }) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border px-6 py-4 ${scoreBgColor(score)}`}>
      <span className={`text-5xl font-bold tabular-nums ${scoreColor(score)}`}>
        {score}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-bayesiq-500">Reliability Score</p>
        <p className="text-sm font-semibold text-bayesiq-800">{interpretation}</p>
      </div>
    </div>
  );
}

function MetricsTable({ metrics }: { metrics: BoardReportMetric[] }) {
  if (metrics.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bayesiq-200 text-left">
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500">Metric</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500">Period</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500 text-right">Reported</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500 text-right">Audited</th>
            <th className="pb-2 font-semibold text-bayesiq-500 text-right">Delta</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={`${m.metric}-${m.period}`} className="border-b border-bayesiq-100">
              <td className="py-2.5 pr-4 font-medium text-bayesiq-800">{m.metric}</td>
              <td className="py-2.5 pr-4 text-bayesiq-600">{m.period}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-bayesiq-700">
                {formatMetricValue(m.reported)}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-bayesiq-700">
                {formatMetricValue(m.audited)}
              </td>
              <td className="py-2.5 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    Math.abs(m.delta_pct) > 10
                      ? "bg-red-100 text-red-700"
                      : Math.abs(m.delta_pct) > 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {m.delta_pct > 0 ? "+" : ""}{m.delta_pct}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatMetricValue(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (value < 1) {
    // Likely a rate/percentage — show as percentage
    return (value * 100).toFixed(1) + "%";
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function FindingCard({ risk }: { risk: BoardReportRisk }) {
  return (
    <div className="rounded-lg border border-bayesiq-200 bg-white px-4 py-3">
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityBadge(risk.severity)}`}
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
          {risk.rows_affected > 1 && (
            <p className="mt-1 text-xs text-bayesiq-400">
              {risk.rows_affected.toLocaleString()} rows affected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionItem({ action, index }: { action: BoardReportAction; index: number }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bayesiq-100 text-xs font-bold text-bayesiq-600">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-bayesiq-800 leading-snug">{action.action}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-bayesiq-500">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Owner:</span> {action.owner}
          </span>
          <span className="text-bayesiq-300">|</span>
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Effort:</span> {effortLabel(action.effort)}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityBadge(action.severity)}`}
          >
            {action.severity}
          </span>
        </div>
      </div>
    </li>
  );
}

// --------------- Main Component ---------------

export default function ReportPreview({ report }: Props) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-1">
        Board Report Preview
      </h2>
      <p className="text-sm text-bayesiq-500 mb-6">
        Executive deliverable from the latest audit cycle.
      </p>

      <div className="space-y-6 rounded-2xl border border-bayesiq-200 bg-bayesiq-50/50 p-6">
        {/* Score + Findings summary row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <ScoreBadge score={report.score} interpretation={report.interpretation} />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-bayesiq-600">
              {report.total_findings} finding{report.total_findings !== 1 ? "s" : ""}
            </span>
            {Object.entries(report.findings_by_severity).map(([sev, count]) => (
              <span
                key={sev}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${severityBadge(sev as BoardReportSeverity)}`}
              >
                {count} {sev}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        {report.key_metrics.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
              Key Metrics: Reported vs Audited
            </h3>
            <MetricsTable metrics={report.key_metrics} />
          </div>
        )}

        {/* Top Findings */}
        {report.top_risks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
              Top Findings
            </h3>
            <div className="space-y-2">
              {report.top_risks.map((risk) => (
                <FindingCard key={risk.title} risk={risk} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {report.recommended_actions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
              Recommended Actions
            </h3>
            <ol className="divide-y divide-bayesiq-100">
              {report.recommended_actions.map((action, i) => (
                <ActionItem key={action.action} action={action} index={i} />
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
