/**
 * Lesson figures and caption honesty (PHASE-EX9; Amendment A12/F8).
 *
 *   node --test scripts/tests/
 *
 * - captionHtml never labels a flagged public-domain claim "Public domain"
 * - lessonFigures() reuses the deck asset path, alt text and caption HTML
 * - docs/_data/lesson_figures.json matches what `npm run render:decks` would write
 * - every <figure class="lesson-figure"> in a lesson uses the deck's asset path and
 *   alt text, has a <figcaption> with the lesson-figure include, and names a real slide
 * - no committed deck include shows "Public domain" on a flagged asset
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { captionHtml, lessonFigures, RIGHTS_UNDER_REVIEW } from '../lib/deck-render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const base = (readFileSync(join(root, '_config.yml'), 'utf8').match(/^baseurl:\s*['"]?([^'"\n]*)['"]?/m) || [])[1] ?? '';
const readDeck = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^---[\s\S]*?---\s*/, ''));

const PD_FLAGGED = {
  media_slot_id: 'U9.lab-1',
  asset_url: '/site/assets/images/deck-media/abc.webp',
  title: 'Fountain',
  alt_text: 'A photograph of a readymade.',
  author: 'A Photographer / A Maker',
  licence: 'PD-old-70',
  licence_url: 'https://creativecommons.org/publicdomain/mark/1.0/',
  canonical_source_url: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
  rights_status: 'flagged',
};

test('A12/F8: a flagged public-domain claim is captioned "Rights under review", not "Public domain"', () => {
  const html = captionHtml(PD_FLAGGED);
  assert.doesNotMatch(html, /public domain/i);
  assert.match(html, new RegExp(RIGHTS_UNDER_REVIEW));
  assert.doesNotMatch(html, /publicdomain\/mark/, 'not linked to the PD mark');
  assert.match(html, />Source</);
  assert.match(captionHtml({ ...PD_FLAGGED, rights_status: 'ok' }), /Public domain/, 'unflagged PD keeps its label');
  assert.match(captionHtml({ ...PD_FLAGGED, licence: 'CC-BY-2.0', licence_url: 'https://creativecommons.org/licenses/by/2.0/' }), /CC BY 2\.0/,
    'a flagged CC asset keeps its licence label');
});

test('lessonFigures: curated slides only, base stripped from src, deck alt and caption', () => {
  const content = {
    slides: [
      { slide_id: 'lab-1', background_kind: 'curated', media_slot_id: 'U9.lab-1' },
      { slide_id: 'lab-2', background_kind: 'diagram' },
    ],
    assets: [PD_FLAGGED],
  };
  const figs = lessonFigures(content, { base: '/site' });
  assert.deepEqual(Object.keys(figs), ['lab-1']);
  assert.equal(figs['lab-1'].src, '/assets/images/deck-media/abc.webp');
  assert.equal(figs['lab-1'].alt, PD_FLAGGED.alt_text);
  assert.equal(figs['lab-1'].caption_html, captionHtml(PD_FLAGGED));
  assert.equal(figs['lab-1'].rights_status, 'flagged');
});

const deckDirs = ['docs/tracks/en/uem/2627-ct', 'docs/tracks/en/uem/2627-ml'].map((p) => join(root, p));
const decks = new Map();
for (const dir of deckDirs) {
  for (const slug of existsSync(dir) ? readdirSync(dir) : []) {
    const path = join(dir, slug, 'data/content.json');
    if (!existsSync(path)) continue;
    const content = readDeck(path);
    if (content.schema_version === 2) decks.set(slug, content);
  }
}
const data = JSON.parse(readFileSync(join(root, 'docs/_data/lesson_figures.json'), 'utf8'));

test('docs/_data/lesson_figures.json is in sync with the decks (run npm run render:decks)', () => {
  const expected = Object.fromEntries([...decks.keys()].sort().map((slug) => [slug, lessonFigures(decks.get(slug), { base })]));
  assert.deepEqual(data, expected);
});

const lessonFiles = [
  'docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md',
  'docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md',
  'docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md',
  'docs/lessons/en/master-lectures/creative-process-analysis/index.md',
];

const decode = (s) => s.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&');

for (const file of lessonFiles) {
  test(`${file.split('/').at(-2)}: every lesson figure reuses its deck asset, alt text and caption`, () => {
    const text = readFileSync(join(root, file), 'utf8');
    const figures = [...text.matchAll(/<figure class="lesson-figure"[^>]*>([\s\S]*?)<\/figure>/g)];
    const problems = [];
    for (const [, body] of figures) {
      const inc = body.match(/<figcaption>\{% include lesson-figure\.html deck="([^"]+)" slide="([^"]+)" %\}<\/figcaption>/);
      const img = body.match(/<img src="\{\{ '([^']+)' \| relative_url \}\}" alt="([^"]+)"/);
      if (!inc || !img) { problems.push(`malformed figure: ${body.slice(0, 80)}`); continue; }
      const [, deck, slide] = inc;
      const entry = data[deck]?.[slide];
      if (!entry) { problems.push(`${deck}/${slide}: no deck image`); continue; }
      if (img[1] !== entry.src) problems.push(`${deck}/${slide}: src ${img[1]} ≠ deck ${entry.src}`);
      if (decode(img[2]) !== entry.alt) problems.push(`${deck}/${slide}: alt differs from the deck alt_text`);
    }
    assert.deepEqual(problems, []);
  });
}

test('A12/F8: no committed deck include captions a flagged asset "Public domain"', () => {
  const problems = [];
  for (const [slug, content] of decks) {
    const include = readFileSync(join(root, 'docs/_includes/decks', `${slug}.html`), 'utf8');
    const flagged = (content.assets || []).filter((a) => a.rights_status === 'flagged');
    for (const a of flagged) {
      const section = include.split('<section ').find((s) => a.canonical_source_url && s.includes(a.canonical_source_url.replaceAll('&', '&amp;')));
      const cap = section && (section.match(/<p class="slide-caption">([\s\S]*?)<\/p>/) || [])[1];
      if (cap && /public domain/i.test(cap)) problems.push(`${slug}: ${a.title}`);
    }
  }
  assert.deepEqual(problems, []);
});
