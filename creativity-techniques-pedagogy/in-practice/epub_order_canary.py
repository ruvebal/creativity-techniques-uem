"""Source-order witness for one EPUB section; private, no quotation promotion."""
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from pipeline import OUT, connect, digest, now, save


def normalized(text):
    return re.sub(r'\s+', ' ', text).strip()


def validate_alignment(rows):
    if len(rows)!=12:
        raise ValueError('Unexpected source section shape')
    if len({r['epub_fragment'] for r in rows})!=len(rows):
        raise ValueError('Duplicate source fragment')
    textual=[r for r in rows if r['source_text'].strip()]
    if len(textual)!=11 or any(len(r['ahmes_matches'])!=1 for r in textual):
        raise ValueError('Missing or ambiguous source-to-Ahmes alignment')
    ids=[]
    for row in textual:
        node=row['ahmes_matches'][0]
        if normalized(row['source_text'])!=normalized(node['markdown_content']):
            raise ValueError('Source text mismatch')
        ids.append(node['node_id'])
    if len(set(ids))!=len(ids):
        raise ValueError('Reused Ahmes node')


def main():
    packet=json.loads((OUT/'context-sample-v2'/'lateral-packet.json').read_text())
    coverage=json.loads((OUT/'coverage'/(packet['source_sha256']+'.json')).read_text())
    source=Path(coverage['document']['path'])
    if digest(source.read_bytes()) != packet['source_sha256']:
        raise ValueError('Source hash changed')
    member='LateralThinking/xhtml/chapter007.html'
    with zipfile.ZipFile(source) as archive:
        raw=archive.read(member)
    root=ET.fromstring(raw)
    with connect(packet['extraction_db']) as conn:
        nodes=[dict(r) for r in conn.execute('SELECT rowid AS insertion_order,* FROM fission_node ORDER BY rowid')]
    lookup={}
    for node in nodes:
        lookup.setdefault(normalized(node['markdown_content'] or ''),[]).append(node)
    rows=[]
    for element in root.iter():
        identifier=element.get('id','')
        if not identifier.startswith('lat') or not identifier[3:].isdigit():
            continue
        if not 411 <= int(identifier[3:]) <= 423 or element.tag.rsplit('}',1)[-1]!='p':
            continue
        text=''.join(element.itertext())
        rows.append(dict(epub_fragment=identifier,source_text=text,
                         original_element=ET.tostring(element,encoding='unicode'),
                         image_refs=[e.get('src') for e in element.iter() if e.tag.rsplit('}',1)[-1]=='img'],
                         ahmes_matches=lookup.get(normalized(text),[]) if text.strip() else [],
                         alignment_rule='exact Unicode text after whitespace collapse only'))
    validate_alignment(rows)
    report=dict(time=now(),publication_allowed=False,source_sha256=packet['source_sha256'],
                source_file=str(source),epub_member=member,member_sha256=digest(raw),
                extraction_db=packet['extraction_db'],elements=rows,
                approved=False,printed_page_verified=False,
                purpose='source-order inspection; not a semantic-quote replacement')
    save(OUT/'review'/'epub-order-canary.json',report)
    print(json.dumps([dict(fragment=r['epub_fragment'],matches=[dict(node_id=n['node_id'],rowid=n['insertion_order']) for n in r['ahmes_matches']],images=r['image_refs']) for r in rows],indent=2))


if __name__=='__main__': main()
