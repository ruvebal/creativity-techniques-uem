# PHASE T4b — Propose accepted invents into `~/src/ttod`

**Depends on:** T4 (`quotes.json` updated)  
**Does not touch `ttod.yml`.** Staging only.

## Why

The course Tao invents should enter The Tao of Development as **reviewable proposals**, not hand-appended YAML. Closest existing section today: **`wisdom`** (no dedicated `creativity`/`pedagogy` section yet — flag section-creation for a human if volume warrants it).

## Do

For each **new** accepted quote in `docs/tao/data/quotes.json` (or ledger `status: accepted` not yet proposed):

```bash
cd ~/src/ttod && . .venv/bin/activate

python cli.py proposal create \
  --section wisdom \
  --level intermediate \
  --origin studio \
  --text '…exact invent text…' \
  --tags 'creativity,haiku,teaching' \
  --proposer-id ct-tao-forge-YYYYMMDD
```

- Prefer `origin: studio` for human Lao/Yoda/haiku/koan invents.  
- Use `origin: blackbox` only when the line came from Thessia and was lightly edited.  
- Map `form` → tags: `haiku` | `koan` | `maxima` | `yoda` plus `creativity`.  
- Record `proposal_id` back onto the quote in ledger / optional `quotes.json` field `ttod_proposal_id` (studio-safe; not required on public JSON).

## Batch helper

When proposing a full seed, loop quotes from `quotes.json` once; skip any text already present in `proposals/*.json` `candidate_content.text`.

## Fail closed

- Do **not** run `proposal accept` from this forge.  
- Do **not** cite `suggested` / proposal UUIDs in lessons.  
- Do **not** invent a TTOD section id.  
- `ttod.yml` SHA must remain unchanged after this phase.

## Done when

- `PHASE-T4b-REPORT.md` lists proposal_ids created  
- `python cli.py validate` still OK  
- Human has a review queue under `~/src/ttod/proposals/`
