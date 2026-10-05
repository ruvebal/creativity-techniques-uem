"""EX5: draft speaker notes for U1-U3 masterclass and lab slides with a local model.

Local-first (LOCAL-EXECUTION.md): qwen2.5:32b-instruct via plain Ollama HTTP
(/api/generate, stream false). The prompt carries only the slide fields and the
matching public lesson section (switch-gated comments and HTML comments removed).
Facts come only from that text: every author-date cite and every number in the
output must appear in the input, otherwise the line is dropped (logged).
Drafts are written to notes-draft.json for human editing; nothing is written
into the decks by this script.

Usage (worktree root): python3 creativity-techniques-pedagogy/excellence/evidence/EX5/draft_notes.py
"""
import json, re, time, urllib.request, pathlib

ROOT = pathlib.Path.cwd()
OUT = ROOT / 'creativity-techniques-pedagogy/excellence/evidence/EX5'
MODEL = 'qwen2.5:32b-instruct'
UNITS = {
    'u-1-introduction-creativity': 'U1',
    'u-2-idea-generation-selection': 'U2',
    'u-3-development-solutions': 'U3',
}

def public_text(md):
    md = re.sub(r'\{%\s*if site\.publication[\s\S]*?\{%\s*endif\s*%\}', '', md)
    md = re.sub(r'<!--[\s\S]*?-->', '', md)
    md = re.sub(r'\{\{[^}]*\}\}', '', md)
    return md

def section(md, pattern):
    lines = md.split('\n')
    for i, line in enumerate(lines):
        m = re.match(r'^(#+)\s+(.*)$', line)
        if m and re.search(pattern, m.group(2)):
            level = len(m.group(1)); body = [line]
            for nxt in lines[i + 1:]:
                n = re.match(r'^(#+)\s', nxt)
                if n and len(n.group(1)) <= level: break
                body.append(nxt)
            return '\n'.join(body).strip()
    return ''

PROMPT = """You write speaker notes for a university teacher (Creativity Techniques, year-3 design students).
Use ONLY the facts in the SLIDE and LESSON text below. Do not add names, dates, numbers, books, quotes or examples that are not in that text.
Plain English, short sentences, the voice of a teacher talking to the class.

Output exactly these lines and nothing else:
TALK: <talking point 1>
TALK: <talking point 2>
TALK: <talking point 3, optional>
SOURCE: <the citation exactly as written in the text, e.g. (Craft 2003, 43), or: none>
DEBATE: <one question to ask the class>

SLIDE:
{slide}

LESSON:
{lesson}
"""

def generate(prompt):
    req = urllib.request.Request('http://localhost:11434/api/generate',
        data=json.dumps({'model': MODEL, 'prompt': prompt, 'stream': False,
                         'options': {'temperature': 0.2, 'num_ctx': 8192}}).encode(),
        headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)

def check(line, source_text):
    """Drop lines whose cites or numbers are not in the input."""
    for cite in re.findall(r'\(([A-Z][^()]*?\d{4}[^()]*)\)', line):
        if cite not in source_text: return f'cite not in input: ({cite})'
    for num in re.findall(r'\b\d+\b', line):
        if num not in source_text: return f'number not in input: {num}'
    return None

drafts, log = {}, []
for slug, unit in UNITS.items():
    deck = json.loads(re.sub(r'^---[\s\S]*?---\s*', '', (ROOT / f'docs/tracks/en/uem/2627-ct/{slug}/data/content.json').read_text()))
    md = public_text((ROOT / f'docs/lessons/en/creativity-techniques/{slug}/index.md').read_text())
    debate = section(md, r'^Debate')
    for s in deck['slides']:
        sid = s['slide_id']
        if s['slide_role'] == 'masterclass':
            n = sid.split('-')[1]
            lesson = section(md, rf'^{n}\s*·')
        elif s['slide_role'] == 'lab_exercise':
            n = sid.split('-')[1]
            lesson = section(md, rf'^Exercise {n}\b')
            if debate: lesson += '\n\n' + debate
        else:
            continue
        slide = {k: s.get(k) for k in ('heading', 'sentence', 'quote', 'portfolio_trace')}
        if s.get('citation'): slide['citation'] = s['citation']['label']
        slide_text = json.dumps({k: v for k, v in slide.items() if v}, ensure_ascii=False, indent=1)
        prompt = PROMPT.format(slide=slide_text, lesson=lesson or '(no lesson section found)')
        pf = OUT / 'notes-prompts' / f'{unit}-{sid}.txt'
        pf.parent.mkdir(parents=True, exist_ok=True); pf.write_text(prompt)
        t0 = time.time(); res = generate(prompt); dt = time.time() - t0
        source_text = slide_text + '\n' + lesson
        kept, dropped = [], []
        for line in res['response'].strip().split('\n'):
            line = line.strip()
            if not re.match(r'^(TALK|SOURCE|DEBATE):', line): continue
            why = check(line, source_text)
            (dropped if why else kept).append(line if not why else f'{line}  <-- {why}')
        drafts[f'{unit}/{sid}'] = {'kept': kept, 'dropped': dropped, 'lesson_found': bool(lesson)}
        log.append({'unit': unit, 'slide_id': sid, 'model': MODEL, 'prompt_file': str(pf.relative_to(ROOT)),
                    'prompt_tokens': res.get('prompt_eval_count'), 'output_tokens': res.get('eval_count'),
                    'seconds': round(dt, 1), 'dropped_lines': len(dropped)})
        print(unit, sid, res.get('prompt_eval_count'), res.get('eval_count'), f'{dt:.1f}s', 'dropped', len(dropped), flush=True)

(OUT / 'notes-draft.json').write_text(json.dumps(drafts, indent=1, ensure_ascii=False) + '\n')
(OUT / 'model-calls.json').write_text(json.dumps(log, indent=1) + '\n')
