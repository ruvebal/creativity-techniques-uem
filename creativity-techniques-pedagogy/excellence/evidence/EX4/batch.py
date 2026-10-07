import json, sys
from commons import search
qs = [l.strip() for l in open(sys.argv[1]) if l.strip()]
res = {}
for q in qs:
    try: r = search(q + ' filetype:bitmap', 8)
    except Exception as e: print('ERR', q, e); continue
    res[q] = r
    print('#### ', q)
    for x in r:
        print(f"- {x['title'][5:][:110]} | {x['w']}x{x['h']} | {x['licence']} | {x['artist'][:50]} | {x['date'][:25]}")
json.dump(res, open(sys.argv[2], 'w'), indent=1)
