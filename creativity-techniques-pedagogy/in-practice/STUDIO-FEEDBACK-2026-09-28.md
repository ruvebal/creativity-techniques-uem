# In-practice: measured recovery and remaining engine defects

Private corpus run, 2026-09-28. This developer report contains no book extracts.

Recovery completed: 34 prepared source hashes, 25 scanned monographs, 6,790
saved node records, 6,773 active and 17 superseded. Mechanical verification
passed; 35 offline tests pass. These counts do not establish exercise recall.
Zero procedure approvals and zero approved bibliography entries remain.

## Reproducible issues and corrections

- Monitoring returned unchanged-state messages without successful inspection.
  Corrected by checking actual worker PIDs with permission when sandboxed,
  reading per-stage receipts, and executing the next pending step. Product
  requirement: distinguish observation failure, idle pending work and live work;
  never report a failed probe as evidence of no change.
- A coder review inherited a 2,600-token classification ceiling and truncated.
  One retry with concise findings and a bounded 6,000-token ceiling completed.
  Failure retained; five requested regression cases added. Product requirement:
  stage-specific output policy and immutable attempt records.
- Successful recovery retained 25 old ingestion exclusions. A private derived
  ledger now binds each to matching preparation and validated scan receipts;
  originals remain preserved. Product requirement: explicit receipt supersession.
- Filename genre rules misclassified publishing guidance branded with a journal
  name. Nine exclusions now have direct source witnesses. Two journal articles
  contain useful practice leads despite being outside monograph scope. Product
  requirement: separate genre, collection scope and exercise presence.
- Duplicate Creative Confidence vaults share 1,355 equal node IDs/text/anchors;
  one adds six short nodes. Selected the larger witness locally and recovered
  only that book. Product requirement: hash-bound witness selection and retained
  alternate extractions, rather than blanket duplicate rejection.
- Creative Confidence metadata uses an endorsement attribution as the title
  and Edison prose fragments as editors; the publication year is absent. EPUB
  package/copyright witnesses supply title, year, imprint and ISBNs. A private
  correction proposal retains the resolver gap; author order needs title-image
  inspection. Product requirement: prefer structured EPUB publication metadata,
  corroborate against title/copyright witnesses, reject endorsement/person-credit
  confusion and sentence-length editor fragments before metadata promotion.

## Next acceptance work

Support a non-destructive Ahmes correction receipt with old/new values and
source anchors; rerun the citation gate after correction. Keep EPUB locators
distinct from printed page numbers. Complete source-ordered procedure grouping,
visual/context review and a labelled recall benchmark. Preserve the existing
prose quotation gate and its refusals. The curriculum connector is active for
all units, but its selections must retain candidate/review status and classroom
adaptations separately. This report does not mark any SPI phase DONE.

Local evidence: in-practice runtime/review/creative-confidence-bibliography-adjudication.json,
current-source-state.json, genre-adjudication.json, membership-audit.json,
mechanical-verification-20260928.json, and recovery/process.json. Evidence stays
private; this report alone is suitable for the developer planning directory.
