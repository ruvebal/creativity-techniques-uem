"""Private bounded candidate from a verified source-order witness, not approval."""
import json
import posixpath
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from pipeline import OUT, connect, digest, now, save
from epub_order_canary import normalized, validate_alignment


def main():
    witness=json.loads((OUT/'review'/'epub-order-canary.json').read_text())
    validate_alignment(witness['elements'])
    source=Path(witness['source_file'])
    if digest(source.read_bytes())!=witness['source_sha256']:
        raise ValueError('Source changed')
    db=Path(witness['extraction_db'])
    image_index={}
    for path in (db.parent/'images').glob('*'):
        if path.is_file(): image_index.setdefault(digest(path.read_bytes()),[]).append(str(path))
    with connect(str(db)) as conn:
        nodes=[dict(r) for r in conn.execute('SELECT * FROM fission_node')]
        lookup={}
        for node in nodes: lookup.setdefault(normalized(node['markdown_content'] or ''),[]).append(node)
        with zipfile.ZipFile(source) as archive:
            raw=archive.read(witness['epub_member'])
            if digest(raw)!=witness['member_sha256']: raise ValueError('EPUB member changed')
            root=ET.fromstring(raw)
            rows=[]
            images=[]
            for element in root.iter():
                identifier=element.get('id','')
                if not identifier.startswith('lat') or not identifier[3:].isdigit(): continue
                if not 405<=int(identifier[3:])<=435 or element.tag.rsplit('}',1)[-1] not in ('p','h3'): continue
                text=''.join(element.itertext())
                matches=lookup.get(normalized(text),[]) if text.strip() else []
                rows.append(dict(fragment=identifier,original_xml=ET.tostring(element,encoding='unicode'),
                                 source_text=text,ahmes_matches=matches,
                                 alignment='unique' if len(matches)==1 else 'ambiguous-or-unmatched'))
                for img in element.iter():
                    if img.tag.rsplit('}',1)[-1]!='img': continue
                    member=posixpath.normpath(posixpath.join(posixpath.dirname(witness['epub_member']),img.get('src')))
                    checksum=digest(archive.read(member))
                    images.append(dict(epub_member=member,sha256=checksum,
                                       ahmes_image_files=image_index.get(checksum,[])))
        # Ambiguous lexical matches remain candidates, never supporting evidence.
        ids={row['ahmes_matches'][0]['node_id'] for row in rows if row['alignment']=='unique'}
        evidence={}
        for table_row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'"):
            table=table_row[0].replace('"','""')
            if 'node_id' in [r[1] for r in conn.execute('PRAGMA table_info("'+table+'")')]:
                evidence[table_row[0]]=[dict(r) for r in conn.execute('SELECT * FROM "'+table+'" WHERE node_id IN ('+','.join('?' for _ in ids)+')',list(ids))]
    record=dict(schema='in-practice-procedure-candidate/v1',
        id='urn:in-practice:procedure:'+digest((witness['source_sha256']+'chapter007:lat0000405-435').encode())[:24],
        name='Geometric figures: generating alternative descriptions',name_origin='editorial label',
        created_at=now(),publication_allowed=False,status='assembled-awaiting-independent-review',
        source_sha256=witness['source_sha256'],source_file=str(source),extraction_db=str(db),
        epub_member=witness['epub_member'],member_sha256=witness['member_sha256'],
        source_elements=rows,ahmes_records=evidence,images=images,
        procedure_witness='runtime/review/epub-order-canary.json',
        interpretation=dict(original_application='classroom descriptions of geometric figures',
                            method='generate and discuss alternative descriptions; optional collection of written responses',
                            duration=None,age=None,classroom_adaptation=None),
        review=dict(source_order='verified against EPUB DOM for this bounded section',
                    verbatim_quote_approval=False,printed_page_verified=False,
                    bibliography_approved=False,procedure_approved=False,
                    completeness='procedure plus preceding rationale and first material example only; not whole chapter'),
        semantics={'type':'http://www.cidoc-crm.org/cidoc-crm/E73_Information_Object',
                   'proposed_local_tags':['divergent-thinking','visual-thinking','reframing']})
    save(OUT/'procedures'/'lateral-geometric-figures.json',record)
    print(json.dumps(dict(source_elements=len(rows),unique_text_matches=sum(r['alignment']=='unique' for r in rows),
                          images=len(images),images_with_unique_hash_match=sum(len(i['ahmes_image_files'])==1 for i in images),
                          approved=False)))


if __name__=='__main__': main()
