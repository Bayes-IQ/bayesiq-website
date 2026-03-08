#!/usr/bin/env bash
# Build the audit API Docker image.
# Copies the audit kit source into the build context, then builds.
# Usage: ./server/build.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_KIT="$SCRIPT_DIR/../../bayesiq-data-audit-kit"

if [[ ! -d "$AUDIT_KIT" ]]; then
  echo "Error: bayesiq-data-audit-kit not found at $AUDIT_KIT"
  exit 1
fi

# Sync audit kit source (exclude tests, docs, .git, etc.)
echo "Syncing audit kit source..."
rsync -a --delete \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='tests' \
  --exclude='docs' \
  --exclude='demo' \
  --exclude='reviews' \
  --exclude='sales' \
  --exclude='case_study' \
  --exclude='audit_runs' \
  --exclude='validation' \
  "$AUDIT_KIT/" "$SCRIPT_DIR/bayesiq-data-audit-kit/"

echo "Building Docker image..."
docker build -t bayesiq-audit-api "$SCRIPT_DIR"

echo ""
echo "Done. Run with:"
echo "  docker run -p 8000:8000 bayesiq-audit-api"
