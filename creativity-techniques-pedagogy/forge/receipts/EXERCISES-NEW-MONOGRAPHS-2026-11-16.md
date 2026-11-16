# Receipt — eight datasheets from post-inventory monographs (2026-11-16)

**Why:** the in-practice inventory (2026-09-21, 36 files) predates 15 bibliography additions; catalogue coverage of them was 0–9 records each. Eight class-ready datasheets forged from those sources.

| ex-id | Source (public cite) | Catalogue URN | Locator note |
| --- | --- | --- | --- |
| `morning-pages` | (Cameron 2002, “The Basic Tools”) | f71fc2a5… | Calibre PDF of 2002 Tarcher ed.; Ahmes metadata says 2010 + pdf_order 51 — overridden |
| `pure-contour-drawing` | (Edwards 1999, 90) | 08ed3d62… | Printed folio read on PDF p. 108 (pdf_order 108 → printed 90) |
| `down-draft-up-draft` | (Lamott 2007, 12) | 9907f845… | Same scheme as `one-inch-picture-frame` |
| `brainstorm-ground-rules` | (Osborn 2013, chap. 26) | 5164a30f… | EPUB: page_index = chapter + 4 |
| `idea-spurring-questions` | (Osborn 2013, chap. 24) | 3c24dc43… | EPUB chapter XXIV summary (SCAMPER origin) |
| `parallel-prototyping` | (Dow et al. 2010, 18:5) | **none — gap** | Resolver BIBLIO-GAP; locator from running heads (page_index n = 18:n+1) |
| `consider-the-negative` | (Boden 2004, 66) | **none — gap** | printed = page_index − 14 (verified in conceptual-spaces lesson) |
| `yes-and` | (Nixon 2020, chap. 4) | **none — gap** | EPUB chapter 4 “Improvise” |

- Quotes: all eight verified as whitespace/quote-normalised substrings of the cited nodes (in YAML order, `[…]`-joined). 96–173 words.
- Graphics: eight new kinds in `scripts/generate-exercise-graphics.mjs` (pages-drain, seismograph, three-drafts, four-rules, question-wheel, parallel-lanes, rule-negation, yes-and-chain).
- References added: `cameron-2002`, `edwards-1999`, `nixon-2020`.
- All status `pilot`. `npm run hydrate:exercises` + `npm run verify:publication` pass; 21 pages render on :4003.
- Lesson links (2026-11-16, additive “Also useful / Longer version / Warm-up option” lines; no embedded steps removed): U1 morning-pages, pure-contour-drawing · U2 Ex1 brainstorm-ground-rules, idea-spurring-questions, yes-and · U3 Ex1 parallel-prototyping (longer version), Ex2 down-draft-up-draft · U4.1 idea-spurring-questions, yes-and · U4.2 pure-contour-drawing · U5 related list consider-the-negative, parallel-prototyping (+ internal route) · U6 morning-pages, consider-the-negative · master lecture conceptual-spaces → consider-the-negative. Decks not touched. The uncommitted `conceptual-spaces-creative-change` lesson Exercise 2 overlaps `consider-the-negative` — left untouched.
