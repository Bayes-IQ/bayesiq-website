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
      return { icon: "✓", color: "text-green-700", bgColor: "bg-green-50 border-green-200", label: "Approved" };
    case "rejected":
      return { icon: "✗", color: "text-red-700", bgColor: "bg-red-50 border-red-200", label: "Rejected" };
    case "pending":
    case "deferred":
      return { icon: "○", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", label: "Pending Review" };
    default:
      return { icon: "·", color: "text-bayesiq-500", bgColor: "bg-bayesiq-50 border-bayesiq-200", label: status };
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
              className={`w-full text-left rounded-lg border px-4 py-3.5 transition-colors hover:bg-bayesiq-50/50 ${s.bgColor}`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isRejected ? "bg-red-100 text-red-700" :
                    entry.approval_status === "approved" ? "bg-green-100 text-green-700" :
                    "bg-amber-100 text-amber-600"
                  }`}
                >
                  {s.icon}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Title row: artifact name + status label */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-bayesiq-900">
                      {formatObjectId(entry.object_id)}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isRejected ? "bg-red-100 text-red-600" :
                      entry.approval_status === "approved" ? "bg-green-100 text-green-600" :
                      "bg-amber-100 text-amber-600"
                    }`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-bayesiq-400 uppercase tracking-wider">
                      {entry.object_type}
                    </span>
                  </div>

                  {/* Review note — the substance of the decision */}
                  {entry.review_note && (
                    <p className={`mt-1.5 text-sm leading-snug ${
                      isRejected ? "text-red-700" : "text-bayesiq-700"
                    }`}>
                      {entry.review_note}
                    </p>
                  )}

                  {/* Attribution */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-bayesiq-400">
                    <span className="font-medium text-bayesiq-500">{entry.reviewer_name}</span>
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
          className="mt-3 text-xs font-medium text-bayesiq-500 hover:text-bayesiq-700 transition-colors px-4"
        >
          Show all {entries.length} decisions
        </button>
      )}
    </div>
  );
}
