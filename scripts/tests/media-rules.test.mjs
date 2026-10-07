/**
 * Image-pipeline rules (PHASE-EX3, FINDINGS B1, B3, B6, B7, B8, B11, B13, E7).
 *
 * Each live failing case is one test. The tests run against
 * scripts/lib/media-rules.mjs by default. With MEDIA_RULES_IMPL=legacy they run
 * against the pre-EX3 logic, copied verbatim (or as a faithful adapter) from
 * scripts/rehydrate-student-media.mjs at commit 1158f9e into the `legacy*`
 * helpers below. Against legacy they FAIL: that is the proof that the tests
 * would have caught the bugs.
 *
 *   node --test scripts/tests/                          # new rules: must pass
 *   MEDIA_RULES_IMPL=legacy node --test scripts/tests/  # legacy: must fail
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

// ---------------------------------------------------------------------------
// Legacy logic (copied from scripts/rehydrate-student-media.mjs @ 1158f9e)
// ---------------------------------------------------------------------------

/** Legacy lines 56–61: the only "rights" action — hide the review tag. */
function legacyStripReviewTag(title) {
  return String(title || '')
    .replace(/^File:/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/g, '')
    .trim();
}

/** Legacy lines 100–107: URL path extension wins over Content-Type. */
function legacyExtensionFromUrl(url, contentType) {
  const pathExt = (String(url).split('?')[0].match(/\.([a-z0-9]+)$/i) || [])[1];
  if (pathExt && pathExt.length <= 5) return pathExt.toLowerCase();
  if (/png/i.test(contentType || '')) return 'png';
  if (/webp/i.test(contentType || '')) return 'webp';
  if (/gif/i.test(contentType || '')) return 'gif';
  return 'jpg';
}

/** Legacy lines 50–54. */
function legacySelectionScore(asset) {
  const rank = asset.review_rank ?? asset.rank;
  return rank != null ? Number(rank) : 0;
}

/**
 * Legacy lines 409–439: sort accepted assets by rank, mint `<unit>.still.profield-N`
 * slots, then deal them to media slides with `rankCursor % rankedSlots.length`.
 * A slide's own asset_id is ignored.
 */
function legacyBindSlides(content, acceptedAssets, { unit }) {
  const selected = [...acceptedAssets]
    .sort((a, b) => legacySelectionScore(b) - legacySelectionScore(a) || String(a.asset_id).localeCompare(String(b.asset_id)));
  const assets = selected.map((asset, index) => ({ ...asset, media_slot_id: `${unit}.still.profield-${index + 1}` }));
  const rankedSlots = assets.map((a) => a.media_slot_id);
  let rankCursor = 0;
  const structuralRoles = new Set(['analysis_opener', 'lab_opener', 'workshop_opener', 'outro']);
  const slides = (content.slides || []).map((slide) => {
    if (slide.background_kind === 'geometrical' || slide.background_kind === 'diagram') return slide;
    if (structuralRoles.has(slide.slide_role)) return slide;
    if (!assets.length) return slide;
    const wantsMedia = slide.background_kind === 'profield'
      || Boolean(slide.media_slot_id)
      || slide.slide_role === 'masterclass'
      || slide.slide_role === 'lab_exercise'
      || slide.slide_role === 'analysis_model';
    if (!wantsMedia) return slide;
    const slot = rankedSlots[rankCursor % rankedSlots.length];
    rankCursor += 1;
    return { ...slide, media_slot_id: slot, background_kind: 'profield' };
  });
  return { slides, assets, problems: [] };
}

/** Legacy publication rule: every accepted asset was published (no rights check). */
function legacyRightsVerdict() {
  return { ok: true, reasons: [] };
}

/** Legacy public caption fields (publicAsset, lines 171–189): no author, no licence URL. */
function legacyCaption(asset) {
  return {
    title: legacyStripReviewTag(asset.title),
    credit: asset.provider,
    licence: asset.licence || '',
    source_url: asset.canonical_source_url || '',
  };
}

/** Legacy pipeline had no dangling-slot check at all (FINDINGS B7). */
function legacyFindDanglingSlots() {
  return [];
}

const legacy = {
  extensionFor: (contentType, url) => legacyExtensionFromUrl(url, contentType),
  rightsVerdict: legacyRightsVerdict,
  bindSlides: legacyBindSlides,
  caption: legacyCaption,
  findDanglingSlots: legacyFindDanglingSlots,
};

const impl = process.env.MEDIA_RULES_IMPL === 'legacy'
  ? legacy
  : await import('../lib/media-rules.mjs');

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const cleanAsset = {
  asset_id: 'wikimedia:File:Example.jpg',
  title: 'Example',
  raw_title: 'File:Example.jpg',
  author: 'Jane Example',
  licence: 'CC-BY-4.0',
  licence_url: 'https://creativecommons.org/licenses/by/4.0/',
  canonical_source_url: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
  eu_term_ok: true,
  eu_term_reason: 'Licensed by the author under CC BY 4.0; copyright term not relied on.',
};

const deck = (slides) => ({ slides });

// ---------------------------------------------------------------------------
// B11 — extension from Content-Type, never from the URL path
// ---------------------------------------------------------------------------

test('B11: NYPL index.php?id=…&t=w served as image/jpeg is cached as jpg, never .php', () => {
  const url = 'https://images.nypl.org/index.php?id=1634206&t=w';
  assert.equal(impl.extensionFor('image/jpeg', url), 'jpg');
  assert.equal(impl.extensionFor('image/jpeg; charset=binary', url), 'jpg');
  assert.notEqual(impl.extensionFor('image/jpeg', url), 'php');
});

test('B11: non-image Content-Type (HTML error page behind index.php) is refused, not saved', () => {
  assert.equal(impl.extensionFor('text/html; charset=utf-8', 'https://images.nypl.org/index.php?id=1'), null);
  assert.equal(impl.extensionFor('application/x-httpd-php', 'https://example.org/image.php'), null);
});

test('B11: whitelist jpg/png/webp/gif/svg from the header', () => {
  assert.equal(impl.extensionFor('image/png', 'https://x.org/a'), 'png');
  assert.equal(impl.extensionFor('image/webp', 'https://x.org/a'), 'webp');
  assert.equal(impl.extensionFor('image/gif', 'https://x.org/a'), 'gif');
  assert.equal(impl.extensionFor('image/svg+xml', 'https://x.org/a.svg'), 'svg');
  assert.equal(impl.extensionFor('image/tiff', 'https://x.org/a.tif'), null);
});

// ---------------------------------------------------------------------------
// B8 — review tags block publication instead of being stripped
// ---------------------------------------------------------------------------

test('B8: Commons title tagged [modern_rights_review_required] is rejected, not stripped and published', () => {
  const sprite = {
    ...cleanAsset,
    asset_id: 'wikimedia:File:Sprite Fright-concept art-Victoria 01.png',
    raw_title: 'File:Sprite Fright-concept art-Victoria 01.png [modern_rights_review_required]',
    title: 'Sprite Fright-concept art-Victoria 01',
  };
  const verdict = impl.rightsVerdict(sprite);
  assert.equal(verdict.ok, false);
  assert.ok(verdict.reasons.some((r) => /rights_review_required/.test(r)), verdict.reasons.join('; '));
});

test('B8: any *_review_required tag in the raw title blocks', () => {
  const verdict = impl.rightsVerdict({ ...cleanAsset, raw_title: 'File:X.jpg [people_review_required]' });
  assert.equal(verdict.ok, false);
});

test('rightsVerdict is strict: licence whitelist, author, source URL, EU term', () => {
  assert.equal(impl.rightsVerdict(cleanAsset).ok, true, 'control: a complete CC BY 4.0 record passes');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, licence: '' }).ok, false, 'empty licence (FINDINGS B9)');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, licence: 'CC-BY-NC-4.0' }).ok, false, 'non-commercial licence');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, author: '  ' }).ok, false, 'author missing');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, author: undefined }).ok, false, 'author undefined');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, canonical_source_url: '' }).ok, false, 'source missing');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, eu_term_ok: false }).ok, false, 'EU term not ok');
  assert.equal(impl.rightsVerdict({ ...cleanAsset, eu_term_ok: undefined }).ok, false, 'EU term unknown');
});

test('rightsVerdict EU term (B10): death year + 70 must be before the current year, or a reason is stated', () => {
  const pd = { ...cleanAsset, licence: 'PD-old-70', eu_term_reason: '' };
  assert.equal(impl.rightsVerdict({ ...pd, author_death_year: 1968 }, { year: 2026 }).ok, false, 'Duchamp d. 1968: protected in the EU until 2038');
  assert.equal(impl.rightsVerdict({ ...pd, author_death_year: 1955 }, { year: 2026 }).ok, true, 'd. 1955 + 70 = 2025 < 2026');
  assert.equal(impl.rightsVerdict({ ...pd, author_death_year: 1956 }, { year: 2026 }).ok, false, 'd. 1956 + 70 = 2026, not < 2026');
  assert.equal(impl.rightsVerdict({ ...pd, author_death_year: null }, { year: 2026 }).ok, false, 'no death year, no reason');
});

test('A6/F1: a death year that contradicts a PD / EU-term claim fails, whatever the reason text', () => {
  const duchamp = { ...cleanAsset, licence: 'PD-old-70', author: 'Marcel Duchamp', author_death_year: 1968, eu_term_ok: true };
  for (const reason of ['public domain in the US', 'Published before 1929; PD in the United States', 'expired term', '']) {
    const v = impl.rightsVerdict({ ...duchamp, eu_term_reason: reason }, { year: 2026 });
    assert.equal(v.ok, false, `reason "${reason}" must not override d. 1968`);
  }
  for (const licence of ['PD-EU', 'PDM', 'NoC-US+EU-checked']) {
    assert.equal(impl.rightsVerdict({ ...duchamp, licence, eu_term_reason: 'PD' }, { year: 2026 }).ok, false, licence);
  }
  // The gate's exact case: no eu_term_ok flag at all.
  assert.equal(impl.rightsVerdict({ licence: 'PD-old-70', author: 'Marcel Duchamp', author_death_year: 1968,
    eu_term_reason: 'public domain in the US', canonical_source_url: 'https://commons.wikimedia.org/x', title: 'x' }).ok, false);
  // Controls: an expired term passes; a holder licence (CC BY) does not rest on the term.
  assert.equal(impl.rightsVerdict({ ...duchamp, author: 'Alfred Stieglitz', author_death_year: 1946, eu_term_reason: '' }, { year: 2026 }).ok, true);
  assert.equal(impl.rightsVerdict({ ...cleanAsset, author_death_year: 2020 }, { year: 2026 }).ok, true, 'CC BY by a recently deceased author');
});

// ---------------------------------------------------------------------------
// B1 / B3 / B13 — slide asset_id is the only binding
// ---------------------------------------------------------------------------

test('B3/B13: slide asset_id binding wins over rank (no rank dealing)', () => {
  const content = deck([
    { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'curated', asset_id: 'nypl:duchamp' },
    { slide_id: 'lab-opener', slide_role: 'lab_opener', background_kind: 'geometrical' },
    { slide_id: 'lab-2', slide_role: 'lab_exercise', background_kind: 'curated', asset_id: 'nypl:hook-and-ladder' },
  ]);
  const accepted = [
    { ...cleanAsset, asset_id: 'nypl:hook-and-ladder', title: 'Hook and ladder in action', rank: 4 },
    { ...cleanAsset, asset_id: 'nypl:duchamp', title: 'Duchamp', rank: 1 },
  ];
  const { slides, assets } = impl.bindSlides(content, accepted, { unit: 'U1' });
  const bySlot = new Map(assets.map((a) => [a.media_slot_id, a.asset_id]));
  assert.equal(bySlot.get(slides[0].media_slot_id), 'nypl:duchamp', 'the Duchamp slide shows the asset it names, not the top-ranked one');
  assert.equal(bySlot.get(slides[2].media_slot_id), 'nypl:hook-and-ladder');
  assert.equal(slides[0].media_slot_id, 'U1.lab-1', 'slot id is <unit>.<slide_id>');
  assert.equal(slides[1].background_kind, 'geometrical', 'structural slide untouched');
});

test('B1: a media slide without its own asset_id is not dealt a ranked asset', () => {
  const content = deck([
    { slide_id: 'masterclass-1', slide_role: 'masterclass', background_kind: 'curated' },
  ]);
  const { slides } = impl.bindSlides(content, [{ ...cleanAsset, rank: 5 }], { unit: 'U1' });
  assert.equal(slides[0].background_kind, 'diagram');
  assert.equal(slides[0].media_slot_id, undefined);
});

// ---------------------------------------------------------------------------
// B6 — no wrap-around repeats
// ---------------------------------------------------------------------------

test('B6: no wrap-around repeats — fewer assets than slides → diagram', () => {
  const content = deck([
    { slide_id: 'masterclass-1', slide_role: 'masterclass', background_kind: 'curated', asset_id: 'a:1' },
    { slide_id: 'masterclass-2', slide_role: 'masterclass', background_kind: 'curated' },
    { slide_id: 'masterclass-3', slide_role: 'masterclass', background_kind: 'curated' },
    { slide_id: 'lab-1', slide_role: 'lab_exercise', background_kind: 'curated' },
  ]);
  const { slides } = impl.bindSlides(content, [{ ...cleanAsset, asset_id: 'a:1' }], { unit: 'U2' });
  assert.deepEqual(slides.map((s) => s.background_kind), ['curated', 'diagram', 'diagram', 'diagram']);
  const slots = slides.map((s) => s.media_slot_id).filter(Boolean);
  assert.equal(new Set(slots).size, slots.length, 'no slot on two slides');
});

test('B6: one asset named on two slides of a deck binds once; the second slide falls back to diagram', () => {
  const content = deck([
    { slide_id: 'masterclass-1', slide_role: 'masterclass', background_kind: 'curated', asset_id: 'a:1' },
    { slide_id: 'masterclass-5', slide_role: 'masterclass', background_kind: 'curated', asset_id: 'a:1' },
  ]);
  const { slides, assets, problems } = impl.bindSlides(content, [{ ...cleanAsset, asset_id: 'a:1' }], { unit: 'U2' });
  assert.equal(slides[0].background_kind, 'curated');
  assert.equal(slides[1].background_kind, 'diagram');
  assert.equal(assets.length, 1);
  assert.ok(problems.some((p) => p.kind === 'duplicate' && p.slide_id === 'masterclass-5'));
});

test('slide asset_id that is not accepted falls back to diagram and is reported', () => {
  const content = deck([{ slide_id: 'cover', slide_role: 'unit_cover', background_kind: 'curated', asset_id: 'a:missing' }]);
  const { slides, assets, problems } = impl.bindSlides(content, [], { unit: 'U3' });
  assert.equal(slides[0].background_kind, 'diagram');
  assert.equal(assets.length, 0);
  assert.ok(problems.some((p) => p.kind === 'unaccepted' && p.asset_id === 'a:missing'));
});

// ---------------------------------------------------------------------------
// B7 — dangling slots are detected
// ---------------------------------------------------------------------------

test('B7: dangling slot detected (slides point at U3.still.profield-N, assets empty)', () => {
  const content = {
    assets: [],
    slides: [1, 2, 3, 4, 5, 6].map((n) => ({
      slide_id: `masterclass-${n}`,
      slide_role: 'masterclass',
      background_kind: 'profield',
      media_slot_id: `U3.still.profield-${n}`,
    })),
  };
  const dangling = impl.findDanglingSlots(content);
  assert.equal(dangling.length, 6);
  assert.ok(dangling.every((d) => /U3\.still\.profield-\d/.test(d.media_slot_id)));
});

test('dangling: a slot with a matching asset is not dangling', () => {
  const content = {
    assets: [{ media_slot_id: 'U3.cover', asset_id: 'a:1' }],
    slides: [{ slide_id: 'cover', media_slot_id: 'U3.cover' }],
  };
  assert.deepEqual(impl.findDanglingSlots(content), []);
});

// ---------------------------------------------------------------------------
// Captions (B9): title, author, licence + URL, source, cropped
// ---------------------------------------------------------------------------

test('B9: caption carries title, author, licence, licence URL, source URL and cropped flag', () => {
  const c = impl.caption({
    ...cleanAsset,
    title: 'File:Sprite Fright-concept art-Victoria 01.png [modern_rights_review_required]',
    cropped: true,
  });
  assert.equal(c.title, 'Sprite Fright-concept art-Victoria 01', 'no File:, no extension, no review tag in public text');
  assert.equal(c.author, 'Jane Example');
  assert.equal(c.licence, 'CC-BY-4.0');
  assert.equal(c.licence_url, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(c.source_url, 'https://commons.wikimedia.org/wiki/File:Example.jpg');
  assert.equal(c.cropped, true);
});
