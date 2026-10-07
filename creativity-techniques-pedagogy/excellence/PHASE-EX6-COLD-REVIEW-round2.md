# PHASE-EX6 Cold Review (round 2)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (Claude Opus 5.5, separate session; did not implement EX6 and did not write round 1) |
| **reviewed_at** | 2026-10-06 |
| **implementer_claim** | PARTIAL, round 2: F1–F4 fixed, F5–F10 done; "every deck's notes also synced"; the claim re-check table rewrote U3 Lab 1 so that Cross 2006, 86 and de Bono 1970 chap. "Choice of Entry Point…" carry only what their pages say; gates 0 failures; 12/12 EX tests; 325 slide views, 0 failures |
| **verdict** | FAIL |

Scope: branch `cascade/excellence-6` at `d135fe0`. The fix commits are `7be420e`, `c9604c2`, `c7a2b93` and `54f2794`, reviewed as `git diff c8f1dc8 54f2794`. The runner verify log records commit `b013d09`, which is an ancestor of the tip: exit 0, `failures: 0`. Only `d135fe0` (the log itself) comes after it. The worktree was clean before and after every command I ran.

Round-1 F1–F4 are closed in the lessons, in the deck `content.json` files, in the rendered deck includes and in the built `_site`. The FAIL comes from one new blocking defect. It has the same shape as round-1 F1. The round-2 re-check table says the U3 Lab 1 sentences on Cross 2006, 86 and the de Bono entry-point chapter were rewritten because those pages do not say what the sentences claimed. The lesson was rewritten. The U3 Lab 1 speaker notes were not. They still publish both unsupported clauses under a `Source:` line naming those two works (F1 below).

## Claims checked (source page read by this reviewer)

Method: `pdftotext -layout -f N -l N`, with the printed folio read in the running head or foot. For EPUBs I read the `page_N` anchors (Schön, Rubin) or the chapter file (de Bono, Knapp). Osborn is a plain e-text, so I read the chapter span between the "CHAPTER IV" and "CHAPTER V" markers.

| # | Cite (where) | Source location read | Text on the page | Student or deck sentence faithful? | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | de Bono 1970, introduction (U2 idea 2, U2 deck m2 notes; re-check row) | `introduction.html` | "Lateral thinking is not a substitute for vertical thinking. … Lateral thinking is generative. Vertical thinking is selective." | yes, exact wording | PASS |
| 2 | de Bono 1970, introduction (U2 idea 3 dig-hole quote) | `introduction.html` | "You cannot dig a hole in a different place by digging the same hole deeper. Vertical thinking is used to dig the same hole d[eeper]…" | yes | PASS |
| 3 | de Bono 1970, chap. "The Generation of Alternatives" (U2 idea 3) | `chapter007.html` (title "The generation of alternatives 7") | "looking for alternatives instead of blindly accepting the most obvious approach" | yes, exact wording | PASS |
| 4 | de Bono 1970, chap. "Choice of Entry Point and Attention Area" (U3 Lab 1 lesson; re-check row) | `chapter017.html` (title "Choice of entry point and attention area 17") | "but in practice a different entry point will usually mean a different train of ideas" | yes: exact wording, right chapter | PASS (lesson). The **deck notes** were not updated (F1) |
| 5 | Cross 2006, 86 (U3 Lab 1 lesson; re-check row) | PDF 93, head "86 Designerly Ways of Knowing" | "'dialectics of sketching': a dialogue between 'seeing that' and 'seeing as', where 'seeing that' is reflective criticism and 'seeing as' is the analogical reasoning…" | yes. The concept is Goldschmidt's (named on p. 85), and "Cross summarises sketching research as…" frames it correctly | PASS (lesson). The **deck notes** were not updated (F1) |
| 6 | de Bono 1970, chap. "Difference between Lateral and Vertical Thinking" (U2 idea 4; re-check row) | `chapter002.html` | "Vertical thinking is analytical, lateral thinking is provocative"; "one welcomes outside influences for their provocative action … more chance there is of altering the established pattern"; "a way of bringing about repatterning" | yes, the claim holds | PASS. The re-check table's quotation is not on this page (F2) |
| 7 | de Bono 1970, chap. "The New Word PO" (U3 Lab 2) | `chapter020.html` | "The usefulness of delaying judgement is one of the most basic principles of lateral thinking." | yes, exact wording | PASS |
| 8 | Cross 2006, 81–82 (U2 idea 3; U2 deck m3 notes, F1-round-1 fix) | PDF 88 head "81": "A 'fixation' effect in design was suggested by Jansson and Smith (1991) … solutions that contained many more features from the example design". PDF 89 head "82": "hang on to their principal solution concept" | — | yes. The lesson says "first reported by" where Cross says "suggested by" (F4) | PASS |
| 9 | Norman 2013, 226 (U2 idea 3, U2 deck m3) | PDF 245, foot "…indd 226" | "Generate numerous ideas. It is dangerous to become fixated upon one or two ideas too early in the process." | yes, exact wording | PASS |
| 10 | Osborn 1942, chap. 4 (U2 idea 3, U3 idea 2, both decks) | e-text, between "CHAPTER IV" (contents: "Group Method … 25") and "CHAPTER V" | "1. Judicial judgment is ruled out. Criticism must be withheld until all ideas are in." | yes, exact wording | PASS |
| 11 | Amabile 1979, 221 (U3 idea 2 + U3 deck m2; round-1 F3) | PDF 1, journal 37 (2): 221 abstract | "Female college students worked on an art activity … subjects in the evaluation groups produced artworks significantly lower on judged creativity" | yes. "college students made artworks" replaces "art students" | PASS |
| 12 | Dow et al. 2010, 18:1 (U3 idea 3 deck notes, Lab 1 lesson and notes) | PDF 1, page 18 (abstract) | "Iteration can help people improve ideas. It can also give rise to fixation, continuously refining one option without considering others"; Parallel "significantly outperformed", "more diverse", "larger increase in task-specific self-confidence" | yes | PASS |
| 13 | Schön 1983, 79 (U3 idea 6 deck notes; round-1 F2) | `Chapter03.html`, between `page_79` and `page_80` | "the situation 'talks back' … In a good process of design, this conversation with the situation is reflective." | yes | PASS |
| 14 | Knapp, Zeratsky, and Kowitz 2016, chap. 13 (U3 deck m1 notes) | `part0041_split_000` = "13 Fake It"; quote in `part0041_split_001` | "The prototype is meant to answer questions, so keep it focused." | yes, exact wording | PASS |
| 15 | Buchanan 1992, 16 (U3 deck m5 notes; U1 conclusion) | PDF 13, folio "16" | "(1) Wicked problems have no definitive formulation, but every formulation of a wicked problem corresponds to the formulation of a solution." | yes ("Every way of stating a wicked problem already points to a solution"; U1 "no definitive formulation") | PASS |
| 16 | Persaud 2007, 68 (U2 deck m5 notes) | PDF 1, head "Thinking Skills and Creativity 2 (2007) 68–69" | "Creativity is usually defined in terms of the production end … a neglected aspect … critically evaluated, selected, altered or dismissed" | yes | PASS |
| 17 | Wong, Galinsky, and Kray 2009, 168 (U2 idea 4, U2 deck m4 notes) | PDF 189, head "168" | "Conversely, however, counterfactual activation had negative effects on novel idea generation."; RAT improved | yes | PASS |
| 18 | Craft 2000, 30 (U1 m1, U2 m1 "warrant", U1/ML lesson) | PDF 43, head "… 30" | "The same creative act may involve both divergent and convergent thinking." | yes. The U2 idea 2 clause no longer cites it (round-1 F4 closed) | PASS |
| 19 | Chen 2011, 26 (U1 idea 2; re-check row) | PDF 41, head "26 Chapter 2 Creative Thinking" | "1) Fluency — the ability to produce a large number of ideas or solutions to…"; "paper clip or a brick" | yes. The lesson prints "Fluency -" for "Fluency —" (cosmetic, pre-existing) | PASS |
| 20 | Rubin 2023, 386 (U2 idea 5; re-check row) | `122_The_Gatekeeper.xhtml`, between `page_386` and `page_387` | "Our taste is revealed in how our work is curated. What's included, what's not, and how the pieces are put together." | yes, exact wording | PASS |
| 21 | Csikszentmihalyi 1996, chap. 3 (F5 wording) | (round-1 read: `ch03.xhtml` "most workshops try to enhance") | — | "Many workshops try to raise these scores" (U1) and "Workshops try to raise those scores" (U2) match | PASS |

21 claims checked. All the **lesson** sentences hold. That includes the three new rewrites from the re-check table: the de Bono generative/selective quote (#1), Cross 86 "seeing that / seeing as" (#5) and "a different entry point will usually mean a different train of ideas" (#4, exact wording, chapter 17). I checked 9 rows of the re-check table myself (#1–#7, #18–#20). Eight hold as written. One row (#6) holds in substance, but its "page says" quotation is a composite that is not on the cited chapter (F2).

## Findings

### F1 · P1 · blocks DONE: U3 Lab 1 deck notes still attach the two clauses that the round-2 re-check found unsupported to Cross 86 and the de Bono entry-point chapter

Evidence:
```
$ grep -o "Do not polish. Compare relationships[^<]*\|Watch the temptation[^<]*\|Source: (Cross 2006, 86)[^<]*" _site/tracks/ct/u-3-development-solutions/index.html
Do not polish. Compare relationships, rhythm and emphasis across the three starts.
Watch the temptation to solve it the obvious way and paste the entry point on afterwards.
Source: (Cross 2006, 86); (de Bono 1970, chap. “Choice of Entry Point and Attention Area”); (Dow et al. 2010, 18:1).
```
(The same text is in `docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json` slide `lab-1` `notes` and in `docs/_includes/decks/u-3-development-solutions.html`. `git diff c8f1dc8 54f2794` on that slide only appends the Dow bullet and the Dow cite.)

PHASE-EX6-REPORT, round-2 re-check table, rows "U3 Lab 1":
- "compare relationships, rhythm, and emphasis" → Cross 86 → "**rewritten**: cite now carries only the seeing-that/seeing-as summary; the comparison is course wording"
- "watch the temptation … paste the entry point on afterwards" → de Bono → "not on page … **rewritten**: cite moved to that quote; the warning is course wording"

The lesson was rewritten that way. The notes were not. They contain neither the "seeing that / seeing as" summary nor "a different entry point will usually mean a different train of ideas". The only content their `Source:` line can attach to is the two clauses the implementer judged unsupported. This is the round-1 F1 pattern again (lesson fixed, deck notes stale). It also contradicts the round-2 report line "every deck's notes also synced". The new sync test cannot catch it, because it compares pins and not the claims attached to them (F3).

Fix: in U3 `content.json` `lab-1.notes`, add the two supported statements, e.g. "- Cross: sketching works as a dialogue between 'seeing that' (criticism) and 'seeing as' (reinterpretation)." and "- de Bono: 'a different entry point will usually mean a different train of ideas.'". Keep the rhythm and paste-on lines as course wording, without implying that the sources say them. Then re-render the decks and rebuild. Optional: the slide-face `sentence` pins "Compare how the entry point steered the path" to "(de Bono …; Cross 2006, 86)". de Bono supports it; Cross 86 is about sketching, not entry points. "(de Bono 1970, chap. …)" alone would be cleaner. That part predates round 2 and does not block.

### F2 · P2 · non-blocking: one re-check-table quotation is not on the cited chapter

Evidence: the re-check table row "U2 idea 4" says the page says "uses information … provocatively in order to bring about repatterning", cited to chap. "Difference between Lateral and Vertical Thinking" (`chapter002.html`).
```
$ for f in *.html; do sed -e 's/<[^>]*>//g' $f | tr -s ' \n' ' ' | grep -o -i ".\{60\}provocatively.\{40\}" | sed "s/^/$f: /"; done
chapter004.html: … Lateral thinking uses information provocatively. Lateral thinking breaks down old patterns …
chapter020.html: … to indicate that it is being used provocatively and second …
```
"uses information provocatively" is in chapter 4 ("The way the mind works"), not chapter 2. "bring about repatterning" is in chapter 2 ("a way of bringing about repatterning"). The table's quotation splices the two. The **student** sentence ("use information to provoke a new pattern", chap. 2) still holds on chapter 2: "lateral thinking is provocative"; "welcomes outside influences for their provocative action … altering the established pattern"; "repatterning". So the audit record is wrong and the published claim is right.
Fix: correct the table row's quotation to chapter-2 wording, or cite chap. 4 for the "uses information provocatively" phrasing.

### F3 · P2 · non-blocking: the sync test catches pin drift and stale "no page cite" notes, but not claim drift

Evidence (my runs):
```
# sync test against the round-1 tree (git archive c8f1dc8, new test copied in)
ok 3 - u-2-idea-generation-selection: deck pins appear in the lesson     <- round-1 F1 NOT caught
not ok 6 - u-3-development-solutions: no stale "no page cite" notes      <- round-1 F2 caught
  + [ 'masterclass-2', 'masterclass-3', 'masterclass-6' ]
# pass 7 / fail 1

# mutation of HEAD copy: Dow 18:1→18:4, Knapp chap. 13→12, Schön 79→80, Persaud 68→69, Cross 81–82→81–83
not ok 3 … 'masterclass-3: Cross 2006, 81–83', 'masterclass-5: Persaud 2007, 69'
not ok 5 … 'masterclass-1: Knapp, Zeratsky, and Kowitz 2016, chap. 12', 'masterclass-3: Dow et al. 2010, 18:4', 'masterclass-6: Schön 1983, 80', 'lab-1: Dow et al. 2010, 18:4'
```
The test discriminates on locators and on stale meta-notes. It would have passed round-1 F1, and it passes the current F1, because the pins match while the attached claim does not. The exceptions are narrow. `surface=deck` matches exactly one PROVENANCE_LINE (U2, Rubin 2023, 323). The `'Tao of Creativity'` exemption is dead code, because that label has no year and the PIN regex never matches it.
Fix: none required. Optionally, add a curated list of claims retired by EX6 that must not appear in any deck note ("most people in the room", "rhythm and emphasis" under Cross, and so on). The test's header comment should say it checks pins only.

### F4 · P2 · non-blocking: "first reported by Jansson and Smith" goes slightly beyond Cross

Evidence: U2 idea 3: "the 'fixation' effect first reported by Jansson and Smith [(Cross 2006, 81–82)]". Cross 81: "A 'fixation' effect in design was suggested by Jansson and Smith (1991)". Cross does not say "first". Cross 82 also says "It is not clear that 'fixation' is necessarily a bad thing in design" (round-1 Notes, still optional).
Fix: "the 'fixation' effect described by Jansson and Smith".

## Round-1 findings re-check

| Round-1 | Evidence (this session) | Status |
| --- | --- | --- |
| F1 U2 deck "most people in the room" | `grep -c` = 0 in every built lesson and deck page. The U2 m3 sentence now says "often". The notes carry Cross 81–82, Norman 226 and Osborn chap. 4, and their wording matches pages #8–#10 | closed |
| F2 U3 "no page cite in the lesson" | 0 in the built site. m2 notes Osborn/Amabile, m3 Dow 18:1, m6 Schön 79, Lab 1 Dow: all verified (#10–#13) | closed (but see new F1 on Lab 1) |
| F3 Amabile "art students" | 0 hits for "art students". The lesson and the U3 deck say "college students … artworks" (#11) | closed |
| F4 Craft 30 on "definitions unstable" | 0 hits for "remain unstable". The clause is uncited course wording | closed |
| F5 "Training can raise" | 0 hits. The new wording matches Csikszentmihalyi chap. 3 "try to enhance" | closed |
| F6 U1 conclusion | The new text attributes problem setting and reflection-in-action to Schön (40, 68), "no definitive formulation" to Buchanan (Rittel property 1, p. 16) and "claims … overstated" to Kimbell (285 "issues that undermine the claims made for design thinking"). It says "None of them is talking about creativity tests" | closed |
| F7 Csikszentmihalyi year | DECISIONS-LOG cites outside evidence (Persaud's reference list and the 1996 first-edition record) | closed |
| F8 PROFESSOR §7 tables | diff updates the U1–U3 briefs to the EX6 pins | closed |
| F9 provenance resolver status | I sampled 9 nodes with `ahmes query <db> --cite <db>:<node>`: Craft 3ed2bb7b yes/yes, Amabile f5659140 yes/yes, Persaud 3f7bcf30 no/no, Osborn f9bd5077 yes/yes, Dow 68ffb4c6 BIBLIO-GAP/BIBLIO-GAP, Rubin c01a0ed6 yes/yes, Wong 82574166 yes/yes, Schön 6f338205 no/no, Norman 550af0b7 yes/yes (recorded/actual). 9/9 match. Bare `evaluator_safe=yes` appears in 0 PROVENANCE_LINEs. All carry `verified_by=manual-page-read` | closed |
| F10 edition notes | The built References lists render `edition_note` after the Chicago entry: Craft "Taylor & Francis e-Library edition, 2005."; Csikszentmihalyi "E-book edition, … 2007. EPUB."; Osborn "Reset e-text … without page numbers."; Schön "E-book edition. EPUB." Counts: U1 5, U2 7, U3 6, ML 3 | closed |

## Acceptance re-check (PHASE-EX6 §Acceptance)

| Item | Evidence (this session) | Result |
| --- | --- | --- |
| Exit gate passes | `bash PHASE-EX6.exit-gate.sh` → exit 0, `failures: 0`. Runner log (commit `b013d09`) exit 0 | PASS |
| Every verified key in references.yml and cited; every cited key listed | built-HTML scan: U1 8 / U2 14 / U3 9 / ML 4 refs; cited-not-listed = ∅ and listed-not-cited = ∅ in all four. Every deck `href="…#ref-…"` resolves to an `id` in its lesson | PASS |
| No gap work in student text | stripped HTML comments and tags in the built lessons and decks, then grepped all 40 manifest gap keys. The only hits are verified works with the same surname (Csikszentmihalyi 1996, Amabile 1979, Osborn 1942), secondary-source mentions (Guilford via Chen 26, Jansson and Smith via Cross 81), and publisher or co-author strings ("Ward Lock", "Little, Brown", "Scott R. Klemmer"). "Markman" appears only as an editor in the Wong et al. chapter entry | PASS |
| Cold reviewer samples ≥ 5 new citations (quote, page, claim) | 21 checked above; the lesson sentences all hold | PASS |
| Deliverable 4: decks follow the lessons, plain register | U3 Lab 1 notes keep the claims the lesson retired (F1) | **FAIL** |

Regression (all run in this session, `git status --short` empty before and after):

- `npm test` → tests 47, pass 47, fail 0.
- `node --test …/probe-references.test.mjs …/deck-lesson-sync.test.mjs` → pass 12, fail 0.
- `PHASE-EX0 … EX6.exit-gate.sh` → all exit 0, `failures: 0`.
- `npm run build` → exit 0, "Publication safety passed: no internal corpus or local-architecture metadata in _site." The rebuild left no tracked changes, so the build is idempotent.
- `npm run test:browser` → "deck-layout: 325 slide view(s), 0 failure(s)".

## Notes

- The blocking fix is local: one `notes` string in U3 `content.json` (slide `lab-1`), then re-render and rebuild. A round-3 review only needs that slide, the gate, `npm run build` and `npm run test:browser`.
- F2–F4 are record or wording polish and do not block.
- Downstream: no phase file needs amending. EX8 (deck headroom) should still re-measure U3 Lab slides. Notes are not on the slide face, so F1's fix does not affect layout.
- I did not mark anything DONE. I edited and committed nothing except writing this file, which I did not commit.
