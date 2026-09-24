# IP1 — extract, enrich, inject

Status: VERIFYING / PARTIAL — 33 prepared source hashes; two ingestion failures remain. Updated 2026-09-22. Worker finished; do not restart all sources.

Prompt: execute the durable runner, newest sources first. Extract missing vaults only; preserve hand-curated metadata. Use actual CLI help as authority because studio runbooks contain older flags. Run metadata, NER and semantic enrichment, then Athanor dry-run and live injection to profield-creativity-techniques/scholar. Save every exit/log and exact source identity. Hand off for cold review.

Acceptance: every successful source has a hash-matched extraction.db, observed processing stages, dry-run and injection receipts; failed/ambiguous sources remain listed. Confirm injected nodes are discoverable and have embeddings, not merely a successful CLI exit. Risks: expensive PDF extraction and semantic calls; smaller built-in Ahmes model; idempotency/version drift; duplicate vaults. No forced metadata replacement.
