# PR#31 — Feedback Thread Component (GF-17)

Last Updated: 2026-03-15

PR Type:
- [x] Website (biq_website)

Depends on: PR#30 (GF-16 governance normalization) — must be merged first.

---

## Roadmap Position

```
PR#GF-16 ✅ (Governance normalization layer)
PR#GF-17 — Feedback Thread Component ← THIS PR
PR#GF-18 — Trust Micro-Badges (parallel)
```

---

## Goal

Build a feedback thread component that renders feedback conversations in a GDoc-style comment bubble format. Shows the comment, review, and resolution chain with reviewer attribution. Consumes data from the governance normalization layer (GF-16).

---

## Data Shape Reference

### FeedbackThreadItem (from `feedback_threads.json` items[])

```ts
interface FeedbackThreadItem {
  feedback_id: string;
  summary: string;
  category: string;
  priority: string;
  status: string;
  disposition: "pending" | "in_progress" | "resolved" | "rejected";
  resolution_note: string;
  source: string;
  timeline: {
    created_at: string;   // ISO 8601
    updated_at: string;   // ISO 8601
    resolved_at: string;  // ISO 8601 | null
  };
  linked_approvals: LinkedApproval[];
}

interface LinkedApproval {
  approval_id: string;
  approval_status: string;       // e.g. "approved", "rejected", "pending"
  record_origin: string;
  reviewer: {
    reviewer_id: string;
    display_name: string;
    role: string;
  };
  ts_requested: string;          // ISO 8601
  ts_resolved: string | null;    // ISO 8601 | null
  review_note: string;
}
```

### Governance API (from PR#30 GF-16)

```ts
// src/lib/governance.ts (provided by GF-16)
loadGovernance(slug: string): GovernanceData
// GovernanceData.feedbackById: Map<string, FeedbackThreadItem>

getFeedback(feedbackId: string): FeedbackThreadItem | null
```

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `src/components/golden-flows/FeedbackThread.tsx` | New: single feedback conversation bubble |
| `src/components/golden-flows/FeedbackThreadList.tsx` | New: list of feedback threads grouped by disposition |
| `src/app/golden-flows/[vertical]/page.tsx` | Modified: wire in FeedbackThreadList after DiscoverInsights, before GoldenFlowsCTA |

---

## Implementation

### 1. FeedbackThread.tsx — Single Thread Bubble

**Props interface:**

```ts
interface FeedbackThreadProps {
  item: FeedbackThreadItem;
}
```

**Component conventions** (matching CascadeCard.tsx, VerticalSelectorCard.tsx patterns):

- `"use client"` directive at top
- Outer wrapper: `<div className="rounded-xl border border-bayesiq-200 bg-white shadow-sm">`
- Collapsed view always visible; expandable detail via `useState(false)`
- `aria-expanded` on the toggle button, `focus-visible:ring-2 focus-visible:ring-bayesiq-500`

**Collapsed view shows:**

- `summary` as primary text: `text-sm font-medium text-bayesiq-900`
- `category` badge: `rounded-full px-2 py-0.5 text-xs font-semibold bg-bayesiq-100 text-bayesiq-700`
- `priority` badge alongside category
- Disposition status pill using `DISPOSITION_META` lookup (see below)
- `timeline.created_at` formatted as relative time (`text-xs text-bayesiq-400`)

**Disposition color map** (follows CascadeCard `STEP_TYPE_META` pattern):

```ts
const DISPOSITION_META: Record<
  FeedbackThreadItem["disposition"],
  { label: string; color: string }
> = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  resolved:    { label: "Resolved",    color: "bg-green-100 text-green-700" },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-700" },
};
```

**Expanded view shows:**

- `source` label: `text-xs text-bayesiq-500`
- `resolution_note` (only when `disposition === "resolved"` or `disposition === "rejected"`): rendered in a `bg-bayesiq-50 rounded-lg p-3` block
- Timeline row: `created_at`, `updated_at`, `resolved_at` (if non-null) as formatted dates
- Linked approvals chain (see below)

**Linked Approvals chain rendering:**

- Rendered as a vertical timeline (`<ol>` with connector lines), same pattern as CascadeCard's timeline_steps
- Each approval shows:
  - `reviewer.display_name` and `reviewer.role` — `text-sm font-medium text-bayesiq-800`
  - `approval_status` pill using same color helper as CascadeCard (approved=green, rejected=red, else yellow)
  - `review_note` — `text-xs text-bayesiq-500`
  - `ts_requested` and `ts_resolved` timestamps — `text-xs text-bayesiq-400`
  - `record_origin` as subtle label

### 2. FeedbackThreadList.tsx — Grouped List

**Props interface:**

```ts
interface FeedbackThreadListProps {
  feedbackItems: FeedbackThreadItem[];
}
```

**Sort key for disposition grouping:**

Items are grouped by disposition and rendered in this fixed order:
1. `in_progress` — active work first
2. `pending` — awaiting action
3. `rejected` — needs attention
4. `resolved` — completed last

Within each group, items are sorted by `timeline.updated_at` descending (most recent first).

```ts
const DISPOSITION_SORT_ORDER: Record<FeedbackThreadItem["disposition"], number> = {
  in_progress: 0,
  pending: 1,
  rejected: 2,
  resolved: 3,
};
```

**Rendering:**

- Section header per group: `<h3 className="text-xs font-semibold uppercase tracking-wide text-bayesiq-400 mb-3">`
- Each group renders its items as `<FeedbackThread item={item} />` in a `space-y-3` container
- Groups separated by `mt-6`

**Empty state:**

- When `feedbackItems.length === 0`, render:
  ```tsx
  <p className="text-sm text-bayesiq-400 italic">No feedback threads available.</p>
  ```

### 3. Vertical Page Wiring — `[vertical]/page.tsx`

**Location:** Insert FeedbackThreadList between `<DiscoverInsights>` and `<GoldenFlowsCTA>`.

**Data loading:**

```tsx
import { loadGovernance } from "@/lib/governance";
import FeedbackThreadList from "@/components/golden-flows/FeedbackThreadList";

// Inside VerticalPage async function, after existing data loads:
const governance = (() => {
  try {
    return loadGovernance(slug);
  } catch {
    return null;
  }
})();

const feedbackItems = governance?.feedbackById
  ? Array.from(governance.feedbackById.values())
  : [];
```

**Error handling for loadGovernance():**

- Wrapped in try/catch; if it throws, `governance` is `null` and `feedbackItems` is `[]`
- If `feedbackById` is `undefined`/`null`, fallback to empty array
- FeedbackThreadList handles empty array with its empty state — no crash, no blank section

**JSX insertion point** (between DiscoverInsights and GoldenFlowsCTA):

```tsx
{discoverInsights && <DiscoverInsights data={discoverInsights} />}

{/* Feedback Threads — GF-17 */}
{feedbackItems.length > 0 && (
  <section className="mt-12">
    <h2 className="text-xl font-bold tracking-tight text-bayesiq-900 mb-4">
      Feedback Threads
    </h2>
    <FeedbackThreadList feedbackItems={feedbackItems} />
  </section>
)}

<GoldenFlowsCTA ... />
```

The section is only rendered when feedback data exists (non-empty array). This avoids showing a "Feedback Threads" heading with an empty state when the vertical simply has no governance data.

---

## Test Plan

### Unit Tests (`src/components/golden-flows/__tests__/`)

**FeedbackThread.test.tsx:**

1. Renders summary, category badge, and disposition pill for a pending item
2. Renders resolution_note only when disposition is `"resolved"`
3. Does not render resolution_note when disposition is `"pending"`
4. Renders linked_approvals chain with reviewer display_name and role
5. Approval status pill color matches expected class for approved/rejected/pending
6. Toggle expand/collapse updates `aria-expanded` attribute
7. Renders timestamps from timeline object
8. Handles item with empty `linked_approvals` array (no approval chain shown)

**FeedbackThreadList.test.tsx:**

1. Groups items by disposition in correct order: in_progress, pending, rejected, resolved
2. Within a disposition group, items sorted by `timeline.updated_at` descending
3. Renders empty state message when feedbackItems is `[]`
4. Renders correct group headings
5. Renders correct count of FeedbackThread components

### Render / Integration Tests

**FeedbackThreadList integration:**

1. Renders full list with mixed dispositions and verifies DOM order
2. Section headers match disposition labels from DISPOSITION_META

### E2E Tests (`e2e/feedback-threads.spec.ts`)

1. Navigate to `/golden-flows/fintech-gf` — feedback section visible if governance data exists
2. Click a feedback thread to expand — approval chain renders
3. Verify resolved items show resolution_note text
4. Navigate to a vertical with no governance data — feedback section is not rendered (no heading, no empty state)

---

## Exit Criteria

- [ ] FeedbackThread renders as GDoc-style conversation bubbles, not audit log rows
- [ ] Reviewer names and roles visible in approval chain
- [ ] Approval chain visible per feedback item with status pills
- [ ] Resolution notes shown only for resolved/rejected items
- [ ] Items grouped by disposition in order: in_progress > pending > rejected > resolved
- [ ] Graceful handling when `loadGovernance()` throws or returns null — no crash, no blank section
- [ ] Empty state rendered for empty feedback list
- [ ] Component conventions match CascadeCard.tsx / VerticalSelectorCard.tsx (Tailwind classes, `"use client"`, bayesiq-* palette, rounded-xl cards, aria attributes)
- [ ] Unit tests pass (FeedbackThread + FeedbackThreadList)
- [ ] E2E tests pass
- [ ] `npm run build` passes
