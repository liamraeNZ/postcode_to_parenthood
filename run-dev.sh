#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  kill "${FRONTEND_PID:-}" "${WORKER_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

npm run dev:frontend &
FRONTEND_PID=$!

npm run dev:worker &
WORKER_PID=$!

wait "$FRONTEND_PID" "$WORKER_PID"
