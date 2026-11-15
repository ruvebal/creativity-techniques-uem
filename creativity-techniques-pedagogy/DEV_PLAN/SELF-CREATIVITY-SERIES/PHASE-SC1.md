# PHASE-SC1 — Ahmes extract (uncoated trilogy coats)

**Status:** PENDING  
**Gate:** `extraction.db` for Castoriadis (*Imaginary Institution* priority), Plotinus (Enneads / arts-relevant), Corbin (imaginal) under Ahmes scholar library.

## Do

1. Prefer PDFs already in `~/projects/ruvebal/scholar/bibliographies/{castoriadis_cornelius,plotino,corbin-henry}/`.
2. `ahmes ingest` (or batch) with `--save-db --treeshake` into scholar library — same pattern as EX6 Colzato ingest.
3. Re-run `scripts/inventory_self_creativity_corpus.py` → status flip `bib_only` → `extracted`.
4. Optional: DevIAC ingest Colzato + new extracts so vectors stop missing `a9393760`.
5. File `PHASE-SC1-REPORT.md` with coat hashes and node counts.

## Fail closed

- No student Chicago from Castoriadis/Plotinus/Corbin until nodes + page read.
- Do not cite vector snippets from alchemy neighbors as if they were Castoriadis.

## Resume

If blocked on disk/time: ship Lesson A+B (SC3–SC4); hold SC5.
