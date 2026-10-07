# PHASE-EX0: Readiness probe, baseline and guía weights decision

> **Track:** contract + measurement (no student-facing change)
> **Status:** READY
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Make the audit re-checkable by a script, record the baseline, and settle the
one fact every later phase depends on: which evaluation weights the 2026–27
Grado en Diseño guía sets. Live failing case (FINDINGS A1–A3):
`docs/evaluation/index.md` publishes "Knowledge tests … **70%**", sourced from
a Videojuegos guía, while `cv/sources/9990002301.pdf` (Diseño 2025/26) says
"Pruebas de conocimiento 60%".

## Deliverables

- `creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs` — Node
  stdlib only; prints one JSON object (keys below); `--targets` exits non-zero
  if any EX11 target is unmet; `--from <json>` evaluates the targets on a stored
  result instead of the live tree
- `creativity-techniques-pedagogy/excellence/evidence/baseline-EX0.json` — probe output at the audited
  commit `1af967d` (Amendment A2/F1; `evidence/head-EX0.json` measures launch HEAD `a1da745`)
- `creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md` — professor-confirmed weights
- `PHASE-EX0-COLD-REVIEW.md`, `PHASE-EX0-REPORT.md`

Probe keys (all required):
`public_weights` (array of `{file, knowledge, work}` found in student pages),
`php_cache_files`, `orphan_cache_files`, `oversize_cache_files` (> 600 KB),
`dangling_slots` (`{deck: [slot…]}`), `rank_dealing_present` (bool: `rankCursor`
in the rehydrate script), `empty_licence_assets`, `lab_exercise_counts`
(`{deck: n}`), `tao_with_author_citation` (slides whose `quote_origin` is
`tao_invented` but whose citation label is not "(Tao of Creativity)"),
`uncited_references` (`{lesson: [id…]}`), `leak_terms` (`{term: files}` over a
built `_site`, terms: forge, harness, vault, lesson-scribe, profield, udit,
open procurement, guía clone).

## Scope

**In:** probe script, baseline JSON, decision record.
**Out:** any change under `docs/`, `scripts/`, `_config.yml`.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX0 per creativity-techniques-pedagogy/excellence/PHASE-EX0.md.

## Deliver
1. Write probe/excellence-probe.mjs (Node stdlib only; no npm deps). It builds
   nothing itself: it reads the repo and, for leak_terms, an existing _site
   (run `bundle exec jekyll build --source docs --destination _site --config _config.yml` first).
2. Run it at HEAD; save output to evidence/baseline-EX0.json.
3. Compare the baseline with FINDINGS-2026-10-04.md. Any mismatch is a finding
   in the report (not a silent correction).
4. Ask the professor for the 2026–27 Grado en Diseño guía weights (or the
   coordinator's written confirmation) and write DECISION-EX0-GUIA.md with the
   lines `weights_knowledge_tests: <n>`, `weights_work: <n>`,
   `pass_final_test_min: <n>`, `pass_min_activities_percent: <n>`,
   `source: <PDF/URL/email>`, `confirmed_by: <name>`, `confirmed_on: <date>`.
   If the professor has not confirmed, stop: status BLOCKED, not guessed.
5. Hand off for cold review. Do NOT mark DONE.

## Constraints
- Read only outside the excellence/ folder
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- `node probe/excellence-probe.mjs` exits 0 and prints every key above
- The probe detects the pre-fix state: baseline has `php_cache_files == 21`,
  U3 `dangling_slots` length 6, `rank_dealing_present == true`, U1 lab count 3,
  at least one `tao_with_author_citation`. (A probe that reports zeros on
  this HEAD is broken.)
- `node probe/excellence-probe.mjs --targets --from evidence/baseline-EX0.json` exits non-zero
- `DECISION-EX0-GUIA.md` has all seven fields; the two weights sum to 100
- Cold review filed; blocking findings closed

## Risks

- The coordinator may not answer quickly: EX0 stays BLOCKED; nothing downstream guesses the weights.
- The 2026–27 Diseño guía may differ from 2025/26 in units or activities too: record it and amend EX1.
