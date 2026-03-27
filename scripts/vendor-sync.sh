#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# vendor-sync.sh — Sync design system outputs into src/vendor/biq/
#
# Copies tokens.css from bayesiq-design-system/dist/ into the website's
# vendored directory, stripping dark mode blocks (site is light-only)
# and @font-face blocks (website uses next/font).
#
# If tailwind-v4-theme.css exists in dist/, it is copied as well.
# That file is currently manually maintained in this repo and will be
# auto-synced once bayesiq-design-system issue #7 lands.
#
# Usage:
#   bash scripts/vendor-sync.sh              # copy + validate
#   bash scripts/vendor-sync.sh --dry-run    # report only, no copy
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ──
DS_DIST="$HOME/BayesIQCode/bayesiq-design-system/dist"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR_DIR="$REPO_ROOT/src/vendor/biq"
MIN_TOKEN_COUNT=30

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[dry-run] No files will be modified."
fi

# ── Pre-flight checks ──
if [[ ! -d "$DS_DIST" ]]; then
  echo "ERROR: Design system dist not found at $DS_DIST"
  echo "       Run 'npm run build' in ~/BayesIQCode/bayesiq-design-system/ first."
  exit 1
fi

if [[ ! -f "$DS_DIST/tokens.css" ]]; then
  echo "ERROR: $DS_DIST/tokens.css not found."
  exit 1
fi

mkdir -p "$VENDOR_DIR"

# ── Helper: strip dark mode and @font-face blocks from tokens.css ──
strip_tokens() {
  # Uses awk to remove:
  #   1. @font-face { ... } blocks
  #   2. [data-theme="dark"] { ... } blocks
  #   3. @media (prefers-color-scheme: dark) { ... } blocks
  # Also converts :root, [data-theme="light"] selector to plain :root
  awk '
    # Track brace depth for block removal
    /^@font-face[[:space:]]*\{/ { skip=1; depth=0 }
    /^\[data-theme="dark"\][[:space:]]*\{/ { skip=1; depth=0 }
    /^@media[[:space:]]*\(prefers-color-scheme:[[:space:]]*dark\)/ { skip=1; depth=0 }

    skip {
      depth += gsub(/\{/, "{")
      depth -= gsub(/\}/, "}")
      if (depth <= 0) { skip=0 }
      next
    }

    # Simplify the light-mode selector to plain :root
    {
      gsub(/:root, \[data-theme="light"\]/, ":root")
      print
    }
  ' "$1"
}

# ── Process tokens.css ──
echo ""
echo "=== tokens.css ==="

STRIPPED=$(strip_tokens "$DS_DIST/tokens.css")

# Add a vendored header
HEADER="/* BayesIQ Design System — Vendored Tokens (light-only)
 * Source: bayesiq-design-system/dist/tokens.css
 * Synced by: scripts/vendor-sync.sh
 * Dark mode blocks and @font-face removed (site is light-only, uses next/font).
 * Do not edit manually — re-run vendor-sync.sh to update.
 */"
# Remove the original file header and collapse multiple blank lines
BODY=$(echo "$STRIPPED" | sed '/^\/\* BayesIQ Design System/,/\*\//d' | cat -s)
# Trim leading blank lines from body
BODY=$(echo "$BODY" | sed '/./,$!d')
PROCESSED="${HEADER}
${BODY}"

# Count custom properties
TOKEN_COUNT=$(echo "$PROCESSED" | grep -c '^\s*--biq-' || true)
echo "  Token count: $TOKEN_COUNT custom properties"

if [[ "$TOKEN_COUNT" -lt "$MIN_TOKEN_COUNT" ]]; then
  echo "ERROR: Only $TOKEN_COUNT tokens found (minimum: $MIN_TOKEN_COUNT)."
  echo "       The source file may be malformed or the strip logic too aggressive."
  exit 1
fi

if [[ "$DRY_RUN" == true ]]; then
  if [[ -f "$VENDOR_DIR/tokens.css" ]]; then
    echo "  Diff (current vs. new):"
    diff --unified "$VENDOR_DIR/tokens.css" <(echo "$PROCESSED") || true
  else
    echo "  File does not exist yet — would create $VENDOR_DIR/tokens.css"
    echo "  ($TOKEN_COUNT tokens, $(echo "$PROCESSED" | wc -l | tr -d ' ') lines)"
  fi
else
  echo "$PROCESSED" > "$VENDOR_DIR/tokens.css"
  echo "  Written to $VENDOR_DIR/tokens.css"
fi

# ── Process tailwind-v4-theme.css (optional) ──
echo ""
echo "=== tailwind-v4-theme.css ==="

if [[ -f "$DS_DIST/tailwind-v4-theme.css" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    if [[ -f "$VENDOR_DIR/tailwind-v4-theme.css" ]]; then
      echo "  Diff (current vs. source):"
      diff --unified "$VENDOR_DIR/tailwind-v4-theme.css" "$DS_DIST/tailwind-v4-theme.css" || true
    else
      echo "  File does not exist yet — would create $VENDOR_DIR/tailwind-v4-theme.css"
      echo "  ($(wc -l < "$DS_DIST/tailwind-v4-theme.css" | tr -d ' ') lines)"
    fi
  else
    cp "$DS_DIST/tailwind-v4-theme.css" "$VENDOR_DIR/tailwind-v4-theme.css"
    echo "  Copied from design system dist."
  fi
else
  echo "  Not found in $DS_DIST — skipping."
  echo "  (Will be auto-synced once bayesiq-design-system#7 lands.)"
fi

# ── Summary ──
echo ""
if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run complete. No files were modified."
else
  echo "Vendor sync complete."
  echo "  tokens.css:            $TOKEN_COUNT tokens (dark mode + @font-face stripped)"
  if [[ -f "$DS_DIST/tailwind-v4-theme.css" ]]; then
    echo "  tailwind-v4-theme.css: copied from design system"
  else
    echo "  tailwind-v4-theme.css: skipped (not in dist yet)"
  fi
fi

exit 0
