# PR#33 — Governance Detail Panel (GF-19)

Last Updated: 2026-03-15

PR Type:
- [x] Website (biq_website)

Depends on: PR#32 (GF-18 trust badges) — merged.

---

## Roadmap Position

```
PR#30 GF-16 (Governance normalization layer)
PR#31 GF-17 (Feedback thread component)
PR#32 GF-18 (Trust micro-badges)
PR#33 GF-19 — Governance Detail Panel <- THIS PR
```

---

## Goal

Add a governance detail panel that shows the full governance chain when a user clicks a TrustBadge. Shows approval history, reviewer comments, timestamps, review context blocks, and links to published GDocs. Triggered from any TrustBadge on the page (selector cards, cascade rows).

---

## Critic Findings Addressed

| ID | Status | Resolution |
|----|--------|------------|
| C-001 | BLOCKING | Panel accepts `objectType` discriminator; routes to `getApprovalForFinding` vs `getCascadeGovernanceItem` based on type |
| C-002 | BLOCKING | VerticalSelectorCard badge sends `trustBadgeObjectId` (from governance data), not the URL slug |
| C-003 | BLOCKING | `SerializedGovernanceData` removed; provider takes no governance prop; panel imports accessors directly |
| C-004 | BLOCKING | Unified on `onClick` prop for TrustBadge; `onBadgeClick` removed; coexistence with existing props documented |
| C-005 | BLOCKING | GovernanceDetailProvider integration specified with concrete component tree |
| C-006 | NON-BLOCKING | Recursive navigation removed; linked IDs rendered as static text |
| C-007 | NON-BLOCKING | Panel uses `<dialog>` element for native focus trap + Escape handling |
| C-008 | NON-BLOCKING | N/A — recursive navigation removed |
| C-009 | NON-BLOCKING | Test added: badge click -> panel open with correct objectId + objectType |
| C-010 | NON-BLOCKING | Exception path tests added for null governance data and unknown objectType |
| C-011 | NON-BLOCKING | Panel header uses static status display, not clickable TrustBadge |

---

## Governance API Surface (from PR#30)

```ts
// Types used by this PR
interface ApprovalMetadataItem {
  object_type: string;           // "approval" | "finding" | "feedback"
  object_id: string;
  approval_status: ApprovalStatusValue;  // "approved" | "pending" | "rejected" | "deferred"
  record_origin: string;         // "demo_seeded" | "demo_approved" | "live"
  source_approval_id: string;
  reviewer: { reviewer_id: string; display_name: string | null; role: string | null };
  timestamp: string;             // ISO 8601
  review_note: string | null;
}

interface ReviewContextItem {
  object_type: string;
  object_id: string;
  source_approval_id: string;
  timestamp: string;
  review_context: ReviewContextBlock[];  // typed discriminated union blocks
}

interface CascadeGovernanceItem {
  question_id: string;
  approval_status: ApprovalStatusValue;
  record_origin: string;
  reviewer: { reviewer_id: string; display_name: string | null; role: string | null };
  review_note: string | null;
  finding_ids: string[];
  feedback_ids: string[];
  event_ids: string[];
  ts_requested: string;
  ts_resolved: string;
}

// Functions
getApprovalForFinding(findingId: string): ApprovalMetadataItem | null
getReviewContextItem(objectId: string): ReviewContextItem | null
getCascadeGovernanceItem(questionId: string): CascadeGovernanceItem | null
loadGovernance(): GovernanceData
```

---

## Design Decisions

### D-001: objectType discriminator (addresses C-001)

The panel receives an `objectType` prop (`"finding" | "question"`) to determine which accessor to call:
- `objectType === "finding"` -> `getApprovalForFinding(objectId)` for approval data
- `objectType === "question"` -> `getCascadeGovernanceItem(objectId)` for cascade governance data

Both paths also call `getReviewContextItem(objectId)` — review context is keyed by generic `object_id` and works for either type.

### D-002: Badge objectId for VerticalSelectorCard (addresses C-002)

The `trustBadgeObjectIds` record is pre-computed in the server component alongside `trustStatuses`. It maps each vertical slug to its governance `object_id` from `badgesByObjectId`. The badge's `onClick` sends this governance object_id, not the URL slug.

```ts
// In page.tsx server component:
const trustBadgeObjectIds: Record<string, string> = {};
if (governance) {
  for (const v of verticals) {
    const badge = governance.badgesByObjectId.get(v.slug);
    if (badge) {
      trustBadgeObjectIds[v.slug] = badge.object_id;
    }
  }
}
```

VerticalSelectorCard receives a new prop `trustBadgeObjectId?: string`. Its TrustBadge onClick calls `openGovernanceDetail(trustBadgeObjectId, "finding")`.

### D-003: No SerializedGovernanceData type (addresses C-003)

The original plan referenced a `SerializedGovernanceData` type for the provider but never defined it. This is unnecessary. The GovernanceDetailProvider does NOT receive full governance data. Instead:

- The server component pre-computes only the serializable records needed by client components (`trustStatuses`, `trustBadgeObjectIds`, `cascadeGovernanceStatuses`).
- The GovernanceDetailPanel itself imports the accessor functions (`getApprovalForFinding`, `getCascadeGovernanceItem`, `getReviewContextItem`) directly.

Since governance data is loaded from static JSON at build time (memoized in `governance.ts`), the panel component imports the accessor functions directly. No serialization boundary is crossed — the panel reads from the same memoized cache.

**Why this works:** The page is SSG. The GovernanceDetailProvider is a client component, but GovernanceDetailPanel imports the accessors directly. These functions read from static JSON files bundled at build time. The memoized cache works on the client because the JSON is inlined by Next.js bundler.

### D-004: Unified onClick prop (addresses C-004)

TrustBadge uses `onClick?: (e?: React.MouseEvent) => void` — a single prop name. The name `onBadgeClick` is NOT used anywhere. Parent components wire `onClick` to call `openGovernanceDetail(objectId, objectType)` from context.

CascadeCard already has a `governanceStatus` prop (for display). The `onClick` on TrustBadge inside CascadeCard does NOT conflict — `governanceStatus` controls what the badge shows, `onClick` controls what happens when clicked. There is no `getCascadeGovernanceStatus` callback prop on CascadeCard; `cascadeGovernanceStatuses` is a plain `Record<string, ApprovalStatusValue>` pre-computed in the server component and passed as individual status values.

### D-005: No recursive navigation (addresses C-006, C-008)

Linked reference IDs (finding_ids, feedback_ids, event_ids in CascadeGovernanceItem) are rendered as static `<code>` text, not clickable links. This avoids the need for back-navigation, history stack, and recursive navigation tests. Recursive drill-down is deferred to a future PR.

### D-006: `<dialog>` element for accessibility (addresses C-007)

The panel uses the native `<dialog>` element with `showModal()` / `close()`. This provides:
- Native focus trap (no custom implementation needed)
- Escape key closes the dialog (built-in browser behavior)
- `::backdrop` pseudo-element for the overlay
- `aria-modal="true"` automatically applied

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `src/components/golden-flows/GovernanceDetailPanel.tsx` | **New**: `<dialog>`-based panel showing full governance chain |
| `src/components/golden-flows/GovernanceDetailProvider.tsx` | **New**: client wrapper providing `openGovernanceDetail` via React Context |
| `src/components/golden-flows/TrustBadge.tsx` | **Modified**: add `onClick` prop; when provided, wrap in `<button>` |
| `src/components/golden-flows/VerticalSelectorCard.tsx` | **Modified**: accept `trustBadgeObjectId` prop, wire TrustBadge onClick to context |
| `src/components/golden-flows/CascadeCard.tsx` | **Modified**: accept `questionId` + `onGovernanceDetail` callback, wire TrustBadge onClick |
| `src/components/golden-flows/AskAndCascadeSection.tsx` | **Modified**: import `useGovernanceDetail`, pass callback to CascadeCard |
| `src/app/golden-flows/[vertical]/page.tsx` | **Modified**: pre-compute `trustBadgeObjectIds`, wrap content in GovernanceDetailProvider |

---

## Implementation

### 1. GovernanceDetailProvider.tsx (addresses C-005)

```tsx
"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";
import GovernanceDetailPanel from "./GovernanceDetailPanel";

type ObjectType = "finding" | "question";

interface GovernanceDetailContextValue {
  openGovernanceDetail: (objectId: string, objectType: ObjectType) => void;
}

const GovernanceDetailContext = createContext<GovernanceDetailContextValue>({
  openGovernanceDetail: () => {},
});

export function useGovernanceDetail() {
  return useContext(GovernanceDetailContext);
}

interface Props {
  children: React.ReactNode;
}

export default function GovernanceDetailProvider({ children }: Props) {
  const [activeObject, setActiveObject] = useState<{
    objectId: string;
    objectType: ObjectType;
  } | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openGovernanceDetail = useCallback(
    (objectId: string, objectType: ObjectType) => {
      setActiveObject({ objectId, objectType });
      // dialog.showModal() called via useEffect in GovernanceDetailPanel
    },
    []
  );

  const handleClose = useCallback(() => {
    setActiveObject(null);
    dialogRef.current?.close();
  }, []);

  return (
    <GovernanceDetailContext.Provider value={{ openGovernanceDetail }}>
      {children}
      <GovernanceDetailPanel
        objectId={activeObject?.objectId ?? null}
        objectType={activeObject?.objectType ?? "finding"}
        onClose={handleClose}
        dialogRef={dialogRef}
      />
    </GovernanceDetailContext.Provider>
  );
}
```

**Component tree integration (concrete wiring):**

```tsx
// In [vertical]/page.tsx (server component — stays as server component):
import GovernanceDetailProvider from "@/components/golden-flows/GovernanceDetailProvider";

// ... inside return:
<GovernanceDetailProvider>
  <main className="mx-auto max-w-5xl px-6 py-16">
    <VerticalSelector
      verticals={verticals}
      hookMetrics={hookMetrics}
      currentSlug={slug}
      trustStatuses={trustStatuses}
      trustBadgeObjectIds={trustBadgeObjectIds}   {/* NEW */}
    />
    <TrustSummaryBar summary={governance?.trustBadgeSummary ?? null} />
    {/* ... all existing content unchanged ... */}
    {executiveQuestions && hasCascades ? (
      <AskAndCascadeSection
        questions={executiveQuestions.questions}
        cascades={cascadeData.cascades}
        cascadeGovernanceStatuses={cascadeGovernanceStatuses}
      />
    ) : executiveQuestions ? (
      <AskButtons questions={executiveQuestions.questions} />
    ) : null}
    {/* ... rest unchanged ... */}
  </main>
</GovernanceDetailProvider>
```

The provider wraps the entire `<main>` content. Any descendant can call `useGovernanceDetail().openGovernanceDetail(id, type)` without prop drilling.

### 2. GovernanceDetailPanel.tsx

**Props:**
```ts
interface GovernanceDetailPanelProps {
  objectId: string | null;      // null = closed
  objectType: "finding" | "question";
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
}
```

**Behavior:**
- Uses `<dialog ref={dialogRef}>` as the root element
- `useEffect`: when `objectId` transitions from null to non-null, calls `dialogRef.current.showModal()`
- `useEffect`: when `objectId` is null, ensures dialog is closed via `dialogRef.current.close()`
- Listens to the native `close` event on `<dialog>` to call `onClose` (handles browser Escape key)
- Native `<dialog>` provides: focus trap, Escape to close, `::backdrop` overlay

**Data resolution (addresses C-001):**
```ts
// Inside the component body:
let approval: ApprovalMetadataItem | null = null;
let cascadeGov: CascadeGovernanceItem | null = null;

try {
  if (objectType === "finding") {
    approval = getApprovalForFinding(objectId);
  } else if (objectType === "question") {
    cascadeGov = getCascadeGovernanceItem(objectId);
  }
} catch {
  // Governance module unavailable — handled by null checks below
}

const reviewContext = (() => {
  try { return getReviewContextItem(objectId); }
  catch { return null; }
})();

// Derive display values from whichever source matched:
const status = approval?.approval_status ?? cascadeGov?.approval_status ?? null;
const reviewer = approval?.reviewer ?? cascadeGov?.reviewer ?? null;
const reviewNote = approval?.review_note ?? cascadeGov?.review_note ?? null;
const recordOrigin = approval?.record_origin ?? cascadeGov?.record_origin ?? null;
const timestamp = approval?.timestamp ?? cascadeGov?.ts_resolved ?? null;
```

**Panel sections (top to bottom):**

1. **Header** (C-011): Object ID as `<code>`, static status pill (plain `<span>` with same color scheme as TrustBadge, NOT a clickable TrustBadge component), close button (X icon via `<button>`)
2. **Approval/Governance Details**:
   - Reviewer: `display_name` and `role` (or "Unknown reviewer" fallback)
   - Status: approval_status pill (static `<span>`)
   - Record origin badge: `demo_seeded` / `demo_approved` / `live`
   - Timestamp: formatted date
   - Review note: if non-null, rendered in a `bg-bayesiq-50 rounded-lg p-3` block
3. **Review Context**: From `getReviewContextItem(objectId)`:
   - If null or empty `review_context[]`, section not rendered
   - Each block rendered by type discriminator (summary_stat, finding_list, warning, etc.)
   - Simple fallback: render block type as label + JSON content for types not yet styled
4. **Linked References** (only when `objectType === "question"` and `cascadeGov` is non-null):
   - Finding IDs, feedback IDs, event IDs from CascadeGovernanceItem
   - Rendered as static `<code>` text (NOT clickable — see D-005)
   - Labels: "Related findings", "Related feedback", "Related events"
   - Empty arrays: section omitted

**Styling:**
- `<dialog>::backdrop` via CSS: `background: rgba(0, 0, 0, 0.3)`
- Panel inner container: `fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl overflow-y-auto p-6`
- Transition: `transition-transform duration-200 ease-out`
- Matches bayesiq-* palette from existing components

**Null handling:**
- If both `approval` and `cascadeGov` are null: show "No governance record found for this object" message
- If `getReviewContextItem()` returns null: skip review context section entirely
- Panel always renders header with objectId and close button

### 3. TrustBadge.tsx Modifications

Add optional `onClick` prop:

```ts
interface TrustBadgeProps {
  status: ApprovalStatusValue | null;
  size?: "sm" | "md";
  showLabel?: boolean;
  onClick?: (e?: React.MouseEvent) => void;  // NEW — when provided, badge becomes clickable
}
```

When `onClick` is provided:
- Wrap the existing `<span>` in a `<button>` with `cursor-pointer hover:ring-2 hover:ring-bayesiq-300 rounded-full`
- Add `aria-haspopup="dialog"` for accessibility
- Add `type="button"` to prevent form submission

When `onClick` is not provided:
- Render as before (no behavior change for existing uses)

### 4. VerticalSelectorCard.tsx Modifications

```ts
interface Props {
  slug: string;
  displayName: string;
  metrics: HookMetrics;
  isSelected: boolean;
  trustStatus?: ApprovalStatusValue | null;
  trustBadgeObjectId?: string;    // NEW — governance object_id for the badge
}
```

Inside the component:
```tsx
import { useGovernanceDetail } from "./GovernanceDetailProvider";

const { openGovernanceDetail } = useGovernanceDetail();

// In JSX:
<TrustBadge
  status={trustStatus ?? null}
  size="sm"
  onClick={trustBadgeObjectId
    ? (e) => {
        e?.preventDefault();    // prevent Link navigation
        e?.stopPropagation();
        openGovernanceDetail(trustBadgeObjectId, "finding");
      }
    : undefined
  }
/>
```

**Note:** The TrustBadge sits inside a `<Link>`. The click handler must call `e.preventDefault()` and `e.stopPropagation()` to prevent navigating to the vertical page. VerticalSelectorCard is already used inside a client component tree (VerticalClickTracker), so importing `useGovernanceDetail` is safe.

### 5. CascadeCard.tsx Modifications

Add `questionId` and `onGovernanceDetail` callback props:

```ts
interface CascadeCardProps {
  entry: CascadeEntry;
  governanceStatus?: ApprovalStatusValue | null;
  questionId?: string;                              // NEW — the cascade question_id
  onGovernanceDetail?: (objectId: string, objectType: "finding" | "question") => void;  // NEW
}
```

Wire the TrustBadge:
```tsx
<TrustBadge
  status={governanceStatus ?? null}
  size="sm"
  onClick={questionId && onGovernanceDetail
    ? (e) => {
        e?.stopPropagation();  // prevent CascadeCard expand/collapse toggle
        onGovernanceDetail(questionId, "question");
      }
    : undefined
  }
/>
```

CascadeCard does NOT import `useGovernanceDetail` directly — the callback is passed from AskAndCascadeSection. This keeps CascadeCard testable without the provider.

### 6. AskAndCascadeSection Wiring

AskAndCascadeSection is already a client component. It imports `useGovernanceDetail` and passes the callback to CascadeCard:

```tsx
import { useGovernanceDetail } from "./GovernanceDetailProvider";

const { openGovernanceDetail } = useGovernanceDetail();

// In CascadeCard render:
<CascadeCard
  entry={entry}
  governanceStatus={cascadeGovernanceStatuses[questionId]}
  questionId={questionId}
  onGovernanceDetail={openGovernanceDetail}
/>
```

### 7. VerticalSelector Wiring

VerticalSelector passes `trustBadgeObjectIds` through to each VerticalSelectorCard:

```ts
interface VerticalSelectorProps {
  // ... existing props ...
  trustBadgeObjectIds?: Record<string, string>;  // NEW
}

// In card render:
<VerticalSelectorCard
  slug={v.slug}
  displayName={v.display_name}
  metrics={hookMetrics[v.slug]}
  isSelected={v.slug === currentSlug}
  trustStatus={trustStatuses?.[v.slug]}
  trustBadgeObjectId={trustBadgeObjectIds?.[v.slug]}  // NEW
/>
```

---

## Test Plan

### Unit Tests (`src/components/golden-flows/__tests__/`)

**GovernanceDetailPanel.test.tsx:**
1. Dialog not shown when `objectId` is null
2. Renders panel with header showing objectId when open
3. `objectType="finding"`: calls `getApprovalForFinding`, renders approval details (reviewer name, status, timestamp)
4. `objectType="question"`: calls `getCascadeGovernanceItem`, renders cascade governance details
5. Renders "No governance record found" when both accessors return null (C-010)
6. Renders review note when present
7. Does not render review note section when null
8. Renders linked references as static `<code>` text for question type (C-006 verified)
9. Calls `onClose` when close button clicked
10. Panel header shows static status display, not clickable TrustBadge (C-011)
11. Gracefully handles exception from governance accessors (C-010)

**GovernanceDetailProvider.test.tsx (C-009):**
12. `openGovernanceDetail("obj-123", "finding")` opens panel with correct objectId and objectType
13. Multiple opens update panel content (close + reopen with different ID)
14. `onClose` clears active object and closes dialog

**TrustBadge onClick tests (add to existing test file):**
15. Does not render as `<button>` when onClick is omitted
16. Renders as `<button>` with `aria-haspopup="dialog"` when onClick is provided
17. Calls onClick with event when badge button is clicked

### E2E Tests (`e2e/governance-detail.spec.ts`)

1. Navigate to `/golden-flows/fintech-gf` — click a trust badge on a cascade card — panel opens as dialog
2. Panel shows approval status and reviewer info
3. Click close button — panel closes
4. Press Escape key — panel closes (native dialog behavior)
5. Click dialog backdrop — panel closes

---

## Exit Criteria

- [ ] GovernanceDetailPanel renders governance chain for findings (via `getApprovalForFinding`) and questions (via `getCascadeGovernanceItem`)
- [ ] Panel correctly routes based on `objectType` discriminator
- [ ] Panel shows: reviewer, status, origin, timestamp, review note
- [ ] Review context blocks rendered when available
- [ ] Linked references (finding_ids, feedback_ids, event_ids) shown as static text for question type
- [ ] TrustBadge clickable when `onClick` prop provided, otherwise inert
- [ ] Panel uses `<dialog>` element: Escape closes, focus trapped, `aria-haspopup="dialog"` on badge
- [ ] Panel header uses static status display (not clickable TrustBadge)
- [ ] VerticalSelectorCard badge sends governance `object_id`, not URL slug
- [ ] GovernanceDetailProvider wraps page content, exposes `openGovernanceDetail` via React Context
- [ ] Server component preserved (page.tsx stays SSG-compatible)
- [ ] Null-safe: missing governance data shows "No governance record found" fallback
- [ ] Exception-safe: governance accessor errors handled gracefully
- [ ] Unit tests pass (17 cases)
- [ ] E2E tests pass (5 cases)
- [ ] `npm run build` passes
