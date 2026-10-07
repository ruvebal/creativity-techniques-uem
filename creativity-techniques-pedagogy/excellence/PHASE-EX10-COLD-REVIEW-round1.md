# PHASE-EX10 Cold Review

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, did not implement EX10) |
| **reviewed_at** | 2026-10-06, worktree `creativity-techniques-uem-integration-excellence-10`, tip `5b647c4` (verify-log commit `ab46f4e` is an ancestor; `git diff --stat ab46f4e HEAD` = only `PHASE-EX10-VERIFY-LOG.md`) |
| **implementer_claim** | VERIFYING: 68-item bank (41% higher order), 3 practice pages × 5, one retrieval slide per U1–U3 deck, 40 method cards, peer rating sheet, protocol + ES/EN consent drafts, A13 fixes; gates EX0–EX10 green, tests 77/77, build idempotent |
| **verdict** | FAIL |

Five blocking findings: a wrong answer key on the U2 retrieval slide (F1); Bloom labels that reach the 30% higher-order line only on paper (F2); a privacy promise in the consent forms that the protocol does not keep (F3); method-card "When to use" lines that contradict their own cited source (F4); and the peer rating sheet telling students to skip the only items it is used for (F5). The gates, the tests and the build are green. Every bank answer key I checked is right.

## Questions checked

I checked all 68 bank items against the unit lesson text and the PROVENANCE_LINE. For Kimbell 2011, 285, Cross 2006 (vi, 37, 81–82), Dow 2010 18:1, Chen 2011, 26 and de Bono 1970 (introduction) I also re-read the source page from `~/ahmes-library` (pdftotext / EPUB). Key: ✔ = answer correct and derivable from the lesson; **P** = public quiz item; **R** = retrieval-slide item. "Bloom" means the label is inflated (see F2).

| id | correct? | issue |
| --- | --- | --- |
| U1-01 R | ✔ | — |
| U1-02 | ✔ | — |
| U1-03 | ✔ | — |
| U1-04 P | ✔ | RA12 is loose (F11) |
| U1-05 R | ✔ | — |
| U1-06 | ✔ | — |
| U1-07 P | ✔ | Bloom: same as the lesson's idea 1 "In practice" line, with "(open)"/"(close)" already given (F2) |
| U1-08 | ✔ | — |
| U1-09 R | ✔ | — |
| U1-10 P | ✔ | — |
| U1-11 | ✔ | — (genuine apply) |
| U1-12 | ✔ | — (genuine analyse) |
| U1-13 R | ✔ | — |
| U1-14 P | ✔ | — |
| U1-15 R | ✔ | — |
| U1-16 | ✔ | Bloom: the lesson's idea 4 example (F2) |
| U1-17 P | ✔ | answer is the longest option (F7) |
| U1-18 | ✔ | — |
| U1-19 | ✔ | — |
| U1-20 | ✔ | Bloom "analyse": restates the idea 5 "In practice" sentence (F2) |
| U1-21 | ✔ | Kimbell 2011, 285 abstract re-read: "dualism between thinking and knowing, and acting" + "ignores the diversity of designers'…" |
| U1-22 | ✔ | Bloom "evaluate": the idea 6 "In practice" line (F2) |
| U2-01 R | ✔ | — |
| U2-02 R | ✔ | — |
| U2-03 | ✔ | — |
| U2-04 P | ✔ | answer is the longest option (F7) |
| U2-05 | ✔ | Bloom "evaluate", but it is recall of a fact (35-minute sessions) (F2) |
| U2-06 | ✔ | distractor "Logical" fits de Bono's general account of vertical thinking; "Lateral" is a non-option (F10) |
| U2-07 P | ✔ | Bloom: the idea 2 "In practice" line, word for word (F2) |
| U2-08 P | ✔ | Cross 81–82 re-read: Jansson and Smith summary matches |
| U2-09 | ✔ | — |
| U2-10 R | ✔ | — |
| U2-11 R | ✔ | **retrieval-slide answer in the notes is the black-hat answer** (F1) |
| U2-12 | ✔ | Bloom: the idea 3 "In practice" line (F2) |
| U2-13 | ✔ | — |
| U2-14 R | ✔ | **retrieval-slide answer in the notes is the Norman answer** (F1) |
| U2-15 | ✔ | Bloom: borderline, extends the idea 4 app-screen example |
| U2-16 P | ✔ | — |
| U2-17 | ✔ | — (genuine analyse) |
| U2-18 | ✔ | — |
| U2-19 | ✔ | — |
| U2-20 | ✔ | Bloom: the idea 5 chair/café line; `ref: rubin-2023` does not support "write the criterion first" (F11) |
| U2-21 P | ✔ | Bloom: the idea 6 "forty sticky notes" line (F2) |
| U2-22 | ✔ | — |
| U2-23 | ✔ | — |
| U2-24 | ✔ | Bloom "evaluate": restates one Conclusion sentence (F2) |
| U3-01 R | ✔ | near-duplicate of U3-22 (F10) |
| U3-02 | ✔ | Bloom: the idea 1 packaging/card-model line (F2) |
| U3-03 | ✔ | Cross 2006 p. vi re-read: "resolving ill-defined problems, adopting solution-focused cognitive strategies" |
| U3-04 | ✔ | Bloom: the idea 2 logo line (F2) |
| U3-05 | ✔ | — |
| U3-06 R | ✔ | Dow 18:1 abstract re-read, matches |
| U3-07 | ✔ | Bloom: the idea 3 corridor-sign line, word for word (F2) |
| U3-08 P | ✔ | Dow abstract matches; its answer gives away U3-09 on the same public page (F10) |
| U3-09 P | ✔ | redundant with U3-08 (F10) |
| U3-10 R | ✔ | Cross p. 37 "to proceed together" re-read |
| U3-11 | ✔ | Bloom: the idea 4 list/grid/map line (F2) |
| U3-12 R | ✔ | — |
| U3-13 P | ✔ | Bloom: the idea 5 festival line, word for word (F2) |
| U3-14 | ✔ | — |
| U3-15 R | ✔ | — |
| U3-16 | ✔ | Bloom: the idea 6 chair-model line, word for word (F2) |
| U3-17 P | ✔ | — |
| U3-18 | ✔ | RA12 is loose (F11) |
| U3-19 P | ✔ | — |
| U3-20 | ✔ | — |
| U3-21 | ✔ | — |
| U3-22 | ✔ | — |

**Public quiz (15 items, built `_site/practice/en/u-*/index.html`):** U1-04, 07, 10, 14, 17; U2-04, 07, 08, 16, 21; U3-08, 09, 13, 17, 19. All answer keys are correct, and every printed mcq letter (D, A, B / D, A, B / D, A) matches the correct option. Only these 5 per unit are published: I grepped `_site` for the first 45 characters of each of the 53 non-public stems. The only hits are U1-01, whose stem is lesson prose, and U2-10, which is on the retrieval slide.

**Retrieval slides (15 items, `content.json` + rendered `docs/_includes/decks/*.html`):** in U1 and U3, all five questions match their notes answers. In U2, questions 1–3 match, but **questions 4 and 5 have each other's answers** (F1).

## Findings

### F1 — U2 retrieval slide: the answers for questions 4 and 5 are swapped · P1 · **blocks DONE**

Evidence (`docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json`, slide `retrieval`; rendered the same way in `docs/_includes/decks/u-2-idea-generation-selection.html:105ff`):

```
questions[3] "What does Norman warn about one or two early ideas?"
questions[4] "In Six Thinking Hats, what does the black hat cover?"
notes: "- 4. The negative aspects: why it cannot be done (de Bono 1985, 32).
        - 5. Becoming fixated on one or two ideas too early; generate numerous ideas (Norman 2013, 226)."
```

A professor reading the answers from the speaker notes gives the wrong answer to two of the five questions. The notes are also in the public deck HTML (`<aside class="notes">`). The test meant to guard this (`scripts/tests/practice-quizzes.test.mjs`, "retrieval slides … questions = bank retrieval forms") only checks the question strings and that there are five answer lines. It would pass with any order of answers, so it proves nothing about alignment.

**Fix:** swap the two answer lines and re-render. Then add a test that ties each answer line to its bank item: for example, a `retrieval_answer` field in the bank compared line by line, or at least a check that answer *i* carries the bank item's `ref` author.

### F2 — The ≥ 30% higher-order share is met only by inflated Bloom labels · P1 · **blocks DONE** (acceptance criterion)

The bank has 28 items labelled apply / analyse / evaluate (41%). Fifteen of them restate the lesson's own **"In practice"** worked example: the same scenario, often word for word, with the answer already printed in the lesson. Examples:

- U1-07 vs U1 l.127: "(open) … (close)"
- U3-07 vs U3 l.99
- U3-13 vs U3 l.128
- U3-16 vs U3 l.143
- U2-07 vs U2 l.113

The full list is U1-07, U1-16, U1-20, U1-22, U2-07, U2-12, U2-15 (borderline), U2-20, U2-21, U3-02, U3-04, U3-07, U3-11, U3-13, U3-16. Answering these is recall of the worked example (remember / understand), not applying the idea to a new situation. Two more items labelled evaluate are plain recall: U2-05 (the study used 35-minute sessions) and U2-24 (restates one Conclusion sentence).

Items that genuinely transfer to a new situation: U1-03, U1-11, U1-12, U1-14, U2-03, U2-17, U3-09, U3-18, U3-19, U3-20, U3-21, plus U2-15 if counted. That is 11–12 of 68 = **16–18%, below the 30% in the Acceptance section**. The gate's `bloom` check only counts labels. The knowledge test carries most of the grade, so the bank's higher-order share matters.

**Fix:** rewrite the 15 example-copy items with new objects, briefs or media (for example, sign → menu, festival → museum night), or relabel them understand / remember. Then add genuine apply / analyse items until the honest share is ≥ 30%.

### F3 — The consent forms promise the lecturer will not know who took part; the protocol does not make that true · P1 · **blocks DONE**

- `consent/CONSENT-FORM-EN.md`: "If you do not take part, you do an ordinary class task during those 20 minutes. The lecturer does not know who took part until final marks are published."
- The Spanish form says the same.
- `MEASUREMENT-PROTOCOL.md` §2 and §5 run the pre-test in "Week 1, session 1, before the U1 Lab", in class, while non-participants do "an ordinary class task (for example, reading the U1 lesson Analysis section)".

Nothing removes the lecturer from the room, so the lecturer sees who is doing the AUT. A consent form must not promise a protection the procedure does not deliver. The other consent elements are present and the two languages are equivalent: voluntary, no effect on marks, withdrawal by code until a date, GDPR/Spanish-law basis, retention and DPO placeholders, third-person handling, the draft banner and the ethics precondition.

**Fix:** either (a) the third person administers both sessions with the lecturer out of the room, or (b) everyone does the AUT as an ordinary class activity, the third person keeps only the sheets whose code matches a consent form, and the rest are destroyed unread. Update §2, §5, both consent forms and the decision log to match.

### F4 — Method cards: "When to use" contradicts the card's own cited source · P1 · **blocks DONE**

`scripts/build-method-cards.mjs` `whenToUse()` builds "When to use" from `family` only (`FAMILY_USE`). Two cards on the public page `docs/methods/en/cards/index.html` come out wrong:

- **What-if (counterfactual) prompts:** "When you need many options; opening (divergent)" — Source: (Wong, Galinsky, and Kray 2009, 161, 168). The U2 lesson cites Wong 2009, 168 for the opposite: "it helped people link given ideas and hurt the generation of new ones". Bank items U2-16 and U2-17 teach exactly that, so a student who studies from the card gets U2-17 wrong.
- **Parallel prototyping:** "When you develop and test one chosen idea". The technique and the U3 Lab are about making several prototypes from different entry points before feedback (Dow 2010).

The other 38 cards: the "When to use" lines are generic but not contradictory. I found no copied source text in the steps: no 6-word overlap with the de Bono 1970/1985, Sprint, Norman, Chen or Cross texts. All 34 technique cards show only `source_status: verified` keys.

**Fix:** add an optional `when_to_use` field in the catalogue (or an override map in the script) for these two, worded from the lesson: what-if prompts are for combining or linking given ideas, with care; parallel prototyping is for exploring several directions before critique. Add a test that pins both.

### F5 — The peer rating sheet tells students to skip the only items it is used for · P1 · **blocks DONE**

`docs/practice/en/peer-rating-sheet/index.md` rule 7 says: "Skip your own team's items. Write 'own' in their row." Its only stated use is the U2 Lab (lesson l.282): "each person rates **the top three** [their own team's] … then compare the averages with your grid". A student who follows the sheet rates nothing.

**Fix:** either swap top threes between teams in the U2 Lab (closer to blinded consensual rating), or make rule 7 conditional ("when you rate another team's set …"). The lesson, the lab-2 notes and the sheet must agree.

### F6 — The A13 caption-honesty check does fail, but it does not cover the master lecture · P1 · does not block EX10 deliverables; **orchestrator amendment required**

Negative test (task item 8), run on a scratch copy of HEAD (`git archive HEAD`):

1. Baseline: check exits 0.
2. In the scratch copy, disabled the flagged-PD branch in `scripts/lib/deck-render.mjs` (`if (label && c.rights_status === 'flagged' && label === PUBLIC_DOMAIN)` → `if (false)`), then ran `node scripts/render-decks.mjs` and `jekyll build`.
3. Ran the check's Python block, extracted verbatim from `PHASE-EX9.exit-gate.sh`:

```
['_site/tracks/ct/u-1-introduction-creativity/index.html: 47983a023a08feec.webp',
 '_site/tracks/ct/u-2-idea-generation-selection/index.html: 7be69b460d03f86a.webp']
negative exit 1
```

So the check **can fail**. But in the same build, `_site/master-lectures/creative-process-analysis/index.html` showed "Public domain" next to the three flagged PD-old-70 ML assets (`206324d9cdf778ac`, `8a77d4b4393cc371`, `49671848d45566b1`), and the check did not report them. It only globs `_site/tracks` and `_site/lessons`, while the 2627-ml deck renders under `_site/master-lectures/`. A13 says the check covers `2627-ml`; it does not. A second weakness: a flagged caption is exempt if "rights under review" appears anywhere in the next 1500 characters, which can be a neighbouring caption.

**Fix (orchestrator):** add `_site/master-lectures` to the `pages` list in `PHASE-EX9.exit-gate.sh`, and limit the window to the caption element. Record this as an amendment (A14) in `TECHNICAL-DIRECTOR-CASCADE.md` in the same commit.

### F7 — MCQ answer-length cue · P2 · non-blocking

Command:

```
node -e '… answer.length > max(distractor lengths) …'
```

Output: `mcq 30 answer longest 26 public mcq 8 longest 7`. A student can pick the longest option and score about 87%. Several distractors are one or two words ("Be skipped.", "Lateral.", "Feelings.").

**Fix:** balance the option lengths before the professor approves the bank.

### F8 — Documentation points to a test file that does not exist · P2 · non-blocking

`question-bank.yml:23` and `STUDENT-SLIDESHOW-FORGE.mdc` (retrieval paragraph) name `retrieval-sync.test.mjs`. `find . -name 'retrieval-sync*'` returns nothing; the check is in `scripts/tests/practice-quizzes.test.mjs`.

**Fix:** correct both references.

### F9 — AUT card still says "Pool the class lists" / "Group: individual, class pooling" · P2 · non-blocking; amend EX11

A13 removed "class pool" from the U1 lesson and notes: `grep -rni "class pool" docs` finds only `docs/methods/en/cards/index.html:69`. The U1 Lab uses a shared board or table groups of 5–6. The rule is that cards are generated from the catalogue, which is generated from `in-practice/canonical/techniques.base.yml` via `build.py`. The fix therefore belongs in `techniques.base.yml` (step 4 and `group_size`, e.g. "Post lists on a shared board (or compare in table groups of 5–6) …"), followed by a rebuild of the catalogue and the cards.

**Fix:** add this to `PHASE-EX11.md`'s A13 item list.

### F10 — Item redundancy and a weak distractor · P2 · non-blocking

- On the U3 public page, Q1 (U3-08) gives the answer to Q2 (U3-09).
- U3-01 and U3-22 test the same sentence.
- U2-06's distractor "Logical" is descriptively true of de Bono's vertical thinking. The EPUB also has "Vertical thinking is analytical / sequential". It is wrong only as a quote completion.

**Fix:** swap one U3 public item for another case item, and replace the "Logical" / "Lateral" distractors.

### F11 — RA and ref fit · P2 · non-blocking

- RA12 ("understand others' attitudes and perspectives") on U1-04 (the definition of the field) and U3-18 (why parallel critique) is a stretch.
- U2-20 `ref: rubin-2023`: Rubin p. 386 supports "editing is taste", not "write the criterion first", which is uncited course wording.
- U2-07 `ref: csikszentmihalyi-1996` rests on an uncited lesson example.

The RA codes themselves are real guía codes (checked against `cv/guides/guia-tecnicas-de-creatividad-diseno-2025-26.json`: RA5, RA6, RA12, RA14, RA15).

**Fix:** retag the items, or note that the ref is "nearest cite" in the bank header.

## Acceptance re-check

| Criterion | Result | Evidence |
| --- | --- | --- |
| Exit gate passes | PASS | `bash PHASE-EX10.exit-gate.sh` → `failures: 0` (my run; matches verify log) |
| Bank: counts, fields, refs exist | PASS | U1 22 · U2 24 · U3 22; all refs in `references.yml` and in the unit lesson's front matter (`npm test`) |
| Bank: ≥ 30% higher order | **FAIL (honest)** | label count 28/68 = 41%; honest count 11–12/68 = 16–18% (F2) |
| Three practice pages, 5 `data-question` each | PASS | `_site/practice/en/u-{1,2,3}-*/index.html`, 5 `<details>` each, no form, input or script |
| One retrieval slide per U1–U3 deck | PASS (structure) / **FAIL (content)** | one each, after masterclass-6 and before lab-opener; U2 answer key wrong (F1) |
| Protocol + consent exist, not in `_site` | PASS | `grep -rliF` for "third person", "withdraw", "tercera persona", "Karwowski 2012", "Amabile 1982", "SSCS", "question-bank", "MEASUREMENT-PROTOCOL", "CONSENT-FORM" in `_site` → nothing (the only "consent" hits are pre-existing U4/lexicum pages) |
| No unverified citation presented as sourced | PASS | Amabile 1982 and Karwowski 2012 are marked "source pending" and not cited; Chen 2011, 26 is the only cite in the protocol and is verified |
| "Drafts — not for use before professor approval" | PASS | bank header, protocol banner, both consent banners, `APPROVAL.md`; nothing collects data |
| Cards page ≥ 20 | PASS | 40 `data-method-card` in the built page |
| `approved_by:` in APPROVAL.md | PASS | `approved_by: autopilot (drafts — not for use before professor approval)` |
| Cold reviewer answers 10 random bank questions from the lessons alone | PASS | all 68 checked; every answer key is derivable from the lesson and its cite |
| A13: U1 Flexibility vs Chen 2011, 26 | PASS | lesson: "consider several approaches to a problem at once"; Chen p. 26 (pdftotext): "the ability to consider a variety of approaches to a problem simultaneously" |
| A13: "class pool" removed | PASS (lesson/deck) | only the generated AUT card keeps it (F9) |
| A13: U2 wayfinding line as an example | PASS | "you might find that … ; if so, …" |
| A13: lessons index Workshop wording | PASS | "from session 4 · Advance D2–D3 (D1 gets no Workshop time)" |

## Regression and shared code

- `npm test`: 65/65 pass. `node --test creativity-techniques-pedagogy/excellence/tests/*.test.mjs` (sync and probe): 12/12 pass. Passing the directory instead (`node --test …/tests/`) reports one spurious failure because of the invocation, not because a test fails.
- Gates EX0 to EX10 run in this worktree: all exit 0, with 0 FAIL lines each. The EX10 browser check reports `deck-layout: 340 slide view(s), 0 failure(s)`. I re-ran it with `--shots`: the retrieval slides at 1280×720 and 1920×1080, and on the U2 print-PDF page at 1920, are fully inside the card, with timer and caption clear.
- `npm run prebuild && npm run build`: exit 0, "Publication safety passed". A second `npm run prebuild` leaves `git status --short` empty, so the build is idempotent. `--check` on method-cards, practice-quizzes and render-decks reports everything up to date. All touched modules import without error.
- Built site compared with a build of `excellence/integration` (`git archive` into scratch, same `node_modules`; `diff -rq`):
  - Only these differ: U1–U3 lessons and decks, the lessons index, `methods/en/index.html` (footer link only), the two CSS files and `sitemap.xml`; `methods/en/cards/` and `practice/` are new.
  - Unchanged: U4 deck, master lecture, directory, lexicum.
  - The `timerFor` change (effective layout) adds a timer only to `retrieval`.
  - `hydrate-field-site.mjs` keeps `docs/methods/en/cards/`: after a standalone hydrate run, `cards/` is still there and git is clean.

## Notes

- Blocking fixes, in order: F1 (swap U2 answers 4/5, add an alignment test); F2 (rewrite or relabel the example-copy items to an honest ≥ 30%); F3 (consent privacy promise vs in-class administration); F4 (What-if and Parallel prototyping "When to use"); F5 (peer sheet rule 7 vs U2 Lab). All are small edits on the phase branch. After them: re-verify, then a new cold review.
- F6 must be amended by the orchestrator in `PHASE-EX9.exit-gate.sh` and recorded in `TECHNICAL-DIRECTOR-CASCADE.md` (A14). F9 should be added to `PHASE-EX11.md`.
- The public quizzes and retrieval slides come from a bank the professor has not approved. That is acceptable on the phase branch (`APPROVAL.md` says so), but F1, F7 and F10 should be fixed before the professor reads the bank.
- Scratch artefacts (integration build, negative-test copy, screenshots) are in the session scratchpad only. Nothing in the worktree was edited except this file, and nothing was committed.
