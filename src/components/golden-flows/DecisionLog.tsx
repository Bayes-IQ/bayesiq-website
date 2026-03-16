"use client";

import { useState } from "react";
import type { DecisionLogEntry } from "@/lib/governance";
import { useGovernanceDetail } from "./GovernanceDetailProvider";

interface Props {
  entries: DecisionLogEntry[];
}

function statusIcon(status: string): { icon: string; color: string; bgColor: string } {
  switch (status) {
    case "approved":
      return { icon: "✓", color: "text-green-700", bgColor: "bg-green-100" };
    case "rejected":
      return { icon: "✗", color: "text-red-700", bgColor: "bg-red-100" };
    case "pending":
    case "deferred":
      return { icon: "○", color: "text-amber-600", bgColor: "bg-amber-100" };
    default:
      return { icon: "·", color: "text-bayesiq-500", bgColor: "bg-bayesiq-100" };
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
  return id.replace(/_/g, " ").replace(/^(hospital|fintech|retail|saas|real estate)\s*/i, "");
}

const INITIAL_VISIBLE = 6;

export default function DecisionLog({ entries }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { openGovernanceDetail } = useGovernanceDetail();

  if (entries.length === 0) return null;

  const visible = expanded ? entries : entries.slice(0, INITIAL_VISIBLE);
  const hasMore = entries.length > INITIAL_VISIBLE;

  return (
    <div data-testid="decision-log">
      <div className="space-y-1">
        {visible.map((entry) => {
          const s = statusIcon(entry.approval_status);
          const isRejected = entry.approval_status === "rejected";

          return (
            <button
              key={entry.object_id}
              onClick={() => openGovernanceDetail(entry.object_id, "finding")}
              className={`w-full text-left rounded-lg px-4 py-3 transition-colors hover:bg-bayesiq-50 ${
                isRejected ? "border-l-3 border-l-red-400" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.bgColor} ${s.color}`}
                >
                  {s.icon}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-bayesiq-900 truncate">
                      {formatObjectId(entry.object_id)}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${s.color}`}>
                      {entry.approval_status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-xs text-bayesiq-500">
                    <span>by {entry.reviewer_name}</span>
                    <span className="text-bayesiq-300">·</span>
                    <span>{formatDate(entry.last_reviewed_at)}</span>
                  </div>

                  {entry.review_note && (
                    <p className={`mt-1 text-xs leading-snug truncate ${
                      isRejected ? "text-red-600 font-medium" : "text-bayesiq-500 italic"
                    }`}>
                      {entry.review_note}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-xs font-medium text-bayesiq-500 hover:text-bayesiq-700 transition-colors px-4"
        >
          Show all {entries.length} decisions
        </button>
      )}
    </div>
  );
}
