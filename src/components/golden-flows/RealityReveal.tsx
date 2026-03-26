import type { BoardReportMetric, BoardReportRisk } from "@/lib/golden-flows";

interface Props {
  metrics: BoardReportMetric[];
  risks: BoardReportRisk[];
  headlineFinding: string | null;
}

function formatValue(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (value < 1) {
    return (value * 100).toFixed(1) + "%";
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** Find the risk most relevant to a given metric by matching metric name in risk title */
function findMatchingRisk(metric: BoardReportMetric, risks: BoardReportRisk[]): BoardReportRisk | null {
  // First try: exact metric name match in title
  const match = risks.find((r) => r.title.includes(metric.metric));
  if (match) return match;
  // Fallback: first risk
  return risks[0] ?? null;
}

export default function RealityReveal({
  metrics,
  risks,
  headlineFinding,
}: Props) {
  if (metrics.length === 0) return null;

  // Show 1-2 most dramatic metrics (highest absolute delta)
  const sorted = [...metrics].sort(
    (a, b) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct)
  );
  const shown = sorted.slice(0, 2);

  return (
    <section className="mt-6">
      <div className="rounded-xl border border-biq-border bg-biq-surface-1/50 p-6">
        <div className="space-y-5">
          {shown.map((m) => {
            const matchedRisk = findMatchingRisk(m, risks);
            return (
              <div
                key={`${m.metric}-${m.period}`}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
              >
                {/* Reported */}
                <div className="rounded-lg bg-biq-status-error-subtle/60 border border-red-100 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                    Reported
                  </p>
                  <p className="text-xl tabular-nums text-biq-status-error/70">
                    {formatValue(m.reported)}
                  </p>
                  <p className="text-xs text-red-400 mt-1">
                    {m.metric.replace(/_/g, " ")} &middot; {m.period}
                  </p>
                </div>

                {/* Audited */}
                <div className="rounded-lg bg-biq-status-success-subtle border border-green-100 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-biq-status-success mb-1">
                    Audited
                  </p>
                  <p className="text-xl font-bold tabular-nums text-green-800">
                    {formatValue(m.audited)}
                  </p>
                  <p className="text-xs text-biq-status-success/70 mt-1">
                    {m.delta_pct > 0 ? "Overstated" : "Understated"} {Math.abs(m.delta_pct)}%
                  </p>
                </div>

                {/* Decision exposure — matched to this metric's risk */}
                <div className="rounded-lg bg-biq-status-warning-subtle/70 border border-amber-100 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                    Decision Exposure
                  </p>
                  <p className="text-sm italic text-amber-800 leading-snug">
                    {matchedRisk?.business_impact ??
                      "Metric discrepancy may affect operational decisions"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {headlineFinding && (
          <p className="mt-5 text-sm text-biq-text-secondary leading-relaxed border-t border-biq-border-subtle pt-4">
            {headlineFinding}
          </p>
        )}
      </div>
    </section>
  );
}
