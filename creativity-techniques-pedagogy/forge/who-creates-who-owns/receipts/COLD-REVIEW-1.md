# COLD-REVIEW-1 — Who Creates, Who Owns, Who Scales?

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales`  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Verdict:** **PASS-WITH-AMENDS**

Editorial case framing, dual-lesson wiring, BIBLIO-GAP honesty on Edison historiography, Fuller comparison discipline, and deck role spines are largely sound. Publication safety fails on both student HTML lessons. Software transfer is concluding in lesson prose / professor brief but not in the Fuller deck order. Forge agent must amend before claiming Done / cold review #2.

---

## Surfaces reviewed

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `creativity-techniques-pedagogy/forge/who-creates-who-owns/SERIES.md` | Yes |
| 2 | `…/WHO-CREATES-WHO-OWNS-FORGE.mdc` | Yes |
| 3 | `…/EXERCISES-GAP.md` | Yes |
| 4 | `creativity-techniques-pedagogy/grounding/who-creates-who-owns/edison-fuller-series-research.pdf` (+ `.txt`) | Yes (Edison dossier; secondary web footnotes) |
| 5 | `docs/lessons/en/master-lectures/who-creates-edison/index.md` | Yes |
| 6 | `docs/lessons/en/master-lectures/who-creates-fuller/index.md` | Yes |
| 7 | `docs/tracks/en/uem/2627-ml/who-creates-edison/data/content.json` | Yes |
| 8 | `docs/tracks/en/uem/2627-ml/who-creates-fuller/data/content.json` | Yes |
| 9 | `docs/lessons/en/master-lectures/index.md` + `docs/_data/tracks.yml` `master_lectures` | Yes |
| — | Professor briefs `session-prompts/who-creates-{edison,fuller}.md` | Yes (C1–C3) |

**Runnable gate (evidence):** `npm run verify:publication` → exit non-zero; **12 findings**, of which **11** are on these two Master Lecture HTML files (1 unrelated diagram JSON path elsewhere).

```text
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal corpus name
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal evaluator status
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal authoring stamp
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal authoring pipeline (forge)
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal authoring agent
_site/lessons/en/master-lectures/who-creates-edison/index.html: internal source vault
_site/lessons/en/master-lectures/who-creates-fuller/index.html: internal corpus name
_site/lessons/en/master-lectures/who-creates-fuller/index.html: internal evaluator status
_site/lessons/en/master-lectures/who-creates-fuller/index.html: internal authoring stamp
_site/lessons/en/master-lectures/who-creates-fuller/index.html: internal authoring pipeline (forge)
_site/lessons/en/master-lectures/who-creates-fuller/index.html: internal source vault
```

Leak locus (built HTML): **Editorial note** + **AI-assisted authorship** footers — not the gated `curriculum-internal` comment.

---

## Safeguard checklist

| Safeguard | Status | Evidence |
| --- | --- | --- |
| Five Edison cases = attribution investigations, not five thefts | **OK** | Lesson + deck MC1/MC2; phonograph “strong contribution”; radio labelled counterexample; MPPC = market organisation / standards choke |
| Phonograph keeps contribution | **OK** | Lesson §2; deck prompt on MC2 |
| Radio = counterexample | **OK** | Lesson §4; deck; professor brief |
| MPPC = market control | **OK** | Lesson §5; deck MC5 |
| Fuller = comparison, not moral opposite | **OK** | Lesson opener; deck cover; professor brief |
| Integrity ≠ tensegrity | **OK** | Vocabulary lab table + deck `analysis_model` prompt |
| Software transfer concluding only | **PARTIAL** | Lesson prose + Fuller brief (80–90, after Lab) OK; **Fuller deck places software as `masterclass-6` before `lab_opener`** |
| Publication firewall (no Ahmes/DevIAC/Athanor in student HTML) | **FAIL** | `Ahmes` in both Editorial notes; gate also trips on vault / forge date / lesson-scribe / evaluator-safe |
| Chicago only for vaulted works; BIBLIO-GAP for Edison historiography | **OK (method)** | Public cites: Csikszentmihalyi 1996 chap. 3, Norman 2013, 226; case historiography taught as method without invented Chicago pins; Editorial declares gap (wording must scrub infra names — see F1) |
| Deck spine: cover → analysis_opener → analysis_model → ≤6 MC → lab_opener → 2 lab_exercise → outro | **OK (roles)** | Both decks: 6 masterclass; role sequence matches. Edison `analysis_model` content = five evidence categories (three levels sit on `analysis_opener`) — mild forge-label drift, not a spine break |
| C1–C3 hooks somewhere | **OK** | Edison brief: C2 labour + C3 GenAI inventor-story; Fuller brief: C1 ideology + C2 + C3 via software transfer. Student lessons carry C2 labour substance; C3 GenAI prompt is brief-only on Edison (acceptable if professor uses brief) |
| Exercise fit | **OK / documented gap** | `process-trail` linked as warm-up only; `EXERCISES-GAP.md` correctly states no public `authorship-map` / `value-flow-map` / `counter-design-ownership` / `dymaxion-without-genius` YAMLs yet; in-lesson Lab cards match forge temporary rule |

**Index / tracks wiring:** master-lectures index lists both lessons + decks; `tracks.yml` has `ML-WCOS-E` / `ML-WCOS-F` with `series: who-creates-who-owns-who-scales`. Deck `index.html` includes + `data-content-url` present.

**Research PDF:** Edison six-page secondary-web dossier; phonograph/radio/MPPC framing matches student method. Not Ahmes. Fuller content is not in this PDF (visual catalog only) — SERIES already flags BIBLIO-GAP for Fuller primaries.

---

## Findings

### F1 — P0 — blocks Done — Publication leaks in student Editorial / AI footers

**Evidence:** `npm run verify:publication` findings above; HTML excerpts name `Ahmes`, `vault` / `vaulted`, `evaluator-safe`, `forge date`, `lesson-scribe` (Edison). Sibling CPA Master Lecture Editorial/AI block is scrubbed and does not trip these patterns.

**Amend:** Rewrite **Editorial note** and **AI-assisted authorship** on both lessons to student-safe language (match CPA pattern): declare historiography / primary-excerpt gaps without corpus names, “vault,” “evaluator-safe,” “forge,” or `lesson-scribe`. Keep Declared gap / Missing evidence / Addressed-to-editor substance. Re-run `npm run verify:publication` until these two lesson HTML files are clean. (Unrelated `_site/assets/diagrams/d2-transposition-workflow.visual-check.json` path finding is out of series scope unless the same build gate is treated as global green.)

### F2 — P1 — blocks Done — Fuller deck: software transfer not concluding

**Evidence:** `who-creates-fuller/data/content.json` — `masterclass-6` = “Software transfer” then `lab_opener` → labs → outro. Professor brief timing puts software **after** Dymaxion Lab (80–90). Forge SERIES safeguard #6: software is concluding transfer. Lesson Markdown already places software after Lab.

**Amend:** Move software transfer off pre-lab masterclass. Prefer outro (or post-lab closing slide within allowed spine). Free the sixth masterclass for matrix / housing / comparison content already taught in prose, or drop to five masterclass slides. Align deck order with professor brief.

### F3 — P2 — does not alone block Done — Analysis triad unused on student surface

**Evidence:** Forge Product: “Reuse Analysis triad (language / medium / support) on *product stories*.” Grep of both lesson Markdown: no language/medium/support (or ES equivalents). C1–C3 and three-level frame are present; Analysis triad is not.

**Amend:** Add a short student or professor-brief hook mapping product story → language / medium / support (one paragraph or table row), or strike the claim from the forge Product line so the contract matches shipped surfaces.

### F4 — P2 — non-blocking — Edison `analysis_model` vs forge label

**Evidence:** Forge spine comment: `analysis_model` = three levels. Edison deck: `analysis_opener` = three levels; `analysis_model` = five evidence categories. Pedagogically coherent; label mismatch only.

**Amend (optional):** Swap headings/roles content so `analysis_model` carries the three-level diagram, or update forge comment to allow evidence categories on `analysis_model` for this series.

### F5 — P2 — non-blocking — Exercise public IDs still missing

**Evidence:** `EXERCISES-GAP.md`; Edison Lab links `process-trail` only as optional warm-up; Lab tasks are in-lesson cards for future `authorship-map`, `value-flow-map`, `counter-design-ownership`, `dymaxion-without-genius`.

**Amend (later forge, not cold-review blocker):** Forge public `exercises/*.yml` + hydrate when series stabilizes; until then keep temporary cards and the gap receipt honest (already is).

### F6 — note — Research grounding asymmetry

**Evidence:** `edison-fuller-series-research.pdf` is Edison-only; Fuller relies on vocabulary prompts + visual catalog + BIBLIO-GAP Editorial. SERIES already states this.

**Amend:** None required for Pass-1 if Editorial scrub (F1) keeps Fuller primary BIBLIO-GAP student-safe. Optional later: vaulted Fuller excerpts before claiming Chicago pins.

---

## Required amends (forge agent checklist)

1. **Scrub both lessons’ Editorial note + AI-assisted authorship** of Ahmes / vault / evaluator-safe / forge / lesson-scribe (and any other `verify:publication` denylist hits). Match CPA Master Lecture footer style.  
2. **Re-run `npm run verify:publication`** and confirm `_site/lessons/en/master-lectures/who-creates-{edison,fuller}/index.html` produce **zero** findings.  
3. **Reorder Fuller deck** so software transfer is concluding (after Lab / on outro), matching lesson prose + professor brief.  
4. **Either** add a one-line Analysis triad (language/medium/support) hook on product stories **or** remove that unused claim from `WHO-CREATES-WHO-OWNS-FORGE.mdc`.  
5. Optional: align Edison `analysis_model` content with forge comment (F4).  
6. Do **not** invent Chicago pins for Edison case historiography or Fuller primaries until vaulted.  
7. After amends: cold review #2.

---

## What stayed green (do not “fix”)

- Five-case typology (system / contribution / scale / radio counterexample / MPPC market).  
- Two-map separation; counter-design “who pays.”  
- Fuller comparison matrix + integrity ≠ tensegrity.  
- Public Chicago limited to Csikszentmihalyi 1996 + Norman 2013 (`references.yml` keys present).  
- Index + `tracks.yml` wiring; geometrical Pass-1 decks; professor C1–C3 hooks.  
- Honest exercise gap documentation.

---

## Verdict line

**PASS-WITH-AMENDS** — teachable method spine and editorial safeguards hold; **F1 + F2 must be applied** before Done / cold review #2. Cold reviewer did not edit student lesson files.
