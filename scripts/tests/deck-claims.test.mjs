/**
 * EX11 / A10: structured slide.claims [{text, cite}] must be attested on the
 * cited page — checked against VERIFIED PROVENANCE_LINE verbatims (or, when the
 * provenance line has no verbatim=, against the slide quote for that cite).
 *
 * Run: node --test scripts/tests/deck-claims.test.mjs
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PAIRS = [
  ['docs/tracks/en/uem/2627-ct/u-1-introduction-creativity/data/content.json', 'docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md'],
  ['docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json', 'docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md'],
  ['docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json', 'docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md'],
  ['docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json', 'docs/lessons/en/master-lectures/creative-process-analysis/index.md'],
];

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function readDeck(rel) {
  const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  return JSON.parse(raw.replace(/^---[\s\S]*?---\s*/, ''));
}

function provenance(lessonRel) {
  const text = fs.readFileSync(path.join(ROOT, lessonRel), 'utf8');
  const out = [];
  for (const line of text.split('\n')) {
    if (!line.includes('PROVENANCE_LINE') || !line.includes('status=VERIFIED')) continue;
    const cite = (line.match(/public_citation="\(([^"]+)\)"/) || line.match(/public="\(([^"]+)\)"/) || [])[1];
    const verb = (line.match(/verbatim="((?:\\.|[^"\\])*)"/) || [])[1];
    if (cite) out.push({ cite: cite.trim(), text: verb ? verb.replace(/\\"/g, '"').trim() : null });
  }
  return out;
}

function labelCite(slide) {
  const c = slide.citation;
  const lab = c && typeof c === 'object' ? c.label : c;
  const m = String(lab || '').match(/\(([^)]*\d{4}[^)]*)\)/);
  return m ? m[1].trim() : null;
}

for (const [deckRel, lessonRel] of PAIRS) {
  const slug = path.basename(path.dirname(path.dirname(deckRel)));
  test(`${slug}: every claim is attested on its cited page`, () => {
    const deck = readDeck(deckRel);
    const prov = provenance(lessonRel);
    const byCite = new Map();
    for (const p of prov) {
      const k = norm(p.cite);
      if (!byCite.has(k)) byCite.set(k, []);
      byCite.get(k).push(p);
    }
    const bad = [];
    let claimCount = 0;
    for (const slide of deck.slides || []) {
      const claims = Array.isArray(slide.claims) ? slide.claims : [];
      for (const claim of claims) {
        claimCount += 1;
        const text = String(claim.text || '').trim();
        const cite = String(claim.cite || '').trim();
        if (!text || !cite) {
          bad.push(`${slide.slide_id}: empty claim field`);
          continue;
        }
        const rows = byCite.get(norm(cite)) || [];
        if (!rows.length) {
          bad.push(`${slide.slide_id}: cite (${cite}) has no VERIFIED provenance`);
          continue;
        }
        const verbMatch = rows.some((r) => r.text && norm(r.text) === norm(text));
        const quoteFallback = slide.quote && norm(slide.quote) === norm(text) && norm(labelCite(slide) || '') === norm(cite);
        if (!verbMatch && !quoteFallback) {
          bad.push(`${slide.slide_id}: claim text not on provenance verbatim for (${cite}): ${text.slice(0, 80)}`);
        }
      }
    }
    assert.ok(claimCount > 0, 'expected at least one structured claim on this deck');
    assert.deepEqual(bad, []);
  });
}
