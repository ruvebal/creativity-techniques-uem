# In-practice: verified operational findings and next contracts

Reporter checkpoint: 2026-09-29 12:31 UTC. No SPI phase promoted or marked DONE.
No book quotations accompany this report. Private receipts remain in the course
repository's ignored in-practice/runtime tree.

## What works today

Local Qwen 32B scored 6,790 distinct saved records. Verdict IDs reconcile with
record filenames; 62 model-shortlisted entries are active and present in the
recovered Markdown export. This is record accounting, not 6,790 exercises or
complete semantic recall. 17 superseded records were also scored, none shortlisted.
40 offline tests passed after local cache/receipt fixes. Independent Qwen coder
review ran; generic findings were adjudicated rather than treated as approval.

Original-source review of one rejected numbered exercise found a complete
procedure, worked example and clarification. Its old automatic-writing tag was
unsupported. Local full-context Qwen agreed on setup, steps and ending. The
source/extraction spacing difference and bibliography gate remain unresolved.

## Confirmed defects → prevention contracts

1. **Worker discovery:** monitoring only original PIDs missed a later suitability
   worker. Require a run registry with stage, PID, start time, command identity,
   parent run and receipt path. Test worker replacement and PID reuse. A stale
   status file must never establish liveness or absence.
2. **Mixed-version export:** the long-running job scored everything then crashed
   in final export with a dict/Path interface mismatch. Separate immutable scoring
   and export invocations; bind code hashes and API version to each stage. Test
   source-code changes while a worker runs, without restarting valid inference.
3. **Failure reporting:** export exceptions left stale running receipts. Locally
   repaired to persist export-failed plus exception details and re-raise. Test
   each export and human-note harvesting failure; retain partial-artifact status.
4. **Cache trust:** existence-only reuse accepted unchecked files; loading erased
   incoming approval flags. Locally repaired strict schema/booleans/identity/false
   flags and path checks. All existing verdicts pass read-only validation. Still
   needed: source, prompt, model and context hashes in the cache key; stale-result
   invalidation without destruction. Do not infer this future feature is shipped.
5. **Snippet versus procedure:** scorer inputs cap quotation text at 1,800 chars.
   Two shortlisted quotes exceeded that limit; one shortlisted record had no
   accepted quote at all. Require explicit context coverage and missing-evidence
   flags; prohibit absence claims from truncation and distinguish metadata-only
   discovery from source-grounded procedure assessment.
6. **Numbered prose:** junk heuristic rejected a genuine enumerated instruction.
   Add a separate reviewed structured-prose route, preserving the original refusal,
   exact text and node/source bindings. Do not weaken generic prose gates or
   auto-override every numbered block. Include TOC/footnote negative controls.
7. **Source fidelity:** one EPUB internal word space disappears in Ahmes. Preserve
   original and extracted witnesses plus an explicit transformation ledger.
   Whitespace-removed matching may locate candidates but cannot certify verbatim
   identity. Test additions/deletions, punctuation and repeated-passages ambiguity.
8. **Locator safety:** 17 shortlisted records combine EPUB with pdf_order labels;
   42 lack saved evaluator-safe citations. Typed locators must distinguish printed
   page, PDF index, EPUB member/fragment and inferred location. Source-format
   conflict must veto ordinary page citations even when resolver says safe.
9. **Evidence completeness:** Qwen cited the target instruction but omitted the
   adjacent example/clarification. Procedure packets need boundaries and typed
   dependencies (setup, steps, variants, example, figure, ending). Human review
   must not assemble steps from neighboring exercises accidentally.
10. **Review quality:** fresh coder output omitted requested verdict and supplied
    vague findings. Validate review schema; require file/line or reproducible
    evidence, distinguish omitted-code uncertainty from demonstrated defects.

## Curriculum connector: next acceptance contract

Keep JSON records and Markdown reading views. Selection follows official objective
→ unit theme → candidate URN → verified procedure bundle → separately authored
adaptation. Each connector record should contain objective source/path, lesson
path, candidate IDs, thematic rationale, applied problem/domain, evidence version,
review flags, original-source locator, citation status and adaptation boundary.
Publication stays blocked unless required gates pass. Reject missing candidates
as gaps; never silently substitute an invented activity. Keep rejection reasons
and counterexamples searchable for future units and other projects.

## Roadmap, not current capability

A reusable in-practice service could return a ranked evidence bundle, not a
plausible exercise paragraph: original witnesses, exact provenance, unresolved
dependencies, model context coverage, transformation ledger and human decisions.
Source-grounded negative controls and recovery tests should be exit gates before
scaling. A successful process exit or larger vector index is not the success bar.

Evidence: runtime/review/suitability-reconciliation-20260929.md,
suitability-review-adjudication-20260929.md, cache-validation-20260929.md,
shortlist-gates.json, blanks-source-locator.json, blanks-context-adjudication.md.
No shared Ahmes/Athanor database manually edited; nothing published to students.
