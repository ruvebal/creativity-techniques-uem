# PHASE-EX2: Publication firewall

> **Track:** build config, safety script, student-page wording
> **Status:** BLOCKED (EX1 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Make the public site free of internal machinery, and make the safety script
catch it next time. Live failing cases (FINDINGS E1–E4): a fresh build has
"forge" in 8 files, "harness" in 4, "vault" in 5, "lesson-scribe" in 4, links
to `ruvebal.github.io/web-atelier-udit/…`, and the raw `/_data/` folder;
`verify-publication-safety.mjs` passes anyway. The portfolio brief prints
`[VERIFIED] Official guide: creativity-techniques-pedagogy/cv/guides/…`.

## Deliverables

1. `_config.yml`: drop `_data` from `include`
2. `scripts/verify-publication-safety.mjs`: add patterns for forge, harness,
   lesson-scribe, vault, Thessia, curriculum-internal, open procurement, guía
   clone, contact-forgeable, UDIT/udit, web-atelier, digital-creativity
   sibling mentions; apply "profield" to `.html` only (deck JSON values are
   renamed in EX3); fail if `_site/_data` exists
3. Student wording: track page, lessons hub, U1–U3, master lecture, How to
   Pass, evaluation, assignments — replace internal terms with plain English
   ("pilot" → drop; "D3 Atrium tech script" → what students actually deliver)
4. AI-assisted authorship footers: one sentence + link to `/ai-declaration/`,
   satisfying `forge/AI-DECLARATION-LAW.mdc`; read that law first — if it
   requires anything this removes, keep it and record an amendment
5. Remove the UDIT links and sibling-course comparisons from the master lecture;
   rename the `.footer-logo--udit` class
6. Retire `2627-ct/special-creative-process-analysis/` (the guide moved to the
   master lecture): delete it or replace with a redirect; unify `project_id`
   to `tc` in remaining decks

## Scope

**In:** the files above. **Out:** content corrections (EX1), images (EX3–EX4).

## Prompt (Implementation Agent)

```text
Implement PHASE-EX2 per creativity-techniques-pedagogy/excellence/PHASE-EX2.md.

## Deliver
1. Deliverables 1–6.
2. Keep the curriculum-internal blocks in Markdown (they are switch-gated);
   change only what renders.
3. Run `bundle exec jekyll build --source docs --destination _site --config _config.yml`
   then `node scripts/verify-publication-safety.mjs`; both exit 0.
4. Prove the script now catches a leak: add a temporary page containing
   "lesson-scribe", confirm the script fails, remove it. Record the transcript.
5. Hand off for cold review — do NOT mark DONE.

## Constraints
- English only on student pages
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: build ok; safety script exits 0; `_site/_data` absent;
  independent grep over `_site/**/*.html` finds none of the terms; the safety
  script source contains the new patterns
- The temporary-leak transcript is in the report (the script would have
  failed on the pre-fix site)
- Every lesson and assignment still links `/ai-declaration/`

## Risks

- Liquid templates may read `site.data` only (fine) or fetch `/_data/*.json`
  at runtime (would break): grep `_data/` in `docs/assets/js` before removing.
