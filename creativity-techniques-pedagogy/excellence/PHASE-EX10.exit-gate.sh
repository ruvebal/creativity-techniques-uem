#!/usr/bin/env bash
# EX10 exit gate — didactics layer.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

A="$CASCADE/assessment"
check "question bank" test -f "$A/question-bank.yml"
check "measurement protocol" test -f "$A/MEASUREMENT-PROTOCOL.md"
present "approval recorded" "^approved_by: *[^ ]" "$A/APPROVAL.md"
check "consent form exists" sh -c 'ls creativity-techniques-pedagogy/consent/* | grep -qiv gitkeep'

ruby - "$A/question-bank.yml" docs/_data/references.yml <<'RB' && pass "question bank rules" || fail "question bank rules"
require "yaml"
qs = YAML.load_file(ARGV[0]); qs = qs["questions"] if qs.is_a?(Hash)
refs = YAML.load_file(ARGV[1]); keys = refs.is_a?(Hash) ? refs.keys.map(&:to_s) : refs.map { |r| r["key"].to_s }
bad = []
%w[U1 U2 U3].each { |u| n = qs.count { |q| q["unit"].to_s.upcase == u }; bad << "#{u}: #{n} questions" if n < 20 }
qs.each_with_index do |q, i|
  %w[unit ra type stem answer ref bloom].each { |f| bad << "q#{i}: missing #{f}" if q[f].to_s.empty? }
  bad << "q#{i}: ref #{q['ref']} unknown" unless keys.include?(q["ref"].to_s)
  bad << "q#{i}: mcq without distractors" if q["type"] == "mcq" && Array(q["distractors"]).size < 2
end
high = qs.count { |q| %w[apply analyse analyze evaluate create].include?(q["bloom"].to_s.downcase) }
bad << "higher-order share #{high}/#{qs.size} < 30%" if qs.size.zero? || high.to_f / qs.size < 0.3
puts bad.first(30)
exit(bad.empty? ? 0 : 1)
RB

python3 - "$DECKS" <<'PY' && pass "one retrieval slide per deck" || fail "one retrieval slide per deck"
import json, pathlib, re, sys
bad = []
for p in pathlib.Path(sys.argv[1]).glob("u-[123]-*/data/content.json"):
    d = json.loads(re.sub(r"^---[\s\S]*?---\s*", "", p.read_text()))
    n = sum(1 for s in d["slides"] if s.get("slide_role") == "retrieval")
    if n != 1: bad.append(f"{p}: {n} retrieval slides")
print("\n".join(bad)); sys.exit(1 if bad else 0)
PY

build_site
for u in 1 2 3; do
  f="$(ls _site/practice/en/u-$u*/index.html 2>/dev/null | head -1)"
  if [ -n "$f" ] && [ "$(grep -o 'data-question' "$f" | wc -l | tr -d ' ')" -ge 5 ]; then pass "practice quiz U$u"; else fail "practice quiz U$u (need 5 elements with data-question)"; fi
done
cards="$(grep -o 'data-method-card' _site/methods/en/cards/index.html 2>/dev/null | wc -l | tr -d ' ')"
[ "${cards:-0}" -ge 20 ] && pass "method cards ($cards)" || fail "method cards (${cards:-0} < 20, need data-method-card)"
if grep -rqiE "question-bank|MEASUREMENT-PROTOCOL" _site; then fail "private assessment files leaked"; else pass "assessment files private"; fi
# Amendment A9: real-browser layout check (no Chrome = failure).
DL_LOG="$(mktemp -t excellence-deck-layout)"
if node scripts/tests/browser/deck-layout.mjs > "$DL_LOG" 2>&1; then
  if grep -q "SKIP" "$DL_LOG"; then fail "browser layout check skipped (no Chrome)"; else pass "browser layout check: $(tail -1 "$DL_LOG")"; fi
else
  fail "browser layout check"; tail -15 "$DL_LOG"
fi

finish
