#!/usr/bin/env bash
# EX3 exit gate — image pipeline rules, tests, validator.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

CACHE=docs/assets/images/deck-media
check "old profield-cache dir removed" test ! -e docs/assets/images/profield-cache
[ -d node_modules ] || npm ci --silent >/tmp/excellence-npm.log 2>&1

check "media-rules module exists" test -f scripts/lib/media-rules.mjs
check "validator exists" test -f scripts/validate-decks.mjs
check "tests exist" test -f scripts/tests/media-rules.test.mjs
check "node --test green" node --test scripts/tests/
check "validator --strict --rights=flag green" node scripts/validate-decks.mjs --strict --rights=flag
check "rights report written" test -f "$CASCADE/curation/rights-report.json"
present "build runs the validator" "validate-decks" package.json
absent "no rank dealing" "rankCursor" scripts/rehydrate-student-media.mjs
absent "no hard-coded home path" "/Users/ruvebal" scripts/rehydrate-student-media.mjs scripts/validate-decks.mjs

# Tests must cover the four live failing cases by name.
for t in "index.php" "rights_review_required" "asset_id" "dangling"; do
  present "test covers: $t" "$t" scripts/tests/media-rules.test.mjs
done

if [ -d "$CACHE" ]; then
  n_php="$(find "$CACHE" -type f -name '*.php' | wc -l | tr -d ' ')"
  [ "$n_php" = 0 ] && pass "no .php cache files" || fail "$n_php .php cache files"
  big="$(find "$CACHE" -type f -size +600k | head -3)"
  [ -z "$big" ] && pass "no cache file > 600 KB" || { fail "cache files > 600 KB"; echo "$big"; }
fi

python3 - "$DECKS" docs/tracks/en/uem/2627-ml <<'PY' && pass "deck JSON: schema + no 'profield' values" || fail "deck JSON: schema + no 'profield' values"
import json, pathlib, re, sys
bad = []
for root in sys.argv[1:]:
    for p in pathlib.Path(root).glob("*/data/content.json"):
        raw = re.sub(r"^---[\s\S]*?---\s*", "", p.read_text())
        if "profield" in raw.lower(): bad.append(f"{p}: contains 'profield'")
        d = json.loads(raw)
        if "slides" not in d or "how-to-pass" in str(p): continue
        for s in d["slides"]:
            if not s.get("slide_id"): bad.append(f"{p}: slide without slide_id: {s.get('heading')}")
            if s.get("background_kind") == "curated" and not (s.get("asset_id") and s.get("image_brief")):
                bad.append(f"{p}: curated slide missing asset_id/image_brief: {s.get('slide_id')}")
print("\n".join(bad[:20])); sys.exit(1 if bad else 0)
PY

build_site
finish
