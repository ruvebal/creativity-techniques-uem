#!/usr/bin/env node
// Excellence cascade readiness probe (PHASE-EX0; hardened in EX11 / A1–A2, A6–A7).
//
// Node stdlib only. Reads the repository (and, for leak_terms, an existing
// built _site) and prints ONE JSON object with the keys listed in
// PHASE-EX0.md plus EX11 measurement keys. It builds nothing itself.
//
// Usage:
//   node excellence-probe.mjs                      # measure the live tree, print JSON
//   node excellence-probe.mjs --targets            # measure, then exit 1 if any EX11 target is unmet
//   node excellence-probe.mjs --targets --from F   # evaluate the targets on a stored result F
//   options: --root DIR (repo to measure; default: repo containing this script)
//            --site DIR (built site; default: ROOT/_site)
//            --decision FILE (weights decision; default: <this repo>/creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md)
//            --commit SHA (record SHA in _meta when ROOT is an exported tree without .git)
//
// Exit codes: 0 ok / all targets met; 1 at least one target unmet;
//             2 usage or input error (missing _site, unreadable file).

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PROBE_VERSION = 2;
const CACHE_REL = 'docs/assets/images/profield-cache';
const DECK_MEDIA_REL = 'docs/assets/images/deck-media';
const DECK_ROOTS = [
  'docs/tracks/en/uem/2627-ct',
  'docs/tracks/en/uem/2627-ml', // A1/A2: master-lecture deck is in scope
];
const LESSONS_REL = 'docs/lessons/en/creativity-techniques';
const MASTER_LECTURES_REL = 'docs/lessons/en/master-lectures';
const REHYDRATE_REL = 'scripts/rehydrate-student-media.mjs';
const DECISION_REL = 'creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md';
const SHORTLISTS_REL = 'creativity-techniques-pedagogy/excellence/curation/shortlists.json';
const RIGHTS_REPORT_REL = 'creativity-techniques-pedagogy/excellence/curation/rights-report.json';
const OVERSIZE_BYTES = 600 * 1024;
const TAO_LABEL = '(Tao of Creativity)';

const SOURCE_EXT = new Set(['.md', '.markdown', '.html', '.json', '.yml', '.yaml']);
const REF_SCAN_EXT = new Set(['.md', '.markdown', '.html', '.json', '.yml', '.yaml', '.js', '.mjs', '.css', '.scss', '.liquid', '.txt']);
const SITE_TEXT_EXT = new Set(['.html', '.json', '.xml', '.txt', '.js', '.css', '.yml', '.yaml', '.md']);
const SKIP_DIRS = new Set(['_site', 'node_modules', 'vendor', '.git', '.jekyll-cache', '.sass-cache']);

// Leak terms over the built site. Word boundaries avoid "forget", "audit".
const LEAK_TERMS = {
  forge: /\bforge(?!t)/i,
  harness: /\bharness/i,
  vault: /\bvault/i,
  'lesson-scribe': /lesson-scribe/i,
  profield: /profield/i,
  udit: /\budit\b/i,
  'open procurement': /open\s+procurement/i,
  'guía clone': /gu[ií]a\s+clone/i,
};

// Evaluation-weight patterns. SEP tolerates markdown bold, table pipes,
// colons and inline HTML tags between a label and its percentage.
const SEP = String.raw`(?:\s|\*|\||:|<[^>\n]+>)*`;
const PARENS = String.raw`(?:\s*\([^)\n]*\))?`;
const K_BEFORE = new RegExp(String.raw`(\d{1,3})\s*%${SEP}knowledge\s+tests?`, 'gi');
const K_AFTER = new RegExp(String.raw`knowledge\s+tests?${PARENS}${SEP}(\d{1,3})\s*%`, 'gi');
const W_LABEL = String.raw`(?:delivery(?:\s+and\/or|\s+and|\s*\/)?\s*(?:of\s+)?(?:and\/or\s+)?presentation(?:\s+of\s+work)?|presentation\s+evidence)`;
const W_BEFORE = new RegExp(String.raw`(\d{1,3})\s*%${SEP}${W_LABEL}`, 'gi');
const W_AFTER = new RegExp(String.raw`${W_LABEL}${PARENS}${SEP}(\d{1,3})\s*%`, 'gi');
const PAIR_WINDOW = 3; // lines after the knowledge figure searched for the work figure
const AUTHOR_DATE_LABEL = /\(\s*[A-ZÁÉÍÓÚÑ][^)]*\d{4}/; // Chicago-ish author-date in a citation label

// ---------------------------------------------------------------- helpers

function die(msg) {
  process.stderr.write(`excellence-probe: ${msg}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { root: null, site: null, targets: false, from: null, decision: null, commit: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) die(`${a} needs a value`);
      return argv[++i];
    };
    if (a === '--root') opts.root = path.resolve(next());
    else if (a === '--site') opts.site = path.resolve(next());
    else if (a === '--from') opts.from = path.resolve(next());
    else if (a === '--decision') opts.decision = path.resolve(next());
    else if (a === '--commit') opts.commit = next();
    else if (a === '--targets') opts.targets = true;
    else if (a === '-h' || a === '--help') {
      process.stdout.write('usage: excellence-probe.mjs [--root DIR] [--site DIR] [--targets] [--from FILE] [--decision FILE] [--commit SHA]\n');
      process.exit(0);
    } else die(`unknown argument: ${a}`);
  }
  return opts;
}

function findRepoRoot(startDir) {
  let dir = startDir;
  for (;;) {
    if (fs.existsSync(path.join(dir, '_config.yml')) && fs.existsSync(path.join(dir, 'docs'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) die(`no repository root (with _config.yml and docs/) above ${startDir}`);
    dir = up;
  }
}

function walk(dir, exts, skipAbs = new Set()) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (SKIP_DIRS.has(ent.name) || skipAbs.has(p)) continue;
        stack.push(p);
      } else if (ent.isFile() && (!exts || exts.has(path.extname(ent.name).toLowerCase()))) {
        out.push(p);
      }
    }
  }
  return out.sort();
}

const rel = (base, p) => path.relative(base, p).split(path.sep).join('/');

function readDeckJson(file) {
  let text = fs.readFileSync(file, 'utf8');
  // Jekyll front matter: "---\n...\n---\n" before the JSON body.
  const fm = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (fm) text = text.slice(fm[0].length);
  return JSON.parse(text);
}

/** A1: U4–U6 out of cascade scope for targets; still listed in measures when present. */
function inCascadeScope(deckName) {
  return !/^u-[4-9]-/i.test(deckName);
}

function listDecks(root) {
  const out = [];
  for (const deckRoot of DECK_ROOTS) {
    const dir = path.join(root, deckRoot);
    if (!fs.existsSync(dir)) continue;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, ent.name, 'data', 'content.json');
      if (!ent.isDirectory() || !fs.existsSync(file)) continue;
      out.push({ name: ent.name, root: deckRoot, file, data: readDeckJson(file) });
    }
  }
  return out;
}

function gitCommit(root) {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function citationLabel(slide) {
  if (!slide) return null;
  const c = slide.citation;
  if (c && typeof c === 'object') return typeof c.label === 'string' ? c.label : null;
  return typeof c === 'string' ? c : null;
}

// ---------------------------------------------------------------- measures

function allMatches(re, line) {
  re.lastIndex = 0;
  const out = [];
  let m;
  while ((m = re.exec(line)) !== null) {
    out.push({ start: m.index, end: m.index + m[0].length, value: Number(m[1]) });
    if (m[0].length === 0) re.lastIndex++;
  }
  return out;
}

function dedupe(matches) {
  // Prefer the shortest match when two patterns overlap the same figure.
  matches.sort((a, b) => a.start - b.start || (a.end - a.start) - (b.end - b.start));
  const out = [];
  for (const m of matches) if (!out.some((o) => m.start < o.end && o.start < m.end)) out.push(m);
  return out;
}

function publicWeights(root) {
  const docs = path.join(root, 'docs');
  const cache = path.join(root, CACHE_REL);
  const found = [];
  for (const file of walk(docs, SOURCE_EXT, new Set([cache, path.join(root, DECK_MEDIA_REL)]))) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const knowledgeOn = (line) => dedupe([...allMatches(K_BEFORE, line), ...allMatches(K_AFTER, line)]);
    // A work figure must not reuse a knowledge figure (e.g. "70% … Delivery"):
    // drop work matches overlapping any knowledge match before de-duplicating.
    const workOn = (line) => {
      const ks = knowledgeOn(line);
      return dedupe([...allMatches(W_BEFORE, line), ...allMatches(W_AFTER, line)]
        .filter((w) => !ks.some((k) => w.start < k.end && k.start < w.end)));
    };
    lines.forEach((line, i) => {
      for (const k of knowledgeOn(line)) {
        let work = null;
        for (let j = i; j < Math.min(lines.length, i + PAIR_WINDOW + 1) && work === null; j++) {
          const ws = workOn(lines[j]);
          if (ws.length) work = ws[0].value;
        }
        found.push({ file: rel(root, file), line: i + 1, knowledge: k.value, work });
      }
    });
  }
  return found;
}

/** Which deck directory names (u-4-…, etc.) mention this cache file name. */
function cacheFileReferrers(root, fileName) {
  const names = [];
  for (const { name, file } of listDecks(root)) {
    if (fs.readFileSync(file, 'utf8').includes(fileName)) names.push(name);
  }
  return names;
}

function cacheMeasures(root) {
  const cache = path.join(root, CACHE_REL);
  const files = fs.existsSync(cache)
    ? fs.readdirSync(cache, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name).sort()
    : [];
  const corpus = walk(path.join(root, 'docs'), REF_SCAN_EXT, new Set([cache, path.join(root, DECK_MEDIA_REL)]))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n');
  const php = files.filter((f) => f.toLowerCase().endsWith('.php'));
  const orphans = files.filter((f) => !corpus.includes(f));
  const oversize = files
    .map((f) => ({ file: f, bytes: fs.statSync(path.join(cache, f)).size }))
    .filter((x) => x.bytes > OVERSIZE_BYTES);
  // A1: files referenced only by U4–U6 do not fail EX11 targets.
  const onlyOutOfScope = (fileName) => {
    const refs = cacheFileReferrers(root, fileName);
    return refs.length > 0 && refs.every((n) => !inCascadeScope(n));
  };
  return {
    php_cache_files: php.length,
    php_cache_files_scoped: php.filter((f) => !onlyOutOfScope(f)).length,
    orphan_cache_files: orphans,
    orphan_cache_files_scoped: orphans.filter((f) => !onlyOutOfScope(f)),
    oversize_cache_files: oversize,
    oversize_cache_files_scoped: oversize.filter((x) => !onlyOutOfScope(x.file)),
  };
}

/**
 * A2/F4: rank dealing by behaviour — slide→asset assignment by index/cursor —
 * not merely the identifier `rankCursor`. A script that binds via slide.asset_id
 * and never indexes a ranked pool is clean.
 */
function rankDealingInSource(src) {
  if (typeof src !== 'string' || !src.trim()) return false;
  const indexAssign = /rankedSlots\s*\[|rankCursor\b|%\s*ranked|assets\s*\[\s*(i|idx|index|cursor)\b/i.test(src);
  const usesSlideAssetId = /\bslide\.asset_id\b/.test(src);
  return indexAssign || !usesSlideAssetId;
}

function rankDealingPresent(root) {
  const file = path.join(root, REHYDRATE_REL);
  if (!fs.existsSync(file)) return false;
  return rankDealingInSource(fs.readFileSync(file, 'utf8'));
}

function deckMeasures(root) {
  const dangling_slots = {};
  const empty_licence_assets = [];
  const lab_exercise_counts = {};
  const zero_lab_decks = [];
  const asset_reuse = {};
  const tao_with_author_citation = [];
  const quotes_missing_quote_origin = [];

  for (const { name, data } of listDecks(root)) {
    const slides = Array.isArray(data.slides) ? data.slides : [];
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const isMediaDeck = slides.some((s) => s && s.slide_role);
    if (!isMediaDeck) continue;

    const bound = new Set(assets.map((a) => a && a.media_slot_id).filter(Boolean));
    const used = [];
    for (const s of slides) {
      const id = s && s.media_slot_id;
      if (id && !used.includes(id)) used.push(id);
    }
    dangling_slots[name] = used.filter((id) => !bound.has(id));

    for (const a of assets) {
      if (!a || typeof a.licence !== 'string' || a.licence.trim() === '') {
        empty_licence_assets.push({ deck: name, media_slot_id: a ? a.media_slot_id ?? null : null, asset_id: a ? a.asset_id ?? null : null });
      }
    }

    const labN = slides.filter((s) => s && s.slide_role === 'lab_exercise').length;
    lab_exercise_counts[name] = labN;
    if (labN === 0) zero_lab_decks.push(name);

    const reuseMap = new Map();
    for (const s of slides) {
      const aid = s && s.asset_id;
      if (!aid) continue;
      if (!reuseMap.has(aid)) reuseMap.set(aid, []);
      reuseMap.get(aid).push(s.slide_id || s.heading || '?');
    }
    const reused = [...reuseMap.entries()].filter(([, ids]) => ids.length > 1).map(([asset_id, slides_using]) => ({ asset_id, slides: slides_using }));
    if (reused.length) asset_reuse[name] = reused;

    slides.forEach((s, i) => {
      if (!s) return;
      if (s.quote_origin === 'tao_invented') {
        const label = citationLabel(s);
        if (typeof label === 'string' && label.trim() !== '' && label.trim() !== TAO_LABEL) {
          tao_with_author_citation.push({ deck: name, slide: i, heading: s.heading ?? null, quote: s.quote ?? null, label });
        }
      }
      // A2: author-date citation label on a quote without quote_origin.
      const label = citationLabel(s);
      if (s.quote && label && AUTHOR_DATE_LABEL.test(label) && !s.quote_origin) {
        quotes_missing_quote_origin.push({ deck: name, slide_id: s.slide_id ?? null, label });
      }
    });
  }
  return {
    dangling_slots,
    empty_licence_assets,
    lab_exercise_counts,
    zero_lab_decks,
    asset_reuse,
    tao_with_author_citation,
    quotes_missing_quote_origin,
  };
}

function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return m ? { yaml: m[1], body: text.slice(m[0].length) } : { yaml: '', body: text };
}

// Reads `references:` from front matter: inline list [a, b] or a block list.
function listedReferenceKeys(yaml) {
  const inline = yaml.match(/^references:\s*\[([^\]]*)\]\s*$/m);
  if (inline) return inline[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  const block = yaml.match(/^references:\s*\r?\n((?:[ \t]+-[^\n]*\r?\n?)+)/m);
  if (block) return [...block[1].matchAll(/-\s*['"]?([\w-]+)['"]?/g)].map((m) => m[1]);
  return [];
}

function lessonFiles(root) {
  const out = [];
  for (const relDir of [LESSONS_REL, MASTER_LECTURES_REL]) {
    const dir = path.join(root, relDir);
    if (!fs.existsSync(dir)) continue;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, ent.name, 'index.md');
      if (ent.isDirectory() && fs.existsSync(file)) out.push([ent.name, file]);
    }
  }
  return out;
}

function uncitedReferences(root) {
  const out = {};
  for (const [name, file] of lessonFiles(root)) {
    const text = fs.readFileSync(file, 'utf8');
    const { yaml, body } = frontMatter(text);
    const legacy = [...text.matchAll(/id="ref-([^"]+)"/g)].map((m) => m[1]);
    const listed = [...new Set([...listedReferenceKeys(yaml), ...legacy])];
    if (!listed.length) continue;
    // Cited = linked as #ref-key in the body before the References heading.
    const refHead = body.search(/^##\s+References\b/m);
    const cited = refHead === -1 ? body : body.slice(0, refHead);
    out[name] = listed
      .filter((k) => !new RegExp(`#ref-${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(cited))
      .map((k) => `ref-${k}`);
  }
  return out;
}

function leakTerms(site) {
  const out = Object.fromEntries(Object.keys(LEAK_TERMS).map((t) => [t, []]));
  for (const file of walk(site, SITE_TEXT_EXT)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const [term, re] of Object.entries(LEAK_TERMS)) if (re.test(text)) out[term].push(rel(site, file));
  }
  return out;
}

/** A1/A2: leak hits under u-[4-9]-* paths are out of cascade scope for targets. */
function leakTermsScoped(leaks) {
  const out = {};
  for (const [term, files] of Object.entries(leaks || {})) {
    out[term] = (files || []).filter((f) => !/\/u-[4-9]-/i.test(f));
  }
  return out;
}

/** A7: per-slide candidate depth from EX4 shortlists (private). */
function candidateDepth(root) {
  const file = path.join(root, SHORTLISTS_REL);
  if (!fs.existsSync(file)) return {};
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
  const out = {};
  for (const [unit, rows] of Object.entries(data || {})) {
    if (!Array.isArray(rows)) continue;
    const bySlide = {};
    for (const row of rows) {
      const id = row.slide_id || row.slide || '?';
      bySlide[id] = (bySlide[id] || 0) + 1;
    }
    out[unit] = bySlide;
  }
  return out;
}

/**
 * A6: rights report freshness vs decks — every bound v2 asset appears, and the
 * report file is at least as new as the newest scoped deck (or content-complete).
 */
function rightsReportFreshness(root) {
  const reportPath = path.join(root, RIGHTS_REPORT_REL);
  if (!fs.existsSync(reportPath)) {
    return { ok: false, reason: 'rights-report.json missing', curator_flagged: 0, report_assets: 0, deck_assets: 0 };
  }
  let report;
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (e) {
    return { ok: false, reason: `unreadable: ${e.message}`, curator_flagged: 0, report_assets: 0, deck_assets: 0 };
  }
  const reportIds = new Set((report.assets || []).map((a) => `${a.deck}::${a.asset_id}::${a.media_slot_id}`));
  const deckAssets = [];
  for (const { name, file, data } of listDecks(root)) {
    if (!inCascadeScope(name)) continue;
    if (data.schema_version !== 2) continue;
    if (!Array.isArray(data.slides) || !data.slides.some((s) => s && s.slide_role)) continue;
    const relDeck = rel(root, file);
    for (const a of data.assets || []) {
      if (!a || !a.asset_id) continue;
      deckAssets.push({ key: `${relDeck}::${a.asset_id}::${a.media_slot_id}`, rights_status: a.rights_status });
    }
  }
  const missing = deckAssets.filter((a) => !reportIds.has(a.key)).map((a) => a.key);
  const curator_flagged = (report.assets || []).filter((a) => a.rights_status === 'flagged').length;
  // A6/A7: freshness = report lists every bound asset AND tallies curator flags
  // (not only rightsVerdict failures). Require the dedicated curator_flagged field
  // so an old report that only counted verdict fails cannot pass.
  const summaryCurator = report.summary?.curator_flagged;
  const ok = missing.length === 0 && Number.isInteger(summaryCurator) && summaryCurator === curator_flagged;
  return {
    ok,
    reason: ok ? null : [
      missing.length ? `missing ${missing.length} deck asset(s) in report` : null,
      !Number.isInteger(summaryCurator) ? 'summary.curator_flagged absent (regenerate with validate-decks --rights=flag)' : null,
      Number.isInteger(summaryCurator) && summaryCurator !== curator_flagged
        ? `summary curator_flagged ${summaryCurator} != counted ${curator_flagged}` : null,
    ].filter(Boolean).join('; '),
    curator_flagged,
    report_assets: (report.assets || []).length,
    deck_assets: deckAssets.length,
    missing: missing.slice(0, 10),
  };
}

function measure(root, site, commit) {
  if (!fs.existsSync(site) || !fs.statSync(site).isDirectory()) {
    die(`built site not found at ${site}; run: bundle exec jekyll build --source docs --destination _site --config _config.yml`);
  }
  const decks = deckMeasures(root);
  const cache = cacheMeasures(root);
  return {
    _meta: {
      probe_version: PROBE_VERSION,
      commit: commit || gitCommit(root),
      generated_at: new Date().toISOString(),
      oversize_threshold_bytes: OVERSIZE_BYTES,
    },
    public_weights: publicWeights(root),
    php_cache_files: cache.php_cache_files,
    php_cache_files_scoped: cache.php_cache_files_scoped,
    orphan_cache_files: cache.orphan_cache_files,
    orphan_cache_files_scoped: cache.orphan_cache_files_scoped,
    oversize_cache_files: cache.oversize_cache_files,
    oversize_cache_files_scoped: cache.oversize_cache_files_scoped,
    dangling_slots: decks.dangling_slots,
    rank_dealing_present: rankDealingPresent(root),
    empty_licence_assets: decks.empty_licence_assets,
    lab_exercise_counts: decks.lab_exercise_counts,
    zero_lab_decks: decks.zero_lab_decks,
    asset_reuse: decks.asset_reuse,
    quotes_missing_quote_origin: decks.quotes_missing_quote_origin,
    tao_with_author_citation: decks.tao_with_author_citation,
    uncited_references: uncitedReferences(root),
    ...((leaks) => ({ leak_terms: leaks, leak_terms_scoped: leakTermsScoped(leaks) }))(leakTerms(site)),
    candidate_depth: candidateDepth(root),
    rights_report_freshness: rightsReportFreshness(root),
  };
}

// ---------------------------------------------------------------- targets

const REQUIRED_KEYS = [
  'public_weights', 'php_cache_files', 'php_cache_files_scoped',
  'orphan_cache_files', 'orphan_cache_files_scoped',
  'oversize_cache_files', 'oversize_cache_files_scoped',
  'dangling_slots', 'rank_dealing_present', 'empty_licence_assets', 'lab_exercise_counts',
  'zero_lab_decks', 'asset_reuse', 'quotes_missing_quote_origin',
  'tao_with_author_citation', 'uncited_references', 'leak_terms', 'leak_terms_scoped',
  'candidate_depth', 'rights_report_freshness',
];

function readDecision(file) {
  if (!fs.existsSync(file)) return null;
  const fields = {};
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/^(\w+):\s*(.+?)\s*$/gm)) fields[m[1]] = m[2];
  const k = Number.parseInt(fields.weights_knowledge_tests, 10);
  const w = Number.parseInt(fields.weights_work, 10);
  return Number.isFinite(k) && Number.isFinite(w) ? { knowledge: k, work: w } : null;
}

function evaluateTargets(r, decision) {
  const unmet = [];
  const missing = REQUIRED_KEYS.filter((k) => !(k in r));
  if (missing.length) unmet.push(`result is missing keys: ${missing.join(', ')}`);
  const len = (x) => (Array.isArray(x) ? x.length : 0);

  if (!decision) unmet.push('public_weights: no usable weights decision (DECISION-EX0-GUIA.md)');
  else if (!len(r.public_weights)) {
    // A2: empty public_weights is unmet (not a free pass).
    unmet.push('public_weights: empty (target at least one published pair matching the decision)');
  } else {
    for (const p of r.public_weights || []) {
      if (p.knowledge !== decision.knowledge || (p.work !== null && p.work !== decision.work)) {
        unmet.push(`public_weights: ${p.file}:${p.line} says ${p.knowledge}/${p.work}, decision is ${decision.knowledge}/${decision.work}`);
      }
    }
  }
  const phpScoped = r.php_cache_files_scoped ?? r.php_cache_files;
  if (phpScoped !== 0) unmet.push(`php_cache_files_scoped: ${phpScoped} (target 0; global php_cache_files=${r.php_cache_files})`);
  const orphansScoped = r.orphan_cache_files_scoped ?? r.orphan_cache_files;
  if (len(orphansScoped)) unmet.push(`orphan_cache_files_scoped: ${len(orphansScoped)} (target 0)`);
  const overScoped = r.oversize_cache_files_scoped ?? r.oversize_cache_files;
  if (len(overScoped)) unmet.push(`oversize_cache_files_scoped: ${len(overScoped)} (target 0)`);
  for (const [deck, slots] of Object.entries(r.dangling_slots || {})) {
    if (!inCascadeScope(deck)) continue; // A1: U4–U6 not counted as failures
    if (len(slots)) unmet.push(`dangling_slots: ${deck} has ${len(slots)} (target 0)`);
  }
  if (r.rank_dealing_present !== false) unmet.push(`rank_dealing_present: ${r.rank_dealing_present} (target false)`);
  if (len(r.empty_licence_assets)) {
    const scoped = (r.empty_licence_assets || []).filter((a) => inCascadeScope(a.deck));
    if (scoped.length) unmet.push(`empty_licence_assets: ${scoped.length} (target 0)`);
  }
  for (const [deck, n] of Object.entries(r.lab_exercise_counts || {})) {
    if (!inCascadeScope(deck)) continue;
    if (n !== 2) unmet.push(`lab_exercise_counts: ${deck} has ${n} (target 2)`);
  }
  for (const deck of r.zero_lab_decks || []) {
    if (!inCascadeScope(deck)) continue;
    unmet.push(`zero_lab_decks: ${deck} (target none in scope)`);
  }
  for (const [deck, items] of Object.entries(r.asset_reuse || {})) {
    if (!inCascadeScope(deck)) continue;
    if (len(items)) unmet.push(`asset_reuse: ${deck} has ${len(items)} reused asset(s) (target 0)`);
  }
  if (len(r.quotes_missing_quote_origin)) {
    unmet.push(`quotes_missing_quote_origin: ${len(r.quotes_missing_quote_origin)} (target 0)`);
  }
  if (len(r.tao_with_author_citation)) unmet.push(`tao_with_author_citation: ${len(r.tao_with_author_citation)} (target 0)`);
  for (const [lesson, ids] of Object.entries(r.uncited_references || {})) {
    if (/^u-[4-9]-/i.test(lesson)) continue;
    if (len(ids)) unmet.push(`uncited_references: ${lesson} has ${len(ids)} (target 0)`);
  }
  const leaks = r.leak_terms_scoped || leakTermsScoped(r.leak_terms || {});
  for (const [term, files] of Object.entries(leaks)) {
    if (len(files)) unmet.push(`leak_terms_scoped: "${term}" in ${len(files)} file(s) (target 0)`);
  }
  if (r.rights_report_freshness && r.rights_report_freshness.ok !== true) {
    unmet.push(`rights_report_freshness: ${r.rights_report_freshness.reason || 'not ok'}`);
  }
  return unmet;
}

// ---------------------------------------------------------------- main

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  const selfRoot = findRepoRoot(path.dirname(fileURLToPath(import.meta.url)));
  const root = opts.root ? findRepoRoot(opts.root) : selfRoot;
  const site = opts.site || path.join(root, '_site');

  let result;
  if (opts.from) {
    try {
      result = JSON.parse(fs.readFileSync(opts.from, 'utf8'));
    } catch (e) {
      die(`cannot read --from ${opts.from}: ${e.message}`);
    }
  } else {
    result = measure(root, site, opts.commit);
  }

  if (opts.targets) {
    const unmet = evaluateTargets(result, readDecision(opts.decision || path.join(selfRoot, DECISION_REL)));
    for (const u of unmet) process.stderr.write(`UNMET ${u}\n`);
    process.stdout.write(`${JSON.stringify({ targets_met: unmet.length === 0, unmet_count: unmet.length, unmet }, null, 2)}\n`);
    process.exit(unmet.length ? 1 : 0);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

export {
  measure,
  evaluateTargets,
  rankDealingInSource,
  readDecision,
  inCascadeScope,
  AUTHOR_DATE_LABEL,
};
