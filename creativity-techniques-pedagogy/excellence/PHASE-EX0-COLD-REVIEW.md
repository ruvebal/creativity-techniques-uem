# PHASE-EX0 Cold Review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session) |
| **reviewed_at** | 2026-10-04T17:44:07Z |
| **implementer_claim** | VERIFYING |
| **verdict** | PASS |

Scope reviewed: `git diff a1da745..cascade/excellence-0` (3b84c63 implementation, 5102924 orchestrator
Amendment A1, 377a318 verify log). Branch tip `377a3189ed25`. No finding blocks EX0 `DONE`. Three P1
findings (F2, F5, F7) require cascade amendments **before the named downstream phase is opened**.

## Findings

### F1 — Baseline pinned to audited commit 1af967d: faithful, not gamed (P2, blocks DONE: no)

- **Ruling:** this follows the intent of the runbook. The Acceptance row says what the baseline is
  for: "The probe detects the pre-fix state … (A probe that reports zeros on this HEAD is broken)".
  The expected numbers (21 `.php`, U3 dangling 6) come from FINDINGS, which was measured at `1af967d`.
  The runbook author assumed HEAD == audited state. `a1da745` broke that assumption: it is labelled as a
  docs commit, but it also rehydrated decks. The probe code is the same for both measurements, the
  numbers were not changed, HEAD was measured as well, and the choice was disclosed (report M1,
  DECISIONS-LOG, TECHNICAL-DIRECTOR-CASCADE A1 "Baseline").
- **Evidence (reproduced independently):**
  - `git merge-base --is-ancestor 1af967d a1da745` → ancestor. `git diff --stat 1af967d a1da745 -- docs scripts _config.yml` shows 3 new `.php` cache files, U1/U3 `content.json` rewritten, and U4 added.
  - `git ls-tree -r --name-only 1af967d docs/assets/images/profield-cache | grep -c '\.php$'` → `21`; the same at `a1da745` → `24`.
  - `git archive 1af967d | tar -x -C <scratch>`, then `bundle exec jekyll build --source docs --destination <scratch>-site` (exit 0), then `node probe/excellence-probe.mjs --root <scratch> --site <scratch>-site --commit 1af967d4…`. All 11 keys are equal by value to `evidence/baseline-EX0.json`.
  - `node probe/excellence-probe.mjs` on the worktree (default `_site`, built by the gate): all 11 keys are equal to `evidence/head-EX0.json`. Only `_meta.commit` differs (377a318 vs a1da745), and no `docs/`/`scripts/` change exists between those commits.
  - At HEAD the probe still detects the pre-fix state on 4 of 5 axes: php 24, rank true, U1 labs 3, tao 1. U3 dangling is 0 because the defect changed form: 2 assets now cycle over the media slides, which the probe does not measure (see F4).
- **Residual defect:** `PHASE-EX0.md` Deliverables still says `baseline-EX0.json — probe output at HEAD`. The runbook and the evidence disagree.
- **Fix:** amend the PHASE-EX0.md Deliverables line to read "probe output at audited commit `1af967d`; launch HEAD in `evidence/head-EX0.json` (Amendment A1)".
- **Cascade amend?** yes: PHASE-EX0.md (wording only).

### F2 — `uncited_references` becomes vacuous after EX6 (P1, blocks DONE: no; amend before EX6 opens)

- **Evidence:** the probe collects ids only from hand-written `id="(ref-…)"` spans in
  `docs/lessons/en/creativity-techniques/*/index.md`. PHASE-EX6.md:41 says "Lessons stop hand-writing
  `<span id="ref-…">` lists", and the EX6 gate asserts `absent … 'id="ref-'`. Simulation on an
  archive of HEAD, with only the `id="ref-…"` attributes removed from U2 (Lehrer is still in the text, `grep -c Lehrer` → 4):
  `uncited {'u-1-introduction-creativity': [], 'u-3-development-solutions': [], 'u-4-…': ['ref-lucas-knotts-2026']}`.
  U2 drops out of the key, and its 9 uncited references go unreported. After EX6, `--targets` would pass this key whatever the citation state.
- **Fix:** the probe must read the post-EX6 source of truth: the keys in `docs/_data/references.yml` plus `page.references`, or the rendered reference list in `_site`. It should also fail (not skip) when a scoped lesson yields zero references.
- **Cascade amend?** yes: PHASE-EX6.md (deliverable: update `uncited_references` in the probe in the same phase) or PHASE-EX11.md.

### F3 — Probe omits the master-lecture deck and lesson (P2, blocks DONE: no)

- **Evidence:** `DECKS_REL = 'docs/tracks/en/uem/2627-ct'` and `LESSONS_REL = …/creativity-techniques`. The master-lecture deck is at `docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json`. Independent scan: `2627-ml/creative-process-analysis … assets 2 emptylic 2`. The real empty-licence count at HEAD is therefore 28, not the 26 the probe reports, and the report's statement "B9 … 26 at HEAD" matches FINDINGS only within the 2627-ct scope. The master lecture lesson (4 refs, 0 uncited today) is also not measured. Amendment A1 puts the master lecture in scope.
- **Fix:** add `2627-ml` to deck measures and `docs/lessons/en/master-lectures/*` to `uncited_references` when the probe is scoped (PHASE-EX11 already asks for a probe scope update).
- **Cascade amend?** yes: PHASE-EX11.md (name 2627-ml explicitly).

### F4 — Other false-green paths in `--targets` (P2, blocks DONE: no)

- **Evidence** (synthetic `--from` and live-tree tests):
  - `public_weights: []` with everything else clean → `exit 0`. Deleting or rephrasing every weight statement (for example "knowledge exams 60%") passes. Partial mitigation: the EX1 gate's `present "evaluation page states 60%"`.
  - Removing `quote_origin` from U3 slide 3 while keeping "(Cross 2006, 17)" → `tao []`.
  - Renaming `rankCursor` to `slotCursor` without changing the dealing logic → `rank False`.
  - `lab_exercise_counts` skips decks that have no lab slides at all, so a deck with 0 labs is not reported.
  - Asset reuse or wrap-around (FINDINGS B6, and B7 in its HEAD form) is not measured at all.
- Sanity checks that pass: work-weight mismatch `60/30` → `UNMET … decision is 60/40`, exit 1; missing key → exit 1; `rank_dealing_present: null` → exit 1; missing `--from` file → exit 2; missing decision → exit 1; synthetic clean result → exit 0; baseline → exit 1 (24 unmet); head → exit 1 (25 unmet).
- **Fix (EX11):** require at least one `public_weights` entry per A1 contract page; flag `tao` by quote text or by any Tao-sourced slide whose label is not the Tao label; add a `reused_assets` key; report decks with no lab slides as 0. EX3's validator and tests should own B1 rather than a string check.
- **Cascade amend?** yes: PHASE-EX11.md (probe hardening list).

### F5 — gate amendment: EX2 leak scan no longer covers U4 HTML, which leaks today (P1, blocks DONE: no; amend before EX2 opens)

- **Evidence:** A1 changed `PHASE-EX2.exit-gate.sh` to `scoped_site_html | xargs grep …`, which drops `/u-[4-9]-` pages. The master-paste hard constraint "Publication firewall: no … forge … in student HTML" was **not** amended and is site-wide. Built `_site` at HEAD: `_site/lessons/en/creativity-techniques/u-4-workplace-application/index.html: <p><em>Forge date: 2026-10-04 · Studio: crea-comm.net</em></p>`. `scripts/verify-publication-safety.mjs`, which still scans the whole site, has no `forge` pattern, and EX2 only requires patterns for harness, lesson-scribe, vault and udit. Result: EX2 and EX11 can both go green while `main` would publish a firewall violation. A1 justifies "no edits" to U4. It does not justify dropping detection of a hard-constraint breach on the live site.
- **Fix:** keep the U1–U3-scoped grep as the pass/fail check, and add an unscoped report step that writes U4–U6 hits to `FINAL-REVIEW.md` as a **release blocker** for the merge to `main`. Alternatively, require a `forge` pattern in the site-wide safety script and record the U4 failure as a known blocker owned by the U4 forge.
- **Cascade amend?** yes: PHASE-EX2.md and PHASE-EX2.exit-gate.sh, plus TECHNICAL-DIRECTOR-CASCADE A1 (state that the firewall stays site-wide).

### F6 — gate amendment: scope arrays are narrower than A1 states (P2, blocks DONE: no)

- **Evidence:** A1 removes U4–U6. `SCOPED_LESSONS`/`SCOPED_DECKS` (gates/common.sh) also drop `creativity-techniques/special-creative-process-analysis` (lesson) and `how-to-pass-this-track` and `special-creative-process-analysis` (decks) from the EX1, EX6 and EX9 `absent` checks. EX1 "Tao of Development openers removed" used to scan all of `docs/lessons`. Today this is harmless: the special lesson is a 14-line "Moved" stub with no `id="ref-`, Lehrer, 1981 or Tao matches, `grep -c "fluency thirty"` is 0 in both dropped decks, and EX2 retires the special deck.
- **Fix:** select by exclusion (everything except `u-[4-9]-*`) rather than by inclusion, so new non-unit pages stay covered.
- **Cascade amend?** yes: gates/common.sh (low priority).

### F7 — A1 leaves EX3 in conflict with the untouched U4 deck (P1, blocks DONE: no; amend before EX3 opens)

- **Evidence:** PHASE-EX3 deliverable 3 moves the cache `profield-cache/` → `deck-media/`, deletes orphans and whitelists extensions (no `.php`). U4 is out of scope ("no edits"), and its deck references `profield-cache/0a359d9b946505e1.php` (`grep -o 'profield-cache/[^"]*' …/u-4-workplace-application/data/content.json`). Carrying out EX3 as written breaks a U4 image on the live site. The A1 text on "legacy decks … stay buildable" covers validator warnings, not missing files.
- **Fix:** EX3 should keep any file referenced by a legacy (schema v1) deck at its current path and exempt it from orphan deletion, or the U4 owner should migrate first. Whichever is chosen, record it in A1.
- **Cascade amend?** yes: PHASE-EX3.md (and A1 bullet "Deck schema versioning").

### F8 — DECISION-EX0-GUIA.md matches the PDF (green, P2 informational, blocks DONE: no)

- **Evidence:** `pdftotext -layout cv/sources/9990002301.pdf -` gives: Titulación "Grado en Diseño", Curso académico "2025/2026"; §7 "Pruebas de conocimiento 60%", "Entrega de y/o presentación de trabajos 40%"; §7.1 "mayor o igual que 5,0 en la prueba final", "al menos el 50 % de las actividades"; §7.2 repeats 5,0 and 50%. The file has all 7 fields and 60+40=100. It carries the PROVISIONAL header and `status: PROVISIONAL (P0 for final review)`. `confirmed_by: professor-provisional-2026-10-04` is exactly the value pre-registered in AUTOPILOT §0 and §2 row EX0, so not stopping BLOCKED is authorised.
- **Fix:** none. The P0 stays open for FINAL-REVIEW.

### F9 — Hard constraints (green, blocks DONE: no)

- **Evidence:** `git diff --name-only a1da745..cascade/excellence-0 | grep -vc '^creativity-techniques-pedagogy/excellence/'` → `0`. Nothing under `docs/`, `scripts/` or `_config.yml` changed. `git ls-files .cascade-lane _site` → empty, and `.cascade-lane` is ignored (`.gitignore:59`). The probe imports only `node:fs/path/process/child_process/url`. A grep of added lines for openai|anthropic|claude|gemini|api_key|http(s)|fetch( finds nothing. The Qwen call was local Ollama (prompt kept in `evidence/`).

### F10 — Gates, verify log, gitflow tests (green, blocks DONE: no)

- **Exit gate** (run by me from the worktree root): `bash creativity-techniques-pedagogy/excellence/PHASE-EX0.exit-gate.sh` → 7 PASS, `failures: 0`, exit 0.
- **Verify log:** Commit `510292464bd6…` is an ancestor of the tip `377a318`. `git diff --stat 5102924..cascade/excellence-0` changes only `PHASE-EX0-VERIFY-LOG.md`.
- **gitflow tests:** `bash creativity-techniques-pedagogy/excellence/tests/test-gitflow.sh` → 14 PASS (1–6b, "main untouched", 7a–7c), `failures: 0`, exit 0. The new temp-dir guard and the `sync` refusal path both work. Afterwards the main worktree is still at `a1da745` (`git worktree list`).

### F11 — Probe weights and uncited logic are correct (green, blocks DONE: no)

- **Evidence:**
  - **Uncited references:** the logic is not inverted. Ids come from the whole file, and citations are matched in the body before `## References`. An independent count for U2 gives 17 ids, 9 uncited, the same 9 ids as the probe (FINDINGS C6).
  - **Weights:** at HEAD the probe pairs every live 70/30 line with its work figure, including evaluation `:19/:20` across lines, the how-to-pass table cell and `evaluation_feed`. It does not pick up "Intra-rubric: presentation 70%" (`evaluation/index.md:51`, U1 `:193`, U2 `:171`, how-to-pass `:20`) as a contract weight, which is correct.
  - **Labs:** the U1 lab count of 3 is confirmed from `git show` at both commits.

## Acceptance re-check

| Acceptance item | Result | Evidence |
| --- | --- | --- |
| `node probe/excellence-probe.mjs` exits 0, prints every key | MET | exit 0 on the worktree; 11 keys + `_meta`; equal to `head-EX0.json` |
| Probe detects the pre-fix state (21 / U3 6 / rank true / U1 3 / tao ≥ 1) | MET (at audited commit; see F1) | reproduced from `git archive 1af967d`: 21, 6, true, 3, 1 |
| `--targets --from evidence/baseline-EX0.json` exits non-zero | MET | exit 1, 24 unmet |
| DECISION has 7 fields, weights sum to 100 | MET | F8 |
| Cold review filed; blocking findings closed | MET by this file; no blocking findings | — |

## Notes

- Not run (as instructed): `npm run build`, `prebuild`, `develop`. Builds used were `bundle exec jekyll build` into the worktree's ignored `_site` (via the gate) and into the reviewer scratchpad for `1af967d`.
- Report item 4 (rehydration landed on `main` inside a commit labelled as docs) is confirmed by the `1af967d..a1da745` diff stat. It is a process breach of "Do not run `npm run develop`/`prebuild` on main". The orchestrator should record it in FINAL-REVIEW.
- Under cascade-forge's amend-on-surprise rule, the amendments in F1, F2, F5 and F7 should land with or right after this review, before EX2, EX3 and EX6 are opened respectively. The reviewer did not edit those files.
