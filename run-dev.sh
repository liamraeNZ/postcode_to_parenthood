#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  echo "[run-dev] shutting down dev server..."
  kill "${DEV_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "[run-dev] applying D1 migrations locally..."
CI=1 npx wrangler d1 migrations apply DB --local

echo "[run-dev] starting dev server (vite + cloudflare proxy)..."
npx vite dev --port 3005 &
DEV_PID=$!

echo "[run-dev] dev server running on http://localhost:3005 (pid=${DEV_PID})"
wait "$DEV_PID"
