#!/usr/bin/env node
/**
 * Printable method cards (PHASE-EX10 deliverable 5).
 *
 *   node scripts/build-method-cards.mjs [--check]
 *
 * Reads the student-facing practice methods (methods/*.yml, `kind: practice-learning`)
 * and the private canonical technique catalogue
 * (creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml) and writes ONE
 * public page, docs/methods/en/cards/index.html: one <article data-method-card> per card.
 *
 * Only public fields leave the catalogue: name, steps, time, group size, when to use
 * (derived from family + mode + units). Record URNs, evidence notes, held notes, gap
 * work and source locator prose are never copied. Techniques are published only when
 * their `primary_source` is verified (A11 / EX8 rule: a student-facing Source line only
 * for a verified primary source); the card then names the work as an author-date
 * citation linked to the page's reference list (docs/_data/references.yml) and says
 * the steps are a classroom adaptation. Practice methods carry "Classroom adaptation".
 * No quotations appear on any card.
 *
 * --check: exit 1 if the committed page differs from what this script would write.
 * Wired into `npm run prebuild` after `hydrate` (which keeps the cards/ folder).
 * Tests: scripts/tests/method-cards.test.mjs.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CATALOGUE = join(root, 'creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml');
export const OUT = join(root, 'docs/methods/en/cards/index.html');

const FAMILY_USE = Object.freeze({
  generation: 'when you need many options',
  framing: 'when the problem is still unclear and you want to frame or reframe it',
  selection: 'when you must choose among ideas with a stated criterion',
  development: 'when you develop and test one chosen idea',
  reflection: 'when you want to record and learn from your own process',
  embodied: 'as an optional start that uses movement or attention',
});
const MODE_USE = Object.freeze({
  divergent: 'opening (divergent)',
  convergent: 'closing (convergent)',
  both: 'opening and closing',
});
/** Lesson-faithful lines where the family default would contradict the source (EX10 F4). */
const WHEN_OVERRIDE = Object.freeze({
  'what-if-prompts': 'When you want to link or combine ideas you already have; use with care, because this kind of prompt can hurt the generation of new ideas',
  'parallel-prototyping': 'When you want to explore several directions before critique, by making more than one prototype from different starting points',
});

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

/** "Colzato, Lorenza S., Ayca Ozturk, and Bernhard Hommel. 2012. …" → "Colzato, Ozturk, and Hommel 2012". */
export function authorDate(chicago) {
  const text = String(chicago || '').replace(/\s+/g, ' ').trim();
  const m = text.match(/^(.*?)(?:, eds?)?\. ((?:1[89]|20)\d\d)\./);
  if (!m) return null;
  const parts = m[1].split(/,? and |, /);
  // parts: [Surname, Given, Given Surname, Given Surname …]
  const surnames = [parts[0]];
  for (const p of parts.slice(2)) surnames.push(p.trim().split(' ').pop());
  let names;
  if (surnames.length > 3) names = `${surnames[0]} et al.`;
  else if (surnames.length === 3) names = `${surnames[0]}, ${surnames[1]}, and ${surnames[2]}`;
  else if (surnames.length === 2) names = `${surnames[0]} and ${surnames[1]}`;
  else names = surnames[0];
  return `${names} ${m[2]}`;
}

/**
 * Catalogue `source_locator` → a Chicago in-text locator, or '' when none is clean.
 * Parenthetical prose and anything after ";" is dropped (it may paraphrase the source).
 */
export function locator(raw) {
  const head = String(raw || '').split(/ \(|;/)[0].trim();
  let m;
  if ((m = head.match(/^article \d+, p\. (\S+)$/))) return m[1];
  if ((m = head.match(/^pp?\. ([\divxlc:–,\- ]+)$/i))) return m[1].trim();
  if ((m = head.match(/^chap\. (\d+)\b/))) return `chap. ${m[1]}`;
  if ((m = head.match(/^chap\. ([A-Z][^"]*)$/))) return `chap. “${m[1].trim()}”`;
  return '';
}

export function whenToUse(t) {
  const units = (t.units || []).filter((u) => /^U[1-6]$/.test(u));
  const tail = units.length ? ` Course units: ${units.join(', ')}.` : '';
  if (WHEN_OVERRIDE[t.id]) return `${WHEN_OVERRIDE[t.id]}.${tail}`;
  const use = FAMILY_USE[t.family] || 'when the brief calls for it';
  const mode = MODE_USE[t.mode];
  return `${use[0].toUpperCase()}${use.slice(1)}${mode ? `; ${mode}` : ''}.${tail}`;
}

/** Public card objects from the catalogue + practice methods. Pure. */
export function buildCards({ techniques = [], methods = [], references = {} }) {
  const cards = [];
  const refKeys = new Set();
  for (const m of methods) {
    if (!m?.id || (m.kind && m.kind !== 'practice-learning')) continue;
    cards.push({
      id: `method-${m.id}`,
      kind: 'Practice method',
      name: m.title,
      when: String(m.summary || '').replace(/\s+/g, ' ').trim(),
      time: 'Not fixed: a cycle you repeat across a project.',
      group: '',
      steps: m.steps || [],
      source: 'Classroom adaptation.',
      optional: false,
    });
  }
  for (const t of techniques) {
    if (t.source_status !== 'verified' || !references[t.primary_source]) continue;
    const label = authorDate(references[t.primary_source].chicago);
    if (!label) continue;
    const loc = locator(t.source_locator);
    refKeys.add(t.primary_source);
    cards.push({
      id: `technique-${t.id}`,
      kind: 'Technique',
      name: t.name,
      when: whenToUse(t),
      time: Number.isFinite(t.time_min) ? `About ${t.time_min} minutes.` : '',
      group: String(t.group_size || ''),
      steps: t.steps || [],
      source: { key: t.primary_source, label: `${label}${loc ? `, ${loc}` : ''}` },
      optional: t.family === 'embodied',
    });
  }
  return { cards, refKeys: [...refKeys].sort() };
}

function cardHtml(c) {
  const src = typeof c.source === 'string'
    ? `<p class="method-card__source"><strong>Source:</strong> ${escapeHtml(c.source)}</p>`
    : `<p class="method-card__source"><strong>Source:</strong> <a href="#ref-${escapeHtml(c.source.key)}">(${escapeHtml(c.source.label)})</a>. Steps: classroom adaptation.</p>`;
  return [
    `<article class="method-card" id="${escapeHtml(c.id)}" data-method-card="${escapeHtml(c.id)}">`,
    `<p class="method-card__kind">${escapeHtml(c.kind)}</p>`,
    `<h2 class="method-card__name">${escapeHtml(c.name)}</h2>`,
    `<p class="method-card__when"><strong>When to use:</strong> ${escapeHtml(c.when)}</p>`,
    c.time || c.group
      ? `<p class="method-card__time">${c.time ? `<strong>Time:</strong> ${escapeHtml(c.time)}` : ''}${c.time && c.group ? ' · ' : ''}${c.group ? `<strong>Group:</strong> ${escapeHtml(c.group)}` : ''}</p>`
      : '',
    `<ol class="method-card__steps">${c.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`,
    c.optional ? '<p class="method-card__optional"><strong>Optional:</strong> you may opt out and sit quietly or start the next task instead.</p>' : '',
    src,
    '</article>',
  ].filter(Boolean).join('\n');
}

export function pageHtml({ cards, refKeys }) {
  const fm = [
    '---',
    'layout: default',
    'title: "Method cards"',
    'lang: en',
    'permalink: /methods/en/cards/',
    'description: "Printable cards for the creativity techniques and practice methods used in this course: steps, time and when to use each one."',
    `references: [${refKeys.join(', ')}]`,
    '---',
    '',
  ].join('\n');
  return `${fm}{% comment %}Generated by scripts/build-method-cards.mjs (npm run prebuild). Do not edit by hand.{% endcomment %}
<div class="method-cards">
<header class="method-cards__hero prose prose-slate dark:prose-invert max-w-none">
<h1>Method cards</h1>
<p>One card per technique or practice method: when to use it, how long it takes and the steps. Print this page (one card never splits across pages) or keep it open in class. The steps are written for this course; where a card names a source, the full entry is in the list at the end.</p>
<p>Back to <a href="{{ '/methods/en/' | relative_url }}">Methods</a> · <a href="{{ '/lessons/en/creativity-techniques/' | relative_url }}">Lessons</a></p>
</header>
<div class="method-cards__grid">
${cards.map(cardHtml).join('\n')}
</div>
<section class="method-cards__references prose prose-slate dark:prose-invert max-w-none" id="references">
<h2>References</h2>
{% include references.html %}
</section>
</div>
`;
}

function loadInputs() {
  const catalogue = yaml.load(readFileSync(CATALOGUE, 'utf8'));
  const references = yaml.load(readFileSync(join(root, 'docs/_data/references.yml'), 'utf8'));
  const methodsDir = join(root, 'methods');
  const methods = readdirSync(methodsDir)
    .filter((n) => n.endsWith('.yml') && n !== 'index.yml')
    .map((n) => yaml.load(readFileSync(join(methodsDir, n), 'utf8')));
  const order = yaml.load(readFileSync(join(methodsDir, 'index.yml'), 'utf8')).entries || [];
  methods.sort((a, b) => (order.indexOf(a?.id) + 1 || 99) - (order.indexOf(b?.id) + 1 || 99));
  return { techniques: catalogue.techniques || [], methods, references };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!existsSync(CATALOGUE)) {
    // The catalogue is private and lives in this repository; without it keep the committed page.
    console.warn(`build-method-cards: ${relative(root, CATALOGUE)} missing; committed page kept`);
    process.exit(0);
  }
  const built = buildCards(loadInputs());
  const html = pageHtml(built);
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
  if (process.argv.includes('--check')) {
    if (current !== html) { console.error(`stale: ${relative(root, OUT)} (run node scripts/build-method-cards.mjs)`); process.exit(1); }
    console.log(`build-method-cards: ${built.cards.length} card(s), up to date`);
    process.exit(0);
  }
  if (current !== html) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, html, 'utf8');
  }
  console.log(`build-method-cards: ${built.cards.length} card(s) → ${relative(root, OUT)}`);
}
