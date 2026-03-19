# BayesIQ — Cross-Repo Contributing Guide

These conventions apply to all repos under `~/BayesIQCode/`.

## Platform repo

The **bayesiq** repo (`~/BayesIQCode/bayesiq/`) is the platform hub. All sub-repos (data-audit-kit, sales, website, etc.) are orchestrated through it.

Key locations in the platform repo:

| Path | Purpose |
|------|---------|
| `docs/ai/ROADMAP.md` | Development roadmap across all phases |
| `docs/ai/ARCH_STATE.md` | Current architecture state (source of truth) |
| `docs/ai/DEFINITION_OF_DONE.md` | PR quality checklist — invariants, security, testing |
| `docs/ai/BOOTSTRAP_PROMPT.md` | Current-state context for AI implementation |
| `docs/ai/pr_markdown_plans/` | All PR plans (see below) |
| `docs/ai/roles/` | Role contracts for the planning pipeline |
| `docs/ai/phase_tracker/` | Phase completion tracking |
| `tools/pipeline/` | Pipeline orchestration tool |

## BayesIQ Planning Tool

The BayesIQ planning tool is the PLANNER → CRITIC → IMPLEMENTER → REVIEWER pipeline defined in the `bayesiq` repo. It is not an executable plugin — it is a workflow embodied in templates, role contracts, and conventions.

### How to use it

Before implementing a non-trivial PR in **any** BayesIQ repo:

1. **Read the template** at `bayesiq/docs/ai/pr_markdown_plans/_TEMPLATE.md`
2. **Write a plan** following the template structure: PR type, roadmap position, layers affected, invariants, scope (files added/modified/forbidden), non-goals, known non-existence, ordered plan steps with stable IDs `[P1]`, `[P2]`, acceptance criteria, test plan, risks, and self-assessment
3. **Save the plan** as `pr<number>-<slug>.md` in `bayesiq/docs/ai/pr_markdown_plans/` — **never** in `~/.claude/` or other tool-local directories
4. **Run the plan+critic loop** (see [Programmatic invocation](#programmatic-invocation))
5. **Review and record feedback** (see [Plan review](#plan-review)) — this step is **mandatory**, not optional
6. **Implement** only after the plan review is recorded

### Pipeline protocol checklist

Quick-reference for the full pipeline governance sequence (see steps 1–6 above for details):

- [ ] **CWD = target repo.** `cd` to the repo the plan is for before running `plan-critic`. The context builder uses `os.getcwd()` — wrong CWD means the critic evaluates the wrong codebase.
- [ ] **plan-critic completes.** Run `plan-critic --plan <path> --run-id <id> --profile default`. Wait for approve/reject.
- [ ] **pipeline review recorded.** Run `pipeline review --pr <id> --run-id <id> --decision approve --findings-file <path>`. This feeds the planner/critic improvement loop — skipping it means future runs don't learn from this review.
- [ ] **Then implement.** Only create implementation worktrees after the review is persisted.

### Role contracts

The pipeline defines four roles with explicit permissions and constraints:

| Role | Contract | Purpose |
|------|----------|---------|
| PLANNER | `bayesiq/docs/ai/roles/PLANNER.md` | Generates PR plans; produces self-assessment |
| CRITIC | `bayesiq/docs/ai/roles/CRITIC.md` | Reviews plans against codebase; catches structural/API/convention issues |
| IMPLEMENTER | `bayesiq/docs/ai/roles/IMPLEMENTER.md` | Writes code from an approved plan |
| REVIEWER | `bayesiq/docs/ai/roles/REVIEWER.md` | Reviews implementation against plan |

### Exemplar plans

These existing plans demonstrate the expected level of detail:

| Plan | Why it's a good example |
|------|------------------------|
| `pr36-project-kernel.md` | Dev infrastructure PR — clean scope, non-goals, forbidden changes |
| `pr299-cross-repo-pipeline-portability.md` | Cross-repo concern — shows how to handle multi-repo scope |
| `pr8-draft-github-pr.md` | New tool PR — follows the minimal tool example from the template |

All 80+ plans in `bayesiq/docs/ai/pr_markdown_plans/` serve as additional references.

### Programmatic invocation

If the bayesiq venv and credentials are available, the pipeline runs programmatically via subcommands:

```bash
cd ~/BayesIQCode/bayesiq

# Run the PLANNER ↔ CRITIC loop on an external plan
.venv/bin/python -m scripts.pipeline plan-critic \
    --plan docs/ai/pr_markdown_plans/<plan-file>.md \
    --run-id <id> \
    --profile default
```

This stages the external plan, then runs the full critic loop with inspection, feasibility checks, revision diffs, fixation detection, and crash recovery (up to 3 attempts). On attempt 0 the external plan is used as-is; if the CRITIC returns `request-changes`, the PLANNER LLM revises and the CRITIC re-evaluates. All artifacts are written to `.artifacts/pipeline_runs/`.

**AI agents must never use `--plan-approved` or the `run` subcommand.** Those bypass the human gate and run implementer/reviewer stages. AI should only use `plan-critic` for the critic loop. Implementation is done by the AI agent directly after the plan review is recorded.

### Plan review

After the critic loop completes, the reviewer (AI agent or human) evaluates the critic's findings against the actual codebase and records structured feedback. **This step is mandatory** — it closes the feedback loop that makes future planner/critic runs smarter.

```bash
cd ~/BayesIQCode/bayesiq

# Write findings to a JSON file, then:
.venv/bin/python -m scripts.pipeline review \
    --pr <PR-ID> --run-id <run-id> \
    --decision approve \
    --findings-file findings.json \
    --planner-pattern "Description of recurring planner error" \
    --critic-gap "Description of what the critic missed"
```

Or pipe findings from stdin (useful for AI agents):

```bash
echo '<findings-json>' | .venv/bin/python -m scripts.pipeline review \
    --pr <PR-ID> --run-id <run-id> \
    --decision approve \
    --findings-file -
```

The review is persisted as `plan_review.json` and appended to a rolling index. Future planner and critic runs automatically incorporate lessons from past reviews.

**Finding categories** (enforced by schema): `phantom_path`, `wrong_signature`, `missing_wiring`, `under_scoped_tests`, `scope_drift`, `convention_violation`, `design_deferral`, `stale_context`, `missing_migration`, `invariant_risk`, `other`

**Severities:** `blocking`, `warning`, `info`

**Why this matters:** Each review's `planner_patterns` and `critic_gaps` feed forward — the planner sees "avoid these mistakes" and the critic sees "pay attention to these areas." Over time this compounds into stronger plans and more targeted critiques.

## No direct pushes to main

All changes to `main` must go through pull requests. Direct `git push origin main` is blocked by bash-guard.

**Workflow:** Push to a feature branch, create a PR via `gh-api.sh`, merge via GitHub.

**Why:** Protects main from untested or unreviewed changes. PRs provide an auditable review trail.

**Enforcement:** bash-guard blocks `git push ... main/master`. The `git-https-push.sh` helper is exempted only for branch pushes.

## Worktrees for implementation

When implementing a plan, always use a git worktree (`EnterWorktree` or `isolation: "worktree"` on an Agent) so the main working tree stays clean. This protects in-progress work on the primary branch and makes it easy to discard a failed implementation without cleanup.

**Worktree location:** Worktrees live under `.worktrees/` at the repo root. This avoids namespace collisions with Claude Code's own `.claude/` config directory, glob/permission edge cases with hidden directories, and potential future conflicts. The legacy location `.claude/worktrees/` is also gitignored for backwards compatibility, and deployment scripts (`bootstrap.sh`, `deploy-claude-config.sh`) handle both locations when propagating `.claude-settings.json` to worktrees.

## After each PR

1. Update `phase_tracker.yaml` — set the completed PR's status to `complete` and add a `summary`
2. Run `python scripts/sync_artifacts.py` — regenerates status lines and doc blocks
3. Commit everything together
4. **Suggest next work** — when sharing the PR link, always include a brief summary of what is now unblocked in the dependency graph and recommend what to work on next. This keeps momentum and helps the operator make informed sequencing decisions without having to re-read the roadmap.

## Cross-Repo Initiatives

Multi-repo initiatives are tracked in `initiatives/` with one YAML file per initiative. Each file is an **initiative index** — it answers three questions: What is blocked? What is next? Who owns the next move?

### How it works

- `repos.yaml` at repo root maps canonical repo names to local paths and GitHub org/repo
- `initiatives/_TEMPLATE.yaml` defines the schema, rules, invariants, and trust hierarchy
- Each initiative file (e.g. `initiatives/golden-flows.yaml`) tracks status across repos and declares a singular `next_action`

### When to update

Any PR that changes cross-repo dependency state must update the initiative YAML — either in the same PR or an immediately-linked follow-up. This includes:

- Completing upstream work that unblocks a downstream repo
- Starting work in a repo that was previously `ready`
- Discovering a new blocker

### Trust hierarchy

- **Repo roadmap owns scope** — detailed deliverables, phase plans, timelines
- **Initiative file owns cross-repo sequencing** — handoff state, who's blocked on whom, what's next
- If they disagree, the repo roadmap wins on scope questions

### Rules

1. One file per initiative (a named body of work with cross-repo deps and at least one concrete next action)
2. `next_action` is mandatory and singular — O(1) lookup for "what's next?"
3. Keep summaries to one line; do not duplicate roadmap content
4. If a repo status is `blocked`, `blocked_on` must be non-empty
5. If `next_action.owner_repo` is set, that repo should be `ready` or `in_progress`
6. If the initiative status is `complete`, all repo statuses must be `complete`

### Status vocabulary

**Initiative level:** `planned` → `in_progress` → `complete`

**Repo-within-initiative level:** `not_started` | `blocked` | `ready` | `in_progress` | `complete`

## Cross-Session Coordination

Multiple Claude Code sessions run in parallel across BayesIQ repos. A lightweight file-based coordination system at `~/.claude/coordination/` lets sessions share operational state without services, databases, or IPC.

**Phase 1 (current):** Manual coordination only. Sessions read/write these files via tool calls. No hooks, no automation. Phase 2 will add hook-automated registration and bulletin reading.

### Directory structure

```
~/.claude/coordination/
  sessions.yaml          # live session registry
  bulletins.yaml         # broadcast announcements
  handoffs/              # structured handoff artifacts
  .ack_<session_id>      # per-session bulletin acknowledgement (ephemeral)
```

Create this directory on first use. It is global (not per-repo) — sessions from all repos coexist.

### Session registry (`sessions.yaml`)

```yaml
updated: "2026-03-15T21:30:00Z"
sessions:
  - id: "sess_8f2c4a1b"
    label: "pr337-plan-gate"
    repo: bayesiq
    worktree: pr332-ci-scope-selection
    branch: worktree-pr332-ci-scope-selection
    working_on: "PR #337 — pre-commit planner gate"
    started: "2026-03-15T15:00:00Z"
    last_seen: "2026-03-15T21:30:00Z"
```

**Status derivation** (derived from `last_seen`, never persisted):

| Derived status | Rule |
|---------------|------|
| `active` | `last_seen` within 10 minutes |
| `idle` | `last_seen` between 10 minutes and 4 hours |
| `stale` | `last_seen` older than 4 hours |

- Register once on first meaningful tool call
- Update `last_seen` every 5-10 minutes (manual in Phase 1)
- Sessions with `last_seen` older than 4 hours are treated as stale

### Bulletin board (`bulletins.yaml`)

```yaml
updated: "2026-03-15T21:30:00Z"
bulletins:
  - id: "b-20260315-173000-8f2c"
    timestamp: "2026-03-15T17:30:00Z"
    from: "sess_8f2c4a1b"
    severity: restart_required
    scope:
      repos: ["bayesiq", "bayesiq-data-audit-kit"]
    message: "settings.json updated — restart sessions to pick up changes"
```

**Severity levels:**

| Level | Meaning | Expected response |
|-------|---------|-------------------|
| `info` | FYI — bug found, PR merged, discovery | Read and incorporate if relevant |
| `action_required` | Something changed that affects other sessions | Check if affected, take action |
| `restart_required` | Shared config changed (settings.json, hooks) | Restart session |

**Rules:**
- Bulletin IDs: `b-YYYYMMDD-HHMMSS-<short_session_id>` (globally unique)
- `scope.repos`: empty list = global; sessions only surface bulletins relevant to their repo
- Bulletins older than 24 hours are pruned on next write
- Each session tracks acknowledged bulletin IDs in `.ack_<session_id>` — bulletins surface only once per session
- Post a bulletin only for information another live session can act on
- Manual posting only in Phase 1; auto-post for settings.json/hook changes comes in Phase 2

### Handoffs (`handoffs/<session-id>.yaml`)

```yaml
session_id: "sess_8f2c4a1b"
label: "pr337-plan-gate"
repo: bayesiq
branch: worktree-pr332-ci-scope-selection
working_on: "PR #337 — pre-commit planner gate"
timestamp: "2026-03-15T22:00:00Z"
done:
  - "Pipeline plan approved (e5b9491adc7e)"
  - "require-plan-precommit.sh written and chmod +x"
todo:
  - "Write tests (test_require_plan_precommit.py)"
  - "Run full test suite"
blockers: []
refs:
  prs: [337]
  plan_run: "e5b9491adc7e"
```

**Lifecycle:**
- Created on demand, not automatic — handoff quality depends on intentional summary
- One file per session ID; overwritten if same session writes a new handoff
- New sessions read handoffs to resume: prefer exact branch match (newest first), then PR number match
- Not pruned automatically — handoffs are useful longer than bulletins

### Schema rules

1. **Atomic writes:** read → write temp → rename (no partial writes from concurrent sessions)
2. **No sensitive data:** no API keys, tokens, credentials, or file contents — session IDs, branch names, PR numbers, and short messages only
3. **`working_on` is manual** — not auto-derived from branch names or PR titles
4. **Coordination files are advisory, not authoritative** — they do not replace code, roadmap, or tracker state

### Relationship to other systems

| System | What it tracks | Lifetime | Scope |
|--------|---------------|----------|-------|
| **Session coordination** | Live operational state across sessions | Hours | Global (`~/.claude/`) |
| **Initiative tracker** | Cross-repo project sequencing | Weeks/months | `bayesiq-workspace` |
| **Memory system** | Long-term user/project knowledge | Permanent | Per-project |
| **CLAUDE.md** | Behavioral instructions | Session start | Per-repo |

## GitHub operations

`gh` fails with x509 TLS errors in sandboxed environments (Go needs macOS Keychain access which is blocked). Use the `gh-api.sh` wrapper which routes through `curl` instead.

```bash
source ~/BayesIQCode/bayesiq-workspace/gh-api.sh

# Infer repo name from current directory
REPO=$(basename "$(git rev-parse --show-toplevel)")

# Create PR
gh_pr_create "$REPO" "branch-name" "main" "PR title" "PR body markdown"

# View PR
gh_pr_view "$REPO" 34

# List open PRs
gh_pr_list "$REPO"

# Merge PR
gh_pr_merge "$REPO" 34

# Comment on PR
gh_pr_comment "$REPO" 34 "Comment body"

# Raw API call
gh_api GET "/repos/Bayes-IQ/$REPO/pulls/34/comments"
```

## Python venvs

Never mutate `.venv` inside sandboxed AI coding tools. The sandbox causes partial installs that corrupt the venv. If the venv needs rebuilding, run `scripts/sync-venv.sh --rebuild` in a regular terminal, then restart the tool.

## No manual tests

Every test in a PR must be automated. Never add `- [ ]` manual checklist items to a test plan when the check can be automated. If you can describe it as "run X, expect Y" or "navigate to X, assert Y", it's an automated test.

**Python repos:** Use `python -m unittest discover`. Shell scripts, CLI tools, hooks, config verification, and integration checks are all automatable as subprocess tests:

```python
result = subprocess.run(["bash", script], input=payload, capture_output=True, text=True)
self.assertEqual(result.returncode, expected_code)
self.assertIn(expected_string, result.stdout)
```

**Frontend repos (Next.js/React):** Use Playwright. Tab clicks, URL navigation, element visibility, responsive layout checks, data correctness, and hash/state persistence are all automatable:

```typescript
await page.goto("/golden-flows/hospital#workflow");
await expect(page.getByRole("tab").nth(2)).toHaveAttribute("aria-selected", "true");
```

**The only acceptable manual items** are those requiring genuine human judgment: visual taste, copy quality, emotional arc assessment, or cross-browser rendering not covered by CI. When in doubt, automate — do not push testable work to the user.

## Credential files

Credential files must never be read directly by AI coding tools. Three independent layers enforce this:

1. **Claude Code deny rules** (`settings.json.template`) — blocks `Read` on `~/.claude/settings.json`, `gh-config/hosts.yml`, `.npmrc`, `.pypirc`, `.netrc`, `.docker/config.json`
2. **read-guard.sh hook** — blocks `Read`/`Grep`/`Glob` on the same files
3. **bash-guard.sh hook** — blocks Bash commands that reference credential file paths or embed credentials in git URLs

**How to access credentials instead:**
- API keys: use environment variables `$ANTHROPIC_API_KEY`, `$OPENAI_API_KEY` (injected by Claude Code from settings.json `env` section)
- GitHub API: use `gh-api.sh` wrapper (reads token internally)
- Git push: works transparently via the git credential helper configured by `bootstrap.sh`
- Manual push fallback: `bash ~/BayesIQCode/bayesiq-workspace/claude-config/hooks/git-https-push.sh`

## Sandbox + node_modules

Sandbox deny rules block files matching `*password*`, `*secret*`, `*credential*`, `*token*` to protect sensitive files. JS dependency directories (`node_modules/`) contain legitimate code files that match these patterns (e.g. `caniuse-lite/data/features/passwordrules.js`). If `npm run build` or other Node.js commands fail with `Operation not permitted` on a node_modules file, check whether the filename matches a deny pattern and add an exception to the sandbox configuration.

## npm install

`npm install` (local project installs) is allowed. `npm install -g` (global installs) is blocked. If node_modules is corrupted (macOS file flags), fix it from a regular terminal:

```bash
sudo rm -rf node_modules && npm install
```

## Session handoff on restart

When a restart is needed (config changed, context stale, sandbox issue), capture state using the handoff script:

```bash
~/BayesIQCode/bayesiq-workspace/scripts/capture-handoff.sh \
  --reason "CLAUDE.md updated with new directives" \
  --task "Implementing PR#23 session handoff" \
  --done "Plan approved" \
  --todo "Write tests" \
  --pr 23
```

This writes a structured YAML file to `~/.claude/coordination/handoffs/<session-id>.yaml` using the existing handoff schema (see § "Handoffs" above). The user then restarts Claude.

**Auto-pickup:** On session start, check `~/.claude/coordination/handoffs/` for `.yaml` files less than 24 hours old (skip any already renamed to `.consumed.yaml`). Match candidates in priority order:

1. **Exact branch match** — handoff `branch` field matches the current checked-out branch. If multiple match, use the newest by `timestamp`.
2. **PR number match** — handoff `refs.prs` contains a PR number referenced in the current branch name (e.g., branch `worktree-pr32-handoff` matches a handoff with `prs: [32]`).
3. **Repo match** — handoff `repo` field matches the current repo name.

Read the best-matching handoff, resume the described work (review `done`, execute `todo`, respect `blockers`), then rename the file from `<session-id>.yaml` to `<session-id>.consumed.yaml`. Consumed files are kept for debugging, not deleted.

**Fallback (no script available):** Include a copy-pasteable handoff blurb in the last message before restart:

```
---
**Paste this into your next session:**

> [concise context: what changed, what to verify, what to do next]
---
```

**Config-change detection (Phase 3):** A `PostToolUse` hook (`config-change-detect.sh`) monitors Write and Edit operations. When the modified file matches a shared config pattern (CLAUDE.md, CONTRIBUTING.md, settings.json, hooks, etc.), it prints a warning to stderr suggesting the user capture a handoff and restart. The hook is advisory only — it never blocks writes.

## Agent-local state is not durable

Agent memory systems (Claude Code memories, Cursor context, etc.) are session-level cache — not a source of truth. They are vendor-specific, invisible to other tools, and unenforceable.

**Rules:**
- Do not write agent memories to persist knowledge that belongs in repo files. If information needs to survive across sessions, it goes in CONTRIBUTING.md, ROADMAP.md, git history, a hook, or a script.
- Every memory write is a signal that the canonical infrastructure has a gap. Fix the gap — don't cache around it.
- Agent-local state directories should trend toward empty, not full.

**Where durable knowledge lives:**

| Need | Canonical location |
|------|--------------------|
| Behavioral rules | This file (CONTRIBUTING.md) |
| Project state | ROADMAP.md, phase tracker, git log |
| Reference info | Repo docs, README files |
| Enforcement | Git hooks, CI, bash-guard |
| Permissions issues | `bayesiq-workspace/permissions-audit-log.md` |
| PR context | Commit messages, PR descriptions |

## Adding a new cross-repo rule

When a correction or convention needs to be durable across all repos and future sessions:

1. **Document the rule** in this file (CONTRIBUTING.md) — single source of truth
2. **Choose an enforcement mechanism:**
   - **Hookable** (a specific command can be blocked): add a guard to `bayesiq-workspace/claude-config/hooks/bash-guard.sh` with a message pointing back to this file, then re-run `bootstrap.sh`
   - **Behavioral** (judgment-based, no command to block): add a one-liner to `bayesiq-workspace/claude-config/CLAUDE.md.header` under "Rules that override defaults", then recompile with `scripts/compile-ai-config.sh` and redeploy
3. **Don't duplicate** — CLAUDE.md directives should be terse pointers, not full explanations

Examples:
- `gh` → hookable (bash-guard blocks it, points to § "GitHub operations")
- Worktrees for plans → behavioral (CLAUDE.md directive, full rule here)

## Cross-repo reads use direct tools, not Agent subprocesses

When reading files in sibling BayesIQ repos (e.g., checking `~/BayesIQCode/bayesiq/` from a session rooted in `bayesiq-data-audit-kit`), **always use direct `Read`, `Glob`, and `Grep` tool calls**. Never spawn an `Agent` subprocess (any `subagent_type`) for cross-repo file reads.

**Why:** The `__BIQ_ROOT__` permission grants in `claude-settings.json` authorize direct tool calls across all repos under `~/BayesIQCode/`. Agent subprocesses run in their own permission context and trigger fresh permission prompts — creating repeated user interruptions for operations that are already authorized.

**Decision heuristic:** Before spawning an Agent, ask: "Can I accomplish this with 1–3 direct Glob/Grep/Read calls?" If yes, use direct tools. Agent/Explore is for iterative discovery *within a single repo* where you genuinely don't know what to search for.

**Postmortem:** See `postmortems/2026-03-15-agent-permission-escalation.md` for the full incident report.

## Cross-repo dependency validation

Before declaring work blocked by another repo, validate the dependency:

1. **Check same-repo precedents first.** Search the blocked repo for existing scripts or transforms that handle the same class of work. Example: biq_website's `ingest-contract-b.sh` already demonstrated the pattern for Contract C ingestion — but an agent declared it blocked by DAK because it only searched for Contract C data, not for Contract B ingestion patterns one directory away.

2. **Ask "can this repo do it itself?"** The default assumption is self-service. Only declare a cross-repo dependency when the consumer genuinely cannot produce the artifact (e.g., it needs platform database access it doesn't have). Each agent that touched the Contract C problem pushed work further upstream (scout → DAK → bayesiq) when the answer was biq_website all along.

3. **Distinguish raw data from missing data.** If source files exist but look incomplete, check whether there's a transform step that produces the final format. Minimal seed files are not a blocker if an ingestion script enriches them.

4. **Verify import paths against existing code.** Before writing `from X.Y import Z`, run `grep "from X" <repo>/` to find the actual import pattern. Never infer module paths from concept names. Example: 6 exporters shipped with `from storage.db.session import get_session` (nonexistent) when 20+ callsites used `from storage.db.engine import db_session`.

5. **Verify CWD matches target repo for pipeline tools.** The pipeline's context builder uses `os.getcwd()`. If running `plan-critic` for a biq_website plan, `cd` to biq_website first. Running from bayesiq caused the planner to silently rewrite the plan for the wrong repo.

**Postmortems:** See `postmortems/2026-03-15-cross-repo-dependency-misdiagnosis.md`, `postmortems/2026-03-15-plan-critic-cwd-mismatch.md`, and `postmortems/2026-03-15-hallucinated-import-path.md`.

## Cross-repo tool references

When a user or document says "bayesiq tool," "bayesiq pipeline," "bayesiq memory," or similar — they mean scripts and tools **in the `bayesiq` repo** (`~/BayesIQCode/bayesiq/`), not MCP tools or deferred tools in Claude Code's tool list.

Key tools in the bayesiq repo:

| Reference | Location | Invocation |
|-----------|----------|------------|
| Planning pipeline | `scripts/pipeline/` | `.venv/bin/python -m scripts.pipeline plan-critic --plan <plan.md>` |
| Memory persistence | `tools/memory/` | Writes to `~/.bayesiq/bayesiq.db` (SQLite) |
| Plan review | `scripts/pipeline/` | `.venv/bin/python -m scripts.pipeline review --pr <id>` |

See § "BayesIQ Planning Tool" above for full usage.

## Plan placement

Before writing a plan, determine which repo's files it modifies. Write the plan to that repo's plans directory. Cross-repo plans go in `bayesiq-workspace/plans/`.

| Repo | Plans directory |
|------|----------------|
| bayesiq | `docs/ai/pr_markdown_plans/` |
| bayesiq-workspace | `plans/` |
| All others | `plans/` |

Use `scripts/plan-target.sh <file1> <file2> ...` to determine the correct location programmatically.

## Permissions audit log

Every time a permissions issue occurs — tool prompt, sandbox denial, hook block, "Operation not permitted" — append an entry to `bayesiq-workspace/permissions-audit-log.md` using the schema defined there. This applies to all repos and all sessions.

**What to log:** any case where a tool call was blocked, prompted, or denied due to permissions. Include the tool, path, trigger, resolution, and root cause.

**Why:** Systematic tracking exposes repeat offenders and config gaps that ad-hoc fixes miss. The log is version-controlled and auditable via git history.

**When to mark fixed:** only after the settings/hook change has been applied and verified in a subsequent session.

## Postmortem placement

Postmortems live in the repo where the fix happens, not in a central index. This follows the same principle as plan placement (see § "Plan placement").

- Incident in DAK → `bayesiq-data-audit-kit/postmortems/`
- Incident in bayesiq → `bayesiq/postmortems/` (or `docs/ai/postmortems/`)
- Cross-repo or workspace-scoped incident → `bayesiq-workspace/postmortems/`

Each repo maintains its own `postmortems/_INDEX.md`. The workspace index only tracks workspace-scoped incidents.

## Machine bootstrap (one-time setup)

On a fresh machine (or after pulling config updates), run the bootstrap script:

```bash
~/BayesIQCode/bayesiq-workspace/scripts/bootstrap.sh
```

This installs Claude Code hooks, generates `~/.claude/settings.json` from the tracked template (preserving any existing API key secrets), and copies workspace-level config (`CLAUDE.md`, `.claude-settings.json`) to `$BIQ_ROOT/`.

All portable config lives in `bayesiq-workspace/claude-config/`:

| File | Purpose |
|------|---------|
| `hooks/bash-guard.sh` | Blocks dangerous Bash commands, enforces gh-api.sh wrapper |
| `hooks/read-guard.sh` | Validates file paths are within BayesIQ directories |
| `hooks/write-guard.sh` | Blocks writes to agent-local state (memory dirs) |
| `hooks/webfetch-guard.sh` | Restricts WebFetch to approved domains |
| `hooks/config-change-detect.sh` | Advisory: warns when shared config files are modified (PostToolUse) |
| `hooks/git-https-push.sh` | Secure HTTPS push helper (reads token internally, never prints it) |
| `settings.json.template` | Template for `~/.claude/settings.json` (`__BIQ_ROOT__` placeholder) |
| `claude-settings.json` | Shared repo-level permissions (`__BIQ_ROOT__` placeholder) |
| `CLAUDE.md.header` | Behavioral overrides (compiled into CLAUDE.md with CONTRIBUTING.md) |

To edit hooks or settings, update the files in `claude-config/` and re-run `bootstrap.sh`.

## Initializing a new repo

Run the init script from the new repo root:

```bash
~/BayesIQCode/bayesiq-workspace/scripts/init-repo.sh          # basic setup
~/BayesIQCode/bayesiq-workspace/scripts/init-repo.sh --python  # also set up venv tooling
```

This configures sandbox permissions, gitignore, and pipeline config. If the repo already has a `.claude/settings.local.json` with repo-specific hooks, the symlink step is skipped with a warning.

## Bootstrap context (`bootstrap_context.sh`)

Every repo should have a `.bootstrap_files` manifest at its root listing the key files to include when bootstrapping a new AI conversation. The shared script in `bayesiq-workspace/scripts/bootstrap_context.sh` reads this manifest, concatenates the files, and copies the result to the clipboard.

```bash
# From any BayesIQ repo with a .bootstrap_files manifest:
./scripts/bootstrap_context.sh          # copy to clipboard
./scripts/bootstrap_context.sh --stdout # print to stdout

# Or invoke the shared script directly:
~/BayesIQCode/bayesiq-workspace/scripts/bootstrap_context.sh --repo /path/to/repo
```

**Setting up a new repo:** add a `.bootstrap_files` to the repo root and a thin wrapper at `scripts/bootstrap_context.sh`:

```bash
#!/usr/bin/env bash
exec ~/BayesIQCode/bayesiq-workspace/scripts/bootstrap_context.sh "$@"
```

## Exhaust automation before escalating

Never ask the operator to run commands manually until you have exhausted all automated paths. The operator is a solo CEO — every "run this in a terminal" or "SSH to the Mini" is a high-cost context switch that defeats the purpose of autonomous infrastructure.

**Minimum before escalating:** Try at least 3 alternative approaches. If all fail, explain what you tried and why each failed.

**Automated paths to try first:**

1. **Permission block?** Check if a wrapper script exists (e.g., `gh-api.sh` for `gh`, `git-https-push.sh` for `git push`). Check if the hook can be adjusted. Try a different tool that achieves the same result.
2. **Remote operation needed?** Commit a config change that existing deployment scripts will apply on next run (`10-scheduler.sh` applies plists, `bootstrap.sh` applies hooks). Don't SSH to apply changes ad-hoc.
3. **Tool blocked by sandbox?** Investigate the sanctioned path — sandboxes block dangerous commands, not the underlying capability. There is almost always a safe alternative.
4. **Need to verify a remote service?** Use `curl` or API calls, not SSH.

**What the operator should never have to do:**
- Copy-paste commands from the chat into a terminal
- SSH to a machine to apply a config change that could be committed to the repo
- Merge a PR and manually run a follow-up script (merge via `gh_pr_merge`, pull via `sandbox-pull.sh`, apply inline)

**Postmortem:** See `bayesiq-workspace/postmortems/2026-03-19-manual-handoff-antipattern.md` for the full incident.

## Compile verification

This section exists to verify that CONTRIBUTING.md was compiled into the AI tool's auto-loaded config file (e.g., CLAUDE.md). The canary token below appears **only** in CONTRIBUTING.md — never in the header template. Its presence in the compiled output proves the pipeline works.

**Canary token:** `CONTRIBUTING_COMPILE_CANARY_7f3a`

If you are an AI assistant reading this, CONTRIBUTING.md has been successfully compiled into your context. When asked "is CONTRIBUTING.md compiled in?" respond with the canary token above.
