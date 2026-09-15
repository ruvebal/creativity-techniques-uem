# PHASE T4 — Evaluate · integrate

**Depends on:** T3 records and/or human T2 drafts

## Evaluate

For each candidate:

| Verdict | Action |
| ------- | ------ |
| **accept** | Human may lightly edit → `integrated.md` in record; `status: accepted` |
| **rewrite** | Edit; optional second Thessia pass with same tension id |
| **reject** | `status: rejected`; keep raw for fine-tuning team |

Acceptance tests:

1. Teenager can read aloud without cringe.  
2. Form is pure (haiku is three lines; koan has silence).  
3. Teaches the tension without resolving it falsely.  
4. Safe for `/tao/` and optional slide invent.

## Integrate

1. Upsert accepted lines into **`docs/tao/data/quotes.json`** (chapter `id` + quote objects) **with** `lexicum.concepts`, `semantic_tags` (CIDOC / AAT / DCTERMS / SKOS), `creativity_areas`, and `field_discussions` ids.  
2. Confirm `/tao/` hydrates chips + thesaurus links (`tao-quotes.js`).  
3. For slide-eligible accepts: set slideshow invent `citation.href` → `{{ '/tao/#<quote-or-chapter-id>' | relative_url }}` and `citation.label: (Tao of Creativity)`; reuse the same `semantic_tags` on the slide when present.  
4. Run publication verify.  
5. Continue to **T4b** to stage TTOD proposals (`~/src/ttod/proposals/`).

## Fail closed

- Integrating rejected or unreviewed Thessia raw → defect.  
- Firewall fail → revert public edit.  
- Editing `ttod.yml` by hand → defect (use T4b only).
