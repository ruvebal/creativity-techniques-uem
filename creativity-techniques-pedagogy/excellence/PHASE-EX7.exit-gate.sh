#!/usr/bin/env bash
# EX7 exit gate — canonical technique catalogue.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

CAT=creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml
check "catalogue exists" test -f "$CAT"
check "reading view exists" test -f creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.md
present "INDEX points to catalogue" "CANONICAL-TECHNIQUES" creativity-techniques-pedagogy/in-practice/INDEX.md

ruby - "$CAT" docs/_data/references.yml <<'RB' && pass "catalogue rules" || fail "catalogue rules"
require "yaml"
cat = YAML.load_file(ARGV[0]); cat = cat["techniques"] if cat.is_a?(Hash)
refs = YAML.load_file(ARGV[1]); ref_keys = refs.is_a?(Hash) ? refs.keys.map(&:to_s) : refs.map { |r| r["key"].to_s }
bad = []
bad << "count #{cat.size} outside 40..80" unless (40..80).cover?(cat.size)
fields = %w[id name family mode primary_source catalogue_records steps time_min group_size materials units evidence]
cat.each do |t|
  fields.each { |f| bad << "#{t['id']}: missing #{f}" if t[f].nil? || t[f] == "" }
  bad << "#{t['id']}: bad family" unless %w[generation selection development framing reflection embodied].include?(t["family"])
  bad << "#{t['id']}: bad mode" unless %w[divergent convergent both].include?(t["mode"])
  bad << "#{t['id']}: steps 3..8" unless t["steps"].is_a?(Array) && (3..8).cover?(t["steps"].size)
  ps = t["primary_source"].to_s
  bad << "#{t['id']}: source #{ps} not in references.yml" unless ps == "gap" || ref_keys.include?(ps)
  bad << "#{t['id']}: embodied without accessibility" if t["family"] == "embodied" && t["accessibility"].to_s.empty?
  bad << "#{t['id']}: off-topic" if t.to_s =~ /\b(GAN|TensorFlow|network security|hyperparameter)\b/i
end
%w[id name].each { |k| v = cat.map { |t| t[k].to_s.downcase }; bad << "duplicate #{k}" if v.uniq.size != v.size }
required = [/alternative uses/i, /brainstorm/i, /6-3-5|brainwriting/i, /scamper/i, /morpholog/i, /synectic|analog/i,
  /random word|\bpo\b/i, /six (thinking )?hats/i, /oblique/i, /mind ?map/i, /attribute/i, /cut-?up/i, /exquisite/i,
  /readymade/i, /automatic writing/i, /open.monitoring/i, /thirty circles/i, /hits|dot vot/i, /cocd/i, /\bpmi\b/i,
  /\balu\b/i, /decision matrix/i, /consensual assessment|\bcat\b/i, /parallel prototyp/i, /crazy ?8/i,
  /storyboard/i, /mom test/i, /fantastic binomial/i, /young/i, /journal/i]
names = cat.map { |t| "#{t['name']} #{t['id']}" }
required.each { |r| bad << "required technique missing: #{r.source}" unless names.any? { |n| n =~ r } }
puts bad.first(30)
exit(bad.empty? ? 0 : 1)
RB

build_site
if grep -rqi "CANONICAL-TECHNIQUES" _site; then fail "catalogue leaked into _site"; else pass "catalogue not published"; fi
finish
