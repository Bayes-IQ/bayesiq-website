# PR#32 — Trust Micro-Badges (GF-18)

Last Updated: 2026-03-15

PR Type:
- [x] Website (biq_website)

---

## Roadmap Position

```
PR#30 GF-16 (Governance normalization layer) ← DEPENDENCY (must merge first)
PR#GF-17 — Feedback Thread Component (parallel, NOT a dependency)
PR#32 GF-18 — Trust Micro-Badges ← THIS PR
PR#GF-19 — Governance Detail Drill-down (future)
```

---

## Goal

Add approval-status micro-badges to `VerticalSelectorCard`, `CascadeCard` collapsed rows, and a summary bar on the vertical detail page. Four states: approved, pending, rejected, deferred. Colorblind-safe (color + icon). Consumes governance data from the PR#30 API surface (`loadGovernance`, `getTrustBadge`, `getCascadeGovernance`).

Out of scope (deferred to other PRs):
- Governance detail expandable on hover/tap (GF-19)
- Feedback thread badges (GF-17, parallel)
- Artifact preview badges (no target component exists yet)

---

## Governance API Surface (from PR#30 GF-16)

PR#30 exports these from `src/lib/governance.ts`:

```ts
// Return types
interface TrustBadgeItem {
  object_type: string;
  object_id: string;
  approval_status: "approved" | "pending" | "rejected" | "deferred";
  record_origin: string;
  reviewer: { reviewer_id: string; display_name: string; role: string };
  last_reviewed_at: string;
  approval_count: number;
}

interface TrustBadgeSummary {
  total_objects: number;
  by_status: { approved: number; pending: number; rejected: number; deferred: number };
  by_object_type: Record<string, {
    total: number;
    by_status: { approved: number; pending: number; rejected: number; deferred: number };
  }>;
}

interface CascadeGovernanceItem {
  question_id: string;
  approval_status: "approved" | "pending" | "rejected" | "deferred";
  record_origin: string;
  reviewer: { reviewer_id: string; display_name: string; role: string };
  review_note: string;
  finding_ids: string[];
  feedback_ids: string[];
  event_ids: string[];
  ts_requested: string;
  ts_resolved: string;
}

// Functions
loadGovernance(vertical: string): Promise<{
  badgesByObjectId: Map<string, TrustBadgeItem>;
  trustBadgeSummary: TrustBadgeSummary | null;
}>

getTrustBadge(objectId: string): TrustBadgeItem | null;
getCascadeGovernance(questionId: string): CascadeGovernanceItem | null;
```

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `src/components/golden-flows/TrustBadge.tsx` | **New**: presentational micro-badge pill |
| `src/components/golden-flows/TrustSummaryBar.tsx` | **New**: summary bar with rollups by status and by object_type |
| `src/components/golden-flows/VerticalSelectorCard.tsx` | **Modified**: render `<TrustBadge>` next to score gauge |
| `src/components/golden-flows/CascadeCard.tsx` | **Modified**: render `<TrustBadge>` in collapsed row using cascade governance |
| `src/components/golden-flows/CascadeViewer.tsx` | **Modified**: pass governance lookup to CascadeCard |

---

## Implementation

### 1. TrustBadge Component (`TrustBadge.tsx`)

Pure presentational component. Does NOT call governance functions itself -- receives data via props.

```tsx
interface TrustBadgeProps {
  status: "approved" | "pending" | "rejected" | "deferred" | null;
  size?: "sm" | "md";           // sm = 10px text (cascade rows), md = 12px text (cards)
  showLabel?: boolean;           // default true; false = icon-only for tight spaces
}
```

**Null handling (C-007):** When `status` is `null` (badge data not available), render nothing (`return null`). Callers pass `getTrustBadge(id)?.approval_status ?? null`.

**Design tokens / styling (C-008):** All via Tailwind utility classes, no custom CSS.

| Status | Background | Text | Icon | Tailwind classes |
|--------|-----------|------|------|-----------------|
| approved | `bg-emerald-100` | `text-emerald-700` | `CheckCircle` (Heroicons mini, checkmark) | `rounded-full px-2 py-0.5` |
| pending | `bg-amber-100` | `text-amber-700` | `Clock` (Heroicons mini, clock face) | same |
| rejected | `bg-red-100` | `text-red-700` | `XCircle` (Heroicons mini, X) | same |
| deferred | `bg-gray-100` | `text-gray-500` | `MinusCircle` (Heroicons mini, dash) | same |

Colorblind safety: each status uses a distinct icon shape (checkmark, clock, X, dash) so statuses remain distinguishable without color. Minimum text size `text-[10px]` for `sm`, `text-xs` (12px) for `md`. All bg/text combos meet WCAG AA contrast.

Icons from `@heroicons/react/20/solid` (already a project dependency per `package.json`). Each icon rendered at `w-3.5 h-3.5` (sm) or `w-4 h-4` (md) inline before label text.

### 2. TrustSummaryBar Component (`TrustSummaryBar.tsx`)

```tsx
interface TrustSummaryBarProps {
  summary: TrustBadgeSummary | null;
}
```

**Null handling:** When `summary` is `null`, render nothing (`return null`).

**Layout:**
- Top-level horizontal bar placed at top of vertical detail page (inside `[vertical]/page.tsx`).
- Row 1: overall counts -- "3 approved, 0 pending, 0 rejected" as inline `<TrustBadge status={...} size="md" />` pills with counts.
- Row 2 (C-002): scope-level rollups per `object_type` from `summary.by_object_type`. Each object_type gets a labeled group: `"approval (3)"` with a mini breakdown of statuses. Rendered as a `flex flex-wrap gap-2` row of `<span>` tags showing `{object_type}: {approved}/{total}`.
- Container: `rounded-xl border border-bayesiq-200 bg-bayesiq-50 p-4`.

### 3. VerticalSelectorCard Integration

In `VerticalSelectorCard.tsx`, add an optional `trustStatus` prop:

```tsx
interface Props {
  slug: string;
  displayName: string;
  metrics: HookMetrics;
  isSelected: boolean;
  trustStatus?: "approved" | "pending" | "rejected" | "deferred" | null;
}
```

Render `<TrustBadge status={trustStatus ?? null} size="sm" />` inside the card, below the `trust_cue` paragraph (after line 109 in current file). The parent page calls `getTrustBadge(slug)?.approval_status ?? null` and passes it down.

### 4. CascadeCard Integration (C-003)

In `CascadeViewer.tsx`, accept an optional governance lookup prop:

```tsx
interface CascadeViewerProps {
  cascades: Record<string, CascadeEntry>;
  activeQuestionId?: string | null;
  getCascadeGovernanceStatus?: (questionId: string) => "approved" | "pending" | "rejected" | "deferred" | null;
}
```

The parent page imports `getCascadeGovernance` from `src/lib/governance.ts` (provided by PR#30) and passes a wrapper:

```tsx
getCascadeGovernanceStatus={(qid) => getCascadeGovernance(qid)?.approval_status ?? null}
```

`CascadeViewer` passes `getCascadeGovernanceStatus` to each `CascadeCard`. `CascadeCard` receives a new optional `governanceStatus` prop and renders `<TrustBadge status={governanceStatus ?? null} size="sm" />` in the collapsed row, next to the existing `reviewer_badge`.

### 5. Data Flow

```
[vertical]/page.tsx
  |-- calls loadGovernance(slug) from src/lib/governance.ts (PR#30)
  |   \-- returns { badgesByObjectId, trustBadgeSummary }
  |-- <TrustSummaryBar summary={trustBadgeSummary} />
  |-- <VerticalSelectorCard trustStatus={getTrustBadge(slug)?.approval_status ?? null} />
  \-- <CascadeViewer getCascadeGovernanceStatus={(qid) => getCascadeGovernance(qid)?.approval_status ?? null} />
        \-- <CascadeCard governanceStatus={getCascadeGovernanceStatus(entry.question_id)} />
            \-- <TrustBadge status={governanceStatus} size="sm" />
```

---

## Test Plan

### Unit Tests (`src/components/golden-flows/__tests__/`)

**TrustBadge.test.tsx:**
1. Renders correct icon + label for each of the four statuses (approved, pending, rejected, deferred)
2. Returns `null` when `status` is `null`
3. Respects `size="sm"` vs `size="md"` (check for `text-[10px]` vs `text-xs` class)
4. Respects `showLabel={false}` (icon only, no text label)
5. Each status produces a distinct `aria-label` (e.g., "Approved", "Pending")

**TrustSummaryBar.test.tsx:**
1. Returns `null` when `summary` is `null`
2. Renders correct top-level counts from `by_status`
3. Renders per-object_type rollup rows from `by_object_type` (C-002)
4. Handles edge case: `by_object_type` is empty object

**Integration in VerticalSelectorCard:**
5. Renders `TrustBadge` when `trustStatus` is provided
6. Does not render `TrustBadge` when `trustStatus` is `null` or omitted

**Integration in CascadeCard:**
7. Renders `TrustBadge` in collapsed row when `governanceStatus` is provided
8. Does not render `TrustBadge` when `governanceStatus` is `null` or omitted

### Build Verification
9. `npm run build` passes with no type errors
10. `npm run lint` passes

### Manual Smoke Test
11. Load a vertical page with governance data loaded; confirm badges appear on selector cards and cascade rows
12. Verify colorblind safety: screenshot with Sim Daltonism or similar tool, confirm all four statuses visually distinguishable by icon shape alone

---

## Exit Criteria

- [ ] `TrustBadge` component renders four distinct statuses with color + icon differentiation
- [ ] `TrustBadge` returns `null` when status is `null` (null-safety)
- [ ] `TrustSummaryBar` shows top-level counts and per-object_type rollups
- [ ] `TrustSummaryBar` returns `null` when summary is `null`
- [ ] `VerticalSelectorCard` shows trust badge when governance data available
- [ ] `CascadeCard` collapsed row shows trust badge from cascade governance lookup
- [ ] All Tailwind classes, no custom CSS; icons from `@heroicons/react/20/solid`
- [ ] Colorblind-safe: each status uses a distinct icon shape (check, clock, X, dash)
- [ ] Minimum text size 10px; WCAG AA contrast met
- [ ] Unit tests pass for all cases listed in test plan
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
