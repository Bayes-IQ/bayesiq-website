import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import GovernanceDetailPanel from "../GovernanceDetailPanel";
import type { GovernanceDetailData } from "../GovernanceDetailPanel";

// jsdom does not implement HTMLDialogElement.showModal / close natively.
beforeEach(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
});

function createDialogRef() {
  return { current: null as HTMLDialogElement | null };
}

const approvalData: GovernanceDetailData = {
  records: {
    "finding-001": {
      type: "finding",
      object_id: "finding-001",
      approval_status: "approved",
      record_origin: "demo_seeded",
      reviewer: { reviewer_id: "r1", display_name: "Jane Doe", role: "auditor" },
      timestamp: "2026-01-15T10:00:00Z",
      review_note: "Looks good",
    },
  },
  reviewContexts: {},
};

const cascadeData: GovernanceDetailData = {
  records: {
    "q-001": {
      type: "question",
      question_id: "q-001",
      approval_status: "pending",
      record_origin: "demo_approved",
      reviewer: { reviewer_id: "r2", display_name: "Bob Smith", role: "reviewer" },
      review_note: null,
      finding_ids: ["f-1", "f-2"],
      feedback_ids: [],
      event_ids: ["e-1"],
      ts_requested: "2026-01-10T08:00:00Z",
      ts_resolved: "2026-01-12T08:00:00Z",
    },
  },
  reviewContexts: {},
};

const linkedRefsData: GovernanceDetailData = {
  records: {
    "q-001": {
      type: "question",
      question_id: "q-001",
      approval_status: "approved",
      record_origin: "demo_seeded",
      reviewer: { reviewer_id: "r1", display_name: "Jane", role: null },
      review_note: null,
      finding_ids: ["f-1", "f-2"],
      feedback_ids: ["fb-1"],
      event_ids: [],
      ts_requested: "2026-01-10T08:00:00Z",
      ts_resolved: "2026-01-12T08:00:00Z",
    },
  },
  reviewContexts: {},
};

const emptyData: GovernanceDetailData = {
  records: {},
  reviewContexts: {},
};

describe("GovernanceDetailPanel", () => {
  it("does not open dialog when objectId is null", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId={null}
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={emptyData}
      />
    );
    const dialog = screen.getByTestId("governance-detail-dialog") as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("renders panel with header showing objectId when open", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="finding-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={approvalData}
      />
    );
    expect(screen.getByTestId("panel-object-id")).toHaveTextContent("finding-001");
    const dialog = screen.getByTestId("governance-detail-dialog") as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(true);
  });

  it("renders approval details for finding objectType", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="finding-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={approvalData}
      />
    );

    expect(screen.getByTestId("governance-details")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByTestId("status-pill")).toHaveTextContent("approved");
  });

  it("renders cascade governance details for question objectType", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="q-001"
        objectType="question"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={cascadeData}
      />
    );

    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByTestId("status-pill")).toHaveTextContent("pending");
  });

  it("renders 'No governance record found' when record not in data", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="unknown-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={emptyData}
      />
    );
    expect(screen.getByTestId("no-governance-message")).toHaveTextContent(
      "No governance record found for this object."
    );
  });

  it("renders review note when present", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="finding-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={approvalData}
      />
    );

    expect(screen.getByTestId("review-note")).toBeInTheDocument();
    expect(screen.getByText("Looks good")).toBeInTheDocument();
  });

  it("does not render review note section when null", () => {
    const dialogRef = createDialogRef();
    const noNoteData: GovernanceDetailData = {
      records: {
        "f-001": {
          type: "finding",
          object_id: "f-001",
          approval_status: "approved",
          record_origin: "live",
          reviewer: { reviewer_id: "r1", display_name: "Jane", role: null },
          timestamp: "2026-01-15T10:00:00Z",
          review_note: null,
        },
      },
      reviewContexts: {},
    };

    render(
      <GovernanceDetailPanel
        objectId="f-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={noNoteData}
      />
    );

    expect(screen.queryByTestId("review-note")).not.toBeInTheDocument();
  });

  it("renders linked references as static code text for question type", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="q-001"
        objectType="question"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={linkedRefsData}
      />
    );

    const refs = screen.getByTestId("linked-references");
    expect(refs).toBeInTheDocument();
    const codes = refs.querySelectorAll("code");
    expect(codes.length).toBe(3); // f-1, f-2, fb-1
    expect(codes[0].textContent).toBe("f-1");
    expect(refs.querySelectorAll("a").length).toBe(0);
  });

  it("calls onClose when close button clicked", async () => {
    const dialogRef = createDialogRef();
    const onClose = vi.fn();
    render(
      <GovernanceDetailPanel
        objectId="finding-001"
        objectType="finding"
        onClose={onClose}
        dialogRef={dialogRef}
        data={approvalData}
      />
    );

    const closeBtn = screen.getByTestId("panel-close-button");
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("panel header shows static status display, not clickable TrustBadge", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="finding-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={approvalData}
      />
    );

    expect(screen.getByTestId("status-pill")).toBeInTheDocument();
    expect(screen.queryByTestId("trust-badge-button")).not.toBeInTheDocument();
  });

  it("shows no-governance message when data is null", () => {
    const dialogRef = createDialogRef();
    render(
      <GovernanceDetailPanel
        objectId="f-001"
        objectType="finding"
        onClose={() => {}}
        dialogRef={dialogRef}
        data={null}
      />
    );

    expect(screen.getByTestId("no-governance-message")).toBeInTheDocument();
  });
});
