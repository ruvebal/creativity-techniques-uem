/**
 * Deck pre-renderer rules (PHASE-EX5). Pure functions, no I/O.
 *
 * - captionHtml: the one public caption (title · author · licence link · source link),
 *   built on media-rules caption() (Amendment A6/F4)
 * - geometricCaptionHtml / diagramCaptionHtml: course SVG captions with the content hash
 * - layoutFor: slide layout by `layout` field, else by role
 * - renderSlide / renderDeck: one <section> per slide, readable without JavaScript
 * - parseHashedSvgName: `ct-pass-01-structure-<hash8>.svg` → parts
 *
 * Tests: scripts/tests/deck-render.test.mjs (node --test).
 * I/O wrapper: scripts/render-decks.mjs.
 */
import { caption, LAYOUTS, STRUCTURAL_ROLES } from './media-rules.mjs';

export { LAYOUTS };
export const DEFAULT_TIMER_SECONDS = 180;

const DEFAULT_LAYOUT_BY_ROLE = Object.freeze({
  unit_cover: 'image_argument',
  analysis_model: 'image_argument',
  masterclass: 'image_argument',
  lab_exercise: 'exercise',
  workshop_work: 'exercise',
  analysis_opener: 'split',
  lab_opener: 'split',
  workshop_opener: 'split',
  outro: 'split',
});

const EXERCISE_ROLES = Object.freeze(['lab_exercise', 'workshop_work']);

/**
 * HTML-escape text and attribute values. Braces are escaped too, so the
 * output can be a Jekyll include without Liquid reading `{{` or `{%`.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

export const PUBLIC_DOMAIN = 'Public domain';
/** Caption label of a flagged asset whose licence claims the public domain (A12/F8). */
export const RIGHTS_UNDER_REVIEW = 'Rights under review';

/** Public licence label: "PD-old-70" → "Public domain", "CC-BY-SA-4.0" → "CC BY-SA 4.0". */
export function licenceLabel(licence) {
  const value = String(licence || '').trim();
  if (!value) return '';
  if (/^(PD-|PDM$|NoC-)/i.test(value)) return PUBLIC_DOMAIN;
  if (/^CC0$/i.test(value)) return 'CC0 1.0';
  const cc = value.match(/^CC-([A-Z-]+?)-(\d(?:\.\d)?)$/i);
  if (cc) return `CC ${cc[1].toUpperCase()} ${cc[2]}`;
  return value.replace(/_/g, ' ');
}

/**
 * Site-internal URL with the base path: a root-relative value ("/lessons/…")
 * gets `base` in front (once). Absolute (http:, https:, mailto:, //), fragment
 * (#…), empty and already-prefixed values pass through unchanged.
 */
export function withBase(href, base) {
  const value = String(href ?? '');
  const b = String(base || '').replace(/\/$/, '');
  if (!value || !value.startsWith('/') || value.startsWith('//')) return value;
  if (b && (value === b || value.startsWith(`${b}/`) || value.startsWith(`${b}#`) || value.startsWith(`${b}?`))) return value;
  return `${b}${value}`;
}

const isHttp = (url) => /^https?:\/\/\S+$/i.test(String(url || ''));
const link = (href, text) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>`;

/**
 * The public caption of a curated image, as HTML:
 *   title · author · licence (linked to licence_url) · source (linked).
 * Fields come from media-rules caption(); an empty field is left out.
 */
export function captionHtml(asset) {
  const c = caption(asset);
  const parts = [];
  if (c.title) parts.push(`<span class="slide-caption__title">${escapeHtml(c.title)}</span>`);
  if (c.author) parts.push(`<span class="slide-caption__author">${escapeHtml(c.author)}</span>`);
  const label = licenceLabel(c.licence);
  if (label && c.rights_status === 'flagged' && label === PUBLIC_DOMAIN) {
    // A12/F8: a flagged public-domain claim (e.g. an author who died less than 70 years
    // ago) is shown as under review, never as "Public domain", and not linked to the PD mark.
    parts.push(`<span class="slide-caption__rights">${escapeHtml(RIGHTS_UNDER_REVIEW)}</span>`);
  } else if (label) parts.push(isHttp(c.licence_url) ? link(c.licence_url, label) : `<span>${escapeHtml(label)}</span>`);
  if (isHttp(c.source_url)) parts.push(link(c.source_url, 'Source'));
  if (c.cropped) parts.push('<span>cropped</span>');
  return parts.join(' · ');
}

/**
 * `ct-pass-01-structure-980beb83.svg` → { stem: 'ct-pass-01-structure', name: 'structure', hash: '980beb83' }.
 * Returns null when the name carries no 8-hex content hash.
 */
export function parseHashedSvgName(fileName) {
  const match = String(fileName || '').match(/^(ct-pass-\d+-([a-z0-9-]+?))-([0-9a-f]{8})\.svg$/);
  return match ? { stem: match[1], name: match[2].replace(/-/g, ' '), hash: match[3] } : null;
}

/** Caption of a geometric course background: always shows the SVG content hash. */
export function geometricCaptionHtml(fileName) {
  const parsed = parseHashedSvgName(fileName);
  if (!parsed) throw new Error(`geometric SVG without a content hash: ${fileName}`);
  return `<span class="slide-caption__title">Course geometric background · ${escapeHtml(parsed.name)}</span>`
    + ` · <span class="slide-caption__hash">#${escapeHtml(parsed.hash)}</span>`
    + ' · <span>Original course SVG</span>';
}

/** Caption of the Koch-triangle diagram fallback, with its content hash. */
export function diagramCaptionHtml(fileName) {
  const hash = (String(fileName || '').match(/-([0-9a-f]{8,})\.svg$/) || [])[1];
  return '<span class="slide-caption__title">Course diagram · Koch triangle</span>'
    + `${hash ? ` · <span class="slide-caption__hash">#${escapeHtml(hash)}</span>` : ''}`
    + ' · <span>Original course SVG</span>';
}

/** Layout for a slide: the `layout` field if valid, else the role default. */
export function layoutFor(slide) {
  const s = slide || {};
  if (LAYOUTS.includes(s.layout)) return s.layout;
  return DEFAULT_LAYOUT_BY_ROLE[s.slide_role] || 'image_argument';
}

/** Timer seconds for exercise slides (`timer_seconds` overrides 180), else null. */
export function timerFor(slide) {
  const s = slide || {};
  if (!EXERCISE_ROLES.includes(s.slide_role) && s.layout !== 'exercise') return null;
  const n = Number(s.timer_seconds);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_TIMER_SECONDS;
}

/** Notes text → paragraphs / list HTML. Lines starting with "- " become list items. */
export function notesHtml(notes) {
  const text = Array.isArray(notes) ? notes.join('\n') : String(notes || '');
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return '';
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) out.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
    list = [];
  };
  for (const line of lines) {
    if (line.startsWith('- ')) list.push(line.slice(2));
    else { flush(); out.push(`<p>${escapeHtml(line)}</p>`); }
  }
  flush();
  return out.join('');
}

const isStructural = (slide) => slide.background_kind === 'geometrical' || STRUCTURAL_ROLES.includes(slide.slide_role);

/**
 * Background of one slide.
 * ctx = { base, geometric: [file names in cycle order], koch: file name }
 * state = { geometricIndex } (mutated: structural slides walk the cycle)
 * Returns { url, captionHtml, alt } (alt only for curated images).
 */
export function backgroundFor(slide, assetsBySlot, ctx, state) {
  const base = String(ctx.base || '');
  if (isStructural(slide)) {
    const wanted = String(slide.background_url || '').split('/').pop();
    const stem = parseHashedSvgName(wanted)?.stem || wanted.replace(/\.svg$/, '');
    let file = ctx.geometric.find((f) => f === wanted || parseHashedSvgName(f)?.stem === stem);
    if (!wanted || !file) {
      file = ctx.geometric[state.geometricIndex % ctx.geometric.length];
    }
    state.geometricIndex += 1;
    return { url: `${base}/assets/images/fractal-pass-track/${file}`, captionHtml: geometricCaptionHtml(file), alt: '' };
  }
  const asset = slide.background_kind === 'curated' && slide.media_slot_id ? assetsBySlot.get(slide.media_slot_id) : null;
  if (asset?.asset_url) {
    const c = caption(asset);
    return { url: withBase(asset.asset_url, base), captionHtml: captionHtml(asset), alt: String(asset.alt_text || c.title || '').trim() };
  }
  if (slide.background_kind === 'none') return { url: '', captionHtml: '', alt: '' };
  return { url: `${base}/assets/images/fractal-triangles/${ctx.koch}`, captionHtml: diagramCaptionHtml(ctx.koch), alt: '' };
}

/** One <section> for one slide. */
export function renderSlide(slide, deck, background, ctx = {}) {
  const layout = layoutFor(slide);
  const timer = timerFor(slide);
  const attrs = [
    ['data-slide-id', slide.slide_id],
    ['data-slide-role', slide.slide_role],
    ['data-layout', layout],
    ['data-background-kind', slide.background_kind],
    ['data-background-color', '#0b1220'],
    ...(background.url ? [
      ['data-background-image', background.url],
      ['data-background-size', 'cover'],
      ['data-background-position', 'center'],
    ] : []),
    ...(slide.portfolio_bound ? [['data-portfolio-bound', 'true']] : []),
    ...(timer ? [['data-timer', String(timer)]] : []),
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  const open = `<section ${attrs.map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')}>`;
  const body = [
    `<p class="student-media-slide__unit">${escapeHtml(deck.unit_label)}</p>`,
    `<h1>${escapeHtml(slide.heading)}</h1>`,
    slide.sentence ? `<p class="student-media-slide__sentence">${escapeHtml(slide.sentence)}</p>` : '',
    slide.quote ? `<blockquote class="student-media-slide__quote"><p>${escapeHtml(slide.quote)}</p></blockquote>` : '',
    slide.citation?.label
      ? `<p class="student-media-slide__citation">${slide.citation.href ? `<a href="${escapeHtml(withBase(slide.citation.href, ctx.base))}">${escapeHtml(slide.citation.label)}</a>` : escapeHtml(slide.citation.label)}</p>`
      : '',
    slide.prompt ? `<p class="student-media-slide__prompt">${escapeHtml(slide.prompt)}</p>` : '',
    slide.portfolio_trace ? `<p class="student-media-slide__prompt student-media-slide__trace">${escapeHtml(slide.portfolio_trace)}</p>` : '',
  ].filter(Boolean);
  const notes = notesHtml(slide.notes);
  return [
    open,
    `  <div class="student-media-slide student-media-slide--${layout}">`,
    ...body.map((line) => `    ${line}`),
    '  </div>',
    background.alt ? `  <p class="sr-only">Image: ${escapeHtml(background.alt)}</p>` : '',
    background.captionHtml ? `  <p class="slide-caption">${background.captionHtml}</p>` : '',
    notes ? `  <aside class="notes">${notes}</aside>` : '',
    '</section>',
  ].filter(Boolean).join('\n');
}

/**
 * Whole deck → HTML fragment (one <section> per slide, nothing else emits <section).
 * ctx = { base, geometric: [...], koch, source }
 */
export function renderDeck(content, ctx) {
  const slides = Array.isArray(content?.slides) ? content.slides : [];
  const assetsBySlot = new Map((content?.assets || []).map((a) => [a.media_slot_id, a]));
  const state = { geometricIndex: 0 };
  const sections = slides.map((slide) => renderSlide(slide, content, backgroundFor(slide, assetsBySlot, ctx, state), ctx));
  const header = '<!-- Pre-rendered from this deck\'s data/content.json (npm run render:decks). Do not edit by hand. -->';
  return `${header}\n${sections.join('\n')}\n`;
}

/**
 * Lesson figures (PHASE-EX9): every curated slide image of a deck, keyed by slide_id,
 * with the same caption HTML as the deck (captionHtml) so lessons reuse the deck asset
 * and its caption fields through docs/_includes/lesson-figure.html.
 * `src` is the root-relative asset path without the site base (lessons add it with relative_url).
 */
export function lessonFigures(content, { base = '' } = {}) {
  const b = String(base || '').replace(/\/$/, '');
  const assetsBySlot = new Map((content?.assets || []).map((a) => [a.media_slot_id, a]));
  const out = {};
  for (const slide of content?.slides || []) {
    const asset = slide.background_kind === 'curated' && slide.media_slot_id ? assetsBySlot.get(slide.media_slot_id) : null;
    if (!asset?.asset_url) continue;
    const url = String(asset.asset_url);
    out[slide.slide_id] = {
      src: b && url.startsWith(`${b}/`) ? url.slice(b.length) : url,
      alt: String(asset.alt_text || caption(asset).title || '').trim(),
      caption_html: captionHtml(asset),
      rights_status: String(asset.rights_status || ''),
    };
  }
  return out;
}
