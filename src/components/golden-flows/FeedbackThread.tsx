"use client";

import { useState } from "react";
import type { FeedbackThreadItem } from "@/lib/governance";

interface FeedbackThreadProps {
  item: FeedbackThreadItem;
}

const DISPOSITION_META: Record<
  FeedbackThreadItem["disposition"],
  { label: string; color: string }
> = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "In Progress", color: "bg-biq-status-info-subtle text-biq-status-info" },
  resolved:    { label: "Resolved",    color: "bg-biq-status-success-subtle text-biq-status-success" },
  rejected:    { label: "Rejected",    color: "bg-biq-status-error-subtle text-biq-status-error" },
};

function approvalStatusColor(status: string): string {
  switch (status) {
    case "approved":
      return "bg-biq-status-success-subtle text-biq-status-success";
    case "rejected":
      return "bg-biq-status-error-subtle text-biq-status-error";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

export default function FeedbackThread({ item }: FeedbackThreadProps) {
  const [expanded, setExpanded] = useState(false);
  const dispositionMeta = DISPOSITION_META[item.disposition];
  const showResolutionNote =
    (item.disposition === "resolved" || item.disposition === "rejected") &&
    item.resolution_note;

  return (
    <div className="rounded-xl border border-biq-border bg-white shadow-sm">
      {/* Collapsed view — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-biq-primary rounded-xl"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Summary */}
            <p className="text-sm font-medium text-biq-text-primary leading-snug">
              {item.summary}
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-biq-surface-2 text-biq-text-secondary">
                  {item.category}
                </span>
              )}
              {item.priority && (
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-biq-surface-2 text-biq-text-secondary">
                  {item.priority}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${dispositionMeta.color}`}
              >
                {dispositionMeta.label}
              </span>
              <span className="text-xs text-biq-text-muted">
                {relativeTime(item.timeline.created_at)}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <span
            className={`mt-1 shrink-0 text-biq-text-muted transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7.5l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-biq-border-subtle px-5 pb-5 pt-4 sm:px-6">
          {/* Source */}
          {item.source && (
            <p className="text-xs text-biq-text-muted mb-3">
              Source: {item.source}
            </p>
          )}

          {/* Resolution note */}
          {showResolutionNote && (
            <div className="bg-biq-surface-1 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-biq-text-muted mb-1">
                Resolution Note
              </p>
              <p className="text-sm text-biq-text-primary">{item.resolution_note}</p>
            </div>
          )}

          {/* Timeline dates */}
          <div className="flex flex-wrap gap-4 text-xs text-biq-text-muted mb-4">
            <span>Created: {formatDate(item.timeline.created_at)}</span>
            <span>Updated: {formatDate(item.timeline.updated_at)}</span>
            {item.timeline.resolved_at && (
              <span>Resolved: {formatDate(item.timeline.resolved_at)}</span>
            )}
          </div>

          {/* Linked approvals chain */}
          {item.linked_approvals.length > 0 && (
            <>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
                Approval Chain
              </h4>
              <ol className="relative space-y-4">
                {item.linked_approvals.map((approval, idx) => {
                  const isLast = idx === item.linked_approvals.length - 1;
                  return (
                    <li
                      key={approval.approval_id}
                      className="relative pl-8"
                    >
                      {/* Connector line */}
                      {!isLast && (
                        <span
                          className="absolute left-[11px] top-6 h-full w-px bg-biq-surface-2"
                          aria-hidden="true"
                        />
                      )}
                      {/* Step icon */}
                      <span
                        className={`absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${approvalStatusColor(approval.approval_status)}`}
                        aria-hidden="true"
                      >
                        {approval.approval_status === "approved"
                          ? "\u2713"
                          : approval.approval_status === "rejected"
                            ? "\u2717"
                            : "\u2022"}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-biq-text-primary">
                            {approval.reviewer.display_name ?? "Unknown"}
                          </span>
                          {approval.reviewer.role && (
                            <span className="text-xs text-biq-text-muted">
                              {approval.reviewer.role}
                            </span>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${approvalStatusColor(approval.approval_status)}`}
                        >
                          {approval.approval_status}
                        </span>
                        {approval.review_note && (
                          <p className="mt-0.5 text-xs text-biq-text-muted">
                            {approval.review_note}
                          </p>
                        )}
                        <div className="mt-1 flex gap-3 text-xs text-biq-text-muted">
                          <span>
                            Requested: {formatDate(approval.ts_requested)}
                          </span>
                          {approval.ts_resolved && (
                            <span>
                              Resolved: {formatDate(approval.ts_resolved)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-biq-text-muted">
                          {approval.record_origin}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
}
