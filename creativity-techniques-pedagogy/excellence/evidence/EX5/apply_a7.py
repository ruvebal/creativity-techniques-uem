"""EX5 / Amendment A7: apply source titles and the two alt-text fixes to the
private registry (curation/autopilot-assets.json). Values come from
evidence/EX4/choices.py (SOURCE_TITLES, alt texts), so bind.py reproduces them.
Then `npm run media:rehydrate` carries them into the public deck JSON.

Usage (worktree root): python3 creativity-techniques-pedagogy/excellence/evidence/EX5/apply_a7.py
"""
import json, pathlib, sys
ROOT = pathlib.Path.cwd()
sys.path.insert(0, str(ROOT / 'creativity-techniques-pedagogy/excellence/evidence/EX4'))
from choices import S, SOURCE_TITLES  # noqa: E402

regp = ROOT / 'creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json'
reg = json.loads(regp.read_text())
alt_by_asset = {'wikimedia:' + chosen: alt for (_, _), (scores, chosen, alt) in S.items() if chosen and alt}
changed = 0
for rec in reg['assets']:
    aid = rec['asset_id']
    title = SOURCE_TITLES.get(aid)
    if not title:
        sys.exit(f'no source title for {aid}')
    if rec['title'] != title:
        rec.setdefault('brief_title', rec['title'])
        rec['title'] = title
        changed += 1
    alt = alt_by_asset.get(aid)
    if alt and rec['alt_text'] != alt:
        print('alt:', aid, '\n  ', rec['alt_text'], '\n→ ', alt)
        rec['alt_text'] = alt
        changed += 1
regp.write_text(json.dumps(reg, indent=2, ensure_ascii=False) + '\n')
print(changed, 'field(s) changed')
