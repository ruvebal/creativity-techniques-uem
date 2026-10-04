"""Read-only comparison of Creative Confidence witnesses; no canonical promotion."""
import json
from collections import Counter
from pathlib import Path
from pipeline import OUT, connect, digest, now, save


def main():
    inventory=json.loads((OUT/'inventory.json').read_text())
    docs=[d for d in inventory['documents'] if d['source_sha256'].startswith('64e9e459')]
    hashes={d['source_sha256'] for d in docs}
    if len(hashes)!=1: raise ValueError('Ambiguous source')
    sha=next(iter(hashes))
    for d in docs:
        if digest(Path(d['path']).read_bytes())!=sha: raise ValueError('Changed book')
    vaults=[]
    for db in sorted(set(p for d in docs for p in d['extraction_dbs'])):
        with connect(db) as conn:
            nodes=[dict(r) for r in conn.execute('SELECT * FROM fission_node')]
            sources=[dict(r) for r in conn.execute('SELECT * FROM source')]
            metadata=[dict(r) for r in conn.execute('SELECT * FROM metadata')]
            anchors=[dict(r) for r in conn.execute('SELECT * FROM anchor_spatial')]
        # UUID equality and text equality are separate comparisons.
        keys=[digest(json.dumps([n.get(k) for k in ('markdown_content','block_type','block_subtype')],
                               ensure_ascii=False).encode()) for n in nodes]
        vaults.append(dict(db=db,source_rows=sources,metadata_rows=metadata,nodes=nodes,
                          spatial_anchors=anchors,content_keys=keys))
    if len(vaults)!=2: raise ValueError('Expected two vaults')
    left,right=vaults
    lc,rc=Counter(left['content_keys']),Counter(right['content_keys'])
    differences=[]
    for v,other in ((left,rc),(right,lc)):
        remainder=Counter(v['content_keys'])-other
        unique=[]
        for n,k in zip(v['nodes'],v['content_keys']):
            if remainder[k]>0:
                unique.append(n); remainder[k]-=1
        differences.append(dict(db=v['db'],node_count=len(v['nodes']),
                                unmatched_content_nodes=unique))
    shared_ids=set(n['node_id'] for n in left['nodes']) & set(n['node_id'] for n in right['nodes'])
    result=dict(time=now(),publication_allowed=False,source_sha256=sha,
                shared_node_ids=len(shared_ids),shared_content_occurrences=sum((lc&rc).values()),
                differences=differences,vaults=vaults,canonical_vault=None,
                status='comparison-only; source identity, content and locator adjudication pending')
    save(OUT/'review'/'creative-confidence-vault-comparison.json',result)
    print(json.dumps(dict(shared_ids=len(shared_ids),shared_content=result['shared_content_occurrences'],
                          vaults=[dict(db=d['db'],nodes=d['node_count'],unmatched=len(d['unmatched_content_nodes'])) for d in differences])))

if __name__=='__main__': main()
