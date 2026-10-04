# PHASE-EX3 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-04T20:15Z (approx.) |
| **finished_at** | 2026-10-04T21:15Z (approx.; implementation done, awaiting `cascade-harness.sh verify` and cold review) |
| **cold_review** | not yet filed |
| **cascade_amended** | none (surprises listed below for the orchestrator) |
| **branch / worktree** | `cascade/excellence-3` · `creativity-techniques-uem-integration-excellence-3` (`.cascade-lane` = `excellence`) |

## What changed (files)

| File | Change |
| --- | --- |
| `scripts/lib/media-rules.mjs` | **new**, pure: `extensionFor`, `rightsVerdict`, `bindSlides`, `caption`, `findDanglingSlots`, `deckProblems` (validator rules), `stableSlideIds`, constants |
| `scripts/lib/rendition.mjs` | **new**: `toRendition` via sharp — longest side ≤ 1920 px, WebP q75 (steps down only if needed), metadata stripped, ≤ 600 KB |
| `scripts/validate-decks.mjs` | **new**, stdlib only (imports the pure module): `--strict`, `--rights=block\|flag`; writes `curation/rights-report.json` in flag mode |
| `scripts/rehydrate-student-media.mjs` | rewritten on the module: slide `asset_id` is the only binding (no `rankCursor`, no `stripReviewTag`, no `media_overrides`), media root from `PROFIELD_MEDIA_ROOT` or `os.homedir()`, acceptance from review-state (read only) or `curation/autopilot-assets.json`, extension from Content-Type, renditions in `deck-media/`, legacy decks skipped, orphans deleted from both cache folders (references read from every deck under `docs/tracks`) |
| `scripts/tests/media-rules.test.mjs` | **new**: 15 rule tests with `legacy*` copies of the pre-EX3 logic (`MEDIA_RULES_IMPL=legacy`) |
| `scripts/tests/validate-decks.test.mjs` | **new**: 9 validator-rule tests |
| `scripts/tests/rendition.test.mjs` | **new**: 2 rendition tests (3000×2000 JPEG with EXIF → WebP ≤ 1920 px, ≤ 600 KB, EXIF gone; no enlargement) |
| `scripts/tests/index.js` | **new** shim: Node 22 treats `node --test scripts/tests/` as a module path; the shim loads every `*.test.mjs` |
| `scripts/verify-publication-safety.mjs` | `profield` check now on built `.html` **and `.js`** (A4/F6); patterns cascade-harness, lesson harness, studio extraction layer, cite-grade discovery (A5/F2) |
| `docs/assets/js/student-media-deck.js` | Profield comment removed (A4/F6); no behaviour change |
| `package.json`, `package-lock.json` | `sharp` devDependency; `media:rehydrate` → `--rights=flag`; new `validate:decks`, `test`; `build` runs `validate-decks.mjs --strict --rights=flag` before Jekyll |
| U1, U2, U3, master-lecture `data/content.json` | `schema_version: 2`, `slide_id` everywhere, `background_kind` curated/diagram/geometrical, `image_brief` (TODO sentence) on all 40 image slides, `asset_id` + `<unit>.<slide_id>` slot on the 2 kept slides, new `media_selection` (no "profield") |
| `docs/assets/images/deck-media/` | **new**: `5e5034d4db013da5.webp` (105 KB, 1920×725) and `1b014b8e74a8b772.svg` (23 KB) |
| `docs/assets/images/profield-cache/` | 35 files deleted (referenced by no deck after migration); `0a359d9b946505e1.php` kept (U4) |
| `forge/STUDENT-SLIDESHOW-FORGE.mdc` | schema v2 section; spine/background law/typed fields/implementation note updated |
| `excellence/curation/autopilot-assets.json` | **new** private rights registry (2 assets) |
| `excellence/curation/rights-report.json` | **new**, written by the validator (flag mode) |
| `excellence/evidence/EX3-migrate-decks.mjs`, `EX3-binding-table.json` | one-off migration script (refuses to touch v2 decks) and its before/after table |
| `excellence/evidence/EX3-qwen-prompt.txt`, `EX3-qwen-response.txt` | local model call |

## Tests: legacy fail, new pass

The 15 rule tests run against the pre-EX3 logic copied from `rehydrate-student-media.mjs` @ `1158f9e` into `legacy*` helpers (`MEDIA_RULES_IMPL=legacy`), then against `scripts/lib/media-rules.mjs` (default).

```text
$ MEDIA_RULES_IMPL=legacy node --test --test-reporter=spec scripts/tests/media-rules.test.mjs
✖ B11: NYPL index.php?id=…&t=w served as image/jpeg is cached as jpg, never .php      ('php' !== 'jpg')
✖ B11: non-image Content-Type (HTML error page behind index.php) is refused, not saved ('php' !== null)
✖ B11: whitelist jpg/png/webp/gif/svg from the header                                 ('tif' !== null)
✖ B8: Commons title tagged [modern_rights_review_required] is rejected, not stripped and published (true !== false)
✖ B8: any *_review_required tag in the raw title blocks
✖ rightsVerdict is strict: licence whitelist, author, source URL, EU term              (empty licence accepted)
✖ rightsVerdict EU term (B10): death year + 70 must be before the current year, or a reason is stated (Duchamp d. 1968 accepted)
✖ B3/B13: slide asset_id binding wins over rank (no rank dealing)                      ('nypl:hook-and-ladder' !== 'nypl:duchamp')
✖ B1: a media slide without its own asset_id is not dealt a ranked asset               ('profield' !== 'diagram')
✖ B6: no wrap-around repeats — fewer assets than slides → diagram
✖ B6: one asset named on two slides of a deck binds once; the second slide falls back to diagram
✖ slide asset_id that is not accepted falls back to diagram and is reported
✖ B7: dangling slot detected (slides point at U3.still.profield-N, assets empty)       (0 !== 6)
✔ dangling: a slot with a matching asset is not dangling                              (control)
✖ B9: caption carries title, author, licence, licence URL, source URL and cropped flag
ℹ tests 15  ℹ pass 1  ℹ fail 14
```

The B3 test reproduces the finding exactly: legacy rank dealing puts *Hook and ladder in action* (rank 4) on the Duchamp slide that names the Duchamp asset (rank 1).

```text
$ node --test --test-reporter=spec scripts/tests/
✔ validator: a clean v2 deck has no errors
✔ validator: dangling slot is an error on v2 decks
✔ validator: legacy deck (no schema_version) only warns — U4 stays buildable
✔ validator: curated slide without image_brief or asset_id
✔ validator: slide without slide_id, bad background_kind, "profield" value
✔ validator: missing file, > 600 KB file, non-whitelisted extension
✔ validator: duplicate asset use across slides
✔ validator: rights — failing asset is reported; "ok" status on a failing asset is an error
✔ validator: the private registry overrides deck fields (raw title with review tag)
✔ B11: NYPL index.php?id=…&t=w served as image/jpeg is cached as jpg, never .php
✔ B11: non-image Content-Type (HTML error page behind index.php) is refused, not saved
✔ B11: whitelist jpg/png/webp/gif/svg from the header
✔ B8: Commons title tagged [modern_rights_review_required] is rejected, not stripped and published
✔ B8: any *_review_required tag in the raw title blocks
✔ rightsVerdict is strict: licence whitelist, author, source URL, EU term
✔ rightsVerdict EU term (B10): death year + 70 must be before the current year, or a reason is stated
✔ B3/B13: slide asset_id binding wins over rank (no rank dealing)
✔ B1: a media slide without its own asset_id is not dealt a ranked asset
✔ B6: no wrap-around repeats — fewer assets than slides → diagram
✔ B6: one asset named on two slides of a deck binds once; the second slide falls back to diagram
✔ slide asset_id that is not accepted falls back to diagram and is reported
✔ B7: dangling slot detected (slides point at U3.still.profield-N, assets empty)
✔ dangling: a slot with a matching asset is not dangling
✔ B9: caption carries title, author, licence, licence URL, source URL and cropped flag
✔ rendition: ≤ 1920 px, WebP, ≤ 600 KB, EXIF stripped
✔ rendition: small images are not enlarged
ℹ tests 26  ℹ pass 26  ℹ fail 0
```

Live check of B11 (scratch script, nothing written to the repo):
```text
GET https://images.nypl.org/index.php?id=1634206&t=w → HTTP 200 content-type image/jpeg bytes 101063 → extensionFor: jpg
toRendition → webp 726x760 65030 bytes q75
```

## Validator before / after

- **Before migration** (new validator on launch-HEAD decks, all legacy): `12 error(s), 75 warning(s)`, exit 1. Errors = 12 orphan files in `profield-cache/` (B12). Warnings include 20 `.php` assets, 6 legacy assets > 600 KB, U3 slots used on 5 slides each, U2 slots on 2 slides, two assets sharing `ML-CPA.cover`.
- **After**: `node scripts/validate-decks.mjs --strict --rights=flag` → `6 deck file(s), 0 error(s), 7 warning(s)`, exit 0. Warnings: 2 rights flags (v2), 5 for legacy U4.

## Per-deck binding table (slide → image)

Structural slides (analysis/lab openers, outro) stay `geometrical` and are omitted. "Before" is what the renderer showed at launch HEAD.

| Deck | slide_id | Heading | Before | After |
| --- | --- | --- | --- | --- |
| U1 | `cover` | U1 · Introduction to creativity | Reflection. | diagram (unbound) |
| U1 | `analysis-model` | How to analyse (model) | Circus performers. | diagram (unbound) |
| U1 | `masterclass-1` | 1 · Open, then close | Fashion illustration | diagram (unbound) |
| U1 | `masterclass-2` | 2 · Four skills tests measure | An action off Spit-Head | diagram (unbound) |
| U1 | `masterclass-3` | 3 · Tests are not the whole story | Creation of Adam | diagram (unbound) |
| U1 | `masterclass-4` | 4 · Name the problem first | The artist's dream. | diagram (unbound) |
| U1 | `masterclass-5` | 5 · Techniques are tools, not scripts | Five-Way Portrait of Marcel Duchamp, 21 June 1917, New York City.jpg | diagram (unbound) |
| U1 | `masterclass-6` | 6 · “Design thinking” is debated | Dada siegt! : Wiedereröffnung der polizeilich geschlossenen Ausstellung, Schildergasse 37 ... | diagram (unbound) |
| U1 | `lab-1` | Exercise 1 · Research Marcel Duchamp | Festival Dada, mercredi 26 mai 1920 à 3 h. après-midi | diagram (unbound) |
| U1 | `lab-2` | Exercise 2 · Research the Dada movement | A patent sideboard. | diagram (unbound) |
| U2 | `cover` | U2 · Idea generation and selection techniques | Un chien andalou- Un perro andaluz.jpg | diagram (unbound) |
| U2 | `analysis-model` | How to analyse (rolling model) | Leonardo da Vinci | diagram (unbound) |
| U2 | `masterclass-1` | 1 · Generate, then select | Sprite Fright-concept art-Victoria 01.png | kept: Sprite Fright-concept art-Victoria 01.png |
| U2 | `masterclass-2` | 2 · Fluency with flexibility | Surrealistic window display, Bergdorf Goodman, New York City | diagram (unbound) |
| U2 | `masterclass-3` | 3 · Get past the obvious | Circus artists | diagram (unbound) |
| U2 | `masterclass-4` | 4 · Role and constraint tools | Imagination is allowed full play at the American Laboratory Theatre | diagram (unbound) |
| U2 | `masterclass-5` | 5 · Name selection criteria | Un chien andalou- Un perro andaluz.jpg | diagram (unbound) |
| U2 | `masterclass-6` | 6 · Workshops are means, not genius | Leonardo da Vinci | diagram (unbound) |
| U2 | `lab-1` | Exercise 1 · Guided concentration | Sprite Fright-concept art-Victoria 01.png | diagram (unbound) |
| U2 | `lab-2` | Exercise 2 · Automatic writing after concentration | Surrealistic window display, Bergdorf Goodman, New York City | diagram (unbound) |
| U3 | `cover` | U3 · Development techniques and solutions | Circus performers. | diagram (unbound) |
| U3 | `analysis-model` | Read the development | Diamaxion house, metal, adapted corn bin, built by Butler Brothers, Kansas City. Designed and promoted by R. Buckminster Fuller. | diagram (unbound) |
| U3 | `masterclass-1` | 1 · Make it rough, make it early | Circus performers. | diagram (unbound) |
| U3 | `masterclass-2` | 2 · Defer judgement | Diamaxion house, metal, adapted corn bin, built by Butler Brothers, Kansas City. Designed and promoted by R. Buckminster Fuller. | diagram (unbound) |
| U3 | `masterclass-3` | 3 · Iterate with an exit | Circus performers. | diagram (unbound) |
| U3 | `masterclass-4` | 4 · Sketch to think | Diamaxion house, metal, adapted corn bin, built by Butler Brothers, Kansas City. Designed and promoted by R. Buckminster Fuller. | diagram (unbound) |
| U3 | `masterclass-5` | 5 · Open the solution space | Circus performers. | diagram (unbound) |
| U3 | `masterclass-6` | 6 · Reflect at checkpoints | Diamaxion house, metal, adapted corn bin, built by Butler Brothers, Kansas City. Designed and promoted by R. Buckminster Fuller. | diagram (unbound) |
| U3 | `lab-1` | Exercise 1 · Same problem, three entry points | Circus performers. | diagram (unbound) |
| U3 | `lab-2` | Exercise 2 · Delay judgement, then checkpoint and exit | Diamaxion house, metal, adapted corn bin, built by Butler Brothers, Kansas City. Designed and promoted by R. Buckminster Fuller. | diagram (unbound) |
| ML-CPA | `cover` | Master Lecture · Creative process analysis | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | kept: Iterative Process Diagram |
| ML-CPA | `analysis-model` | Eight steps (guide) | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-1` | 1 · Describe the process first | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-2` | 2 · Language ≠ medium ≠ support | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-3` | 3 · Open, then close | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-4` | 4 · Divergent is a hallmark — not the whole job | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-5` | 5 · Process is also material | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `masterclass-6` | 6 · Critical: a score is not the designer | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `lab-1` | Exercise 1 · Shared process | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |
| ML-CPA | `lab-2` | Exercise 2 · Your Lab trail | Fashion illustration (rendered; also in slot: Iterative Process Diagram) | diagram (unbound) |

Totals: U1 0/10 image slides bound, U2 1/10, U3 0/10, master lecture 1/10. U4 untouched (byte-identical before/after rehydration).

Note: FINDINGS B3 ("Hook and ladder" on the Duchamp slide) described the audited commit; at launch HEAD the Duchamp slide showed the *Festival Dada* poster and *Hook and ladder* was a deck asset bound to no slide. Both are gone now; the legacy test reproduces B3 with the original algorithm.

## Rights report (`curation/rights-report.json`, flag mode)

| Summary | Value |
| --- | --- |
| assets | 3 |
| pass | 0 |
| flagged | 3 (2 in v2 decks, 1 legacy U4) |

| Deck / slide | Asset | Licence · author | Verdict |
| --- | --- | --- | --- |
| U2 `masterclass-1` | Sprite Fright concept art: Victoria | CC-BY-4.0 · Julien Kaspar / Blender Foundation | flagged: review tag `modern_rights_review_required` |
| ML `cover` | Iterative Process Diagram | CC-BY-SA-4.0 · Krupadeluxe | flagged: review tag `modern_rights_review_required` |
| U4 (legacy, 11 slides) | Man dreaming (NYPL) | empty · empty | fails: licence, author, EU term (warning only) |

Licence/author/source come from the Commons API `extmetadata` (file page), recorded in `curation/autopilot-assets.json`. The only failing rule for the two kept images is the prospector's review tag, which only a human can clear in the Profield review app; `rightsVerdict` was not weakened.

## Gates run in this worktree

The caller asked me to run the gates here. This is not self-certification: the runner's `cascade-harness.sh verify` log is the record.

```text
$ bash creativity-techniques-pedagogy/excellence/PHASE-EX3.exit-gate.sh
PASS: profield-cache holds only legacy-referenced files
PASS: media-rules module exists
PASS: validator exists
PASS: tests exist
PASS: node --test green
PASS: validator --strict --rights=flag green
PASS: rights report written
PASS: build runs the validator
PASS: no rank dealing
PASS: no hard-coded home path
PASS: test covers: index.php
PASS: test covers: rights_review_required
PASS: test covers: asset_id
PASS: test covers: dangling
PASS: no .php cache files
PASS: no cache file > 600 KB
PASS: deck JSON: schema + no 'profield' values
PASS: safety script has pattern: cascade-harness (A5/F2)
PASS: safety script has pattern: lesson harness (A5/F2)
PASS: safety script has pattern: studio extraction layer (A5/F2)
PASS: safety script has pattern: cite-grade discovery (A5/F2)
PASS: jekyll build
----
failures: 0
```

Regression: `PHASE-EX0.exit-gate.sh` failures: 0 · `PHASE-EX1.exit-gate.sh` failures: 0 · `PHASE-EX2.exit-gate.sh` failures: 0.
`node scripts/verify-publication-safety.mjs` on the gate's `_site`: passed.
`npm ci` then `npm run build` (prebuild = hydrate + rehydrate in this worktree): exit 0; rehydration "changed 0, orphans removed 0" (idempotent); validator 0 errors; publication safety passed; no tracked file changed by the build.

## Rehydration runs (worktree only)

1. `node creativity-techniques-pedagogy/excellence/evidence/EX3-migrate-decks.mjs` — v2 migration; Sprite Fright rendition made from the old cached 5.1 MB PNG (1920×725, 105,102 bytes, q75), SVG copied.
2. `node scripts/rehydrate-student-media.mjs --rights=flag` — U2 and ML rewritten with public asset fields; U4 and How to Pass skipped as legacy; 35 orphans removed from `profield-cache/`.
3. Same command again — changed 0, removed 0.

No image had to be downloaded (both kept renditions existed locally); the network path was exercised only by the live B11 check above. Nothing was written to `~/src/profield`.

## Local model calls

| # | Model | Purpose | Prompt | Tokens (prompt / output) | Wall time |
| --- | --- | --- | --- | --- | --- |
| 1 | `qwen2.5-coder:32b` via `POST localhost:11434/api/generate` (stream false, temperature 0.1, num_ctx 8192) | Draft of `extensionFor`, `rightsVerdict`, `bindSlides`, `caption` | `evidence/EX3-qwen-prompt.txt` | 872 / 1,093 | 65 s |

Before loading: `ollama ps` empty; in-practice `runtime/process.json` PID 48350 not alive. Defects found when reviewing the draft (all rewritten): `author.trim()` / `title.match()` crash on missing fields; `new URL(url)` throws on relative URLs; `bindSlides` left `undefined` keys, reported every asset-less diagram slide as "unaccepted", and looked up slots from the mutated slide list; `caption` removed the extension before the tag, so tagged titles kept their tag.

## Downstream surprises (for the orchestrator / cold reviewer; not patched)

1. **Node 22 and `node --test <dir>`:** the runner treats a directory as a module path. EX3 adds `scripts/tests/index.js` so the gate command works; later gates that use the same form depend on that shim.
2. **Master-lecture deck rendered *Fashion illustration* on all 10 media slides** (two assets in slot `ML-CPA.cover`, renderer Map keeps the last). Not in FINDINGS. Fixed by the migration; the EX11 probe may want an "assets sharing a slot" metric.
3. **B3 state at launch HEAD differs from FINDINGS** (see the note under the table). EX4's banned-asset list still applies; none of the banned assets is in any in-scope deck now.
4. **Diagram fallback renders as the geometrical cycle** with the current renderer (Koch `diagramFallback` is still unused, B14). Slides are not broken, but the "diagram" look is EX5's job.
5. **EX4's gate needs ≥ 60% of core slides imaged** per deck; after EX3 it is U1 0/8, U2 1/8, U3 0/8, ML 0/8 (expected fail-closed state, per the runbook risk).
6. **U4 (out of scope)** still uses `profield-cache/0a359d9b946505e1.php` (806 KB, `.php`, empty licence) on 11 slides; its deck JSON contains "profield", which is why the safety script checks HTML and JS but not JSON. When the U4 forge migrates it to v2 the file becomes an orphan and is removed by the next rehydration.
7. **CI:** `npm ci` in GitHub Actions now installs `sharp` (prebuilt linux binary). Only rehydration and the tests import it; the validator does not.
8. The canonical executor prompt says not to run the exit gate or commit; the launching agent instructed both. I followed the launcher and am not self-certifying.

## Open issues / uncertainty

- The "plainly matches" judgement for the two kept images and for the borderline unbinds is mine (contact sheets viewed); the cold reviewer should look at `deck-media/` and the table above.
- `image_brief` values are TODO sentences in public deck JSON (not rendered). EX4 must replace all 40; its gate rejects TODO.
- `rights-report.json` is rewritten by every `npm run build` (only if its content changes); in CI that produces an uncommitted file in the private tree, which is harmless.

## Resume point

Run `cascade-harness.sh verify <integration>/creativity-techniques-pedagogy/excellence PHASE-EX3.md <this worktree>`, then a fresh `cascade-cold-reviewer`. Do not open EX4 until EX3 is DONE.
