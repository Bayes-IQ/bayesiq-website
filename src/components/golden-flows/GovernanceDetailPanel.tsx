"use client";

import { useEffect } from "react";
import type { ReviewContextBlock } from "@/types/golden-flows/contract-c/review_context";

// Re-export serializable types from governance.ts for backward compatibility
export type {
  SerializedReviewer,
  SerializedApprovalRecord,
  SerializedCascadeGovernanceRecord,
  SerializedReviewContextRecord,
  GovernanceRecord,
  GovernanceDetailData,
} from "@/lib/governance";

import type {
  SerializedApprovalRecord,
  SerializedCascadeGovernanceRecord,
  GovernanceDetailData,
} from "@/lib/governance";

interface GovernanceDetailPanelProps {
  objectId: string | null;
  objectType: "finding" | "question";
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  data: GovernanceDetailData | null;
}

type ApprovalStatusValue = "approved" | "pending" | "rejected" | "deferred";

const STATUS_PILL_COLORS: Record<ApprovalStatusValue, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  deferred: "bg-gray-100 text-gray-500",
};

const ORIGIN_LABELS: Record<string, string> = {
  demo_seeded: "Demo (seeded)",
  demo_approved: "Demo (approved)",
  live: "Live",
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

function StatusPill({ status }: { status: string }) {
  const colors = STATUS_PILL_COLORS[status as ApprovalStatusValue] ?? "bg-gray-100 text-gray-500";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}
      data-testid="status-pill"
    >
      {status}
    </span>
  );
}

function ReviewContextBlockRenderer({ block }: { block: ReviewContextBlock }) {
  const label = block.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const b = block as ReviewContextBlock & Record<string, unknown>;

  function renderBody() {
    switch (block.type) {
      case "summary_stat": {
        const statLabel = (b.label as string) ?? "Stat";
        const statValue = (b.value as string | number) ?? "N/A";
        return (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-bayesiq-600">{statLabel}</span>
            <span className="text-sm font-semibold text-bayesiq-900">{String(statValue)}</span>
          </div>
        );
      }
      case "finding_list": {
        const findings = (b.findings as Array<Record<string, unknown>>) ?? [];
        return (
          <ul className="list-disc list-inside space-y-1">
            {findings.map((f, i) => (
              <li key={i} className="text-sm text-bayesiq-700">
                {(f.description as string) ?? (f.label as string) ?? JSON.stringify(f)}
              </li>
            ))}
          </ul>
        );
      }
      case "warning": {
        const message = (b.message as string) ?? (b.text as string) ?? JSON.stringify(b);
        return (
          <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
            <p className="text-sm text-amber-800">{message}</p>
          </div>
        );
      }
      case "assumption_list": {
        const assumptions = (b.assumptions as string[]) ?? (b.items as string[]) ?? [];
        return (
          <ul className="list-disc list-inside space-y-1">
            {assumptions.map((a, i) => (
              <li key={i} className="text-sm text-bayesiq-700">
                {typeof a === "string" ? a : JSON.stringify(a)}
              </li>
            ))}
          </ul>
        );
      }
      case "candidate_list": {
        const candidates = (b.candidates as string[]) ?? (b.items as string[]) ?? [];
        return (
          <ul className="list-disc list-inside space-y-1">
            {candidates.map((c, i) => (
              <li key={i} className="text-sm text-bayesiq-700">
                {typeof c === "string" ? c : JSON.stringify(c)}
              </li>
            ))}
          </ul>
        );
      }
      case "artifact_link_group": {
        const links = (b.links as Array<Record<string, unknown>>) ?? (b.artifacts as Array<Record<string, unknown>>) ?? [];
        return (
          <ul className="space-y-1">
            {links.map((link, i) => {
              const url = (link.url as string) ?? (link.href as string);
              const linkLabel = (link.label as string) ?? (link.name as string) ?? url ?? "Link";
              return (
                <li key={i} className="text-sm">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bayesiq-600 underline hover:text-bayesiq-800"
                    >
                      {linkLabel}
                    </a>
                  ) : (
                    <span className="text-bayesiq-700">{linkLabel}</span>
                  )}
                </li>
              );
            })}
          </ul>
        );
      }
      default: {
        const { type: _type, ...rest } = b;
        return (
          <pre className="text-xs text-bayesiq-700 whitespace-pre-wrap break-words">
            {JSON.stringify(rest, null, 2)}
          </pre>
        );
      }
    }
  }

  return (
    <div className="rounded-lg border border-bayesiq-100 p-3" data-testid="review-context-block">
      <p className="text-xs font-semibold uppercase tracking-wide text-bayesiq-400 mb-1">
        {label}
      </p>
      {renderBody()}
    </div>
  );
}

function LinkedReferences({ record }: { record: SerializedCascadeGovernanceRecord }) {
  const sections = [
    { label: "Related findings", ids: record.finding_ids },
    { label: "Related feedback", ids: record.feedback_ids },
    { label: "Related events", ids: record.event_ids },
  ].filter((s) => s.ids.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-3" data-testid="linked-references">
      <h3 className="text-sm font-semibold text-bayesiq-800">Linked References</h3>
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-xs font-medium text-bayesiq-500 mb-1">{section.label}</p>
          <div className="flex flex-wrap gap-1">
            {section.ids.map((id) => (
              <code
                key={id}
                className="rounded bg-bayesiq-50 px-1.5 py-0.5 text-xs text-bayesiq-700"
              >
                {id}
              </code>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GovernanceDetailPanel({
  objectId,
  objectType,
  onClose,
  dialogRef,
  data,
}: GovernanceDetailPanelProps) {
  // Open/close dialog based on objectId
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (objectId !== null) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [objectId, dialogRef]);

  // Listen for native close event (Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, [dialogRef, onClose]);

  // Resolve governance data from pre-computed lookup (C-014: guard objectId !== null)
  const record = objectId !== null && data ? data.records[objectId] ?? null : null;
  const reviewContext = objectId !== null && data ? data.reviewContexts[objectId] ?? null : null;

  // Derive display values
  const status = record?.approval_status ?? null;
  const reviewer = record?.reviewer ?? null;
  const reviewNote = record?.review_note ?? null;
  const recordOrigin = record?.record_origin ?? null;
  // C-019: Use ts_requested as timestamp fallback for pending cascade items
  const timestamp = record
    ? record.type === "finding"
      ? (record as SerializedApprovalRecord).timestamp
      : (record as SerializedCascadeGovernanceRecord).ts_resolved || (record as SerializedCascadeGovernanceRecord).ts_requested
    : null;

  const cascadeRecord = record?.type === "question" ? record as SerializedCascadeGovernanceRecord : null;

  // Backdrop click handler (C-017)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-full w-full max-h-full max-w-full bg-transparent p-0 backdrop:bg-black/30"
      onClick={handleBackdropClick}
      data-testid="governance-detail-dialog"
    >
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl overflow-y-auto p-6 transition-transform duration-200 ease-out"
        data-testid="governance-detail-panel"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0 flex-1">
            <code className="text-xs text-bayesiq-500 break-all" data-testid="panel-object-id">
              {objectId}
            </code>
            {status && (
              <div className="mt-1">
                <StatusPill status={status} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-bayesiq-400 hover:bg-bayesiq-100 hover:text-bayesiq-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-bayesiq-500"
            aria-label="Close governance detail"
            data-testid="panel-close-button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* No governance record fallback */}
        {objectId !== null && !record && (
          <p className="text-sm text-bayesiq-500" data-testid="no-governance-message">
            No governance record found for this object.
          </p>
        )}

        {/* Approval / Governance Details */}
        {record && (
          <div className="space-y-4 mb-6" data-testid="governance-details">
            {/* Reviewer */}
            <div>
              <p className="text-xs font-medium text-bayesiq-400 mb-0.5">Reviewer</p>
              <p className="text-sm text-bayesiq-800">
                {reviewer?.display_name ?? "Unknown reviewer"}
                {reviewer?.role && (
                  <span className="ml-1 text-bayesiq-500">({reviewer.role})</span>
                )}
              </p>
            </div>

            {/* Record origin */}
            {recordOrigin && (
              <div>
                <p className="text-xs font-medium text-bayesiq-400 mb-0.5">Record origin</p>
                <span className="inline-flex items-center rounded-full bg-bayesiq-100 px-2 py-0.5 text-xs font-medium text-bayesiq-700">
                  {ORIGIN_LABELS[recordOrigin] ?? recordOrigin}
                </span>
              </div>
            )}

            {/* Timestamp */}
            {timestamp && (
              <div>
                <p className="text-xs font-medium text-bayesiq-400 mb-0.5">Timestamp</p>
                <p className="text-sm text-bayesiq-700">
                  {formatTimestamp(timestamp)}
                </p>
              </div>
            )}

            {/* Review note */}
            {reviewNote && (
              <div data-testid="review-note">
                <p className="text-xs font-medium text-bayesiq-400 mb-0.5">Review note</p>
                <div className="bg-bayesiq-50 rounded-lg p-3">
                  <p className="text-sm text-bayesiq-800">{reviewNote}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review Context */}
        {reviewContext && reviewContext.review_context.length > 0 && (
          <div className="space-y-3 mb-6" data-testid="review-context-section">
            <h3 className="text-sm font-semibold text-bayesiq-800">Review Context</h3>
            {reviewContext.review_context.map((block, idx) => (
              <ReviewContextBlockRenderer key={`${block.type}-${idx}`} block={block} />
            ))}
          </div>
        )}

        {/* Linked References (question type only) */}
        {objectType === "question" && cascadeRecord && (
          <LinkedReferences record={cascadeRecord} />
        )}
      </div>
    </dialog>
  );
}
