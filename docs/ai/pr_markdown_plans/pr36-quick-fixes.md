# PR#36 — Dogfood Quick Fixes (Card Height, Fintech Slug, Feedback Filter)

Last Updated: 2026-03-16

PR Type:
- [x] Website (biq_website)

---

## Goal

Fix three low-effort issues found during dogfood session: fintech cascade buttons not clickable (slug mismatch), internal pipeline feedback showing in demo, selector card height inconsistency.

---

## Fix A: Fintech Slug Mismatch

**Problem:** `site.config.yaml` uses slug `fintech-gf` but data lives in `public/golden-flows/fintech/`. The data loader uses the slug as the directory name, so `tryPublicJson("fintech-gf", ...)` fails. Cascade buttons don't work because data falls back to fixtures which lack cascade entries.

**Fix:** Rename `public/golden-flows/fintech/` to `public/golden-flows/fintech-gf/`.

Similarly verify `real-estate` vs `real_estate` — there are two directories. Keep `real-estate` (matches slug), remove `real_estate` if data is duplicated, or rename to match.

**Files changed:**
- Directory rename: `public/golden-flows/fintech` → `public/golden-flows/fintech-gf`
- Directory rename: `public/golden-flows/real_estate` → verify and reconcile with `real-estate`

---

## Fix B: Filter Internal Feedback Threads

**Problem:** `feedback_threads.json` contains pipeline evaluation records ("Evaluation: PR #27 Static Data Loader", "Staff SWE Review: PR-342") that are internal-only, not client-facing.

**Fix:** In `src/components/golden-flows/FeedbackThreadList.tsx`, filter items before rendering:

```typescript
const clientFeedback = feedbackItems.filter(item => {
  const s = item.summary?.toLowerCase() ?? "";
  return !s.startsWith("# evaluation:") && !s.startsWith("# staff swe review:");
});
```

Use `clientFeedback` instead of `feedbackItems` for grouping/rendering. Keep the empty state check against the filtered list.

**Files changed:**
- `src/components/golden-flows/FeedbackThreadList.tsx`

---

## Fix C: Selector Card Height

**Problem:** Real Estate card slightly taller than others at maximized desktop.

**Fix:** Add `h-full` to the outer `<a>` in VerticalSelectorCard and ensure the parent grid uses equal-height rows. The grid parent in VerticalSelector should already handle this with CSS grid, but `h-full` on the card ensures it stretches.

**Files changed:**
- `src/components/golden-flows/VerticalSelectorCard.tsx` — add `h-full` to outer `<a>`

---

## Test Plan

1. Navigate to `/golden-flows/fintech-gf` — cascade buttons now clickable, questions expand
2. Navigate to any vertical — feedback threads section shows no internal pipeline content
3. At maximized desktop width, all 5 selector cards are equal height
4. `npm run build` passes
5. Existing e2e tests pass

---

## Exit Criteria

- [ ] Fintech cascade drill-down works (buttons clickable, cascades expand)
- [ ] No "Evaluation:" or "Staff SWE Review:" feedback items visible
- [ ] Selector cards equal height across all viewport sizes
- [ ] All existing tests pass
- [ ] `npm run build` passes
