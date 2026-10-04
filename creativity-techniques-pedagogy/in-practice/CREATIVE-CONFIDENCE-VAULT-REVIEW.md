# Creative Confidence: private working-vault decision

2026-09-28. Both book files rehash to
64e9e459427a6c50ebc2e3a45183218a09a189dbe3bf74d60ed3eb98d3f8cecc.
Both vault source rows carry that hash and the same source/document UUIDs.

The `..._2013_crown_business_64e9e459` extraction contains 1,361 nodes; the
`..._crown_business_2013_64e9e459` extraction contains 1,355. All 1,355 shared
node UUIDs have equal text, block type/subtype, original hash and document ID.
All shared spatial anchors are equal. The larger extraction adds six short
text nodes: v3.1, Cover, PREFACE, NOTES, SHOW ME and DRAW IT. No shared procedure
text discrepancy was found in this comparison.

Working decision: use the 1,361-node extraction for this private collection,
preserving the older vault as an alternate witness. This is a local selection,
not a shared-library canonicalization or deletion. The full read-only comparison
is `runtime/review/creative-confidence-vault-comparison.json`, including raw
source, metadata, node and anchor rows. No exercise or bibliography approval.

Next: implement an explicit hash-bound local vault override in the recovery
path; dry-run any required Athanor injection, then prepare/scan this source only.
Do not restart all 24 completed scans. The corrupt Beyond Productivity file
remains a separate unresolved input. New extraction must retain source ordering
and complete procedure context; scan counts alone will not establish recall.

DevIAC feedback: matching source hashes may produce duplicate vaults with
different extraction completeness. Compare stable node IDs, text hashes and
anchors, record the selected witness with rationale, and preserve alternates.
