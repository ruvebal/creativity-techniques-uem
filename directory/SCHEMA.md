# Directory entry schema (Creativity Techniques field)

Data-as-code. Edit YAML here → `npm run hydrate` → public routes under `/directory/`.

## File layout

One file per category: `prizes.yml`, `awards.yml`, `studios.yml`, `journals.yml`,
`organizations.yml`, `contests.yml`, `figures.yml`. Meta in `index.yml`.

## Entry object

```yaml
- id: string              # kebab-case, unique within category
  name: string
  kind: prize|award|studio|journal|organization|contest|figure
  status: established|practitioner|emerging|secondary|gap
  summary: string         # 1–3 sentences, student-safe
  url: string|null
  doi: string|null
  location: string|null
  years: string|null
  references:             # Chicago-ish short cites; no studio infra names
    - string
  units: []               # optional U1–U6 / C1–C3 tags
  notes_internal: string|null  # never hydrated to HTML
```

Status labels mirror Pass-1 verification language (public pages use plain prose).
