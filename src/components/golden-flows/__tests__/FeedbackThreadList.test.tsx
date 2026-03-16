import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedbackThreadList from "../FeedbackThreadList";
import type { FeedbackThreadItem } from "@/lib/governance";

function makeItem(
  id: string,
  disposition: FeedbackThreadItem["disposition"],
  updatedAt: string
): FeedbackThreadItem {
  return {
    feedback_id: id,
    summary: `Feedback ${id}`,
    category: "accuracy",
    priority: "high",
    status: "open",
    disposition,
    resolution_note: null,
    source: "manual_review",
    timeline: {
      created_at: "2026-01-01T00:00:00Z",
      updated_at: updatedAt,
      resolved_at: "",
    },
    linked_approvals: [],
  } as FeedbackThreadItem;
}

describe("FeedbackThreadList", () => {
  it("groups items by disposition in correct order: in_progress, pending, rejected, resolved", () => {
    const items: FeedbackThreadItem[] = [
      makeItem("fb-resolved", "resolved", "2026-01-01T00:00:00Z"),
      makeItem("fb-pending", "pending", "2026-01-02T00:00:00Z"),
      makeItem("fb-in-progress", "in_progress", "2026-01-03T00:00:00Z"),
      makeItem("fb-rejected", "rejected", "2026-01-04T00:00:00Z"),
    ];

    render(<FeedbackThreadList feedbackItems={items} />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "In Progress",
      "Pending",
      "Rejected",
      "Resolved",
    ]);
  });

  it("within a disposition group, items sorted by timeline.updated_at descending", () => {
    const items: FeedbackThreadItem[] = [
      makeItem("fb-old", "pending", "2026-01-01T00:00:00Z"),
      makeItem("fb-new", "pending", "2026-03-01T00:00:00Z"),
      makeItem("fb-mid", "pending", "2026-02-01T00:00:00Z"),
    ];

    render(<FeedbackThreadList feedbackItems={items} />);

    const summaries = screen.getAllByText(/^Feedback fb-/);
    expect(summaries.map((s) => s.textContent)).toEqual([
      "Feedback fb-new",
      "Feedback fb-mid",
      "Feedback fb-old",
    ]);
  });

  it("renders empty state message when feedbackItems is empty", () => {
    render(<FeedbackThreadList feedbackItems={[]} />);

    expect(
      screen.getByText("No feedback threads available.")
    ).toBeDefined();
  });

  it("renders correct group headings", () => {
    const items: FeedbackThreadItem[] = [
      makeItem("fb-1", "in_progress", "2026-01-01T00:00:00Z"),
      makeItem("fb-2", "resolved", "2026-01-01T00:00:00Z"),
    ];

    render(<FeedbackThreadList feedbackItems={items} />);

    // Group headings are h3 elements
    const headings = screen.getAllByRole("heading", { level: 3 });
    const headingTexts = headings.map((h) => h.textContent);
    expect(headingTexts).toContain("In Progress");
    expect(headingTexts).toContain("Resolved");
    expect(headingTexts).not.toContain("Pending");
    expect(headingTexts).not.toContain("Rejected");
  });

  it("renders correct count of FeedbackThread components", () => {
    const items: FeedbackThreadItem[] = [
      makeItem("fb-1", "pending", "2026-01-01T00:00:00Z"),
      makeItem("fb-2", "pending", "2026-01-02T00:00:00Z"),
      makeItem("fb-3", "resolved", "2026-01-03T00:00:00Z"),
    ];

    render(<FeedbackThreadList feedbackItems={items} />);

    // Each FeedbackThread has a button for expand/collapse
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});
