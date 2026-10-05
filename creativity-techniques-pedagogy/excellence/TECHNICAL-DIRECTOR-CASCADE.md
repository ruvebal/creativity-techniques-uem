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

## Amendment A2 (EX0 cold review, 2026-10-04)

- **F5 — firewall stays site-wide.** The publication firewall is a hard
  constraint and outranks A1's scope. EX2 may make **firewall-only edits** in
  U4–U6 (remove internal terms from rendered text, nothing else) and its gate
  scans the whole built site. A sync conflict on those files is a stop rule.
- **F6 — scope by exclusion.** Gate scope = everything except `u-[4-9]-*`
  (keeps the special-lesson stub, how-to-pass and special decks in scope).
- **F7 — do not break legacy decks.** EX3 never deletes or moves a cache file
  that any deck (including legacy U4) references; `profield-cache/` keeps
  exactly those files until their deck migrates.
- **F2 — EX6 updates the probe** so `uncited_references` reads the
  `references.yml` mechanism, not hand-written spans.
- **F3, F4 — EX11 hardens the probe** (master-lecture deck/lesson, empty
  `public_weights`, missing `quote_origin`, renamed rank dealing, decks with no
  lab slides, asset reuse) before evaluating targets.

## Amendment A3 (EX1 cold reviews, 2026-10-04)

- **EX2 (F9):** the internal guía id `9990002301` is rendered on the track
  page; add it to the leak patterns and remove it from student text.
- **EX6 (F2, F3, F4):** re-verify every pin cite against the **printed** page
  (Chen 2012 pins are PDF indexes: PDF p. 41 = printed p. 26); for EPUB sources
  (Rubin, Csikszentmihalyi, de Bono 1970) record the edition's real page or
  switch to chapter/section locators, never synthetic index+1; supply the
  research citations for U2's "push past the obvious by producing more"
  (Osborn 1953; Beaty and Silvia 2012; Ward 1994).
- **EX9 (F5, F6, F7):** every unit lesson keeps a `## Workshop` section whose
  first line states when Workshop runs ("From session 4: …"; U1: "No Workshop
  in sessions 1–3"), consistent with the Evaluation and How to Pass rhythm;
  label every intra-rubric percentage "of D1"; add a `## Tao of Creativity`
  section with `id="tao-of-creativity"` to every U1–U3 lesson listing that
  unit's Tao lines, so the deck links resolve.

## Amendment A4 (EX2 cold review, 2026-10-04)

- **F1/F5 gate amendment (strengthening):** EX2 leak terms add scholar-voice,
  enrichment pack, extraction order, source adjudication, agentic; bare
  "harness" narrowed to architecture phrasings (agentic/local/studio harness,
  "harness:") so ordinary English ("harness divergent thinking") is not blocked.
- **F3 gate amendment:** built HTML must link `/ai-declaration/` under the
  site baseurl.
- **F2:** the forge rules that mandate the old footer (`forge/ct-unit-forge.mdc`
  §4b, `forge/CREATIVE-PROCESS-ANALYSIS-FORGE.mdc` footer line) are amended in
  EX2 to the one-sentence declaration footer, so U4–U6 forging and EX8–EX10
  do not reintroduce it.
- **F6 → EX3:** remove the Profield comment from `student-media-deck.js`; the
  safety script's profield check covers JS.
- **F7 → EX6:** add Verón 1988, Steimberg (reconcile 1993 vs 2013), Chion and
  Alexander to `research-manifest.yml` as master-lecture works (verified or gap).

## Amendment A5 (EX2 round-2 cold review, 2026-10-04)

- **F1 gate correction:** `harness:` moved outside the word-boundary group in
  the EX2 gate (it could never match inside `\b(...)\b`).
- **F2 → EX3:** the safety script adds patterns for cascade-harness, lesson
  harness, studio extraction layer, cite-grade discovery (the public "role
  vocabulary" of the external lesson-scribe skill); the EX3 gate checks them.
  The external skill `~/src/.cursor/skills/lesson-scribe/SKILL.md` §9 is outside
  the repo: listed in FINAL-REVIEW for the professor to align.
- **F3, F4, F5 → EX9:** plain wording for U4-free lesson jargon such as
  "page locators" / "page-backed Chicago claim" in U1–U3; remove the duplicate
  "Lessons" breadcrumb; emit `hreflang="es"` only when the Spanish URL differs
  from the page's own URL.
- **F7 → release:** run `npm ci` before the release build (`postcss` lives in node_modules).

## Amendment A6 (EX3 cold review + landing, 2026-10-04)

- **Landing regression (orchestrator fix):** the EX3 gate reinstalls
  `node_modules` when `package-lock.json` is newer (the integration worktree
  had a pre-sharp install). Environmental; no check weakened.
- **F1, F3 → EX4 (before any rights record is written):** `rightsVerdict` fails
  an asset whose author death year contradicts its PD/EU-term claim, whatever
  reason text is given (test with Duchamp d. 1968 + PD-old-70); every bound
  asset — including review-state-only ones — gets an `autopilot-assets.json`
  record carrying its `raw_title`, so review tags are always visible to the
  validator. Under AUTOPILOT §0 such assets publish as `flagged`, never `ok`.
- **F2 → EX4:** correct the STUDENT-SLIDESHOW-FORGE schema text: under
  `--rights=flag` an asset without a clean rights record is published as
  `flagged`, not dropped to diagram.
- **F4 → EX5:** captions come from one tested function (wire `caption()` into
  production or test `publicAsset()`); the renderer shows `licence_url` (CC
  attribution needs the licence link).
- **F5 → EX11:** automated tests for the validator's block/flag modes and the
  orphan check; replace the always-true "rights report written" check with a
  freshness check.
- **F6 → EX4/EX5:** SVG assets are rasterised (or rejected) — never copied raw.
- **F7 → release:** U4's public JSON still contains "profield" (slot name and
  cache path); listed in FINAL-REVIEW as a release item for the U4 forge.

## Amendment A7 (EX4 cold reviews, 2026-10-05)

- **Vision model (EX4 round-1 F3, ruled acceptable):** image–brief checks run on
  local `qwen3.8:27b` (think:false, plain text); `llama3.2-vision` does not load on
  the installed Ollama (`unknown model architecture: 'mllama'`).
- **EX5:** fix the two remaining alt texts (Dada poster also carries French text;
  Wright diary image is a two-page spread); keep captions short (titles from the
  source, not from the brief).
- **EX11:** add a validator/test for curator-only `rights_status: flagged`
  (EX4 round-1 F6: a hand edit to `ok` passes the validator today; the rights
  report counts 7 of 8 flags); the probe measures per-slide candidate depth.
- **Records:** EX4's private score table and shortlist briefs still show round-1
  state for the three unbound slides; FINAL-REVIEW notes this (not student-facing).

## Amendment A8 — RATIFIED by the professor (2026-10-05)

**Stop event:** `gitflow.sh sync` before EX5 conflicted with main commit
`d00539d` (7 files). The orchestrator resolved it on
`cascade/excellence-sync-1` instead of halting; the sync cold review
(`SYNC-1-COLD-REVIEW.md`) found a regression (U4 deck referenced a cache file
EX3 had deleted — fixed by restoring it from main) and ruled the deviation
unsafe as executed. The professor ratified this sync and adopted the protocol below for future
syncs (the orchestrator applies it; `gitflow.sh sync` still stops on conflict):

1. Classify every hunk from main. Genuine content in U1–U3 (non-empty
   overrides, briefs, lesson prose) → stop.
2. U4–U6: take main, re-apply EX2 firewall lines only, EX2 gate must pass.
3. After merge, every cache file referenced by any deck exists (restore from
   main); the EX3 gate checks this (sync-1 F4).
4. Fresh cold review before landing; anything else → stop.

## Amendment A9 (EX5 reviews + professor decision, 2026-10-05)

- **Professor decision — 12 lessons:** the course will have 12 lessons, two
  per official unit (U1.1, U1.2 … U6.2); the six official units/CONTENIDOS stay
  unchanged. This cascade finishes first (EX6–EX11 on U1–U3 + master lecture);
  a new autopilot cascade then forges the 12 lessons on this platform. EX9's
  lesson template and EX11's handoff are designed for that structure.
- **EX8 (R2-F2, R3-F2):** the real-browser check `scripts/tests/browser/deck-layout.mjs`
  runs in the EX8 gate (no Chrome = failure); 0 failures at 1920×1080,
  1280×720, 1024×768 and in print. U2 Lab cards have no spare height at
  1080p — longer Lab text needs a restructured card (e.g. two-column steps).
  Also fix the stale "72%" CSS comment (cards are 74%) (R3-F1).
- **EX9 / EX10 / EX11:** any phase that edits a deck runs the browser check
  in its gate (EX10's retrieval slide).
- **EX11 (R3-F4):** document the quote/trace/timer floor ratios in the forge
  rule (they are test constants today) and add type checks to the print pass.
- **Ratify (P0, FINAL-REVIEW):** EX5 added one sentence to forge golden rule 1
  stating the h1 clamp `clamp(2.15rem, 6.6vw, 3.15rem)` as a floor for every
  layout (same value set 2026-09-14). The browser check reads it.

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
