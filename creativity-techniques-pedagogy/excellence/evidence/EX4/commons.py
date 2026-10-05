import json, sys, urllib.request, urllib.parse, re, html
UA = {'User-Agent': 'UEM-teaching-deck-curation/1.0 (educational; contact ruvebal@crea-comm.net)'}
API = 'https://commons.wikimedia.org/w/api.php'
def get(params):
    params = {**params, 'format': 'json', 'formatversion': 2}
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=60))
def strip(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',s or ''))).strip()
def info(titles):
    d = get({'action':'query','titles':'|'.join(titles),'prop':'imageinfo','iiprop':'url|size|extmetadata|mime','iiurlwidth':640})
    out=[]
    for p in d['query']['pages']:
        if 'imageinfo' not in p: continue
        ii=p['imageinfo'][0]; m=ii.get('extmetadata',{})
        g=lambda k: strip(m.get(k,{}).get('value',''))
        out.append(dict(title=p['title'], url=ii['url'], thumb=ii.get('thumburl'), page=ii['descriptionurl'], w=ii['width'], h=ii['height'], mime=ii['mime'],
            artist=g('Artist'), licence=g('LicenseShortName'), licence_url=g('LicenseUrl'), date=g('DateTimeOriginal'), desc=g('ImageDescription')[:300], credit=g('Credit')[:150], restrictions=g('Restrictions'), copyrighted=g('Copyrighted')))
    return out
def search(q, n=8):
    d = get({'action':'query','list':'search','srsearch':q,'srnamespace':6,'srlimit':n})
    titles=[r['title'] for r in d['query']['search']]
    return info(titles) if titles else []
if __name__=='__main__':
    for q in sys.argv[1:]:
        print('#### ',q)
        for r in search(q):
            print(f"- {r['title']} | {r['w']}x{r['h']} | {r['licence']} | {r['artist'][:60]} | {r['date'][:30]} | {r['desc'][:140]}")
