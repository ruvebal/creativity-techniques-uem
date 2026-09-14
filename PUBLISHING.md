# Publishing

Jekyll builds from `docs/` at the **repository root** (emancipation pattern = `hc-app-design`, `digital-creativity-uem`).

## GitHub Pages

- **URL:** `https://ruvebal.github.io/creativity-techniques-uem/`
- **Workflow:** `.github/workflows/pages.yml` (GitHub Actions → Pages; not legacy branch deploy)
- **`baseurl`:** `/creativity-techniques-uem` in `_config.yml`
- **Note:** Legacy “Deploy from branch” served the README without `<!DOCTYPE html>` (Quirks Mode) and without site CSS. Pages source must stay on **GitHub Actions**.

## Excluded from the public site

| Path | Reason |
| ---- | ------ |
| `docs/_research/` | `exclude:` in `_config.yml` |
| `creativity-techniques-pedagogy/` | Outside `source: docs` + listed in `exclude` — **authority / research home** |
| `student-project-template/` | Outside `source: docs` |
| `private/` | Outside `source: docs` |

## Verify locally

```bash
JEKYLL_ENV=production npm run build
test ! -d _site/creativity-techniques-pedagogy
test ! -d _site/student-project-template
```

## Custom domain (optional)

Point DNS to GitHub Pages and set `url` / `baseurl` in `_config.yml` accordingly.
