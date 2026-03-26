import type { TrustBadgeSummary, ApprovalStatusValue } from "@/lib/governance";
import TrustBadge from "./TrustBadge";

interface TrustSummaryBarProps {
  summary: TrustBadgeSummary | null;
}

const STATUS_ORDER: ApprovalStatusValue[] = [
  "approved",
  "pending",
  "rejected",
  "deferred",
];

export default function TrustSummaryBar({ summary }: TrustSummaryBarProps) {
  if (!summary) return null;

  return (
    <div
      className="rounded-xl border border-biq-border bg-biq-surface-1 p-4"
      data-testid="trust-summary-bar"
    >
      {/* Row 1: Overall counts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-biq-text-secondary mr-1">
          Trust overview
        </span>
        {STATUS_ORDER.map((status) => {
          const count = summary.by_status[status] ?? 0;
          if (count === 0) return null;
          return (
            <span key={status} className="inline-flex items-center gap-1">
              <TrustBadge status={status} size="md" showLabel />
              <span className="text-xs font-medium text-biq-text-secondary">
                {count}
              </span>
            </span>
          );
        })}
        <span className="text-xs text-biq-text-muted">
          of {summary.total_objects} objects
        </span>
      </div>

      {/* Row 2: Per-object_type rollups */}
      {Object.keys(summary.by_object_type).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2" data-testid="trust-summary-rollups">
          {Object.entries(summary.by_object_type).map(
            ([objectType, rollup]) => {
              const approved = rollup.by_status.approved ?? 0;
              return (
                <span
                  key={objectType}
                  className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-biq-text-secondary ring-1 ring-inset ring-biq-border"
                >
                  {objectType}: {approved}/{rollup.total}
                </span>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export type { TrustSummaryBarProps };
