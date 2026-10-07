# PHASE-EX11 Cold Review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX11) |
| **reviewed_at** | 2026-10-07 |
| **worktree** | `creativity-techniques-uem-integration-excellence-11` |
| **branch tip (verify log)** | `04d2203` — `git show 04d2203 --stat` → only `PHASE-EX11-VERIFY-LOG.md` (+26 lines) |
| **implementation commit** | `d2f189b` (`git diff 4c3acdb..d2f189b` — 29 files, +1590 / −126) |
| **phase base (EX10 DONE on integration)** | `4c3acdb` |
| **implementer claim** | Exit gate 0 failures; probe `--targets` green; CLOSING-AUDIT complete |
| **verdict** | FAIL |

One amendment deliverable (A14 / EX10 carryover F6–F9) is only half-closed on the public AUT method card. Gates, probe scoping, audit table, forge handoff, and in-scope platform checks otherwise match the runbook.

## Summary (land script)

| Field | Value |
| --- | --- |
| **phase** | EX11 |
| **worktree** | creativity-techniques-uem-integration-excellence-11 |
| **implementation** | d2f189b |
| **verify tip** | 04d2203 |
| **finding_count** | 3 |
| **verdict** | FAIL |

## Inputs reviewed

1. `PHASE-EX11.md` — Acceptance + amendments A1, A2, A6, A7, A9, A10, A13, A14.
2. `git diff 4c3acdb..d2f189b` (implementation); `git diff d2f189b..04d2203` (verify log only).
3. `PHASE-EX11-VERIFY-LOG.md` (harness runner) **and** independent reruns below.
4. `TECHNICAL-DIRECTOR-CASCADE.md` — Master paste out-of-scope (no U4–U6 forge, no profield writes, publication firewall, A1 scope, F5 site-wide firewall vs scoped probe).

## Runnable evidence (cold reviewer)

**Harness verify log** (`PHASE-EX11-VERIFY-LOG.md`, commit `d2f189b`, exit 0):

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

**Independent rerun** (worktree at `04d2203`, 2026-10-07):

```text
npm test
→ # tests 80, pass 80, fail 0

node creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs --targets
→ {"targets_met": true, "unmet_count": 0, "unmet": []}

bash creativity-techniques-pedagogy/excellence/PHASE-EX11.exit-gate.sh
→ failures: 0

bundle exec jekyll build -d _site-cold && node scripts/verify-publication-safety.mjs _site-cold
→ Publication safety passed: no internal corpus or local-architecture metadata in _site.

npm run test:browser
→ in-scope decks (U1–U3, creative-process-analysis): print + screen PASS
→ u-4-workplace-application: 26 print failures (legacy deck; out of EX11 forge scope)
```

**CLOSING-AUDIT coverage** (same Python as exit gate):

```text
missing or duplicated: []
```

(43 FINDINGS IDs A1–E7, each exactly once in `CLOSING-AUDIT.md`.)

**Probe load:** `node creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs` → JSON on stdout, exit 0.

## Acceptance (PHASE-EX11.md)

| Criterion | Result | Evidence |
| --- | --- | --- |
| Exit gate: probe `--targets` exit 0 (scoped targets) | PASS | Independent `--targets` + exit-gate.sh |
| `CLOSING-AUDIT.md` every FINDINGS ID exactly once | PASS | Exit-gate Python + manual read |
| Forge rules + `AGENTS.md` mention new contracts | PASS | `STUDENT-SLIDESHOW-FORGE.mdc` “U4–U6 inherit”; `ct-unit-forge.mdc` §4a-bis + `references.yml`; `AGENTS.md` excellence paragraph |
| Amendment A14 (AUT card wording) | **FAIL** | See **F1** |
| A1 probe scope (U4 legacy not EX11 failure) | PASS | `final-EX11.json`: `php_cache_files_scoped` / `leak_terms_scoped` empty; global U4 `profield` deferred in CLOSING-AUDIT |
| A9 seed `NEXT-CASCADE-12-LESSONS.md` (not forged U4–U6) | PASS | Seed plan only; §1–§7 tables, no new lesson paths |
| Publication firewall (student HTML) | PASS | `verify-publication-safety.mjs` on fresh `_site-cold` |
| No cloud / profield writes (Master paste) | PASS | Diff confined to repo; no `~/src/profield` changes |

## Findings

### F1 — AUT public card still says “class pooling” (A14 / EX10 F6–F9 incomplete) · P1 · **blocks DONE**

**Requirement:** After EX11, the student-facing AUT method card must not say “Pool the class lists” **or** “class pooling”; catalogue step and group line should match the U1 Lab shared-board wording (Amendment A14; EX10 cold review F6/F9).

**Evidence (step fixed, group line not):**

```text
git diff 4c3acdb..d2f189b -- docs/methods/en/cards/index.html
→ step 4: "Post every list on a shared board (or compare within table groups of 5–6); …"
→ Group line unchanged

rg -n 'class pool|Pool the class' docs/methods/en/cards/index.html \
  creativity-techniques-pedagogy/in-practice/canonical/techniques.base.yml
→ docs/methods/en/cards/index.html:69: … Group:</strong> individual, class pooling
→ techniques.base.yml:45: group_size: "individual, class pooling"
```

**Fix:** Set AUT `group_size` to course wording (e.g. individual + table groups of 5–6, or “individual, then shared board”) in `in-practice/canonical/techniques.base.yml`; run `canonical/build.py` and `node scripts/build-method-cards.mjs`; confirm `docs/methods/en/cards/index.html` has no “class pooling”. Update `DECISIONS-LOG.md` if the group_size semantics change.

### F2 — `final-EX11.json` records wrong commit in `_meta` · P2 · does not block DONE

**Evidence:**

```text
jq '._meta.commit' creativity-techniques-pedagogy/excellence/evidence/final-EX11.json
→ "4c3acdb528dd15974daf614d688a9d79f24c6f2b"
```

Implementation commit is `d2f189b`; verify log also cites `d2f189b`. Probe output at HEAD is valid (exit gate re-runs probe), but the saved artifact mislabels the measured SHA.

**Fix:** Regenerate `evidence/final-EX11.json` at `d2f189b` (or current integration HEAD) so `_meta.commit` matches the tree that was measured.

### F3 — A9 print-type checks not in EX11 exit gate · P2 · does not block DONE

**Requirement:** Amendment A9 adds print floor ratios in `STUDENT-SLIDESHOW-FORGE.mdc` and print checks in `scripts/tests/browser/deck-layout.mjs`.

**Evidence:**

```text
grep -l test:browser creativity-techniques-pedagogy/excellence/PHASE-EX11.exit-gate.sh
→ (no match)

npm run test:browser
→ U1–U3 + ML: print PASS; U4: 26 print failures (legacy, out of forge scope)
```

In-scope decks pass; legacy U4 fails print (expected until U4 schema v2). The gap is gate coverage, not scoped deck typography.

**Fix:** Optional — add `npm run test:browser` to `PHASE-EX11.exit-gate.sh` with U4 excluded or warn-only, or document in `NEXT-CASCADE-12-LESSONS.md` that U4 print is deferred until migration.

## New tests vs pre-fix (`4c3acdb`)

| Test file | Existed at base? | Would fail pre-fix? |
| --- | --- | --- |
| `scripts/tests/excellence-probe.test.mjs` | No | N/A (file absent); fixtures target EX11 probe keys |
| `scripts/tests/validate-cli-modes.test.mjs` | No | N/A; exercises CLI modes / orphan / rights freshness added in EX11 |
| `scripts/tests/deck-claims.test.mjs` | No | **Yes** — `git show 4c3acdb:…/u-1-…/content.json` has 0 `claims` keys; test asserts `claimCount > 0` |
| `validate-decks.test.mjs` “A7: curator-only…” | No | **Yes** — `git show 4c3acdb:scripts/lib/media-rules.mjs` has no `curator registry is flagged` check |

Spot-check: A7 test fails if `rights_status: ok` is set while registry has `rights_status: flagged` — behaviour added in this phase, not a tautology.

## What closed (no finding)

- **Probe hardening (A1/A2/A6/A7):** fixture tests in `excellence-probe.test.mjs` and `validate-cli-modes.test.mjs`; `--targets` green with U4 legacy excluded via `*_scoped` keys.
- **Handoff:** `NEXT-CASCADE-12-LESSONS.md` is a seed (12-lesson sketch, U4 adoption notes, platform contracts); not forged U4–U6 content.
- **Forge + AGENTS:** Substantive “U4–U6 inherit” table and `ct-unit-forge.mdc` §4a-bis (Conclusion → Tao → References); `AGENTS.md` excellence pointer is multi-line, not an empty stub.
- **Claims (A10):** `claims: [{text, cite}]` on scoped decks; `deck-claims.test.mjs` passes on live tree.
- **Rights / curator (A7):** `rights_report_freshness.curator_flagged: 8` in probe JSON; Sawaki in `FINAL-REVIEW.md` rights table (A13).

## Regression

- Full suite: `npm test` → 80/80 pass (includes new EX11 tests via `scripts/tests/index.js`).
- Pre-existing validator / media-rules tests still pass; no unrelated failures observed.
- `test:browser` not part of exit gate; see **F3**.

## Downstream

- **12-lesson cascade:** Pick up **F1** wording before students rely on method cards vs Lab copy.
- Do **not** mark EX11 DONE until **F1** is triaged; professor still owns FINAL-REVIEW P0 ratifications (unchanged from implementer report).

## Notes

- Cold reviewer did not edit implementation, commit, or flip phase status to DONE.
- Verdict for orchestrator: **FAIL**, **3** findings (**1** blocks DONE).
