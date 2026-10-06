# PHASE-EX6 Report

| Field | Value |
| --- | --- |
| **status** | PARTIAL (round 3 after round-2 cold review FAIL; round-2 F1, F2, F4 fixed; earlier rounds: F1–F10). The work is done and the exit gate has 0 failures. 40 of the required works are still `gap` and wait for procurement. Next: `cascade-harness.sh verify`, then cold review. |
| **started_at / finished_at** | 2026-10-05 / 2026-10-05 |
| **branch / worktree** | `cascade/excellence-6` · `creativity-techniques-uem-integration-excellence-6` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT. Under §2 EX6, only works already in the library or legitimately open access were ingested; everything else is a gap. |
| **cascade_amended** | No orchestrator or phase files changed. One forge rule was extended (`forge/STUDENT-SLIDESHOW-FORGE.mdc` rule 4: references come from `references.yml` and printed pages). This was an intended change, and no downstream assumption broke. |

## Outcome

- **Single bibliography.** All entries now live in `docs/_data/references.yml`: 23 Chicago author-date entries keyed `surname-year`. Each records the original year and the edition used. `docs/_includes/references.html` builds each lesson's References list from its `references:` front-matter keys, sorted alphabetically, with `<li id="ref-<key>">`. U1, U2, U3 and the master lecture no longer hand-write `<span id="ref-…">`.
- **Manifest.** `excellence/research-manifest.yml` has 63 entries: 23 `verified` and 40 `gap`. It covers every required work in the PHASE-EX6 table, plus A3/F4 (Osborn 1953, Beaty and Silvia 2012, Ward 1994) and A4/F7 (Verón 1988, Steimberg 1993 vs 2013, Chion, Alexander).

| Unit | Works cited in the lesson (all verified) | Required works still gap | Distinct works cited (gate floor 8) | PROVENANCE_LINE |
| --- | --- | --- | --- | --- |
| U1 | 8 | 13 | 8 | 14 |
| U2 | 14 | 16 | 14 | 22 |
| U3 | 9 | 6 | 9 | 13 |
| ML | 4 | 6 | 4 (no floor) | 9 |

- **Every existing pin cite was re-checked** against the printed folio, read with `pdftotext -layout`. EPUBs were checked against their page-list where one exists, and otherwise cited by chapter or section (A3/F2–F4). Every verified PROVENANCE_LINE now declares `page_basis=printed|section`.
- **Probe (A2/F2).** `uncited_references` now reads front-matter `references:` keys, so it follows `references.yml`. Legacy spans still count, and master lectures are scanned too. The output shape is unchanged. The new test `tests/probe-references.test.mjs` has 4 cases, and they pass. One of them shows that an uncited key gets reported.
- **Decks follow the lessons.** In U1–U3 and the master-lecture `content.json`, I updated labels, `#ref-` hrefs and speaker notes, then re-rendered `docs/_includes/decks/*.html`. The U1 notes for ideas 4–6 no longer say "no page source yet". The browser check is green: 325 slide views, 0 failures.
- **FINDINGS closed or narrowed:**
  - C9: one entry per work.
  - C12: U1 now has a definition, models, importance, a myth and problem finding. U2 names its evidence. U3 Exercise 1 cites Dow et al. 2010.
  - A5: the guía core works are mapped in the manifest. Only verified works appear in student text.

## Vault inventory of required works (before EX6)

I checked `~/ahmes-library/scholar/documents/` (548 documents) and the on-disk bibliography `~/projects/ruvebal/scholar/bibliographies/` before doing anything else.

| Required work | In library? | Action |
| --- | --- | --- |
| Buchanan 1992 | yes (b31bf6e2) | verified, cited U1, U3 |
| Schön 1983 | yes (4d215203, EPUB with print-page anchors) | verified, cited U1, U3 |
| Kimbell 2011 (and Part II 2012) | yes (15368c98; d8c46e13) | 2011 verified, cited U1 |
| de Bono 1985 | yes (c45df305) | re-verified p. 199 |
| Csikszentmihalyi 1988/1999 | no; the 1996 book is held (35dcf3a7) | systems model cited from 1996, chap. 2; 1988/1999 = gap |
| Osborn 1953 *Applied Imagination* | **0-byte PDF + incomplete `.part`** on disk | gap. Osborn 1942 *How to Think Up* (96048e6a) is held and verified instead. |
| Amabile 1982/1983 | no; Amabile 1979 held (a82725bb) | 1979 verified (U2, U3); 1982, 1983 = gap |
| Eberle 1971 | no; Eberle 1974 (unrelated paper) held | gap |
| Steimberg | 2013 Eterna Cadencia edition held (d639c32d); 1993 Atuel not held | both gap (no claim placed) |
| Chion | held (b2e76714, 2019 2nd English ed.) | gap (no claim placed; removed in EX2) |
| Alexander | held (0ee67c07, 2011) | gap (no claim placed; removed in EX2) |
| Knapp et al. 2016 | EPUB on disk (`bibliographies/web_design/`), not ingested | **ingested** → 98b7e339, verified U3 |
| Colzato et al. 2012 | no; open access (Frontiers, CC BY-NC) | **downloaded and ingested** → a9393760, verified U2 |
| Dow et al. 2010 | no; authors' copy on the Stanford HCI publications page | **downloaded and ingested** → 4525b702, verified U3 |
| OECD 2024 (PISA 2022 Vol. III) | no; open access | download refused (oecd.org HTTP 403 to curl) → gap |
| All other required works (Runco and Jaeger, Rhodes, Kaufman and Beghetto, Boden, Wallas, Guilford, Torrance, Benedek, Scott et al., Getzels and Csikszentmihalyi, Diehl and Stroebe, Mullen et al., Rohrbach, Zwicky, Gordon, Koestler, Jansson and Smith, Ward, Beaty and Silvia, Rietzschel et al., Puccio et al., Rodari, Young, Houde and Hill, Buxton, Goldschmidt, Dorst and Cross, Brown, Verón, Ericsson and Simon) | no | gap |

## Pin-cite re-verification (old → new, basis)

| Source (key) | Old pin | New pin | Basis | How checked |
| --- | --- | --- | --- | --- |
| Chen (chen-2011) | 2012, 41 (×4) | **2011, 26** | printed | PDF 41 head "26 Chapter 2". © 2011 (Higher Education Press and Springer). |
| Chen | 2012, 40 | **2011, 25** | printed | PDF 40 head "2.3 Divergent Thinking 25" |
| Craft (craft-2000) | 2003, 43 | **2000, 30** | printed | PDF 43 folio 30. First published 2000; e-Library edition 2005. |
| Csikszentmihalyi (csikszentmihalyi-1996) | 2007, 8 | **1996, chap. 3** | section | EPUB (HarperCollins e-books 2007, text © 1996) has no page-list; quote is in `ch03.xhtml` |
| de Bono 1970 | 9 (×2) | **introduction** | section | Penguin EPUB, no page-list; `introduction.html` |
| de Bono 1970 | 12 | **chap. "Difference between Lateral and Vertical Thinking"** | section | `chapter002.html` |
| de Bono 1970 | 17 | **chap. "The Generation of Alternatives"** | section | `chapter007.html` |
| de Bono 1970 | 27 | **chap. "Choice of Entry Point and Attention Area"** | section | `chapter017.html` |
| de Bono 1970 | 30 | **chap. "The New Word PO"** | section | `chapter020.html` |
| de Bono 1985 | 199 | 199 (unchanged) | printed | PDF 212 foot "199" |
| Raymond 2001 | 57 | **44** | printed | PDF 57 folio 44 (rev. ed. Jan 2001) |
| Raymond 2001 (internal only) | 62 | 49 | printed | PDF 62 folio 49 |
| Markman, Klein, and Suhr 2009 | 192 | **Wong, Galinsky, and Kray 2009, 161 and 168** | printed | The old pin cited the editors and the PDF page of a chapter conclusion. Chapter 11 is by Wong, Galinsky and Kray (pp. 161–74). |
| Rubin 2023 | 103 | **323** | printed | EPUB page-list (hardcover ISBN 9780593652886) |
| Rubin 2023 | 104 | **326** | printed | EPUB page-list |
| Rubin 2023 | 123 | **386** | printed | EPUB page-list |
| Hüppauf and Wulf 2009 | 32 | **21** | printed | PDF 32 has no folio (part opener); PDF 33 = 22, PDF 30 = 18 |
| Smith 2013 (internal only) | 42 | 27 | printed | PDF 42 head "27" |
| Cross 2006 | 17 | **vi** | printed | The quoted words "resolving ill-defined problems … solution-focused" are in the Preface (PDF 6). PDF 17 does not hold them. |
| Cross 2006 | 46 | **37** | printed | PDF 47 head "… in Design 37" |
| Cross 2006 | 93 | **86** | printed | PDF 93 head "86" |
| Beghetto and Karwowski 2025 | 1 | **3** | printed | p. 1 was the unpaginated abstract page; the body definition is on printed p. 3 (PDF 9) |
| Eckersall, Grehan, and Scheer 2017 | 26 | **15** | printed | PDF 26 head "… 15" |
| Eckersall, Grehan, and Scheer 2017 | 219 | **211** | printed | PDF 219 head "POST-NMD? 211" |

I also fixed an internal typo: in the U3 Lab block, node id `c47a859b-…-15d5e782a90e` is now `…-15d5e692a90e`.

## New citations (verified works, Ahmes node ids)

| Unit | Claim | Cite | Node (coat) |
| --- | --- | --- | --- |
| U1 | Definition: novelty and meaningfulness | Beghetto and Karwowski 2025, 3 | 10055dde-d470-5e71-afe8-cc9c22f9b52d (09e171eb) |
| U1 | NACCCE definition | NACCCE 1999, 29, quoted in Fisher 2004, 19 | ab767997-4ce3-52a1-b0b0-7d08413459ea (25b9cc1b) |
| U1 | Importance | Beghetto and Karwowski 2025, 9 | fb98d0b6-3057-5f15-a81b-08c9c4370d95 |
| U1 | Myth: creativity "inside special heads"; systems model | Csikszentmihalyi 1996, chap. 2 | 039dc163-0bea-5daa-94f1-93b8b3566861; 5f0d22f6-5fb0-59a0-beef-e1743ed9afb9 (35dcf3a7) |
| U1 | Stage description and its limits | Csikszentmihalyi 1996, chap. 4 | 237de099-2e1a-594e-8c2e-781a9cf98cf2; 92daceef-a7c9-5dd4-83dd-81d234e7a357 |
| U1 | Problem finding (presented vs discovered problems) | Csikszentmihalyi 1996, chap. 4 | bf57d7c1-4bd7-53f8-841e-f2f6178de6ea |
| U1 | Problem setting | Schön 1983, 40 | 2e436542-6dc8-5ac4-8aed-c984d42965dc (4d215203) |
| U1, U3 | Wicked problems | Buchanan 1992, 16 | 57cba3a9-9281-5b62-a24f-dd743d0391af (b31bf6e2) |
| U1 | Reflection-in-action | Schön 1983, 68 | a81b7ced-4560-580f-9a18-30c99371ce28 |
| U1 | Design-thinking critique | Kimbell 2011, 285 | 7bfa6176-9891-514e-987f-d33641e3d76f (15368c98) |
| U2 | Attention exercise (meditation study) | Colzato, Ozturk, and Hommel 2012, 1 | 2455fd0e-0d13-582d-b958-0b3fb7194aca (a9393760) |
| U2, U3 | Expected evaluation lowers judged creativity | Amabile 1979, 221 | f5659140-afc2-5d29-bb50-d801c99c4e39 (a82725bb) |
| U2 | Fixation (Jansson and Smith, as reported) | Cross 2006, 81–82 | 0579db22-f01f-5783-97b6-b9103f006717; 44445d0e-4302-5b46-bb48-997662225816 (4104b3ed) |
| U2 | "Generate numerous ideas" | Norman 2013, 226 | 550af0b7-9635-5bb5-aac4-ad591607be5b (f31e7737) |
| U2, U3 | Deferred judgement | Osborn 1942, chap. 4 | f9bd5077-86b6-5aa9-8e59-db0da6edc4eb (96048e6a) |
| U2 | Counterfactual alternatives and their limits | Wong, Galinsky, and Kray 2009, 161, 168 | 82574166-5706-5480-80c3-b3bfe60b4e7f; 19084e77-06f1-5a20-819f-6c46eb3b71f7 (e77c3d8d) |
| U2 | Selection is the neglected half | Persaud 2007, 68 | 3f7bcf30-fab9-5f94-8193-6dfafdbc25df (c2d88ecc) |
| U3 | Prototype answers questions | Knapp, Zeratsky, and Kowitz 2016, chap. 13 | 9b6eece5-281f-552e-8dfe-ebfa855d4c7e (98b7e339) |
| U3 | Iteration can cause fixation; parallel prototyping (Exercise 1) | Dow et al. 2010, 18:1 | 68ffb4c6-e459-52fc-8f67-e9acb111ef7f (4525b702) |
| U3 | Reflective conversation with the situation | Schön 1983, 79 | 6f338205-e0df-5f6a-af28-05067bfe7975 |
| U3 | Creative-agency definition (corrected page) | Beghetto and Karwowski 2025, 3 | ef1eaf5c-9058-52b2-b4ac-b24f5a738628 |

Claims I narrowed so they do not outrun the evidence:

- **U2 idea 3.** It no longer says that first ideas are "the ones most people in the room would also have", and it no longer says that producing more yields better ideas. That is the serial-order / quantity claim, and its sources are gaps. The idea now rests on fixation evidence and practice advice.
- **U2 Hüppauf and Wulf.** The text now says the three terms are "related terms that still need to be told apart". It no longer says they "are not synonyms".
- **U2 Rubin p. 326.** The text now uses Rubin's own claim (the practice you keep doing; test methods on yourself). It no longer says practice "does not replace judgement".
- **U2 Wong et al.** The text now states the limit on p. 168: what-if thinking hurt the generation of new ideas.

## Gaps / procurement list (professor)

All gaps are in `research-manifest.yml` and in `forge/unit-enrichment/U1|U2|U3/PROFESSOR.md` §8.1. None appears in student text.

1. **Free, quick:**
   - OECD 2024 *PISA 2022 Results (Volume III)*. Open access; download it in a browser via doi:10.1787/765ee8c2-en.
   - Osborn 1953 *Applied Imagination*. Finish or replace the broken download in `bibliographies/creativity/` (the PDF is 0 bytes and a `.part` file sits beside it).
2. **A3/F4 research for "producing more":** Beaty and Silvia 2012; Ward 1994 (with Osborn 1953).
3. **U1 core:** Runco and Jaeger 2012; Kaufman and Beghetto 2009; Benedek et al. 2021; Scott, Leritz and Mumford 2004; Rhodes 1961; Boden 2004; Getzels and Csikszentmihalyi 1976; Guilford 1950; Torrance 1966; Wallas 1926; Amabile 1983; Csikszentmihalyi 1988/1999.
4. **U2:** Diehl and Stroebe 1987; Mullen, Johnson and Salas 1991; Rietzschel, Nijstad and Stroebe 2006; Amabile 1982; Jansson and Smith 1991; Eberle 1971; Rohrbach 1969; Zwicky 1969; Gordon 1961; Koestler 1964; Puccio, Mance and Murdock 2011; Rodari 1973; Young 1965.
5. **U3:** Houde and Hill 1997; Dorst and Cross 2001; Goldschmidt 1991; Buxton 2007; Brown 2009.
6. **Master lecture:**
   - Verón 1988 (needed for Lens B) and Ericsson and Simon 1993.
   - Steimberg 1993 (Atuel). The 2013 edition is held; if it will be used, pick a passage and confirm it.
   - Chion and Alexander are held. Place a claim only if the lecture needs one.

## What I ran (real results)

- `bash PHASE-EX6.exit-gate.sh`: first run had 1 failure (my migration notes quoted the old Chen pins). I reworded the notes, and the final gate state is **0 failures**. EX6 gate checks inside the run: manifest/refs/citations agree; page_basis declared; jekyll build PASS.
- `bash PHASE-EX0…EX5.exit-gate.sh`: **all exit 0, 0 failures**.
- `npm ci`, then `npm test`: **47 pass, 0 fail**.
- `node --test creativity-techniques-pedagogy/excellence/tests/probe-references.test.mjs`: **4 pass**.
- `npm run test:browser`: **325 slide views, 0 failures**.
- `npm run build` (prebuild hydrate + rehydrate + render, jekyll, `verify:publication`): **exit 0**, "Publication safety passed". The rebuild left no tracked changes.
- Probe on the live tree:
  - `uncited_references` is empty for U1, U2, U3 and the master lecture.
  - U4 has `ref-lucas-knotts-2026`. That lesson is out of scope and the issue was already there.
  - `leak_terms` finds only the known U4 `profield` item (release item from A6/F7).
- In the built HTML of all four lessons, every `href="#ref-…"` has a matching `id="ref-…"` and every listed entry is cited.

## Local calls (LOCAL-EXECUTION.md)

| Call | Count | Notes |
| --- | --- | --- |
| `ahmes ingest -L scholar --save-db --treeshake` (docling / epub, local) | 3 | Colzato 2012 (117 nodes), Dow 2010 (400 nodes), Knapp 2016 EPUB (2161 nodes) |
| `ahmes query --nodes` / `--cite` | about 30 | node ids and page indexes for every PROVENANCE_LINE (read only) |
| `local/athanor.sh search` (project `profield-creativity-techniques`, scholar) | 4 | wicked problems; Osborn deferred judgement; serial order (no primary found); fixation (found Cross 2006 pp. 81–82, Norman 2013) |
| `pdftotext -layout` / EPUB page-list reads | all pins | printed folios read from the page |
| `thessia-scholar-v3` via `local/thessia.sh` | 1 (98 tokens, about 30 s) | Voice pass on the U1 definition paragraph. **Discarded**: it dropped years and pages, changed the citation format and paraphrased away a quote, so it failed the citation-fidelity rule. |
| Cloud | orchestration, edits, verification reasoning | No cloud model drafted facts. |

I checked serialization first: `in-practice/runtime/process.json` names PID 48350, which is not alive. `ollama ps` showed only a small qwen2.5:3b model and an embedder from another client. Neither was an in-practice job.

## Files changed

- `docs/_data/references.yml` (new) · `docs/_includes/references.html` (new)
- `docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md`, `u-2-idea-generation-selection/index.md`, `u-3-development-solutions/index.md`, `docs/lessons/en/master-lectures/creative-process-analysis/index.md`
- `docs/tracks/en/uem/2627-ct/u-{1,2,3}-*/data/content.json`, `docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json`, `docs/_includes/decks/*.html` (re-rendered)
- `creativity-techniques-pedagogy/excellence/research-manifest.yml` (new), `probe/excellence-probe.mjs`, `tests/probe-references.test.mjs` (new)
- `creativity-techniques-pedagogy/forge/unit-enrichment/U{1,2,3}*/PROFESSOR.md` (§8.1), `U1/U2 MAIN-IDEAS.yml` (pins), `forge/CREATIVE-PROCESS-ANALYSIS.execute.md` (years), `forge/STUDENT-SLIDESHOW-FORGE.mdc` (rule 4 note)
- Outside the repo (sanctioned): three new Ahmes documents under `~/ahmes-library/scholar/documents/` (coats a9393760, 4525b702, 98b7e339). Two OA PDFs were copied into `~/projects/ruvebal/scholar/bibliographies/creativity/`.

## Uncertain / for the cold reviewer

- **Year changes.** Chen 2012 → 2011 (copyright page), Craft 2003 → 2000 (first edition; the e-Library edition keeps the print pages), Csikszentmihalyi 2007 → 1996 (the copy shows only © 2007; the 1996 year rests on outside evidence — see round 2, F7). These follow the "original year" rule and are logged in DECISIONS-LOG.
- **Chapter locators.** de Bono 1970, Osborn 1942, Knapp 2016 and Csikszentmihalyi 1996 are cited by chapter title or number because their copies have no print pages. If the professor procures paginated copies, these become printed pins.
- **Dow et al. 2010** was fetched from the authors' lab page. The PDF is the ACM-typeset version carrying ACM's personal/classroom-use notice. I judged this legitimate green open access and logged it. A stricter reading would make it a gap; U3 would still cite 8 works.
- **Osborn 1942 stands in for Osborn 1953** on deferred judgement only. "Quantity breeds quality" is not claimed anywhere.
- **The browser check passed, but some lab-slide citations are longer.** U3 lab-1 and lab-2 now carry chapter-title locators for de Bono 1970. EX8 should re-measure headroom once the Lab text grows.
- **I did not re-read the blue-hat control pages** of de Bono 1985 (old PDF refs 207/220). That internal line declares only the hat-summary pages (printed 31–32).

## Resume point

Next steps:

1. Run `cascade-harness.sh verify <integration>/creativity-techniques-pedagogy/excellence PHASE-EX6.md <this worktree>`.
2. Commit the runner's `PHASE-EX6-VERIFY-LOG.md`.
3. Run the cold review: sample 5 new citations and check quote, page and claim. Good candidates: Schön 68, Buchanan 16, Wong et al. 168, Dow et al. 18:1, Beghetto and Karwowski 3.

Do not open EX7 until EX6 is triaged. Under the resume rule, EX7 may follow a PARTIAL EX6.

## Round 2 (cold review FAIL → fixes, 2026-10-06)

| Finding | Fix | Where |
| --- | --- | --- |
| F1 (P1) U2 deck masterclass-3 notes kept the removed "first ideas … most people in the room" claim | Slide sentence "usually" → "often"; notes rewritten from lesson idea 3 (fixation, Cross 2006, 81–82; Norman 2013, 226; Osborn 1942, chap. 4); re-rendered | U2 `content.json`, `_includes/decks/u-2-*.html` |
| F2 (P1) U3 notes said "no page cite in the lesson" for ideas 2, 3, 6; Lab 1 notes lacked Dow | Notes now carry the lesson's cites (Osborn/Amabile; Dow et al. 18:1; Schön 79; Dow in Lab 1); every deck's notes also synced (U2 m1 Amabile/Colzato, m4 Wong 168 limit, m5 Persaud; U3 m1 Knapp, m5 Buchanan) | U1–U3 `content.json`, decks re-rendered |
| F2 follow-up | New check `tests/deck-lesson-sync.test.mjs`: every deck pin (sentence, label, notes) must appear with the same locator in the lesson's student text (or a lesson PROVENANCE_LINE with `surface=deck`); no "no page cite/source" notes. 8/8 pass | `excellence/tests/` |
| F3 (P1) U3 "art students" | "in an experiment in which college students made artworks, those who expected to be evaluated produced work that was judged less creative" | U3 idea 2 |
| F4 (P1) U2 Craft 30 on "definitions unstable" | Cite dropped; clause is course wording. Full claim re-check below | U2 idea 2 |
| F5 | "Training can raise scores" → "Many workshops try to raise these scores" (U1 lesson + deck), "Workshops try to raise those scores" (U2 lesson + deck) | U1, U2 |
| F6 | U1 conclusion now states what each author argues (Schön: problems built from uncertain situations, reflection while acting; Buchanan: wicked, no definitive formulation; Kimbell: claims for design thinking overstated) and says none is about creativity tests | U1 |
| F7 | Csikszentmihalyi 1996: the held EPUB shows © 2007 only; 1996 rests on Persaud 2007's reference list (in the library) and the standard record of the 1996 HarperCollins first edition. Logged | DECISIONS-LOG |
| F8 | U1–U3 `PROFESSOR.md` §7 tables rewritten to EX6 pins, nodes and resolver status | briefs |
| F9 | Every VERIFIED PROVENANCE_LINE now records `resolver_evaluator_safe=` as `ahmes query --cite` returns it (36 yes, 13 no, 5 BIBLIO-GAP, 1 line has no node) plus `verified_by=manual-page-read`; the old `evaluator_safe=yes` claims are gone | 4 lessons |
| F10 | `edition_note` rendered after the Chicago entry for reprints/e-books (7 works) | `references.yml`, `references.html` |

### Claim re-check of every carried-over (pre-EX6) sentence on a re-pinned cite (A3/F2)

| Lesson | Sentence (claim) | New pin | Page says | Result |
| --- | --- | --- | --- | --- |
| U1 idea 1, ML, U2 idea 1 | quote "The same creative act may involve both divergent and convergent thinking" / warrant for generate-then-select | Craft 2000, 30 | verbatim | holds |
| U2 idea 2 | "definitions of what counts as creative remain unstable" | Craft 2000, 30 | not on page | **cite removed** (F4) |
| U1 idea 2 | Guilford's four abilities "as summarised by Chen"; Fluency quote | Chen 2011, 26 | verbatim list | holds |
| U1 idea 3, ML | paper-clip / music quote | Chen 2011, 26 | verbatim | holds |
| ML | "Divergent thinking … major hallmark" | Chen 2011, 25 | verbatim | holds |
| U1 idea 2, U2 ideas 3 and 6, ML | fluency/flexibility/originality triad; "two opposite ways"; "dimensions most tests measure and most workshops try to enhance" | Csikszentmihalyi 1996, chap. 3 | verbatim | holds; "training can raise scores" was not on the page → softened (F5) |
| U2 idea 1 | map-then-route quote | de Bono 1985, 199 | verbatim | holds |
| U2 idea 2 | lateral generative vs vertical selective | de Bono 1970, introduction | "Lateral thinking is generative. Vertical thinking is selective." | holds; now quoted |
| U2 idea 3 | dig-hole quote | de Bono 1970, introduction | verbatim | holds |
| U2 idea 3 | "looking for alternatives instead of blindly accepting the most obvious approach" | de Bono 1970, chap. "The Generation of Alternatives" | verbatim | holds |
| U2 idea 4 | use information to provoke a new pattern | de Bono 1970, chap. "Difference between Lateral and Vertical Thinking" | chapter 2: "Vertical thinking is analytical, lateral thinking is provocative"; "a way of bringing about repatterning" (nodes 56c5f218, 90e25139). *Round 3 correction:* the phrase "uses information … provocatively" quoted in round 2 is the wording of chapter 4 ("Lateral thinking uses information provocatively"); the round-1 node 21f89015 sentence also appears in the EPUB's chapter 2 and introduction files | holds on chapter 2 |
| U2 idea 4 | Raymond tool quote | Raymond 2001, 44 | verbatim | holds |
| U2 idea 4 | what-if thinking and alternatives | Wong, Galinsky, and Kray 2009, 161/168 | "if only"/"what if"; negative effect on novel generation | holds (rewritten in round 1) |
| U2 idea 5 | editing as taste revealed in curation; what is included, what is not, how pieces sit together | Rubin 2023, 386 | "Our taste is revealed in how our work is curated. What's included, what's not, and how the pieces are put together." | holds |
| U2 idea 6 | practice you keep doing; test methods on yourself | Rubin 2023, 326 | verbatim (rewritten in round 1) | holds |
| U2 deck m6 | tortured-genius quote | Rubin 2023, 323 | verbatim | holds |
| U2 conclusion | imagination, fantasy, creativity related terms | Hüppauf and Wulf 2009, 21 | "connections between … imagination, fantasy and creativity"; "field of related terms" | holds (narrowed in round 1) |
| U3 idea 1 | "resolving ill-defined problems" + solution-focused | Cross 2006, vi | verbatim | holds |
| U3 idea 4 | sketching problem/solution quote | Cross 2006, 37 | verbatim | holds |
| U3 Lab 1 | "compare relationships, rhythm, and emphasis across the three starts" | Cross 2006, 86 | dialectics of sketching: "seeing that"/"seeing as" | **rewritten**: cite now carries only the seeing-that/seeing-as summary; the comparison is course wording |
| U3 Lab 1 | "watch the temptation to solve the obvious way and paste the entry point on afterwards" | de Bono 1970, chap. "Choice of Entry Point…" | not on page; page says "a different entry point will usually mean a different train of ideas" | **rewritten**: cite moved to that quote; the warning is course wording |
| U3 Lab 2 | delay judgement | de Bono 1970, chap. "The New Word PO" | "The usefulness of delaying judgement is one of the most basic principles of lateral thinking." | holds |
| U3 idea 5 | creative agency definition | Beghetto and Karwowski 2025, 3 | verbatim (now quoted) | holds |
| ML | Eckersall material properties quote; compositional device quote | Eckersall et al. 2017, 15 / 211 | verbatim | holds |

### Round-2 results (real output)

- `PHASE-EX0 … EX6.exit-gate.sh`: all exit 0, `failures: 0`.
- `npm test`: 47 pass, 0 fail. `node --test …/probe-references.test.mjs …/deck-lesson-sync.test.mjs`: 12 pass, 0 fail.
- `npm run test:browser`: 325 slide views, 0 failures (decks with longer notes still fit; notes are not on the slide face).
- `npm run build` (prebuild, validate, jekyll, verify:publication): exit 0, "Publication safety passed"; rebuild left no tracked changes.
- Built site: "most people in the room" and "no page cite" occur in no lesson or deck page; probe `uncited_references` empty for U1–U3 and ML (U4 `ref-lucas-knotts-2026` pre-existing, out of scope).

Resume point unchanged: harness verify → fresh cold review of F1–F4 spots.

## Round 3 (round-2 cold review FAIL → fixes, 2026-10-06)

- **F1 (blocking).** U3 deck `lab-1`: notes now give the supported statements: de Bono, "a different entry point will usually mean a different train of ideas"; Cross, sketching as a dialogue between "seeing that" (reflective criticism) and "seeing as" (reinterpretation) (p. 86); Dow et al. 18:1. The "compare relationships, rhythm and emphasis" and "paste the entry point on afterwards" lines are labelled "Course wording (not from the sources)". The slide sentence is re-pinned to de Bono only, matching the lesson.
- **F4.** U2: "a 'fixation' effect suggested by Jansson and Smith, as Cross notes" (Cross 81 says "suggested by").
- **F2.** Claim re-check row U2 idea 4 corrected above (chapter 2 wording; "uses information provocatively" is chapter 4).

### Notes sweep: every attributed clause in all deck notes (U1 8, U2 8, U3 8 slides with notes; ML deck has no notes)

Every `Source:` line now attributes per claim, and ends with "Other bullets are course wording" where unattributed bullets exist.

| Deck · slide | Attributed clause | Source | On the page? | Action |
| --- | --- | --- | --- | --- |
| U1 m1 | quote; divergent / convergent (= possibilities that fit a set of needs) | Craft 2000, 30 | yes ("finding possibilities which fit a set of needs") | per-claim source |
| U1 m2 | four abilities; Fluency quote | Chen 2011, 26 | yes | — |
| U1 m2 | triad; "most workshops try to enhance" | Csikszentmihalyi 1996, chap. 3 | yes | bullet worded to match |
| U1 m3 | paper-clip / music | Chen 2011, 26 | yes | — |
| U1 m4 | problems built from uncertain situations; wicked formulation ↔ solution; presented vs discovered | Schön 40; Buchanan 16; Csikszentmihalyi chap. 4 | yes | per-claim source |
| U1 m5 | not bound by established technique | Schön 1983, 68 | yes | quoted |
| U1 m6 | claims for design thinking overstated | Kimbell 2011, 285 | yes ("issues that undermine the claims") | quoted |
| U2 m1 | map/route quote | de Bono 1985, 199 | yes | — |
| U2 m1 | one act holds divergent + convergent | Craft 2000, 30 | yes | "warrant" made explicit |
| U2 m1 | expected evaluation → judged less creative | Amabile 1979, 221 | yes | — |
| U2 m1 | open-monitoring meditation helped divergent task | Colzato et al. 2012, 1 | yes | — |
| U2 m1 | "same minute makes both weaker"; honest audit; first answer | — | not sourced | marked course wording |
| U2 m2 | slide quote (triad) | Csikszentmihalyi 1996, chap. 3 | yes | **added** (Source line lacked it) |
| U2 m2 | "Lateral thinking is generative. Vertical thinking is selective." | de Bono 1970, introduction | yes | — |
| U2 m3 | dig-hole quote | de Bono 1970, introduction | yes | — |
| U2 m3 | "hang on to their principal solution concept"; fixation suggested by Jansson and Smith | Cross 2006, 81–82 | yes | quoted; "suggested by" |
| U2 m3 | "Generate numerous ideas…" | Norman 2013, 226 | yes | full sentence |
| U2 m3 | "Criticism must be withheld until all ideas are in." | Osborn 1942, chap. 4 | yes | quoted |
| U2 m3 | alternatives vs most obvious approach | de Bono 1970, chap. "The Generation of Alternatives" | yes | — |
| U2 m3 | produce more without judging; count your ideas | — | not sourced | **marked course wording** (was under the Source line) |
| U2 m4 | tool quote | Raymond 2001, 44 | yes | — |
| U2 m4 | provocative; "a way of bringing about repatterning" | de Bono 1970, chap. 2 | yes | **added bullet** (the cite had no clause in the notes) |
| U2 m4 | what-if widens alternatives; can hurt new generation | Wong et al. 2009, 161, 168 | yes | — |
| U2 m4 | Six Hats colours; Oblique Strategies | — | colours on de Bono 1985, 31–32 but not cited in the lesson | **marked course wording** |
| U2 m5 | editing as taste in curation | Rubin 2023, 386 | yes | quoted |
| U2 m5 | creativity defined by production; selection neglected | Persaud 2007, 68 | yes | quoted |
| U2 m6 | tortured-genius quote | Rubin 2023, 323 | yes | — |
| U2 m6 | practice you keep doing; test methods on yourself | Rubin 2023, 326 | yes | — |
| U2 m6 | dimensions tests measure; workshops try to enhance | Csikszentmihalyi 1996, chap. 3 | yes | — |
| U2 m6 | "landmark work is rare…"; "not better ideas" | — | not sourced | marked course wording |
| U3 m1 | "The prototype is meant to answer questions…" | Knapp et al. 2016, chap. 13 | yes | — |
| U3 m1 | ill-defined problems | Cross 2006, vi | yes | stated as "the lesson also cites" (no bullet claims it) |
| U3 m2 | Osborn rule; Amabile college students | Osborn chap. 4; Amabile 221 | yes | — |
| U3 m3 | iteration can cause fixation | Dow et al. 2010, 18:1 | yes | — |
| U3 m4 | problem and solution space together | Cross 2006, 37 | yes | **quoted**; "sketching puts a thought outside your head…", "rhythm and emphasis" now **marked course wording** (were under the Cross 37 Source) |
| U3 m5 | wicked formulation ↔ solution | Buchanan 1992, 16 | yes | — |
| U3 m5 | creative agency definition | Beghetto and Karwowski 2025, 3 | yes | **now verbatim** (was a paraphrase from the abstract) |
| U3 m6 | situation "talks back"; reflective conversation | Schön 1983, 79 | yes | — |
| U3 lab-1 | entry point → different train of ideas | de Bono 1970, chap. "Choice of Entry Point…" | yes | **added** (F1) |
| U3 lab-1 | seeing that / seeing as | Cross 2006, 86 | yes | **added** (F1) |
| U3 lab-1 | parallel prototyping result | Dow et al. 2010, 18:1 | yes | — |
| U3 lab-1 | rhythm/emphasis; paste the entry point on | — | not on the pages | **labelled course wording** (F1) |
| U3 lab-2 | delaying judgement | de Bono 1970, chap. "The New Word PO" | yes | — |

**Limitation for EX11:** `tests/deck-lesson-sync.test.mjs` checks author-date pins and locators only (and stale "no page cite" notes). It cannot tell whether a clause next to a cite is on that page; that needs a human page check (this sweep) or a structured `claims: [{text, cite}]` field in the deck schema that a test could compare with the lesson's PROVENANCE_LINE verbatims.
