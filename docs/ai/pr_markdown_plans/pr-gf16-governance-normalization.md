# PR#30 — Contract C Governance Normalization Layer (GF-16)

Last Updated: 2026-03-15

PR Type:
- [x] Website (biq_website)

---

## Roadmap Position

```
Phase 5.0–5.3 ✅ (Contract B ingestion, schemas, data loader, UI components)
PR-29 ✅ (Contract C governance data ingestion)
PR#GF-16 — Governance Normalization Layer ← THIS PR
PR#GF-17 — Feedback Thread Component (depends on this)
PR#GF-18 — Trust Micro-Badges (depends on this)
```

---

## Goal

Create `src/lib/governance.ts` — a unified typed API that normalizes all 6 Contract C governance payloads into a single internal governance data layer. Components consume governance through this module, not raw JSON. Cross-payload coherence (finding IDs, reviewer attribution) is validated once at load time.

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `src/lib/governance.ts` | New: normalized governance API |
| `src/lib/__tests__/governance.spec.ts` | New: unit tests for normalization |

## Files NOT Touched

- `src/lib/golden-flows.ts` — raw accessors remain as-is
- `public/golden-flows/governance/*.json` — data files unchanged
- `src/types/golden-flows/contract-c/*.ts` — generated types unchanged

---

## Source Payloads (C-002)

The 6 Contract C JSON files consumed by this module, all located in `public/golden-flows/governance/`:

| # | Filename | Existing accessor in `golden-flows.ts` | Return type |
|---|----------|----------------------------------------|-------------|
| 1 | `approval_status.json` | `getApprovalStatus()` | `ApprovalMetadata` |
| 2 | `feedback_threads.json` | `getFeedbackThreads()` | `FeedbackThreads` |
| 3 | `trust_badges.json` | `getTrustBadges()` | `TrustBadges` |
| 4 | `cascade_governance.json` | `getCascadeGovernance()` | `CascadeGovernance` |
| 5 | `review_context.json` | `getReviewContext()` | `ReviewContext` |
| 6 | `business_events.json` | `getBusinessEvents()` | `BusinessEventGovernance` |

Payloads 5 and 6 currently have empty `items[]` arrays. The normalization layer handles this gracefully (empty maps, no warnings).

---

## Relationship to `golden-flows.ts` (C-006)

`src/lib/golden-flows.ts` already exports 7 raw Contract C accessor functions (listed in the table above, plus `getPublishedDocs()`). These accessors call `loadContractC<T>(payloadType)` which reads JSON from `public/golden-flows/governance/` at build time.

**`governance.ts` wraps these existing accessors.** It does not duplicate the file-reading logic. Instead:

```
golden-flows.ts (raw I/O)  →  governance.ts (normalize + index)  →  components
```

- `loadGovernance()` internally calls `getApprovalStatus()`, `getFeedbackThreads()`, `getTrustBadges()`, `getCascadeGovernance()`, `getReviewContext()`, `getBusinessEvents()` from `golden-flows.ts`
- It then normalizes the raw payloads into indexed lookup maps
- Components import from `governance.ts`, never from `golden-flows.ts` Contract C accessors directly
- `getPublishedDocs()` is excluded from governance normalization — it is a separate document-link payload, not governance state

---

## Scope

### Files Added

| File | Purpose |
|------|---------|
| `src/lib/governance.ts` | Unified governance API: calls existing `golden-flows.ts` Contract C accessors, normalizes into lookup maps, validates coherence |
| `src/lib/__tests__/governance.spec.ts` | Tests: coherence validation, lookup correctness, missing data handling, parse failure handling |

---

## Implementation

### Raw Status Values (C-007)

All approval-bearing payloads share a common status union. These are the only valid values:

```typescript
type ApprovalStatusValue = "pending" | "approved" | "rejected" | "deferred";
```

This type is already expressed in the generated types (`ApprovalItem.approval_status`, `TrustBadge.approval_status`, `CascadeGovernanceItem.approval_status`, `BusinessEventGovernanceItem.approval_status`, `LinkedApproval.approval_status`). The normalization layer re-exports it as a named type for convenience.

Record origin values:

```typescript
type RecordOrigin = "demo_seeded" | "demo_approved" | "live";
```

Feedback disposition values (only in `FeedbackItem`):

```typescript
type FeedbackDisposition = "pending" | "in_progress" | "resolved" | "rejected";
```

### Item-Level Types (C-001, C-003)

The normalization layer re-exports and aliases the following generated types from `@/types/golden-flows`. No new type definitions are needed — the generated types already match the payload shapes exactly.

| Alias used in `GovernanceData` | Actual generated type | Source file |
|--------------------------------|-----------------------|-------------|
| `ApprovalMetadataItem` | `ApprovalItem` | `contract-c/approval_status.ts` |
| `FeedbackThreadItem` | `FeedbackItem` | `contract-c/feedback_threads.ts` |
| `TrustBadgeItem` | `TrustBadge` | `contract-c/trust_badges.ts` |
| `TrustBadgeSummary` | `BadgeSummary` | `contract-c/trust_badges.ts` |
| `CascadeGovernanceItem` | `CascadeGovernanceItem` | `contract-c/cascade_governance.ts` (no alias needed) |
| `ReviewContextItem` | `ReviewContextItem` | `contract-c/review_context.ts` (no alias needed) |
| `BusinessEventItem` | `BusinessEventGovernanceItem` | `contract-c/business_events.ts` |

Implementation in `governance.ts`:

```typescript
import type {
  ApprovalItem,
  FeedbackItem,
  TrustBadge,
  BadgeSummary,
  CascadeGovernanceItem,
  ReviewContextItem,
  BusinessEventGovernanceItem,
} from "@/types/golden-flows";

// Re-export with governance-layer aliases for clarity
export type ApprovalMetadataItem = ApprovalItem;
export type FeedbackThreadItem = FeedbackItem;
export type TrustBadgeItem = TrustBadge;
export type TrustBadgeSummary = BadgeSummary;
export type BusinessEventItem = BusinessEventGovernanceItem;
export type { CascadeGovernanceItem, ReviewContextItem };
```

### Normalized API Surface

```typescript
interface GovernanceData {
  approvalsByObjectId: Map<string, ApprovalMetadataItem>;
  feedbackById: Map<string, FeedbackThreadItem>;
  businessEventById: Map<string, BusinessEventItem>;
  trustBadgeSummary: TrustBadgeSummary | null;
  badgesByObjectId: Map<string, TrustBadgeItem>;
  reviewContextByObjectId: Map<string, ReviewContextItem>;
  cascadeGovernanceByQuestionId: Map<string, CascadeGovernanceItem>;
}

// Main entry point — calls golden-flows.ts accessors internally
export function loadGovernance(): GovernanceData

// Convenience accessors (call loadGovernance() internally, thin wrappers)
export function getApprovalForFinding(findingId: string): ApprovalMetadataItem | null
export function getFeedback(feedbackId: string): FeedbackThreadItem | null
export function getTrustBadge(objectId: string): TrustBadgeItem | null
export function getCascadeGovernanceItem(questionId: string): CascadeGovernanceItem | null
export function getReviewContextItem(objectId: string): ReviewContextItem | null
```

### Parse Failure Handling (C-005)

When `loadGovernance()` calls a `golden-flows.ts` accessor and it returns `null` (file missing or JSON parse error in `loadContractC`):

1. The corresponding map in `GovernanceData` is set to an **empty `Map()`** (not `null`).
2. A `console.warn()` is emitted: `"[governance] Failed to load {payloadType} — map will be empty"`.
3. No error is thrown. Other payloads continue loading normally.
4. `trustBadgeSummary` is set to `null` when `trust_badges.json` fails to load.

This matches the existing `loadContractC` pattern in `golden-flows.ts`, which returns `null` on missing files. The normalization layer converts `null` to empty maps so consumers never need null-checks on the maps themselves.

### Normalization Rules

Per ROADMAP: the governance module may reshape and join data but NOT introduce new governance semantics beyond what the contract explicitly defines.

Allowed:
- Index `approval_status.json` items by `object_id` into `approvalsByObjectId`
- Index `feedback_threads.json` items by `feedback_id` into `feedbackById`
- Index `business_events.json` items by `event_id` into `businessEventById`
- Index `trust_badges.json` badges by `object_id` into `badgesByObjectId`
- Extract `trust_badges.json` summary into `trustBadgeSummary`
- Index `cascade_governance.json` items by `question_id` into `cascadeGovernanceByQuestionId`
- Index `review_context.json` items by `object_id` into `reviewContextByObjectId`

Not allowed:
- Inferring approval state from absence of a record
- Deriving trust badges from absence of approval data
- Converting status values to friendlier labels (e.g., "pending" -> "Awaiting Review")

### Coherence Validation (at load time)

Run after all maps are populated. Uses `console.warn()` for violations — never throws.

1. Every `object_id` in `approvalsByObjectId` must be a non-empty string. Warn: `"[governance] approval item has empty object_id, skipping"`
2. Every `Reviewer` object must have a non-empty `reviewer_id`. Warn: `"[governance] {payloadType} item {id} has missing reviewer_id"`
3. Every `approval_id` in `FeedbackItem.linked_approvals[]` should exist in `approvalsByObjectId`. Warn: `"[governance] feedback {feedback_id} references unknown approval {approval_id}"`
4. Every `finding_id` in `CascadeGovernanceItem.finding_ids[]` should exist in `approvalsByObjectId` (where `object_type === "finding"`). Warn: `"[governance] cascade_governance {question_id} references unknown finding {finding_id}"`

Items with empty `object_id` are **skipped** (not inserted into the map). Items with missing `reviewer_id` are still inserted (warn only).

---

## Test Plan (C-004, C-008)

Tests live in `src/lib/__tests__/governance.spec.ts`. Tests mock the `golden-flows.ts` accessors using `jest.mock("@/lib/golden-flows")` with **inline mock data** that mirrors the real payload shapes. Inline mocks are preferred over fixture files because the governance fixtures are committed at `public/golden-flows/governance/` and may change independently.

### Test Cases

#### T-01: `loadGovernance()` — happy path with all 6 payloads populated

Mock all 6 accessors to return well-formed payloads. Assert:
- `approvalsByObjectId` has expected entries keyed by `object_id`
- `feedbackById` has expected entries keyed by `feedback_id`
- `trustBadgeSummary` is a `BadgeSummary` with correct `total_objects`
- `badgesByObjectId` has expected entries keyed by `object_id`
- `cascadeGovernanceByQuestionId` has expected entries keyed by `question_id`
- `reviewContextByObjectId` and `businessEventById` return empty maps (empty items)

#### T-02: `loadGovernance()` — one payload returns `null` (file missing)

Mock `getApprovalStatus()` to return `null`, others normal. Assert:
- `approvalsByObjectId` is an empty `Map`
- Other maps are populated normally
- `console.warn` was called with message containing `"approval_status"`

#### T-03: `loadGovernance()` — all payloads return `null`

Mock all 6 accessors to return `null`. Assert:
- All maps are empty
- `trustBadgeSummary` is `null`
- No errors thrown

#### T-04: Coherence — approval item with empty `object_id`

Mock `getApprovalStatus()` with one item where `object_id: ""`. Assert:
- That item is **not** in `approvalsByObjectId`
- `console.warn` was called with message containing `"empty object_id"`

#### T-05: Coherence — missing `reviewer_id`

Mock `getApprovalStatus()` with one item where `reviewer.reviewer_id: ""`. Assert:
- Item IS in `approvalsByObjectId` (warn-only, not skipped)
- `console.warn` was called with message containing `"missing reviewer_id"`

#### T-06: Coherence — feedback references unknown approval

Mock `getFeedbackThreads()` with a `FeedbackItem` whose `linked_approvals[0].approval_id` is `"nonexistent"`. Mock `getApprovalStatus()` with no matching item. Assert:
- `console.warn` was called with message containing `"unknown approval"`

#### T-07: Coherence — cascade_governance references unknown finding

Mock `getCascadeGovernance()` with an item whose `finding_ids` includes `"F-999"`. Mock `getApprovalStatus()` with no finding item with that `object_id`. Assert:
- `console.warn` was called with message containing `"unknown finding"`

#### T-08: Convenience accessor `getApprovalForFinding()` — found

Load governance with a known approval item. Call `getApprovalForFinding("F-001")`. Assert it returns the matching `ApprovalItem`.

#### T-09: Convenience accessor `getApprovalForFinding()` — not found

Call `getApprovalForFinding("nonexistent")`. Assert it returns `null`.

#### T-10: Convenience accessor `getTrustBadge()` — found

Call `getTrustBadge("F-001")`. Assert it returns the matching `TrustBadge`.

#### T-11: Convenience accessor `getFeedback()` — found

Call `getFeedback("FB-001")`. Assert it returns the matching `FeedbackItem`.

#### T-12: Duplicate `object_id` — last-write-wins

Mock `getApprovalStatus()` with two items sharing the same `object_id`. Assert that `approvalsByObjectId.get(id)` returns the **last** item (Map insertion order). Warn: `"[governance] duplicate object_id {id} in approval_status, last entry wins"`.

### Inline Mock Example

```typescript
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
```

---

## Exit Criteria

- [ ] `src/lib/governance.ts` exports `GovernanceData`, `loadGovernance()`, and all 5 convenience accessors
- [ ] All 6 type aliases exported (`ApprovalMetadataItem`, `FeedbackThreadItem`, `TrustBadgeItem`, `TrustBadgeSummary`, `BusinessEventItem`, plus re-exported `CascadeGovernanceItem` and `ReviewContextItem`)
- [ ] All 6 Contract C payloads loaded via existing `golden-flows.ts` accessors and normalized into lookup maps
- [ ] `null` payloads result in empty maps + `console.warn`, never thrown errors
- [ ] Coherence validation runs at load time with `console.warn` for issues
- [ ] 12 unit tests pass covering: happy path, missing payloads, all-null, empty object_id, missing reviewer_id, cross-reference validation, convenience accessors, duplicates
- [ ] `npm run build` passes
- [ ] No changes to `golden-flows.ts` or generated types
