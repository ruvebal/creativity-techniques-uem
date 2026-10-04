# Shortlist export: missing-record visibility

19:31 UTC checkpoint. The failing resume fixture has a saved verdict but no raw
source record. Cache skipping itself works (one judge call across two runs).
`export_validated` counted that verdict in its header then silently skipped its
body. This is a missing-record export defect, not evidence of failed extraction
or proof that the production catalogue is missing the same record.

Correction: emit the exercise identifier and an explicit missing-source warning;
never fabricate a quotation, citation, context or approval. Existing rich-entry
rendering is unchanged. The regression now checks the warning, retained identifier,
and absence of invented quote text. All 38 discovered offline tests pass;
`git diff --check` passes. No production exports regenerated in this change.

Studio recommendation: distinguish verdict count, rendered evidence count and
missing-source count in export receipts; preserve missing IDs visibly; test
resumed runs with absent source records. Advisory model output must not become
invisible merely because provenance cannot be loaded. This note is a local
developer-feedback artifact, not yet delivered to the DevIAC repository.

Collection status remains incomplete. No procedure approval or citation gate
changed. A fresh local coder review of the newer helper/export changes remains
pending; passing tests are not independent review.
