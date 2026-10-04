#!/usr/bin/env python3
"""Fresh-context local coder review; advisory, never self-certifies completion."""
import argparse
import fcntl
import os
from pipeline import ROOT, OUT, local_json, save, digest, now

parser = argparse.ArgumentParser()
parser.add_argument('--helpers', action='store_true')
parser.add_argument('--source-order', action='store_true')
parser.add_argument('--assembler', action='store_true')
parser.add_argument('--structured-fidelity', action='store_true')
parser.add_argument('--suitability', action='store_true')
args = parser.parse_args()
lock = (OUT/'review.lock').open('a')
fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
names = ['reconcile.py', 'export_active.py', 'test_active_export.py'] if args.helpers else ['pipeline.py']
if args.source_order:
    names = ['epub_order_canary.py','test_epub_order.py']
if args.assembler:
    names = ['assemble_geometric_candidate.py','epub_order_canary.py','test_epub_order.py']
if args.structured_fidelity:
    names = ['structured_fidelity.py', 'test_structured_fidelity.py']
if args.suitability:
    names = ['teaching_suitability/application/score_batch.py',
             'teaching_suitability/export_reports.py',
             'teaching_suitability/tests/test_schema.py']
code = '\n\n'.join('FILE: '+name+'\n'+(ROOT/name).read_text() for name in names)
prompt = '''You are an independent code reviewer in a fresh context. Review the supplied
Python worker against these acceptance criteria: resumable exact-source identity;
all scoped sources accounted for; failed ingestion cannot count as successful;
local model output must not fabricate evidence; full text scan has no silent gaps;
bounded model calls; quotations preserve all Ahmes provenance; vector search is
discovery only; no book data is published. Check real logic, not comments.
Return JSON {"findings":[{"id":"F1","severity":"P1","function":"name",
"evidence":"specific code problem","fix":"concrete recommendation"}],
"verdict":"needs-amendment|no-blocking-findings"}. Do not claim to have run code.
''' + ('''\nScope: private post-extraction reconciliation/export only. The extraction worker
has exited. Check stale audit/record consistency, fail-closed schemas, path safety,
duplicate or missing membership, and tests. No exercise approval is intended.
Do not fault these helpers for not performing ingestion or scholarly review.
''' if args.helpers else '') + ('''\nScope: a deliberately hardcoded, one-section EPUB alignment canary, not a general parser.
Assess fail-closed alignment, unchanged source, preservation of source order, and test gaps.
It does not approve quotations or claim whole-corpus coverage. Database helper uses SQLite mode=ro.
''' if args.source_order else '') + ('''\nScope: bounded private procedure candidate assembler, not a general corpus parser.
Review exact source/member/image hash binding, ambiguous-match isolation, retention
of original evidence, and false approval risks. SQLite helper uses mode=ro.
Unresolved context matches are allowed only as explicit unresolved candidates.
''' if args.assembler else '') + '\nCODE:\n' + code
if args.assembler:
    prompt = '''Review this bounded PRIVATE EPUB section assembler, not a whole-corpus pipeline.
It makes ZERO model calls and ZERO vector searches. SQLite connect uses mode=ro.
Output is under ignored runtime/, publication_allowed=false, not the public site.
Unhandled input/read/parse errors abort before save; do not call this silent success.
Check actual hash binding, ambiguity isolation, missing image reporting, provenance,
and false approval risks. Scope is intentionally one identified section.
Return JSON {"findings":[{"id":"F1","severity":"P2","function":"name",
"evidence":"specific demonstrated logic issue","fix":"recommendation"}],
"verdict":"needs-amendment|no-blocking-findings"}. Do not claim to run code.
CODE:\n''' + code
if args.structured_fidelity:
    prompt = '''Review the supplied private, single-section fidelity verifier and tests.
Scope: exact witness binding, live node identity/text matching, source order,
numbered branch preservation, rejection of stale or ambiguous input, and honest
separation of fidelity from procedure/bibliographic/teaching approval.
This is deliberately not a general parser. It must not approve procedures.
The orchestrator ran 26 offline tests successfully; you have not executed tests.
Look for concrete logic defects and missing negative tests. Return JSON with
findings (id, severity, function, evidence, fix) and verdict
(needs-amendment or no-blocking-findings). Do not invent execution evidence.
Report at most five concrete findings; each evidence and fix field must be
under 60 words. Do not reproduce source code or provide a replacement program.
CODE:\n''' + code
receipt = dict(pid=os.getpid(), started_at=now(), files=names, stage='running')
if args.suitability:
    prompt = '''Review this private advisory suitability scorer/exporter and tests.
Focus on cache resume, missing-source visibility, export failure receipts,
preserving human review edits, and false approval risks. The full scan has exited;
6790 distinct verdict IDs match 6790 record filenames; 62 shortlist IDs appear
in the Markdown; 38 offline tests passed. These are orchestrator observations,
not tests you ran. Do not claim scholarly validity or full-procedure coverage.
External context helpers are not included: flag uncertainties, not invented facts.
Return JSON with findings (id,severity,function,evidence,fix), at most five,
each evidence/fix under 60 words; verdict needs-amendment or no-blocking-findings.
CODE:\n''' + code
save(OUT/'review'/'process.json', receipt)
try:
    result = local_json(prompt, model='qwen2.5-coder:32b',
                        num_predict=6000 if args.structured_fidelity or args.suitability else 2600)
    result['reviewed_code_sha256'] = digest(code.encode())
    result['reviewed_files'] = names
    prefix = 'helper-review-' if args.helpers else 'coder-review-'
    if args.source_order:
        prefix = 'source-order-review-'
    if args.assembler:
        prefix = 'assembler-review-'
    if args.structured_fidelity:
        prefix = 'structured-fidelity-review-'
    if args.suitability:
        prefix = 'suitability-review-'
    dest = OUT/'review'/(prefix+result['reviewed_code_sha256'][:16]+'.json')
    save(dest, result)
    receipt.update(stage='finished', finished_at=now(), result=str(dest))
    print(result['output'])
except Exception as exc:
    receipt.update(stage='failed', finished_at=now(), error=str(exc))
    raise
finally:
    save(OUT/'review'/'process.json', receipt)
    save(OUT/'review'/('attempt-'+str(receipt['pid'])+'-'+digest(receipt['started_at'].encode())[:12]+'.json'), receipt)
