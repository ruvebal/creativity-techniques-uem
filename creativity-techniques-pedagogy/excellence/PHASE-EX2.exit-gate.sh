#!/usr/bin/env bash
# EX2 exit gate — publication firewall.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

build_site
check "safety script passes" node scripts/verify-publication-safety.mjs
check "_site/_data not published" test ! -e _site/_data

TERMS='\b(forge[ds]?|harness|lesson-scribe|vault|thessia|curriculum-internal|open procurement|gu[ií]a clone|contact-forgeable|udit|web-atelier)\b'
# Amendment A2/F5: the firewall is site-wide (hard constraint), not scoped.
hits="$(grep -rliE --include='*.html' -- "$TERMS" _site | head -10)"
if [ -z "$hits" ]; then pass "no internal terms in built HTML (whole site)"; else fail "internal terms in built HTML"; echo "$hits"; grep -rhoiE --include='*.html' -- "$TERMS" _site | sort | uniq -c | head; fi
if scoped_site_html | xargs grep -qiE -- 'creativity-techniques-pedagogy|cv/guides' 2>/dev/null; then fail "internal guide path in built HTML"; else pass "no internal guide path in built HTML"; fi

if grep -rqE --include='*.html' -- "9990002301" _site; then fail "internal guía id rendered (A3/F9)"; else pass "internal guía id not rendered (A3/F9)"; fi
for p in harness lesson-scribe vault udit forge 9990002301; do
  present "safety script has pattern: $p" "$p" scripts/verify-publication-safety.mjs
done

for f in "$LESSONS"/u-[123]-*/index.md docs/assignments/en/*/index.md; do
  present "AI declaration linked: $f" "/ai-declaration/" "$f"
done
check "old special deck retired" test ! -e "$DECKS/special-creative-process-analysis/data/content.json"

finish
