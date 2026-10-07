/**
 * EX11 / A6: validator CLI --rights=block|flag modes, orphan check, rights-report freshness.
 * Run: node --test scripts/tests/validate-cli-modes.test.mjs
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const VALIDATOR = path.join(REPO, 'scripts/validate-decks.mjs');

function fixtureRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ex11-val-'));
  fs.writeFileSync(path.join(root, '_config.yml'), 'title: fixture\n');
  fs.mkdirSync(path.join(root, 'docs/tracks/en/uem/2627-ct/u-1-x/data'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs/assets/images/deck-media'), { recursive: true });
  fs.mkdirSync(path.join(root, 'creativity-techniques-pedagogy/excellence/curation'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/assets/images/deck-media/aaaa.webp'), Buffer.alloc(100));
  fs.writeFileSync(path.join(root, 'docs/assets/images/deck-media/orphan.webp'), Buffer.alloc(100));
  fs.writeFileSync(path.join(root, 'creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json'), JSON.stringify({
    assets: [{
      asset_id: 'a:1',
      raw_title: 'File:X.jpg',
      author: 'Example',
      author_death_year: 1950,
      licence: 'PD-old-70',
      licence_url: 'https://example.org/lic',
      canonical_source_url: 'https://example.org/x',
      eu_term_ok: true,
      rights_status: 'ok',
    }],
  }));
  const deck = {
    schema_version: 2,
    assets: [{
      media_slot_id: 'u-1-x.lab-1',
      asset_id: 'a:1',
      asset_url: '/creativity-techniques-uem/assets/images/deck-media/aaaa.webp',
      title: 'X',
      author: 'Example',
      licence: 'PD-old-70',
      canonical_source_url: 'https://example.org/x',
      author_death_year: 1950,
      eu_term_ok: true,
      rights_status: 'ok',
    }],
    slides: [
      { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
      {
        slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'curated',
        asset_id: 'a:1', media_slot_id: 'u-1-x.lab-1', image_brief: 'X',
      },
      { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'TODO' },
    ],
  };
  fs.writeFileSync(path.join(root, 'docs/tracks/en/uem/2627-ct/u-1-x/data/content.json'), `${JSON.stringify(deck, null, 2)}\n`);
  return root;
}

function run(root, args) {
  return spawnSync('node', [VALIDATOR, ...args], { cwd: root, encoding: 'utf8' });
}

test('A6: --rights=block fails a rightsVerdict failure; --rights=flag warns and writes the report', () => {
  const root = fixtureRepo();
  // Break the asset so rightsVerdict fails (empty licence).
  const deckPath = path.join(root, 'docs/tracks/en/uem/2627-ct/u-1-x/data/content.json');
  const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
  deck.assets[0].licence = '';
  deck.assets[0].rights_status = 'flagged';
  fs.writeFileSync(deckPath, `${JSON.stringify(deck, null, 2)}\n`);
  const regPath = path.join(root, 'creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json');
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  reg.assets[0].licence = '';
  reg.assets[0].rights_status = 'flagged';
  fs.writeFileSync(regPath, JSON.stringify(reg));

  const blocked = run(root, ['--strict', '--rights=block']);
  assert.notEqual(blocked.status, 0, blocked.stderr + blocked.stdout);
  assert.match(blocked.stderr + blocked.stdout, /rightsVerdict|rights:/);

  const flagged = run(root, ['--strict', '--rights=flag']);
  // orphan.webp still errors under strict
  assert.notEqual(flagged.status, 0);
  assert.match(flagged.stderr + flagged.stdout, /orphan cache file/);
  const reportPath = path.join(root, 'creativity-techniques-pedagogy/excellence/curation/rights-report.json');
  assert.ok(fs.existsSync(reportPath), 'flag mode writes rights-report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert.equal(typeof report.summary.curator_flagged, 'number');
  assert.ok(report.summary.curator_flagged >= 1);
});

test('A6: orphan cache file is an error', () => {
  const root = fixtureRepo();
  const r = run(root, ['--strict', '--rights=flag']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr + r.stdout, /orphan cache file deck-media\/orphan\.webp/);
});

test('A6: rights report lists every bound asset after a clean flag run (freshness content)', () => {
  const root = fixtureRepo();
  fs.unlinkSync(path.join(root, 'docs/assets/images/deck-media/orphan.webp'));
  const r = run(root, ['--strict', '--rights=flag']);
  assert.equal(r.status, 0, r.stderr + r.stdout);
  const report = JSON.parse(fs.readFileSync(
    path.join(root, 'creativity-techniques-pedagogy/excellence/curation/rights-report.json'), 'utf8',
  ));
  assert.equal(report.assets.length, 1);
  assert.equal(report.assets[0].asset_id, 'a:1');
  assert.equal(report.assets[0].media_slot_id, 'u-1-x.lab-1');
  assert.equal(report.summary.curator_flagged, 0);
  assert.ok(report.generated_at);
});
