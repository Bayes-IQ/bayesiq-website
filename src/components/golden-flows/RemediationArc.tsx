import type { TrajectorySnapshot } from "@/types/golden-flows/contract-b/trajectory";
import type { BoardReportAction } from "@/lib/golden-flows";

interface Props {
  snapshots: TrajectorySnapshot[];
  totalFindings: number;
  topAction: BoardReportAction | null;
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
  if (score >= 60) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-700 border-red-200";
}

interface Step {
  label: string;
  score: number;
  description: string;
}

export default function RemediationArc({ snapshots, totalFindings, topAction }: Props) {
  if (snapshots.length === 0) return null;

  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const mid = snapshots.length > 2 ? snapshots[Math.floor(snapshots.length / 2)] : null;

  const steps: Step[] = [];

  // Step 1 — Discovery
  steps.push({
    label: "Discovery",
    score: first.score,
    description: `${totalFindings} finding${totalFindings !== 1 ? "s" : ""} identified`,
  });

  // Step 2 — Remediation (only if we have more than 1 snapshot)
  if (mid && snapshots.length > 1) {
    const owner = topAction?.owner ?? "the team";
    steps.push({
      label: "Remediation",
      score: mid.score,
      description: `${owner} resolved key issues`,
    });
  }

  // Step 3 — Steady State (only if different from first)
  if (last.score !== first.score) {
    steps.push({
      label: "Steady State",
      score: last.score,
      description: "Metrics verified and trustworthy",
    });
  }

  return (
    <section className="mt-12" data-testid="remediation-arc">
      <h2 className="text-lg font-bold tracking-tight text-bayesiq-900 mb-6">
        What working with BayesIQ looks like
      </h2>

      {/* Stepper */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 w-full sm:w-auto">
            {/* Step content */}
            <div className="flex flex-col items-center text-center min-w-[100px]">
              <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full border-2 text-sm font-bold tabular-nums ${scoreColor(step.score)}`}>
                {step.score}
              </span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-bayesiq-500">
                {step.label}
              </p>
              <p className="mt-1 text-xs text-bayesiq-400 leading-snug max-w-[140px]">
                {step.description}
              </p>
            </div>

            {/* Connector line (not after last step) */}
            {i < steps.length - 1 && (
              <div className="hidden sm:block flex-1 h-0.5 bg-bayesiq-200 mx-3" />
            )}
          </div>
        ))}

        {/* Implied step 4 */}
        <div className="flex items-center flex-1 w-full sm:w-auto">
          {steps.length > 0 && (
            <div className="hidden sm:block flex-1 h-0.5 bg-bayesiq-200 mx-3 border-dashed" />
          )}
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-dashed border-bayesiq-300 text-sm font-bold text-bayesiq-400">
              ?
            </span>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-bayesiq-400">
              Your Data
            </p>
            <p className="mt-1 text-xs text-bayesiq-400 leading-snug max-w-[140px]">
              This could be your story
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
