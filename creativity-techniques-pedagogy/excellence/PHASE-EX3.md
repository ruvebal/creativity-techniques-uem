# PHASE-EX3: Image pipeline rules, tests and deck validator

> **Track:** `scripts/rehydrate-student-media.mjs`, new `scripts/lib/media-rules.mjs`,
> new `scripts/validate-decks.mjs`, deck `content.json` schema
> **Status:** BLOCKED (EX2 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Replace "deal images by rank" with "bind an image to a named slide, and
publish it only if its rights are proven". Live failing cases:

- FINDINGS B3: U1 slide "Exercise 1 · Research Marcel Duchamp" shows
  *Hook and ladder in action* because `rankCursor % rankedSlots.length` gave it slot 9.
- B8: Commons title `File:Sprite Fright-concept art-Victoria 01.png [modern_rights_review_required]`
  is published after `stripReviewTag()` deletes the tag.
- B11: `https://images.nypl.org/index.php?id=1634206&t=w` is cached as
  `67e8367fb0719e25.php` although the response is `image/jpeg`.
- B7: U3 slides reference `U3.still.profield-1…6`; `assets` is empty; nothing fails.

## Deliverables

1. **Schema** (document in `forge/STUDENT-SLIDESHOW-FORGE.mdc`): every slide gets a
   stable `slide_id`; image slides carry `background_kind: curated`,
   `image_brief` (one sentence: what the image must show and why), and
   `asset_id` (chosen by the professor in EX4). `profield` disappears from
   public JSON values; slot IDs become `<unit>.<slide_id>`.
2. **`scripts/lib/media-rules.mjs`** (pure functions, no I/O):
   `extensionFor(contentType, url)` — whitelist jpg/png/webp/gif/svg from the
   Content-Type header; `rightsVerdict(asset)` — accept only licence in
   {PD-old-70, PD-EU, CC0, PDM, CC-BY-4.0, CC-BY-SA-4.0, CC-BY-3.0,
   CC-BY-SA-3.0, NoC-US+EU-checked}, non-empty author, source URL,
   `eu_term_ok: true` (author death year + 70 < current year, or a stated
   reason), no `*_rights_review_required` / `*_review_required` tag in the raw
   title; `bindSlides(content, acceptedAssets)` — slide `asset_id` is the only
   binding; no rank dealing; no asset on two slides of one deck; slides with
   no compliant asset become `background_kind: diagram`; `caption(asset)` —
   title, author, licence (+ licence URL), source URL, "cropped" flag.
3. **`rehydrate-student-media.mjs`** uses the module: media root from
   `PROFIELD_MEDIA_ROOT` or `os.homedir()`-relative default; acceptance from `review-state.json` (read only) **or** from
   `creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json`
   (autopilot mode, see `AUTOPILOT.md` §2; same rights fields, validated by
   `rightsVerdict`); renditions ≤ 1920 px, WebP q75 via
   `sharp` (devDependency), EXIF stripped, ≤ 600 KB; deletes orphan cache files;
   cache moves from `docs/assets/images/profield-cache/` to
   `docs/assets/images/deck-media/` (the old name leaks into public URLs).
4. **`scripts/validate-decks.mjs --strict`** (stdlib only; Amendment A1: strict
   rules apply to decks with `"schema_version": 2`, legacy decks such as U4 only
   produce warnings): fails on dangling
   slots, curated slides without `image_brief`/`asset_id`, assets failing
   `rightsVerdict`, missing or > 600 KB files, non-whitelisted extensions,
   orphan cache files, duplicate asset use. Rights failures are errors under
   `--rights=block` and warnings under `--rights=flag`, which also writes
   `creativity-techniques-pedagogy/excellence/curation/rights-report.json`.
   Per the professor's launch decision (AUTOPILOT.md §0) `npm run build` and the
   gates use `--strict --rights=flag`; `rightsVerdict` itself stays strict and tested.
5. **Tests** `scripts/tests/media-rules.test.mjs` (`node --test`), one per
   live failing case above, each asserting the pre-fix behaviour is gone.
6. **Migration** (Amendment A1: set `"schema_version": 2`; U4 untouched) of committed decks U1–U3 and the master-lecture deck to the
   new schema. Existing bindings stay only where the image matches the slide
   (EX4 rebinds the rest); rights problems are flagged in the report. `image_brief` may be a TODO
   string here; EX4 writes the real ones.

## Scope

**In:** the files above. **Out:** choosing images (EX4), renderer changes (EX5),
any write to `~/src/profield`.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX3 per creativity-techniques-pedagogy/excellence/PHASE-EX3.md.

## Deliver
1. Deliverables 1–6, in that order. Keep functions pure in media-rules.mjs so
   tests need no network.
2. Write each test first against the CURRENT code path (copy the old logic
   into the test as `legacy*` helpers) and show it fails; then make it pass
   against media-rules.mjs. Record both runs in the report.
3. `npm ci`, `node --test scripts/tests/`, `node scripts/validate-decks.mjs --strict`,
   `npm run build` — all exit 0. Import every module you touched.
4. Run rehydration ONLY in this worktree, never on main.
5. Hand off for cold review — do NOT mark DONE.

## Constraints
- review-state.json is read only; no hand edits
- Do not merge to main before EX4 is DONE (see orchestrator Merge order)
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: tests green; validator strict green on committed decks;
  `rankCursor` and `stripReviewTag` no longer decide publication; no `.php`,
  orphan or > 600 KB file in the cache; `npm run build` runs the validator;
  no deck JSON value contains "profield"
- Report shows each test failing against the legacy logic (they would have caught the bug)

## Risks

- Every current image fails the rights gate, so decks become diagram-only
  until EX4. That is correct fail-closed behaviour; the merge rule prevents
  students seeing it.
- `sharp` needs a native binary; if install fails, record it and fall back
  to macOS `sips` behind the same function, with a test.
