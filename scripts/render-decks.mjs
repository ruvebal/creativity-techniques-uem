#!/usr/bin/env node
/**
 * Pre-render student decks (PHASE-EX5). Node stdlib only.
 *
 *   node scripts/render-decks.mjs [--check]
 *
 * Reads every v2 deck (`"schema_version": 2`) under docs/tracks/en/uem/2627-ct
 * and 2627-ml and writes docs/_includes/decks/<slug>.html: one <section> per
 * slide with background, caption, alt text (<p class="sr-only">) and speaker
 * notes (<aside class="notes">). Each deck index.html includes its file, so
 * the slides exist without JavaScript; student-media-deck.js only enhances.
 *
 * Legacy decks (no schema_version, e.g. U4) are skipped: their pages keep the
 * runtime path in student-media-deck.js until their own forge migrates them.
 *
 * Geometric backgrounds: docs/assets/images/fractal-pass-track/ct-pass-NN-<name>-<hash8>.svg,
 * where <hash8> is the first 8 hex of the file's SHA-256 (checked here).
 * Diagram fallback: the Koch triangle named in fractal-triangles/current.json.
 *
 * Also writes docs/_data/lesson_figures.json (PHASE-EX9): each deck's curated slide
 * images with the deck's own caption HTML, read by docs/_includes/lesson-figure.html
 * so lesson figures reuse the deck asset and caption fields.
 *
 * --check: exit 1 if any include (or lesson_figures.json) is missing or out of date (no writes).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { DECK_SCHEMA_VERSION } from './lib/media-rules.mjs';
import { lessonFigures, parseHashedSvgName, renderDeck } from './lib/deck-render.mjs';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const deckRoots = ['docs/tracks/en/uem/2627-ct', 'docs/tracks/en/uem/2627-ml'].map((p) => join(root, p));
const outDir = join(root, 'docs/_includes/decks');
const geometricDir = join(root, 'docs/assets/images/fractal-pass-track');
const kochDir = join(root, 'docs/assets/images/fractal-triangles');
const base = (readFileSync(join(root, '_config.yml'), 'utf8').match(/^baseurl:\s*['"]?([^'"\n]*)['"]?/m) || [])[1] ?? '';

const sha8 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 8);

// Geometric cycle: hashed names only, hash must match the content.
const geometric = readdirSync(geometricDir).filter((n) => n.endsWith('.svg')).sort();
const problems = [];
for (const name of geometric) {
  const parsed = parseHashedSvgName(name);
  if (!parsed) problems.push(`fractal-pass-track/${name}: name carries no 8-hex content hash`);
  else if (parsed.hash !== sha8(join(geometricDir, name))) problems.push(`fractal-pass-track/${name}: hash does not match content (${sha8(join(geometricDir, name))})`);
}
const kochAsset = JSON.parse(readFileSync(join(kochDir, 'current.json'), 'utf8')).asset;
const koch = `${kochAsset}.svg`;
if (!/^ct-koch-triangle-[0-9a-f]{8,}$/.test(kochAsset) || !existsSync(join(kochDir, koch))) problems.push(`Koch fallback missing: fractal-triangles/${koch}`);
if (problems.length) {
  for (const p of problems) console.error(`ERROR ${p}`);
  process.exit(1);
}

const decks = deckRoots.flatMap((dir) => (existsSync(dir) ? readdirSync(dir) : [])
  .map((slug) => ({ slug, path: join(dir, slug, 'data/content.json') }))
  .filter(({ path }) => existsSync(path)));

mkdirSync(outDir, { recursive: true });
let written = 0;
let stale = 0;
let rendered = 0;
const figures = {};
for (const { slug, path } of decks) {
  const content = JSON.parse(readFileSync(path, 'utf8').replace(/^---[\s\S]*?---\s*/, ''));
  if (content.schema_version !== DECK_SCHEMA_VERSION) {
    if (Array.isArray(content.slides) && content.slides.some((s) => s.slide_role)) {
      console.log(`skip legacy deck (schema_version ${content.schema_version ?? 'missing'}): ${slug} keeps the runtime path`);
    }
    continue;
  }
  figures[slug] = lessonFigures(content, { base });
  const html = renderDeck(content, { base, geometric, koch, source: relative(root, path) });
  const out = join(outDir, `${slug}.html`);
  rendered += 1;
  const current = existsSync(out) ? readFileSync(out, 'utf8') : null;
  if (current === html) continue;
  if (checkOnly) {
    stale += 1;
    console.error(`stale: ${relative(root, out)}`);
    continue;
  }
  writeFileSync(out, html, 'utf8');
  written += 1;
  console.log(`rendered ${content.slides.length} slide(s) → ${relative(root, out)}`);
}
const figuresPath = join(root, 'docs/_data/lesson_figures.json');
const figuresJson = `${JSON.stringify(Object.fromEntries(Object.keys(figures).sort().map((k) => [k, figures[k]])), null, 2)}\n`;
const figuresCurrent = existsSync(figuresPath) ? readFileSync(figuresPath, 'utf8') : null;
if (figuresCurrent !== figuresJson) {
  if (checkOnly) {
    stale += 1;
    console.error(`stale: ${relative(root, figuresPath)}`);
  } else {
    writeFileSync(figuresPath, figuresJson, 'utf8');
    written += 1;
    console.log(`lesson figures → ${relative(root, figuresPath)}`);
  }
}
console.log(`render-decks: ${rendered} deck(s), ${checkOnly ? `${stale} stale` : `${written} written`}.`);
process.exit(checkOnly && stale ? 1 : 0);
