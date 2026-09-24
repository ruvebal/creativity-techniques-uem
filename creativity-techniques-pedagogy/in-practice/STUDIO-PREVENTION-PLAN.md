# In-practice: studio corrective-action backlog

Date: 2026-09-22. Status: proposed studio changes; local runner fixes partially tested.

**DevIAC adoption home (authoritative cascade):**
`~/src/deviac/docs/DEV_PLAN/IN-PRACTICE/INDEX.md` (SPI0–SPI6). Keep this CT
copy as the experiment-local backlog mirror; amend the DevIAC pack when
engine work is gated.

Owner assignments below name components, not people who have accepted tickets.
No shared-engine implementation, publication, or completeness is claimed.

## Executive finding

The pipeline proved that local-model corpus processing and exact-source quotation
checks can run together. It also exposed avoidable orchestration defects: invalid
CLI combinations, weak first-pass output validation, repeated configuration
failures, and late delivery of a reviewed sample. These were defects in the
operator-authored runner, not evidence that Athanor lost documents or that all
Ahmes extraction was defective. Long-running inference is only part of the delay.

The next studio milestone should be **a reviewed, source-grounded sample with a
coverage denominator**, before a full-corpus run. Raw record growth is not success.

## Measured snapshot (2026-09-22, approximately 11:24 UTC)

- 33 prepared source identities; 12 parsed project-scoped discovery queries.
- 18 textual scan receipts; 14 under validated-ID and retry checks.
- 4,376 saved node-level records: 1,031 candidates, 3,345 requiring review.
- Zero procedure-approved exercises. Old records can coexist with revised scan
  results; these totals are not a deduplicated exercise count.
- 538 cached response artifacts (includes synthetic merged retry artifacts),
  about 8.9 hours summed saved inference durations, 3,267,099 input and 288,621
  output tokens. Failed/truncated calls are not fully represented, so this is
  not total runtime or a complete cost ledger.
- Recovery pass: 46 split events at that snapshot; no terminal scan failure yet.
- Two unresolved ingestion cases: malformed PDF; duplicate vault identity.
- Mechanical quotation/source checks passed for an earlier 842-record snapshot;
  that result must not be generalized to all later records without rechecking.

## Prioritized corrective actions

| ID / priority | Observed problem and ownership | Prevention / acceptance test | Current state |
| --- | --- | --- | --- |
| IP-P01 / P0 | Runner used positional DB with Athanor --dry-run, which requires --from-manifest | Preflight actual installed CLI combinations before enrichment; invalid invocation stops before the first expensive job; fixture covers single-source and manifest forms | Runner fixed with single-source manifests; shared capability contract proposed |
| IP-P02 / P0 | 35 preparations failed before the initial run ended | Orchestrator circuit breaker stops scheduling after repeated identical configuration errors, while retaining source denominator; fixture: second identical syntax failure prevents third expensive job | Proposed |
| IP-P03 / P0 | Accumulated log headers contaminated JSON parsing | Separate machine stdout, stderr, and append-only receipts; two invocations must each yield one valid response; exit zero with report.failed > 0 must fail the stage | Runner now reads latest attempt and validates injection summary; durable regression still needed |
| IP-P04 / P0 | Local output truncated, malformed, or contained invalid IDs | Typed schema at generation where supported plus post-validation; bounded retries; exact supplied-ID membership; invalid minimum-size response remains uncovered | Runner bisects; six offline tests pass; live recovery demonstrated |
| IP-P05 / P0 | Equal character totals cannot rule out gaps/overlap; rejected IDs were formerly skipped | Per-node contiguous interval proof; versioned gate/schema/source fingerprints invalidate stale checkpoints; synthetic equal-total gap/overlap must fail | Interval and gate-version checks implemented; source/schema invalidation incomplete |
| IP-P06 / P0 | Expensive broad scan ran before any procedure-reviewed sample | Studio cascade requires a small reviewed priority-book canary before scale-out; stop expansion if quotation, relevance, or procedure gates fail; show separate milestones | Proposed; heading-first enhancement still pending |
| IP-P07 / P0 | Records are keyed by node; rescan no longer selecting a node can leave its old record in aggregate | Immutable run manifests define active record membership; revisions retain superseded evidence outside current aggregate; fixture removes a candidate on rescan without losing history | Newly identified risk from code path; not yet corrected |
| IP-P08 / P1 | Procedure boundaries exceed paragraph boundaries; numbered steps rejected by prose quote gate | Ahmes/semantic-quote structured-procedure verifier, separate from prose gate; headings propose windows, expand to setup/steps/end and linked figures; TOC and footnote negatives must remain rejected | Proposed; do not weaken existing prose safeguards |
| IP-P09 / P1 | Large repeated UUID output and retry trees increase latency | Use request-local short IDs mapped mechanically to full UUIDs; preserve all provenance; record attempts including failures; explicit per-source time/token/call budgets; test ID collision and over-budget stop | Proposed; current depth bound is finite but not a useful cost budget |
| IP-P10 / P1 | Creative Confidence hash maps to two vaults; malformed PDF repeatedly retried | Ahmes canonical-witness registry and aliases; preserve both witnesses; unreadable-vs-absent distinction; quarantine unchanged corrupt inputs with diagnostic receipt until fingerprint changes | Proposed; no arbitrary first-vault selection or source modification |
| IP-P11 / P1 | “Today” and corpus membership can drift between resumes | Freeze the original inventory/date/timezone and fingerprint; additions require an explicit new tranche; tests for midnight and changed files | Original date fixed; inventory is regenerated, so immutable tranche enforcement still needed |
| IP-P12 / P1 | Model reviewer produced false-positive findings | Reviewer must cite exact code and failing condition; orchestrator triages accepted/rejected/deferred with reasons; review hashes bind to artifact version; post-review edits reopen gate | Hashed review receipts and triage implemented; later amendments need fresh review |
| IP-P13 / P1 | Stale prose status and repeated heartbeat checks obscure useful progress | Structured phase counters, current source, last durable event, retry count, model time and remaining denominator; milestones/failures notify, unchanged checks stay silent; no claims from PID alone | Activity/PID receipts exist; consolidated health report proposed |
| IP-P14 / P1 | Model inference blocks useful review until full scan ends | Single local-model lease shared across jobs; checkpointed priority scheduling alternates extraction and review; cancellation at safe batch boundaries; crash/restart test proves no duplicated job | Single worker lock exists; shared lease/scheduler proposed |
| IP-P15 / P1 | JSON labels and citation confidence can be mistaken for scholarly approval | Separate fidelity, bibliography, relevance, procedure, image, recall and curricular-fitness gates; no selectable exercise until required gates pass | Flags exist; most substantive gates pending |
| IP-P16 / P0 | Private extracts must never enter public build or Git | Fail public builds on evidence-store references or raw provenance; active-record export whitelist contains approved adaptations only; synthetic leak fixture must fail | Runtime ignored/outside docs; shared CI enforcement proposed |

## Regression suite to upstream

Use synthetic fixtures in studio repositories, not copyrighted book paragraphs.
Private corpus fixtures remain local and carry witness hashes and access policy.

Existing reusable tests: `in-practice/test_retries.py` covers retry subdivision,
source offsets, invalid-ID refusal, network-error behavior, contiguous coverage,
and equal-total gap/overlap. Run with Ahmes' Python environment. These are runner
tests, not Ahmes/Athanor engine integration tests.

Add integration fixtures for P01–P03, stale checkpoint/source changes, record
supersession, duplicate witnesses, numbered instructions vs TOCs, process crash
and lease recovery, schema-compatible CLI versions, and private export leakage.
Every accepted defect should have an executable reproduction before closure.

## Delivery cascade

1. DevIAC orchestrator: preflight, circuit breaker, canary gate, immutable run
   manifest, cost ledger, notification semantics. Exit: offline fixtures plus
   installed-CLI canary, zero unaccounted sources.
2. Ahmes/Athanor adapters: capability/JSON contract, source identity and locator
   types; metadata model configuration. Exit: round-trip source hash/node lookup
   and explicit ambiguous/missing/unreadable states, no inferred printed pages.
3. Semantic evidence: heading-first retrieval and expanding procedure packets.
   Fractal-architect lesson: context is evidence, not a verdict. Keep full-text
   fallback; separately measure discovery recall and procedure completeness.
4. Local-Qwen canary: reviewed sample from priority monographs; independent
   negative sample includes theory-only passages, anecdotes, TOCs and references.
   Report precision/recall with sample sizes rather than a universal claim.
5. Collection service and curriculum connector: versioned JSON/Markdown, stable
   IDs, original/adaptation separation. Unit 4 consumes only reviewed thematic
   matches and reports missing evidence explicitly.
6. Fresh cold review against exact code/artifact hashes and actual test receipts;
   amend and rerun failures. Only then mark a phase complete.

## Studio rule proposed for adoption

Before launching an unattended corpus job, prove one end-to-end reviewed result
with the installed tool versions. Freeze its input manifest; budget model work;
retain every failure; stop repeated configuration errors; count reviewed outputs
separately from retrieved passages; keep original evidence private. No model or
worker exit code can approve its own scholarly result.

## Evidence and handoff

Canonical experiment:
`creativity-techniques-uem/creativity-techniques-pedagogy/in-practice/`.
Read `pipeline.py`, `test_retries.py`, `RECOVERY-REVIEW-2026-09-22.md` and the
private runtime receipts for reproduction. Earlier operator reports are historical
snapshots, not live status. This report follows the studio harness requirement:
named artifacts, concrete checks, fresh review, and explicit unfinished gates.

The backlog is delivered to DevIAC for adoption. It does not claim that engine
maintainers have implemented or accepted these changes. No book extracts are
included in this developer report.
