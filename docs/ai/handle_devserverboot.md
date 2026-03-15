# Dev Server & Playwright in Claude Code — Complete

## Final Status (2026-03-14)

**Conclusion:** Playwright e2e tests **cannot** run inside the Claude Code sandbox on macOS. The sandbox blocks Chromium's Mach port IPC registration (`bootstrap_check_in`), which is fundamental to Chromium's multi-process architecture. This restriction cannot be bypassed with any current Claude Code sandbox setting.

Tests run normally in standard terminals and CI.

## What Works

| Component | Status | Detail |
|-----------|--------|--------|
| `allowLocalBinding: true` | **Solved** | Next.js dev server starts and listens on port 3000 inside the sandbox |
| Hermetic browser install | **Solved** | `PLAYWRIGHT_BROWSERS_PATH=0` in `package.json` scripts places browsers under `node_modules/` |
| Pre-commit hook | **Done** | Detects Claude Code via `$CLAUDECODE` and skips tests with a message |
| Tests in normal terminal | **Works** | `npm test` runs all 34 tests |
| Tests in CI | **Works** | Standard Playwright setup |

## What Cannot Work (sandbox limitation)

| Component | Blocker |
|-----------|---------|
| Chromium launch in sandbox | `FATAL: bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer: Permission denied (1100)` — Mach port registration is blocked by the Seatbelt sandbox profile |

### Attempted fixes that did NOT resolve the Mach port issue

- `excludedCommands: ["npx"]` — sandbox setting not fully respected ([#10524], [#16076], [#29274])
- `excludedCommands: ["chrome-headless-shell"]` — same result
- `--no-sandbox` flag on Chromium — Claude Code's sandbox is at the OS level (Seatbelt), not Chromium's internal sandbox

## Sandbox Restrictions Discovered

| Restriction | What breaks | Fix | Status |
|-------------|-----------|-----|--------|
| Network `listen()` blocked | Dev server can't start | `allowLocalBinding: true` | **Solved** |
| `~/Library` reads blocked | Chromium can't read its own binary | `PLAYWRIGHT_BROWSERS_PATH=0` | **Solved** |
| Mach port registration blocked | Chromium's multi-process IPC crashes | None available | **Cannot fix** |
| File watcher limits (EMFILE) | Next.js Watchpack crashes | `WATCHPACK_POLLING=true` | **Workaround** |

## Files Changed

| File | State |
|------|-------|
| `package.json` | `test` and `test:install` scripts set `PLAYWRIGHT_BROWSERS_PATH=0` |
| `.git/hooks/pre-commit` | Skips tests in Claude Code, runs normally elsewhere |
| `.claude/settings.local.json` | Has `allowLocalBinding: true`, `excludedCommands: ["npx"]` (kept for future if fixed) |
| `scripts/dev-server.sh` | Retained as utility; not required for primary workflow |

## Key Learnings

1. Claude Code's macOS sandbox uses Seatbelt profiles that restrict Mach port IPC — this is a hard blocker for any Chromium-based browser.
2. `excludedCommands` has known bugs and did not bypass the sandbox for our use case.
3. Hermetic browser installs (`PLAYWRIGHT_BROWSERS_PATH=0`) are a best practice regardless — they avoid system-path dependencies.
4. The pre-commit hook pattern of detecting `$CLAUDECODE` and skipping browser-dependent tests is the correct approach until Claude Code's sandbox gains Mach port support.

[#10524]: https://github.com/anthropics/claude-code/issues/10524
[#16076]: https://github.com/anthropics/claude-code/issues/16076
[#29274]: https://github.com/anthropics/claude-code/issues/29274
