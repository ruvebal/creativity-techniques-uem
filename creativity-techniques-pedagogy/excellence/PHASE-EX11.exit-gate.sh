#!/usr/bin/env bash
# EX11 exit gate — closing audit.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

build_site
check "probe --targets green" node "$CASCADE/probe/excellence-probe.mjs" --targets
check "final evidence saved" test -f "$CASCADE/evidence/final-EX11.json"
check "validator --strict green" node scripts/validate-decks.mjs --strict --rights=flag
check "safety script green" node scripts/verify-publication-safety.mjs
check "media tests green" node --test scripts/tests/

python3 - "$CASCADE" <<'PY' && pass "closing audit covers every finding once" || fail "closing audit covers every finding once"
import pathlib, re, sys
c = pathlib.Path(sys.argv[1])
ids = sorted(set(re.findall(r"^\| ([A-E]\d+) \|", (c / "FINDINGS-2026-10-04.md").read_text(), re.M)))
audit = (c / "CLOSING-AUDIT.md").read_text()
bad = [i for i in ids if len(re.findall(rf"^\| {i} \|", audit, re.M)) != 1]
print("missing or duplicated:", bad); sys.exit(1 if bad else 0)
PY

present "forge rule mentions image_brief" "image_brief" creativity-techniques-pedagogy/forge/STUDENT-SLIDESHOW-FORGE.mdc
present "unit forge mentions references.yml" "references\.yml" creativity-techniques-pedagogy/forge/ct-unit-forge.mdc
present "AGENTS.md points to the cascade" "excellence/" AGENTS.md
finish
