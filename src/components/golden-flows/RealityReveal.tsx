import type { BoardReportMetric, BoardReportRisk } from "@/lib/golden-flows";

interface Props {
  metrics: BoardReportMetric[];
  topRisk: BoardReportRisk | null;
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

export default function RealityReveal({
  metrics,
  topRisk,
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
      <div className="rounded-xl border border-bayesiq-200 bg-bayesiq-50/50 p-6">
        <div className="space-y-5">
          {shown.map((m) => (
            <div
              key={`${m.metric}-${m.period}`}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
            >
              {/* Reported — muted/dimmed to signal "what they said" */}
              <div className="rounded-lg bg-red-50/60 border border-red-100 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                  Reported
                </p>
                <p className="text-xl tabular-nums text-red-700/70">
                  {formatValue(m.reported)}
                </p>
                <p className="text-xs text-red-400 mt-1">
                  {m.metric} &middot; {m.period}
                </p>
              </div>

              {/* Audited — bold, authoritative */}
              <div className="rounded-lg bg-green-50 border border-green-100 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600 mb-1">
                  Audited
                </p>
                <p className="text-xl font-bold tabular-nums text-green-800">
                  {formatValue(m.audited)}
                </p>
                <p className="text-xs text-green-600/70 mt-1">
                  {m.delta_pct > 0 ? "+" : ""}
                  {m.delta_pct}% discrepancy
                </p>
              </div>

              {/* Decision exposure — italic accent, editorial tone */}
              <div className="rounded-lg bg-amber-50/70 border border-amber-100 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                  Decision Exposure
                </p>
                <p className="text-sm italic text-amber-800 leading-snug">
                  {topRisk?.business_impact ??
                    "Metric discrepancy may affect operational decisions"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {headlineFinding && (
          <p className="mt-5 text-sm text-bayesiq-600 leading-relaxed border-t border-bayesiq-100 pt-4">
            {headlineFinding}
          </p>
        )}
      </div>
    </section>
  );
}
