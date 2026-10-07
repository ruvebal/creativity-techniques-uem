# NEXT CASCADE — 12 lessons (seed plan)

> Seed for the follow-on autopilot cascade that forges **12 lessons** (two per
> official unit: U1.1 … U6.2). This Excellence cascade (EX0–EX11) finishes the
> platform on U1–U3 + the master lecture; it does **not** forge U4–U6 here.
>
> Authority: TECHNICAL-DIRECTOR-CASCADE Amendment A9 (professor, 2026-10-05);
> lesson spine: `forge/LESSON-TEMPLATE.md` §5; contracts: `STUDENT-SLIDESHOW-FORGE.mdc`
> "U4–U6 inherit", `ct-unit-forge.mdc` §0.5 / §4a-bis.

## 1 · Target shape

| Official unit | Lesson A | Lesson B | Notes |
| --- | --- | --- | --- |
| U1 Introduction | `u-1-1-…` | `u-1-2-…` | Split current U1 by Lab exercise `practises` |
| U2 Generation / selection | `u-2-1-…` | `u-2-2-…` | Ex1 generation → A; Ex2 selection → B |
| U3 Development | `u-3-1-…` | `u-3-2-…` | Parallel entry → A; delay/exit → B |
| U4 Workplace | `u-4-1-…` | `u-4-2-…` | Adopt after migrating legacy deck to schema v2 |
| U5 Social / Park | `u-5-1-…` | `u-5-2-…` | Enrichment pack + catalogue candidates; Park cites may use `profield-digital-creativity` |
| U6 Personal | `u-6-1-…` | `u-6-2-…` | Enrichment pack + catalogue candidates |

Official CONTENIDOS and the six unit IDs stay unchanged. Hubs keep the old
`u-N-…` permalinks as indexes linking A and B.

## 2 · Where U1–U3 content goes

Deterministic split (`LESSON-TEMPLATE.md` §5, A13):

1. Read each unit's two `lab_exercise` slides and their `practises` lists.
2. Masterclass ideas → lesson of the exercise that practises them; both → A;
   neither → lesson named by **Try it:**.
3. **Debate-linked** ideas stay with the lesson that hosts the debate
   (Analysis debate usually A; Lab debate with its exercise).
4. **Shared** framing / method-recall ideas → A in full; B keeps a short recall
   + link (provenance stays on A).
5. PROVENANCE_LINE and `#ref-` counts: before (unit) = after (A+B), shared once.
6. Tao lines travel with their slides; `citation.href` points at the owning lesson.

Suggested U1–U3 mapping (verify against live `practises` before forging):

| Unit | Lesson A (Ex1) | Lesson B (Ex2) |
| --- | --- | --- |
| U1 | AUT / fluency–flexibility–originality–elaboration; Ideas 1–3 that Ex1 practises | Cut-up + readymade; Ideas tied to Ex2 + debate-linked craft critique if any |
| U2 | 6-3-5 (+ optional open-monitoring); generation ideas | Select / COCD / hats; selection ideas |
| U3 | Three entry points in parallel | Delay judgement, checkpoint, exit |

## 3 · U4 adoption

- Migrate `u-4-workplace-application` to `schema_version: 2` before any 12-lesson
  split (legacy still names `profield` in public JSON — firewall release item).
- Re-bind images through `autopilot-assets.json` + rehydrate (`--rights=flag`).
- Replace the Lab with two catalogue-backed exercise cards (EX8 field order).
- Add retrieval slide, `references.yml` keys, Conclusion → Tao → References order.
- Firewall-only edits already applied in EX2 must be preserved.

## 4 · U5–U6 sources

| Input | Path / note |
| --- | --- |
| Enrichment | `forge/unit-enrichment/U5-*`, `U6-*` (MAIN-IDEAS.yml + PROFESSOR.md) |
| Catalogue | `in-practice/CANONICAL-TECHNIQUES.yml` (U5/U6 candidate lists from EX7) |
| Grounding | `grounding/EVIDENCE-MATRIX.md` rows; Ahmes nodes only for cites |
| Park / DC vectors | U5 may discover via `profield-digital-creativity`; cite Ahmes only |
| Consent | Student work exhibition needs S-set; research reuse C-set (unpublished) |

## 5 · Platform contracts to reuse (do not re-open)

- Probe + exit pattern: `excellence/probe/excellence-probe.mjs --targets`
- Deck validator: `scripts/validate-decks.mjs --strict --rights=flag`
- Publication safety: `scripts/verify-publication-safety.mjs`
- Browser + print type floors: `npm run test:browser` (quote 0.72 / trace 0.76 / timer 0.70 × base)
- Deck↔lesson pin sync: `excellence/tests/deck-lesson-sync.test.mjs`
- **Structured claims (A10):** `claims: [{text, cite}]` on page-backed slides;
  `scripts/tests/deck-claims.test.mjs` — each claim attested on the cited page
  via PROVENANCE_LINE verbatim (or slide quote when verbatim is absent)
- Method cards / practice quizzes builders (EX10)
- Autopilot + gitflow: land on an integration branch; never push `main` until
  professor release

## 6 · Open decisions for the follow-on cascade

- One vs two Lab exercises per 12-lesson deck (today's spine says two per deck)
- Session calendar per lesson (A/B)
- Gate thresholds for 3-idea lessons (EX9 gate is for ≥ 4 ideas on single pages)
- Whether the master lecture also splits (out of scope unless the professor asks)

## 7 · Suggested first phases (sketch)

| Phase | Goal |
| --- | --- |
| 12-0 | Freeze this seed; confirm A/B slugs and hub redirects |
| 12-1 | Split U1–U3 mechanically (content move + provenance accounting) |
| 12-2 | Migrate U4 to schema v2 + firewall clean |
| 12-3 | Forge U5.1 / U5.2 from enrichment + catalogue |
| 12-4 | Forge U6.1 / U6.2 |
| 12-5 | Cross-unit probe / browser / publication regression |
| 12-6 | Closing audit + FINAL-REVIEW for the 12-lesson release |
