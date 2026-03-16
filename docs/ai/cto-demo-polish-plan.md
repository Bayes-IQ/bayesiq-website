# CTO Demo Polish Plan — 2026-03-17

## Problem

The vertical page has too much content before the "wow" moment. A CTO scanning the page sees: selector cards → trust summary bar → score trajectory → status quo comparison → **board report** → cascade drill-down → discover insights → feedback threads → business events → CTA.

The board report (the deliverable) is buried under trajectory and status quo sections. The cascade drill-down (the interactive proof) is even further down. By the time you reach the interesting parts, you've scrolled past a lot of context-setting.

## Principle

**Lead with the outcome, not the process.** The CTO should see within 5 seconds: "BayesIQ found real problems in your data, here's the report, here's what it looks like, click to drill in."

## Proposed Layout (top to bottom)

### Above the fold
1. **Vertical selector** (keep — navigation)
2. **Board Report Preview** (move UP — this is the deliverable, the "wow")
   - Score badge + severity
   - Key metrics table (reported vs audited — the money shot)
   - Top findings (severity-tagged)
   - "View Full Dashboard →" button (links to Streamlit)

### First scroll
3. **Cascade drill-down** (move UP — interactive proof)
   - Executive questions with expand/collapse
   - Trust badges on each question
4. **Score trajectory** (move DOWN — supporting context)

### Second scroll
5. **Status quo comparison** (keep position)
6. **Discover insights** (keep)
7. **Business events** (keep)
8. **Feedback threads** (keep)
9. **CTA** (keep — always last)

### Remove or collapse
- **Trust summary bar** — redundant with trust badges on individual items. Remove or collapse into the board report header.

## Changes Required

**File:** `src/app/golden-flows/[vertical]/page.tsx`

Reorder the JSX sections. No new components needed — just move the `<ReportPreview>` block above the trajectory/status-quo sections, and move `<AskAndCascadeSection>` up.

**Estimated scope:** ~30 minutes. One file, reorder blocks, verify layout.

## Secondary Polish (if time)

- [ ] Add "View Full Dashboard →" prominent button in the board report section (links to Streamlit app)
- [ ] Collapse feedback threads behind an "N feedback items" expandable (reduce visual noise)
- [ ] Business events: only show if non-empty (already handled, but verify)
- [ ] Mobile: verify board report table doesn't overflow horizontally
