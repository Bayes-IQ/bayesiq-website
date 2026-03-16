import type { TrustBadgeSummary } from "@/lib/governance";

interface Props {
  summary: TrustBadgeSummary | null;
}

export default function GovernanceProgressBar({ summary }: Props) {
  if (!summary || summary.total_objects === 0) return null;

  const approved = summary.by_status.approved ?? 0;
  const rejected = summary.by_status.rejected ?? 0;
  const pending = summary.by_status.pending ?? 0;
  const deferred = summary.by_status.deferred ?? 0;
  const reviewed = approved + rejected;
  const outstanding = pending + deferred;
  const total = summary.total_objects;
  const coveragePct = Math.round((reviewed / total) * 100);

  const approvedPct = (approved / total) * 100;
  const rejectedPct = (rejected / total) * 100;
  const outstandingPct = (outstanding / total) * 100;

  return (
    <div data-testid="governance-progress-bar" className="mb-8">
      {/* Coverage headline */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-extrabold tabular-nums text-bayesiq-900">
          {coveragePct}%
        </span>
        <span className="text-sm font-medium text-bayesiq-500">
          Governance Coverage
        </span>
        <span className="text-xs text-bayesiq-400">
          {reviewed} of {total} items reviewed
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="h-2.5 rounded-full bg-bayesiq-100 overflow-hidden flex">
        {approvedPct > 0 && (
          <div className="bg-green-500 transition-all" style={{ width: `${approvedPct}%` }} />
        )}
        {rejectedPct > 0 && (
          <div className="bg-red-400 transition-all" style={{ width: `${rejectedPct}%` }} />
        )}
        {outstandingPct > 0 && (
          <div className="bg-amber-300 transition-all" style={{ width: `${outstandingPct}%` }} />
        )}
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-bayesiq-600">
        {approved > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            {approved} approved
          </span>
        )}
        {rejected > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            {rejected} rejected
          </span>
        )}
        {outstanding > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            {outstanding} pending review
          </span>
        )}
      </div>
    </div>
  );
}
