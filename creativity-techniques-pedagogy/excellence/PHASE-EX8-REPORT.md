# PHASE-EX8 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING. Deliverables 1–3 written; the exit gate showed 0 failures when I ran it as a pre-check (the harness runner's verify log is the one that counts). EX0–EX7 gates 0 failures on this branch. Next: `cascade-harness.sh verify`, then cold review. |
| **started_at / finished_at** | 2026-10-06 / 2026-10-06 |
| **branch / worktree** | `cascade/excellence-8` · `creativity-techniques-uem-integration-excellence-8` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT. Human gate replaced by AUTOPILOT §2 EX8 row (target Labs exactly; `approved_by: autopilot (final review pending)`). Judgment calls in `DECISIONS-LOG.md` (12 EX8 lines). |
| **cascade_amended** | No. No orchestrator, phase or gate file changed. |

## Files

Catalogue (A11, checkpoint 1 `2d12ad7`), all private:

- `in-practice/canonical/techniques.base.yml` — random-word step 5 replaced (one word per 3–5 min slot; different word another day / compare with classmates), time 15 → 10; AUT evidence (Chen p. 26 as a caution); open-monitoring evidence (35-min sessions; 3-min untested); PMI `source_locator: "pp. 12–13 (CoRT PMI passage)"`; attribute-listing held note (Cherry Split removed); brainwriting-635 held note (Geschka card brainwriting, not 6-3-5).
- `in-practice/canonical/map_records.py` — rules: `observation of creative environments` and `challenge statements` removed; `cherry split` → fractionation; off-topic list excludes coat `…_7e7ba834` (machine back-translation); new `EXCLUDE_URNS` (Michalko intuition "Brainwriting", `urn:in-practice:exercise:a5cbef20829202b47f4ea5f3`).
- `in-practice/canonical/model-vetoes.json` — Cherry Split veto.
- Re-run outputs: `mapping.json`, `mapping-stats.json`, `CANONICAL-TECHNIQUES.yml|.md`, `CANONICAL-TECHNIQUES-BY-UNIT.yml`; `canonical/README.md` (edit points); `in-practice/INDEX.md` line 4 (stale "No YAML editing is required" replaced).

Labs (checkpoint 2 `74d3353` + this commit):

- `docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md` — B2 rewritten (Debate kept; two cards; internal LAB_LINEs). Directory task was already in "Autonomous work".
- `docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md` — B2 rewritten; ideas 1, 2, 3, 5, 6 sentences that described the old Lab re-pointed; `knapp-2016` added to `references:`; editorial note; two PROVENANCE_LINEs (de Bono 1985, 32; Knapp chap. 10).
- `docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md` — B2 rewritten; editorial note; LAB_EXERCISE_SELECTION ex8 note.
- `docs/tracks/en/uem/2627-ct/u-{1,2,3}-*/data/content.json` — `lab-1`/`lab-2` rewritten (fields `technique_id`, `technique_ids_also`, `practises`, `timer_seconds`, `prompt`, notes); U1/U2 lab quotes removed; three image briefs re-written; U2 masterclass-1/2/3/6 notes re-pointed. Script: `evidence/EX8/edit_decks.py`.
- `docs/_includes/decks/u-{1,2,3}-*.html` — re-rendered (`npm run render:decks`).
- `docs/assets/css/pass-track-deck.css` — stale "72%" comment (now: image_argument 64%, quote/split 72%, exercise 74%).
- `excellence/curation/LAB-SIGNOFF.md` (new), `excellence/curation/rights-report.json` (headings refreshed by the validator).
- `excellence/evidence/EX8/` — qwen prompt/response, `model-calls.jsonl`, `deck-layout.log`, `edit_decks.py`.
- `excellence/DECISIONS-LOG.md`, `excellence/FINAL-REVIEW.md` (EX8 row, P0 bullet, §3 EX8).

Nothing written under `in-practice/runtime/`. The export was read in place (main checkout), sha256 `d1223061…3cfc` = `source-snapshot.json`; before editing, a re-run of `map_records.py` reproduced the committed mapping byte for byte (`git status` clean).

## Catalogue corrections (A11)

| Finding | Change | Effect |
| --- | --- | --- |
| F1 random-word | step 5 → one word, single 3–5 min slot; different word on another day / compare with classmates | gate check passes |
| F2 Observation of Creative Environments | rule removed | contextual-observation 21 → 9 records |
| F2 Cherry Split | rule `cherry split` → fractionation + veto | attribute-listing 32 → 16; fractionation 23 → 39 |
| F2 Challenge Statements | `challenge (statements\|labels)` → `challenge labels` | why-technique 72 → 61 (11 records unmapped) |
| F2 Michalko brainwriting | intuition record excluded by URN; held note: Geschka card brainwriting, not 6-3-5 | brainwriting-635 6 → 5 |
| F3 | AUT and open-monitoring evidence lines narrowed | — |
| F4 | PMI `pp. 12–13 (CoRT PMI passage)` | gate check passes |
| F5 | coat `…7e7ba834` excluded (440 records) | six-thinking-hats 714 → 366; po-provocation 202 → 160; alternatives-quota 76 → 58; pmi 9 → 8; random-word 114 → 113 |
| F7 | in-practice INDEX line 4 | gate check passes |

Totals: 6,785 records; 1,581 excluded (1,141 off-topic + 440 unreliable copy); 1,723 mapped to 45 techniques; 3,481 on-topic unmapped. Per-unit candidate counts unchanged (U1 17 … U6 13).

## The six cards (before → after)

Before = `HEAD` of `excellence/integration` at EX7; after = this branch. Full text in each lesson's `## B2 · Lab (Portfolio)`.

| Unit | Before | After (technique_id; practises; timer) | Source on the card |
| --- | --- | --- | --- |
| U1 Ex1 | "Research Marcel Duchamp" (three facts) | **Alternative uses, scored on four skills** (`alternative-uses-task`; masterclass-2, -3; 180 s listing) — 15 min, alone + class pool; 6 steps: list, fluency, flexibility (kinds), originality (class pool), elaboration, one-sentence reflection | (Chen 2011, 26) — "Tests like Alternate Uses…", four abilities, caution |
| U1 Ex2 | "Research the Dada movement" | **Cut-up and readymade: open, then close** (`tzara-cut-up` + `readymade-recontextualisation`; masterclass-1; 1500 s) — 25 min, pairs; 7 steps incl. language/medium/support and naming opening/closing moves | Classroom adaptation |
| U2 Ex1 | "Guided concentration" (meditation, no technique) | **6-3-5 brainwriting against solo writers** (`brainwriting-635` + `open-monitoring-warm-up`; masterclass-1, -2, -3; 240 s per round) — 20 min; 3 rounds, "shortened from six" stated; nominal solo teams, same brief and 12 min; count ideas and kinds | Classroom adaptation; warm-up (Colzato, Ozturk, and Hommel 2012, 1), 35-min sessions, 3-min untested. **Opt-out** line |
| U2 Ex2 | "Automatic writing after concentration" (no selection) | **Select: hits, COCD box, yellow and black hats** (`hits-dot-voting` + `cocd-box`, `six-thinking-hats`; masterclass-4, -5; 1200 s) — silent dots → 2×2 now/wow/how → yellow 3 min, black 3 min on top three → criterion + comparison with the idea rated most original | (Knapp, Zeratsky, and Kowitz 2016, chap. 10); (de Bono 1985, 32); COCD classroom adaptation |
| U3 Ex1 | "Same problem, three entry points" (de Bono, Cross 86, Dow) | **Same problem, three entry points, in parallel** (`parallel-prototyping` + `entry-point-attention-area`; masterclass-1, -3, -4; 1200 s) — no feedback until all three exist | (Dow et al. 2010, 18:1); (de Bono 1970, chap. "Choice of Entry Point and Attention Area") |
| U3 Ex2 | "Delay judgement…" cited to de Bono 1970 PO chapter | **Delay judgement, then checkpoint and exit** (`delay-judgement-checkpoint`; masterclass-2, -3, -6; 1200 s) — adds "role, look and feel, or how it works?" (course wording) | (Osborn 1942, chap. 4) |

Every card: **Time · Group · Materials · Steps (numbered) · Portfolio trace · Judged by** (link to `/assignments/en/creativity-techniques-portfolio/#rubric`, named criterion) **· Source**, and **Opt-out** on U2 Ex1 (embodied warm-up). Every deck lab slide: technique in the catalogue, `practises` = existing masterclass `slide_id`s, notes with timing, steps, claim-by-claim `Source:` lines with "course wording" labelled, and `Ask:`.

### Sources re-read in this phase (claims on the cards)

- Chen 2011, printed p. 26 (pdftotext of the library PDF, PDF p. 41): "Tests like Alternate Uses ask individuals to come up with as many different ways of using a common object as possible, such as a paper clip or a brick"; the four abilities; "one should be cautious…".
- de Bono 1985 English copy (c45df305), printed p. 32 (PDF p. 45): "The black hat covers the negative aspects - why it cannot be done." / "The yellow hat is optimistic and covers hope and positive thinking." The back-translated copy was not used.
- Knapp et al. 2016 EPUB, chap. 10 "Decide", "The sticky decision": "Heat map: Look at all the solutions in silence, and use dot stickers to mark interesting parts."
- Colzato et al. 2012, p. 1 abstract ("OM meditation induces a control state that promotes divergent thinking") and Method ("three 45-min sessions … FA meditation (35 min)").
- Dow et al. 2010, 18:1 abstract (outperformed; more diverse; "larger increase in task-specific self-confidence").
- Osborn 1942 chap. 4 and de Bono 1970 entry-point chapter: already page-verified in EX6 provenance; wording unchanged.

## Verification (commands run, real output)

- `bash creativity-techniques-pedagogy/excellence/PHASE-EX8.exit-gate.sh` → PASS ×9 (U1 research homework replaced; lab slides and cards; sign-off file; approved_by; validator --strict green; jekyll build; browser layout check: deck-layout: 325 slide view(s), 0 failure(s); catalogue A11 corrections; stale INDEX line removed) · `failures: 0`.
- EX0–EX7 gates, each: exit 0, 0 FAIL lines.
- `npm test` → 47 tests, 47 pass. `node --test …/tests/deck-lesson-sync.test.mjs` → 8/8; `probe-references.test.mjs` → 4/4.
- `npm run build` (prebuild hydrate + rehydrate + render, postcss, validate, jekyll, verify:publication) → exit 0, "Publication safety passed"; no deck file rewritten by prebuild.
- `node scripts/tests/browser/deck-layout.mjs` (full log `evidence/EX8/deck-layout.log`), excerpt:

```text
1920x1080 u-2-idea-generation-selection: 13 slides, 2 timer(s), 0 failing; h1 50.4–50.4px (floor 50.4), sentence 38.0–38.0px (floor 38.0); exercise headroom 137px
1280x720 u-2-idea-generation-selection: 13 slides, 2 timer(s), 0 failing; … exercise headroom 172px
1024x768 u-2-idea-generation-selection: 13 slides, 2 timer(s), 0 failing; … exercise headroom 289px
print 1920x1080 u-2-idea-generation-selection: 13 page(s), 0 failing
deck-layout: 325 slide view(s), 0 failure(s)
```

## Local model calls

| # | Model | Prompt file | Tokens (prompt / output) | Time | Use |
| --- | --- | --- | --- | --- | --- |
| 1 | `qwen2.5:32b-instruct` (Ollama HTTP, `stream: false`, temperature 0.2) | `evidence/EX8/qwen-prompt-1.txt` | 380 / 152 | 19.6 s | rewrite six grounded slide sentences in student voice; output telegraphic → final sentences are my drafts with some of its cuts; no fact from the model |

Pre-flight: in-practice `runtime/process.json` pid 48350 not running; `ollama ps` empty before the call. No opencode or autonomous agent used.

## Open issues / uncertain

- Gap attributions withheld from student text (Tzara/Dada for U1 Ex2; Rohrbach for 6-3-5; Rietzschel 2006 for the U2 comparison; Houde and Hill 1997 for the U3 question; COCD origin). The professor may prefer the target table's "Dada procedures: Tzara cut-up" title; that is a product decision, logged.
- Image bindings kept and re-briefed (U1 lab-1 *Fountain* for the AUT is the weakest fit; 4/5 in my judgement). Re-curation would touch EX4 records; left for the professor.
- U2 Ex1 makes no claim about which team wins (nominal-group research is a gap); the comparison is the exercise.
- `technique_ids_also` is a new optional slide field (not in the forge schema); the renderer and validator ignore it. The forge schema text was not amended (outside this phase's track); flag for EX9/EX11 if it should be documented.
- `timer_seconds` uses the repeated phase for U1 Ex1 (180) and U2 Ex1 (240), the whole exercise elsewhere.
- I ran the exit gate as a pre-check because the task asked me to; certification belongs to the harness runner's verify log.

## Resume point

Run `cascade-harness.sh verify <integration>/creativity-techniques-pedagogy/excellence PHASE-EX8.md <this worktree>`, commit the verify log, then cold review (inputs: PHASE-EX8.md, `git diff excellence/integration...cascade/excellence-8`, the verify log; reviewer re-reads each card against its source).
