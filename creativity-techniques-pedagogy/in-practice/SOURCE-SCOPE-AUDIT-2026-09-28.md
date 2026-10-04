# Private source-scope accounting

Update 10:31 UTC: nine nonmonograph exclusions are now adjudicated from explicit
Ahmes publication witnesses (runtime/review/genre-adjudication.json). The
Creativity and Innovation Management filename denotes publishing guidance
headed How to Get Your Research Published, not evidence of a journal article.
The other eight have journal article/review publication witnesses. They remain
outside the monograph extraction scope. Gill-Simmen's six-hat teaching article
and the Göçmen/Coşkun accepted manuscript contain practical leads for a separate
supplemental collection; genre exclusion must never mean no exercises exist.

Further DevIAC feedback: retain filename classification as a proposal, require
source-level genre witnesses, distinguish journal articles from material branded
with a journal name, and retain supplemental practice leads across scope filters.

Update 10:01 UTC: the derived current-source-state.json now reconciles all
24 conflicts. Supersession requires matching source hashes, matching prepared
database, validated scan gate, full recorded character counts, and preparation
before scan completion. Genre exclusions cannot be superseded by this rule.
35 offline tests pass, including negative identity, incomplete scan, missing
field, chronology and genre cases. Original receipts remain intact. This
reconciliation code still needs independent review; it approves no exercises.

All 36 inventoried files were rehashed successfully: 35 distinct source hashes,
24 with scan receipts, 11 without scans but with exclusion receipts, zero
unaccounted hashes, one duplicate-hash group. These are accounting figures,
not exercise recall or scholarly approval.

New defect: **all 24 scanned sources also retain exclusion receipts** from the
earlier ingestion failure. For example, Anna Craft's source has both an
`ingestion not verified` exclusion and a `validated-ids-bisect-v1` coverage
receipt. Consumers must not count directory entries as current exclusions.
Historical receipts are preserved. The audit exposes conflicts explicitly and
does not silently delete or approve them. Before closing coverage, bind current
source state to the successful preparation/scan receipt and mark old exclusions
superseded in a derived ledger.

The nine filename-classified articles/reviews now have private full Ahmes node
witnesses selected for publication/genre cues, retaining node data and database
paths. These witnesses support manual genre adjudication; they do not establish
that the sources contain no practical exercises. Two additional unscanned
source hashes remain the corrupt PDF and duplicate-vault case.

Receipt: `runtime/review/source-scope-audit.json`; reproducible read-only auditor:
`source_scope_audit.py`. Full text remains private. No model was called for this
deterministic accounting pass. No shared Ahmes/Athanor store was modified.

DevIAC feedback: stage receipts need explicit supersession, run identity and
current-state reconciliation. A later successful scan must retire an earlier
exclusion in the current view while preserving both historical receipts. Treat
conflicting receipts as a review condition, never infer current state by counts.
This report is local; external studio delivery is still pending.
