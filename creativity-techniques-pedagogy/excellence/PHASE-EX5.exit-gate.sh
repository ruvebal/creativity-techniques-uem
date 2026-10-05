#!/usr/bin/env bash
# EX5 exit gate — deck renderer.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

check "render-decks runs" node scripts/render-decks.mjs
check "validator --strict green" node scripts/validate-decks.mjs --strict --rights=flag
build_site
absent "no hard-coded base path in deck JS" "/creativity-techniques-uem" docs/assets/js/student-media-deck.js
absent "no timestamped runtime fetch" "Date\.now\(\)" docs/assets/js/student-media-deck.js
present "render step wired into prebuild" "render-decks" package.json

n_geo="$(ls docs/assets/images/fractal-pass-track/*.svg 2>/dev/null | wc -l | tr -d ' ')"
n_hash="$(ls docs/assets/images/fractal-pass-track/ 2>/dev/null | grep -cE -- '-[0-9a-f]{8}\.svg$')"
[ "$n_geo" -gt 0 ] && [ "$n_geo" = "$n_hash" ] && pass "geometric SVGs carry a hash" || fail "geometric SVGs carry a hash ($n_hash/$n_geo)"

python3 - "$DECKS" <<'PY' && pass "pre-rendered sections, alt text, notes" || fail "pre-rendered sections, alt text, notes"
import json, pathlib, re, sys
bad = []
for p in pathlib.Path(sys.argv[1]).glob("u-[123]-*/data/content.json"):
    d = json.loads(re.sub(r"^---[\s\S]*?---\s*", "", p.read_text()))
    slug = p.parent.parent.name
    html = pathlib.Path("_site/tracks/ct") / slug / "index.html"
    if not html.exists():
        cands = list(pathlib.Path("_site").rglob(f"{slug}/index.html"))
        cands = [c for c in cands if "<section" in c.read_text()]
        html = cands[0] if cands else html
    if not html.exists(): bad.append(f"{slug}: built deck not found"); continue
    t = html.read_text()
    n = len(re.findall(r"<section\b", t))
    if n != len(d["slides"]): bad.append(f"{slug}: {n} sections vs {len(d['slides'])} slides")
    for s in d["slides"]:
        sid = s.get("slide_id")
        if s.get("slide_role") == "masterclass" and not s.get("notes"): bad.append(f"{slug}: {sid} no notes")
    if 'class="notes"' not in t: bad.append(f"{slug}: no notes asides")
    curated = sum(1 for s in d["slides"] if s.get("background_kind") == "curated")
    if curated and t.count("data-alt") + t.count('class="sr-only"') + t.count('class="visually-hidden"') < curated:
        bad.append(f"{slug}: alt text elements fewer than curated slides")
print("\n".join(bad)); sys.exit(1 if bad else 0)
PY

# Orchestrator gate amendment (EX5 round 2, strengthening): real-browser layout check.
# SKIP (exit 0) only when no Chrome is installed; on this machine Chrome is present.
if node scripts/tests/browser/deck-layout.mjs > /tmp/excellence-deck-layout.log 2>&1; then
  if grep -q "SKIP" /tmp/excellence-deck-layout.log; then fail "browser layout check skipped (no Chrome)"; else pass "browser layout check: $(tail -1 /tmp/excellence-deck-layout.log)"; fi
else
  fail "browser layout check"; tail -15 /tmp/excellence-deck-layout.log
fi

finish
