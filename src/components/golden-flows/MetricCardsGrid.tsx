import type { BoardReportMetric } from "@/lib/golden-flows";
import MetricCard from "./MetricCard";

interface Props {
  metrics: BoardReportMetric[];
  score: number;
  interpretation: string;
}

/**
 * Responsive grid of metric cards.
 * C-014: Only prepend score summary card when metrics.length < 2 AND score > 0.
 */
export default function MetricCardsGrid({ metrics, score, interpretation }: Props) {
  const showScoreCard = metrics.length < 2 && score > 0;

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="metric-cards-grid"
    >
      {showScoreCard && (
        <div className="rounded-xl border border-bayesiq-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-bayesiq-400">
            Reliability Score
          </p>
          <div className="mt-2">
            <span className="text-2xl font-bold text-bayesiq-900">{score}</span>
            <span className="text-lg text-bayesiq-400"> / 100</span>
          </div>
          <p className="mt-1.5 text-[11px] text-bayesiq-400">{interpretation}</p>
        </div>
      )}
      {metrics.map((m) => (
        <MetricCard key={m.metric} metric={m} />
      ))}
    </div>
  );
}
