#!/usr/bin/env node
// Excellence cascade readiness probe (PHASE-EX0).
//
// Node stdlib only. Reads the repository (and, for leak_terms, an existing
// built _site) and prints ONE JSON object with the keys listed in
// PHASE-EX0.md. It builds nothing itself.
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
//
// First draft generated locally by qwen2.5-coder:32b (Ollama /api/generate),
// then reviewed and largely rewritten; see PHASE-EX0-REPORT.md.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PROBE_VERSION = 1;
const CACHE_REL = 'docs/assets/images/profield-cache';
const DECKS_REL = 'docs/tracks/en/uem/2627-ct';
const LESSONS_REL = 'docs/lessons/en/creativity-techniques';
const REHYDRATE_REL = 'scripts/rehydrate-student-media.mjs';
const DECISION_REL = 'creativity-techniques-pedagogy/excellence/DECISION-EX0-GUIA.md';
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

function listDecks(root) {
  const dir = path.join(root, DECKS_REL);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, 'data', 'content.json')))
    .map((e) => e.name)
    .sort()
    .map((name) => ({ name, data: readDeckJson(path.join(dir, name, 'data', 'content.json')) }));
}

function gitCommit(root) {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
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
  for (const file of walk(docs, SOURCE_EXT, new Set([cache]))) {
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

function cacheMeasures(root) {
  const cache = path.join(root, CACHE_REL);
  const files = fs.existsSync(cache)
    ? fs.readdirSync(cache, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name).sort()
    : [];
  const corpus = walk(path.join(root, 'docs'), REF_SCAN_EXT, new Set([cache]))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n');
  return {
    php_cache_files: files.filter((f) => f.toLowerCase().endsWith('.php')).length,
    orphan_cache_files: files.filter((f) => !corpus.includes(f)),
    oversize_cache_files: files
      .map((f) => ({ file: f, bytes: fs.statSync(path.join(cache, f)).size }))
      .filter((x) => x.bytes > OVERSIZE_BYTES),
  };
}

function deckMeasures(root) {
  const dangling_slots = {};
  const empty_licence_assets = [];
  const lab_exercise_counts = {};
  const tao_with_author_citation = [];
  for (const { name, data } of listDecks(root)) {
    const slides = Array.isArray(data.slides) ? data.slides : [];
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const bound = new Set(assets.map((a) => a && a.media_slot_id).filter(Boolean));
    const used = [];
    for (const s of slides) {
      const id = s && s.media_slot_id;
      if (id && !used.includes(id)) used.push(id);
    }
    if (slides.some((s) => s && s.slide_role)) dangling_slots[name] = used.filter((id) => !bound.has(id));
    for (const a of assets) {
      if (!a || typeof a.licence !== 'string' || a.licence.trim() === '') {
        empty_licence_assets.push({ deck: name, media_slot_id: a ? a.media_slot_id ?? null : null, asset_id: a ? a.asset_id ?? null : null });
      }
    }
    if (slides.some((s) => s && (s.slide_role === 'lab_opener' || s.slide_role === 'lab_exercise'))) {
      lab_exercise_counts[name] = slides.filter((s) => s && s.slide_role === 'lab_exercise').length;
    }
    slides.forEach((s, i) => {
      if (!s || s.quote_origin !== 'tao_invented') return;
      const label = s.citation && typeof s.citation === 'object' ? s.citation.label : s.citation;
      if (typeof label === 'string' && label.trim() !== '' && label.trim() !== TAO_LABEL) {
        tao_with_author_citation.push({ deck: name, slide: i, heading: s.heading ?? null, quote: s.quote ?? null, label });
      }
    });
  }
  return { dangling_slots, empty_licence_assets, lab_exercise_counts, tao_with_author_citation };
}

// Amendment A2/F2 (EX6): references come from docs/_data/references.yml. A
// lesson lists the keys it shows in its front matter (`references: [k, ...]`,
// rendered by the references.html include); legacy hand-written
// <span id="ref-…"> entries still count as listed. A listed key that the lesson
// body never links as #ref-<key> is uncited. Lessons scanned: every unit lesson
// plus the master lectures. Output shape is unchanged: { lesson: ["ref-key"] }.
const MASTER_LECTURES_REL = 'docs/lessons/en/master-lectures';

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
  for (const rel of [LESSONS_REL, MASTER_LECTURES_REL]) {
    const dir = path.join(root, rel);
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
    orphan_cache_files: cache.orphan_cache_files,
    oversize_cache_files: cache.oversize_cache_files,
    dangling_slots: decks.dangling_slots,
    rank_dealing_present: fs.existsSync(path.join(root, REHYDRATE_REL))
      && fs.readFileSync(path.join(root, REHYDRATE_REL), 'utf8').includes('rankCursor'),
    empty_licence_assets: decks.empty_licence_assets,
    lab_exercise_counts: decks.lab_exercise_counts,
    tao_with_author_citation: decks.tao_with_author_citation,
    uncited_references: uncitedReferences(root),
    leak_terms: leakTerms(site),
  };
}

// ---------------------------------------------------------------- targets

const REQUIRED_KEYS = [
  'public_weights', 'php_cache_files', 'orphan_cache_files', 'oversize_cache_files',
  'dangling_slots', 'rank_dealing_present', 'empty_licence_assets', 'lab_exercise_counts',
  'tao_with_author_citation', 'uncited_references', 'leak_terms',
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
  else {
    for (const p of r.public_weights || []) {
      if (p.knowledge !== decision.knowledge || (p.work !== null && p.work !== decision.work)) {
        unmet.push(`public_weights: ${p.file}:${p.line} says ${p.knowledge}/${p.work}, decision is ${decision.knowledge}/${decision.work}`);
      }
    }
  }
  if (r.php_cache_files !== 0) unmet.push(`php_cache_files: ${r.php_cache_files} (target 0)`);
  if (len(r.orphan_cache_files)) unmet.push(`orphan_cache_files: ${len(r.orphan_cache_files)} (target 0)`);
  if (len(r.oversize_cache_files)) unmet.push(`oversize_cache_files: ${len(r.oversize_cache_files)} (target 0)`);
  for (const [deck, slots] of Object.entries(r.dangling_slots || {})) {
    if (len(slots)) unmet.push(`dangling_slots: ${deck} has ${len(slots)} (target 0)`);
  }
  if (r.rank_dealing_present !== false) unmet.push(`rank_dealing_present: ${r.rank_dealing_present} (target false)`);
  if (len(r.empty_licence_assets)) unmet.push(`empty_licence_assets: ${len(r.empty_licence_assets)} (target 0)`);
  for (const [deck, n] of Object.entries(r.lab_exercise_counts || {})) {
    if (n !== 2) unmet.push(`lab_exercise_counts: ${deck} has ${n} (target 2)`);
  }
  if (len(r.tao_with_author_citation)) unmet.push(`tao_with_author_citation: ${len(r.tao_with_author_citation)} (target 0)`);
  for (const [lesson, ids] of Object.entries(r.uncited_references || {})) {
    if (len(ids)) unmet.push(`uncited_references: ${lesson} has ${len(ids)} (target 0)`);
  }
  for (const [term, files] of Object.entries(r.leak_terms || {})) {
    if (len(files)) unmet.push(`leak_terms: "${term}" in ${len(files)} file(s) (target 0)`);
  }
  return unmet;
}

// ---------------------------------------------------------------- main

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
