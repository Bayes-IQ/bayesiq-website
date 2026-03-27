"use client";

import { useState } from "react";
import type { DecisionLogEntry } from "@/lib/governance";
import { useGovernanceDetail } from "./GovernanceDetailProvider";

interface Props {
  entries: DecisionLogEntry[];
}

function statusIcon(status: string): { icon: string; color: string; bgColor: string; label: string } {
  switch (status) {
    case "approved":
      return { icon: "✓", color: "text-biq-status-success", bgColor: "bg-biq-status-success-subtle border-biq-status-success-subtle", label: "Approved" };
    case "rejected":
      return { icon: "✗", color: "text-biq-status-error", bgColor: "bg-biq-status-error-subtle border-biq-status-error-subtle", label: "Rejected" };
    case "pending":
    case "deferred":
      return { icon: "○", color: "text-biq-status-warning", bgColor: "bg-biq-status-warning-subtle border-biq-status-warning-subtle", label: "Pending Review" };
    default:
      return { icon: "·", color: "text-biq-text-muted", bgColor: "bg-biq-surface-1 border-biq-border", label: status };
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatObjectId(id: string): string {
  // "hospital_billing_code_swap" → "Billing Code Swap"
  return id
    .replace(/^(hospital|fintech|retail|saas|real_estate)_/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const INITIAL_VISIBLE = 8;

export default function DecisionLog({ entries }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { openGovernanceDetail } = useGovernanceDetail();

  if (entries.length === 0) return null;

  const visible = expanded ? entries : entries.slice(0, INITIAL_VISIBLE);
  const hasMore = entries.length > INITIAL_VISIBLE;

  return (
    <div data-testid="decision-log">
      <div className="space-y-2">
        {visible.map((entry) => {
          const s = statusIcon(entry.approval_status);
          const isRejected = entry.approval_status === "rejected";

          return (
            <button
              key={entry.object_id}
              onClick={() => openGovernanceDetail(entry.object_id, "finding")}
              className={`w-full text-left rounded-lg border px-4 py-3.5 transition-colors hover:bg-biq-surface-1/50 ${s.bgColor}`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isRejected ? "bg-biq-status-error-subtle text-biq-status-error" :
                    entry.approval_status === "approved" ? "bg-biq-status-success-subtle text-biq-status-success" :
                    "bg-biq-status-warning-subtle text-biq-status-warning"
                  }`}
                >
                  {s.icon}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Title row: artifact name + status label */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-biq-text-primary">
                      {formatObjectId(entry.object_id)}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isRejected ? "bg-biq-status-error-subtle text-biq-status-error" :
                      entry.approval_status === "approved" ? "bg-biq-status-success-subtle text-biq-status-success" :
                      "bg-biq-status-warning-subtle text-biq-status-warning"
                    }`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-biq-text-muted uppercase tracking-wider">
                      {entry.object_type}
                    </span>
                  </div>

                  {/* Review note — the substance of the decision */}
                  {entry.review_note && (
                    <p className={`mt-1.5 text-sm leading-snug ${
                      isRejected ? "text-biq-status-error" : "text-biq-text-secondary"
                    }`}>
                      {entry.review_note}
                    </p>
                  )}

                  {/* Attribution */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-biq-text-muted">
                    <span className="font-medium text-biq-text-muted">{entry.reviewer_name}</span>
                    <span>·</span>
                    <span>{formatDate(entry.last_reviewed_at)}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 text-xs font-medium text-biq-text-muted hover:text-biq-text-secondary transition-colors px-4"
        >
          Show all {entries.length} decisions
        </button>
      )}
    </div>
  );
}
