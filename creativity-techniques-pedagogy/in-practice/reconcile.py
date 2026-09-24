"""Audit active candidate membership without deleting or promoting evidence."""
import collections
import json
from pathlib import Path
from pipeline import OUT, now, save, digest


def main():
    for name in ('coverage', 'coverage-spans', 'batches', 'records'):
        if not (OUT/name).is_dir():
            raise ValueError('Missing required runtime directory: '+name)
    if not list((OUT/'coverage').glob('*.json')):
        raise ValueError('No coverage receipts; refusing empty reconciliation')
    active_nodes = {}
    errors = []
    for path in (OUT/'coverage').glob('*.json'):
        coverage = json.loads(path.read_text())
        sha = coverage['source_sha256']
        if coverage.get('classification_gate') != 'validated-ids-bisect-v1':
            errors.append(dict(source=sha, reason='legacy coverage gate'))
            continue
        spans = json.loads((OUT/'coverage-spans'/(sha+'.json')).read_text())
        keys = {s['prompt_sha256'] for s in spans}
        selected = set()
        for key in keys:
            result = json.loads((OUT/'batches'/sha/(key+'.json')).read_text())
            for exercise in result['output']['exercises']:
                selected.update(exercise['node_ids'])
        active_nodes[sha] = selected
    active, superseded, unaccounted = [], [], []
    bibliography = collections.defaultdict(collections.Counter)
    found = collections.defaultdict(set)
    for path in (OUT/'records').glob('*.json'):
        raw = path.read_bytes()
        record = json.loads(raw)
        sha = record['source_sha256']
        node = record['provenance']['target_node_id']
        item = dict(record_id=record['id'], path=str(path), source_sha256=sha, node_id=node,
                    record_sha256=digest(raw))
        if sha not in active_nodes:
            unaccounted.append(item)
        elif node not in active_nodes[sha]:
            superseded.append(item)
        else:
            active.append(item)
            found[sha].add(node)
            citation = record['quote'].get('citation') or {}
            bibliography[sha]['evaluator_safe' if citation.get('evaluator_safe') is True else 'unresolved_or_unsafe'] += 1
    for sha, selected in active_nodes.items():
        missing = selected - found[sha]
        if missing:
            errors.append(dict(source=sha, reason='selected nodes missing records', nodes=sorted(missing)))
    report = dict(time=now(), publication_allowed=False, active=active,
                  superseded=superseded, unaccounted=unaccounted, errors=errors,
                  bibliography_gate_counts=dict(bibliography),
                  review_status='membership audit only; no procedure or bibliography approval')
    save(OUT/'review'/'membership-audit.json', report)
    print(json.dumps(dict(active=len(active), superseded=len(superseded),
                         unaccounted=len(unaccounted), errors=errors), indent=2))


if __name__ == '__main__':
    main()
