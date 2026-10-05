# PHASE-EX5 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-05 |
| **finished_at** | 2026-10-05 (implementation done; waiting for `cascade-harness.sh verify` and cold review) |
| **cold_review** | round 1 FAIL (F1, F2, F3 blocking) — fixed in round 2 (below); round-2 review pending |
| **cascade_amended** | none (forge rule `STUDENT-SLIDESHOW-FORGE.mdc` documents the new fields; no downstream phase assumption changed) |
| **branch / worktree** | `cascade/excellence-5` · `creativity-techniques-uem-integration-excellence-5` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT (decisions in DECISIONS-LOG.md) |

## Outcome

- U1, U2, U3 and the master-lecture deck are **pre-rendered**: each deck page includes
  `docs/_includes/decks/<slug>.html` with one `<section>` per slide (13/13 each). The slides
  are there without JavaScript, and nothing else in those pages emits `<section`.
- Each `<section>` carries `data-slide-id`, role, layout, background (`data-background-image`),
  an in-slide caption, `<p class="sr-only">Image: …</p>` alt text on every curated slide
  (U1 9, U2 8, U3 8, ML 8), and `<aside class="notes">` where the slide has `notes`.
- Speaker notes are on all 24 masterclass and lab slides of U1–U3. They hold talking points,
  the lesson's own cites, and a debate prompt. They were drafted locally and edited by hand
  against the lesson text.
- Layouts: `image_argument | quote | split | exercise`. The `layout` field wins; otherwise the
  role decides. Exercise slides carry `data-timer="180"` (`timer_seconds` overrides it), and
  the JS adds a start/pause/reset timer.
- Diagram fallback is the Koch triangle (`ct-koch-triangle-5cc4358a9bdb.svg`). The 6 geometric
  SVGs are renamed `ct-pass-NN-<name>-<sha256[:8]>.svg`, and every caption shows `#<hash>`.
  The renderer and a test check that each hash matches the file content.
- Captions read title · author · licence (linked to `licence_url`) · Source (link). They come
  from one tested function, `captionHtml()`, which is built on `media-rules caption()` (A6/F4).
- The base URL comes from `body[data-base-url]` (`{{ site.baseurl }}`). The JS has no
  `/creativity-techniques-uem` literal and no `Date.now()` fetch.
- A7: the Dada alt text now says German, Dutch **and French**. The Wright diary alt text now
  says **two pages**. Caption titles now come from the source record (Commons file/object
  title), not from the brief (e.g. "Cow", "Wright diary", "Maqueta polifunicular").
- U4 (legacy schema, out of scope) is untouched and **keeps the runtime path**: built and loaded
  in headless Chrome, 13/13 sections, Reveal ready. It now uses the hashed SVG names and the
  Koch fallback.

## What changed (files)

| File | Change |
| --- | --- |
| `scripts/lib/deck-render.mjs` (new) | pure renderer: `captionHtml`, `licenceLabel`, `geometricCaptionHtml`, `diagramCaptionHtml`, `layoutFor`, `timerFor`, `notesHtml`, `backgroundFor`, `renderSlide`, `renderDeck`, `parseHashedSvgName`; escapes `{`/`}` so includes are Liquid-safe |
| `scripts/render-decks.mjs` (new, stdlib) | writes `docs/_includes/decks/<slug>.html` for v2 decks; skips legacy decks; checks the SVG hashes and the Koch file; `--check` mode |
| `docs/_includes/decks/*.html` (new, generated) | U1, U2, U3, creative-process-analysis |
| `package.json` | `render:decks` script; wired into `prebuild` and `develop` after `media:rehydrate` |
| `docs/assets/js/student-media-deck.js` | rewritten: enhancement only (Reveal init, card toggle, Lab timer, `?show-notes`); legacy runtime path only when `#slides` is empty; base URL from `data-base-url` (fallback: the part of `data-content-url` before `/tracks/`); `fetch(contentUrl, {cache: 'no-cache'})` |
| `docs/assets/css/pass-track-deck.css` | `.sr-only`; in-slide `.slide-caption` (right 24%, card ≤ 72%: no overlap); four layouts; timer; `.no-js` reading view; print hides timer/chrome; old fixed caption panel removed; base clamp unchanged |
| U1–U3 + ML `index.html` | `class="no-js"`, `data-base-url`, `{% include decks/<slug>.html %}` |
| `docs/assets/images/fractal-pass-track/*.svg` | renamed with the 8-hex content hash (git mv; content unchanged) |
| `docs/assets/js/pass-track-deck.js`, How-to-Pass `content.json`, ML `content.json` | references to the hashed SVG names |
| U1–U3 `content.json` | `notes` on every masterclass and lab slide; asset titles/alt texts via rehydrate |
| `scripts/lib/media-rules.mjs` | `LAYOUTS`; validator: unknown `layout` and non-string `notes` are errors on v2 decks |
| `scripts/tests/deck-render.test.mjs` (new) | 15 tests: caption (A6/F4), licence labels, escaping, hashes, layouts, timer, notes, section/alt/notes/Koch rendering, validator rules, repo checks (true hashes, referenced SVGs exist, no base literal/timestamp, includes up to date) |
| `excellence/curation/autopilot-assets.json` | 33 titles → source titles (old one kept as `brief_title`); 2 alt texts (A7) |
| `excellence/evidence/EX4/choices.py`, `bind.py` | A7 alt texts; `SOURCE_TITLES` so a rebind reproduces the titles |
| `excellence/curation/rights-report.json` | refreshed by the validator (titles only) |
| `excellence/evidence/EX5/` | `draft_notes.py`, `notes-prompts/`, `notes-draft.json`, `model-calls.json`, `notes_final.py`, `apply_a7.py`, `cdp-screens.mjs`, `screens/*.jpg` |
| `forge/STUDENT-SLIDESHOW-FORGE.mdc` | documents `layout`, `notes`, `timer_seconds`, hashed geometric captions, the render step |
| `docs/assets/css/tailwind-processed.css` | regenerated by `npm run build` (Tailwind now scans the includes: adds `.shadow`) |

## What I ran (real output)

| Command | Result |
| --- | --- |
| `node scripts/render-decks.mjs` | `render-decks: 4 deck(s)` (U4: "skip legacy deck … keeps the runtime path") |
| `node scripts/validate-decks.mjs --strict --rights=flag` | `6 deck file(s), 0 error(s), 25 warning(s)` |
| `node --test scripts/tests/index.js` | `tests 45 · pass 45 · fail 0` |
| `bash …/PHASE-EX5.exit-gate.sh` (diagnostic; the harness runner decides) | `failures: 0` |
| EX0–EX4 gates (regression) | all `failures: 0` (EX2 failed once on the word "forge" in a JS comment; fixed, rerun green) |
| `npm run build` (prebuild → hydrate, rehydrate, render; postcss; validator; jekyll; safety) | exit 0; `Publication safety passed` |
| headless Chrome (CDP, real time), `/tracks/ct/u-1…/?print-pdf` | 13 `.pdf-page`, 13 sections; `Page.printToPDF` → 13 pages |
| `/tracks/ct/u-3…/?print-pdf&show-notes` | 13 pages, notes shown |
| JS disabled, U2 | all 13 slides readable as a page, captions under each |
| U1/U2/U3/U4/ML with JS | 13 sections each, `.reveal.ready`; timers: 2 per v2 deck (3 on U4: lab ×2 + workshop) |

Screenshots: `excellence/evidence/EX5/screens/u1-print-pdf.jpg` (whole `?print-pdf` view),
`u3-print-pdf-show-notes.jpg`, `u2-no-js.jpg`, `u1-masterclass-1.jpg`, `u3-lab-1-timer.jpg`,
`u1-analysis-opener-split.jpg`. Driver: `evidence/EX5/cdp-screens.mjs`. Note: Chrome's plain
`--dump-dom/--screenshot` with `--virtual-time-budget` leaves `?print-pdf` blank, because
Reveal's async print layout never finishes under virtual time. The CDP driver uses real time.

## Local model calls

| Model | Calls | Prompt tokens | Output tokens | Time | Purpose |
| --- | --- | --- | --- | --- | --- |
| `qwen2.5:32b-instruct` (Ollama `/api/generate`, stream false, temperature 0.2) | 24 | 9,945 | 2,688 | 192 s | notes drafts, one per U1–U3 masterclass/lab slide |

Before the run: `ollama ps` showed only `qwen2.5:3b` (small, idle). The in-practice runtime
PID 48350 (`process.json`) was not alive. Prompts held only the slide fields and the public
lesson section (switch-gated provenance and HTML comments stripped). Per-call log:
`evidence/EX5/model-calls.json`. The automatic check (cites and numbers must appear in the
input) dropped 0 lines. Reading by hand found lines that added claims, and I removed or
rewrote them in `notes_final.py`. Examples: "quantity over quality at this stage" (U1 m2),
"regular practice and training are what really matter" (U2 m6, against the lesson's "does not
replace judgement"), and "Oblique Strategies … in unexpected ways". Every final Source line
repeats a cite already in that lesson section. The studio-stance slides (U1 m4–6) and U3
m2/m3/m6 say that the lesson has no page cite.

## Uncertain / for the cold reviewer

- Notes are in the public HTML (`aside.notes`, hidden by Reveal) and in the public JSON. They
  are student-safe and passed the safety script, but they are still visible in the page source.
- Caption titles changed to source titles (A7). Some source titles are in other languages
  (*Maqueta polifunicular*, *Sombrero negro (Dudas)*, *Tableau de résultats au test de
  Binet-Simon*, *Pädagogisches Skizzenbuch*). Leonardo's source title is long (~80 chars).
  The professor may prefer English glosses.
- `split` layout: on the analysis opener the heading sits mid-card (grid rows); it reads, but the professor may want it top-aligned.
- The speaker view (Reveal notes plugin) is not vendored. Notes show with `?show-notes`
  (`showNotes`), which also works in `?print-pdf`.
- U4's runtime path keeps a small legacy caption builder in the JS (U4 only). In-scope decks
  get captions only from `captionHtml()`.
- The legacy path still paints backgrounds through CSS (U4 cache files are `.php`-named).

## Round 2 — cold review fixes (2026-10-05)

| Finding | Fix | Test that fails on the round-1 code |
| --- | --- | --- |
| F1 master-lecture citation links lost the base (404) | `withBase()` in `deck-render.mjs`: root-relative citation hrefs and asset URLs get `ctx.base`; `#…`, `http(s):`, `mailto:`, `//…` and already-prefixed values pass through. ML include re-rendered (4 hrefs now `/creativity-techniques-uem/lessons/…`) | unit test (`withBase` + `renderDeck` with a `/lessons/…` href); repo scan: no `href`/`src`/`data-background-image` in any include starts with `/` without the site base (round-1 include: 4 hits) |
| F2 Lab timer cut or hidden (U2 lab-1/lab-2), card past the section (U1 labs) | timer moved out of the card into the section's bottom padding (absolute, bottom left); exercise card `max-height: 540px` (+ section padding ≤ 720 px), inner scroll for longer Lab text (EX8 headroom); exercise type slightly smaller, within the golden-rule clamp (h1 `clamp(1.8rem, 5.4vw, 2.6rem)`, sentence 0.9em) | browser check: card and timer inside section and viewport; timer ∩ card = ∅ |
| F3 caption under the card-toggle button (12 slides) | toggle moved to bottom right, left of Reveal's arrows (`right: 7.5rem`) | browser check: caption ∩ toggle, caption ∩ card, toggle ∩ card, timer ∩ toggle, toggle ∩ arrows, caption/toggle ∩ back link = ∅ |
| F4 FINAL-REVIEW said "U4 untouched" | now: U4 data untouched, look changed (Koch on 2 diagram slides, shifted geometric cycle, in-slide captions, 3 timers) | — |
| F7 U2 masterclass-6 Rubin page; slide-only phrases in notes | the slide quote (tortured geniuses) is the page-verified p. 103 passage, so 103 stays and the note now says which passage is 103 and which lesson point is 104. Removed phrases taken from the slide, not the lesson: U1 m3 "Tests need context", U1 m5 "or the brief", U1 m6 "or skip the hard part", U2 m2 "Thirty sketches of the same sun …" | — (text) |

**Browser check** `scripts/tests/browser/deck-layout.mjs` (`npm run test:browser`; stdlib + local Chrome over CDP; serves `_site` under the baseurl; prints SKIP and exits 0 if no Chrome). It walks every slide of U1, U2, U3, U4 and the master lecture at 1280×720, 1920×1080 and 1024×768.
- Round-1 code (1280×720 only): **30 failures**. These include the reviewer's 12 caption/toggle collisions and the cut/hidden timers on U2 lab-1/lab-2.
- Fixed code: `deck-layout: 195 slide view(s), 0 failure(s)`. Two notes: at 1920×1080, U2 lab-1/lab-2 scroll inside the card, because the `vw`-based type is larger there. The timer stays visible.
- The check is not in the exit gate (gates are not edited). Run it after a build.

**Round-2 runs:** `node --test scripts/tests/index.js` 47/47; `npm run build` exit 0, "Publication safety passed" (one interim failure: the word "forge" in a CSS comment, reworded); EX0–EX5 gates all `failures: 0`.

**Screenshots of the fixed slides:** `evidence/EX5/screens/round2/` — every timer slide of the 5 decks at 1280×720 (e.g. `u-2-idea-generation-selection-lab-2.jpg`: full card, timer under it, caption clear of the toggle).

**Still open (non-blocking):**
- F5: includes bake the base path at render time; `jekyll serve --baseurl ''` needs a re-render.
- F6: `legacyCaption` stays until U4 migrates.
- Print view: an exercise card longer than 540 px would clip in `?print-pdf`. Not the case today; EX8 should check its longer cards with `?print-pdf`.

## Resume point

Run `cascade-harness.sh verify … PHASE-EX5.md <worktree>`, then a fresh cold review. Do not open EX6.
