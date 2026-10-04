# PHASE-EX10: Didactics layer — knowledge-test preparation, measurement, peer judging, method cards

> **Track:** question bank (private), practice quizzes (public), consent and
> instruments (private), peer rating sheet, method cards page
> **Status:** BLOCKED (EX9 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.
> **Human gate:** the professor approves the consent text and the question bank.

## Goal

The knowledge test carries most of the grade (weight from
`DECISION-EX0-GUIA.md`), yet nothing on the site prepares for it, and the
course's "Teaching Innovation Practice" claim has no measurement. This phase
adds retrieval practice, a pre/post study design and two classroom tools.

## Deliverables

1. `creativity-techniques-pedagogy/excellence/assessment/question-bank.yml`
   (private): ≥ 20 questions per unit U1–U3, each with `unit`, `ra` (guía
   learning outcome code), `type` (mcq | short | case), `stem`, `answer`,
   `distractors` (mcq), `ref` (key in `references.yml`), `bloom` level; ≥ 30%
   at apply/analyse level or higher.
2. Public practice quiz per unit: `docs/practice/en/u-N/` with 5 questions
   drawn from the bank (each wrapped in an element with `data-question`), answers revealed on click; linked from the lesson
   Conclusion. A 5-question retrieval slide (`slide_role: retrieval`) at the
   end of each Masterclass in the decks.
3. Measurement protocol `assessment/MEASUREMENT-PROTOCOL.md` (private):
   pre/post timed Alternative Uses Task rated by peers with consensual
   assessment (Amabile 1982); Short Scale of Creative Self (Karwowski 2012);
   timing (week 1, week 14); anonymisation; consent form in
   `creativity-techniques-pedagogy/consent/` (Spanish and English); analysis plan.
4. Peer CAT rating sheet (public, printable) used in the U2 selection Lab.
5. Method cards: `scripts/build-method-cards.mjs` renders printable cards from
   `methods/*.yml` and `CANONICAL-TECHNIQUES.yml` public fields (name, source,
   steps, time, when to use) to `/methods/en/cards/`, one element with
   `data-method-card` per card. Update the forge spine in
   `STUDENT-SLIDESHOW-FORGE.mdc` to allow `retrieval` after the Masterclass.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX10 per creativity-techniques-pedagogy/excellence/PHASE-EX10.md.

## Deliver
1. Question bank from verified lesson content and references.yml only.
2. Practice quizzes and retrieval slides; method cards page; CAT sheet.
3. Protocol and consent drafts; STOP for the professor's approval of both.
4. Run the exit gate; hand off for cold review — do NOT mark DONE.

## Constraints
- The bank, protocol and consent stay private (never under docs/)
- No student data in the repo
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: bank validates (counts, fields, refs exist, ≥ 30% higher
  order); three practice pages built with 5 questions each; each U1–U3 deck
  has one retrieval slide; protocol and consent exist and are not in `_site`;
  cards page built with ≥ 20 cards; `approved_by:` in
  `assessment/APPROVAL.md`
- Cold reviewer answers 10 random bank questions from the lessons alone

## Risks

- Ethics review may be required by the university for publishing results:
  the protocol names the route; data collection waits for it.
