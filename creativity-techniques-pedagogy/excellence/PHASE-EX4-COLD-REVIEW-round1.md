# PHASE-EX4 Cold Review — slide-bound image curation (autopilot)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX4) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | VERIFYING: 36 vision-checked images bound (U1, U2, U3, ML-CPA 9/10 each, 7/8 core), all fit ≥ 4/5, 8 flagged, A6 F1/F2/F3/F6 fixed, tests 30/30, gate EX4 exit 0 (runner log at commit `3e0401c`) |
| **verdict** | FAIL |

Branch `cascade/excellence-4` at `b7753c9`. The runner log commit `3e0401c` is the parent of the tip, and the only later change is the verify log itself. Inputs read: `PHASE-EX4.md` (A1, A6 notes), `PHASE-EX4.exit-gate.sh` (not changed in this phase: `git log` shows its last change in `89ecfad`), `AUTOPILOT.md` §0/§2, `LOCAL-EXECUTION.md`, `TECHNICAL-DIRECTOR-CASCADE.md` A6, `PHASE-EX4-VERIFY-LOG.md`, the full diff `excellence/integration...cascade/excellence-4` (74 files), the report, shortlists, registry, sign-off, rights report, `evidence/EX4/` and FINAL-REVIEW §2.

**Why FAIL:** the code, gates, sizes, rights recording and rendering all pass. Two bindings do not: their image does not carry the slide's idea, and each brief states something false about what the image shows (F1, F2). AUTOPILOT §2 says to bind only at fit ≥ 4/5, "confirmed by the cold reviewer", and that "relevance still rules". I score both at 3/5 or lower, so I cannot confirm them. Both fixes are small, and neither one pushes a deck below the 60% gate.

## Findings

### F1 — U2 `lab-2` binding does not argue its slide (Margery "trance writing" in Chinese)
- **Severity:** P1 · **Blocks DONE:** yes · **Cascade amend:** no
- **Evidence:** The slide (U2 deck JSON) says: "Immediately after the concentration period, write continuously … Do not correct, censor, or organise the text while writing." The bound file is `2d3944251498bdc9.webp` (`File:Mina Crandon automatic writing.png`). I opened it. It is a book plate captioned "FIG. 13. Chinese writing by 'Margery' in red light". It shows neat columns of Classical Chinese, and the Commons categories for the file include `Analects`. This is a séance exhibit claiming the medium wrote a language she did not know. It is not an example of uncensored continuous writing, and putting it in front of students as the model for the Lab presents a paranormal claim as technique. The vision model saw the same thing (`vision_raw.json`: "handwritten Chinese calligraphy … 'Chinese writing by Margery' in red light"), yet the curator scored it 4/5. The brief also misleads: "script written without stopping to correct, the practice the Surrealists later borrowed". The image shows nothing about correction, and Surrealist automatic writing (1919–1924) came before this 1927 sample. The alt text calls it "brush-written"; it is pen.
- **Fit (reviewer):** 2/5.
- **Fix:** Unbind it (`background_kind: diagram`; U2 core becomes 6/8 = 75%, still ≥ 60%), or bind a real automatic-writing manuscript. Under AUTOPILOT §0 a Breton/Soupault *Les Champs magnétiques* page is allowed with `rights_status: flagged`. The other shortlisted candidates (Hélène Smith 3/5, Monck 2/5) are no better. Rehydrate after the change and update FINAL-REVIEW §2, the report and `autopilot-assets.json`.

### F2 — U3 `masterclass-4` "Sketch to think": Bell notebook brief is false; fit below 4
- **Severity:** P1 · **Blocks DONE:** yes · **Cascade amend:** no
- **Evidence:** The brief says "a quick sketch of the telephone transmitter that thinks the device through on paper **before it is built**". I opened the image (`666666fbfc6d691d.webp`). The page dated March 10th 1876 reads "The improved instrument shown in Fig. I was constructed this morning and tried this evening", followed by the "Mr Watson — come here" account. The Commons file page says the pages are "describing first successful experiment with the telephone". The sketch records a device that had already been built and tested; it is not sketching in order to think. The slide sentence is "Three quick arrangements can show relationships that one polished drawing hides", and the page holds one record drawing. This breaks the implementer's own rule in DECISIONS-LOG ("the brief must describe the bound image, never the reverse").
- **Fit (reviewer):** 3/5. Fit to the rewritten brief would be lower still.
- **Fix:** Rebind to the shortlisted `Design for a Flying Machine.jpg` (Leonardo, d. 1519, scored 4/5 for this slide; it shows a sketch made before anything was built). Open the image and check it first. Otherwise use the diagram fallback (U3 core becomes 6/8 = 75%). Do not keep the Bell page with a rewritten brief, because a truthful brief no longer fits "Sketch to think".

### F3 — Vision-model substitution (ruling requested): acceptable
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** yes, `LOCAL-EXECUTION.md` (EX4 row of the workload map) and the A6 line in `PHASE-EX4.md`
- **Evidence:** `vision_raw.json` holds 73 entries, all `qwen3.8:27b (think:false)`. `vision.py` sends `think: False`, plain-text prompt, no `format: json`, temperature 0.1. It checks that the in-practice PID is not alive and logs `ollama ps` before loading (rule 4). `LOCAL-EXECUTION.md` rule 3 allows `qwen3.8:27b` "only with `think:false` and plain delimited output, never JSON mode", and all of that holds. The model is local, so rule 0 (local-first) is kept. Rule 5 ("local output is never trusted on its own; the gate and cold review decide") is met by this review. I opened all 36 images myself rather than relying on the model. The descriptions are accurate: for example, the model read "B.B. 1024 … BRITISH MUSEUM" on the Leonardo mount and correctly identified the Margery page. Cause of the switch: `llama3.2-vision` fails on Ollama 0.34.1 (`unknown model architecture: 'mllama'`). Pulling or upgrading the shared runtime was correctly left out of this phase.
- **Ruling:** acceptable under LOCAL-EXECUTION.md.
- **Fix (doc):** In the workload map, change "llama3.2-vision checks image–brief fit" to "`qwen3.8:27b` (vision, think:false, plain text); llama3.2-vision needs an Ollama with `mllama` support". Same change in the A6 line of `PHASE-EX4.md`. See also F4.

### F4 — Shortlist headers claim the wrong vision model
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** `grep -n "llama\|qwen" curation/*SHORTLIST.md` returns, in all four files, line 5: "Fit score: llama3.2-vision description compared with the brief". No llama3.2-vision description exists; both llama calls returned HTTP 500.
- **Fix:** Change line 5 of all four shortlists to `qwen3.8:27b (think:false)`.

### F5 — Deliverable 2 asks for 3 candidates per slide; 13 of 40 slides have one
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** Counting `| n |` rows per `## slide` in the shortlists gives 3 candidates on only 4 slides. Single-candidate slides: ML cover, analysis-model, masterclass-1, -3, -4, lab-1, lab-2; U1 masterclass-4; U2 masterclass-1; U3 masterclass-5, lab-1, lab-2. The report says "≤ 3 per slide", which is honest, but the deliverable says 3. With one candidate the professor's final review has nothing to choose between. The gate does not check this.
- **Fix:** Add one or two alternates to single-candidate slides before the final review, or record the shortfall as a DECISIONS-LOG entry and add it to FINAL-REVIEW §2.

### F6 — Curator flags are enforced only by rehydration; the validator and rights report miss them
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** yes, add to the EX11 F5 item ("automated tests for the validator's … modes") in `TECHNICAL-DIRECTOR-CASCADE.md` A6
- **Evidence:** In a scratch copy I set the Sawaki asset's deck `rights_status` to `"ok"`. Then `node scripts/validate-decks.mjs --strict --rights=flag` printed `0 error(s), 12 warning(s)`, and Sawaki appeared nowhere. `rights-report.json` summary shows `v2_flagged: 7`, while the decks carry 8 flagged assets. The rehydrate fix works: running `rehydrate-student-media.mjs --rights=flag` in the same scratch copy put back `"rights_status": "flagged"`. Its new branches (registry `raw_title` missing → not ok; curator flag wins) have no unit test.
- **Ruling on the extra rehydrate change:** `rights_status: verdict.ok && record.rights_status !== 'flagged' ? 'ok' : 'flagged'`. This is a strict AND with `verdict.ok`, so a failing verdict always produces `flagged`. It can never turn a failing verdict into `ok`. The only way it moves away from `ok` is toward `flagged` (stale flags can stick, which errs on the conservative side).
- **Fix:** In `deckProblems`, raise an issue when the registry says `flagged` and the deck says `ok`, and count curator flags in `rights-report.json`. Extract `publicAsset` or the status decision into `media-rules.mjs` and unit-test both rehydrate rules.

### F7 — Alt-text and brief accuracy slips (non-blocking)
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence (each image opened):**
  - U1 `masterclass-5` alt: tools "fitted into an open green patterned case". The image shows a ruler, a scale and four instruments laid out beside the shagreen case.
  - U1 `lab-2` alt: "jumbled over bold red diagonal stripes". The red shapes are giant "DADA" letters, not stripes.
  - U2 `masterclass-1` alt: "sixteen versions" (there are 17). Brief says "drawn … before one is chosen"; these are 3D renders of a rigged head. The labelled a/b/c variants do read as alternatives, so I keep the fit at 4.
  - U3 `masterclass-6` alt: "lined paper". It is squared notebook paper.
  - ML `masterclass-5` brief: "poster/photograph". The file is a Gallica wood engraving (Commons description: "Gravure"); the alt text gets this right.
  - ML `masterclass-6` brief: "children ranked by scores". The Commons description says the figures are pass rates out of 10 per age group, not a ranking.
- **Fix:** Edit these alt texts and briefs in `autopilot-assets.json` and the decks, then rehydrate.

### F8 — Profield `review-state.json` changed since EX3, not by EX4
- **Severity:** P2 (informational) · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** The EX3 cold review recorded sha1 `67b9a662…`. Now: sha1 `8f48e3a971368165c44ef8c8cb9a459776b22d64`, mtime `2026-10-04T23:29:51` (local time). The changed entries are NYPL accept/remove clicks between `21:00:36Z` and `21:29:51Z` on 2026-10-04, at human click speed and across projects `dc` and `tc` (U4, C3). That is review-app activity. None of the 36 EX4 asset IDs changed: only Sprite Fright (`2026-09-15`) and the Iterative diagram (`2026-09-13`) appear in the file, both with old timestamps. No EX4 script writes to that path (`grep review-state scripts/` shows a read only). Side note: the professor accepted NYPL assets for tc/U1 that evening (for example `nypl:510d47d9-83ad…`, rank 8), and the shortlists contain no `nypl` candidate. AUTOPILOT §2 lists the accepted Profield pool first.
- **Fix:** In FINAL-REVIEW §2, list the tc U1–U3 assets accepted after EX3 so the professor can compare them with the autopilot picks.

### F9 — Visual repetition across and within decks (non-blocking)
- **Severity:** P2 · **Blocks DONE:** no · **Cascade amend:** no
- **Evidence:** No asset is reused (my check of all deck JSON returned an empty list), but U3 `masterclass-5` (Klee *Pädagogisches Skizzenbuch* p. 10–11) and ML `lab-2` (Klee notebook BF 149) show the same L/M/F "three cases" diagram. ML uses three Gilbreth charts (analysis-model, masterclass-1, lab-1); U3 uses three Wright items.
- **Fix:** Point this out to the professor in FINAL-REVIEW; no action needed for DONE.

## Bindings checked by eye (all 36; images opened from `docs/assets/images/deck-media/`)

| Deck · slide | Heading | Image (file) | Fit verdict |
| --- | --- | --- | --- |
| U1 cover | Introduction to creativity | Leonardo, Virgin and Child with a cat studies (`602b24d3…`) | 5 · matches; alt OK |
| U1 analysis-model | How to analyse (model) | El Lissitzky, Red Wedge (`59f29872…`) | 5 · matches |
| U1 masterclass-1 | Open, then close | Michelangelo, Libyan Sibyl verso (`1e199b72…`) | 4 · matches rewritten brief |
| U1 masterclass-3 | Tests are not the whole story | Gem paper clip advert 1893 (`48f50bbc…`) | 4 · matches (unusual-uses object) |
| U1 masterclass-4 | Name the problem first | Rodin, The Thinker, Cleveland cast (`6bf5e63d…`) | 4 · acceptable |
| U1 masterclass-5 | Techniques are tools, not scripts | Dollond drawing instruments (`764fabac…`) | 4 · matches; alt slip (F7) |
| U1 masterclass-6 | "Design thinking" is debated | Post-it "Teamwork Tools" wall (`80bb2620…`) | 4 · matches (flagged CC BY 2.0) |
| U1 lab-1 | Research Marcel Duchamp | Fountain, Stieglitz photo (`47983a02…`) | 5 · matches (flagged) |
| U1 lab-2 | Research the Dada movement | Kleine Dada Soirée (`94083edd…`) | 5 · matches; alt slip (F7) |
| U2 cover | Idea generation and selection | Darwin "I think" tree (`2fc87d36…`) | 5 · matches |
| U2 analysis-model | How to analyse (rolling model) | Seurat, Grande Jatte study (`212a6fbf…`) | 4 · matches |
| U2 masterclass-1 | Generate, then select | Sprite Fright expression sheet (`5e5034d4…`) | 4 · acceptable; wording (F7) |
| U2 masterclass-3 | Get past the obvious | Brainstorm sticky-note wall (`182376a1…`) | 4 · matches |
| U2 masterclass-4 | Role and constraint tools | Six Hats black-hat board (`56194141…`) | 5 · matches |
| U2 masterclass-5 | Name selection criteria | Pugh weighted matrix (`d34fe8bf…`) | 5 · matches |
| U2 masterclass-6 | Workshops are means, not genius | Van Gogh, bandaged ear (`c839dd8e…`) | 5 · matches the Rubin "tortured genius" quote |
| U2 lab-1 | Guided concentration | Kōdō Sawaki in zazen (`7be69b46…`) | 4 · matches (flagged person) |
| U2 lab-2 | Automatic writing after concentration | Margery "Chinese writing" plate (`2d394425…`) | **2 · FAIL (F1)** |
| U3 cover | Development techniques and solutions | Wright 1902 glider in flight (`57602839…`) | 5 · matches |
| U3 analysis-model | Read the development | Van Doesburg cow study no. 3 (`01ca4277…`) | 4 · matches |
| U3 masterclass-1 | Make it rough, make it early | Gaudí polyfunicular model (`db042aad…`) | 5 · matches |
| U3 masterclass-2 | Defer judgement | Beethoven Petter sketch leaf (`8df17843…`) | 4 · matches |
| U3 masterclass-4 | Sketch to think | Bell notebook 10 Mar 1876 (`666666fb…`) | **3 · FAIL (F2)** |
| U3 masterclass-5 | Open the solution space | Klee, *Pädagogisches Skizzenbuch* "drei Fälle" (`2ef7976e…`) | 4 · matches |
| U3 masterclass-6 | Reflect at checkpoints | Orville Wright diary 17 Dec 1903 (`d9354771…`) | 5 · matches; alt slip (F7) |
| U3 lab-1 | Same problem, three entry points | Met, three chairs design (`32b9a383…`) | 5 · matches |
| U3 lab-2 | Delay judgement, checkpoint, exit | Wright 1900 glider as kite (`fd8903c0…`) | 4 · matches |
| ML cover | Creative process analysis | Iterative process diagram (rasterised; `1b014b8e…`) | 4 · matches (flagged) |
| ML analysis-model | Eight steps (guide) | Gilbreth standard symbols 1921 (`206324d9…`) | 4 · matches (flagged) |
| ML masterclass-1 | Describe the process first | Gilbreth "present method" chart (`8a77d4b4…`) | 5 · matches (flagged) |
| ML masterclass-2 | Language ≠ medium ≠ support | Jacquard loom + card chain (`a4122f03…`) | 4 · matches |
| ML masterclass-4 | Divergent is a hallmark | Met, six chairs scarlet upholstery (`8b487448…`) | 4 · matches |
| ML masterclass-5 | Process is also material | Loïe Fuller engraving, 8 panels (`004ceab4…`) | 4 · matches; brief slip (F7) |
| ML masterclass-6 | A score is not the designer | Binet 1911 results table (`1ab95a4c…`) | 4 · acceptable; brief slip (F7) |
| ML lab-1 | Shared process | Gilbreth "proposed" chart (`49671848…`) | 4 · matches (flagged) |
| ML lab-2 | Your Lab trail | Klee Bauhaus notebook p. 146 (`5b9a1cdd…`) | 4 · matches; repeats U3 diagram (F9) |

Result: 34 match (fit ≥ 4) and 2 fail (F1, F2). No asset is reused within a deck or across decks.

## Rights recording vs Commons file pages (API `imageinfo.extmetadata`, fetched 2026-10-05)

I checked 16 assets against their file pages: Leonardo, Lissitzky, Michelangelo (CC0), Gem clip (PD, anonymous, 1893), Rodin (CC0), Dollond (CC0), Post-it (CC BY 2.0, Nan Palmero), Fountain (PD, "Marcel Duchamp / Alfred Stieglitz"), Kleine Dada Soirée (CC0, NGA), Darwin, Sprite Fright (CC BY 4.0, Julien Kaspar/Blender Foundation), Sawaki (PD-Japan-oldphoto, unknown author), Margery (PD, Stanley De Brath, 1930), Gaudí model (PD, unknown, 1898–1908), Binet table (PD, Binet 1911), Loïe Fuller (PD, unknown, before 1900), Wright 1902 glider (PD, Wright Brothers), Gilbreth symbols (PD US, Frank and Lillian Gilbreth), Iterative diagram (CC BY-SA 4.0), Stickies (CC BY-SA 3.0), Six Hats board (CC BY 4.0), Pugh (CC BY-SA 3.0), Jacquard loom (CC BY-SA 4.0), Wright diary, Bell notebook (PD US unpublished) and Klee notebook (PD-old-80).

Licence and author in the registry match the file page in every case. The recorded death years are correct, including Lillian Gilbreth 1972, Duchamp 1968, Stieglitz 1946, Schwitters 1948 (the later of the two authors), Binet 1911 and Dollond 1820.

The flag reasons are correct:
- Fountain: readymade by Duchamp, d. 1968, EU term to 2038.
- Gilbreth charts (×3): co-author d. 1972, EU term to 2042.
- Post-it wall: CC BY 2.0 is not on the accepted list.
- Sprite Fright and the Iterative diagram: the prospector review tag has not been cleared.
- Sawaki: identifiable sitter.

Nothing marked `ok` contradicts the policy: every `ok` asset passes `rightsVerdict`, and no other identifiable living or recent person appears. Captions: running the deck JS against each built `content.json` showed 9 of 9 bound images per deck with author, "Wikimedia Commons", the source link and the licence. There is no `licence_url` link yet; that is EX5 F4.

## Commands run (this review)

| Check | Result |
| --- | --- |
| Import touched modules | `media-rules.mjs` (23 exports), `rendition.mjs` (2) import; `node --check` OK on `rehydrate-student-media.mjs` and `validate-decks.mjs` |
| `node --test scripts/tests/index.js` | `tests 30 · pass 30 · fail 0` |
| New A6 tests against EX3 code (scratch copy with `git show excellence/integration:scripts/lib/media-rules.mjs` and `rendition.mjs`) | `not ok` A6/F3 registry, A6/F6 raw SVG, A6/F1 death year (27 pass / 3 fail). The rendition test fails to import `looksLikeSvg`. All new tests fail on the old code. |
| Gates EX0–EX4 from worktree root | each `failures: 0`, exit 0; `git status` clean afterwards |
| `validate-decks --strict --rights=flag` | `0 error(s), 12 warning(s)`, exit 0 |
| `validate-decks --strict --rights=block` | `7 error(s)`, exit 1 (the 7 rule-flagged assets; Sawaki not seen, see F6) |
| Rehydrate idempotence (scratch copy) | only the deliberately tampered Sawaki flag changed back |
| deck-media | 36 files = 36 bound assets, all WebP, max 612,590 B ≤ 614,400 (600 KiB, the code's `600 * 1024`), longest side ≤ 1920, 0 files with EXIF/XMP/IPTC, no `.svg`, no orphans |
| U4 | `git diff excellence/integration...cascade/excellence-4 -- …/u-4-workplace-application` = 0 lines |
| Profield | not written by EX4 (F8) |
| Banned names (Un chien andalou, Rrose, Demisphere, Polke, hook and ladder, fashion illustration, patent sideboard) in U1–U3/ML deck JSON | none |
| Scratch `jekyll build` + `verify-publication-safety.mjs` on it | build exit 0; "Publication safety passed"; no "profield" in built U1–U3/ML JSON |
| Deck JS against built `content.json` (DOM/Reveal stub) | U1, U2, U3, ML: 13/13 sections, 9 deck-media backgrounds, all files present in `_site`; U4: 15/15 sections render |

## Acceptance re-check

| Item | Status | Evidence |
| --- | --- | --- |
| Exit gate passes | PASS | my run: exit 0, `failures: 0`; runner log at `3e0401c` agrees |
| Validator strict green | PASS | `--rights=flag` 0 errors |
| Every curated slide has a brief, asset, licence, author | PASS | gate check plus the dump of all 36 |
| `eu_term_ok: true` on every curated asset | Superseded by AUTOPILOT §0 | 4 assets have `eu_term_ok: false` (Fountain, 3 Gilbreth), all `flagged`. The gate accepts `ok\|flagged` by design, and the gate was not changed in this phase |
| Banned assets absent | PASS | grep empty |
| ≥ 60% of core slides imaged per deck | PASS | 7/8 each; still 6/8 after the F1/F2 fallback fixes |
| No asset reused within a deck | PASS | also none across decks |
| Sign-off file complete | PASS | `approved_by: autopilot (final review pending)`, `approved_on: 2026-10-04`, 4 decks |
| Cold reviewer opens 5 random bindings; image matches brief | **FAIL** | opened all 36; U2 `lab-2` and U3 `masterclass-4` do not match (F1, F2) |
| A6/F1 death-year contradiction fails | PASS | gate check + test; fails on EX3 code |
| A6/F2 forge doc corrected | PASS | diff of `STUDENT-SLIDESHOW-FORGE.mdc` |
| A6/F3 registry `raw_title` for every bound asset | PASS | gate check; 36/36 records carry `raw_title` |
| A6/F6 no raw SVG | PASS | ML cover rasterised 1920×1075 WebP; validator rejects `.svg` |

## Notes

- The vision substitution ruling is in F3: acceptable.
- The extra rehydrate change cannot turn a failing verdict into `ok` (F6).
- Blocking fixes are F1 and F2 only. After them, rerun rehydration, the validator and the EX4 gate, then file a short re-review limited to the two slides. Re-verify on the harness if any script changes (none are expected).
- Downstream: F3 needs a one-line edit to `LOCAL-EXECUTION.md` (EX4 row) and the A6 line of `PHASE-EX4.md`. F6 adds to the EX11 F5 item in `TECHNICAL-DIRECTOR-CASCADE.md` A6. Alt text is not rendered at all yet; that is already EX5 scope (`PHASE-EX5.md` line 15), so nothing to amend there.
- This reviewer does not mark DONE.
