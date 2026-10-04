#!/usr/bin/env bash
# EX4 exit gate — slide-bound curation.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

check "validator --strict green" node scripts/validate-decks.mjs --strict --rights=flag

python3 - "$DECKS" docs/tracks/en/uem/2627-ml <<'PY' && pass "curation rules" || fail "curation rules"
import json, pathlib, re, sys
# Relevance bans only (professor: treat all sources as usable; rights are flagged, not banned)
BANNED = ["hook and ladder", "fashion illustration", "patent sideboard"]
bad = []
for root in sys.argv[1:]:
    for p in pathlib.Path(root).glob("*/data/content.json"):
        if "how-to-pass" in str(p) or re.search(r"/u-[4-9]-", str(p)): continue
        d = json.loads(re.sub(r"^---[\s\S]*?---\s*", "", p.read_text()))
        assets = {a.get("asset_id"): a for a in d.get("assets", [])}
        for a in d.get("assets", []):
            blob = (a.get("title", "") + " " + a.get("asset_id", "")).lower()
            for b in BANNED:
                if b in blob: bad.append(f"{p}: banned asset {a.get('title')}")
        core = [s for s in d["slides"] if s.get("slide_role") in ("masterclass", "lab_exercise")]
        used = []
        for s in d["slides"]:
            if s.get("background_kind") != "curated": continue
            a = assets.get(s.get("asset_id"))
            if not s.get("image_brief") or "TODO" in s.get("image_brief", ""):
                bad.append(f"{p}: {s.get('slide_id')} brief missing")
            if not a: bad.append(f"{p}: {s.get('slide_id')} asset missing"); continue
            for k in ("licence", "author", "canonical_source_url", "alt_text"):
                if not a.get(k): bad.append(f"{p}: {s.get('slide_id')} asset lacks {k}")
            if a.get("rights_status") not in ("ok", "flagged"): bad.append(f"{p}: {s.get('slide_id')} rights_status missing")
            used.append(s.get("asset_id"))
        if len(used) != len(set(used)): bad.append(f"{p}: asset reused")
        imaged = [s for s in core if s.get("background_kind") == "curated"]
        if core and len(imaged) / len(core) < 0.6:
            bad.append(f"{p}: only {len(imaged)}/{len(core)} core slides imaged")
print("\n".join(bad[:30])); sys.exit(1 if bad else 0)
PY

SIGN="$CASCADE/curation/CURATION-SIGNOFF.md"
check "sign-off file" test -f "$SIGN"
present "sign-off approved_by" "^approved_by: *[^ ]" "$SIGN"
present "sign-off approved_on" "^approved_on: *[0-9]{4}-" "$SIGN"

build_site
finish
