#!/usr/bin/env bash
# ingest-dak-reports.sh — Copy DAK board_report.json into public/golden-flows/
#
# Usage: ./scripts/ingest-dak-reports.sh [DAK_GOLDEN_FLOWS_PATH]
#
# Reads from: {DAK_PATH}/{dak_vertical}/outputs/month_3/board_report.json
# Writes to:  public/golden-flows/{website_slug}/board_report.json
#
# Handles slug mapping between DAK directory names and website slugs:
#   DAK: fintech      -> website: fintech-gf
#   DAK: real_estate   -> website: real-estate
#   DAK: hospital      -> website: hospital
#   DAK: saas          -> website: saas
#   DAK: retail        -> website: retail
set -euo pipefail

DAK_PATH="${1:-$HOME/BayesIQCode/bayesiq-data-audit-kit/demo/golden_flows}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/public/golden-flows"

if [ ! -d "$DAK_PATH" ]; then
  echo "ERROR: DAK golden_flows path not found: $DAK_PATH" >&2
  exit 1
fi

echo "=== Board Report Ingestion ==="
echo "DAK source: $DAK_PATH"
echo "Output dir: $OUT_DIR"
echo ""

# Map DAK vertical names to website slugs
slug_for() {
  case "$1" in
    fintech)     echo "fintech-gf" ;;
    real_estate) echo "real-estate" ;;
    *)           echo "$1" ;;
  esac
}

copied=0
skipped=0

for dak_name in fintech real_estate hospital saas retail; do
  slug="$(slug_for "$dak_name")"
  src="$DAK_PATH/$dak_name/outputs/month_3/board_report.json"

  if [ ! -f "$src" ]; then
    echo "  SKIP $dak_name -> $slug (no board_report.json)"
    skipped=$((skipped + 1))
    continue
  fi

  # Write to slug-named dir (what the loader uses) and DAK-named dir (for consistency)
  for target_dir in "$slug" "$dak_name"; do
    dest_dir="$OUT_DIR/$target_dir"
    mkdir -p "$dest_dir"
    cp "$src" "$dest_dir/board_report.json"
  done

  echo "  OK $dak_name -> $slug/board_report.json"
  copied=$((copied + 1))
done

echo ""
echo "=== Done: $copied copied, $skipped skipped ==="
