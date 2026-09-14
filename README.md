# Técnicas de Creatividad (UEM)

_Creativity methods for professional design practice — generation, selection, development, and critical judgement._

Standalone teaching site for **Técnicas de Creatividad** (Grado en Diseño and related UEM design degrees). Emancipated from the Web Atelier monorepo the same way [`hc-app-design`](https://github.com/ruvebal/hc-app-design) and [`digital-creativity-uem`](https://github.com/ruvebal/digital-creativity-uem) were: **own repo, own GitHub Pages, own research grounding**.

- **Live site (planned):** [https://ruvebal.github.io/creativity-techniques-uem/](https://ruvebal.github.io/creativity-techniques-uem/)
- **Student template:** [`student-project-template/`](student-project-template/)
- **Research / authorities (not published):** [`creativity-techniques-pedagogy/`](creativity-techniques-pedagogy/)
- **Official guías (JSON clones, not published):** [`creativity-techniques-pedagogy/cv/guides/`](creativity-techniques-pedagogy/cv/guides/) — mandatory hour/eval/CONTENIDOS contract
- **Sister UEM site:** [Digital Creativity — Creación Digital](https://ruvebal.github.io/digital-creativity-uem/)

---

## Repository layout

| Path | Published on Pages? |
| ---- | ------------------- |
| `docs/` | Yes — Jekyll site |
| `student-project-template/` | No — fork on GitHub |
| `docs/_research/` | No — excluded in `_config.yml` |
| `creativity-techniques-pedagogy/` | No — excluded; **authority home** |
| `private/` | No |

## Flagship course

| Track | Degree placement | Status |
| ----- | ---------------- | ------ |
| **Técnicas de Creatividad** | Year 3 · S1 · 6 ECTS · Obligatoria | scaffold |

Six learning units (U1–U6): foundations; generation/selection; development/solutions; workplace application; creativity & technology; personal development.

## Local development

```bash
pnpm install
bundle install
npm run develop   # http://localhost:4003/creativity-techniques-uem/
```

See [PUBLISHING.md](PUBLISHING.md).

## Authority & research

Canonical field map and authorities directory live under `creativity-techniques-pedagogy/grounding/` (synced from the profield `creativity-techniques` run). Structure inspired by Web Atelier’s `frontend-pedagogy/` and `digital-creativity-pedagogy/` — **without** importing foreign `.cursor` rules/skills wholesale.

Scholarly bibliography vault: `~/projects/ruvebal/scholar/bibliographies/creativity` (Ahmes/Athanor). PDF extractions stay in the Ahmes library; this repo holds **edited maps and directories**, not the binary corpus.

---

Rubén Vega Balbás, PhD — Creative Technologist & Developer · [ruvebal@crea-comm.net](mailto:ruvebal@crea-comm.net) · ORCID [0000-0001-6862-9081](https://orcid.org/0000-0001-6862-9081)  
Affiliation: Universidad Europea (teaching) · ECSIT / UDIT (research) · crea-comm.net  
Code MIT · Content CC BY-NC-SA 4.0
