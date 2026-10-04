# PHASE-EX0 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-04T17:15Z (approx.) |
| **finished_at** | 2026-10-04T17:40Z (implementation; awaiting `cascade-harness.sh verify` and cold review) |
| **cold_review** | PHASE-EX0-COLD-REVIEW.md (not yet filed) |
| **cascade_amended** | none (downstream surprises reported below for the orchestrator and cold reviewer; not patched here) |
| **branch / worktree** | `cascade/excellence-0` · `creativity-techniques-uem-integration-excellence-0` |

## Summary

Wrote the probe, recorded the baseline, and wrote the provisional weights
decision. The probe uses only the Node standard library. It reads the repo and
an existing `_site` and prints one JSON object with the 11 keys that
PHASE-EX0.md requires, plus a `_meta` block (probe version, commit measured,
timestamp, oversize threshold). `--targets` exits 1 when any EX11 target is not
met. `--from <json>` checks the targets against a stored result.

**The main finding is that HEAD is not the state that was audited.** The
FINDINGS audit was taken at `1af967d`. HEAD (`a1da745`) includes a media
rehydration that changed the decks the gate measures. At HEAD, U3 has 0 dangling
slots (it now reuses 2 rank-dealt assets) and there are 24 `.php` cache files.
The runbook asks for a baseline "at HEAD", but its acceptance values (21 `.php`,
U3 dangling = 6) only hold at `1af967d`, so the two requirements cannot both be
met. I therefore pinned `evidence/baseline-EX0.json` to the audited commit
`1af967d`. I measured it from a `git archive` export with its own `jekyll
build`, so `_meta.commit` = `1af967d4…`. I saved the honest HEAD measurement next
to it as `evidence/head-EX0.json`. This choice is logged in DECISIONS-LOG.md,
and the first item for the cold reviewer is to accept or reject it.

## Files changed

- `creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs` (new)
- `creativity-techniques-pedagogy/excellence/evidence/baseline-EX0.json` (new; probe at `1af967d`)
- `creativity-techniques-pedagogy/excellence/evidence/head-EX0.json` (new; probe at HEAD `a1da745`)
- `creativity-techniques-pedagogy/excellence/evidence/EX0-qwen-probe-prompt.txt` (new; local model prompt)
- `creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md` (new; PROVISIONAL, P0 for final review)
- `creativity-techniques-pedagogy/excellence/DECISIONS-LOG.md` (new)
- `creativity-techniques-pedagogy/excellence/PHASE-EX0-REPORT.md` (this file)

Nothing was changed under `docs/`, `scripts/` or `_config.yml`. `npm run build`, `prebuild` and `develop` were never run.

## Acceptance Criteria Met

- [x] `node probe/excellence-probe.mjs` exits 0 and prints every key. Verified with `node creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs > evidence/head-EX0.json` (exit 0). All 11 keys are present, plus `_meta`.
- [x] The probe detects the pre-fix state. `baseline-EX0.json` (at `1af967d`) shows: `php_cache_files` 21, U3 `dangling_slots` = `U3.still.profield-1…6` (6), `rank_dealing_present` true, U1 `lab_exercise_counts` 3, and `tao_with_author_citation` = 1 (U3 slide 3, "(Cross 2006, 17)"). **Caveat:** this holds at the audited commit, not at HEAD. At HEAD the values are 24 and 0 (see the mismatches).
- [x] `node probe/excellence-probe.mjs --targets --from evidence/baseline-EX0.json` exits 1 with 24 unmet targets. On the HEAD measurement it reports 25 unmet targets and exits 1. A synthetic clean result exits 0. A missing decision file is reported as an unmet target.
- [x] `DECISION-EX0-GUIA.md` has all seven fields, and 60 + 40 = 100. I verified the pass conditions against the PDF with `pdftotext -layout` (§7.1: ≥ 5,0 in the final test; at least 50% of activities delivered).
- [ ] Cold review filed. Pending; this is the orchestrator's next step.

Exit gate, run by the implementer at the caller's request:
`bash creativity-techniques-pedagogy/excellence/PHASE-EX0.exit-gate.sh` gave 7 PASS, 0 FAIL, `failures: 0`, exit 0.
The harness's own `cascade-harness.sh verify` run is still to come.

Counterfactual: with a baseline taken at HEAD, the gate's "baseline detects pre-fix state" check would FAIL (`php_cache_files` 24 ≠ 21; U3 dangling `[]`).

## Baseline vs FINDINGS: mismatches (recorded, not corrected)

| # | FINDINGS says | Probe measures | Note |
| --- | --- | --- | --- |
| M1 | Audit at `1af967d`. B7: U3 has 0 assets and dangling `profield-1…6`. B11: 21 of 33 cache files are `.php` | At `1af967d`: same (6 dangling, 21 `.php`, 33 files). At **HEAD `a1da745`**: U3 has 2 assets, 0 dangling, 24 `.php`, 36 files | Commit `a1da745` (labelled as cascade docs) also rehydrated U1 and U3 and added 3 `.php` files (`001689d2…`, `02c1a057…`, `34491d14…`). U3's 10 media slides now cycle through "Circus performers." and the "Dymaxion house". B7 has turned into a B6-style wrap-around problem. It is not fixed. |
| M2 | B12: 11 of 33 cache files unreferenced | 13 at `1af967d`, 12 at HEAD | The probe counts a file as referenced if its basename appears in any text file under `docs/`. FINDINGS does not state its method. |
| M3 | A1 lists 4 files with 70/30 | 7 places at `1af967d` (8 at HEAD) | Additional: a second line in the portfolio brief (`:92`, internal `[VERIFIED]` block), and the `evaluation_feed` front matter in U1 and U2 lessons (`:45`), plus U4 `:38` at HEAD. `docs/index.html:80` already says 60/40. Neither the `:92` line nor `evaluation_feed` is rendered in the built HTML (checked with grep over `_site`). They are source-level stale weights. |
| M4 | E1: forge 8, harness 4, vault 5, lesson-scribe 4, profield 5 files | At `1af967d`: forge 10, harness 4, vault 5, lesson-scribe 4, profield 6, udit 3, open procurement 1, guía clone 3 | The probe scans `.html .json .xml .txt .js .css .yml .md`, which includes `assets/js/*.js` and `tao/data/quotes.json`. FINDINGS' scope is unstated. `udit` hits: `web-atelier-udit` links and an "ATELIER UDIT" CSS comment or class. |
| M5 | B12: three files of 4–5 MB | `oversize_cache_files` (> 600 KB) = 8 | Not a contradiction. The three 4–5 MB files are confirmed. The extra five are a 3.0 MB GIF and four `.php` JPEGs of 666–807 KB. |

These match FINDINGS: C1 (1 Tao line labelled Cross 2006), C6 (9 of 17 U2 references uncited), C11 (U1 has 3 lab exercises), B1 (`rankCursor` present), B9 (every licence empty: 20 assets at `1af967d`, 26 at HEAD), and A3 (the PDF says 60/40).

## Downstream surprises (reported for orchestrator / cold reviewer; not patched)

1. **EX1 weight scope is narrower than the EX11 target.** EX1 deliverable 1 lists 4 pages. The EX11 `public_weights` target also covers the lesson front-matter `evaluation_feed` lines (U1, U2, U4) and the portfolio `:92` line. These lines are in page sources and are not rendered in HTML today. If EX1 does not touch them, EX11 `--targets` will still fail. Possible amendments: add them to EX1 deliverable 1, or narrow the probe to rendered text.
2. **U4 now exists at HEAD** (deck and lesson). U4 is outside this cascade's scope (it belongs to ct-unit-forge and in-practice). However, the EX11 targets measure all decks and lessons. U4 contributes an empty-licence asset, the uncited `ref-lucas-knotts-2026`, and a 70/30 `evaluation_feed`. EX11 needs a scope rule for U4, or the U4 owners need to close these.
3. **B7 has changed form at HEAD** (M1). EX4's U3 curation should start from "2 rank-dealt assets reused across 10 media slides", not from "0 assets".
4. The **rehydration ran outside a phase worktree** between the audit and HEAD. This is the failure the hard constraint "no `npm run develop`/`prebuild` on main" is meant to prevent. Someone should check how `a1da745` came to include deck changes.

## Local model calls

| # | Model | Purpose | Prompt | Tokens (prompt / output) | Wall time |
| --- | --- | --- | --- | --- | --- |
| 1 | `qwen2.5-coder:32b` via `POST localhost:11434/api/generate` (stream false, temperature 0.1, num_ctx 8192) | First draft of `excellence-probe.mjs` | `evidence/EX0-qwen-probe-prompt.txt` | 1118 / 3733 | 187.8 s |

Before loading the model I checked `in-practice/runtime/process.json`: PID 48350 was not alive, and `ollama /api/ps` showed no loaded model. The draft (443 lines) had defects that I fixed while reviewing it:

- The front-matter parser cut the JSON at the last `\n---`.
- The `uncited_references` logic was inverted: it searched the References section itself.
- Orphan detection only matched `.php` basenames.
- It wrote `measurements.json` into the cwd as a side effect.
- It renamed the leak-term keys.
- `dangling_slots` left out decks with no dangling slots.
- The knowledge regex captured "70% knowledge tests; **30%**" as 30.

I rewrote most of the module. No opencode or other autonomous agent was launched.

## Cold-review triage

- Blocking findings: none yet (review not filed)
- Deferred: none

## Blockers

None for the gate. The **P0 for the final review** is that the weights are PROVISIONAL: 60/40 is taken from the 2025/26 PDF under AUTOPILOT §0.

## Resume point

Run `cascade-harness.sh verify … PHASE-EX0.md <this worktree>`. Then the cold review should check the baseline-pinning decision first (DECISIONS-LOG, M1). If the reviewer rejects it, follow the undo steps in DECISIONS-LOG and re-run the gate. Under that path the gate's expectations need a "gate amendment" finding.
