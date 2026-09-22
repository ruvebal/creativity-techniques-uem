# In-practice

Private, reusable catalogue of creativity exercises grounded in supplied monographs.
JSON is the editable machine record; Markdown is a generated reading view. No YAML editing is required.

Generation disclosure: Codex authored this plan and runner on 2026-09-21. Source classification runs locally with `qwen2.5:32b-instruct`; code review defaults to `qwen2.5-coder:32b`. Quotations come mechanically from Ahmes through the semantic-quote skill. Ahmes currently uses its own hardcoded smaller Qwen model for built-in enrichment; that distinction must remain visible.

## Live evidence, 2026-09-21

| Observation | Where checked |
| --- | --- |
| 36 PDF/EPUB files; 4 added today by filesystem birth time in Europe/Madrid | `runtime/inventory.json` |
| Today's tranche: Thinkertoys; Whack 1990 PDF; Whack 2008 EPUB; 1996 Art Therapy review | inventory paths and SHA-256 |
| Steal Like an Artist and Lateral Thinking each resolve to an existing source-hash-matched Ahmes vault | inventory `extraction_dbs` |
| Two Creative Confidence files share one source hash but have two vault paths | inventory; requires canonical-vault adjudication |
| Local Qwen 32B instruct, Qwen coder 32B, nomic embeddings available | live `ollama list` |
| Athanor creativity-techniques and digital-creativity projects exist | live `athanor project list --library scholar` |
| Ahmes semantic adapter hardcodes Qwen 3B | `ahmes/infrastructure/ai/ollama_adapter.py:130` |

## Programme

Recovery update: coder PID 47960 finished and its findings were triaged in
RECOVERY-REVIEW-2026-09-22.md. Six tests pass, including exact per-node coverage.
A single recovery worker has now been launched; consult runtime/process.json
for the new PID. Reuse valid caches, retry invalid classifications, and do not
start a concurrent reviewer while extraction is running. The previous paragraph's
review-running status below is historical, not a live process instruction.

Checkpoint 2026-09-22 06:10 Europe/Madrid: worker 1569 has exited. First pass
ended with 17 failures (15 scan failures, two ingestion failures), nine textual
scan receipts, and 842 provisional node records (324 candidates, 518 needs-review).
Mechanical `verify.py` passed across all 842 records; no procedural completeness
or recall claim follows. A fresh local coder review is running as PID 47960
(`review_runner.py`, exec session 48426). Check this PID as well as process.json
before launching any model workload. Its immutable receipt is written under
`runtime/review/coder-review-<code-hash>.json`. Read and triage it before resuming.

The runner now versions its classification gate, so old scan receipts cannot
silently skip ID validation and smaller-batch retries. Existing valid model caches
are reused. This small coverage-version amendment followed the review snapshot
and therefore needs separate review; four retry tests and diff checks pass.
Some earlier scans logged rejected model IDs despite reading every character:
their textual coverage is not proof of complete classification.

Read-only PDF diagnostics independently reproduced the Beyond Productivity
failure: invalid xref/stream structure and a null top-level pages object. The
original file was not modified. Vault ambiguity remains unresolved separately.

Checkpoint 2026-09-22 02:32 Europe/Madrid: two full textual scan receipts:
Steal Like an Artist (58,052/58,052 characters; 26 node records) and Whack 2008
(262,330/262,330 characters; 200 node records). Independent `verify.py` passed
for 226 records: source hashes, private-publication flags, original node records,
and verbatim gates for emitted quotations. Of these records, 22 are candidates
and 204 need review; none is procedure-approved. This is not 226 distinct exercises.
Lateral Thinking also needs the staged truncated-output retry. Worker 1569 remains
active on subsequent books; no concurrent model or duplicate worker was started.

Checkpoint 2026-09-22 01:59 Europe/Madrid: 33 validated live injection reports
(21 injected, 12 unchanged), and 12 parsed discovery queries. Worker 1569 is
classifying full text with local Qwen and resolving candidate citations. Thinkertoys
hit truncated output; Whack 1990 hit malformed output. Whack 2008 reached its
citation stage. Counts of candidate nodes are not counts of reviewed exercises.

Recovery code now bisects invalid classification batches, preserves character
offsets, caches successful child results, and fails closed at a bounded retry
limit. Four offline tests pass. This code is **staged for the next worker run**;
do not interrupt the current worker or start a duplicate. After it exits, resume
to retry uncovered sources, then request a fresh local coder review. Heading-first
expanded procedure context remains a separate pending enhancement.

| Step | File | Deliverable | Gate |
| --- | --- | --- | --- |
| IP0 | [PHASE-IP0.md](PHASE-IP0.md) | scope, identity and privacy | VERIFYING inventory inspected; independent review pending |
| IP1 | [PHASE-IP1.md](PHASE-IP1.md) | extraction, semantic enrichment, injection | IN_PROGRESS live worker; dry-run before each injection |
| IP2 | [PHASE-IP2.md](PHASE-IP2.md) | vector discoveries and full-text exercise candidates | BLOCKED awaits ingestion; scope exclusions explicit |
| IP3 | [PHASE-IP3.md](PHASE-IP3.md) | verified passages, references, reviewed collection | BLOCKED awaits IP2; no completeness claim from top-k |
| IP4 | [PHASE-IP4.md](PHASE-IP4.md) | curriculum-to-lesson selection connector | BLOCKED next phase; Unit 4 default recorded now |
| IP5 | [PHASE-IP5.md](PHASE-IP5.md) | cross-project service and developer feedback | IN_PROGRESS contract/report; service implementation future |

Read [TECHNICAL-DIRECTOR-CASCADE.md](TECHNICAL-DIRECTOR-CASCADE.md) to resume.
Read [COLLECTION-CONTRACT.md](COLLECTION-CONTRACT.md) before consuming records.
Read [DEVIAC-FEEDBACK.md](DEVIAC-FEEDBACK.md) for measured limitations and proposals.

## Outputs and operation

### Recovery, 2026-09-22 (Europe/Madrid)

The first worker ended with 35 preparation failures and no exercise scan. Most
failures came from an incorrect runner assumption: Athanor supports `--dry-run`
only with `--from-manifest`, not a positional database. The runner now creates
private single-source manifests, checks structured plan/live reports, and reuses
successful enrichment command receipts. Eight synthetic report-gate checks and
Python compilation passed. A replacement worker was started after confirming the
old PID had exited; consult runtime/process.json for its current identity.

Also corrected: command output parsing now reads only the latest attempt, not
the accumulated log (which includes receipt headings). Unparseable discovery
responses cannot count as coverage. Existing invalid discovery caches are retried.

Remaining: invalid Beyond Productivity PDF, ambiguous Creative Confidence vaults,
heading-first expanded context implementation, source coverage, bibliography and
procedure review, and fresh coder review of this recovery. No completeness claim.

`pipeline.py inventory` audits identities. `pipeline.py run` resumes cached work under a single-process file lock. Use Ahmes' virtualenv Python; export Athanor's environment without printing secrets. Runtime outputs are excluded from Git and outside `docs/`:

- `runtime/status.json`, `process.json`, `events.jsonl`: current activity and command receipts.
- `runtime/inventory.json`: source identities and dates, including non-monograph material.
- `runtime/prepared/`: successful per-source enrichment/injection checkpoints.
- `runtime/discovery/`: exact Athanor queries/results, explicitly discovery-only.
- `runtime/batches/`: local model classifications, settings, token counts, prompt digests.
- `runtime/sources/`, `records/`: source metadata and full supporting Ahmes rows.
- `runtime/coverage/`: scanned-node/batch denominators and residual gaps.
- `runtime/exercises.json`, `EXERCISES.md`: provisional private catalogue.

The worker's `awaiting_review` state means processing has ended, not that the catalogue is complete. The cascade closes only after independent review. Do not push runtime extracts to a public repository.
