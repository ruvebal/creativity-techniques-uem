#!/usr/bin/env node
/**
 * Deck validator (PHASE-EX3 deliverable 4). Node stdlib only.
 *
 *   node scripts/validate-decks.mjs [--strict] [--rights=block|flag]
 *
 * Strict rules apply to decks with "schema_version": 2 (Amendment A1); legacy
 * decks (e.g. U4) only produce warnings. Errors: dangling slots, curated slides
 * without image_brief/asset_id, missing or > 600 KB files, non-whitelisted
 * extensions, raw SVG in deck-media (A6/F6), bound assets without a private
 * registry record carrying raw_title (A6/F3), orphan cache files, duplicate
 * asset use, "profield" in public JSON values. Assets failing rightsVerdict are errors under --rights=block
 * (default) and warnings under --rights=flag; --rights=flag also writes
 * creativity-techniques-pedagogy/excellence/curation/rights-report.json.
 * Per the professor's launch decision (AUTOPILOT.md §0) the build and the gates
 * use --strict --rights=flag.
 *
 * Exit 1 when --strict and any error is found.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

import { cacheFileOf, deckProblems, DECK_SCHEMA_VERSION, rightsVerdict } from './lib/media-rules.mjs';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const rightsMode = args.has('--rights=flag') ? 'flag' : 'block';
const year = new Date().getFullYear();
const deckRoots = [join(root, 'docs/tracks')]; // every deck, so orphan detection sees all references
const cacheSegment = 'deck-media';
const legacyCacheSegment = 'profield-cache';
const cacheDir = join(root, 'docs/assets/images', cacheSegment);
const legacyCacheDir = join(root, 'docs/assets/images', legacyCacheSegment);
const registryPath = join(root, 'creativity-techniques-pedagogy/excellence/curation/autopilot-assets.json');
const reportPath = join(root, 'creativity-techniques-pedagogy/excellence/curation/rights-report.json');

function filesUnder(directory, predicate) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path, predicate);
    return predicate(entry.name, path) ? [path] : [];
  });
}

function listing(directory) {
  const files = new Map();
  if (!existsSync(directory)) return files;
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (!name.startsWith('.') && statSync(path).isFile()) files.set(name, statSync(path).size);
  }
  return files;
}

const registry = new Map();
if (existsSync(registryPath)) {
  for (const record of JSON.parse(readFileSync(registryPath, 'utf8')).assets || []) registry.set(record.asset_id, record);
}

const cacheFiles = listing(cacheDir);
const legacyFiles = listing(legacyCacheDir);
const deckPaths = deckRoots.flatMap((dir) => filesUnder(dir, (name, path) => name === 'content.json' && /\/data\/content\.json$/.test(path))).sort();

const errors = [];
const warnings = [];
const report = [];
let rawAll = '';

for (const path of deckPaths) {
  const rel = relative(root, path);
  const raw = readFileSync(path, 'utf8');
  rawAll += raw;
  let content;
  try {
    content = JSON.parse(raw.replace(/^---[\s\S]*?---\s*/, ''));
  } catch (error) {
    errors.push(`${rel}: invalid JSON (${error.message})`);
    continue;
  }
  if (!Array.isArray(content.slides) || !content.slides.some((s) => s.slide_role)) {
    // Not a media deck (e.g. How to Pass: HTML slides, fixed geometrical backgrounds).
    continue;
  }
  const legacy = content.schema_version !== DECK_SCHEMA_VERSION;
  const unit = content.media_selection?.unit_id || basename(dirname(dirname(path)));
  const result = deckProblems(content, { unit, cacheFiles, cacheSegment, registry, requireRegistry: !legacy, year });
  errors.push(...result.errors.map((m) => `${rel}: ${m}`));
  warnings.push(...result.warnings.map((m) => `${rel}: ${m}`));

  if (legacy) {
    // Legacy decks still point at the old cache: check those files, as warnings only.
    for (const asset of content.assets || []) {
      const file = cacheFileOf(asset.asset_url, legacyCacheSegment);
      if (!file) continue;
      if (!legacyFiles.has(file)) warnings.push(`${rel}: legacy asset file missing ${legacyCacheSegment}/${file}`);
      else if (legacyFiles.get(file) > 600 * 1024) warnings.push(`${rel}: legacy asset ${file} > 600 KB`);
      if (/\.php$/i.test(file)) warnings.push(`${rel}: legacy asset ${file} has a .php extension`);
    }
  }

  const slideOf = new Map((content.slides || []).filter((s) => s.media_slot_id).map((s) => [s.media_slot_id, s]));
  for (const entry of result.rights) {
    const asset = (content.assets || []).find((a) => a.asset_id === entry.asset_id && a.media_slot_id === entry.slot) || {};
    const record = { ...asset, ...(registry.get(entry.asset_id) || {}) };
    const verdict = rightsVerdict(record, { year });
    if (!legacy && !verdict.ok) {
      const message = `${rel}: rights: ${entry.asset_id} (${entry.slot}) fails rightsVerdict: ${verdict.reasons.join('; ')}`;
      (rightsMode === 'block' ? errors : warnings).push(message);
    }
    report.push({
      deck: rel,
      schema_version: content.schema_version ?? null,
      legacy,
      slide_id: slideOf.get(entry.slot)?.slide_id ?? null,
      heading: slideOf.get(entry.slot)?.heading ?? null,
      media_slot_id: entry.slot,
      asset_id: entry.asset_id,
      title: asset.title ?? null,
      author: record.author || null,
      licence: record.licence || null,
      licence_url: record.licence_url || null,
      canonical_source_url: record.canonical_source_url || null,
      author_death_year: record.author_death_year ?? null,
      eu_term_ok: record.eu_term_ok === true,
      eu_term_reason: record.eu_term_reason || null,
      rights_status: asset.rights_status ?? null,
      verdict: verdict.ok ? 'pass' : 'fail',
      reasons: verdict.reasons,
    });
  }
}

// Orphan cache files: referenced by no deck (Amendment A2/F7 for the legacy folder).
for (const [files, segment] of [[cacheFiles, cacheSegment], [legacyFiles, legacyCacheSegment]]) {
  for (const name of files.keys()) {
    if (!rawAll.includes(`/assets/images/${segment}/${name}`)) errors.push(`orphan cache file ${segment}/${name} (referenced by no deck)`);
  }
}
for (const name of cacheFiles.keys()) {
  if (/\.svg$/i.test(name)) errors.push(`${cacheSegment}/${name}: raw SVG in deck-media (rasterise it; A6/F6)`);
  else if (!/\.(jpg|png|webp|gif)$/i.test(name)) errors.push(`${cacheSegment}/${name}: extension not whitelisted`);
}

if (rightsMode === 'flag') {
  const failing = report.filter((r) => r.verdict === 'fail');
  const payload = {
    schema: 'deck-rights-report/v1',
    mode: 'flag',
    policy: 'AUTOPILOT.md §0: rights recorded and flagged, not blocking; rightsVerdict stays strict. Professor reviews every flagged asset before release.',
    year,
    summary: {
      assets: report.length,
      pass: report.length - failing.length,
      flagged: failing.length,
      v2_flagged: failing.filter((r) => !r.legacy).length,
      legacy_flagged: failing.filter((r) => r.legacy).length,
    },
    assets: report,
  };
  mkdirSync(dirname(reportPath), { recursive: true });
  const next = `${JSON.stringify(payload, null, 2)}\n`;
  if (!existsSync(reportPath) || readFileSync(reportPath, 'utf8') !== next) writeFileSync(reportPath, next);
}

for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`validate-decks: ${deckPaths.length} deck file(s), ${errors.length} error(s), ${warnings.length} warning(s) [${strict ? 'strict' : 'report'}; rights=${rightsMode}]`);
process.exit(strict && errors.length ? 1 : 0);
