# Canonical technique catalogue — pipeline (PHASE-EX7)

Private. Builds `../CANONICAL-TECHNIQUES.yml`, `../CANONICAL-TECHNIQUES.md` and
`../CANONICAL-TECHNIQUES-BY-UNIT.yml`. Never writes under `../runtime/`.

| Step | Script | Input | Output |
| --- | --- | --- | --- |
| 1 | `extract_records.py <exercises-active.json> <records.jsonl>` | runtime export (read only, ~5 GB; streamed) | compact index (scratch, not committed) |
| 2 | `map_records.py <records.jsonl>` | index | `mapping.json`, `mapping-stats.json` (rules only) |
| 3 | `classify_local.py <records.jsonl>` | ambiguous unmapped names | `model-decisions.json`, `model-calls.jsonl` (local `qwen2.5:32b-instruct`) |
| 4 | `map_records.py <records.jsonl> --model model-decisions.json` | index + reviewed model decisions (`model-vetoes.json`) | final `mapping.json`, `mapping-stats.json` |
| 5 | `build.py` | `techniques.base.yml` + mapping + `docs/_data/references.yml` | the three catalogue files |

Edit only `techniques.base.yml` (content), the rule table in `map_records.py`
and `model-vetoes.json`, then rerun steps 4–5. Steps 1 and 3 need the runtime
export and an idle machine (check `runtime/process.json`, `ps`, and
`curl localhost:11434/api/ps` first). `source-snapshot.json` records which export
the mapping was computed from.

Requires Python 3 with PyYAML.
