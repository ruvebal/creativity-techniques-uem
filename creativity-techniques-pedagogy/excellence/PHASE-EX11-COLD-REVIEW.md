# PHASE-EX11 Cold Review (round 3 — post land-regression fix)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX11) |
| **reviewed_at** | 2026-10-07 |
| **worktree** | `creativity-techniques-uem-integration-excellence-11` |
| **branch tip (verify log)** | `cc8dbf0` — verify log only (`PHASE-EX11-VERIFY-LOG.md`) |
| **round-3 fix commits** | `626b828` (A15 print type-floor scope); `457d75f` (`final-EX11.json` `_meta` pin) |
| **prior review** | `PHASE-EX11-COLD-REVIEW-round2.md` (PASS); land then failed EX5 regression on U4 print type floors |
| **implementer claim** | A15 closes land regression; harness exit 0; probe `--targets` green |
| **verdict** | PASS |

Round 2 acceptance stands. Round 3 adds **Amendment A15** (documented gate amendment): print **type** floors in `deck-layout.mjs` are scoped to U1–U3 + master lecture only; legacy U4 remains on the print pass for card-in-page checks. **Amendment A14** (AUT shared-board wording) is unchanged and still clean.

## Summary (land script)

| Field | Value |
| --- | --- |
| **phase** | EX11 |
| **worktree** | creativity-techniques-uem-integration-excellence-11 |
| **implementation** | `626b828` (+ `457d75f` evidence pin) |
| **verify tip** | `cc8dbf0` |
| **finding_count** | 2 |
| **verdict** | PASS |

## Inputs reviewed

1. `PHASE-EX11.md` — Acceptance + amendments A1, A9, A14, A15 (via `TECHNICAL-DIRECTOR-CASCADE.md`).
2. `git diff a5c6e98..626b828` — `deck-layout.mjs`, `TECHNICAL-DIRECTOR-CASCADE.md`, `DECISIONS-LOG.md`, `final-EX11.json`.
3. `PHASE-EX11-VERIFY-LOG.md` (harness at `457d75f`, tip `cc8dbf0`, exit 0) **and** independent reruns below.
4. Land regression transcript `/tmp/excellence-regress-5.log` (pre-A15 failure mode).
5. Master constraints: A1 U4–U6 out of scope; publication firewall; EX5 browser gate still runs on all decks.

## Runnable evidence (cold reviewer)

**Harness verify log** (`PHASE-EX11-VERIFY-LOG.md`, commit `457d75f`, exit 0):

```text
PASS: jekyll build
PASS: probe --targets green
PASS: final evidence saved
PASS: validator --strict green
PASS: safety script green
PASS: media tests green
missing or duplicated: []
PASS: closing audit covers every finding once
PASS: forge rule mentions image_brief
PASS: unit forge mentions references.yml
PASS: AGENTS.md points to the cascade
----
failures: 0
```

**Independent rerun** (worktree at `cc8dbf0`, 2026-10-07):

```text
npm test
→ # tests 81, pass 81, fail 0

node creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs --targets
→ {"targets_met": true, "unmet_count": 0, "unmet": []}
→ exit: 0

bash creativity-techniques-pedagogy/excellence/PHASE-EX11.exit-gate.sh
→ failures: 0

npm run test:browser
→ print 1920x1080 u-4-workplace-application: 13 page(s), 0 failing
→ deck-layout: 340 slide view(s), 0 failure(s)
→ exit: 0
```

**Pre-A15 land regression** (same EX5 browser check, without A15 scope):

```text
tail /tmp/excellence-regress-5.log
→ FAIL: browser layout check
→ FAIL print 1920x1080 u-4-workplace-application #2 … #13: print sentence 20.9px < forge base 38.0
→ deck-layout: 340 slide view(s), 26 failure(s)
→ failures: 1
```

**`final-EX11.json` pin**

```text
jq '._meta.commit' creativity-techniques-pedagogy/excellence/evidence/final-EX11.json
→ "626b828ef12579e4e1ff31051594526f5329aacf"
```

## Acceptance (PHASE-EX11.md)

| Criterion | Result | Evidence |
| --- | --- | --- |
| Exit gate: probe `--targets` exit 0 (scoped) | PASS | Harness + independent `--targets` + `PHASE-EX11.exit-gate.sh` |
| `CLOSING-AUDIT.md` every FINDINGS ID exactly once | PASS | Exit-gate Python check `missing or duplicated: []` |
| Forge rules + `AGENTS.md` mention new contracts | PASS | Exit-gate grep checks PASS |
| Amendment A14 (AUT card wording) | PASS | See **A14 re-check** below |
| A1 probe scope | PASS | `--targets` green; U4 deferred in CLOSING-AUDIT |
| Land regression (EX5 browser on integration) | PASS | `npm run test:browser` 0 failures after A15 |

## A14 re-check (no class pooling)

Requirement unchanged from round 2: public AUT card uses shared-board wording; no “class pooling” or “Pool the class lists”.

```text
rg -n 'class pool|Pool the class' docs/methods/ \
  creativity-techniques-pedagogy/in-practice/canonical/techniques.base.yml
→ exit 1 (no matches)

sed -n '45p' creativity-techniques-pedagogy/in-practice/canonical/techniques.base.yml
→ group_size: "individual, then shared board or table groups of 5–6"

npm test 2>&1 | rg 'A14'
→ ok 56 - A14: AUT card uses shared board, not class pooling
```

Round-3 commits `626b828` / `457d75f` do not touch catalogue or method cards; A14 remains clean.

## Findings

### gate amendment · informational · does not block DONE

**Requirement:** Confirm Amendment **A15** is an intended **A1 scope** gate amendment, not a silent weakening of EX5: EX5 still runs the full browser layout script; U4 still receives print **card-in-page** checks; only A9 **forge type floors** skip legacy U4.

**Evidence — director record** (`TECHNICAL-DIRECTOR-CASCADE.md` § Amendment A15):

```text
grep -A8 'Amendment A15' creativity-techniques-pedagogy/excellence/TECHNICAL-DIRECTOR-CASCADE.md
→ Title for cold review: gate amendment.
→ A9 print type floors … apply only to schema-v2 decks … (U1–U3 + creative-process-analysis).
→ Legacy U4 remains on the print pass for card-in-page checks but is not judged against forge type floors (same A1 scoping as probe targets).
→ Without this, landing EX11 fails EX5 regression on U4 print sentence size.
```

**Evidence — code** (`git diff a5c6e98..626b828 -- scripts/tests/browser/deck-layout.mjs`):

- `PRINT_TYPE_FLOOR_SLUGS` = `u-1-*`, `u-2-*`, `u-3-*`, `creative-process-analysis` only.
- `printProbe(enforceTypeFloors)` wraps type-floor assertions; U4 slug gets `enforceTypeFloors = false`.
- Card overflow / outside-page checks run for **every** deck regardless of slug (lines 251–253 unchanged in intent).

**Evidence — EX5 still invokes browser check** (`PHASE-EX5.exit-gate.sh` includes `npm run test:browser`; post-A15 run: 0 failures; pre-A15 land log: 26 print type failures on U4 only).

**Evidence — decision log**

```text
grep 'A15 gate amendment' creativity-techniques-pedagogy/excellence/DECISIONS-LOG.md
→ 2026-10-07 · EX11 round 3 · A15 gate amendment: A9 print type floors skip legacy U4 (A1 scope) so EX5 regression can land; card-in-page print checks still run on U4
```

**Assessment:** Strengthening/clarifying **scope alignment** with A1 and A9, not removal of U4 from the print pass. U4 forge must migrate to schema v2 and meet floors before release (stated in A15).

**Fix recommendation:** None for EX11; record ratified in cascade amendment A15.

### F3 — A9 print-type checks not in EX11 exit gate · P2 · does not block DONE

**Requirement:** Amendment A9 documents print floor ratios and implements them in `deck-layout.mjs`; EX11 exit gate does not call `test:browser`.

**Evidence (unchanged from round 2):**

```text
grep -l test:browser creativity-techniques-pedagogy/excellence/PHASE-EX11.exit-gate.sh
→ (no match)
```

**Evidence (round 3):** Cold reviewer ran `npm run test:browser` independently — 0 failures including scoped type floors on U1–U3 + ML and card-in-page on U4. Gap remains **EX11 gate coverage**, not regression on in-scope decks or land regression after A15.

**Fix recommendation (optional):** Add scoped `npm run test:browser` to `PHASE-EX11.exit-gate.sh` or document explicit deferral to EX5/land regress script in `NEXT-CASCADE-12-LESSONS.md`.

## New tests vs pre-fix (spot-check)

| Change | Would fail pre-A15 on land? |
| --- | --- |
| `PRINT_TYPE_FLOOR_SLUGS` + `printProbe()` | Yes — `/tmp/excellence-regress-5.log` shows U4 print sentence floor failures without scope |
| Round-2 `method-cards.test.mjs` A14 | N/A to round 3 (no catalogue edits) |

## Regression

- Full suite: `npm test` → 81/81 pass (includes A14).
- EX5-equivalent browser: `npm run test:browser` → 0 failures (land blocker cleared).
- Probe `--targets` exit 0 on current tree.
- Cold reviewer did not edit code, commit, or mark EX11 DONE.

## Downstream

- **U4 forge:** Must migrate to schema v2 and meet A9 print type floors before treating U4 as release-ready (A15).
- **12-lesson cascade:** Platform handoff from EX11 unchanged; optional F3 gate hardening only.

## Notes

- Round 3 scope is minimal (A15 + evidence pin + verify log); CLOSING-AUDIT and forge handoff from round 2 remain valid.
- **Verdict:** PASS · **finding_count:** 2 (**gate amendment** confirmation + **F3** carryover).
