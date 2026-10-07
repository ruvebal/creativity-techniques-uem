#!/usr/bin/env node
/**
 * One-off PHASE-EX3 migration (deliverable 6) of U1–U3 and the master-lecture
 * deck to deck schema_version 2. Kept for audit; re-running it is a no-op once
 * the decks are v2 (it refuses to touch a v2 deck).
 *
 * - slide_id on every slide (stableSlideIds)
 * - background_kind: curated | diagram | geometrical | none ("profield" removed)
 * - only bindings whose image plainly matches its slide are kept (KEEP below,
 *   checked against the committed slide → slot → asset chain); every other
 *   media slide becomes diagram; image_brief is a one-sentence TODO for EX4
 * - kept assets get a rendition in docs/assets/images/deck-media/ made from the
 *   file already in the old cache (no network); scripts/rehydrate-student-media.mjs
 *   then writes the public asset objects and removes orphan cache files
 * - U4 (legacy) is never opened for writing
 *
 * Run from the repo root: node creativity-techniques-pedagogy/excellence/evidence/EX3-migrate-decks.mjs
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { STRUCTURAL_ROLES, stableSlideIds } from '../../../scripts/lib/media-rules.mjs';
import { toRendition } from '../../../scripts/lib/rendition.mjs';

const root = process.cwd();
const deckMedia = join(root, 'docs/assets/images/deck-media');
const oldCache = join(root, 'docs/assets/images/profield-cache');
const FRONT_MATTER = '---\nlayout: null\n---\n';

const DECKS = {
  'docs/tracks/en/uem/2627-ct/u-1-introduction-creativity/data/content.json': 'U1',
  'docs/tracks/en/uem/2627-ct/u-2-idea-generation-selection/data/content.json': 'U2',
  'docs/tracks/en/uem/2627-ct/u-3-development-solutions/data/content.json': 'U3',
  'docs/tracks/en/uem/2627-ml/creative-process-analysis/data/content.json': 'ML-CPA',
};

/** unit → slide_id → asset_id kept (must equal the committed binding). */
const KEEP = {
  U2: { 'masterclass-1': 'wikimedia:File:Sprite Fright-concept art-Victoria 01.png' },
  'ML-CPA': { cover: 'wikimedia:File:Iterative Process Diagram.svg' },
};

const BRIEFS = {
  U1: {
    cover: 'Show a designer or artist laying out many options before choosing one, so the cover states that creativity is paced work, not a talent myth.',
    'analysis-model': 'Show one finished design piece whose language, medium and support can be named at a glance, to model the three-part analysis.',
    'masterclass-1': 'Show a page or wall of many sketched options with a few marked as chosen, to picture opening and then closing within one creative act.',
    'masterclass-2': 'Show a historical creativity test sheet (for example an alternate-uses task), to ground fluency, flexibility, originality and elaboration in a real instrument.',
    'masterclass-3': 'Show a test score or scoring form set against a real studio artefact, to say that a test result does not prove skill in another field.',
    'masterclass-4': 'Show a written design brief with its unclear part marked, to picture naming the problem before choosing a tool.',
    'masterclass-5': 'Show a method card or hand tool in use beside the work it serves, to picture a technique as a tool that supports judgement.',
    'masterclass-6': 'Show a design-thinking process diagram or sticky-note wall, to give students the object of the debate about buzzwords and craft.',
    'lab-1': 'Show Marcel Duchamp or one of his readymades (for example the 1917 photograph of Fountain), so the slide names the artist the exercise researches.',
    'lab-2': 'Show a Dada poster, magazine or event photograph from 1916–1923, so the slide pictures the movement the exercise researches.',
  },
  U2: {
    cover: 'Show a sheet of many idea sketches with most crossed out and one circled, to picture opening many doors and then closing most of them on purpose.',
    'analysis-model': 'Show one design piece next to its discarded alternatives, so students can ask how many options were closed to reach it.',
    'masterclass-1': 'Show one character or object drawn in many variants on a single sheet, so generating options before selecting one is visible.',
    'masterclass-2': 'Show many ideas that differ in kind rather than many versions of one idea, to contrast flexibility with plain fluency.',
    'masterclass-3': 'Show a long list or wall of ideas whose later entries grow stranger, to picture pushing past the first, obvious answers.',
    'masterclass-4': 'Show de Bono\'s six thinking hats, a deck of prompt cards such as Oblique Strategies, or people in assigned roles, to picture a tool that stages one kind of thinking.',
    'masterclass-5': 'Show a selection matrix or scored shortlist with named criteria such as novelty and fit to the brief, to picture deliberate convergent choice.',
    'masterclass-6': 'Show a historical workshop or class exercise in progress, to present training as practice rather than a source of genius.',
    'lab-1': 'Show a calm, low-detail scene of a person in focused stillness, to set the mood for the guided concentration exercise.',
    'lab-2': 'Show a page of surrealist automatic writing or a hand writing without pause, to picture writing that is not corrected or censored.',
  },
  U3: {
    cover: 'Show a rough early prototype beside a later version of the same object, to picture making the idea visible, learning from the change and deciding what to keep.',
    'analysis-model': 'Show successive versions of one design side by side, so students can ask what each next version was trying to learn.',
    'masterclass-1': 'Show a rough cardboard or paper prototype, to picture a prototype as a question in material form.',
    'masterclass-2': 'Show a spread of unjudged variations pinned up together before any choice, to picture a protected space before deciding.',
    'masterclass-3': 'Show a prototype being tested with its result written down, to picture iteration that stops when the test is answered.',
    'masterclass-4': 'Show a sketchbook page with several quick alternative arrangements of one layout, to picture sketching as a way of thinking.',
    'masterclass-5': 'Show one brief reframed as two or three questions, each with a small response (for example a morphological box), to picture opening the solution space.',
    'masterclass-6': 'Show a design journal or process log noting what changed and what stayed, to picture reflection at a checkpoint.',
    'lab-1': 'Show three rough sketches of the same problem started from different points, to picture how the entry point steers the path.',
    'lab-2': 'Show a revised prototype next to a written test question and its answer, to picture one revision that stops when the test is answered.',
  },
  'ML-CPA': {
    cover: 'Show a diagram of a creative or design process as a cycle of stages, so the cover announces that the lecture analyses process, not only results.',
    'analysis-model': 'Show a step-by-step analysis card or annotated process sheet, to picture the eight-step guide as a working tool.',
    'masterclass-1': 'Show a documented sequence of working stages in order, to picture describing what happened before judging the result.',
    'masterclass-2': 'Show one work whose code, channel and physical support are clearly distinct, to picture the three questions of language, medium and support.',
    'masterclass-3': 'Show many options with a few selected, to picture a process that invents many options and then selects what fits the brief.',
    'masterclass-4': 'Show a branching diagram of many paths that narrows under constraints, to picture divergence as one part of the job, not all of it.',
    'masterclass-5': 'Show a work in progress whose material visibly shapes the idea (for example a maquette on a studio bench), to picture process as material.',
    'masterclass-6': 'Show a toy creativity-test task set against a real design brief, to picture that a fluency score does not prove judgement.',
    'lab-1': 'Show an eight-step analysis card filled in along a modelled process trail, to picture the shared exercise.',
    'lab-2': 'Show a student\'s own Lab sequence laid out in order (sketches, notes, versions), to picture applying the card to one\'s own trail.',
  },
};

const DESCRIPTION = 'Each image is bound to one named slide by asset_id; slides without a cleared image use the course diagram.';
const cacheKey = (assetId) => createHash('sha256').update(String(assetId)).digest('hex').slice(0, 16);
const parse = (path) => JSON.parse(readFileSync(join(root, path), 'utf8').replace(/^---[\s\S]*?---\s*/, ''));

mkdirSync(deckMedia, { recursive: true });
const table = [];

for (const [path, unit] of Object.entries(DECKS)) {
  const content = parse(path);
  if (content.schema_version === 2) {
    console.log(`already v2, skipped: ${path}`);
    continue;
  }
  const ids = stableSlideIds(content.slides);
  // The renderer keys assets by slot in a Map, so with two assets in one slot
  // (master lecture: ML-CPA.cover) the LAST one is what students saw.
  const assetsBySlot = new Map();
  for (const asset of content.assets || []) assetsBySlot.set(asset.media_slot_id, [...(assetsBySlot.get(asset.media_slot_id) || []), asset]);
  const shown = (slot) => (assetsBySlot.get(slot) || []).at(-1);
  const describe = (slot) => {
    const list = assetsBySlot.get(slot) || [];
    if (!list.length) return '(none)';
    const last = list.at(-1).title;
    return list.length === 1 ? last : `${last} (rendered; also in slot: ${list.slice(0, -1).map((a) => a.title).join(', ')})`;
  };
  const keep = KEEP[unit] || {};

  const slides = content.slides.map((slide, index) => {
    const slideId = ids[index];
    const before = slide.media_slot_id ? shown(slide.media_slot_id) : null;
    const inSlot = slide.media_slot_id ? assetsBySlot.get(slide.media_slot_id) || [] : [];
    const { media_slot_id: _slot, ...rest } = slide;
    const next = { slide_id: slideId, ...rest };
    if (STRUCTURAL_ROLES.includes(slide.slide_role) || slide.background_kind === 'geometrical') {
      next.background_kind = 'geometrical';
      table.push({ unit, slideId, heading: slide.heading, before: '(geometrical)', after: 'geometrical' });
      return next;
    }
    const brief = BRIEFS[unit]?.[slideId];
    if (!brief) throw new Error(`no brief for ${unit}/${slideId}`);
    next.image_brief = `TODO: ${brief}`;
    if (keep[slideId]) {
      const kept = inSlot.find((a) => a.asset_id === keep[slideId]);
      if (!kept) throw new Error(`${unit}/${slideId}: ${keep[slideId]} is not in the committed slot ${slide.media_slot_id}`);
      next.background_kind = 'curated';
      next.asset_id = keep[slideId];
      next.media_slot_id = `${unit}.${slideId}`;
      table.push({ unit, slideId, heading: slide.heading, before: describe(slide.media_slot_id), after: `kept: ${kept.title}` });
    } else {
      next.background_kind = 'diagram';
      table.push({ unit, slideId, heading: slide.heading, before: slide.media_slot_id ? describe(slide.media_slot_id) : '(none)', after: 'diagram (unbound)' });
    }
    return next;
  });

  // Renditions for kept assets, from the file already in the old cache.
  const assets = [];
  for (const [slideId, assetId] of Object.entries(keep)) {
    const old = (content.assets || []).find((a) => a.asset_id === assetId);
    const oldFile = String(old.asset_url).split('/').pop();
    const key = cacheKey(assetId);
    if (/\.svg$/i.test(oldFile)) {
      copyFileSync(join(oldCache, oldFile), join(deckMedia, `${key}.svg`));
    } else if (!existsSync(join(deckMedia, `${key}.webp`))) {
      const r = await toRendition(readFileSync(join(oldCache, oldFile)));
      writeFileSync(join(deckMedia, `${key}.webp`), r.buffer);
      console.log(`rendition ${key}.webp ← ${oldFile}: ${r.width}x${r.height}, ${r.buffer.length} bytes, q${r.quality}`);
    }
    // Placeholder; rehydrate-student-media.mjs rewrites the public fields.
    assets.push({ media_slot_id: `${unit}.${slideId}`, asset_id: assetId });
  }

  const { schema_version: _v, assets: _a, slides: _s, media_selection: selection = {}, ...meta } = content;
  const next = {
    schema_version: 2,
    ...meta,
    media_selection: {
      unit_id: selection.unit_id || unit,
      project_id: selection.project_id,
      strategy: 'slide-bound',
      description: DESCRIPTION,
    },
    assets,
    slides,
  };
  writeFileSync(join(root, path), `${FRONT_MATTER}${JSON.stringify(next, null, 2)}\n`);
  console.log(`migrated ${path}`);
}

writeFileSync(join(root, 'creativity-techniques-pedagogy/excellence/evidence/EX3-binding-table.json'), `${JSON.stringify(table, null, 2)}\n`);
