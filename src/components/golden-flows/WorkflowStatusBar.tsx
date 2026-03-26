import type { TrustBadgeSummary } from "@/lib/governance";

interface Props {
  summary: TrustBadgeSummary | null;
}

export default function WorkflowStatusBar({ summary }: Props) {
  if (!summary || summary.total_objects === 0) return null;

  const approved = summary.by_status.approved ?? 0;
  const rejected = summary.by_status.rejected ?? 0;
  const pending = summary.by_status.pending ?? 0;
  const deferred = summary.by_status.deferred ?? 0;
  const reviewed = approved + rejected;
  const outstanding = pending + deferred;
  const total = summary.total_objects;

  // Progress bar segments
  const approvedPct = (approved / total) * 100;
  const rejectedPct = (rejected / total) * 100;
  const pendingPct = (outstanding / total) * 100;

  return (
    <div data-testid="workflow-status-bar">
      {/* Progress bar */}
      <div className="h-2 rounded-full bg-biq-surface-2 overflow-hidden flex">
        {approvedPct > 0 && (
          <div
            className="bg-biq-status-success-subtle0 transition-all"
            style={{ width: `${approvedPct}%` }}
          />
        )}
        {rejectedPct > 0 && (
          <div
            className="bg-red-400 transition-all"
            style={{ width: `${rejectedPct}%` }}
          />
        )}
        {pendingPct > 0 && (
          <div
            className="bg-amber-300 transition-all"
            style={{ width: `${pendingPct}%` }}
          />
        )}
      </div>

      {/* Status summary */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-biq-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-biq-status-success-subtle0" />
          {reviewed} reviewed
          {approved > 0 && rejected > 0 && (
            <span className="text-biq-text-muted">
              ({approved} approved, {rejected} rejected)
            </span>
          )}
        </span>
        {outstanding > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {outstanding} pending review
          </span>
        )}
        <span className="text-biq-text-muted">
          {total} total items
        </span>
      </div>
    </div>
  );
}
