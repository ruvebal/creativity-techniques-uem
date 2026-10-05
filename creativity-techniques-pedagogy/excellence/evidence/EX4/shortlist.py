import json, os, sys
from rights import rights
W='/Users/ruvebal/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem-integration-excellence-4/creativity-techniques-pedagogy/excellence/curation'
DECKS={'U1':'u-1-introduction-creativity','U2':'u-2-idea-generation-selection','U3':'u-3-development-solutions','ML-CPA':'ml-creative-process-analysis'}
plan=json.load(open('plan.json')); meta=json.load(open('meta.json'))
vision=json.load(open('vision.json')) if os.path.exists('vision.json') else {}
out={}
for unit,slides in plan.items():
    rows=[]; L=[f"# {unit} image shortlist — PHASE-EX4 (private)\n",
      "Private curation record (not published). Rights fields read from the Wikimedia Commons file page via the API (`imageinfo.extmetadata`: Artist, LicenseShortName, LicenseUrl, DateTimeOriginal), not from search snippets; author death years are standard biographical dates. EU term = author death year + 70 < 2026, or the holder's licence. Under AUTOPILOT §0 every source is usable; doubts set `rights_status: flagged`.",
      "Discovery: Wikimedia Commons search API (incl. Met Open Access, Rijksmuseum, NGA, NYPL, LoC/NASA mirrors) and the existing media-prospector indexes (read only).",
      "Fit score: llama3.2-vision description compared with the brief by the curator (1–5); bind only ≥ 4.\n"]
    for sid,s in slides.items():
        L.append(f"## `{sid}`\n\n**Brief:** {s['brief']}\n")
        L.append("| # | Candidate | Author (d.) | Licence | EU term | rights_status | Fit | Note |\n|---|---|---|---|---|---|---|---|")
        for i,t in enumerate(s['c'],1):
            m=meta[t]; r=rights(t,m); v=vision.get(f"{unit}|{sid}|{t}",{})
            dy=r['author_death_year'] or '—'
            eu='ok' if r['rights_status']=='ok' else 'doubt'
            fit=v.get('score','pending')
            note=(v.get('note') or '').replace('|','/')
            L.append(f"| {i} | [{t[5:]}]({m['page']}) · [thumb]({m['thumb']}) | {r['author']} ({dy}) | {r['licence']} | {eu} | {r['rights_status']}{(': '+'; '.join(r['flag_reasons'])) if r['flag_reasons'] else ''} | {fit} | {note} |".replace('\n',' '))
            rows.append(dict(slide_id=sid,brief=s['brief'],rank=i,title=t,canonical_source_url=m['page'],source_file_url=m['url'],thumb=m['thumb'],width=m['w'],height=m['h'],commons_licence=m['licence'],commons_artist=m['artist'],date=m['date'],**{k:v_ for k,v_ in r.items()},vision=v))
        L.append("")
    open(f"{W}/{DECKS[unit]}-SHORTLIST.md",'w').write("\n".join(L)+"\n")
    out[unit]=rows
json.dump(out,open(f"{W}/shortlists.json",'w'),indent=1,ensure_ascii=False)
print('written')
