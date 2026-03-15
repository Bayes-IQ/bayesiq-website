#!/usr/bin/env bash
# Dev server lifecycle controller for Playwright tests.
# Manages a detached tmux session so the server persists outside
# Claude Code's sandbox (which blocks TCP listen).
#
# Usage:
#   ./scripts/dev-server.sh up      Start the dev server
#   ./scripts/dev-server.sh down    Stop the dev server
#   ./scripts/dev-server.sh status  Check if server is running
#   ./scripts/dev-server.sh logs    Attach to server output (Ctrl-B, D to detach)
#   ./scripts/dev-server.sh restart Restart the dev server

set -euo pipefail

SESSION="biq-dev"
PORT=3000
HOST="127.0.0.1"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

is_session_alive() {
  tmux has-session -t "$SESSION" 2>/dev/null
}

is_port_listening() {
  curl -s -o /dev/null -w "" "http://${HOST}:${PORT}/" 2>/dev/null
}

wait_for_server() {
  local max_wait=15
  for i in $(seq 1 "$max_wait"); do
    if is_port_listening; then
      return 0
    fi
    sleep 1
  done
  return 1
}

cmd_up() {
  if is_session_alive; then
    if is_port_listening; then
      echo "Dev server already running on http://${HOST}:${PORT}"
    else
      echo "tmux session exists but server not responding — restarting."
      cmd_down
      cmd_up
    fi
    return
  fi

  echo "Starting dev server on http://${HOST}:${PORT} ..."
  tmux new-session -d -s "$SESSION" "cd ${PROJECT_DIR} && npx next dev -H ${HOST} -p ${PORT}"

  if wait_for_server; then
    echo "Dev server is up. Claude Code can now run: npm test"
  else
    echo "Warning: server started but not responding after 15s."
    echo "Check logs: ./scripts/dev-server.sh logs"
  fi
}

cmd_down() {
  if is_session_alive; then
    tmux kill-session -t "$SESSION"
    echo "Dev server stopped."
  else
    echo "Dev server is not running."
  fi
}

cmd_status() {
  local session_status="stopped"
  local http_status="not responding"

  if is_session_alive; then
    session_status="running"
  fi
  if is_port_listening; then
    http_status="responding"
  fi

  echo "tmux session: ${session_status}"
  echo "http://${HOST}:${PORT}: ${http_status}"
}

cmd_logs() {
  if is_session_alive; then
    echo "Attaching to dev server logs (Ctrl-B, D to detach)..."
    tmux attach -t "$SESSION"
  else
    echo "Dev server is not running. Start it: ./scripts/dev-server.sh up"
  fi
}

cmd_restart() {
  cmd_down
  cmd_up
}

case "${1:-}" in
  up)      cmd_up ;;
  down)    cmd_down ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  restart) cmd_restart ;;
  *)
    echo "Usage: ./scripts/dev-server.sh {up|down|status|logs|restart}"
    exit 1
    ;;
esac
