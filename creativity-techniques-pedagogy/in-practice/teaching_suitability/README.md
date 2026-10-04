# Teaching suitability — hexagonal advisory scorer

Private. Uses `qwen2.5:32b-instruct` via Ollama. Never sets `procedure_approved`.

```text
domain/          models + ports
application/     ScoreTeachingSuitability use case
infrastructure/  record repo · Ollama judge · file verdict store
cli.py           composition root
```

```bash
cd creativity-techniques-pedagogy/in-practice
python3 -m teaching_suitability.cli --limit 36 --witness lateral_thinking,designerly
python3 -m teaching_suitability.tests.test_schema
```

Outputs under `runtime/teaching-suitability/`:

| File | Role |
| --- | --- |
| `process.json` / `verdicts/` / `SUMMARY.json` | Scan progress + raw verdicts |
| `EXERCISES-SCORED.md` | All scored — Chicago heading · DH classification · PDF link · neighbors · human review |
| `EXERCISES-VALIDATED.md` | Model shortlist only (still not approved) |
| `EXERCISES-PROMPTS.md` | Recyclable Lab prompts / puzzles / mental figures |
| `review-notes/*.yml` | Durable human review (decision, unit fit, adaptation) — survives re-export |
| `review-notes/_EXAMPLE.hello-world.yml` | Foo/bar/lorem HITL template (ignored by exporter) |

Each match: Chicago heading; DH classification; Before/Exact excerpt/After context; `file://` source link; human-review slot. The overnight `--all` job **re-exports once at finish** (imports current disk `export_reports`). Mid-run refresh:

```bash
python3 -m teaching_suitability.export_reports
python3 -m teaching_suitability.export_reports --stubs   # empty review-notes YAML for every id
```

```bash
# Full catalogue (no witness filter, no limit; resumes past cached verdicts)
python3 -m teaching_suitability --all
```

Expect many hours (~8–10 s per unscored record on Metal). Watch `runtime/teaching-suitability/process.json`.
