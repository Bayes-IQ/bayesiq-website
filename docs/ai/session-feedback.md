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
