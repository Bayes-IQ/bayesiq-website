import type { Trajectory } from "@/types/golden-flows/contract-b/trajectory";
import type { ExecutiveQuestion } from "@/lib/golden-flows";
import ScoreTrajectory from "./ScoreTrajectory";

interface Props {
  trajectory: Trajectory;
  questions: ExecutiveQuestion[];
  verticalName: string;
}

/**
 * Above-the-fold hero for each vertical.
 * Shows current score, trajectory mini-chart, most devastating finding,
 * and its business consequence.
 */
export default function VerticalLanding({
  trajectory,
  questions,
  verticalName,
}: Props) {
  const snapshots = trajectory.snapshots;
  const latest = snapshots[snapshots.length - 1];
  const first = snapshots[0];
  const improving = latest.score >= first.score;
  const delta = latest.score - first.score;

  // Find the highest-priority, highest-severity question
  const devastating = pickDevastating(questions);

  return (
    <section className="mt-6 rounded-2xl border border-biq-border bg-biq-surface-0 p-6 shadow-sm sm:p-8">
      {/* Top row: score + chart */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Current score */}
        <div className="flex-shrink-0 text-center">
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
              {improving ? "+" : ""}
              {delta} pts over {snapshots.length > 1 ? `${latest.month - first.month} mo` : ""}
            </p>
          )}
        </div>

        {/* Trajectory chart */}
        <div className="w-full sm:w-auto sm:flex-1">
          <ScoreTrajectory snapshots={snapshots} />
        </div>
      </div>

      {/* Devastating finding */}
      {devastating && (
        <div className="mt-6 rounded-xl border border-biq-status-error-subtle bg-biq-status-error-subtle p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-biq-status-error mb-2">
            Most Critical Finding — {verticalName}
          </p>
          <p className="text-base font-semibold text-biq-text-primary leading-snug">
            {devastating.question_text}
          </p>
          <p className="mt-2 text-sm text-biq-text-secondary leading-relaxed">
            {devastating.answer_summary}
          </p>
        </div>
      )}
    </section>
  );
}

/** Pick the most devastating question (flagship+critical first, then by severity). */
function pickDevastating(
  questions: ExecutiveQuestion[]
): ExecutiveQuestion | null {
  if (questions.length === 0) return null;

  const severityRank: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const sorted = [...questions].sort((a, b) => {
    // Flagship questions first
    if (a.priority === "flagship" && b.priority !== "flagship") return -1;
    if (b.priority === "flagship" && a.priority !== "flagship") return 1;
    // Then by severity
    return (severityRank[a.severity] ?? 4) - (severityRank[b.severity] ?? 4);
  });

  return sorted[0];
}
