# PHASE T3 — Thessia workload (local Ollama)

**Depends on:** T2 drafts exist (`status: draft`)

## Purpose

Quote-valid candidates become **training-grade workload** for `thessia-scholar-v3`: the model practices short pedagogical aphorism form under hard anti-cite constraints. Outputs are **not** auto-published.

## Do (per candidate or small batch)

1. Create record dir:

```text
~/src/deviac/fine-tuning/thessia-tuning-memory/<YYYY-MM-DD>-<uuid>-tao-ct-<tension_id>/
```

2. Write `prompt.md` from `templates/thessia-tao-brief.md` (fill tension, form, voice).  
3. Run:

```bash
python ~/src/deviac/fine-tuning/scripts/thessia_generate.py \
  --prompt <record>/prompt.md \
  --out <record>/thessia-raw.md \
  --model thessia-scholar-v3
```

4. Save `meta.yml` linking `tension_id`, `candidate_id`, `form`.  
5. Mark candidate `status: thessia_raw` and store `record_path`.

## BRIEF hard bans

- No `(Author, Year)`  
- No invented book titles  
- No “studies show”  
- No Ahmes / vault / coat language  
- Output **only** the requested form (haiku / koan / máxima / yoda)

## Fail closed

- Ollama down → BLOCKED (do not substitute cloud).  
- Raw contains scholarly citation → reject file as `thessia-raw.md.rejected`; keep for training signal.
