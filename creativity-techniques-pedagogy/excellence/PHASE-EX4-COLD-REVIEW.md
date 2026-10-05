# PHASE-EX4 Cold Review, round 2: slide-bound image curation (autopilot)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX4 and did not write round 1) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | Round 2 (commit `40f3a06`): F1 and F2 closed by using the diagram fallback with corrected target briefs; F9 ML `lab-2` Klee unbound; F7 six alt texts/briefs corrected; F4 shortlist headers fixed; F8 list added to FINAL-REVIEW. 33 images bound (U1 7/8 core, U2/U3/ML 6/8). Runner log at `b1cba5b`, exit 0 |
| **verdict** | PASS |

Branch `cascade/excellence-4` at `a42ac2f`. The runner log names commit `b1cba5b`, which is an ancestor of the tip. The only commit after it is `a42ac2f`, and that commit adds only the verify log (`git show --stat a42ac2f`: 1 file). `b1cba5b` adds only the round-1 review and renames the round-1 log. So the log covers the fix commit `40f3a06`. Fix diff read in full: `git diff b7753c9 40f3a06` (22 files, +136/−315). The working tree was clean before this file was written.

**Why PASS:** both blocking findings are closed. The two slides are back on the diagram fallback (which round 1 allowed as a fix). The new briefs describe the image each slide is looking for, so they no longer misdescribe anything. Nothing is orphaned or left dangling. No asset is reused anywhere. Every deck stays at or above 75% core imaged. Gates EX0–EX4, the tests, the validator, a scratch build, the safety script and the deck renderer all pass. I opened 12 images (the six F7 images and six more), and none scores below 4. The findings below are all P2 and none blocks.

## Findings

### F1: Private curation records still carry the round-1 "BOUND" rows and briefs for the three unbound slides
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** `grep -n "Mina Crandon\|AGBell\|Notebook BF 149" PHASE-EX4-REPORT.md` → lines 165, 179, 198 still read `4/5 | BOUND.` / `5/5 | BOUND.` in the per-candidate score table. The round-2 note ("The per-deck table above is round 1") covers the per-deck tables at lines 73/84/103 but not this one. In the shortlists, the `**Brief:**` lines are still the round-1 briefs: `u-3-development-solutions-SHORTLIST.md:55` still says the Bell sketch "thinks the device through on paper before it is built", which round 1 found false. `u-2-…-SHORTLIST.md:89` and `ml-…-SHORTLIST.md:84` keep the old Margery and Klee briefs. The decks and `choices.py` `BRIEF_EDITS` carry the corrected briefs.
- **Fix:** In the report's score table, add a "(round 1; see Round 2)" label or update the three rows. Regenerate the shortlists with `shortlist.py` from `BRIEF_EDITS`, or add a line under each of the three slides with the round-2 brief.

### F2: FINAL-REVIEW undercounts the Wright images in U3
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** `FINAL-REVIEW.md:70`: "U3 uses two Wright brothers images (cover, lab-2)". The U3 bindings are `cover` (1902 glider, `57602839…`), `masterclass-6` (Orville Wright's diary, `d9354771…`) and `lab-2` (1900 kite, `fd8903c0…`), as shown by my render run and FINAL-REVIEW's own rows 48, 53 and 55. That makes three Wright items, which matches round 1 F9.
- **Fix:** Change the line to "three Wright items (cover, masterclass-6 diary, lab-2)".

### F3: Two small alt-text slips remain after the F7 fix
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence (images opened):**
  - U1 `lab-2`, `94083edd…`: the new alt text says "words in German and Dutch". The poster also has French text ("Tous les matins j'enfile mes bottines", "Dada n'est pas une école littéraire", Tzara). The "giant red letters spelling 'DADA'" correction is accurate.
  - U3 `masterclass-6`, `d9354771…`: "A page of Orville Wright's diary". The image is a two-page spread (pp. 54–55). The "squared notebook paper" correction is accurate.
- **Fix:** "words in German, Dutch and French"; "Two pages of Orville Wright's diary …". Edit them in `choices.py`, then rerun `bind.py` and rehydrate.

### F4: Round-1 cascade amendments not applied (F3 and F6 of round 1)
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** yes. These were the orchestrator's items in round 1. I am naming the files again here.
- **Evidence:** `grep -n "llama3.2-vision" LOCAL-EXECUTION.md PHASE-EX4.md` → `LOCAL-EXECUTION.md:54` (EX4 workload row: "llama3.2-vision checks image–brief fit") and `PHASE-EX4.md:20` ("Use local `llama3.2-vision`…"). Both are unchanged. `TECHNICAL-DIRECTOR-CASCADE.md` A6 has no addition for curator-only flags (round 1 F6). `rights-report.json` summary still shows `v2_flagged: 7` against 8 flagged deck assets.
- **Fix:** In `LOCAL-EXECUTION.md` (EX4 row) and `PHASE-EX4.md` line 20, name `qwen3.8:27b` (vision, think:false, plain text). Add the curator-flag validator check to the EX11 F5 item in `TECHNICAL-DIRECTOR-CASCADE.md` A6.

### F5: Round-1 F5 (single-candidate slides) is still unrecorded, and the report misstates it
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** `PHASE-EX4-REPORT.md` round-2 table: "F5 (3 candidates on every slide) … stay open". Round 1 F5 found the opposite: 13 of 40 slides have a single candidate. `grep -n "F5\|single-candidate\|one candidate" FINAL-REVIEW.md DECISIONS-LOG.md` returns nothing for EX4. The fix round 1 offered (alternates, or a DECISIONS-LOG and FINAL-REVIEW entry) was not done.
- **Fix:** Correct the wording in the report. Add a DECISIONS-LOG entry and a FINAL-REVIEW §2 line listing the single-candidate slides (and the four diagram slides that had no viable candidate) so the professor knows where there is no alternative to choose from.

## Acceptance re-check

| Item | Status | Evidence (this session) |
| --- | --- | --- |
| F1 closed: U2 `lab-2` | PASS | Deck slide `background_kind: diagram`, no `asset_id`/`media_slot_id`; the new brief is a target brief (Surrealist automatic-writing page, *Les Champs magnétiques* 1919), not a claim about a bound image. Registry, deck `assets`, `rights-report.json` entries removed; `2d3944251498bdc9.webp` deleted; `vision.json`/`shortlists.json`/`choices.py` rescored 2 with `chosen=None` (so a `bind.py` rerun keeps it unbound: `bind.py:19` binds only when `chosen and score>=4`) |
| F2 closed: U3 `masterclass-4` | PASS | Same pattern; Bell rescored 3, Leonardo rescored 3 by eye, `chosen=None`; `666666fbfc6d691d.webp` deleted. Diagram fallback was one of round 1's two accepted fixes. New brief describes a target sheet of quick alternative sketches. The 508 px Leonardo claim was not independently re-fetched |
| No orphans / dangling refs | PASS | Script over U1–U3/ML deck JSON: every bound slide's `asset_id` is in the deck's `assets` and in `autopilot-assets.json` (33/33, no extras); no deck `assets` entry without a bound slide; no `curated` slide without an asset; no stale `media_slot_id`; `deck-media/` 33 files = 33 referenced, 0 orphans, 0 missing. Repo-wide grep for the three hashes and titles finds only private records/evidence (F1 above), nothing in `docs/` |
| F9: Klee in one deck; ML `lab-2` diagram | PASS | ML `lab-2` `background_kind: diagram`; `5b9a1cdd450330e4.webp` deleted; Klee `2ef7976e…` only in U3 `masterclass-5` |
| No reuse within/across decks (scripted) | PASS | `reuse ids: []`, `reuse files: []`, SHA-1 byte duplicates across deck-media: `[]` |
| F7 alt-text corrections accurate | PASS (2 residual slips, F3) | Opened all six: Dollond (ruler, brass scale, four instruments beside the shagreen case): correct. Kleine Dada Soirée (red DADA letters): correct, but the text is not only German/Dutch. Sprite Fright: 9+8 = 17 labelled heads, correct. Wright diary: squared paper correct, two-page spread. Loïe Fuller: wood engraving, 8 panels (serpentins, corbeille, hélice, papillons): correct. Binet: two Paris schools, values ≤ 10 per age column: "pass rates (out of 10)" correct |
| F4 shortlist headers | PASS | `grep -n "^Fit score" *SHORTLIST.md`: all four line 5 name `qwen3.8:27b (think:false)`; generator `shortlist.py` changed too |
| F8 list present; Profield read-only | PASS | FINAL-REVIEW EX4 section lists 10 tc U1–U3 accepts of 2026-10-04. I checked these against `review-state.json` (10 accepted entries with tc U1/U2/U3 assignments; the times 12:30, 16:00, 16:05, 16:41, 16:46, 16:49, 20:55, 20:57, 21:03 and 21:04 Z match). `shasum` = `8f48e3a971368165c44ef8c8cb9a459776b22d64`, mtime `2026-10-04T23:29:51`. Both are identical to round 1, so EX4 round 2 did not write it. The diff touches no Profield path |
| `node --test scripts/tests/index.js` | PASS | `tests 30 · pass 30 · fail 0` |
| `validate-decks --strict --rights=flag` | PASS | `6 deck file(s), 0 error(s), 12 warning(s)`, exit 0 |
| Gates EX0–EX4 from worktree root | PASS | each `exit=0`, `failures: 0`, 0 `FAIL` lines; `git status` clean afterwards |
| ≥ 60% core imaged per deck | PASS | U1 7/8 (88%), U2 6/8 (75%), U3 6/8 (75%), ML 6/8 (75%) |
| Decks render | PASS | Scratch `git archive HEAD` → `jekyll build` exit 0. Ran `student-media-deck.js` in a VM with DOM/Reveal/fetch stubs against each built `content.json`: U1 13/13 sections, 9 deck-media backgrounds; U2, U3, ML 13/13, 8 each; diagram slides (U2 `lab-2`, U3 `masterclass-3/-4`, ML `masterclass-3`, `lab-2`) paint the geometric SVG; every painted file exists in `_site`; no error path. U4 15/15, unchanged (`git diff excellence/integration...HEAD -- …/u-4-workplace-application` empty). No `promoted_assets`, so no image can fill a diagram slide |
| Safety script on scratch build | PASS | `Publication safety passed`, exit 0; no "profield" in built U1–U3/ML deck JSON |
| Banned names | PASS | grep over U1–U3/ML deck data: none |
| Spot-view 6 more bindings (fit) | PASS | U1 `masterclass-3` Gem clip advert: 4 (object of the unusual-uses test; alt exact). U1 `masterclass-4` Rodin, Cleveland cast: 4 (alt omits the bomb-damaged base, which is visible; not misleading). U2 `analysis-model` Seurat study: 4. U3 `analysis-model` Van Doesburg cow study no. 3: 4 (alt exact). U3 `lab-2` Wright 1900 glider as tethered kite: 4 (alt exact). ML `masterclass-4` six chairs design: 4 (six variants, one upholstery; alt exact). None below 4 |
| Rights/flags | PASS (unchanged) | 8 flagged rows in FINAL-REVIEW §2 table (33 rows = 33 bindings); `rights-report.json` 34 entries = 33 + U4 legacy; no stale entries |

## Notes

- Round 2 changed no runtime code (`scripts/` untouched, only `evidence/EX4/*.py`), so it needs no new tests. The 30/30 suite is the same suite as round 1.
- The deck renderer ignores `diagramFallback` and paints diagram-kind slides with the geometric pass SVG cycle. This was already the case in round 1 and is not EX4 scope.
- None of these findings invalidates a downstream phase's assumptions. F4 repeats the doc amendments round 1 already assigned to `LOCAL-EXECUTION.md`, `PHASE-EX4.md` and `TECHNICAL-DIRECTOR-CASCADE.md` A6.
- This reviewer does not mark DONE; the product owner decides.
