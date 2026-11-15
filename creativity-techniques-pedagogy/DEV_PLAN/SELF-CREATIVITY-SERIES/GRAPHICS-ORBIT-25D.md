# Self×Creativity · Canvas 2.5D orbit hero

**Date:** 2026-11-15  
**Skill:** `~/src/.cursor/skills/canvas-25d-content-hero/`  
**Status:** shipped on branch (lesson heroes + ML analysis_opener pin)

## What

Forged `ct-pass-07-self-orbit-44d0a266.svg` from `ct-pass-01-structure-980beb83.svg` (497 triangles **ungrouped** to one polygon = one facet; triangular Bates Z + size bands). Mounted as **heading background** with a **glass title card** (`orbit_hero: true`). Independent facet float/orbit + subtle parallax. Static SVG = reduced-motion fallback.

## Project paths

| Role | Path |
| --- | --- |
| Forged SVG | `docs/assets/images/fractal-pass-track/ct-pass-07-self-orbit-1aca9238.svg` |
| Runtime | `docs/assets/js/svg-plane-25d.js` |
| Math (orbit channel) | `docs/assets/js/favicon-motion/math.js` |
| Hero include | `docs/_includes/self-creativity-orbit-hero.html` |
| Boot | `docs/_includes/svg-plane-25d-boot.html` |
| Lessons | `docs/lessons/en/master-lectures/self-creativity-{attention,depth}/` |
| Deck pin | `background_url` on `analysis_opener` in both ML `content.json` |

## Studio mirror

| Role | Path |
| --- | --- |
| Forge index | `~/src/.cursor/skills/canvas-25d-content-hero/props/forge-index.json` |
| SVG prop | `…/props/ct-pass-07-self-orbit-1aca9238.svg` |
| Reference JS | `…/reference/svg-plane-25d.js`, `…/reference/math.js` |

## Verify

```bash
npm run render:decks
# lesson hero: localhost:4003/…/self-creativity-attention/
# deck slide 1 geometric: …/master-lectures/self-creativity-attention/#/1
```
