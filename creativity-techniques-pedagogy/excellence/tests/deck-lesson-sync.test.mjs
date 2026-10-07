// PHASE-EX6 round 2 (cold review F1/F2): every author-date pin in a deck
// (slide sentence, quote citation label, speaker notes) must also appear, with
// the same locator, in the lesson the deck belongs to; and no deck note may say
// a lesson idea has "no page cite" (stale once the lesson cites it).
//
// Run: node --test creativity-techniques-pedagogy/excellence/tests/deck-lesson-sync.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const PAIRS = [
  ['docs/tracks/en/uem/2627-ct/u-1-introduction-creativity/data/content.json', 'docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md'],
  ['docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json', 'docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md'],
  ['docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json', 'docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md'],
  ['docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json', 'docs/lessons/en/master-lectures/creative-process-analysis/index.md'],
];

const norm = (s) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
const AUTHOR = String.raw`(?:de Bono|[A-ZÀ-Ý][\p{L}'-]+(?:(?:,| and|, and) [A-ZÀ-Ý][\p{L}'-]+)*(?: et al\.)?)`;
// "Author Year, locator" inside a parenthetical; locator runs to ";" or ")".
const PIN = new RegExp(String.raw`(${AUTHOR}) ((?:1[89]|20)\d\d)(?:, ((?:chap\. "[^"]*"|[^;)])+))?`, 'gu');

function pins(text) {
  const out = new Set();
  for (const paren of norm(text).matchAll(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)) {
    for (const m of paren[1].matchAll(PIN)) {
      const ay = `${m[1]} ${m[2]}`;
      if (!m[3]) { out.add(ay); continue; }
      for (const loc of m[3].split(/,\s*(?=\d|chap\.|introduction|vi\b)/)) out.add(`${ay}, ${loc.trim()}`);
    }
  }
  return out;
}

function deckTexts(file) {
  let t = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const fm = t.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (fm) t = t.slice(fm[0].length);
  const deck = JSON.parse(t);
  return deck.slides.map((s) => {
    let notes = s.notes;
    if (notes && typeof notes === 'object' && !Array.isArray(notes)) {
      notes = notes.text ?? notes.body ?? notes.notes ?? '';
    }
    const claimText = Array.isArray(s.claims) ? s.claims.map((c) => `${c.text} (${c.cite})`).join('\n') : '';
    return {
      id: s.slide_id,
      text: [s.sentence, notes, claimText, s.citation && typeof s.citation === 'object' ? s.citation.label : s.citation].filter(Boolean).join('\n'),
    };
  });
}

for (const [deckFile, lessonFile] of PAIRS) {
  const lesson = fs.readFileSync(path.join(ROOT, lessonFile), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ''); // student-visible text only
  const lessonPins = pins(lesson);
  // A slide-only quote (no lesson sentence) is allowed when the lesson's
  // provenance records it with surface=deck…; its pin counts as the lesson's.
  const raw = fs.readFileSync(path.join(ROOT, lessonFile), 'utf8');
  for (const line of raw.split('\n').filter((l) => /PROVENANCE_LINE/.test(l) && /surface=deck/.test(l))) {
    for (const p of pins(line)) lessonPins.add(p);
  }
  test(`${path.basename(path.dirname(path.dirname(deckFile)))}: deck pins appear in the lesson`, () => {
    const missing = [];
    for (const s of deckTexts(deckFile)) {
      for (const p of pins(s.text)) if (!lessonPins.has(p) && p !== 'Tao of Creativity') missing.push(`${s.id}: ${p}`);
    }
    assert.deepEqual(missing, []);
  });
  test(`${path.basename(path.dirname(path.dirname(deckFile)))}: no stale "no page cite" notes`, () => {
    const stale = deckTexts(deckFile).filter((s) => /no page (cite|source)/i.test(s.text)).map((s) => s.id);
    assert.deepEqual(stale, []);
  });
}
