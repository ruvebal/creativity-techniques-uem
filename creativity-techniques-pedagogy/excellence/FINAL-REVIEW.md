# Final review — Excellence cascade

Built during the autopilot run; read this once at the end (AUTOPILOT.md §5).

## 1 · Run outcome

| Phase | Status | Tag | Notes |
| --- | --- | --- | --- |
| EX0 | DONE | `excellence/ex0` | Probe + baseline + provisional weights; cold review PASS (11 findings, 0 blocking) |
| EX2 | DONE | `excellence/ex2` | Publication firewall; round 1 FAIL (U4 pipeline text, forge rules, dead declaration link), fixed; round 2 PASS |
| EX1 | DONE | `excellence/ex1` | Contract + factual hotfix; cold review round 1 FAIL (F1 portfolio pass conditions), fixed; round 2 PASS |

## 2 · P0 decisions for you

- **Weights 60/40 (provisional)** — from the Diseño PDF 2025/26; confirm against the 2026–27 guía before release. `DECISION-EX0-GUIA.md`.
- **Release risk — concurrent writer on `main`:** at launch, uncommitted edits existed in the main checkout (U1, U2, U4 lessons; U4 deck). Committed changes are merged into integration before each phase (`gitflow.sh sync`); uncommitted ones are not.
- **Process note:** launch commit `a1da745` re-hydrated decks on `main` (3 more `.php` cache files; U3 now cycles 2 images over 10 slides) — the "no prebuild on main" rule was broken outside the cascade.
- **U4–U6 out of scope** (Amendment A1): only firewall-only edits (A2/F5). U4 issues found so far: 70/30 weight line (`docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md:38`, `evaluation_feed` front matter — EX1 1b leaves it for the U4 forge), uncited `ref-lucas-knotts-2026`, empty-licence asset, "Forge date" in rendered page.

- **Deck images (EX3):** U1–U3 and the master lecture are diagram-only except two kept images, both `rights_status: flagged` (Profield `modern_rights_review_required` tag not cleared). `curation/rights-report.json` lists every flag. EX4 must fill the rest before release (its gate needs ≥ 60% of core slides imaged).

## 3 · Per phase

### EX0 — readiness probe, baseline, weights

- Added `probe/excellence-probe.mjs` (Node stdlib), `evidence/baseline-EX0.json` (audited commit `1af967d`), `evidence/head-EX0.json` (launch HEAD), `DECISION-EX0-GUIA.md`.
- Local model: 1 call, `qwen2.5-coder:32b`, 3,733 tokens (probe draft; mostly rewritten after review of its bugs).
- Gate: 7 PASS / 0 FAIL (runner log `PHASE-EX0-VERIFY-LOG.md`). Cold review: PASS; reviewer reproduced both JSONs independently.
- Cascade amended: A1 (scope U1–U3, deck schema v2, `sync`), A2 (site-wide firewall, F2–F7 probe/EX3 fixes).
- Roll back: `gitflow.sh rollback 0`.

### EX1 — contract and factual hotfix

- 60/40 + pass conditions (≥ 5.0 final test, ≥ 50% activities, extraordinary-session rule per guía §7.2) on evaluation, track, How to Pass, portfolio; U1/U2 front-matter weights fixed; wrong-degree guía JSON renamed.
- U3 Cross misattribution relabelled Tao; U2: six hats complete (checked vs de Bono 1985 pp. 200–201), Osborn contradiction fixed, quotes replaced with page-verified ones, References 17 → 8 (Lehrer 2012 and "de Bono 1981" removed); U1: originality = rare answers (Chen), "trainable" qualified, two Lab exercises (Directory → autonomous work), no Workshop in sessions 1–3; Tao of Development openers replaced; Eckersall co-authors.
- **Pin-cite correction found:** de Bono 1985 map/route quote is printed p. **199** (was 211, a PDF index). Reviewer found Chen 2012 pins are also PDF indexes (EX6 re-verifies all, Amendment A3).
- Local models: 1 Thessia voice pass — **discarded** (invented citations); ~20 Athanor searches. Thessia has fabricated in every unsourced test so far.
- Full before/after table (39 rows): `PHASE-EX1-REPORT.md`. Roll back: `gitflow.sh rollback 1`.

### EX2 — publication firewall

- `_data` no longer published; the safety script gains 15 patterns, an HTML-only `profield` check and a `_site/_data` check. The new script fails on the pre-fix site (45 findings) and on a temporary `lesson-scribe` page; the old script passed the pre-fix site.
- 38 student-facing sentences rewritten in plain English (track page, hub, U1–U3, master lecture, methodology, bibliography, AI declaration, D1 brief, Tao notes). AI footers are now one sentence + `/ai-declaration/` link. UDIT/web-atelier links and Digital Creativity comparisons removed. The old special deck data is retired (redirect kept).
- Local model: 1 call, `qwen2.5:32b-instruct`, 848 tokens (wording ideas, partly used).
- Before/after table: `PHASE-EX2-REPORT.md`. Roll back: `gitflow.sh rollback 2`.

#### U4–U6 firewall-only edits

| File | Line | Before | After |
| --- | --- | --- | --- |
| `docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md` | 192 | `*Forge date: 2026-10-04 · Studio: crea-comm.net*` | `*Date: 2026-10-04 · Studio: crea-comm.net*` |

| `docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md` | 186 (round 2, F1) | "…at the locators used in this pilot (402 and 440 in the extraction order) — these are not independently verified printed pages." | "…; its page locators are not yet verified against the printed edition." |
| `docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md` | 190 (round 2, F1) | Authorship paragraph naming the local scholar-voice model, U4 enrichment pack and Thinkertoys source adjudication | Standard one-sentence footer + `{{ '/ai-declaration/' \| relative_url }}` link |

U5 and U6 have no published pages, so they had no edits.

**Warning for the U4 forge on `main` (A4/F2):** `forge/ct-unit-forge.mdc` §4b no longer allows the old footer (harness, vault count, Forge date, `lesson-scribe`). The safety script now fails the build on harness phrasings, `agentic`, `scholar-voice`, `enrichment pack`, `extraction order`, `source adjudication`, forge and vault. Expect a merge conflict on U4 lines 186, 190 and 192 if `main` edits them; per A2/F5 a sync conflict is a stop rule.

### EX3 — image pipeline rules, tests and validator (VERIFYING)

- New `scripts/lib/media-rules.mjs` (pure rules), `scripts/lib/rendition.mjs` (sharp: ≤ 1920 px WebP, EXIF stripped, ≤ 600 KB), `scripts/validate-decks.mjs` (strict on schema v2 decks, warnings on legacy U4), 26 `node --test` tests. Against the copied legacy logic 14 of the 15 rule tests fail (the 15th is a control), so they would have caught B1, B3, B6, B7, B8, B11.
- `rehydrate-student-media.mjs` rewritten: slide `asset_id` is the only binding (no `rankCursor`, no `stripReviewTag`), acceptance from Profield review-state (read only) or `curation/autopilot-assets.json`, renditions in `docs/assets/images/deck-media/`, legacy decks skipped, orphan cache files deleted. `npm run build` now runs `validate-decks.mjs --strict --rights=flag`.
- U1, U2, U3 and the master-lecture deck migrated to `schema_version: 2` (`slide_id`, `background_kind` curated/diagram/geometrical, `image_brief` TODOs, `asset_id`); no "profield" in their JSON. U4 untouched.
- Cache: 36 files (24 `.php`, 8 over 600 KB) → `deck-media/` 2 files (105 KB WebP + 23 KB SVG) + `profield-cache/` 1 file kept for U4.
- Safety script: `profield` now checked in built JS too; patterns for cascade-harness, lesson harness, studio extraction layer, cite-grade discovery (A5/F2).
- Local model: 1 call, `qwen2.5-coder:32b`, 872 prompt / 1,093 output tokens (draft of the four rule functions; rewritten — it crashed on missing fields and its `bindSlides` problem list was wrong).
- Report: `PHASE-EX3-REPORT.md`. Roll back: `gitflow.sh rollback 3`.

#### EX3 image bindings: every kept and unbound image

Kept (both `rights_status: flagged` because the media index title carries `[modern_rights_review_required]`; licence and author recorded from the Commons file page):

- **U2 `masterclass-1` "1 · Generate, then select"** ← *Sprite Fright concept art: Victoria*, Julien Kaspar / Blender Foundation, CC BY 4.0, https://commons.wikimedia.org/wiki/File:Sprite_Fright-concept_art-Victoria_01.png
- **Master lecture `cover`** ← *Iterative Process Diagram*, Krupadeluxe, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Iterative_Process_Diagram.svg (students previously saw *Fashion illustration* here: two assets shared the cover slot and the renderer showed the last one)

Unbound (slide now on the diagram fallback until EX4):

- U1 `cover` ← *Reflection.* (NYPL etching of a seated woman; no match)
- U1 `analysis-model` ← *Circus performers.* (NYPL)
- U1 `masterclass-1` ← *Fashion illustration* (NYPL; named mismatch B4)
- U1 `masterclass-2` ← *An action off Spit-Head* (NYPL caricature)
- U1 `masterclass-3` ← *Creation of Adam* (NYPL woodcut)
- U1 `masterclass-4` ← *The artist's dream.* (NYPL stereograph of a gorge)
- U1 `masterclass-5` ← *Five-Way Portrait of Marcel Duchamp* (Commons; on "Techniques are tools", not the Duchamp slide)
- U1 `masterclass-6` ← *Dada siegt!* poster (NYPL; on "Design thinking is debated")
- U1 `lab-1` "Research Marcel Duchamp" ← *Festival Dada, 26 mai 1920* poster (NYPL; Dada, not Duchamp — not plain)
- U1 `lab-2` "Research the Dada movement" ← *A patent sideboard.* (NYPL; named mismatch)
- U1 deck assets bound to no slide, removed from the deck: *Hook and ladder in action* (named mismatch B3; at launch HEAD it was no longer on the Duchamp slide), *Four designs for chairs…*, *Art+Feminism Edit-A-Thon 2015*, *Iterative Process Diagram* (U1 copy), *RotaryDemisphere*, *Rrose Sélavy*, *Man dreaming*
- U2 `cover` and `masterclass-5` ← *Un chien andalou* still (Commons; EU-term risk B10; wrap-around repeat)
- U2 `analysis-model` and `masterclass-6` ← *Leonardo da Vinci* engraving (NYPL; repeat)
- U2 `masterclass-2` and `lab-2` ← *Surrealistic window display, Bergdorf Goodman* (NYPL; repeat)
- U2 `masterclass-3` ← *Circus artists* (NYPL sheet)
- U2 `masterclass-4` "Role and constraint tools" ← *Imagination is allowed full play at the American Laboratory Theatre* (NYPL; borderline, not plain)
- U2 `lab-1` ← *Sprite Fright* (wrap-around repeat of masterclass-1)
- U3 `cover`, `masterclass-1`, `-3`, `-5`, `lab-1` ← *Circus performers.* (NYPL; 5× repeat)
- U3 `analysis-model`, `masterclass-2`, `-4`, `-6`, `lab-2` ← *Dymaxion house* (NYPL; 5× repeat; borderline for "Read the development", not plain)
- Master lecture `analysis-model`, `masterclass-1…6`, `lab-1`, `lab-2` ← *Fashion illustration* (NYPL; named mismatch, shown on 10 slides)

U4 (legacy, out of scope) keeps *Man dreaming* (`profield-cache/0a359d9b946505e1.php`, 806 KB, empty licence) on 11 slides; the validator warns, `rights-report.json` lists it.

### Release checklist additions (from EX2)

- Run `npm ci` before the release build (`postcss` lives in node_modules).
- Align the external skill `~/src/.cursor/skills/lesson-scribe/SKILL.md` §9 ("public role vocabulary": lesson harness, studio extraction layer, cite-grade discovery) with the new footer rule — the safety script now fails on that vocabulary.
- U4 on `main` (concurrent writer): the safety script now fails on "Forge date", stack wording and pipeline jargon; the U4 forge must adopt the one-sentence footer or the release build will fail (fail-closed, by design).
