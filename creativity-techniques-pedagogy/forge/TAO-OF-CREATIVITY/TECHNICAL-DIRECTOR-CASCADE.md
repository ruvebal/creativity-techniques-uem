# TECHNICAL DIRECTOR — Tao of Creativity cascade

Paste-ready master prompt for agents executing [`INDEX.md`](./INDEX.md).

---

## Programme table

| Step | Role | Input | Output |
| ---- | ---- | ----- | ------ |
| T0 | Inventory | COMBINE §3, fieldlex schemes, `unit-enrichment/U*/MAIN-IDEAS.yml`, EVIDENCE-MATRIX rows | `ledger/tensions.yml` |
| T1 | Assign forms | Open tensions | Form tags + chapter targets |
| T2 | Draft forms | Tension cards | `ledger/candidates.yml` drafts (human or Thessia-assisted) |
| T3 | Thessia workload | Quote-valid drafts + BRIEF template | tuning-memory records |
| T4 | Evaluate · integrate | Raw + human judgement | `quotes.json` · `/tao/` · slide invents |
| T4b | TTOD propose | Accepted invents | `~/src/ttod/proposals/*.json` (no `ttod.yml` write) |
| T5 | Report | Batch outcomes | `registries/CT-TAO-<YYYYMMDD>-REPORT.md` |

---

## Master prompt (paste)

```text
You are executing the Creativity Techniques “Tao of Creativity” cascade
(creativity-techniques-pedagogy/forge/TAO-OF-CREATIVITY/).

Read in order:
1. INDEX.md
2. ../TAO-OF-CREATIVITY-FORGE.mdc
3. The PHASE-Tn.md for the phase named in the operator message
4. grounding/COMBINE-RELATE-DISCUSS.md §3 (tensions)
5. STUDENT-SLIDESHOW-FORGE.mdc golden rule 3 (Tao invent law)

Hard rules:
- English only on docs/tao/
- Invents cite (Tao of Creativity) only — never fake Chicago
- Local Ollama thessia-scholar-v3 via thessia_generate.py for workload drafts
- Contradictions → haiku | koan | máxima | yoda (Yoda inversion permitted)
- Evaluate before integrate; reject freely; preserve rejected thessia-raw as training signal
- Emit / update PHASE-Tn-REPORT.md with status DONE | BLOCKED | PARTIAL
- End with a fine-tuning team note if any Thessia pass ran (paths under
  ~/src/deviac/fine-tuning/thessia-tuning-memory/)

Do not invent CONTENIDOS. Do not publish Ahmes/Athanor/DevIAC names on /tao/.
Do not hand-edit ttod.yml — stage via `cli.py proposal create` into ~/src/ttod/proposals/ (T4b).
```

---

## Resume rule

1. If a `PHASE-Tn-REPORT.md` exists with `status: PARTIAL` or `BLOCKED`, resume that phase.  
2. If `DONE`, open the next phase file.  
3. If Thessia job mid-flight (record dir exists, no `integrated.md`), wait or re-run generation with the same record id — do not start a parallel record for the same tension id.  
4. After any public Markdown change under `docs/tao/`, run `npm run build` (or at least Jekyll + `verify:publication`) before claiming T4 done.

---

## Cold-review checklist (every phase)

- [ ] Tension ids stable (`T-U2-fluency-vs-selection`, …)  
- [ ] Form matches contradiction type (koan for paradox; haiku for observation; máxima/yoda for law)  
- [ ] No scholarly author-date on invent lines  
- [ ] Teenager-legible (slideshow golden rule 2 still applies to invents used on slides)  
- [ ] Publication firewall clean  
- [ ] Fine-tuning report updated if Thessia ran  

---

## Delegation map

| Work | Who |
| ---- | --- |
| Tension inventory from Profield/COMBINE | Agent (T0) |
| Form drafts | Human voice pass **or** Thessia under BRIEF |
| Accept / reject | Human (author) |
| Slide wiring `tao_invented` | Unit / slideshow forger |
| TTOD propose | `cd ~/src/ttod && python cli.py proposal create` (T4b) |
| Fine-tuning team report | Agent (T5) → registries/ |
