# PR: Documentation Artifact Refresh

Last Updated: 2026-03-29

PR Type:
- [x] Website (bayesiq-website)

Depends on: None

---

## Goal

Update all docs/ai artifacts (ROADMAP.md, ARCH_STATE.md, BOOTSTRAP_PROMPT.md) to reflect the actual state of the codebase. These files were last updated during Phase 4 and still describe golden flows as "not started" when GF-1 through GF-20 are all shipped.

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| Documentation | docs/ai/ROADMAP.md, docs/ai/ARCH_STATE.md, docs/ai/BOOTSTRAP_PROMPT.md rewritten |
| Documentation | docs/ai/contract-summaries/contract-c-summary.md minor tense fix |
| Documentation | docs/ai/pr_markdown_plans/STATUS.md created (plan index) |

No code, components, routes, styles, or config changes.

---

## Scope

### Files modified
- `docs/ai/ROADMAP.md` — Mark GF-1 through GF-20 as done, update exit criteria, correct routes
- `docs/ai/ARCH_STATE.md` — Rewrite with current routes, components, data architecture
- `docs/ai/BOOTSTRAP_PROMPT.md` — Rewrite with current state for future AI sessions
- `docs/ai/contract-summaries/contract-c-summary.md` — Tense fix

### Files added
- `docs/ai/pr_markdown_plans/STATUS.md` — Index of all 29 plan files with completion status

### Files forbidden
- Any file outside `docs/ai/`

---

## Non-goals
- No code changes
- No route changes
- No component changes
- No config changes

---

## Ordered Plan

- [P1] Rewrite ROADMAP.md Phase 5 to reflect shipped state
- [P2] Rewrite ARCH_STATE.md with current architecture
- [P3] Rewrite BOOTSTRAP_PROMPT.md with current context
- [P4] Fix contract-c-summary tense
- [P5] Create pr_markdown_plans/STATUS.md

---

## Acceptance Criteria
- All GF items marked with accurate status
- Route paths use /consulting/explore/* not /golden-flows/*
- Component inventory matches actual codebase
- Build passes (docs-only, no risk)

---

## Test Plan
- `npm run build` passes (no code changes, just docs)

---

## Risks
- None — documentation only, no functional changes

---

## Self-Assessment
- **Complexity:** Trivial (docs only)
- **Risk:** None
- **Confidence:** High
