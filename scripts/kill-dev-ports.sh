#!/bin/bash
set -euo pipefail

# Free this project's Jekyll ports before restart (not DC's 4002/35730).
LIVERELOAD_PORT="${LIVERELOAD_PORT:-35731}"
SERVER_PORT="${PORT:-4003}"

for port in "$LIVERELOAD_PORT" "$SERVER_PORT"; do
	pids=$(lsof -t -i:"$port" 2>/dev/null || true)
	if [ -n "$pids" ]; then
		echo "[kill-dev-ports] freeing port $port (pids: $pids)"
		kill -9 $pids 2>/dev/null || true
	fi
done
