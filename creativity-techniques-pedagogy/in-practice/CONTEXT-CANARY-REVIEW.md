# Expanded-context canary — private research, 2026-09-22

Purpose: test whether larger source windows improve procedure assessment before
scaling to thousands of candidate nodes. This is not a recall sample or approval.
Runner: context_sample.py; local qwen2.5:32b-instruct, sequential calls. Source
packets and model receipts remain under the ignored runtime/context-sample/.
Original exercise records, quotations and citation gates are unchanged.

## Observed problems

- Thinkertoys: the 17-node packet contains five figure nodes and several headings.
  The model reported no diagrams, but its prompt received only UUIDs and text,
  not block types. Empty figure text is not evidence that the book lacks diagrams.
- The Thinkertoys evidence selection spans BLUEPRINT, stretching and squeezing
  sections. A wider window supplies context but does not establish one procedure's
  boundaries. Heading proximity alone does not solve procedure grouping.
- Steal Like an Artist: the model says steps_present=true while its limitations
  say no structured steps are provided. It also reports a missing ending with
  needs_more_context=false. These are review flags, not schema/UUID failures.
- A practice can be open-ended: lack of a stopping condition is not by itself
  grounds to reject it. Distinguish repeatable habit, exercise and worked example.

## Required correction before scale-up

1. Include block type/subtype, source order and explicit unread figure markers in
   the model prompt. Figure presence means visual review pending, not absence.
2. Provide target-section boundaries and neighboring headings as context; require
   the model to distinguish target evidence from other exercises. Preserve original
   row order, UUIDs and whole nodes; verify reading order separately.
3. Ask for evidence UUIDs separately for setup, actions and expected result or
   practice purpose; permit absent/not-applicable states with reasons. Validate
   all IDs and surface contradictions for human/source inspection.
4. Expand context when boundary uncertainty remains, with a strict per-source
   budget. Do not merge neighboring practices merely to satisfy completeness.
5. Preserve this baseline in an immutable run directory before any repeat; compare
   revised judgements on the same targets. Never overwrite the baseline silently.

The direct Ahmes skill boundary is retained: raw context packets are source
inspection material, not newly approved quotations. Existing semantic-quote
refusals remain refusals. No model-generated words enter source evidence.

## Studio learning

The useful lesson from formula-detection context is not simply “more lines”. It is
preserving the structure needed to interpret those lines. An empty figure node is
a missing modality, not an empty fact. Wider context requires section-aware
selection and independent verification; local model confidence cannot replace it.

Next: revised same-target canary, source/image inspection, then bibliography and
procedure grouping. Do not launch another full-corpus scan or mark IP3 complete.

## Structured comparison collected — 2026-09-23

The revised three-call run finished on September 22 at 21:25:33 UTC. No worker
remains running. Baseline and revised packets/judgements are preserved separately.
The follow-up collected these results later; do not describe this as continuous
monitoring or an immediate completion-triggered transition.

- Thinkertoys: evidence narrowed from five nodes across sections to three target
  nodes. However, Qwen still asserted missing visual aids despite explicit figure
  markers. Visual absence claims are rejected; image review remains mandatory.
- Steal Like an Artist: actionability changed from true to false. Direct reading
  of the target confirms a personal Jurassic Park fan-fiction anecdote. This is
  evidence that the target is not itself a standalone procedure, not grounds to
  reject the surrounding chapter or the book's practices.
- Lateral Thinking: actionability and selected evidence remained unchanged.
  Missing ending and needs_more_context=false still require adjudication: an
  open-ended practice may be legitimate. The packet has no figure nodes, but
  that does not establish that the original book contains no relevant images.

compare_context.py verifies identical source hashes, targets and node UUID order
between runs; reports structural review flags independently of model opinion in
runtime/review/context-comparison.json. There is no accuracy/recall estimate from
three deliberately selected targets, and no procedure promotion.

Required next action: inspect the target sections and original visual witnesses,
resolve procedure boundaries, and assemble a small manually labelled benchmark.
Do not keep repeating prompts until the model agrees. The new context helpers
still require independent code review before scale-up. Fifteen offline tests pass.

Direct source adjudication now available in SOURCE-REVIEW-2026-09-23.md:
Lateral Thinking's quota target DOES contain a completion condition. Both model
ending judgements are rejected for that target. Do not propagate them as facts.
