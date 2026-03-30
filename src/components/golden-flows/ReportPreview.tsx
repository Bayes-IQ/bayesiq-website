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
      return "bg-biq-status-error-subtle text-biq-status-error";
    case "medium":
      return "bg-biq-status-warning-subtle text-biq-status-warning";
    case "low":
      return "bg-biq-status-success-subtle text-biq-status-success";
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-biq-status-success";
  if (score >= 60) return "text-amber-500";
  return "text-biq-status-error";
}

function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-biq-status-success-subtle border-biq-status-success-subtle";
  if (score >= 60) return "bg-biq-status-warning-subtle border-biq-status-warning-subtle";
  return "bg-biq-status-error-subtle border-biq-status-error-subtle";
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
        <p className="text-xs font-semibold uppercase tracking-widest text-biq-text-muted">
          BayesIQ Data Reliability Audit
        </p>
        <h2 className="mt-1 text-2xl font-bold text-biq-text-primary">
          {verticalName}
        </h2>
        <p className="mt-1 text-sm text-biq-text-muted">
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
          <p className="text-xs font-medium text-biq-text-muted">Reliability Score</p>
          <p className="text-xs font-semibold text-biq-text-primary">{interpretation}</p>
        </div>
      </div>
    </div>
  );
}

function NarrativeParagraph({ text }: { text: string }) {
  return (
    <div className="mb-8" data-testid="report-narrative">
      <p className="text-[11px] font-medium uppercase tracking-wide text-biq-text-muted mb-2">
        Illustrative example — representative of BayesIQ audit deliverables
      </p>
      <p className="text-base leading-relaxed text-biq-text-secondary">{text}</p>
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
      <span className="font-medium text-biq-text-secondary">
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
            <th className="pb-2 pr-4 font-semibold text-biq-text-muted">Metric</th>
            <th className="pb-2 pr-4 font-semibold text-biq-text-muted">Period</th>
            <th className="pb-2 pr-4 font-semibold text-biq-text-muted text-right">Reported</th>
            <th className="pb-2 pr-4 font-semibold text-biq-text-muted text-right">Audited</th>
            <th className="pb-2 font-semibold text-biq-text-muted text-right">Delta</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={`${m.metric}-${m.period}`} className="border-b border-gray-100">
              <td className="py-2.5 pr-4 font-medium text-biq-text-primary">{m.metric}</td>
              <td className="py-2.5 pr-4 text-biq-text-secondary">{m.period}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-biq-text-secondary">
                {formatMetricValue(m.reported)}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-biq-text-secondary">
                {formatMetricValue(m.audited)}
              </td>
              <td className="py-2.5 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    Math.abs(m.delta_pct) > 10
                      ? "bg-biq-status-error-subtle text-biq-status-error"
                      : Math.abs(m.delta_pct) > 5
                        ? "bg-biq-status-warning-subtle text-biq-status-warning"
                        : "bg-biq-status-success-subtle text-biq-status-success"
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
          <p className="text-sm font-semibold text-biq-text-primary leading-snug">
            {risk.title}
          </p>
          <p className="mt-1 text-xs text-biq-text-muted leading-relaxed">
            {risk.business_impact}
          </p>
          {risk.rows_affected > 1 && (
            <p className="mt-1 text-xs text-biq-text-muted">
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
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-biq-surface-2 text-xs font-bold text-biq-text-secondary">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-biq-text-primary leading-snug">{action.action}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-biq-text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Owner:</span> {action.owner}
          </span>
          <span className="text-biq-text-muted">|</span>
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
    <div className="bg-biq-surface-0 shadow-md rounded-2xl max-w-3xl mx-auto p-8 relative" data-testid="report-document">
      <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider text-biq-status-warning bg-biq-status-warning-subtle border border-biq-status-warning-subtle px-2 py-0.5 rounded">
        Illustrative Example
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
          <h3 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
            Key Metrics: Reported vs Audited
          </h3>
          <MetricsTable metrics={report.key_metrics} />
        </div>
      )}

      {/* Top Findings */}
      {report.top_risks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
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
          <h3 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
            Recommended Actions
          </h3>
          <ol className="divide-y divide-gray-100">
            {report.recommended_actions.map((action, i) => (
              <ActionItem key={action.action} action={action} index={i} />
            ))}
          </ol>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-biq-text-muted">
        Prepared by BayesIQ · {report.key_metrics[0]?.period ?? "2025"}
      </div>
    </div>
  );
}
