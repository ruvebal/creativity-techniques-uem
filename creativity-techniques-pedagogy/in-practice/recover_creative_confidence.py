"""Single-source recovery using the documented private working-vault decision."""
import fcntl
import json
import os
from pathlib import Path
from pipeline import OUT, connect, digest, now, save, prepare, scan, CLASSIFICATION_GATE

SHA='64e9e459427a6c50ebc2e3a45183218a09a189dbe3bf74d60ed3eb98d3f8cecc'
SUFFIX='_2013_crown_business_64e9e459/extract/extraction.db'


def main():
    locks=[]
    for name in ('pipeline.lock','review.lock'):
        lock=(OUT/name).open('a')
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        locks.append(lock)
    report_raw=(OUT/'review'/'creative-confidence-vault-comparison.json').read_bytes()
    comparison=json.loads(report_raw)
    if comparison['source_sha256']!=SHA: raise ValueError('Wrong comparison')
    choices=[v for v in comparison['vaults'] if v['db'].endswith(SUFFIX)]
    if len(choices)!=1: raise ValueError('Unresolved selected witness')
    selected=choices[0]
    inv=json.loads((OUT/'inventory.json').read_text())
    docs=[d for d in inv['documents'] if d['source_sha256']==SHA]
    if not docs: raise ValueError('Source missing from inventory')
    for d in docs:
        if digest(Path(d['path']).read_bytes())!=SHA: raise ValueError('Changed source')
    db=selected['db']
    with connect(db) as c:
        hashes={r['file_hash'] for r in c.execute('SELECT * FROM source')}
        nodes=[dict(r) for r in c.execute('SELECT * FROM fission_node')]
    fields=('node_id','document_id','markdown_content','original_hash','block_type','block_subtype')
    key=lambda n: tuple(n.get(k) for k in fields)
    if hashes!={SHA} or sorted(map(key,nodes))!=sorted(map(key,selected['nodes'])):
        raise ValueError('Selected witness changed; re-adjudicate')
    checkpoint=OUT/'prepared'/(SHA+'.json')
    if checkpoint.exists() and json.loads(checkpoint.read_text()).get('db')!=db:
        raise ValueError('Preparation uses a different witness')
    doc=dict(docs[0],extraction_dbs=[db],working_vault_decision='CREATIVE-CONFIDENCE-VAULT-REVIEW.md')
    receipt=dict(pid=os.getpid(),started_at=now(),stage='preparing',source_sha256=SHA,
                 selected_db=db,comparison_sha256=digest(report_raw),publication_allowed=False)
    destination=OUT/'recovery'/'process.json'
    save(destination,receipt)
    try:
        prepare(doc) # Existing sanctioned enrichment + dry-run/live injection gates.
        doc['preparation_state']='prepared'
        save(OUT/'recovery'/'creative-confidence-document.json',doc)
        receipt.update(stage='scanning'); save(destination,receipt)
        coverage=OUT/'coverage'/(SHA+'.json')
        if coverage.exists():
            prior=json.loads(coverage.read_text())
            if prior.get('classification_gate')!=CLASSIFICATION_GATE or prior.get('document',{}).get('extraction_dbs')!=[db]:
                raise ValueError('Existing coverage needs review before replacement')
        else:
            scan(doc)
        receipt.update(stage='awaiting-review',finished_at=now(),
                       next='Verify new records, refresh membership/active export and coverage ledgers.')
    except Exception as exc:
        receipt.update(stage='failed',finished_at=now(),error=str(exc))
        raise
    finally:
        save(destination,receipt)
        save(OUT/'recovery'/('attempt-'+str(os.getpid())+'.json'),receipt)


if __name__=='__main__': main()
