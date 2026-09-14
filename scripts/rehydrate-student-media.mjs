#!/usr/bin/env node
/**
 * Rehydrate student-deck assets from Profield review-state + media index.
 *
 * Authority order:
 *   1. review-state.json — status, rank, assignments (project_id + unit_id)
 *   2. media-index*.json — preview/source URLs and titles
 *   3. collections/*.json — optional named packs (not required for unit decks)
 *
 * Only explicitly accepted records assigned to the deck's unit (and project)
 * are copied into public deck JSON. Captions stay public-safe (no UUIDs).
 *
 * Env:
 *   PROFIELD_MEDIA_ROOT   default ~/src/profield/runs/media-prospector
 *   PROFIELD_PROJECT      dc | tc   (default: dc)
 *   DECK_ROOT             override deck scan root
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const profieldRoot = process.env.PROFIELD_MEDIA_ROOT || '/Users/ruvebal/src/profield/runs/media-prospector';
const projectId = (process.env.PROFIELD_PROJECT || 'dc').toLowerCase();
const siteBase = projectId === 'tc' ? '/creativity-techniques-uem' : '/digital-creativity-uem';
const cacheDir = join(root, 'docs/assets/images/profield-cache');
const deckRoot = resolve(
  root,
  process.env.DECK_ROOT
    || (projectId === 'tc'
      ? 'docs/tracks/en/uem/2627-ct'
      : 'docs/tracks/en/uem/2627-dci'),
);

function filesUnder(directory, predicate) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path, predicate);
    return predicate(entry.name, path) ? [path] : [];
  });
}

function priority(asset) {
  const value = asset.review_rank ?? asset.rank ?? asset.review?.priority ?? asset.priority ?? 999;
  const number = Number(value);
  return Number.isFinite(number) ? number : 999;
}

function selectionScore(asset) {
  // Higher review_rank wins; unranked accepted still usable (score 0).
  const rank = asset.review_rank ?? asset.rank;
  return rank != null ? Number(rank) : 0;
}

function stripReviewTag(title) {
  return String(title || '')
    .replace(/^File:/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/g, '')
    .trim();
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

function commonsPageFromAssetId(assetId) {
  const match = String(assetId || '').match(/^wikimedia:File:(.+)$/i);
  if (!match) return '';
  const fileName = match[1].replace(/ /g, '_');
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;
}

function normalizeSourcePage(asset) {
  const raw = asset.canonical_source_url || asset.source || '';
  if (/commons\.wikimedia\.org\/wiki\/File:/i.test(raw) || /wikipedia\.org\/wiki\/File:/i.test(raw)) return raw;
  return commonsPageFromAssetId(asset.asset_id) || raw;
}

function humanProvider(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Wikimedia Commons';
  if (/^wikimedia(_commons)?$/i.test(raw)) return 'Wikimedia Commons';
  if (/^internet_archive$/i.test(raw)) return 'Internet Archive';
  return raw.replace(/_/g, ' ');
}

function cacheKey(assetId, url) {
  return createHash('sha256').update(String(assetId || url)).digest('hex').slice(0, 16);
}

function extensionFromUrl(url, contentType) {
  const pathExt = (String(url).split('?')[0].match(/\.([a-z0-9]+)$/i) || [])[1];
  if (pathExt && pathExt.length <= 5) return pathExt.toLowerCase();
  if (/png/i.test(contentType || '')) return 'png';
  if (/webp/i.test(contentType || '')) return 'webp';
  if (/gif/i.test(contentType || '')) return 'gif';
  return 'jpg';
}

/** Prefer a mid-size Commons thumb when the original path is a full-file upload URL. */
function preferredDownloadUrl(url) {
  const match = String(url).match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i,
  );
  if (!match) return url;
  const [, prefix, a, b, file] = match;
  return `${prefix}thumb/${a}/${b}/${file}/1600px-${file}`;
}

/**
 * Mirror remote teaching images into docs/ so Reveal backgrounds are same-origin.
 * Hotlinked Commons/IA URLs often fail in-browser (encode traps, rate limits, blocked CSS loads).
 */
async function ensureLocalAsset(remoteUrl, assetId) {
  const sourceFileUrl = stripUtm(remoteUrl);
  if (!sourceFileUrl || !/^https?:/i.test(sourceFileUrl)) {
    return { displayUrl: sourceFileUrl, sourceFileUrl };
  }
  mkdirSync(cacheDir, { recursive: true });
  const key = cacheKey(assetId, sourceFileUrl);
  const existing = readdirSync(cacheDir).find((name) => name.startsWith(`${key}.`));
  if (existing) {
    return {
      displayUrl: `${siteBase}/assets/images/profield-cache/${existing}`,
      sourceFileUrl,
    };
  }

  const candidates = [preferredDownloadUrl(sourceFileUrl), sourceFileUrl]
    .filter((value, index, list) => list.indexOf(value) === index);

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        headers: {
          'User-Agent': 'UEM-teaching-deck-cache/1.0 (educational; contact ruvebal@crea-comm.net)',
          Accept: 'image/*,*/*',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(90000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 256) throw new Error('response too small');
      const ext = extensionFromUrl(sourceFileUrl, response.headers.get('content-type'));
      const fileName = `${key}.${ext}`;
      writeFileSync(join(cacheDir, fileName), buffer);
      console.log(`  cached ${fileName} (${(buffer.length / 1e6).toFixed(2)} MB) from ${candidate.includes('/thumb/') ? 'thumb' : 'original'}`);
      return {
        displayUrl: `${siteBase}/assets/images/profield-cache/${fileName}`,
        sourceFileUrl,
      };
    } catch (error) {
      lastError = error;
    }
  }
  console.warn(`  cache failed for ${assetId}: ${lastError?.message || lastError}`);
  return { displayUrl: sourceFileUrl, sourceFileUrl };
}

function publicAsset(asset, slot, existing, urls) {
  const sourcePage = normalizeSourcePage(asset) || existing?.canonical_source_url || '';
  return {
    media_slot_id: slot,
    asset_id: asset.asset_id,
    asset_url: urls.displayUrl,
    source_file_url: urls.sourceFileUrl,
    canonical_source_url: sourcePage,
    alt_text: asset.accessibility?.alt_text || stripReviewTag(asset.title) || 'Teaching image',
    title: stripReviewTag(asset.title || asset.name || existing?.title || asset.asset_id),
    provider: humanProvider(asset.provider || asset.source_provider || existing?.provider),
    credit_line: humanProvider(asset.rights?.credit_line || asset.credit_line || asset.provider || existing?.provider),
    licence: asset.rights?.spdx || asset.rights?.class || asset.licence || '',
    studio_semantics: asset.studio_semantics,
    priority: priority(asset),
    selection_rank: priority(asset),
    collection: asset._collection || 'unit-accepted',
  };
}

function unitFromDeckDirectory(name) {
  // i-1-fashion-image → I.1 ; u-1-introduction-creativity → U1
  const iMatch = name.match(/^i-(\d+)/i);
  if (iMatch) return `I.${iMatch[1]}`;
  const uMatch = name.match(/^u-(\d+)/i);
  if (uMatch) return `U${uMatch[1]}`;
  return null;
}

function slotsFor(unit, content) {
  const prefix = unit.startsWith('I.') ? `${unit}.` : `${unit}.`;
  return content.slides
    .map((slide) => slide.media_slot_id)
    .filter((slot) => slot && String(slot).startsWith(prefix) && !String(slot).includes('.default.'));
}

/** Catalog of asset_id → public fields from media indexes / collections / manifests. */
const catalog = new Map();

function ingestCatalogAsset(candidate) {
  if (!candidate?.asset_id) return;
  const previous = catalog.get(candidate.asset_id) || {};
  const assetUrl = candidate.asset_url || candidate.preview_url || previous.asset_url;
  const sourceUrl = candidate.canonical_source_url || candidate.source || previous.canonical_source_url;
  catalog.set(candidate.asset_id, {
    ...previous,
    ...candidate,
    asset_url: assetUrl,
    canonical_source_url: sourceUrl,
    preview_url: candidate.preview_url || previous.preview_url,
  });
}

const mediaRootPresent = existsSync(profieldRoot);

if (mediaRootPresent) {
  // 1) media-index*.json candidates
  for (const name of readdirSync(profieldRoot).filter((n) => n.startsWith('media-index') && n.endsWith('.json'))) {
    try {
      const index = JSON.parse(readFileSync(join(profieldRoot, name), 'utf8'));
      for (const entry of index.queries || []) {
        for (const candidate of entry.candidates || []) ingestCatalogAsset(candidate);
      }
    } catch { /* skip broken index */ }
  }

  // 2) collections
  const collectionDirectory = join(profieldRoot, 'collections');
  if (existsSync(collectionDirectory)) {
    for (const name of readdirSync(collectionDirectory).filter((n) => n.endsWith('.json'))) {
      try {
        const collection = JSON.parse(readFileSync(join(collectionDirectory, name), 'utf8'));
        for (const asset of collection.assets || []) {
          ingestCatalogAsset({ ...asset, _collection: collection.collection_id });
        }
      } catch { /* skip */ }
    }
  }

  // 3) unit manifests
  for (const path of filesUnder(profieldRoot, (name) => name === 'manifest.json')) {
    try {
      const manifest = JSON.parse(readFileSync(path, 'utf8'));
      for (const asset of manifest.assets || []) ingestCatalogAsset(asset);
    } catch { /* skip */ }
  }
} else {
  console.warn(`Media root missing: ${profieldRoot} — will keep committed deck assets.`);
}

/** acceptedByUnit: Map<unitId, Asset[]> for this project only */
const acceptedByUnit = new Map();
let acceptedCount = 0;

function addToUnit(unitId, asset) {
  if (!unitId || !asset?.asset_id) return;
  const list = acceptedByUnit.get(unitId) || [];
  const existingIndex = list.findIndex((row) => row.asset_id === asset.asset_id);
  if (existingIndex >= 0) {
    if (selectionScore(asset) >= selectionScore(list[existingIndex])) list[existingIndex] = asset;
  } else {
    list.push(asset);
    acceptedCount += 1;
  }
  acceptedByUnit.set(unitId, list);
}

function enrich(assetId, reviewFields = {}) {
  const base = catalog.get(assetId) || { asset_id: assetId };
  const merged = { ...base, ...reviewFields, asset_id: assetId };
  const assetUrl = merged.asset_url || merged.preview_url;
  const sourceUrl = merged.canonical_source_url || merged.source;
  if (!assetUrl || !sourceUrl) return null;
  return {
    ...merged,
    asset_url: assetUrl,
    canonical_source_url: sourceUrl,
    review_status: 'accepted',
    review_rank: merged.review_rank ?? merged.rank ?? null,
  };
}

// Authority: review-state.json assignments (sole acceptance source when present)
const reviewStatePath = join(profieldRoot, 'review-state.json');
let reviewStateLoaded = false;
if (existsSync(reviewStatePath)) {
  try {
    const state = JSON.parse(readFileSync(reviewStatePath, 'utf8'));
    reviewStateLoaded = true;
    for (const [assetId, row] of Object.entries(state.assets || {})) {
      if (String(row.status || '').toLowerCase() !== 'accepted') continue;
      const assignments = row.assignments || [];
      const projectAssignments = assignments.filter((a) => String(a.project_id || '').toLowerCase() === projectId);
      if (!projectAssignments.length) continue;
      const enriched = enrich(assetId, {
        rank: row.rank,
        review_rank: row.rank,
        review_collections: row.collection_ids || [],
        _collection: (row.collection_ids || [])[0] || 'unit-accepted',
      });
      if (!enriched) continue;
      for (const assignment of projectAssignments) {
        addToUnit(assignment.unit_id, {
          ...enriched,
          review_units: [assignment.unit_id],
        });
      }
    }
  } catch (error) {
    console.error(`Failed to read review-state.json: ${error.message}`);
  }
}

// Legacy fallback only when review-state is missing
if (!reviewStateLoaded) {
  for (const [assetId, candidate] of catalog.entries()) {
    if (String(candidate.review_status || '').toLowerCase() !== 'accepted') continue;
    const units = candidate.review_units || candidate.review_assignments?.map((a) => a.unit_id) || [];
    const assignments = candidate.review_assignments || [];
    const projectOk = !assignments.length
      || assignments.some((a) => String(a.project_id || '').toLowerCase() === projectId);
    if (!projectOk) continue;
    const enriched = enrich(assetId, candidate);
    if (!enriched) continue;
    for (const unitId of units) addToUnit(unitId, enriched);
  }
}

async function rehydrateDecks() {
  let processed = 0;
  let changed = 0;

  if (!existsSync(deckRoot)) {
    console.error(`Deck root missing: ${deckRoot}`);
    process.exit(1);
  }

  const acceptedPool = [...acceptedByUnit.values()].reduce((n, list) => n + list.length, 0);
  if (!reviewStateLoaded && catalog.size === 0) {
    console.warn(
      `Media rehydration (${projectId}): no Profield review-state/catalog at ${profieldRoot} — keeping committed deck assets (CI/local without studio media root).`,
    );
    return;
  }
  if (acceptedPool === 0) {
    console.warn(
      `Media rehydration (${projectId}): zero accepted/assigned assets — keeping committed deck assets.`,
    );
    return;
  }

  for (const unitDirectory of readdirSync(deckRoot, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    const unit = unitFromDeckDirectory(unitDirectory.name);
    if (!unit) continue;
    const contentPath = join(deckRoot, unitDirectory.name, 'data/content.json');
    if (!existsSync(contentPath)) continue;
    processed += 1;

    let content;
    try {
      content = JSON.parse(readFileSync(contentPath, 'utf8').replace(/^---[\s\S]*?---\s*/m, ''));
    } catch {
      continue;
    }

    const slots = slotsFor(unit, content);
    const selection = content.media_selection || {};
    const wantCollection = selection.collection && selection.collection !== 'unit-accepted'
      ? selection.collection
      : null;

    const deduped = new Map();
    for (const asset of acceptedByUnit.get(unit) || []) {
      const existing = deduped.get(asset.asset_id);
      if (!existing || selectionScore(asset) > selectionScore(existing)) deduped.set(asset.asset_id, asset);
    }

    for (const [slot, assetId] of Object.entries(selection.media_overrides || {})) {
      const fromUnit = deduped.get(assetId) || (acceptedByUnit.get(unit) || []).find((a) => a.asset_id === assetId);
      const enriched = fromUnit || enrich(assetId, { review_status: 'accepted' });
      if (!enriched) continue;
      const inPool = Boolean(fromUnit) || (acceptedByUnit.get(unit) || []).some((a) => a.asset_id === assetId);
      if (!inPool) {
        console.warn(`skip override ${slot}: ${assetId} not accepted/assigned to ${projectId}/${unit}`);
        continue;
      }
      deduped.set(assetId, { ...enriched, media_slot_id: slot });
    }

    let selected = [...deduped.values()];
    if (wantCollection) {
      const preferred = selected.filter((asset) =>
        asset._collection === wantCollection
        || (asset.review_collections || []).includes(wantCollection)
        || (asset.collection_ids || []).includes(wantCollection));
      if (preferred.length) selected = preferred;
    }

    selected.sort((a, b) => selectionScore(b) - selectionScore(a) || String(a.asset_id).localeCompare(String(b.asset_id)));

    const assets = [];
    for (const [index, asset] of selected.entries()) {
      const existing = (content.assets || []).find((candidate) =>
        candidate.asset_id === asset.asset_id
        || candidate.canonical_source_url === asset.canonical_source_url);
      const overrideSlot = Object.entries(selection.media_overrides || {}).find(([, id]) => id === asset.asset_id)?.[0];
      const slot = overrideSlot || `${unit}.still.profield-${index + 1}`;
      const remote = stripUtm(asset.asset_url || asset.preview_url || existing?.source_file_url || '');
      const urls = await ensureLocalAsset(remote, asset.asset_id);
      assets.push(publicAsset(asset, slot, existing, urls));
    }

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

    const next = {
      ...content,
      media_selection: {
        unit_id: unit,
        project_id: projectId,
        collection: wantCollection || 'unit-accepted',
        strategy: selection.strategy || 'review-state-assigned',
        description: selection.description
          || `Accepted/ranked Profield review-state assets for ${projectId}/${unit}.`,
        media_overrides: selection.media_overrides || {},
      },
      assets,
      slides,
    };

    const frontMatter = '---\nlayout: null\n---\n';
    const output = `${frontMatter}${JSON.stringify(next, null, 2)}\n`;
    if (output !== readFileSync(contentPath, 'utf8')) {
      writeFileSync(contentPath, output, 'utf8');
      changed += 1;
    }

    console.log(`${projectId}/${unit}: ${assets.length} accepted asset(s) → ${unitDirectory.name}`);
  }

  console.log(
    `Media rehydration (${projectId}): catalog ${catalog.size}, accepted-assigned ${acceptedCount}, `
    + `processed ${processed} deck(s), changed ${changed}.`,
  );
}

await rehydrateDecks();
