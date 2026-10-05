# PHASE-EX6 Report

| Field | Value |
| --- | --- |
| **status** | PARTIAL. The work is done and the exit gate has 0 failures. 40 of the required works are still `gap` and wait for procurement. Next: `cascade-harness.sh verify`, then cold review. |
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

- **Year changes.** Chen 2012 → 2011 (copyright page), Craft 2003 → 2000 (first edition; the e-Library edition keeps the print pages), Csikszentmihalyi 2007 → 1996 (the EPUB is a 2007 e-book of the 1996 text). These follow the "original year" rule and are logged in DECISIONS-LOG.
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
