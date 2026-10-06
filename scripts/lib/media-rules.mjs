/**
 * Image-pipeline rules for student decks (PHASE-EX3). Pure functions, no I/O.
 *
 * - extensionFor: file extension from the Content-Type header (whitelist only)
 * - rightsVerdict: strict publication check (licence, author, source, EU term, review tags)
 * - bindSlides: a slide's own `asset_id` is the only binding (no rank dealing, no reuse)
 * - caption: public caption fields
 * - findDanglingSlots / deckProblems: validator rules (scripts/validate-decks.mjs)
 *
 * Tests: scripts/tests/media-rules.test.mjs (node --test).
 * A first draft of extensionFor/rightsVerdict/bindSlides/caption came from a local
 * qwen2.5-coder:32b call (PHASE-EX3-REPORT.md); it was rewritten against the tests.
 */

export const DECK_SCHEMA_VERSION = 2;

export const ACCEPTED_LICENCES = Object.freeze([
  'PD-old-70',
  'PD-EU',
  'CC0',
  'PDM',
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CC-BY-3.0',
  'CC-BY-SA-3.0',
  'NoC-US+EU-checked',
]);

/**
 * Licences granted by a rights holder: their validity does not rest on an
 * expired term. Every other value (PD-old-70, PD-EU, PDM, NoC-…, or anything
 * unknown) is a public-domain / EU-term claim that a death year can contradict.
 */
export const HOLDER_LICENCES = Object.freeze(['CC0', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-3.0', 'CC-BY-SA-3.0']);

/**
 * Downloaded input types. SVG is accepted as input but is always rasterised
 * to WebP before it reaches deck-media (Amendment A6/F6).
 */
export const ALLOWED_EXTENSIONS = Object.freeze(['jpg', 'png', 'webp', 'gif', 'svg']);
/** Files allowed in deck-media/ (renditions only: never raw SVG). */
export const RENDITION_EXTENSIONS = Object.freeze(['webp', 'jpg', 'png', 'gif']);
export const BACKGROUND_KINDS = Object.freeze(['curated', 'diagram', 'geometrical', 'none']);
export const STRUCTURAL_ROLES = Object.freeze(['analysis_opener', 'lab_opener', 'workshop_opener', 'outro']);
export const MEDIA_ROLES = Object.freeze(['unit_cover', 'analysis_model', 'masterclass', 'lab_exercise', 'workshop_work']);
export const MAX_RENDITION_BYTES = 600 * 1024;
export const MAX_RENDITION_PX = 1920;
export const RIGHTS_STATUSES = Object.freeze(['ok', 'flagged']);
/** Slide layouts (PHASE-EX5); a slide without `layout` takes its role default. */
export const LAYOUTS = Object.freeze(['image_argument', 'quote', 'split', 'exercise']);

const CONTENT_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/pjpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/svg+xml', 'svg'],
]);

const REVIEW_TAG = /\[([a-z0-9_]*review_required)\]/i;

/**
 * Extension for a downloaded file, decided by the Content-Type header.
 * The URL path is used only when the header is missing or generic
 * (application/octet-stream), and only for whitelisted extensions.
 * Returns null for anything that is not a whitelisted image (never "php").
 */
export function extensionFor(contentType, url) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (type && type !== 'application/octet-stream' && type !== 'binary/octet-stream') {
    return CONTENT_TYPES.get(type) || null;
  }
  const path = String(url || '').split(/[?#]/)[0];
  const ext = (path.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
  if (ext === 'jpeg') return 'jpg';
  return ALLOWED_EXTENSIONS.includes(ext) ? ext : null;
}

/** The review tag (e.g. "modern_rights_review_required") in a raw title, or null. */
export function reviewTagIn(title) {
  const match = String(title || '').match(REVIEW_TAG);
  return match ? match[1] : null;
}

/**
 * Strict rights verdict. An asset is publishable only with an accepted licence,
 * a named author, an http(s) source page, a verified EU term (death year + 70 <
 * current year, or a stated reason) and no *_review_required tag in its title.
 * Returns { ok, reasons } — every failing rule is listed.
 */
export function rightsVerdict(asset, { year = new Date().getFullYear() } = {}) {
  const a = asset || {};
  const reasons = [];
  const licence = String(a.licence || '').trim();
  if (!ACCEPTED_LICENCES.includes(licence)) reasons.push(`licence not accepted: ${licence || '(empty)'}`);
  if (!String(a.author || '').trim()) reasons.push('author missing');
  const source = String(a.canonical_source_url || a.source || '').trim();
  if (!/^https?:\/\/\S+$/i.test(source)) reasons.push('source URL missing');
  const deathYear = Number.isInteger(a.author_death_year) ? a.author_death_year : null;
  const termByYear = deathYear !== null && deathYear + 70 < year;
  const termByReason = Boolean(String(a.eu_term_reason || '').trim());
  // Amendment A6/F1: a recorded death year that leaves the EU term running
  // contradicts any public-domain / expired-term claim, whatever reason text
  // is given (e.g. "public domain in the US" for Duchamp, d. 1968).
  const termClaim = !HOLDER_LICENCES.includes(licence);
  if (deathYear !== null && !termByYear && termClaim) {
    reasons.push(`author death year ${deathYear} contradicts the public-domain / EU-term claim (protected in the EU through ${deathYear + 70})`);
  } else if (a.eu_term_ok !== true || !(termByYear || termByReason)) {
    reasons.push('EU term not verified');
  }
  for (const title of [a.raw_title, a.title]) {
    const tag = reviewTagIn(title);
    if (tag) {
      reasons.push(`review tag in title: ${tag}`);
      break;
    }
  }
  return { ok: reasons.length === 0, reasons };
}

/** Slot id for a slide: `<unit>.<slide_id>`. */
export function slotFor(unit, slideId) {
  return `${unit}.${slideId}`;
}

function withoutKeys(object, keys) {
  const copy = { ...object };
  for (const key of keys) delete copy[key];
  return copy;
}

function isStructural(slide) {
  return slide.background_kind === 'geometrical' || STRUCTURAL_ROLES.includes(slide.slide_role);
}

/**
 * Bind accepted assets to slides. The slide's own `asset_id` is the only
 * binding: no rank, no cycling, no asset on two slides of one deck. A media
 * slide without a usable asset becomes `background_kind: diagram`.
 * Inputs are not mutated. Returns { slides, assets, problems }.
 */
export function bindSlides(content, acceptedAssets, { unit } = {}) {
  const pool = new Map((acceptedAssets || []).map((asset) => [asset.asset_id, asset]));
  const used = new Set();
  const assets = [];
  const problems = [];
  const slides = (content?.slides || []).map((original) => {
    const slide = { ...original };
    if (isStructural(slide)) return slide;
    if (slide.background_kind === 'none' && !slide.asset_id) return withoutKeys(slide, ['media_slot_id']);
    const assetId = slide.asset_id;
    if (!assetId) {
      return { ...withoutKeys(slide, ['media_slot_id']), background_kind: 'diagram' };
    }
    if (used.has(assetId)) {
      problems.push({ slide_id: slide.slide_id, kind: 'duplicate', asset_id: assetId });
      return { ...withoutKeys(slide, ['media_slot_id', 'asset_id']), background_kind: 'diagram' };
    }
    const asset = pool.get(assetId);
    if (!asset) {
      // Not accepted (or no rendition yet): show the diagram, but keep the
      // slide's asset_id so the binding is not lost; the validator warns.
      problems.push({ slide_id: slide.slide_id, kind: 'unaccepted', asset_id: assetId });
      return { ...withoutKeys(slide, ['media_slot_id']), background_kind: 'diagram' };
    }
    used.add(assetId);
    const slot = slotFor(unit, slide.slide_id);
    assets.push({ ...asset, media_slot_id: slot });
    return { ...slide, background_kind: 'curated', media_slot_id: slot };
  });
  return { slides, assets, problems };
}

/** Public title: no "File:" prefix, no review tag, no file extension. */
export function cleanTitle(title) {
  return String(title || '')
    .replace(/^File:/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/g, '')
    .replace(/\.(?:jpe?g|png|gif|svg|webp|tiff?)$/i, '')
    .trim();
}

/** Public caption fields: title, author, licence (+ URL), source URL, cropped flag, rights_status. */
export function caption(asset) {
  const a = asset || {};
  return {
    title: cleanTitle(a.title || a.raw_title || a.alt_text),
    author: String(a.author || '').trim(),
    licence: String(a.licence || '').trim(),
    licence_url: String(a.licence_url || '').trim(),
    source_url: String(a.canonical_source_url || a.source || '').trim(),
    cropped: Boolean(a.cropped),
    // EX9 (A12/F8): captions read the rights flag so a flagged asset is never labelled "Public domain".
    rights_status: String(a.rights_status || '').trim(),
  };
}

/** Slides whose media_slot_id has no matching asset (FINDINGS B7). */
export function findDanglingSlots(content) {
  const slots = new Set((content?.assets || []).map((asset) => asset.media_slot_id).filter(Boolean));
  return (content?.slides || [])
    .filter((slide) => slide.media_slot_id && !slots.has(slide.media_slot_id))
    .map((slide) => ({ slide_id: slide.slide_id ?? null, heading: slide.heading ?? null, media_slot_id: slide.media_slot_id }));
}

/** Every string value in a JSON tree, with its path. */
export function stringValues(node, path = '$') {
  if (typeof node === 'string') return [{ path, value: node }];
  if (Array.isArray(node)) return node.flatMap((item, index) => stringValues(item, `${path}[${index}]`));
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) => stringValues(value, `${path}.${key}`));
  }
  return [];
}

/** Basename of a cache URL such as `/site/assets/images/deck-media/abc.webp`. */
export function cacheFileOf(url, cacheSegment) {
  const value = String(url || '');
  const marker = `/assets/images/${cacheSegment}/`;
  const at = value.indexOf(marker);
  return at < 0 ? null : value.slice(at + marker.length).split(/[?#]/)[0];
}

/**
 * Validator rules for one deck. Pure: the caller supplies the cache listing
 * and the private rights registry.
 *
 * ctx = {
 *   unit,                       // "U1", "ML-CPA", …
 *   cacheFiles: Map<name, size> // files in docs/assets/images/deck-media
 *   cacheSegment: 'deck-media',
 *   registry: Map<asset_id, rights record>  // curation/autopilot-assets.json
 *   requireRegistry,            // A6/F3: bound asset without a registry raw_title is an issue
 *   year,
 * }
 * Returns { errors: string[], warnings: string[], rights: [{asset_id, slot, ok, reasons, rights_status}] }.
 * Decks without `schema_version: 2` are legacy: every finding is a warning.
 */
export function deckProblems(content, ctx = {}) {
  const errors = [];
  const warnings = [];
  const rights = [];
  const strict = content?.schema_version === DECK_SCHEMA_VERSION;
  const issue = (message) => (strict ? errors : warnings).push(message);
  const cacheSegment = ctx.cacheSegment || 'deck-media';
  const cacheFiles = ctx.cacheFiles || new Map();
  const registry = ctx.registry || new Map();
  const slides = Array.isArray(content?.slides) ? content.slides : [];
  const assets = Array.isArray(content?.assets) ? content.assets : [];

  if (!strict) warnings.push(`legacy deck (schema_version ${content?.schema_version ?? 'missing'}): strict rules not applied`);

  // Slides
  const seenIds = new Set();
  const slotUse = new Map();
  const assetUse = new Map();
  for (const slide of slides) {
    const label = slide.slide_id || slide.heading || '(slide)';
    if (strict) {
      if (!slide.slide_id) issue(`slide without slide_id: ${slide.heading ?? '(no heading)'}`);
      else if (seenIds.has(slide.slide_id)) issue(`duplicate slide_id: ${slide.slide_id}`);
      seenIds.add(slide.slide_id);
      if (!BACKGROUND_KINDS.includes(slide.background_kind)) issue(`${label}: background_kind "${slide.background_kind}" not in ${BACKGROUND_KINDS.join('|')}`);
      if (slide.layout !== undefined && !LAYOUTS.includes(slide.layout)) issue(`${label}: layout "${slide.layout}" not in ${LAYOUTS.join('|')}`);
      if (slide.notes !== undefined && typeof slide.notes !== 'string' && !(Array.isArray(slide.notes) && slide.notes.every((n) => typeof n === 'string'))) {
        issue(`${label}: notes must be a string or a list of strings`);
      }
    }
    if (slide.background_kind === 'curated') {
      if (!String(slide.image_brief || '').trim()) issue(`${label}: curated slide without image_brief`);
      if (!slide.asset_id) issue(`${label}: curated slide without asset_id`);
      if (!slide.media_slot_id) issue(`${label}: curated slide without media_slot_id`);
      else if (ctx.unit && slide.slide_id && slide.media_slot_id !== slotFor(ctx.unit, slide.slide_id)) {
        issue(`${label}: media_slot_id ${slide.media_slot_id} is not ${slotFor(ctx.unit, slide.slide_id)}`);
      }
    } else {
      if (strict && slide.media_slot_id) issue(`${label}: media_slot_id on a ${slide.background_kind} slide`);
      if (slide.asset_id) warnings.push(`${label}: asset_id ${slide.asset_id} named but not bound (not accepted or no rendition)`);
    }
    if (slide.media_slot_id) slotUse.set(slide.media_slot_id, (slotUse.get(slide.media_slot_id) || 0) + 1);
    if (slide.asset_id && slide.background_kind === 'curated') assetUse.set(slide.asset_id, (assetUse.get(slide.asset_id) || 0) + 1);
  }
  for (const [slot, count] of slotUse) if (count > 1) issue(`slot ${slot} used on ${count} slides`);
  for (const [assetId, count] of assetUse) if (count > 1) issue(`asset ${assetId} used on ${count} slides`);

  // Dangling slots
  for (const d of findDanglingSlots(content)) issue(`dangling slot ${d.media_slot_id} on ${d.slide_id || d.heading}`);

  // Assets
  const assetSlots = new Map();
  for (const asset of assets) {
    const slot = asset.media_slot_id;
    if (assetSlots.has(slot)) issue(`two assets share slot ${slot}`);
    assetSlots.set(slot, asset);
    const bound = slides.find((slide) => slide.media_slot_id === slot);
    if (!bound) issue(`asset ${asset.asset_id} (${slot}) is bound to no slide`);
    else if (strict && bound.asset_id !== asset.asset_id) issue(`slide ${bound.slide_id} names ${bound.asset_id} but slot ${slot} holds ${asset.asset_id}`);

    const file = cacheFileOf(asset.asset_url, cacheSegment);
    if (!file) {
      issue(`asset ${asset.asset_id}: asset_url is not in /assets/images/${cacheSegment}/ (${asset.asset_url || 'empty'})`);
    } else {
      const ext = (file.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) issue(`asset ${asset.asset_id}: extension .${ext} not allowed (${file})`);
      else if (!RENDITION_EXTENSIONS.includes(ext)) issue(`asset ${asset.asset_id}: raw .${ext} in ${cacheSegment} (rasterise it; A6/F6)`);
      if (!cacheFiles.has(file)) issue(`asset ${asset.asset_id}: file missing ${cacheSegment}/${file}`);
      else if (cacheFiles.get(file) > MAX_RENDITION_BYTES) issue(`asset ${asset.asset_id}: ${file} is ${cacheFiles.get(file)} bytes (> ${MAX_RENDITION_BYTES})`);
    }

    // Amendment A6/F3: every bound asset has a private registry record with its
    // raw (indexed) title, so review tags are always visible to rightsVerdict.
    const registered = registry.get(asset.asset_id);
    if (ctx.requireRegistry && (!registered || !String(registered.raw_title || '').trim())) {
      issue(`asset ${asset.asset_id}: no registry record with raw_title (A6/F3)`);
    }
    // Rights: the private registry is the authority, deck fields fill the rest.
    const record = { ...asset, ...(registered || {}) };
    const verdict = rightsVerdict(record, { year: ctx.year });
    rights.push({ asset_id: asset.asset_id, slot, ok: verdict.ok, reasons: verdict.reasons, rights_status: asset.rights_status ?? null });
    if (strict) {
      if (!RIGHTS_STATUSES.includes(asset.rights_status)) issue(`asset ${asset.asset_id}: rights_status must be ok|flagged`);
      else if (asset.rights_status === 'ok' && !verdict.ok) issue(`asset ${asset.asset_id}: rights_status "ok" but rightsVerdict fails (${verdict.reasons.join('; ')})`);
    }
  }

  // Public JSON values must not name the internal media service.
  if (strict) {
    for (const { path, value } of stringValues(content)) {
      if (/profield/i.test(value)) issue(`value at ${path} contains "profield"`);
    }
  }

  return { errors, warnings, rights };
}

/**
 * Stable slide ids for migration: cover, analysis-opener, analysis-model,
 * masterclass-N, lab-opener, lab-N, workshop-opener, workshop-N, outro.
 */
export function stableSlideIds(slides) {
  const counters = new Map();
  const base = {
    unit_cover: 'cover',
    analysis_opener: 'analysis-opener',
    analysis_model: 'analysis-model',
    masterclass: 'masterclass',
    lab_opener: 'lab-opener',
    lab_exercise: 'lab',
    workshop_opener: 'workshop-opener',
    workshop_work: 'workshop',
    outro: 'outro',
  };
  const numbered = new Set(['masterclass', 'lab_exercise', 'workshop_work']);
  const ids = (slides || []).map((slide) => {
    const role = slide.slide_role || 'slide';
    const stem = base[role] || String(role).replace(/_/g, '-');
    const n = (counters.get(stem) || 0) + 1;
    counters.set(stem, n);
    return numbered.has(role) ? `${stem}-${n}` : (n === 1 ? stem : `${stem}-${n}`);
  });
  return ids;
}
