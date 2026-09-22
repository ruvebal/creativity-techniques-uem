# IP0 — identity and scope

Status: VERIFYING. Generation: Codex, 2026-09-21.

Prompt: audit the supplied directory using filesystem birth time in Europe/Madrid for 2026-09-21; preserve mtime separately. Hash each file; match Ahmes source.file_hash, never filename alone. Distinguish review/article, monograph, exact twin and edition variant. Resolve ambiguous vaults with source metadata. Keep output private. Hand off for cold review.

Acceptance: run `pipeline.py inventory`; check today's four paths, two named existing works, duplicate Creative Confidence witnesses, and all source-hash resolutions. Verify runtime is ignored by Git and absent from docs. Risks: filesystem dates do not prove original acquisition date; sandbox SQLite WAL failures must not be mistaken for missing vaults.
