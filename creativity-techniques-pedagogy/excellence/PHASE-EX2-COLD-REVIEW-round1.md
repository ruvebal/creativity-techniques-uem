# PHASE-EX2 Cold Review: publication firewall

| Field | Value |
| --- | --- |
| **reviewer** | cascade-cold-reviewer (fresh session, Claude Opus 5.5; did not implement EX2) |
| **reviewed_at** | 2026-10-04 |
| **implementer_claim** | VERIFYING: all six deliverables and A2/F5 and A3/F9 done; gate 18/18 PASS; 38 sentences rewritten; new script fails the pre-fix site (45 findings) |
| **verdict** | FAIL |

Reviewed: `cascade/excellence-2` @ `383701f` against `excellence/integration` @ `5e64bd1`.
Verify log commit `74896d4` is an ancestor of the tip. `git diff --stat 74896d4 HEAD` shows only
`PHASE-EX2-VERIFY-LOG.md` (+33). Scratch build: `bundle exec jekyll build --source docs --destination <scratch>/site --config _config.yml`.
Pre-fix site: `git archive excellence/integration` into a scratch directory, then built.

There are three blocking findings (F1–F3). Each needs one to three small edits, and no fix
requires undoing the implementation.

---

## Findings

### F1 · P1 · blocks DONE: U4 still renders a description of the local authoring pipeline; A2/F5 required its removal

**Evidence** (scratch build, whole site):

```
$ grep -rliE 'scholar-voice|enrichment pack|extraction order|adjudicat|studio environment' site
lessons/en/creativity-techniques/u-4-workplace-application/index.html        (only file)
```
U4 source, rendered lines:
- l.186 (editorial note): "Michalko (2010) anchors Wall of Ideas and Ask a Crab / Picture Prompting at the locators used in this pilot (402 and 440 in the extraction order) — these are not independently verified printed pages."
- l.190 (authorship footer): "A local scholar-voice model supplied paragraph drafts that were rejected where they introduced quotation marks, fabricated Lab paths, or mis-attributed methods; the final text was rebuilt against the U4 enrichment pack, Thinkertoys source adjudication, and page-checked citations."

The safety script does not catch this text. I added a scratch page with the U4 wording plus a second page with "lesson-scribe", rebuilt, and ran the script:
```
Publication safety failed (1 finding(s)):
_site/leak-test-2/index.html: internal authoring agent      ← only the lesson-scribe page is caught; the U4 wording passes
```

**Ruling on the implementer's residual 1.** Leaving this text is not acceptable under A2/F5:
- The hard constraint forbids "... names, IDs, paths **or local architecture** in student HTML". A local scholar-voice model, an enrichment pack, source adjudication and an extraction order all describe local architecture.
- The implementer applied the same rule elsewhere. Report row 9 removes the equivalent U3 sentence ("A local scholar-voice model supplied a draft … rebuilt against the grounded U3 enrichment pack") as a firewall leak, so the U4 decision is inconsistent with it.
- A2/F5 says the firewall outranks A1's scope and explicitly allows firewall-only edits in U4. It also already accepts the merge-conflict risk ("A sync conflict on those files is a stop rule").
- Both fixes are single-line edits, so the caller's "minimal single-line U4 diffs" instruction allows them.
- AUTOPILOT §2 ("more conservative option: less published") points the same way.
- Whether a gate pattern happens to match does not decide the question. The hard constraint does.

**Fix (firewall-only, two lines in U4):**
- l.190: delete the second sentence ("A local scholar-voice model … page-checked citations."). Better: replace the whole paragraph with the standard U1–U3 sentence, which also closes residual 2 (the missing `/ai-declaration/` link). If you choose the replacement, log it in DECISIONS-LOG as a firewall-plus-law edit.
- l.186: replace "at the locators used in this pilot (402 and 440 in the extraction order) — these are not independently verified printed pages" with "; its page locators are not yet verified against the printed edition". This adds no new claim.
- Add patterns to `verify-publication-safety.mjs` and to the EX2 gate `TERMS`: `scholar-voice`, `enrichment pack`, `extraction order`, `source adjudication`, `agentic`. This is a **gate amendment** that strengthens the gate to match the intended change; I confirm it here per AUTOPILOT §4.

**Cascade amend:** no.

### F2 · P1 · blocks DONE: the forge rules still require the footer EX2 removed (amend-on-surprise not done)

**Evidence:**
```
$ grep -nE 'Forge date|AI-assisted authorship|vault counts' creativity-techniques-pedagogy/forge/*.mdc
ct-unit-forge.mdc:193  Every forged lesson closes with an `## AI-assisted authorship` section that:
ct-unit-forge.mdc:197-200  "Names the crea-comm.net studio stack … local agentic harness, MCP retrieval, RAG over the curriculum vault, scholar-voice model"
ct-unit-forge.mdc:213-224  boilerplate: "… local agentic harness … curriculum vault … Forging consulted **<n>** vault sources … *Forge date: … harness: `lesson-scribe` v0.1*"
CREATIVE-PROCESS-ANALYSIS-FORGE.mdc:130  "Student AI footer = vault counts + Chicago authors only."
```

`PHASE-EX2-REPORT.md` says `cascade_amended: none`. EX11 Deliverable 3 amends `ct-unit-forge.mdc`, but only for images, exercise cards, references and the retrieval slide, not the footer.

The concurrent U4 forge on `main` follows `ct-unit-forge.mdc`, and so will any later lesson regeneration in EX8–EX10. Every run that follows §4b reintroduces `harness`, `vault`, `Forging`, `Forge date` and `lesson-scribe`. The new safety script then fails `npm run build`, and the EX2 gate fails at the next `gitflow.sh land` regression. This is the case the closing protocol's amend-on-surprise rule names: "AI-DECLARATION-LAW requires text EX2 planned to remove". Here the conflict is with the forge rule rather than the law, but it is the same kind of conflict.

**Fix:**
- In `ct-unit-forge.mdc` §4b, replace items 2–3 and the boilerplate with the one-sentence footer plus the `/ai-declaration/` link that EX2 shipped.
- Move the studio-stack description, the vault count and the forge date into the existing switch-gated comment.
- Change `CREATIVE-PROCESS-ANALYSIS-FORGE.mdc:130` to match.
- Record "cascade amended: forge/ct-unit-forge.mdc, forge/CREATIVE-PROCESS-ANALYSIS-FORGE.mdc, TECHNICAL-DIRECTOR-CASCADE.md (A4 note)" in the report.
- Add a FINAL-REVIEW line warning the U4 forge on `main`.

**Cascade amend:** yes, `TECHNICAL-DIRECTOR-CASCADE.md` (Amendment A4) plus the two forge rules. If the orchestrator wants to keep forge-rule edits for EX11, then at minimum `PHASE-EX11.md` Deliverable 3 must list the footer, and A4 must record the interim risk.

### F3 · P1 · blocks DONE: the portfolio brief's AI-declaration link is a 404 on the live site, and the gate cannot see it

**Evidence:**
```
$ grep -rhoE 'href="/[^"]*"' --include='*.html' site | grep -v '"/creativity-techniques-uem'
   1 href="/ai-declaration/"            → assignments/en/creativity-techniques-portfolio/index.html
_config.yml: baseurl: '/creativity-techniques-uem'
docs/assignments/en/creativity-techniques-portfolio/index.md:47  [AI usage declaration](/ai-declaration/)
```
On GitHub Pages this link resolves to `ruvebal.github.io/ai-declaration/`, which does not exist. The defect predates EX2 (introduced in `e4e47e1`; the pre-fix build has the same link). The EX2 gate greps the Markdown source for the string `/ai-declaration/`, so it passes on a dead link. The Acceptance item ("every lesson and assignment still links `/ai-declaration/`") and AI-DECLARATION-LAW Verification 3 are therefore not met in the built site. Every other changed page uses `relative_url` correctly: U1–U3, the master lecture and D1 each render `href="/creativity-techniques-uem/ai-declaration/"` in the content as well as in the nav.

**Fix:**
- l.47: change the link to `({{ '/ai-declaration/' | relative_url }})`.
- Harden the gate by also asserting `grep -q 'href="/creativity-techniques-uem/ai-declaration/"'` in each built lesson and assignment page, outside the nav. Counting at least two hrefs per page would also work, since the nav supplies one. This is a **gate amendment** that strengthens the gate; I confirm it.

**Cascade amend:** no.

### F4 · P2 · non-blocking: internal and editor vocabulary still on student pages

**Evidence** (scratch build, tags stripped):
- `lessons/en/master-lectures/index.html`: "Shared analysis methods … **Not official CONTENIDOS unit IDs** — method workshops with an in-class slideshow." Source: `docs/lessons/en/master-lectures/index.md:12`. The same phrase was fixed on the track page (rows 19, 20) and in the master lecture (rows 29, 31) but missed on this hub.
- `lessons/en/master-lectures/creative-process-analysis/index.html` (source l.142): "**Keep secondary theorist names in the professor brief until their public Chicago entries are complete.**" This is an instruction to the editor, published to students, of the same kind as the "Do not invent Campus Virtual dates here" line that was fixed in row 15.

**Fix:** "Not units of the official course contents". Delete the professor-brief sentence. Do both in the same fix cycle as F1–F3.

### F5 · P2 · non-blocking: false-positive risk in the new patterns, and the sister-course ruling

- `\bharness(?:es)?\b` and `\bforg(?:e[ds]?|er|ers|ing)\b` match ordinary English that is common in creativity writing ("harness divergent thinking", "forge a habit"). A legitimate future lesson would fail the build. The script fails closed, so this is safe, but authors will have to rephrase. Narrow the patterns to the machinery forms (`agentic harness`, `harness:`, `Forging consulted`, `forge ledger`) or add an allowlist file.
- `\bDigital Creativity\b` is case-sensitive and blocks any published sister-course link as well as any reference title containing "Digital Creativity". **Ruling:** AGENTS.md forbids naming UDIT or **sibling institutions**. Digital Creativity is a course at the same institution, not an institution, so AGENTS.md does not prohibit a link. The only sister-course link is in `README.md` l.11, which is not published (the Jekyll source is `docs/`). No published page links it now: the home page `index.html` is byte-identical before and after EX2 (15048 bytes). Runbook Deliverables 2 and 5 explicitly order the pattern, so it stands as the runbook requires. If the professor later wants a home-page sister link, add an explicit allowlist entry for that one URL rather than deleting the pattern.

### F6 · P2 · non-blocking: "Profield" in published JS, which the HTML-only check skips

`assets/js/student-media-deck.js:3`: `// Spine: unit_cover → analysis → masterclass (Profield) → …`. The hard constraint covers student HTML and public JSON values, so a JS comment is outside its letter. However, the file is public and the `forbiddenHtmlOnly` rule never scans `.js`. Deck JSON `asset_url` values (`…/profield-cache/…`) are correctly deferred to EX3; `PHASE-EX3.md` l.28 and l.100 and its gate check "no deck JSON value contains profield". **Fix:** drop the word in EX3 or EX5 and extend the EX3 check to `assets/js/*.js`. **Cascade amend:** optional line in `PHASE-EX3.md`.

### F7 · P2 · non-blocking: master-lecture editorial note; ruling, and names not recorded

**Ruling:** removing unresolved author-dates from student text **now** is correct, and should not wait for EX6. The hard constraint is unconditional: "an unresolved source stays a BIBLIO-GAP in the professor brief, never in student text". Leaving them until EX6 would keep a known violation live. The replacement sentences are faithful: the "Declared gap" sentence keeps the gap without names, and the "Sources" sentence restates the old "Addressed-to-editor" pairing without adding a claim.

**Gap:** the gated `biblio_gap_gated` line (source l.39) records Steimberg, Munari/Werhane, Ricoeur and Bay-Cheng. **Chion, Alexander and Verón**, which were removed from student text, are recorded only in the git history and in `forge/receipts/SU-CPA-CYCLE1-*`. `PHASE-EX6.md` l.29 lists "Verón 1988; Steimberg 1993" but not Chion or Alexander. The old note said Steimberg (2013); EX6 says 1993, and EX6 must reconcile the two. **Fix:** append Chion and Alexander (and Verón) to the gated `biblio_gap_gated` line so EX6 can find them.

### F8 · P2 · non-blocking: one rewrite turns a readiness condition into a factual claim

Methodology row 25: the old sentence ("The fork is ready when: units map to official CONTENIDOS…") was a condition. The new one ("Every unit maps to the official course contents") states a fact, while U5–U6 are unpublished. Suggested wording: "Each published unit maps to one of the official course contents, and every claim of 'technique' must show process evidence."

### F9 · P2 · non-blocking, pre-existing (not EX2): broken links

```
broken internal link (post and pre build): /creativity-techniques-uem/lessons/en/   ← linked from U1, U2, U3 lesson pages
lessons/en/creativity-techniques/special-creative-process-analysis/ : hreflang="es" → /lessons/es/…/ (no Spanish page exists)
```
These also exist in the pre-fix build and are reported for EX9 or EX11. The crawler covered href, src and data-content-url values under the baseurl.

---

## Acceptance re-check (my own commands)

| Acceptance item | Result | Evidence |
| --- | --- | --- |
| Exit gate passes | **PASS** | `bash PHASE-EX2.exit-gate.sh` → 18 PASS, `failures: 0`, exit 0 (matches the runner log at `74896d4`) |
| build ok · safety script exit 0 · `_site/_data` absent | **PASS** | same run; my scratch build has no `_data/` |
| independent grep finds none of the terms (whole site) | **PASS for the listed terms; FAIL for the hard constraint (F1)** | grep over html/js/json/css/xml/txt for Ahmes, Athanor, DevIAC, forge*, harness, lesson-scribe, vault, Thessia, curriculum-internal, procurement, guía clone, 9990002301, udit, web-atelier, /Users/, ollama, qwen, in-practice and creativity-techniques-pedagogy: 0 files. Remaining hits: `profield` in 5 deck JSON (deferred to EX3) and 1 JS comment (F6); U4 pipeline text (F1); `crea-comm.net` is the public studio domain, author email and thesaurus URIs, which is allowed; 8-hex-dash ids are NYPL public item UUIDs (`nypl:ecd58340-…`), not Ahmes node ids (none found) |
| script source contains the new patterns | **PASS** | diff of `verify-publication-safety.mjs` (+15 patterns, HTML-only profield, `_data` check) |
| leak transcript; script would fail the pre-fix site | **PASS, reproduced** | pre-fix build: old script → "Publication safety passed", new script → exit 1, "Publication safety failed (45 finding(s))" (10 forge, 5 vault, 5 Forge date, 4 lesson-scribe, 4 harness, 3 UDIT, 3 Digital Creativity, 3 guía clone, 2 web-atelier, 2 guide id, 1 `_data`, 1 Profield, 1 contact-forgeable, 1 open procurement). Temporary lesson-scribe page → exit 1 |
| every lesson and assignment links `/ai-declaration/` | **FAIL (F3)** | U1–U3, master lecture and D1 render a baseurl-correct content link; the portfolio link is a 404; U4 has only the nav link (out of scope, closed by the F1 fix if the standard sentence is used) |
| Regression EX0 / EX1 gates | **PASS** | EX0 7/7 exit 0; EX1 18/18 exit 0 |
| `npm run build` path | **PASS** | in a `git archive HEAD` scratch copy with `node_modules` linked: `npm run build --ignore-scripts` (postcss → jekyll → verify:publication) → "Publication safety passed", exit 0. I skipped `prebuild` because it rehydrates decks (hard constraint); `hydrate` writes only `docs/_data`, and `rehydrate` rewrites only existing deck JSON, so neither restores the deleted deck or the edited Tao notes |
| `_data` removal breaks nothing | **PASS** | built-file diff pre→post: only `_data/*` (7 files) and the special deck `content.json` removed. `directory/en`, `lexicum/en`, `methods/en`, `index`, `evaluation`: byte-identical. No runtime fetch of `/_data/`; all `data-content-url`, `data-calendar-url` and `quotesUrl` targets exist |
| special deck retired, redirect works | **PASS** | `/tracks/ct/special-creative-process-analysis/` renders a meta-refresh and canonical link to `/creativity-techniques-uem/master-lectures/creative-process-analysis/`; the only remaining references to the old path are the lesson stub's own canonical and hreflang links; the master deck loads `2627-ml/…/data/content.json` (present). `2627-ct` decks: u-1…u-4 `project_id: "tc"`; how-to-pass has no project_id |
| AI footers vs AI-DECLARATION-LAW | **PASS (U1–U3, master lecture, AI page, D1)** | each footer links `/ai-declaration/` and says when to declare ("Lab entry or deliverable from this unit", "D1 or a portfolio entry"); the law "does not require technical details about AI model versions or parameters", so no law-driven amendment is needed. The forge-rule conflict is F2 |
| D3 wording | **PASS** | Evaluation l.45 "Tech script + live defence"; How to Pass deck "tech script + live defence" → U1, U2 "D3 Atrium (technical script and live defence)", hub "technical script + live defence". No new deliverable |

### Content spot-check (16 of 38 rows, against source and guía)

Rows 1–5 (U1), 8 (U3), 12, 13, 15, 16, 17, 22, 26, 29, 32 and 33 are accurate and in plain English, with these checks:
- Row 8: the internal block shows Ex1 as a de Bono drill grounded in Cross sketching and Ex2 as de Bono. "Two Lab exercises from Cross and de Bono" keeps the original attribution and adds nothing.
- Row 13: the U3 and U4 rows match the track page (titles and links).
- Row 16: no 2026–27 Diseño guía exists (EX1 log), so the wording is accurate.
- Row 17: "80 h contact" can be derived from the guía (`guia-tecnicas-de-creatividad-diseno-2025-26.json`): 150 − 50 autonomous work − 18 tutoring − 2 knowledge tests = 80. It also matches How to Pass.
- Row 26: the guía's methodologies are Clase Magistral, Aprendizaje Cooperativo and Aprendizaje experiencial, which match.
- Row 32: see F7.

Row 25 is the exception (F8).

## Notes

- **Blocking fixes for the next executor cycle:** F1 (two U4 lines plus five patterns in the script and gate), F2 (forge-rule §4b and CPA-FORGE:130 amendment, or EX11 Deliverable 3 plus an A4 record), F3 (one link in the portfolio brief plus a built-HTML gate check). After these, the code has changed, so re-run `cascade-harness.sh verify`. Doing F4 and F8 in the same cycle is recommended.
- **Gate amendments confirmed (strengthening only, per AUTOPILOT §4):** the new TERMS in F1 and the built-HTML AI-link check in F3.
- **Implementer residual 3 (`project_id: "ml"`):** keeping it is acceptable, because Deliverable 6 concerns the `2627-ct` decks (FINDINGS E4: `ct` vs `tc`). The stated reason is inaccurate, though: `npm run media:rehydrate` sets `PROFIELD_PROJECT=tc` with `DECK_ROOT=2627-ct`, so the tc run never visits `2627-ml`.
- Residuals 4–6 (private forge files naming the retired path, `tracks.yml` holding the guía id while unpublished, and the "page-verifies" and "Frontier signal" labels) are acceptable as logged.
- Local-model use (one qwen2.5 call, evidence files present) follows LOCAL-EXECUTION. I found no cloud SDK in the diff.
- This review edited and committed nothing apart from this file. The gate runs wrote the git-ignored `_site/` in the worktree; all other builds went to the session scratchpad.
- The reviewer does not mark DONE. The decision belongs to the professor or orchestrator after triage.
