# Grounding receipt — Creativity Techniques (UEM)

**Date:** 2026-09-11  
**Course:** Técnicas de Creatividad · Grado en Diseño · 6 ECTS · S1  
**Mandate:** Discover in vectors / Athanor · **cite Ahmes nodes only** · publication firewall on student HTML.

---

## Curriculum contract (official)

| Artefact | Path |
| -------- | ---- |
| PDF source (repo) | `creativity-techniques-pedagogy/cv/sources/9990002301.pdf` |
| PDF official tree | `~/projects/.../26-27/guias_docentes/9990002301.pdf` |
| Ahmes vault | `~/ahmes-library/scholar/documents/9990002301_3cd91cef/` |
| `document_id` | `936c6463-d112-5950-b1a5-e1c400da9ddc` |
| `extraction.db` | `…/9990002301_3cd91cef/extract/extraction.db` |
| JSON contract (2025/26 Design) | `cv/guides/guia-tecnicas-de-creatividad-diseno-2025-26.json` (**working**) |
| Unicrawler 26/27 scrape | `cv/guides/9990002301-unicrawler-2026-27.json` — **Videojuegos · 4 units**; compare only |

Ingest log: `cv/sources/9990002301.ahmes-ingest.log`  
Note: institutional guía PDFs often lack DOI/ISBN — expect `[BIBLIO-GAP]` on cite resolver until meta coats are enriched for teaching use. Contениdos authority remains the PDF + JSON clone, not vector snippets.

---

## Scholarly bibliography (mandatory grounding)

| Layer | Location | Status |
| ----- | -------- | ------ |
| File corpus | `~/projects/ruvebal/scholar/bibliographies/creativity` | Ready (operator corpus) |
| Ahmes vaults | `~/ahmes-library/scholar/documents/*creativ*` (+ Creative Confidence, Chen, Craft, Persaud, Beghetto, Feldman, …) | Extracted |
| DevIAC vectors | `project_slug=profield-creativity-techniques` · `knowledge_scope=field_prospection` | Live (smoke-tested 2026-09-11) |
| Profield panorama run | `~/src/profield/runs/creativity-techniques/20260909/` | Pass-1 edited; Pass-3 tool-verify still owed |

**Smoke queries returning cite-grade candidates (discovery only):** Guilford divergent-thinking lineage (Chen); creative confidence / design-thinking method (Kelley); reflective / creative capability framing (Craft); Beghetto creative agency.

Do **not** cite MCP/vector snippets. Resolve page + `ahmes query --cite … --style chicago-author-date` before lesson insertion.

---

## Lexicum / controlled vocabulary

| Surface | Path |
| ------- | ---- |
| Fieldlex YAML (source of truth) | `~/src/fieldlex/fields/creativity_techniques/` (76 concepts · 7 subfields) |
| Generated SKOS | `~/src/fieldlex/dist/creativity_techniques.{ttl,jsonld,md}` |
| Profield harvest lexicum | `~/src/profield/runs/creativity-techniques/20260909/lexicum.yaml` |
| Linked here | `grounding/lexicum.yaml` → symlink to profield harvest |
| Fieldlex review links | `grounding/fieldlex/` |

Validate/build: `cd ~/src/fieldlex && make validate && make build`

---

## Images (Media Prospector)

| Artefact | Path |
| -------- | ---- |
| Unit vocabulary | `~/src/profield/fields/media-prospector/media-prospector-ct.yaml` |
| Query queue (178 seeds) | `…/20260909/media-query-queue.yaml` → `grounding/media-query-queue.yaml` |
| Research note | `…/20260909/IMAGE-SOURCES.md` → `grounding/IMAGE-SOURCES.md` |
| U2 sample discovery | `~/src/profield/runs/media-prospector/CT/U2/20260911T130000Z/` |

**Discipline:** discovery ≠ clearance. MP7 queue→prospect CLI still pending; full 9-unit cascade not authorized by this receipt.

---

## Link map (this repo)

```text
creativity-techniques-uem/
├── docs/                          # published Jekyll
└── creativity-techniques-pedagogy/
    ├── cv/sources/9990002301.pdf + ahmes-vault symlink
    ├── cv/guides/*.json
    └── grounding/
        ├── lexicum.yaml           → profield run
        ├── IMAGE-SOURCES.md       → profield run
        ├── media-query-queue.yaml → profield run
        ├── fieldlex/              → fieldlex src + dist
        └── GROUNDING-RECEIPT.md   ← this file
```
