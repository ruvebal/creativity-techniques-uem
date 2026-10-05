#!/usr/bin/env node
/**
 * Rehydrate student-deck images (PHASE-EX3: slide-bound, rights-checked).
 *
 * A slide shows an image only if the slide itself names it (`asset_id`), the
 * asset is accepted for the deck's project + unit, and its rendition can be
 * cached locally. No rank dealing, no asset on two slides of a deck; any media
 * slide without such an asset becomes `background_kind: diagram`
 * (rules: scripts/lib/media-rules.mjs, tests: scripts/tests/).
 *
 * Acceptance (read only, never written):
 *   1. <media root>/review-state.json — status "accepted" + assignment {project_id, unit_id}
 *   2. creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json
 *      (autopilot mode, AUTOPILOT.md §2) — same rights fields; also the rights
 *      registry for every asset (licence, author, EU term, raw title)
 * URLs come from the media indexes (<media root>/media-index*.json, collections, manifests).
 *
 * Only decks with "schema_version": 2 are rewritten. Legacy decks (e.g. U4)
 * are never touched, and cache files they reference are never deleted or moved
 * (Amendment A2/F7).
 *
 * Renditions: docs/assets/images/deck-media/<sha256(asset_id)[:16]>.webp
 * (≤ 1920 px, WebP, EXIF stripped, ≤ 600 KB). SVG input is rasterised to WebP
 * (Amendment A6/F6); raw SVG is never copied into deck-media.
 * Cache files referenced by no deck are deleted (both cache folders).
 *
 * Usage: node scripts/rehydrate-student-media.mjs [--rights=block|flag]
 *   --rights=block (default) drops assets that fail rightsVerdict;
 *   --rights=flag keeps them with rights_status "flagged" (professor launch
 *   decision, AUTOPILOT.md §0; the npm scripts pass it).
 *
 * Env:
 *   PROFIELD_MEDIA_ROOT   default <home>/src/profield/runs/media-prospector
 *   DECK_ROOTS            comma-separated deck roots (default: 2627-ct, 2627-ml)
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  bindSlides,
  cleanTitle,
  DECK_SCHEMA_VERSION,
  extensionFor,
  rightsVerdict,
} from './lib/media-rules.mjs';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const rightsMode = args.has('--rights=flag') ? 'flag' : 'block';
const mediaRoot = process.env.PROFIELD_MEDIA_ROOT || join(homedir(), 'src/profield/runs/media-prospector');
const registryPath = join(root, 'creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json');
const cacheSegment = 'deck-media';
const legacyCacheSegment = 'profield-cache';
const cacheDir = join(root, 'docs/assets/images', cacheSegment);
const legacyCacheDir = join(root, 'docs/assets/images', legacyCacheSegment);
const deckRoots = (process.env.DECK_ROOTS || 'docs/tracks/en/uem/2627-ct,docs/tracks/en/uem/2627-ml')
  .split(',').map((p) => p.trim()).filter(Boolean).map((p) => resolve(root, p));
const siteBase = (readFileSync(join(root, '_config.yml'), 'utf8').match(/^baseurl:\s*['"]?([^'"\n]*)['"]?/m) || [])[1] ?? '';
const FRONT_MATTER = '---\nlayout: null\n---\n';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const readDeck = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^---[\s\S]*?---\s*/, ''));

function filesUnder(directory, predicate) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path, predicate);
    return predicate(entry.name, path) ? [path] : [];
  });
}

function stripUtm(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    ['utm_source', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_term'].forEach((key) => parsed.searchParams.delete(key));
    const query = parsed.searchParams.toString();
    return `${parsed.origin}${parsed.pathname}${query ? `?${query}` : ''}`;
  } catch {
    return String(url).replace(/[?&]utm_[^=]+=[^&]*/g, '').replace(/\?$/, '');
  }
}

function humanProvider(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^wikimedia(_commons)?$/i.test(raw)) return 'Wikimedia Commons';
  if (/^internet_archive$/i.test(raw)) return 'Internet Archive';
  if (/^nypl$/i.test(raw)) return 'The New York Public Library';
  return raw.replace(/_/g, ' ');
}

const cacheKey = (assetId) => createHash('sha256').update(String(assetId)).digest('hex').slice(0, 16);

/** Prefer a 1920 px Commons thumb when the URL is a full-size raster upload. */
function preferredDownloadUrl(url) {
  const match = String(url).match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i);
  if (!match || /\.svg$/i.test(match[4])) return url;
  const [, prefix, a, b, file] = match;
  return `${prefix}thumb/${a}/${b}/${file}/1920px-${file}`;
}

// ---------------------------------------------------------------------------
// Catalog (URLs) and acceptance — all read only
// ---------------------------------------------------------------------------

const catalog = new Map();
function ingest(candidate) {
  if (!candidate?.asset_id) return;
  const previous = catalog.get(candidate.asset_id) || {};
  catalog.set(candidate.asset_id, {
    ...previous,
    ...candidate,
    raw_title: previous.raw_title || candidate.title,
    asset_url: candidate.asset_url || candidate.preview_url || previous.asset_url,
    canonical_source_url: candidate.canonical_source_url || candidate.source || previous.canonical_source_url,
  });
}

const mediaRootPresent = existsSync(mediaRoot);
if (mediaRootPresent) {
  for (const name of readdirSync(mediaRoot).filter((n) => n.startsWith('media-index') && n.endsWith('.json'))) {
    try {
      for (const entry of readJson(join(mediaRoot, name)).queries || []) (entry.candidates || []).forEach(ingest);
    } catch { /* skip broken index */ }
  }
  for (const path of filesUnder(join(mediaRoot, 'collections'), (n) => n.endsWith('.json'))) {
    try { (readJson(path).assets || []).forEach(ingest); } catch { /* skip */ }
  }
  for (const path of filesUnder(mediaRoot, (n) => n === 'manifest.json')) {
    try { (readJson(path).assets || []).forEach(ingest); } catch { /* skip */ }
  }
}

/** asset_id → rights record (autopilot registry; private, never published). */
const registry = new Map();
if (existsSync(registryPath)) {
  for (const record of readJson(registryPath).assets || []) if (record?.asset_id) registry.set(record.asset_id, record);
}

/** "<project>/<unit>" → Set(asset_id) */
const accepted = new Map();
const accept = (project, unit, assetId) => {
  const key = `${String(project).toLowerCase()}/${unit}`;
  if (!accepted.has(key)) accepted.set(key, new Set());
  accepted.get(key).add(assetId);
};
const reviewStatePath = join(mediaRoot, 'review-state.json');
if (existsSync(reviewStatePath)) {
  try {
    for (const [assetId, row] of Object.entries(readJson(reviewStatePath).assets || {})) {
      if (String(row.status || '').toLowerCase() !== 'accepted') continue;
      for (const a of row.assignments || []) accept(a.project_id, a.unit_id, assetId);
    }
  } catch (error) {
    console.error(`review-state.json unreadable: ${error.message}`);
  }
}
for (const record of registry.values()) {
  for (const a of record.assignments || []) accept(a.project_id, a.unit_id, record.asset_id);
}

// ---------------------------------------------------------------------------
// Renditions
// ---------------------------------------------------------------------------

let toRendition = null;
async function renditionFor(buffer) {
  if (!toRendition) ({ toRendition } = await import('./lib/rendition.mjs'));
  return toRendition(buffer);
}

/** Cache file name for an asset, downloading + normalising if needed; null on failure. */
async function ensureRendition(asset) {
  mkdirSync(cacheDir, { recursive: true });
  const key = cacheKey(asset.asset_id);
  const existing = readdirSync(cacheDir).find((name) => name.startsWith(`${key}.`) && !/\.svg$/i.test(name));
  if (existing) return existing;
  // A raw SVG left by an earlier run is rasterised in place, then removed (A6/F6).
  const rawSvg = readdirSync(cacheDir).find((name) => name === `${key}.svg`);
  if (rawSvg) {
    const rendition = await renditionFor(readFileSync(join(cacheDir, rawSvg)));
    writeFileSync(join(cacheDir, `${key}.${rendition.ext}`), rendition.buffer);
    unlinkSync(join(cacheDir, rawSvg));
    console.log(`  rasterised ${rawSvg} → ${key}.${rendition.ext} (${rendition.width}x${rendition.height})`);
    return `${key}.${rendition.ext}`;
  }

  const remote = stripUtm(asset.source_file_url || asset.asset_url || '');
  if (!/^https?:/i.test(remote)) return null;
  for (const candidate of [...new Set([preferredDownloadUrl(remote), remote])]) {
    try {
      const response = await fetch(candidate, {
        headers: { 'User-Agent': 'UEM-teaching-deck-cache/2.0 (educational; contact ruvebal@crea-comm.net)', Accept: 'image/*' },
        redirect: 'follow',
        signal: AbortSignal.timeout(90000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const ext = extensionFor(response.headers.get('content-type'), candidate);
      if (!ext) throw new Error(`not a whitelisted image (${response.headers.get('content-type')})`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 256) throw new Error('response too small');
      // SVG is rasterised by toRendition (A6/F6): never copied raw into deck-media.
      const rendition = await renditionFor(buffer);
      writeFileSync(join(cacheDir, `${key}.${rendition.ext}`), rendition.buffer);
      console.log(`  cached ${key}.${rendition.ext} (${rendition.width}x${rendition.height}, ${(rendition.buffer.length / 1024).toFixed(0)} KB, q${rendition.quality})`);
      return `${key}.${rendition.ext}`;
    } catch (error) {
      console.warn(`  fetch ${candidate}: ${error.message}`);
    }
  }
  return null;
}

/** Public asset object: no review tags, no internal ids. */
function publicAsset(record, fileName, verdict) {
  const title = cleanTitle(record.title || record.raw_title || record.asset_id);
  return {
    media_slot_id: null, // set by bindSlides
    asset_id: record.asset_id,
    asset_url: `${siteBase}/assets/images/${cacheSegment}/${fileName}`,
    source_file_url: stripUtm(record.source_file_url || record.asset_url || ''),
    canonical_source_url: record.canonical_source_url || '',
    title,
    alt_text: record.alt_text || record.accessibility?.alt_text || title,
    author: record.author || '',
    licence: record.licence || '',
    licence_url: record.licence_url || '',
    provider: humanProvider(record.provider),
    credit_line: [record.author, humanProvider(record.provider)].filter(Boolean).join(' · '),
    author_death_year: record.author_death_year ?? null,
    eu_term_ok: record.eu_term_ok === true,
    eu_term_reason: record.eu_term_reason || '',
    rights_status: verdict.ok ? 'ok' : 'flagged',
    cropped: Boolean(record.cropped),
  };
}

// ---------------------------------------------------------------------------
// Decks
// ---------------------------------------------------------------------------

const deckFiles = deckRoots.flatMap((dir) => filesUnder(dir, (name, path) => name === 'content.json' && /\/data\/content\.json$/.test(path)));

async function rehydrateDeck(path) {
  const content = readDeck(path);
  const rel = path.replace(`${root}/`, '');
  if (content.schema_version !== DECK_SCHEMA_VERSION) {
    console.log(`skip legacy deck (schema_version ${content.schema_version ?? 'missing'}): ${rel}`);
    return false;
  }
  const unit = content.media_selection?.unit_id;
  const project = String(content.media_selection?.project_id || '').toLowerCase();
  if (!unit || !project) {
    console.warn(`skip ${rel}: media_selection.unit_id/project_id missing`);
    return false;
  }
  const acceptedIds = accepted.get(`${project}/${unit}`) || new Set();
  const committed = new Map((content.assets || []).map((a) => [a.asset_id, a]));

  const pool = [];
  for (const slide of content.slides || []) {
    const assetId = slide.asset_id;
    if (!assetId || pool.some((a) => a.asset_id === assetId)) continue;
    if (!acceptedIds.has(assetId)) {
      console.warn(`  ${unit}/${slide.slide_id}: ${assetId} not accepted for ${project}/${unit}`);
      continue;
    }
    const record = { ...(committed.get(assetId) || {}), ...(catalog.get(assetId) || {}), ...(registry.get(assetId) || {}), asset_id: assetId };
    const verdict = rightsVerdict(record);
    // A6/F3: an asset without a private registry record (raw_title included)
    // is never published as "ok" — review tags must stay visible.
    if (!registry.get(assetId)?.raw_title) {
      verdict.ok = false;
      verdict.reasons.push('no registry record with raw_title (A6/F3)');
      console.warn(`  ${unit}/${slide.slide_id}: ${assetId} has no autopilot-assets.json record with raw_title`);
    }
    if (!verdict.ok && rightsMode === 'block') {
      console.warn(`  ${unit}/${slide.slide_id}: ${assetId} blocked (${verdict.reasons.join('; ')})`);
      continue;
    }
    const fileName = await ensureRendition(record);
    if (!fileName) {
      console.warn(`  ${unit}/${slide.slide_id}: ${assetId} has no cached rendition`);
      continue;
    }
    pool.push(publicAsset(record, fileName, verdict));
  }

  // Slides whose asset is not in the pool fall back to diagram (bindSlides reports them).
  const { slides, assets, problems } = bindSlides(content, pool, { unit });
  for (const p of problems) console.warn(`  ${unit}/${p.slide_id}: ${p.kind} ${p.asset_id} → diagram`);
  const output = `${FRONT_MATTER}${JSON.stringify({ ...content, assets, slides }, null, 2)}\n`;
  if (output === readFileSync(path, 'utf8')) return false;
  writeFileSync(path, output, 'utf8');
  console.log(`${project}/${unit}: ${assets.length} bound image(s) → ${rel}`);
  return true;
}

/**
 * Delete cache files no deck references (A2/F7: a referenced file is never
 * deleted or moved). References are read from every deck under docs/tracks,
 * not only DECK_ROOTS, so a narrowed run cannot delete another deck's file.
 */
function deleteOrphans() {
  const allDecks = filesUnder(join(root, 'docs/tracks'), (name, path) => name === 'content.json' && /\/data\/content\.json$/.test(path));
  const refs = allDecks.map((p) => readFileSync(p, 'utf8')).join('\n');
  let removed = 0;
  for (const [dir, segment] of [[cacheDir, cacheSegment], [legacyCacheDir, legacyCacheSegment]]) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (name.startsWith('.') || !statSync(path).isFile()) continue;
      if (refs.includes(`/assets/images/${segment}/${name}`)) continue;
      unlinkSync(path);
      removed += 1;
      console.log(`  removed orphan ${segment}/${name}`);
    }
  }
  return removed;
}

if (!mediaRootPresent) {
  console.warn(`Media root missing (${mediaRoot}): keeping committed deck assets.`);
} else {
  let changed = 0;
  for (const path of deckFiles) if (await rehydrateDeck(path)) changed += 1;
  const removed = deleteOrphans();
  console.log(`Media rehydration (rights=${rightsMode}): ${deckFiles.length} deck file(s), changed ${changed}, orphans removed ${removed}.`);
}
