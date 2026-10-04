# PHASE-EX7: Canonical technique catalogue

> **Track:** `creativity-techniques-pedagogy/in-practice/CANONICAL-TECHNIQUES.yml` (private, new file)
> **Status:** BLOCKED (EX6 DONE or PARTIAL)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

`AGENTS.md` requires Lab exercises to be chosen from the in-practice
catalogue, but the catalogue cannot be chosen from yet. Live failing case
(FINDINGS D4): `runtime/exercises-active.json` holds 6,773 records, 2,370
distinct names, 0 accepted; "Red Hat Thinking" appears 108 times; GAN and
TensorFlow procedures are mixed in; 6-3-5 brainwriting, synectics, Osborn's
checklist, cut-up and Oblique Strategies have 0 records.

## Deliverables

1. `in-practice/CANONICAL-TECHNIQUES.yml`: 40–80 techniques. Each entry:
   `id`, `name`, `family` (generation | selection | development | framing |
   reflection | embodied), `mode` (divergent | convergent | both),
   `primary_source` (key in `docs/_data/references.yml`, or `gap`),
   `catalogue_records` (URNs from `exercises-active.json` that support it, may
   be empty), `steps` (3–8), `time_min`, `group_size`, `materials`,
   `units` (U1–U6), `evidence` (one line: what research says works, or "untested"),
   `accessibility` (opt-out / alternative for embodied techniques).
2. Required entries: Alternative Uses Task; brainstorming (Osborn rules);
   6-3-5 brainwriting; SCAMPER; morphological box; synectics / analogy;
   random word / PO; Six Thinking Hats; Oblique Strategies; mind map;
   attribute listing; Tzara cut-up; exquisite corpse; readymade
   recontextualisation; automatic writing; open-monitoring warm-up;
   Thirty Circles; hits / dot voting; COCD box; PMI; ALU; weighted decision
   matrix; consensual assessment (peer CAT); parallel prototyping; Crazy 8s;
   storyboarding; Mom Test interview; fantastic binomial; Young's five steps;
   creative journal.
3. `in-practice/CANONICAL-TECHNIQUES.md`: reading view generated from the YAML.
4. A one-line pointer to the canonical file in `in-practice/INDEX.md`.

## Scope

**In:** the new files and the INDEX pointer. **Out:** editing or re-running
anything under `in-practice/runtime/`; touching the IP cascade's status files.

## Prompt (Implementation Agent)

```text
Implement PHASE-EX7 per creativity-techniques-pedagogy/excellence/PHASE-EX7.md.

## Deliver
1. Check in-practice/runtime/process.json and `ps` first. If an in-practice
   model workload is running, do not start one; this phase needs none anyway.
2. Read exercises-active.json read-only; map records to canonical techniques
   by name and tags; drop off-topic records (ML engineering, security, medicine).
3. Write the YAML, generate the Markdown view, add the INDEX pointer.
4. Hand off for cold review — do NOT mark DONE.

## Constraints
- Quotations from sources stay private; this file is never published
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: 40–80 entries, unique ids and names, every field
  present, every required technique present, every `primary_source` either
  a key in `references.yml` or `gap`, embodied entries have `accessibility`,
  no entry mentions GAN/TensorFlow/network security; file not in `_site`

## Risks

- Many required techniques have no catalogue record: `catalogue_records: []`
  with a primary source is fine and is itself a finding for the IP cascade.
