#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  echo "[run-dev] shutting down dev servers..."
  kill "${FRONTEND_BUILD_PID:-}" "${WORKER_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

if [ -d ".wrangler/state/v3/d1" ]; then
  echo "[run-dev] resetting local D1 state..."
  rm -rf ".wrangler/state/v3/d1"
fi

echo "[run-dev] applying D1 migrations locally..."
CI=1 npx wrangler d1 migrations apply DB --local

echo "[run-dev] building frontend in watch mode..."
npm run build:watch &
FRONTEND_BUILD_PID=$!

echo "[run-dev] starting unified worker (wrangler dev)..."
npx wrangler dev --port 3005 --local &
WORKER_PID=$!

echo "[run-dev] dev servers running (frontend build pid=${FRONTEND_BUILD_PID}, worker pid=${WORKER_PID})"
wait "$FRONTEND_BUILD_PID" "$WORKER_PID"
