# IP0–IP2 local coder review and triage

Status: VERIFYING amendments. Generation: fresh `qwen2.5-coder:32b` prompt; Codex triage, 2026-09-21.

Raw review and local token/timing receipt: `runtime/review/IP0-IP2-coder-review.json`. The reviewer read the worker source and acceptance only, without conversation history; it did not execute tests. Its findings therefore require mechanical adjudication.

| Finding | Decision |
| --- | --- |
| F1 article/review exclusion not accounted | Keep monograph scope, write explicit exclusion records. Do not silently expand review articles into authorial exercise sources. |
| F2 failed ingestion could enter scanning | Accepted. Require preparation_state=prepared. Reject the suggestion to remove failures from inventory: preserve the denominator. |
| F3 classifier can invent exercises | Keep output as candidates and require procedural review; source IDs and quote text already mechanically constrained. No model output becomes approved automatically. |
| F4 no character-level coverage ledger | Accepted. Persist node/start/end spans and verify expected/scanned character counts. Reject unfinished/truncated JSON output. Semantic recall still unmeasured. |
| F5 unbounded calls | Batch count is finite from source length and requests have a 1,200-second timeout. An arbitrary batch cap would silently reduce corpus coverage; rejected. Runtime budgeting remains an improvement. |
| F6 provenance not guaranteed | Supporting node-linked tables, source metadata and processing logs are already retained; verify.py independently checks source/UUID/quote fidelity. Full-vault preservation remains Ahmes responsibility. |
| F7 discovery might be misused | Results already labelled discovery-only. Added explicit source-hash/node join in each exercise record; quote path remains semantic-quote. |
| F8 private rendered evidence might be published | Runtime is ignored by Git and outside docs; verified with git check-ignore. Reject removing quotations from the private research view: they are required. |

Observed beyond review: concurrent probe commands could overwrite the worker's status file. Separate auxiliary activity files by PID; keep command events append-only. Command logs now append attempts, preserving failures on resume.

Verification: worker imports/compiles; 27/27 semantic-quote mechanical unit checks passed. A live pilot resolved 12/12 Athanor hits to source-hash-matched Ahmes nodes and ran citation resolution. Complete ingestion, procedure review, source-page audit and recall measurement remain open; no phase is certified DONE.
