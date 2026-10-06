# PHASE-EX7 Cold review: canonical technique catalogue

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (Claude, fresh session; did not implement EX7) |
| **reviewed_at** | 2026-10-06 |
| **implementer_claim** | VERIFYING. 66 techniques, all 30 required present; 34 verified / 19 held / 13 gap; 2,157 records mapped to 45 techniques; 1,141 dropped off-topic; 22 local qwen calls, 64 of 99 assignments vetoed; EX0–EX7 gates 0 failures; nothing written under runtime/ (PHASE-EX7-REPORT.md) |
| **verdict** | PASS |

Branch `cascade/excellence-7`, tip `fcc1816`. The runner verify log (`PHASE-EX7-VERIFY-LOG.md`) was taken at `270bbab`, an ancestor of the tip. `git diff --stat 270bbab fcc1816` shows that the only later change is the verify log itself, so the evidence covers the reviewed content.

No finding blocks DONE. There is one P1 (a procedural error in a step) and six P2s (mapping noise, two evidence lines that say more than their sources, one locator, and notes on source hygiene). All of them should be fixed in `canonical/techniques.base.yml`, `map_records.py` or `model-vetoes.json` before EX8 renders cards from this catalogue.

## Acceptance re-check (runnable evidence)

| Check | Command | Result |
| --- | --- | --- |
| EX7 gate | `bash creativity-techniques-pedagogy/excellence/PHASE-EX7.exit-gate.sh` (worktree root) | exit 0; `failures: 0`. PASS lines: catalogue exists, reading view exists, INDEX points to catalogue, catalogue rules, jekyll build, catalogue not published |
| Regression EX0–EX6 | each `PHASE-EX{0..6}.exit-gate.sh` | EX0 0, EX1 0, EX2 0, EX3 0, EX4 0, EX5 0, EX6 0 (exit codes), each `failures: 0` |
| Modules load | `importlib` exec of `build.py`, `extract_records.py`, `map_records.py`, `classify_local.py` | all 4 load (`build ok … classify_local ok`) |
| Build reproducible | `python3 creativity-techniques-pedagogy/in-practice/canonical/build.py` | `66 techniques; 2157 records attached`; afterwards `git status --short` is empty, so the YAML, MD and BY-UNIT outputs are byte-identical |
| Mapping reproducible | `extract_records.py <runtime>/exercises-active.json scratch/records.jsonl` (`6785 records`, 21 s), then `map_records.py records.jsonl --model model-decisions.json` run on a scratch copy of `canonical/` | `cmp` identical for both `mapping.json` and `mapping-stats.json` (`MAPPING_IDENTICAL`) |
| Runtime untouched | `find runtime -maxdepth 2 -exec stat -f "%m %z %N"` before and after (14,292 entries); `shasum -a 256` | `diff` empty (`RUNTIME_UNCHANGED`); sha256 `d1223061…543cfc` matches `source-snapshot.json`. `runtime/` is gitignored (`in-practice/.gitignore:1`), and the worktree has no runtime directory |
| Not published | `_config.yml` `exclude` contains `creativity-techniques-pedagogy`; `grep -rl "Fold a sheet into eight panels\|techniques.base\|catalogue_records" _site` | no hits; the gate grep for `CANONICAL-TECHNIQUES` in `_site` also has no hits |
| 40–80, required 30, fields, keys | gate Ruby block | passes; I also read all 66 entries in `techniques.base.yml` by hand |
| Embodied → accessibility | 5 embodied entries | all have an explicit opt-out line |
| INDEX pointer | `in-practice/INDEX.md` line 6 | present |

Phase Acceptance (one bullet) is **met**.

## Technique fact check (source opened)

"Open" means I read the library copy: pdftotext of the PDF, or the unpacked EPUB chapter.

| id | primary_source / status | What I opened | Describes the technique? | Notes |
| --- | --- | --- | --- | --- |
| alternative-uses-task | chen-2011 verified | Chen PDF, printed p. 25–26 (§2.3 Divergent Thinking) | Yes. "How many uses … for a brick?" (Hudson) and "Tests like Alternate Uses …" with Guilford's four abilities | Evidence line says more than the source → **F3** |
| brainstorming-osborn | osborn-1942 verified | Osborn PDF, CHAPTER IV (Group Method), ground rules 1–3 | Yes. Rule 1: judgement ruled out until all ideas are in; rule 3: combine and improve others' ideas | Steps match. Correctly makes no claim about the 1953 "quantity" rule |
| six-thinking-hats | debono-1985 verified | Six Hats PDF (c45df305); p. 199 is "Summaries: the six thinking hats method" | Yes | Steps (same hat at the same time, blue hat to close) are correct |
| pmi | debono-1985 verified | Same PDF, printed pp. 12–13 | Yes. The CoRT PMI is described as a Plus/Minus/Interesting map, followed by anecdotes | Locator wrong → **F4**. "untested (anecdotes, not a study)" is accurate |
| scamper | gap / held | Michalko 2010, SCAMPER chapter | Yes. Michalko attributes the questions to Osborn, "later arranged by Bob Eberle" | `gap_work` "Eberle 1971 (unverified)" is honest. The held book is consistent with it |
| morphological-box | gap / held | Michalko, Idea Box | Yes. "modeled after the morphological box, credited to Dr. Fritz Zwicky" | Consistent with the Zwicky `gap_work` |
| brainwriting-635 | gap / held | Michalko, "Silent techniques: Brainwriting" (Geschka, Battelle) and the intuition chapter's "Brainwriting" | Partly. Geschka's card-passing brainwriting is the same family but is not 6-3-5, and the intuition "Brainwriting" is a solo free-writing method | → **F2**. Status `held` is fine; steps are correct for 6-3-5 |
| synectics-excursion | gap / held | Michalko "Direct Analogies Blueprint" records (p. 286 excerpt) | Analogy method, yes | `gordon-1961` is in research-manifest.yml |
| analogy-transfer | debono-1970 verified | EPUB chapter 16 "Analogies" (sections Choosing an analogy, Practice) | Yes | — |
| random-word | debono-1970 verified | EPUB chapter 18 "Random stimulation", section "Random word stimulation" | Yes | Step 5 contradicts the chapter → **F1** |
| po-provocation | debono-1970 verified | EPUB chapter 20 "The new word po" (Provocation, The generation of alternatives) | Yes | — |
| delay-judgement-checkpoint | osborn-1942 verified (+ debono-1970 ch. 10) | Osborn ch. IV rule 1; de Bono ch. 10 "Suspended judgement", ch. 15 rule "1. No criticism or evaluation." | Yes | Supports the coat-guard reroute (see mapping rulings) |
| crazy-8s | knapp-2016 verified | EPUB chap. 9 "Sketch". Crazy 8s: fold three times into eight panels, 60 s each | Yes | Steps paraphrase the source; not quoted |
| hits-dot-voting, note-and-vote, storyboarding, how-might-we, lightning-demos | knapp-2016 verified | EPUB chaps. 10, 11, 12, 6, 8 (chapter titles and sections confirmed) | Yes | — |
| constraint-writing (temporary rules) | rubin-2023 verified | EPUB `064_Temporary_Rules.xhtml` | Yes, more clearly than the report says. The chapter frames imposed rules as a tool (Perec without "e", Klein one colour, then Dogme 95) | The report's caveat ("framing as a technique is mine") is unnecessary; the grounding is sound |
| parallel-prototyping | dow-2010 verified | Article p. 18:1 abstract | Yes | Evidence line matches the abstract (better results, more diverse, larger self-efficacy gain) |
| open-monitoring-warm-up | colzato-2012 verified | Article p. 1 abstract and Method | OM meditation promoted divergent thinking: yes | The study used 35-min sessions, not 3 min → **F3** |
| five-whys | norman-2013 verified | PDF "THE FIVE WHYS" section | Yes (Norman credits Sakichi Toyoda; the catalogue gives no attribution, which is correct) | — |
| double-diamond | norman-2013 verified | PDF index "The Double-Diamond Model of Design, 220" | Yes | — |
| exquisite-corpse | gap / held | Michalko "The Exquisite Corpse" (p. 432 record) | Yes. Surrealist practice, word-by-word sentence variant | Steps give the folded-paper drawing variant; same game. `held` is honest |
| force-field-analysis, phoenix-checklist | gap / held | Michalko Tug-of-War ("first developed by … Kurt Lewin"), Phoenix ("developed by the Central Intelligence Agency") | Yes | `gap_work` "origin unverified" is more cautious than needed but honest |
| cocd-box | gap / gap | (no library copy) | — | Steps (now / wow / how) are standard; `gap` is honest |
| peer-cat | gap / gap (amabile-1982 in manifest) | — | — | Steps adapt CAT to peer judges (Amabile used experts); the name says "peer", so this is honest |
| evidence lines citing amabile-1979 (brainstorming, delay-judgement) | amabile-1979 in references.yml | Article p. 221 abstract | Yes. Expecting evaluation lowered judged creativity | Accurate |

Attributions: every `gap_work` that names an originator (Rohrbach, Eberle, Zwicky, Gordon, Rodari, Diehl and Stroebe, Puccio, Amabile 1982, Young, Mullen) is either a key in `research-manifest.yml` (all 10 grep-confirmed) or is marked "attribution unverified". I found no student-facing author or date that came from model memory. Where Michalko gives an attribution, it agrees with the catalogue's `gap_work`.

## Steps: verbatim and procedure check

- **Verbatim scan:** I compared all 311 steps against the full text of de Bono 1970, Sprint, Rubin, Osborn, Michalko, Six Hats and Chen, using 5-word shingles. 11 steps share any 5-gram with a source, and the longest shared run is 6 words. Examples: "has its own clear line of development" (de Bono uses "line of development"); "write the problem at the top of the page". These are short phrases, not copied procedures.
- **Hand check of 10 steps against the source procedure:**
  - Correct: brainstorming-osborn, crazy-8s, six-thinking-hats, pmi, scamper (letters match Michalko), morphological-box, hits-dot-voting, parallel-prototyping, five-whys.
  - Incorrect: random-word (**F1**).
- **Accessibility:** all 5 embodied entries have an opt-out. All 66 entries have an accessibility line.

## Mapping quality: 30 mapped records

The sample is seeded random: 22 records, one each from 22 techniques, plus 8 drawn from the flagged and model-mapped groups. I read each record's name, coat and `quote` excerpt in the runtime export.

| URN tail | Label (book) | → technique | Method | Ruling |
| --- | --- | --- | --- | --- |
| ef285054 | Mindmap Creation (Kelley 2013) | mind-map | rule | correct |
| c19f6e44 | Reflection-in-Action in Practice (Schön, p. 13) | reflection-in-action-log | rule | correct |
| 1bbac810 | Exquisite Corpse Technique (Michalko p. 432) | exquisite-corpse | rule | correct |
| 58482cea | Interview Some Customers (Kelley) | five-user-interviews | rule | loose (empathy interview, not prototype test) |
| bbcf11ff | Suspended Judgement (de Bono 1970) | delay-judgement-checkpoint | rule | correct |
| c0aaf21d | Challenging Assumptions (de Bono 1970) | why-technique | rule | correct |
| 8641702d | Dominant Idea Identification (de Bono 1970) | dominant-idea | rule | correct |
| e120a3e1 | Tug-of-War Analysis (Michalko) | force-field-analysis | rule | correct |
| 5460e981 | PMI Technique (Six Hats p. 12–13) | pmi | rule | correct |
| 56c80333 | What If Scenarios (von Oech) | what-if-prompts | rule | loose (speculative what-if; catalogue cites counterfactual Wong 2009) |
| 986cbb5f | Storyboarding Basics (Michalko, Disney storyboard) | storyboarding | rule | loose (idea-organising board, not the Sprint user-journey storyboard) |
| a9daee6e | Direct Analogies Blueprint (Michalko) | synectics-excursion | rule | correct |
| 7626ac23 | Possibility Thinking Through Problem Finding (Craft) | problem-finding | rule | correct |
| 4dcd9b9e | Observation of Creative Environments (Csikszentmihalyi; Bell Labs office layout) | contextual-observation | rule | **wrong** → F2 |
| 0a44cecb | Alternative Generation (Six Hats green hat) | alternatives-quota | rule | correct |
| acb7d35b | Reframe Challenges (Kelley) | wicked-reframe | model | plausible |
| 80ce76e1 | Improvisation (Fisher and Williams) | improv-yes-and | rule | correct |
| 726d65c1 | Empathy Maps (Kelley) | empathy-map | rule | correct |
| f8dd9d3a | Blue Hat Program Visibility (Six Hats p. 197) | six-thinking-hats | rule | correct |
| 9f33921a | Idea Box (Michalko) | morphological-box | rule | correct |
| 9b6194af | Creative Process Journals (Elements) | process-trail | rule | correct |
| 95a97953 | Reflective Sketching (Cross p. 42) | seeing-as-sketch-cycles | rule | correct |
| d7f92959 | Challenge Labels (de Bono 1970 ch. 19) | why-technique | rule | correct (source: "rather similar to the 'Why' technique") |
| f354d4fa | Movement and Provocation (Six Hats, back-translated copy p. 73) | po-provocation | rule | correct technique; source copy garbled → F5 |
| d935bd18 | Challenge Labels (de Bono 1970) | why-technique | rule | correct |
| 518673a4 | Cherry Split Technique (Michalko) | attribute-listing | model | **wrong**: Michalko labels Cherry Split "fractionation" → F2 |
| e7a03a3c | Follow Dogme 95 Rules (Rubin) | constraint-writing | model | correct |
| 03ddaf1d | Disagree with Common Proverbs (von Oech) | reversal-method | model | loose |
| 92593a5c | Imposing Constraints (Gaut and Kieran p. 27) | constraint-writing | model | correct |
| fcec6619 | Seeds (Rubin) | seed-collection | model | correct |

Result: 23 correct, 5 loose or plausible, 2 wrong. The 2 wrong labels account for 28 records across their groups (12 + 16).

**Rulings on the flagged groupings:**
- **Six Hats "Movement Instead of Judgement" / "Movement and Provocation" → PO: correct, not loose.** The excerpts (pp. 155–159 and 71–75) are the green-hat section on provocation, PO and movement, including the random-word provocation example. This is the same technique de Bono gives in 1970 ch. 20.
- **"Challenge Labels" (de Bono 1970) → Why technique: acceptable.** The record text itself says challenging a label is "rather similar to the 'Why' technique".
  - von Oech "Rule-Challenging" and "Challenge Obsolete Rules" → challenging assumptions: acceptable.
  - Not acceptable: Michalko **"Challenge Statements" (11 records)**. These are problem-statement wording drills ("In what ways might I …", stretch/squeeze), which belong with how-might-we or phoenix, not the Why technique → F2.
- **de Bono 1970 "Automatic Writing Practice" → delay-judgement-checkpoint: correct.** The record's node is "1. No criticism or evaluation." (page index 24), and that is rule 1 of ch. 15 Brainstorming. de Bono 1970 contains no automatic writing (grep "automatic" finds only incidental uses), so the coat guard is correct. Mapping to brainstorming-osborn would be equally defensible.
- **"Evaluation Session" (de Bono 1970 ch. 15) → brainstorming: correct.** It is the evaluation step of de Bono's brainstorming procedure.

## Mapping quality: 15 dropped records

| URN tail | Label (book) | Reason | Ruling |
| --- | --- | --- | --- |
| ac8a0bd7 | Creating an AI Story Generator (GAIE) | ml-engineering | correct |
| 532bff99 | Setting Up GCP Environment for Style Transfer (GAIE) | cloud-setup | correct |
| 11b79d42 | Generate Modified Faces (GAIE) | ml-engineering | correct |
| 3384f5b2 | Evaluate and Test (GAIE) | ml-engineering | correct |
| 59f23f41 | Image Morphing (GAIE) | ml-engineering | correct |
| 6a1691e8 | Generate New Animals (GAIE) | ml-engineering | correct |
| d1eb7cc8 | Betweenness Centrality and Interdisciplinary Journals (Chen) | scientometrics | correct |
| e94b0586 | Choose Development Environment (GAIE) | ml-engineering | correct |
| 30248fb0 | Transformer Model Steps (GAIE) | ml-engineering | correct |
| 0be83282 | Chatbot Development with GPT-3 (GAIE) | ml-engineering | correct |
| 80675330 | Indwelling Divine Revelation (Avis) | theology | correct |
| — | Therapeutic Transference (Schön, ×4) | medicine/therapy | correct |
| — | Experimental Faith (Rubin) | theology | **wrongly dropped** (creative-practice attitude, not theology); no catalogue effect |
| — | Religious Stories Film Project (Fisher and Williams) | theology | debatable (classroom film-making activity); no catalogue effect |
| — | Collaborative Creating / AI-Assisted Visual Art Creation (GAIE, coat-only drop) | ml-engineering | debatable for U5 (AI-assisted making); not a canonical technique, so no catalogue effect |

I listed all 69 non-AI-book drops (46 distinct labels) and all 137 AI-book labels dropped only by the coat rule. None of the dropped labels names a canonical creativity technique, so no technique lost records. → F6 (note).

## Model use

- **Calls:** `model-calls.jsonl` has 22 lines. Totals: 43,378 prompt tokens, 2,814 output tokens, 301 s and 549 names, all with model `qwen2.5:32b-instruct`. This matches the report.
- **Decisions:** `model-decisions.json` has 99 assignments, 450 NONE and 0 invalid.
- **Vetoes:** `model-vetoes.json` holds 64 vetoes, each with a reason, and every vetoed name exists in the decisions file. 35 names are kept.
- **No facts from the model:** the model outputs catalogue ids only and supplies no facts. Every catalogue field comes from `techniques.base.yml`.
- **Review miss:** one kept assignment breaks the reviewer's own stated rule ("veto unless the label clearly names the canonical technique"): "Cherry Split Technique" → attribute-listing. The attribute-listing `held_note` repeats this error. → F2.

## BY-UNIT export

`build.py` prints the per-unit candidate counts:

| Unit | Candidates | Divergent/both | Convergent/both | Verified |
| --- | ---: | ---: | ---: | ---: |
| U1 | 17 | 15 | 7 | 6 |
| U2 | 32 | 27 | 8 | 15 |
| U3 | 29 | 21 | 17 | 21 |
| U4 | 23 | 13 | 16 | 14 |
| U5 | 11 | 10 | 4 | 5 |
| U6 | 13 | 12 | 4 | 5 |

- Every unit has 4 or more candidates.
- Every unit can fill 2 lessons × (1 divergent + 1 convergent) without reusing a technique, and still have 4 or more `verified` techniques.
- `lesson_picks` U1.1–U6.2 are present and empty, as intended.
- The export is usable for the 12-lesson cascade (A9). U5 and U6 are thin on verified convergent options, which the 12-lesson cascade should note.

## Findings

### F1 · P1 · does not block DONE (fix before EX8 renders a random-word card)
`random-word` step 5 says "Draw a second word and repeat; compare the two sets of ideas." de Bono 1970 ch. 18 ("Random word stimulation"), the entry's own verified primary source, advises the opposite. Source text from `debono70.txt`, ch. 18: "What one must not do is to immediately look for another random word at the end of the period because this tends to set up a search routine … If one wants to try another word it should be on another occasion." The chapter also gives about 3 minutes per word.
**Fix:** replace step 5 with a single fixed slot of 3 to 5 minutes for one word, and say that a different word is used on another day or by another student (comparing words across students is the ch. 18 class practice). Rebuild.

### F2 · P2 · does not block
Some mapped groups are not the named technique. `catalogue_records` is defined as candidate records, but these groups are systematic:
- **"Observation of Creative Environments" (Csikszentmihalyi, 12 records) → contextual-observation.** Excerpt 4dcd9b9e is about Bell Labs office layout. The pattern was added on purpose in `RULES["contextual-observation"]`. This is 12 of the entry's 21 records.
- **"Cherry Split Technique" (Michalko, 16 records, model) → attribute-listing.** Michalko's chapter list reads "Chapter Seven: Cherry Split (fractionation)". These should map to `fractionation`, and the attribute-listing `held_note` should drop "Cherry Split".
- **"Challenge Statements" (Michalko, 11 records) → why-technique.** These are problem-statement wording drills (IWWMI).
- **Michalko "Brainwriting", record 7f4ea5f3 (intuition chapter: "Brainwriting is a way to solve problems using intuition …") → brainwriting-635.** This is solo free writing.
- **The other 5 Brainwriting records** are Geschka's card brainwriting, not 6-3-5. The report line "6-3-5: there are now 6 Michalko Brainwriting records" overstates.
- **Loose groupings (keep or drop at the owner's discretion):**
  - Michalko "Storyboarding Basics" (10) → Sprint storyboard.
  - von Oech "What If" → counterfactual what-if.
  - Kelley "Interview Some Customers" → five-user test.

**Fix:**
- Remove `observation of creative environments` and `challenge (statements` from the rules.
- Add a rule `cherry split` → fractionation and veto the model decision.
- Add a coat or page guard for Michalko's intuition "Brainwriting" (route it to automatic-writing or leave it unmapped).
- Rerun steps 4–5.

### F3 · P2 · does not block
Two `evidence` lines claim more than their sources say:
- **alternative-uses-task:** "Chen 2011, 26: divergent-thinking scores did not carry over across domains". Chen p. 26 gives a caution, not a reported finding: "one should be cautious in interpreting … the ability of divergent thinking with a paper clip may tell us little about an individual's talent in music."
  **Fix:** "Chen 2011, 26 cautions that AUT scores may say little about talent in a specific domain; use as practice, not a talent measure."
- **open-monitoring-warm-up:** Colzato et al. 2012 ran a 35-minute OM session inside 45-minute sessions ("Participants served in three 45-min sessions … FA meditation (35 min)"). The catalogue's dose is 3 minutes.
  **Fix:** add "(35-min sessions; a 3-min warm-up is untested)".

### F4 · P2 · does not block
The `pmi` locator says "PDF index 24; printed page to confirm". In the edition references.yml names (debono-1985, first US edition, printed folios; library copy c45df305), the PMI passage is on **printed pp. 12–13** (`pdftotext -f 25 -l 26`: folios "12 SIX THINKING HATS", "PUTTING ON A HAT 13").
**Fix:** set `source_locator: "pp. 12–13 (CoRT PMI passage)"`.

### F5 · P2 · does not block (finding for the IP cascade and EX8)
The library holds two Six Hats copies:
- `…_c45df305`: the English first edition.
- `…_7e7ba834`: a machine back-translation. Excerpts read "TIC is called (Task of Cognitiva Investigation)", "the word op", "Paúl MacCready".

The back-translated copy contributes 410 mapped records: six-thinking-hats 348, po-provocation 42, alternatives-quota 18, pmi 1, random-word 1. Those counts therefore roughly double the true support ("714 records" for Six Hats). Those excerpts are garbled and must never be quoted or used to write steps.
**Fix (later phase or IP cascade):** exclude coat `…7e7ba834` from mapping counts, or flag it in `source-snapshot.json`. The catalogue content itself is unaffected.

### F6 · P2 · note only
The off-topic rules over-drop a few creative-practice records: Rubin "Experimental Faith" (theology regex `faith`), Fisher and Williams RE-classroom making activities, and the whole-book GAIE drop, which includes AI-assisted art and making practice relevant to U5. None is a canonical technique, so the catalogue does not change. The `ml-engineering` label in the stats overstates what was dropped.
**Fix (optional):** add a `faith` exception for the Rubin coat, and record "AI-assisted making (U5)" as a candidate family for the 12-lesson cascade.

### F7 · P2 · note only
`in-practice/INDEX.md` still says "No YAML editing is required" (pre-existing line), but the EX7 pointer on line 6 sends readers to the YAML catalogue and to the hand-edited `techniques.base.yml`. The two lines could confuse a reader.
**Fix:** reword the pre-existing sentence when INDEX is next edited.

## Downstream impact

- **EX8:** none of its listed target techniques is affected by F1. If EX8 adds random-word, F1 must be fixed first. EX8 cards must not draw wording from the back-translated Six Hats records (F5). No phase file needs amending in this commit.
- **EX10:** I agree with the implementer's note that only `verified` keys may be rendered, and the F4 locator fix should land before EX10 renders a PMI citation.

## Notes

- I did not trust the report's statistics. Re-extraction and re-mapping reproduce `mapping.json` and `mapping-stats.json` byte for byte, and `build.py` reproduces all three outputs byte for byte.
- The coat guard, the three-tier source status and the veto file are good practice. The honest `held`/`gap` split is what lets this catalogue be used safely.
- Scratch work (records.jsonl, unpacked EPUBs, pdftotext dumps) is in the session scratchpad, outside the repo. Under the worktree I edited nothing except this file, and I committed nothing.
