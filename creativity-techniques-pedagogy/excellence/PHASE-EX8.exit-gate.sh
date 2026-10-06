#!/usr/bin/env bash
# EX8 exit gate — Lab redesign and exercise cards.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

CAT=creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml
absent "U1 research homework replaced" "Research Marcel Duchamp|Research the Dada movement" "$DECKS/u-1-introduction-creativity" "$LESSONS/u-1-introduction-creativity"

ruby - "$CAT" "$DECKS" "$LESSONS" <<'RB' && pass "lab slides and cards" || fail "lab slides and cards"
require "yaml"; require "json"
cat = YAML.load_file(ARGV[0]); cat = cat["techniques"] if cat.is_a?(Hash)
tech = cat.to_h { |t| [t["id"].to_s, t] }
bad = []
%w[u-1-introduction-creativity u-2-idea-generation-selection u-3-development-solutions].each do |slug|
  d = JSON.parse(File.read(File.join(ARGV[1], slug, "data/content.json")).sub(/\A---.*?---\s*/m, ""))
  ids = d["slides"].select { |s| s["slide_role"] == "masterclass" }.map { |s| s["slide_id"] }
  labs = d["slides"].select { |s| s["slide_role"] == "lab_exercise" }
  bad << "#{slug}: #{labs.size} labs" unless labs.size == 2
  labs.each do |s|
    t = tech[s["technique_id"].to_s]
    bad << "#{slug}: unknown technique #{s['technique_id']}" unless t
    pr = Array(s["practises"])
    bad << "#{slug}: practises empty/invalid #{pr}" if pr.empty? || !(pr - ids).empty?
    bad << "#{slug}: lab without notes" if s["notes"].to_s.empty?
  end
  if slug.start_with?("u-2")
    sel = labs.any? { |s| t = tech[s["technique_id"].to_s]; t && (t["family"] == "selection" || t["mode"] == "convergent") }
    bad << "u-2: no selection technique" unless sel
  end
  lesson = File.read(File.join(ARGV[2], slug, "index.md"))
  b2 = lesson[/^## [^\n]*Lab.*?(?=^## )/m].to_s
  %w[Time: Group: Materials: Steps: Portfolio\ trace: Judged\ by: Source:].each do |lab|
    n = b2.scan(/\*\*#{Regexp.escape(lab)}\*\*/).size
    bad << "#{slug}: '#{lab}' on #{n}/2 cards" if n < 2
  end
  labs.each do |s|
    t = tech[s["technique_id"].to_s]
    bad << "#{slug}: embodied #{t['id']} without Opt-out" if t && t["family"] == "embodied" && b2 !~ /\*\*Opt-out:\*\*/
  end
end
puts bad.first(30)
exit(bad.empty? ? 0 : 1)
RB

SIGN="$CASCADE/curation/LAB-SIGNOFF.md"
check "lab sign-off file" test -f "$SIGN"
present "lab sign-off approved_by" "^approved_by: *[^ ]" "$SIGN"
check "validator --strict green" node scripts/validate-decks.mjs --strict --rights=flag
build_site
# Amendment A9: real-browser layout check (no Chrome = failure).
DL_LOG="$(mktemp -t excellence-deck-layout)"
if node scripts/tests/browser/deck-layout.mjs > "$DL_LOG" 2>&1; then
  if grep -q "SKIP" "$DL_LOG"; then fail "browser layout check skipped (no Chrome)"; else pass "browser layout check: $(tail -1 "$DL_LOG")"; fi
else
  fail "browser layout check"; tail -15 "$DL_LOG"
fi

# Amendment A11: catalogue corrections from the EX7 cold review.
ruby -ryaml -e '
cat = YAML.load_file(ARGV[0]); cat = cat["techniques"] if cat.is_a?(Hash)
rw = cat.find { |t| t["id"].to_s == "random-word" } or abort("random-word missing")
abort("random-word still repeats words") if rw["steps"].join(" ") =~ /second word|another (random )?word/i
pmi = cat.find { |t| t["id"].to_s =~ /pmi/ } or abort("pmi missing")
abort("PMI locator not printed pages") if pmi.to_s =~ /PDF index/i
' creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml && pass "catalogue A11 corrections (random-word, PMI)" || fail "catalogue A11 corrections (random-word, PMI)"
absent "stale INDEX line removed (A11/F7)" "No YAML editing is required" creativity-techniques-pedagogy/in-practice/INDEX.md

finish
