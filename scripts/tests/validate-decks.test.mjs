/**
 * Validator rules (PHASE-EX3 deliverable 4): deckProblems() in scripts/lib/media-rules.mjs.
 * The pre-EX3 pipeline had no validator, so there is no legacy mode here; the
 * legacy counterpart of the dangling-slot rule is in media-rules.test.mjs (B7).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { deckProblems } from '../lib/media-rules.mjs';

const okAsset = {
  media_slot_id: 'U1.lab-1',
  asset_id: 'a:1',
  asset_url: '/site/assets/images/deck-media/aaaa.webp',
  title: 'Duchamp',
  author: 'Example Photographer',
  licence: 'PD-old-70',
  canonical_source_url: 'https://commons.wikimedia.org/wiki/File:X.jpg',
  author_death_year: 1950,
  eu_term_ok: true,
  rights_status: 'ok',
};
const v2 = (over = {}) => ({
  schema_version: 2,
  assets: [okAsset],
  slides: [
    { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
    { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'curated', asset_id: 'a:1', media_slot_id: 'U1.lab-1', image_brief: 'Duchamp readymade.' },
    { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'diagram', image_brief: 'TODO: Dada poster.' },
  ],
  ...over,
});
const ctx = (over = {}) => ({ unit: 'U1', cacheFiles: new Map([['aaaa.webp', 100_000]]), year: 2026, ...over });

test('validator: a clean v2 deck has no errors', () => {
  const r = deckProblems(v2(), ctx());
  assert.deepEqual(r.errors, []);
  assert.equal(r.rights[0].ok, true);
});

test('validator: dangling slot is an error on v2 decks', () => {
  const deck = v2({ assets: [] });
  const r = deckProblems(deck, ctx());
  assert.ok(r.errors.some((e) => /dangling slot U1\.lab-1/.test(e)), r.errors.join('\n'));
});

test('validator: legacy deck (no schema_version) only warns — U4 stays buildable', () => {
  const legacy = { assets: [], slides: [{ slide_role: 'masterclass', background_kind: 'profield', media_slot_id: 'U4.still.profield-1' }] };
  const r = deckProblems(legacy, ctx({ unit: 'U4' }));
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => /dangling/.test(w)));
});

test('validator: curated slide without image_brief or asset_id', () => {
  const deck = v2();
  deck.slides[1] = { ...deck.slides[1], image_brief: '' };
  assert.ok(deckProblems(deck, ctx()).errors.some((e) => /without image_brief/.test(e)));
  const deck2 = v2({ assets: [] });
  deck2.slides[1] = { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'curated', image_brief: 'x' };
  assert.ok(deckProblems(deck2, ctx()).errors.some((e) => /without asset_id/.test(e)));
});

test('validator: slide without slide_id, bad background_kind, "profield" value', () => {
  const deck = v2();
  deck.slides[2] = { slide_role: 'lab_exercise', background_kind: 'profield', heading: 'Exercise 2' };
  const errors = deckProblems(deck, ctx()).errors.join('\n');
  assert.match(errors, /slide without slide_id/);
  assert.match(errors, /background_kind "profield"/);
  assert.match(errors, /contains "profield"/);
});

test('validator: missing file, > 600 KB file, non-whitelisted extension', () => {
  assert.ok(deckProblems(v2(), ctx({ cacheFiles: new Map() })).errors.some((e) => /file missing/.test(e)));
  assert.ok(deckProblems(v2(), ctx({ cacheFiles: new Map([['aaaa.webp', 700 * 1024]]) })).errors.some((e) => /> 614400/.test(e)));
  const php = v2({ assets: [{ ...okAsset, asset_url: '/site/assets/images/deck-media/aaaa.php' }] });
  assert.ok(deckProblems(php, ctx({ cacheFiles: new Map([['aaaa.php', 1000]]) })).errors.some((e) => /extension \.php not allowed/.test(e)));
});

test('validator: duplicate asset use across slides', () => {
  const deck = v2();
  deck.slides[2] = { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'curated', asset_id: 'a:1', media_slot_id: 'U1.lab-2', image_brief: 'x' };
  deck.assets = [okAsset, { ...okAsset, media_slot_id: 'U1.lab-2' }];
  assert.ok(deckProblems(deck, ctx()).errors.some((e) => /asset a:1 used on 2 slides/.test(e)));
});

test('validator: rights — failing asset is reported; "ok" status on a failing asset is an error', () => {
  const flagged = v2({ assets: [{ ...okAsset, licence: '', rights_status: 'flagged' }] });
  const r = deckProblems(flagged, ctx());
  assert.deepEqual(r.errors, [], 'flagged is allowed by deckProblems; the CLI decides block vs flag');
  assert.equal(r.rights[0].ok, false);
  const lying = v2({ assets: [{ ...okAsset, licence: '', rights_status: 'ok' }] });
  assert.ok(deckProblems(lying, ctx()).errors.some((e) => /rights_status "ok" but rightsVerdict fails/.test(e)));
});

test('validator: the private registry overrides deck fields (raw title with review tag)', () => {
  const registry = new Map([['a:1', { raw_title: 'File:X.jpg [modern_rights_review_required]' }]]);
  const r = deckProblems(v2({ assets: [{ ...okAsset, rights_status: 'flagged' }] }), ctx({ registry }));
  assert.equal(r.rights[0].ok, false);
  assert.ok(r.rights[0].reasons.some((x) => /modern_rights_review_required/.test(x)));
});

test('A6/F3: with requireRegistry, a bound asset without a registry raw_title is an error', () => {
  const r = deckProblems(v2(), ctx({ requireRegistry: true }));
  assert.ok(r.errors.some((e) => /no registry record with raw_title/.test(e)), r.errors.join('\n'));
  const reg = new Map([['a:1', { asset_id: 'a:1', raw_title: 'File:X.jpg' }]]);
  assert.deepEqual(deckProblems(v2(), ctx({ requireRegistry: true, registry: reg })).errors, []);
  const tagged = new Map([['a:1', { asset_id: 'a:1', raw_title: 'File:X.jpg [modern_rights_review_required]' }]]);
  const r2 = deckProblems(v2(), ctx({ requireRegistry: true, registry: tagged }));
  assert.ok(r2.errors.some((e) => /rights_status "ok" but rightsVerdict fails/.test(e)), 'review tag in registry raw_title cannot publish as ok');
});

test('A6/F6: a raw SVG in deck-media is an error on v2 decks', () => {
  const deck = v2({ assets: [{ ...okAsset, asset_url: '/site/assets/images/deck-media/aaaa.svg' }] });
  const r = deckProblems(deck, ctx({ cacheFiles: new Map([['aaaa.svg', 2000]]) }));
  assert.ok(r.errors.some((e) => /raw \.svg/.test(e)), r.errors.join('\n'));
});

test('A7: curator-only rights_status flagged cannot be hand-edited to ok', () => {
  const registry = new Map([['a:1', {
    asset_id: 'a:1',
    raw_title: 'File:X.jpg',
    rights_status: 'flagged',
    flag_reason: 'identifiable sitter',
    author: 'Unknown',
    licence: 'PD-EU',
    canonical_source_url: 'https://example.org/x',
    eu_term_ok: true,
  }]]);
  const lying = v2({ assets: [{ ...okAsset, rights_status: 'ok', licence: 'PD-EU', eu_term_ok: true }] });
  const r = deckProblems(lying, ctx({ registry, requireRegistry: true }));
  assert.ok(r.errors.some((e) => /curator registry is flagged/.test(e)), r.errors.join('\n'));
  const honest = v2({ assets: [{ ...okAsset, rights_status: 'flagged', licence: 'PD-EU', eu_term_ok: true }] });
  assert.deepEqual(deckProblems(honest, ctx({ registry, requireRegistry: true })).errors, []);
});
