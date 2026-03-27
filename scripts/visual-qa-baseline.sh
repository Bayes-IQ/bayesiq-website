#!/usr/bin/env bash
# Visual QA baseline management
#
# Usage:
#   bash scripts/visual-qa-baseline.sh approve   — promote latest screenshots to baseline
#   bash scripts/visual-qa-baseline.sh compare   — show counts for baseline vs latest
#   bash scripts/visual-qa-baseline.sh status    — show current baseline metadata

set -euo pipefail

BASELINE_DIR="test-results/visual-qa/baseline"
LATEST_DIR="test-results/visual-qa"
META_FILE="$BASELINE_DIR/.baseline-meta.json"

case "${1:-status}" in
  approve)
    mkdir -p "$BASELINE_DIR"
    # Copy all PNGs from latest to baseline (excluding baseline/ itself)
    find "$LATEST_DIR" -maxdepth 1 -name "*.png" -exec cp {} "$BASELINE_DIR/" \;
    # Write metadata
    page_count=$(find "$BASELINE_DIR" -name "*.png" | wc -l | tr -d ' ')
    echo "{\"commit\": \"$(git rev-parse HEAD)\", \"date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"pages\": $page_count}" > "$META_FILE"
    echo "Baseline approved: $(cat "$META_FILE")"
    ;;
  compare)
    if [ ! -d "$BASELINE_DIR" ]; then
      echo "No baseline found. Run 'approve' first."
      exit 1
    fi
    baseline_count=$(find "$BASELINE_DIR" -name "*.png" | wc -l | tr -d ' ')
    latest_count=$(find "$LATEST_DIR" -maxdepth 1 -name "*.png" | wc -l | tr -d ' ')
    echo "Baseline files:"
    echo "  $baseline_count screenshots"
    echo "Latest files:"
    echo "  $latest_count screenshots"
    ;;
  status)
    if [ -f "$META_FILE" ]; then
      echo "Baseline: $(cat "$META_FILE")"
    else
      echo "No baseline configured."
    fi
    ;;
  *)
    echo "Usage: $0 {approve|compare|status}"
    exit 1
    ;;
esac
