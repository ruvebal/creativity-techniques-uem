# PHASE-EX8: Lab redesign U1–U3 with exercise cards

> **Track:** lesson B2 sections, deck `lab_exercise` slides
> **Status:** BLOCKED (EX7 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.
> **Human gate:** the professor signs off the Labs before they are taught.

## Goal

Every Lab practises a Masterclass idea with a sourced technique. Live
failing cases (FINDINGS D1–D3): U1's Lab is "Research Marcel Duchamp",
"Research the Dada movement", "Explore the course directory" — no technique;
U2's Lab ("Guided concentration", "Automatic writing") never selects
although the unit is "Idea generation **and selection**"; U3 cites de Bono
for deferred judgement and omits Dow et al. 2010.

## Target Labs (the professor may swap within the catalogue)

| Unit | Exercise 1 | Exercise 2 |
| --- | --- | --- |
| U1 | Alternative Uses, self-scored on fluency, flexibility, originality (class pool), elaboration → practises Masterclass 2–3 | Dada procedures: Tzara cut-up on a real brief + readymade recontextualisation; name divergent and convergent moves → practises Masterclass 1 and the analysis triad |
| U2 | 6-3-5 brainwriting vs nominal solo groups, same brief and time; optional 3-min open-monitoring warm-up with opt-out → practises Masterclass 1–3 | Selection: hits → COCD box → Six Hats yellow/black on the top three; compare picks with Rietzschel's finding → practises Masterclass 4–5 |
| U3 | Keep "same problem, three entry points", framed as parallel prototyping (Dow et al. 2010) | Keep "delay judgement, checkpoint, exit"; Osborn for deferred judgement; add "what does this version test: role, look and feel, or implementation?" (Houde and Hill 1997) |

The Directory task moves to autonomous work or to U6.

(Amendment A9: the EX8 gate runs the real-browser check — 0 failures at three viewports and in print; U2 Lab cards have no spare height at 1080p, so longer Lab text needs a restructured card; fix the stale "72%" CSS comment.)

## Deliverables

1. Deck: each `lab_exercise` slide gets `technique_id` (from
   `CANONICAL-TECHNIQUES.yml`), `practises` (masterclass `slide_id`s), a
   student-voice sentence, `notes` with the facilitation script, `data-timer` seconds.
2. Lesson B2: one exercise card per exercise with the labelled lines
   **Time:** · **Group:** · **Materials:** · **Steps:** (numbered) ·
   **Portfolio trace:** · **Judged by:** (rubric band link) · **Source:**
   (Chicago link) · **Opt-out:** (embodied techniques only).
3. `curation/LAB-SIGNOFF.md` with `approved_by:` and `approved_on:`.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX8 per creativity-techniques-pedagogy/excellence/PHASE-EX8.md.

## Deliver
1. Draft the six exercise cards from CANONICAL-TECHNIQUES.yml; show them to
   the professor; apply their changes.
2. Update decks and lessons; exactly two lab_exercise slides per unit.
3. Keep exercise wording plain and in English; the Masterclass idea each
   exercise practises must be obvious to a student.
4. Run the exit gate; hand off for cold review — do NOT mark DONE.

## Constraints
- Only techniques present in CANONICAL-TECHNIQUES.yml
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: two lab slides per deck; each has a `technique_id` that
  exists in the catalogue and `practises` pointing at existing masterclass
  slides; U2 has at least one convergent/selection technique; every lesson
  exercise card has all labelled lines; embodied techniques carry an opt-out;
  the U1 Lab no longer contains "Research Marcel Duchamp"; sign-off complete
- Cold reviewer checks each card's steps against its primary source

## Risks

- Timing: 6-3-5 needs 30 minutes for six rounds; shorten to 3 rounds and say so on the card.
