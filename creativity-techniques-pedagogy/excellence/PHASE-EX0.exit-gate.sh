#!/usr/bin/env bash
# EX0 exit gate — probe exists, detects the pre-fix baseline, weights decided.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

PROBE="$CASCADE/probe/excellence-probe.mjs"
BASE="$CASCADE/evidence/baseline-EX0.json"
DEC="$CASCADE/DECISION-EX0-GUIA.md"

check "probe exists" test -f "$PROBE"
check "baseline exists" test -f "$BASE"
build_site
check "probe runs" node "$PROBE"
# Evaluate targets against the stored baseline, not the live tree, so this gate
# stays valid in regression runs after later phases meet the targets.
if node "$PROBE" --targets --from "$BASE" >/dev/null 2>&1; then fail "--targets must fail on the baseline"; else pass "--targets fails on the baseline"; fi

python3 - "$BASE" <<'PY' && pass "baseline detects pre-fix state" || fail "baseline detects pre-fix state"
import json, sys
b = json.load(open(sys.argv[1]))
keys = ["public_weights","php_cache_files","orphan_cache_files","oversize_cache_files",
        "dangling_slots","rank_dealing_present","empty_licence_assets","lab_exercise_counts",
        "tao_with_author_citation","uncited_references","leak_terms"]
missing = [k for k in keys if k not in b]
assert not missing, f"missing keys {missing}"
assert b["php_cache_files"] == 21, b["php_cache_files"]
assert b["rank_dealing_present"] is True
u3 = [v for k, v in b["dangling_slots"].items() if "u-3" in k]
assert u3 and len(u3[0]) == 6, b["dangling_slots"]
u1 = [v for k, v in b["lab_exercise_counts"].items() if "u-1" in k]
assert u1 and u1[0] == 3, b["lab_exercise_counts"]
assert len(b["tao_with_author_citation"]) >= 1
PY

python3 - "$DEC" <<'PY' && pass "weights decision complete" || fail "weights decision complete"
import re, sys
t = open(sys.argv[1]).read()
f = dict(re.findall(r"^(\w+):\s*(.+?)\s*$", t, re.M))
need = ["weights_knowledge_tests","weights_work","pass_final_test_min",
        "pass_min_activities_percent","source","confirmed_by","confirmed_on"]
assert all(f.get(k) for k in need), [k for k in need if not f.get(k)]
assert int(f["weights_knowledge_tests"]) + int(f["weights_work"]) == 100
PY

finish
