# PHASE-EX1 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-04T17:47Z (approx.) |
| **finished_at** | 2026-10-04T18:05Z (implementation; awaiting `cascade-harness.sh verify` and cold review) |
| **cold_review** | PHASE-EX1-COLD-REVIEW.md (not yet filed) |
| **cascade_amended** | none (downstream surprises reported below for the orchestrator and cold reviewer; not patched here) |
| **branch / worktree** | `cascade/excellence-1` · `creativity-techniques-uem-integration-excellence-1` (`.cascade-lane` = `excellence`) |

## Summary

Applied deliverables 1, 1b and 2–7 of PHASE-EX1.md in U1, U2, U3, the master
lecture, the How to Pass deck, the evaluation, track and portfolio pages.
Weights and pass conditions were read from `DECISION-EX0-GUIA.md`
(`weights_knowledge_tests: 60`, `weights_work: 40`, `pass_final_test_min: 5.0`,
`pass_min_activities_percent: 50`, §7.2 for the extraordinary session).
No new scholarly source was added. Every quote that is now on a changed slide or
paragraph has a PROVENANCE_LINE in a lesson's curriculum-internal block. Two
of those lines were written in this phase for quotes that already existed, after
I checked them in the vault (see "Provenance added").

**Surprise: the de Bono 1985 pin cite was wrong.** The existing
"(de Bono 1985, 211)" map/route quote matches the vault node `af8ae4ed…`
word for word, but 211 is the PDF page index. When I read the PDF page with
`pdftotext -f 212 -l 212`, the printed folio is **199** (the "Summaries" chapter;
page index 210 is folio 198). The public cite is now "(de Bono 1985, 199)". Other
lessons use the same "printed = index + 1" convention, so EX6 should re-check
printed pages for every pin cite (see Downstream surprises 1).

Nothing under `scripts/`, `_config.yml`, images, U4–U6 lessons or decks was changed.
`npm run build`, `prebuild` and `develop` were never run.

## Files changed

- `docs/evaluation/index.md`: 60/40, new "How to pass (official conditions)" section, intro wording
- `docs/tracks/en/creativity-techniques/index.md`: Official contract line: 60/40 plus pass conditions and a link to Evaluation
- `docs/tracks/en/uem/2627-ct/how-to-pass-this-track/data/content.json`: weights slide, pass conditions, D1 rubric relabelled "of D1"
- `docs/assignments/en/creativity-techniques-portfolio/index.md`: rubric weight sentence; internal `[VERIFIED]` line (1b)
- `creativity-techniques-pedagogy/cv/guides/9990002301-unicrawler-2026-27.json` → `guia-tecnicas-de-creatividad-videojuegos-2026-27.json` (`git mv`, content unchanged)
- `AGENTS.md`, `creativity-techniques-pedagogy/cv/README.md`, `creativity-techniques-pedagogy/cv/sources/oficial-guia-framework.mdc`, `creativity-techniques-pedagogy/grounding/GROUNDING-RECEIPT.md`: references to the renamed JSON
- `docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md`: opener, `evaluation_feed`, originality, "trainable", Lab (two exercises), Directory moved to autonomous work, Workshop
- `docs/tracks/en/uem/2627-ct/u-1-introduction-creativity/data/content.json`: Masterclass 2 slide; Exercise 3 slide removed; outro points to the autonomous work
- `docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md`: opener, `evaluation_feed`, objective 3, Ideas 1, 3, 4, 6, conclusion, References (9 entries removed), internal provenance, editorial note
- `docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json`: Masterclass 1, 2 and 3 slides
- `docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md`: opener attributed to the Tao of Creativity
- `docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json`: Masterclass 1 citation label and href
- `docs/lessons/en/master-lectures/creative-process-analysis/index.md`, `docs/tracks/en/uem/2627-ct/special-creative-process-analysis/data/content.json`, `docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json`: "Eckersall 2017" → "Eckersall, Grehan, and Scheer 2017"
- `creativity-techniques-pedagogy/excellence/DECISIONS-LOG.md` (appended), `FINAL-REVIEW.md` (U4 line located), this report

## Changed student-facing sentences (before → after)

| # | Where | Before | After | Finding |
| --- | --- | --- | --- | --- |
| 1 | Evaluation, weights table | Knowledge tests **70%** · Delivery/presentation **30%** | **60%** · **40%** | A1 |
| 2 | Evaluation, intro | "…This page stays contract-honest: **weights unchanged**; deliverables map onto them." | "Official weights and pass conditions come from the UEM subject guide (*guía docente*) for the Design degree. … They do not change the official weights; the deliverables map onto them. If the guide published in Campus Virtual differs from this page, the guide wins." | A1 (provisional decision) |
| 3 | Evaluation, new section | — | "How to pass (official conditions)": final mark ≥ 5.0/10; at least 5.0 in the final test for it to count in the average; hand in at least 50% of the course activities; same final-test and activities minimums in the extraordinary session | A4 |
| 4 | Track page, Official contract | "Evaluation weights: **70%** knowledge tests · **30%** delivery and/or presentation of work." | "…**60%** … **40%** … To pass you also need at least 5.0 in the final test and must hand in at least 50% of the course activities — see Evaluation." | A1, A4 |
| 5 | How to Pass, slide 2 | "Official weights (unchanged)" 70% / 30% | "Official weights" 60% / 40% + "To pass: final mark 5.0 or higher, at least 5.0 in the final test, and at least 50% of the course activities handed in." | A1, A4 |
| 6 | How to Pass, D1 rubric | Presentation 70% · support 20% · debate 10% | "Shares of the D1 mark (not of the course mark):" 70% of D1 · 20% of D1 · 10% of D1 | clarity (see DECISIONS-LOG) |
| 7 | Portfolio brief, Rubric | "(**70% knowledge tests; 30% delivery and/or presentation of work**)" | "(**60% knowledge tests; 40% …**)" | A1 |
| 8 | U3 deck, Masterclass 1 | quote "A rough thing can answer a question that a polished thing hides." labelled **(Cross 2006, 17)** → `#ref-cross-2006` | same quote, **(Tao of Creativity)** → `#tao-of-creativity` | C1 |
| 9 | U3 lesson opener | aphorism with no attribution | same aphorism + "— Tao of Creativity" | C1 |
| 10 | U2 deck, Masterclass 1 | quote "To solve an interesting problem, start by finding a problem that is interesting to you." (Raymond 2001, 62) | "The first stage is to make the map. The second stage is to choose a route on the map." (de Bono 1985, 199) | C5 |
| 11 | U2 deck, Masterclass 2 sentence | "Many ideas only help if they differ — twenty suns is fluency thirty, flexibility one." | "Many ideas only help if they differ. Thirty sketches of the same sun are many ideas, but only one kind." | C4 |
| 12 | U2 deck, Masterclass 2 quote | "Lateral thinking is generative. Vertical thinking is selective." (de Bono 1970, 9), a duplicate of the cover | "It involves fluency, or the ability to generate a great quantity of ideas; flexibility, or the ability to switch from one perspective to another; and originality in picking unusual associations of ideas." (Csikszentmihalyi 2007, 8) | C5 |
| 13 | U2 deck, Masterclass 3 | "3 · Block the obvious first" / "Original responses need you to notice and refuse the first automatic answer — dig a different hole." | "3 · Get past the obvious" / "Your first ideas are usually the obvious ones. Don't censor them — keep making more without judging, and dig in a different place." | C2 |
| 14 | U2 lesson opener | "Once you have the fluent hand, learn the criteria." — Tao of Development | "Whose criteria decide what counts as novel — yours, the brief's, or the room's?" — Tao of Creativity (existing U2 deck outro line) | C10 |
| 15 | U2 objective 3 | "**Recognise and inhibit** the first automatic answer before treating it as an original one." | "**Recognise** the first obvious answers and keep generating past them before you judge." | C2 |
| 16 | U2 Idea 1 quote | Raymond 2001, 62 (interesting problem) | de Bono 1985, 199 (map, then route) | C5 |
| 17 | U2 Idea 3 heading + para 1 | "Block the obvious first"; "The first automatic associations are not necessarily the most useful ones. … his dig-a-different-hole line is the one page-verified quote this unit keeps:" | "Get past the obvious"; "The first ideas that come to mind are usually the obvious ones — the ones most people in the room would also have. You do not get past them by censoring them. You get past them by producing more ideas without judging, so the less obvious ones have room to appear. … his dig-a-different-hole line puts it in one image:" (the Csikszentmihalyi 2007, 8 and de Bono 1970, 17 cites are unchanged) | C2 |
| 18 | U2 Idea 3 para 2 | "…Classical brainstorming's "defer judgement" rule says the opposite of this paragraph (do not censor first answers)… how much more original that idea might have been if you had blocked your obvious first thought is still open…" | "On your D1, count how many ideas you wrote down before one felt neither obvious nor random, and write the number down. Classical brainstorming's rule to defer judgement points the same way: keep early answers coming instead of censoring them, and judge later. How many ideas are enough for a given brief is still an open question, and this class will not close it." | C2 |
| 19 | U2 Idea 4, Six Hats | "a Six Hats round asks students to speak from one stance at a time (facts, feelings, risks, or benefits)" | "In a Six Thinking Hats round, everyone thinks in one mode at a time, and each mode has a colour: white (facts and information), red (feelings and gut reactions), black (caution: risks and why something might not work), yellow (benefits and reasons for optimism), green (new ideas and alternatives), and blue (running the process: what to think about next)." | C3 |
| 20 | U2 Idea 4 | de Bono 1985 "make the map" quote block + "His earlier book names a related move:" | quote moved to Idea 1; "de Bono's lateral-thinking book names a related move:" | C5 (no duplicate) |
| 21 | U2 Idea 6 | "The trainable dimensions Csikszentmihalyi separates on page 8 — fluency, flexibility, originality (cite) — are exactly the ones a workshop can rehearse;" | "The dimensions Csikszentmihalyi lists on page 8 — fluency, flexibility, originality — are the ones most creativity tests measure and most workshops try to improve (cite). Training can raise scores on them;" | C7 (same overclaim in U2) |
| 22 | U2 Conclusion | "Csikszentmihalyi's trainable dimensions" | "Csikszentmihalyi's test dimensions" | C7 |
| 23 | U2 References | 17 entries incl. Lehrer 2012, de Bono 1981 | 8 entries, all cited in the body (removed: Lehrer 2012, de Bono 1981, Smith 2013, Kelley 2013, Beghetto & Karwowski 2025, Csikszentmihalyi 1996, Eno & Schmidt 1975, Kimbell 2011, Avis 2013) | C6 |
| 24 | U2 editorial note (rendered) | "…Lehrer (2012) is page-verified *as popular science*… Smith (2013) page-verifies collaborative sampling; … Kelley 2013 and Beghetto & Karwowski 2025 remain open for the broader generate-and-select claim." | "de Bono (1985) page-verifies the map-then-route description of the Six Thinking Hats method. … Research evidence for the broader generate-and-select claim, and for the claim that later ideas tend to be less obvious than first ones, is not yet cited here." | C6 |
| 25 | U1 lesson opener | "Name your variables as if you were baptising stars." — Tao of Development | "Open many doors on Monday; close most of them on Tuesday — that rhythm is the craft, not the mood." — Tao of Creativity (existing U1 deck cover line) | C10 |
| 26 | U1 objective 2 | "**Name** four trainable skills: fluency, flexibility, originality, elaboration." | "**Name** four skills that creativity tests measure — fluency, flexibility, originality, elaboration — and say what training can and cannot change." | C7 |
| 27 | U1 Idea 2 heading | "Four skills you can train" | "Four skills that tests measure" | C7 |
| 28 | U1 Idea 2, originality | "**Originality** — make links most people miss" | "**Originality** — produce ideas that few other people produce (rare answers)" (matches Chen p. 41 node `ac443610`: "the tendency to produce ideas different from those of most other people") | C7 |
| 29 | U1 Idea 2, new line | — | "Training can raise scores on these skills. A higher score is not the same as a better idea in a real brief (see idea 3)." | C7 |
| 30 | U1 deck, Masterclass 2 | "2 · Four skills you can train" / "…originality (unusual links)… — all trainable." | "2 · Four skills tests measure" / "Fluency (many ideas), flexibility (many angles), originality (ideas few other people have), elaboration (work the details). Training can raise these scores." | C7 |
| 31 | U1 B2 lead | "one debate and three exercises follow" | "one debate and two exercises follow" | C11 |
| 32 | U1 Exercise 3 (lesson + deck slide) | Lab "Exercise 3 — Explore the course directory" (`lab_exercise` slide) | lesson section "Autonomous work (outside class) — explore the course directory" (same task text); deck slide removed; outro adds "On your own this week: explore the course Directory (see the lesson)." | C11 |
| 33 | U1 B3 | "B3 · Workshop (Deliverable) — start D1" / "**Workshop opener (geometrical):** protected time on the next graded deliverable." | "B3 · No Workshop yet — start D1 on your own time" / "There is **no Workshop in sessions 1–3**: the session ends after Lab. Workshop time starts in session 4. This week, start D1 on your own time." | C11 |
| 34 | U1 Conclusion | "The four trainable skills come from…" | "The four skills come from…" | C7 |
| 35 | Master lecture lesson (3 cites) + special deck + ML deck labels | "(Eckersall 2017, 26/219)" | "(Eckersall, Grehan, and Scheer 2017, 26/219)" | C8 |
| 36 | Portfolio brief, Rubric (cold review F1) | — (pass conditions only in the unrendered internal line) | "To pass the subject you also need at least 5.0 in the final test and must hand in at least 50% of the course activities — see [Evaluation]." | A4 / F1 |
| 37 | U2 Idea 3, para 1 (cold review F4) | "You do not get past them by censoring them. You get past them by producing more ideas without judging, so the less obvious ones have room to appear." | "In this Lab you get past them by producing more ideas without judging, rather than by censoring them, so the less obvious ones have room to appear." | C2 / F4 |
| 38 | U2 deck, Masterclass 3 (cold review F4) | "Your first ideas are usually the obvious ones. Don't censor them — keep making more without judging, and dig in a different place." | "Your first ideas are usually the obvious ones. In this Lab, don't censor them — keep making more without judging, and dig in a different place." | C2 / F4 |
| 39 | Evaluation, extraordinary session (cold review F8) | "The same final-test minimum and the same 50% minimum of activities apply in the extraordinary session (*convocatoria extraordinaria*)." | "In the extraordinary session (*convocatoria extraordinaria*) the same final mark and final-test minimums apply. You hand in the activities you failed (after the professor's corrections) or did not hand in; the minimum is 50% of the course activities, or else another equivalent activity proposed by the professor." (guía PDF §7.2, read with pdftotext) | A4 / F8 |

Not rendered but changed (1b): `evaluation_feed` in U1 and U2 (`30%`/`70%` → `40%`/`60%`), and the portfolio
`[VERIFIED]` internal line (now points at the PDF + decision record, 60/40, pass conditions; names the renamed Videojuegos JSON).

## Provenance added (for existing quotes; no new citation)

- `U2.map-then-route`: de Bono 1985, node `af8ae4ed-5f05-59e5-beb7-cf72a8e949af`, document `db89dff4…` (English Little Brown PDF, source_hash `c45df305…`), page_index 211, **printed 199** (read from the PDF page). The verbatim matches the node.
- `U2.genius-myth`: Rubin 2023, node `c01a0ed6-3e18-5939-a7f1-b15467388ae4`, page_index 102, printed 103 by the existing index+1 convention (not re-read from print). This covers the existing U2 deck slide 6 quote, which had no line before.
- `U2.six-hats-colours`: de Bono 1985 page_index 43–44 (hat summaries) and 207/220 (blue = control). Checked with `local/athanor.sh search "six thinking hats blue hat green hat" … --top-k 5`, then one query per hat. White "objective facts and figures", red "the emotional view", black "the negative aspects - why it cannot be done", yellow "optimistic … positive thinking", green "creativity and new ideas", blue "the control hat … organizes the thinking itself". The lesson names the hats without a page cite (no new citations in EX1).
- The Csikszentmihalyi 2007 p. 8 quote on U2 Masterclass 2 reuses the existing `U2.fluency-flexibility` line (node `5f7e3435…`). The node text matches the quote word for word.

## Acceptance Criteria Met

- [x] Exit gate passes. I ran `bash creativity-techniques-pedagogy/excellence/PHASE-EX1.exit-gate.sh` at the caller's request (diagnostic only; the harness run is still to come). Result: 18 PASS, `failures: 0`, including `jekyll build`. The baseline run before my edits gave `failures: 16`.
- [x] No student page states the old knowledge-test weight: gate check "no stale 70% knowledge-test weight" PASS.
- [x] Decision weights and both pass conditions are present on the evaluation page: four gate checks PASS.
- [x] No `tao_invented` slide carries an author-date label, and U1 has 2 `lab_exercise` slides: gate check "decks: tao labels + lab counts" PASS. The U1 roles are now cover, 2 analysis, 6 masterclass, lab_opener, 2 lab_exercise, outro.
- [x] Lehrer, "de Bono, Edward. 1981" / `debono-1981` and "fluency thirty" are absent; the Six Hats paragraph names green and blue; every `ref-*` anchor is cited. All of these gate checks PASS.
- [x] Regression: `PHASE-EX0.exit-gate.sh` still gives `failures: 0`.
- [x] Firewall spot check on the built `_site`: `grep -rl -e DECISION-EX0 -e c45df305 -e af8ae4ed -e videojuegos-2026-27 _site` returns nothing. The new internal notes are only inside `publish_internal_metadata` blocks or `{% comment %}`.
- [ ] Cold reviewer re-reads every changed sentence against FINDINGS C1–C11. Pending.

## Local model calls

| # | Model | Purpose | Prompt | Tokens (output) | Result |
| --- | --- | --- | --- | --- | --- |
| 1 | `thessia-scholar-v3` via `local/thessia.sh` (num_predict 400) | Voice pass on the grounded U2 Idea 3 draft (2 paragraphs, 257-word prompt) | scratch file `thessia-u2-idea3.txt` (session scratchpad, not committed) | 301 | **Discarded in full.** It invented two citations ("[(1987)]" for Csikszentmihalyi, "(de Bono 2015)"), added a claim ("distance grows between creator self and created work"), and fell into a ~120-word run-on. The grounded draft shipped unchanged. |

Embedding only: Athanor `search` used `nomic-embed-text` (370 MB) for about 20 queries. Before the Thessia load I checked: `ollama ps` showed only nomic-embed-text; the in-practice `runtime/process.json` (main checkout) lists PID 48350, and `ps -p 48350` found no such process. No opencode or other agent was launched. No second heavy model was loaded.

## Judgment calls

All of these are logged in DECISIONS-LOG.md: the map quote moves to Masterclass 1 / Idea 1; the de Bono pin cite changes to 199; provenance lines added for existing quotes; the How to Pass D1 rubric gets "of D1"; the Directory slide is deleted and moved to the lesson; the Lehrer provenance line is removed; AGENTS.md names the working JSON; no 2026–27 Diseño guía exists; U2/U3 Workshop sections are left alone.

## Downstream surprises (reported, not patched)

1. **Pin cites may use PDF page indexes, not printed folios (EX6).** de Bono 1985 "211" was the PDF index; the printed folio is 199. Other PROVENANCE_LINEs assume printed = index + 1 (Rubin, de Bono 1970, Csikszentmihalyi). The Csikszentmihalyi (`35dcf3a7`) and de Bono 1970 (`bb5aec96`) sources are **EPUBs**, so "page 8" and "page 9" there are synthetic pages, not printed ones. EX6 should re-verify every pin cite against print or state the edition's pagination. I did not change those cites.
2. **The Workshop inconsistency also exists in U2 and U3.** The U2 deck outro says "No Workshop in first lessons — Lab ends the session", but the U2 lesson has "B3 · Workshop (Deliverable) — advance D1" with a Workshop opener. U3 also has "B3 · Workshop — advance D1", and neither deck has a workshop slide. Deliverable 6 names only U1, so I left these alone (EX8/EX9 or a cold-review amendment).
3. **The `#tao-of-creativity` anchor does not exist** on any lesson page. All Tao citation hrefs in U1–U3 decks, including the relabelled U3 slide, point to a missing fragment. The forge says Tao invents should link to `/tao/#<chapter-id>`. This is for EX5/EX9.
4. **TTOD index:** the relabelled U3 aphorism has no `ttod_index` entry (forge TTOD gate). Most existing Tao slides also lack one. Proposals go through `ttod-bridge`, not hand edits, so this is left for the forge owner.
5. **No 2026–27 Grado en Diseño guía** exists in `~/src/unicrawler/output/guides/`. It holds only Videojuegos (`9822001301`), Animación (`9877002301`) and Máster Diseño Gráfico Digital (`PAFH001305`). The weights stay PROVISIONAL (P0).
6. The U2 Idea 3 rewrite now says plainly, without a citation, that later ideas tend to be less obvious. The editorial note flags this as not yet cited. EX6 owns the serial-order evidence.

## Cold-review triage

- Blocking findings: F1 (portfolio pass conditions) fixed — row 36; gate re-run 18 PASS, `failures: 0`
- Non-blocking fixed at the coordinator's request: F4 (rows 37–38), F8 (row 39)
- Other findings (F2, F5, F9 cascade amends): left to the orchestrator

## Blockers

None for the gate. The P0 for the final review is unchanged: the 60/40 weights are PROVISIONAL.

## Resume point

Run `cascade-harness.sh verify … PHASE-EX1.md <this worktree>`, then the cold review. The reviewer should check items 10–21 (U2) against the vault nodes listed above first, and the de Bono 199 correction.
