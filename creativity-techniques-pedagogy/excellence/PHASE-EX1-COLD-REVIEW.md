# PHASE-EX1 Cold Review (round 2)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX1 and did not write round 1) |
| **reviewed_at** | 2026-10-04 |
| **implementer_claim** | Fix commit `2a1f48e` closes round-1 F1 (blocking) and also fixes F4 and F8; gate 18 PASS (PHASE-EX1-REPORT.md, rows 36–39) |
| **verdict** | PASS |

Reviewed: branch `cascade/excellence-1` at tip `d61dd70`, against `excellence/integration` (`1e46b13`). The round-1 review (`PHASE-EX1-COLD-REVIEW-round1.md`, FAIL on F1) is the baseline.
No blocking findings. F1 is closed. The F4 and F8 fixes are accurate and add nothing new. I found no regression.

## Inputs checked

- **Verify log.** `PHASE-EX1-VERIFY-LOG.md` names commit `79305f05ec47`. `git merge-base --is-ancestor 79305f0 HEAD` → ancestor. `git diff --stat 79305f0 HEAD` shows only `PHASE-EX1-VERIFY-LOG.md | 35 +++` (evidence only). The log has 18 PASS, `failures: 0`, exit 0.
- **Fix diff** `git diff --stat f5abc2e 2a1f48e`: 6 files, +12/−6. Four of them are content files, each with one sentence changed:
  - the portfolio brief;
  - the evaluation page;
  - the U2 lesson;
  - the U2 `content.json`.

  The other two are cascade records (DECISIONS-LOG and REPORT). No gate file and no `gates/` file changed.
- **Gates, re-run by me from the worktree root (exit codes captured directly, not through a pipe):**
  - `bash creativity-techniques-pedagogy/excellence/PHASE-EX1.exit-gate.sh` → 18 PASS, `failures: 0`, `EX1=0`.
  - `bash creativity-techniques-pedagogy/excellence/PHASE-EX0.exit-gate.sh` → 6 PASS, `failures: 0`, `EX0=0`.
- **Render.** `bundle exec jekyll build --source docs --destination <scratchpad>/site --config _config.yml` completed. I built into the session scratchpad, not the worktree `_site`, so that this review writes only one file. The source, config and build command are the same.

## Findings

### F1 (round 1) · Portfolio pass conditions — **CLOSED**

- **Evidence.** Rendered `assignments/en/creativity-techniques-portfolio/index.html`, with HTML comments stripped and tags removed, contains:
  > "… (60% knowledge tests; 40% delivery and/or presentation of work); this rubric defines the quality of the portfolio evidence within that framework. To pass the subject you also need at least 5.0 in the final test and must hand in at least 50% of the course activities — see Evaluation."

  The link renders as `href="/creativity-techniques-uem/evaluation/"`, and `evaluation/index.html` exists in the build.
- **Accuracy against the guía.** PDF §7.1 (`pdftotext -layout`, lines 192–197) says:
  > "calificación mayor o igual que 5,0 … en la prueba final, para que la misma pueda hacer media … Además, será necesaria la entrega de al menos el 50 % de las actividades del curso"

  Both conditions match. The sentence does not repeat the overall "final mark ≥ 5.0" condition. "also" refers back to the weighted mark, and the linked Evaluation page states that condition in full ("Your final mark (the weighted average above) must be 5.0 or higher out of 10"). This is not a defect.
- **Cross-check of the other deliverable-1 pages (rendered):**
  - The track page has the same two conditions.
  - The How to Pass `content.json` has "final mark 5.0 or higher, at least 5.0 in the final test, and at least 50% of the course activities handed in".
  - The evaluation page has all three conditions.

  All four contract pages now state the pass conditions.

### F4 (round 1) · U2 Idea 3 framed as method — **fixed accurately**

- **Evidence.** The rendered U2 lesson reads: "In this Lab you get past them by producing more ideas without judging, rather than by censoring them, so the less obvious ones have room to appear." The rendered deck JSON (`tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json`) reads: "In this Lab, don't censor them — keep making more without judging…".
- **Assessment.**
  - The categorical, uncited claim "You do not get past them by censoring them" is gone. The sentence now states the Lab's method, which is the wording round 1 recommended.
  - No citation was added or moved. The surrounding cites (Csikszentmihalyi 2007, 8; de Bono 1970, 17) are unchanged.
  - The diff touches only these two sentences.
  - Deliverable 4's direction ("by producing more, not by censoring") still holds.
- **Residual (P2, does not block, EX6):** the sentence "Your first ideas are usually the obvious ones" is still uncited. The rendered editorial note already discloses this, as recorded in round 1. EX6 owns the serial-order citation.

### F8 (round 1) · Extraordinary session — **fixed accurately, nothing invented**

- **Evidence.** The rendered evaluation page reads: "In the extraordinary session (convocatoria extraordinaria) the same final mark and final-test minimums apply. You hand in the activities you failed (after the professor's corrections) or did not hand in; the minimum is 50% of the course activities, or else another equivalent activity proposed by the professor."
- **Clause-by-clause check against PDF §7.2 (lines 205–215):**

  | Rendered clause | §7.2 source |
  | --- | --- |
  | final mark minimum | "calificación mayor o igual que 5,0 … calificación final (media ponderada)" |
  | final-test minimum | "mayor o igual que 5,0 en la prueba de evaluación final, para que la misma pueda hacer media" |
  | failed activities, resubmitted after corrections | "Se deben entregar las actividades no superadas en convocatoria ordinaria, tras haber recibido las correcciones … por parte del docente" |
  | activities not handed in | "o bien aquellas que no fueron entregadas" |
  | 50% minimum | "el número mínimo de actividades a entregar … será del 50% de las actividades realizadas durante el curso" |
  | equivalent-activity alternative | "o en su defecto, otra actividad diferente y equivalente a las anteriores a propuesta del docente" |

  Every clause has a source sentence, and the rendered text adds no condition that §7.2 does not contain.

### F10 (new) · Amendment A3 is not yet filed anywhere — P2 · does not block EX1 · orchestrator action

- **Evidence.**
  - `git grep -i "amendment A3"` on every local branch returns nothing.
  - `PHASE-EX2.md`, `PHASE-EX6.md` and `PHASE-EX9.md` contain only Amendment A2 notes. Grepping for `folio`, `9990002301` and `tao-of-creativity` in them finds no hits for round-1 F2/F3/F6/F9.
  - EX9 line 21 still prescribes an unconditional `## Workshop` section (round-1 F5).
  - The REPORT triage lists "F2, F5, F9 cascade amends: left to the orchestrator". It does not mention F3, F6 or F7.
- **Fix.** When the orchestrator files A3, it must amend:
  - PHASE-EX6.md for F2, F3 and the F4 residual;
  - PHASE-EX9.md (or EX5) for F5 and F6;
  - PHASE-EX2.md for F9.

  It should also record F7's optional "of D1" wording against a content phase. These are the amendments round 1 named. Until A3 lands, the cascade still describes the pre-EX1 world for EX6 and EX9. That is not a defect in EX1's deliverables.

## Regression and scope

- **Scope.** `git diff --name-only excellence/integration...cascade/excellence-1 | grep -E "u-[456]|scripts/|_config|images|exit-gate|gates/"` returns nothing. The non-cascade files touched are the contract pages (evaluation, track, How to Pass, portfolio), the U1–U3 lessons and decks, and the master-lecture lesson and decks (deliverable 5). The guía rename, AGENTS.md, `cv/README.md`, `oficial-guia-framework.mdc` and `GROUNDING-RECEIPT.md` are also touched (deliverable 2 reference fixes). Everything is inside the runbook's "In" list.
- **Internal names in the rendered site.** In the full scratch build, these strings each appear in 0 files:
  - `DECISION-EX0`, `DECISIONS-LOG`, `pedagogy/excellence`
  - `PROVENANCE_LINE`, `evaluation_feed`
  - `Thessia`, `DevIAC`, `ahmes-library`, `Athanor`
  - `cold-review`, `cold review`
  - `videojuegos-2026-27`, `9822001301`

  The only hit is `9990002301` in `tracks/en/creativity-techniques/index.html` and `_data/tracks.yml`. This is the pre-existing round-1 F9, which EX2 owns. The fix commit did not introduce it: it predates EX1, and `2a1f48e` does not touch the track page.
- **Fix-commit regressions.** None. Both gates are green, and each of the four content edits is a single-sentence replacement with no anchor, citation or reference-list change. The "every listed reference is cited" check passes.

## Round-1 non-blocking findings: are any actually blocking for EX1 Acceptance?

The EX1 Acceptance has two parts: (a) the exit gate with the listed checks, and (b) the cold reviewer re-reading every changed sentence against FINDINGS C1–C11.

| Round-1 | Why it does not block EX1 Acceptance |
| --- | --- |
| F2 Chen folio 40/41 → 25/26 | Predates EX1 and is not a C1–C11 item. C9 (reference consistency) is EX6's. The definition EX1 wrote is correct. Deliverable 4/6 asked for no new cites, and none were added. |
| F3 EPUB "printed_page" | A provenance field-naming problem in unrendered internal blocks. The quotes are verbatim. Belongs with EX6. |
| F5 Workshop rule vs evaluation/How to Pass "every session" and U2/U3 B3 | Deliverable 6 requires only U1's Workshop statement to match the deck (C11), and it does. Aligning other pages is outside EX1's file scope for that deliverable. Belongs with EX9. |
| F6 `#tao-of-creativity` dead anchor | The gate's anchor check covers `ref-*` only, and all `ref-*` anchors resolve. Tao links follow the existing convention site-wide. Belongs to renderer/structure (EX5/EX9). |
| F7 "of D1" labelling | A ruling, not a defect. The values are correct. Optional wording. |
| F9 `9990002301` on the track page | Internal jargon is explicitly **Out** of EX1 scope ("internal jargon (EX2)"). |

None of them is blocking for EX1.

## Acceptance re-check (PHASE-EX1.md)

- [x] **Exit gate passes.** Re-run: 18 PASS, `failures: 0`, exit 0. It covers the old weight, decision weights, both pass conditions, Tao labels, U1 Lab count 2, the Lehrer/1981/twenty-suns removals, the green/blue hats, and that every `ref-*` is cited.
- [x] **Deliverable 1 on all four contract pages** (round-1 F1). Verified in the rendered HTML/JSON, as quoted above.
- [x] **Changed sentences re-read against FINDINGS C1–C11.** Round 1 covered rows 1–35. This round re-read the four new sentences (REPORT rows 36–39):
  - row 36 against A1/A4 and §7.1;
  - rows 37–38 against C2;
  - row 39 against §7.2.

  Each is accurate.
- [x] **EX0 gate is still green** (regression).

## Notes

- I do not mark DONE. That is the product owner's decision.
- **Required before DONE:** nothing.
- **Orchestrator action:** file Amendment A3 (F10). It names PHASE-EX6.md, PHASE-EX9.md (or EX5) and PHASE-EX2.md, as round 1 listed.
- The weights remain PROVISIONAL (P0 in FINAL-REVIEW). This is unchanged.
- **Review limits:**
  - I did not re-audit round-1 rows 1–35 beyond confirming that the fix commit did not touch them (`git diff f5abc2e 2a1f48e` is limited to the six files listed).
  - I did not re-read printed folios for any cite.
  - The build went to the scratchpad, not the worktree `_site`.
