"use client";

import { useState } from "react";
import type { CascadeEntry, TimelineStep } from "@/types/golden-flows/contract-b/cascade_data";
import type { ApprovalStatusValue } from "@/lib/governance";
import TrustBadge from "./TrustBadge";

interface CascadeCardProps {
  entry: CascadeEntry;
  governanceStatus?: ApprovalStatusValue | null;
  questionId?: string;
  onGovernanceDetail?: (objectId: string, objectType: "finding" | "question") => void;
}

const STEP_TYPE_META: Record<
  TimelineStep["step_type"],
  { label: string; color: string; icon: string }
> = {
  finding: { label: "Finding", color: "bg-biq-status-error-subtle text-biq-status-error", icon: "!" },
  correction: { label: "Correction", color: "bg-biq-status-warning-subtle text-biq-status-warning", icon: "\u2192" },
  dashboard: { label: "Dashboard", color: "bg-biq-status-info-subtle text-biq-status-info", icon: "\u25A3" },
  report: { label: "Report", color: "bg-indigo-100 text-indigo-700", icon: "\u25A0" },
  presentation: { label: "Presentation", color: "bg-purple-100 text-purple-700", icon: "\u25B6" },
  governance: { label: "Governance", color: "bg-biq-status-success-subtle text-biq-status-success", icon: "\u2713" },
};

function reviewerStatusColor(status: string): string {
  switch (status) {
    case "approved":
      return "bg-biq-status-success-subtle text-biq-status-success";
    case "rejected":
      return "bg-biq-status-error-subtle text-biq-status-error";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function CascadeCard({ entry, governanceStatus, questionId, onGovernanceDetail }: CascadeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-biq-border bg-biq-surface-0 shadow-sm">
      {/* Collapsed view — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-biq-primary rounded-xl"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Delta row */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-biq-text-muted">Reported:</span>
              <span className="text-biq-text-secondary">{entry.reported_value}</span>
              <span className="text-biq-text-muted mx-1">/</span>
              <span className="font-medium text-biq-text-muted">Audited:</span>
              <span className="text-biq-text-secondary">{entry.audited_value}</span>
              <span className="ml-1 inline-flex items-center rounded-full bg-biq-surface-2 px-2 py-0.5 text-xs font-semibold text-biq-text-primary">
                {entry.delta}
              </span>
            </div>

            {/* Root cause */}
            <p className="text-sm font-medium text-biq-text-primary leading-snug">
              {entry.root_cause}
            </p>

            {/* Consequence */}
            <p className="text-xs text-biq-text-muted leading-relaxed">
              {entry.consequence}
            </p>
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

        {/* Reviewer badge + governance trust badge — always visible in collapsed state */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${reviewerStatusColor(entry.reviewer_badge.status)}`}
          >
            {entry.reviewer_badge.status}
          </span>
          <span className="text-xs text-biq-text-muted">
            {entry.reviewer_badge.reviewer_name}
          </span>
          <TrustBadge
            status={governanceStatus ?? null}
            size="sm"
            onClick={questionId && onGovernanceDetail
              ? (e) => {
                  e?.stopPropagation();
                  onGovernanceDetail(questionId, "question");
                }
              : undefined
            }
          />
        </div>
      </button>

      {/* Expandable timeline */}
      {expanded && entry.timeline_steps.length > 0 && (
        <div className="border-t border-biq-border-subtle px-5 pb-5 pt-4 sm:px-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
            Timeline
          </h4>
          <ol className="relative space-y-4">
            {entry.timeline_steps.map((step, idx) => {
              const meta = STEP_TYPE_META[step.step_type];
              const isLast = idx === entry.timeline_steps.length - 1;

              return (
                <li key={`${step.step_type}-${idx}`} className="relative pl-8">
                  {/* Connector line */}
                  {!isLast && (
                    <span
                      className="absolute left-[11px] top-6 h-full w-px bg-biq-surface-2"
                      aria-hidden="true"
                    />
                  )}
                  {/* Step icon */}
                  <span
                    className={`absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${meta.color}`}
                    aria-hidden="true"
                  >
                    {meta.icon}
                  </span>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <p className="mt-1 text-sm font-medium text-biq-text-primary leading-snug">
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="mt-0.5 text-xs text-biq-text-muted">
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
