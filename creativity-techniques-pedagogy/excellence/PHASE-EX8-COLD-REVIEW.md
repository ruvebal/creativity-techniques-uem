# PHASE-EX8 Cold review: Lab redesign U1–U3 with exercise cards

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (Claude, fresh session; did not implement EX8) |
| **reviewed_at** | 2026-10-06 |
| **implementer_claim** | VERIFYING. A11 catalogue corrections F1–F5, F7 done first and re-run on export sha256 d1223061…3cfc; six Lab cards and six `lab_exercise` slides (technique_id, practises, timer_seconds, notes with claim-by-claim Source lines); sign-off by autopilot; EX8 gate 0 failures incl. browser check; EX0–EX7 0 failures; `npm test` 47/47; sync 8/8, probe 4/4; build passes publication safety (PHASE-EX8-REPORT.md) |
| **verdict** | PASS |

Branch `cascade/excellence-8`, tip `e5bb89a`. The runner verify log was taken at `7932a56`, an ancestor of the tip. `git diff --stat 7932a56 e5bb89a` shows only `PHASE-EX8-VERIFY-LOG.md` (24 insertions), so the runner evidence covers the reviewed content.

No finding blocks DONE. I found no P0 and no P1. There are nine P2 findings, which cover pedagogy, timing, stale data, a gate gap, an attribution note and a carried-over rights flag. Every Source line on the six cards matches the page I opened.

## Labs

| Lab | Claims checked | Verdict |
| --- | --- | --- |
| U1 Ex1 Alternative uses (`alternative-uses-task`; mc-2, mc-3; 180 s) | Chen 2011 PDF printed pp. 25–26 (pdftotext): "Tests like Alternate Uses ask individuals to come up with as many different ways of using a common object as possible, such as a paper clip or a brick"; Guilford's four abilities, numbered 1–4 on p. 26; caution "…a paper clip may tell us little about an individual's talent in music". The card's four scoring steps match those definitions (originality = "different from those of most other people" → class-pool uniqueness is a fair adaptation). mc-2 (four skills) and mc-3 (score ≠ talent) are practised | PASS (F4 timing, F6 Ask line, F8 image) |
| U1 Ex2 Cut-up and readymade (`tzara-cut-up` + `readymade-recontextualisation`; mc-1; 1500 s) | Both are `gap` in the catalogue, and the card says "Classroom adaptation" with no gap work named as a source. The steps match the catalogue steps. Open/close naming practises mc-1 (Craft 2000, 30, open = divergent / close = convergent). Step 6 practises the language/medium/support triad | PASS (ruling R1) |
| U2 Ex1 6-3-5 vs solo (`brainwriting-635` + `open-monitoring-warm-up`; mc-1–3; 240 s/round) | 6-3-5 is `held`/gap, so "classroom adaptation" is correct and Rohrbach is not named. "Shortened … this Lab runs 3 rounds" is stated on the card and the slide. Colzato et al. 2012 p. 1 abstract: "OM meditation induces a control state that promotes divergent thinking". The Method gives "three 45-min sessions … (35 min)", and the card states that the 3-min version is untested. Opt-out present. Solo teams = nominal groups, same brief and same 12 min; no claim about who wins | PASS (F3 confound, F4 timing) |
| U2 Ex2 Hits → COCD → yellow/black (`hits-dot-voting` + `cocd-box`, `six-thinking-hats`; mc-4, mc-5; 1200 s) | Knapp et al. 2016 EPUB, toc chap. 10 "Decide", "The sticky decision": "2. Heat map: Look at all the solutions in silence, and use dot stickers to mark interesting parts." de Bono 1985 English copy c45df305, printed p. 32: "The black hat covers the negative aspects - why it cannot be done." / "The yellow hat is optimistic and covers hope and positive thinking." Both quotes are exact. COCD now/wow/how is correct and labelled classroom adaptation. The unit now has a convergent technique (hits = selection/convergent) | PASS (F1 criterion timing, F2 paraphrase) |
| U3 Ex1 Three entry points in parallel (`parallel-prototyping` + `entry-point-attention-area`; mc-1, 3, 4; 1200 s) | Dow et al. 2010, 18:1 abstract: "Parallel participants created multiple prototypes before receiving feedback … significantly outperformed … more diverse … larger increase in task-specific self-confidence". The card's paraphrase is accurate, and step 4 ("feedback only when all three exist") is the parallel condition, not the serial one. de Bono 1970 EPUB chapter 17 "Choice of entry point and attention area": "in practice a different entry point will usually mean a different train of ideas" (exact). mc-3's fixation bullet is Dow, so the link holds | PASS |
| U3 Ex2 Delay judgement, checkpoint, exit (`delay-judgement-checkpoint`; mc-2, 3, 6; 1200 s) | Osborn 1942 (library PDF "How to Think Up"), CHAPTER IV "Group Method", rule 1: "Judicial judgment is ruled out. Criticism must be withheld until all ideas are in." Exact; FINDINGS D3 fixed (the de Bono PO pin is removed from lesson and deck). Role / look and feel / how-it-works runs uncited | PASS (ruling R2, F5) |

Judged by: all six links render as `/creativity-techniques-uem/assignments/en/creativity-techniques-portfolio/#rubric` in `_site`. `id="rubric"` exists, and the named criteria ("Creative fluency, flexibility, and originality", "Critical analysis and judgement") are rubric rows (index.md:73–74). Every `#ref-*` anchor used in the three built lessons resolves. No `LAB_LINE` or `curriculum-internal` text reaches `_site`.

## Findings

### F1 · P2 · does not block: U2 Ex2 names the criterion after choosing, but mc-5 says before
mc-5 notes: "Name the criterion before you decide what to keep." Card step 7: "Choose one idea and write the criterion that decided it". The COCD axes (novelty × feasibility) are named up front, so the grid partly practises mc-5, but the final pick's criterion is post hoc.
**Fix:** step 7 → "Before you pick, write the criterion you will use; then choose one idea." Keep the Ask ("Did the criterion … match the reason you actually chose?") as the check.

### F2 · P2 · does not block: the Knapp paraphrase drifts
Card: "silent dot voting on the strongest parts of each idea (a 'heat map')". Knapp chap. 10: heat map dots "mark interesting parts". In Sprint, voting is the separate straw poll and supervote.
**Fix:** "silent dot stickers marking the interesting parts of each idea (a 'heat map')". Using dot counts to shortlist stays in the "order of steps … classroom adaptation" clause.

### F3 · P2 · does not block: the U2 Ex1 fluency comparison is confounded
6-3-5 caps each writer at 3 ideas per round (9 in 12 min). Solo writers have no cap. "Which kind of team had more ideas?" will mostly measure the format.
**Fix:** add a facilitation note: either let brainwriters add extra ideas below the row, or compare kinds (flexibility) and builds-on rather than raw counts, and say aloud that the cap exists.

### F4 · P2 · does not block: timing is tight in two places
- U1 Ex1: originality by reading every list aloud to the whole class within 12 minutes (after 3 min listing) does not fit a class of 25–30.
- U2 Ex1: 5 minutes to pool, de-duplicate, classify kinds for up to 54 ideas per team, and compare on the board.

**Fix:** U1, use the shared board only (or originality within table groups of 5–6). U2, allow 8–10 minutes for pooling and counting, or move the counting to the start of Ex2.

### F5 · P2 · does not block: Houde & Hill model labelled "course wording"
The role / look and feel / implementation triad is an identifiable published model (Houde and Hill 1997, BIBLIO-GAP). The deck notes call it "course wording", which suggests the course invented it.
**Fix (when houde-1997 is verified, or now):** relabel it in the notes as "adapted prototyping question; source pending (BIBLIO-GAP)", then cite once verified. This is ruling R2 below.

### F6 · P2 · does not block: U1 lab-1 Ask line does not fit the exercise
Notes: "Ask: Your count went up with practice. Did your best idea get better too?" The exercise has one 3-minute listing round, so there is no "practice" curve to observe.
**Fix:** "Did your rarest use turn out to be your best one?" or similar.

### F7 · P2 · does not block: stale `image_brief` on U2 lab-2
`docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json:559`: "A page of Surrealist automatic writing … Les Champs magnétiques (1919) … the practice this exercise borrows." The exercise is now selection, and the slide is a diagram, so the brief is not rendered. The report says the briefs were re-written. The brief also names a gap work.
**Fix:** rewrite it, e.g. "Course diagram: selection grid (no image)", or remove it.

### F8 · P2 · does not block: U1 lab-1 image is a weak fit and carries an existing rights flag (from EX4)
*Fountain* is a readymade, so it illustrates recontextualisation (U1 Ex2 step 4) better than listing alternative uses. Fit: 3/5. The validator flags it: `author death year 1968 contradicts the public-domain / EU-term claim (protected in the EU through 2038)`. The slide caption still reads "Public domain" (screenshot 1280 U1 lab-1). The binding was kept from EX4 and is in `--rights=flag` mode, so EX8 did not introduce the flag.
**Fix (curation pass / IP review):** move *Fountain* to U1 lab-2, or replace it, and bind a public-domain everyday-object image (brick, paper clip) to lab-1. Resolve the caption/rights contradiction before teaching.

### F9 · P2 · does not block: `technique_ids_also` is undocumented and the gate ignores it
`scripts/validate-decks.mjs` has no unknown-field check, and `deck-render.mjs` only reads `timer_seconds`. The field is therefore safe, and the validator passes with `--strict`. However, `technique_id` and `practises` are not documented in `STUDENT-SLIDESHOW-FORGE.mdc` either. The EX8 gate's embodied/Opt-out check only looks at the primary `technique_id`. U2's embodied `open-monitoring-warm-up` is in `technique_ids_also`, so its Opt-out is present but not gate-enforced.
**Fix (EX9 or EX11):** document `technique_id`, `technique_ids_also` and `practises` in the forge schema. Extend the embodied check in any later gate to `technique_ids_also`.

## Rulings on the implementer's open issues

- **R1 · U1 Ex2 without Tzara/Dada:** acceptable. A11 ("Source line only for verified primary_source") and the hard constraint (unverified works stay BIBLIO-GAP) outrank the target table's title wording. The procedures in the target table (cut-up on a real brief, readymade recontextualisation, naming divergent/convergent moves) are all implemented. Retitle to "Dada procedures" once `tzara-1920` is verified.
- **R2 · Rietzschel and Houde & Hill running uncited:** acceptable for Rietzschel. Step 7 asks a comparison question and makes no claim about the finding, so nothing needs a source. Acceptable with relabelling for Houde & Hill (F5): the question is fine, but "course wording" overstates authorship.
- **R3 · *Fountain* on U1 lab-1:** weak fit and rights-flagged (F8). Not blocking for EX8, but it should be fixed before the slide is taught.
- **R4 · `technique_ids_also`:** safe; the validator and renderer ignore it (F9). It should be documented.

## Acceptance re-check (runnable evidence)

| Check | Command | Result |
| --- | --- | --- |
| EX8 gate | `bash creativity-techniques-pedagogy/excellence/PHASE-EX8.exit-gate.sh` | exit 0; 9 PASS incl. `browser layout check: deck-layout: 325 slide view(s), 0 failure(s)`, `catalogue A11 corrections`, `stale INDEX line removed`; `failures: 0` |
| Regression | `PHASE-EX{0..7}.exit-gate.sh` | each exit 0, 0 FAIL lines, `failures: 0` |
| Suite | `npm test` | `# tests 47 … # pass 47 # fail 0` |
| Sync + probe | `node --test …/deck-lesson-sync.test.mjs …/probe-references.test.mjs` | `# tests 12 # pass 12 # fail 0` |
| Build ×2 | `npm run build` twice, `git status --short` after each | exit 0 both; "Publication safety passed"; `validate-decks: 6 deck file(s), 0 error(s), 25 warning(s)`; working tree clean after both (idempotent) |
| Export sha | `shasum -a 256 <main>/…/runtime/exercises-active.json` | `d12230611e26…afb543cfc` = `source-snapshot.json`; runtime pid 48350 not running |
| Mapping reproducible | `extract_records.py` → scratch (`6785 records`); `map_records.py records.jsonl --model model-decisions.json` on a scratch copy of `canonical/` | `cmp` identical for `mapping.json` and `mapping-stats.json` (`MAPPING_IDENTICAL`) |
| Build reproducible | `python3 …/canonical/build.py` | per-unit counts printed; `git status --short` empty → three catalogue outputs byte-identical |
| Runtime untouched | `find runtime -maxdepth 2 -exec stat -f "%m %z %N"` before/after (14,292 entries) | `diff` empty (`RUNTIME_UNCHANGED`); no runtime path in the branch diff |
| A11 F1–F5, F7 | diff of `techniques.base.yml`, `map_records.py`, `model-vetoes.json`, `INDEX.md` | random-word step 5 → one word, single 3–5 min slot; Observation-of-Creative-Environments and Challenge-Statements rules removed; `cherry split` → fractionation + veto; Michalko intuition URN excluded; 6-3-5 held_note corrected; coat 7e7ba834 excluded; AUT/OM evidence narrowed; PMI `pp. 12–13`; INDEX line replaced |
| Two lab slides per deck, technique in catalogue, practises valid, U2 selection technique | gate Ruby block + my dump of the slides | 2/2/2; ids exist; `hits-dot-voting` family `selection`, mode `convergent` |
| Card labelled lines | read all six cards | Time · Group · Materials · Steps (numbered) · Portfolio trace · Judged by · Source on all six; Opt-out on U2 Ex1 |
| U1 "Research Marcel Duchamp" gone | gate `absent` | PASS |
| Deck timers | `grep data-timer` in rendered includes | U1 180/1500, U2 240/1200, U3 1200/1200 |
| Notes Source lines | slide dump | each lab note has claim-by-claim Source lines; course wording labelled; Ask present |
| A9 stale 72% comment | CSS diff | replaced with 64/72/74% breakdown, consistent with rules at lines 469, 472, 512 |
| Sign-off | `LAB-SIGNOFF.md` | `approved_by: autopilot (final review pending)`, `approved_on: 2026-10-06` (AUTOPILOT §2 EX8 row) |
| Screenshots viewed | `deck-layout.mjs --sizes=1920x1080,1280x720 --shots=<scratch>` (260 views, 0 failures); I viewed 1920 U2 lab-1, 1920 U2 lab-2, 1280 U1 lab-1, 1280 U3 lab-2, print-1920 U2 pages 11 and 12 | all text readable; heading, sentence, prompt, trace box and timer fully visible; caption clear of the card; print pages show no clipped text |

Phase Acceptance: gate passes (bullet 1, met). "Cold reviewer checks each card's steps against its primary source" (bullet 2): done above, and all cited passages support the cards.

## Notes

- I opened every cited source myself: Chen PDF pp. 25–26, Six Hats c45df305 pp. 31–33, Sprint EPUB chap. 10, Colzato PDF p. 1 + Method, Dow PDF 18:1, de Bono 1970 EPUB ch. 17, Osborn PDF ch. IV. I did not open the back-translated Six Hats copy.
- Procedural checks: AUT four-way scoring matches Guilford/Chen. 6-3-5 shortened to 3 rounds is stated on the card and the slide. hits → COCD → yellow/black runs in the right order with one hat at a time for everyone (parallel thinking). Parallel vs serial matches Dow's conditions. Osborn's deferred judgement rule is quoted exactly.
- Downstream: none of F1–F9 invalidates EX9–EX11 assumptions, so no phase file needs amending. F9 (schema documentation) and F5 (houde-1997) are good candidates for EX9/EX10 scope. F8 belongs to a curation/IP pass.
- Scratch work (records.jsonl, canonical copy, pdftotext dumps, unpacked EPUBs, screenshots) is in the session scratchpad. I edited and committed nothing in the worktree except this file, which I wrote and did not commit.
