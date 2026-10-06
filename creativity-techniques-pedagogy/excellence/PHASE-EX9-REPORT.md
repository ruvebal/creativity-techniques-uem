# PHASE-EX9 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING. Deliverables 1–5 and amendment notes A3, A5, A9, A10, A12 done. Gate pre-check 0 failures; next: `cascade-harness.sh verify`, then cold review. |
| **branch / worktree** | `cascade/excellence-9` · `creativity-techniques-uem-integration-excellence-9` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT; judgment calls in `DECISIONS-LOG.md` (8 EX9 lines) |
| **cascade_amended** | No orchestrator, phase or gate file changed. |

## Files

- Lessons: `docs/lessons/en/creativity-techniques/u-{1,2,3}-*/index.md`, `docs/lessons/en/master-lectures/creative-process-analysis/index.md`
- Decks: `docs/tracks/en/uem/2627-ct/u-{1,2,3}-*/data/content.json` (A10, A12 F2–F7 notes, U3 Tao href) and re-rendered `docs/_includes/decks/*.html`
- Figures: `docs/_includes/lesson-figure.html`, `docs/_data/lesson_figures.json` (written by `scripts/render-decks.mjs`), `scripts/lib/deck-render.mjs` (`lessonFigures`, flagged-PD caption), `scripts/lib/media-rules.mjs` (`caption().rights_status`), `scripts/validate-decks.mjs` (A12/F8 error), `scripts/tests/lesson-figures.test.mjs`, `docs/assets/css/site.css`
- Chrome: `docs/_layouts/lesson.html` (single "Lessons" crumb), `docs/_includes/head-hreflang.html` (es only if it exists and differs)
- Forge: `forge/LESSON-TEMPLATE.md`, `forge/templates/lesson-template.md`, `forge/ct-unit-forge.mdc` §4a-quater, `forge/STUDENT-SLIDESHOW-FORGE.mdc` (technique_id / technique_ids_also / practises)
- Records: `evidence/EX9/` (prompts, responses, `model-calls.jsonl`), `DECISIONS-LOG.md`, `FINAL-REVIEW.md`

## Structure before → after

| Lesson | Before | After |
| --- | --- | --- |
| U1 | Masterclass nested as `###` inside "B1 · Analysis" (ideas `####`); B2 Lab; Autonomous work; "B3 · No Workshop yet" | Learning objectives · Analysis · Masterclass · Lab (Portfolio) · Workshop (+ Outside class) · Conclusion · Tao of Creativity · References |
| U2 | Masterclass nested in "B1 · Analysis"; B2 Lab; "B3 · Workshop — advance D1" | same spine as U1 |
| U3 | "B1 · Analysis" and "B1 · Masterclass" (two B1); B2; B3 | same spine as U1 |
| ML | Learning outcomes; B1 · Analysis; Masterclass ideas (six); B2 · Lab | Learning objectives; Analysis; Masterclass; Lab (Portfolio) — no Workshop/Tao (not a unit) |

## Words per idea (gate method, ≤ 220)

| Lesson | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | 177 | 207 | 114 | 182 | 132 | 133 |
| U2 | 207 | 151 | 207 | 206 | 167 | 164 |
| U3 | 147 | 144 | 117 | 107 | 149 | 133 |

Before EX9 the gate found 0 countable ideas in U1/U2 (they were `####` under B1); U2 ideas ran to ~150–330 words.

Images with figcaption: U1 6, U2 5, U3 7, ML 4 (all `rights_status: ok`). Example traces: 2 per unit lesson, 1 in ML.

## Citation and provenance counts (before fef0fab → after)

| Lesson | PROVENANCE_LINE | LAB_LINE | `#ref-` links | distinct cite labels |
| --- | --- | --- | --- | --- |
| U1 | 14 → 14 | 2 → 2 | 15 → 15 | 12 → 12 |
| U2 | 24 → 24 | 2 → 2 | 23 → 23 | 20 → 20 |
| U3 | 14 → 14 | 2 → 2 | 12 → 12 | 10 → 10 |
| ML | 9 → 9 | 0 → 0 | 10 → 10 | 6 → 6 |

PROVENANCE/LAB/QUOTE/REF_COATS/MEDIA_RIGHTS lines byte-identical in U1–U3 (sorted diff empty). No new citations or facts.

## 12-lesson template (A9)

`forge/LESSON-TEMPLATE.md`: the section spine, the idea format (claim → evidence → In practice → Try it, ≤ 220 words), the example-trace format, the figure include, and the split of each official unit into lesson A `u-N-1-…` and lesson B `u-N-2-…`. Ideas follow the exercise whose `practises` lists them; provenance moves with its sentence and the counts must sum; the old unit page becomes a hub. Copy-ready skeleton: `forge/templates/lesson-template.md`. Left open for the next cascade: one or two exercises per lesson, the session calendar, gate thresholds for 3-idea lessons.

## Local calls

| Model | Tokens (prompt/out) | Time | Use |
| --- | --- | --- | --- |
| qwen2.5:32b-instruct | 460 / 397 | 28.7 s | drafts of U2/U3 "In practice" examples; hand-edited; one added claim discarded |
| thessia-scholar-v3 | 423 / 88 | 28.7 s | voice pass on six U2 claims; discarded (added causal claims, lost meaning) |

Ollama was idle and in-practice PID 48350 was not running before the calls.

## Verification

- `PHASE-EX9.exit-gate.sh`: failures 0 (incl. browser check 325 views, 0 failures; A12 caption honesty + opt-out)
- `PHASE-EX0..EX8.exit-gate.sh`: each exit 0
- `npm test` 55/55; deck–lesson sync + probe tests green
- `npm run build`: exit 0, "Publication safety passed" — run by the orchestrator at a20b1f7 (my own attempts were blocked by a classifier outage); no rights-report change

## Uncertain / open

- Example traces and design examples need the professor's approval (FINAL-REVIEW P0).
- Stale internal metadata: `MEDIA_RIGHTS_LINE` in U1/U2 still says "diagram-fallback"; `ct-unit-forge.mdc` §4 still says "B1/B2/B3 prose".

**Resume point:** `cascade-harness.sh verify … PHASE-EX9.md <worktree>`, then cold review.
