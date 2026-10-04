# PHASE-EX4: Slide-bound image curation with rights checks

> **Track:** deck `content.json` bindings; Profield acceptance (professor, via review app)
> **Status:** BLOCKED (EX3 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.
> **Human gate:** the professor chooses every image. The agent proposes; it never accepts.

## Goal

Give every image slide an image that argues its idea and is legally
publishable in Spain. Live failing cases: FINDINGS B3–B7, B10 (fire engine on
the Duchamp slide; fashion leftovers; Duchamp images unused; U2 repeats; U3
empty; three EU-term risks).

## Deliverables

1. `image_brief` on every image slide of U1–U3 and the master-lecture deck:
   one sentence naming the subject, period and why it carries the idea
   (for example "Duchamp, *Fountain*, 1917, Stieglitz photograph: an object
   changes meaning when its context changes").
2. `curation/<deck>-SHORTLIST.md` (private): for each slide, 3 candidates
   from public-domain or open-licence collections (Wikimedia Commons, NYPL,
   Met Open Access, Rijksmuseum, Europeana, Library of Congress), each with
   thumbnail link, author, author death year, licence, EU-term verdict and
   one line on fit. Prefer images of the technique itself (Osborn's checklist,
   a 6-3-5 sheet, a morphological box, a cut-up, a sketchbook page).
3. The professor accepts chosen images in the Profield review app (assigned
   to project `tc` + unit), then the agent writes `asset_id`, `alt_text`
   (human-approved), licence and author into `content.json` and runs
   rehydration in the worktree.
4. (Autopilot §0: superseded — these stay allowed if they fit their brief, with
   `rights_status: flagged`.) Originally: remove from all decks unless the shortlist records a cleared EU status:
   *Un chien andalou*, *Rrose Sélavy* (Man Ray), *Rotary Demisphere*
   (Duchamp), Sigmar Polke, and every asset whose people are identifiable
   without a consent or public-event note.
5. `curation/CURATION-SIGNOFF.md` with `approved_by:`, `approved_on:` and the
   list of decks signed off.

## Scope

**In:** briefs, shortlists, bindings, rehydration in the worktree.
**Out:** pipeline code (EX3), renderer (EX5), editing `review-state.json` by hand.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX4 per creativity-techniques-pedagogy/excellence/PHASE-EX4.md.

## Deliver
1. Draft image_brief for every image slide; show them to the professor for edits.
2. Build the shortlists from collection search APIs. Record licence and
   author from the file page, not from search snippets. Compute the EU term.
3. STOP and hand the shortlists to the professor. Wait for their choices and
   their acceptance in the review app.
4. Bind the chosen asset_id per slide; rehydrate in the worktree; run
   node scripts/validate-decks.mjs --strict until green.
5. Status PARTIAL is allowed if some slides still lack an approved image;
   those slides stay on the Koch diagram and the report lists them.
6. Hand off for cold review — do NOT mark DONE.

## Constraints
- Never accept an image yourself; never edit review-state.json
- Discovery is not clearance
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: validator strict green; every curated slide has a brief,
  an asset, licence, author, `eu_term_ok: true`; banned assets absent; at
  least 60% of masterclass + lab slides per deck carry an image; no asset is
  reused within a deck; sign-off file complete
- Cold reviewer opens 5 random bindings and confirms the image matches its brief

## Risks

- Strong technique images may be scarce: a clean diagram is better than a
  random photo. A PARTIAL with honest fallbacks is success; a wrong image is not.
