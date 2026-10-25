# COLD-REVIEW-4 — Who Creates, Who Owns, Who Scales?

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales` (uncommitted working tree)  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Prior receipts:** `COLD-REVIEW-1.md` (PASS-WITH-AMENDS) · `COLD-REVIEW-2.md` (PASS) · `COLD-REVIEW-3.md` (PASS-WITH-AMENDS)  
**Verdict:** **PASS**

All CR3 amends are applied, and I verified each one against the files, the rebuilt HTML, and the Robb 2024 PDF. The two CR3 blockers are closed. F1: the Edison brief's C1 bullet now pins only claims Robb makes and marks the press-nickname lead as discovery-only. F2: the Edison vocabulary table now separates collaboration, legal acquisition, appropriation, infringement, and monopolization. Student HTML for both lessons and both decks is clean under the denylist. The only build finding is the out-of-scope diagram asset. One optional P2 wording nit remains in the professor brief (F1 below). It does not block Done.

---

## Amend checklist (from COLD-REVIEW-3)

| # | CR3 amend | Status | Evidence |
| --- | --- | --- | --- |
| F1 | Edison brief C1: Robb pins limited to what Robb says; nickname = discovery-only, no page | **OK** | `session-prompts/who-creates-edison.md` C1: “hagiographic biographies omitted family life (Robb 2024, 242); Mina Edison cultivated the genius image (Robb 2024, 243). The press coining “Wizard of Menlo Park” by 1878 is a discovery-only lead (Jeffrey, `426a6072`) — say it without a page.” Printed 242 has the hagiography line, printed 243 has the Mina image line, and the nickname carries no Robb pin. Wording nit: see F1 below |
| F2 | Edison vocabulary table separates the five terms; Appropriation narrowed | **OK** | Lesson l.209–213: **Collaboration** (“Shared work toward a result, whether or not every contributor is later credited”), **Legal acquisition** (“Buying, licensing, or being assigned rights by agreement”), **Appropriation** (“…without recognition or agreement”), **Infringement** (“A legal finding that someone used a protected invention or work without permission”), **Monopolization** (“Using patents, pools, standards, or mergers to exclude competitors or control access”). Patent capture and Standard-setting are kept |
| F3a | “through a friendly relationship” → parallel actions | **OK** | Lesson l.107: “Mina Edison maintained a friendly relationship with the press and “helped cultivate Edison’s public image as a genius” (Robb 2024, 243)”. This matches printed 243 l.“She maintained … helped cultivate … genius, and, …” |
| F3b | “Edison’s sons” → only the sons the review names | **OK** | Lesson l.107: “his sons Tom Jr. and William enraged him by trading on it”. Printed 243: “Tom Jr. and William both struggled to hold down jobs and enraged their father by trading on his name.” The antecedent of “it” is “The name itself”. Faithful |
| F4 | Deck MC1 quote: antecedent + ellipsis; prompt names the book review | **OK** | `who-creates-edison/data/content.json` masterclass-1 `quote`: “[Mina Edison] maintained a friendly relationship with the press, helped cultivate Edison’s public image as a genius …”. `prompt`: “Source: a book review — a lead, not a verdict. Who maintains the “genius” image in your case?” Both render in `_site/master-lectures/who-creates-edison/index.html` l.49 and l.51, and `_includes/decks/who-creates-edison.html` is in sync |
| F5 | Remove “cycle” from the student Editorial note | **OK** | Lesson l.230: “The only journal source cited above is a book review; follow it to the biography it reviews before relying on its details.” The built-HTML grep for `cycle` returns 0 matches |
| F6 | Brief timing aligned to deck order; total 90 | **OK** | Brief table: Cover 0–5 → Method 5–15 (analysis opener → analysis model) → MC1 15–20 → MC2 + case groups 20–40 → MC3–MC5 40–47 → MC6 47–50 → Lab 50–80 (lab opener → Ex 1 → Ex 2) → Exit + outro 80–90. The blocks sum to 5+10+5+20+7+3+30+10 = 90 and follow the rendered deck order exactly |
| F7 | Execute receipt lists gaps per lesson | **OK** | `WHO-CREATES-WHO-OWNS.execute.md` l.79: “Edison: Schumpeter, Lissoni–Montobbio–Zirulia 2013, Moser 2013, Nuvolari 2004, Osterloh–Rota 2007 … Fuller: Fuller 1969 + 1975, Simon 1969, Alexander 1964, Schumpeter, Lee 2023, Serra Soriano et al. 2025, Brookes–Mould–Squire 2026, Osterloh–Rota 2007.” I compared this against both Editorial notes and it matches |
| F8 | (optional) Fuller MC6 prompt not a repeat of MC4 | **OK** | `who-creates-fuller/data/content.json` masterclass-6 `prompt`: “Pick one matrix row. What evidence would change your answer?” This no longer repeats MC4’s “Compare … from evidence” |

---

## Surfaces re-checked

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `docs/lessons/en/master-lectures/who-creates-edison/index.md` | Yes (full) |
| 2 | `docs/lessons/en/master-lectures/who-creates-fuller/index.md` | Yes (full) |
| 3 | `docs/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json` | Yes (full) |
| 4 | `forge/who-creates-who-owns/session-prompts/who-creates-edison.md` | Yes (full) |
| 5 | `forge/who-creates-who-owns/WHO-CREATES-WHO-OWNS.execute.md` (cycle-2 receipt) | Yes (l.69–84) |
| 6 | `docs/_data/references.yml` (`robb-2024`) | Yes |
| 7 | Rebuilt `_site/` lessons, decks, and deck `content.json` | Yes |
| 8 | Robb 2024 PDF, all 4 pages via `pdftotext -layout` | Yes |

---

## Robb 2024 — independent page re-verification

PDF page to printed folio: p1 = 242, p2 = 243, p3 = 244, p4 = 245 (signature only). Running `pdftotext -f N -l N -layout <pdf> -` confirms the running heads “… Summer 2024 242 / 243 / 244 / 245”.

| Lesson / deck / brief statement | Printed text | Pin | Verdict |
| --- | --- | --- | --- |
| Early hagiographic biographies of the “Wizard of Menlo Park” left out his miserable family relations | 242: “Early hagiographic biographies of the “Wizard of Menlo Park” left out the miserable family relations” | 242 | **Faithful** |
| Mina Edison maintained a friendly relationship with the press and “helped cultivate Edison’s public image as a genius” | 243: “She maintained a friendly relationship with the press, helped cultivate Edison’s public image as a genius, and, whenever possible, papered-over family scandals.” | 243 | **Verbatim** quote, and the paraphrase keeps the actions parallel |
| his sons Tom Jr. and William enraged him by trading on it [the name] | 243: “Tom Jr. and William both struggled to hold down jobs and enraged their father by trading on his name.” | 243 | **Faithful** |
| Tom Jr. … “Edison Junior Improved” incandescent lamp that the reviewer describes as simply one of his father’s inventions | 243: “At one point, Tom Jr. marketed an “Edison Junior Improved”” / 244: “incandescent lamp that was simply one of his father’s inventions.” | 243–44 | **Faithful** |
| Reviewer faults attributions “that seem unverifiable” | 244: “At times Rimer attributes feelings and thoughts to Mina that seem unverifiable. … provides no quotation or citation to document this claim.” | 244 | **Faithful** |
| Deck MC1: “[Mina Edison] maintained … genius …” | 243 (as above) | 243 | **Verbatim**, with the bracketed antecedent and an ellipsis for the truncation |
| Brief C1: “Mina Edison cultivated the genius image (Robb 2024, 243)” | 243: “helped cultivate” | 243 | Pin correct; “helped” is dropped (F1 below, P2) |

The Chicago entry in `references.yml` (`robb-2024`) is unchanged from CR3, where it was checked against Crossref. In the built Edison lesson the `id="ref-robb-2024"` anchor is present and there are 4 in-text `href="#ref-robb-2024"` links. The Fuller lesson has no Robb reference, which is correct.

---

## Runnable gates (evidence)

```text
$ npm run build            # prebuild: hydrate → render:decks; postbuild: validate:decks, jekyll, verify:publication
render-decks: 9 deck(s), 0 written.
validate-decks: 10 deck file(s), 0 error(s), 8 warning(s) [strict; rights=flag]
                           # all 8 warnings on U1 / U2 / ML-CPA rights; none on who-creates-*
                    done in 0.789 seconds.
Publication safety failed (1 finding(s)):
_site/assets/diagrams/d2-transposition-workflow.visual-check.json: local filesystem path
BUILD_EXIT:1               # sole finding = expected, scoped out since CR1
```

`rg -i who-creates /tmp/cr4-build.log` returns no gate finding on the series.

Firewall denylist scan on the four required student surfaces, plus the two built deck `content.json` files:

```text
$ rg -i -c 'Ahmes|DevIAC|Athanor|evaluator.safe|lesson-scribe|vault|forge|coat|BIBLIO-GAP|curriculum-internal|cycle' <file>
_site/lessons/en/master-lectures/who-creates-edison/index.html   → 0 (clean)
_site/lessons/en/master-lectures/who-creates-fuller/index.html   → 0 (clean)
_site/master-lectures/who-creates-edison/index.html              → 0 (clean)
_site/master-lectures/who-creates-fuller/index.html              → 0 (clean)
_site/tracks/en/uem/2627-ml/who-creates-{edison,fuller}/data/content.json → 0 (clean)
```

Deck spines, from `data-slide-role` in the rendered HTML (`uniq -c`):

```text
edison: 1 unit_cover · 1 analysis_opener · 1 analysis_model · 6 masterclass · 1 lab_opener · 2 lab_exercise · 1 outro
fuller: 1 unit_cover · 1 analysis_opener · 1 analysis_model · 6 masterclass · 1 lab_opener · 2 lab_exercise · 1 outro
```

---

## Safeguard re-check

| Safeguard | Status | Evidence |
| --- | --- | --- |
| Five Edison cases = investigations, not five thefts | **OK** | Heading “Five case groups (attribution investigations)”; “Do not substitute accusation for explanation.” |
| Phonograph keeps Edison contribution | **OK** | Case 2: “A comparatively **strong** case … Do not erase genuine contribution”; deck MC2 prompt |
| Radio = counterexample | **OK** | Case 4 “(counterexample) Not an Edison-centred invention claim”; deck MC2 |
| MPPC = market organisation | **OK** | Case 5: “**market organisation**, not a single artifact”; deck MC5 “Standards can choke” |
| Appropriation ≠ legal acquisition ≠ collaboration ≠ infringement ≠ monopolization | **OK** (was GAP in CR3) | Vocabulary l.209–213 |
| Fuller = comparison, not moral opposite | **OK** | Lesson opener and deck cover: “not a moral opposite of Edison” |
| Integrity ≠ tensegrity | **OK** | Vocabulary lab row “**Not** a synonym for ethical integrity”; deck `analysis_model` prompt |
| Software transfer only on Fuller outro | **OK** | `rg -i "apple|microsoft|jobs|software|digital product"` on both deck JSONs returns only Fuller `outro` (l.148, l.150); the lesson puts it after the Lab as a “closing research question” |
| Deck spines | **OK** | See above; both decks have ≤6 masterclass slides and 2 lab_exercise slides |
| `robb-2024` in `docs/_data/references.yml` | **OK** | l.217–224 |
| Named gaps declared, not cited | **OK** | Edison Editorial note: Schumpeter, Lissoni–Montobbio–Zirulia 2013, Moser 2013, Nuvolari 2004, Osterloh–Rota 2007. Fuller Editorial note: Fuller 1969/1975, Simon 1969, Alexander 1964, Schumpeter, Lee 2023, Serra Soriano et al. 2025, Brookes–Mould–Squire 2026, Osterloh–Rota 2007. All 11 are present. A `references.yml` key grep returns no keys for any of them, the in-text `[(Author …)]` grep for any of them returns empty, and the front-matter `references` lists only `csikszentmihalyi-1996, norman-2013[, robb-2024]` |
| No fake exercise IDs | **OK** | The only `/exercises/en/` link in the series is `process-trail` (optional warm-up), and `exercises/process-trail.yml` exists. `authorship-map`, `value-flow-map`, `counter-design-ownership`, and `dymaxion-without-genius` return empty |
| Publication firewall | **OK** | Denylist clean on all six built surfaces; the gated `curriculum-internal` comment does not render |
| Editorial triad + AI-assisted authorship footer | **OK** | Both lessons |

Carried non-blockers (not reopened): the public `exercises/*.yml` for the four Lab exercises are not yet forged (`EXERCISES-GAP.md`), and the Fuller primaries remain BIBLIO-GAP. The Editorial notes declare both in student-safe wording.

---

## Findings

### F1 — P2 — does not block Done — brief C1 drops “helped”

**Evidence:** `session-prompts/who-creates-edison.md` C1 says “Mina Edison cultivated the genius image (Robb 2024, 243)”, and the citable-sources table “Use” column says “Mina cultivates “genius” image”. Printed 243 says she “helped cultivate Edison’s public image as a genius”. The pin is correct, but the brief turns a contributory role into sole agency, which is the same over-read the series teaches students to avoid. This is a professor-facing surface only. The student lesson and deck are verbatim.

**Amend (optional, `session-prompts/who-creates-edison.md`):** in C1, change “Mina Edison cultivated the genius image” to “Mina Edison helped cultivate Edison’s public image as a genius”. In the citable table, change “Mina cultivates “genius” image” to “Mina helped cultivate the “genius” image”.

No other findings. Every CR3 amend is applied and verified, and no safeguard regressed.

**Downstream:** no phase file is invalidated. The `WHO-CREATES-WHO-OWNS.execute.md` cycle-2 row “Cold review” already points to this receipt.

---

## Verdict line

**PASS**: the CR3 blockers F1 (brief mis-pin) and F2 (five-term vocabulary) are closed, the P2 amends F3–F8 are applied, Robb 2024 is re-verified against printed pages 242–244, the firewall is clean on all student surfaces, and the build's only finding is the scoped-out diagram asset. One optional P2 wording nit is left in the professor brief (“helped cultivate”). The cold reviewer edited no file other than this receipt.
