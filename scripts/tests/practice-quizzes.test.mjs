/**
 * Practice quizzes, retrieval slides and the private question bank (PHASE-EX10).
 *
 *   node --test scripts/tests/
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

import { BANK, options, PER_UNIT } from '../build-practice-quizzes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const bank = yaml.load(readFileSync(BANK, 'utf8'));
const refs = yaml.load(readFileSync(join(root, 'docs/_data/references.yml'), 'utf8'));
const deck = (slug) => JSON.parse(readFileSync(join(root, `docs/tracks/en/uem/2627-ct/${slug}/data/content.json`), 'utf8').replace(/^---[\s\S]*?---\s*/, ''));
const HIGHER = ['apply', 'analyse', 'evaluate', 'create'];
const RA = ['RA5', 'RA6', 'RA12', 'RA14', 'RA15'];

test('bank: ≥ 20 per unit, required fields, refs exist and are cited by the unit lesson, guía RA codes, ≥ 30% higher order', () => {
  const qs = bank.questions;
  for (const [unit, info] of Object.entries(bank.units)) {
    const mine = qs.filter((q) => q.unit === unit);
    assert.ok(mine.length >= 20, `${unit}: ${mine.length}`);
    const lesson = readFileSync(join(root, `docs/lessons/en/creativity-techniques/${info.slug}/index.md`), 'utf8');
    const keys = (lesson.match(/^references: \[(.*)\]$/m) || [])[1].split(', ');
    for (const q of mine) assert.ok(keys.includes(q.ref), `${q.id}: ${q.ref} not in the ${unit} lesson references`);
  }
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length, 'unique ids');
  for (const q of qs) {
    for (const f of ['id', 'unit', 'ra', 'type', 'stem', 'answer', 'ref', 'bloom', 'where', 'anchor']) assert.ok(String(q[f] ?? '').trim(), `${q.id}: ${f}`);
    assert.ok(refs[q.ref], `${q.id}: unknown ref ${q.ref}`);
    assert.ok(RA.includes(q.ra), `${q.id}: ${q.ra}`);
    assert.ok(['mcq', 'short', 'case'].includes(q.type), q.id);
    if (q.type === 'mcq') assert.ok((q.distractors || []).length >= 2, `${q.id}: distractors`);
    assert.doesNotMatch(q.stem, /\bpages? (?:number|\d)|\bpp?\.\s*\d/i, `${q.id}: no page-number questions`);
  }
  const high = qs.filter((q) => HIGHER.includes(q.bloom)).length;
  assert.ok(high / qs.length >= 0.3, `${high}/${qs.length}`);
});

test('practice pages: up to date with the bank, five data-question each, nothing private', () => {
  execFileSync(process.execPath, [join(root, 'scripts/build-practice-quizzes.mjs'), '--check'], { cwd: root, stdio: 'pipe' });
  for (const [unit, info] of Object.entries(bank.units)) {
    const html = readFileSync(join(root, `docs/practice/en/${info.slug}/index.html`), 'utf8');
    const ids = [...html.matchAll(/data-question="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, PER_UNIT, unit);
    assert.deepEqual(ids, bank.questions.filter((q) => q.unit === unit && q.public_quiz).map((q) => q.id));
    assert.doesNotMatch(html, /\bRA1?\d\b|bloom|drafted|qwen|question-bank|MEASUREMENT-PROTOCOL/i, `${unit}: private field leaked`);
    assert.equal((html.match(/<details>/g) || []).length, PER_UNIT, 'answers revealed on click');
  }
});

test('mcq answer letters rotate (no fixed position on a page)', () => {
  const pos = [0, 1, 2, 3].map((slot) => options({ unit: 'U1', id: 'x', answer: 'A', distractors: ['b', 'c', 'd'] }, slot).correct);
  assert.equal(new Set(pos).size, 4);
});

test('retrieval slides: one per U1–U3 deck, last Masterclass slide, questions = bank retrieval forms, answers only in notes', () => {
  for (const [unit, info] of Object.entries(bank.units)) {
    const slides = deck(info.slug).slides;
    const idx = slides.map((s, i) => (s.slide_role === 'retrieval' ? i : -1)).filter((i) => i >= 0);
    assert.equal(idx.length, 1, `${unit}: retrieval slides`);
    const i = idx[0];
    assert.equal(slides[i - 1].slide_role, 'masterclass', `${unit}: after the Masterclass`);
    assert.equal(slides[i + 1].slide_role, 'lab_opener', `${unit}: before lab_opener`);
    const expected = bank.questions.filter((q) => q.unit === unit && q.retrieval).map((q) => q.retrieval);
    assert.deepEqual(slides[i].questions, expected);
    assert.match(slides[i].notes, /Answers:/);
    assert.equal((slides[i].notes.match(/^- [1-5]\. /gm) || []).length, 5, `${unit}: five answers in notes`);
  }
});
