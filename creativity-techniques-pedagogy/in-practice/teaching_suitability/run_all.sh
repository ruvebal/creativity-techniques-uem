#!/usr/bin/env bash
# Detached full-catalogue teaching-suitability scan (resumable).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=runtime/teaching-suitability
mkdir -p "$OUT"
export PYTHONUNBUFFERED=1
exec python3 -u -m teaching_suitability --all
