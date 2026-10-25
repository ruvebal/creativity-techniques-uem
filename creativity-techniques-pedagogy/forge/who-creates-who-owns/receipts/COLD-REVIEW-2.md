# COLD-REVIEW-2 — Who Creates, Who Owns, Who Scales?

**Date:** 2026-10-25  
**Branch:** `forge/who-creates-who-owns-who-scales`  
**Repo:** `creativity-techniques-uem`  
**Reviewer role:** cascade cold reviewer (no implementer memory; report only)  
**Prior receipt:** `COLD-REVIEW-1.md` (PASS-WITH-AMENDS)  
**Verdict:** **PASS**

CR1 blockers F1–F2 and required amends F3–F4 are closed with runnable evidence. Student HTML for both Master Lectures is clean under `verify:publication`. Pass-1 series forge is Done.

---

## Amend checklist (from COLD-REVIEW-1)

| # | Amend | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Scrub Editorial + AI footers (Ahmes / vault / evaluator-safe / forge / lesson-scribe) | **OK** | Both lessons’ public footers are student-safe; infra names remain only inside gated `curriculum-internal` comments |
| 2 | `verify:publication` zero findings on who-creates-{edison,fuller} HTML | **OK** | Gate run below; denylist grep on built HTML clean |
| 3 | Fuller deck: software concluding (outro / after Lab) | **OK** | `masterclass-6` = “What the public story omits”; `outro` = “Transfer · one digital product” |
| 4 | Analysis triad on student surface **or** strike forge claim | **OK** | Both lessons state language / medium / support on product (and housing) *stories* |
| 5 | Optional: forge `analysis_model` comment | **OK** | `WHO-CREATES-WHO-OWNS-FORGE.mdc` spine: `analysis_model` = five evidence categories (Edison) or vocabulary lab (Fuller) |
| 6 | No invented Chicago pins for historiography / Fuller primaries | **OK** | Public cites remain Csikszentmihalyi 1996 + Norman 2013; Editorial Declared gaps honest |
| 7 | Cold review #2 | **This receipt** | — |

---

## Surfaces re-checked

| # | Path | Reviewed |
| --- | --- | --- |
| 1 | `docs/lessons/en/master-lectures/who-creates-edison/index.md` | Yes |
| 2 | `docs/lessons/en/master-lectures/who-creates-fuller/index.md` | Yes |
| 3 | `docs/tracks/en/uem/2627-ml/who-creates-fuller/data/content.json` | Yes |
| 4 | `docs/tracks/en/uem/2627-ml/who-creates-edison/data/content.json` | Yes (spine roles) |
| 5 | `creativity-techniques-pedagogy/forge/who-creates-who-owns/WHO-CREATES-WHO-OWNS-FORGE.mdc` | Yes (`analysis_model` comment) |
| 6 | Built `_site/lessons/en/master-lectures/who-creates-{edison,fuller}/index.html` | Yes |

---

## Runnable gate (evidence)

```text
$ npm run verify:publication
Publication safety failed (1 finding(s)):
_site/assets/diagrams/d2-transposition-workflow.visual-check.json: local filesystem path
EXIT:1
```

**who-creates findings:** none (grep of gate output for `who-creates-edison` / `who-creates-fuller` → empty).

**HTML denylist scan** (`rg -i 'Ahmes|DevIAC|Athanor|evaluator-safe|lesson-scribe|vaulted|source vault|authoring pipeline \(forge\)|forge date'`):

```text
_site/lessons/en/master-lectures/who-creates-edison/index.html → (clean)
_site/lessons/en/master-lectures/who-creates-fuller/index.html → (clean)
```

Unrelated `_site/assets/diagrams/d2-transposition-workflow.visual-check.json` path finding is **out of series scope** (same note as CR1). Series Done does not require global green on that asset.

---

## Safeguard re-check (CR1 greens held)

| Safeguard | Status |
| --- | --- |
| Five Edison cases = investigations, not five thefts | **OK** |
| Phonograph keeps contribution | **OK** |
| Radio = counterexample | **OK** |
| MPPC = market organisation / standards choke | **OK** |
| Fuller = comparison, not moral opposite | **OK** |
| Integrity ≠ tensegrity | **OK** |
| Software transfer concluding only | **OK** (lesson after Lab; deck on `outro`) |
| Publication firewall on student HTML | **OK** |
| Chicago only for vaulted works; BIBLIO-GAP honest | **OK** |
| Deck spine roles | **OK** (both decks; `analysis_model` content now matches forge comment) |
| Analysis triad on product stories | **OK** |
| Index + `tracks.yml` wiring | **OK** (`ML-WCOS-E` / `ML-WCOS-F`) |
| Exercise public IDs still missing | **OK / documented gap** (unchanged; non-blocking) |
| Research grounding asymmetry (Edison PDF / Fuller BIBLIO-GAP) | **OK / documented** (unchanged; non-blocking) |

---

## Findings

**None that block Done.**

Carried non-blockers (unchanged from CR1 F5–F6; do not reopen as CR2 fail):

- Public `exercises/*.yml` for authorship-map / value-flow-map / counter-design-ownership / dymaxion-without-genius still future work; temporary Lab cards + `EXERCISES-GAP.md` remain honest.
- Fuller primary excerpts still BIBLIO-GAP until vaulted; Editorial declares it student-safely.

---

## Verdict line

**PASS** — CR1 amends applied and verified. **Done for pass-1 series forge** (Who Creates, Who Owns, Who Scales?). Cold reviewer did not edit student lesson or deck files.
