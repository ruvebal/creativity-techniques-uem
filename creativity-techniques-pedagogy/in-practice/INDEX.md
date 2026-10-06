# In-practice

Private, reusable catalogue of creativity exercises grounded in supplied monographs.
JSON is the editable machine record; Markdown is a generated reading view. No YAML editing is required.

**Canonical techniques (EX7, 2026-10-06):** Lab exercises are chosen from [`CANONICAL-TECHNIQUES.yml`](CANONICAL-TECHNIQUES.yml) (reading view [`CANONICAL-TECHNIQUES.md`](CANONICAL-TECHNIQUES.md); per-unit export [`CANONICAL-TECHNIQUES-BY-UNIT.yml`](CANONICAL-TECHNIQUES-BY-UNIT.yml); pipeline [`canonical/`](canonical/README.md)) — generated, private, never published.

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

### Research pack — neural / Athanor / Ahmes → articles & forge (2026-09-29)

Durable reports (not chat-only) for authors, works, ideas, gaps, procedure, feedback, and Lab forge reach:

| Doc | Role |
| --- | --- |
| [`runtime/teaching-suitability/research/INDEX.md`](runtime/teaching-suitability/research/INDEX.md) | Pack map |
| [`…/RESEARCH-REPORT-neural-inventory-graph-2026-09-29.md`](runtime/teaching-suitability/research/RESEARCH-REPORT-neural-inventory-graph-2026-09-29.md) | Inventory × vectors × graph × Ahmes |
| [`…/GUIDE-usage-vectors-athanor-ahmes-graph.md`](runtime/teaching-suitability/research/GUIDE-usage-vectors-athanor-ahmes-graph.md) | Operator usage guide |
| [`…/FEEDBACK-RESULTS-2026-09-29.md`](runtime/teaching-suitability/research/FEEDBACK-RESULTS-2026-09-29.md) | Run feedback + open tickets |
| [`…/PEDAGOGY-FORGE-CONNECTOR.md`](runtime/teaching-suitability/research/PEDAGOGY-FORGE-CONNECTOR.md) | Reach into next CT lessons / Labs |
| [`runtime/teaching-suitability/EXERCISES-VALIDATED.md`](runtime/teaching-suitability/EXERCISES-VALIDATED.md) | Model shortlist + HITL |
| [`runtime/teaching-suitability/ATHANOR-AHMES-E2E-REPORT.md`](runtime/teaching-suitability/ATHANOR-AHMES-E2E-REPORT.md) | Earlier E2E run log |

Private only — do not publish `runtime/` to Pages. Lab selection still follows PHASE-IP4 + `ct-unit-forge` §0.8.

### Review recovery — 2026-09-28

2026-10-04 evening: U4 lesson + deck pilot shipped (operator prose after
Thessia audit). Lab = Ask a Crab diverge + Wall of Ideas select (hybrid
adaptation disclosed). Receipt `forge/receipts/U4-LAB-IN-PRACTICE-2026-10-04.md`.
Adjudication `runtime/review/u4-thinkertoys-adjudication.md`. No procedure
approval; Michalko locators remain pdf_order; Lucas cite not evaluator-safe.

2026-10-04 16:06 UTC: source-hash-bound U4 Thinkertoys packet assembled and
local Qwen 32B context review started (PID 20692; verify actual process).
See `runtime/u4-thinkertoys-review-20261004/process.json`. Full original PDF
context and six live nodes supplied, including all five Ask a Crab steps.
Await model/source adjudication; no approval, publication or ledger increment.

2026-10-04 U4 candidate audit: Picture Prompting is only step 3 of the five-step
Ask a Crab blueprint. Original PDF context and all five live nodes inspected;
see `runtime/review/u4-discovery-20261004/SOURCE-CONTEXT-AUDIT.md`. Preserve
the complete sequence before adapting or model-reviewing. Wall of Ideas context
also checked; do not borrow adjacent exercises' timings. No procedure approval,
new model run or U4 publication; source packet and locator verification next.

2026-10-04 coverage reconciliation: eight accepted-format runs plus one separately
recovered-format assessment now map all 14 Lateral Thinking shortlist nodes.
See `runtime/review/section-review-ledger-20261004.json`. All prior packet,
review, adjudication and record hashes revalidated. The remaining 48 of 62
shortlist nodes are outside this bounded ledger, not necessarily unreviewed.
EPUB locator conflicts and procedure/publication approval remain open. No
extraction/model worker launched; U4 lesson/deck and Thessia audit still pending.

2026-10-04 design review completed and adjudicated against full source context;
see `runtime/review/design-adjudication.md`. Two targets retained with their
distinct fidelity status. Coverage reconciliation with recovered Pictures is
next; no exercise/publication approval or corpus-completeness claim.

2026-10-04: Pictures retry produced model output but failed the required JSON
list contract. See `runtime/review/pictures-schema-failure-20261004.md`.
Failure/raw result preserved; coverage remains seven accepted-format runs/11 IDs,
not procedure approvals. Collection incomplete.

2026-10-03 accounting: seven completed local section-review runs hash-linked
to 11 of 62 shortlist IDs in `runtime/review/section-review-ledger-20261003.json`.
51 are outside this limited ledger, not necessarily unreviewed. Historical
nine-ID ledger preserved. Three Lateral entries remain unmapped: Design Process
with Children, Design Exercises, Interpret Ambiguous Picture. No approval.

2026-10-03 retry completed: fractionation/analogy local Qwen review succeeded;
optional-variant conflations adjudicated against both source sections. See
`runtime/review/fraction-analogy-adjudication.md`. Reconcile the two-ID run into
a new ledger next; nine-ID snapshot unchanged. No procedure/publication approval.

2026-10-03: fractionation/analogy source verification saved, but local Qwen
review failed during model startup (HTTP 500). See
`runtime/review/fraction-analogy-adjudication.md` and preserved attempt under
`runtime/fraction-analogy-review/`. No duplicate worker or completed review;
ledger remains nine mapped IDs/six runs. Collection and coverage review incomplete.

2026-10-02 reconciliation: September 30 Identify Entry Points/Rephrasing review
now adjudicated and hash-linked. Six completed local runs map to nine shortlist
records; 53 are outside this limited ledger, not necessarily unreviewed. See
runtime/review/section-review-ledger-20261002.json and
runtime/review/identify-rephrase-adjudication.md. No new inference or approvals.

2026-09-30 accounting: five recent completed section-review runs hash-reconciled
to seven shortlist records; 55 remain unmapped in this bounded ledger, not
necessarily never reviewed. Nine source groups in the 62-node shortlist. See
runtime/review/SECTION-REVIEW-COVERAGE-20260930.md for explicit queue and limits.

2026-09-30 execution: two label exercises source-verified and reviewed by local
Qwen; both have setup/steps/ending. Historical topic suitability is a separate
adaptation gate. Delayed model call returned; no duplicate started. See
runtime/review/labels-adjudication.md. EPUB citation conflict remains; no approval.

2026-09-29 18:01 UTC heartbeat: section-2 random-word full packet and referenced
word list reviewed locally; exact original/live target match. Optional endings
and reverse-inference branch retained; Qwen missed the supplied word-list
dependency. See runtime/review/different-words-adjudication.md. Citation conflict
persists, no approval. Next separately numbered label exercises.

2026-09-29 17:31 UTC heartbeat: all 14 Lateral Thinking shortlist nodes uniquely
located in original EPUB and checked against live nodes; 11 exact, three
whitespace-only diagnostic matches. All 14 retain citation-locator conflicts.
Identical random-word names span distinct numbered exercises. See
runtime/review/lateral-shortlist-coverage.md. No whole-book completeness claim.

2026-09-29 17:01 UTC heartbeat: reviewer-reliability supplement delivered to
DevIAC and byte-verified. [STUDIO-REVIEW-QUALITY-2026-09-29.md](STUDIO-REVIEW-QUALITY-2026-09-29.md)
records three reviews and ten proposed synthetic regression cases. No book
extracts transferred; tests are proposed, not implemented. No phase approval.

2026-09-29 16:31 UTC heartbeat: Same Problem, Different Entry Points complete
EPUB section verified against live node; exact target match, concrete inputs and
closing discussion present. Local Qwen false missing-ending claim rejected.
Live citation still has EPUB/pdf_order conflict. See
runtime/review/entry-points-adjudication.md; no approval or publication.

2026-09-29 16:01 UTC heartbeat: fresh local coder review now includes cache
store; four findings adjudicated as contradicted or insufficiently demonstrated.
40 tests pass. No acceptance or production change; see
runtime/review/cache-rereview-20260929.md. Continue substantive source review.

2026-09-29 15:31 UTC heartbeat: two random-word shortlist nodes verified as
variants of one numbered source section. Full-section local Qwen review finished;
its false missing-numbering/timing claims rejected against original evidence.
See runtime/review/random-word-family-20260929.md. Both raw records retained;
62 remains a node shortlist count, not an approved procedure count. No approval.

2026-09-29 12:31 UTC: STUDIO-FEEDBACK-2026-09-29.md delivered to DevIAC
docs/DEV_PLAN/IN-PRACTICE and byte-compared successfully. Ten defect/prevention
contracts plus curriculum connector acceptance proposal; no book extracts,
no SPI phase promotion. Recorded workers absent. Source review remains incomplete.

2026-09-29 12:01 UTC: original Blanks context read, including worked example and
multiword-gap clarification. Existing automatic-writing tag unsupported; suggested
analytical tags recorded separately. Local Qwen context reviewer PID 16707 launched
12:02 UTC; inspect runtime/blanks-context-review/process.json. No approval.

2026-09-29 11:31 UTC: Blanks Exercise uniquely located in original EPUB
chapter021.html#lat0002194, source hash and live node checked. Original has an
internal word space removed by Ahmes; diagnostic locator is not verbatim approval.
See runtime/review/blanks-locator-note.md and blanks-source-locator.json.

2026-09-29 11:01 UTC: shortlist evidence inventory saved (62 candidates, 42
without saved safe citations, 17 EPUB/pdf_order conflicts, two truncated scorer
excerpts). One quote-rejected numbered exercise checked against live Ahmes:
junk-filter false positive; no override applied. See runtime/review/shortlist-gates.json
and shortlist-evidence-triage-20260929.md. No exercise or bibliography approved.

2026-09-29 10:31 UTC: cache schema/identity validation hardened; all 6,790 saved
verdicts pass read-only validation, 40 tests pass. No production data overwritten.
See runtime/review/cache-validation-20260929.md. Next prioritize substantive
source review of 62 candidates; no full scan rerun. No workers launched.

2026-09-29 10:01 UTC: coder reviewer exited; five advisory findings adjudicated
in runtime/review/suitability-review-adjudication-20260929.md. Confirmed export
exception receipt bug fixed and regression added; 39 tests pass. Cache validation
and HITL roundtrip review remain open; generic model claims are not acceptance.
No procedure promoted, no production reports overwritten.

2026-09-29 09:31 UTC: suitability worker exited; 6,790 verdict IDs reconcile
with all saved records. Recovered Markdown contains all 62 shortlist IDs, all
active. Original final-export crash remains in log; recovery independently
checked, not a clean original exit. 38 tests pass. Fresh coder reviewer PID 30525
started 09:32 UTC; inspect runtime/review/process.json before more inference.
See runtime/review/suitability-reconciliation-20260929.md. No scholarly approval.

20:01 UTC: broader process inspection found a live suitability worker, PID 67914
(started 18:05 UTC), not covered by older extraction PID checks. Receipt:
runtime/teaching-suitability/process.json; observed 870 seen, 833 scored, 37 cached,
zero reported scorer errors. Defer competing local coder jobs. Read
runtime/review/monitor-20260928-2001.md for coverage/truncation caveats and next gates.

19:31 UTC: missing-record shortlist omission fixed, 38/38 offline tests pass.
See EXPORT-GAP-2026-09-28.md: cache resume itself works; a missing raw record
must remain visible as a gap, never fabricated evidence. No production export
regenerated and no exercise promoted. Independent coder review remains pending.

19:01 UTC: recorded workers verified exited. Alignment diagnostic corrected:
68 unique whitespace-loss matches and three ambiguous duplicate matches, not
three missing passages. Five referenced images visually inspected; observations
at runtime/review/challenge-visual-adjudication.md. No procedure promoted.
Next: resolve live node ambiguity and external guide dependency; citation gap remains.

15:31 UTC: all ten chapter-seven reviews finished; worker verified exited.
Direct source checks overturned two missing-requirement claims. Of 71 unmatched
text elements, 68 have unique whitespace-loss candidates; three remain unresolved.
See CHALLENGE-REVIEW-2026-09-28.md. Next inspect remaining alignments/images;
do not treat diagnostic whitespace removal as verbatim quotation approval.

15:02 UTC: identified ten explicit numbered challenges in Creative Confidence
chapter 7. Source-ordered packet assembly and local Qwen review launched as
PID 17495; inspect runtime/challenge-review/process.json before model work.
Packets retain original paragraphs, Ahmes matches (including ambiguities),
image hashes and section boundaries. Model judgements are advisory; source
alignment, image inspection and bibliography remain independent gates.

14:31 UTC: Creative Confidence title-page image inspected and byte-matched;
author order verified as Tom Kelley then David Kelley. Private source-verified
reference saved, but fresh resolver still returns BIBLIO-GAP. See
BIBLIO-CORRECTION-REQUEST-2026-09-28.md for supported correction requirements.
Next: independent procedure-context review and remaining bibliography while
the source-backed metadata correction route is addressed.

14:01 UTC: recovered-source bibliography review found an endorsement stored as
title and prose fragments stored as editors. Original EPUB publication witnesses
are recorded in runtime/review/creative-confidence-bibliography-adjudication.json;
author order needs title-page image inspection before supported correction and
resolver rerun. STUDIO-FEEDBACK-2026-09-28.md delivered to DevIAC's IN-PRACTICE
planning directory and byte-compared successfully. No book extracts delivered.

13:31 UTC follow-up: Creative Confidence recovery finished 12:09 UTC; PID exited.
25/25 batches covered 426,506 extracted characters and produced 274 provisional
node records. Athanor receipt reports one unchanged document, zero failed.
Mechanical verification passes for 6,790 saved records across 25 scanned sources;
membership: 6,773 active, 17 superseded, zero missing/unaccounted or errors.
Active exports refreshed. All 35 tests pass. One unresolved ingestion failure
remains (corrupt Beyond Productivity); bibliography/procedure review is open.
Next: review recovered source context and bibliography; deliver studio feedback.

11:32 UTC: single-source Creative Confidence recovery started as PID 18672.
Check runtime/recovery/process.json and actual PID; it holds pipeline and review
locks. It verifies the chosen vault against the comparison, uses sanctioned
enrichment and dry-run/live injection, then local Qwen scanning for this hash
only. Historical inventory/failures remain unchanged. After completion verify
new records and refresh membership/active exports and source-state ledgers.

11:01 UTC: Creative Confidence duplicate witnesses compared read-only. All
1,355 shared nodes and their anchors agree; one extraction has six additional
short text nodes. Select the 1,361-node witness locally; see
CREATIVE-CONFIDENCE-VAULT-REVIEW.md. Recovery preparation/scan is still pending;
no shared vault change or new exercise approval occurred.

10:31 UTC: nine genre exclusions adjudicated against direct Ahmes publication
witnesses in runtime/review/genre-adjudication.json. Eight are journal articles
or a review; one is publishing guidance mislabelled by the filename heuristic.
Retain them outside the requested monograph extraction scope, without claiming
they lack exercises. Two Six Thinking Hats articles are supplemental practice
leads. Next: resolve duplicate-vault identity and bibliography for monographs.

10:01 UTC: derived current-source-state.json reconciles all 24 historical
ingestion exclusions against matching preparation and later validated scan
receipts. Zero unresolved receipt conflicts; 11 unscanned exclusions remain.
All 35 tests pass. Original receipts are preserved; no scholarly approval.
Next: adjudicate nine genre exclusions and two ingestion gaps, then bibliography.

09:31 UTC: source-scope audit rehashed all 36 files (35 hashes). All hashes are
accounted for, but all 24 scanned sources also have historical exclusion
receipts. See SOURCE-SCOPE-AUDIT-2026-09-28.md and the private source-scope-audit
receipt. Next reconcile superseded exclusions in a derived view, then adjudicate
nine genre exclusions and bibliography. Do not delete historical receipts.

09:01 UTC: five coder-requested regression cases added; 31 offline tests and
diff check pass. Production verifier is unchanged. See POST-EXTRACTION-TRIAGE.md.
Next: bibliography/source-scope and substantive procedure review. No approval
or completeness claim follows from these tests.

The retry (PID 75635) has now finished: needs-amendment, five test-coverage
findings triaged in POST-EXTRACTION-TRIAGE.md. Read the result path in
runtime/review/process.json; no reviewer remains pending in this handoff.
Next: bounded missing negative tests, then bibliography and source-scope review.

08:32 UTC update: review PID 20632 failed at the 2,600-token output ceiling;
failure preserved in runtime/review/failed-review-20632.json. Its exit was
verified. One bounded retry is running as PID 75635, with at most five concise
findings and a 6,000-token ceiling. Inspect runtime/review/process.json next.
All 26 tests and git diff --check passed. No approval gate has closed.
PHASE-IP4.md now defines the active catalogue selection policy for **all units**;
the older phase table's blocked/Unit-4-only wording is historical.

Fresh process inspection confirmed extraction PID 48350 has exited. Earlier
heartbeat replies did not consistently perform successful checks or advance
review; they are not evidence of continued processing. All 26 offline tests
passed again. A bounded Qwen coder 32B review of structured_fidelity.py and its
tests started at 08:03 UTC, PID 20632; inspect runtime/review/process.json and
the actual PID before further model work. Collect and triage its immutable
structured-fidelity-review receipt next. No collection approval follows.

### Current state — refreshed 2026-09-22

Extraction has ended. Worker 48350 and reviewer 74328 are no longer running
(verified by process inspection). Latest coder receipt:
`runtime/review/coder-review-e48937e9f8405514.json`; findings triaged in
[POST-EXTRACTION-TRIAGE.md](POST-EXTRACTION-TRIAGE.md).
Mechanical verification passed across 6,516 records. All 24 scan receipts use the
stronger gate. Membership audit: 6,499 active, 17 superseded, zero unaccounted or
missing selected records. There are no procedure-approved exercises.

Separate active-only views are generated by export_active.py under
runtime/EXERCISES-ACTIVE.md and runtime/exercises-active.json. Original records
and the historical aggregate are preserved. Fresh local helper review
`runtime/review/helper-review-17334666c86c03af.json` is triaged in
POST-EXTRACTION-TRIAGE.md. Subsequent hardening binds records to audit hashes,
requires audit fields and refuses missing/empty coverage inputs. These amendments
have regression tests but are not independently approved. Prioritize expanded
procedure-context sampling next; do not repeat the full extraction.

Expanded-context baseline now assessed one target each in Thinkertoys, Steal Like
an Artist and Lateral Thinking (17 nodes each), with local Qwen 32B. No original
records were promoted. See [CONTEXT-CANARY-REVIEW.md](CONTEXT-CANARY-REVIEW.md) for
observed structural/visual omissions and contradictory assessments. A structured
same-target comparison uses runtime/context-sample-v2/process.json; check its
actual PID before any model job. Preserve both runs, not just favorable results.
Both three-target runs have now finished; results are compared in
CONTEXT-CANARY-REVIEW.md and runtime/review/context-comparison.json. One target's
actionability changed, but false visual-absence claims persist. No promotion.
Next: source-section/image inspection and a manually labelled benchmark, not
another prompt-only retry or full scan.

Source adjudication: [SOURCE-REVIEW-2026-09-23.md](SOURCE-REVIEW-2026-09-23.md).
Direct reading overturned the quota target's missing-ending judgement; one
Thinkertoys figure was inspected and is decorative. Private references.json /
REFERENCES.md now inventory 24 scanned sources: 10 representative resolver-safe
samples, eight EPUB/pdf_order locator conflicts, zero approved references.
This is a triage ledger, not a completed bibliography or all-record audit.
Missing Lateral Thinking steps are now located: all eleven section paragraphs
match Ahmes, but steps 4a/4b/5 occur around rowid 2093 while steps 1–3/6 occur
around 346–355. See runtime/review/epub-order-canary.json. SQLite insertion order
is invalid for this section's context assembly. Next: source-order reconstruction
and its tests/review; no full rescan or shared-database edits.
Source-order tests and local coder review are now complete/triaged (19 tests).
The ordered-section local Qwen review recognizes the recovered branches, but
violated its label-only output contract. Retained privately as a failure case;
no generated prose was promoted. See SOURCE-REVIEW-2026-09-23.md. Next: inspect
referenced visual/material section and assemble a bounded source-grounded candidate.
That bounded candidate is now runtime/procedures/lateral-geometric-figures.json:
28 source elements, 21 unique text matches, three visually inspected/hash-matched
figures. Unresolved headings/commentary remain explicit. Not approved or published.
Next: remaining alignment, semantic-quote, bibliography/locator and assembler review.
The remaining paragraph is now located with an extraction whitespace discrepancy;
publication history is separated into 1970/1977/1990 events in
runtime/review/lateral-source-adjudication.json. Assembler coder review completed
and was triaged; inherited review criteria caused out-of-scope findings. Standalone
review prompt corrected but not rerun. No candidate or bibliography approval.
Quotation audit now measured: 7/11 procedure nodes refused by the existing prose
gate, four prose spans emitted; no overrides. See runtime/review/procedure-quote-gates.json
and STRUCTURED-PROCEDURE-GATE.md. A separate typed verifier is proposed, not yet
implemented. Preserve prose-gate refusals and all independent approval gates.
The first structured fidelity implementation now passes for the allowlisted
Lateral Thinking section: 11 text nodes, 3 image nodes, step sequence
1/2/3/4a/4b/5/6, and 26 tests. See STRUCTURED-PROCEDURE-GATE.md and the private
receipt under runtime/review/structured-fidelity.json. It is not a general parser
or approval.

Two ingestion failures remain. Do not restart the full scan. Continue IP3 review,
expanded-context work and bibliography/coverage audit; then the curriculum connector.
Private reports: [runtime index](runtime/INDEX.md), [progress](runtime/PROGRESS.md),
[machine snapshot](runtime/PROGRESS.json). These links are internal only.

The timestamped notes below are historical receipts, not instructions to relaunch
old processes. This current-state section and refreshed runtime reports take precedence.

### Current handoff — 2026-09-22 19:33 UTC

Extraction worker 48350 finished at 17:04 UTC and is no longer alive. Do not
restart the full corpus scan. Final recovery pass has two ingestion failures,
zero terminal scan failures, and 24 validated source scan receipts. Prepared
sources: 33 of 35 distinct hashes (36 files); reconcile article/review exclusions
separately rather than interpreting 24/35 as a recall estimate.

Saved records: 6,516; 1,726 candidates and 4,790 needs-review. No procedures are
approved. `reconcile.py` found 6,499 active node-record memberships and 17
superseded records, zero unaccounted records and zero missing selected-node
records. Evidence remains untouched. Use runtime/review/membership-audit.json
to filter active membership; the old aggregate still includes superseded records.

Post-extraction work actually started: mechanical verifier PID 74150 (exec session
14237) completed successfully: 6,516 records, 24 scan receipts, zero mechanical
failures. Fresh local Qwen coder review PID 74328 (session 7666) is running. Check these
actual PIDs before any additional model job; process.json still names the exited
extraction worker. Review output is under runtime/review/coder-review-<hash>.json.
The new reconciliation helper was added after that review snapshot and needs its
own tests/review. Compilation and diff checks passed, not a completeness audit.

Next: collect verifier and coder outputs, triage; implement/test expanded context
and procedure review on a priority-book sample; bibliography and coverage review;
resolve duplicate witness and corrupt-input exclusions; curriculum connector.
The completion-to-review transition was delayed until explicit resume; do not
describe heartbeat scheduling as an instantaneous or guaranteed trigger.

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
| IP1 | [PHASE-IP1.md](PHASE-IP1.md) | extraction, semantic enrichment, injection | VERIFYING / PARTIAL: 33 prepared hashes; two failures |
| IP2 | [PHASE-IP2.md](PHASE-IP2.md) | vector discoveries and full-text exercise candidates | VERIFYING: 12 queries, 24 validated scans; context/recall pending |
| IP3 | [PHASE-IP3.md](PHASE-IP3.md) | verified passages, references, reviewed collection | IN_PROGRESS: mechanical check passed; substantive review pending |
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
- `runtime/teaching-suitability/`: scored/validated shortlists, HITL `review-notes/`, E2E report.
- `runtime/teaching-suitability/research/`: neural/inventory/graph research reports, usage guide, feedback, pedagogy forge connector (2026-09-29).

The worker's `awaiting_review` state means processing has ended, not that the catalogue is complete. The cascade closes only after independent review. Do not push runtime extracts to a public repository.
