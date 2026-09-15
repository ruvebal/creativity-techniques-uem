# The Tao of Creativity — forge cascade

**Course:** Creativity Techniques (UEM) · English-only student surface  
**Sibling:** [DC Tao of HCD](https://ruvebal.github.io/digital-creativity-uem/tao/) (`digital-creativity-uem/docs/tao/`)  
**Public target:** `docs/tao/` → `/tao/`  
**Forger:** [`../TAO-OF-CREATIVITY-FORGE.mdc`](../TAO-OF-CREATIVITY-FORGE.mdc)  
**Orchestrator:** [`TECHNICAL-DIRECTOR-CASCADE.md`](./TECHNICAL-DIRECTOR-CASCADE.md)  
**Status:** plan forged 2026-09-15 — execute before / beside unit lessons (aphorisms may ship ahead of U3–U6 prose)

---

## Why this exists

Slideshow golden rule 3 already allows **Tao invents** when no brief Ahmes match exists (`quote_origin: tao_invented`, cite `(Tao of Creativity)`). Until now the public surface for those invents did not exist. This cascade builds the monograph **and** the orchestrated loop that keeps invents honest: field tensions first, poetic form second, Thessia as workload (not author-of-record), evaluation, integration, fine-tuning report.

Voice law (permitted): **Lao Tzu compression** + **Yoda inversion** for máximas when the line gains force; haiku stays seasonal/concrete; koan stays dialogue + silence. Never disguise invents as scholarly quotation.

---

## Artefacts

| Artefact | Path | Audience |
| -------- | ---- | -------- |
| **JSON source of truth (public)** | `docs/tao/data/quotes.json` → `/tao/data/quotes.json` | Cohort + forgers |
| **Website endpoint** | `docs/tao/index.html` → `/tao/` (hydrates from JSON via `tao-quotes.js`) | Cohort |
| Quote include (optional static) | `docs/_includes/tao-quote.html` | Site |
| Forger | `forge/TAO-OF-CREATIVITY-FORGE.mdc` | Agents |
| Tension ledger | `forge/TAO-OF-CREATIVITY/ledger/tensions.yml` | Studio |
| Candidate quotes | `forge/TAO-OF-CREATIVITY/ledger/candidates.yml` | Studio |
| **TTOD proposals** | `~/src/ttod/proposals/<uuid>.json` via `cli.py proposal create` | Human review in TTOD |
| Thessia records | `~/src/deviac/fine-tuning/thessia-tuning-memory/<date>-tao-ct-*/` | Fine-tuning |
| Team report | `~/src/deviac/fine-tuning/thessia-tuning-memory/registries/CT-TAO-*-REPORT.md` | Fine-tuning team |

Publication firewall: no Ahmes / Athanor / DevIAC / evaluator_safe / coat IDs on `/tao/` or in `quotes.json`. Provenance stays gated in pedagogy ledger + tuning-memory. **Never cite a pending TTOD proposal id in lessons** until `proposal accept` lands it in `ttod.yml`.


---

## Phase map (resume here)

| Phase | File | Gate | Done when |
| ----- | ---- | ---- | --------- |
| **T0** Inventory | [`PHASE-T0-INVENTORY.md`](./PHASE-T0-INVENTORY.md) | Human skim | `ledger/tensions.yml` seeded from COMBINE §3 + fieldlex + U1–U6 MAIN-IDEAS |
| **T1** Tension cards | [`PHASE-T1-TENSION-CARDS.md`](./PHASE-T1-TENSION-CARDS.md) | Cold review | Each open tension has form assignment (haiku \| koan \| máxima \| yoda) |
| **T2** Form delegation | [`PHASE-T2-FORM-DELEGATION.md`](./PHASE-T2-FORM-DELEGATION.md) | Human voice pass | Draft lines in `candidates.yml` (status=`draft`) |
| **T3** Thessia workload | [`PHASE-T3-THESSIA-WORKLOAD.md`](./PHASE-T3-THESSIA-WORKLOAD.md) | Citation gate N/A (invents) | Tuning-memory records per batch; `thessia-raw.md` preserved |
| **T4** Evaluate · integrate | [`PHASE-T4-EVALUATE-INTEGRATE.md`](./PHASE-T4-EVALUATE-INTEGRATE.md) | `verify:publication` | Accepted lines in `quotes.json`; `/tao/` hydrates; slideshow `citation.href` → `/tao/#…` |
| **T4b** TTOD propose | [`PHASE-T4b-TTOD-PROPOSALS.md`](./PHASE-T4b-TTOD-PROPOSALS.md) | Human skim | Each accepted invent staged as `~/src/ttod/proposals/<uuid>.json` (`cli.py proposal create`) — **not** merged |
| **T5** Fine-tuning report | [`PHASE-T5-FINE-TUNING-REPORT.md`](./PHASE-T5-FINE-TUNING-REPORT.md) | Team read | Registry report emitted; cascade status `DONE` or `BLOCKED` |

**Resume rule:** open INDEX → read last `PHASE-Tn-REPORT.md` status → re-enter that phase or the next. Do not skip T0→T1 when inventing for a new unit.

---

## Orchestrated loop (canonical)

```text
profield tendencies (COMBINE · fieldlex · vector discovery)
        ×
consolidated ideas (MAIN-IDEAS.yml · EVIDENCE-MATRIX · forged lesson claims)
        │
        ▼
   contradiction / open blank
        │
        ├─▶ haiku      (seasonal · concrete · 3 lines)
        ├─▶ koan       (master/student · productive silence)
        ├─▶ máxima     (Lao compression)
        └─▶ yoda       (inversion permitted — still a máxima subclass)
        │
        ▼
   quote-valid candidates → Thessia workload (local Ollama thessia-scholar-v3)
        │                     BRIEF = tension + form + voice law + anti-cite rule
        ▼
   evaluate (human): keep / rewrite / reject
        │
        ├─▶ integrate → docs/tao/data/quotes.json → /tao/ endpoint + slide invents
        ├─▶ propose → ~/src/ttod/proposals/*.json  (cli.py proposal create; human accept later)
        └─▶ report → thessia-tuning-memory/registries/ (fine-tuning team)
```

### Website endpoint (binding)

| URL | Role |
| --- | ---- |
| `/tao/` | Student monograph shell — **fetches** `/tao/data/quotes.json` (same visual family as DC `/tao/`) |
| `/tao/data/quotes.json` | Public JSON API / source of truth for the page and for TTOD proposal batches |

Do **not** hand-maintain a second copy of quotes in Markdown. Ledger → `quotes.json` → page. Optional static include remains for lesson embeds only.

Thessia **does not invent scholarly citations**. For Tao work the BRIEF forbids `(Author, Year)` entirely; invents cite only `(Tao of Creativity)`.

---

## Chapter spine (aligned to CONTENIDOS + C1–C3)

| Ch | Id | Theme | Unit / layer home |
| -- | -- | ----- | ----------------- |
| I | `open-close` | Open, then close | U1 |
| II | `unclear-problem` | Name the unclear problem | U1 |
| III | `fluency-flexibility` | Many kinds, not many clones | U2 |
| IV | `selection-taste` | Closing is craft | U2–U3 |
| V | `tools-not-scripts` | Techniques serve judgement | U2–U4 |
| VI | `language-medium-support` | Circulation of meaning | D2 / all |
| VII | `workplace-labour` | Unpaid ideation · hustle | U4 · C2 |
| VIII | `technology-genai` | Co-creation vs originality theatre | U5 · C3 |
| IX | `confidence-agency` | Method rehearsal, not gift myth | U6 |
| X | `studio-critique` | Defence, silence, next brief | D1–D3 |

Seed monograph may ship chapters with 3–5 forms each; later phases deepen rather than rewrite the spine.

---

## Metadata law (quotes.json · Ahmes-compatible DH)

Public invents carry dual-surface descriptors (student-safe; no corpus product names):

| Block | Purpose |
| ----- | ------- |
| `thesaurus` | Points at course `lexfield-public/v1` (`ct:` namespace) |
| `creativity_areas` | Seven fieldlex subfields (foundations → critical layer) |
| `field_discussions` | COMBINE §3 tensions (stable ids = Tao ledger) |
| per-quote `lexicum.concepts[]` | `uri_local` · `qualified` · `pref_label` · `subfield_slug` |
| per-quote `semantic_tags` | Same shape as student decks: `themes`, `cidoc`, `getty_aat`, `dcterms`, `skos.exactMatch` → `ct:…` |

`/tao/` renders area + discussion chips and thesaurus links into `/lexicum/en/`. Forge must keep invent text and metadata aligned when accepting T4 lines.

## Hard constraints

1. English student surface only.  
2. Invents never wear Chicago clothing.  
3. Prefer Ahmes on slides when a brief page-verified quote exists; Tao fills the gap.  
4. Local Ollama only (`thessia-scholar-v3` via `thessia_generate.py`).  
5. No cloud LLM in the forge loop.  
6. Fail closed on publication safety (`npm run verify:publication`).  
7. Authorship: Rubén Vega Balbás, PhD (`ruvebal@crea-comm.net`) — never `(ECSIT / UEM)` on the Tao footer.

---

## Quick start (operator)

```bash
# 1. Read forger + director
# 2. Seed / refresh tensions from COMBINE
# 3. Run T2→T3 on one chapter batch
# 4. Integrate accepted lines into docs/tao/data/quotes.json (endpoint /tao/ hydrates)
# 5. Propose to TTOD: cd ~/src/ttod && python cli.py proposal create … (see PHASE-T4b)
# 6. Emit registry report

cd ~/projects/ruvebal/scholar/universidadeuropea/creativity-techniques-uem
npm run build   # includes verify:publication
# local: open /creativity-techniques-uem/tao/ and /tao/data/quotes.json
```
