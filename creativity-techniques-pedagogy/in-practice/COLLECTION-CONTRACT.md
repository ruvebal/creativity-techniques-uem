# Collection contract v1

Generation: Codex, 2026-09-21. Private research schema; no publication approval implied.

JSON is canonical. Per-record JSON supports precise edits and diffs; an aggregate JSON and Markdown view are derived. A future database is an index over these records, not a competing authority. Other projects reference stable `urn:in-practice:exercise:<digest>` identifiers.

Each record separates:

1. Source witness: file SHA-256, edition metadata with Ahmes confidence/method, full source rows, extraction DB path/hash, extraction timestamp, and bibliographic gaps.
2. Evidence: all contributing node UUIDs, original_content and markdown_content, spatial/semantic/geographic/entity rows where available, full processing history, quotation gate result, normalisation rule, resolver stdout. Full-vault data stays in Ahmes; per-exercise JSON retains every supporting row rather than claiming to copy unrelated vault contents.
3. Exercise interpretation: locally proposed name, type, tags, actionable rationale, neighbor-context flag. These are generated metadata, never author quotations.
4. Review: boundary completeness, procedural completeness, bibliography safety, OCR/page-image verification, rejected alternatives, reviewer, and date. `candidate` never means approved.
5. Application: original domain/problem if explicit; proposed classroom problem, language/medium/support, intended evidence, constraints, audience, duration only if stated or explicitly estimated. Unknown values remain null.
6. Curriculum relationship: course, unit, official content/objective references, thematic match score, method, model, rationale, decision status, and selected exercise ID. A similarity score is not a learning-outcome claim.

DH mapping: the textual procedure is CIDOC-CRM E73 Information Object. A performed exercise would be an E7 Activity; do not confuse the instructions with a historical performance. Controlled topics use SKOS Concept/ConceptScheme with URIs under `urn:in-practice:concept:` and `urn:in-practice:scheme:creativity-v1`. Use P2 has type for concept assignment, not layout block type. Retain original Ahmes semantics alongside proposed exercise tags. Add external Getty/Wikidata exactMatch only after authority verification; local tag similarity is not exact equivalence.

Future JSON-LD export should use PROV-O derivation/activity/agent records and Web Annotation TextQuoteSelector/TextPositionSelector for exact spans. Implement selectors against original extraction text with offsets and checksums; normalized display text must never masquerade as byte-exact source text.

Coverage: account for every scoped source and every textual block, negatives included. Count distinct files, hashes, works, editions, nodes, batches, proposed exercises, merged exercises, refusals, and verified exercises separately. Inspect images and numbered lists explicitly. Measure recall against a manually labelled held-out sample and chapter exercise indexes; never call top-k retrieval exhaustive.

Chicago references: retain resolver output and structured source metadata. Render a references list only from validated bibliographic records. EPUB spine index is a locator, not a printed page. Unresolved editions/authors/dates/locators remain BIBLIO-GAP. Public student adaptation requires a separate editorial selection and publication decision.
