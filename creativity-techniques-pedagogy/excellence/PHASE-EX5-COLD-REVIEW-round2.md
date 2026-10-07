# PHASE-EX5 Cold Review (round 2): deck renderer

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX5, did not write round 1) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | PHASE-EX5-REPORT.md "Round 2": round-1 F1–F3 fixed (`withBase()` for citation hrefs; Lab timer out of the card, exercise card capped at 540 px with inner scroll, "exercise type slightly smaller, within the golden-rule clamp"; card toggle moved bottom right); F4/F7 text fixes; new browser check 195 views / 0 failures; tests 47/47; gates EX0–EX5 green. Runner log at `c0bde82`, exit 0 |
| **verdict** | FAIL |

Branch `cascade/excellence-5` at `882ef7d`. The runner log names `c0bde82`, an ancestor of the tip. The only later commit, `882ef7d`, adds just the log. I read `git diff c59d923 81e1e8a` in full and the gate diff `c59d923..882ef7d`. Working tree clean before and after my runs.

**Why FAIL:** round-1 F1, F2 and F3 are fixed, and I proved that with runs against the round-1 code. But the F2 fix shrank the exercise-slide heading to below the forge's pre-2026-09-14 clamp. Deliverable 2 ("CSS keeps the forge's typography clamp") and the phase constraint (keep the STUDENT-SLIDESHOW-FORGE golden rules) forbid that. The report says the type stays "within the golden-rule clamp", and that claim is false. See R2-F1.

## Gate amendment

**Ruling: accepted. It only strengthens the gate.**

- `git diff c59d923 882ef7d -- …/PHASE-EX5.exit-gate.sh`: 8 added lines, 0 removed, appended before `finish`. Every earlier check is byte-identical.
- The amendment makes these cases fail:
  - non-zero exit of `deck-layout.mjs` (failures, exit 2 for a missing `_site`, Chrome not starting, or a probe exception such as Reveal not loading);
  - exit 0 with `SKIP` in the log (no Chrome).

  So no-Chrome counts as failure, as required. A stray "SKIP" in a slide id would also fail, which is strict but harmless.
- It runs after `build_site`, so `_site` is fresh.
- I ran it: `bash PHASE-EX5.exit-gate.sh` gives `PASS: browser layout check: deck-layout: 195 slide view(s), 0 failure(s)` and `failures: 0`.
- Minor (P2, not blocking): the log path `/tmp/excellence-deck-layout.log` is fixed, so two lanes gating at once would race on it. Use `mktemp`.
- The amendment landed in `c0bde82`, before the verify log, together with the round-1 records. That is orchestrator-owned and consistent with DECISIONS-LOG (the implementer did not edit the gate).

## Findings

### R2-F1: exercise heading shrunk below the forge clamp, and the report calls it "within the clamp". P1, blocks DONE

- **Evidence (CSS):** round 2 adds `.reveal .student-media-slide--exercise h1 { font-size: clamp(1.8rem, 5.4vw, 2.6rem); }` (`docs/assets/css/pass-track-deck.css`).
  - The forge clamp is `.reveal h1 { clamp(2.15rem, 6.6vw, 3.15rem) }`.
  - The pre-2026-09-14 clamp that golden rule 1 forbids reverting to was `clamp(1.85rem, 5.8vw, 2.7rem)` (`git show e6285c2`).
  - So the exercise h1 maximum of 2.6rem is below even the pre-bump maximum of 2.7rem.
- **Evidence (measured):** my CDP probe (copy of `deck-layout.mjs` that also prints `getComputedStyle`) on every exercise slide, round-1 build vs round-2 build at 1280×720:

  | Element | Round 1 | Round 2 | Change |
  | --- | --- | --- | --- |
  | h1 | 50.4 px | 41.6 px | −17.5 % |
  | sentence | 33.28 px | 29.95 px | −10 % |
  | quote | 23.96 px | 21.96 px | −8 % |
  | trace | 25.29 px | 23.30 px | −8 % |
  | timer | 23.30 px | 20.63 px | −11 % |

  The h1 is 41.6 px at all three viewports. That is below the 43.2 px the pre-bump clamp gives at 1024, 1280 and 1920.
- **Rules:**
  - STUDENT-SLIDESHOW-FORGE.mdc golden rule 1: "Do **not** revert to the pre-2026-09-14 clamps just because a slide 'looks empty.' A row-8 teenager reading a projection must not squint."
  - PHASE-EX5 deliverable 2: "CSS keeps the forge's typography clamp".
  - PHASE-EX5-REPORT round 2 claims "exercise type slightly smaller, within the golden-rule clamp (h1 `clamp(1.8rem, 5.4vw, 2.6rem)` …)". The DECISIONS-LOG round-2 line repeats it. The CSS comment "Type stays inside the golden-rule clamp" is false for h1.
- **Would the check catch it?** No. `deck-layout.mjs` measures boxes only, not type size.
- **Fix feasibility (measured):** I injected `.student-media-slide--exercise h1{font-size:clamp(2.15rem,6.6vw,3.15rem)}` at runtime and reran the 195-view check: 0 failures.
  - At 1280×720 and 1024×768 no exercise card scrolls (U2 lab-2 `scrollHeight 569 = clientHeight 569` at 1280).
  - At 1920×1080, U2 lab-1 and lab-2 then scroll by 37 px and 57 px. That is more than the bottom padding, so about 1–1.5 lines of portfolio-trace text would be hidden.
  - Restoring h1 alone is therefore not enough. The space must come from somewhere other than type size.
- **Fix:**
  1. Remove the exercise h1 override, so exercise slides use the forge clamp.
  2. Recover height without shrinking type below the forge values. Options: drop or shrink the kicker line on exercise slides, tighten the card's top padding and gaps, or derive the card cap from the section height minus the timer band instead of a fixed 540 px.
  3. Correct the report, DECISIONS-LOG line and CSS comment.
  4. Extend `deck-layout.mjs` to fail when an exercise h1's computed size is below the `.reveal h1` value and when the card's hidden overflow exceeds its bottom padding (see R2-F3).

  The alternative is for the product owner to amend golden rule 1 for exercise slides explicitly. An implementer cannot waive it.
- **Cascade amend:** none beyond R2-F2/F3.

### R2-F2: 540 px cap and `?print-pdf`. P2, does not block now. EX8 constraint, amend `PHASE-EX8.md`

- **Evidence (print):** I wrote my own CDP script: `?print-pdf`, `Emulation.setEmulatedMedia print`, then `Page.printToPDF` of U2 (13 pages, 1013×569 pt).
  - Printed from a 1280×720 window: U2 lab-1 and lab-2 `scrollHeight == clientHeight` (499/499, 538/538). Page 12 is complete.
  - Printed from a 1920×1080 window: `sh 604/ch 588` and `615/588`. Page 12 shows all text, but the trace box's bottom border and the card's bottom padding are cut off.
  - `pass-track-deck.css` has no `.reveal-print` override for `.student-media-slide--exercise` (`max-height: 540px; overflow-y: auto` persist in print). Any longer EX8 card will lose text in the PDF with no scrollbar.
- **Evidence (projection):** at 1920×1080 (the common classroom projector) the U2 lab cards scroll by 16 and 27 px today. That is padding and the trace border, not text: I viewed `1920-u-2-…-lab-1/lab-2` screenshots and every line is visible.
  - Root cause: type uses `vw` clamps inside Reveal's already-scaled 1280×720 slide. At 1920 the slide-space type is about 14% larger than at 1280 (sentence 34.2 vs 29.95 px) while the cap stays 540 px.
  - So 1080p is the tightest case, not 1280×720.
- **Ruling:** acceptable for the current text (no text hidden on screen or in print). It must not ship with EX8's longer Lab cards unchecked. Inner scroll on a projected Lab card means the back row cannot see the steps.
- **Fix / amend:** amend `PHASE-EX8.md` (Acceptance and gate) so that:
  - `deck-layout.mjs` runs in the EX8 gate;
  - no exercise card has hidden text at 1920×1080, 1280×720 or in `?print-pdf`;
  - a `.reveal-print .student-media-slide--exercise { max-height: none; overflow: visible }` rule (or equivalent) exists with a printed-PDF check.

### R2-F3: browser check blind spots. P2, does not block

- **Evidence:** reading `scripts/tests/browser/deck-layout.mjs`:
  - an overflowing card is reported as `note … card scrolls inside itself`, not a failure, regardless of how much text is hidden;
  - there is no `caption ∩ timer` test and no `caption inside viewport` test;
  - no type-size assertion;
  - the toggle, back link and arrows are measured once per deck (fine for `position: fixed`);
  - `box()` returns `null` for zero-size elements, so a missing toggle or caption silently skips those intersections.

  I added the caption∩timer and caption-in-viewport checks in my scratch copy: 0 failures, 195 views. So no defect today.
- **Fix:** fail when `scrollHeight − clientHeight > padding-bottom` on any card; add caption∩timer, caption-in-viewport and h1-size checks; fail if `.student-media-controls button` is absent on a deck page.

### R2-F4: dangling `#tao-of-creativity` fragments. P2, pre-existing, not EX5

- **Evidence:** resolving every internal `href/src/data-background-image` in the 5 built decks against `_site`: `111 links 0 missing`. 17 `…/#tao-of-creativity` links point to lesson pages with no such `id` (U1 ×10, U2 ×6, U3 ×1). The same hrefs exist on `excellence/integration` (`git show excellence/integration:…/u-1-…/content.json | grep -c tao-of-creativity` gives 10). The page loads; only the jump target is missing.
- **Fix:** route to the owning tao/lesson phase (golden rule 3 says Tao citations link to `/tao/#<chapter-id>`). Not an EX5 blocker.

## Round-1 findings re-checked

| Round-1 | Status | Evidence (run by me) |
| --- | --- | --- |
| F1 ML citation 404 | **fixed** | Built `_site/master-lectures/creative-process-analysis/index.html` has 4× `href="/creativity-techniques-uem/lessons/en/master-lectures/creative-process-analysis/#references"`. The target file exists and has `id="references"`. No root-relative `href/src/data-background-image` without the base in any of the 5 built decks (111 checked, 0 missing). `withBase()` returns `#…`, `http(s):`, `//…`, `mailto:`, empty and already-prefixed (`/site/…`, `/site#`, `/site?`) values unchanged. |
| F1 tests fail on round-1 code? | **yes** | Round-2 `deck-render.test.mjs` copied into a `git archive c59d923` tree: `SyntaxError … does not provide an export named 'withBase'`. After I appended a correct `withBase` export to the round-1 lib, both new F1 tests still fail (`not ok 12`, `not ok 17`): the renderer never calls it, and the round-1 includes carry 4 bare `/lessons/` hrefs. |
| F2 timer clipped | **fixed** | My run of `node scripts/tests/browser/deck-layout.mjs` gives `195 slide view(s), 0 failure(s)` (5 decks × 13 slides × 1280×720, 1920×1080, 1024×768; every `section[data-timer]` has a timer inside section and viewport, not over the card or toggle). Screenshots viewed: round2 `u-2-…-lab-1.jpg`, `u-2-…-lab-2.jpg`, `u-1-…-lab-2.jpg`, `u-4-…-#10.jpg`, plus my own 1920×1080 U2 lab-1/lab-2. Timer visible and text readable on all. |
| F3 caption under toggle | **fixed** | Same run: no `caption overlaps toggle`. Screenshots of U2 masterclass-6 and U1 masterclass-3 (captioned image slides) at 1280×720: caption top right, toggle bottom right, no contact. |
| Check fails on round-1 code? | **yes** | `git archive c59d923` into scratch, `bundle exec jekyll build`, then the round-2 `deck-layout.mjs` run from that tree: exit 1, `56 failure(s)` over 195 views; 30 at 1280×720 (matches the report). They include U2 lab-2 `card outside section; card outside viewport; timer outside section; timer overlaps card; caption overlaps toggle` and all 12 round-1 caption/toggle slides. |
| F4 FINAL-REVIEW U4 wording | **fixed** | FINAL-REVIEW now reads "U4: data untouched, but its look changed" and lists Koch on 2 diagram slides, the shifted cycle (`ct-pass-03` not `-05`), in-slide captions and 3 timers. I confirmed 3 timers on U4 in the browser check. I did not re-measure the cycle shift (round-1 evidence). |
| F7 notes | **accurate** | U2 m6 note: the slide quote "Artists are often portrayed … tortured geniuses" is `(Rubin 2023, 103)` with `quote_origin: page_verified`; the lesson's provenance line `U2.genius-myth … printed_page=103 … verbatim="Artists are often po…"` confirms it. The lesson body line 122 reads "practice matters, but does not replace judgement [(Rubin 2023, 104)]". The note now names which passage is 103 and which is 104, which is correct. Removed phrases: "or the brief" and "skip the hard part" occur in U1 `content.json` (slide text) and 0× in the lesson; "Tests need context" is in the U1 m3 slide sentence ("tests need context"); "Thirty sketches of the same sun" is in the U2 m2 slide sentence. `content.json` and includes agree (`render-decks --check` test passes). |
| F5, F6 | open, non-blocking (unchanged) | as round 1 |

## Acceptance re-check (run by me)

| Check | Command | Result |
| --- | --- | --- |
| Full suite | `node --test scripts/tests/index.js` | `tests 47 · pass 47 · fail 0` |
| Gates | `bash PHASE-EX{0..5}.exit-gate.sh` | all exit 0, `failures: 0`; EX5 includes the browser check PASS |
| Build + idempotence | `npm run build`, then `git status --short` | exit 0; "Publication safety passed: no internal corpus or local-architecture metadata in _site."; tree clean (also clean after all gate runs) |
| Sections/alt/notes, hashes, no `Date.now()`/base literal | EX5 gate python + `absent` checks | PASS |
| Browser layout | `node scripts/tests/browser/deck-layout.mjs` | exit 0, 195 views, 0 failures; notes: U2 lab-1/lab-2 scroll at 1920×1080 (R2-F2) |
| Print | own CDP `?print-pdf` → PDF of U2 from 1280 and 1920 windows | 13 pages each; page 12 text complete; 1920-window print cuts trace border/padding (R2-F2) |
| Golden rule 1 (type) | computed `font-size` on exercise h1 | 41.6 px < forge 50.4 px and < pre-bump 43.2 px. **FAIL (R2-F1)** |

## Notes

- Scratch artefacts (round-1 archive build, probe copies, PDFs, screenshots) are in the session scratchpad, not in the repo.
- Blocking fix: R2-F1 only. After the fix, rerun the EX5 gate, the extended browser check (R2-F3) and a `?print-pdf` of U2.
- Cascade: R2-F2 requires amending `PHASE-EX8.md` (browser check in its gate; no hidden exercise text at 1920×1080 or in print; print override for the card cap). The orchestrator should commit that amendment with this report.
- Observation, not a finding: on some curated slides the translucent card shows background text through it (U1 masterclass-3 Gem ad, ML cover diagram labels). It is readable in the screenshots I viewed. Card opacity was not changed in round 2.
