# PHASE-EX11: Closing audit against the EX0 baseline

> **Track:** measurement only
> **Status:** BLOCKED (EX10 DONE)
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Prove, with the same probe that measured the baseline, that the audit's
findings are closed, and hand U4–U6 forging a clean platform.

(Amendment A1: probe targets cover U1–U3 and the master lecture; U4–U6 are
reported in CLOSING-AUDIT.md under "Out of scope — for the U4 forge", not
counted as failures. Update the probe's `--targets` accordingly.)

(Amendment A2/F3–F4: before evaluating targets, harden the probe: include the master-lecture deck (`2627-ml`) and lesson; treat empty `public_weights` as unmet; flag author-date labels on quotes lacking `quote_origin`; detect rank dealing by behaviour (slide→asset assignment by index), not the `rankCursor` name; count decks with zero lab slides; measure asset reuse within a deck. Add a fixture test per case.)

(Amendment A6/F5: add automated tests for validator block/flag modes and the orphan check; replace the always-true "rights report written" check with a freshness check against the decks.)

(Amendment A7: add a validator check + test for curator-only `rights_status: flagged` so a hand edit to `ok` fails; the rights report must count all curator flags.)

## Deliverables

1. `evidence/final-EX11.json` — probe output at the merged HEAD
2. `CLOSING-AUDIT.md` — table FINDINGS ID → closing phase → evidence (probe
   key, test name or file) → status (closed | deferred with decision link)
3. Amend `forge/ct-unit-forge.mdc` and `STUDENT-SLIDESHOW-FORGE.mdc` so U4–U6
   inherit the new rules (slide-bound images, rights gate, exercise cards,
   references.yml, retrieval slide), and add a pointer to this cascade in
   `AGENTS.md`

## Prompt (Implementation Agent)

```text
Implement PHASE-EX11 per creativity-techniques-pedagogy/excellence/PHASE-EX11.md.

## Deliver
1. Build _site; run the probe; save final-EX11.json; run `--targets`.
2. Write CLOSING-AUDIT.md covering every FINDINGS ID (A1–E7).
3. Amend the forge rules and AGENTS.md pointer.
4. Run the exit gate; hand off for cold review — do NOT mark DONE.
```

## Acceptance

- Exit gate passes: probe `--targets` exits 0 (no `.php`, orphan or
  oversize files; no dangling slots; no rank dealing; no empty licences on
  curated slides; two Labs per deck; no Tao line with an author-date; no
  uncited references; zero leak terms; public weights equal the decision)
- `CLOSING-AUDIT.md` lists every FINDINGS ID exactly once
- Forge rules and AGENTS.md mention the new contracts
