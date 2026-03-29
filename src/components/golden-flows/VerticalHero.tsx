import type { Trajectory } from "@/types/golden-flows/contract-b/trajectory";
import type { BoardReport, HookMetrics, VerticalNarrativePayload } from "@/lib/golden-flows";
import ScoreTrajectory from "./ScoreTrajectory";

interface Props {
  trajectory: Trajectory;
  boardReport: BoardReport | null;
  narrative: VerticalNarrativePayload | null;
  hookMetrics: HookMetrics | null;
  verticalName: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-biq-status-success";
  if (score >= 60) return "text-amber-500";
  return "text-biq-status-error";
}

export default function VerticalHero({
  trajectory,
  boardReport,
  narrative,
  hookMetrics,
  verticalName,
}: Props) {
  const snapshots = trajectory.snapshots;
  const first = snapshots[0];
  const latest = snapshots[snapshots.length - 1];
  const delta = latest.score - first.score;
  const improving = delta >= 0;

  // Confidence-first: frame the headline as what BayesIQ achieved, not what was broken
  const headline = narrative?.with_bayesiq
    ? `${verticalName}: ${narrative.headline_finding}`
    : hookMetrics?.discrepancy_headline ?? `${verticalName} data reliability`;

  // Business framing
  const framing = narrative?.with_bayesiq ?? null;

  // Top business consequence
  const consequence = boardReport?.top_risks?.[0]?.business_impact ?? null;

  return (
    <section className="mt-6 rounded-2xl border border-biq-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Score + delta */}
        <div className="flex-shrink-0 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-biq-text-muted">
            Reliability Score
          </p>
          <p className="mt-1 text-5xl font-extrabold tabular-nums text-biq-text-primary">
            {latest.score}
          </p>
          {snapshots.length > 1 && (
            <p
              className={`mt-1 text-sm font-medium ${
                improving ? "text-biq-status-success" : "text-biq-status-error"
              }`}
            >
              {first.score} → {latest.score}
              <span className="ml-1 text-xs">
                ({improving ? "+" : ""}
                {delta} pts)
              </span>
            </p>
          )}
        </div>

        {/* Headline + framing */}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-biq-text-primary sm:text-3xl leading-snug">
            {headline}
          </h1>
          {framing && (
            <p className="mt-2 text-sm text-biq-text-secondary leading-relaxed">
              {framing}
            </p>
          )}
          {consequence && (
            <p className="mt-3 text-xs text-biq-text-muted leading-relaxed border-l-2 border-amber-300 pl-3">
              {consequence}
            </p>
          )}
        </div>

        {/* Trajectory chart */}
        <div className="hidden sm:block flex-shrink-0">
          <ScoreTrajectory snapshots={snapshots} />
        </div>
      </div>
    </section>
  );
}
