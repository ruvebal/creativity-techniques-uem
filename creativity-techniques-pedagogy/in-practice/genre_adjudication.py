"""Preserve explicitly inspected genre witnesses; no automatic exercise approval."""
import json
from pathlib import Path
from pipeline import OUT, connect, digest, now, save

# Operator selections from complete Ahmes nodes inspected on 2026-09-28.
DECISIONS = {
 '15368c98': ('journal-article', ['157eb20b-f339-5d89-8241-efa4503340f0']),
 'a80df6c3': ('journal-article', ['d409edcc-0aad-5e66-8643-68217b00c0ca']),
 'af5dfd8d': ('accepted-journal-manuscript', ['c9386dd0-6a51-5a2f-918e-c00c0973e05f', 'f9f02f7b-9674-5c9a-a5d5-1bc4480f9d56']),
 'b0dd2ace': ('publishing-guidance-nonmonograph', ['de7cc5e7-378d-5508-b7e2-6b1e6e320b01', '7e13dadb-ce07-56c0-91ed-7738ff81b3ab']),
 'b31bf6e2': ('journal-article', ['1ef523d5-154c-5468-92d2-2e409e8a7c4d', '60661777-30a4-5dce-aef3-a75552b9172d']),
 'b9edc7f4': ('journal-article', ['ee493e35-775a-587f-bf69-c7d1098e9539', '9b3cb210-4420-52b8-b64b-0e98a0a2ba32']),
 'bf8a7795': ('journal-book-review', ['26c78557-0be0-5555-9c20-9b87903a7b3b', '197660c7-f981-5bec-89dc-e395ad383183']),
 'c2d88ecc': ('journal-article', ['1d634ba4-1d8c-51bd-8114-f2286a95734f']),
 'd8c46e13': ('journal-article', ['0c44a0ec-7804-5299-b973-49d1b7f6e0f2']),
}

def main():
    inventory_raw=(OUT/'inventory.json').read_bytes()
    inventory=json.loads(inventory_raw)
    decisions=[]
    for prefix,(genre,ids) in DECISIONS.items():
        matches=[d for d in inventory['documents'] if d['source_sha256'].startswith(prefix)]
        if len(matches)!=1: raise ValueError('Ambiguous identity: '+prefix)
        d=matches[0]
        if digest(Path(d['path']).read_bytes())!=d['source_sha256']: raise ValueError('Source changed')
        if len(d['extraction_dbs'])!=1: raise ValueError('Ambiguous vault')
        db=d['extraction_dbs'][0]
        with connect(db) as conn:
            witnesses=[]
            for identifier in ids:
                rows=conn.execute('SELECT * FROM fission_node WHERE node_id=?',(identifier,)).fetchall()
                if len(rows)!=1: raise ValueError('Missing/duplicate genre witness')
                witnesses.append(dict(rows[0]))
        decisions.append(dict(source_sha256=d['source_sha256'],source_file=d['path'],
            extraction_db=db, original_kind=d['kind'], reviewed_genre=genre,
            witnesses=witnesses, decision='retain-outside-monograph-extraction-scope',
            exercise_absence_asserted=False, bibliography_approved=False,
            supplemental_practice_review_recommended=prefix in ('af5dfd8d','b9edc7f4'),
            genre_correction=prefix=='b0dd2ace'))
    save(OUT/'review'/'genre-adjudication.json',dict(time=now(),publication_allowed=False,
        inventory_sha256=digest(inventory_raw), reviewer='Codex; direct Ahmes genre-witness inspection',
        sources=decisions, limitations=['Not a whole-document exercise audit.',
        'Publishing-guidance format remains an inference from extracted headings; no visual format claim.',
        'Bibliographic and exercise acceptance gates are independent.']))
    print(json.dumps(dict(adjudicated=len(decisions),genre_corrections=1,supplemental_practice_leads=2)))

if __name__=='__main__': main()
