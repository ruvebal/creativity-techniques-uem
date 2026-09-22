# Recovery review, 2026-09-22

Fresh qwen2.5-coder:32b review completed after worker 1569 exited. The immutable
JSON receipt under runtime/review is keyed to the reviewed source-code hash.
This is advisory review, not catalogue approval.

- F1 accepted as hardening: validate continuous, non-overlapping offsets per
  node, not only the sum of characters. Added a regression with equal totals but
  both overlap and missing text.
- F2 rejected as stated: depth is capped at five, so bisection has at most 63
  calls per original batch, each with an HTTP timeout. An overall cost budget is
  still a useful future improvement.
- F3/F6 rejected: run() catches preparation exceptions and marks the source
  failed; successful structured injection reports are mandatory.
- F4 rejected as stated: supplied-ID validation is explicit and quotes are
  mechanically extracted, not generated. Semantic relevance remains unreviewed.
- F5 retained as a closure requirement: reconcile the full inventory, exclusions,
  duplicate witnesses, failures and coverage before declaring completeness.
- F7 requires external verification rather than the proposed code change:
  verify.py passed all 842 records against source identities and exact quote
  spans; source rows and supporting Ahmes tables are stored. Procedure and page
  audits remain pending.
- F8 rejected: discovery hits are attached as discovery metadata; quotation
  evidence comes from source databases.
- F9 rejected: private book passages are explicitly requested. Runtime is ignored
  by Git and outside the website; deleting evidence would violate the task.

Post-snapshot amendments: classification-gate versioning forces old receipts
through strict ID validation; per-node interval checks were added after review.
Six offline tests pass. These amendments still need a later fresh review. The
842-record mechanical pass does not certify 842 distinct or complete exercises.

Next: one resumed worker reuses valid caches and retries invalid batches, followed
by heading-context enhancement, bibliography, procedural and coverage review.
