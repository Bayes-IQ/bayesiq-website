import type { BoardReportMetric } from "@/lib/golden-flows";

interface Props {
  metric: BoardReportMetric;
}

/**
 * Single metric card showing audited value and delta badge.
 * C-012: Uses metric.delta_pct directly — does not recompute from values.
 */
export default function MetricCard({ metric }: Props) {
  const absDelta = Math.abs(metric.delta_pct);

  // Color by magnitude: >10% red, >5% amber, else green
  const badgeColor =
    absDelta > 10
      ? "bg-biq-status-error-subtle text-biq-status-error"
      : absDelta > 5
        ? "bg-biq-status-warning-subtle text-biq-status-warning"
        : "bg-biq-status-success-subtle text-biq-status-success";

  const direction = metric.delta_pct > 0 ? "overstated" : "understated";
  const deltaText = `${direction} ${absDelta.toFixed(1)}%`;

  // Format audited value: if < 1, show as percentage; otherwise show as number
  const formattedValue =
    metric.audited < 1 && metric.audited > 0
      ? `${(metric.audited * 100).toFixed(1)}%`
      : metric.audited.toLocaleString();

  // Human-readable metric name
  const metricName = metric.metric.replace(/_/g, " ");

  return (
    <div className="rounded-xl border border-biq-border bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-biq-text-muted">
        {metricName}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-biq-text-primary">
          {formattedValue}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
        >
          {deltaText}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-biq-text-muted">{metric.period}</p>
    </div>
  );
}
