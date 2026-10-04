# PHASE-EX1: Contract and factual hotfix

> **Track:** student-facing text (lessons, decks, evaluation, track pages)
> **Status:** BLOCKED (EX0 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Remove every published statement the audit proved wrong, without adding new
scholarship (that is EX6). Live failing cases: FINDINGS A1 (70/30 on four
pages), C1 (U3 slide 3 quote "A rough thing can answer a question that a
polished thing hides." with `quote_origin: tao_invented` and
`citation.label: (Cross 2006, 17)`), C4 ("twenty suns is fluency thirty,
flexibility one"), C6 (Lehrer 2012 and "de Bono 1981" in U2 References),
C11 (U1 deck has 3 `lab_exercise` slides).

## Deliverables

1. Weights and pass conditions from `DECISION-EX0-GUIA.md` on: `docs/evaluation/index.md`,
   `docs/tracks/en/creativity-techniques/index.md`, How to Pass `content.json`,
   `docs/assignments/en/creativity-techniques-portfolio/index.md`
1b. (Amendment A1) Also correct the weight in the `evaluation_feed` front-matter
   lines of the U1 and U2 lessons and in the portfolio brief's internal
   `[VERIFIED] Official guide …` line (EX2 removes that line from rendered
   output). U4 is out of scope: list its 70/30 line in FINAL-REVIEW instead.
2. Rename `cv/guides/9990002301-unicrawler-2026-27.json` →
   `guia-tecnicas-de-creatividad-videojuegos-2026-27.json` and fix every
   reference to it (AGENTS.md, portfolio brief internal block); if the
   2026–27 Diseño guía exists, add it as its own JSON
3. U3: relabel the Cross-attributed aphorism as Tao of Creativity (deck and lesson opener)
4. U2: Six Hats lists all six hats; Idea 3 rewritten (push past first ideas by
   producing more, not by censoring); "twenty suns" fixed; the duplicate de Bono
   quote and the off-topic Raymond quote replaced by a page-verified quote on
   topic, or removed (no unverified citation)
5. References: remove Lehrer 2012, de Bono 1981 and every uncited entry in
   U1–U3 and the master lecture; "Eckersall, Grehan, and Scheer 2017"
6. U1: originality defined as statistical rarity; "trainable" qualified
   without a new citation ("training can raise scores"); exactly two Lab
   exercises (move Directory to autonomous work); Workshop statement aligned
   with the deck (no Workshop in sessions 1–3)
7. Replace "Tao of Development" lesson openers with Tao of Creativity lines (or none)

## Scope

**In:** the files above. **Out:** new sources, Lab redesign (EX8), images,
code, internal jargon (EX2).

## Prompt (Implementation Agent)

```text
Implement PHASE-EX1 per creativity-techniques-pedagogy/excellence/PHASE-EX1.md.

## Deliver
1. Apply deliverables 1–7. Read the weights from DECISION-EX0-GUIA.md; never
   type them from memory.
2. Every quote you keep or add must already have a PROVENANCE_LINE in the
   lesson's curriculum-internal block. If none fits, use no quote or a
   labelled Tao line.
3. Keep slide wording in the forge's plain register; English only.
4. Run the exit gate locally; fix until it passes.
5. Hand off for cold review — do NOT mark DONE.

## Constraints
- No new scholarly citation in this phase
- Do not touch U4–U6 or images
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes, including: no student page states the old knowledge-test
  weight; decision weights present on the evaluation page; both pass
  conditions present; no `tao_invented` slide with an author-date label; U1
  `lab_exercise` count 2; Lehrer, "1981" and "twenty suns is fluency thirty"
  absent; Six Hats paragraph names green and blue; every `ref-*` anchor in a
  lesson is cited in that lesson
- Cold reviewer re-reads every changed sentence against FINDINGS C1–C11

## Risks

- The decision might keep 70/30 (if the 2026–27 Diseño guía changed): then
  deliverable 1 only adds the pass conditions and fixes the source JSON naming.
