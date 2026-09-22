#!/usr/bin/env python3
"""Read-only Athanor → Ahmes proof; hits remain discovery candidates."""
import dataclasses
import json
from pathlib import Path
from pipeline import OUT, ATHANOR, AHMES, PROJECT, command, connect, save, vaults
from semantic_quote import extract_quote

query = 'lateral thinking exercise practice draw divide geometric shapes alternatives'
raw = command([ATHANOR, 'search', query, '--project-slug', PROJECT,
               '--library', 'scholar', '--top-k', '12'], 'pilot-vector-query', 300)
hits = json.loads(raw)
index = vaults()
resolved = []
for hit in hits:
    meta = hit.get('metadata', {})
    dbs = index.get(meta.get('source_hash'), [])
    if len(dbs) != 1:
        resolved.append(dict(hit=hit, state='unresolved-vault', matches=dbs))
        continue
    node_id = meta['node_id']
    db = dbs[0]
    with connect(db) as c:
        node = c.execute('SELECT * FROM fission_node WHERE node_id=?', (node_id,)).fetchone()
        spatial = c.execute('SELECT * FROM anchor_spatial WHERE node_id=?', (node_id,)).fetchone()
    if node is None:
        resolved.append(dict(hit=hit, state='node-missing'))
        continue
    quote = dataclasses.asdict(extract_quote(Path(db), node_id))
    cite = command([AHMES, 'query', db, '--cite', db+':'+node_id,
                    '--style', 'chicago-author-date'], 'pilot-'+node_id+'-cite', 60)
    resolved.append(dict(hit=hit, state='source-resolved-not-exercise-reviewed',
        db=db, node=dict(node), spatial=dict(spatial) if spatial else None,
        quote=quote, cite_stdout=cite))
save(OUT/'pilot'/'vector-to-source.json', dict(query=query, project_slug=PROJECT,
    results=resolved, warning='Similarity does not establish an actionable exercise or complete instructions.'))
print(json.dumps([dict(score=r['hit'].get('similarity'), state=r['state'],
    node=r['hit'].get('metadata',{}).get('node_id'),
    quote_ok=r.get('quote',{}).get('ok')) for r in resolved], indent=2))
