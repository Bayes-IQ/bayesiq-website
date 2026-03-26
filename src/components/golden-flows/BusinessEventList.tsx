"use client";

import type { BusinessEventItem } from "@/lib/governance";
import BusinessEventPreview from "./BusinessEventPreview";

interface BusinessEventListProps {
  events: BusinessEventItem[];
}

type StatusGroup = "pending_review" | "resolved";

const GROUP_ORDER: StatusGroup[] = ["pending_review", "resolved"];

const GROUP_LABELS: Record<StatusGroup, string> = {
  pending_review: "Pending Review",
  resolved: "Resolved",
};

function statusGroup(
  status: BusinessEventItem["approval_status"]
): StatusGroup {
  switch (status) {
    case "pending":
    case "deferred":
      return "pending_review";
    case "approved":
    case "rejected":
      return "resolved";
  }
}

export default function BusinessEventList({
  events,
}: BusinessEventListProps) {
  if (events.length === 0) return null;

  // Group by status category
  const groups = new Map<StatusGroup, BusinessEventItem[]>();
  for (const event of events) {
    const group = statusGroup(event.approval_status);
    const existing = groups.get(group) ?? [];
    existing.push(event);
    groups.set(group, existing);
  }

  // Sort within each group by ts_requested descending
  for (const items of groups.values()) {
    items.sort(
      (a, b) =>
        new Date(b.ts_requested).getTime() -
        new Date(a.ts_requested).getTime()
    );
  }

  return (
    <div>
      {GROUP_ORDER.map((group) => {
        const items = groups.get(group);
        if (!items || items.length === 0) return null;

        return (
          <div key={group} className="mt-6 first:mt-0">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-biq-text-muted mb-3">
              {GROUP_LABELS[group]}
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <BusinessEventPreview key={item.event_id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { BusinessEventListProps };
