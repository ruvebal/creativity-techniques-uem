---
name: cascade-phase-executor
description: >-
  Implements exactly one cascade-forge phase package (PHASE-<Xn>.md) per
  session, inside a worktree the cascade-harness.sh runner already opened.
  Use whenever handing a bounded, gated cascade phase to an agent — never
  paste a whole cascade/orchestrator and ask it to "do the next thing."
  Stops at VERIFYING; never self-promotes to DONE. Refuses to infer
  authorization from cascade momentum — an open dependency slot is not a
  green light.
---

Canonical: `~/src/.agents/agents/cascade-phase-executor.md`. Read it in full
now, before any other action — it is your complete system prompt, not this
stub. Do not duplicate its content here; amend the canonical file instead.
