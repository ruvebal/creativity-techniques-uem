/**
 * EX11 / A1–A2 probe hardenings — fixture tests (one case each).
 * Run: node --test scripts/tests/excellence-probe.test.mjs
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROBE = path.join(ROOT, 'creativity-techniques-pedagogy/excellence/probe/excellence-probe.mjs');

function tmpRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ex11-probe-'));
  fs.writeFileSync(path.join(root, '_config.yml'), 'title: fixture\n');
  fs.mkdirSync(path.join(root, '_site'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'creativity-techniques-pedagogy/excellence'), { recursive: true });
  fs.writeFileSync(path.join(root, 'creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md'),
    'weights_knowledge_tests: 60\nweights_work: 40\n');
  return root;
}

function writeDeck(root, relDir, content) {
  const file = path.join(root, relDir, 'data', 'content.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`);
}

function probe(root, extra = []) {
  const out = execFileSync('node', [PROBE, '--root', root, '--site', path.join(root, '_site'), '--commit', 'fixture', ...extra], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(out);
}

test('A1: master-lecture deck under 2627-ml is measured', () => {
  const root = tmpRoot();
  writeDeck(root, 'docs/tracks/en/uem/2627-ml/creative-process-analysis', {
    schema_version: 2,
    assets: [],
    slides: [
      { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
      { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'x' },
      { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'y' },
    ],
  });
  const r = probe(root);
  assert.equal(r.lab_exercise_counts['creative-process-analysis'], 2);
});

test('A2: empty public_weights is unmet', () => {
  const root = tmpRoot();
  writeDeck(root, 'docs/tracks/en/uem/2627-ct/u-1-x', {
    schema_version: 2,
    assets: [{ media_slot_id: 'U1.lab-1', asset_id: 'a', licence: 'CC0', asset_url: '/x.webp' }],
    slides: [
      { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
      { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'x' },
      { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'y' },
    ],
  });
  // rights report stub so freshness does not dominate this case
  fs.mkdirSync(path.join(root, 'creativity-techniques-pedagogy/excellence/curation'), { recursive: true });
  fs.writeFileSync(path.join(root, 'creativity-techniques-pedagogy/excellence/curation/rights-report.json'), JSON.stringify({
    schema: 'deck-rights-report/v1',
    summary: { curator_flagged: 0 },
    assets: [{
      deck: 'docs/tracks/en/uem/2627-ct/u-1-x/data/content.json',
      asset_id: 'a',
      media_slot_id: 'U1.lab-1',
      rights_status: 'ok',
    }],
  }));
  let code = 0;
  let body = '';
  try {
    body = execFileSync('node', [PROBE, '--root', root, '--site', path.join(root, '_site'), '--targets', '--commit', 'fixture'], {
      encoding: 'utf8',
    });
  } catch (e) {
    code = e.status;
    body = e.stdout || '';
  }
  assert.equal(code, 1);
  const result = JSON.parse(body);
  assert.ok(result.unmet.some((u) => /public_weights: empty/.test(u)), result.unmet.join('\n'));
});

test('A2: author-date quote without quote_origin is flagged', () => {
  const root = tmpRoot();
  writeDeck(root, 'docs/tracks/en/uem/2627-ct/u-1-x', {
    schema_version: 2,
    assets: [],
    slides: [
      { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
      {
        slide_id: 'masterclass-1',
        slide_role: 'masterclass',
        quote: 'Something learned.',
        citation: { label: '(Craft 2000, 30)', href: '#ref-craft-2000' },
        background_kind: 'diagram',
        image_brief: 'x',
      },
      { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'x' },
      { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'y' },
    ],
  });
  const r = probe(root);
  assert.equal(r.quotes_missing_quote_origin.length, 1);
  assert.equal(r.quotes_missing_quote_origin[0].slide_id, 'masterclass-1');
});

test('A2: rank dealing detected by index behaviour, not only rankCursor name', async () => {
  const { rankDealingInSource } = await import(pathToFileURL(PROBE).href);
  assert.equal(rankDealingInSource('const id = slide.asset_id; pool.push(id);'), false);
  assert.equal(rankDealingInSource('const a = rankedSlots[i]; slides[i].asset = a;'), true);
  // No slide-bound id and no index pool → still rank dealing (missing bind-by-id).
  assert.equal(rankDealingInSource('const pool = ranked; for (const s of slides) s.bg = pool[cursor++];'), true);
});

function pathToFileURL(p) {
  return new URL(`file://${p}`);
}

test('A2: zero lab slides and asset reuse are measured', () => {
  const root = tmpRoot();
  writeDeck(root, 'docs/tracks/en/uem/2627-ct/u-1-x', {
    schema_version: 2,
    assets: [
      { media_slot_id: 'U1.a', asset_id: 'reuse-me', licence: 'CC0', asset_url: '/a.webp' },
      { media_slot_id: 'U1.b', asset_id: 'reuse-me', licence: 'CC0', asset_url: '/a.webp' },
    ],
    slides: [
      { slide_id: 'cover', slide_role: 'unit_cover', background_kind: 'curated', asset_id: 'reuse-me', media_slot_id: 'U1.a', image_brief: 'a' },
      { slide_id: 'mc-1', slide_role: 'masterclass', background_kind: 'curated', asset_id: 'reuse-me', media_slot_id: 'U1.b', image_brief: 'b' },
    ],
  });
  const r = probe(root);
  assert.deepEqual(r.zero_lab_decks, ['u-1-x']);
  assert.equal(r.asset_reuse['u-1-x'].length, 1);
  assert.equal(r.lab_exercise_counts['u-1-x'], 0);
});
