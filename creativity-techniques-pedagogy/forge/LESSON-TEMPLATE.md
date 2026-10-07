# Lesson template — Creativity Techniques (EX9, for the 12-lesson structure)

**Status:** template, PHASE-EX9 of the Excellence cascade (2026-10-06). Written for
the professor's 12-lesson decision (TECHNICAL-DIRECTOR-CASCADE Amendment A9: two
lessons per official unit, U1.1 … U6.2; the six official units and CONTENIDOS stay
unchanged). U1–U3 remain **single pages** in the Excellence cascade; the next
autopilot cascade forges the 12 lessons from this template.

Copy-ready skeleton: [`templates/lesson-template.md`](templates/lesson-template.md).
Live examples of every block: the U1–U3 lessons under
`docs/lessons/en/creativity-techniques/` (EX9 versions).

## 1 · The section spine (every lesson, in this order)

| # | `##` heading (exact word, once) | Subtitle line (italic, first line) | Contents |
| - | --- | --- | --- |
| 1 | `## 🎯 Learning objectives` | — | 4–5 numbered, verb-first objectives; the last one says what the lesson does *not* prove |
| 2 | `## Analysis` | `*Session block 1 · Analysis opens the class.*` | when it happens (sessions 1–2 modelled, from session 3 two student defences × 15 min); the language / medium / support method; one debate prompt; optionally the deck's `analysis_model` image |
| 3 | `## Masterclass` | `*Session block 2 · … ideas. Each one gives a claim, the evidence for it, a design example, and the Lab exercise where you try it.*` | optional short framing paragraphs (definition, myth) **before** the first `###`; then one `###` per idea (§2) |
| 4 | `## Lab (Portfolio)` | `*Session block 3 · …portfolio index.*` | optional debate (`{#lab-debate}`); one `###` per exercise card with `{#lab-exercise-N}`; card fields in EX8 order (Practises · Time · Group · Materials · Steps · Portfolio trace · **Example trace** · Judged by · Source · Opt-out when a technique is embodied); `LAB_LINE` block |
| 5 | `## Workshop` | **first line states when Workshop runs** | U1: "No Workshop in sessions 1–3 …"; later units: "From session 4: Workshop time goes half to D2 Transposition and half to the final event (D3 Atrium) …"; D1 intra-rubric percentages always written "70% of D1 · 20% of D1 · 10% of D1" |
| 6 | `## Conclusion` | — | pedagogical honesty: what the lesson does not settle, one open question (ct-unit-forge §4a-bis) |
| 7 | `## Tao of Creativity {#tao-of-creativity}` | one line saying these are course sayings, not quotations | every Tao line the lesson's deck uses (deck `citation.href` → `#tao-of-creativity`) |
| 8 | `## References` | — | `{% include references.html %}`; front-matter `references:` keys only |
| 9 | `## Editorial note. Work in progress. Teaching Innovation Practice` + `{: .lesson-editorial-note }` | — | every epistemic limit (gaps, secondary quotations, "the line is still open"), and the sentence that design examples and example traces are illustrations, not findings or student work |
| 10 | `## AI-assisted authorship` | — | the one-sentence declaration (AI-DECLARATION-LAW) |

Rules the EX9 gate enforces on U1–U3 and the next cascade should keep: the seven
names Learning objectives · Analysis · Masterclass · Lab · Workshop · Conclusion ·
References appear **once each, in that order** (B1/B2/B3 labels are not used; if
wanted they go in the italic subtitle); no other `##` heading contains those words.

## 2 · One Masterclass idea (≤ 220 words, counted without HTML tags and Liquid)

```markdown
### N · Short title

**Claim in one sentence (bold).**

Evidence: an exact quote with its page, or a paraphrase with its cite, both from
`references.yml` and a PROVENANCE_LINE. No meta-commentary about sources here.

<figure class="lesson-figure" id="figure-masterclass-N"> … </figure>   (§4)

**In practice:** a hypothetical design situation (poster, packaging, signage, app
screen, chair…) that shows the claim. No names, studies, numbers or quotes.

**Try it:** [Lab · Exercise K](#lab-exercise-K) — which step practises this idea.
```

- The exercise named in **Try it:** is the one whose deck slide lists this idea in
  `practises`; ideas no exercise practises link to the closest step or the debate.
- Word budget: claim ≈ 15–25, evidence ≈ 60–130, example ≈ 25–40, Try it ≈ 15–25.
  Long evidence is shortened by quoting a shorter verbatim span, never by dropping
  a citation; a citation that no longer fits moves to the idea it serves best.

## 3 · Example traces (one per Lab exercise)

```markdown
**Example trace:** *Illustrative example (not student work)* — made by the professor to show the format.

<div class="lesson-example-trace" markdown="1">
- **Field named in the Portfolio trace line:** filled value
- …
</div>
```

The trace fills exactly the fields of the card's **Portfolio trace** line, on a
neutral brief invented for the example. No claims about results (no class
comparisons that read as findings); real student work only with written consent
and anonymised.

## 4 · Lesson images (deck asset reuse)

At least half the ideas show their deck image. Lessons reuse the deck's asset,
alt text and caption through one include:

```html
<figure class="lesson-figure" id="figure-masterclass-1">
<img src="{{ '/assets/images/deck-media/<hash>.webp' | relative_url }}" alt="<deck alt_text>" loading="lazy" decoding="async">
<figcaption>{% include lesson-figure.html deck="<deck slug>" slide="masterclass-1" %}</figcaption>
</figure>
```

- `npm run render:decks` writes `docs/_data/lesson_figures.json` (src, alt,
  caption HTML, rights_status per curated slide) with the deck's own
  `captionHtml()`: title · author · licence linked · Source linked.
- A flagged asset whose licence claims the public domain is captioned "Rights
  under review" (A12/F8); prefer `rights_status: ok` assets in lessons.
- `scripts/tests/lesson-figures.test.mjs` fails if a lesson `<img>` path or alt
  differs from the deck, or if the data file is stale. Keep the `<img>` and
  `<figcaption>` literal (the gate and the test read the source).

## 5 · Splitting an official unit into lesson A and lesson B (12 lessons)

| Item | Lesson A (`u-N-1-<slug>`) | Lesson B (`u-N-2-<slug>`) |
| --- | --- | --- |
| Permalink | `/lessons/en/creativity-techniques/u-N-1-<slug>/` | `/lessons/en/creativity-techniques/u-N-2-<slug>/` |
| Deck | `docs/tracks/en/uem/2627-ct/u-N-1-<slug>/` | `docs/tracks/en/uem/2627-ct/u-N-2-<slug>/` |
| Front matter | `unit: UN`, `lesson: UN.1`, `sibling: u-N-2-<slug>`, `contenidos:` (the unit's official text, unchanged) | `unit: UN`, `lesson: UN.2`, `sibling: u-N-1-<slug>`, same `contenidos:` |
| Analysis | full method for the unit (language / medium / support + the unit's new axis) | one paragraph that recalls lesson A's method and adds the debate prompt |
| Masterclass | the ideas practised by Lab exercise 1 (plus framing paragraphs) | the ideas practised by Lab exercise 2 |
| Lab | exercise 1 card + its example trace | exercise 2 card + its example trace (an exercise that selects from lesson A's output says so) |
| Workshop | first line with the session timing for that lesson's session | same |
| Conclusion / Tao / References / Editorial note | the lesson's own; `references:` lists only keys cited in that lesson | same |

Split procedure (deterministic, so two forgers produce the same split):

1. Read the unit deck's two `lab_exercise` slides and their `practises` lists.
2. Each Masterclass idea goes to the lesson whose exercise practises it; an idea
   practised by both goes to lesson A; an idea practised by neither goes to the
   lesson whose exercise its **Try it:** names.
3. **Debate-linked ideas** (Analysis debate prompts, Lab `{#lab-debate}`, or a
   Masterclass idea whose **Try it:** is only a debate) stay with the lesson that
   hosts that debate block — usually lesson A for the unit's Analysis debate, and
   the Lab lesson that owns the exercise debate. Do not duplicate the same debate
   prompt on A and B.
4. **Shared ideas** (framing paragraphs, the language/medium/support method recall,
   or an idea practised by neither exercise and not tied to a debate) go to lesson A
   in full; lesson B keeps a one-paragraph recall plus a link to A. Shared
   PROVENANCE_LINE rows stay on A; B may cite the same `#ref-` keys without
   duplicating the provenance block.
5. Every PROVENANCE_LINE moves with the sentence it backs; count PROVENANCE_LINE
   and `#ref-` links before (unit page) and after (A + B): the sums must match
   (shared lines counted once on A).
6. Tao lines go with the slide that shows them; the deck `citation.href` points at
   the lesson that holds the line.
7. The old single unit page stays as a short unit hub (objectives, links to A and B,
   CONTENIDOS) so existing deck and directory links keep resolving.

Open items for the next cascade (not decided here): whether each of the 12 lessons
has one or two Lab exercises (the forge spine says two per deck today), the
session calendar per lesson, and the gate thresholds for 3-idea lessons. The EX9
gate is written for U1–U3 single pages (≥ 4 ideas, ≥ 2 example traces per page);
a 12-lesson gate should check ≥ 3 ideas and one example trace per exercise.
