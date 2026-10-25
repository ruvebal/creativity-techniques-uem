# COLD-REVIEW-5 — Who Creates, Who Owns, Who Scales? (cycle 3 · illustration)

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales` (uncommitted working tree)  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Prior receipts:** `COLD-REVIEW-1.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-2.md` (PASS) · `COLD-REVIEW-3.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-4.md` (PASS, text)  
**Verdict:** **FAIL** (3 × P1)

The build gates all pass. Every user caution holds on the student surfaces: the phonograph sheet is US 227,679 of 18 May 1880, the Scott resemblance stays out of student copy, the Wolcott photos are labelled as the corn-bin dwelling, the car is labelled a 2024 replica, the Google Patents and Fuller/Wolcott records are flagged, Fuller is framed as a comparison, integrity ≠ tensegrity, the MPPC is market organisation, and no new citations were added. The firewall is clean.

The cycle fails on image ↔ record accuracy and rights consistency, which I found by looking at the images themselves:

- **F1:** the Edison lab-1 sheet is the 1902 reissue, not the 1897 patent its caption names.
- **F2:** the Edison lab-2 alt text describes a scene that is not in the photograph.
- **F3:** the two HABS sheets are cleared "ok" on the same US-federal-work basis that the registry rejects for Wolcott, and they carry a named delineator whom the credit omits.

There are also six P2 overclaims or misreadings in briefs and prompts, plus one gate gap: the lesson-figure test never checks this series.

---

## Check-by-check (user scope 1–6)

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 1a | Phonograph = US 227,679, 18 May 1880, not the 1877 sketch | **OK** | The sheet `ffdbfe3845313435.webp` header reads "No. 227,679 … Patented May 18, 1880". The deck title, alt, and brief say "(1880, not the 1877 first machine)". Lesson l.118: "this is an 1880 phonograph patent, not the 1877 first machine." |
| 1b | NPS 29 Nov 1877 sketch ≠ proof of copying Scott | **OK** | Student surfaces: `rg -i "scott\|phonautograph"` on all four built pages returns 0. The caution lives only in professor brief l.77, and it matches the NPS page text: "Primary sources are silent on whether Edison even knew of the phonautograph in 1877." Three signatures are visible on the sheet (T A Edison · Chas Batchelor · J Kruesi), so lesson l.164 "three signatures" holds. The Kruesi assignment matches the NPS caption: "The bottom design was assigned to mechanic John Kruesi to build." |
| 1c | Wolcott 1941 = corn-bin unit, not the Wichita House | **OK** | The Commons/LOC description reads "metal, adapted corn bin, built by Butler Brothers, Kansas City". The deck titles say "(adapted corn bin)". Lesson l.159: "not the later Wichita House" (see F13) |
| 1d | Dymaxion car = 2024 replica, CC BY-SA 4.0, TaurusEmerald | **OK** | Commons `DateTimeOriginal 2024-07-27`, `CC BY-SA 4.0`, artist TaurusEmerald. The caption reads "(photographed 2024)", and lesson l.87 says "not a 1933 photograph". The alt omits "replica" (F12) |
| 1e | Google Patents US2101057A / US2682235A / US3063521A flagged | **OK** | `rights_status: flagged`, `eu_term_ok: false`. The flag reason omits the reproduction-permission ground (F10) |
| 1f | Fuller comparison, integrity ≠ tensegrity, five investigations, MPPC = market organisation | **OK** | Unchanged from CR4. MC5 brief: "Market organisation made visible" (wording nit F14) |
| 1g | Briefs / alts / prompts free of overclaims | **FAIL** | F1, F2, F4–F8, F11–F14 |
| 2a | Fuller d.1983, Wolcott d.1990 flagged | **OK** | 6 flagged records. `validate:decks` prints 6 who-creates warnings, all on these six |
| 2b | Flagged images captioned "Rights under review" | **OK** | Fuller deck HTML: 6 × "Rights under review". Fuller lesson HTML: 6. Edison: 0 (none flagged) |
| 2c | ok records consistent in licence/author/date | **FAIL** | F1 (date) and F3 (HABS author, date, and verdict basis) |
| 2d | Lesson figure src/alt = deck | **OK by manual check; gate does not cover it** | I replicated the test logic on both lessons: 10/10 figures each, src, alt, and `loading="lazy"` all match, and every deck slot appears. `lesson-figures.test.mjs` does not include these lessons (F9) |
| 2e | `npm run validate:decks` | **OK** | `10 deck file(s), 0 error(s), 14 warning(s)` (8 pre-existing U1/U2/ML-CPA + 6 Fuller flagged) |
| 3 | Publication firewall | **OK** | The denylist returns 0 on all four pages and both built deck JSONs (output below) |
| 4 | Accessibility: meaningful alt, captions, lazy | **Partial** | Structure OK: 10 figures/10 figcaptions/10 lazy per lesson, and the deck has an `sr-only` "Image: …" line plus a caption on every curated slide. Alt *accuracy* fails on F2 and F8; nits in F12 |
| 5 | No new Chicago, no un-vaulted monograph as student citation | **OK** | Built in-text links are unchanged from CR4. Edison: `csikszentmihalyi-1996` ×1, `norman-2013` ×1, `robb-2024` ×4. Fuller: the first two only. Schumpeter, Simon, and Fuller 1969/1975 appear only in the gated comment, the Editorial "Declared gap" (unchanged since CR4), and the private brief pairings marked "discovery only". No image caption makes a scholarly claim. F5 is a misuse of the existing Norman pin in a private brief, not a new citation |
| 6 | Known failures | **Out of scope** | `node --test scripts/tests/`: 81/83. The failures are `u-2 … every claim is attested` and `bank: ≥ 20 per unit` |

---

## Surfaces reviewed

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `docs/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json` | Full |
| 2 | `excellence/curation/autopilot-assets.json` (20 ML-WCOS records) | Full. Compared programmatically against deck assets: every rights field and every brief is identical |
| 3 | `docs/lessons/en/master-lectures/who-creates-{edison,fuller}/index.md` | Full |
| 4 | `session-prompts/who-creates-{edison,fuller}.md` (Images by slide) | Full |
| 5 | `WHO-CREATES-WHO-OWNS.execute.md` cycle-3 receipt | l.86–92 |
| 6 | `grounding/who-creates-who-owns/visual-resources.json` (17 `deck_binding`) | Full |
| 7 | All 20 `docs/assets/images/deck-media/*.webp` | Each one viewed and compared with its alt, title, and brief |
| 8 | Live source metadata | Commons API `extmetadata` for 16 files; NPS phonograph page; Google Patents US227679A and USRE12037E. LOC returned 403 |
| 9 | Rebuilt `_site/` lessons, decks, deck JSON | Full |

---

## Runnable gates (evidence)

```text
$ npm run render:decks && npm run build
render-decks: 9 deck(s), 0 written.            # includes already in sync
validate-decks: 10 deck file(s), 0 error(s), 14 warning(s) [strict; rights=flag]
Publication safety failed (1 finding(s)):
_site/assets/diagrams/d2-transposition-workflow.visual-check.json: local filesystem path
BUILD_EXIT=1                                   # sole finding = known, out of scope
$ git checkout -- docs/_data/exercises.yml     # restored; NB `node --test scripts/tests/` also bumps it — restored again

$ node --test scripts/tests/lesson-figures.test.mjs   → 8/8 pass (none of the 8 covers who-creates lessons, F9)
$ node --test scripts/tests/                         → tests 83 · pass 81 · fail 2 (U2 claims, U4 bank)

$ rg -i -c 'Ahmes|Athanor|DevIAC|vault|evaluator.safe|forge|lesson-scribe|BIBLIO-GAP|autopilot|curriculum-internal|/Users/|~/src|file://|coat' <file>
_site/lessons/en/master-lectures/who-creates-edison/index.html   → 0
_site/lessons/en/master-lectures/who-creates-fuller/index.html   → 0
_site/master-lectures/who-creates-edison/index.html              → 0
_site/master-lectures/who-creates-fuller/index.html              → 0
_site/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json → 0 denylisted terms
```

Deck spines (`data-slide-role`): each deck has 1 unit_cover · 1 analysis_opener · 1 analysis_model · 6 masterclass · 1 lab_opener · 2 lab_exercise · 1 outro. The structural roles (analysis_opener, lab_opener, outro) remain `geometrical`, and all 10 media slides are `curated` with a matching `media_slot_id`. The *Day with Thomas A. Edison* link renders as `target="_blank" rel="noopener"`. The deck has no `loc.gov` reference, and no `iframe` or `video` element appears anywhere, so the film is linked, not embedded.

Note: the built deck JSON publishes `image_brief` (10 per deck). The U1 deck does the same, so this is an existing convention, but it means the brief wording in F4, F5, and F14 is publicly readable.

---

## Findings

### F1 — P1 — blocks Done — Edison lab-1 sheet is the 1902 reissue, not the 1897 patent

**Evidence:** The image `c0ffbf762bae8f84.webp` has the printed header "No. 12,037. · T. A. EDISON. KINETOSCOPE. · Reissued Sept. 30, 1902. (Application filed June 10, 1902.) · 3 Sheets—Sheet 1". The Google Patents USRE12037E text reads: "Original No. 589,168, dated August 31, 1897. Application for reissue filed June 10, 1902." The material that repeats the 1897 date:

- Deck `who-creates-edison/data/content.json` l.173 title: "Drawing for a Kinetographic Camera, patent issued 31 August 1897". The rendered caption says the same.
- l.182 `eu_term_reason`: "Patent drawing published 1897".
- Registry `autopilot-assets.json` l.2653/l.2659, with `date` 1897.
- Professor brief `who-creates-edison.md` l.81: "NARA 595495, 1897".

The 1897 date comes from the NARA and Commons record title, but the sheet itself contradicts it. This is the same class of error as the 1877/1880 phonograph caution. The alt (deck l.174 = lesson l.233) also says "a vertical film path between reels". The drawing shows two side-by-side reels with the film running across the top past the lens.

**Fix:**

- Title: "Kinetoscope, US reissue patent 12,037, sheet 1 (30 September 1902; reissue of patent 589,168, 31 August 1897)".
- Registry `date` 1902-09-30; `eu_term_reason` "Reissue drawing published 1902; …".
- Alt: "Patent drawing of a film mechanism in a box: film running between two side-by-side reels past a lens, above a gear train, with witness signatures and the inventor's name signed by his attorneys".
- Brief l.81: change to "1902 reissue". Optionally add a professor-only, discovery-only note: a reissue is legal-ownership evidence.
- Then run `npm run render:decks`, which refreshes `lesson_figures.json`, and update lesson l.233 so its alt matches.

### F2 — P1 — blocks Done — Edison lab-2 alt describes a scene the photograph does not show

**Evidence:** Deck l.193 = lesson l.247 = registry l.2683 reads: "A factory room of women workers seated at long benches assembling electric lamps, with supervisors standing behind them." The image `93deb54ee6bac65d.webp` shows about 15 workers. Most are young men and boys in vests, caps, and bowler hats, seated among barrels, wicker baskets, and heaps of paper or wrapping. One man stands at the back. There are no long benches, no lamps are visibly being assembled, and no women can be made out. The Commons description gives no task and no gender: "Workers at a Harrison Lamp Works factory. Keywords: employees; Edison Companies and Laboratories". On a labour-themed Lab slide, a false gender and task description is an accuracy failure and an accessibility failure, since screen-reader users get only this text.

**Fix:**

- Alt: "Young men and boys, most in vests and caps, seated among barrels, wicker baskets and heaps of paper wrapping in a brick-walled factory room; one man stands at the back."
- Brief (deck l.353 + registry): "Factory labour at a lamp works (the record does not say which task): who does it, and who is paid?"
- Re-render and sync lesson l.247.

### F3 — P1 — blocks Done — HABS sheets cleared on the basis the registry rejects for Wolcott; delineator omitted

**Evidence:** The title blocks of `90b4e4405c8aab7b.webp` (sheet 5 of 7) and `e755612ae36914c3.webp` (sheet 2 of 7) read "DELINEATED BY: ALEXANDER TITENKOV, US/ICOMOS, GEORGIA · HENRY FORD MUSEUM DYMAXION HOUSE RECORDING PROJECT · NATIONAL PARK SERVICE", with Dearborn as the location. The registry (l.2711, l.2799) and the deck (l.21–31, l.78–88) give:

- `author` "Historic American Buildings Survey (Library of Congress)", with `author_death_year` null;
- `eu_term_reason` "US federal government work (HABS, National Park Service); no individual author term";
- `rights_status` ok;
- Commons date "after 1933". The sheets actually record the house as installed in the museum, so they are much later.

The same registry flags both Wolcott FSA photos (l.2836, l.2955), which are also US federal works, with the reason: "US federal-work status does not clear it." Records with the same legal basis get opposite verdicts. The ok records therefore are not consistent in author or date, and the validator cannot catch it because the named person is missing from `author`. This is the Fuller **cover** image. Session brief `who-creates-fuller.md` l.57 and l.60 reads "ok (US Gov)".

**Fix (professor's choice, applied to both HABS and FSA together):**

- **Either** flag both HABS records with `flag_reason` "Named delineator (Alexander Titenkov, US/ICOMOS); EU term not shown expired; US federal-work status does not clear it (same rule as Wolcott)". This leaves Fuller with 8 flagged; update the brief heading "six flagged" and the execute receipt l.88.
- **Or** record one reasoned, professor-approved exception that clears federal commissioned works, and apply it to the FSA photos as well.
- In either case, set the credit to "Alexander Titenkov (delineator), Historic American Buildings Survey, National Park Service", and take the date from the LOC record for HABS MI-438.

### F4 — P2 — Fuller MC6: "restoration" is not what the source records

**Evidence:**

- Commons: "Jay is seen here removing a lower perimeter wall section of the Dymaxion House, demonstrating a B. Fuller principle that any part of the Dymaxion Dwelling Machine can be manipulated by a single person."
- Alt (deck l.155 = lesson l.187): "during its documentation and restoration in 1992".
- Deck brief l.307: "Restoration labour …".
- Lesson l.191: "Restoration labour the visionary story usually leaves out."
- Professor brief l.64: "Jay Baldwin restoring the house".

The 1992 photograph shows dismantling at the Kansas site, and the source frames it as a demonstration of Fuller's own design claim.

**Fix:**

- Alt: "A man in a hard hat lifting a curved metal perimeter wall section of the Dymaxion House during its dismantling, Kansas, 1992."
- Prompt: "One person lifts a wall section — the photo demonstrates a design claim. Who did the rest of the dismantling, shipping and rebuilding?"
- Professor brief: "dismantling".

### F5 — P2 — Edison MC6: "alternatives" contradicts the alt and misapplies the Norman pin

**Evidence:** The alt (deck asset) says "five glass lamp-bulb forms at different stages of manufacture", which is correct: figs 1→5 run from blown bulb to sealed lamp. The deck brief l.320 and lesson l.217 say "manufacture as a series of alternatives". Professor brief l.80 says "Five forms = alternatives (Norman 226)". A sequence of steps is presented as alternative ideas and tied to a page-pinned quote about generating ideas.

**Fix:** use "manufacture broken into five steps" in both places. In brief l.80, drop "(Norman 226)" or say Norman's point applies to the students' ownership options, not to this drawing.

### F6 — P2 — Fuller MC2 / cover: museum installation presented as the house's own site work

**Evidence:** The foundation sheet labels "Existing Museum Structure" under the plan, and its title block reads "Henry Ford Museum … Dearborn". The deck brief l.254 and lesson l.143 say "What a futuristic exterior conceals: foundations, footings, and site work." The titles (deck l.21, l.78) do not mention the museum.

**Fix:**

- Titles: "… as installed at the Henry Ford Museum, Dearborn (HABS MI-438)".
- Prompt: "Even a museum installation needs a foundation plan. What site work would a factory-made house still need?"

### F7 — P2 — Fuller MC3 prompt asks students to name facts the record does not hold

**Evidence:** Lesson l.159 says "Name its manufacturer, its designer, and its residents." The deck brief l.264 says "manufacturer, designer, and residents are different stakeholders." The LOC/Commons caption names Butler Brothers and Fuller, but no residents. The photo shows a unit beside street-name signs. The prompt invites invention in a lesson whose dossier asks for "one claim you could not verify".

**Fix:** "The record names a manufacturer (Butler Brothers) and a designer (Fuller) but no residents. Who would live in it, and how would you find out?"

### F8 — P2 — Fuller lab-2 alt "one-piece" contradicts the source

**Evidence:** Deck l.193 = lesson l.224 say "a one-piece prefabricated bathroom unit". Commons (US 2,220,482 fig. 2) says it is "constructed … in four quarter-parts, each portable by two people."

**Fix:** "Patent drawing, plan view, of a prefabricated bathroom unit integrating tub, toilet, and washbasin."

### F9 — P2 — the lesson-figure gate never checks this series

**Evidence:** `scripts/tests/lesson-figures.test.mjs` l.81–86 hard-codes `lessonFiles` to U1–U3 + `creative-process-analysis`. The 8/8 pass says nothing about the who-creates lessons, so the test would stay green if a who-creates figure diverged from its deck (checklist failure mode 3). My manual run of the same logic gives 10/10 matches per lesson. The receipt claim (execute l.90) is true, but no gate shows it.

**Fix:** add `docs/lessons/en/master-lectures/who-creates-edison/index.md` and `…/who-creates-fuller/index.md`, or derive the list from `lesson_figures.json` keys.

### F10 — P3 — Google Patents flag reason omits the reproduction-permission ground

**Evidence:** Registry `flag_reason` at l.2757, l.2875, and l.2905 cites only "Fuller died 1983". `visual-resources.json` F06–F08 and brief l.56 cite "reproduction permission not verified". **Fix:** name both grounds in `flag_reason`, so clearing the EU term later does not silently clear the Google reproduction question.

### F11 — P3 — signature wording on a slide about what signatures prove

**Evidence:** The cover alt (deck l.22 = lesson l.94) says "the signatures of witnesses and inventor". The sheet is signed "Thomas A. Edison per Lemuel W. Serrell, Att'y". Lesson l.217 asks "Whose signatures appear besides the inventor's?", but on 230,255 the inventor's name is signed "per Dyer & Wilber, his Att'ys". **Fix:** "witnesses' signatures and the inventor's name signed by his attorney". For the prompt: "Who signed this sheet, and for whom?"

### F12 — P3 — alt precision nits

The fixes are inline:

- **Edison analysis-model:** "side and top views". The specification says "Fig. 3 is an end view of the cylinder", so use "side and end views". The cylinder itself is confirmed.
- **Edison MC2:** "two pen sketches" should be "two sketches"; the drawing looks like pencil, and only the signatures are ink. The NPS Kruesi claim sits in the alt, but the caption's Source link points to the JPG rather than the NPS page that makes the claim. Link the canonical NPS page in the caption.
- **Edison MC3:** "over a building plan". The lettered areas B/B′ are not identified as such, so use "over lettered blocks".
- **Fuller cover:** "two exterior sections" should be "two cross-sections (A-A, B-B) showing the interior".
- **Fuller MC3:** "two men standing outside" should be "one man standing outside, another entering the door".
- **Fuller MC1:** the alt omits "replica"; use "A replica of the 1933 Dymaxion car: …".
- **Fuller analysis-model:** "perspective and plan" should be "perspective (fig. 1) and strut elevations (figs. 4–5)".

### F13 — P3 — Fuller lesson never says which images *are* the Wichita House

**Evidence:** Lesson l.159 says "not the later Wichita House". The HABS sheets (the house as rebuilt at the Henry Ford Museum) and the 1992 Kansas photograph are that house, but the captions only say "Dymaxion House". **Fix:** add "(the house in the measured drawings and the 1992 photograph)".

### F14 — P3 — MPPC brief: licensees ≠ the patent pool

**Evidence:** Deck brief l.298 says "the manufacturers who pooled patents and licences around one table". Commons: "Thomas Edison with motion picture manufacturers, licensees of the Motion Picture Patents Co." **Fix:** "the licensed manufacturers gathered with the patent holder around one table". The brief is public in the deck JSON.

### F15 — P3 — `visual-resources.json` E06 binding overstates provenance

**Evidence:** E06 is `Category:Patents_by_Thomas_Alva_Edison`, but its `deck_binding` (l.116) lists MC1, MC4, MC5, and lab-2. Those are photographs, and their Commons categories do not include that category. **Fix:** note "found outside E06 (Commons/NPGallery search)", or add separate resource rows.

### F16 — P3 — the Watch line's "laboratory work" is unverified

**Evidence:** Lesson l.203 says "the staff, laboratory work, and lamp manufacturing it shows". The E03 catalog note records "factory labor, manufacturing and corporate self-presentation" (GE/Bray), but nothing about laboratory work, and LOC returned 403 to this review. **Fix:** check the film, or drop "laboratory work".

---

**Downstream:** no phase file is invalidated. If F3 is resolved by flagging, `session-prompts/who-creates-fuller.md` (heading and rows for the cover and MC2) and `WHO-CREATES-WHO-OWNS.execute.md` l.88 ("4 ok, 6 flagged") must be amended in the same pass. After the amends, run `npm run render:decks`, which also refreshes `lesson_figures.json`, sync the lesson alts, then run the F9-extended test and `validate:decks`.

---

## Verdict line

**FAIL.** Gates are green, the firewall is clean, there are no new citations, and every user caution holds on the student surfaces. The three P1s are:

- **F1:** the lab-1 caption dates the sheet to 1897, but it is the 1902 reissue.
- **F2:** the lab-2 alt invents women, benches, and lamp assembly.
- **F3:** the HABS cover and MC2 are cleared on a federal-work basis the registry rejects for Wolcott, and the named delineator is omitted.

The P2s (F4–F9) should be fixed in the same amend pass. The cold reviewer edited no file other than this receipt, and `docs/_data/exercises.yml` was restored after the build and the test run.
