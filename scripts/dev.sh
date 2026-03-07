#!/usr/bin/env bash
# Start both the audit API and Next.js dev server.
# Usage: ./scripts/dev.sh
# Stop:  Ctrl+C (kills both)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIT_KIT="$REPO_ROOT/../bayesiq-data-audit-kit"

# Ensure audit kit exists
if [[ ! -d "$AUDIT_KIT" ]]; then
  echo "Error: bayesiq-data-audit-kit not found at $AUDIT_KIT"
  exit 1
fi

# Ensure server venv exists
if [[ ! -d "$REPO_ROOT/server/.venv" ]]; then
  echo "Creating Python venv for audit API..."
  python3 -m venv "$REPO_ROOT/server/.venv"
  "$REPO_ROOT/server/.venv/bin/pip" install -q -r "$REPO_ROOT/server/requirements.txt"
fi

# Kill both on exit
cleanup() {
  echo ""
  echo "Shutting down..."
  kill $API_PID $WEB_PID 2>/dev/null
  wait $API_PID $WEB_PID 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

# Start audit API
echo "Starting audit API on http://localhost:8000 ..."
cd "$REPO_ROOT/server"
.venv/bin/uvicorn main:app --reload --reload-dir "$REPO_ROOT/server" --port 8000 &
API_PID=$!

# Wait for API to be ready
for i in $(seq 1 20); do
  if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "Audit API ready."
    break
  fi
  sleep 0.5
done

# Start Next.js
echo "Starting Next.js on http://localhost:3000 ..."
cd "$REPO_ROOT"
NEXT_PUBLIC_ENABLE_PLAYGROUND=true NEXT_PUBLIC_ENABLE_AUDIT_API=true npx next dev --port 3000 &
WEB_PID=$!

echo ""
echo "========================================="
echo "  Open http://localhost:3000/playground"
echo "  Ctrl+C to stop both servers"
echo "========================================="
echo ""

# Wait for either to exit
wait
