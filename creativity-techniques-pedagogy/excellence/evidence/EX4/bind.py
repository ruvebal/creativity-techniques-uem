import json, re, sys
from rights import rights, LICURL
from choices import S, BRIEF_EDITS
W='/Users/ruvebal/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem-integration-excellence-4'
DECK={'U1':'docs/tracks/en/uem/2627-ct/u-1-introduction-creativity','U2':'docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection','U3':'docs/tracks/en/uem/2627-ct/u-3-development-solutions','ML-CPA':'docs/tracks/en/uem/2627-ml/creative-process-analysis'}
PROJ={'U1':'tc','U2':'tc','U3':'tc','ML-CPA':'ml'}
plan=json.load(open('plan.json')); meta=json.load(open('meta.json')); vis=json.load(open('vision_raw.json'))
regp=f'{W}/creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json'
reg=json.load(open(regp)); old={a['asset_id']:a for a in reg['assets']}
records={}
for unit,slides in plan.items():
    p=f"{W}/{DECK[unit]}/data/content.json"
    d=json.loads(re.sub(r'^---[\s\S]*?---\s*','',open(p).read()))
    by={s['slide_id']:s for s in d['slides']}
    for sid in slides:
        s=by[sid]; brief=BRIEF_EDITS.get((unit,sid), slides[sid]['brief'])
        s['image_brief']=brief
        scores,chosen,alt=S[(unit,sid)]
        if chosen and scores[chosen][0]>=4:
            aid='wikimedia:'+chosen
            s['asset_id']=aid; s['background_kind']='curated'
            m=meta[chosen]; r=rights(chosen,m)
            prev=old.get(aid,{})
            rec=records.get(aid) or dict(
                asset_id=aid, assignments=[], title=brief.split(':')[0].strip(),
                raw_title=prev.get('raw_title') or chosen,
                alt_text=alt, author=r['author'], author_death_year=r['author_death_year'],
                licence=r['licence'], licence_url=LICURL.get(r['licence'], 'https://creativecommons.org/publicdomain/mark/1.0/'),
                canonical_source_url=m['page'], source_file_url=m['url1920'], provider='wikimedia_commons',
                eu_term_ok=not any('EU term' in x or 'death year' in x for x in r['flag_reasons']),
                eu_term_reason=r['eu_term_reason'] if r['rights_status']=='ok' else ('; '.join(r['flag_reasons']) + (' — ' + r['rights_note'] if r['rights_note'] and r['rights_note'] not in '; '.join(r['flag_reasons']) else '')),
                rights_status=r['rights_status'], flag_reason='; '.join(r['flag_reasons']) or None,
                commons_licence=m['licence'], commons_artist=m['artist'], date=m['date'],
                cropped=False, rights_checked_on='2026-10-05',
                rights_source='Commons API imageinfo extmetadata (Artist, LicenseShortName, LicenseUrl, DateTimeOriginal); death years: standard biographical dates',
                approved_by='autopilot (final review pending)',
                brief=brief, vision_fit_score=scores[chosen][0], vision_model='qwen3.8:27b (think:false)',
                vision_description=vis[f'{unit}|{sid}|{chosen}']['description'],
                origin=f'EX4 autopilot pick for {unit} {sid}')
            if prev.get('origin'): rec['origin']=prev['origin'] if 'EX4' in prev['origin'] or 'EX3' not in prev['origin'] else prev['origin']+'; EX4: re-briefed and vision-checked'
            a={'project_id':PROJ[unit],'unit_id':unit}
            if a not in rec['assignments']: rec['assignments'].append(a)
            records[aid]=rec
        else:
            s.pop('asset_id',None); s.pop('media_slot_id',None); s['background_kind']='diagram'
    open(p,'w').write('---\nlayout: null\n---\n'+json.dumps(d,indent=2,ensure_ascii=False)+'\n')
reg['assets']=list(records.values())
reg['note']=reg['note'].split(' raw_title is')[0]+" Every bound asset has a record here with raw_title (A6/F3). rights_status here is the curator's verdict: 'flagged' always wins over rightsVerdict at rehydration. EX4 (2026-10-05): picks checked locally with a vision model and recorded in PHASE-EX4-REPORT.md."
json.dump(reg,open(regp,'w'),indent=2,ensure_ascii=False); open(regp,'a').write('\n')
from collections import Counter
print(len(records),'assets;',Counter(r['rights_status'] for r in records.values()))
