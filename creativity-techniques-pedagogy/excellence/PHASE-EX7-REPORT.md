# PHASE-EX7 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING. Deliverables 1–4 written; the exit gate showed 0 failures when I ran it as a pre-check (it is the harness runner's verify log that counts, not mine). EX0–EX6 gates also 0 failures on this branch. Next: `cascade-harness.sh verify`, then cold review. |
| **started_at / finished_at** | 2026-10-06 / 2026-10-06 |
| **branch / worktree** | `cascade/excellence-7` · `creativity-techniques-uem-integration-excellence-7` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT (no human gate in EX7). Judgment calls logged in `DECISIONS-LOG.md`. |
| **cascade_amended** | No. No orchestrator, phase or gate file changed. Downstream notes are listed below for the orchestrator to triage. |

## Files

New, all private (under `creativity-techniques-pedagogy/`, which is outside the Jekyll source `docs/` and in `_config.yml` `exclude`):

- `in-practice/CANONICAL-TECHNIQUES.yml`: Deliverable 1. 66 techniques. Generated, so do not hand-edit it.
- `in-practice/CANONICAL-TECHNIQUES.md`: Deliverable 3. Reading view with a summary table, a by-unit list and one card per technique.
- `in-practice/CANONICAL-TECHNIQUES-BY-UNIT.yml`: units-sorted export for the 12-lesson cascade (A9). `lesson_picks` U1.1–U6.2 are left empty for that cascade to fill.
- `in-practice/INDEX.md`: Deliverable 4, a one-line pointer (line 6).
- `in-practice/canonical/`, the pipeline:
  - `README.md` gives the run order.
  - `extract_records.py` streams the 5.3 GB export with the stdlib only. Peak memory was 0.49 GB.
  - `map_records.py` applies the off-topic rules, the name rules, a coat guard and reviewed model decisions.
  - `classify_local.py` runs local Qwen on ambiguous names only.
  - `build.py` checks every key against references.yml and writes the three outputs.
  - `techniques.base.yml` is the hand-authored content and the only place to edit.
  - The rest are records of the run: `mapping.json` (URN → technique / method / drop reason), `mapping-stats.json`, `model-decisions.json`, `model-vetoes.json`, `model-calls.jsonl` and `source-snapshot.json`.

Nothing was written under `in-practice/runtime/`. The worktree has no `runtime/` directory. The export was read in place in the main checkout, and only read.

## Pre-flight (model-workload rule)

- `runtime/process.json` names pid 48350, which is not running. Every other `runtime/*/process.json` pid was checked with `ps`, and none is alive.
- `ps` showed no pipeline, review or export process.
- `curl localhost:11434/api/ps` returned `{"models":[]}` before the model run. Only `qwen2.5:32b-instruct` was loaded during it.

## Mapping statistics

Source snapshot:
- File: `runtime/exercises-active.json`
- Generated: `2026-10-06T07:40:07Z`
- sha256: `d1223061…3cfc`
- Size: 5,339,866,143 bytes

**Records: 6,785, not the 6,773 in FINDINGS D4.** The IP export was regenerated this morning. There are 2,388 distinct names; 5,050 records are needs-review and 1,735 are candidate.

| Step | Records | Distinct names |
| --- | ---: | ---: |
| Total | 6,785 | 2,388 |
| Dropped off-topic | 1,141 | — |
| · ML engineering (incl. the whole *Generative AI Essentials* book) | 840 | |
| · cloud setup (GCP, Colab, deploy) | 130 | |
| · medicine / therapy | 68 | |
| · theology (God, biblical, liturgy …; "Christmas cards" art lessons kept) | 47 | |
| · network security | 23 | |
| · IP law (*AI versus IP*) | 19 | |
| · scientometrics (CiteSpace, co-citation) | 14 | |
| On-topic | 5,644 | |
| Mapped to a canonical technique | 2,157 → 45 techniques | 301 |
| · by name rule | 2,032 | |
| · by rule + coat guard (de Bono 1970 "Automatic Writing Practice" → delay-judgement) | 5 | |
| · by local model (after review) | 120 | 35 names |
| Duplicates collapsed (mapped records − techniques with records) | 2,112 | |
| On-topic, unmapped (no canonical match or too vague) | 3,487 | 1,794 |

- **Largest collapses:**
  - Six Thinking Hats: 714 records under 62 labels. "Red Hat Thinking" ×108 is now one entry.
  - PO provocation: 202 records, 18 labels.
  - SCAMPER: 127 records, 12 labels.
  - Random word: 114 records, 13 labels.
- **21 techniques have `catalogue_records: []`.** This is a finding for the IP cascade: those sources are not in its 36-file inventory. The 21 are:
  - Alternative Uses Task, nominal group, Oblique Strategies, Tzara cut-up and readymade.
  - Fantastic binomial, Crazy 8s, lightning demos, five whys and double diamond.
  - Hits/dot voting, note-and-vote, COCD, ALU and weighted matrix.
  - Peer CAT, parallel prototyping, Mom Test, Young's five steps, open-monitoring warm-up and bodystorming.
- **D4's named zeros, as found:**
  - 6-3-5: there are now 6 Michalko "Brainwriting" records.
  - Synectics: 10 direct, personal or fantasy analogy records.
  - Osborn checklist: none. SCAMPER covers it.
  - Cut-up and Oblique Strategies: still 0.

## Local model call log

| Model | Calls | Batch | Prompt tokens | Output tokens | Wall time | Settings |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| `qwen2.5:32b-instruct` (Ollama `/api/generate`) | 22 | 25 names (last 24) | 43,378 | 2,814 | 301 s | `stream:false`, `temperature:0.1`, `num_ctx:8192`, plain `n|id` lines (no JSON mode) |

- **Input:** the 549 ambiguous names, meaning unmapped on-topic names that occur 3 or more times or contain a technique hint word. 1 trial batch was followed by 21 batches. Every line parsed, and no id was invalid.
- **Output:** 99 names assigned and 450 NONE. Every assignment was reviewed by hand. 64 were vetoed in `model-vetoes.json`, each with a reason, for example "Alternative Career Paths" → AUT and "Drawing Challenge" → automatic writing. 35 names (120 records) were kept.
- **Facts:** the model supplied none. It only chose among catalogue ids, and every catalogue fact comes from `references.yml` keys or library chapter checks.
- **Other local work:**
  - 4 Athanor searches. Sprint is not in the Athanor project.
  - Read-only SQLite and `index.md` reads of the library copies of de Bono 1970 and 1985, Osborn 1942, Knapp 2016, Norman 2013, Rubin 2023, Chen 2011, Dow 2010 and Csikszentmihalyi 1996. I read chapter lists and the PMI, brick-test and seeds passages to fix `source_locator`s.

## Technique list with source status

**Status counts:**
- **Verified (34):** `primary_source` is a references.yml key. The locator was checked in the library copy.
- **Held (19):** the library holds a book whose records describe the technique, but it is not in references.yml (Michalko, Kelley and Kelley, von Oech, Kleon, Cameron, Edwards). Add it before citing.
- **Gap (13):** not in the library. `gap_work` attributions are unverified and must not reach students.

The catalogue has no invented author or date. Steps are labelled `steps_basis: classroom adaptation in course wording`, and none are quotations.

| # | id | family · mode | primary_source | status | locator / gap work | records | units |
| ---: | --- | --- | --- | --- | --- | ---: | --- |
| 1 | `alternative-uses-task` | generation · divergent | chen-2011 | verified | p. 26 (unusual-uses / brick test reported with Guilford's abilities) | 0 | U1, U2 |
| 2 | `brainstorming-osborn` | generation · divergent | osborn-1942 | verified | chap. 4 (ground rules for a think-up conference: judicial judgment ruled out until all ideas are in) | 59 | U2, U4 |
| 3 | `brainwriting-635` | generation · divergent | gap | held | Rohrbach 1969 (attribution unverified; manifest key rohrbach-1969) | 6 | U2, U4 |
| 4 | `nominal-group` | generation · both | gap | gap | Diehl and Stroebe 1987 (manifest key diehl-1987) | 0 | U2, U4 |
| 5 | `scamper` | generation · divergent | gap | held | Eberle 1971 (attribution unverified; manifest key eberle-1971) | 127 | U2, U3 |
| 6 | `phoenix-checklist` | framing · both | gap | held | origin unverified | 26 | U3, U4 |
| 7 | `morphological-box` | generation · divergent | gap | held | Zwicky 1969 (attribution unverified; manifest key zwicky-1969) | 39 | U2, U3, U5 |
| 8 | `synectics-excursion` | generation · divergent | gap | held | Gordon 1961 (manifest key gordon-1961) | 10 | U2 |
| 9 | `analogy-transfer` | generation · divergent | debono-1970 | verified | chap. Analogies | 40 | U2, U3 |
| 10 | `random-word` | generation · divergent | debono-1970 | verified | chap. Random stimulation (section Random word stimulation) | 114 | U2, U5 |
| 11 | `po-provocation` | generation · divergent | debono-1970 | verified | chap. The new word PO (sections Provocation; The generation of alternatives) | 202 | U2, U3 |
| 12 | `reversal-method` | generation · divergent | debono-1970 | verified | chap. The reversal method | 72 | U2 |
| 13 | `alternatives-quota` | generation · divergent | debono-1970 | verified | chap. The generation of alternatives (section Quota) | 76 | U1, U2 |
| 14 | `fractionation` | generation · divergent | debono-1970 | verified | chap. Fractionation | 23 | U2, U3 |
| 15 | `oblique-strategies` | generation · divergent | gap | gap | Eno and Schmidt 1975 (attribution unverified) | 0 | U2, U5 |
| 16 | `mind-map` | generation · divergent | gap | held | origin attribution unverified | 18 | U1, U2 |
| 17 | `attribute-listing` | generation · divergent | gap | held | origin attribution unverified | 32 | U2, U3 |
| 18 | `tzara-cut-up` | generation · divergent | gap | gap | Tzara 1920 (attribution unverified) | 0 | U1, U5 |
| 19 | `exquisite-corpse` | generation · divergent | gap | held | Surrealist group practice (attribution unverified) | 5 | U1, U2 |
| 20 | `readymade-recontextualisation` | generation · both | gap | gap | Duchamp readymades (attribution and dates unverified here) | 0 | U1, U5 |
| 21 | `automatic-writing` | generation · divergent | gap | held | Breton 1924 / Surrealist practice (attribution unverified) | 5 | U1, U2, U6 |
| 22 | `fantastic-binomial` | generation · divergent | gap | gap | Rodari 1973 (manifest key rodari-1973) | 0 | U2 |
| 23 | `crazy-8s` | generation · divergent | knapp-2016 | verified | chap. 9 Sketch (four-step sketch, step 3) | 0 | U2, U3 |
| 24 | `what-if-prompts` | generation · divergent | wong-2009 | verified | pp. 161, 168 | 54 | U2, U4 |
| 25 | `thirty-circles` | generation · divergent | gap | held | Kelley and Kelley 2013 (held, not in references.yml) | 5 | U1, U2 |
| 26 | `circle-of-opportunity` | generation · divergent | gap | held | origin unverified | 14 | U2 |
| 27 | `seed-collection` | generation · divergent | rubin-2023 | verified | chap. Seeds | 24 | U2, U6 |
| 28 | `constraint-writing` | generation · divergent | rubin-2023 | verified | chap. Temporary Rules (Dogme 95 rule list as example) | 13 | U5, U6 |
| 29 | `lightning-demos` | generation · divergent | knapp-2016 | verified | chap. 8 Remix and Improve (Lightning Demos) | 0 | U3, U4, U5 |
| 30 | `swipe-file` | reflection · divergent | gap | held | Kleon 2012 (held, not in references.yml) | 1 | U5, U6 |
| 31 | `how-might-we` | framing · both | knapp-2016 | verified | chap. 6 Ask the Experts (How Might We notes) | 1 | U1, U3, U4 |
| 32 | `why-technique` | framing · divergent | debono-1970 | verified | chap. Challenging assumptions (section The Why technique) | 72 | U1, U3 |
| 33 | `entry-point-attention-area` | framing · divergent | debono-1970 | verified | chap. Choice of entry point and attention area | 9 | U3 |
| 34 | `dominant-idea` | framing · convergent | debono-1970 | verified | chap. Dominant ideas and crucial factors | 19 | U3, U4 |
| 35 | `five-whys` | framing · convergent | norman-2013 | verified | chap. 5 Human Error? No, Bad Design (section The Five Whys) | 0 | U3, U4 |
| 36 | `problem-finding` | framing · divergent | csikszentmihalyi-1996 | verified | chap. 4 The Work of Creativity | 17 | U1, U6 |
| 37 | `wicked-reframe` | framing · both | buchanan-1992 | verified | p. 16 | 22 | U1, U3 |
| 38 | `force-field-analysis` | framing · convergent | gap | held | origin attribution unverified | 26 | U4 |
| 39 | `empathy-map` | framing · both | gap | held | Kelley and Kelley 2013 (held, not in references.yml) | 14 | U3, U4 |
| 40 | `mental-locks-audit` | reflection · convergent | gap | held | von Oech (held, not in references.yml) | 50 | U1, U6 |
| 41 | `double-diamond` | framing · both | norman-2013 | verified | chap. 6 Design Thinking (The Double-Diamond Model of Design) | 0 | U3, U4 |
| 42 | `contextual-observation` | framing · divergent | norman-2013 | verified | chap. 6 Design Thinking (The Human-Centered Design Process, Observation) | 21 | U3, U4 |
| 43 | `hits-dot-voting` | selection · convergent | knapp-2016 | verified | chap. 10 Decide (Heat map; Straw poll) | 0 | U2, U4 |
| 44 | `note-and-vote` | selection · convergent | knapp-2016 | verified | chap. 11 Rumble (Note-and-Vote) | 0 | U3, U4 |
| 45 | `cocd-box` | selection · convergent | gap | gap | origin attribution unverified | 0 | U2 |
| 46 | `pmi` | selection · convergent | debono-1985 | verified | PMI passage (CoRT first lesson), PDF index 24; printed page to confirm before citing | 9 | U2, U4 |
| 47 | `alu` | selection · convergent | gap | gap | Puccio, Mance and Murdock 2011 (manifest key puccio-2011) | 0 | U2, U3 |
| 48 | `weighted-decision-matrix` | selection · convergent | gap | gap | attribution unverified | 0 | U3, U4 |
| 49 | `peer-cat` | selection · convergent | gap | gap | Amabile 1982 (manifest key amabile-1982) | 0 | U1, U2 |
| 50 | `six-thinking-hats` | selection · both | debono-1985 | verified | whole book; hat colours and map-then-route as cited in U2 (p. 199) | 714 | U2, U4 |
| 51 | `delay-judgement-checkpoint` | development · both | osborn-1942 | verified | chap. 4 (criticism withheld until all ideas are in); see also debono-1970 chap. Suspended judgement | 19 | U3 |
| 52 | `parallel-prototyping` | development · both | dow-2010 | verified | article 18, p. 18:1 | 0 | U3, U5 |
| 53 | `storyboarding` | development · convergent | knapp-2016 | verified | chap. 12 Storyboard | 16 | U3, U4 |
| 54 | `question-led-prototype` | development · convergent | knapp-2016 | verified | chap. 13 Fake It | 38 | U3, U5 |
| 55 | `seeing-as-sketch-cycles` | development · both | cross-2006 | verified | p. 86 | 22 | U3 |
| 56 | `five-user-interviews` | development · convergent | knapp-2016 | verified | chap. 15 Small Data | 1 | U3, U4 |
| 57 | `mom-test-interview` | development · convergent | gap | gap | Fitzpatrick 2013 (attribution unverified) | 0 | U4 |
| 58 | `young-five-steps` | development · both | gap | gap | Young 1965 (manifest key young-1965) | 0 | U2, U6 |
| 59 | `creative-journal` | reflection · both | gap | held | Cameron 1992 (held, not in references.yml) | 26 | U1, U6 |
| 60 | `reflection-in-action-log` | reflection · both | schon-1983 | verified | pp. 68, 79 | 65 | U3, U6 |
| 61 | `process-trail` | reflection · both | gap | gap | course practice (no single source); related verified idea in eckersall-2017, 15 | 1 | U1, U5 |
| 62 | `open-monitoring-warm-up` | embodied · divergent | colzato-2012 | verified | p. 1 | 0 | U2, U6 |
| 63 | `bodystorming` | embodied · divergent | gap | gap | attribution unverified | 0 | U3, U4 |
| 64 | `thought-walk` | embodied · divergent | gap | held | attribution unverified | 14 | U6 |
| 65 | `improv-yes-and` | embodied · divergent | gap | held | attribution unverified | 14 | U4, U6 |
| 66 | `pure-contour-drawing` | embodied · divergent | gap | held | Edwards (held, not in references.yml) | 2 | U1, U6 |

Required techniques (Deliverable 2): all 30 present, and the gate regex list matches each one.

**Units coverage for the 12-lesson cascade.** Each lesson picks two Lab techniques:

| Unit | Candidates | Divergent/both | Convergent/both | Verified |
| --- | ---: | ---: | ---: | ---: |
| U1 | 17 | 15 | 7 | 6 |
| U2 | 32 | 27 | 8 | 15 |
| U3 | 29 | 21 | 17 | 21 |
| U4 | 23 | 13 | 16 | 14 |
| U5 | 11 | 10 | 4 | 5 |
| U6 | 13 | 12 | 4 | 5 |

## Commands run and real output

- `python3 canonical/build.py` → `66 techniques; 2157 records attached`. A rebuild after rerunning `map_records.py` left `git status` clean, so the build is idempotent.
- `bash creativity-techniques-pedagogy/excellence/PHASE-EX7.exit-gate.sh` (pre-check) gave 0 failures:
  - PASS catalogue exists
  - PASS reading view exists
  - PASS INDEX points to catalogue
  - PASS catalogue rules
  - PASS jekyll build
  - PASS catalogue not published
- EX0–EX6 exit gates on this branch: each exit 0, with 0 FAIL lines. They were run before the catalogue files existed and again after the final build (see the FINAL-REVIEW EX7 section).

## Uncertain / for the cold reviewer

1. **Name-based mapping trusts IP-cascade labels.** Those labels are model-proposed and unreviewed. A label can sit on a passage that is not the technique; de Bono 1970's "Automatic Writing Practice" was such a case and is now handled by the coat guard. `catalogue_records` therefore means "candidate supporting records", not verified procedures.
2. **Generous groupings.**
   - "Movement Instead of Judgement" / "Movement and Provocation" (Six Hats book) → PO provocation (de Bono 1970).
   - "Challenge Labels" / "Rule-Challenging" (von Oech) → Why technique.
   - "Evaluation Session" (de Bono 1970, brainstorming chapter) → brainstorming.
   - Each is defensible, but a stricter reviewer may want them unmapped.
3. **Locator caveats.**
   - PMI's locator is a PDF index (24). The printed page must be confirmed before a student cite.
   - Six Hats uses "whole book; p. 199 as cited in U2".
   - Sprint chapters are EPUB chapter numbers.
4. **Temporary rules → rubin-2023.** The chapter's extracted text is the Dogme 95 rule list. The framing as a classroom technique is mine.
5. **Downstream note for EX10 (not amended).** Method cards render "public fields (name, source …)". Only `verified` `primary_source` keys may be rendered. `gap_work`, `held_note` and node or coat references in the YAML are private.
6. **Downstream note for EX8.** The target Labs map to catalogue ids:
   - `alternative-uses-task`, `tzara-cut-up` and `readymade-recontextualisation`
   - `brainwriting-635`, `nominal-group` and `open-monitoring-warm-up`
   - `hits-dot-voting`, `cocd-box` and `six-thinking-hats`
   - `parallel-prototyping`, `entry-point-attention-area` and `delay-judgement-checkpoint`
   - Cut-up, readymade, 6-3-5, COCD and nominal group are `gap`/`held`, so their cards may not carry a student-facing Source line until procured.

## Resume point

Run `cascade-harness.sh verify … PHASE-EX7.md <this worktree>`, then a fresh cold review. To change content, edit `canonical/techniques.base.yml` (or the rules or vetoes), then run `map_records.py <records.jsonl> --model canonical/model-decisions.json` and `build.py`. `records.jsonl` is recreated by `extract_records.py` (about 1 min) from the runtime export.
