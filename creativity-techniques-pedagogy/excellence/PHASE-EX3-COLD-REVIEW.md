# PHASE-EX3 Cold review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX3) |
| **reviewed_at** | 2026-10-04 |
| **implementer_claim** | VERIFYING: 26/26 tests green, 14/15 rule tests fail against the legacy logic, validator strict green (0 errors, 7 warnings), gates EX0–EX3 green, build idempotent, U4 byte-identical, 2 images kept (U2 `masterclass-1`, ML `cover`) |
| **verdict** | PASS |

Inputs: `PHASE-EX3.md` (Deliverables 1–6, A1, A2/F7, A4/F6, A5/F2), the diff `excellence/integration...cascade/excellence-3` (63 files), `PHASE-EX3-VERIFY-LOG.md` (commit `6bb4890`, ancestor of tip `9a39d86`; the only later change is the log itself, `git diff 6bb4890 HEAD --stat` → 1 file), TECHNICAL-DIRECTOR-CASCADE.md hard constraints, AUTOPILOT.md §0/§2. All commands below ran from the worktree root `/Users/ruvebal/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem-integration-excellence-3` on Node v22.22.0.

No P0 or P1 found. Seven P2 findings; none blocks DONE.

## Findings

### F1 — `rightsVerdict`: a stated reason overrides a death year that proves the EU term has not expired
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:**
  ```
  $ node --input-type=module -e "import {rightsVerdict} from './scripts/lib/media-rules.mjs'; console.log(JSON.stringify(rightsVerdict({licence:'PD-old-70',author:'Marcel Duchamp',canonical_source_url:'https://x.org/a',author_death_year:1968,eu_term_ok:true,eu_term_reason:'public domain in the US'},{year:2026})))"
  {"ok":true,"reasons":[]}
  ```
  `media-rules.mjs:86-89`: `termByYear || termByReason`. The runbook's wording ("death year + 70 < current year, or a stated reason") allows this reading. Still, a PD-old-70 / PD-EU claim whose own death year contradicts it should not pass. B10 (Duchamp, d. 1968) is exactly this case. The B10 test only covers it with `eu_term_reason: ''`.
- **Fix:** when `author_death_year` is an integer and `death + 70 >= year`, fail with "EU term contradicted by death year" whatever the reason says, at least for licences `PD-old-70`, `PD-EU`, `PDM`, `NoC-US+EU-checked`. Add a test with Duchamp 1968 plus a reason. This matters before EX4 starts writing rights records.
- **Cascade amend?** Yes: add one line to `PHASE-EX4.md` (or a pre-EX4 fix on the EX3 branch) saying that a contradicting death year is never overridden by a reason.

### F2 — Forge doc says an asset without a rights record falls back to diagram; under `--rights=flag` (the npm default) it is published as `flagged`
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `forge/STUDENT-SLIDESHOW-FORGE.mdc` (v2 section): "A slide whose asset is not accepted, **not rights-recorded** or not cached falls back to `diagram`". In `rehydrate-student-media.mjs:268-272` an accepted asset whose verdict fails is skipped only when `rightsMode === 'block'`. `package.json` `media:rehydrate` passes `--rights=flag`, so a review-state-accepted asset with no registry record (no author or licence) gets `rights_status: "flagged"` and is published.
- **Fix:** change the sentence to "…not accepted or not cached falls back to `diagram`; under `--rights=block` (code default) a rights failure also falls back; under `--rights=flag` (npm scripts, AUTOPILOT §0) it publishes as `rights_status: flagged`."
- **Cascade amend?** No (doc fix only).

### F3 — The validator cannot see the prospector's review tag for assets that are not in the private registry
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `validate-decks.mjs:105` builds the rights record from deck asset + `autopilot-assets.json` only. The public asset has a cleaned `title` and no `raw_title` (`rehydrate…:215`), and the tag lives in the Profield catalog, which the stdlib validator does not read. A review-state-only asset with complete author, licence and EU fields but a `[…_review_required]` catalog title would be marked `flagged` by rehydrate. A hand edit to `rights_status: "ok"` would then pass the validator (`deckProblems` rule "ok but verdict fails" sees no tag). Not live today: both bound assets are in the registry with `raw_title`, and `--rights=block` fails on both (see Acceptance).
- **Fix:** have `publicAsset()` keep the verdict reasons privately. Either write every bound asset (with `raw_title`) into the registry or rights report at rehydrate time, or have the validator read `rights-report.json` as a second authority. EX4 binds many review-state assets, so close this there.
- **Cascade amend?** Yes: add one line to `PHASE-EX4.md` saying every bound asset gets a registry record carrying `raw_title`.

### F4 — `caption()` is tested but has no production caller
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `grep -rn "caption(" scripts` shows only the definition (`media-rules.mjs:163`) and the B9 test. The published fields come from `publicAsset()` in `rehydrate-student-media.mjs:214-235`, which no test covers. The two produce the same fields today (title via `cleanTitle`, author, licence, licence_url, canonical_source_url, cropped), so the B9 test proves a function the pipeline does not call. The renderer (`student-media-deck.js`) still has its own `cleanTitle` (no extension strip) and does not show `licence_url`. CC BY / BY-SA attribution should link the licence: that is EX5's renderer scope.
- **Fix:** build the caption fields in `publicAsset()` from `caption(record)`. EX5 renders `licence_url`.
- **Cascade amend?** EX5 should list "render `licence_url` (CC attribution)" if it does not already.

### F5 — The gate check "rights report written" cannot fail
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `PHASE-EX3.exit-gate.sh`: `check "rights report written" test -f "$CASCADE/curation/rights-report.json"`. The file is committed, so the check passes even if `--rights=flag` stopped writing it. The CLI-level block/flag split and the orphan/extension checks in `validate-decks.mjs` have no automated test (`deckProblems` tests explicitly leave block-vs-flag to the CLI). I verified the behaviour by hand: `--strict --rights=block` → exit 1 (2 rights errors); `--strict` (default) → exit 1; `--strict --rights=flag` → exit 0 and the report is rewritten byte-identically (`git status --porcelain` empty).
- **Fix:** add a CLI test that runs the validator on a temp fixture tree in both modes and asserts the exit codes plus the report's mtime or contents. This is a gate strengthening and could go in EX11's probe hardening.
- **Cascade amend?** Optional (EX11).

### F6 — SVG renditions are copied verbatim (no sanitising)
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `rehydrate-student-media.mjs:197-200` writes the SVG bytes unchanged. The kept file `deck-media/1b014b8e74a8b772.svg` has 0 `<script` elements and is byte-identical to the Commons original (23,862 bytes). A future SVG with script or `on*` handlers would be served same-origin. CSS backgrounds do not run it, but direct navigation to the file does.
- **Fix:** reject SVGs containing `<script`, `on\w+=`, `javascript:` or external `href`s, or rasterise SVGs to WebP via sharp. Add a test.
- **Cascade amend?** No.

### F7 — U4 public JSON still carries "profield" (release risk, outside EX3 scope)
- **Severity:** P2 · **Blocks DONE:** no
- **Evidence:** `grep -rli profield _site` → `_site/tracks/en/uem/2627-ct/u-4-workplace-application/data/content.json` only (slot `U4.still.profield-1`, URL `/assets/images/profield-cache/0a359d9b946505e1.php`). The hard constraint covers "public JSON values". A1 puts U4 out of scope, and A2/F7 forbids moving its file, so EX3 correctly left it alone and the safety script deliberately skips JSON for `profield`. FINAL-REVIEW line 100 names the file but does not say that it breaks the firewall on a public JSON value.
- **Fix:** in FINAL-REVIEW, list "U4 deck JSON exposes `profield` slot and cache path (firewall) until the U4 forge migrates to schema v2" as a release item for the professor/U4 forge.
- **Cascade amend?** FINAL-REVIEW.md wording only.

## Acceptance re-check (runnable evidence)

| Item | Result | Evidence |
| --- | --- | --- |
| Modules load | PASS | `import('./scripts/lib/media-rules.mjs')` → 21 exports; `import('./scripts/lib/rendition.mjs')` → `toRendition`; `node --check` OK on `rehydrate-student-media.mjs`, `validate-decks.mjs`, `verify-publication-safety.mjs`, `docs/assets/js/student-media-deck.js`; `scripts/tests/index.js` loads as CJS |
| Full suite green | PASS | `node --test scripts/tests/` → `# tests 26 # pass 26 # fail 0`, exit 0; `node --test scripts/tests/index.js` same; `node --test scripts/tests/*.test.mjs` → 26/26 |
| Shim propagates failures | PASS | scratch copy of `index.js` plus a test file that imports a missing module → `not ok 1 - tests`, exit 1 |
| Tests fail against pre-fix logic | PASS | `MEDIA_RULES_IMPL=legacy node --test scripts/tests/` → `# tests 26 # pass 12 # fail 14`, exit 1. The 14 failures are the B11×3, B8×2, strict, B10, B3/B13, B1, B6×2, unaccepted, B7 and B9 tests. The control "dangling: matching asset" passes both ways, as it should |
| Legacy helpers faithful | PASS | Compared with `git show excellence/integration:scripts/rehydrate-student-media.mjs`. `legacyStripReviewTag` = lines 56–61 verbatim; `legacyExtensionFromUrl` = 100–107 verbatim; `legacySelectionScore` = 50–54; `legacyBindSlides` = the 409 sort + 417 slot minting + 423–439 `rankCursor` loop verbatim (drops `media_overrides`/collection preference, which no test relies on); `legacyRightsVerdict` always ok matches the old code, which had no rights check (accepted → published after `stripReviewTag`); `legacyFindDanglingSlots` → `[]` matches the old code, which had no such check. Not tautological: each new test asserts a property the old path lacked |
| `rankCursor` / `stripReviewTag` gone from publication | PASS | `grep -n "stripReviewTag\|rankCursor\|media_overrides" scripts/*.mjs scripts/lib/*.mjs` → no hits |
| Return shapes / arity | PASS | `bindSlides` returns `{slides, assets, problems}`; the only caller (`rehydrate…:282`) destructures all three. `deckProblems` returns `{errors, warnings, rights}`; the validator uses all three. `rightsVerdict` returns `{ok, reasons}` everywhere |
| Distinct modes | PASS | `background_kind` curated/diagram/geometrical/none; `media_slot_id` only on curated (strict error otherwise, `media-rules.mjs:249`); `asset_id` on a diagram slide always means "requested, not bound" (warning, line 250); `rights_status` ok/flagged, and "ok" on a failing verdict is an error in both modes |
| rightsVerdict strict, flag only downgrades | PASS (see F1) | `--strict --rights=block` → `2 error(s)` (both review tags), exit 1; `--strict --rights=flag` → `0 error(s), 7 warning(s)`, exit 0; default mode = block |
| Validator strict on v2, warns on legacy (A1) | PASS | Build log: U4 produces only `WARN` lines (legacy, slot on 11 slides, `.php`, > 600 KB); the unit test "legacy deck only warns" passes |
| Gates EX0–EX3 from the worktree root | PASS | each `PHASE-EX{0,1,2,3}.exit-gate.sh` → `failures: 0`, exit 0 |
| Runner verify log | PASS | commit `6bb4890` is an ancestor of tip; log exit 0, 22 PASS, `failures: 0` |
| `npm run build` | PASS | exit 0. Prebuild: `skip legacy deck … how-to-pass`, `skip legacy deck … u-4`, `Media rehydration (rights=flag): 6 deck file(s), changed 0, orphans removed 0.` (idempotent); `validate-decks: 6 deck file(s), 0 error(s), 7 warning(s)`; `Publication safety passed`. `git status --porcelain` empty afterwards |
| Nothing written outside the worktree; Profield untouched | PASS | Full `stat` listing of `~/src/profield` (9,048 files) before vs after the gates and build: `diff` empty. `review-state.json` mtime `1791133113` (2026-10-04 18:58 CEST, before EX2 landed at 20:40), sha1 `67b9a662…` before and after. A `find -newer` across `~/src` and the course folders shows only the worktree's own hydrate outputs (unchanged content) |
| U4 byte-identical | PASS | `shasum` of the U4 `content.json` at integration and at the branch: both `880a5298…`; `git diff --stat … u-4-*` empty |
| No file referenced by U4 (or any deck) deleted or moved (A2/F7) | PASS | `profield-cache/` keeps `0a359d9b946505e1.php` (U4). None of the 35 deleted names occurs in any deck, layout or page on the branch or on `main`, nor in the main checkout's `u-[4-9]` decks. The only hits are cascade prose (PHASE-EX3.md, PHASE-EX2-COLD-REVIEW.md) |
| Cache hygiene | PASS | `deck-media/`: 2 files (105,102 B WebP 1920×725, no EXIF/ICC/XMP; 23,862 B SVG); no `.php`, nothing > 600 KB, no orphans |
| No hard-coded `/Users`; no cloud AI | PASS | grep over the touched scripts/lib/tests/js finds no `/Users/`; no openai/anthropic/genai hits; media root = `PROFIELD_MEDIA_ROOT` or `os.homedir()`; the only model call was local Ollama (evidence prompt/response) |
| Publication safety on the built site | PASS | `node scripts/verify-publication-safety.mjs` → passed, exit 0; `profield` appears only in U4 JSON (F7). A4/F6 comment removed; A5/F2 patterns present |
| Migration: v2 + `slide_id` everywhere | PASS | U1/U2/U3/ML: `schema_version 2`, 13 slides each, 0 without `slide_id`, no "profield" in raw JSON; non-media slide fields unchanged against integration (programmatic diff: 0 changes besides `slide_id`, `background_kind`, `media_slot_id`, `asset_id`, `image_brief`); top-level keys unchanged except `assets`/`media_selection`/`schema_version` |
| Binding table matches the JSON | PASS | `evidence/EX3-binding-table.json` (52 rows): slide ids and headings match each deck in order, "kept" rows = the only curated slides, "before" titles match the integration deck's rendered asset (last-wins Map), 0 mismatches |
| Kept images plainly match | PASS | Sprite Fright: a sheet of 17 labelled expression variants of one head, on "1 · Generate, then select". It is variant generation on one sheet; strictly these are rig expressions, not alternative ideas, but the match is plain enough at slide level. Iterative Process Diagram: a planning→design→implementation→testing→evaluation loop, on the master-lecture cover "Creative process analysis": plain |
| Unbound images: no plain match wrongly dropped | PASS | Contact sheet of the integration-era files viewed: Festival Dada poster on the Duchamp lab (a Dada event, not Duchamp); Dada siegt! on "Design thinking is debated"; Leonardo portrait on "How to analyse" and "Workshops are means"; Five-Way Duchamp on "Techniques are tools"; Un chien andalou on the U2 cover and "Name selection criteria"; American Laboratory Theatre on "Role and constraint tools" (borderline at best); Dymaxion interior on U3 "Read the development"; Bergdorf surreal window on "Automatic writing"; circus / reflection / stereo views. None is a plain slide-level match, so unbinding them is the conservative AUTOPILOT §2 call. Rebinding to better slides (Rrose Sélavy / Five-Way Duchamp → U1 `lab-1`; Festival Dada / Dada siegt! → U1 `lab-2`) is EX4's choice |
| Licence/author claims | PASS | Commons API `extmetadata` (live): Iterative Process Diagram — Artist "Krupadeluxe", Credit "Own work", "CC BY-SA 4.0", 2021-05-05, 23,862 B (same bytes as the cached SVG). Sprite Fright Victoria 01 — Artist "Julien Kaspar/Blender Foundation", "CC BY 4.0", published 8 Oct 2020. Both match `autopilot-assets.json` |
| Renderer still loads | PASS | The built pages' `data-content-url` paths (6 decks) were fed to the real `student-media-deck.js` in a Node vm with DOM/Reveal stubs and `fetch` mapped to `_site`: every deck built 8–15 sections, none "Slides unavailable". Curated slides resolve to existing `_site/assets/images/deck-media/*.{webp,svg}`. Diagram slides (no `media_slot_id`) take the geometrical branch, and all 6 `fractal-pass-track` SVGs exist |
| Forge doc vs code | PASS with F2 | v2 section matches `BACKGROUND_KINDS`, slot format, asset fields (`publicAsset`), licence whitelist, validator flags and build wiring; one inaccurate sentence (F2) |

## Notes

- The report's `started_at 20:15Z` / `finished_at 21:15Z` come after the commit's own timestamp (`2026-10-04 20:58:56 +0200` = 18:58Z). These are local times labelled Z. This is cosmetic.
- `image_brief` values are `TODO:` sentences in public deck JSON (not rendered). The runbook allows this until EX4, and EX4's gate must reject TODO.
- `media_selection.project_id` (`tc`, `ml`) remains in public JSON. It does not name Profield; left as is.
- After EX3, the "diagram" fallback renders the geometrical cycle, not the Koch triangle (B14). That is EX5's renderer scope and was reported by the implementer.
- `scripts/tests/index.js` is a CJS shim needed on Node 22. CI (`pages.yml`, Node 20) does not run tests; `sharp@0.35.5` engines `>=20.9.0` are compatible with CI's Node 20.
- Downstream amends suggested in the same commit as this review: F1 and F3 → `PHASE-EX4.md`; F4 → `PHASE-EX5.md` (render `licence_url`); F7 → `FINAL-REVIEW.md`. None invalidates EX4's assumptions; EX4's ≥ 60% imaged gate starts from U1 0/8, U2 1/8, U3 0/8, ML 0/8 core slides, as the runbook risk anticipated.
- I edited nothing besides this file. Gate runs and the build regenerated the ignored `_site/`, and `git status --porcelain` is empty.
