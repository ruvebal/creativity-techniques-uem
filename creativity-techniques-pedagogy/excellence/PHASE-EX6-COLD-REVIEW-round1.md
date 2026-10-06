# PHASE-EX6 Cold Review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (Claude Opus 5.5, separate session; did not implement EX6) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | PARTIAL: exit gate 0 failures; 23 verified / 40 gap; every pin re-verified against the printed page; decks follow lessons; U2 idea 3 no longer claims that first ideas are "the ones most people in the room would also have" |
| **verdict** | FAIL |

Scope: branch `cascade/excellence-6` at `c8f1dc8` (runner verify log commit `bcfeb0e` is the parent; `c8f1dc8` only adds the log). PARTIAL scope is fine. The FAIL comes from four citation and deck-sync defects that put wrong or stale claims in published student HTML (F1–F4). The vault work, the year changes, the Markman→Wong re-attribution, the bibliography include, the probe change and every regression check hold.

## Citations checked (source page read by this reviewer)

Method: `pdftotext -layout -f N -l N` on the vault source PDF, checking the printed folio in the running head or foot; for EPUBs, the print-page anchors (`id="page_N"`) or the nav page-list; for EPUBs with no pagination, the chapter file. Sources live under `~/ahmes-library/scholar/documents/<slug>_<coat>/source/original/`.

| # | Cite (unit) | Source page read | Quote/claim at that page | Student sentence faithful? | Chicago entry | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Schön 1983, 68 (U1) | EPUB `Chapter02.html`, between anchors `page_68` and `page_69` | "he becomes a researcher in the practice context … constructs a new theory of the unique case" | yes | Basic Books, © 1983 (Copyright.html) | PASS |
| 2 | Schön 1983, 40 (U1) | `Chapter02.html`, between `page_40` and `page_41` | "problems do not present themselves … puzzling, troubling, and uncertain" | yes | as above | PASS |
| 3 | Schön 1983, 79 (U3) | `Chapter03.html`, between `page_79` and `page_80` | "talks back" … "this conversation with the situation is reflective" | yes | as above | PASS |
| 4 | Buchanan 1992, 16 (U1, U3) | PDF 13, folio "16" in the head | Rittel property (1): "every formulation of a wicked problem corresponds to the formulation of a solution" | yes ("following Rittel") | *Design Issues* 8 (2): 5–21 | PASS |
| 5 | Wong, Galinsky, and Kray 2009, 161 (U2) | PDF 182 = chap. 11 opener (161; PDF 183 head "162") | chapter on "if only"/"what if" thinking; "considering alternative worlds transforms cognitive processes" | yes | chap. 11, pp. 161–74 (PDF 195 head "174"; chap. 12 starts PDF 196); Psychology Press © 2009 | PASS |
| 6 | Wong, Galinsky, and Kray 2009, 168 (U2) | PDF 189, head "168" | RAT improved; "Conversely, however, counterfactual activation had negative effects on novel idea generation" | yes | as above | PASS |
| 7 | Dow et al. 2010, 18:1 (U3 ×2) | PDF 1, article page 18:1 (abstract) | "Iteration can help people improve ideas. It can also give rise to fixation…"; Parallel ads "significantly outperformed", "more diverse", "larger increase in task-specific self-confidence" | yes (both sentences) | *TOCHI* 17 (4): article 18 | PASS |
| 8 | Beghetto and Karwowski 2025, 3 (U1, U3) | PDF 9, head "Creative Agency Unbound 3" | definition; "addresses both novelty and meaningfulness, aligning with standard definitions of creativity" | yes | CUP, Elements series, © 2025 | PASS |
| 9 | Beghetto and Karwowski 2025, 9 (U1) | PDF 15, head "9" | "Creative agency is, therefore, crucial at the individual and societal level." | yes | as above | PASS |
| 10 | Chen 2011, 26 (U1 ×2, ML) | PDF 41, head "26 Chapter 2 Creative Thinking" | Guilford's four abilities (Fluency def. verbatim); "paper clip … talent in music" | yes | © 2011 Higher Education Press and Springer (PDF copyright page) | PASS |
| 11 | Chen 2011, 25 (ML) | PDF 40, head "2.3 Divergent Thinking 25" | "Divergent thinking has been widely regarded as a major hallmark of creativity." | yes | as above | PASS |
| 12 | Craft 2000, 30 (U1, ML) | PDF 43, head "… 30" | "The same creative act may involve both divergent and convergent thinking." | yes | "First published 2000 by Routledge … T&F e-Library, 2005"; © 2000 | PASS |
| 13 | Craft 2000, 30 (U2 idea 2) | same page | page does **not** discuss whether definitions of creativity are unstable | **no** (F4) | — | **FAIL** |
| 14 | Cross 2006, vi (U3) | PDF 6, head "vi Preface" | "resolving ill-defined problems, adopting solution-focused cognitive strategies" | yes | Springer-Verlag London 2006 | PASS |
| 15 | Cross 2006, 37 (U3) | PDF 47, head "… 37" | "Sketching enables exploration of the problem space and the solution space to proceed together" | yes | as above | PASS |
| 16 | Cross 2006, 86 (U3) | PDF 93, head "86" | sketching literature (dialectics of sketching, ambiguity) | broadly (sketch as a thinking tool); "relationships, rhythm, emphasis" is course wording | as above | PASS |
| 17 | Cross 2006, 81–82 (U2) | PDF 88 (head 81): "Fixation … suggested by Jansson and Smith (1991)"; PDF 89 (head 82): "hang on to their principal solution concept" | yes (see Notes on Cross's own caveat) | as above | PASS |
| 18 | Rubin 2023, 323 (U2 deck) | EPUB page-list → `102_The_Possessed.xhtml#page_323` | "tortured geniuses" | yes | Penguin Press; hardcover ISBN 9780593652886 on copyright page | PASS |
| 19 | Rubin 2023, 326 (U2) | page-list → `103_What_Works_for_You_B.xhtml#page_326` | "test and tune in to yourself"; "The only practice that matters is the one you consistently do" | yes | as above | PASS |
| 20 | Rubin 2023, 386 (U2) | page-list → `122_The_Gatekeeper.xhtml#page_386` | "Editing is a demonstration of taste … What's included, what's not" | yes | as above | PASS |
| 21 | Eckersall, Grehan, and Scheer 2017, 15 (ML) | PDF 26, head "… 15" | "This refers to the material properties and artistic processes of works…" | yes | Palgrave 2017 | PASS |
| 22 | Eckersall, Grehan, and Scheer 2017, 211 (ML) | PDF 219, head "POST-NMD? 211" | "As a compositional device and an agent for realising ideas in performance…" | yes | as above | PASS |
| 23 | Raymond 2001, 44 (U2) | PDF 57, foot "44" | "Any tool should be useful in the expected way…" | yes | "January 2001: Revised Edition", © 1999, 2001 | PASS |
| 24 | Hüppauf and Wulf 2009, 21 (U2) | PDF 32 (no folio; PDF 33 head "22") | editors' Introduction to Part I: connections between imagination, fantasy, creativity; "clarify … within the field of related terms" | yes (narrowed wording) | Routledge 2009, eds. | PASS |
| 25 | Kimbell 2011, 285 (U1) | PDF 2, foot "285" (abstract continues on 286) | "several issues that undermine the claims made for design thinking"; dualism of thinking/acting; "ignores the diversity of designers'" (→ 286 "practices") | yes | *Design and Culture* 3 (3): 285–306 | PASS |
| 26 | Fisher 2004, 19 (U1) | PDF 28, foot "19" (chapter note) | "The NACCCE report (p. 29) defined creativity as: 'Imaginative activity fashioned so as to produce outcomes that are both original and of value'" | yes ("quoted in") | David Fulton 2004 | PASS |
| 27 | Csikszentmihalyi 1996, chap. 2 (U1) | EPUB `ch02.xhtml` ("Where Is Creativity?") | "inside the heads of some special people. But this short assumption is misleading"; "three main parts" (domain, field, person) | yes | year: see F7 | PASS |
| 28 | Csikszentmihalyi 1996, chap. 3 (U1, U2, ML) | `ch03.xhtml` | "It involves fluency … flexibility … originality …"; "two opposite ways of thinking" | yes | — | PASS |
| 29 | Csikszentmihalyi 1996, chap. 4 (U1 ×2) | `ch04.xhtml` | "traditionally been described as taking five steps"; "severely distorted picture"; "Presented problems usually take a much shorter time…" | yes | — | PASS |
| 30 | Osborn 1942, chap. 4 (U2, U3) | PDF text, "CHAPTER IV" (contents: "Group Method … 25") | "1. Judicial judgment is ruled out. Criticism must be withheld until all ideas are in." | yes | "COPYRIGHT, 1942, BY THE MCGRAW HILL BOOK COMPANY"; First Edition, Fourth Impression | PASS |
| 31 | Norman 2013, 226 (U2) | PDF 245, foot "226 The Design of Everyday Things" | "Generate numerous ideas. It is dangerous to become fixated…" | yes | Basic Books rev. ed. | PASS |
| 32 | Amabile 1979, 221 (U2) | PDF 1, journal page 221 (abstract) | "subjects in the evaluation groups produced artworks significantly lower on judged creativity" | yes | *JPSP* 37 (2): 221–33 | PASS |
| 33 | Amabile 1979, 221 (U3) | same | sample is "Female college students [who] worked on an art activity" | **no**: lesson says "art students" (F3) | — | **FAIL** |
| 34 | Colzato, Ozturk, and Hommel 2012, 1 (U2) | PDF 1 (abstract) | "OM meditation induces a control state that promotes divergent thinking … FA meditation does not sustain convergent thinking"; n = 19 | yes ("small laboratory study") | *Front. Psychol.* 3:116; CC BY-NC on p. 5 | PASS |
| 35 | Persaud 2007, 68 (U2) | PDF 1, head "Thinking Skills and Creativity 2 (2007) 68–69" | "usually defined in terms of the production end…"; "critically evaluated, selected, altered or dismissed" | yes | 2 (1): 68–69 | PASS |
| 36 | Knapp, Zeratsky, and Kowitz 2016, chap. 13 (U3) | EPUB `part0041_split_000` ("13 Fake It"), quote in `part0041_split_001` | "The prototype is meant to answer questions, so keep it focused." | yes | Simon & Schuster 2016 | PASS |
| 37 | de Bono 1985, 199 (U2) | PDF 212, foot "199" | "The first stage is to make the map. The second stage is to choose a route on the map." | yes | Little, Brown 1985 | PASS |
| 38 | de Bono 1970, chap. locators (U2, U3) | Penguin EPUB `introduction.html` (dig-hole quote), `chapter002/007/017/020.html` titles match the cited chapter titles | yes | "First published by Ward Lock Education 1970" | PASS |

38 citations checked: 36 PASS, 2 FAIL (#13, #33). Every node id I resolved with `ahmes query <db> --nodes`/`--cite` exists (Dow `68ffb4c6…`, Colzato `2455fd0e…`, Schön `a81b7ced…`, Wong `19084e77…`, Beghetto `10055dde…`, Buchanan `57cba3a9…`, Knapp `9b6eece5…`).

## Findings

### F1 · P1 · blocks DONE — U2 deck still publishes the uncited "first ideas" claim that EX6 says it removed

Evidence:
```
$ grep -c "most people in the room" docs/_includes/decks/u-2-idea-generation-selection.html _site/tracks/ct/u-2-idea-generation-selection/index.html
…/u-2-idea-generation-selection.html:1
_site/tracks/ct/u-2-idea-generation-selection/index.html:1
# docs/_includes/decks/u-2-idea-generation-selection.html:67
<aside class="notes"><ul><li>The first ideas are usually the obvious ones, the ones most people in the room would also have.</li>…
<p>Source: (de Bono 1970, introduction) for the quote; (de Bono 1970, chap. "The Generation of Alternatives"); (Csikszentmihalyi 1996, chap. 3).</p>
```
EX6 edited this exact notes string: the diff of `docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json` re-pins its `Source:` line and keeps the claim. PHASE-EX6-REPORT ("It no longer says that first ideas are 'the ones most people in the room would also have'") and DECISIONS-LOG (A3/F4 entry) both state that the claim was dropped. It was dropped from the lesson only. The claim is the serial-order finding whose sources (Beaty and Silvia 2012, Ward 1994, Osborn 1953) are all `gap`, and the notes now attach it to de Bono and Csikszentmihalyi, who do not make it. The slide's visible sentence also says "usually", where the lesson now says "often". The notes leave out the lesson's new evidence for idea 3 (Cross 2006, 81–82; Norman 2013, 226; Osborn 1942, chap. 4).
Fix: rewrite the masterclass-3 `notes` (and `sentence`: "often") to follow lesson idea 3. Use fixation per Cross 81–82, Norman 226 and Osborn 1942 chap. 4. Then re-render the decks and rebuild.

### F2 · P1 · blocks DONE — U3 deck notes say "no page cite in the lesson" for ideas that EX6 has now cited

Evidence:
```
$ grep -c "no page cite in the lesson" docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json _site/tracks/ct/u-3-development-solutions/index.html
…/content.json:3
_site/tracks/ct/u-3-development-solutions/index.html:3
```
These notes are for masterclass ideas 2 (lesson now cites Osborn 1942, chap. 4 and Amabile 1979, 221), 3 (Dow et al. 2010, 18:1) and 6 (Schön 1983, 79). The Lab Exercise 1 notes cite Cross 86 and de Bono only, and leave out Dow et al., which closes FINDINGS C12 in the lesson. The statements were true before EX6 and became false when EX6 changed the lesson. They are also meta-commentary in published speaker notes. That fails check 8 (decks' pins and notes match lessons) and contradicts the report ("Decks follow the lessons").
Fix: update the three notes and the lab-1 notes in U3 `content.json` with the lesson's cites, then re-render.

### F3 · P1 · blocks DONE — U3 misdescribes the Amabile 1979 sample

Evidence (U3 lesson, masterclass idea 2): "an experiment on art students found that simply expecting to be evaluated lowered the judged creativity of their work [(Amabile 1979, 221)]". Source, journal p. 221 abstract: "Female college students worked on an art activity either with or without the expectation of external evaluation." The participants were college students doing an art task, not art students. U2's version ("students who expected their artwork to be evaluated") is accurate.
Fix: "an experiment in which college students made artworks found that expecting to be evaluated lowered the judged creativity of their work".

### F4 · P1 · blocks DONE — Craft 2000, 30 cited for a claim the page does not make (U2 idea 2)

Evidence: U2 lesson: "definitions of what even counts as creative [(Craft 2000, 30)] remain unstable enough that the person doing the counting is doing more work than they think". `pdftotext -f 43 -l 43` (printed 30) covers problem finding, problem definition in a child's task, and divergent plus convergent thinking. Nothing on the page addresses whether definitions of creativity are stable. The claim predates EX6 (it was "Craft 2003, 43", the same page). A3/F2 required re-verifying every existing pin against the printed page. EX6 moved the page number and did not check the claim.
Fix: drop the Craft cite from that clause and keep it as course wording. Alternatively, rephrase so the cite carries only what p. 30 says.

### F5 · P2 · non-blocking — "Training can raise scores" is uncited and sits beside a cite that does not support it

Evidence: U1 idea 2 and U2 idea 6 (plus the U1 and U2 deck notes): "Training can raise scores on them". It comes right after "(Csikszentmihalyi 1996, chap. 3)". The ch03 text says only that these are the dimensions "that most workshops try to enhance". U1 `PROFESSOR.md` §8.1 records this as a known gap: "Scott, Leritz & Mumford 2004 … 'training can raise scores' stays unreferenced course wording". The wording predates EX6.
Fix: soften it ("workshops try to raise these scores") until Scott et al. 2004 is procured.

### F6 · P2 · non-blocking — U1 Conclusion over-attributes an argument to Schön, Buchanan and Kimbell

Evidence: the Conclusion, rewritten in EX6, says "The four skills come from cognitive-testing traditions that another line of thought — Schön …, Buchanan …, Kimbell … — argues *cannot* explain what actually happens in a studio." Schön targets technical rationality. Buchanan writes about wicked problems. Kimbell critiques design-thinking accounts, including "design thinking as a cognitive style". None of them argues against Guilford-style divergent-thinking tests. The students now see these three authors cited in the same unit.
Fix: "…traditions that sit uneasily with Schön's account of reflective practice and Buchanan's wicked problems".

### F7 · P2 · non-blocking — the Csikszentmihalyi 1996 year is correct, but the copy in hand does not show it

Evidence: `OEBPS/cop01.xhtml`: "CREATIVITY. Copyright © 2007 by Mihaly Csikszentmihalyi … EPub Edition © JUNE 2007". The EPUB contains no "1996" outside the notes and references. The report's "text © 1996" is not on the copyright page. The 1996 HarperCollins first edition is bibliographically right, but the evidence comes from outside this copy. By contrast, Chen (© 2011 on the copyright page) and Craft ("First published 2000 by Routledge … e-Library 2005") are justified by their own copyright pages.
Fix: in DECISIONS-LOG, cite the external evidence for 1996 (for example the LoC or WorldCat record of the 1996 HarperCollins first edition) instead of the copy's copyright page.

### F8 · P2 · non-blocking — professor briefs still carry the old pins as "evaluator_safe"

Evidence:
```
unit-enrichment/U1-introduccion-creatividad/PROFESSOR.md:62-65: (Craft 2003, 43) · (Chen 2012, 41) ×2 · (Csikszentmihalyi 2007, 8)  ✅ evaluator_safe
unit-enrichment/U1-introduccion-creatividad/PROFESSOR.md:66-68: Buchanan / Schön / Kimbell rows still "gap"
unit-enrichment/U2-generacion-seleccion/PROFESSOR.md:61: (Raymond 2001, 57) "printed p. 57" verified
```
This contradicts commit `2e3d41b`, which says forge inputs follow the verified pins. The briefs are forge inputs for EX8–EX10. These lines are internal only.
Fix: update the §7 tables to the EX6 pins and statuses.

### F9 · P2 · non-blocking — provenance lines say `evaluator_safe=yes` where the resolver says otherwise

Evidence: `ahmes query <db> --cite <db>:<node>` returns `evaluator_safe=no` for Schön `a81b7ced…` (and reports "p. 9", a pdf_order index), Beghetto `10055dde…` and Buchanan `57cba3a9…`. It returns `[BIBLIO-GAP]` for the three new ingests (Dow `68ffb4c6…`, Colzato `2455fd0e…`, Knapp `9b6eece5…`). The lesson PROVENANCE_LINEs all record `evaluator_safe=yes`, and some name `resolver="ahmes query --cite"`. I read the pages and the student cites are right; the issue is that the internal record overstates what the resolver returned.
Fix: record `resolver_evaluator_safe=no|BIBLIO-GAP; page verified by pdftotext/EPUB anchor`. Optionally, add RIS metadata for the three new documents so that `--cite` resolves.

### F10 · P2 · non-blocking — the rendered Chicago entries do not show the edition consulted

`edition_used` is stored in `references.yml` but not rendered. Students see "Csikszentmihalyi … 1996 … HarperCollins", "Craft … 2000 … Routledge" and "de Bono … 1970 … Ward Lock Educational", while the pins and chapter locators come from 2007, 2005 and Penguin e-books. Chicago 17th ed. (14.161/14.17) expects a reprint or e-book note. The deliverable says "edition used noted"; the data file satisfies that literally.
Fix (optional): render `edition_used` for reprints and e-books, e.g. "E-book ed., 2007."

## Rulings requested by the orchestrator

- **Year changes (check 2).** Chen 2011 is justified by "© Higher Education Press, Beijing and Springer-Verlag Berlin Heidelberg 2011" (PDF copyright page). Craft 2000 is justified by "First published 2000 by Routledge … This edition published in the Taylor & Francis e-Library, 2005" with "© 2000 Anna Craft"; the e-Library edition keeps the print folios (PDF 43 = 30). Csikszentmihalyi 1996 is the correct first-publication year, but the held copy shows only © 2007 (F7). Osborn 1942 is justified by "COPYRIGHT, 1942" (the vault slug says 1941; ignore it).
- **Markman → Wong, Galinsky, and Kray (check 3).** Correct. Chapter 11, "The Counterfactual Mind-Set: A Decade of Research", is by Wong, Galinsky and Kray and runs pp. 161–74. The chapter-in-book Chicago entry names the editors and the page range correctly.
- **U2 "push past the obvious" (check 4).** The lesson text has no uncited empirical claim about later ideas being better or more original. "Producing more ideas without judging … so the less obvious ones have room to appear" reads as practice rationale. The Osborn 1942 rule is verbatim at chap. 4. Cross 81–82 fixation is accurate. F1 still applies: the deck notes keep the removed claim.
- **Gaps in student text (check 5).** I stripped HTML comments from the built lessons and decks and grepped them for all 40 gap authors. No gap work is cited or listed. Four originals are named only through a verified secondary source: Guilford (via Chen 2011, 26), Rittel (via Buchanan 1992, 16), Jansson and Smith (via Cross 2006, 81–82) and NACCCE 1999 ("quoted in Fisher 2004, 19"). Ruling: acceptable under Chicago "quoted in" practice, because the citation points to the page that was read and the claim matches it. "Ward", "Brown" and "Scott" hits are publisher or co-author strings. Every `href="#ref-…"` in the four built lessons has a matching `<li id="ref-…">`, and every listed id is cited (U1 8, U2 14, U3 9, ML 4).
- **Ingest legitimacy (check 6).** *Colzato*: acceptable. The PDF itself carries "open-access article distributed under the terms of the Creative Commons Attribution Non Commercial License". *Dow et al.*: acceptable as green open access. It is the authors' own posting of their article on their lab page, which ACM's author-rights policy allows for personal or institutional pages. The PDF carries ACM's personal/classroom-use notice, and the vault use is private study and citation, not redistribution. *Knapp*: acceptable. The EPUB was already in the studio bibliography on disk, which AGENTS.md names as the sanctioned feed into Ahmes. That is "already in the library", not a new acquisition.
- **Probe (check 7).** I ran the new test against the pre-EX6 probe (`git show excellence/integration:…/excellence-probe.mjs`, placed under a fixture root): tests 1–3 **fail** and test 4 (legacy spans) passes. Against the new probe all 4 pass. So the test discriminates, and test 4 is a regression guard. On the live tree, `uncited_references` is empty for U1–U3 and ML; the only entry is U4 `ref-lucas-knotts-2026`, which predates EX6 and is out of scope.

## Acceptance re-check (PHASE-EX6 §Acceptance)

| Item | Evidence (this session) | Result |
| --- | --- | --- |
| Exit gate passes | `bash PHASE-EX6.exit-gate.sh` → 8 PASS, `failures: 0`, exit 0 (matches runner log at `bcfeb0e`) | PASS |
| Manifest has every required key with a status | 63 entries, 23 verified / 40 gap; gate prefix check passes; Csikszentmihalyi uses the "1988 or 1999" option (`csikszentmihalyi-1999`, gap) | PASS |
| Every verified key exists in references.yml and is cited in its unit | gate ruby block + my anchor scan of the built HTML | PASS |
| Every cited key exists in references.yml | gate + built-HTML scan | PASS |
| No lesson hand-writes `id="ref-` | gate `absent` check | PASS |
| Each U1–U3 lesson cites ≥ 8 distinct works | U1 8, U2 14, U3 9 | PASS |
| PROVENANCE_LINE count ≥ verified keys per lesson | gate; U1 14, U2 22, U3 13, ML 9 | PASS |
| Cold reviewer samples ≥ 5 new citations (quote, page, claim) | 38 checked above; 2 wrong (F3, F4) | **FAIL** |
| Deliverable 4: plain register, verified works where the audit placed them | lessons are plain; decks not synced (F1, F2) | **FAIL** |

Regression (all run in this session, worktree clean before and after):

- `node --test scripts/tests/` and `node --test scripts/tests/index.js` → 47 pass, 0 fail.
- `node --test creativity-techniques-pedagogy/excellence/tests/probe-references.test.mjs` → 4 pass.
- `PHASE-EX0 … EX6.exit-gate.sh` → all exit 0, `failures: 0`.
- `npm run build` (prebuild hydrate + rehydrate + render, postcss, validate:decks, jekyll, verify:publication) → exit 0, "Publication safety passed". `git status --short` was empty afterwards, so the build is idempotent.
- `npm run test:browser` → "deck-layout: 325 slide view(s), 0 failure(s)".
- Deck pins: every author-date pin in U1–U3 and ML `content.json` and in the rendered decks is a verified EX6 pin (no Chen 2012, Craft 2003, Csikszentmihalyi 2007, Markman, or old Rubin/Cross/Raymond/Eckersall/Hüppauf numbers). The notes text is not synced (F1, F2).

## Notes

- Blocking fixes are small and local: F1 and F2 (deck `content.json` notes, then re-render), F3 (one phrase in U3), F4 (one clause in U2). Re-run the EX6 gate, `npm run build`, `npm run test:browser`, then a short re-review of those four spots.
- Cross 2006, 82 also says "It is not clear that 'fixation' is necessarily a bad thing in design" (tenacious fixation in outstanding designers). U2 idea 3 is not wrong without it, but one clause would make it more honest. Optional.
- Downstream: no phase file needs amending for these findings. EX8 (deck headroom) should re-measure after the F1/F2 notes grow. The report already says so for the U3 lab slides.
- The lessons hold plain register. The editorial notes keep the epistemic limits out of the Masterclass paragraphs, as required. The only meta-commentary leaking to students is the stale "no page cite in the lesson" deck notes (F2).
- I did not mark anything DONE. I did not edit or commit anything except this file.
