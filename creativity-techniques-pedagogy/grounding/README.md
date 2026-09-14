# Grounding — creativity techniques authorities

Edited maps and directories for Técnicas de Creatividad. **Not published** on GitHub Pages.

See parent [`../README.mdc`](../README.mdc) for layout and re-sync commands.

| File | Role |
| ---- | ---- |
| `pass1.edited.md` | Symlink → Profield Pass-1 field panorama (must stay present) |
| `COMBINE-RELATE-DISCUSS.md` | DH synthesis: fieldlex × Pass-1 × DevIAC discovery → forger |
| `EVIDENCE-MATRIX.md` | Per-unit cite gate (candidate / gap / exact) |
| `lexicum.yaml` | Symlink → profield harvest lexicum |
| `fieldlex/` | Symlinks → fieldlex YAML + SKOS exports (76 concepts) |
| `IMAGE-SOURCES.md` | Symlink → media research note |
| `media-query-queue.yaml` | Symlink → 178-seed CT image query queue |
| `PROFIELD-SYNC.json` | Sync metadata |
| `GROUNDING-RECEIPT.md` | Curriculum + bibliography + media audit receipt |

**Public field surfaces (repo root, hydrated into `docs/` on build):**

| Source | Public routes |
| ------ | ------------- |
| `../../directory/` | `/directory/en/` — **one page**, `#prizes` … `#figures` |
| `../../methods/` | `/methods/en/` — practice-learning only, `#` sections |
| `fieldlex/` via hydrate | `/lexicum/en/` — **one page**, `#scheme` + `#scheme--concept` |

**Lessons forger feed:** enrichment packs in [`../forge/unit-enrichment/`](../forge/unit-enrichment/) consume this grounding layer first (`UNIT-THEME-ENRICHMENT.mdc` → `ct-unit-forge.mdc`).

## Canonical lexicum paths

| Source | Path |
| ------ | ---- |
| Fieldlex field | `/Users/ruvebal/src/fieldlex/fields/creativity_techniques/` |
| Profield run | `~/src/profield/runs/creativity-techniques/20260909/lexicum.yaml` |
| Linked here | `grounding/lexicum.yaml` |

```bash
cd ~/src/fieldlex && make validate && make build
```

## Media prospector

| Config | Path |
| ------ | ---- |
| Field YAML | `~/src/profield/fields/media-prospector/media-prospector-ct.yaml` |
| Query queue | `grounding/media-query-queue.yaml` |
| Runs | `~/src/profield/runs/media-prospector/` (+ CT/U2 sample) |

See [`IMAGE-SOURCES.md`](./IMAGE-SOURCES.md) and [`GROUNDING-RECEIPT.md`](./GROUNDING-RECEIPT.md).

## Scholarly bibliography

Ahmes/Athanor vault: `~/projects/ruvebal/scholar/bibliographies/creativity`

### Retrieval vs citation — durable rule

| Layer | Role | Cite? |
| ----- | ---- | ----- |
| **Ahmes vault** — `extraction.db` node + page | Authoritative claim + quote | ✅ **Yes — only citable layer** |
| **DevIAC vectors** — discovery (DERIVED) | Fast semantic search | ❌ Never cite a snippet |
| **Athanor inject + search** | Cite-grade index over fission nodes | ❌ Not evidence itself |

**Discover in vectors / Athanor, cite from Ahmes nodes only.**

Publication firewall: student HTML must not contain Ahmes/Athanor/DevIAC names, resolver labels, IDs, or local paths. Full provenance stays in switch-gated `curriculum-internal` comments in lesson Markdown (same pattern as `digital-creativity-uem`).

### Classical-didactics axis

Unit/CV design claims about *how people learn* resolve against `profield-didactics` — never blended with domain-evidence rows for creativity techniques.
