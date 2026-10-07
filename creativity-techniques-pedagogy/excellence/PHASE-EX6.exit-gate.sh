#!/usr/bin/env bash
# EX6 exit gate — research grounding and single bibliography.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

MAN="$CASCADE/research-manifest.yml"
REFS=docs/_data/references.yml
check "manifest exists" test -f "$MAN"
check "references.yml exists" test -f "$REFS"
check "references include exists" test -f docs/_includes/references.html
absent "no hand-written reference spans" 'id="ref-' "${SCOPED_LESSONS[@]}"

ruby - "$MAN" "$REFS" "$LESSONS" docs/lessons/en/master-lectures/creative-process-analysis/index.md <<'RB' && pass "manifest, refs and citations agree" || fail "manifest, refs and citations agree"
require "yaml"
man = YAML.load_file(ARGV[0]); refs = YAML.load_file(ARGV[1])
man = man["works"] if man.is_a?(Hash) && man["works"]
ref_keys = refs.is_a?(Hash) ? refs.keys.map(&:to_s) : refs.map { |r| r["key"].to_s }
required = {
  "u-1" => %w[runco rhodes kaufman amabile boden wallas guilford torrance benedek scott getzels buchanan schon kimbell],
  "u-2" => %w[osborn diehl mullen rohrbach eberle zwicky gordon koestler jansson ward beaty rietzschel puccio rodari young colzato],
  "u-3" => %w[dow houde buxton goldschmidt dorst knapp brown],
}
bad = []
keys = man.map { |w| w["key"].to_s }
required.each { |u, names| names.each { |n| bad << "manifest lacks #{u}:#{n}" unless keys.any? { |k| k.start_with?(n) } } }
man.each do |w|
  bad << "#{w['key']}: bad status" unless %w[verified gap].include?(w["status"].to_s)
  bad << "#{w['key']}: verified but not in references.yml" if w["status"] == "verified" && !ref_keys.include?(w["key"].to_s)
end
files = Dir.glob(File.join(ARGV[2], "u-[123]-*", "index.md")) + [ARGV[3]]
files.each do |f|
  t = File.read(f)
  cited = t.scan(/#ref-([\w-]+)/).flatten.uniq
  cited.each { |c| bad << "#{f}: cites unknown #{c}" unless ref_keys.include?(c) }
  unit = f[/u-\d/]
  next unless unit
  bad << "#{f}: only #{cited.size} works cited" if cited.size < 8
  man.select { |w| w["status"] == "verified" && w["unit"].to_s.downcase.include?(unit.delete("-")) }.each do |w|
    bad << "#{f}: verified #{w['key']} not cited" unless cited.include?(w["key"].to_s)
  end
  gaps = man.select { |w| w["status"] == "gap" }.map { |w| w["key"].to_s }
  gaps.each { |g| bad << "#{f}: gap #{g} cited in student text" if cited.include?(g) }
  prov = t.scan(/PROVENANCE_LINE/).size
  bad << "#{f}: #{prov} provenance lines < #{cited.size} citations" if prov < cited.size
end
puts bad.first(30)
exit(bad.empty? ? 0 : 1)
RB

# Amendment A3/F2–F3: every verified provenance line declares how its page was read.
python3 - "${SCOPED_LESSONS[@]}" <<'GATEPY' && pass "PROVENANCE_LINE page_basis declared" || fail "PROVENANCE_LINE page_basis declared"
import pathlib, re, sys
bad = []
for f in [x for d in sys.argv[1:] for x in pathlib.Path(d).rglob("index.md")]:
    for line in f.read_text().splitlines():
        if "PROVENANCE_LINE" in line and "status=VERIFIED" in line and not re.search(r"page_basis=(printed|section)", line):
            bad.append(f"{f}: {line[:90]}")
print("\n".join(bad[:20])); sys.exit(1 if bad else 0)
GATEPY
absent "no Chen PDF-index pins left" "\(Chen 2012, 4[01]\)" "${SCOPED_LESSONS[@]}" "${SCOPED_DECKS[@]}"

build_site
finish
