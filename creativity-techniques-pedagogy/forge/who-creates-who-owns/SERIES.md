# Series: Who Creates, Who Owns, Who Scales?

**Branch:** `forge/who-creates-who-owns-who-scales`  
**Surface:** Master Lectures (transversal; not CONTENIDOS rows)  
**Central concept:** authorship  
**Format:** two 90-minute lessons + one-page bridge dossier + final comparative assignment  

## Series question

> How do collective acts of invention become products, private property, industrial systems, and stories about individual genius?

Investigate — do not assume commercial success proves originality, or that building on others’ work is automatically theft.

## Lessons

| # | ID | Title | Role |
| --- | --- | --- | --- |
| 1 | ML-WCOS-E | Who Designs a Product—and Who Owns Its Story? | Edison five-case investigation; three-level frame |
| 2 | ML-WCOS-F | Can We Redesign the Whole System? | Fuller comparison under the same questions; software transfer |

## Analytical spine (carry through both lessons)

| Level | Question | Edison | Fuller |
| --- | --- | --- | --- |
| Artifact | What works, and what is technically distinctive? | Lamp, phonograph, camera | House, vehicle, structural system |
| System | What makes the artifact usable and reproducible? | Networks, formats, exhibition | Manufacture, transport, assembly, maintenance |
| Political economy | Who funds, owns, controls, and benefits? | Companies, patents, investors | Proposed manufacturers, investors, residents |

## Editorial safeguards (binding)

1. Do **not** label all five Edison cases “appropriated inventions”; they are different kinds of attribution case.
2. Do **not** treat appropriation, legal acquisition, collaboration, patent infringement, and monopolization as synonyms.
3. Do **not** confuse Fuller’s “integrity” with “tensegrity.”
4. Do **not** collapse Cold War origins of creativity research into post–Cold War development.
5. Fuller is a **comparison**, not a moral opposite of Edison.
6. Software (Apple / Microsoft product) is the **concluding transfer**, after students can separate contribution, ownership, attribution, and market control.

## Research source status (2026-10-25)

- Operator series brief + visual catalog pasted in-chat.
- Edison lesson research PDF vaulted locally:
  `grounding/who-creates-who-owns/edison-fuller-series-research.pdf` (+ `.txt` extract).
  Source path: `~/Downloads/export_7506882957666948587.pdf`. Six pages; secondary web footnotes — **not** Ahmes nodes. Case claims stay course-method / professor-brief until Ahmes-batched and page-verified.
- **Profield OA tranche (DONE 2026-10-25):** `~/src/profield/runs/creativity-techniques/20261025-who-creates-who-owns/`
  11 OA PDFs → Ahmes 11/0/0 (+ semantic) → 11 coats → DevIAC + Athanor inject under `profield-creativity-techniques`. See run `RECEIPT.md` + `PENDING-procurement.md`.
  **Resolver truth (cycle 2):** verify-batch labelled 4 coats “safe”, but `ahmes query --cite --require-evaluator-safe` passes **only Robb 2024** (`71227d15`). Phonograph *Nature* 1878 (`3dd15828`), Beyond Einstein and Edison (`806a22bd`), and the X-ray biography (`3cfe2d56`) carry slug metadata (conf 0.60); `enrich --force-meta --online` recovered no DOI. Discovery only.
- Student prose: teach **method** + investigation briefs; public Chicago pins only for page-verified works (Csikszentmihalyi 1996, Norman 2013, Robb 2024 in Lesson 1). No fake Edison primary cites.

## Scholarly reading architecture (excerpts, not whole books)

| Work | Role | Vault status (CT slug) |
| --- | --- | --- |
| Schumpeter, *Theory of Economic Development* | Combinations / industrial change | BIBLIO-GAP |
| Fuller, *Operating Manual for Spaceship Earth* | Primary ambitions/assumptions | BIBLIO-GAP |
| Fuller, *Synergetics* | Vocabulary laboratory | BIBLIO-GAP |
| Simon, *Sciences of the Artificial* | Design problem ↔ solution | BIBLIO-GAP |
| Csikszentmihalyi, *Creativity* (1996) | Individual vs systems accounts | Available (`csikszentmihalyi-1996` / coat `35dcf3a7`) |
| Alexander, *Notes on the Synthesis of Form* | Interacting requirements | Special-analysis gap / verify before cite |
| Norman, *Design of Everyday Things* (2013) | Incremental vs radical innovation (bridge) | Available (`norman-2013`) |

## Visual catalog

`grounding/who-creates-who-owns/visual-resources.json` — 17 starter resources; discovery ≠ clearance for EU classroom publication. Pass-1 decks use geometrical / course diagrams until assets are curated with `rights_status`.

## Related exercises (existing)

| Exercise | Fit | Notes |
| --- | --- | --- |
| `process-trail` | Adjacent | Makes labour sequence visible; does not map ownership/value-flow |
| `follow-dogme-95-rules` / `imposing-constraints` | Weak formal analogy | Rules ≠ patents/IP |
| `seed-collection` | Weak | Collects inputs; not attribution audit |
| `mental-locks-audit` | Weak | Cognitive frames, not political economy |
| `reflection-in-action-log` | Weak bridge | Judgement log only |

**Gap (forge next):** `authorship-map`, `value-flow-map`, `counter-design-ownership`, `dymaxion-without-genius` — see `EXERCISES-GAP.md`.
