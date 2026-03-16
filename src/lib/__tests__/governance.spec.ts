import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  ApprovalMetadata,
  FeedbackThreads,
  TrustBadges,
  CascadeGovernance,
  ReviewContext,
  BusinessEventGovernance,
} from "@/types/golden-flows";

// Mock golden-flows.ts accessors
vi.mock("@/lib/golden-flows", () => ({
  getApprovalStatus: vi.fn(),
  getFeedbackThreads: vi.fn(),
  getTrustBadges: vi.fn(),
  getCascadeGovernance: vi.fn(),
  getReviewContext: vi.fn(),
  getBusinessEvents: vi.fn(),
}));

import {
  loadGovernance,
  getApprovalForFinding,
  getFeedback,
  getTrustBadge,
  getCascadeGovernanceItem,
  getReviewContextItem,
  getBusinessEventItem,
  _resetCache,
} from "@/lib/governance";

import {
  getApprovalStatus,
  getFeedbackThreads,
  getTrustBadges,
  getCascadeGovernance,
  getReviewContext,
  getBusinessEvents,
} from "@/lib/golden-flows";

// ============================================================
// Inline mock data
// ============================================================

const mockApprovalPayload: ApprovalMetadata = {
  schema_version: 1,
  payload_type: "contract_c.approval_metadata",
  generated_at: "2026-03-01T00:00:00Z",
  items: [
    {
      object_type: "finding",
      object_id: "F-001",
      approval_status: "approved",
      record_origin: "demo_seeded",
      source_approval_id: "APR-001",
      reviewer: { reviewer_id: "R-001", display_name: "Alice", role: "analyst" },
      timestamp: "2026-03-01T12:00:00Z",
      review_note: "Looks good",
    },
  ],
};

const mockFeedbackPayload: FeedbackThreads = {
  schema_version: 1,
  payload_type: "contract_c.feedback_threads",
  generated_at: "2026-03-01T00:00:00Z",
  items: [
    {
      feedback_id: "FB-001",
      summary: "Test feedback",
      category: "accuracy",
      priority: "high",
      status: "open",
      disposition: "pending",
      resolution_note: null,
      source: "analyst",
      timeline: {
        created_at: "2026-03-01T00:00:00Z",
        updated_at: "2026-03-01T00:00:00Z",
        resolved_at: "2026-03-01T00:00:00Z",
      },
      linked_approvals: [
        {
          approval_id: "APR-001",
          approval_status: "approved",
          record_origin: "demo_seeded",
          reviewer: { reviewer_id: "R-001", display_name: "Alice", role: "analyst" },
          ts_requested: "2026-03-01T00:00:00Z",
          ts_resolved: "2026-03-01T12:00:00Z",
          review_note: null,
        },
      ],
    },
  ],
};

const mockTrustBadgesPayload: TrustBadges = {
  schema_version: 1,
  payload_type: "contract_c.trust_badges",
  generated_at: "2026-03-01T00:00:00Z",
  summary: {
    total_objects: 5,
    by_status: { approved: 3, pending: 2 },
    by_object_type: {
      finding: { total: 5, by_status: { approved: 3, pending: 2 } },
    },
  },
  badges: [
    {
      object_type: "finding",
      object_id: "F-001",
      approval_status: "approved",
      record_origin: "demo_seeded",
      reviewer: { reviewer_id: "R-001", display_name: "Alice", role: "analyst" },
      last_reviewed_at: "2026-03-01T12:00:00Z",
      approval_count: 1,
    },
  ],
};

const mockCascadePayload: CascadeGovernance = {
  schema_version: 1,
  payload_type: "contract_c.cascade_governance",
  generated_at: "2026-03-01T00:00:00Z",
  items: [
    {
      question_id: "Q-001",
      approval_status: "approved",
      record_origin: "demo_seeded",
      reviewer: { reviewer_id: "R-001", display_name: "Alice", role: "analyst" },
      review_note: null,
      finding_ids: ["F-001"],
      feedback_ids: ["FB-001"],
      event_ids: [],
      ts_requested: "2026-03-01T00:00:00Z",
      ts_resolved: "2026-03-01T12:00:00Z",
    },
  ],
};

const mockReviewContextPayload: ReviewContext = {
  schema_version: 1,
  payload_type: "contract_c.review_context",
  generated_at: "2026-03-01T00:00:00Z",
  items: [],
};

const mockBusinessEventsPayload: BusinessEventGovernance = {
  schema_version: 1,
  payload_type: "contract_c.business_event_governance",
  generated_at: "2026-03-01T00:00:00Z",
  items: [],
};

// ============================================================
// Helpers
// ============================================================

function setAllMocks() {
  vi.mocked(getApprovalStatus).mockReturnValue(mockApprovalPayload);
  vi.mocked(getFeedbackThreads).mockReturnValue(mockFeedbackPayload);
  vi.mocked(getTrustBadges).mockReturnValue(mockTrustBadgesPayload);
  vi.mocked(getCascadeGovernance).mockReturnValue(mockCascadePayload);
  vi.mocked(getReviewContext).mockReturnValue(mockReviewContextPayload);
  vi.mocked(getBusinessEvents).mockReturnValue(mockBusinessEventsPayload);
}

function setAllNull() {
  vi.mocked(getApprovalStatus).mockReturnValue(null);
  vi.mocked(getFeedbackThreads).mockReturnValue(null);
  vi.mocked(getTrustBadges).mockReturnValue(null);
  vi.mocked(getCascadeGovernance).mockReturnValue(null);
  vi.mocked(getReviewContext).mockReturnValue(null);
  vi.mocked(getBusinessEvents).mockReturnValue(null);
}

// ============================================================
// Tests
// ============================================================

describe("governance normalization layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetCache();
  });

  // T-01: Happy path with all 6 payloads populated
  it("T-01: loadGovernance() — happy path with all 6 payloads", () => {
    setAllMocks();
    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.get("F-001")).toEqual(mockApprovalPayload.items[0]);
    expect(gov.feedbackById.get("FB-001")).toEqual(mockFeedbackPayload.items[0]);
    expect(gov.trustBadgeSummary).toEqual(mockTrustBadgesPayload.summary);
    expect(gov.trustBadgeSummary?.total_objects).toBe(5);
    expect(gov.badgesByObjectId.get("F-001")).toEqual(mockTrustBadgesPayload.badges[0]);
    expect(gov.cascadeGovernanceByQuestionId.get("Q-001")).toEqual(mockCascadePayload.items[0]);
    // Review context and business events have empty items
    expect(gov.reviewContextByObjectId.size).toBe(0);
    expect(gov.businessEventById.size).toBe(0);
  });

  // T-02: One payload returns null
  it("T-02: loadGovernance() — one payload returns null (file missing)", () => {
    setAllMocks();
    vi.mocked(getApprovalStatus).mockReturnValue(null);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.size).toBe(0);
    expect(gov.feedbackById.size).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("approval_status")
    );
    warnSpy.mockRestore();
  });

  // T-03: All payloads return null
  it("T-03: loadGovernance() — all payloads return null", () => {
    setAllNull();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.size).toBe(0);
    expect(gov.feedbackById.size).toBe(0);
    expect(gov.businessEventById.size).toBe(0);
    expect(gov.trustBadgeSummary).toBeNull();
    expect(gov.badgesByObjectId.size).toBe(0);
    expect(gov.reviewContextByObjectId.size).toBe(0);
    expect(gov.cascadeGovernanceByQuestionId.size).toBe(0);
    // No errors thrown
    warnSpy.mockRestore();
  });

  // T-04: Approval item with empty object_id
  it("T-04: coherence — approval item with empty object_id is skipped", () => {
    setAllMocks();
    vi.mocked(getApprovalStatus).mockReturnValue({
      ...mockApprovalPayload,
      items: [
        {
          ...mockApprovalPayload.items[0],
          object_id: "",
        },
      ],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.size).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("empty object_id")
    );
    warnSpy.mockRestore();
  });

  // T-05: Missing reviewer_id (warn only, not skipped)
  it("T-05: coherence — missing reviewer_id warns but item is kept", () => {
    setAllMocks();
    vi.mocked(getApprovalStatus).mockReturnValue({
      ...mockApprovalPayload,
      items: [
        {
          ...mockApprovalPayload.items[0],
          reviewer: { reviewer_id: "", display_name: "Alice", role: "analyst" },
        },
      ],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.has("F-001")).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("missing reviewer_id")
    );
    warnSpy.mockRestore();
  });

  // T-06: Feedback references unknown approval
  it("T-06: coherence — feedback references unknown approval", () => {
    setAllMocks();
    vi.mocked(getApprovalStatus).mockReturnValue({
      ...mockApprovalPayload,
      items: [], // No approvals
    });
    vi.mocked(getFeedbackThreads).mockReturnValue({
      ...mockFeedbackPayload,
      items: [
        {
          ...mockFeedbackPayload.items[0],
          linked_approvals: [
            {
              ...mockFeedbackPayload.items[0].linked_approvals[0],
              approval_id: "nonexistent",
            },
          ],
        },
      ],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    loadGovernance();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("unknown approval")
    );
    warnSpy.mockRestore();
  });

  // T-07: Cascade governance references unknown finding
  it("T-07: coherence — cascade_governance references unknown finding", () => {
    setAllMocks();
    vi.mocked(getCascadeGovernance).mockReturnValue({
      ...mockCascadePayload,
      items: [
        {
          ...mockCascadePayload.items[0],
          finding_ids: ["F-999"],
        },
      ],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    loadGovernance();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("unknown finding")
    );
    warnSpy.mockRestore();
  });

  // T-08: Convenience accessor getApprovalForFinding() — found
  it("T-08: getApprovalForFinding() returns matching item", () => {
    setAllMocks();
    const result = getApprovalForFinding("F-001");
    expect(result).toEqual(mockApprovalPayload.items[0]);
  });

  // T-09: Convenience accessor getApprovalForFinding() — not found
  it("T-09: getApprovalForFinding() returns null for missing ID", () => {
    setAllMocks();
    const result = getApprovalForFinding("nonexistent");
    expect(result).toBeNull();
  });

  // T-10: Convenience accessor getTrustBadge() — found
  it("T-10: getTrustBadge() returns matching badge", () => {
    setAllMocks();
    const result = getTrustBadge("F-001");
    expect(result).toEqual(mockTrustBadgesPayload.badges[0]);
  });

  // T-11: Convenience accessor getFeedback() — found
  it("T-11: getFeedback() returns matching feedback item", () => {
    setAllMocks();
    const result = getFeedback("FB-001");
    expect(result).toEqual(mockFeedbackPayload.items[0]);
  });

  // T-12: Duplicate object_id — last-write-wins
  it("T-12: duplicate object_id — last entry wins with warning", () => {
    setAllMocks();
    const firstItem = {
      ...mockApprovalPayload.items[0],
      review_note: "First",
    };
    const secondItem = {
      ...mockApprovalPayload.items[0],
      review_note: "Second",
    };
    vi.mocked(getApprovalStatus).mockReturnValue({
      ...mockApprovalPayload,
      items: [firstItem, secondItem],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gov = loadGovernance();

    expect(gov.approvalsByObjectId.get("F-001")?.review_note).toBe("Second");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("duplicate object_id F-001")
    );
    warnSpy.mockRestore();
  });
});
