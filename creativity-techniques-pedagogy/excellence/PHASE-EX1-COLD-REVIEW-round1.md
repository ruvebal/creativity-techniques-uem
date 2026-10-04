# PHASE-EX1 Cold Review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX1) |
| **reviewed_at** | 2026-10-04T18:05Z |
| **implementer_claim** | VERIFYING: gate 18/18 PASS; deliverables 1, 1b, 2–7 applied; no new citations; one Thessia output discarded (PHASE-EX1-REPORT.md) |
| **verdict** | FAIL |

Reviewed: branch `cascade/excellence-1` at `f5abc2e`, against `excellence/integration` (`1e46b13`, which is the merge base).
One blocking finding (F1). It is a one-sentence fix. Everything else passed or is non-blocking.

## Inputs checked

- **Verify log.** The commit `ca641b3` is an ancestor of HEAD (`git merge-base --is-ancestor` → yes). `git diff --stat ca641b3 HEAD` shows only `PHASE-EX1-VERIFY-LOG.md` (+35). Nothing outside evidence changed after the verified commit.
- **Exit gate, re-run by me from the worktree root.** `bash creativity-techniques-pedagogy/excellence/PHASE-EX1.exit-gate.sh` gave 18 PASS, `failures: 0`, exit 0. This matches the runner log line for line.
- **EX0 gate regression, re-run.** `failures: 0`, exit 0.
- **Gate files.** None changed by the phase (`git diff --name-only` has no `*.exit-gate.sh` or `gates/`). No gate amendment.
- **Scope.** `git diff --name-only excellence/integration...cascade/excellence-1 | grep -E "u-[456]|scripts/|_config|images"` returns nothing.

## Findings

### F1 · Portfolio brief has the weights but no pass conditions on the student page — P1 · **blocks DONE**

- **Evidence:** Deliverable 1 requires "Weights **and pass conditions** … on: evaluation, track, How to Pass, `docs/assignments/en/creativity-techniques-portfolio/index.md`". `grep -n -i "pass\|5[.,]0\|50 ?%" docs/assignments/en/creativity-techniques-portfolio/index.md` returns only:
  - line 69, the rubric header "Minimum pass" band;
  - line 92, the `[VERIFIED]` line inside `{% if site.publication.publish_internal_metadata %}<!-- curriculum-internal`, which is not rendered.

  The public sentence on line 67 states only "60% knowledge tests; 40% …". The gate checks pass conditions only on `docs/evaluation/index.md`, so it could not catch this.
- **Fix:** after the line-67 sentence, add one plain sentence. For example: "To pass the subject you also need at least 5.0 in the final test and must hand in at least 50% of the course activities — see [Evaluation]({{ '/evaluation/' | relative_url }})." Optionally extend the gate's `present` pass-condition checks to all four `CONTRACT_PAGES`. That would follow an intended change, so it is not a weakening.
- **Cascade amend:** none.

### F2 · Chen 2012 pin cites are PDF page indexes, not printed pages — P1 · does not block EX1 · **cascade amend PHASE-EX6.md**

- **Evidence:** `pdftotext -layout -f 41 -l 41 "Chaomei Chen - Turning points _ the nature of creativity.pdf"` gives line 1 `26     Chapter 2   Creative Thinking`. That page holds the Fluency/Originality definitions and the "paper clip" sentence. PDF page 40 has the running head `2.3   Divergent Thinking    25`. So "(Chen 2012, 41)" should be **26** and "(Chen 2012, 40)" should be **25**.

  Across lessons and decks, `grep -rhoE "\(Chen 2012, [0-9]+\)"` finds 11 × "41" and 5 × "40", including the U1 Masterclass 2 slide that EX1 edited. The definition EX1 wrote is correct against the node: U1 "Originality — produce ideas that few other people produce (rare answers)" vs node `ac443610` "Originality - the tendency to produce ideas different from those of most other people." Only the page number is wrong.

  The fault predates EX1 and is not in FINDINGS. It confirms the implementer's Downstream surprise 1 with a concrete case: the error is not a uniform index+1 offset.
- **Fix (EX6):** re-verify every pin cite in U1–U3 and the master lecture against the printed folio for PDF sources. Fix the Chen cites and their PROVENANCE_LINE `printed=` values. Add a gate check that each `printed_page` was read from the page, not derived.
- **Cascade amend:** PHASE-EX6.md. Add a deliverable "pin-cite folio audit", naming Chen 2012 (40→25, 41→26) and the EPUB sources in F3.

### F3 · EPUB "printed pages" are recorded as if verified (Rubin p. 103 and others) — P2 · does not block · **cascade amend PHASE-EX6.md** (same amendment as F2)

- **Evidence:** the new PROVENANCE_LINE `U2.genius-myth` records `printed_page=103`. Its note says "follows the index+1 convention … not re-read from print". The vault node `c01a0ed6` matches the quote word for word (Athanor search, similarity 0.933, `page_index` 102). But the source file is `Rick Rubin - The Creative Act_ A Way of Being-Penguin Publishing Group (2023).epub`. Csikszentmihalyi `35dcf3a7` (`….epub`) and de Bono 1970 `bb5aec96` (`….epub`) are EPUBs too. Their page numbers are synthetic, so "printed_page" is a claim nobody can check.

  The Csikszentmihalyi p. 8 quote that EX1 moved onto U2 Masterclass 2 matches node `5f7e3435` word for word (checked in `extraction.db`). The node also contains "These are the dimensions of thinking that most creativity tests measure and that most workshops try to enhance." That sentence supports the "tests measure / training can raise scores" rewording in U1 and U2.
- **Fix (EX6):** for EPUB sources, either cite a print edition checked against its folios or state the locator convention. Rename the field (`epub_page_index`) so it does not claim "printed".
- **Cascade amend:** PHASE-EX6.md (with F2).

### F4 · U2 Idea 3 states the direction of an open question as settled fact — P2 · does not block · **cascade amend PHASE-EX6.md**

- **Evidence:** the new U2 lesson Idea 3 says: "The first ideas that come to mind are usually the obvious ones — the ones most people in the room would also have. You do not get past them by censoring them. You get past them by producing more ideas without judging…". Deck Masterclass 3 says: "Don't censor them — keep making more without judging".
  - The runbook prescribed this direction (deliverable 4: "push past first ideas by producing more, not by censoring").
  - It corrects C2: it is no longer "the opposite" of Osborn.
  - It now agrees with U3 Masterclass 2 "Defer judgement".
  - "Usually the obvious ones" matches the serial-order literature that EX6 is scheduled to bring in.

  The problem is the categorical negative "You do not get past them by censoring them". It is uncited, and the field still debates it: instructions to "be original" and the executive-inhibition account both argue that suppressing common answers helps. The old text kept this open. The new text moves the open question to "how many ideas are enough". The rendered editorial note does disclose the gap ("…the claim that later ideas tend to be less obvious than first ones, is not yet cited here"). No fabricated or new citation was added.
- **Fix:** frame the sentence as the Lab's method, not a finding. For example: "In this Lab you get past them by producing more ideas without judging, rather than by censoring them." In EX6, cite serial-order evidence and name the counter-position.
- **Cascade amend:** PHASE-EX6.md deliverable 4 should name U2 Idea 3 and U2 deck Masterclass 3 explicitly as the place to cite.

### F5 · "No Workshop in sessions 1–3" now contradicts the contract pages and the U2/U3 lessons, and EX9 would undo it — P2 · does not block · **cascade amend PHASE-EX9.md**

- **Evidence:** U1 lesson B3 now says "There is **no Workshop in sessions 1–3** … Workshop time starts in session 4". That agrees with the U1/U2 deck outros, and deliverable 6 required it. But the following still list a Workshop in every class:
  - `docs/evaluation/index.md` "## Session rhythm (every ordinary class)", item 4 "**Workshop (Deliverable)**" (a page EX1 edited);
  - How to Pass slide 3 "Every session (order binding) … Workshop";
  - the U2 lesson `## B3 · Workshop (Deliverable) — advance D1`;
  - the U3 lesson `## B3 · Workshop — advance D1`.

  The implementer logged the U2/U3 part (Downstream surprise 2). PHASE-EX9.md line 21 prescribes a lesson spine with a `## Workshop` section, which would put a Workshop back into U1.
- **Fix:** EX9 (or EX8) aligns all three lessons and both contract pages on one rule. For example: "Workshop from session 4; sessions 1–3 end after Lab".
- **Cascade amend:** PHASE-EX9.md. The spine's `## Workshop` section must be conditional on the session, and the evaluation and How to Pass "every session" wording must be added to its scope.

### F6 · Relabelled U3 Tao slide now links to an anchor that does not exist — P2 · does not block · **cascade amend PHASE-EX9.md**

- **Evidence:** a script compared each deck `#…` href with the lesson's `id="…"` attributes. All `ref-*` targets resolve in U1–U3. `tao-of-creativity` is MISSING in U1, U2 and U3. `grep -rl 'id="tao-of-creativity"' _site` returns nothing. The U3 slide 3 href changed from `#ref-cross-2006` (resolves) to `#tao-of-creativity` (dead). That is the existing convention for every Tao slide, but no downstream phase owns the fix; only EX11 checks Tao labels.
- **Fix:** give each lesson a `tao-of-creativity` target (for example on the opener), or point Tao citations at the forge's `/tao/#<chapter-id>`.
- **Cascade amend:** PHASE-EX9.md (lesson structure) or PHASE-EX5.md (renderer). Name one owner.

### F7 · Gate integrity ruling: the How to Pass D1 relabel ("70% of D1") — P2 · does not block

- **Ruling: a legitimate clarification, not gate gaming.**
  - The values are unchanged (70/20/10).
  - The new text is true: these are shares of the D1 mark.
  - The slide directly above now shows a 60% course weight, so a bare "70%" table next to it was a real chance for students to confuse the two.
  - No gate file was edited. The over-broad regex (`<td>70%</td>`) was satisfied by making the content more precise, not by weakening a check.
- **Residual inconsistency:** the same D1 intra-rubric is still unlabelled in `docs/evaluation/index.md` (the "### D1 intra-rubric" table, "Presentation | **70%**") and in the U1/U2 lesson reminders ("Intra-rubric: presentation **70%** …"). These do not trip the gate.
- **Fix (optional, any later content phase):** use "of D1" wording everywhere for consistency. If a later gate changes, scope the stale-weight regex to the weights table, not every `<td>70%</td>`.
- **Cascade amend:** none.

### F8 · Extraordinary-session sentence leaves out the guía's alternative — P2 · does not block

- **Evidence:** the guía PDF §7.2 (`pdftotext -layout cv/sources/9990002301.pdf`) says the final mark must be ≥ 5,0, the final test must be ≥ 5,0 to count in the average, and failed or missing activities are resubmitted after correction. It sets a minimum of "50% de las actividades realizadas durante el curso, **o en su defecto, otra actividad diferente y equivalente … a propuesta del docente**".

  The evaluation page sentence ("The same final-test minimum and the same 50% minimum of activities apply in the extraordinary session") is accurate but leaves that alternative out. The sentence "If the guide published in Campus Virtual differs from this page, the guide wins" states which document takes precedence. It invents no rule, and it is appropriate while the weights are PROVISIONAL.

  §7.1 supports the ordinary-session wording on the evaluation, track and How to Pass pages: final ≥ 5,0 weighted average; final test ≥ 5,0 "para que la misma pueda hacer media"; at least 50% of activities.
- **Fix (optional):** add "…or an equivalent activity set by the professor".
- **Cascade amend:** none.

### F9 · Track page still shows the internal guía id in the sentence EX1 edited — P2 · does not block · **cascade amend PHASE-EX2.md**

- **Evidence:** `grep -rl 9990002301 _site` → `_site/tracks/en/creativity-techniques/index.html` and `_site/_data/tracks.yml`. The rendered text is "Pedagogical binding source: official guía PDF family `9990002301` (Design degree clone)". This was there before EX1 and is EX2's job. EX2 deliverable 3 covers "track page" wording, but its pattern list (forge, harness, vault, "guía clone", …) has no pattern for the PDF id.
- **Fix (EX2):** replace it with "the official UEM subject guide (Design degree)" and add `9990002301` / "PDF family" to the safety-script patterns.
- **Cascade amend:** PHASE-EX2.md deliverable 2, pattern list.

## Priority checks requested by the caller

| Check | Result | Evidence |
| --- | --- | --- |
| de Bono 1985 map/route quote, p. 199 | **Correct** | `pdftotext -layout -f 212 -l 212` on the c45df305 PDF: "…The first stage is to make the map. The second stage is to choose a route on the map…", folio `199`. PDF p. 211 has folio 198 and p. 210 has folio 197. The old "211" was the 0-based page_index. |
| Csikszentmihalyi 2007 p. 8 quote on U2 Masterclass 2 | **Verbatim** (EPUB pagination: F3) | `extraction.db` node `5f7e3435` |
| Rubin 2023 p. 103 provenance | **Quote verbatim; page unverifiable** (EPUB, F3) | Athanor node `c01a0ed6`, page_index 102 |
| Six Hats list | **Correct, all six** | PDF folios 200–201: "White … facts, figures and information; Red … emotions and feelings …; Black … devil's advocate, negative judgement, why it will not work; Yellow … optimism, positive …; Green … creative …; Blue … cool and control, orchestra conductor, thinking about thinking". "caution" for black and "running the process" for blue are faithful glosses. |
| U1 originality vs Chen | **Definition correct; page wrong (printed 26)** | F2 |
| U2 Idea 3 rewrite | **Fixes C2; one sentence presented as settled** | F4 |
| No new citation without PROVENANCE_LINE | **Pass** | No new author-date work in the body or decks. Moved or kept quotes have lines: `U2.map-then-route`, `U2.genius-myth`, `U2.fluency-flexibility`. The hat list carries no cite. |
| Tao lines labelled only "(Tao of Creativity)" | **Pass** | Deck dump: every `tao_invented` slide in U1–U3 is labelled "(Tao of Creativity)". The U1 and U2 opener lines are reused verbatim from the U1 cover (deck l.279) and the U2 outro (deck l.492). |
| Thessia output did not ship | **Confirmed** | Scratch `thessia-u2-idea3.out` contains "[(1987)]", "(de Bono 2015)" and "distance grows between creator self and created work". `git diff … -- docs \| grep -i -E "1987\|de Bono 2015\|distance grows\|creator self"` finds nothing. Thessia-novel 5-grams (248) found in the shipped U2 lesson: 0. |
| Renamed guía JSON references | **Complete** | Repo-wide grep (excluding `_site`, `.git`) for the old name hits only cascade records (PHASE-EX1, DECISION-EX0, FINDINGS, report, gate), as history. |
| Firewall in `_site` | **Pass for EX1 content** | 0 hits for DECISION-EX0, DECISIONS-LOG, pedagogy/excellence, c45df305, db89dff4, af8ae4ed, c01a0ed6, 5f7e3435, videojuegos-2026-27, 9822001301, PROVENANCE_LINE, evaluation_feed, Thessia, DevIAC, ahmes-library, Athanor, "EX1 2026". The only hit is the existing `9990002301` (F9). |
| Register | **Pass** | The new slide sentences are plain and short ("Thirty sketches of the same sun are many ideas, but only one kind."). No meta-commentary was added to slides. The "not yet cited" sentence sits in the rendered editorial note, which is designed for that. |

## Acceptance re-check (PHASE-EX1.md)

- [x] **Exit gate passes.** Re-run: 18 PASS, exit 0.
- [x] **No student page states the old knowledge-test weight.** Gate check passes. Grepping the contract pages, U1–U3 lessons and decks for `[0-9]0 ?%` finds only 60/40, the D1 intra-rubric, portfolio criteria weights, and `evaluation_feed` inside `{% comment %}`. U4 is out of scope and logged in FINAL-REVIEW.
- [x] **Decision weights are on the evaluation page,** and they match the PDF §7: "Pruebas de conocimiento 60% / Entrega … 40%".
- [x] **Both pass conditions are on the evaluation page;** §7.1 wording is accurate. [ ] **Deliverable 1 on the portfolio page is not met** (F1).
- [x] **No `tao_invented` slide carries an author-date label.** U1 has 2 `lab_exercise` slides; the deck role dump shows 2 each in U1, U2 and U3.
- [x] **Lehrer, "de Bono … 1981", "fluency thirty" are absent; Six Hats names green and blue.**
- [x] **Every `ref-*` anchor is cited.** Gate passes. Separately, every deck `#ref-*` href resolves to a lesson anchor.
- [x] **Every changed sentence re-read against FINDINGS C1–C11:**
  - C1 fixed (U3 deck and opener).
  - C2 fixed (F4 residual).
  - C3 fixed.
  - C4 fixed.
  - C5 fixed (Raymond → de Bono 1985 p. 199; duplicate de Bono 1970 → Csikszentmihalyi p. 8).
  - C6 fixed: 17 → 8 references; Lehrer and the fictitious 1981 are gone.
  - C7 fixed (rarity definition; "training can raise scores", qualified as the runbook asked).
  - C8 fixed: lesson, special deck and ML deck labels, and the reference entry already lists all three editors.
  - C10 fixed.
  - C11 fixed: two Labs; the Directory task moved to autonomous work; the Workshop statement matches the deck (F5 for the knock-on effects).
  - C9 is EX6's.
- [ ] **Not DONE.** F1 blocks.

## Notes

- **Required before DONE:** F1 only.
- **Cascade amendments to file with this review's triage:**
  - PHASE-EX6.md (F2, F3, F4)
  - PHASE-EX9.md (F5, F6)
  - PHASE-EX2.md (F9)
- **Not findings, recorded:**
  - Removing Eno & Schmidt 1975 (it was uncited) leaves "Oblique Strategies" named in U2 objective 5 and Idea 4 with no reference. That is acceptable under "no new citation", but EX6 should restore a cited entry.
  - The U2 deck Masterclass 6 sentence "workshops train the hand, not replace genius myths" was unchanged by EX1 and reads ungrammatically. It is for EX9.
  - AGENTS.md now names the Diseño 2025-26 JSON. That JSON carries `weight_percent` 60.0 / 40.0, which agrees with the PDF and the decision record.
  - The weights remain PROVISIONAL (P0 in FINAL-REVIEW). No 2026–27 Diseño guía exists. That is unchanged by EX1 and correctly recorded.
- **Review limits:** I did not re-read printed folios for the de Bono 1970 p. 9/12/17, Craft 2003 p. 43, Raymond 2001 p. 57 or Cross 2006 p. 46 cites, because EX1 did not change them. F2 shows that this class of error exists, so EX6 must cover them.
