#!/usr/bin/env bash
# EX9 exit gate — lesson structure, exemplars, images.
source "$(git rev-parse --show-toplevel)/creativity-techniques-pedagogy/excellence/gates/common.sh"

absent "no meta-commentary" "the same page that|this library|open procurement|page cite still open|studio stance\)" "${SCOPED_LESSONS[@]}"

python3 - "$LESSONS" <<'PY' && pass "lesson structure" || fail "lesson structure"
import pathlib, re, sys
ORDER = ["Learning objectives", "Analysis", "Masterclass", "Lab", "Workshop", "Conclusion", "References"]
bad = []
for slug in ["u-1-introduction-creativity", "u-2-idea-generation-selection", "u-3-development-solutions"]:
    t = (pathlib.Path(sys.argv[1]) / slug / "index.md").read_text()
    t = re.sub(r"\{% if site\.publication[\s\S]*?\{% endif %\}", "", t)
    h2 = [re.sub(r"[^\w ]", "", h).strip() for h in re.findall(r"^## (.+)$", t, re.M)]
    pos = []
    for name in ORDER:
        hits = [i for i, h in enumerate(h2) if re.search(rf"\b{name}\b", h, re.I)]
        if len(hits) != 1: bad.append(f"{slug}: '{name}' headings = {len(hits)}"); pos.append(-1)
        else: pos.append(hits[0])
    if -1 not in pos and pos != sorted(pos): bad.append(f"{slug}: section order {pos}")
    mc = re.search(r"^## [^\n]*Masterclass[^\n]*\n([\s\S]*?)(?=^## )", t, re.M)
    ideas = re.split(r"^### ", mc.group(1), flags=re.M)[1:] if mc else []
    if len(ideas) < 4: bad.append(f"{slug}: {len(ideas)} ideas found")
    for i in ideas:
        title = i.splitlines()[0]
        if "**Try it:**" not in i: bad.append(f"{slug}: idea '{title}' lacks Try it")
        words = len(re.sub(r"<[^>]+>|\{[^}]+\}", " ", i).split())
        if words > 220: bad.append(f"{slug}: idea '{title}' {words} words")
    lab = re.search(r"^## [^\n]*Lab[^\n]*\n([\s\S]*?)(?=^## )", t, re.M)
    if not lab or lab.group(1).count("**Example trace:**") < 2: bad.append(f"{slug}: example traces < 2")
    imgs = len(re.findall(r"!\[[^\]]+\]\(|<img\b[^>]*\balt=\"[^\"]+\"", t))
    caps = len(re.findall(r"<figcaption|\{: \.caption", t))
    if imgs < max(1, len(ideas) // 2): bad.append(f"{slug}: {imgs} images for {len(ideas)} ideas")
    if caps < imgs: bad.append(f"{slug}: {imgs} images, {caps} captions")
print("\n".join(bad)); sys.exit(1 if bad else 0)
PY

# Amendment A3/F5–F7
for slug in u-1-introduction-creativity u-2-idea-generation-selection u-3-development-solutions; do
  f="$LESSONS/$slug/index.md"
  present "$slug: tao-of-creativity anchor" 'id="tao-of-creativity"|\{#tao-of-creativity\}' "$f"
  python3 - "$f" <<'GATEPY' && pass "$slug: Workshop timing stated" || fail "$slug: Workshop timing stated"
import re, sys
t = open(sys.argv[1]).read()
m = re.search(r"^## [^\n]*Workshop[^\n]*\n+([^\n]+)", t, re.M)
sys.exit(0 if m and re.search(r"session", m.group(1), re.I) else 1)
GATEPY
done

build_site
finish
