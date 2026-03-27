import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackThread from "../FeedbackThread";
import type { FeedbackThreadItem } from "@/lib/governance";

function makeFeedbackItem(
  overrides: Partial<FeedbackThreadItem> = {}
): FeedbackThreadItem {
  return {
    feedback_id: "fb-001",
    summary: "Revenue figures need re-audit",
    category: "accuracy",
    priority: "high",
    status: "open",
    disposition: "pending",
    resolution_note: null,
    source: "manual_review",
    timeline: {
      created_at: "2026-01-10T12:00:00Z",
      updated_at: "2026-01-15T08:00:00Z",
      resolved_at: "",
    },
    linked_approvals: [
      {
        approval_id: "appr-001",
        approval_status: "approved",
        record_origin: "demo_seeded",
        reviewer: {
          reviewer_id: "rev-001",
          display_name: "Jane Doe",
          role: "Senior Auditor",
        },
        ts_requested: "2026-01-11T09:00:00Z",
        ts_resolved: "2026-01-12T14:00:00Z",
        review_note: "Looks good after correction",
      },
    ],
    ...overrides,
  } as FeedbackThreadItem;
}

describe("FeedbackThread", () => {
  it("renders summary, category badge, and disposition pill for a pending item", () => {
    const item = makeFeedbackItem({ disposition: "pending" });
    render(<FeedbackThread item={item} />);

    expect(screen.getByText("Revenue figures need re-audit")).toBeDefined();
    expect(screen.getByText("accuracy")).toBeDefined();
    expect(screen.getByText("Pending")).toBeDefined();
  });

  it("renders resolution_note only when disposition is resolved", () => {
    const item = makeFeedbackItem({
      disposition: "resolved",
      resolution_note: "Fixed in batch 42",
    });
    render(<FeedbackThread item={item} />);

    // Expand
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Fixed in batch 42")).toBeDefined();
  });

  it("does not render resolution_note when disposition is pending", () => {
    const item = makeFeedbackItem({
      disposition: "pending",
      resolution_note: "Should not show",
    });
    render(<FeedbackThread item={item} />);

    // Expand
    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Should not show")).toBeNull();
  });

  it("renders linked_approvals chain with reviewer display_name and role", () => {
    const item = makeFeedbackItem();
    render(<FeedbackThread item={item} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Jane Doe")).toBeDefined();
    expect(screen.getByText("Senior Auditor")).toBeDefined();
  });

  it("approval status pill color matches expected class for approved/rejected/pending", () => {
    const item = makeFeedbackItem({
      linked_approvals: [
        {
          approval_id: "appr-approved",
          approval_status: "approved",
          record_origin: "demo_seeded",
          reviewer: { reviewer_id: "r1", display_name: "A", role: "Auditor" },
          ts_requested: "2026-01-01T00:00:00Z",
          ts_resolved: "2026-01-02T00:00:00Z",
          review_note: null,
        },
        {
          approval_id: "appr-rejected",
          approval_status: "rejected",
          record_origin: "demo_seeded",
          reviewer: { reviewer_id: "r2", display_name: "B", role: "Auditor" },
          ts_requested: "2026-01-01T00:00:00Z",
          ts_resolved: "2026-01-02T00:00:00Z",
          review_note: null,
        },
        {
          approval_id: "appr-pending",
          approval_status: "pending",
          record_origin: "demo_seeded",
          reviewer: { reviewer_id: "r3", display_name: "C", role: "Auditor" },
          ts_requested: "2026-01-01T00:00:00Z",
          ts_resolved: "",
          review_note: null,
        },
      ],
    });
    render(<FeedbackThread item={item} />);

    fireEvent.click(screen.getByRole("button"));

    const pills = screen.getAllByText(/^(approved|rejected|pending)$/);
    expect(pills[0].className).toContain("bg-biq-status-success-subtle");
    expect(pills[1].className).toContain("bg-biq-status-error-subtle");
    expect(pills[2].className).toContain("bg-yellow-100");
  });

  it("toggle expand/collapse updates aria-expanded attribute", () => {
    const item = makeFeedbackItem();
    render(<FeedbackThread item={item} />);

    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders timestamps from timeline object", () => {
    const item = makeFeedbackItem({
      linked_approvals: [],
      timeline: {
        created_at: "2026-03-01T00:00:00Z",
        updated_at: "2026-03-10T00:00:00Z",
        resolved_at: "2026-03-12T00:00:00Z",
      },
    });
    render(<FeedbackThread item={item} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText(/Created:/)).toBeDefined();
    expect(screen.getByText(/Updated:/)).toBeDefined();
    expect(screen.getByText(/Resolved:/)).toBeDefined();
  });

  it("handles item with empty linked_approvals array", () => {
    const item = makeFeedbackItem({ linked_approvals: [] });
    render(<FeedbackThread item={item} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Approval Chain")).toBeNull();
  });
});
