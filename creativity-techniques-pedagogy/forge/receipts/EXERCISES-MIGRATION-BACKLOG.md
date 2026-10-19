# Exercises migration backlog

**Law:** Lessons and decks **link** `/exercises/en/<ex-id>/`. They do not embed steps, materials, or verbatim quotes once a datasheet exists.

**Harness:** `~/src/.cursor/skills/exercises-forger/SKILL.md` · `npm run hydrate:exercises` (emits `.html` — Liquid only; avoids kramdown mangling field-index markup).

## Live catalogue (12)

| ex-id | Units | Notes |
| --- | --- | --- |
| `alternative-uses-task` | U1, U2 | Chen AUT |
| `ask-a-crab` | U4 | Michalko |
| `follow-dogme-95-rules` | U5, U6 | Rubin Temporary Rules |
| `hits-and-dot-voting` | U2, U4 | selection |
| `imposing-constraints` | U5, U6 | constraint family |
| `mental-locks-audit` | U6 | von Oech family (held) |
| `process-trail` | U1, U5 | catalogue gap quote |
| `question-led-rough-prototype` | U3, U5 | Knapp |
| `random-word-stimulation` | U2, U5 | association |
| `reflection-in-action-log` | U3, U6 | Schön |
| `seed-collection` | U2, U4, U6 | U4.2 tool seeds |
| `visitor-journey-walkthrough` | U4 | Michalko walk |

## Lesson Labs → links (done 2026-10-18)

| Lesson | Linked datasheets | Still embedded (no sheet yet) |
| --- | --- | --- |
| U1 | `alternative-uses-task` | Cut-up / readymade; Lab debate |
| U2 | `hits-and-dot-voting` (+ optional `random-word-stimulation`) | 6-3-5 brainwriting; in-class COCD + hats after hits |
| U3 | `question-led-rough-prototype` | Parallel prototyping (three entry points) |
| U4.1 | `ask-a-crab` | — |
| U4.2 | `seed-collection`, `visitor-journey-walkthrough` | — |
| U5 | `question-led-rough-prototype`, `process-trail` (+ Dogme / Imposing related) | — |
| U6 | `reflection-in-action-log`, `mental-locks-audit` | — |

## Still to forge (optional next)

| Candidate | Why | Target lesson |
| --- | --- | --- |
| 6-3-5 brainwriting | U2 Ex1 still long in lesson | U2 |
| Parallel prototyping (three entry points) | U3 Ex1 | U3 |
| Cut-up + readymade | U1 Ex2 | U1 |

## Link pattern (student HTML)

```markdown
**Try it:** [Follow Dogme 95 Rules]({{ '/exercises/en/follow-dogme-95-rules/' | relative_url }})
```

No Ahmes names in the lesson body. Provenance stays in exercise YAML → Liquid comment via hydrate.
