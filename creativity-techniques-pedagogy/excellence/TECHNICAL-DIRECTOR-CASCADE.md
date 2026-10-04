# Technical director — Excellence cascade (EX0–EX11)

**Status:** ACTIVE. Run phases **in order**. Each `PHASE-EXn.md` is a
self-contained paste prompt with a runnable `PHASE-EXn.exit-gate.sh`.

**Mode: AUTOPILOT** (professor decision, 2026-10-04). [AUTOPILOT.md](AUTOPILOT.md)
overrides every "Human gate" below with a pre-registered policy, and
[gitflow.sh](gitflow.sh) replaces the Merge order section: phases land on
`excellence/integration`, never on `main`. The professor reviews once, via
`FINAL-REVIEW.md`, and performs the only merge to `main`.

## Amendment A1 (EX0, 2026-10-04) — scope and concurrent writers

EX0 found that launch commit `a1da745` re-hydrated decks and added a U4
lesson/deck, and that another process (in-practice / U4 forge) keeps editing
U1, U2 and U4 on `main`. Therefore:

- **Scope:** this cascade owns U1, U2, U3 and the master lecture. U4–U6 are
  out of scope for every phase (no edits, no gate checks); EX11 reports their
  state for the U4 forge to adopt. Gates select decks/lessons with `u-[123]-*`.
- **Deck schema versioning:** EX3 marks migrated decks `"schema_version": 2`;
  the validator is strict on v2 decks and only warns on legacy decks, so U4
  stays buildable until its own forge migrates it.
- **Sync:** `gitflow.sh start` first merges committed `main` into
  integration (`gitflow.sh sync`); a conflict stops the run (stop rule).
  Uncommitted edits in the main checkout are invisible to the cascade and are
  listed in FINAL-REVIEW as a release risk.
- **Baseline:** `evidence/baseline-EX0.json` measures the audited commit
  `1af967d`; `evidence/head-EX0.json` measures launch HEAD `a1da745`. Targets
  in EX11 are checked on the live tree.

## Programme (do not invert)

| Step | Phase | Lane | Findings closed | Human gate |
| ---- | ----- | ---- | --------------- | ---------- |
| 0 | EX0 Readiness, probe, weights decision | contract | A1–A3 (decision only) | Professor confirms 2026–27 weights |
| 1 | EX1 Contract and factual hotfix | content | A1–A4, C1–C11 | — |
| 2 | EX2 Publication firewall | infra | E1–E4 | — |
| 3 | EX3 Image pipeline rules + validator | infra | B1, B8, B9, B11–B15, E7 | — |
| 4 | EX4 Slide-bound curation | curation | B2–B7, B10 | Professor picks images; merge EX3+EX4 together |
| 5 | EX5 Deck renderer | infra | B14, presentation | — |
| 6 | EX6 Research grounding | content | A5, C9, C12 | Book procurement (may be PARTIAL) |
| 7 | EX7 Canonical technique catalogue | research | D4 | — |
| 8 | EX8 Lab redesign + exercise cards | content | D1–D3 | Professor signs off Labs |
| 9 | EX9 Lesson structure + exemplars | content | presentation | — |
| 10 | EX10 Didactics layer | didactics | knowledge-test gap, measurement | Consent text approved |
| 11 | EX11 Closing audit | all | — | — |

Phase dependencies are strict: a phase reads files the previous one wrote
(EX3's validator gates EX4–EX5; EX6's `references.yml` gates EX8–EX10; EX7's
catalogue gates EX8). Do not open two phases at once. `cascade-harness.sh`
enforces one worktree per lane for this cascade.

**Operators:** implement with the `cascade-phase-executor` subagent inside the
worktree the harness opened; cold-review with `cascade-cold-reviewer`
(fresh session). Shared-store work in EX4 and EX6 goes through the studio's
sanctioned tools: the Profield review app for image acceptance, the
`ahmes-athanor-vault` agent for vault ingest and quote resolution.

## Master paste (start / resume)

```text
Implement the Creativity Techniques Excellence cascade per
creativity-techniques-pedagogy/excellence/TECHNICAL-DIRECTOR-CASCADE.md.

## Context
- Evidence: creativity-techniques-pedagogy/excellence/FINDINGS-2026-10-04.md
- Repo contract: AGENTS.md (publication firewall, guía authority, Lab
  exercises chosen from the in-practice catalogue, cite Ahmes nodes only)
- Forge rules: creativity-techniques-pedagogy/forge/STUDENT-SLIDESHOW-FORGE.mdc,
  ct-unit-forge.mdc, AI-DECLARATION-LAW.mdc, VISUAL-READABILITY-LAW.mdc
- The course is taught in ENGLISH. Student-facing text stays English.

## Out of scope (must NOT do)
- Forge U4, U5 or U6 lessons/decks (owned by ct-unit-forge + in-practice cascade)
- Modify code or data in ~/src/profield (read only; acceptance via its review app by the professor)
- Touch creativity-techniques-pedagogy/in-practice/runtime/ or start a local
  model workload while an in-practice PID is alive (check runtime/process.json and ps)
- Change the sibling digital-creativity-uem site
- Invent hours, competencies, CONTENIDOS or evaluation weights beyond the guía

## Programme
Execute the next incomplete phase only, in order EX0 → EX11.
After each phase: run PHASE-EXn.exit-gate.sh through cascade-harness.sh verify
(VERIFYING) → fresh cold review → PHASE-EXn-COLD-REVIEW.md → triage/amend →
PHASE-EXn-REPORT.md. Do not start EX(n+1) until EXn is DONE.
The implementer must not self-certify DONE.

## Hard constraints
- Publication firewall: no Ahmes/Athanor/DevIAC/Profield/forge/harness/vault
  names, IDs, paths or local architecture in student HTML or public JSON values
- Never name UDIT or sibling institutions on student-facing surfaces
- Student citations: Chicago author-date, page-verified through Ahmes; an
  unresolved source stays a BIBLIO-GAP in the professor brief, never in student text
- Invented aphorisms are labelled Tao of Creativity, never given an author-date
- Images: no publication without licence, author, source and EU-term check
- Local-first per LOCAL-EXECUTION.md: generation inside scripts uses only local
  Ollama models; no cloud AI SDKs or APIs in repo code. Thessia never supplies facts
- No hand edits to review-state.json, SQLite or Postgres stores
- Do not run `npm run develop`/`prebuild` on main: rehydration rewrites decks;
  run it only inside the phase worktree
- Commits: allowed on phase branches and excellence/integration (autopilot,
  professor-authorised 2026-10-04); never on main; never push main
- Autopilot: follow AUTOPILOT.md; log every judgment call in DECISIONS-LOG.md
```

## Closing protocol

`BLOCKED → READY → IN_PROGRESS → VERIFYING → COLD_REVIEW → DONE`

| Transition | Who | What must be true |
| --- | --- | --- |
| BLOCKED → READY | professor | Previous phase DONE; human gate in the table above met; flip the Gate cell's first word in `INDEX.md` |
| READY → IN_PROGRESS | professor runs `cascade-harness.sh start creativity-techniques-pedagogy/excellence` | Worktree `cascade/excellence-<n>` opened |
| IN_PROGRESS → VERIFYING | implementer | Work done; `cascade-harness.sh verify … PHASE-EXn.md <worktree>` exit 0 (the runner writes `PHASE-EXn-VERIFY-LOG.md`) |
| VERIFYING → COLD_REVIEW | implementer hands off | Diff + verify log + phase Acceptance |
| COLD_REVIEW → DONE | professor after triage | Blocking Fn fixed or deferred with a decision record; downstream phases amended; `PHASE-EXn-REPORT.md` filed |

**Cold review:** fresh session, `cascade-cold-reviewer` agent, inputs = the
phase file, `git diff main...cascade/excellence-<n>`, the runner's verify log,
and the hard constraints above. Output `PHASE-EXn-COLD-REVIEW.md` with
F1…Fn (severity P0–P2, blocks DONE?, evidence, fix). For content phases the
reviewer also re-reads every changed student sentence for accuracy against
its cited page.

**Amend on surprise:** if a phase finds a downstream assumption is wrong
(for example, AI-DECLARATION-LAW requires text EX2 planned to remove, or a
core book cannot be procured), amend this file and every affected
`PHASE-EX(n+k).md` in the same commit as the report and record
"cascade amended: <paths>".

## Resume rule

Status enum (report field and Gate first word):
`BLOCKED | READY | IN_PROGRESS | VERIFYING | COLD_REVIEW | PARTIAL | DONE`.

- **DONE** → move to the next phase; flip its Gate to READY only when its human gate is met.
- **READY** → `cascade-harness.sh start`; hand the worktree to `cascade-phase-executor`.
- **IN_PROGRESS** → reopen the existing worktree (never start a second); read
  the phase report draft, continue; do not advance.
- **VERIFYING** → rerun `cascade-harness.sh verify` if the code changed since
  the last log; then hand off to cold review. Do not open the next phase.
- **COLD_REVIEW** → wait for `PHASE-EXn-COLD-REVIEW.md`; triage; fix blocking
  findings (back to IN_PROGRESS) or file the report and flip to DONE.
- **PARTIAL** → allowed only for EX4 (images still being curated) and EX6
  (books still being procured). The report lists the open items. The next
  phase may open only if its own Acceptance does not depend on them: EX5 may
  follow a PARTIAL EX4 only if every media slide passes the validator
  (missing images fall back to the Koch diagram); EX7 may follow a PARTIAL EX6.
- **BLOCKED** → resolve the named blocker (usually a human gate) first.

## Merge order

Superseded by `gitflow.sh`: every phase lands on `excellence/integration`;
`main` changes only at the professor's release merge, so the diagram-only
state between EX3 and EX4 is never visible to students.

## Layer map

| Layer | Files | Written by | Read by |
| --- | --- | --- | --- |
| Contract | `cv/guides/*.json`, `DECISION-EX0-GUIA.md`, evaluation pages | EX0, EX1 | all |
| Image authority | Profield `review-state.json` (read only) | professor via review app | EX3–EX5 |
| Slide binding | deck `content.json` (`image_brief`, `asset_id`) | EX4 | EX3 validator, EX5 renderer |
| Bibliography | `docs/_data/references.yml` | EX6 | EX8–EX10 lessons, quizzes |
| Techniques | `in-practice/CANONICAL-TECHNIQUES.yml` (private) | EX7 | EX8, EX10 method cards |
