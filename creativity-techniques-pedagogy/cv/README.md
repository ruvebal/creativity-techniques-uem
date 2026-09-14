# CV & official guides — Técnicas de Creatividad

Institutional guías (PDF + JSON clones) and CV drafts. **Do not invent hours/weights.**

| Path | Role |
| ---- | ---- |
| [`sources/9990002301.pdf`](./sources/9990002301.pdf) | Official PDF copy (2026-09-11) |
| [`sources/ahmes-vault-9990002301`](./sources/ahmes-vault-9990002301) | Symlink → Ahmes vault `9990002301_3cd91cef` |
| [`guides/oficial/9990002301.pdf`](./guides/oficial/9990002301.pdf) | Forge-adjacent PDF copy |
| [`guides/guia-tecnicas-de-creatividad-diseno-2025-26.json`](./guides/guia-tecnicas-de-creatividad-diseno-2025-26.json) | **Working CONTENIDOS contract** — Grado en Diseño · 6 units (profield) |
| [`guides/9990002301-unicrawler-2026-27.json`](./guides/9990002301-unicrawler-2026-27.json) | Compare-only scrape — **Grado en Diseño de Videojuegos · 4 units** |
| [`../oficial-guia-framework.mdc`](../oficial-guia-framework.mdc) | How pedagogy must respect guía fields |
| [`UNIT-PLAN.md`](./UNIT-PLAN.md) | Unit IDs U1–U6 bound to Diseño CONTENIDOS |

## Authority rule (degree variants)

`9990002301` unicrawler output is currently the **Videojuegos** guía (4 unidades). Until a Diseño-specific 2026-27 scrape/PDF reconcile exists, **forge against the Diseño 2025-26 JSON + the ingested PDF text** — then write `guia-tecnicas-de-creatividad-diseno-2026-27.json` only after page-level reconcile.

## Provenance

- **Diseño clone:** 2026-09-11 from `~/src/profield/fields/creativity-techniques/guia-tecnicas-de-creatividad-diseno-2025-26.json`
- **Unicrawler:** 2026-09-11 from `~/src/unicrawler/output/guides/tecnicas-de-creatividad.json` (Videojuegos)
- **PDF ingest:** Ahmes `document_id` `936c6463-d112-5950-b1a5-e1c400da9ddc` · log `sources/9990002301.ahmes-ingest.log`

```bash
# After a Diseño-specific unicrawler scrape:
cp ~/src/unicrawler/output/guides/<diseno-file>.json \
   creativity-techniques-pedagogy/cv/guides/guia-tecnicas-de-creatividad-diseno-2026-27.json
# Re-check hour/weight sums in oficial-guia-framework.mdc
```

Hour/weight claims cite the PDF (page) or the working JSON clone — never a vector snippet.
