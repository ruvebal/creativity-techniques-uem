# PHASE-EX2 Cold Review (round 2): publication firewall

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX2, did not write round 1) |
| **reviewed_at** | 2026-10-04 |
| **implementer_claim** | Round 2 (`7d68e15`): round-1 F1–F3 fixed, plus F4, F8 and F9; runner gate exit 0 (32 PASS) |
| **verdict** | PASS |

Reviewed: `cascade/excellence-2` @ `4d9743f` against `excellence/integration`. The runner log
(`PHASE-EX2-VERIFY-LOG.md`) is for commit `7d68e15`. `git merge-base --is-ancestor 7d68e15 HEAD` → ancestor-ok.
The only later commit, `4d9743f`, adds the log and nothing else. Scratch build:
`bundle exec jekyll build --source docs --destination <scratchpad>/site --config _config.yml`, exit 0, 109 files.

There are no blocking findings. F1 is the required "gate amendment" ruling. F2–F7 are P2 and non-blocking.

---

## Findings

### F1 · P2 · does not block DONE: gate amendment (A4, `0e7c432`), ruling ACCEPTED

**What changed** (`git show 0e7c432 -- PHASE-EX2.exit-gate.sh`):
- TERMS adds `scholar-voice|enrichment pack|extraction order|source adjudication|agentic`. This strengthens the gate.
- The presence loop adds the same five patterns. This strengthens the gate.
- New built-HTML loop: each U1–U3 and assignment page must contain `href="/creativity-techniques-uem/ai-declaration/` and must not contain `href="/ai-declaration/`. This strengthens the gate.
- Bare `harness` in TERMS is narrowed to `(agentic|local|studio) harness|harness:`. This is the deliberate narrowing.
- `harness` is dropped from the presence loop. This is a small weakening that the A4 text does not mention.

**The amended gate catches what it should.** I ran it against a `git archive 0e7c432` copy (the round-1 content):
```
FAIL: internal terms in built HTML
_site/lessons/en/creativity-techniques/u-4-workplace-application/index.html
   1 enrichment pack / 1 extraction order / 1 scholar-voice / 1 source adjudication
FAIL: safety script has pattern: scholar-voice | enrichment pack | extraction order | source adjudication | agentic
FAIL: no root-relative declaration link: _site/assignments/en/creativity-techniques-portfolio/index.html
failures: 7
```
On the tip the same gate gives 32 PASS, `failures: 0`, exit 0.

**Ruling on the narrowing: accepted.**
- It follows an intended change. Round-1 F5 recommended it, so that ordinary English such as "harness divergent thinking" does not fail the build.
- It matches the hard constraint's intent, which forbids harness as a *name of machinery*.
- It hides nothing today. A sweep of the whole scratch build for `harness(es)?` finds 0 hits in any file type.
- The safety script, which the gate runs as a check, keeps a machinery pattern (`\b(?:agentic|local|studio)\s+harness(?:es)?\b|\bharness:`) and also `\bagentic\b`.

**Two defects in the amendment (non-blocking, because the safety script covers both cases):**
1. The `harness:` arm sits inside `\b(...)\b`, so in the gate it never matches the real form (colon followed by a space):
   ```
   $ echo 'harness: x' | /usr/bin/grep -oiE '\b(...|harness:|...)\b'          → (no match)
   $ echo 'harness: `lesson-scribe`' | /usr/bin/grep -oiE "$TERMS"             → lesson-scribe   (caught only via the other term)
   ```
2. The `harness` presence check was removed instead of replaced.

**Fix (gate hygiene, next touch of the gate):** move `harness:` out of the `\b…\b` group, for example `TERMS='…\b(…)\b|harness:'`. Add `present "safety script has pattern: harness phrasing" 'studio\)\\s\+harness|harness:' …` or an equivalent check. **Cascade amend:** no.

### F2 · P2 · does not block DONE: the narrowed harness patterns miss real internal tool names

**Evidence:** I copied the tip safety script next to a copy of the scratch build and added two leak pages:
```
_site/leak/index.html : "A local scholar-voice model; the U4 enrichment pack; extraction order; agentic."
_site/leak2/index.html: "We harness divergent thinking; cascade-harness.sh run."
$ node scripts/verify-publication-safety.mjs
Publication safety failed (4 finding(s)):  leak/: agentic arch, voice model, authoring pack, extraction locator
→ leak2 not reported: "cascade-harness" passes. (Ordinary "harness divergent thinking" correctly passes.)
```
The clean build gives "Publication safety passed", exit 0.

The external skill `~/src/.cursor/skills/lesson-scribe/SKILL.md` §9 (outside the repo; not checked by the implementer, as `DECISIONS-LOG` records) still prescribes this "public role vocabulary" for student-visible surfaces: *lesson harness*, *studio lesson orchestrator*, *studio extraction layer*, *classroom vector index*, *cite-grade discovery*, *citation-fidelity gate*, *local inference runtime*. Several of these pass the current script but describe local architecture, which the hard constraint forbids. *Scholar-voice model* fails closed, which is correct.

**Fix:**
- Add `cascade-harness`, `lesson harness`, `studio (lesson orchestrator|extraction layer|semantic index|generation wrapper)`, `classroom vector index`, `cite-grade discovery`, `citation-fidelity gate` and `local inference runtime` to `verify-publication-safety.mjs`.
- Add a FINAL-REVIEW line asking the professor to align `lesson-scribe` §9 with the A4 one-sentence footer. That file is outside the repo and the cascade must not edit it.

**Cascade amend:** recommended. Add one line to `FINAL-REVIEW.md` and/or Amendment A4 in `TECHNICAL-DIRECTOR-CASCADE.md` so that EX8–EX10 and the U4–U6 forge on `main` do not re-import that vocabulary.

### F3 · P2 · does not block DONE: U4 l.186 is accurate but still uses light editor jargon

**Evidence:** The U4 phase diff touches exactly lines 186, 190 and 192 (`git diff -U0 excellence/integration...cascade/excellence-2 -- …/u-4-workplace-application/` → `@@ -186 +186`, `@@ -190 +190`, `@@ -192 +192`).
- **l.190** is byte-identical to the U1–U3 footer sentence (the md5 of the footer line in u-1…u-4 is `9d8937…` for all four). It renders `<a href="/creativity-techniques-uem/ai-declaration/">AI usage declaration</a>`.
- **l.192** renders `Date: 2026-10-04 · Studio: crea-comm.net`. That is the public domain, which round 1 allowed.
- **l.186** now reads "Michalko (2010) anchors Wall of Ideas and Ask a Crab / Picture Prompting; its page locators are not yet verified against the printed edition."
  - This is accurate. The body cites `(Michalko 2010, 440)` and `(Michalko 2010, 402)`, and the sentence keeps the caveat without adding a claim.
  - "page locators" is still librarian jargon, and the sentence no longer says *which* numbers are in doubt.
  - The same paragraph keeps "this pass does not ship a page-backed Chicago claim" (pre-existing; under A1 the rest of U4 is outside scope except firewall edits).

**Fix (when U4 is next in scope):** "…; the page numbers cited for Michalko (402, 440) are not yet checked against the printed edition." Rephrase "this pass does not ship a page-backed Chicago claim" as "this lesson does not yet cite a specific page for that point." **Cascade amend:** no.

### F4 · P2 · does not block DONE: lesson breadcrumb now has two adjacent crumbs pointing to the same URL

**Evidence:** The F9 edit in `_layouts/lesson.html` fixed the 404: every breadcrumb href in every built lesson resolves (my crawler checked 697 root-relative href/src/data-*url values and found 0 broken). The cost is that on U1–U4 the "Lessons" and "Creativity techniques" crumbs both link `/creativity-techniques-uem/lessons/en/creativity-techniques/`:
```
u-1…: href="/creativity-techniques-uem/" · href=".../lessons/en/creativity-techniques/" · href=".../lessons/en/creativity-techniques/"
master-lectures/creative-process-analysis: Home · Lessons → .../creativity-techniques/ · .../master-lectures/
```
The breadcrumb text is "Home / Lessons / Creativity techniques / U1 · …".

**Fix (optional, EX9/EX11):** drop the "Lessons" crumb when the next crumb has the same href, or add a `/lessons/en/` index page. **Cascade amend:** no.

### F5 · P2 · does not block DONE, pre-existing: hreflang "es" still emitted on 5 non-`/en/` pages, pointing to the English page itself

**Evidence:**
```
$ grep -ro '<link rel="alternate" hreflang="es"[^>]*>' site
index.html, assignments/index.html, ai-declaration/index.html, tracks/index.html, evaluation/index.html
  → each href is the page's own (English) URL
```
The F9 edit in `_includes/head-hreflang.html` correctly removes the dead `/lessons/es/…` alternates. No lesson page now emits `hreflang="es"`, and every emitted href exists in the build. However, for URLs without `/en/`, the fallback `replace: '/en/','/es/'` is a no-op, so the "built page" check finds the page itself. This is not a broken link, only a wrong language label.

**Fix:** also require `es_rel != page.url` before emitting. **Cascade amend:** no.

### F6 · P2 · does not block DONE, owned by EX3 (A4/F6, B11): Profield residue in public JSON, JS and file names

**Evidence (scratch build sweep, all file types):**
- `profield` appears in 5 deck `content.json` files (asset URLs). Four deck `description` values read "Accepted/ranked Profield review-state assets for tc/U3." One of them adds "Fill via `npm run media:rehydrate` …".
- `assets/js/student-media-deck.js` contains a "Profield" comment.
- 24 cache files `assets/images/profield-cache/*.php` are published; they are JPEG data (`file …52a5d11561e69832.php → JPEG image data`).

All of this is assigned to EX3 (`PHASE-EX3.md` A4/F6 line; B11 at l.19–20 and l.100). It is recorded here, not blocking. **Cascade amend:** no; EX3 already owns it.

### F7 · P2 · does not block DONE: `npm run build` could not be reproduced in this session

**Evidence:**
```
$ npm run build --ignore-scripts   (git archive HEAD copy, node_modules symlinked from the worktree)
sh: postcss: command not found   (exit 127)
```
The worktree has no installed `node_modules`. The gate's `build_site` (jekyll only) and the safety script both ran and passed (see above). Round 1 ran the npm path successfully, and round 2 changed nothing in `package.json` or the postcss inputs, so this is an environment gap, not a defect. **Fix:** none required; run `npm ci` before the release build. **Cascade amend:** no.

---

## Acceptance re-check (my own commands)

| Item | Result | Evidence |
| --- | --- | --- |
| EX2 gate | **PASS** | `bash PHASE-EX2.exit-gate.sh` → 32 PASS, `failures: 0`, exit 0 (matches the runner log at `7d68e15`) |
| EX1 / EX0 regression | **PASS** | EX1: 18 PASS, exit 0. EX0: 7 PASS, exit 0 |
| build ok · `_site/_data` absent | **PASS** | scratch build exit 0; `ls _data` → No such file |
| Whole-site sweep (html/js/json/css/xml/txt/svg/php) | **PASS, with EX3 residue only** | 0 hits for Ahmes, Athanor, DevIAC, forge*/forging, harness*, lesson-scribe, vault, Thessia, scholar-voice, enrichment pack, extraction order, adjudicat*, agentic, `\bpilot\b`, 9990002301, udit, web-atelier, /Users/, curriculum-internal, procurement, guía clone, contact-forgeable, ollama, qwen, MCP, BIBLIO-GAP, evaluator_safe, switch-gated, professor brief, lesson_uuid, review-state, creativity-techniques-pedagogy, cv/guides. Remaining: `profield` (F6, EX3); "locators" ×1 in U4 (F3); "digital creativity" ×1 in a lexicum label (lowercase, allowed by DECISIONS-LOG); "contenidos" only in inline TOC JS (`'tabla de contenidos'`); `crea-comm` = public domain/footer. HTML comments in the build are layout-only (Favicon, Breadcrumb, Print…) |
| Script catches a leak | **PASS** | the leak page above fails with 4 findings, exit 1; clean build exit 0. Gap noted in F2 |
| Round-1 F1 (U4 186/190/192) | **CLOSED** | only those 3 lines differ from integration; footer links `/creativity-techniques-uem/ai-declaration/`; wording accurate (F3 is polish) |
| Round-1 F2 (forge rules) | **CLOSED** | `grep -nE 'Forge date\|vault counts\|Forging consulted\|harness: '` over `forge/*.mdc` (excluding receipts) → no student-surface mandate. `ct-unit-forge.mdc` §4b now requires the one-sentence footer + `relative_url` link and moves stack, forge date and vault count to the `publish_internal_metadata` comment. `CREATIVE-PROCESS-ANALYSIS-FORGE.mdc:130` points to §4b. This is consistent with AI-DECLARATION-LAW: link + context ("when you submit a Lab entry or deliverable from this unit") + "No AI tools used" valid; the law "does not require technical details about AI model versions". External-skill residue: F2 |
| Round-1 F3 (declaration link) | **CLOSED** | crawler: 0 root-relative links outside `/creativity-techniques-uem`; 0 broken among 697. Every U1–U4, master-lecture and assignment-brief page has 2 baseurl declaration hrefs (nav + content); every other page has the nav one, except redirect stubs, deck players and `/tao/` (0, no nav) |
| F9 template edits | **CORRECT, no broken links** | every built lesson breadcrumb href and every emitted hreflang href exists in the build; the dead `/lessons/en/` and `/lessons/es/…` targets are gone. Cosmetic issues: F4, F5 |
| F4 (round 1) wording | **CLOSED** | master-lectures hub: "They are not units of the official course contents — they are method workshops with an in-class slideshow." The professor-brief sentence is deleted from the master lecture |
| F8 (round 1) wording | **CLOSED** | methodology: "Each published unit maps to one of the official course contents, …". This is now a scoped claim; U5–U6 are unpublished |
| Every lesson and assignment links `/ai-declaration/` | **PASS** | gate loop plus the crawler counts above |

## Notes

- **Blocking fixes:** none.
- **Recommended before release:** F2 (extra safety patterns plus a FINAL-REVIEW line for the external `lesson-scribe` §9 vocabulary) and F1 (gate `harness:` arm). Both are one-line edits.
- Full existing suite: the repo has no unit-test runner beyond the gates. `tests/test-gitflow.sh` exercises `gitflow.sh`/`cascade-harness.sh`; EX2 did not touch either, and I did not run it. The gates above are the regression suite.
- The gate runs rewrote the git-ignored `_site/` in the worktree. All other builds and copies went to the session scratchpad. I edited nothing except this file and committed nothing.
- The reviewer does not mark DONE; that decision belongs to the orchestrator or the professor.
