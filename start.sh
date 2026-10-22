#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
for tool in java mvn node npm; do
  command -v "$tool" >/dev/null || { echo "Missing $tool. See README.md prerequisites."; exit 1; }
done
if [ ! -f frontend/node_modules/next/package.json ]; then
  (cd frontend && npm ci)
fi
backend_pid=''
frontend_pid=''
cleanup() {
  [ -z "$backend_pid" ] || kill "$backend_pid" 2>/dev/null || true
  [ -z "$frontend_pid" ] || kill "$frontend_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
(cd backend && export SERVER_PORT=8081 APP_PROFILE=dev && exec mvn spring-boot:run) &
backend_pid=$!
(cd frontend && export NEXT_PUBLIC_API_URL=http://localhost:8081/api && exec npm run dev) &
frontend_pid=$!
echo 'Wait for both servers. Open http://localhost:3000. Press Ctrl+C to stop.'
wait "$backend_pid" "$frontend_pid"
