# COLD-REVIEW-3 — Who Creates, Who Owns, Who Scales? (cycle 2 · corpus hardening)

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales` (uncommitted working tree)  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Prior receipts:** `COLD-REVIEW-1.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-2.md` (PASS)  
**Verdict:** **PASS-WITH-AMENDS**

The cycle-2 citation work is sound. I checked Robb 2024 against the printed PDF pages and found the quotes verbatim and the page pins correct. The resolver marks every cited node evaluator-safe, and the Chicago entry matches Crossref. The three downgraded coats fail the resolver and appear on no student surface. Student HTML for both lessons and both decks passes the publication firewall. All 11 named gaps appear in an Editorial note, and none is cited.

Two required amends remain before Done. First, the Edison professor brief attaches a citable Robb pin to a claim that comes from a discovery-only source (F1). Second, the binding distinction "appropriation ≠ legal acquisition ≠ collaboration ≠ infringement ≠ monopolization" is still not taught on the student surface (F2). The remaining findings are P2 wording and clarity fixes.

---

## Cycle-2 claims checklist (from `WHO-CREATES-WHO-OWNS.execute.md` cycle-2 receipt)

| # | Claim | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Robb 2024 passes `--require-evaluator-safe` | **OK** | 4/4 cited nodes exit 0, conf 0.95, `source=metadata` (below) |
| 2 | `3dd15828` / `806a22bd` / `3cfe2d56` fail the resolver (exit 2) | **OK** | All three exit 2: conf 0.60, `source=slug` (below) |
| 3 | `robb-2024` in `references.yml`, Crossref-correct | **OK** | Crossref API: Robb, George · *New Jersey Studies: An Interdisciplinary Journal* · 10 (2) · 242-245 · 2024 · DOI matches |
| 4 | Lesson pins 242 · 243 · 243–44 · 244 page-verified | **OK** (wording see F3) | `pdftotext` pages 1–3 = printed 242–244 |
| 5 | Deck MC1 quote (Robb 2024, 243) verbatim | **OK** (presentation see F4) | Printed 243, lines 19–20 |
| 6 | No new Fuller cites | **OK** | Fuller `references: [csikszentmihalyi-1996, norman-2013]` |
| 7 | Editorial notes name all monograph + DOI gaps | **OK as a series**; the receipt wording is inaccurate (F7) | The 11 gaps are split across the two lessons; neither lesson names all of them |
| 8 | Professor briefs: 90 min, C1–C3, citable vs discovery-only | **PARTIAL** | Structure OK; Edison C1 hook mis-pins Robb (F1); timing ≠ deck order (F6) |
| 9 | Exercises unchanged; no fake public IDs | **OK** | `rg` for proposed IDs in `docs/` → empty; `exercises/process-trail.yml` exists |
| 10 | Gates: `render:decks` / `validate:decks` / `verify:publication` | **OK** | Rebuilt below |

---

## Surfaces reviewed

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `forge/who-creates-who-owns/{SERIES.md, WHO-CREATES-WHO-OWNS-FORGE.mdc, WHO-CREATES-WHO-OWNS.execute.md, EXERCISES-GAP.md}` | Yes |
| 2 | `forge/who-creates-who-owns/session-prompts/who-creates-{edison,fuller}.md` | Yes |
| 3 | `docs/lessons/en/master-lectures/who-creates-{edison,fuller}/index.md` | Yes |
| 4 | `docs/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json` + `_includes/decks/who-creates-*.html` | Yes |
| 5 | `docs/_data/references.yml` (`robb-2024`) | Yes |
| 6 | `docs/lessons/en/master-lectures/index.md` · `docs/lessons/en/creativity-techniques/index.md` · `docs/_data/tracks.yml` (`ML-WCOS-E/F`) | Yes (diff) |
| 7 | Rebuilt `_site/` lessons, decks, deck `content.json` | Yes |
| 8 | Source PDF `…/20261025-who-creates-who-owns/pdfs/10.14713_njs.v10i2.367__Review_of_Seduced_by_the_Light_…pdf` | Yes, all 4 pages |

---

## Runnable gates (evidence)

```text
$ npm run build            # prebuild: hydrate → render:decks; postbuild: verify:publication
Publication safety failed (1 finding(s)):
_site/assets/diagrams/d2-transposition-workflow.visual-check.json: local filesystem path
BUILD_EXIT:1               # unrelated finding only (scoped out in CR1/CR2)

$ npm run validate:decks
validate-decks: 10 deck file(s), 0 error(s), 8 warning(s) [strict; rights=flag]
                           # all 8 warnings are U2 / ML-CPA rights; none on who-creates-*
```

Firewall denylist scan on the rebuilt student surfaces (both lessons, both decks, both built deck `content.json` files):

```text
$ rg -i -o "ahmes|athanor|deviac|vault\w*|evaluator.safe|forge\w*|lesson-scribe|\bcoats?\b|BIBLIO-GAP|
           curriculum-internal|PROVENANCE|/Users/|~/src|<uuid prefix>|35dcf3a7|f31e7737|71227d15|cycle|extraction" …
_site/lessons/en/master-lectures/who-creates-edison/index.html:672:cycle     # "in this cycle" → F5
```

No denylist term. The only hit is the internal-process word "cycle" (F5). The gated `curriculum-internal` comment, which holds the coat IDs, node UUIDs, and downgrade note, does not render.

Deck spines (rendered `data-slide-role` order), both decks: `unit_cover → analysis_opener → analysis_model → masterclass ×6 → lab_opener → lab_exercise ×2 → outro`. On the Edison deck, `analysis_opener` is "Analysis · three levels" and `analysis_model` is "Five evidence categories". On the Fuller deck, `analysis_model` is "Vocabulary laboratory" and the software transfer is only on `outro` ("Transfer · one digital product"). No Apple, Microsoft, or software text appears on any pre-lab slide.

References render: Edison `#ref-robb-2024` anchor exists; in-text links (×4) resolve. Fuller has no Robb link (correct).

---

## Robb 2024 — independent page verification

PDF page → printed folio: p1 = 242, p2 = 243, p3 = 244, p4 = 245 (signature only). The resolver reports `scheme=pdf_order` pages 1–3. The lesson converts these to printed folios (+241), and that conversion is correct.

```text
$ ahmes query "$DB" --cite "${DB}:<node>" --style chicago-author-date --require-evaluator-safe
e3b5b196…  (Robb 2024, 1)  page_index=0  conf=0.95 source=metadata evaluator_safe=yes  EXIT:0
ad00341d…  (Robb 2024, 2)  page_index=1  conf=0.95 source=metadata evaluator_safe=yes  EXIT:0
18706b3f…  (Robb 2024, 3)  page_index=2  conf=0.95 source=metadata evaluator_safe=yes  EXIT:0
85519a1c…  (Robb 2024, 3)  page_index=2  conf=0.95 source=metadata evaluator_safe=yes  EXIT:0
```

| Lesson / deck statement | Printed text | Pin | Verdict |
| --- | --- | --- | --- |
| Early hagiographic biographies of the “Wizard of Menlo Park” left out his miserable family relations | 242: “Early hagiographic biographies of the “Wizard of Menlo Park” left out the miserable family relations” | 242 | **Faithful** |
| Mina Edison “helped cultivate Edison’s public image as a genius” **through** a friendly relationship with the press | 243: “She maintained a friendly relationship with the press, helped cultivate Edison’s public image as a genius, and, whenever possible, papered-over family scandals.” | 243 | Quote **verbatim**; “through” turns a list of parallel actions into cause and means (F3) |
| **Edison’s sons** angered him by trading on it | 243: “Tom Jr. and William both struggled to hold down jobs and enraged their father by trading on his name.” | 243 | Pin OK; the review names only **Tom Jr. and William**. Charles and Theodore (also named on 243) did not do this (F3) |
| Tom Jr. marketed an “Edison Junior Improved” incandescent lamp that **the reviewer describes** as simply one of his father’s inventions | 243: “At one point, Tom Jr. marketed an “Edison Junior Improved”” / 244: “incandescent lamp that was simply one of his father’s inventions.” | 243–44 | **Faithful**. The words are Robb’s, so attributing the description to the reviewer is correct, and the pin spans the page break exactly |
| Faulting the biography for attributing thoughts and feelings to Mina Edison “that seem unverifiable” when no quotation or citation documents them | 244: “At times Rimer attributes feelings and thoughts to Mina that seem unverifiable. … provides no quotation or citation to document this claim.” | 244 | **Faithful**; the quote fragment is verbatim |
| Deck MC1 quote: “She maintained a friendly relationship with the press, helped cultivate Edison’s public image as a genius” | 243 (as above) | 243 | **Verbatim** prefix; it lacks a trailing ellipsis and an antecedent for “She” (F4) |

Chicago entry (`references.yml`, rendered): `Robb, George. 2024. Review of *Seduced by the Light: The Mina Miller Edison Story*, by Alexandra Rimer. *New Jersey Studies: An Interdisciplinary Journal* 10 (2): 242–45. https://doi.org/10.14713/njs.v10i2.367.` The entry matches Crossref (`type: journal-article`, `page: 242-245`, published 2024-10-18) and Chicago book-review form. **OK.**

### Downgrade spot-check (all three, real node IDs)

```text
3dd15828  node 04444d50…  (10.1038 181, 2)                              conf=0.60 source=slug evaluator_safe=no  EXIT:2
806a22bd  node 00dd153b…  (10.18060 1836, 20)                           conf=0.60 source=slug evaluator_safe=no  EXIT:2
3cfe2d56  node 03d056dd…  (10.5603_njo.2016.0089__Thomas_Edison 1847, 5) conf=0.60 source=slug evaluator_safe=no  EXIT:2
```

The student-surface grep for `nature 1878|phonograph and its future|beyond einstein|nowotwory|x-ray|jeffrey|guthrie|tympas|harhoff|insomnia|dally|<coat ids>` across both lessons, both decks, the deck includes, and `references.yml` matches only line 41 of the Edison lesson. That line is inside the gated `curriculum-internal` comment and does not render. **No student surface cites them.**

**Tooling trap:** under zsh, `"$DB:e3b5…"` triggers the `:e` (extension) history modifier, so the command fails with `--cite must be in format <db>:<node_id>`. Run it as `"${DB}:<node>"`. A bad node query also exits 2 with `[BIBLIO-GAP]`, which can look like a valid downgrade result. Spot-checks must use real `fission_node.node_id` values (the table is `fission_node`, column `node_id`).

---

## Gap naming (rule 7)

| Gap | Named in | Cited? |
| --- | --- | --- |
| Schumpeter, *Theory of Economic Development* | Edison Missing evidence · Fuller Declared gap | No |
| Fuller, *Operating Manual* (1969) · *Synergetics* (1975) | Fuller Declared gap | No |
| Simon, *Sciences of the Artificial* (1969) | Fuller Declared gap | No |
| Alexander, *Notes on the Synthesis of Form* (1964) | Fuller Declared gap | No |
| Lissoni–Montobbio–Zirulia 2013 | Edison Missing evidence | No |
| Moser 2013 (“patents and innovation in economic history”; not conflated with Schumpeter) | Edison Missing evidence | No |
| Nuvolari 2004 (Cornish pumping engine) | Edison Missing evidence | No |
| Osterloh & Rota 2007 | Edison + Fuller Missing evidence | No |
| Brookes–Mould–Squire 2026 · Lee 2023 · Serra Soriano et al. 2025 | Fuller Missing evidence | No |
| Sawyer–Man, Kruesi, Dickson, MPPC, GE consolidation | Edison Declared gap (method only) | No Chicago invented; `references.yml` diff adds only `robb-2024` |
| Fuller vocabulary | Fuller Declared gap (“course prompts”) | No |

Front-matter keys: Edison `[csikszentmihalyi-1996, norman-2013, robb-2024]` and Fuller `[csikszentmihalyi-1996, norman-2013]`. All keys exist in `references.yml`. **OK.**

---

## Safeguard re-check

| Safeguard | Status |
| --- | --- |
| Five Edison cases = investigations, not five thefts | **OK** |
| Phonograph keeps Edison contribution + collective labour | **OK** (lesson case 2; deck MC2 prompt) |
| Radio = counterexample | **OK** |
| MPPC = market organisation / access control | **OK** |
| Appropriation ≠ legal acquisition ≠ collaboration ≠ infringement ≠ monopolization | **GAP**: not operationalised on the student surface (F2) |
| Fuller = comparison, not moral opposite; integrity ≠ tensegrity | **OK** |
| Software transfer after Lab; on Fuller `outro` only | **OK** |
| Deck spine + analysis_opener / analysis_model content | **OK** |
| Publication firewall (lessons + decks) | **OK** (word “cycle”, F5) |
| Editorial triad + AI-assisted authorship footer | **OK** both lessons |
| Exercises: `process-trail` optional warm-up only; no fake IDs | **OK** |
| Index + `tracks.yml` wiring (`ML-WCOS-E/F`, `series:`) | **OK** |
| Uncertainty visible / method over myth | **OK**: “a lead to follow, not a final verdict”; dossier item 6 “claim you could not verify” |

---

## Findings

### F1 — P1 — blocks Done — Edison brief pins a discovery-only claim to Robb

**Evidence:** `session-prompts/who-creates-edison.md` §C1–C3 says: “**C1 ideology:** the “Wizard of Menlo Park” as a press-made name; whose interests the genius story serves (Robb 2024, 243).” Printed 243 says nothing about the nickname. Robb mentions the “Wizard of Menlo Park” only on 242, as a label used by hagiographic biographies, and nowhere says the press made the name. The “press name by 1878” lead appears in the same brief’s **discovery-only** table (Jeffrey, `426a6072`, conf 0.70). A professor reading the C1 line would cite Robb 243 for a claim that comes from a discovery-only source, which breaks rule 9.

**Amend (`session-prompts/who-creates-edison.md`, C1 bullet):** rewrite as: “**C1 ideology:** whose interests the genius story serves. Citable: Mina Edison ‘helped cultivate Edison’s public image as a genius’ (Robb 2024, 243); hagiographic biographies of the ‘Wizard of Menlo Park’ (Robb 2024, 242). Discovery only, no page: the nickname as a press coinage by 1878 (Jeffrey).”

### F2 — P1 — blocks Done — SERIES safeguard 2 not taught on the student surface

**Evidence:** `SERIES.md` safeguard 2 (binding) says: do not treat appropriation, legal acquisition, collaboration, patent infringement, and monopolization as synonyms. `rg -i "infring|acquisition|monopol"` on both lessons returns only the Fuller software prompt (“commercial acquisition”). The Edison vocabulary table defines **Appropriation** as “Taking credit, value, or control from others’ contributions”. That wording also covers lawful purchase or licensing of rights and market control, so it does not separate appropriation from legal acquisition or monopolization. The exit assessment (“he stole it”) depends on exactly this distinction. CR1 and CR2 did not check it.

**Amend (`docs/lessons/en/master-lectures/who-creates-edison/index.md`, “Vocabulary (use carefully)” table):** narrow Appropriation to “Taking credit, value, or control **without recognition or agreement**”. Add four rows: **Legal acquisition** (buying, licensing, or being assigned rights — lawful transfer, which may still obscure contributors); **Collaboration** (contribution under shared, employment, or contract arrangements); **Infringement** (a court- or claim-based finding that a specific right was violated, not a moral verdict); **Monopolization** (market control that extends beyond the artifact; compare *patent capture*). Optional: one deck line on MC1 or MC5, e.g. “Acquiring ≠ appropriating ≠ infringing ≠ monopolizing.”

### F3 — P2 — Robb paraphrase: two small over-reads

**Evidence:** see the verification table above. (a) Robb lists the press relationship and the cultivation of the genius image as parallel actions, but the lesson’s “through a friendly relationship with the press” makes one the means of the other. (b) “Edison’s sons angered him by trading on it” reads as all sons. The review names only Tom Jr. and William, and Charles and Theodore appear on the same page.

**Amend (Edison lesson, “Public attribution is produced, too”):** (a) write “…that Mina Edison maintained a friendly relationship with the press and ‘helped cultivate Edison’s public image as a genius’ (Robb 2024, 243)”. (b) write “his elder sons Tom Jr. and William enraged him by trading on it”. Keep both pins.

### F4 — P2 — Deck MC1 quote lacks an antecedent and source framing

**Evidence:** the rendered slide (`_includes/decks/who-creates-edison.html` l.33–35) shows “She maintained…” with no name. The `claims[]` text that names Mina is not rendered. The prompt “Who maintained it here?” cannot be answered from the slide, the truncated quote has no ellipsis, and the slide does not show that the source is a book review (the lesson says so explicitly).

**Amend (`who-creates-edison/data/content.json` masterclass-1, then `npm run render:decks`):** set `quote` to “[Mina Edison] maintained a friendly relationship with the press, helped cultivate Edison’s public image as a genius …”. Change `prompt` to “A book review of Mina Edison’s biography: ‘genius’ is also a public image someone maintains. Treat it as a lead — what would confirm it?”

### F5 — P2 — Internal process word in the student Editorial note

**Evidence:** rebuilt HTML l.672: “The one new citation in this cycle is a book review”. This is not a denylist term, but “cycle” is authoring-process vocabulary that students do not know.

**Amend (Edison lesson, Addressed-to-editor):** “The only journal source cited above is a book review; follow it to the biography it reviews before relying on its details.”

### F6 — P2 — Edison brief timing disagrees with deck order

**Evidence:** the brief places “Deck MC1: Robb quote” in Provocation (0–10), before Method (10–20, analysis opener and model), but the deck puts MC1 after both analysis slides. The brief also places “two maps” in 45–60 and “Lab: counter-design” in 60–80, while the deck puts the two-maps exercise (`lab-1`) after `lab_opener`.

**Amend (`session-prompts/who-creates-edison.md` timing table):** Provocation 0–10 uses the cover only. Method 10–20 covers the analysis opener, analysis model, and MC1 (Robb). The 45–60 block becomes “Banking (MC6)”. Lab 60–80 becomes “lab-1 two maps + lab-2 counter-design”. Alternatively, reorder the deck so it matches the brief.

### F7 — P2 — Execute receipt overstates gap naming

**Evidence:** the cycle-2 receipt row “Editorial notes” says “Both lessons name Schumpeter, Fuller ×2, Simon, Alexander, Lissoni…, Brookes–Mould–Squire 2026”. In fact the Edison lesson names only Schumpeter, Lissoni, Moser, Nuvolari, and Osterloh–Rota, and the Fuller lesson names neither Lissoni, Moser, nor Nuvolari. The split is pedagogically right, but the receipt states something the files do not show.

**Amend (`WHO-CREATES-WHO-OWNS.execute.md`, cycle-2 row “Editorial notes”):** “Edison: Schumpeter, Lissoni–Montobbio–Zirulia 2013, Moser 2013, Nuvolari 2004, Osterloh–Rota 2007. Fuller: Fuller ×2, Simon, Alexander, Schumpeter, Lee 2023, Serra Soriano et al. 2025, Brookes–Mould–Squire 2026, Osterloh–Rota 2007.”

### F8 — P2 — optional — Fuller deck repeats the matrix task

**Evidence:** Fuller `masterclass-4` is “Edison–Fuller matrix”, and `masterclass-6` repeats the instruction with the prompt “Fill the Edison–Fuller matrix from evidence, not slogans.”

**Amend (optional, Fuller `content.json` masterclass-6):** keep the “What the public story omits” heading and replace the prompt with a row-specific question, e.g. “Visionary narrative vs implementation: which barrier did the story leave out?” Or drop to five masterclass slides.

---

## Required amends (forge agent checklist)

1. **F1:** fix the Edison brief C1 bullet so the Robb pins cover only Robb’s text and the nickname lead is marked discovery-only.
2. **F2:** add Legal acquisition / Collaboration / Infringement / Monopolization rows to the Edison vocabulary table and narrow Appropriation.
3. **F3–F5** (recommended, small): Robb paraphrase wording, deck MC1 antecedent and ellipsis, remove “cycle” from the student Editorial note.
4. **F6–F7:** align the brief timing with the deck; correct the execute receipt’s gap-naming row.
5. After amends, rebuild, re-run the denylist grep on the four student surfaces, and record the result. A full cold review is not needed if the diff stays inside F1–F7.

**Downstream:** no later phase is invalidated. `SERIES.md` and the forge stay accurate. Amend the execute receipt (F7) in the same commit as this report.

---

## What stayed green (do not “fix”)

- Robb 2024: quotes verbatim, pins 242 / 243 / 243–44 / 244 correct, resolver-safe, Chicago matches Crossref.
- The resolver downgrade of `3dd15828` / `806a22bd` / `3cfe2d56` is real (exit 2, slug metadata), and no student surface cites them.
- “A lead to follow, not a final verdict” framing of the review; the reviewer’s “unverifiable” critique used as a method model.
- All 11 named gaps are student-safe, with no invented Chicago.
- Deck spines; Fuller software on `outro` only; firewall clean; Editorial triad + AI footer.
- `process-trail` as optional warm-up; honest `EXERCISES-GAP.md`.

---

## Verdict line

**PASS-WITH-AMENDS**: cycle-2 citation hardening is verified (Robb 2024 page-checked, resolver-safe, Crossref-correct; downgrades confirmed; firewall clean). **F1 (brief mis-pin) and F2 (appropriation / acquisition / infringement / monopolization not distinguished) must be applied before Done.** F3–F8 are P2. The cold reviewer did not edit any lesson, deck, brief, or data file.
