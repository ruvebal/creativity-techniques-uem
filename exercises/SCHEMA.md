# Public exercises schema (data-as-code)

Source files: `exercises/<ex-id>.yml`  
Hydrate: `npm run hydrate:exercises` → `docs/exercises/en/<ex-id>/index.html` · catalogue `index.html` · `docs/_data/exercises.yml` (HTML, not Markdown — kramdown mangled field-index markup)

```yaml
id: kebab-case                    # public ex-id · path /exercises/en/<id>/
title: string
urn: urn:in-practice:exercise:…   # private catalogue key (index may omit)
technique_id: string              # CANONICAL-TECHNIQUES.yml id
status: pilot|ready
categories:                       # DH-facing
  - urn:in-practice:concept:…     # preferred
  - family:generation|selection|framing|development|reflection|embodied
fieldlex: []                      # optional ct:concept ids
units: []                         # U1–U6 hints
summary: string                   # 1–3 sentences, student-facing
time_min: number
group: string
materials: []
requirements: []                  # access, consent, prior craft
accessibility: string
steps: []                         # classroom procedure (adaptation OK)
adaptation: string                # what the professor changed vs source
quote:
  chicago: "(Author Year, page)"  # from live Ahmes --cite
  verbatim: string                # see Quote length (below)
  ref_key: string                 # docs/_data/references.yml key
portfolio_trace: string
judged_by: string                 # optional rubric pointer text
graphic:                          # one exercise-specific semantic diagram
  kind: string                    # semantic composition, e.g. fan|viewport|trail
  alt: string                     # concise, informative accessibility text
  caption: string                 # student-facing interpretation, not provenance
  labels: []                      # optional diagram labels; source steps remain in control
ahmes:                            # NEVER copied into public _data JSON
  document_coat: string
  vault_slug: string
  nodes:
    - node_id: uuid
      page_index: number
      chicago: string
      role: quote|support
```

### Quote length (scholarly teaching site)

Target a **complete idea unit**, not a slogan and not a chapter:

| Bound | Guidance |
| --- | --- |
| **Aim** | ~100–180 words (~700–1100 characters) — one argumentative paragraph or a short block with `[…]` elisions |
| **Hard taste cap** | ~200 words on one page / contiguous page span; Chicago treats ≥100 words as a block quote |
| **Do not** | Paste a whole section, all ten Dogme rules, or enough text that the datasheet substitutes for buying/reading the book |

Grounding: Spanish *derecho de cita* (TRLPI art. 32) and US fair-use teaching use both require **justified length**, attribution, and non-substitutive purpose — there is no fixed legal word count. House rule: longest coherent warrant that still teaches under Chicago + citation etiquette.

**Publication:** `ahmes` is emitted only inside Jekyll `{% comment %}` in the page source. Quotes must be substrings of the cited node(s) (joined by `[…]` when truncated). List every node that contributed text under `ahmes.nodes`.

**Semantic graphics:** `graphic` is required for every public exercise. The
SVG is regenerated from the exercise YAML and renderer into immutable,
content-addressed SVG and PNG files. The page exposes an informative `alt` and
caption; private graph/provenance data never enters public YAML. Graph outputs
are discovery, not citations or claims. Hydration fails closed if an exercise
has no matching graphic record.
