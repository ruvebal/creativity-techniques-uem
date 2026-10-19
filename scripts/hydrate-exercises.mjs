#!/usr/bin/env node
/**
 * Hydrate public exercises from exercises/*.yml → docs/exercises/en/ + _data/exercises.yml.
 * Emits field-index HTML (same visual grammar as Methods / Directory).
 * `ahmes` keys stay in Liquid comments only.
 *
 * Kramdown rule: never put blank lines or raw newlines inside HTML element text,
 * or closing tags get escaped and the layout nests forever.
 */

import {
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
	existsSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'exercises');
const outRoot = join(root, 'docs', 'exercises', 'en');
const dataOut = join(root, 'docs', '_data', 'exercises.yml');
const refsPath = join(root, 'docs', '_data', 'references.yml');
const graphicsPath = join(root, 'docs', '_data', 'exercise-graphics.yml');

function esc(s) {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Collapse YAML multiline / trailing newlines so kramdown cannot split HTML. */
function oneLine(s) {
	return String(s ?? '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Chicago entry from references.yml → safe HTML (*Title* → <em>). */
function chicagoHtml(chicago) {
	const raw = oneLine(chicago || '');
	if (!raw) return '';
	const parts = raw.split(/(\*[^*]+\*)/g);
	return parts
		.map((part) => {
			if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
				return `<em>${esc(part.slice(1, -1))}</em>`;
			}
			return esc(part);
		})
		.join('');
}

function loadReferences() {
	if (!existsSync(refsPath)) return {};
	return yaml.load(readFileSync(refsPath, 'utf8')) || {};
}

/** Short source-book line for index cards / Source section. */
function sourceBookHtml(ex, refs) {
	const key = ex.quote?.ref_key || '';
	const entry = key ? refs[key] : null;
	if (entry?.chicago) {
		const cite = chicagoHtml(entry.chicago);
		return `<p class="field-card__meta exercise-source-book"><span class="exercise-source-label">Source book</span> <a href="#ref-${esc(key)}">${cite}</a></p>`;
	}
	const chicago = oneLine(ex.quote?.chicago || '');
	if (chicago && /course adaptation/i.test(chicago)) {
		return `<p class="field-card__meta exercise-source-book"><span class="exercise-source-label">Source book</span> Classroom adaptation (no single source book)</p>`;
	}
	if (chicago) {
		return `<p class="field-card__meta exercise-source-book"><span class="exercise-source-label">Source</span> ${esc(chicago)}</p>`;
	}
	return '';
}

function labelCat(c) {
	const s = String(c || '');
	if (s.startsWith('family:')) return s.slice(7);
	if (s.startsWith('urn:in-practice:concept:')) {
		return s.slice('urn:in-practice:concept:'.length).replace(/-/g, ' ');
	}
	return s;
}

function loadExercises() {
	if (!existsSync(srcDir)) return [];
	return readdirSync(srcDir)
		.filter((f) => f.endsWith('.yml') && f !== 'index.yml')
		.map((f) => yaml.load(readFileSync(join(srcDir, f), 'utf8')))
		.filter((ex) => ex && ex.id)
		.sort((a, b) => String(a.title).localeCompare(String(b.title)));
}

function publicRecord(ex, graphics) {
	const { ahmes: _a, urn: _u, graphic: _g, ...rest } = ex;
	return { ...rest, graphic: graphics[ex.id] };
}

function ahmesComment(ex) {
	if (!ex.ahmes) return '';
	const lines = [
		'AHMES (authoring only — not published)',
		`document_coat: ${ex.ahmes.document_coat}`,
		`vault_slug: ${ex.ahmes.vault_slug}`,
		`urn: ${ex.urn || ''}`,
		`technique_id: ${ex.technique_id || ''}`,
	];
	for (const n of ex.ahmes.nodes || []) {
		lines.push(
			`node ${n.node_id} · page_index=${n.page_index} · ${n.chicago} · role=${n.role}`,
		);
	}
	return `{% comment %}\n${lines.join('\n')}\n{% endcomment %}\n`;
}

/** Public chips: units + technique only (no URN noise). */
function chips(ex) {
	const bits = [];
	if (ex.technique_id) {
		bits.push(
			`<span class="field-chip"><span class="field-chip__kind">technique</span> ${esc(ex.technique_id)}</span>`,
		);
	}
	for (const u of ex.units || []) {
		bits.push(
			`<span class="field-chip"><span class="field-chip__kind">unit</span> ${esc(u)}</span>`,
		);
	}
	return bits.length
		? `<ul class="field-card__alts" aria-label="Tags">${bits.map((b) => `<li>${b}</li>`).join('')}</ul>`
		: '';
}

function listHtml(items, className = '') {
	if (!items?.length) return '';
	const cls = className ? ` class="${className}"` : '';
	return `<ul${cls}>${items.map((i) => `<li>${esc(oneLine(i))}</li>`).join('')}</ul>`;
}

function stepsOl(steps) {
	if (!steps?.length) return '';
	return `<ol class="field-card__steps">${steps.map((s) => `<li>${esc(oneLine(s))}</li>`).join('')}</ol>`;
}

function graphicFigure(graphic, { preview = false } = {}) {
	if (!graphic) return '';
	if (preview) {
		return `<picture class="exercise-graphic-preview"><source srcset="{{ '${esc(graphic.svg)}' | relative_url }}" type="image/svg+xml"><img src="{{ '${esc(graphic.png)}' | relative_url }}" alt="" loading="lazy" aria-hidden="true"></picture>`;
	}
	return `<figure class="exercise-graphic" aria-describedby="exercise-graphic-caption"><picture><source srcset="{{ '${esc(graphic.svg)}' | relative_url }}" type="image/svg+xml"><img src="{{ '${esc(graphic.png)}' | relative_url }}" alt="${esc(graphic.alt)}" width="1200" height="620" fetchpriority="high"></picture><figcaption id="exercise-graphic-caption">${esc(oneLine(graphic.caption))}</figcaption></figure>`;
}

function renderExercisePage(ex, refs, graphics) {
	const units = (ex.units || []).join(', ');
	const quote = oneLine(ex.quote?.verbatim || '');
	const chicago = esc(oneLine(ex.quote?.chicago || ''));
	const refKey = ex.quote?.ref_key || '';
	const adaptation = oneLine(ex.adaptation || '');
	const portfolio = oneLine(ex.portfolio_trace || '');
	const judged = oneLine(ex.judged_by || '');
	const access = oneLine(ex.accessibility || '');
	const book = sourceBookHtml(ex, refs);

	// No blank lines inside the field-index div (kramdown HTML safety).
	return `---
layout: default
title: ${JSON.stringify(ex.title)}
lang: en
permalink: /exercises/en/${ex.id}/
description: ${JSON.stringify(oneLine(ex.summary || ''))}
exercise_id: ${ex.id}
technique_id: ${ex.technique_id || ''}
status: ${ex.status || 'pilot'}
field_index: true
references: [${refKey}]
---
${ahmesComment(ex)}
<div class="field-index not-prose" data-field-index="exercise">
<header class="field-index__hero">
<p class="field-index__eyebrow"><a href="{{ '/exercises/en/' | relative_url }}">Exercises</a>${units ? ` · ${esc(units)}` : ''}</p>
<h1 class="field-index__title">${esc(ex.title)}</h1>
<p class="field-index__lede">${esc(oneLine(ex.summary || ''))}</p>
<ul class="field-index__stats" aria-label="Exercise facts">
<li><strong>~${esc(ex.time_min)}</strong> min</li>
<li><strong>${esc(oneLine(ex.group))}</strong></li>
</ul>
${chips(ex)}
${book}
</header>
${graphicFigure(graphics[ex.id])}
<nav class="field-index__toc" aria-label="On this page">
<p class="field-index__toc-label">On this page</p>
<ul>
<li><a href="#requirements">Requirements</a></li>
<li><a href="#steps">Steps</a></li>
<li><a href="#source">Source</a></li>
<li><a href="#portfolio">Portfolio</a></li>
</ul>
</nav>
<section class="field-index__section" id="requirements">
<article class="field-card field-card--exercise">
<h2 class="field-card__title">Requirements</h2>
<div class="exercise-facts" role="list">
<div class="exercise-fact" role="listitem"><span class="exercise-fact__label">Time</span> <span class="exercise-fact__value">~${esc(ex.time_min)} minutes</span></div>
<div class="exercise-fact" role="listitem"><span class="exercise-fact__label">Group</span> <span class="exercise-fact__value">${esc(oneLine(ex.group))}</span></div>
<div class="exercise-fact" role="listitem"><span class="exercise-fact__label">Access</span> <span class="exercise-fact__value">${esc(access)}</span></div>
</div>
<div class="exercise-req-grid">
<div class="exercise-req-panel">
<h3 class="exercise-h3">Materials</h3>
${listHtml(ex.materials, 'exercise-list')}
</div>
<div class="exercise-req-panel">
<h3 class="exercise-h3">Before you start</h3>
${listHtml(ex.requirements, 'exercise-list')}
</div>
</div>
</article>
</section>
<section class="field-index__section" id="steps">
<article class="field-card field-card--exercise">
<h2 class="field-card__title">Steps</h2>
<p class="field-card__meta">Follow in order — your professor may shorten the clock.</p>
${stepsOl(ex.steps)}
</article>
</section>
<section class="field-index__section" id="source">
<article class="field-card field-card--exercise field-card--quote">
<h2 class="field-card__title">Source</h2>
<blockquote class="exercise-quote"><p>${esc(quote)}</p><footer>— ${chicago}</footer></blockquote>
${adaptation ? `<p class="exercise-note"><em>Classroom note.</em> ${esc(adaptation)}</p>` : ''}
</article>
</section>
<section class="field-index__section" id="portfolio">
<article class="field-card field-card--exercise">
<h2 class="field-card__title">Portfolio</h2>
<p class="exercise-portfolio">${esc(portfolio)}</p>
${judged ? `<p class="field-card__meta">Judged by: ${esc(judged)}</p>` : ''}
</article>
</section>
<footer class="field-index__related">
<p><a href="{{ '/exercises/en/' | relative_url }}">All exercises</a> · <a href="{{ '/lessons/en/creativity-techniques/' | relative_url }}">Lessons</a> · <a href="{{ '/methods/en/' | relative_url }}">Methods</a></p>
</footer>
</div>
<h2 id="references">References</h2>
{% include references.html %}
`;
}

function renderIndex(exercises, refs, graphics) {
	const refKeys = [
		...new Set(
			exercises.map((ex) => ex.quote?.ref_key).filter((k) => k && refs[k]),
		),
	].sort();

	const cards = exercises
		.map((ex) => {
			const units = (ex.units || []).join(', ') || '—';
			const unitTokens = (ex.units || []).map((u) => String(u).toLowerCase()).join(' ');
			const family = (ex.categories || [])
				.find((c) => String(c).startsWith('family:'));
			const familyToken = family ? labelCat(family) : '';
			const book = sourceBookHtml(ex, refs);
			const searchText = [ex.title, ex.summary, ex.group, ex.technique_id, units, familyToken]
				.map(oneLine).join(' ');
			return `<article class="field-card field-card--exercise exercise-result"
data-exercise-card data-units="${esc(unitTokens)}" data-family="${esc(familyToken)}" data-minutes="${esc(ex.time_min)}"
data-search="${esc(searchText.toLowerCase())}">
<p class="field-card__badges"><span class="field-card__status">${esc(ex.status || 'pilot')}</span></p>
<h2 class="field-card__title"><a href="{{ '/exercises/en/${ex.id}/' | relative_url }}">${esc(ex.title)}</a></h2>
<p class="field-card__summary">${esc(oneLine(ex.summary || ''))}</p>
<p class="field-card__meta"><strong>~${esc(ex.time_min)} min</strong> · ${esc(oneLine(ex.group))} · ${esc(units)}</p>
${book}
${graphicFigure(graphics[ex.id], { preview: true })}
${chips(ex)}
</article>`;
		})
		.join('\n');

	const refsFm = refKeys.join(', ');

	return `---
layout: default
title: "Exercises — Creativity Techniques"
lang: en
permalink: /exercises/en/
description: "Class-ready creativity exercise datasheets for Creativity Techniques (UEM Creative Campus)."
field_index: true
references: [${refsFm}]
---
<div class="field-index not-prose" data-field-index="exercises">
<header class="field-index__hero">
<p class="field-index__eyebrow">Studio practice</p>
<h1 class="field-index__title">Exercises</h1>
<p class="field-index__lede">Atomic, teachable datasheets. Lessons and decks <strong>link</strong> here — they do not paste the steps.</p>
<ul class="field-index__stats" aria-label="Catalogue size">
<li><strong>${exercises.length}</strong> exercises</li>
<li>Choose by unit, method, or class time</li>
</ul>
</header>
<form class="exercise-filters" data-exercise-filters role="search" aria-label="Find a classroom exercise">
<label for="exercise-search">Search exercises<input id="exercise-search" type="search" name="q" placeholder="Try “prototype” or “observation”" autocomplete="off"></label>
<label for="exercise-unit">Unit<select id="exercise-unit" name="unit"><option value="">All units</option><option>U1</option><option>U2</option><option>U3</option><option>U4</option><option>U5</option><option>U6</option></select></label>
<label for="exercise-family">Method<select id="exercise-family" name="family"><option value="">All methods</option><option value="generation">Generation</option><option value="selection">Selection</option><option value="framing">Framing</option><option value="development">Development</option><option value="reflection">Reflection</option></select></label>
<label for="exercise-time">Class time<select id="exercise-time" name="minutes"><option value="">Any length</option><option value="15">15 minutes or less</option><option value="20">20 minutes or less</option><option value="30">30 minutes or less</option></select></label>
<button type="reset">Clear filters</button>
</form>
<p class="exercise-results-count" data-exercise-count aria-live="polite">Showing ${exercises.length} exercises</p>
<section class="exercise-catalogue-grid" data-exercise-results aria-label="Classroom exercises">
${cards}
</section>
<p class="exercise-no-results" data-exercise-empty hidden>No exercises match those filters. Try another unit or method.</p>
<footer class="field-index__related">
<p>Also see <a href="{{ '/lessons/en/creativity-techniques/' | relative_url }}">Lessons</a> · <a href="{{ '/methods/en/' | relative_url }}">Methods</a> · <a href="{{ '/lexicum/en/' | relative_url }}">Lexicum</a> · <a href="{{ '/directory/en/' | relative_url }}">Directory</a>.</p>
</footer>
</div>
<h2 id="references">References</h2>
{% include references.html %}
<script defer src="{{ '/assets/js/exercise-filters.js' | relative_url }}"></script>
`;
}

function main() {
	const exercises = loadExercises();
	const refs = loadReferences();
	const graphicData = existsSync(graphicsPath)
		? yaml.load(readFileSync(graphicsPath, 'utf8')) || {}
		: {};
	const graphics = graphicData.exercises || {};
	for (const ex of exercises) {
		if (!graphics[ex.id]) throw new Error(`Missing generated semantic graphic: ${ex.id}`);
	}
	if (existsSync(outRoot)) {
		for (const entry of readdirSync(outRoot)) {
			rmSync(join(outRoot, entry), { recursive: true, force: true });
		}
	}
	mkdirSync(outRoot, { recursive: true });

	for (const ex of exercises) {
		const dir = join(outRoot, ex.id);
		mkdirSync(dir, { recursive: true });
		// .html = Liquid only (no kramdown) — keeps field-index markup intact
		writeFileSync(join(dir, 'index.html'), renderExercisePage(ex, refs, graphics), 'utf8');
	}
	writeFileSync(join(outRoot, 'index.html'), renderIndex(exercises, refs, graphics), 'utf8');
	writeFileSync(
		dataOut,
		yaml.dump(
			{
				generated: new Date().toISOString().slice(0, 10),
				exercises: exercises.map((ex) => publicRecord(ex, graphics)),
			},
			{ lineWidth: 100, noRefs: true },
		),
		'utf8',
	);
	console.log(`hydrate-exercises: ${exercises.length} exercise(s) → docs/exercises/en/`);
}

main();
