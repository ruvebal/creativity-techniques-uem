# Source review — 2026-09-23

Private audit; no procedure, page or bibliography promotion.

## Lateral Thinking

Direct reading of the complete saved target node
daa3c770-02fa-55b2-8fba-7cd67b8192bc establishes an explicit completion condition:
generate alternatives until the preset quota is filled. Both Qwen canaries'
ending_present=false is therefore rejected for this target. The neighboring
geometric-figure classroom exercise is distinct and must not be merged with it.
The packet contains numbered instructions 1, 2, 3, then 6; locate 4 and 5 in the
original EPUB before describing that neighboring exercise as complete.

The representative record ee5763452911dbde91aa66a3 reports evaluator_safe=true
and an author/year/page citation, but scheme=pdf_order for an EPUB source.
Its page 17 is NOT established as a printed page. The saved metadata's editors
field also contains fragments of the author's biography misparsed as people.
These are independent metadata-quality issues despite the safe citation flag.
Preserve metadata as received; do not hand-edit the shared Ahmes database.

## Thinkertoys

Target 2b6c7daa-2595-5540-bce6-028aa152ce2f, record
6264b9c520cf962ba6143a5e: semantic quote ok, bibliography resolver BIBLIO-GAP.
Quotation fidelity is not citation approval.

Visual inspection of extracted images/023.png (figure node
1ba25fbd-4768-59b8-b038-0c26b8123db5) shows a decorative CHALLENGE graphic,
not procedural instructions. Thus figure presence alone does not establish
instructional significance. Other figures and the original pages remain unreviewed.
Correction to the earlier canary report: the packet has FIVE figure nodes, not six.

## Consequences for studio development

- Separate author/year resolver safety, full bibliographic validity and locator
  validity. EPUBs must not silently acquire PDF-style printed page citations.
- Detect numbered-step gaps, then inspect the source; do not invent missing steps.
- Require field-specific evidence for termination conditions. Model boolean
  judgements contradicted by direct source text must not become gate truth.
- Inspect visual content: figure markers may be decorative, substantive or broken.
- Reject biography prose as editor entities even if author/year gates pass.

Runtime references.json and REFERENCES.md are a source-level triage ledger,
not a finished references list. They preserve supplied metadata and representative
resolver results without fabricating Chicago entries. Continue source-witness
verification, missing-step localization and complete bibliography review.

## Missing-step localization completed — 02:06 UTC

Original EPUB member LateralThinking/xhtml/chapter007.html contains the complete
teacher procedure at fragments lat0000411–lat0000423: steps 1–3, branches 4a/4b,
step 5, step 6, and an image. The source-order canary aligns all eleven textual
paragraphs uniquely to Ahmes by exact text after whitespace collapse, preserving
full node records and XML fragments in runtime/review/epub-order-canary.json.

Confirmed ordering defect: steps 1–3 occupy SQLite rowids 346–348; branches 4a/4b
and step 5 occupy 2093–2098; step 6 is rowid 355. Source text is not missing from
Ahmes, but insertion order is NOT source reading order here. Full character-scan
coverage therefore cannot establish contiguous or complete procedure extraction.
The cause of the reordered insertion is not yet diagnosed.

The image reference at lat0000420 is preserved; its content is not yet inspected.
The EPUB also has explicit page_62 and page_63 anchors in this section. These are
source-embedded page labels, not yet verified against a corresponding print
edition, and must remain distinct from the resolver's pdf_order locator.

Studio correction required: retain EPUB spine/member/fragment source sequence in
Ahmes, and use it for context assembly. Never silently fall back to rowid when
source order has failed validation. Keep ambiguous text matches unresolved; this
canary's eleven unique matches do not establish a universal alignment algorithm.
Do not repair the shared SQLite database directly or alter the original records.
Next: generalize/test source-order assembly, then evaluate the corrected section
with local Qwen and fresh code review. Existing canary opinions remain superseded
as procedure-completeness evidence, not deleted.

## Source-order tests and cold review — 02:39 UTC

Nineteen offline tests pass. The alignment gate checks section shape, unique
fragments, unique Ahmes matches, exact normalized text and no reused node IDs.
Fresh local Qwen coder receipt: source-order-review-eb138206d731d1c1.json.
Advisory needs-amendment; triage:

- F1: nontext rows are constructed with no text matches by main; adding a
  validator check is useful future hardening, not a failure observed in this run.
- F2–F4: missing ZIP members, malformed/empty XML, failed reads and DB errors
  already raise before a new report is saved. Structured failure receipts would
  improve diagnostics; swallowing exceptions would weaken the current boundary.
- F5: more-than-two-match test is a useful extension, but the gate already checks
  length != 1, not just two. Current test exercises zero and two.
- F6: rejected: duplicate-fragment failure is explicitly exercised by the cited
  test. Coder findings must be checked against actual code, not accepted wholesale.

The corrected ordered-section review runs separately via review_ordered_section.py
with both pipeline/reviewer locks and its own process receipt. It cannot approve
records and is not covered by the earlier source-order code review snapshot.

The ordered-section Qwen review has finished. It now recognizes both classroom
branches and references all eleven supplied Ahmes UUIDs. However, step_labels
contains regenerated step prose rather than labels. The initial schema checked
only string-list shape and did not catch that contract violation. Keep the receipt
as a failed output-contract example; none of its prose is promoted to quotations.
The validator/prompt now restrict labels to 1,2,3,4a,4b,5,6. No repeated model
call was made merely to obtain a favorable answer.

Its claims about missing age, duration and figure type apply only to the bounded
packet, not the whole source. Unspecified classroom choices are not necessarily
defects in the author's method. This result supports recovered branch visibility,
not bibliographic validity or procedure approval. Next: inspect the referenced
visual and preceding material section, then assemble a source-grounded candidate
with original instructions separate from generated interpretation.

## Visual inspection and bounded candidate — 03:14 UTC

Inspected all three original figure assets via byte-identical Ahmes copies:
EPUB IMG_014 -> Ahmes 016.jpg (shape with four alternative interpretations),
IMG_015 -> 017.jpg (response histogram, A/B/C/D counts 11/8/2/12),
IMG_016 -> 018.jpg (circles-and-line example with alternative visual construction).
The mapping is SHA-256 verified, not inferred from filenames. These are substantive
instructional illustrations, not missing or merely decorative material.

Assembled runtime/procedures/lateral-geometric-figures.json: procedure, preceding
rationale and first material example in EPUB order; 28 source elements, 21 unique
text-to-node matches and three uniquely hash-matched images. Seven elements lack
a unique text match: three image-only elements, Material/Comment labels, the
repeated Alternatives label (15 possible nodes), and the final commentary paragraph.
Only unique matches contribute supporting Ahmes rows. Unresolved alternatives
remain explicit candidates, never silently assigned or cited.

The new candidate preserves original XML/text, full supporting table rows, image
hashes, source and member hashes, and generated interpretation in separate fields.
It is not an approved quotation/exercise and does not replace any original record.
The bounded candidate is not the full chapter. No duration, age or adaptation was
invented. Next: resolve the remaining paragraph/heading alignments, run semantic
quotation verification on the reconstructed procedure, bibliography/locator review
and fresh review of the assembler. All shared databases and source files unchanged.

## Alignment and edition audit — 03:48 UTC

runtime/review/lateral-source-adjudication.json records direct source findings:
the last commentary paragraph is Ahmes node 57ab20e1-6e0f-539e-b9b0-110f5efcda46,
with a dropped space at an inline page anchor. Located does not mean exact-aligned;
no silent normalization/quotation promotion. Material is a Markdown-formatted
heading; repeated Alternatives remains ambiguous. Original evidence unchanged.

Copyright member and Ahmes node af276511-3796-543d-94f7-bb0099e21c58 distinguish
Ward Lock Education 1970, Pelican 1977 and Penguin reprint 1990. Ebook release year
is unverified. ISBN matches node d6fd5ee9-e1e3-5ffe-9cf9-bf6bec43fbf5. Do not combine
1970 and Penguin as if they identify the same publication event. Ahmes concatenates
the line breaks and print-run number 35; original XHTML preserves the distinction.

Fresh local assembler coder review finished, but its twelve findings are largely
out of scope. F1/F2/F5/F7 describe exceptions that already abort before save.
F6/F8/F10 allege vector/model behavior absent from this deterministic assembler.
F9 demands whole-book extraction from an explicitly bounded candidate. F11 is
contradicted by retained full node/table rows. F12 would remove requested PRIVATE
provenance, not prevent publication. F3/F4 retain a useful requirement: explicit
image completeness status before approval; this run has three unique hash matches.

Root review-design flaw: inherited whole-pipeline acceptance criteria primed these
irrelevant findings despite the appended scope note. The assembler review prompt
is now standalone and scope-specific. It has NOT been rerun; do not label this
as independent approval. Preserve the original review receipt and triage.
Next: stricter per-candidate acceptance tests, semantic quotation gate (including
numbered-list refusals), final bibliography/locator decision. No full rescan.

## Existing quotation gate audited — 06:23 UTC

check_procedure_quotes.py ran semantic-quote on all eleven aligned procedure
nodes, max_hops=0, no force override, no LLM text generation. Result: seven
refusals (five numeral-marker heuristics, two short branch labels), four emitted
prose spans with complete boundary flags. Full receipts remain private in
runtime/review/procedure-quote-gates.json. These four spans do not constitute the
whole exercise. Existing procedure approval remains false.

The skill's prose-only refusal is now an experimentally demonstrated limitation
for this structured procedure, not a missing-source problem. A proposed separate
typed verifier and adversarial acceptance suite are documented in
STRUCTURED-PROCEDURE-GATE.md. The existing gate was not weakened, no refused text
was promoted, and no shared studio library was edited. Next: implement/test that
local structured verifier while continuing corpus bibliography/scope work. 
