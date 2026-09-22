#!/usr/bin/env python3
"""Mechanical evidence gate, independent of local model assertions."""
import json
from pipeline import OUT, connect, digest
from semantic_quote import assert_verbatim, load_nodes

failures = []
records = list((OUT/'records').glob('*.json'))
for path in records:
    r = json.loads(path.read_text())
    p = r['provenance']
    with connect(p['extraction_db']) as c:
        hashes = {x[0] for x in c.execute('SELECT file_hash FROM source')}
    if r['source_sha256'] not in hashes:
        failures.append(str(path)+': source mismatch')
    if r.get('publication_allowed') is not False:
        failures.append(str(path)+': publication flag is not false')
    q = r['quote']
    if q.get('ok'):
        nodes = {n.node_id:n for n in load_nodes(p['extraction_db'])}
        assert_verbatim(q['quote'], [nodes[n] for n in q['node_ids']])
    if not p['ahmes_records'].get('fission_node'):
        failures.append(str(path)+': missing original node records')
coverage = list((OUT/'coverage').glob('*.json'))
print(json.dumps(dict(records=len(records), sources_scanned=len(coverage), failures=failures,
    gate='pass' if records and not failures else 'pending-or-failed',
    completeness='not asserted; independent procedural and recall review required'), indent=2))
raise SystemExit(0 if records and not failures else 1)
