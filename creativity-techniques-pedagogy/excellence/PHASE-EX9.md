# PHASE-EX9: Lesson structure, exemplars and lesson images

> **Track:** U1–U3 lessons, master lecture, lesson layout
> **Status:** BLOCKED (EX8 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Lessons become a reliable, scannable reference that stands without the deck.
Live failing cases: U3 has two sections headed "B1" (Analysis and
Masterclass); U1 nests the Masterclass inside "B1 · Analysis"; U2 ideas run to
150–200 words with meta-commentary ("the same page that gives us the
theoretical warrant … does not tell us where the line falls"); no lesson
shows a filled portfolio trace; lessons contain no images.

## Deliverables

1. Same top-level sections in every unit lesson, in order: `## Learning
   objectives` · `## Analysis` · `## Masterclass` · `## Lab` · `## Workshop` ·
   `## Conclusion` · `## References` (B1/B2/B3 labels dropped or kept only as
   subtitles).
2. Each Masterclass idea: claim (one sentence) → evidence (quote with page or
   paraphrase with citation) → a design example → `**Try it:**` linking its
   Lab exercise. ≤ 220 words per idea.
3. One exemplar per Lab exercise (`**Example trace:**`), professor-made or
   anonymised with consent.
4. The key image of at least half the ideas shown in the lesson, reusing the
   deck asset with the same caption fields (from EX4 bindings), as
   `<figure><img alt="…"><figcaption>…</figcaption></figure>` (ideally via one
   `_includes/lesson-figure.html`).
5. Remove meta-commentary about sources, procurement and "this library";
   keep epistemic limits in the Editorial note.

(Amendment A3/F5–F7: the `## Workshop` section's first line states when Workshop runs — U1 "No Workshop in sessions 1–3", others "From session 4: …"; label intra-rubric percentages "of D1"; add `## Tao of Creativity` with `id="tao-of-creativity"` listing the unit's Tao lines so deck links resolve.)

(Amendment A5/F3–F5: plain wording for residual jargon such as "page locators" and "page-backed Chicago claim" in U1–U3; remove the duplicate "Lessons" breadcrumb in `_layouts/lesson.html`; `head-hreflang.html` emits `hreflang="es"` only when the Spanish URL exists and differs from the page URL.)

(Amendment A9: design the lesson template for the professor's 12-lesson structure — two lessons per official unit, e.g. `u-1-1-…`, `u-1-2-…` — documenting how a unit splits into lesson A/B while U1–U3 stay single pages in this cascade; the template must be reusable by the next cascade.)

(Amendment A10: reword the two compressed deck notes — Dow "larger increase in task-specific self-confidence"; U2 masterclass-6 "most workshops try to enhance"; keep claim-by-claim Source lines.)

## Prompt (Implementation Agent)

```text
Implement PHASE-EX9 per creativity-techniques-pedagogy/excellence/PHASE-EX9.md.

## Deliver
1. Restructure U1–U3 lessons (and the master lecture where the same blocks apply).
2. Keep every citation and provenance line intact; do not add sources here.
3. Exemplars: draft, then the professor approves or replaces them.
4. Run the exit gate; hand off for cold review — do NOT mark DONE.

## Constraints
- English; plain register for claims, graduate-level sources
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: required headings once each, in order; every idea has
  `**Try it:**` and ≤ 220 words; every Lab exercise has `**Example trace:**`;
  images in each lesson ≥ half its ideas, each with a caption; banned
  meta phrases absent; build green
- Cold reviewer confirms no citation was lost (count before vs after)

## Risks

- Restructuring can drop provenance comments: the reviewer diffs
  PROVENANCE_LINE counts per lesson.
