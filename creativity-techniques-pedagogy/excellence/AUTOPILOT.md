# Autopilot mode — Excellence cascade

**Status:** ACTIVE. The cascade runs EX0 → EX11 without per-phase human
sign-off. The professor reviews **once**, at the end, before anything reaches
`main` (the live student site). This file overrides the "Human gate" lines in
`TECHNICAL-DIRECTOR-CASCADE.md` and the phase files: those gates are replaced
by the pre-registered policy below and logged for the final review.

## 0 · Launch decisions (professor, 2026-10-04)

| Decision | Value |
| --- | --- |
| Weights to publish | **60 / 40 provisional** (Diseño PDF 2025/26), `confirmed_by: professor-provisional-2026-10-04`; P0 item in final review |
| Deck images | **Auto-pick; treat all sources as usable.** Rights are recorded and **flagged, not blocking**; the professor reviews every pick before release |
| Off-machine backup | **Push** `excellence/*` and `cascade/excellence-*` branches and `excellence/*` tags after each landing; **never push `main`** |
| Teaching language | English |

Execution profile: **local-first** — see [LOCAL-EXECUTION.md](LOCAL-EXECUTION.md)
(facts from Athanor/Ahmes; Thessia for voice only; Qwen for structure and code).

## 1 · What runs automatically, and what never does

| Automatic | Never automatic |
| --- | --- |
| Opening each phase worktree (`gitflow.sh start`) | Merging into `main` or pushing `main` |
| Implementation by `cascade-phase-executor` | Accepting images in the Profield review app (EX4 binds only already-accepted or policy-compliant assets; see §2) |
| Exit gate via `cascade-harness.sh verify` | Starting the measurement study or collecting student data (EX10) |
| Cold review by `cascade-cold-reviewer` (fresh agent) | Any action that needs a hard-constraint exception |
| Landing on `excellence/integration` (`gitflow.sh land`) with regression of all earlier gates | Deleting tags or branches |
| Pushing phase/integration branches and tags (`EXCELLENCE_PUSH=1`) | Pushing `main` |
| Rolling back integration on regression failure | |

## 2 · Pre-registered decisions (replace the human gates)

Every decision taken under this policy is appended to `DECISIONS-LOG.md`
(`date · phase · decision · rule applied · alternatives · how to undo`).

| Phase | Gate in the plan | Autopilot rule |
| --- | --- | --- |
| EX0 | Professor confirms 2026–27 weights | 60/40 per §0; `source: cv/sources/9990002301.pdf (2025/26)`; flagged **P0 for final review** |
| EX4 | Professor picks images | Agent picks the best-fitting candidate per slide from the accepted Profield pool, the existing media indexes and open collections (brief fit self-scored ≥ 4/5, confirmed by the cold reviewer). Per §0 all sources count as usable: licence, author and EU-term status are still recorded, and any doubt sets `rights_status: flagged` (not blocking). Assets not accepted in Profield are bound from `curation/autopilot-assets.json` (no write to Profield). Relevance still rules: no image whose subject does not match its brief. `approved_by: autopilot (final review pending)` |
| EX6 | Book procurement | Only works already in the vault or open access are ingested; everything else becomes `gap`. PARTIAL is accepted and the run continues |
| EX8 | Professor signs off Labs | Use the target Labs in `PHASE-EX8.md` exactly; `approved_by: autopilot (final review pending)` |
| EX10 | Consent and bank approval | Drafts only; `approved_by: autopilot (drafts — not for use before professor approval)`; measurement never starts |
| Any | Ambiguity in a runbook | Take the more conservative option (less published, fewer claims), log it, continue |

## 3 · Orchestration loop (run by the orchestrator session)

```text
bash tests/test-gitflow.sh                        # prove the git flow on a throwaway clone (11 checks)
gitflow.sh init                                   # once
for n in 0..11:
  gitflow.sh start                                # harness opens cascade/excellence-n from integration
  Agent(cascade-phase-executor, worktree, PHASE-EXn.md + AUTOPILOT.md)
      → commits all work on the phase branch
  cascade-harness.sh verify <integration>/…/excellence PHASE-EXn.md <worktree>
      → exit ≠ 0: return to executor with the log (max 3 attempts, then STOP)
  commit PHASE-EXn-VERIFY-LOG.md on the phase branch
  Agent(cascade-cold-reviewer, fresh, inputs = runbook + diff + verify log + hard constraints)
      → PHASE-EXn-COLD-REVIEW.md; blocking finding → back to executor (max 2 cycles, then STOP)
      → code changed after review → re-verify (gitflow.sh land refuses otherwise)
  executor writes PHASE-EXn-REPORT.md, appends DECISIONS-LOG.md, commits
  gitflow.sh land n                               # merge --no-ff, regression EX0..n, tag excellence/exn
      → regression failure: integration auto-reset; executor fixes on the phase branch, or STOP
  append the phase section of FINAL-REVIEW.md
```

Model workloads serialize with the in-practice cascade: before EX6 and EX7,
check `in-practice/runtime/process.json` and `ps`; wait (do not kill) if an
in-practice job is alive.

## 4 · Stop rules (the run halts, integration stays at the last good tag)

- An exit gate still fails after 3 implementation attempts
- A cold review finds a P0 that 2 fix cycles do not close
- Completing a phase would require breaking a hard constraint
- An earlier gate must be **weakened** to pass regression (amending a gate is
  allowed only to follow an intended change, and the cold reviewer must
  confirm it in a finding titled "gate amendment")
- The worktree, git state or harness behaves unexpectedly

On a stop, the orchestrator writes the reason at the top of `FINAL-REVIEW.md`
and stops. Later phases that do not depend on the stuck one are **not**
started out of order.

## 5 · Final review packet (`FINAL-REVIEW.md`, built as the run goes)

1. **Run outcome:** phases landed, PARTIALs, stop reason if any
2. **P0 decisions for you:** provisional weights, every autopilot image choice
   (thumbnail link, licence, author, brief) with the `rights-report.json`
   flags first, Lab sign-off, consent drafts
3. **Per phase:** what changed (diffstat + 3–5 bullets), gate log link, cold
   review verdict and findings, decisions taken, rollback command
4. **Closing audit (EX11):** baseline vs final probe values; every FINDINGS ID closed or deferred
5. **How to preview:** `gitflow.sh release-notes` (local server on the integration worktree)
6. **Release or roll back:** exact commands, also in `gitflow.sh release-notes`

Suggested review order (about 2 hours): §2 decisions → preview U1–U3 decks and
lessons → §4 closing audit → spot-check two phase diffs → release.

## 6 · Git flow and rollback

See `gitflow.sh` header. In short:

- `main` untouched until your release merge; tag `excellence/base` marks the start
- `excellence/integration` receives one `--no-ff` merge per phase, each tagged `excellence/exN`
- Phase branches `cascade/excellence-N` are kept for audit
- Before release: `gitflow.sh rollback N` resets integration to before phase N (a safety tag records the old head)
- After release: `git revert -m 1 <merge>` on `main` (no force-push), for the whole release or a single phase's landing merge
