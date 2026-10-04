# Reviewer reliability: observed failures and proposed regression cases

Reporter checkpoint: 2026-09-29 17:01 UTC. Supplement to
STUDIO-FEEDBACK-2026-09-29.md, not phase acceptance. No book extracts included.
No SPI phase promoted, production model changed or shared metadata edited.

## Observations, not a benchmark

Three bounded local reviews completed with parseable, schema-valid output.
Two used qwen2.5:32b-instruct on full original sections; one used
qwen2.5-coder:32b with cache store, application, domain and tests supplied.

- Procedure review A correctly grouped two variants but claimed numbering and
  timing absent despite both being present; its reasoning contradicted its own
  numbering limitation. Timing belongs to only one variant.
- Procedure review B missed an explicit closing discussion. It also confused
  instruction-untrusted source data with unreliable scholarly evidence.
- Code review proposed adding validation that already exists, overlooked the
  identifier allowlist and per-record resume path, and proposed catching corrupt
  cache errors without accounting for deliberate fail-closed behavior.

These are selected observed failures, not an estimated model error rate. Do not
infer the entire corpus is wrong or reject every future model finding. No code
change was justified by the last four code-review findings. Existing cache
source/model/prompt invalidation remains a separately acknowledged open issue.
The latest full local test run passed 40 tests and 5 subtests; this is not evidence
that the proposed reviewer tests below have been implemented or passed.

## Evidence receipts retained privately

All paths below are relative to the course repository's in-practice/runtime/:

| Review | Process | Adjudication |
| --- | --- | --- |
| Variant section | random-word-review/process.json (PID 28448) | review/random-word-family-20260929.md |
| Entry-point section | entry-points-review/process.json (PID 44164) | review/entry-points-adjudication.md |
| Cache code | cache-review/process.json (PID 85607) | review/cache-rereview-20260929.md |

Receipts bind input hashes and raw reviews; do not copy original-source packets
into development reports or cloud prompts. Preserve model output and orchestrator
adjudication separately. The coder input hash is
8c9069ff3901c34aff2de30de5b1b3fbecdca473522a654a8a01d5719958421b.

## Proposed synthetic regression set

Use newly authored fixtures, not copied monograph text. Example synthetic inputs
below are test designs, not sourced teaching activities.

| Case | Synthetic input condition | Required assertion |
| --- | --- | --- |
| RQ01 | Heading labels exercise 7; body has a procedure | Numbering cannot be called absent |
| RQ02 | Variant A has no time; B says 90 seconds per round | B timing present; A timing unspecified; no transfer |
| RQ03 | Last instruction asks pairs to compare outcomes | Ending present, with exact block support |
| RQ04 | Procedure ends mid-sentence, marked truncated | Insufficient context, not a confident absence verdict |
| RQ05 | Same fixture marked untrusted for instruction execution | Scholarly reliability not downgraded solely for that label |
| RQ06 | Code save method invokes validator before write | No finding asking to add that same validation |
| RQ07 | Identifier allowlist rejects separators; traversal inputs supplied | Finding must show a bypass, not recommend another path join |
| RQ08 | Corrupt cache raises and reports error | No silent-skip recommendation without preserved error accounting |
| RQ09 | EPUB fragment plus resolver-safe PDF-order number | Printed-page claim remains blocked |
| RQ10 | Valid JSON with contradictory finding and reasoning | Schema pass does not imply semantic review acceptance |

For every positive and negative finding require claim type, input block or code
location, exact support where present, inspected scope and uncertainty. Absence
claims require complete relevant context; they cannot be proven by a nonexistent
supporting quotation. Record counterevidence checks explicitly. Listing every
input block is not sufficient reasoning. Keep group/variant-specific attributes.

Proposed evaluation: deterministic fixture/schema checks plus separately
versioned local model runs (model identifier, digest where available, prompt and
input hashes, decoding settings, raw response, adjudication). A human-designated
reviewer sets acceptance thresholds; do not run repeatedly until a favorable
answer appears. A second model is advisory, not an automatic tie-breaker.

## Integration and prevention boundary

Apply the checks before reviewer findings can trigger fixes, catalogue exclusions
or curriculum selection. The connector must carry unresolved review findings and
their adjudication, not only a boolean model verdict. Continue to distinguish
source fidelity, complete procedure, bibliographic locator and teaching approval.

This report supplies observed cases and proposed acceptance tests only. It does
not implement a harness, approve any exercise, clear citation gaps, establish
whole-corpus coverage or close the authorized collection. Next collection work
remains substantive source-family review, not another full scan or repeated coder
review of unchanged files.
