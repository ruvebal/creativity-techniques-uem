# SYNC-1 cold review — merge of `main` (d00539d) into `excellence/integration`

| field | value |
|---|---|
| **reviewer** | cascade-cold-reviewer (fresh session; did not perform the merge) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | bf57a8b on `cascade/excellence-sync-1` (parents c72ee1b `excellence/integration`, d00539d `main`). Policy: U1–U3 lessons/decks + `scripts/rehydrate-student-media.mjs` keep integration (main's changes = redundant 70/30→60/40 fix + automated re-run of the old rank-dealing pipeline with empty `media_overrides`); U4 lesson takes main + re-applies EX2's 3 firewall lines (A2/F5); everything else = git auto-merge. |
| **verdict** | FAIL |

Scope reviewed: worktree `/Users/ruvebal/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem-sync-1`, HEAD bf57a8b. Merge base a1da745. Every claim below comes from a command run in that worktree on 2026-10-05.

## Summary

The resolution policy itself is right. Keeping integration's U1–U3 work loses no human-curated content. The U4 firewall re-application changes exactly 3 lines and the wording is accurate. Gates EX0–EX4, the test suite, the strict validator and the publication-safety script all pass.

The merge still introduces a **live-site regression**. Main's new U4 deck binds a slide to `profield-cache/3431b3f642ee6a65.php`, a file EX3 had deleted on integration. The merged tree references a file that does not exist. The validator reported this as a WARN and the orchestrator went ahead anyway. The run also ignored a pre-registered stop rule. That rule had predicted exactly this conflict (FINAL-REVIEW.md line 109; TECHNICAL-DIRECTOR-CASCADE.md A2/F5).

## Findings

### F1 — U4 deck references a cache file the merge deleted (P1, **blocks landing**)

Evidence:

```
$ grep -rhoE 'assets/images/(profield-cache|deck-media)/[A-Za-z0-9._-]+' docs/tracks docs/lessons | sort -u | while read p; do [ -f docs/$p ] || echo "MISSING $p"; done
MISSING assets/images/profield-cache/3431b3f642ee6a65.php

$ grep -rn 3431b3f642ee6a65 docs/tracks docs/lessons
docs/tracks/en/uem/2627-ct/u-4-workplace-application/data/content.json:36: "asset_url": ".../profield-cache/3431b3f642ee6a65.php"
# bound to slide 11 (workshop_work, background_kind profield, U4.still.profield-2, "A patent sideboard.")

$ git ls-tree main docs/assets/images/profield-cache/3431b3f642ee6a65.php
100644 blob 157ec816...   (exists on main, 56425 bytes, JPEG)
$ git ls-tree excellence/integration docs/assets/images/profield-cache/3431b3f642ee6a65.php
(empty)
$ git log --oneline --diff-filter=D a1da745..excellence/integration -- docs/assets/images/profield-cache/3431b3f642ee6a65.php
6bb4890 EX3: image pipeline rules, tests and deck validator (VERIFYING)

$ node scripts/validate-decks.mjs --strict --rights=flag
WARN  .../u-4-workplace-application/data/content.json: legacy asset file missing profield-cache/3431b3f642ee6a65.php
validate-decks: 6 deck file(s), 0 error(s), 26 warning(s) [strict; rights=flag]   (exit 0)

$ ls _site/assets/images/profield-cache/     # scratch build from bf57a8b
0a359d9b...php 34ca859e...php 45ae0161...php 55a22f1e...php 7d20d950...php c142adfa...php cc5c334d...php
```

Mechanism: when EX3 ran, no deck referenced the file (it was a U1 asset at a1da745, and U4 at a1da745 had 0 references), so EX3 deleted it. Main's d00539d `media_overrides` binds it to `U4.still.profield-2`. Git merged a deletion on one side with a new reference on the other, so there was no text conflict. Live main serves this image today. Landing bf57a8b would leave the U4 "Workshop · Pitch the decision" slide with a 404 background. This breaks A2/F7 ("`profield-cache/` keeps exactly those files [that legacy decks reference]").

The 6 new `.php` files from d00539d are all referenced by the U4 deck (no orphans). Only this 7th reference is broken.

Fix: on `cascade/excellence-sync-1`, run
`git checkout main -- docs/assets/images/profield-cache/3431b3f642ee6a65.php`, then re-run the validator (expect the "file missing" WARN gone), EX3 gate, and commit. The EX3 gate stays green because its check is "profield-cache holds only legacy-referenced files", and this file is referenced.

### F2 — stop-rule deviation (P1, **blocks landing until the professor ratifies**)

Pre-registered rules:
- TECHNICAL-DIRECTOR-CASCADE.md A1: "a conflict stops the run (stop rule)."
- A2/F5: "A sync conflict on those files [U4–U6 firewall edits] is a stop rule."
- FINAL-REVIEW.md:109 predicted the U4 conflict on the footer lines and repeated "per A2/F5 a sync conflict is a stop rule."
- AUTOPILOT.md §4: on a stop, write the reason at the top of FINAL-REVIEW.md and halt.

The orchestrator resolved the conflict instead of halting. It did isolate the work on a review branch and did not touch integration, which kept the deviation reversible.

**Ruling:**
- **Was it safe?** No, as executed. The content judgement was sound: see F3's hunk table, where no genuine content is lost, and U4 is main plus 3 firewall lines. But the resolution produced F1, a broken live slide. That is exactly the cross-side hazard the stop rule exists for: integration's cache cleanup colliding with main's legacy-U4 edits. The orchestrator's own validator run surfaced it (the uncommitted `curation/rights-report.json` in the worktree is that run's output) and it was not acted on.
- Stop rules belong to the product owner. A cold review cannot retroactively turn a halt into a pass. After F1 is fixed, the merge is landable only with the professor's explicit acceptance of the deviation.
- **Adopt as Amendment A8?** Yes, but only conditionally, as a written resolution protocol and not as blanket permission:
  1. Every `main` hunk in a conflicted file is classified in the merge commit or a SYNC-n note: redundant / pipeline output / genuine content. Any genuine-content hunk in U1–U3, meaning lesson prose, briefs, or non-empty `media_overrides`, still **stops** the run.
  2. U4–U6 conflicts are allowed only as "take main, re-apply EX2 firewall lines". After resolution, EX2 runs and must pass.
  3. **After** the merge, every cache file referenced by any deck, legacy included, must exist on disk. Restore any missing ones from `main`. Today this is only a validator WARN, so it needs a gate change (F4).
  4. Every sync resolution gets a cold review before `land`, as here.
  5. Anything outside 1–4 remains a stop.

### F3 — implementer claim (b) is partly inaccurate; outcome unaffected (P2, non-blocking)

d00539d's hunks in the "keep integration" files, classified:

| file | hunk | class | carried? |
|---|---|---|---|
| U1 lesson `index.md` | `evaluation_feed` 30/70 → "work evidence 40% …; knowledge tests 60%" (inside `{% comment %}`) | redundant (integration already says 40/60 per DECISION-EX0-GUIA) | not needed |
| U2 lesson `index.md` | same line | redundant | not needed |
| U3 lesson | no change in d00539d | — | — |
| U1 deck `content.json` | +3 NYPL assets ("Manifestation Dada", `12" gun in Action, Naval`, "An illustration of gates"), `licence: ""`, `credit_line: "nypl"`, `priority/selection_rank: 8`, `collection: unit-accepted`; slots renumbered profield-4…20 | pipeline output (ranked auto-selection, `media_overrides: {}`), unreviewed rights | correctly dropped |
| U2 deck | +1 asset ("Manifestation Dada"), slots renumbered; slide 5 moves to profield-7; 3 slides set to `diagram`, slot ids dropped | pipeline output | correctly dropped |
| U3 deck | 8 slides `profield`→`diagram`, slot ids dropped (dangling slots) | pipeline output (same intent EX3/EX4 already met with bound images) | correctly dropped |
| `scripts/rehydrate-student-media.mjs` | +media_overrides filter, slot de-duplication, no-recycle slide binding, diagram fallback (~50 hand-written lines) | **hand-written code, not old-pipeline output**, but superseded: integration's EX3 rewrite (`scripts/lib/media-rules.mjs`, "no rank dealing, no asset on two slides, unbound media slide → diagram") meets every intent of the patch more strictly | correctly dropped; see F6 for the U4 consequence |

No non-empty `media_overrides`, hand-written briefs, or lesson prose exist in U1–U3 on main (`media_overrides: {}` in all three decks at main). **No genuine content is lost.**

Inaccuracies in the claim:
- (i) d00539d did not run the *old* rank-dealing pipeline. It patched the script first and then ran it. The output is still rank-ordered auto-selection with empty overrides, so dropping it is correct.
- (ii) "Hook and ladder" and "A patent sideboard" were not re-introduced by main. Both were already in U1 at merge base a1da745. Main simply never had EX3/EX4's removals. Main's only *new* U1–U3 images are Manifestation Dada, `12" gun`, and An illustration of gates.

Fix: correct the wording in the sync note / A8 text. No code change.

### F4 — gate amendment (strengthening): a missing legacy cache file must be an error (P2, non-blocking for this merge once F1 is fixed)

A2/F7 says profield-cache keeps *exactly* the legacy-referenced files. The EX3 gate checks only one direction ("holds only legacy-referenced files"). `validate-decks.mjs --strict` downgrades "legacy asset file missing" to WARN (exit 0). That is why EX0–EX4 all pass while F1 exists:

```
EX0 7 PASS / EX1 18 PASS / EX2 32 PASS / EX3 22 PASS / EX4 9 PASS — failures: 0, exit 0 each
```

Fix (gate amendment, strengthening only, allowed by AUTOPILOT.md §4):
- In `PHASE-EX3.exit-gate.sh`, add the reverse check: every `profield-cache` URL referenced by any deck exists on disk.
- In `scripts/validate-decks.mjs`, make "legacy asset file missing" an error under `--strict`, with a test in `scripts/tests/validate-decks.test.mjs`.

Files to amend: `PHASE-EX3.exit-gate.sh`, `scripts/validate-decks.mjs`, and TECHNICAL-DIRECTOR-CASCADE.md (A8).

### F5 — U4 firewall re-application: correct and accurate (P2 notes, non-blocking)

```
$ git diff main bf57a8b -- docs/lessons/en/creativity-techniques/u-4-workplace-application/ docs/tracks/en/uem/2627-ct/u-4-workplace-application/
```

This produces exactly 3 hunks, all in the lesson: the editorial-note Michalko sentence, the AI-authorship paragraph, and the date line. The U4 deck is byte-identical to main.

- The removed terms ("extraction order", "scholar-voice", "Forge date", "source adjudication", email) are all on the EX2/A4 safety list (FINAL-REVIEW.md:109).
- The authorship and date lines are byte-identical to integration's EX2 version.
- The new Michalko sentence ("passages for Wall of Ideas and Ask a Crab are quoted above; their page numbers are not yet verified against the printed edition") is accurate against the rendered page. The built U4 lesson does contain the quoted passages with locators 439, 440 and 402: `grep -o 'Michalko 2010, [0-9–]*'` returns 402 ×2, 439, 439–440 and 440.
- `/ai-declaration/` builds (`_site/ai-declaration/index.html` exists).

Notes:
- (a) The student-facing caveat is weaker than what the studio knows: the numbers are PDF extraction order (`# pdf_order` in MAIN-IDEAS.yml), not merely "unverified" pages. This matches EX2's accepted precedent, and the firewall forbids the precise term. Acceptable.
- (b) Main's two `<span class="domain">` wrappers on those lines are gone. This is harmless because main's site.css now sets `hyphens: manual` on all prose paragraphs.

Leak scan of the rendered U4 lesson and deck HTML found no hits for extraction, locator, retained privately, witness, node_id, document_coat, scholar-voice, ruvebal@, DECISION-EX, pdf_order, needs-review, evaluator_safe, forge date, enrichment, review_status, cover-agentic or LAB_EXERCISE_SELECTION. `node scripts/verify-publication-safety.mjs` reports "Publication safety passed …", exit 0. The published U4 deck JSON does carry `selection_rank` and `media_overrides` fields (9 hits), but main already ships them, so the merge does not introduce them. That is for the U4 forge's v2 migration.

### F6 — U4 forge handoff: main's override-honouring script is gone (P2, non-blocking; amend FINAL-REVIEW.md)

After the merge, `rehydrate-student-media.mjs` is integration's version. It never rewrites legacy (non-`schema_version: 2`) decks. U4's `media_overrides` curation survives as committed JSON, but no script on the merged tree can regenerate it. If the U4 forge on `main` re-runs its d00539d script after landing, it will re-conflict, or overwrite with the old logic. FINAL-REVIEW.md's "Warning for the U4 forge" paragraph must say:
- the U4 forge migrates to schema v2 (`asset_id` per slide) to rehydrate;
- it must not re-patch the old script on `main`.

EX11's handoff report should carry the same note.

### F7 — U4 / U1–U3 `evaluation_feed` wording diverges (P2, non-blocking)

U4 (from main): "work evidence 40% through the course evaluation; knowledge tests 60%". U1–U2 (integration): "presentation evidence 40% path via Lab/D1; knowledge tests 60% via D5 later (DECISION-EX0-GUIA, provisional)". The numbers agree. Both are inside `{% comment %}` and are not rendered. Main's plainer phrasing may be the professor's preferred one. This is for the professor to pick; it is not a merge defect.

### F8 — auto-merged files: sane, nothing reverted (no finding; recorded)

`git diff excellence/integration bf57a8b --stat` touches 14 files, all from main:
- 4 lexicum `cloned_at` timestamps;
- MAIN-IDEAS.yml U4 idea 4 sentence (forge source, not rendered);
- site.css +12/−2. Main's prose wrapping and `.domain` rule are layered on top. Integration's own 2-line site.css change (a1da745→integration) is still present, since the diff against integration shows only main's hunk;
- 6 new U4 `.php` JPEGs, all referenced;
- U4 lesson and deck.

No U1–U3, script, test, gate or cascade file differs from integration.

## Gate / suite transcript (run by this reviewer from the worktree root)

| command | result |
|---|---|
| `bash …/PHASE-EX0.exit-gate.sh` … `EX4` | exit 0 each; 7/18/32/22/9 PASS, 0 FAIL |
| `node --test scripts/tests/index.js` | tests 30, pass 30, fail 0 |
| `node scripts/validate-decks.mjs --strict --rights=flag` | exit 0; 0 errors, 26 warnings, including the F1 "legacy asset file missing" |
| `bundle exec jekyll build --source docs --destination _site` (via gate `build_site`) + `node scripts/verify-publication-safety.mjs` | build PASS; "Publication safety passed", exit 0 |

## Blocking fixes before `land`

1. **F1:** restore `docs/assets/images/profield-cache/3431b3f642ee6a65.php` from `main` on `cascade/excellence-sync-1`. Re-run the validator (the missing-file WARN must be gone), the EX3 gate and publication safety, then commit.
2. **F2:** the professor explicitly accepts the stop-rule deviation. Record it at the top of FINAL-REVIEW.md as the A2/F5 stop event and its ratification. Add Amendment A8 (conditional protocol, F2 items 1–5) to TECHNICAL-DIRECTOR-CASCADE.md in the same commit.
3. Decide what happens to the uncommitted `creativity-techniques-pedagogy/excellence/curation/rights-report.json` in the worktree. It is the validator's output for the merged U4 (assets 34→41, legacy_flagged 1→8). Commit it with fix 1 or discard it; do not land a dirty tree.

Non-blocking, same commit if possible: F4 (gate/validator strengthening), F6 (FINAL-REVIEW U4-forge warning), and the F3 wording correction.

## Notes

- The reviewer edited nothing apart from this file and committed nothing. Running the gates rebuilt the gitignored `_site/`. `curation/rights-report.json` was already modified before this review; it was snapshotted and confirmed byte-identical after the gate runs.
- Downstream phases: this merge does not change any assumption of EX5+, which are scoped to U1–U3. F6 changes the U4-forge handoff text that EX11 must report, so FINAL-REVIEW.md and PHASE-EX11.md (handoff section) are the files to amend.
