# PHASE-EX9 cold review: lesson structure, exemplars, lesson images

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session; did not implement EX9; part of the implementer's session ran while the safety classifier was unavailable, so every claim below was re-checked) |
| **reviewed_at** | 2026-10-06 · worktree `creativity-techniques-uem-integration-excellence-9` · tip `c38d61e` (verify-log commit `6b60c2b` is an ancestor; `git diff 6b60c2b HEAD` touches only `PHASE-EX9-VERIFY-LOG.md`) · base `excellence/integration` = `fef0fab` |
| **implementer_claim** | VERIFYING: deliverables 1–5 and A3, A5, A9, A10, A12 done; gate 0 failures; citations and provenance unchanged; `npm test` 55/55; EX0–EX8 gates green; build + publication safety green |
| **verdict** | PASS |

No blocking findings. I found ten P2 issues. None of them blocks DONE. Every one is a wording, documentation or gate-strength issue that the professor can triage in EX10, EX11 or the next cascade.

## Findings

### F1 · P2 · does not block: the gate's A12/F8 caption check cannot fail
`PHASE-EX9.exit-gate.sh` greps the raw `licence` and `credit_line` fields for "public domain". The flagged assets store `licence` as `PD-old-70` or `PD-EU`, so the regex never matches, either before or after the fix. The check also only globs `u-[123]-*`, so it skips the master-lecture deck, which holds the three flagged Gilbreth charts.
```
$ python3 (flagged assets) → u-1 U1.lab-1 'PD-old-70' · u-2 U2.lab-1 'PD-EU' · creative-process-analysis ML-CPA.{analysis-model,masterclass-1,lab-1} 'PD-old-70'
```
Real enforcement exists elsewhere. The validator rule in `scripts/validate-decks.mjs` fires against the pre-fix `captionHtml`: I copied the `excellence/integration` versions of `deck-render.mjs` and `media-rules.mjs` to the scratchpad and got `VALIDATOR WOULD FIRE (old captionHtml): U1.lab-1` and `… U2.lab-1`. The new `lesson-figures.test.mjs` tests 1 and 8 also fail on pre-fix code.
**Fix (EX11 gate or next cascade):** have the gate test the rendered caption (`captionHtml(asset)`, or the committed `_includes/decks/*.html`) for every scoped deck, including `creative-process-analysis`.

### F2 · P2 · does not block: the records leave out a fourth "Rights under review" caption
`DECISIONS-LOG.md` (EX9 F8 line) and the FINAL-REVIEW P0 rights bullet name "U1 lab-1 and three ML-CPA Gilbreth charts". The renderer also re-captioned U2 lab-1 (*Kodo Sawaki, zazen*, licence `PD-EU`, flagged).
```
$ grep -c "Rights under review" docs/_includes/decks/*.html → creative-process-analysis 3 · u-1 1 · u-2 1 · u-3 0
```
**Fix:** add U2 lab-1 to the DECISIONS-LOG line and to the FINAL-REVIEW P0 rights item.

### F3 · P2 · does not block: U1 "Flexibility" gloss drifts from Chen
The list is introduced as "Guilford's four abilities, as Chen summarises them". EX9 changed Flexibility from "try several angles at once" to "try several angles (different kinds of idea)". Chen 2011, 26 (Ahmes coat d048ab99) reads: "Flexibility - the ability to consider a variety of approaches to a problem simultaneously." The new gloss drops "simultaneously" and adds the course's own operational definition ("kinds of idea") inside a list attributed to Chen.
**Fix:** "try several angles at once (in the Lab you count them as kinds of idea)".

### F4 · P2 · does not block: one "In practice" line reads as a general claim
In U2 idea 3, "for wayfinding signs, arrows and room numbers come first; keep writing until colour, sound or floor marks appear" asserts what comes first in general, with no "might". Twelve of the eighteen "In practice" lines lack "might". The others are imperative or conditional and assert nothing empirical, so this is the only line that reads as a claim. No "In practice" line carries the "Illustrative example (not student work)" label. Each lesson's Editorial note discloses that the design examples are the professor's illustrations, and the Masterclass subtitle calls them "a design example". The phase file requires the label only for example traces.
**Fix:** "for wayfinding signs, you might find arrows and room numbers come first; …". Optionally add "(illustrative)" to the Masterclass subtitle.

### F5 · P2 · does not block: stale "class pool" wording after the F4 timing fix
U1 Ex1 step 4 now uses a shared board or table groups of 5–6. The lesson Source line still says "the class-pool scoring are a classroom adaptation", and the U1 lab-1 deck note says "scoring by class pool are course wording".
**Fix:** "the shared-board scoring".

### F6 · P2 · does not block: forge rules now contradict the new spine
`ct-unit-forge.mdc:143` (§4a-bis) still requires the Conclusion "**immediately before** `## References`". The new spine, in §4a-quater, LESSON-TEMPLATE and the live U1–U3 pages, puts `## Tao of Creativity` between them. The report already admits that §4 still says "B1/B2/B3 prose".
**Fix:** amend §4a-bis to "before `## Tao of Creativity` / `## References`", and §4 to the new section names.

### F7 · P2 · does not block: the 12-lesson split rule has two gaps
`LESSON-TEMPLATE.md` §5 step 2 does not cover two live cases:
1. An idea practised by neither exercise whose **Try it:** names the Lab debate (U1 idea 6 → `#lab-debate`). The template also never says which lesson the debate goes to.
2. An idea practised by both exercises goes to lesson A, but its **Try it:** may link to exercise 2 (U3 idea 3 → Ex2, which would end up in lesson B). The rule does not say whether the Try-it link is rewritten or becomes a cross-lesson link.

The open-items paragraph is honest about calendar, exercise count and thresholds. It also flags the conflict between "exactly two lab_exercise slides per deck" and one exercise per lesson deck. It does not mention these two gaps.
**Fix:** add "the Lab debate goes to lesson A; an idea whose Try it names the debate goes with it", and "a shared idea's Try it links the lesson-A exercise".

### F8 · P2 · does not block: master lecture has one example trace for two exercises
ML Ex1 (the shared process, modelled by the professor) has no `**Example trace:**`. One trace sits under Ex2 and shows the 8-step card that both exercises use. Deliverable 3 says "one exemplar per Lab exercise", and it applies to ML "where the same blocks apply". The gate does not check ML.
**Fix:** acceptable as is. Optionally add a sentence under Ex1 pointing to the trace below.

### F9 · P2 · does not block, pre-existing: lessons index says Workshop advances D1
`docs/lessons/en/creativity-techniques/index.md:20` still reads "Workshop (Deliverable) | … | Advance D1–D3". That contradicts STUDENT-SLIDESHOW-FORGE ("D1 Analysis never receives Workshop clock"), the U2 deck outro and the new U2/U3 Workshop first lines ("D1 Analysis gets no Workshop time"). EX9 did not touch this file. `docs/evaluation/index.md` and How to Pass ("time on the next graded deliverable") do not contradict the new lines.
**Fix (EX11):** change it to "Advance D2–D3 (from session 4)".

### F10 · P2 · does not block: report count differs from mine
The report gives U1 "distinct cite labels 12 → 12". My script counts 11 → 11. The two scripts use different label regexes, and both show the same set before and after. Not a loss.
**Fix:** none needed. Recorded so the next reviewer does not chase it.

## Acceptance re-check (runnable evidence, this session, tip `c38d61e`)

| Check | Command / method | Result |
| --- | --- | --- |
| EX9 exit gate | `bash PHASE-EX9.exit-gate.sh` | **exit 0**, failures 0. Structure, Tao anchors, Workshop timing, jekyll build, browser check "325 slide view(s), 0 failure(s)", A12 check (vacuous, see F1) |
| Verify log | `PHASE-EX9-VERIFY-LOG.md` | runner, commit `6b60c2b` (ancestor of tip, only the log after it), exit 0 |
| Full suite | `npm test` | **55/55 pass** |
| Sync + probe | `node --test …/tests/deck-lesson-sync.test.mjs …/tests/probe-references.test.mjs` | **12/12 pass** |
| Lesson figures | `node --test scripts/tests/lesson-figures.test.mjs` | **8/8 pass**; tests 1 and 8 would fail on pre-fix code |
| Render freshness | `node scripts/render-decks.mjs --check` | "4 deck(s), 0 stale" (includes `lesson_figures.json`) |
| Gates EX0–EX8 | each `PHASE-EXn.exit-gate.sh` | all **exit 0**, 0 FAIL (EX5 and EX8 include the Chrome layout check: 325 views, 0 failures) |
| Build | `npm run build` ×2 | both exit 0, "Publication safety passed"; `_site` sha1 lists of the two builds **identical** (`diff` exit 0); `git status --short` empty after gates and both builds |
| Citations not lost | scripted `git show excellence/integration:` vs tip, per lesson | PROVENANCE_LINE U1 14→14, U2 24→24, U3 14→14, ML 9→9; LAB_LINE 2/2/2/0 unchanged; QUOTE_PROVENANCE, REF_COATS, MEDIA_RIGHTS_LINE, SIX_HATS line sets **byte-identical**; `#ref-` multisets identical (15/23/12/10); author-date label multisets identical (11/20/10/6); front-matter `references:` unchanged |
| Moved citations vs source | Ahmes extraction DBs | **Osborn 1942** (96048e6a, node f9bd5077): the list after "No conference to think up an idea should be undertaken without some ground rules, such as the following:" opens with "Judicial judgment is ruled out. Criticism must be withheld until all ideas are in." The next item is "Wildness is wanted", then "3. …", so "first ground rule" holds. The TOC lists Chapter IV "Group Method" p. 25, so chap. 4 holds, and the shorter span is verbatim. **de Bono 1970** (bb5aec96, node 9797a1fb, introduction): "You cannot dig a hole in a different place by digging the same hole deeper." is verbatim (first of three sentences); node c9c41c9b has "Lateral thinking is generative. Vertical thinking is selective." **Csikszentmihalyi 1996** (35dcf3a7, node after the "Three: The Creative Personality" heading): "…originality in picking unusual associations of ideas. These are the dimensions of thinking that most creativity tests measure and that most workshops try to enhance." This supports U2 idea 2 (moved) and idea 6 / the A10 note. **Craft 2000, 30**: "The same creative act may involve both divergent and convergent thinking", which supports the new U2 idea 1 sentence |
| No new facts | read all 18 "In practice" lines and 7 example traces (U1–U3, ML) | none adds a sourced or empirical claim. All 7 traces carry "*Illustrative example (not student work)*" on neutral invented briefs. U2 trace gives one team's numbers with no class finding. Local-model drafts (`evidence/EX9/qwen-call-1.response.txt`) were edited; the discarded qwen claim and the Thessia lines do not appear in the lessons. See F4 |
| Structure | own script (gate method) | each lesson's `##` order: Learning objectives · Analysis · Masterclass · Lab (Portfolio) · Workshop · Conclusion · Tao · References · Editorial note · AI. Ideas: U1 177/207/114/182/132/133, U2 207/151/207/206/167/164, U3 147/144/117/107/149/133 words. Every idea runs bold claim → cited evidence → In practice → Try it, in that order |
| Try-it links resolve | built HTML: every `href="#…"` vs every `id` | 0 missing anchors in U1–U3 (`lab-exercise-1/2`, `lab-debate`, `tao-of-creativity`). The step numbers named in Try-it lines match the cards (U3 Ex1 steps 2 and 3; U3 Ex2 steps 2, 4–7 and 6; U1 Ex2 step 6; U2 Ex1 step 6) |
| U1 ideas 4–6 → closest step | read | **acceptable.** Idea 4 → Ex2 (the real-brief text), idea 5 → Ex2 step 6 (the language/medium/support call), idea 6 → Lab debate. These are honest pointers with no new EX8 steps (EX8 sign-off stands) |
| A12 F1–F9 | lesson + deck diffs | F1 step 7 + deck note "before you pick" ✓ · F2 "dot stickers marking the interesting parts … voting is a separate, later step" (lesson + deck) ✓ · F3 facilitation note (lesson + deck) ✓ · F4 U1 shared board / table groups 5–6; U2 8–10 min, total 25 (lesson + deck) ✓ (see F5) · F5 "adapted prototyping question (source pending)" (lesson Source, Editorial note, deck) ✓ · F6 Ask "Was your rarest use also your best one?" ✓ · F7 `image_brief` "Course diagram: selection grid (no image)…" ✓ · F8 renderer + validator + test; *Fountain* kept on lab-1 as "Rights under review", decision logged ✓ (see F1, F2) · F9 `technique_id` / `technique_ids_also` / `practises` documented in STUDENT-SLIDESHOW-FORGE; gate Opt-out check includes `technique_ids_also` ✓ |
| A3 / A5 / A10 | read + built HTML | Workshop first lines: U1 "No Workshop in sessions 1–3", U2/U3 "From session 4: …", consistent with STUDENT-SLIDESHOW-FORGE and the U2 deck outro (see F9 for the index page) ✓ · "70% of D1 · 20% of D1 · 10% of D1" (U1, U2) ✓ · all 14 deck Tao `citation.href` resolve to a built page holding `id="tao-of-creativity"`, and U3 cover moved from `#references` ✓ · Tao lists match deck quotes ✓ · student text has no "page locator", "page-backed", "Chicago", "procurement", "this library", "BIBLIO" or vault terms ✓ · breadcrumb renders `Home / Lessons / <page>` (one Lessons crumb) ✓ · hreflang emits only `en` and `x-default` on U1–U3 (no Spanish pages exist; the self-referencing `es` is suppressed by `es_rel != page.url`) ✓ · Dow note "larger gain in their confidence at this kind of task" and Csikszentmihalyi "most workshops try to improve" with claim-by-claim Source lines ✓ |
| Lesson figures | `lesson_figures.json` × lesson `<img>` | 22 figures (U1 6, U2 5, U3 7, ML 4), **all `rights_status: ok`**. Every caption has title · author · linked licence · linked Source. Every file exists under `docs/assets/images/deck-media/` and returns HTTP 200 from the built site. Alt text is 121–197 characters and matches the deck `alt_text`. No `lesson-figure__missing` in built HTML. All 8 flagged slides stay deck-only |
| 12-lesson template | read LESSON-TEMPLATE.md + templates/lesson-template.md | coherent and copy-ready. Two lessons per official unit (`u-N-1`, `u-N-2`), `contenidos:` copied unchanged (no new CONTENIDOS), PROVENANCE/`#ref-` sum check on split, old page kept as a hub. Open items stated honestly. Split rule mostly deterministic (gaps: F7) |
| Readability (Chrome) | headless Chrome 1280 px screenshots of built U1, U2, U3 (scratchpad `cold9/`) | the Masterclass reads cleanly: bold claim, quote block, citation links, In-practice and Try-it lines, figure captions legible; example-trace box renders as a bordered list. Some lazy-loaded figures were still blank at capture. Their files return 200 and their `src` is correct, so this is a capture artifact, not a site defect |
| Scope / firewall | diff stat + grep | no U4–U6 or `in-practice/runtime` files touched; `lesson_figures.json` has no internal terms; publication safety passed |

## Notes

- No finding invalidates a downstream phase's assumptions. Suggested places for the P2 fixes: F1 → EX11 gate; F6 and F7 → the next cascade's forge amendment; F9 → EX11; F2–F5 → any later content touch. No PHASE-EX10/EX11 file needs amending in this commit.
- The FINAL-REVIEW P0 items stand: the professor must approve the 7 example traces and the design examples, and the IP review of *Fountain*, *Kodo Sawaki* and the Gilbreth charts is still pending.
- The implementer could not run `npm run build` (classifier outage); the orchestrator ran it at `a20b1f7`. I re-ran it at the tip, twice: it is green and idempotent.
- I did not verify LOCAL-EXECUTION compliance (no in-practice PID during the model calls) after the fact. Only the report states it. The evidence files are consistent with the report.
- Reviewer side effects: rebuilt `_site` (ignored) and scratchpad files only. `git status` is clean; nothing else was edited or committed.
