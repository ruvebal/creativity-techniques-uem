# CLOSING AUDIT — Excellence EX11

Probe at HEAD: `evidence/final-EX11.json`. Targets:
`node creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs --targets`.

Scope (A1): U1–U3 + master lecture. U4–U6 are reported under
**Out of scope — for the U4 forge**, not counted as probe failures.

| FINDINGS ID | Closing phase | Evidence (probe key / test / file) | Status |
| --- | --- | --- | --- |
| A1 | EX1 (+ EX0 decision) | `public_weights` matches DECISION-EX0-GUIA (60/40); pages under `docs/evaluation`, tracks, assignments | closed |
| A2 | EX0 / EX1 | Wrong guía JSON quarantined; Diseño weights from `cv/sources/9990002301.pdf` + DECISION-EX0-GUIA.md | closed |
| A3 | EX0 | DECISION-EX0-GUIA.md `weights_knowledge_tests: 60` / `weights_work: 40`; probe `--targets` | closed |
| A4 | EX1 | Pass conditions published on How to Pass / evaluation pages | closed |
| A5 | EX6 | Guía core bibliography ingested or gap'd; `research-manifest.yml` + lesson `references:` | closed |
| B1 | EX3 | `rank_dealing_present: false` (behavioural detect in rehydrate; `scripts/tests/excellence-probe.test.mjs`) | closed |
| B2 | EX4 | Slide-bound curation; shortlists + `autopilot-assets.json`; `candidate_depth` in probe | closed |
| B3 | EX4 | U1 lab / Duchamp slides rebound to brief-matching assets | closed |
| B4 | EX4 | U1 cover rebound (Leonardo studies) | closed |
| B5 | EX4 | Duchamp-related assets available via registry; no rank wrap | closed |
| B6 | EX4 / EX3 | `asset_reuse` empty for scoped decks; validator duplicate-asset error | closed |
| B7 | EX4 | U3 dangling slots cleared; `dangling_slots` target 0 | closed |
| B8 | EX3 / EX4 | Review tags via registry `raw_title`; rightsVerdict; not stripped silently | closed |
| B9 | EX3 / EX4 | `empty_licence_assets` target 0; public licence + author on assets | closed |
| B10 | EX4 | EU-term / death-year flags; `rights_status: flagged` + FINAL-REVIEW table | closed |
| B11 | EX3 | `php_cache_files: 0` | closed |
| B12 | EX3 | `orphan_cache_files` / oversize targets 0; `validate-cli-modes.test.mjs` orphan case | closed |
| B13 | EX3 | Slide `asset_id` bind; rehydrate uses `slide.asset_id` | closed |
| B14 | EX5 | Captions + alt rendered; Koch diagram fallback; browser layout check | closed |
| B15 | EX3 | Machine paths not in student JSON; media root not published | closed |
| C1 | EX1 | Tao lines use `(Tao of Creativity)`; `tao_with_author_citation` target 0 | closed |
| C2 | EX1 | U2 Osborn wording corrected | closed |
| C3 | EX1 | Six Hats six colours | closed |
| C4 | EX1 | Fluency/flexibility wording corrected | closed |
| C5 | EX1 | Off-topic quote placement fixed | closed |
| C6 | EX1 / EX6 | Lehrer / fake de Bono removed; uncited refs → 0 via references.yml | closed |
| C7 | EX1 / EX6 | Originality / trainable claims page-checked | closed |
| C8 | EX1 | Eckersall, Grehan, and Scheer 2017 | closed |
| C9 | EX6 | Consistent Chicago via `references.yml` | closed |
| C10 | EX1 | Tao of Creativity (not Development) openers | closed |
| C11 | EX1 / EX8 | Exactly two Labs; Workshop first line states timing | closed |
| C12 | EX6 | Research breadth via manifest + cited works | closed |
| D1 | EX8 | U1 Labs practise Masterclass (AUT; cut-up/readymade) | closed |
| D2 | EX8 | U2 Labs generation + selection | closed |
| D3 | EX8 | U3 Labs match Masterclass; Dow / Osborn cites | closed |
| D4 | EX7 | Canonical catalogue 66 techniques; mapping from export | closed |
| E1 | EX2 | `leak_terms` target 0 over `_site` | closed |
| E2 | EX2 | `_data` not published raw | closed |
| E3 | EX2 / EX3 | `verify-publication-safety.mjs` patterns expanded | closed |
| E4 | EX2 | Special-analysis stub / project_id fixed in scope | closed |
| E5 | EX2 | CI Ruby / npm lock notes; release checklist in FINAL-REVIEW | closed |
| E6 | EX0+ | Jekyll build green in gates | closed |
| E7 | EX3+ | `scripts/tests/` media/validator/probe/claims coverage | closed |

## Out of scope — for the U4 forge

| Item | Why deferred | Decision / pointer |
| --- | --- | --- |
| U4–U6 lesson/deck forge | A1 cascade scope | `NEXT-CASCADE-12-LESSONS.md` §3–§4 |
| U4 public JSON still contains "profield" / legacy cache | Legacy schema until U4 migrates to v2 | FINAL-REVIEW release checklist; A6/F7 |
| Measurement study / student data | AUTOPILOT §2 EX10 | Drafts only; never started |
| Professor ratification of provisional 60/40, images, Labs, consent | Final review packet | FINAL-REVIEW §2 P0 |

## Probe targets (EX11 acceptance)

Run after `bundle exec jekyll build …` and
`node scripts/validate-decks.mjs --strict --rights=flag` (rights-report freshness):

- no `.php` / orphan / oversize cache files **in scope** (`*_scoped` keys; U4-only
  legacy `profield-cache/*.php` is deferred, not a target failure)
- no dangling slots (scoped)
- no rank dealing
- no empty licences on curated slides (scoped)
- two Labs per scoped media deck; no zero-lab scoped decks
- no Tao line with an author-date; no quotes missing `quote_origin`
- no uncited references (scoped); zero leak terms **in scope** (`leak_terms_scoped`)
- public weights equal the decision (non-empty)
- rights report lists every bound asset and tallies `curator_flagged`
