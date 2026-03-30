interface ProgressProps {
  /** Current step number (1-based). */
  current: number;
  /** Total number of steps. */
  total: number;
}

/**
 * Displays a linear progress bar and step count for the assessment wizard.
 * Accessible: uses role="progressbar" with aria-valuenow/min/max.
 */
export default function Progress({ current, total }: ProgressProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
          Question {current} of {total}
        </span>
        <span className="text-xs text-biq-text-muted">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-biq-surface-2"
      >
        <div
          className="h-full rounded-full bg-biq-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
