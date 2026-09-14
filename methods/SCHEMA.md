# Method profile schema

Data-as-code under `methods/*.yml`. Optional research pack: `methods/<id>/PROFILE.md`
+ `discovery-receipt.json` (unpublished detail; hydrate only student-safe YAML fields).

```yaml
id: kebab-case
title: string
kind: classical|practitioner|scholarly|funded-transdisciplinary|emerging
funding:
  programme: string|null
  grant_id: string|null
  cordis_url: string|null
  doi: string|null
  years: string|null
summary: string
steps: []                 # optional short rehearsal steps
fieldlex: []              # ct:concept ids
units: []
references: []
athanor:
  ingested: false|true
  project_slugs: []
  status: missing|candidate|exact
  note: string
url: string|null
```
