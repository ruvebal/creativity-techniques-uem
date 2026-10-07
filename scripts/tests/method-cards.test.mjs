/**
 * Method cards (PHASE-EX10 deliverable 5): scripts/build-method-cards.mjs.
 *
 *   node --test scripts/tests/
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { authorDate, buildCards, locator, OUT, whenToUse } from '../build-method-cards.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('authorDate: Chicago entry → in-text author-date', () => {
  assert.equal(authorDate('Amabile, Teresa M. 1979. “Effects …”'), 'Amabile 1979');
  assert.equal(authorDate('de Bono, Edward. 1970. *Lateral Thinking*.'), 'de Bono 1970');
  assert.equal(authorDate('Beghetto, Ronald A., and Maciej Karwowski. 2025. *Creative*'), 'Beghetto and Karwowski 2025');
  assert.equal(authorDate('Colzato, Lorenza S., Ayca Ozturk, and Bernhard Hommel. 2012. “Meditate”'), 'Colzato, Ozturk, and Hommel 2012');
  assert.equal(authorDate('Dow, Steven P., Alana Glassco, Jonathan Kass, Melissa Schwarz, Daniel L. Schwartz, and Scott R. Klemmer. 2010. “Parallel”'), 'Dow et al. 2010');
  assert.equal(authorDate('Hüppauf, Bernd, and Christoph Wulf, eds. 2009. *The Dynamics*'), 'Hüppauf and Wulf 2009');
});

test('locator: clean Chicago locators only; parenthetical prose is dropped', () => {
  assert.equal(locator('p. 26 (unusual-uses / brick test reported with Guilford\'s abilities)'), '26');
  assert.equal(locator('chap. 4 (ground rules for a think-up conference: judicial judgment ruled out)'), 'chap. 4');
  assert.equal(locator('chap. The new word PO (sections Provocation; The generation of alternatives)'), 'chap. “The new word PO”');
  assert.equal(locator('article 18, p. 18:1'), '18:1');
  assert.equal(locator('pp. 12–13 (CoRT PMI passage)'), '12–13');
  assert.equal(locator('whole book; hat colours and map-then-route as cited in U2 (p. 199)'), '');
});

test('buildCards: only verified techniques get a source; gap/held techniques are not published; methods say Classroom adaptation', () => {
  const references = { 'osborn-1942': { chicago: 'Osborn, Alex F. 1942. *How to Think Up*.' } };
  const { cards, refKeys } = buildCards({
    references,
    methods: [{ id: 'critique-cycle', title: 'Critique cycle', kind: 'practice-learning', summary: 'S', steps: ['a'] }, { id: 'x', kind: 'funded-transdisciplinary', title: 'X' }],
    techniques: [
      { id: 'brainstorming-osborn', name: 'Brainstorming', family: 'generation', mode: 'divergent', units: ['U2'], primary_source: 'osborn-1942', source_locator: 'chap. 4 (rules)', source_status: 'verified', steps: ['s'], time_min: 20, group_size: '4–8', evidence: 'PRIVATE', catalogue_records: ['urn:in-practice:exercise:1'], held_note: 'PRIVATE' },
      { id: 'cocd-box', name: 'COCD box', family: 'selection', primary_source: 'gap', source_status: 'gap', steps: ['s'] },
    ],
  });
  assert.deepEqual(cards.map((c) => c.id), ['method-critique-cycle', 'technique-brainstorming-osborn']);
  assert.equal(cards[0].source, 'Classroom adaptation.');
  assert.deepEqual(cards[1].source, { key: 'osborn-1942', label: 'Osborn 1942, chap. 4' });
  assert.deepEqual(refKeys, ['osborn-1942']);
  assert.doesNotMatch(JSON.stringify(cards), /PRIVATE|urn:in-practice/);
  assert.match(whenToUse({ family: 'selection', mode: 'convergent', units: ['U2', 'U4'] }), /^When you must choose.*closing.*Course units: U2, U4\.$/);
  assert.match(whenToUse({ id: 'what-if-prompts', family: 'generation', mode: 'divergent', units: ['U2'] }), /link or combine ideas you already have/);
  assert.match(whenToUse({ id: 'what-if-prompts', family: 'generation', mode: 'divergent', units: ['U2'] }), /hurt the generation of new ideas/);
  assert.doesNotMatch(whenToUse({ id: 'what-if-prompts', family: 'generation', mode: 'divergent' }), /many options/);
  assert.match(whenToUse({ id: 'parallel-prototyping', family: 'development', mode: 'both', units: ['U3'] }), /several directions before critique/);
  assert.doesNotMatch(whenToUse({ id: 'parallel-prototyping', family: 'development', mode: 'both' }), /one chosen idea/);
});

test('committed cards page: up to date, ≥ 20 cards, public fields only, no quotations', () => {
  execFileSync(process.execPath, [join(root, 'scripts/build-method-cards.mjs'), '--check'], { cwd: root, stdio: 'pipe' });
  const html = readFileSync(OUT, 'utf8');
  const cards = html.match(/data-method-card="/g) || [];
  assert.ok(cards.length >= 20, `${cards.length} cards`);
  assert.doesNotMatch(html, /urn:in-practice|catalogue_records|held_note|gap_work|source_status|steps_basis|BIBLIO|vault|Ahmes|Athanor|profield/i);
  assert.doesNotMatch(html, /<blockquote|<q>/, 'no quotations on cards');
  // every card cites only keys that exist in the page's reference list
  const keys = (html.match(/^references: \[(.*)\]$/m) || [])[1].split(', ');
  for (const k of html.matchAll(/href="#ref-([a-z0-9-]+)"/g)) assert.ok(keys.includes(k[1]), k[1]);
});
