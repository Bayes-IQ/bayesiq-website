interface StepDotsProps {
  /** Current step (0-based index). */
  current: number;
  /** Total number of steps. */
  total: number;
}

/**
 * Step-dot progress indicator for the assessment wizard.
 * Shows filled dots for completed steps, a pulsing dot for the current step,
 * and empty dots for upcoming steps.
 */
export default function StepDots({ current, total }: StepDotsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2" role="list" aria-label="Assessment progress">
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;

          return (
            <span
              key={i}
              role="listitem"
              aria-label={`Question ${i + 1}${isCurrent ? " (current)" : isCompleted ? " (completed)" : ""}`}
              className={[
                "block h-2.5 w-2.5 rounded-full transition-all duration-300",
                isCompleted
                  ? "bg-biq-dark-surface-1"
                  : isCurrent
                    ? "bg-biq-dark-surface-1 animate-pulse"
                    : "bg-biq-surface-2",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
        Question {current + 1} of {total}
      </span>
    </div>
  );
}
