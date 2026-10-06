import json, re, sys
ROOT = sys.argv[1]
TPL = ROOT + '/docs/tracks/en/uem/2627-ct/{}/data/content.json'

def load(u):
    raw = open(TPL.format(u), encoding='utf-8').read()
    m = re.match(r'\A(---.*?---\s*)', raw, re.S)
    return (m.group(1) if m else ''), json.loads(raw[len(m.group(1)) if m else 0:])

def save(u, fm, d):
    open(TPL.format(u), 'w', encoding='utf-8').write(fm + json.dumps(d, indent=2, ensure_ascii=False) + '\n')

def slide(d, sid):
    return next(s for s in d['slides'] if s['slide_id'] == sid)

def set_lab(s, **kw):
    for k in ('quote', 'quote_origin', 'semantic_tags', 'citation', 'prompt'):
        s.pop(k, None)
    order = ['slide_id', 'slide_role', 'background_kind', 'heading', 'sentence', 'prompt', 'portfolio_bound',
             'portfolio_trace', 'technique_id', 'technique_ids_also', 'practises', 'timer_seconds',
             'image_brief', 'asset_id', 'media_slot_id', 'notes']
    s.update(kw)
    new = {k: s[k] for k in order if k in s}
    new.update({k: v for k, v in s.items() if k not in new})
    s.clear(); s.update(new)

# ------------------------------------------------------------------ U1
u = 'u-1-introduction-creativity'; fm, d = load(u)
set_lab(slide(d, 'lab-1'),
  heading='Exercise 1 · Alternative uses, scored on four skills',
  sentence='List as many uses for one everyday object as you can in 3 minutes, alone and in silence. Then score your list: how many uses, how many kinds, rare uses, detail.',
  prompt='Practises Masterclass 2–3: the four skills, and why a score is not the whole designer.',
  portfolio_trace='Save your list, the four scores and one sentence on your least obvious use.',
  technique_id='alternative-uses-task', practises=['masterclass-2', 'masterclass-3'], timer_seconds=180,
  image_brief="Marcel Duchamp, Fountain, 1917, in Alfred Stieglitz's photograph: a factory-made everyday object given a use nobody expected for it — the jump the alternative-uses list asks you to make.",
  notes="\n".join([
    "- Timer: 3 minutes of silent listing (the slide timer). Whole exercise about 15 minutes.",
    "- Show one everyday object or a photo (a brick, a paper clip, a shoe). Everyone lists uses alone and in silence.",
    "- Fluency: count the uses. Flexibility: group them into kinds and count the kinds.",
    "- Originality: read lists aloud in turns or post them on a shared board; mark each use nobody else wrote.",
    "- Elaboration: pick one marked use and add three concrete details.",
    "- Close: which shift between kinds gave your least obvious use? Treat the numbers as practice, not a talent verdict.",
    "Source: tests like Alternate Uses ask for as many uses of a common object as possible, and the four abilities (fluency, flexibility, originality, elaboration) are as reported in (Chen 2011, 26); the caution that such scores may say little about talent in a specific field is the same page. The steps and scoring by class pool are course wording.",
    "Ask: Your count went up with practice. Did your best idea get better too?"]))
set_lab(slide(d, 'lab-2'),
  heading='Exercise 2 · Cut-up and readymade: open, then close',
  sentence='Cut a real brief into words and draw them from an envelope. Then give an ordinary object a new title or place without changing it. Mark which moves opened options and which closed them.',
  prompt='Practises Masterclass 1 (open, then close) and the language / medium / support analysis.',
  portfolio_trace='Save the cut-up page, the readymade title and label, and your list of opening and closing moves.',
  technique_id='tzara-cut-up', technique_ids_also=['readymade-recontextualisation'], practises=['masterclass-1'], timer_seconds=1500,
  image_brief="Theo van Doesburg and Kurt Schwitters, Kleine Dada Soirée poster, 1922: printed words and letters scrambled and re-placed on the page, the kind of chance arrangement the cut-up step produces from a brief.",
  notes="\n".join([
    "- Timer: 25 minutes — about 12 for the cut-up, 8 for the readymade, 5 for naming the moves. Pairs.",
    "- Cut-up: cut the brief text into single words or short phrases; draw them one at a time; copy them in the order drawn; underline any phrase that suggests an idea and write the idea.",
    "- Readymade: do not change the object; change only its title, place or position. Write a title and a one-line label; show it to another pair and ask what they now see.",
    "- Analysis: did the change work through the language (title, label), the medium (where it is shown) or the support (the object)?",
    "- Name the moves: opening (cutting, drawing, re-placing) or closing (underlining, choosing a title).",
    "- A digital word shuffle can replace scissors.",
    "Source: classroom adaptation in course wording; no reading-list source is cited for these two procedures yet.",
    "Ask: Which single change did the most work, and was it an opening or a closing move?"]))
save(u, fm, d)

# ------------------------------------------------------------------ U2
u = 'u-2-idea-generation-selection'; fm, d = load(u)
set_lab(slide(d, 'lab-1'),
  heading='Exercise 1 · 6-3-5 brainwriting against solo writers',
  sentence='Write three ideas, pass your sheet to the left, and build on what you read. Three silent rounds, shortened from six. Some teams work alone instead — then compare the counts.',
  prompt='Practises Masterclass 1–3: generate first, count kinds as well as ideas, get past the obvious.',
  portfolio_trace='Save your sheet or solo list, your team’s two counts and the class comparison.',
  technique_id='brainwriting-635', technique_ids_also=['open-monitoring-warm-up'],
  practises=['masterclass-1', 'masterclass-2', 'masterclass-3'], timer_seconds=240,
  image_brief="Kōdō Sawaki seated in zazen, c. 1920: still, seated attention — the posture of the optional three-minute warm-up before the silent brainwriting rounds.",
  notes="\n".join([
    "- Timer: one 4-minute round (restart it for each round). Whole exercise about 20 minutes.",
    "- Optional warm-up, 3 minutes: sit comfortably and notice thoughts, sounds or sensations without holding on to any. Anyone may opt out: sit quietly, read the brief, or start early. No posture or breathing instructions.",
    "- Split the class: brainwriting teams of six (3–6 works) and solo teams of the same size, all on the same brief.",
    "- Brainwriting: three ideas per row, one per column; pass left; read, then write three new or built-on ideas. Silent.",
    "- Shortened: a team of six needs six rounds (about 30 minutes) to pass every sheet to everyone; we run 3 rounds and say so.",
    "- Solo teams: each person writes alone for the same 12 minutes; lists are pooled only at the end.",
    "- Each team removes repeats and counts different ideas (fluency) and different kinds (flexibility). Compare on the board. Keep the sheets for Exercise 2.",
    "Source: the warm-up rests on one small lab study in which open-monitoring meditation helped a divergent-thinking task (Colzato, Ozturk, and Hommel 2012, 1); that study used sessions of about 35 minutes, so the 3-minute version is untested. 6-3-5 and the solo comparison are a classroom adaptation in course wording.",
    "Ask: Which kind of team had more ideas, and more kinds? What did passing sheets do to yours?"]))
set_lab(slide(d, 'lab-2'),
  heading='Exercise 2 · Select: hits, COCD box, yellow and black hats',
  sentence='Choose in three steps: dot the strongest ideas, sort them in a now / wow / how grid, then test your top three with the yellow hat, then the black hat.',
  prompt='Practises Masterclass 4–5: role tools, and naming your selection criteria.',
  portfolio_trace='Save the dots, the grid, the yellow and black notes, and the criterion behind your pick.',
  technique_id='hits-dot-voting', technique_ids_also=['cocd-box', 'six-thinking-hats'],
  practises=['masterclass-4', 'masterclass-5'], timer_seconds=1200,
  notes="\n".join([
    "- Timer: 20 minutes — about 5 for hits, 7 for the grid, 8 for the hats. Same teams as Exercise 1.",
    "- Hits: all sheets up. In silence, each person dots the ideas or parts that look strong. No discussion yet.",
    "- Take the ideas with the most dots (around ten) to a 2×2 grid: how new (low/high) against how feasible (low/high).",
    "- Name the corners: now (feasible, ordinary), wow (feasible and original), how (original, not yet feasible); drop the fourth. Keep the wow ideas; pick a top three.",
    "- Yellow hat, 3 minutes: everyone thinks only about why each idea could work. Black hat, 3 minutes: only about why it could fail.",
    "- Decide: one idea, one written criterion. Then compare: is your pick also the idea the team rated most original? If not, why?",
    "Source: silent dot stickers on the strongest parts (a heat map) are (Knapp, Zeratsky, and Kowitz 2016, chap. 10); the yellow hat covering hope and positive thinking and the black hat covering why it cannot be done are (de Bono 1985, 32). The COCD box, the step order and the comparison question are course wording.",
    "Ask: Did the criterion you wrote down match the reason you actually chose?"]))
# Masterclass notes that described the old Lab (concentration / automatic writing)
m1 = slide(d, 'masterclass-1')
m1['notes'] = m1['notes'].replace(
  "- That is why the Lab starts by changing the conditions of attention before asking for material.",
  "- That is why the Lab runs them as two exercises: silent brainwriting first, selection second.")
m2 = slide(d, 'masterclass-2')
m2['notes'] = m2['notes'].replace(
  "- After concentration, look at the automatic writing: which associations recur, which change direction, which stay merely verbal?",
  "- In the Lab you count both: how many ideas (fluency) and how many kinds (flexibility).")
m3 = slide(d, 'masterclass-3')
m3['notes'] = m3['notes'].replace(
  "- In this Lab: produce more without judging instead of censoring; write without correcting, then come back later as a selector.",
  "- In this Lab: produce more without judging instead of censoring; brainwrite in silence, then come back in Exercise 2 as a selector.")
m6 = slide(d, 'masterclass-6')
m6['notes'] = m6['notes'].replace(
  "- Concentration and automatic writing produce material you did not have in view. That does not mean the exercise produced better ideas.",
  "- Brainwriting produces material you did not have in view. That does not mean the exercise produced better ideas.").replace(
  "Ask: Which passage of your unedited writing could become evidence for D1, and what criterion would justify that choice?",
  "Ask: Which idea on your brainwriting sheets could become evidence for D1, and what criterion would justify that choice?")
for s in (m1, m2, m3, m6):
    assert 'oncentrat' not in s['notes'] and 'utomatic' not in s['notes'], s['slide_id']
save(u, fm, d)

# ------------------------------------------------------------------ U3
u = 'u-3-development-solutions'; fm, d = load(u)
set_lab(slide(d, 'lab-1'),
  heading='Exercise 1 · Same problem, three entry points, in parallel',
  sentence='Keep one D1 problem. Make three rough versions, each from a different starting point, before anyone gives feedback. Then show all three side by side.',
  prompt='Practises Masterclass 1, 3 and 4: rough and early, avoid fixation, sketch to think.',
  portfolio_trace='Save the problem, the three entry points, three scans and one sentence per version on what it taught you.',
  technique_id='parallel-prototyping', technique_ids_also=['entry-point-attention-area'],
  practises=['masterclass-1', 'masterclass-3', 'masterclass-4'], timer_seconds=1200,
  notes="\n".join([
    "- Timer: 20 minutes — about 15 making, 5 for side-by-side feedback in pairs.",
    "- One concrete D1 problem, the same for the whole class. Name three entry points before starting: structure, material/support, or audience/circulation.",
    "- Three rough sketches or small prototypes, one per entry point. Do not polish. No feedback until all three exist.",
    "- Show the three side by side; note what each taught you and which one the feedback favoured; mark ideas to combine.",
    "- Watch the temptation to solve it the obvious way and paste the entry point on afterwards.",
    "Source: making several prototypes before feedback (parallel) gave novice designers better-performing and more varied designs, and a larger increase in task-specific self-confidence, than critique after each single prototype (Dow et al. 2010, 18:1); \"a different entry point will usually mean a different train of ideas\" is (de Bono 1970, chap. “Choice of Entry Point and Attention Area”). The steps and the watch-out are course wording.",
    "Ask (in pairs): How did each entry point steer the path?"]))
set_lab(slide(d, 'lab-2'),
  heading='Exercise 2 · Delay judgement, then checkpoint and exit',
  sentence='Pick one version. Hold back judgement for five minutes, decide what it tests — role, look and feel, or how it works — revise once, and stop when your question is answered.',
  prompt='Practises Masterclass 2, 3 and 6: defer judgement, iterate with an exit, reflect at checkpoints.',
  portfolio_trace='Save before/after, the test question, the checkpoint lines and the exit decision.',
  technique_id='delay-judgement-checkpoint', practises=['masterclass-2', 'masterclass-3', 'masterclass-6'], timer_seconds=1200,
  notes="\n".join([
    "- Timer: 20 minutes — about 5 delay, 5 question, 7 revise and test, 3 checkpoint.",
    "- Choose one of the three versions. For 5 minutes keep developing it without deciding whether it is right: no criticism, including your own.",
    "- Ask what this version tests: its role (what it does for the person), its look and feel, or how it would actually work. Pick one.",
    "- Write one testable question about that choice. Revise once; let a classmate try it.",
    "- Checkpoint: three lines — what changed, what stayed, what you learned. Exit when the question is answered, even if another improvement is possible.",
    "- If a tool or generative system supplied a variation, record the prompt, the option you rejected and why you kept the final form.",
    "Source: withholding criticism \"until all ideas are in\" is Osborn's first ground rule (Osborn 1942, chap. 4). The role / look and feel / implementation question and the other bullets are course wording.",
    "Ask: Where did you stop, and was it hard to stop?"]))
save(u, fm, d)
print("ok")
