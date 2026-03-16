/**
 * Governance Normalization Layer (GF-16)
 *
 * Unified typed API that normalizes all 6 Contract C governance payloads
 * into indexed lookup maps. Components consume governance through this
 * module, not raw JSON.
 *
 * Architecture:
 *   golden-flows.ts (raw I/O) -> governance.ts (normalize + index) -> components
 */

import type {
  ApprovalItem,
  FeedbackItem,
  TrustBadge,
  BadgeSummary,
  CascadeGovernanceItem,
  ReviewContextItem,
  BusinessEventGovernanceItem,
} from "@/types/golden-flows";

import {
  getApprovalStatus,
  getFeedbackThreads,
  getTrustBadges,
  getCascadeGovernance,
  getReviewContext,
  getBusinessEvents,
} from "@/lib/golden-flows";

// ============================================================
// Re-exported type aliases for governance-layer clarity
// ============================================================

export type ApprovalMetadataItem = ApprovalItem;
export type FeedbackThreadItem = FeedbackItem;
export type TrustBadgeItem = TrustBadge;
export type TrustBadgeSummary = BadgeSummary;
export type BusinessEventItem = BusinessEventGovernanceItem;
export type { CascadeGovernanceItem, ReviewContextItem };

// ============================================================
// Status value unions (re-exported for convenience)
// ============================================================

export type ApprovalStatusValue = "pending" | "approved" | "rejected" | "deferred";
export type RecordOrigin = "demo_seeded" | "demo_approved" | "live";
export type FeedbackDisposition = "pending" | "in_progress" | "resolved" | "rejected";

// ============================================================
// GovernanceData interface
// ============================================================

export interface GovernanceData {
  approvalsByObjectId: Map<string, ApprovalMetadataItem>;
  feedbackById: Map<string, FeedbackThreadItem>;
  businessEventById: Map<string, BusinessEventItem>;
  trustBadgeSummary: TrustBadgeSummary | null;
  badgesByObjectId: Map<string, TrustBadgeItem>;
  reviewContextByObjectId: Map<string, ReviewContextItem>;
  cascadeGovernanceByQuestionId: Map<string, CascadeGovernanceItem>;
}

// ============================================================
// Memoization cache
// ============================================================

let cachedGovernance: GovernanceData | null = null;

/**
 * Reset the memoization cache. Exported for testing only.
 */
export function _resetCache(): void {
  cachedGovernance = null;
}

// ============================================================
// Main entry point
// ============================================================

/**
 * Load and normalize all 6 Contract C governance payloads into indexed
 * lookup maps. Result is memoized (build-time static data).
 */
export function loadGovernance(): GovernanceData {
  if (cachedGovernance) return cachedGovernance;

  // --- Load raw payloads ---
  const approvalRaw = getApprovalStatus();
  const feedbackRaw = getFeedbackThreads();
  const trustBadgesRaw = getTrustBadges();
  const cascadeRaw = getCascadeGovernance();
  const reviewRaw = getReviewContext();
  const businessRaw = getBusinessEvents();

  // --- Build maps ---
  const approvalsByObjectId = new Map<string, ApprovalMetadataItem>();
  const feedbackById = new Map<string, FeedbackThreadItem>();
  const businessEventById = new Map<string, BusinessEventItem>();
  const badgesByObjectId = new Map<string, TrustBadgeItem>();
  const reviewContextByObjectId = new Map<string, ReviewContextItem>();
  const cascadeGovernanceByQuestionId = new Map<string, CascadeGovernanceItem>();
  let trustBadgeSummary: TrustBadgeSummary | null = null;

  // --- Approval Status ---
  if (approvalRaw === null) {
    console.warn("[governance] Failed to load approval_status — map will be empty");
  } else {
    for (const item of approvalRaw.items) {
      if (!item.object_id) {
        console.warn("[governance] approval item has empty object_id, skipping");
        continue;
      }
      if (approvalsByObjectId.has(item.object_id)) {
        console.warn(
          `[governance] duplicate object_id ${item.object_id} in approval_status, last entry wins`
        );
      }
      if (item.reviewer && !item.reviewer.reviewer_id) {
        console.warn(
          `[governance] approval_status item ${item.object_id} has missing reviewer_id`
        );
      }
      approvalsByObjectId.set(item.object_id, item);
    }
  }

  // --- Feedback Threads ---
  if (feedbackRaw === null) {
    console.warn("[governance] Failed to load feedback_threads — map will be empty");
  } else {
    for (const item of feedbackRaw.items) {
      feedbackById.set(item.feedback_id, item);
    }
  }

  // --- Trust Badges ---
  if (trustBadgesRaw === null) {
    console.warn("[governance] Failed to load trust_badges — map will be empty");
  } else {
    trustBadgeSummary = trustBadgesRaw.summary;
    for (const badge of trustBadgesRaw.badges) {
      if (!badge.object_id) {
        console.warn("[governance] trust_badges item has empty object_id, skipping");
        continue;
      }
      if (badge.reviewer && !badge.reviewer.reviewer_id) {
        console.warn(
          `[governance] trust_badges item ${badge.object_id} has missing reviewer_id`
        );
      }
      badgesByObjectId.set(badge.object_id, badge);
    }
  }

  // --- Cascade Governance ---
  if (cascadeRaw === null) {
    console.warn("[governance] Failed to load cascade_governance — map will be empty");
  } else {
    for (const item of cascadeRaw.items) {
      if (item.reviewer && !item.reviewer.reviewer_id) {
        console.warn(
          `[governance] cascade_governance item ${item.question_id} has missing reviewer_id`
        );
      }
      cascadeGovernanceByQuestionId.set(item.question_id, item);
    }
  }

  // --- Review Context ---
  if (reviewRaw === null) {
    console.warn("[governance] Failed to load review_context — map will be empty");
  } else {
    for (const item of reviewRaw.items) {
      if (!item.object_id) {
        console.warn("[governance] review_context item has empty object_id, skipping");
        continue;
      }
      reviewContextByObjectId.set(item.object_id, item);
    }
  }

  // --- Business Events ---
  if (businessRaw === null) {
    console.warn("[governance] Failed to load business_events — map will be empty");
  } else {
    for (const item of businessRaw.items) {
      if (item.reviewer && !item.reviewer.reviewer_id) {
        console.warn(
          `[governance] business_events item ${item.event_id} has missing reviewer_id`
        );
      }
      businessEventById.set(item.event_id, item);
    }
  }

  // --- Coherence validation: cross-references ---

  // Feedback linked_approvals -> approvalsByObjectId
  for (const [feedbackId, fb] of feedbackById) {
    for (const la of fb.linked_approvals) {
      if (!approvalsByObjectId.has(la.approval_id)) {
        console.warn(
          `[governance] feedback ${feedbackId} references unknown approval ${la.approval_id}`
        );
      }
    }
  }

  // Cascade governance finding_ids -> approvalsByObjectId (object_type === "finding")
  for (const [questionId, cg] of cascadeGovernanceByQuestionId) {
    for (const findingId of cg.finding_ids) {
      const approval = approvalsByObjectId.get(findingId);
      if (!approval || approval.object_type !== "finding") {
        console.warn(
          `[governance] cascade_governance ${questionId} references unknown finding ${findingId}`
        );
      }
    }
  }

  const data: GovernanceData = {
    approvalsByObjectId,
    feedbackById,
    businessEventById,
    trustBadgeSummary,
    badgesByObjectId,
    reviewContextByObjectId,
    cascadeGovernanceByQuestionId,
  };

  cachedGovernance = data;
  return data;
}

// ============================================================
// Convenience accessors
// ============================================================

export function getApprovalForFinding(findingId: string): ApprovalMetadataItem | null {
  return loadGovernance().approvalsByObjectId.get(findingId) ?? null;
}

export function getFeedback(feedbackId: string): FeedbackThreadItem | null {
  return loadGovernance().feedbackById.get(feedbackId) ?? null;
}

export function getTrustBadge(objectId: string): TrustBadgeItem | null {
  return loadGovernance().badgesByObjectId.get(objectId) ?? null;
}

export function getCascadeGovernanceItem(questionId: string): CascadeGovernanceItem | null {
  return loadGovernance().cascadeGovernanceByQuestionId.get(questionId) ?? null;
}

export function getReviewContextItem(objectId: string): ReviewContextItem | null {
  return loadGovernance().reviewContextByObjectId.get(objectId) ?? null;
}

export function getBusinessEventItem(eventId: string): BusinessEventItem | null {
  return loadGovernance().businessEventById.get(eventId) ?? null;
}
