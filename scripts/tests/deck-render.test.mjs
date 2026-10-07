/**
 * Deck pre-renderer (PHASE-EX5, FINDINGS B14 + presentation audit; A6/F4).
 *
 *   node --test scripts/tests/
 *
 * Unit tests run on scripts/lib/deck-render.mjs. Repository checks read the
 * committed decks, includes and SVGs: every geometric SVG name carries its true
 * content hash, every SVG named in deck JS/JSON exists, the committed includes
 * match the renderer's output, and deck JS has no hard-coded base path or
 * timestamped fetch.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  captionHtml,
  diagramCaptionHtml,
  escapeHtml,
  geometricCaptionHtml,
  layoutFor,
  licenceLabel,
  notesHtml,
  parseHashedSvgName,
  questionsHtml,
  renderDeck,
  timerFor,
  withBase,
} from '../lib/deck-render.mjs';
import { deckProblems } from '../lib/media-rules.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const geometricDir = join(root, 'docs/assets/images/fractal-pass-track');

const CC_ASSET = {
  media_slot_id: 'U9.masterclass-1',
  asset_id: 'wikimedia:File:Example.jpg',
  asset_url: '/site/assets/images/deck-media/abc.webp',
  title: 'File:Example work [modern_rights_review_required]',
  alt_text: 'A drawing of a chair.',
  author: 'Ada Example',
  licence: 'CC-BY-SA-4.0',
  licence_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  canonical_source_url: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
};

const CTX = {
  base: '/site',
  geometric: ['ct-pass-01-structure-980beb83.svg', 'ct-pass-02-threshold-7a624a21.svg'],
  koch: 'ct-koch-triangle-5cc4358a9bdb.svg',
};

const deck = (slides, assets = []) => ({ schema_version: 2, unit_label: 'Unit', slides, assets });

test('A6/F4: caption shows title · author · licence linked to licence_url · source link', () => {
  const html = captionHtml(CC_ASSET);
  assert.match(html, /Example work/);
  assert.doesNotMatch(html, /review_required/, 'no review tag');
  assert.match(html, /<span class="slide-caption__title">Example work<\/span>/, 'no File: prefix in the title');
  assert.match(html, /Ada Example/);
  assert.match(html, /<a href="https:\/\/creativecommons\.org\/licenses\/by-sa\/4\.0\/"[^>]*>CC BY-SA 4\.0<\/a>/);
  assert.match(html, /<a href="https:\/\/commons\.wikimedia\.org\/wiki\/File:Example\.jpg"[^>]*>Source<\/a>/);
  const order = ['Example work', 'Ada Example', 'CC BY-SA 4.0', '>Source<'].map((s) => html.indexOf(s));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'fields in order');
});

test('caption omits empty fields and never links a non-http licence URL', () => {
  const html = captionHtml({ title: 'T', licence: 'PD-old-70', licence_url: 'javascript:alert(1)' });
  assert.equal(html, '<span class="slide-caption__title">T</span> · <span>Public domain</span>');
});

test('licence labels', () => {
  assert.equal(licenceLabel('PD-old-70'), 'Public domain');
  assert.equal(licenceLabel('PD-EU'), 'Public domain');
  assert.equal(licenceLabel('CC0'), 'CC0 1.0');
  assert.equal(licenceLabel('CC-BY-4.0'), 'CC BY 4.0');
  assert.equal(licenceLabel('CC-BY-SA-3.0'), 'CC BY-SA 3.0');
  assert.equal(licenceLabel(''), '');
});

test('escapeHtml escapes markup and Liquid braces', () => {
  assert.equal(escapeHtml('<a href="x">{{ y }}</a>'), '&lt;a href=&quot;x&quot;&gt;&#123;&#123; y &#125;&#125;&lt;/a&gt;');
});

test('geometric captions carry the 8-hex SVG content hash', () => {
  assert.deepEqual(parseHashedSvgName('ct-pass-01-structure-980beb83.svg'), { stem: 'ct-pass-01-structure', name: 'structure', hash: '980beb83' });
  assert.equal(parseHashedSvgName('ct-pass-01-structure.svg'), null);
  assert.match(geometricCaptionHtml('ct-pass-01-structure-980beb83.svg'), /#980beb83/);
  assert.throws(() => geometricCaptionHtml('ct-pass-01-structure.svg'));
  assert.match(diagramCaptionHtml('ct-koch-triangle-5cc4358a9bdb.svg'), /Koch triangle.*#5cc4358a9bdb/);
});

test('layouts: field wins when valid, else role default', () => {
  assert.equal(layoutFor({ slide_role: 'masterclass' }), 'image_argument');
  assert.equal(layoutFor({ slide_role: 'unit_cover' }), 'image_argument');
  assert.equal(layoutFor({ slide_role: 'lab_exercise' }), 'exercise');
  assert.equal(layoutFor({ slide_role: 'lab_opener' }), 'split');
  assert.equal(layoutFor({ slide_role: 'outro' }), 'split');
  assert.equal(layoutFor({ slide_role: 'masterclass', layout: 'quote' }), 'quote');
  assert.equal(layoutFor({ slide_role: 'masterclass', layout: 'bogus' }), 'image_argument');
});

test('Lab timer: 180 s on exercise slides, timer_seconds overrides, none elsewhere', () => {
  assert.equal(timerFor({ slide_role: 'lab_exercise' }), 180);
  assert.equal(timerFor({ slide_role: 'lab_exercise', timer_seconds: 600 }), 600);
  assert.equal(timerFor({ slide_role: 'masterclass' }), null);
  assert.equal(timerFor({ slide_role: 'masterclass', layout: 'exercise' }), 180);
});

test('notes: lines become paragraphs, "- " lines become a list, text is escaped', () => {
  assert.equal(notesHtml('Say this.\n- one\n- <two>\nAsk that.'), '<p>Say this.</p><ul><li>one</li><li>&lt;two&gt;</li></ul><p>Ask that.</p>');
  assert.equal(notesHtml(''), '');
  assert.equal(notesHtml(['a', 'b']), '<p>a</p><p>b</p>');
});

test('B14: renderDeck emits one <section> per slide with background, alt text, caption, notes', () => {
  const html = renderDeck(deck([
    { slide_id: 'cover', slide_role: 'unit_cover', background_kind: 'curated', media_slot_id: 'U9.masterclass-1', heading: 'H', sentence: 'S', notes: 'Talk.' },
    { slide_id: 'analysis-opener', slide_role: 'analysis_opener', background_kind: 'geometrical', heading: 'A' },
    { slide_id: 'masterclass-2', slide_role: 'masterclass', background_kind: 'diagram', heading: 'D', notes: 'More.' },
    { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'none', heading: 'L', portfolio_trace: 'Save it.' },
    { slide_id: 'outro', slide_role: 'outro', background_kind: 'geometrical', heading: 'O' },
  ], [CC_ASSET]), CTX);
  assert.equal((html.match(/<section\b/g) || []).length, 5);
  assert.match(html, /data-slide-id="cover"[^>]*data-background-image="\/site\/assets\/images\/deck-media\/abc\.webp"/);
  assert.match(html, /<p class="sr-only">Image: A drawing of a chair\.<\/p>/);
  assert.equal((html.match(/class="sr-only"/g) || []).length, 1, 'alt text only for the curated image');
  assert.match(html, /<aside class="notes"><p>Talk\.<\/p><\/aside>/);
  assert.match(html, /fractal-pass-track\/ct-pass-01-structure-980beb83\.svg/);
  assert.match(html, /fractal-pass-track\/ct-pass-02-threshold-7a624a21\.svg/, 'geometric cycle advances');
  assert.match(html, /data-slide-id="masterclass-2"[^>]*fractal-triangles\/ct-koch-triangle-5cc4358a9bdb\.svg/, 'diagram → Koch');
  assert.match(html, /data-slide-id="lab-1"[^>]*data-timer="180"/);
  assert.doesNotMatch(html.split('data-slide-id="lab-1"')[1].split('</section>')[0], /data-background-image/, 'none → no image');
  assert.match(html, /data-layout="exercise"/);
});

test('renderDeck honours a geometric background_url (old or hashed name)', () => {
  const html = renderDeck(deck([
    { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical', heading: 'L', background_url: '/assets/images/fractal-pass-track/ct-pass-02-threshold.svg' },
  ]), CTX);
  assert.match(html, /ct-pass-02-threshold-7a624a21\.svg/);
  assert.match(html, /#7a624a21/);
});

test('validator: unknown layout and non-string notes are errors on v2 decks', () => {
  const { errors } = deckProblems(deck([
    { slide_id: 'masterclass-1', slide_role: 'masterclass', background_kind: 'diagram', heading: 'H', layout: 'bogus', notes: 3 },
  ]), { unit: 'U9' });
  assert.ok(errors.some((e) => /layout "bogus"/.test(e)), errors.join('\n'));
  assert.ok(errors.some((e) => /notes must be/.test(e)), errors.join('\n'));
});

test('EX10: retrieval slide renders five questions as a list, answers only in notes, with a timer', () => {
  assert.equal(questionsHtml(['A <b>?', ' ', 'B?']), '<ol class="student-media-slide__questions"><li>A &lt;b&gt;?</li><li>B?</li></ol>');
  assert.equal(questionsHtml(undefined), '');
  assert.equal(layoutFor({ slide_role: 'retrieval' }), 'exercise');
  const qs = ['Q1?', 'Q2?', 'Q3?', 'Q4?', 'Q5?'];
  const html = renderDeck(deck([
    { slide_id: 'retrieval', slide_role: 'retrieval', background_kind: 'geometrical', heading: 'R', questions: qs, notes: 'Answers:\n- 1. secret' },
  ]), CTX);
  const card = html.split('<aside')[0];
  assert.equal((card.match(/<li>/g) || []).length, 5);
  assert.doesNotMatch(card, /secret/, 'answers are not on the slide card');
  assert.match(html, /<aside class="notes">.*secret/);
  assert.match(html, /data-slide-role="retrieval"[^>]*data-timer="180"/);
  assert.match(html, /fractal-pass-track\//, 'geometrical background');
});

test('EX10 validator: retrieval slide needs five short questions, answers in notes, geometrical background', () => {
  const ok = { slide_id: 'retrieval', slide_role: 'retrieval', background_kind: 'geometrical', heading: 'R', questions: ['a?', 'b?', 'c?', 'd?', 'e?'], notes: 'Answers: …' };
  assert.deepEqual(deckProblems(deck([ok]), { unit: 'U9' }).errors, []);
  const errs = (s) => deckProblems(deck([{ ...ok, ...s }]), { unit: 'U9' }).errors.join('\n');
  assert.match(errs({ questions: ['a?'] }), /exactly 5 question/);
  assert.match(errs({ questions: ['a?', 'b?', 'c?', 'd?', 'x'.repeat(81)] }), /longer than 80/);
  assert.match(errs({ notes: 'Talk.' }), /must carry the answers/);
  assert.match(errs({ background_kind: 'diagram' }), /must be geometrical/);
});

test('EX5 cold review F1: root-relative citation hrefs get the base path; others pass through', () => {
  assert.equal(withBase('/lessons/en/x/#references', '/site'), '/site/lessons/en/x/#references');
  assert.equal(withBase('/site/lessons/en/x/', '/site'), '/site/lessons/en/x/', 'no double prefix');
  assert.equal(withBase('#ref-craft-2003', '/site'), '#ref-craft-2003');
  assert.equal(withBase('https://example.org/a', '/site'), 'https://example.org/a');
  assert.equal(withBase('//cdn.example.org/a', '/site'), '//cdn.example.org/a');
  assert.equal(withBase('mailto:a@b.c', '/site'), 'mailto:a@b.c');
  assert.equal(withBase('/a', ''), '/a');
  const html = renderDeck(deck([
    { slide_id: 'masterclass-1', slide_role: 'masterclass', background_kind: 'diagram', heading: 'H', citation: { label: '(X 2000, 1)', href: '/lessons/en/master-lectures/cpa/#references' } },
  ]), CTX);
  assert.match(html, /<a href="\/site\/lessons\/en\/master-lectures\/cpa\/#references">/);
  assert.doesNotMatch(html, /href="\/lessons\//);
});

// ---------------------------------------------------------------------------
// Repository checks
// ---------------------------------------------------------------------------

test('every geometric SVG name carries its true 8-hex SHA-256 prefix', () => {
  const files = readdirSync(geometricDir).filter((n) => n.endsWith('.svg'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const parsed = parseHashedSvgName(name);
    assert.ok(parsed, `${name} has no hash`);
    const hash = createHash('sha256').update(readFileSync(join(geometricDir, name))).digest('hex').slice(0, 8);
    assert.equal(parsed.hash, hash, `${name}: content hash is ${hash}`);
  }
});

test('every course SVG named in deck JS and deck JSON exists', () => {
  const sources = [
    'docs/assets/js/student-media-deck.js',
    'docs/assets/js/pass-track-deck.js',
    'docs/tracks/en/uem/2627-ct/how-to-pass-this-track/data/content.json',
    'docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json',
  ];
  for (const rel of sources) {
    const text = readFileSync(join(root, rel), 'utf8');
    for (const [name] of text.matchAll(/ct-pass-[a-z0-9-]+\.svg/g)) {
      assert.ok(existsSync(join(geometricDir, name)), `${rel}: ${name} missing`);
    }
    for (const [name] of text.matchAll(/ct-koch-triangle-[0-9a-f]+\.svg/g)) {
      assert.ok(existsSync(join(root, 'docs/assets/images/fractal-triangles', name)), `${rel}: ${name} missing`);
    }
  }
});

test('deck JS: no hard-coded base path, no timestamped fetch', () => {
  const js = readFileSync(join(root, 'docs/assets/js/student-media-deck.js'), 'utf8');
  assert.doesNotMatch(js, /\/creativity-techniques-uem/);
  assert.doesNotMatch(js, /Date\.now\(\)/);
  assert.match(js, /dataset\.baseUrl/);
});

test('committed deck includes match the renderer (npm run render:decks)', () => {
  execFileSync(process.execPath, [join(root, 'scripts/render-decks.mjs'), '--check'], { cwd: root, stdio: 'pipe' });
});

test('EX5 cold review F1: no root-relative href/src/background in a rendered include lacks the site base', () => {
  const base = (readFileSync(join(root, '_config.yml'), 'utf8').match(/^baseurl:\s*['"]?([^'"\n]*)['"]?/m) || [])[1] ?? '';
  const dir = join(root, 'docs/_includes/decks');
  const bad = [];
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.html'))) {
    const html = readFileSync(join(dir, name), 'utf8');
    for (const [, attr, url] of html.matchAll(/\b(href|src|data-background-image)="(\/[^"]*)"/g)) {
      if (url.startsWith('//')) continue;
      if (base && !url.startsWith(`${base}/`)) bad.push(`${name}: ${attr}="${url}"`);
    }
  }
  assert.deepEqual(bad, []);
});
