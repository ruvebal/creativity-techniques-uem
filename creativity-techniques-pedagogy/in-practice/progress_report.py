"""Read-only snapshot of pipeline artifacts; writes only a private progress report.

Does not invoke a model or certify scholarly completeness. Running-worker snapshots
are not transactional; per-file atomic writes prevent partial JSON reads.
"""
import collections
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'runtime'


def main():
    inventory = json.loads((OUT / 'inventory.json').read_text())
    status = json.loads((OUT / 'status.json').read_text())
    failures = json.loads((OUT/'failures.json').read_text())
    membership_path = OUT/'review'/'membership-audit.json'
    membership = json.loads(membership_path.read_text()) if membership_path.exists() else {}
    helper_paths = sorted((OUT/'review').glob('helper-review-*.json'), key=lambda p: p.stat().st_mtime)
    review_process_path = OUT/'review'/'process.json'
    review_process = json.loads(review_process_path.read_text()) if review_process_path.exists() else {}
    context_path = OUT/'context-sample-v2'/'process.json'
    if not context_path.exists():
        context_path = OUT/'context-sample'/'process.json'
    context_process = json.loads(context_path.read_text()) if context_path.exists() else {}
    ordered_path = OUT/'review'/'ordered-section-process.json'
    ordered_process = json.loads(ordered_path.read_text()) if ordered_path.exists() else {}
    references_path = OUT/'references.json'
    bibliography = json.loads(references_path.read_text()).get('sources', []) if references_path.exists() else []
    review_paths = sorted((OUT/'review').glob('coder-review-*.json'), key=lambda p: p.stat().st_mtime)
    latest_review = json.loads(review_paths[-1].read_text()) if review_paths else {}
    triaged = bool(review_paths and review_paths[-1].name == 'coder-review-e48937e9f8405514.json'
                   and (ROOT/'POST-EXTRACTION-TRIAGE.md').exists())
    triage_status = 'triaged in POST-EXTRACTION-TRIAGE.md; substantive gates remain open' if triaged else 'pending for latest receipt; verdict is advisory'
    sources = {}
    for doc in inventory['documents']:
        sources.setdefault(doc['source_sha256'], []).append(doc)
    rows = []
    for sha, docs in sources.items():
        path = OUT / 'coverage' / (sha + '.json')
        coverage = json.loads(path.read_text()) if path.exists() else {}
        rows.append(dict(source_sha256=sha, names=[Path(d['path']).name for d in docs],
                         prepared=(OUT/'prepared'/(sha+'.json')).exists(),
                         source_kind=docs[0]['kind'], scan_receipt=bool(coverage),
                         classification_gate=coverage.get('classification_gate'),
                         coverage_records=coverage.get('records'),
                         characters_expected=coverage.get('characters_expected'),
                         characters_scanned=coverage.get('characters_scanned')))
    states = collections.Counter()
    reviewed = 0
    for path in (OUT/'records').glob('*.json'):
        record = json.loads(path.read_text())
        states[record['status']] += 1
        reviewed += record.get('procedural_completeness_reviewed') is True
    report = dict(snapshot_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  publication_allowed=False, live_activity=status,
                  distinct_files=len(inventory['documents']), distinct_hashes=len(sources),
                  prepared_sources=sum(r['prepared'] for r in rows),
                  scan_receipts=sum(r['scan_receipt'] for r in rows),
                  validated_scan_receipts=sum(r['classification_gate']=='validated-ids-bisect-v1' for r in rows),
                  saved_record_status=dict(states), procedure_reviewed_flags=reviewed,
                  extraction_state=status['stage'], failures=failures,
                  membership_counts={k:len(membership.get(k, [])) for k in ('active','superseded','unaccounted','errors')},
                  membership_snapshot_at=membership.get('time'),
                  coder_review_receipt=str(review_paths[-1]) if review_paths else None,
                  coder_review_verdict=latest_review.get('output', {}).get('verdict'),
                  coder_review_triage=triage_status,
                  helper_review_receipt=str(helper_paths[-1]) if helper_paths else None,
                  review_process_receipt=review_process,
                  context_sample_receipt=context_process,
                  ordered_section_receipt=ordered_process,
                  bibliography_triage=dict(scanned_sources=len(bibliography),
                      resolver_safe_samples=sum(s['resolver_reports_safe'] for s in bibliography),
                      epub_locator_conflicts=sum(s['locator_scheme_conflict'] for s in bibliography),
                      approved_references=0),
                  sources=rows, completeness_asserted=False)
    (OUT/'PROGRESS.json').write_text(json.dumps(report, indent=2)+'\n')
    lines = ['# In-practice — private progress snapshot', '', report['snapshot_at'], '',
             'Artifact snapshot, not a completion certificate. No new model calls.', '',
             f"- Extraction state: {status['stage']} (last worker event: {status['time']}).",
             f"- Files: {report['distinct_files']}; distinct source hashes: {report['distinct_hashes']}.",
             f"- Prepared sources: {report['prepared_sources']}.",
             f"- Scan receipts: {report['scan_receipts']}; stronger classification gate: {report['validated_scan_receipts']}.",
             f'- Saved node-record statuses: {dict(states)}.',
             f'- Procedure-reviewed flags: {reviewed}.',
             f"- Membership audit: {report['membership_counts']} (snapshot {report['membership_snapshot_at']}).",
             f"- Latest coder review: {report['coder_review_verdict']}; {triage_status}.", '',
             f"- Helper review receipt: {report['helper_review_receipt'] or 'pending'}.",
             f"- Review job recorded state: {review_process.get('stage', 'unknown')} (receipt, not a live PID check).", '',
             f"- Expanded-context sample: {context_process.get('stage', 'not started')}; {len(context_process.get('completed', []))} source judgements; advisory only.", '',
             f"- Bibliography triage: {report['bibliography_triage']}; not an approved bibliography.", '',
             f"- Source-ordered section review: {ordered_process.get('stage','not started')}; advisory, no record promotion.", '',
             '## Remaining work', '',
             'Resolve ingestion failures; triage fresh review; review expanded procedure context,',
             'bibliography and locators; audit images and recall; reconcile active exports;',
             'complete curriculum connector. No scholarly completion is asserted.', '',
             '## Ingestion failures', '',
             *[f"- {Path(f.get('source','')).name}: {f.get('error','')}" for f in failures], '',
             '## Source coverage', '',
             'Record counts are not exercise counts. Rescans can leave superseded candidates in the',
             'historical aggregate; active-only exports filter the audited membership.',
             'Grouping node records into distinct complete exercises remains pending.',
             'Scanning all extracted text does not establish recall, procedure completeness,',
             'image coverage, printed pagination, bibliographic accuracy, or teaching fitness.', '',
             '| Source | Prepared | Scan gate | Records in receipt |',
             '| --- | --- | --- | --- |']
    for r in rows:
        name = ' / '.join(r['names']).replace('|', '\\|')
        gate = r['classification_gate'] or ('legacy receipt' if r['scan_receipt'] else 'pending / excluded')
        lines.append(f"| {name} | {r['prepared']} | {gate} | {r['coverage_records']} |")
    (OUT/'PROGRESS.md').write_text('\n'.join(lines)+'\n')
    (OUT/'INDEX.md').write_text('\n'.join([
        '# Private runtime index', '',
        'Generated by progress_report.py. Never publish this directory.', '',
        '- [Progress report](PROGRESS.md) / [JSON snapshot](PROGRESS.json)',
        '- [Membership audit](review/membership-audit.json): active versus superseded node records.',
        '- [Review job receipt](review/process.json): inspect actual PID before resuming a running job.',
        '- [Expanded-context sample receipt](context-sample/process.json): advisory local Qwen assessments and private source packets.',
        '- [Structured comparison receipt](context-sample-v2/process.json): same targets with block/figure metadata; advisory only.',
        '- [Active-only reading view](EXERCISES-ACTIVE.md) / [active JSON](exercises-active.json): provisional, not procedure-approved.',
        '- [Provisional reading view](EXERCISES.md) / [aggregate JSON](exercises.json): includes superseded records; not approved exercises.',
        '- [Source inventory](inventory.json) / [failures](failures.json)',
        '- [Bibliography triage](REFERENCES.md) / [original metadata and citation samples](references.json): not approved references.',
        '- [EPUB source-order witness](review/epub-order-canary.json): eleven text matches; insertion order does not preserve this procedure.',
        '- [Ordered-section review receipt](review/ordered-section-process.json): local-model assessment after source-order reconstruction.',
        '- [Geometric-figures procedure candidate](procedures/lateral-geometric-figures.json): source-ordered, images inspected, unresolved gates; not approved.',
        '- [Procedure quotation gate audit](review/procedure-quote-gates.json): per-node prose gate; seven refusals retained, no complete-procedure approval.',
        '- [Structured fidelity receipt](review/structured-fidelity.json): one allowlisted section; source order verified, approval still false.',
        '- [Last worker event](status.json) / [historical worker identity](process.json): not proof a PID is alive.',
        '- [Cascade index](../INDEX.md) / [technical director](../TECHNICAL-DIRECTOR-CASCADE.md)',
        '', 'Latest coder review: '+(str(review_paths[-1].relative_to(OUT)) if review_paths else 'pending'),
        triage_status+'. Procedure/bibliography review remains pending.',
        'Latest helper review: '+(str(helper_paths[-1].relative_to(OUT)) if helper_paths else 'pending'), '']))
    print(json.dumps({k:v for k,v in report.items() if k not in ('sources','live_activity')}, indent=2))


if __name__ == '__main__':
    main()
