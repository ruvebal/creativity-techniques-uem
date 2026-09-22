# In-practice — operator feedback, 2026-09-21

Generation: Codex orchestration from live CLI/source inspection. Local Qwen extraction is in progress. This is an initial field report, not a completed benchmark.

## Possible today, checked

Ahmes supports PDF/EPUB extraction, NER and semantic anchors, source-hash identity, page/node queries and Chicago citation gates. Athanor lists both creativity projects, supports scoped search and single/manifest injections with dry-run. Ollama has Qwen 32B instruct, coder 32B and nomic embeddings. Existing Kleon/de Bono books resolve by source SHA-256. The pipeline records local model tokens, immutable source IDs and quote gate results without moving book text to cloud inference.

## Findings and proposals

| ID | Evidence | Improvement and acceptance |
| --- | --- | --- |
| F1 | Ahmes OllamaAdapter semantic call hardcodes qwen2.5:3b at line 130 | Add explicit model/decoding configuration; persist effective model/digest per stage; command option must change actual request |
| F2 | Current CLI uses --library; older skills say --vault; enrich has no --embed | Generate CLI examples from tested command contracts; CI execute documented help probes |
| F3 | Read-only SQLite access failed on WAL files under sandbox, succeeded with proper filesystem permission | Surface permission failure distinctly from absent extraction; never trigger duplicate ingest on unreadable store |
| F4 | Two Creative Confidence paths share one hash and resolve to two vaults | Canonical witness registry with deterministic alias resolution and retained provenance; query cannot silently choose first match |
| F5 | semantic-quote rejects leading numbered items as potential junk | Add exercise-specific structured-list verification; validate against numbered instructions, TOCs and footnotes; keep prose safety unchanged |
| F6 | Similarity search top-k is not exhaustive | Add corpus enumeration/coverage API, negative decisions and held-out recall audit; report vector-only and full-scan yields separately |
| F7 | Paragraph/node boundary is not exercise boundary | Add procedure-span model with prerequisite, prompt, numbered steps, example, stopping condition, and linked diagram regions |
| F8 | EPUB node page indexes need edition-aware interpretation | Expose locator kind (PDF index, printed page, EPUB spine/href/fragment); never synthesize print pagination |
| F9 | Current useful stages require CLI glue and long waits | Durable task queue with per-stage receipts, leases, retries, cancellation, model concurrency budget and event subscription |
| F10 | Quote fidelity, citation safety, procedural completeness and classroom fitness are distinct | Separate gates/metrics rather than one confidence number; expose reasons and review history |
| F11 | Collection must serve multiple curricula | Stable JSON/JSON-LD contract, SKOS vocabulary, PROV derivations, separately versioned curriculum-match relations |
| F12 | Raw book passages must stay internal | Private evidence store; public renderer consumes explicitly approved adaptations only; automated leakage check |

## Proposed benchmark

Label a held-out stratified sample: numbered exercises, unnumbered habits, embedded prompts, diagram tasks, TOCs and cross-page procedures. Report precision/recall with sample size, missing-image rate, source-span fidelity, bibliography-safe fraction, tokens/time per source, and duplicates merged. Save failures as fixtures. No numerical result is claimed yet.

## What to build toward

An instructor asks: “Find a 20-minute exercise for reframing a workplace conflict, usable without software.” The engine returns candidates with original-domain evidence, stated versus inferred duration, exact source witnesses, a curriculum fit explanation and a clearly separated adaptation. It also reports which books were searched completely and which remain unreadable. A later source correction invalidates only affected selections through provenance links.

That requires retrieval plus coverage accounting, procedure segmentation, trustworthy edition identity, and review workflows. Larger models alone do not supply those guarantees.

Canonical current experiment: creativity-techniques-uem/creativity-techniques-pedagogy/in-practice. Runtime/status.json and command logs are the live receipts. Update this report after ingestion and cold review; preserve failed hypotheses.

## First measured iteration

Thinkertoys extraction completed with 3,345 blocks. Ahmes metadata inference recorded two request timeouts during the first pass; exit success must be checked against actual metadata quality, not assumed sufficient.

A 12-hit Athanor query was joined by source hash and full node UUID to Ahmes. All 12 passed the mechanical quotation gate; 9 had evaluator-safe citations and 3 did not. These are retrieval/evidence counts, not 12 approved exercises. The highest-ranked result discussed lateral techniques generally and was from Six Thinking Hats: semantic proximity did not imply exercise specificity.

Fresh Qwen coder 32B review consumed 4,214 prompt tokens and 908 output tokens in 202.2 seconds. It proposed eight findings. Triage accepted stronger preparation-state gating and character-coverage accounting; rejected advice to delete failed sources from inventory or remove required quotations from private output. This demonstrates why a local critic is useful but cannot certify its own advice. Raw review is retained; no fictional test executions were attributed to it.

The semantic-quote synthetic fidelity suite passed 27/27 tests. Full collection review and recall benchmarking remain pending. The amended runner was restarted as PID 53302 after stopping only its owned predecessor and child; extracted vaults were retained. A thread follow-up checks background progress every 30 minutes and continues the authorized work.
# Recovery observation — 2026-09-22 Europe/Madrid

Follow-up at 01:59: 33 source preparation reports passed (21 injected, 12
unchanged); 12 Athanor queries parsed successfully. Local Qwen full-text scanning
then exposed two recoverable output failures: truncated Thinkertoys output and
malformed Whack 1990 output. Bounded batch bisection is implemented for the next
worker run, with four offline tests (coverage offsets, split recovery, invalid ID
rejection, and no bisection on connection failure). It has not yet been validated
against these live failures or freshly reviewed by coder32. The existing worker
continues on other sources, avoiding concurrent model workloads.

Developer expectation: typed model-output failures should trigger bounded smaller
requests rather than abandon an entire monograph; retain child prompt digests and
never count a partially successful batch as covered. Bisection improves recovery,
not procedural recall: heading/context expansion is still needed separately.

The first complete unattended run exposed an operator integration defect:
`athanor inject DB --dry-run` is rejected; the flag requires `--from-manifest`.
The worker recorded 35 preparation failures and produced no full-text exercise
scan. Earlier enrichment succeeded for many sources and is retained. This is not
a corpus-quality verdict or a successful ingestion milestone.

Recovery uses private single-source manifests, explicit missing/invalid/failed
report gates, and successful enrichment receipts. Eight synthetic report checks
and compilation passed; fresh local coder review remains due. Repeated-command
logs also polluted JSON parsing: callers now receive only the latest subprocess
output, while the complete log remains retained for audit.

Proposals: validate CLI capability combinations before any expensive enrichment;
provide a uniform plan command for single and batch sources; stop on repeated
configuration failures rather than spending hours repeating them; require parsed
reports and phase counters in heartbeat health checks. A process finishing is not
an ingestion milestone. These are expectations, not claims of implemented engine
features.

Fractal-architect learning: its formula candidate workflow preserves surrounding
context, source identity, and separate discovery/fidelity/usefulness gates. For
in-practice, prioritize headings but retain full-text coverage; widen context to
include setup, steps and stopping conditions; retain exact node spans; distinguish
sentence completeness from procedure completeness. That enhancement is still
pending implementation and local-model validation. A heading is a retrieval cue,
not proof that a usable exercise has been recovered.
