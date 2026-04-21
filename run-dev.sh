#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  echo "[run-dev] shutting down dev servers..."
  kill "${FRONTEND_PID:-}" "${BACKEND_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "[run-dev] starting frontend (npm run dev:frontend)..."
npm run dev:frontend &
FRONTEND_PID=$!

echo "[run-dev] starting backend (npm run dev:backend)..."
npm run dev:backend &
BACKEND_PID=$!

echo "[run-dev] dev servers running (frontend pid=${FRONTEND_PID}, backend pid=${BACKEND_PID})"
wait "$FRONTEND_PID" "$BACKEND_PID"
