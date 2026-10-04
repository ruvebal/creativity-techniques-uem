"""Private single-node EPUB locator; preserves rejection and never approves."""
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from pipeline import OUT, connect, digest, now, save
from epub_order_canary import normalized


def main():
    record_path = OUT/'records/77dfbda4161c2f721697c5e5.json'
    record_raw = record_path.read_bytes()
    record = json.loads(record_raw)
    prov = record['provenance']
    sources = [s for s in prov['sources'] if s['file_hash']==record['source_sha256']]
    if len(sources)!=1:
        raise ValueError('Source identity ambiguous')
    source = Path(sources[0]['original_observed_path'])
    if digest(source.read_bytes()) != record['source_sha256']:
        raise ValueError('Source hash changed')
    with connect(prov['extraction_db']) as conn:
        rows = [dict(r) for r in conn.execute(
            'SELECT * FROM fission_node WHERE node_id=?', (prov['target_node_id'],))]
    if len(rows)!=1:
        raise ValueError('Missing live node')
    node=rows[0]
    saved=prov['ahmes_records']['fission_node']
    if len(saved)!=1 or any(node[k]!=saved[0][k] for k in
                           ('node_id','document_id','markdown_content','original_hash')):
        raise ValueError('Live node differs from preserved witness')
    matches=[]
    with zipfile.ZipFile(source) as z:
        for member in z.namelist():
            if not member.lower().endswith(('.html','.xhtml','.htm')):
                continue
            raw=z.read(member)
            root=ET.fromstring(raw)
            blocks=[e for e in root.iter() if e.tag.rsplit('}',1)[-1] in
                    ('p','h1','h2','h3','h4','li')]
            for i,e in enumerate(blocks):
                source_text=''.join(e.itertext())
                exact=normalized(source_text)==normalized(node['markdown_content'])
                if not exact and ''.join(source_text.split())!=''.join(node['markdown_content'].split()):
                    continue
                matches.append(dict(member=member,member_sha256=digest(raw),
                    exact_normalized_match=exact,source_text=source_text,
                    fragment=e.get('id'),block_ordinal=i,
                    context=[dict(ordinal=j,fragment=b.get('id'),
                                  tag=b.tag.rsplit('}',1)[-1],text=''.join(b.itertext()))
                             for j,b in enumerate(blocks) if max(0,i-3)<=j<=i+3]))
    if len(matches)!=1 or not matches[0]['fragment']:
        raise ValueError('Expected one uniquely anchored original-source match')
    result=dict(time=now(),record_id=record['id'],record_sha256=digest(record_raw),
                source_sha256=record['source_sha256'],source_path=str(source),
                live_node=node,extraction_db=prov['extraction_db'],matches=matches,
                existing_quote_gate=record['quote'],publication_allowed=False,
                procedure_approved=False,printed_page_verified=False,
                alignment='Exact whitespace-normalized or whitespace-removed diagnostic; inspect match flag. Not quote approval.')
    save(OUT/'review/blanks-source-locator.json',result)
    print(json.dumps({k:matches[0][k] for k in ('member','fragment','block_ordinal')}))


if __name__=='__main__':
    main()
