# PHASE-EX5: Deck renderer — pre-render, alt text, captions, notes, layouts

> **Track:** `docs/assets/js/student-media-deck.js`, deck `index.html` pages,
> new `scripts/render-decks.mjs`, `docs/assets/css/pass-track-deck.css`
> **Status:** BLOCKED (EX4 DONE, or PARTIAL with a green validator)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Make decks work offline, print, and read correctly with assistive tech.
Live failing cases (FINDINGS B14 and presentation section of the audit):
slides exist only after a runtime `fetch(…?v=${Date.now()})`, so a deck on
poor classroom Wi-Fi shows "Loading deck"; `alt_text` is never rendered;
`diagramFallback` (Koch) is never used; geometric captions cannot show the
required hash because `ct-pass-0N-*.svg` names have none; the base path
`/creativity-techniques-uem` is hard-coded; there are no speaker notes.

## Deliverables

1. `scripts/render-decks.mjs` (stdlib): reads each deck `content.json` and
   writes `docs/_includes/decks/<slug>.html` with one `<section>` per slide,
   `data-slide-id`, `data-background-image`, caption markup, a visually
   hidden alt-text element (`<p class="sr-only">`), and `<aside class="notes">` from a new `notes`
   field. Wired into `prebuild` and `develop`. Each deck `index.html`
   includes its file; JS only enhances (caption panel, card toggle, timer).
2. Layouts by `layout` field: `image_argument`, `quote`, `split`, `exercise`
   (defaults by role). CSS keeps the forge's typography clamp and readability law.
3. Koch fallback for `diagram`; geometric SVGs renamed with a content hash
   (`ct-pass-01-structure-<hash8>.svg`) and the hash shown in their caption.
4. Captions: title · author · licence (link) · source (link).
5. Base URL from a `data-base-url` attribute; no hard-coded path in JS.
6. `notes` drafted for every masterclass and lab slide of U1–U3 (talking
   points, source page, debate prompt); professor reviews them.
7. Lab timer (`data-timer="180"`) on exercise slides.

(Amendment A6/F4: captions come from one tested function; the renderer shows `licence_url` as a link.)

## Scope

**In:** renderer, CSS, deck pages, notes. **Out:** image choice (EX4), lesson text.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX5 per creativity-techniques-pedagogy/excellence/PHASE-EX5.md.

## Deliver
1. Deliverables 1–7. The built deck HTML must contain every slide without
   JavaScript.
2. Check one deck with `?print-pdf` in a browser and attach a screenshot path
   to the report.
3. `node scripts/render-decks.mjs`, `node scripts/validate-decks.mjs --strict`,
   jekyll build — all exit 0.
4. Hand off for cold review — do NOT mark DONE.

## Constraints
- Keep VISUAL-READABILITY-LAW and the golden rules in STUDENT-SLIDESHOW-FORGE
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: for each U1–U3 deck, the built HTML has as many
  `<section` elements as slides in its JSON; every curated slide's section has
  alt text; notes present on every masterclass slide; no
  `/creativity-techniques-uem` literal in the JS; geometric SVG names carry an
  8-hex hash; the JS no longer fetches `content.json` with a timestamp

## Risks

- Reveal's `data-background-image` handles commas and `%2B` poorly (the reason
  for the current CSS painting): local same-origin WebP names from EX3 avoid it.
