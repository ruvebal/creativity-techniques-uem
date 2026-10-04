# Local-first execution profile — Excellence cascade

**Goal (professor, 2026-10-04):** run as much of the workload as possible on
the studio's local machinery (Ollama, Thessia, Ahmes, Athanor, DevIAC) and
keep cloud tokens to orchestration and review.

## Verified live on 2026-10-04

| Component | State | How checked |
| --- | --- | --- |
| Ollama (native Metal), 128 GB RAM | up | `ollama list`, DevIAC `health_check.sh` 18/18 pass |
| `qwen2.5-coder:32b`, `qwen2.5:32b-instruct`, `qwen3.8:27b`, `qwen2.5:72b-instruct-q4_K_M` | installed | `ollama list` |
| `thessia-scholar-v3` (voice), `thessia-coder-v3`, `thessia-sentinel-v3` | installed; scholar generates ~14 tok/s after ~17 s load | direct `/api/generate` call |
| DevIAC Postgres, MCP, Traefik | up (healthy) | `docker ps`, `health_check.sh` |
| Athanor search, project `profield-creativity-techniques`, library `scholar` | works **only with `.env` exported** | `local/athanor.sh search …` returned Michalko *Thinkertoys* p. 365 (Osborn) and de Bono *Six Thinking Hats* 1985 p. 39 |
| Ahmes CLI | available (`~/src/ahmes/.venv/bin/ahmes`: ingest, query, ground, enrich, batch) | `--help` |
| `thessia_generate.py` (DevIAC) | **broken**: DevIAC venv lacks the `ollama` module | traceback; `local/thessia.sh` calls Ollama HTTP directly instead |
| opencode 1.2.6 + Ollama provider | reaches local models (`opencode run -m ollama/qwen2.5-coder:32b "Say hi"` → "hi") | config `local/opencode.json` |
| Unattended local coding agent (opencode with edit + bash allowed) | **not launched**: Claude Code's safety check refused it for this session | see "Your decision" below |

**Finding that shapes the rules:** asked a fact cold ("what is a COCD box?"),
`thessia-scholar-v3` fabricated an answer (an "image dataset container") and
invented autobiographical claims about the professor's PhD. Thessia is a
**voice** model, not a source.

## Rules

1. **Facts come from Athanor/Ahmes, never from a model's memory.** Every
   claim and quote in student text starts as a retrieved fission node
   (`local/athanor.sh search`, `ahmes query --cite`). No hit → `gap`.
2. **Thessia only rewrites grounded drafts into the professor's voice.** The
   prompt contains the retrieved passages and the plain draft; the output is
   checked for citation fidelity (every author-date and quote in the output
   must exist in the input) before it enters a lesson. Any new name, number
   or quote in Thessia's output is discarded.
3. **Qwen for structure and code.** `qwen2.5:32b-instruct` drafts briefs,
   exercise cards, catalogue classification and question-bank items from
   retrieved material; `qwen2.5-coder:32b` writes code under the phase's
   tests. `qwen3.8:27b` (hybrid reasoning) only with `think:false` and plain
   delimited output, never JSON mode (known trap, ttod PHASE-S4).
4. **One heavy model at a time,** serialized with the in-practice cascade
   (`in-practice/runtime/process.json` + `ps` before every load).
5. **Gates stay mechanical.** Local output is never trusted on its own claim
   of success; the exit gate and cold review decide.

## Workload map

| Phase | Local (Ollama · Athanor · Ahmes) | Cloud (Claude) |
| --- | --- | --- |
| EX0 probe | probe script runs locally; Qwen-coder drafts it | orchestration; cold review |
| EX1 hotfix | Athanor retrieval for replacement quotes; Thessia voice for rewritten sentences | apply edits; cold review |
| EX2 firewall | Qwen drafts plain-English replacements | edits, safety-script patterns; cold review |
| EX3 pipeline | Qwen-coder writes `media-rules.mjs` + tests (if local agent permitted) | otherwise implements; cold review always |
| EX4 curation | collection API searches (scripts); Qwen writes image briefs; llama3.2-vision checks image–brief fit | binding decisions; cold review |
| EX5 renderer | Qwen-coder (if permitted) | otherwise implements; cold review |
| EX6 research | Ahmes ingest/enrich + Athanor retrieval (all local); Thessia voice paragraphs | integration; cold review |
| EX7 catalogue | Qwen classifies 6,773 records into canonical techniques | YAML assembly checks; cold review |
| EX8 Labs | Qwen drafts cards from catalogue + retrieved sources; Thessia voice | edits; cold review |
| EX9 lessons | Thessia voice rewrite of restructured ideas | structure; cold review |
| EX10 didactics | Qwen drafts question bank from retrieved passages | validation; cold review |
| EX11 audit | probe + gates (scripts) | closing report |

Every model call is logged in the phase report (model, prompt file, token
count), so the final review shows how much ran locally.

## Your decision: local coding agent

Running `opencode` unattended with edit and shell permissions on local Qwen
would move most of the coding in EX3 and EX5 to the local machine. Claude Code
refused to launch that from this session. The options:

- **Hybrid (default):** local models draft text and code, Claude applies and
  reviews them. Cloud use is mainly orchestration, edits and cold review.
- **Local coding agent:** add a Claude Code permission rule that allows
  `opencode run` with `OPENCODE_CONFIG=…/local/opencode.json` (or run it
  yourself). Then EX3 and EX5 implementation also runs locally; the gates and
  cold review stay unchanged.
