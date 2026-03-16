import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BusinessEventPreview, {
  humanizeEventId,
  borderStyle,
} from "../BusinessEventPreview";
import type { BusinessEventItem } from "@/lib/governance";

function makeBusinessEvent(
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
    review_note:
      "NRR redefinition reviewed; impact scoped to sandbox accounts only.",
    ...overrides,
  } as BusinessEventItem;
}

describe("humanizeEventId", () => {
  it("strips vertical prefix and title-cases", () => {
    expect(humanizeEventId("fintech_nrr_redef_q1")).toBe("Nrr Redef Q1");
  });

  it("handles multi-word event IDs", () => {
    expect(humanizeEventId("hospital_drg_reclassification")).toBe(
      "Drg Reclassification"
    );
  });
});

describe("borderStyle", () => {
  it("returns dashed amber for pending", () => {
    expect(borderStyle("pending")).toContain("border-dashed");
    expect(borderStyle("pending")).toContain("border-amber-300");
  });

  it("returns dashed amber for deferred", () => {
    expect(borderStyle("deferred")).toContain("border-dashed");
  });

  it("returns solid green for approved", () => {
    expect(borderStyle("approved")).toContain("border-solid");
    expect(borderStyle("approved")).toContain("border-green-300");
  });

  it("returns solid red for rejected", () => {
    expect(borderStyle("rejected")).toContain("border-solid");
    expect(borderStyle("rejected")).toContain("border-red-300");
  });
});

describe("BusinessEventPreview", () => {
  it("renders humanized event_id in collapsed state", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    expect(screen.getByText("Nrr Redef Q1")).toBeInTheDocument();
  });

  it("renders TrustBadge with correct approval_status", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    const badge = screen.getByTestId("trust-badge");
    expect(badge).toHaveTextContent("Approved");
  });

  it("shows reviewer display_name", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
  });

  it("expand click reveals review note", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    // Review note should not be visible initially
    expect(screen.queryByText(/NRR redefinition/)).not.toBeInTheDocument();
    // Click to expand
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/NRR redefinition/)).toBeInTheDocument();
  });

  it("expand click reveals formatted timestamps", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/Requested:/)).toBeInTheDocument();
    expect(screen.getByText(/Resolved:/)).toBeInTheDocument();
  });

  it("does not render review note section when review_note is null", () => {
    render(
      <BusinessEventPreview
        item={makeBusinessEvent({ review_note: null })}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Review Note")).not.toBeInTheDocument();
  });

  it("pending status renders dashed amber border", () => {
    render(
      <BusinessEventPreview
        item={makeBusinessEvent({ approval_status: "pending" })}
      />
    );
    const card = screen.getByTestId("business-event-preview");
    expect(card.className).toContain("border-dashed");
    expect(card.className).toContain("border-amber-300");
  });

  it("approved status renders solid green border", () => {
    render(
      <BusinessEventPreview
        item={makeBusinessEvent({ approval_status: "approved" })}
      />
    );
    const card = screen.getByTestId("business-event-preview");
    expect(card.className).toContain("border-solid");
    expect(card.className).toContain("border-green-300");
  });

  it("rejected status renders solid red border", () => {
    render(
      <BusinessEventPreview
        item={makeBusinessEvent({ approval_status: "rejected" })}
      />
    );
    const card = screen.getByTestId("business-event-preview");
    expect(card.className).toContain("border-solid");
    expect(card.className).toContain("border-red-300");
  });

  it("shows record origin badge when expanded", () => {
    render(<BusinessEventPreview item={makeBusinessEvent()} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});
