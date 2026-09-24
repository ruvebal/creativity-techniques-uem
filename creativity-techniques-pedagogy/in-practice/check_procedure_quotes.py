"""Audit existing prose quotation gate against a source-ordered procedure."""
import dataclasses
import json
from pathlib import Path
from pipeline import OUT, extract_quote, save, digest, now
from epub_order_canary import validate_alignment


def main():
    path=OUT/'review'/'epub-order-canary.json'
    raw=path.read_bytes()
    witness=json.loads(raw)
    validate_alignment(witness['elements'])
    if digest(Path(witness['source_file']).read_bytes())!=witness['source_sha256']:
        raise ValueError('Source hash changed')
    results=[]
    for element in witness['elements']:
        if not element['source_text'].strip(): continue
        node=element['ahmes_matches'][0]
        # Do not permit rowid joining after the demonstrated source-order defect.
        quote=dataclasses.asdict(extract_quote(Path(witness['extraction_db']),node['node_id'],max_hops=0))
        if quote.get('node_ids')!=[node['node_id']]:
            raise ValueError('Unexpected expansion beyond the target node')
        results.append(dict(fragment=element['epub_fragment'],node_id=node['node_id'],result=quote))
    summary=dict(nodes=len(results),refused=sum(not r['result']['ok'] for r in results),
                 emitted=sum(bool(r['result']['ok']) for r in results),
                 boundary_complete=sum(r['result']['ok'] and not r['result'].get('truncated_start')
                     and not r['result'].get('truncated_end') for r in results))
    save(OUT/'review'/'procedure-quote-gates.json',dict(time=now(),publication_allowed=False,
        source_sha256=witness['source_sha256'],witness_sha256=digest(raw),
        settings=dict(max_hops=0,force_through_junk=False,use_llm_judge=False),
        summary=summary,results=results,procedure_approved=False,
        limitation='Per-node prose gate, not a complete structured-procedure quotation gate'))
    print(json.dumps(summary))


if __name__=='__main__': main()
