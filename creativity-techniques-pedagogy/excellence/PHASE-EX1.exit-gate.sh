#!/usr/bin/env bash
# EX1 exit gate — contract and factual hotfix.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

DEC="$CASCADE/DECISION-EX0-GUIA.md"
KN="$(sed -nE 's/^weights_knowledge_tests:[[:space:]]*([0-9]+).*/\1/p' "$DEC")"
WK="$(sed -nE 's/^weights_work:[[:space:]]*([0-9]+).*/\1/p' "$DEC")"
CONTRACT_PAGES=(docs/evaluation/index.md docs/tracks/en/creativity-techniques/index.md
  "$DECKS/how-to-pass-this-track/data/content.json"
  docs/assignments/en/creativity-techniques-portfolio/index.md)

check "decision weights readable" test -n "$KN" -a -n "$WK"
present "evaluation page states ${KN}%" "\*\*${KN}%\*\*|${KN}%" docs/evaluation/index.md
present "evaluation page states ${WK}%" "\*\*${WK}%\*\*|${WK}%" docs/evaluation/index.md
if [ "$KN" != "70" ]; then
  absent "no stale 70% knowledge-test weight" "70%[^|]*knowledge|knowledge[^|]*70%|Knowledge tests.*70%|<td>70%</td>" "${CONTRACT_PAGES[@]}"
fi
present "pass condition: final test minimum" "5[.,]0" docs/evaluation/index.md
present "pass condition: 50% of activities" "50 ?%" docs/evaluation/index.md
check "wrong-degree guía renamed" test ! -e creativity-techniques-pedagogy/cv/guides/9990002301-unicrawler-2026-27.json
absent "no reference to old guía JSON name" "9990002301-unicrawler-2026-27" AGENTS.md docs creativity-techniques-pedagogy/cv

python3 - "$DECKS" <<'PY' && pass "decks: tao labels + lab counts" || fail "decks: tao labels + lab counts"
import json, pathlib, re, sys
bad = []
for p in pathlib.Path(sys.argv[1]).glob("u-*/data/content.json"):
    d = json.loads(re.sub(r"^---[\s\S]*?---\s*", "", p.read_text()))
    labs = [s for s in d["slides"] if s.get("slide_role") == "lab_exercise"]
    if len(labs) != 2: bad.append(f"{p}: {len(labs)} lab_exercise")
    for s in d["slides"]:
        c = (s.get("citation") or {}).get("label") or ""
        if s.get("quote_origin") == "tao_invented" and "Tao of Creativity" not in c:
            bad.append(f"{p}: tao quote labelled {c!r}")
print("\n".join(bad)); sys.exit(1 if bad else 0)
PY

absent "Lehrer removed" "Lehrer" "$LESSONS"
absent "de Bono 1981 removed" "de Bono, Edward\. 1981|debono-1981" "$LESSONS"
absent "twenty suns fixed" "fluency thirty" "$DECKS"
absent "Tao of Development openers removed" "Tao of Development" docs/lessons
present "Six Hats names green hat" "green" "$LESSONS/u-2-idea-generation-selection/index.md"
present "Six Hats names blue hat" "blue" "$LESSONS/u-2-idea-generation-selection/index.md"
present "Eckersall co-authors" "Grehan, and Scheer" docs/lessons/en/master-lectures/creative-process-analysis/index.md

python3 - docs/lessons <<'PY' && pass "every listed reference is cited" || fail "every listed reference is cited"
import pathlib, re, sys
bad = []
for p in pathlib.Path(sys.argv[1]).rglob("index.md"):
    t = p.read_text()
    for rid in set(re.findall(r'id="(ref-[\w-]+)"', t)):
        if t.count(f"#{rid}") == 0: bad.append(f"{p}: {rid}")
print("\n".join(bad)); sys.exit(1 if bad else 0)
PY

build_site
finish
