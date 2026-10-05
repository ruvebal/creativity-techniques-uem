# PHASE-EX5 Cold Review: deck renderer (pre-render, alt text, captions, notes, layouts)

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX5) |
| **reviewed_at** | 2026-10-05 |
| **implementer_claim** | PHASE-EX5-REPORT.md (status VERIFYING): U1, U2, U3 and the master lecture are pre-rendered, 13/13 sections each; alt text on every curated slide; notes on all 24 U1–U3 masterclass/lab slides; hashed geometric SVGs; Koch fallback; captions from one tested `captionHtml()`; base URL from `data-base-url`; lab timer; U4 keeps the runtime path. Runner log at `12cb607`, exit 0 |
| **verdict** | FAIL |

Branch `cascade/excellence-5` at `c59d923`. The runner log names `12cb607`, which is an ancestor of the tip. The only commit after it, `c59d923`, adds just the verify log (`git show --stat c59d923`: 1 file, +24). So the log covers the implementation. I read the whole diff `excellence/integration...cascade/excellence-5` (73 files, +3370/−439). The working tree was clean before I started and again after `npm run build`.

**Why FAIL:** the gate is green, and the data side is sound: sections, alt text, notes, hashes, Koch, licence links, no-JS reading, print, A7 and the notes content all check out. But the browser check found three defects that EX5 introduced. None of them is caught by the gate or the tests:

1. **F1:** the master-lecture deck's citation links lost the base path and return 404.
2. **F2:** the new Lab timer is hidden or cut off on U2's two exercise slides.
3. **F3:** the new in-slide caption collides with the card-toggle control on 12 slides. That breaks VISUAL-READABILITY-LAW, which the phase must keep.

All three are small CSS/renderer fixes.

## Findings

### F1: master-lecture citation links lose the base path (404). P1, blocks DONE

- **Evidence:** the old runtime JS passed every `slide.citation.href` through `citationHref()`, which adds `base` (`git show excellence/integration:docs/assets/js/student-media-deck.js`, lines 44–48 and 202). The new `renderSlide()` (`scripts/lib/deck-render.mjs`) writes `slide.citation.href` unchanged. The ML deck JSON stores root-relative hrefs (`"href": "/lessons/en/master-lectures/creative-process-analysis/#references"`). So the built page `_site/master-lectures/creative-process-analysis/index.html` contains `href="/lessons/en/master-lectures/creative-process-analysis/#references"` 4 times. With `_site` served under `/creativity-techniques-uem/`, `curl` returns `404 unprefixed` and `200 prefixed`. U1–U3 hrefs already carry the base in their JSON, so they are fine.
- **Would the tests catch it?** No. No test renders a root-relative citation href.
- **Fix:** in `renderSlide`, prefix root-relative hrefs with `ctx.base`, the same way the old `citationHref` did (`#`, `http(s):`, `mailto:`, `//` and already-prefixed values pass through unchanged). Add a unit test with a `/lessons/...` href and base `/site`. Re-render.
- **Cascade amend:** none.

### F2: Lab timer hidden or cut off on U2 exercise slides. P1, blocks DONE (deliverable 7)

- **Evidence:** I ran headless Chrome with CDP at 1280×720 against the built `_site` and measured rects after `Reveal.slide(i)`. The section is `overflow: auto`, so content below its bottom edge is not visible.
  - U2 `lab-1`: section `[19, 639]`, card `[50, 681]`, timer `[615, 650]`. The timer is cut in half.
  - U2 `lab-2`: section `[19, 639]`, card `[50, 725]`, timer `[659, 694]`. The timer is completely hidden, and the portfolio-trace box is clipped.
  - U1 `lab-1`/`lab-2`: the card bottom (647) is 8 px past the section (639). The timer is still visible.
  - Screenshots in my scratchpad (`u2-lab1.png`, `u2-lab2.png`) show this. The implementer's timer screenshot used U3 `lab-1`, which has shorter text and fits.
- **Fix:** make the exercise layout fit in 720 px. For example, put the timer in a fixed corner of the section instead of the card flow, use a smaller gap/quote size in `--exercise`, or let the card scroll inside itself. Then add a browser check that every `section[data-timer] .slide-timer` lies inside its section's rect.
- **Cascade amend:** none. EX8 (Lab redesign) will add exercise text, so the fix must hold for longer exercise slides.

### F3: in-slide caption collides with the card-toggle control. P1, blocks DONE (VISUAL-READABILITY-LAW)

- **Evidence:** the same CDP scan, testing whether the `.slide-caption` rect intersects the `.student-media-controls button` rect, reports `cap/toggle=true` on 12 slides:
  - U1: `masterclass-3`, `lab-1`, `lab-2`
  - U2: `analysis-model`, `masterclass-6`, `lab-1`, `lab-2`
  - U3: `lab-1`
  - ML: `masterclass-5`, `masterclass-6`
  - U4: slides 9 and 10

  On the exercise slides the caption starts at y=19 and runs under the round ◉ button. The screenshots show caption text hidden: "Kleine Dada Soirée (Small Dad[a]" on U1 `lab-2`, and "Unknow[n]" on U2 `lab-1`. The old fixed panel sat at `top: clamp(5rem, 11vh, 7.25rem)` and cleared the button, so this is a regression. The law says: "Text must never collide with nodes, controls, forms, captions…". The CSS comment claims "Caption and card never overlap", which is true (`cap/card=false` everywhere), but it does not check the control.
- **Fix:** keep the caption clear of the top-right control. Either give `.slide-caption` a top offset or right inset at least the button's size, or move the toggle elsewhere. Add the caption/control intersection to a browser check.
- **Cascade amend:** none.

### F4: U4's look changed; FINAL-REVIEW says "untouched". P2, does not block

- **Evidence:** U4 deck JSON is byte-identical to integration: `git diff excellence/integration cascade/excellence-5 --stat -- docs/tracks/en/uem/2627-ct/u-4-workplace-application` is empty. It renders with 13 sections and `.reveal.ready`. But the shared JS changes what U4 looks like:
  - its two `lab_exercise` diagram slides now show the Koch triangle instead of the geometric cycle;
  - the geometric cycle no longer advances on those slides, so the outro gets `ct-pass-03` instead of `ct-pass-05`;
  - captions moved into the slide;
  - three timers were added;
  - F3 also applies to U4 (slides 9 and 10).

  This is acceptable under A1 (no U4 file is edited) and A2/F7 (nothing breaks, and the referenced cache file is still served). DECISIONS-LOG line 64 records it. But `FINAL-REVIEW.md` line 179 says "U4 untouched".
- **Fix:** change FINAL-REVIEW to "U4 data untouched; its look changed (Koch on 2 diagram slides, in-slide captions, timers)", so the U4 forge knows.
- **Cascade amend:** none.

### F5: includes bake the base URL at render time. P2, does not block

- **Evidence:** `render-decks.mjs` reads `baseurl` from `_config.yml` and writes it literally into the includes. `data-base-url` is used only by the JS. A build with another baseurl (for example `jekyll serve --baseurl ''`) would point backgrounds at the wrong path until someone re-renders. The deliverable 5 requirement ("no hard-coded path in JS") is met.
- **Fix (optional):** note this in the forge. Alternatively, emit `{{ site.baseurl }}` unescaped for the URL prefix only.

### F6: legacy caption builder in the JS is a second, untested caption path. P2, does not block

- **Evidence:** `legacyCaption()` in `student-media-deck.js` is used only by U4's runtime path. In-scope decks get captions only from `captionHtml()`. `grep -rn "captionHtml(\|legacyCaption"` finds exactly one production caller of each. This satisfies A6/F4 for the in-scope decks, and the report states it openly.
- **Fix:** delete it when U4 migrates to schema v2. No action now.

### F7: notes lean on slide text, and one cite is not in the lesson body. P2, does not block

- **Evidence:** I read all 24 notes against the three lesson files.
  - Every cite in a note appears in that unit's lesson text, with one exception: U2 `masterclass-6` "(Rubin 2023, 103)". That is the slide's own existing citation, and the lesson body cites Rubin 104, not 103. 103 appears only in an internal provenance comment.
  - A few phrases come from the slide sentence, not the lesson: U1 m5 "or the brief", U1 m6 "or skip the hard part", U1 m3 "Tests need context". These are not new facts.
  - Nothing comes from model memory. There are no internal terms (B2, D1 and "studio stance" are public lesson vocabulary). The wording is plain English.
  - U3 m2, m3 and m6 honestly say there is no page cite.
- **Fix:** none needed. The professor's review of the notes (deliverable 6) may want to align U2 m6 with the lesson's Rubin 104 line.

## Acceptance re-check (run by me)

| Check | Command / method | Result |
| --- | --- | --- |
| Modules load | dynamic `import()` of `deck-render.mjs`, `media-rules.mjs`, `render-decks.mjs`; `node --check` both deck JS files | all load; `render-decks: 4 deck(s), 0 written` (U4 skipped as legacy) |
| Full suite | `node --test scripts/tests/index.js` | `tests 45 · pass 45 · fail 0` (index.js globs all `*.test.mjs`, including the new `deck-render.test.mjs`) |
| New tests fail on old code? | read the tests against the integration tree | yes: the module did not exist; old SVG names had no hash; old JS had `/creativity-techniques-uem` and `Date.now()`; `--check` include staleness. None covers F1–F3 |
| Gates EX0–EX5 | `bash PHASE-EX{0..5}.exit-gate.sh` | all exit 0, `failures: 0` |
| Build + idempotence | `npm run build` (prebuild rehydrate + render) then `git status --short` | exit 0; `Publication safety passed`; tree clean |
| Sections vs slides | parsed `_site/tracks/ct/u-[123]-*/index.html`, `_site/master-lectures/creative-process-analysis/index.html` | 13/13 each |
| Alt text per curated slide | per-section `p.sr-only` | U1 9/9, U2 8/8, U3 8/8, ML 8/8; A7 present ("German, Dutch and French"; "Two pages of Orville Wright's diary") |
| Notes asides | per-section `aside.notes` on masterclass + lab_exercise | 24/24 U1–U3 (ML has none; deliverable 6 is U1–U3 only) |
| Geometric hashes | `shasum -a 256` of each `ct-pass-*.svg` vs name and `#hash` in caption | all 6 match; Koch `5cc4358a9bdb` matches its content; no stale unhashed reference in `docs`/`_site` |
| Koch on diagram slides | sections with `background_kind: diagram` | all use `fractal-triangles/ct-koch-triangle-5cc4358a9bdb.svg` |
| Licence links | `licence_url` present in each curated section | all present; every `data-background-image` file exists in `_site` |
| Caption titles (A7) | Commons API `extmetadata.ObjectName` for 8 files | Wright diary, Maqueta polifunicular, Cow, Sombrero negro (Dudas), Darwin Tree 1837, Pugh Concept Selection, Stickies to brainstorm Edit.2014., Beat the Whites with the Red Wedge: all match (punctuation normalised) |
| No-JS | CDP, script execution disabled, U1 full page | all 13 slides readable as a page, captions under each |
| Print | `cdp-screens.mjs …u-2…/?print-pdf --pdf` | `{"pages":13,"sections":13,"notes":8,"ready":true}`; PDF page 12 readable |
| JS literals | `grep` | no `/creativity-techniques-uem`, no `Date.now()`; `dataset.baseUrl` used |
| Screenshots viewed | U1 mc1 (image_argument), U1 analysis-opener (split), U1 lab-2 and U2 lab-1/lab-2 (exercise + timer), U3 mc2, U4 mc1 and lab-1 (legacy) | text readable over images (card opacity holds on Dada and Beethoven); no broken images; F2 and F3 seen |
| Model use | `evidence/EX5/model-calls.json`, `draft_notes.py` | 24 calls to `localhost:11434` (`qwen2.5:32b-instruct`); local only |

## Notes

- I served `_site` under `/creativity-techniques-uem/` from a scratch directory on port 8977. Screenshots and scan scripts are in the session scratchpad, not in the repo.
- The headless measurements are at 1280×720 (Reveal scale 0.945). Classroom projectors at 16:9 scale the same way, so F2 and F3 reproduce at any 16:9 size.
- After fixing F1–F3: re-render, rebuild, rerun the gate, and rerun a CDP check of timer-in-section and caption-vs-control on every slide of the five decks.
