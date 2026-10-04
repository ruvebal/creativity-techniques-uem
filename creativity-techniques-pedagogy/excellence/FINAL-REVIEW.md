# Final review — Excellence cascade

Built during the autopilot run; read this once at the end (AUTOPILOT.md §5).

## 1 · Run outcome

| Phase | Status | Tag | Notes |
| --- | --- | --- | --- |
| EX0 | DONE | `excellence/ex0` | Probe + baseline + provisional weights; cold review PASS (11 findings, 0 blocking) |
| EX1 | DONE | `excellence/ex1` | Contract + factual hotfix; cold review round 1 FAIL (F1 portfolio pass conditions), fixed; round 2 PASS |

## 2 · P0 decisions for you

- **Weights 60/40 (provisional)** — from the Diseño PDF 2025/26; confirm against the 2026–27 guía before release. `DECISION-EX0-GUIA.md`.
- **Release risk — concurrent writer on `main`:** at launch, uncommitted edits existed in the main checkout (U1, U2, U4 lessons; U4 deck). Committed changes are merged into integration before each phase (`gitflow.sh sync`); uncommitted ones are not.
- **Process note:** launch commit `a1da745` re-hydrated decks on `main` (3 more `.php` cache files; U3 now cycles 2 images over 10 slides) — the "no prebuild on main" rule was broken outside the cascade.
- **U4–U6 out of scope** (Amendment A1): only firewall-only edits (A2/F5). U4 issues found so far: 70/30 weight line (`docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md:38`, `evaluation_feed` front matter — EX1 1b leaves it for the U4 forge), uncited `ref-lucas-knotts-2026`, empty-licence asset, "Forge date" in rendered page.

## 3 · Per phase

### EX0 — readiness probe, baseline, weights

- Added `probe/excellence-probe.mjs` (Node stdlib), `evidence/baseline-EX0.json` (audited commit `1af967d`), `evidence/head-EX0.json` (launch HEAD), `DECISION-EX0-GUIA.md`.
- Local model: 1 call, `qwen2.5-coder:32b`, 3,733 tokens (probe draft; mostly rewritten after review of its bugs).
- Gate: 7 PASS / 0 FAIL (runner log `PHASE-EX0-VERIFY-LOG.md`). Cold review: PASS; reviewer reproduced both JSONs independently.
- Cascade amended: A1 (scope U1–U3, deck schema v2, `sync`), A2 (site-wide firewall, F2–F7 probe/EX3 fixes).
- Roll back: `gitflow.sh rollback 0`.

### EX1 — contract and factual hotfix

- 60/40 + pass conditions (≥ 5.0 final test, ≥ 50% activities, extraordinary-session rule per guía §7.2) on evaluation, track, How to Pass, portfolio; U1/U2 front-matter weights fixed; wrong-degree guía JSON renamed.
- U3 Cross misattribution relabelled Tao; U2: six hats complete (checked vs de Bono 1985 pp. 200–201), Osborn contradiction fixed, quotes replaced with page-verified ones, References 17 → 8 (Lehrer 2012 and "de Bono 1981" removed); U1: originality = rare answers (Chen), "trainable" qualified, two Lab exercises (Directory → autonomous work), no Workshop in sessions 1–3; Tao of Development openers replaced; Eckersall co-authors.
- **Pin-cite correction found:** de Bono 1985 map/route quote is printed p. **199** (was 211, a PDF index). Reviewer found Chen 2012 pins are also PDF indexes (EX6 re-verifies all, Amendment A3).
- Local models: 1 Thessia voice pass — **discarded** (invented citations); ~20 Athanor searches. Thessia has fabricated in every unsourced test so far.
- Full before/after table (39 rows): `PHASE-EX1-REPORT.md`. Roll back: `gitflow.sh rollback 1`.

### EX2 — publication firewall

- `_data` no longer published; the safety script gains 15 patterns, an HTML-only `profield` check and a `_site/_data` check. The new script fails on the pre-fix site (45 findings) and on a temporary `lesson-scribe` page; the old script passed the pre-fix site.
- 38 student-facing sentences rewritten in plain English (track page, hub, U1–U3, master lecture, methodology, bibliography, AI declaration, D1 brief, Tao notes). AI footers are now one sentence + `/ai-declaration/` link. UDIT/web-atelier links and Digital Creativity comparisons removed. The old special deck data is retired (redirect kept).
- Local model: 1 call, `qwen2.5:32b-instruct`, 848 tokens (wording ideas, partly used).
- Before/after table: `PHASE-EX2-REPORT.md`. Roll back: `gitflow.sh rollback 2`.

#### U4–U6 firewall-only edits

| File | Line | Before | After |
| --- | --- | --- | --- |
| `docs/lessons/en/creativity-techniques/u-4-workplace-application/index.md` | 192 | `*Forge date: 2026-10-04 · Studio: crea-comm.net*` | `*Date: 2026-10-04 · Studio: crea-comm.net*` |

U5 and U6 have no published pages, so they had no edits. **Left for the U4 forge (rendered, not caught by any pattern):** the editorial note says "the locators used in this pilot (402 and 440 in the extraction order)"; the authorship footer says "rebuilt against the U4 enrichment pack, Thinkertoys source adjudication"; and U4 has no `/ai-declaration/` link.
