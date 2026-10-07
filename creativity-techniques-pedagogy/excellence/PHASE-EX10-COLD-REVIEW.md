# PHASE-EX10 Cold Review (round 2)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX10) |
| **reviewed_at** | 2026-10-07 |
| **worktree** | `creativity-techniques-uem-integration-excellence-10` |
| **branch tip** | `7282f50` — `git show 7282f50 --stat` → only `PHASE-EX10-VERIFY-LOG.md` (+29 lines) |
| **round-2 fix commit** | `f94d88f` (`git diff 5206c85..f94d88f` — 18 files, bank/protocol/consent/decks/quizzes/cards/tests) |
| **prior review** | `PHASE-EX10-COLD-REVIEW-round1.md` (FAIL, blocking F1–F5) |
| **implementer claim** | Round 2 closes F1–F5; exit gate 0 failures; tests green |
| **verdict** | PASS |

Round-1 blockers F1–F5 are closed with runnable evidence. One non-blocking carryover (AUT method card “class pool” wording, round-1 F9) remains for EX11.

## Round-1 blockers re-check

### F1 — U2 retrieval notes vs bank `retrieval_answer` · **RESOLVED**

**Requirement:** answers 4/5 must match bank order; pre-fix state must fail the new alignment check.

Evidence (current deck, `docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json`):

```
Q4: What does Norman warn about one or two early ideas?
Q5: In Six Thinking Hats, what does the black hat cover?
notes:
- 4. Becoming fixated on one or two ideas too early; generate numerous ideas (Norman 2013, 226).
- 5. The negative aspects: why it cannot be done (de Bono 1985, 32).
```

Evidence (alignment vs bank on commit `5206c85` — pre-fix):

```
node … # compare lines[n] to `- ${n+1}. ${q.retrieval_answer}`
→ MISMATCH 4 U2-11 / MISMATCH 5 U2-14
→ round-1 commit mismatches: 2
→ would fail on 5206c85 U2 deck: true
```

Evidence (test guards order):

```
npm test  # scripts/tests/practice-quizzes.test.mjs
→ ok 46 - retrieval slides: … notes answer ${n + 1} matches retrieval_answer
# tests 67, pass 67, fail 0
```

**Fix status:** swapped in `f94d88f`; test added in same commit.

### F2 — Honest ≥30% apply/analyse/evaluate · **RESOLVED**

**Requirement:** not inflated by copying lesson “In practice” lines; label share ≥30% with honest stems.

Evidence:

```
node -e '… bank …'
→ total 68 labelled higher 27 share 39.7%
```

Evidence (anti-copy test):

```
npm test
→ ok 48 - higher-order stems do not copy the lesson worked example
```

Evidence (heuristic: 30+ char stem prefix in lesson body for higher-order items):

```
→ higher-order count 27
→ stems with 30+ char substring in lesson 0 []
```

Inflated recall items relabelled (example): `U2-05`, `U2-24` → `bloom: understand` (not counted in higher-order bucket). Rewritten stems use new briefs (café menu, night-bus poster, museum label, etc.).

**Fix status:** bank rewrite + relabel in `f94d88f`; gate still counts labels only, but the dedicated test and spot-read stems support an honest ≥30% share.

### F3 — Consent privacy vs protocol procedure · **RESOLVED**

**Requirement:** one procedure in protocol §2/§5/§6 and matching EN/ES consent.

Evidence (protocol §2):

```
Everyone in the room does the same Alternative Uses Task as an ordinary class activity, so watching the session does not show who has consented.
After the session the third person keeps only the sheets whose code matches a signed consent form. Sheets with no matching consent are destroyed unread.
```

Evidence (protocol §5 week 1 / week 14): whole class AUT; third person keeps only consented sheets; rest destroyed unread.

Evidence (consent EN):

```
The lecturer cannot tell who took part by watching the class, and does not know who took part until final marks are published: this form is collected by [third person], not by the lecturer.
```

Evidence (consent ES, same promise):

```
El profesor no puede saber quién participó mirando la clase … Este formulario lo recoge [tercera persona], no el profesor.
```

**Fix status:** `MEASUREMENT-PROTOCOL.md` + both consent forms updated in `f94d88f`; `DECISIONS-LOG.md` records the choice.

### F4 — What-if and Parallel prototyping “When to use” on built cards · **RESOLVED**

Evidence (`docs/methods/en/cards/index.html`):

```
What-if … When to use: When you want to link or combine ideas you already have; use with care, because this kind of prompt can hurt the generation of new ideas.
Parallel prototyping … When to use: When you want to explore several directions before critique, by making more than one prototype from different starting points.
```

Evidence (tests):

```
npm test
→ ok 41 - buildCards … whenToUse({ id: 'what-if-prompts' … }) / parallel-prototyping overrides
→ ok 42 - committed cards page … ≥ 20 cards
```

**Fix status:** `WHEN_OVERRIDE` in `scripts/build-method-cards.mjs` + pins in `method-cards.test.mjs` (`f94d88f`).

### F5 — Peer sheet vs U2 Lab (swap top threes) · **RESOLVED**

Evidence (`docs/practice/en/peer-rating-sheet/index.md` rule 7):

```
Rate another team's items, not your own. If you recognise one of your team's ideas, write "own" in that row and do not score it.
```

Evidence (lesson optional peer rating, `docs/lessons/.../u-2-idea-generation-selection/index.md`):

```
swap your top three with a neighbouring team … Each person rates the other team's three items
```

**Fix status:** sheet + intro line updated in `f94d88f`; lesson step unchanged and now aligned.

## Additional acceptance checks

| Check | Result | Evidence |
| --- | --- | --- |
| 5 public quiz items per unit | PASS | `data-question` count 5 per `docs/practice/en/u-*/index.html`; IDs U1-04,07,10,14,17 · U2-04,07,08,16,21 · U3-05,09,13,17,19 |
| U3-08 not on same public page as U3-09 | PASS | U3-08 `public_quiz` unset; built page `data-question="U3-05"…"U3-19"` only — no U3-08 |
| Bank/protocol/consent not in `_site` | PASS | `grep -rliF 'question-bank.yml\|MEASUREMENT-PROTOCOL\|…/assessment' _site \| wc -l` → `0`; exit gate `PASS: assessment files private` |
| Exit gate | PASS | `bash creativity-techniques-pedagogy/excellence/PHASE-EX10.exit-gate.sh` → `failures: 0` (matches `PHASE-EX10-VERIFY-LOG.md`, commit `7282f50`) |
| Full test suite | PASS | `npm test` → `# tests 67, pass 67, fail 0`; `node --test creativity-techniques-pedagogy/excellence/tests/*.test.mjs` → `12/12` |
| Cards ≥20 | PASS | `grep -c 'data-method-card' docs/methods/en/cards/index.html` → `40` |
| `approved_by:` | PASS | `assessment/APPROVAL.md`: `approved_by: autopilot (drafts — not for use before professor approval)` |
| Hard constraints (Master paste) | PASS | No private assessment paths in `_site`; publication firewall terms not added in EX10 public outputs (spot grep on practice/cards/decks) |
| Amendment A14 (master-lectures caption check) | PASS (orchestrator) | `5206c85` adds `_site/master-lectures` to `PHASE-EX9.exit-gate.sh` line 91 — not part of `f94d88f` diff but present on branch |

## Bank spot-check (10 items, lesson-only derivability)

Spot-checked: U1-03, U1-14, U1-21, U2-08, U2-17, U3-03, U3-06, U3-09, U3-18, U3-20. Answer keys match lesson prose and cited refs; no key errors found in this sample (full round-1 table still applies for the rest).

## Findings (new / carryover)

### F6 — AUT method card still says “class pooling” / “Pool the class lists” · P2 · does not block DONE

Evidence:

```
grep -ni 'class pool\|Pool the class' docs/methods/en/cards/index.html
→ line 69: Group: individual, class pooling
→ line 70: step 4: Pool the class lists; …
```

A13 removed “class pool” from the U1 lesson; the generated AUT card still contradicts the Lab (shared board / table groups). Same as round-1 **F9** — defer to EX11 / catalogue source fix.

**Fix:** amend `techniques.base.yml` (or catalogue generator input), rebuild cards; track in `PHASE-EX11.md`.

## Acceptance (PHASE-EX10.md)

| Criterion | Result |
| --- | --- |
| Exit gate (bank, quizzes, retrieval, cards, privacy) | PASS |
| Bank counts, fields, refs, ≥30% higher-order (labels + honest stems) | PASS |
| Three practice pages × 5 `data-question` | PASS |
| One retrieval slide per U1–U3 deck (content aligned) | PASS |
| Protocol + consent private; drafts banner | PASS |
| Cards page ≥20 | PASS |
| Cold reviewer: bank answer keys from lessons | PASS (sample + round-1 full pass unchanged on keys) |

## Regression

- Touched modules load: `node -e "import('./scripts/build-method-cards.mjs')"` / `build-practice-quizzes.mjs` → OK.
- Prebuild/build run inside exit gate (`PASS: jekyll build`); idempotence not re-run this session (unchanged from round-1 report unless gate failed — it did not).

## Notes

- Do **not** mark DONE here; professor triage + `PHASE-EX10-REPORT.md` remain.
- Before professor bank approval: optional polish on non-blocking F6; ethics §8 and SSCS/Amabile sources still pending per protocol (allowed draft state).
- Downstream: EX11 should pick up F6 (AUT card wording).
