#!/usr/bin/env bash
# EX3 exit gate — image pipeline rules, tests, validator.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

CACHE=docs/assets/images/deck-media
# Amendment A2/F7: profield-cache may remain, holding only files legacy decks reference.
python3 - "$DECKS" <<'PY' && pass "profield-cache holds only legacy-referenced files" || fail "profield-cache holds only legacy-referenced files"
import pathlib, sys
old = pathlib.Path("docs/assets/images/profield-cache")
if not old.exists(): sys.exit(0)
refs = "".join(p.read_text() for p in pathlib.Path(sys.argv[1]).glob("*/data/content.json"))
bad = [f.name for f in old.iterdir() if f.is_file() and f.name not in refs]
print(bad); sys.exit(1 if bad else 0)
PY
# Orchestrator fix (EX3 landing): reinstall when the lockfile is newer than the installed tree,
# so a worktree whose node_modules predates sharp does not fail the rendition tests.
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then npm ci --silent >/tmp/excellence-npm.log 2>&1; fi

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
        if re.search(r"/u-[4-9]-", str(p)): continue
        raw = re.sub(r"^---[\s\S]*?---\s*", "", p.read_text())
        if "profield" in raw.lower(): bad.append(f"{p}: contains 'profield'")
        d = json.loads(raw)
        if "slides" not in d or "how-to-pass" in str(p) or re.search(r"/u-[4-9]-", str(p)): continue
        for s in d["slides"]:
            if not s.get("slide_id"): bad.append(f"{p}: slide without slide_id: {s.get('heading')}")
            if s.get("background_kind") == "curated" and not (s.get("asset_id") and s.get("image_brief")):
                bad.append(f"{p}: curated slide missing asset_id/image_brief: {s.get('slide_id')}")
print("\n".join(bad[:20])); sys.exit(1 if bad else 0)
PY

for p in cascade-harness 'lesson harness' 'studio extraction layer' 'cite-grade discovery'; do
  present "safety script has pattern: $p (A5/F2)" "$p" scripts/verify-publication-safety.mjs
done

# Sync-1 F4 (A8): every cache/media file referenced by any deck exists.
python3 - <<'GATEPY' && pass "all deck-referenced media files exist (A8/F4)" || fail "all deck-referenced media files exist (A8/F4)"
import pathlib, re, sys
missing = []
for p in pathlib.Path("docs/tracks").rglob("data/content.json"):
    for ref in set(re.findall(r"assets/images/(?:profield-cache|deck-media)/[0-9A-Za-z._-]+", p.read_text())):
        if not (pathlib.Path("docs") / ref).exists():
            missing.append(f"{p.parent.parent.name}: {ref}")
print(missing); sys.exit(1 if missing else 0)
GATEPY

build_site
finish
