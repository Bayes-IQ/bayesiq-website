interface BeforeAfterSplitProps {
  before: {
    label: string;
    score: number;
    severity: string;
    details: string;
  };
  after: {
    label: string;
    score: number;
    tier: string;
    details: string;
  };
}

function severityBorderColor(severity: string): string {
  switch (severity) {
    case "Critical":
      return "border-red-300";
    case "Needs Attention":
      return "border-orange-300";
    case "High":
      return "border-orange-300";
    default:
      return "border-yellow-300";
  }
}

function severityBadgeClasses(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-biq-status-error-subtle text-biq-status-error border-biq-status-error-subtle";
    case "Needs Attention":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "High":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
}

export default function BeforeAfterSplit({
  before,
  after,
}: BeforeAfterSplitProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Before */}
      <div
        className={`rounded-xl border-2 ${severityBorderColor(before.severity)} bg-biq-status-error-subtle/30 p-5`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-biq-status-error">
            {before.label}
          </span>
          <span
            className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${severityBadgeClasses(before.severity)}`}
          >
            {before.severity}
          </span>
        </div>
        <p className="mt-3 font-mono text-3xl font-bold text-biq-status-error">
          {before.score}
          <span className="text-sm font-normal text-red-500">/100</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-red-800/70">
          {before.details}
        </p>
      </div>

      {/* Divider for mobile */}
      <div className="flex items-center justify-center md:hidden">
        <div className="h-px w-12 bg-biq-border" />
        <span className="mx-3 text-xs font-semibold text-biq-text-muted">
          AFTER BAYESIQ
        </span>
        <div className="h-px w-12 bg-biq-border" />
      </div>

      {/* After */}
      <div className="rounded-xl border-2 border-green-300 bg-biq-status-success-subtle/30 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-biq-status-success">
            {after.label}
          </span>
          <span className="inline-block rounded border border-biq-status-success-subtle bg-biq-status-success-subtle px-2 py-0.5 text-xs font-semibold text-biq-status-success">
            {after.tier}
          </span>
        </div>
        <p className="mt-3 font-mono text-3xl font-bold text-biq-status-success">
          {after.score}
          <span className="text-sm font-normal text-green-500">/100</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-green-800/70">
          {after.details}
        </p>
      </div>
    </div>
  );
}
