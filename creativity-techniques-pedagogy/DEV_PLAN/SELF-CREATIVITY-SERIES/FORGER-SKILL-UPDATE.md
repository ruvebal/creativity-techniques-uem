# Proposed forger skill update (research preflight)

**Target:** CT `ct-unit-forge.mdc` §0 + studio `~/src/.cursor/skills/curriculum-forger` (and optionally `lesson-scribe` packet assembly).  
**Do not merge blindly** — board review; this cascade owns the script until promoted.

## Problem

Forgers assumed Athanor/vectors would surface Colzato; **Ahmes had it, vectors did not**. Uncoated bib (Castoriadis/Plotinus) looked “available” because PDFs exist under `bibliographies/`.

## Minimal hook

Before enrichment / forge of a theme pack:

```bash
python3 creativity-techniques-pedagogy/DEV_PLAN/SELF-CREATIVITY-SERIES/scripts/inventory_self_creativity_corpus.py
# generalize later → curriculum-forger/scripts/inventory_theme_corpus.py with TARGETS YAML
```

Fail closed if a planned authority is `bib_only` and the lesson claims VERIFIED Chicago.

## Checklist lines to add (draft)

1. Run theme inventory (Ahmes dirs + bib globs + node counts).  
2. `search_knowledge` + `retrieve_grounded_context` for discovery only; log ingest gaps.  
3. Exercises: catalogue search + Profield harvest; respect no-repeat.  
4. Media: queue seeds; never scholar portraits by default (CT media policy).  
5. Cold review via Ollama Qwen — never implementer self-audit.

## Promotion path

1. Keep script under this DEV_PLAN until one green Lesson A forge.  
2. Move generalized TARGETS YAML + script into `curriculum-forger/scripts/`.  
3. One paragraph in `ct-unit-forge.mdc` §0 pointing to the script.
