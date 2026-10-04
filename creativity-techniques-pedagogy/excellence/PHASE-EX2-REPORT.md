# PHASE-EX2 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-04T18:05Z (approx.) |
| **finished_at** | 2026-10-04T18:40Z (approx.; implementation done, awaiting `cascade-harness.sh verify` and cold review) |
| **cold_review** | PHASE-EX2-COLD-REVIEW.md (not yet filed) |
| **cascade_amended** | none (residuals and downstream notes below are for the orchestrator and cold reviewer) |
| **branch / worktree** | `cascade/excellence-2` · `creativity-techniques-uem-integration-excellence-2` (`.cascade-lane` = `excellence`) |

## Summary

All six deliverables, plus Amendments A2/F5 (site-wide firewall, `forge` and
`Forge date` patterns) and A3/F9 (guía id `9990002301`), are implemented:

1. `_config.yml`: `_data` removed from `include`. I checked runtime fetches first:
   `grep -rn "_data" docs/assets/js docs/_layouts docs/_includes` finds only a
   Liquid comment in `_includes/locale-switcher.html`, which reads `site.data`
   at build time. Nothing fetches `/_data/` in the browser.
2. `scripts/verify-publication-safety.mjs`: 15 new patterns (`Forge date`,
   `forge/forged/forges/forger/forging`, `harness`, `lesson-scribe`, `vault(s)`,
   `Thessia`, `curriculum-internal`, `open procurement`, `guía/guia clone`,
   `contact-forgeable`, `9990002301`, `udit`, `web-atelier`,
   `digital-creativity-uem`, and `Digital Creativity`, which is case-sensitive so
   the lexicum entry "digital creativity tool" is not flagged). `profield` is
   checked in `.html` only, because deck JSON values keep it until EX3. The
   script also fails if `_site/_data` exists.
3. Student wording was rewritten on the track page, lessons hub, U1–U3, master
   lecture, evaluation context (D3), assignments, methodology and bibliography
   (38 sentences; see the table below). Some of these pages are outside
   Deliverable 3's list. They are included because Amendment A2/F5 makes the
   whole site the firewall's scope.
4. The AI-assisted authorship footers are now one sentence plus a link to
   `/ai-declaration/`. They meet `forge/AI-DECLARATION-LAW.mdc` (link, plus
   context on when and how students declare). The law does not require any
   technical architecture ("does not require technical details about AI model
   versions or parameters"), so no amendment request is needed. The D1
   assignment brief now links the declaration page too.
5. The master lecture no longer has the UDIT link or the Digital Creativity
   comparison. The CSS class `.footer-logo--udit` is renamed
   `.footer-logo--secondary`. No template used it.
6. `docs/tracks/en/uem/2627-ct/special-creative-process-analysis/data/content.json`
   is deleted. The folder's `index.html` was already a meta-refresh redirect to
   `/master-lectures/creative-process-analysis/`. I kept it so old URLs still
   resolve. `grep docs/ scripts/` finds no student page that links to
   `/tracks/ct/special-creative-process-analysis/`. Both the track page and the
   hub link the master-lecture deck directly. Every remaining deck in `2627-ct/`
   has `project_id: "tc"`.

## Gate results (run in this worktree, 2026-10-04)

The caller asked me to run the gate here. I am not self-certifying: the
runner's `cascade-harness.sh verify` log is still the record.

```text
$ bash creativity-techniques-pedagogy/excellence/PHASE-EX2.exit-gate.sh
PASS: jekyll build
PASS: safety script passes
PASS: _site/_data not published
PASS: no internal terms in built HTML (whole site)
PASS: no internal guide path in built HTML
PASS: internal guía id not rendered (A3/F9)
PASS: safety script has pattern: harness
PASS: safety script has pattern: lesson-scribe
PASS: safety script has pattern: vault
PASS: safety script has pattern: udit
PASS: safety script has pattern: forge
PASS: safety script has pattern: 9990002301
PASS: AI declaration linked: docs/lessons/en/creativity-techniques/u-1-introduction-creativity/index.md
PASS: AI declaration linked: docs/lessons/en/creativity-techniques/u-2-idea-generation-selection/index.md
PASS: AI declaration linked: docs/lessons/en/creativity-techniques/u-3-development-solutions/index.md
PASS: AI declaration linked: docs/assignments/en/creative-process-analysis-presentation/index.md
PASS: AI declaration linked: docs/assignments/en/creativity-techniques-portfolio/index.md
PASS: old special deck retired
----
failures: 0
```

Regression: `PHASE-EX0.exit-gate.sh` → `failures: 0`; `PHASE-EX1.exit-gate.sh` → `failures: 0`.

## Leak-test transcript (Deliverable 4)

```text
$ printf -- "---\ntitle: Leak test\npermalink: /leak-test/\n---\nAuthored with lesson-scribe v0.1.\n" > docs/leak-test.md
$ bundle exec jekyll build --source docs --destination _site --config _config.yml
                    done in 0.288 seconds.
$ node scripts/verify-publication-safety.mjs
Publication safety failed (1 finding(s)):
_site/leak-test/index.html: internal authoring agent
exit=1
$ rm docs/leak-test.md && rebuild
$ node scripts/verify-publication-safety.mjs
Publication safety passed: no internal corpus or local-architecture metadata in _site.
exit=0
```

**The new script fails on the pre-fix site; the old script passes on it.** I
exported HEAD `5e64bd1` with `git archive` into a scratch folder (not a
worktree) and built it:

```text
old script (HEAD)  → "Publication safety passed: …"            exit=0
new script         → "Publication safety failed (45 finding(s))" exit=1
   includes: _site/_data: raw site data published
             _site/_data/tracks.yml: internal guide-copy label / internal guide identifier
             _site/{ai-declaration,lessons/…/u-1,u-2,u-3}/index.html: internal authoring agent
             … forge, harness, vault, UDIT, web-atelier, Digital Creativity, Profield, contact-forgeable, 9990002301
```

## Before / after: every changed student-facing sentence

| # | File (rendered page) | Before | After |
| --- | --- | --- | --- |
| 1 | U1 lesson (front matter `frontier_signal`, rendered as "Frontier signal") | Buchanan, Schön, and Kimbell primary extracts remain open procurement — studio hypotheses, not page-verified yet | Buchanan, Schön, and Kimbell are further reading for this unit; it does not cite them yet |
| 2 | U1 lesson | **Not this week:** D2 transposition, D3 Atrium tech script, D5 exam. | **Not this week:** D2 transposition, D3 Atrium (technical script and live defence), D5 exam. |
| 3 | U1 lesson, Conclusion | …those primary extracts are still open procurement in this library, and reading one of them… | …this unit does not cite them yet, and reading one of them… |
| 4 | U1 lesson, References | **Open procurement (not cited in the body until extracts resolve):** Buchanan …; Schön …; Kimbell …. Do not treat those titles as page-verified for this unit yet. | **Further reading (not cited in this unit):** Buchanan …; Schön …; Kimbell …. |
| 5 | U1 lesson, AI-assisted authorship | 7-line paragraph (local agentic harness, MCP retrieval, RAG from the curriculum vault, fine-tuned voice model, "Forging consulted 3 vault sources", archive note) + "*Forge date … harness: `lesson-scribe` v0.1*" | Rubén Vega Balbás, PhD, wrote this lesson with AI assistance and is responsible for the final text; when you submit a Lab entry or deliverable from this unit, declare your own AI use (or state "No AI tools used") as set out in the [AI usage declaration](/ai-declaration/). |
| 6 | U2 lesson | **Not this week:** D2 transposition, D3 Atrium tech script, D5 exam. | **Not this week:** D2 transposition, D3 Atrium (technical script and live defence), D5 exam. |
| 7 | U2 lesson, AI-assisted authorship | Same 7-line paragraph ("16 vault sources") + "*Forge date … harness: `lesson-scribe` v0.1 · prompt-v2.1 · CT U2 teaching-week pass*" | Same sentence as row 5 |
| 8 | U3 lesson, Editorial note | This pilot uses the U3 enrichment pack and two in-practice candidates from Cross and de Bono as a bounded teaching hypothesis. | This unit adapts two Lab exercises from Cross and de Bono and treats them as a bounded teaching hypothesis. |
| 9 | U3 lesson, AI-assisted authorship | …in the crea-comm.net studio environment. A local scholar-voice model supplied a draft … rebuilt against the grounded U3 enrichment pack. … + "*Forge date: 2026-09-19 · … harness: `lesson-scribe` v0.1*" | Same sentence as row 5 |
| 10 | **U4 lesson (firewall-only)** | *Forge date: 2026-10-04 · Studio: crea-comm.net* | *Date: 2026-10-04 · Studio: crea-comm.net* |
| 11 | Lessons hub | Official CONTENIDOS units sit inside it; they do not replace it. | The official course units sit inside it; they do not replace it. |
| 12 | Lessons hub | Masterclass slides use course media (accepted Profield images when available). | Masterclass slides use course images. |
| 13 | Lessons hub, Units table | U3–U6 · (pending forge) | U3 row and U4 row (lesson + deck links, the same as the track page) · U5–U6 · Not yet published |
| 14 | Lessons hub, Deliverables | **D3 Atrium** — tech script + live · *What is creativity for you?* | **D3 Atrium** — technical script + live defence · *What is creativity for you?* |
| 15 | Track page | This page is the fork-ready track index. Do not invent Campus Virtual dates here. | Dates and submission channels are published in Campus Virtual, not on this page. |
| 16 | Track page, Programme frame | 2026–27 *(guía clone currently 2025–26 — reconcile when 2026–27 PDF lands)* | 2026–27 *(this site follows the 2025–26 official course guide until the 2026–27 guide is published)* |
| 17 | Track page, Programme frame | **150 h** (contact-forgeable bucket **80 h**) | **150 h** (**80 h** contact) — same figures as How to Pass ("150 h · 80 h contact") |
| 18 | Track page heading | Units (official CONTENIDOS) | Units (official course contents) |
| 19 | Track page | Shared analysis methods — **not** CONTENIDOS unit IDs. | Shared analysis methods — **not** units of the official course contents. |
| 20 | Track page | Critical layers (ideology, labour, GenAI authorship) live in pedagogy/media vocab only — they are **not** fake CONTENIDOS rows. The Master Lecture is a transversal method guide (same eight steps as the Digital Creativity fashion-image master lecture). | The Master Lecture is a method guide shared by all units. |
| 21 | Track page | …use **In-class deck** at the lesson head for the Reveal surface used in class. | …use **In-class deck** at the lesson head for the slides used in class. |
| 22 | Track page, Official contract | Pedagogical binding source: official guía PDF family `9990002301` (Design degree clone). | Binding source: the official course guide (*guía docente*) for the Bachelor's Degree in Design. |
| 23 | Track page, Arc | …The sibling Digital Creativity stream trains fashion-digital craft; this track owns ideation technique, selection judgement, and workplace transfer — ready to fork units without inventing hours beyond the guía. | Creativity Techniques trains **method literacy** under professional constraints (briefs, deadlines, competition): ideation technique, selection judgement, and workplace transfer. |
| 24 | Methodology | Tool craft for fashion-digital media lives in the sibling **Digital Creativity** stream; this course owns the *technique*… | This course owns the *technique* and the *judgement* that decides what survives. |
| 25 | Methodology | The fork is ready when: units map to official CONTENIDOS, hours close to the guía, and every claim of "technique" can show process evidence. | Every unit maps to the official course contents, and every claim of "technique" must show process evidence. |
| 26 | Methodology | From the Design-degree clone: **Magistral class**, … Do not invent a fourth institutional methodology label. | From the official course guide (Design degree): **Magistral class**, **cooperative learning**, **experiential learning**. |
| 27 | Methodology | ## Fork readiness — This methodology page is intentionally lean and **fork-ready**: unit forges should link back here… Do not deepen Spanish dual surfaces — this site is English-only. | ## Where to find the rest — Each unit links back here rather than restating the cycle. Evaluation weights are on the Evaluation page; the bibliography is on the Bibliography page. |
| 28 | Bibliography | Lists below follow the official guía clone; … | Lists below follow the official course guide; … |
| 29 | Master lecture | …a transversal analysis method for Creativity Techniques (and sister analysis guides). It is **not** an official CONTENIDOS unit ID. | …an analysis method shared by every unit of Creativity Techniques. It is **not** one of the official course units. |
| 30 | Master lecture, Why this guide | Same method as the fashion-image **Master Lecture** in Digital Creativity — and the same spirit as the [Web Analysis Guide](ruvebal.github.io/web-atelier-udit/…): numbered steps, one sitting, critical emphasis. | The guide uses numbered steps, one sitting, and a critical emphasis. |
| 31 | Master lecture | …It does not invent a CONTENIDOS ID. | (sentence removed; "This lecture **deepens** the Analysis method already in every CT lesson." kept) |
| 32 | Master lecture, Editorial note | **Declared gap:** Steimberg (2013) … until public Chicago citations are ready. Ricoeur (1977) and Bay-Cheng et al. (2010) stay in the professor brief (bibliographic confidence below 0.85). **Missing evidence:** Munari / Werhane … Chion / Alexander … **Addressed-to-editor:** Cycle 2 adds Eckersall, Grehan, and Scheer 2017 as a second public spine… | **Declared gap:** the genre / style / transposition and circulation vocabulary used here is course-method vocabulary; this guide does not yet cite a source for it. **Sources:** Eckersall, Grehan, and Scheer (2017) support material composition and circulation; Craft, Chen, and Csikszentmihalyi support process literacy. |
| 33 | Master lecture, AI-assisted authorship | Vault counts this cycle: **4** public sources cited (…) · date **2026-09-27** · guide prose author-edited. See site AI declaration when published. | Rubén Vega Balbás, PhD, wrote this guide with AI assistance and is responsible for the final text; when you use this method for D1 or a portfolio entry, declare your own AI use (or state "No AI tools used") as set out in the [AI usage declaration](/ai-declaration/). |
| 34 | AI declaration page, AI-assisted authorship | 1-paragraph harness/vault description + "Forge date … harness: `lesson-scribe` v0.1" + link to `ruvebal.github.io/web-atelier-udit/…/ai-assisted-development-foundations/` | Rubén Vega Balbás, PhD, wrote this page with AI assistance and is responsible for the final text; the declaration elements above apply to every piece you submit in this course (portfolio entry, exercise, project, or exam response). |
| 35 | D1 assignment, What to submit | **Authorship / AI declaration** (tools, collaborators, "no AI" valid). | **Authorship / AI declaration** (tools, collaborators, "no AI" valid) for this presentation, following the [AI usage declaration](/ai-declaration/). |
| 36 | Tao of Creativity page (`assets/js/tao-quotes.js`) | Note on how this text is forged | Note on how this text is made |
| 37 | Tao public JSON (`tao/data/quotes.json`, note 1) | Public JSON is student-safe. … Field discussion ids match the Tao forge ledger / COMBINE tension table. semantic_tags are vault-compatible DH descriptors for invents. | Lexicum links are course thesaurus URIs (ct:…). Field discussion ids name tensions held open in the field map. semantic_tags are DH descriptors for invents. |
| 38 | Tao public JSON (note 2) | …(CIDOC / AAT / DCTERMS) for vault-compatible invents — no corpus product names in this public file. | …(CIDOC / AAT / DCTERMS). |

Non-sentence changes: the `site.css` header comment ("ATELIER UDIT" → "Creativity
Techniques") and class rename; a `student-media-deck.js` code comment
("forger version strings" → "authoring-tool version strings").

**D3 source.** Rows 2, 6 and 14 use the Evaluation page's existing D3 row ("Tech
script + live defence · *What is creativity for you?*") and the How to Pass deck
("tech script + live defence"). No new deliverable was invented. I left the
Evaluation and How to Pass D3 rows unchanged because they are the source.

## Local model calls

| # | Model | Purpose | Prompt | Tokens (prompt / eval) | Time | Used? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `qwen2.5:32b-instruct` (plain `/api/generate`, `stream:false`, temp 0.2) | Plain-English rewrites of 10 jargon sentences | `evidence/EX2-qwen-prompt.txt` (response: `evidence/EX2-qwen-response.txt`) | 523 / 325 | 26.3 s | Partly, as wording ideas (rows 15, 23, 27, 29). Rejected where it added facts or kept jargon: "lists the course tracks", "do not add any dates", "still being reviewed", "Reveal surface" kept, "U3 enrichment pack" kept |

Before loading I ran `ollama ps` (no model loaded) and checked the in-practice
`runtime/process.json` (PID 48350, not alive). Thessia was not used, and no
agent was run.

## Residuals and things I did not do (for the cold reviewer)

1. **U4 internal jargon left in place, deliberately.** U4 still renders "the
   locators used in this pilot (402 and 440 in the extraction order)" (editorial
   note) and "rebuilt against the U4 enrichment pack, Thinkertoys source
   adjudication" (authorship footer). Neither phrase matches a gate or script
   pattern. The caller asked for minimal U4 diffs because another process edits
   U4 on `main`. I changed only the `Forge date` line and logged this for the U4
   forge (FINAL-REVIEW, DECISIONS-LOG).
2. **U4 does not link `/ai-declaration/`.** The gate checks only U1–U3. Adding the
   link would go beyond a firewall-only edit, so it is left to the U4 forge.
3. **`project_id: "ml"` in the master-lecture deck (`2627-ml/`) is unchanged.**
   The deck is not in `2627-ct/`. `project_id` drives the Profield assignment
   lookup in `scripts/rehydrate-student-media.mjs`, so changing it to `tc` would
   change which images the deck rehydrates. That is media work (EX3/EX4).
4. **Stale internal references:** `forge/CREATIVE-PROCESS-ANALYSIS-FORGE.mdc:122`,
   `forge/CREATIVE-PROCESS-ANALYSIS.execute.md:43,70` and
   `forge/receipts/SU-CPA-CYCLE1-FEEDBACK.md:35` still name the retired
   `2627-ct/special-creative-process-analysis/` deck. These are private forge
   files outside EX2's scope and are not rendered.
5. `docs/_data/tracks.yml` still contains "guía clone" and `9990002301`. It is no
   longer published, and the built HTML does not render it (the gate's HTML grep
   and the safety script pass). It is noted for whoever edits the data layer next.
6. Remaining student-visible editorial vocabulary, left as is because it is not
   machinery: "page-verifies" in the U2 editorial note; "Frontier signal" (label
   from `_includes/lesson-semantic-graphic.html`); "C1–C3" in the D1 brief, which
   is explained in parentheses on the page.

## Resume point

The implementation is committed on `cascade/excellence-2`. Next steps are the
runner's `cascade-harness.sh verify … PHASE-EX2.md <worktree>` and then a fresh
cold review.
