# Ahmes metadata correction capability: concrete acceptance case

Creative Confidence's original EPUB title-page image confirms Tom Kelley then
David Kelley; copyright/OPF witnesses establish 2013, Crown Business (New York),
and eBook ISBN 9780385349376. The image byte hash matches the extracted witness.
Private evidence: runtime/review/creative-confidence-bibliography-adjudication.json.

Ahmes currently stores an endorsement attribution as title and sentence
fragments as editors. A fresh Chicago resolver call still emits BIBLIO-GAP.
CLI inspection found automatic enrichment/force-meta but no explicit curated
field correction command. Force-meta is documented to clear stale llm/slug
author/title coats, while the wrong title/editors use front_matter. Blindly
rerunning enrichment is not evidence that these errors would be corrected.

Requested supported operation: preview/apply a source-bound bibliographic
correction with before/after values, original metadata retained, witness node
and asset hashes, operator/reason/timestamp, and a reversible receipt. Support
ordered authors, removal of spurious editors, title/year/imprint/ISBN edition
distinctions. Rerun resolver and propagate corrected metadata to derived
catalogues explicitly, without overwriting historical source snapshots.

Acceptance: this book resolves with its verified title and author order;
endorsement attribution and prose editor fragments no longer reach citations;
EPUB location never becomes a fabricated printed page. Citation approval must
remain separate from exercise completeness and publication permission.

This is a capability request and measured defect, not a shared-store fix.
Collection work can continue on procedure context and other bibliography entries.
