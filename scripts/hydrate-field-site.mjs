#!/usr/bin/env node
/**
 * Hydrate public site from data-as-code:
 *   directory/*.yml  → ONE route /directory/en/  (#section hashes)
 *   methods/*.yml    → ONE route /methods/en/    (practice-oriented only)
 *   fieldlex YAML     → ONE route /lexicum/en/    (lexfield-public/v1; #scheme / #concept)
 *
 * Subdirectory pages are removed on each run (single-endpoint navigation).
 */

import {
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
	existsSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const dataOut = join(docs, '_data');
const dirSrc = join(root, 'directory');
const methodsSrc = join(root, 'methods');
const fieldlexYamlRoot = join(
	root,
	'creativity-techniques-pedagogy/grounding/fieldlex/src-yaml',
);

const LEXICUM_PROVENANCE = {
	author: {
		name: 'Rubén Vega Balbás, PhD',
		role: 'Creative Technologist & Developer',
		orcid: 'https://orcid.org/0000-0001-6862-9081',
		email: 'ruvebal@crea-comm.net',
	},
	vocabulary_engine: {
		name: 'lexfield',
		version: '0.1.0',
		path_hint: 'fieldlex (multi-tenant SKOS vocabulary engine)',
	},
	publication_stack: {
		static_site: 'Jekyll 3.10.0',
		templates: 'Liquid 4.0.4',
		markdown: 'kramdown (GFM)',
		stylesheet: 'PostCSS + Tailwind CSS 3.x',
		hydrate: 'Node.js (js-yaml)',
	},
	ontology: {
		skos: {
			name: 'SKOS',
			version: 'W3C Recommendation, 2009-08-18',
			url: 'https://www.w3.org/TR/skos-reference/',
		},
		cidoc_crm: {
			name: 'CIDOC-CRM',
			version: '7.1.3 (2024-02-13)',
			url: 'https://gitlab.isl.ics.forth.gr/cidoc-crm/cidoc_crm_rdf',
		},
	},
	method:
		'Curriculum-local YAML snapshot compiled from lexfield; definitions authored as controlled-vocabulary entries with optional CIDOC-CRM class mappings where heritage-relevant.',
	prototype_note:
		'The fashion field is the seed tenant of lexfield; creativity_techniques reuses the same Field→Subfield→Concept schema and lexfield-public/v1 publication contract.',
};

const CATEGORIES = [
	'prizes',
	'awards',
	'studios',
	'journals',
	'organizations',
	'contests',
	'figures',
];

function slugify(value) {
	return String(value)
		.replace(/^ct:/, '')
		.replace(/_/g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function loadYaml(path) {
	return yaml.load(readFileSync(path, 'utf8'));
}

function write(path, contents) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, contents, 'utf8');
}

function wipeChildrenExceptIndex(dir) {
	if (!existsSync(dir)) return;
	for (const name of readdirSync(dir)) {
		if (name === 'index.md') continue;
		rmSync(join(dir, name), { recursive: true, force: true });
	}
}

function fm(obj) {
	const lines = ['---'];
	for (const [k, v] of Object.entries(obj)) {
		if (v === null || v === undefined) continue;
		lines.push(`${k}: ${JSON.stringify(v)}`);
	}
	lines.push('---', '');
	return lines.join('\n');
}

function publicEntry(entry) {
	const { notes_internal: _drop, ...rest } = entry;
	return rest;
}

function tocNav(items) {
	return [
		'<nav class="field-index__toc" aria-label="On this page">',
		'<p class="field-index__toc-label">On this page</p>',
		'<ul>',
		...items.map(
			(it) =>
				`<li><a href="#${it.id}">${it.label}${it.count != null ? ` <span class="field-index__count">${it.count}</span>` : ''}</a></li>`,
		),
		'</ul>',
		'</nav>',
	].join('\n');
}

/** Shared author + publication credit block (lexicum, directory, methods). */
function renderFieldIndexCredit(prov, methodLine) {
	const stack = prov.publication_stack;
	return `<div class="field-index__credit">
<p class="field-index__credit-by">By <a href="${prov.author.orcid}">${prov.author.name}</a> — ${prov.author.role} · ORCID <a href="${prov.author.orcid}">0000-0001-6862-9081</a></p>
<p class="field-index__credit-stack">Built with <strong>${prov.vocabulary_engine.name} ${prov.vocabulary_engine.version}</strong> (YAML → SKOS ConceptSchemes); published via <strong>${stack.static_site}</strong> + ${stack.templates} + ${stack.hydrate}; ontology layer <a href="${prov.ontology.skos.url}">SKOS (2009-08-18)</a> with optional <a href="${prov.ontology.cidoc_crm.url}">CIDOC-CRM ${prov.ontology.cidoc_crm.version}</a> class maps.</p>
<p class="field-index__credit-method">${methodLine}</p>
</div>`;
}

const DIRECTORY_CREDIT_METHOD =
	'Curriculum-local field directory (YAML-as-code); entries seeded from the course field panorama — prizes, awards, studios, journals, organizations, contests, and figures.';

/* ---------- Directory: single route + hashes ---------- */

function hydrateDirectory() {
	const index = loadYaml(join(dirSrc, 'index.yml'));
	const categories = {};
	for (const cat of CATEGORIES) {
		const path = join(dirSrc, `${cat}.yml`);
		const rows = existsSync(path) ? loadYaml(path) || [] : [];
		categories[cat] = rows.map(publicEntry);
	}

	const payload = { ...index, categories };
	delete payload.source;
	payload.source_note = 'Seeded from the course field panorama; edit directory/*.yml to update.';
	write(join(dataOut, 'field_directory.yml'), yaml.dump(payload, { lineWidth: 100 }));

	const base = join(docs, 'directory/en');
	mkdirSync(base, { recursive: true });
	wipeChildrenExceptIndex(base);

	const toc = tocNav(
		CATEGORIES.map((id) => ({
			id,
			label: index.categories.find((c) => c.id === id)?.title || id,
			count: categories[id].length,
		})),
	);

	const entryTotal = CATEGORIES.reduce((n, c) => n + categories[c].length, 0);
	const sections = CATEGORIES.map((cat) => {
		const title = index.categories.find((c) => c.id === cat)?.title || cat;
		const entries = categories[cat];
		const cards = entries
			.map((e) => {
				const meta = [
					e.status ? `<span class="field-card__status">${e.status}</span>` : '',
					e.location ? `<span class="field-card__meta">${e.location}</span>` : '',
					e.years ? `<span class="field-card__meta">${e.years}</span>` : '',
				]
					.filter(Boolean)
					.join('');
				const link = e.url
					? `<p class="field-card__link"><a href="${e.url}" rel="noopener noreferrer">${e.url.replace(/^https?:\/\//, '')}</a></p>`
					: '';
				const doi = e.doi ? `<p class="field-card__doi">DOI <code>${e.doi}</code></p>` : '';
				const refs = (e.references || []).length
					? `<ul class="field-card__refs">${(e.references || []).map((r) => `<li>${r}</li>`).join('')}</ul>`
					: '';
				return `<article class="field-card" id="${cat}--${e.id}">
<h3 class="field-card__title">${e.name}</h3>
<p class="field-card__summary">${e.summary}</p>
<p class="field-card__badges">${meta}</p>
${link}${doi}${refs}
</article>`;
			})
			.join('\n');
		return `<section class="field-index__section" id="${cat}">
<h2>${title}</h2>
<div class="field-card-grid">
${cards || '<p class="field-index__empty">No entries yet.</p>'}
</div>
</section>`;
	}).join('\n\n');

	write(
		join(base, 'index.md'),
		fm({
			layout: 'default',
			title: 'Field directory',
			lang: 'en',
			permalink: '/directory/en/',
			description:
				'Prizes, awards, studios, journals, organizations, contests, and figures — one page, section hashes.',
			field_index: true,
		}) +
			`<div class="field-index not-prose" data-field-index="directory">
<header class="field-index__hero">
<p class="field-index__eyebrow">Field map</p>
<h1 class="field-index__title">Directory</h1>
<p class="field-index__lede">Authorities and reference points for Creativity Techniques. Stay on this page — jump by section.</p>
<ul class="field-index__stats" aria-label="Directory statistics">
<li><strong>${entryTotal}</strong> entries</li>
<li><strong>${CATEGORIES.length}</strong> sections</li>
</ul>
${renderFieldIndexCredit(LEXICUM_PROVENANCE, DIRECTORY_CREDIT_METHOD)}
</header>
${toc}
${sections}
<footer class="field-index__related">
<p>Also see <a href="{{ '/lexicum/en/' | relative_url }}">Lexicum</a> · <a href="{{ '/methods/en/' | relative_url }}">Methods</a> · <a href="{{ '/bibliography/en/' | relative_url }}">Bibliography</a></p>
</footer>
</div>
`,
	);

	return CATEGORIES.reduce((n, c) => n + categories[c].length, 0);
}

/* ---------- Methods: practice-oriented learning only ---------- */

function hydrateMethods() {
	const index = loadYaml(join(methodsSrc, 'index.yml'));
	const methods = [];
	for (const name of readdirSync(methodsSrc)) {
		if (!name.endsWith('.yml') || name === 'index.yml') continue;
		const m = loadYaml(join(methodsSrc, name));
		if (!m?.id) continue;
		if (m.kind && m.kind !== 'practice-learning') continue;
		methods.push(m);
	}
	const order = index.entries || [];
	methods.sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99));

	write(
		join(dataOut, 'field_methods.yml'),
		yaml.dump(
			{
				schema: index.schema,
				title: index.title,
				updated: index.updated,
				orientation: 'practice-learning',
				methods: methods.map(({ athanor: _a, funding: _f, ...rest }) => rest),
			},
			{ lineWidth: 100 },
		),
	);

	const base = join(docs, 'methods/en');
	mkdirSync(base, { recursive: true });
	wipeChildrenExceptIndex(base);

	const toc = tocNav(methods.map((m) => ({ id: m.id, label: m.title })));
	const sections = methods
		.map((m) => {
			const steps = (m.steps || []).map((s) => `<li>${s}</li>`).join('');
			return `<section class="field-index__section" id="${m.id}">
<article class="field-card field-card--method">
<h2 class="field-card__title">${m.title}</h2>
<p class="field-card__summary">${m.summary}</p>
${steps ? `<ol class="field-card__steps">${steps}</ol>` : ''}
</article>
</section>`;
		})
		.join('\n\n');

	write(
		join(base, 'index.md'),
		fm({
			layout: 'default',
			title: 'Methods',
			lang: 'en',
			permalink: '/methods/en/',
			description:
				'Practice-oriented learning methods for Creativity Techniques — projects, problems, studio cycles.',
			field_index: true,
		}) +
			`<div class="field-index not-prose" data-field-index="methods">
<header class="field-index__hero">
<p class="field-index__eyebrow">Studio pedagogy</p>
<h1 class="field-index__title">Methods</h1>
<p class="field-index__lede">How we learn here: practice-oriented cycles — projects, problems, critique, and process notes. Not a catalogue of named research programmes.</p>
</header>
${toc}
${sections}
<footer class="field-index__related">
<p>Also see <a href="{{ '/directory/en/' | relative_url }}">Directory</a> · <a href="{{ '/lexicum/en/' | relative_url }}">Lexicum</a></p>
</footer>
</div>
`,
	);

	return methods.length;
}

/* ---------- Lexicum: single route + scheme/concept hashes ---------- */

function hydrateLexicum() {
	if (!existsSync(fieldlexYamlRoot)) {
		console.warn(
			`hydrate-field-site: fieldlex YAML missing at ${relative(root, fieldlexYamlRoot)} — keeping committed lexicum snapshot (local symlink only; see .gitignore).`,
		);
		const existing = join(dataOut, 'lexicum.json');
		if (existsSync(existing)) {
			const prev = JSON.parse(readFileSync(existing, 'utf8'));
			return {
				schemes: prev.stats?.subfields ?? 0,
				concepts: prev.stats?.concepts ?? 0,
			};
		}
		return { schemes: 0, concepts: 0 };
	}

	const fieldMeta = loadYaml(join(fieldlexYamlRoot, 'field.yaml'));
	if (String(fieldMeta.namespace_uri || '').includes('example.org')) {
		fieldMeta.namespace_uri = 'https://crea-comm.net/lexfield/creativity_techniques#';
	}
	const prefix = fieldMeta.namespace_prefix || 'ct';
	const subDirs = readdirSync(fieldlexYamlRoot, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();

	const labelByQualified = new Map();
	const subfields = [];
	for (const sub of subDirs) {
		const data = loadYaml(join(fieldlexYamlRoot, sub, 'concepts.yaml'));
		const concepts = (data.concepts || []).map((c) => {
			let scope = (c.scope_note || '').trim() || null;
			if (scope) scope = scope.replace(/\bfashlex:/g, 'fashion:');
			const item = {
				slug: c.slug,
				pref_label: (c.pref_label || '').trim(),
				definition: (c.definition || '').trim(),
				alt_labels: c.alt_labels || [],
				broader: c.broader || [],
				narrower: c.narrower || [],
				related: c.related || [],
				scope_note: scope,
				crm_mapping: c.crm_mapping || null,
				subfield_slug: data.subfield_slug,
				qualified: `${data.subfield_slug}.${c.slug}`,
				uri_local: `${prefix}:${c.slug}`,
			};
			labelByQualified.set(item.qualified, item.pref_label);
			labelByQualified.set(c.slug, item.pref_label);
			return item;
		});
		subfields.push({
			slug: data.subfield_slug,
			title: data.title || data.subfield_slug,
			description: (data.description || '').trim(),
			concept_count: concepts.length,
			concepts,
		});
	}

	const clonedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
	const payload = {
		schema: 'lexfield-public/v1',
		cloned_at: clonedAt,
		field: {
			slug: fieldMeta.slug,
			title: fieldMeta.title,
			description: (fieldMeta.description || '').trim(),
			namespace_prefix: prefix,
			namespace_uri: fieldMeta.namespace_uri,
		},
		stats: {
			subfields: subfields.length,
			concepts: subfields.reduce((n, s) => n + s.concept_count, 0),
		},
		subfields,
		provenance: LEXICUM_PROVENANCE,
	};

	write(join(dataOut, 'lexicum.json'), `${JSON.stringify(payload, null, 2)}\n`);
	write(
		join(dataOut, 'lexicum.yml'),
		yaml.dump(
			{
				schema: payload.schema,
				cloned_at: payload.cloned_at,
				source_note: 'Hydrated from lexfield YAML (creativity_techniques) on build.',
				field: payload.field,
				stats: payload.stats,
				provenance: payload.provenance,
				subfields: payload.subfields.map((s) => ({
					slug: s.slug,
					title: s.title,
					concept_count: s.concept_count,
				})),
			},
			{ lineWidth: 100 },
		),
	);

	// Curriculum snapshot (cv/data) for parity with digital-creativity-uem
	const cvLex = join(root, 'creativity-techniques-pedagogy/cv/data/lexicum');
	mkdirSync(cvLex, { recursive: true });
	write(join(cvLex, 'creativity_techniques.json'), `${JSON.stringify(payload, null, 2)}\n`);
	write(
		join(cvLex, 'MANIFEST.json'),
		`${JSON.stringify(
			{
				schema: 'lexfield-clone-manifest/v1',
				cloned_at: clonedAt,
				upstream: { tool: 'lexfield', field: 'creativity_techniques', path: fieldlexYamlRoot },
				stats: payload.stats,
				publication: { route: '/lexicum/en/', contract: 'lexfield-public/v1' },
			},
			null,
			2,
		)}\n`,
	);

	function resolveLabel(ref, defaultSub) {
		if (String(ref).includes('.')) return labelByQualified.get(ref) || ref.split('.').pop();
		return (
			labelByQualified.get(`${defaultSub}.${ref}`) ||
			labelByQualified.get(ref) ||
			ref
		);
	}
	function resolveAnchor(ref, defaultSub) {
		let sub = defaultSub;
		let slug = ref;
		if (String(ref).includes('.')) {
			[sub, slug] = ref.split('.');
		}
		return `${sub.replace(/_/g, '-')}--${slug}`;
	}

	const base = join(docs, 'lexicum/en');
	mkdirSync(base, { recursive: true });
	wipeChildrenExceptIndex(base);

	const toc = tocNav(
		subfields.map((s) => ({
			id: s.slug.replace(/_/g, '-'),
			label: s.title,
			count: s.concept_count,
		})),
	);

	const sections = subfields
		.map((scheme) => {
			const schemeAnchor = scheme.slug.replace(/_/g, '-');
			const cards = scheme.concepts
				.map((c) => {
					const alts = (c.alt_labels || []).length
						? `<ul class="field-card__alts" aria-label="Alternative labels">${c.alt_labels
								.map((a) => `<li><span class="field-chip">${a}</span></li>`)
								.join('')}</ul>`
						: '';
					const relBlocks = ['broader', 'narrower', 'related']
						.map((kind) => {
							const refs = c[kind] || [];
							if (!refs.length) return '';
							const links = refs
								.map((ref) => {
									const label = resolveLabel(ref, scheme.slug);
									const href = resolveAnchor(ref, scheme.slug);
									return `<li><span class="field-chip field-chip--rel"><span class="field-chip__kind">${kind}</span> <a href="#${href}">${label}</a></span></li>`;
								})
								.join('');
							return `<ul class="field-card__rels" aria-label="${kind} relations">${links}</ul>`;
						})
						.join('');
					const semanticParts = [];
					if (c.crm_mapping) {
						semanticParts.push(
							`<span class="field-card__crm"><span class="field-card__semantic-key">CIDOC-CRM</span> ${c.crm_mapping}</span>`,
						);
					}
					if (c.scope_note) {
						semanticParts.push(`<span class="field-card__scope">${c.scope_note}</span>`);
					}
					const semantic = semanticParts.length
						? `<p class="field-card__semantic">${semanticParts.join(' · ')}</p>`
						: '';
					return `<article class="field-card field-card--concept" id="${schemeAnchor}--${c.slug}">
<h3 class="field-card__title">${c.pref_label}</h3>
<p class="field-card__summary">${c.definition || ''}</p>
${alts}${relBlocks}${semantic}
</article>`;
				})
				.join('\n');
			const desc = scheme.description
				? `<p class="field-index__scheme-desc">${scheme.description}</p>`
				: '';
			return `<section class="field-index__section" id="${schemeAnchor}">
<h2>${scheme.title}</h2>
<p class="field-index__scheme-meta">${scheme.concept_count} concepts · <code>${scheme.slug}</code></p>
${desc}
<div class="field-card-grid field-card-grid--lexicum">
${cards}
</div>
</section>`;
		})
		.join('\n\n');

	const prov = payload.provenance;
	write(
		join(base, 'index.md'),
		fm({
			layout: 'default',
			title: 'Creativity Techniques Lexicum',
			lang: 'en',
			permalink: '/lexicum/en/',
			description: `Controlled vocabulary — ${payload.stats.concepts} concepts across ${payload.stats.subfields} schemes.`,
			field_index: true,
		}) +
			`<div class="field-index not-prose" data-field-index="lexicum">
<header class="field-index__hero">
<p class="field-index__eyebrow">Controlled vocabulary</p>
<h1 class="field-index__title">Creativity Techniques Lexicum</h1>
<p class="field-index__lede">${payload.field.description}</p>
<ul class="field-index__stats" aria-label="Lexicum statistics">
<li><strong>${payload.stats.concepts}</strong> concepts</li>
<li><strong>${payload.stats.subfields}</strong> schemes</li>
</ul>
${renderFieldIndexCredit(prov, prov.method)}
</header>
${toc}
${sections}
<footer class="field-index__related">
<p>Schema <code>lexfield-public/v1</code> — same Field→Subfield→Concept contract as the fashion prototype tenant. Also see <a href="{{ '/directory/en/' | relative_url }}">Directory</a> · <a href="{{ '/methods/en/' | relative_url }}">Methods</a>.</p>
</footer>
</div>
`,
	);

	return { schemes: payload.stats.subfields, concepts: payload.stats.concepts };
}

const nDir = hydrateDirectory();
const nMethods = hydrateMethods();
const lex = hydrateLexicum();
console.log(
	`hydrate-field-site: directory=${nDir}; practice-methods=${nMethods}; lexicum schemes=${lex.schemes} concepts=${lex.concepts} (single-route + #hashes)`,
);
console.log(`wrote under ${relative(root, docs)}`);
