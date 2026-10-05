<!--
EXCELLENCE — gated cascade that turns the 2026-10-04 curriculum audit into
implemented, cold-reviewed changes to the Creativity Techniques (UEM) site.
Author: Rubén Vega Balbás, PhD · 2026-10-04
-->

# Creativity Techniques — Excellence cascade (EX0–EX11)

**Status:** ACTIVE cascade (EX0–EX11). This is **not** the `in-practice/`
exercise-collection cascade (IP0–IP5) and does **not** forge U4–U6; it builds
the contract, image, research, Lab and didactic layers those units will reuse.
**Author:** Rubén Vega Balbás, PhD · 2026-10-04
**Readers:** the professor (gates and sign-offs); implementing and
cold-review agents (orchestrator, then one phase file at a time).

## How to read this pack

| Face | File | Question it answers |
| ---- | ---- | ------------------- |
| Evidence | [FINDINGS-2026-10-04.md](FINDINGS-2026-10-04.md) | What was checked live, with IDs (A1…E7) every phase cites |
| Technical director | [TECHNICAL-DIRECTOR-CASCADE.md](TECHNICAL-DIRECTOR-CASCADE.md) | Order, master paste, hard constraints, resume rule, closing protocol |
| Autopilot policy | [AUTOPILOT.md](AUTOPILOT.md) | Pre-registered decisions, loop, stop rules, final review packet |
| Local execution | [LOCAL-EXECUTION.md](LOCAL-EXECUTION.md) + `local/` | Verified local stack, model roles, workload map |
| Git flow | [gitflow.sh](gitflow.sh) | Integration branch, landing with regression, tags, rollback, release |
| Final review | `FINAL-REVIEW.md` (built during the run) | What the professor reads once at the end |
| Shared gate helpers | [gates/common.sh](gates/common.sh) | Build + pass/fail helpers sourced by every exit gate |
| Operator subagents | `.claude/agents/cascade-phase-executor.md`, `.claude/agents/cascade-cold-reviewer.md` | Implement one phase and stop at VERIFYING; cold-review it |

Closing: each phase → VERIFYING (`cascade-harness.sh verify`) →
`PHASE-EXn-COLD-REVIEW.md` → amend if needed → `PHASE-EXn-REPORT.md` → DONE.

## Programme

Only the **first word** of the Gate cell is parsed by `cascade-harness.sh`.

| Step | File | Deliverable | Gate |
| ---- | ---- | ----------- | ---- |
| 0 | [PHASE-EX0.md](PHASE-EX0.md) | Live probe + baseline + guía weights decision | DONE (autopilot: weights per AUTOPILOT.md §2) |
| 1 | [PHASE-EX1.md](PHASE-EX1.md) | Contract and factual hotfix (A1–A4, C1–C11) | DONE (EX0 DONE) |
| 2 | [PHASE-EX2.md](PHASE-EX2.md) | Publication firewall (E1–E3, jargon, footers) | DONE (EX1 DONE) |
| 3 | [PHASE-EX3.md](PHASE-EX3.md) | Image pipeline rules + tests + deck validator (B1–B15) | DONE (EX2 DONE) |
| 4 | [PHASE-EX4.md](PHASE-EX4.md) | Slide-bound image curation with rights checks | DONE (EX3 DONE; autopilot curation per AUTOPILOT.md §2) |
| 5 | [PHASE-EX5.md](PHASE-EX5.md) | Deck renderer: pre-render, alt, captions, notes, layouts | READY (EX4 DONE) |
| 6 | [PHASE-EX6.md](PHASE-EX6.md) | Research grounding + single bibliography source | BLOCKED (EX5 DONE; procurement may leave PARTIAL) |
| 7 | [PHASE-EX7.md](PHASE-EX7.md) | Canonical technique catalogue (~60) | BLOCKED (EX6 DONE; serialize with in-practice workloads) |
| 8 | [PHASE-EX8.md](PHASE-EX8.md) | Lab redesign U1–U3 + exercise cards | BLOCKED (EX7 DONE; autopilot sign-off, final review) |
| 9 | [PHASE-EX9.md](PHASE-EX9.md) | Lesson structure, exemplars, lesson images | BLOCKED (EX8 DONE) |
| 10 | [PHASE-EX10.md](PHASE-EX10.md) | Knowledge-test prep, measurement, peer CAT, method cards | BLOCKED (EX9 DONE) |
| 11 | [PHASE-EX11.md](PHASE-EX11.md) | Closing audit against the EX0 baseline | BLOCKED (EX10 DONE) |

## Live snapshot (2026-10-04)

| Fact | Value | Where checked |
| ---- | ----- | -------------- |
| Public grading weights | 70 / 30 (Videojuegos guía) | `docs/evaluation/index.md` |
| Diseño guía PDF weights | 60 / 40 (2025/26) | `cv/sources/9990002301.pdf` |
| Teaching language | English (operator) | operator, 2026-10-04 |
| Cache files `.php` | 21 of 33 | `docs/assets/images/profield-cache/` |
| Unreferenced cache files | 11 | grep of deck JSON |
| U3 dangling image slots | 6 | U3 `content.json` vs `assets: []` |
| Decks with ≠ 2 lab exercises | U1 (3) | deck `content.json` |
| Built pages containing "forge" | 8 | scratch `_site` |
| Catalogue records / accepted | 6,773 / 0 | `in-practice/runtime/exercises-active.json` |
| Jekyll build | passes | `bundle exec jekyll build` |
