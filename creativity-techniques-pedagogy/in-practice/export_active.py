"""Private active-only views. Never remove evidence or approve an exercise."""
import json
from pathlib import Path
from pipeline import OUT, digest, now, save


def load_active(audit, records_dir):
    if not isinstance(audit, dict) or any(not isinstance(audit.get(key), list)
                                        for key in ('active', 'errors', 'unaccounted', 'superseded')):
        raise ValueError('Membership audit lacks required list fields')
    if audit.get('publication_allowed') is not False or audit.get('errors') or audit.get('unaccounted'):
        raise ValueError('Membership audit is unsafe or incomplete')
    seen, records = set(), []
    for member in audit['active']:
        path = Path(member['path']).resolve()
        if path.parent != records_dir.resolve():
            raise ValueError('Record path escapes private records directory')
        raw = path.read_bytes()
        if digest(raw) != member.get('record_sha256'):
            raise ValueError('Record changed since membership audit; reconcile again')
        record = json.loads(raw)
        identity = (record['id'], record['source_sha256'], record['provenance']['target_node_id'])
        if identity != (member['record_id'], member['source_sha256'], member['node_id']):
            raise ValueError('Membership identity mismatch')
        if record['id'] in seen or record.get('publication_allowed') is not False:
            raise ValueError('Duplicate identity or unsafe publication flag')
        seen.add(record['id'])
        records.append(record)
    return sorted(records, key=lambda r:r['id'])


def main():
    path = OUT/'review'/'membership-audit.json'
    audit_bytes = path.read_bytes()
    audit = json.loads(audit_bytes)
    records = load_active(audit, OUT/'records')
    save(OUT/'exercises-active.json', dict(schema='in-practice-active/v1',
         generated_at=now(), publication_allowed=False, state='unreviewed-active-candidates',
         membership_audit_sha256=digest(audit_bytes), exercises=records))
    lines = ['# In-practice — private active candidates', '',
             'Active node records only, NOT distinct approved exercises. Procedure, bibliography,',
             'context and recall review remain pending. Original evidence is retained separately.', '']
    for record in records:
        lines += ['## '+str(record.get('name')), '', record['id']+' · '+record['status'], '',
                  'Source witness: '+record['provenance']['coat'], '']
        quote = record['quote']
        if quote.get('ok'):
            lines += ['> '+quote['quote'].replace('\n','\n> '), '']
        else:
            lines += ['Quotation gate refused; consult original private record.', '']
        lines += ['```text', record['citation_resolver_stdout'].strip(), '```', '']
    dest = OUT/'EXERCISES-ACTIVE.md'
    temporary = dest.with_suffix('.md.tmp')
    temporary.write_text('\n'.join(lines)+'\n')
    temporary.replace(dest)
    print(json.dumps(dict(active_records=len(records), retained_superseded=len(audit['superseded']),
                          publication_allowed=False)))


if __name__ == '__main__':
    main()
