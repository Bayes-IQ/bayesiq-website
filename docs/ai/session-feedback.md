# Session Feedback Log

Durable record of lessons learned during implementation. Per CONTRIBUTING.md,
this lives in the repo rather than agent-local memory.

---

## 2026-03-26: Design System Integration (PRs #66-#68)

### CI + private sibling repos
Never use `file:` npm dependencies for private sibling repos. GitHub Actions
cannot check out private repos with the default GITHUB_TOKEN. Three CI
attempts failed before discovering this:
1. `actions/checkout` with `path: ../repo` — blocked by Actions sandbox
2. Symlink approach — npm ci didn't follow
3. `actions/checkout` with `repository:` — 404 on private repo

**Resolution:** Vendor artifacts directly (inline CSS tokens in globals.css,
commit font files to `public/fonts/`).

### gh-api.sh URL bug
`gh_api` with endpoint `repos/...` (no leading slash) produces malformed URL
`https://api.github.comrepos/...`. Always use leading slash: `/repos/...`.

### Git revert layering
When reverting two sequential merge PRs that modify the same file, git revert
can produce a hybrid state (partial revert). Always verify key files match
the intended pre-change state after multi-revert operations.

### Design system color migration needs visual QA
The color token migration (bayesiq-* → biq-*) shipped without visual
verification and caused UI regression. This directly motivated the Visual QA
Agent plan. Never ship visual changes without screenshot comparison.

### Worktree nesting
Git worktrees created from another worktree's CWD nest inside that worktree
instead of at the repo root. Always `cd` to the main repo root before
`git worktree add`.

---

## 2026-03-26: Visual QA Plan Feedback

### From AI/ML review
- Pixel-diff fast-fail before AI review saves 90% of costs on non-visual PRs
- Batch screenshots into viewport grids (39 calls → 13)
- Baseline needs explicit approval command, not just "latest merge"
- Layer 4 (emotional) must be advisory-only until 50+ calibration signals

### From Design review
- Screenshots are static but design is experienced as flow → add video capture
- Typography deserves its own sub-rubric (measure, rhythm, orphans, weight contrast)
- Dark↔light section boundaries are the most common source of "it looks off"
- Accessibility (contrast, touch targets, heading hierarchy) belongs in L1
- Need specific anti-patterns list, not just "avoid SaaS templates"
- Per-page design debt score tracks quality drift over time

---

## 2026-03-27: Visual QA Pipeline — Plan-Critic Feedback

### PR-A (Phase 0) — plan-critic approved-with-notes (9 findings)
- `playwright test scripts/visual-qa.ts` invocation won't work if testDir
  doesn't cover scripts/ — resolved by placing in e2e/ instead
- "Playwright's own screenshot stitching" is a phantom API — doesn't exist
- 16-page coverage matrix must be defined in the script, not just the plan

### PR-B (Phase 1) — plan-critic approved-with-notes (10 findings)
- Pin @axe-core/playwright to a verified compatible version
- Use keyboard Tab simulation for focus-ring checks (not script.focus())
- Reuse Phase 0 viewport constants and page list instead of duplicating
- Verify review prompt output vocabulary aligns with schema severity enum
- Add early guard if test-results/visual-qa/ is missing
- Ensure TypeScript runner (tsx/ts-node) available for visual-review.ts

### Worktree session scope issue
bash-guard detects `source ~/BayesIQCode/bayesiq-workspace/gh-api.sh` as a
cross-repo write when CWD is inside a worktree. Workaround: `cd` to the
main repo root before running gh-api.sh commands.
