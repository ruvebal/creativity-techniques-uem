"""Read-only scope accounting; saves private witnesses, never approves exclusions."""
import json
import re
from pathlib import Path
from pipeline import OUT, connect, digest, now, save


def main():
    raw = (OUT / 'inventory.json').read_bytes()
    inventory = json.loads(raw)
    groups = {}
    for document in inventory['documents']:
        groups.setdefault(document['source_sha256'], []).append(document)
    entries = []
    for sha, documents in sorted(groups.items()):
        files = [dict(path=d['path'], hash_matches=digest(Path(d['path']).read_bytes()) == sha)
                 for d in documents]
        if not all(f['hash_matches'] for f in files):
            raise ValueError('Source changed: ' + sha)
        coverage = OUT / 'coverage' / (sha + '.json')
        exclusion = OUT / 'exclusions' / (sha + '.json')
        conflict = coverage.exists() and exclusion.exists()
        state = 'scanned' if coverage.exists() else 'excluded' if exclusion.exists() else 'unaccounted'
        receipt = coverage if coverage.exists() else exclusion if exclusion.exists() else None
        evidence = []
        if documents[0]['kind'] == 'article-or-review':
            for db in sorted(set(p for d in documents for p in d['extraction_dbs'])):
                with connect(db) as conn:
                    rows = conn.execute('SELECT * FROM fission_node').fetchall()
                    # These are genre witnesses, not procedure evidence or a recall audit.
                    matches = [dict(r) for r in rows if re.search(
                        r'journal|issn|doi|to cite this article|book review|volume|abstract',
                        r['markdown_content'] or '', re.I)]
                evidence.append(dict(extraction_db=db, nodes_examined=len(rows),
                                     matching_nodes=len(matches), witnesses=matches[:12]))
        entries.append(dict(source_sha256=sha, files=files, state=state,
                            conflicting_receipts=conflict,
                            exclusion_receipt=json.loads(exclusion.read_text()) if exclusion.exists() else None,
                            receipt=str(receipt) if receipt else None,
                            receipt_sha256=digest(receipt.read_bytes()) if receipt else None,
                            inventory_kind=documents[0]['kind'], genre_witnesses=evidence,
                            exclusion_approved=False if state == 'excluded' else None))
    summary = dict(files=sum(len(e['files']) for e in entries), distinct_sources=len(entries),
                   scanned=sum(e['state']=='scanned' for e in entries),
                   excluded=sum(e['state']=='excluded' for e in entries),
                   unaccounted=sum(e['state']=='unaccounted' for e in entries),
                   conflicting_receipts=sum(e['conflicting_receipts'] for e in entries),
                   duplicate_hash_groups=sum(len(e['files'])>1 for e in entries))
    save(OUT/'review'/'source-scope-audit.json', dict(time=now(), publication_allowed=False,
         inventory_sha256=digest(raw), summary=summary, sources=entries,
         limitations=['Accounting is not exercise recall.',
                      'Genre witnesses require adjudication; exclusions are not approved.',
                      'Two ingestion failures remain separately tracked.']))
    print(json.dumps(summary))


if __name__ == '__main__':
    main()
