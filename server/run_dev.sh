#!/usr/bin/env bash
# Run the audit API locally for development.
# Usage: ./server/run_dev.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
AUDIT_KIT="$REPO_ROOT/../bayesiq-data-audit-kit"

if [[ ! -d "$AUDIT_KIT" ]]; then
  echo "Error: bayesiq-data-audit-kit not found at $AUDIT_KIT"
  echo "Clone it alongside this repo first."
  exit 1
fi

cd "$SCRIPT_DIR"

# Create venv if needed
if [[ ! -d .venv ]]; then
  echo "Creating Python venv..."
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
  .venv/bin/pip install -e "$AUDIT_KIT"
fi

echo "Starting audit API on http://localhost:8000"
echo "Press Ctrl+C to stop"
.venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000
