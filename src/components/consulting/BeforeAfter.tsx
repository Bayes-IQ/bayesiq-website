/**
 * Split-screen before/after finding display.
 * Server component. JetBrains Mono for values.
 */

interface BeforeAfterProps {
  beforeLabel: string;
  beforeValue: string;
  afterLabel: string;
  afterValue: string;
  annotation?: string;
}

export default function BeforeAfter({
  beforeLabel,
  beforeValue,
  afterLabel,
  afterValue,
  annotation,
}: BeforeAfterProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-lg border border-biq-status-error-subtle bg-biq-status-error-subtle p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-biq-status-error">
            {beforeLabel}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-biq-status-error">
            {beforeValue}
          </p>
        </div>
        {/* After */}
        <div className="rounded-lg border border-biq-status-success-subtle bg-biq-status-success-subtle p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-biq-status-success">
            {afterLabel}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-biq-status-success">
            {afterValue}
          </p>
        </div>
      </div>
      {annotation && (
        <p className="mt-3 text-sm text-biq-text-secondary">{annotation}</p>
      )}
    </div>
  );
}
