"""Inventory saved evidence gates; never approve or mutate catalogue records."""
import json
from collections import Counter
from pipeline import OUT, now, save, digest


def main():
    entries = []
    for path in sorted((OUT / 'teaching-suitability/verdicts').glob('*.json')):
        verdict = json.loads(path.read_text())
        if verdict.get('shortlist_for_human') is not True:
            continue
        record_path = OUT / 'records' / path.name
        raw = record_path.read_bytes()
        record = json.loads(raw)
        quote = record.get('quote') or {}
        provenance = record.get('provenance') or {}
        citation = record.get('citation_resolver_stdout') or ''
        sources = provenance.get('sources') or []
        source_formats = sorted({s.get('format', 'unknown') for s in sources})
        text = quote.get('quote') or ''
        entries.append(dict(
            id=verdict['exercise_id'], name=record.get('name'),
            record_sha256=digest(raw), record_path=str(record_path),
            saved_quote_ok=quote.get('ok') is True,
            quote_characters=len(text), scoring_excerpt_truncated=len(text)>1800,
            saved_resolver_safe='evaluator_safe=yes' in citation,
            epub_pdf_order_conflict='epub' in source_formats and 'scheme=pdf_order' in citation,
            source_formats=source_formats,
            extraction_db=provenance.get('extraction_db'),
            target_node_id=provenance.get('target_node_id'),
            procedure_approved=False, publication_allowed=False))
    summary = dict(total=len(entries))
    for key in ('saved_quote_ok', 'saved_resolver_safe', 'scoring_excerpt_truncated',
                'epub_pdf_order_conflict'):
        summary[key] = sum(e[key] for e in entries)
    save(OUT/'review/shortlist-gates.json', dict(
        time=now(), summary=summary, entries=entries, publication_allowed=False,
        limits=['Saved receipts only; not fresh live quote or citation verification.',
                'Resolver safety does not establish correct EPUB pagination.',
                'Shortlisting and quote fidelity do not establish complete procedures.']))
    print(json.dumps(summary))


if __name__ == '__main__':
    main()
