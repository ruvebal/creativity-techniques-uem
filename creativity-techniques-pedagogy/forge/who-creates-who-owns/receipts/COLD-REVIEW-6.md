# COLD-REVIEW-6 — Who Creates, Who Owns, Who Scales? (cycle 3 · illustration, re-review)

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales` (uncommitted working tree)  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Prior receipts:** `COLD-REVIEW-1.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-2.md` (PASS) · `COLD-REVIEW-3.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-4.md` (PASS, text) · `COLD-REVIEW-5.md` (FAIL, 3 × P1)  
**Verdict:** **FAIL** (0 × P1 · 1 × P2)

All three CR5 P1s and all six CR5 P2s are closed on the student surfaces. I viewed every image again: the 1902 reissue date, the Harrison alt text, the HABS delineator credit and flag, the dismantling wording, the stages wording, the museum installation, the residents prompt, and the bathroom alt now all match the sheets, the photographs, and the live Commons, NPS, and Google Patents text. The gates match the known baseline. The firewall is clean, and no new citation has been added.

The cycle still fails on one machine-level rights fact the F3 fix left behind:

- **G1 (P2):** both HABS records are `rights_status: flagged` with the reason "US federal-work status does not clear the EU term — same basis as the Wolcott FSA photographs", but they still carry `eu_term_ok: true`. As a result `rightsVerdict` **passes** them, while it **fails** the Wolcott FSA records. The binding caution "HABS and FSA federal works treated on the same rights basis" therefore holds in prose and on the captions, but not in the rights gate.

The other findings (G2–G8) are P3 nits, mostly CR5 P3s that are only partly closed.

---

## CR5 findings — closure

| CR5 | Sev | Status | Evidence |
| --- | --- | --- | --- |
| F1 lab-1 dated 1897, sheet is 1902 reissue | P1 | **Closed** | The image header reads "No. 12,037 … Reissued Sept. 30, 1902 … 3 Sheets—Sheet 1". The deck title (edison l.173) reads "Kinetoscope, US reissue patent No. 12,037, drawing sheet 1 (30 September 1902)". Registry `date` is `1902-09-30`, and `eu_term_reason` says "published 1902". Brief l.81 reads "**reissue** No. 12,037 … do not date it 1897". The alt says "two side-by-side film reels, a lens tube on top, and a geared drive below … for the inventor, by his attorneys" (the sheet is signed "By Dyer, Edmonds & Dyer Att'ys"). `visual-resources.json` E05 is corrected. |
| F2 lab-2 alt invents women/benches/lamps | P1 | **Closed** | Alt (deck l.193 = lesson l.247): "mostly young men and boys seated among barrels, baskets, and paper wrapping, with one older man standing at the back". This matches the photograph. Brief: "the task unrecorded". The Commons date "circa 1890" matches the title. |
| F3 HABS cleared on rejected basis; delineator omitted | P1 | **Closed for status and credit; residual G1** | Both records are `flagged`. Author and credit read "Alexander Titenkov, US/ICOMOS (delineator), Historic American Buildings Survey, National Park Service". The title block on both sheets reads "DELINEATED BY: ALEXANDER TITENKOV, US/ICOMOS, GEORGIA". Fuller brief and execute l.88 say "8 flagged". The LOC date is dispositioned as "undated (HABS recording at the Henry Ford Museum)" because LOC returns 403, which is honest. **However, `eu_term_ok` is still `true`; see G1.** |
| F4 "restoration" | P2 | **Closed** | Title, alt, brief, lesson l.191, and the professor brief all say removing / dismantling. Commons: "removing a lower perimeter wall section … demonstrating a B. Fuller principle". |
| F5 MC6 "alternatives" | P2 | **Closed on the student surfaces** | Deck brief l.320 and lesson l.217 now say "a sequence of stages". The professor brief l.80 wording still has a residual; see G6. |
| F6 museum installation | P2 | **Closed** | The titles read "Henry Ford Museum, Dearborn". The MC2 alt says "drawn over the existing museum structure", which matches the sheet label "Existing Museum Structure". Brief and lesson l.143 say "museum floor". |
| F7 residents invented | P2 | **Closed** | Lesson l.159: "who would live in it?". Deck brief: "future residents". Professor brief: "no residents are named in the record". |
| F8 "one-piece" bathroom | P2 | **Closed** | Alt: "assembled from factory-made sections". Commons: "four quarter-parts, each portable by two people". |
| F9 test never covers the series | P2 | **Closed** | `lesson-figures.test.mjs` l.86–87 adds both lessons, and tests 52 and 53 pass. A mutation check (prefix one alt with "X" in memory) yields 1 problem per lesson, so the test now fails on drift. Each lesson has 10 figures for 10 deck slots, with none missing and no duplicates. |
| F10 Google Patents flag omits reproduction ground | P3 | **Closed** | The `flag_reason` for US3063521A, US2101057A, and US2682235A ends "Reproduction permission for the Google Patents scan not verified." (The bathroom sheet is a Commons file, so that ground does not apply to it.) |
| F11 signature wording | P3 | **Mostly closed; residual G4** | The cover, analysis-model, MC3, MC6, and lab-1 alts now say "for the inventor, by his attorney(s)". The lesson l.217 prompt still presupposes that the inventor signed. |
| F12 alt precision | P3 | **Mostly closed; residual G2** | Edison analysis-model now says "two views". MC2 says "pencil sketches" (the drawings are graphite, the signatures ink), and its caption Source now links the NPS page. MC3 says "lettered blocks". The Fuller cover says "two cross-sections". Fuller MC3 says "one man … while another enters". Fuller MC1 says "A replica". The **Fuller analysis-model "perspective and plan" is unchanged.** |
| F13 Wichita House never identified | P3 | **Partly closed; G5** | Lesson l.159 now says the 1992 photograph shows the Wichita House. The HABS sheets (the same house, as installed at the museum) are still not identified as it. |
| F14 MPPC licensees ≠ pool | P3 | **Closed** | Brief: "the licensees of a patent pool gathered around one table". Professor brief: "licensees, not the pool itself". |
| F15 E06 binding overstates provenance | P3 | **Closed** | E06 note: "MC1, MC4, MC5 and lab-2 photographs come from other Commons/NPS records". |
| F16 "laboratory work" in Watch line | P3 | **Closed** | Lesson l.203 now asks only "who appears on screen besides Edison, and how a company film builds the inventor's public image". |

---

## Binding cautions (fresh pass)

| Caution | Status | Evidence |
| --- | --- | --- |
| Phonograph = US 227,679, 18 May 1880 | **OK** | Sheet header: "No. 227,679 … Patented May 18, 1880 · 2 Sheets—Sheet 2". Title, alt, brief, and lesson l.118 all match. |
| NPS 1877 sketch ≠ proof of copying Scott | **OK** | `rg -i "scott\|phonautograph"` returns 0 on all four built pages. The NPS page reads: "Two possible designs for the first phonograph … The bottom design was assigned to mechanic John Kruesi to build." The alt reproduces this, attributed to NPS. The Scott caution lives only in the professor brief. |
| Wolcott 1941 = adapted corn bin, not the Wichita House | **OK** | Commons: "metal, adapted corn bin, built by Butler Brothers, Kansas City … 1941 May". The titles say "(adapted corn bin)", and lesson l.159 says "not the later Wichita House". |
| Car = 2024 replica, CC BY-SA 4.0, TaurusEmerald | **OK** | Commons: `2024-07-27`, CC BY-SA 4.0, TaurusEmerald, "A replica of a 1933 Dymaxion". The title, alt, and lesson l.87 all say replica. |
| Google Patents drawings flagged (reproduction unverified) | **OK** | All three are `flagged`, with `eu_term_ok: false` and the reproduction ground stated. The built pages show "Rights under review". |
| HABS and FSA on the same rights basis | **FAIL (machine layer)** | Prose, `rights_status`, and captions all hold. `eu_term_ok` and the gate verdict diverge; see G1. |
| Fuller is a comparison, not a moral opposite · integrity ≠ tensegrity | **OK** | Deck cover sentence, lesson opener, analysis-model prompt, and vocabulary table. |
| Edison cases are investigations, not thefts · MPPC = market organisation | **OK** | Lesson l.136 and l.187, deck MC1 and MC5, professor-brief safeguards. |
| No new Chicago · no un-vaulted monograph as a student citation | **OK** | Lesson front matter is unchanged (`csikszentmihalyi-1996, norman-2013, robb-2024` and the first two respectively). No caption, alt, or brief adds a citation. Schumpeter, Simon, and Fuller appear only in the gated comment, the Editorial note, and briefs marked "discovery only". |
| Student HTML firewall | **OK** | Denylist = 0 on all four pages and both built deck JSON files (see below). |

---

## Surfaces reviewed

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `docs/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json` | Full |
| 2 | `excellence/curation/autopilot-assets.json` (20 ML-WCOS records) | Full. Compared programmatically with the deck assets: title, alt, author, licence, rights fields, URLs, and brief are identical for 20/20 |
| 3 | `docs/lessons/en/master-lectures/who-creates-{edison,fuller}/index.md` | Full |
| 4 | `session-prompts/who-creates-{edison,fuller}.md` | Full |
| 5 | `WHO-CREATES-WHO-OWNS.execute.md` cycle-3 receipt | l.86–93 |
| 6 | `grounding/who-creates-who-owns/visual-resources.json` (17 `deck_binding`) | Full |
| 7 | All 20 `docs/assets/images/deck-media/*.webp` | Each one viewed and compared with its title, alt, and brief |
| 8 | Live sources | Commons API `extmetadata` for 13 files; NPS phonograph page; Google Patents US2101057A (assignee: DYMAXION Corp, which confirms brief l.62) |
| 9 | `scripts/tests/lesson-figures.test.mjs` + `scripts/lib/media-rules.mjs` `rightsVerdict` + `scripts/validate-decks.mjs` | The diff, the verdict logic, and the rights-report path |
| 10 | Rebuilt `_site/` lessons, decks, and deck JSON | Full |

---

## Runnable gates (evidence)

```text
$ npm run render:decks && npm run build
render-decks: 9 deck(s), 0 written.            # includes + lesson_figures.json already in sync
validate-decks: 10 deck file(s), 0 error(s), 14 warning(s) [strict; rights=flag]
Publication safety failed (1 finding(s)):
_site/assets/diagrams/d2-transposition-workflow.visual-check.json: local filesystem path   # known, out of scope

$ npm run validate:decks        → 0 error(s), 14 warning(s); VAL_EXIT=0
                                  who-creates warnings = 6 (US3063521A, 8c14945v, US2101057A, US2682235A, 8c14943v, Pat2220482)
                                  → neither HABS record warns (G1)
$ npm run verify:publication    → 1 finding (d2-transposition-workflow.visual-check.json); PUB_EXIT=1, known
$ node --test scripts/tests/    → tests 85 · pass 83 · fail 2
                                  not ok 2  u-2 … every claim is attested on its cited page     # known
                                  not ok 60 bank: ≥ 20 per unit …                               # known
                                  ok 47 lesson_figures.json is in sync · ok 52 who-creates-edison · ok 53 who-creates-fuller
$ git checkout -- docs/_data/exercises.yml   # restored after build and after tests; `git status` clean for that file

$ rights-report.json (ML-WCOS-F)
cover          flagged  eu_term_ok=true   verdict=pass   ← HABS
analysis-model flagged  eu_term_ok=false  verdict=fail
masterclass-2  flagged  eu_term_ok=true   verdict=pass   ← HABS
masterclass-3  flagged  eu_term_ok=false  verdict=fail   ← FSA
lab-1          flagged  eu_term_ok=false  verdict=fail   ← FSA
(+ MC4, MC5, lab-2 flagged/fail; MC1, MC6 ok/pass)

$ built HTML
lessons/…/who-creates-edison  figs=10  "Rights under review"=0  denylist=0  scott=0
lessons/…/who-creates-fuller  figs=10  "Rights under review"=8  denylist=0  scott=0
master-lectures/who-creates-edison  denylist=0  · iframe/video=0 · structural roles (analysis_opener, lab_opener, outro)=3
master-lectures/who-creates-fuller  "Rights under review"=8  denylist=0  · structural roles=3
tracks/…/who-creates-{edison,fuller}/data/content.json  denylist=0
Edison Watch link: <a href="https://www.loc.gov/item/00694187/" target="_blank" rel="noopener">
```

Denylist used: `Ahmes|Athanor|DevIAC|vault|evaluator.safe|forge|lesson-scribe|BIBLIO-GAP|autopilot|curriculum-internal|/Users/|~/src|file://|\bcoat\b|PROVENANCE`.

---

## Findings

### G1 — P2 — blocks PASS — HABS records assert `eu_term_ok: true` against their own flag reason, so the gate passes HABS and fails FSA

**Evidence:**

- `who-creates-fuller/data/content.json` l.29 (cover) and l.86 (MC2): `"eu_term_ok": true`, next to `eu_term_reason` "… US federal-work status does not clear the EU term — same basis as the Wolcott FSA photographs. Publishing needs a professor exception."
- Registry `autopilot-assets.json` l.2726 (Structure) and l.2815 (Foundation) carry the same value.
- The Wolcott FSA records (deck l.105, l.181) carry `eu_term_ok: false`.
- `media-rules.mjs` l.108–119: with `author_death_year` null, `eu_term_ok === true`, and a non-empty reason, `rightsVerdict` returns ok. `rights-report.json` therefore records both HABS as `verdict: pass`, while both FSA are `fail`.
- `validate:decks` warns on the FSA records and is silent on the HABS records.

The field states that the EU term has been verified as expired. The record's own reason says it has not. Under `--rights=block`, or any later step that clears assets whose `rightsVerdict` passes, the HABS sheets would publish without the professor exception, and the FSA photographs would not. This is the CR5 F3 asymmetry again, one layer down. The binding caution requires the same basis.

**Fix:**

- Set `"eu_term_ok": false` on both HABS records in the registry (l.2726, l.2815) and in the Fuller deck (l.29, l.86).
- Run `npm run render:decks && npm run validate:decks`. Expect 16 warnings, 8 of them who-creates, with both HABS records reporting "EU term not verified".
- Amend execute l.91 ("new warnings = flagged Fuller assets whose death year fails the EU term") to cover the two HABS warnings, which fail on "EU term not verified" rather than on a death year.
- No student surface changes: the captions already read "Rights under review".

### G2 — P3 — Fuller analysis-model alt still says "plan" (CR5 F12 carry-over)

**Evidence:** deck l.41 = lesson l.107 read "shown in perspective and plan". The sheet shows Fig. 1, a three-strut perspective, then Figs. 4–5 (single-strut elevations) and Fig. 6 (an end-cap detail). No plan view appears. A related, smaller point: the Fuller MC4 alt "side and top views" describes a Fig. 1 that is a three-quarter perspective, not a pure side view.

**Fix:** "… shown in perspective (fig. 1) with strut and joint details (figs. 4–6)". Optionally, MC4: "in perspective and top views".

### G3 — P3 — Edison MC6 alt: "five glass lamp-bulb forms"

**Evidence:** deck l.155 = lesson l.213 = registry l.2625. On the sheet, Fig. 3 is the inner filament-and-stem piece, not a bulb. Figs. 1–2 are the open blown bulb, Fig. 4 is the assembly inside the bulb, and Fig. 5 is the sealed lamp.

**Fix:** "Patent drawing of five figures of glass lamp parts at successive stages of manufacture, from an open blown bulb to a sealed lamp, signed by two witnesses and, for the inventor, by his attorneys."

### G4 — P3 — lesson prompt presupposes the inventor signed (CR5 F11 residual)

**Evidence:** Edison lesson l.217 reads "Who signs the sheet besides the inventor, and who signs for him?" The sheet's inventor line is "T. A. Edison per Dyer & Wilber his Att'ys". The witnesses sign under "Attest". The inventor's own hand is not on the sheet.

**Fix:** "Who signs the sheet as witness, and who signs in the inventor's name?"

### G5 — P3 — HABS sheets still not identified as the Wichita House (CR5 F13 partial)

**Evidence:** Fuller lesson l.159 names only "the 1992 photograph" as the Wichita House. The cover and MC2 measured drawings record the same house as installed at the Henry Ford Museum, but their captions say only "Dymaxion House".

**Fix:** "… not the later Wichita House, which appears in the measured drawings above (as installed at the Henry Ford Museum) and in the 1992 photograph further down."

### G6 — P3 — professor brief ties Norman 226 to the drawing in an inverted way

**Evidence:** `session-prompts/who-creates-edison.md` l.80 says: "link to Norman 226 only as process, not as options". Norman 226 is literally about options ("Generate numerous ideas …"), and this drawing shows stages, not options. CR5 F5 asked for the pin to be detached from the drawing.

**Fix:** "Norman 226 applies to the students' ownership options in the Lab, not to this drawing."

### G7 — P3 — Fuller lab-1 alt names the wrong appliances

**Evidence:** deck l.174 = lesson l.205 = registry l.2950: "a curved wall, curtained windows, a refrigerator, kitchen cabinets, and a narrow bed". In the photograph, the walls are flat panels under curved roof ribs. The unit with a black burner top and three knobs is a stove or range. The "refrigerator" has icebox-style latches, and the bed is a folding cot.

**Fix:** "Interior of a round metal dwelling under a ribbed curved roof: curtained porthole windows, an icebox-style cabinet, a stove, open shelving, and a folding cot."

### G8 — P3 — execute receipt warning description will be stale after G1

**Evidence:** execute l.91 attributes all new warnings to a failing death year. That is true today (6), but it becomes false once G1 lands, because HABS fails on "EU term not verified".

**Fix:** amend l.91 in the same pass as G1.

---

**Downstream:** no phase file is invalidated. G1 touches the registry, the Fuller deck, and execute l.91 (G8). It does not touch the lessons or `lesson_figures.json`: `eu_term_ok` is not part of a figure entry, so the lesson-figure test stays green, which I confirmed by reading `lessonFigures` usage in the test. G2, G3, and G7 change alts, so `npm run render:decks` must be followed by syncing lesson l.107, l.213, and l.205. The extended `lesson-figures.test.mjs` will catch any missed sync.

**Note on side effects:** the permitted `validate:decks` run rewrote `excellence/curation/rights-report.json`. That file was already modified in the working tree before this review, and the regenerated content reflects the decks as they stand. `docs/_data/exercises.yml` was restored. The reviewer edited no file other than this receipt.

---

## Verdict line

**FAIL** (1 × P2). The three CR5 P1s and six CR5 P2s are closed, the gates are at baseline, the firewall is clean, there are no new citations, and every caution holds on the student surfaces. The remaining blocker, **G1**, is that both HABS records still claim `eu_term_ok: true`, so the rights gate passes HABS while failing the FSA photographs that the record itself names as the same basis. It is a four-value fix (two registry records, two deck assets). After it lands, expect `validate:decks` to report 16 warnings, 8 of them who-creates. G2–G8 are P3 and can land in the same pass.

---

## Re-review (2026-10-25, after amends)

The verdict below rests on gates I ran myself, not on the implementer's report. I re-inspected the four images whose alts changed: `c283a64ac969c3bf`, `65b88f5bba576ca8`, `b827d6700518df1d`, and `291e990db314094b`.

### Closure

| Finding | Status | Evidence |
| --- | --- | --- |
| G1 (P2) HABS `eu_term_ok` | **Closed** | Registry and Fuller deck: cover and MC2 now have `eu_term_ok: false`. `validate:decks` reports "0 error(s), 16 warning(s)". The 8 who-creates warnings include `ML-WCOS-F.cover` and `ML-WCOS-F.masterclass-2` with "EU term not verified". `rights-report.json` shows both HABS records and both FSA records as `flagged · eu_term_ok=false · verdict=fail`. HABS and FSA now get the same gate outcome, and the summary reads `flagged: 16`. |
| G2 (P3) tensegrity "plan"; MC4 views | **Closed** | New alt: "three rigid struts that do not touch, held in a triangle by continuous tension cables, with detail views of a strut and its cable fittings". The sheet shows the three-strut Fig. 1 and the strut and fitting details in Figs. 4–6. "Do not touch" cannot be proven by eye, because two struts cross in projection without a drawn joint, but it is consistent with the patent's subject and the existing deck brief. MC4 alt now says "in two views" (Fig. 1 and Fig. 2), which is accurate. |
| G3 (P3) MC6 "bulb forms" | **Closed** | New alt: "five figures showing glass lamp parts at successive stages … from bulb blanks to an assembled bulb with its filament-and-stem piece". This matches the sheet: Figs. 1–2 are blanks, Fig. 3 is the stem piece, and Figs. 4–5 are the assembly and the sealed lamp. The signing clause "for the inventor, by his attorneys" matches "T. A. Edison per Dyer & Wilber his Att'ys". |
| G4 (P3) signature prompt | **Closed** | Edison lesson l.217: "Who signs as witness, and who signs in the inventor's name?" |
| G5 (P3) HABS = Wichita House | **Dispositioned, accepted** | Not done, because the implementer has no source in hand; this is recorded in execute l.94. The captions keep "as installed at the Henry Ford Museum", which is what the sheets' title block states. Omitting an unsourced identification is the conservative choice. No error is introduced, and the gap is only a missed teaching link. |
| G6 (P3) Norman 226 brief | **Closed** | Edison brief l.80: "Norman 226 (generate options before fixing) applies to the students' own Lab work, not to this drawing". |
| G7 (P3) Wolcott interior | **Closed** | New alt: "an icebox-style cabinet, a stove, shelving on flat wall panels, curtained porthole windows, and a folding cot". The photograph matches item by item. |
| G8 (P3) execute warning description | **Closed** | Execute l.91: "new warnings = the 8 flagged Fuller assets: 6 fail on a recorded death year, 2 HABS sheets on `eu_term_ok: false`". |

**Sync:** I compared registry, deck assets, deck briefs, `lesson_figures.json`, and the lesson `alt=` attributes for all 20 records programmatically, and found 0 differences. `render:decks` wrote 0 files, so everything was already in sync.

### Gates (rerun by reviewer)

```text
$ npm run render:decks              → render-decks: 9 deck(s), 0 written.
$ npm run build                     → validate-decks: 10 deck file(s), 0 error(s), 16 warning(s) [strict; rights=flag]
                                      Publication safety failed (1 finding(s)): …/d2-transposition-workflow.visual-check.json   # known
$ node --test scripts/tests/        → tests 85 · pass 83 · fail 2 (not ok 2 u-2 claims · not ok 60 bank)   # known
                                      ok 52 who-creates-edison · ok 53 who-creates-fuller
$ git checkout -- docs/_data/exercises.yml   → restored; `git status` clean for that file
$ denylist on 4 built pages + 2 built deck JSONs → 0 each; "Rights under review" = 8 on each Fuller page, 0 on Edison; scott/phonautograph = 0
```

The binding cautions from the fresh pass above all still hold, including the HABS/FSA "same basis" rule, which now also holds at the gate.

### Remaining findings

- **H1 — P3 — stale test count in the execute receipt.** Execute l.91 still reads "`node --test scripts/tests/` 81/83". With the two who-creates figure tests added, the suite is 85 tests, 83 pass. **Fix:** change it to "83/85". This does not block.

### Final verdict

**PASS.** There are 0 × P1 and 0 × P2. G1 is closed, and the gate now treats HABS and FSA alike. G2–G4 and G6–G8 are closed. G5 is dispositioned with a recorded reason. One P3 nit remains (H1). The launch decision on the 8 flagged Fuller images remains the professor's, as recorded in `session-prompts/who-creates-fuller.md`. The reviewer edited only this receipt. The permitted gate runs regenerated `rights-report.json` and restored `docs/_data/exercises.yml`.
