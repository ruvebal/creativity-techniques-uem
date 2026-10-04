"""Derive current source states without changing historical receipts."""
import json
from pathlib import Path
from datetime import datetime
from pipeline import OUT, digest, now, save


def scan_supersedes_exclusion(sha, prepared, coverage, exclusion):
    if any(r.get('source_sha256') != sha for r in (prepared, coverage)):
        return False
    doc = coverage.get('document', {})
    if doc.get('source_sha256') != sha or exclusion.get('document', {}).get('source_sha256') != sha:
        return False
    if exclusion.get('reason') != 'ingestion not verified':
        return False
    if coverage.get('state') != 'scanned' or coverage.get('classification_gate') != 'validated-ids-bisect-v1':
        return False
    expected = coverage.get('characters_expected')
    if type(expected) is not int or expected <= 0 or expected != coverage.get('characters_scanned'):
        return False
    if doc.get('preparation_state') != 'prepared' or prepared.get('db') not in doc.get('extraction_dbs', []):
        return False
    try:
        return datetime.fromisoformat(prepared['completed_at']) <= datetime.fromisoformat(coverage['time'])
    except (KeyError, ValueError, TypeError):
        return False


def main():
    audit_raw = (OUT/'review'/'source-scope-audit.json').read_bytes()
    audit = json.loads(audit_raw)
    if audit['inventory_sha256'] != digest((OUT/'inventory.json').read_bytes()):
        raise ValueError('Stale scope audit')
    rows = []
    for source in audit['sources']:
        sha = source['source_sha256']
        for file in source['files']:
            if digest(Path(file['path']).read_bytes()) != sha:
                raise ValueError('Source changed')
        bindings = {}
        receipts = {}
        for folder in ('prepared', 'coverage', 'exclusions'):
            path = OUT/folder/(sha+'.json')
            if path.exists():
                raw = path.read_bytes()
                receipts[folder] = json.loads(raw)
                bindings[folder] = dict(path=str(path), sha256=digest(raw))
        superseded = False
        if source['conflicting_receipts']:
            superseded = scan_supersedes_exclusion(sha, receipts.get('prepared', {}),
                receipts.get('coverage', {}), receipts.get('exclusions', {}))
        state = ('scanned-with-historical-exclusion' if superseded else
                 'unresolved-receipt-conflict' if source['conflicting_receipts'] else source['state'])
        rows.append(dict(source_sha256=sha, state=state, receipts=bindings,
                         historical_exclusion_superseded=superseded,
                         procedure_approved=False, genre_approval=False))
    summary = dict(sources=len(rows), superseded_exclusions=sum(r['historical_exclusion_superseded'] for r in rows),
        unresolved_conflicts=sum(r['state']=='unresolved-receipt-conflict' for r in rows),
        unscanned_exclusions=sum(r['state']=='excluded' for r in rows))
    save(OUT/'review'/'current-source-state.json', dict(time=now(), publication_allowed=False,
        scope_audit_sha256=digest(audit_raw), summary=summary, sources=rows,
        limitation='Receipt reconciliation only; scan fidelity, recall and scholarly approval remain separate.'))
    print(json.dumps(summary))


if __name__ == '__main__':
    main()
