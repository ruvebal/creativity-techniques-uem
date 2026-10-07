import json, base64, urllib.request, os, time, subprocess
plan=json.load(open('plan.json')); meta=json.load(open('meta.json'))
raw=json.load(open('vision_raw.json')) if os.path.exists('vision_raw.json') else {}
PROMPT=("Describe this image literally in 2-3 sentences: what it shows, whether it is a photograph, drawing, print, painting, "
        "diagram or document, any visible text, and whether any person's face is clearly identifiable. Do not guess names or artists.")
pid=json.load(open('/Users/ruvebal/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem/creativity-techniques-pedagogy/in-practice/runtime/process.json'))['pid']
alive=subprocess.run(['ps','-p',str(pid)],capture_output=True).returncode==0
print('in-practice pid',pid,'alive',alive); assert not alive
print(subprocess.run(['ollama','ps'],capture_output=True,text=True).stdout)
for unit,slides in plan.items():
    for sid,s in slides.items():
        for t in s['c']:
            k=f"{unit}|{sid}|{t}"
            if k in raw: continue
            img=base64.b64encode(open(meta[t]['thumbfile'],'rb').read()).decode()
            body=json.dumps({'model':'qwen3.8:27b','think':False,'prompt':PROMPT,'images':[img],'stream':False,'options':{'temperature':0.1,'num_predict':200}}).encode()
            t0=time.time()
            r=json.load(urllib.request.urlopen(urllib.request.Request('http://localhost:11434/api/generate',data=body,headers={'Content-Type':'application/json'}),timeout=600))
            raw[k]=dict(model='qwen3.8:27b (think:false)',unit=unit,slide=sid,title=t,description=r['response'].strip(),prompt_tokens=r.get('prompt_eval_count'),output_tokens=r.get('eval_count'),wall_s=round(time.time()-t0,1))
            json.dump(raw,open('vision_raw.json','w'),indent=1,ensure_ascii=False)
            print(len(raw),k[:80],raw[k]['wall_s'],flush=True)
print('DONE',len(raw))
