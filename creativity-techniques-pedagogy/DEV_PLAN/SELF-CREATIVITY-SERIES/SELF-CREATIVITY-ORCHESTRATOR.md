# Self–Creativity Series — orchestrator

## Master paste

```
Cascade: creativity-techniques-pedagogy/DEV_PLAN/SELF-CREATIVITY-SERIES/
Read INDEX.md + SELF-CREATIVITY-ORCHESTRATOR.md + PEDAGOGICAL-ORGANIZATION.md
Grounding: creativity-techniques-pedagogy/grounding/ (COMBINE-RELATE-DISCUSS + EVIDENCE-MATRIX)
Discover: DevIAC search_knowledge + retrieve_grounded_context (never cite snippets)
Cite: Ahmes extraction.db nodes only after page read
Preflight: python3 …/scripts/inventory_self_creativity_corpus.py
Forge: ct-unit-forge.mdc + SESSION-RHYTHM + exercises-forger + in-practice no-repeat
Cold review / EN↔ES: Ollama Qwen only (local-qwen-cold-review-translate)
Branch: forge/self-creativity-meditation-series (or forge/self-creativity-*)
Out of scope: fake CONTENIDOS; cloud LLM; Castoriadis/Plotinus cites before extract; media without accept
```

## Resume rule

| Report status | Action |
| ------------- | ------ |
| `DONE` | Skip to next PENDING |
| `PARTIAL` | Finish listed remaining items |
| `VERIFYING` | Run gates; write report; **Qwen cold review** |
| `BLOCKED` | Stop; record blocker (e.g. Ahmes extract, Postgres down) |
| `IN_PROGRESS` | Continue; do not duplicate |

## Hard constraints

1. **Retrieve vs cite** — vectors/graph = discovery; Ahmes node + page = only citable layer (`grounding/README.md`).
2. **Colzato already in U2** — series deepens; Lab must not repeat the same `open-monitoring-warm-up` + 6-3-5 pairing without a materially different operation.
3. **Dose honesty** — Colzato used 35 min OM inside 45 min sessions; classroom 3-min warm-up is **untested** (EX7/EX8 cold reviews). Say so on cards.
4. **Embodied Opt-out** — any `open-monitoring-warm-up` / breath work needs Opt-out line.
5. **Uncoated bib** — Castoriadis (14+ PDFs), Plotinus (11+), Corbin: **bib_only** until SC1.
6. **Commit** only on feature branches; no force-push to `main`; commit only when human asks.
7. **Localhost review** before marking forge phases DONE.

## Closing protocol

VERIFYING → `PHASE-SCn-REPORT.md` with counts → cold review via Ollama Qwen → file `PHASE-SCn-COLD-REVIEW.md` → amend-on-surprise → human localhost check for student surfaces.
