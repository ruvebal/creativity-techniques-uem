# Final review — Excellence cascade

Built during the autopilot run; read this once at the end (AUTOPILOT.md §5).

## 1 · Run outcome

| Phase | Status | Tag | Notes |
| --- | --- | --- | --- |
| EX0 | DONE | `excellence/ex0` | Probe + baseline + provisional weights; cold review PASS (11 findings, 0 blocking) |

## 2 · P0 decisions for you

- **Weights 60/40 (provisional)** — from the Diseño PDF 2025/26; confirm against the 2026–27 guía before release. `DECISION-EX0-GUIA.md`.
- **Release risk — concurrent writer on `main`:** at launch, uncommitted edits existed in the main checkout (U1, U2, U4 lessons; U4 deck). Committed changes are merged into integration before each phase (`gitflow.sh sync`); uncommitted ones are not.
- **Process note:** launch commit `a1da745` re-hydrated decks on `main` (3 more `.php` cache files; U3 now cycles 2 images over 10 slides) — the "no prebuild on main" rule was broken outside the cascade.
- **U4–U6 out of scope** (Amendment A1): only firewall-only edits (A2/F5). U4 issues found so far: 70/30 weight line, uncited `ref-lucas-knotts-2026`, empty-licence asset, "Forge date" in rendered page.

## 3 · Per phase

### EX0 — readiness probe, baseline, weights

- Added `probe/excellence-probe.mjs` (Node stdlib), `evidence/baseline-EX0.json` (audited commit `1af967d`), `evidence/head-EX0.json` (launch HEAD), `DECISION-EX0-GUIA.md`.
- Local model: 1 call, `qwen2.5-coder:32b`, 3,733 tokens (probe draft; mostly rewritten after review of its bugs).
- Gate: 7 PASS / 0 FAIL (runner log `PHASE-EX0-VERIFY-LOG.md`). Cold review: PASS; reviewer reproduced both JSONs independently.
- Cascade amended: A1 (scope U1–U3, deck schema v2, `sync`), A2 (site-wide firewall, F2–F7 probe/EX3 fixes).
- Roll back: `gitflow.sh rollback 0`.
