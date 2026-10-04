#!/usr/bin/env bash
# Athanor CLI with its .env exported (the CLI reads os.environ only; without this
# it connects to Postgres with no password: "fe_sendauth: no password supplied").
# Usage: local/athanor.sh search "<query>" --project-slug profield-creativity-techniques -L scholar --top-k 5
set -euo pipefail
ATHANOR_HOME="${ATHANOR_HOME:-$HOME/src/athanor}"
set -a; . "$ATHANOR_HOME/.env"; set +a
exec "$ATHANOR_HOME/.venv/bin/athanor" "$@"
