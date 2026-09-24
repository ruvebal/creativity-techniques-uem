"""Private source-level bibliography triage; never promote resolver metadata."""
import json
from pathlib import Path
from pipeline import OUT, now, save, digest


def main():
    audit = json.loads((OUT/'review'/'membership-audit.json').read_text())
    if audit['errors'] or audit['unaccounted']:
        raise ValueError('Unresolved membership audit')
    representatives = {}
    for member in audit['active']:
        representatives.setdefault(member['source_sha256'], member)
    sources = []
    for path in sorted((OUT/'coverage').glob('*.json')):
        coverage = json.loads(path.read_text())
        sha = coverage['source_sha256']
        member = representatives.get(sha)
        source = json.loads((OUT/'sources'/(sha+'.json')).read_text())
        record = None
        if member:
            raw = Path(member['path']).read_bytes()
            if digest(raw) != member['record_sha256']:
                raise ValueError('Changed record')
            record = json.loads(raw)
        citation = (record['quote'].get('citation') or {}) if record else {}
        epub = Path(coverage['document']['path']).suffix.lower()=='.epub'
        sources.append(dict(source_sha256=sha, source_file=coverage['document']['path'],
            metadata=source['metadata'], sources=source['sources'],
            representative_record_id=record['id'] if record else None,
            representative_citation=citation,
            resolver_stdout=record['citation_resolver_stdout'] if record else None,
            resolver_reports_safe=citation.get('evaluator_safe') is True,
            locator_scheme_conflict=epub and citation.get('scheme')=='pdf_order',
            printed_page_verified=False, bibliography_status='pending-source-witness-review',
            coverage_scope='one citation sample per scanned source, not all-record bibliography audit'))
    save(OUT/'references.json',dict(time=now(), publication_allowed=False,
         state='bibliography-triage-not-approved-references',sources=sources))
    lines=['# Private bibliography triage', '',
           'Not an approved Chicago bibliography. Original metadata and resolver outputs are preserved in references.json.',
           'One representative active record per scanned source; zero-candidate sources remain included.',
           'Unscanned/excluded sources require the separate inventory/scope audit. No printed pages are verified.', '',
           '| Source file | Resolver safe (sample) | EPUB/pdf_order conflict |',
           '| --- | --- | --- |']
    for source in sources:
        lines.append('| '+Path(source['source_file']).name.replace('|','\\|')+' | '+str(source['resolver_reports_safe'])+' | '+str(source['locator_scheme_conflict'])+' |')
    dest=OUT/'REFERENCES.md'
    tmp=dest.with_suffix('.md.tmp')
    tmp.write_text('\n'.join(lines)+'\n')
    tmp.replace(dest)
    print(json.dumps(dict(scanned_sources=len(sources), safe_resolver_samples=sum(s['resolver_reports_safe'] for s in sources),
        locator_scheme_conflicts=sum(s['locator_scheme_conflict'] for s in sources),approved_references=0)))


if __name__ == '__main__': main()
