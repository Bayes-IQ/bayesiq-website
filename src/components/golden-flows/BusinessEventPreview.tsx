"use client";

import { useState } from "react";
import type { BusinessEventItem } from "@/lib/governance";
import TrustBadge from "./TrustBadge";

interface BusinessEventPreviewProps {
  item: BusinessEventItem;
}

function humanizeEventId(eventId: string): string {
  // Remove vertical prefix (e.g., "fintech_" or "hospital_")
  const parts = eventId.split("_");
  // Drop the first part (vertical prefix), join rest with spaces, title-case
  const rest = parts.slice(1).join(" ");
  return rest
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bV(\d)/g, "v$1"); // keep version numbers lowercase
}

function borderStyle(
  status: BusinessEventItem["approval_status"]
): string {
  switch (status) {
    case "pending":
    case "deferred":
      return "border-dashed border-amber-300";
    case "approved":
      return "border-solid border-green-300";
    case "rejected":
      return "border-solid border-red-300";
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

const ORIGIN_LABELS: Record<BusinessEventItem["record_origin"], string> = {
  demo_seeded: "Demo Seeded",
  demo_approved: "Demo Approved",
  live: "Live",
};

export default function BusinessEventPreview({
  item,
}: BusinessEventPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 ${borderStyle(item.approval_status)} bg-white shadow-sm`}
      data-testid="business-event-preview"
    >
      {/* Collapsed view — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-bayesiq-500 rounded-xl"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Event name */}
            <p className="text-sm font-medium text-bayesiq-900 leading-snug">
              {humanizeEventId(item.event_id)}
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge
                status={item.approval_status}
                size="sm"
                showLabel
              />
              {item.reviewer?.display_name && (
                <span className="text-xs text-bayesiq-500">
                  {item.reviewer.display_name}
                </span>
              )}
              <span className="text-xs text-bayesiq-400">
                {relativeTime(item.ts_requested)}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <span
            className={`mt-1 shrink-0 text-bayesiq-400 transition-transform duration-200 ${
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
        <div className="border-t border-bayesiq-100 px-5 pb-5 pt-4 sm:px-6">
          {/* Review note */}
          {item.review_note && (
            <div className="bg-bayesiq-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-bayesiq-500 mb-1">
                Review Note
              </p>
              <p className="text-sm text-bayesiq-800">{item.review_note}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap gap-4 text-xs text-bayesiq-400 mb-3">
            <span>Requested: {formatDate(item.ts_requested)}</span>
            {item.ts_resolved && (
              <span>Resolved: {formatDate(item.ts_resolved)}</span>
            )}
          </div>

          {/* Record origin + source approval */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-bayesiq-100 text-bayesiq-700">
              {ORIGIN_LABELS[item.record_origin]}
            </span>
            <span className="text-[10px] text-bayesiq-300">
              Source: <code>{item.source_approval_id}</code>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Exported for testing */
export { humanizeEventId, borderStyle };
export type { BusinessEventPreviewProps };
