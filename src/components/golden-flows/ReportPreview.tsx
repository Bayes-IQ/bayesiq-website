import type {
  BoardReport,
  BoardReportMetric,
  BoardReportRisk,
  BoardReportAction,
  BoardReportSeverity,
  VerticalNarrativePayload,
} from "@/lib/golden-flows";

interface Props {
  report: BoardReport;
  narrative?: VerticalNarrativePayload | null;
  verticalName?: string;
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

function DocumentHeader({
  verticalName,
  score,
  interpretation,
}: {
  verticalName: string;
  score: number;
  interpretation: string;
}) {
  return (
    <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bayesiq-400">
          BayesIQ Data Reliability Audit
        </p>
        <h2 className="mt-1 text-2xl font-bold text-bayesiq-900">
          {verticalName}
        </h2>
        <p className="mt-1 text-sm text-bayesiq-500">
          Audit Period: December 2025
        </p>
      </div>
      <div
        data-testid="report-score-badge"
        className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${scoreBgColor(score)}`}
      >
        <span className={`text-4xl font-bold tabular-nums ${scoreColor(score)}`}>
          {score}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-bayesiq-500">Reliability Score</p>
          <p className="text-xs font-semibold text-bayesiq-800">{interpretation}</p>
        </div>
      </div>
    </div>
  );
}

function NarrativeParagraph({ text }: { text: string }) {
  return (
    <div className="mb-8" data-testid="report-narrative">
      <p className="text-[11px] font-medium uppercase tracking-wide text-bayesiq-400 mb-2">
        Hypothetical example — illustrates the type of report BayesIQ produces
      </p>
      <p className="text-base leading-relaxed text-bayesiq-700">{text}</p>
    </div>
  );
}

function FindingsSummary({
  totalFindings,
  findingsBySeverity,
}: {
  totalFindings: number;
  findingsBySeverity: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
      <span className="font-medium text-bayesiq-600">
        {totalFindings} finding{totalFindings !== 1 ? "s" : ""}
      </span>
      {Object.entries(findingsBySeverity).map(([sev, count]) => (
        <span
          key={sev}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${severityBadge(sev as BoardReportSeverity)}`}
        >
          {count} {sev}
        </span>
      ))}
    </div>
  );
}

function MetricsTable({ metrics }: { metrics: BoardReportMetric[] }) {
  if (metrics.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500">Metric</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500">Period</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500 text-right">Reported</th>
            <th className="pb-2 pr-4 font-semibold text-bayesiq-500 text-right">Audited</th>
            <th className="pb-2 font-semibold text-bayesiq-500 text-right">Delta</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={`${m.metric}-${m.period}`} className="border-b border-gray-100">
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
                  {m.delta_pct > 0 ? "overstated" : "understated"} {Math.abs(m.delta_pct)}%
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
    <div className="rounded-lg border border-gray-150 bg-gray-50/50 px-4 py-3">
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

export default function ReportPreview({ report, narrative, verticalName }: Props) {
  const displayName = verticalName ?? "Vertical";

  // Narrative text: prefer executive_summary, fall back to narrative.with_bayesiq
  const narrativeText =
    report.executive_summary ?? narrative?.with_bayesiq ?? null;

  return (
    <div className="bg-white shadow-md rounded-2xl max-w-3xl mx-auto p-8 relative" data-testid="report-document">
      <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
        Hypothetical Example
      </span>
      <DocumentHeader
        verticalName={displayName}
        score={report.score}
        interpretation={report.interpretation}
      />

      {narrativeText && <NarrativeParagraph text={narrativeText} />}

      <FindingsSummary
        totalFindings={report.total_findings}
        findingsBySeverity={report.findings_by_severity}
      />

      {/* Key Metrics */}
      {report.key_metrics.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
            Key Metrics: Reported vs Audited
          </h3>
          <MetricsTable metrics={report.key_metrics} />
        </div>
      )}

      {/* Top Findings */}
      {report.top_risks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
            Top Findings
          </h3>
          <div className="space-y-2">
            {report.top_risks.map((risk) => (
              <FindingCard key={risk.title} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions — faded to suggest more content below */}
      {report.recommended_actions.length > 0 && (
        <div className="relative">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">
            Recommended Actions
          </h3>
          <ol className="divide-y divide-gray-100">
            {report.recommended_actions.map((action, i) => (
              <ActionItem key={action.action} action={action} index={i} />
            ))}
          </ol>
          {/* Fade overlay to suggest document continues */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-bayesiq-400">
        Prepared by BayesIQ · {report.key_metrics[0]?.period ?? "2025"}
      </div>
    </div>
  );
}
