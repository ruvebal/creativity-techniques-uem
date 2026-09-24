"""Narrow geometric-procedure fidelity gate; NEVER general procedure approval."""
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from pipeline import OUT, connect, digest, now, save
from epub_order_canary import normalized

FRAGMENTS=['lat'+str(i).zfill(7) for i in (411,412,413,414,415,416,417,418,419,420,422,423)]
LABELS=['1','2','3','4a','4b','5','6']


def check_elements(recorded, fresh, live_nodes):
    if [e['epub_fragment'] for e in recorded]!=FRAGMENTS or [e['epub_fragment'] for e in fresh]!=FRAGMENTS:
        raise ValueError('Missing, duplicate or reordered source fragments')
    used=set()
    labels=[]
    for old,new in zip(recorded,fresh):
        if old['source_text']!=new['source_text'] or old['image_refs']!=new['image_refs']:
            raise ValueError('Source witness changed')
        text=new['source_text']
        if not text.strip():
            if old['ahmes_matches'] or not new['image_refs']:
                raise ValueError('Invalid image-only element')
            continue
        if len(old['ahmes_matches'])!=1:
            raise ValueError('Ambiguous or missing Ahmes alignment')
        node=old['ahmes_matches'][0]
        identifier=node['node_id']
        if identifier in used or identifier not in live_nodes:
            raise ValueError('Duplicate or absent live node')
        used.add(identifier)
        live=live_nodes[identifier]
        if live['block_type']!='text' or live.get('block_subtype') in ('caption','footnote'):
            raise ValueError('Non-procedure block type')
        if normalized(live['markdown_content'])!=normalized(text):
            raise ValueError('Live Ahmes text differs from original')
        match=re.match(r'^(\d+[a-z]?)\.\s',text)
        if match: labels.append(match[1])
    if labels!=LABELS:
        raise ValueError('Missing, duplicate or unexpected step labels')
    return dict(text_nodes=len(used),step_labels=labels,source_order_verified=True)


def main():
    witness_path=OUT/'review'/'epub-order-canary.json'
    raw=witness_path.read_bytes()
    witness=json.loads(raw)
    source=Path(witness['source_file'])
    if digest(source.read_bytes())!=witness['source_sha256']:
        raise ValueError('Source hash changed')
    # This is an allowlisted, previously inspected section, not a list classifier.
    if witness['epub_member']!='LateralThinking/xhtml/chapter007.html':
        raise ValueError('Unsupported source section')
    with zipfile.ZipFile(source) as archive:
        member=archive.read(witness['epub_member'])
        if digest(member)!=witness['member_sha256']: raise ValueError('Member hash changed')
        fresh=[]
        for e in ET.fromstring(member).iter():
            if e.get('id') in FRAGMENTS:
                fresh.append(dict(epub_fragment=e.get('id'),source_text=''.join(e.itertext()),
                                  image_refs=[i.get('src') for i in e.iter() if i.tag.rsplit('}',1)[-1]=='img']))
    with connect(witness['extraction_db']) as conn:
        live={r['node_id']:dict(r) for r in conn.execute('SELECT * FROM fission_node')}
    result=check_elements(witness['elements'],fresh,live)
    prose_raw=(OUT/'review'/'procedure-quote-gates.json').read_bytes()
    prose=json.loads(prose_raw)
    if prose['witness_sha256']!=digest(raw): raise ValueError('Stale prose-gate audit')
    save(OUT/'review'/'structured-fidelity.json',dict(time=now(),publication_allowed=False,
        scope='single inspected geometric-figure procedure; NOT a general list verifier',
        witness_sha256=digest(raw),prose_audit_sha256=digest(prose_raw),
        fidelity=result,prose_refusals_preserved=prose['summary']['refused'],
        gates=dict(text_fidelity=True,source_sequence=True,procedure_completeness='pending-independent-review',
                   image_completeness='separate-visual-review',bibliography=False,printed_locator=False,
                   teaching_approval=False),procedure_approved=False))
    print(json.dumps(result))


if __name__=='__main__': main()
