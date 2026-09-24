# Structured procedure verification — proposed acceptance contract

Status: proposed, not implemented or approved. Private research infrastructure.

Measured regression: runtime/review/procedure-quote-gates.json. Existing
semantic-quote refuses 7/11 source-aligned nodes: five numbered steps and two
short branch labels. Four prose nodes pass. No force override was used, and
max_hops=0 prevents joining by the demonstrably invalid SQLite insertion order.

Do not change the existing prose gate to accept every numbered item. Its footnote,
TOC and boilerplate exclusions must remain. Provide a separate typed procedure
verifier whose output is not an ordinary prose quotation approval.

Required inputs:

- Original file hash; EPUB spine/member/fragment order or verified PDF reading order.
- Explicit bounded procedure with all branches and setup/result dependencies.
- Exact source spans and complete Ahmes node IDs/rows; ambiguity remains unresolved.
- Figure references, content hashes and visual-review decisions.
- Separate bibliography and locator decisions; no inherited page-number approval.

Required checks:

1. Re-read source spans and compare exact characters under a declared normalization.
   Never repair OCR, punctuation or missing spaces without an explicit discrepancy.
2. Verify source order independently of rowid and detect missing/duplicated/reordered
   steps. Accept explicit branches such as 4a/4b; do not invent a plain step 4.
3. Differentiate procedural lists from TOCs, references and footnotes using source
   section evidence. A model opinion or numeric marker alone cannot decide this.
4. Preserve original wording, list structure and images separately from editorial
   names, interpretation and classroom adaptations.
5. Report text fidelity, procedure completeness, image completeness, citation
   validity and teaching suitability as independent gates. No all-purpose boolean.
6. Retain the original prose-gate refusals alongside the structured verifier result.

Regression suite before approval: this geometric-figure section; a numbered TOC;
a footnote; missing step; shuffled insertion order; duplicate labels; repeated
headings; changed negation; a missing image; an inline-anchor whitespace loss;
EPUB synthetic versus source-embedded page labels. Include both passing and
failing fixtures and a fresh scoped local coder review.

Next implementation stays private and local to in-practice unless separate
studio-library changes are authorized. Do not present this contract as shipped
Ahmes or semantic-quote functionality. Independent corpus scope, bibliography
and recall work can continue while this gate is developed.

## First implementation result — 2026-09-23

`structured_fidelity.py` implements a deliberately allowlisted verifier for the
single reconstructed Lateral Thinking geometric-figures section. It verifies the
original file/member hashes, all 11 text elements and 3 image-only elements,
unique live Ahmes text matches, block types, source order, and the explicit branch
labels `1, 2, 3, 4a, 4b, 5, 6`. Independent prose-gate refusals remain preserved;
procedure completeness, image completeness, bibliography, printed locators and
teaching approval remain separate. Its private receipt is
`runtime/review/structured-fidelity.json`; `procedure_approved=false`.

This is a regression implementation, not a general procedure parser. It must not
be applied to other sources without a fresh source-order witness and adversarial
fixtures. Twenty-six offline tests currently pass.
