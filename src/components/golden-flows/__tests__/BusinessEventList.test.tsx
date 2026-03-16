import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import BusinessEventList from "../BusinessEventList";
import type { BusinessEventItem } from "@/lib/governance";

function makeEvent(
  overrides: Partial<BusinessEventItem> = {}
): BusinessEventItem {
  return {
    event_id: "fintech_nrr_redef_q1",
    approval_status: "approved",
    record_origin: "live",
    source_approval_id: "demo-appr-fintech-01",
    reviewer: {
      reviewer_id: "demo-reviewer-fintech",
      display_name: "Maya Chen",
      role: "admin",
    },
    ts_requested: "2026-03-10T12:00:00+00:00",
    ts_resolved: "2026-03-10T14:00:00+00:00",
    review_note: null,
    ...overrides,
  } as BusinessEventItem;
}

describe("BusinessEventList", () => {
  it("returns null when events array is empty", () => {
    const { container } = render(<BusinessEventList events={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("groups events into Pending Review and Resolved sections", () => {
    const events = [
      makeEvent({
        event_id: "fintech_a",
        approval_status: "pending",
        ts_requested: "2026-03-10T12:00:00Z",
      }),
      makeEvent({
        event_id: "fintech_b",
        approval_status: "approved",
        ts_requested: "2026-03-10T14:00:00Z",
      }),
      makeEvent({
        event_id: "fintech_c",
        approval_status: "rejected",
        ts_requested: "2026-03-10T16:00:00Z",
      }),
    ];
    render(<BusinessEventList events={events} />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("renders only non-empty groups", () => {
    const events = [
      makeEvent({
        event_id: "fintech_a",
        approval_status: "approved",
        ts_requested: "2026-03-10T12:00:00Z",
      }),
    ];
    render(<BusinessEventList events={events} />);
    expect(screen.queryByText("Pending Review")).not.toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("sorts events within groups by ts_requested descending", () => {
    const events = [
      makeEvent({
        event_id: "fintech_earlier",
        approval_status: "pending",
        ts_requested: "2026-03-08T12:00:00Z",
      }),
      makeEvent({
        event_id: "fintech_later",
        approval_status: "pending",
        ts_requested: "2026-03-12T12:00:00Z",
      }),
    ];
    render(<BusinessEventList events={events} />);
    const cards = screen.getAllByTestId("business-event-preview");
    // "Later" should come first (more recent)
    expect(cards[0]).toHaveTextContent("Later");
    expect(cards[1]).toHaveTextContent("Earlier");
  });

  it("deferred events appear in Pending Review group", () => {
    const events = [
      makeEvent({
        event_id: "fintech_deferred",
        approval_status: "deferred",
        ts_requested: "2026-03-10T12:00:00Z",
      }),
    ];
    render(<BusinessEventList events={events} />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.queryByText("Resolved")).not.toBeInTheDocument();
  });
});
