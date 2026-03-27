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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-red-600">
            {beforeLabel}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-red-700">
            {beforeValue}
          </p>
        </div>
        {/* After */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-green-600">
            {afterLabel}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-green-700">
            {afterValue}
          </p>
        </div>
      </div>
      {annotation && (
        <p className="mt-3 text-sm text-bayesiq-600">{annotation}</p>
      )}
    </div>
  );
}
