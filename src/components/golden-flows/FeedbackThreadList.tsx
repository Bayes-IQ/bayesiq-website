"use client";

import type { FeedbackThreadItem } from "@/lib/governance";
import FeedbackThread from "./FeedbackThread";

interface FeedbackThreadListProps {
  feedbackItems: FeedbackThreadItem[];
}

const DISPOSITION_SORT_ORDER: Record<FeedbackThreadItem["disposition"], number> = {
  in_progress: 0,
  pending: 1,
  rejected: 2,
  resolved: 3,
};

const DISPOSITION_LABELS: Record<FeedbackThreadItem["disposition"], string> = {
  in_progress: "In Progress",
  pending: "Pending",
  rejected: "Rejected",
  resolved: "Resolved",
};

const DISPOSITION_ORDER: FeedbackThreadItem["disposition"][] = [
  "in_progress",
  "pending",
  "rejected",
  "resolved",
];

export default function FeedbackThreadList({ feedbackItems }: FeedbackThreadListProps) {
  // Filter out internal pipeline feedback (evaluations, staff reviews)
  const clientFeedback = feedbackItems.filter((item) => {
    const s = item.summary?.toLowerCase() ?? "";
    return !s.startsWith("# evaluation:") && !s.startsWith("# staff swe review:");
  });

  if (clientFeedback.length === 0) {
    return (
      <p className="text-sm text-biq-text-muted italic">No feedback threads available.</p>
    );
  }

  // Group by disposition
  const groups = new Map<FeedbackThreadItem["disposition"], FeedbackThreadItem[]>();
  for (const item of clientFeedback) {
    const existing = groups.get(item.disposition) ?? [];
    existing.push(item);
    groups.set(item.disposition, existing);
  }

  // Sort within each group by updated_at descending
  for (const items of groups.values()) {
    items.sort(
      (a, b) =>
        new Date(b.timeline.updated_at).getTime() -
        new Date(a.timeline.updated_at).getTime()
    );
  }

  return (
    <div>
      {DISPOSITION_ORDER.map((disposition) => {
        const items = groups.get(disposition);
        if (!items || items.length === 0) return null;

        return (
          <div key={disposition} className="mt-6 first:mt-0">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
              {DISPOSITION_LABELS[disposition]}
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <FeedbackThread key={item.feedback_id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
