#!/usr/bin/env python3
"""Fresh-context local coder review; advisory, never self-certifies completion."""
from pipeline import ROOT, OUT, local_json, save, digest

code = (ROOT/'pipeline.py').read_text()
prompt = '''You are an independent code reviewer in a fresh context. Review the supplied
Python worker against these acceptance criteria: resumable exact-source identity;
all scoped sources accounted for; failed ingestion cannot count as successful;
local model output must not fabricate evidence; full text scan has no silent gaps;
bounded model calls; quotations preserve all Ahmes provenance; vector search is
discovery only; no book data is published. Check real logic, not comments.
Return JSON {"findings":[{"id":"F1","severity":"P1","function":"name",
"evidence":"specific code problem","fix":"concrete recommendation"}],
"verdict":"needs-amendment|no-blocking-findings"}. Do not claim to have run code.
''' + '\nCODE:\n' + code
result = local_json(prompt, model='qwen2.5-coder:32b')
result['reviewed_code_sha256'] = digest(code.encode())
save(OUT/'review'/('coder-review-'+result['reviewed_code_sha256'][:16]+'.json'), result)
print(result['output'])
