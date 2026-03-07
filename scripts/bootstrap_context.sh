#!/usr/bin/env bash
# Combine key project files into a single context block and copy to clipboard.
# Usage: ./scripts/bootstrap_context.sh
#        ./scripts/bootstrap_context.sh --stdout   # print instead of copy

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# --- File list (order matters — most important first) ---
FILES=(
  "docs/ai/BOOTSTRAP_PROMPT.md"
  "docs/ai/ARCH_STATE.md"
  "docs/ai/ROADMAP.md"
  "docs/product/company_overview.md"
  "docs/product/services.md"
  "docs/product/problems.md"
  "docs/product/engagement_model.md"
  "docs/product/brand.md"
  "docs/product/company_tagline.md"
  "site.config.yaml"
  "src/components/playground/CsvPlayground.tsx"
)

# --- Build output ---
output=""
total_lines=0
included=0

for rel in "${FILES[@]}"; do
  full="$REPO_ROOT/$rel"
  if [[ -f "$full" ]]; then
    lines=$(wc -l < "$full")
    total_lines=$((total_lines + lines))
    included=$((included + 1))
    output+="
================================================================================
FILE: $rel ($lines lines)
================================================================================

$(cat "$full")

"
  else
    output+="
================================================================================
FILE: $rel (NOT FOUND — skipped)
================================================================================

"
  fi
done

# --- Append git status snapshot ---
cd "$REPO_ROOT"
git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
git_sha=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
git_status=$(git status --short 2>/dev/null || echo "unknown")
recent_commits=$(git log --oneline -5 2>/dev/null || echo "unknown")

output+="
================================================================================
GIT STATUS
================================================================================

Branch: $git_branch
Commit: $git_sha
Recent commits:
$recent_commits

Working tree:
$git_status
"

# --- Summary header ---
header="# BayesIQ Website — Bootstrap Context
# Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
# Files: $included/${#FILES[@]} | Lines: $total_lines
#
# Paste this into a new Claude/ChatGPT conversation to bootstrap context.
# This gives the LLM everything it needs to understand:
#   - What this repo is and where it sits in the BayesIQ ecosystem
#   - Current architecture and tech stack
#   - Development roadmap and what's in flight
#   - Product positioning and brand voice
#   - The CSV playground implementation
"

combined="${header}${output}"

# --- Output ---
if [[ "${1:-}" == "--stdout" ]]; then
  printf '%s' "$combined"
else
  printf '%s' "$combined" | pbcopy
  echo "Copied to clipboard ($included files, ~${total_lines} lines)"
fi
