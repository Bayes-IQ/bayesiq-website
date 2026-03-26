import type { DecisionLogEntry } from "@/lib/governance";

interface Props {
  entries: DecisionLogEntry[];
}

export default function GovernanceProgressBar({ entries }: Props) {
  if (entries.length === 0) return null;

  const total = entries.length;
  const approved = entries.filter((e) => e.approval_status === "approved").length;
  const rejected = entries.filter((e) => e.approval_status === "rejected").length;
  const pending = entries.filter((e) => e.approval_status === "pending" || e.approval_status === "deferred").length;
  const reviewed = approved + rejected;
  const coveragePct = Math.round((reviewed / total) * 100);

  const approvedPct = (approved / total) * 100;
  const rejectedPct = (rejected / total) * 100;
  const pendingPct = (pending / total) * 100;

  return (
    <div data-testid="governance-progress-bar" className="mb-8">
      {/* Coverage headline */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-extrabold tabular-nums text-biq-text-primary">
          {coveragePct}%
        </span>
        <span className="text-sm font-medium text-biq-text-muted">
          Governance Coverage
        </span>
        <span className="text-xs text-biq-text-muted">
          {reviewed} of {total} items reviewed
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="h-2.5 rounded-full bg-biq-surface-2 overflow-hidden flex">
        {approvedPct > 0 && (
          <div className="bg-biq-status-success-subtle0 transition-all" style={{ width: `${approvedPct}%` }} />
        )}
        {rejectedPct > 0 && (
          <div className="bg-red-400 transition-all" style={{ width: `${rejectedPct}%` }} />
        )}
        {pendingPct > 0 && (
          <div className="bg-amber-300 transition-all" style={{ width: `${pendingPct}%` }} />
        )}
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-biq-text-secondary">
        {approved > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-biq-status-success-subtle0" />
            {approved} approved
          </span>
        )}
        {rejected > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            {rejected} rejected
          </span>
        )}
        {pending > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            {pending} pending review
          </span>
        )}
      </div>
    </div>
  );
}
