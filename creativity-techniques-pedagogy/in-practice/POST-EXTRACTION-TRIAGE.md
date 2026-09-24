# Post-extraction coder review triage

2026-09-22. Receipt: runtime/review/coder-review-e48937e9f8405514.json.
Model: qwen2.5-coder:32b, fresh context; 5,919 prompt / 917 output tokens,
90.7 seconds. Advisory verdict: needs-amendment. This triage does not approve
procedures, citations, recall or the corpus as complete.

- F1/F4: retain source-representation audit as pending. Scanning every database
  text field would incorrectly mix generated metadata with original content.
  Current coverage applies only to extracted markdown_content. Compare missing
  original text and diagrams against source witnesses before a completeness claim.
- F2: rejected as contradicted by run(): it explicitly skips documents whose
  preparation_state is not prepared, and records the exclusion.
- F3: rejected as stated: classify_resilient validates supplied IDs and schema;
  extract_quote supplies evidence mechanically. Generated labels/reasons remain
  unreviewed interpretations, not author quotations.
- F5: rejected as stated: depth >= 5 stops recursion (at most 63 calls per original
  batch). A tighter time/token budget remains a useful separate improvement.
- F6: retained as a provenance audit requirement, not evidence of a demonstrated
  loss. Saved supporting-table/source rows and 6,516-record mechanical checks are
  evidence; they do not establish complete procedures or correct printed pages.
- F7: rejected as stated: discovery_hits are metadata, while quotation text is
  mechanically sourced from Ahmes. Public export is outside this private pipeline.
- F8: rejected removal of book evidence: private quotations were requested.
  Runtime is Git-ignored and outside docs. Public leakage tests remain a studio
  safeguard, not permission to delete private source passages.

Confirmed independent defect: old aggregate includes 17 superseded records.
New export_active.py creates separate active-only views from reconciled membership,
checks identity/path/privacy, and preserves every original record. Three offline
tests cover a valid record, duplicate refusal, unresolved membership and path escape.
The exporter and reconciliation helper still require a fresh code review; do not
treat this triage of the earlier pipeline hash as covering those later files.

Next substantive stage: expanded-context procedure packets and local Qwen review
of a small priority-book sample, followed by bibliography and recall audit. No
full-corpus rescan is required for this transition.

## Helper review — 2026-09-22 20:48 UTC

Fresh local qwen2.5-coder:32b receipt:
runtime/review/helper-review-17334666c86c03af.json. Advisory needs-amendment.

- F1 rejected: the proposed gate condition is identical to the existing code;
  inequality already rejects None and all nonmatching values.
- F2/F3: missing files and malformed JSON already abort without writing a new
  audit. Better structured diagnostics remain useful; silently continuing is not.
- F4 rejected as written: the audit cannot contain its own whole-file hash.
  Accepted the underlying consistency concern: export now hashes the same bytes
  it parses, and every member is bound to a SHA-256 of the saved record bytes.
- F5/F6 accepted in corrected form: glob over a missing directory can silently
  return nothing, not necessarily raise FileNotFoundError. Required directories
  and a nonempty coverage set are now checked before reconciliation.
- Independent fix: audit list fields must exist with correct types. Missing
  errors/unaccounted fields can no longer pass as empty. Added regression tests.

These amendments postdate the reviewed snapshot; do not call the amended helpers
independently approved. Review runner now serializes reviewers with a lock and
records PID, input filenames, completion/failure and immutable result path.
This is a reviewer lock, not a shared lease with the extraction worker: actual
worker inspection remains required before any local model job.

Next heartbeat should prioritize the expanded-context priority-book sample,
not another full extraction or an indefinite cycle of helper reviews. Source
scope, bibliography, procedure grouping and recall are still unresolved.
