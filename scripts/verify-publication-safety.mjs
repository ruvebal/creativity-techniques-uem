#!/usr/bin/env node
/**
 * Publication sanitization — fail closed if studio infra names/paths leak into _site
 * (sibling of digital-creativity-uem/scripts/verify-publication-safety.mjs).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const publicRoot = resolve(root, '_site');

const forbidden = [
	[/\bAhmes\b/i, 'internal corpus name'],
	[/\bAthanor\b/i, 'internal discovery service'],
	[/\bDevIAC\b/i, 'internal architecture'],
	[/\[BIBLIO-GAP\]/i, 'internal bibliography status'],
	[/\[UNVERIFIED-(?:GAP|NOISE)\]/i, 'internal verification status'],
	[/\bevaluator[_ -]?safe\b/i, 'internal evaluator status'],
	[/\bextraction\.db\b/i, 'local extraction database'],
	[/\bfission_node\b/i, 'local extraction schema'],
	[/\bproject_slug\b/i, 'internal project key'],
	[/\bknowledge_scope\b/i, 'internal search scope'],
	[/\b(?:evidence|grounding)\s+matrix\b/i, 'internal evidence architecture'],
	[/\bvector (?:preview|snippet|search)\b/i, 'internal discovery trace'],
	[/\b(?:coat|node|nodo)\s+`?[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}`?/i, 'internal node identifier'],
	[/\/Users\/ruvebal\/[^\s<'\"]+/i, 'local filesystem path'],
	[/\bfashlex\b/i, 'discontinued sibling vocabulary name'],
	[/~\/src\//i, 'local studio path'],
	[/\bcreativity-techniques-pedagogy\//i, 'local curriculum-maintenance path'],
	[/\bdigital-creativity-pedagogy\//i, 'local curriculum-maintenance path'],
	[/\bdocs\/_data\//i, 'local site-data path'],
	[/\b\.cursor\//i, 'local agent configuration'],
	[/\bct-unit-forge\.mdc\b/i, 'local forge rule'],
	[/\bUNIT-THEME-ENRICHMENT\.mdc\b/i, 'local forge rule'],
	[/\bdiscovery-receipt\.json\b/i, 'internal discovery receipt'],
	[/\bnotes_internal\b/i, 'internal directory field'],
	// EX2 (FINDINGS E1–E3; Amendments A2/F5, A3/F9): authoring machinery and sibling surfaces.
	[/\bForge date\b/i, 'internal authoring stamp'],
	[/\bforg(?:e[ds]?|er|ers|ing)\b/i, 'internal authoring pipeline (forge)'],
	// Narrowed (A4/F5): ordinary English such as "harness divergent thinking" stays allowed.
	[/\b(?:agentic|local|studio)\s+harness(?:es)?\b|\bharness:/i, 'internal agent harness'],
	[/\bagentic\b/i, 'internal agent architecture'],
	[/\bscholar-voice\b/i, 'internal voice model'],
	[/\benrichment pack\b/i, 'internal authoring pack'],
	[/\bextraction order\b/i, 'internal extraction locator'],
	[/\bsource adjudication\b/i, 'internal source review'],
	[/\blesson-scribe\b/i, 'internal authoring agent'],
	[/\bvaults?\b/i, 'internal source vault'],
	[/\bThessia\b/i, 'internal voice model'],
	[/\bcurriculum-internal\b/i, 'internal metadata block'],
	[/\bopen procurement\b/i, 'internal bibliography status'],
	[/\bgu[ií]a clone\b/i, 'internal guide-copy label'],
	[/\bcontact-forgeable\b/i, 'internal hours label'],
	[/\b9990002301\b/, 'internal guide identifier'],
	[/\budit\b/i, 'sibling institution (UDIT)'],
	[/\bweb-atelier\b/i, 'sibling course site'],
	[/\bdigital-creativity-uem\b/i, 'sibling course site'],
	[/\bDigital Creativity\b/, 'sibling course mention'],
];

// Applied to built HTML only: deck JSON values still carry these until EX3 renames them.
const forbiddenHtmlOnly = [[/\bprofield\b/i, 'internal media service (Profield)']];

function filesUnder(directory, extensions) {
	if (!statSync(directory, { throwIfNoEntry: false })?.isDirectory()) return [];
	const result = [];
	for (const entry of readdirSync(directory)) {
		const path = join(directory, entry);
		if (statSync(path).isDirectory()) result.push(...filesUnder(path, extensions));
		else if (extensions.has(extname(path))) result.push(path);
	}
	return result;
}

function leakAudit() {
	if (!statSync(publicRoot, { throwIfNoEntry: false })?.isDirectory()) {
		console.error('Publication safety: _site missing — run npm run build first.');
		process.exit(1);
	}
	const failures = [];
	const extensions = new Set(['.html', '.xml', '.json', '.js', '.css', '.svg', '.md', '.txt', '.yml', '.yaml']);
	for (const file of filesUnder(publicRoot, extensions)) {
		const content = readFileSync(file, 'utf8');
		const patterns = extname(file) === '.html' ? [...forbidden, ...forbiddenHtmlOnly] : forbidden;
		for (const [pattern, label] of patterns) {
			if (pattern.test(content)) failures.push(`${relative(root, file)}: ${label}`);
		}
	}
	// Raw site data must not be published (FINDINGS E2): Liquid reads site.data at build time.
	if (statSync(join(publicRoot, '_data'), { throwIfNoEntry: false })) failures.push('_site/_data: raw site data published');
	// Pedagogy tree must never ship
	for (const banned of ['creativity-techniques-pedagogy', 'student-project-template', 'directory/musae-dfa', 'methods/musae-dfa']) {
		const p = join(publicRoot, banned);
		if (statSync(p, { throwIfNoEntry: false })) failures.push(`_site/${banned}: private path leaked`);
	}
	if (failures.length) {
		console.error(`Publication safety failed (${failures.length} finding(s)):\n${failures.join('\n')}`);
		process.exit(1);
	}
	console.log('Publication safety passed: no internal corpus or local-architecture metadata in _site.');
}

leakAudit();
