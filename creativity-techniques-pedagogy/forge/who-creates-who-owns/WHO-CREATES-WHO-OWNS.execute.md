# EXECUTE — Who Creates, Who Owns, Who Scales? (CT Master Lectures)

**Status:** pass-1 forge on branch `forge/who-creates-who-owns-who-scales`  
**Forge:** [`WHO-CREATES-WHO-OWNS-FORGE.mdc`](./WHO-CREATES-WHO-OWNS-FORGE.mdc)  
**Series:** [`SERIES.md`](./SERIES.md)

---

## Operator paste prompt

```text
Forge CT Master Lecture series: Who Creates, Who Owns, Who Scales?

Read first:
1. SERIES.md + WHO-CREATES-WHO-OWNS-FORGE.mdc
2. STUDENT-SLIDESHOW-FORGE.mdc + SESSION-RHYTHM-AND-DELIVERABLES.mdc
3. CREATIVE-PROCESS-ANALYSIS pattern (lesson + 2627-ml deck)
4. grounding/who-creates-who-owns/visual-resources.json (rights ≠ clearance)
5. EXERCISES-GAP.md

Audience: bachelor design / American studies / creativity studies (~19).
Central concept: authorship. Three levels: artifact / system / political economy.

Lesson 1 Edison — five attribution cases (not five thefts); phonograph keeps Edison’s contribution; radio is counterexample; MPPC is market control.
Lesson 2 Fuller — same questions; integrity ≠ tensegrity; Dymaxion Without a Genius; software transfer last.

Grounding: cite Ahmes only when page-verified. Csikszentmihalyi 1996 + Norman 2013 OK. Edison research PDF + Fuller/Schumpeter/Simon = BIBLIO-GAP until vaulted.

Produce lessons, decks under 2627-ml/, wire master-lectures index + tracks.yml, professor briefs, then cold review ×2 on this branch.
```

---

## Preflight

- [x] Branch created
- [x] Series brief + forge + visual JSON + exercise gap note
- [x] Edison research PDF local (`grounding/who-creates-who-owns/edison-fuller-series-research.pdf`)
- [x] Profield OA tranche Ahmes+DevIAC+Athanor (`~/src/profield/runs/creativity-techniques/20261025-who-creates-who-owns/RECEIPT.md`)
- [ ] Ahmes batch of operator research PDF + Fuller/Schumpeter/Simon monographs (see PENDING)
- [x] Pass-1 lessons + decks (method-led; gaps gated; decks rendered)
- [x] Cold review #1 → PASS-WITH-AMENDS (`receipts/COLD-REVIEW-1.md`)
- [x] Amends (footers scrub; Fuller software → outro; analysis triad)
- [x] Cold review #2 → PASS (`receipts/COLD-REVIEW-2.md`) — Done for pass-1
- [x] Publication gate clean on series lesson HTML (unrelated d2 diagram JSON remains global)

---

## Receipt (cycle 1 — pass-1)

| Field | Value |
| ----- | ----- |
| Date | 2026-10-25 |
| Branch | `forge/who-creates-who-owns-who-scales` |
| Research PDF | `grounding/who-creates-who-owns/edison-fuller-series-research.pdf` (from `~/Downloads/export_7506882957666948587.pdf`) |
| Lesson 1 | `docs/lessons/en/master-lectures/who-creates-edison/` |
| Deck 1 | `docs/tracks/en/uem/2627-ml/who-creates-edison/` + `_includes/decks/who-creates-edison.html` |
| Lesson 2 | `docs/lessons/en/master-lectures/who-creates-fuller/` |
| Deck 2 | `docs/tracks/en/uem/2627-ml/who-creates-fuller/` + `_includes/decks/who-creates-fuller.html` |
| Index wire | master-lectures index + `tracks.yml` ML-WCOS-E/F |
| Public cites (pass-1) | Csikszentmihalyi 1996 · Norman 2013, 226 |
| BIBLIO-GAP | Edison historiography Ahmes pins; Fuller primaries; Schumpeter; Simon; Alexander |
| Exercises | See `EXERCISES-GAP.md` — process-trail adjacent; authorship/value-flow/counter-design not yet public YAMLs |
| Cold review | CR1 PASS-WITH-AMENDS → CR2 PASS |
| Gates | `verify:publication` clean on series HTML |

---

## Receipt (cycle 2 — corpus hardening)

| Field | Value |
| ----- | ----- |
| Date | 2026-10-25 |
| Corpus | Profield run `20261025-who-creates-who-owns` (11 OA coats, slug `profield-creativity-techniques`) |
| Discovery | DevIAC `search_knowledge` (slug above) → coat `extraction.db` → `ahmes query --cite --style chicago-author-date --require-evaluator-safe` |
| Resolver result | **1 of 4** “safe” coats passes: Robb 2024 (`71227d15`). `3dd15828` / `806a22bd` / `3cfe2d56` exit 2 (slug authors/years, conf 0.60); `enrich --force-meta --online` recovered nothing → downgraded to discovery-only |
| New public cites | `robb-2024` added to `references.yml` (Crossref vol. 10 (2): 242–45; printed folios checked on PDF). Edison lesson “Public attribution is produced, too”: Robb 2024, 242 · 243 · 243–44 · 244. Edison deck MC1 quote (Robb 2024, 243) |
| Fuller | No new cites — OA tranche has no Fuller coat; Editorial now names all monograph + DOI gaps |
| Editorial notes | Edison: Schumpeter, Lissoni–Montobbio–Zirulia 2013, Moser 2013, Nuvolari 2004, Osterloh–Rota 2007 (+ located-not-cited OA articles). Fuller: Fuller 1969 + 1975, Simon 1969, Alexander 1964, Schumpeter, Lee 2023, Serra Soriano et al. 2025, Brookes–Mould–Squire 2026, Osterloh–Rota 2007. Student-safe wording |
| CR3 amends | Vocabulary table separates collaboration / legal acquisition / appropriation / infringement / monopolization; Robb paraphrases tightened; deck MC1 quote bracketed + ellipsis; brief C1 pin + timing aligned to deck; Fuller MC6 prompt |
| Professor briefs | Rewritten: 90-min timing, C1–C3, citable vs discovery-only coat tables |
| Exercises | Unchanged — `process-trail` optional warm-up; no fake public IDs (`EXERCISES-GAP.md`) |
| Gates | `render:decks` OK · `validate:decks` 0 errors · `verify:publication` → only pre-existing unrelated `d2-transposition-workflow.visual-check.json`; series HTML clean |
| Cold review | CR3 PASS-WITH-AMENDS (`receipts/COLD-REVIEW-3.md`) → amends → **CR4 PASS** (`receipts/COLD-REVIEW-4.md`); CR4 optional brief wording (“helped cultivate”) applied |

## Receipt (cycle 3 — illustration, 2026-10-25)

- 20 assets upserted to `excellence/curation/autopilot-assets.json` (ML-WCOS-E 10 ok; ML-WCOS-F 2 ok, 8 flagged — amended after COLD-REVIEW-5). `npm run media:rehydrate` → 20 WebP in `docs/assets/images/deck-media/` (≤ 1920 px, ≤ 460 KB).
- Every media slide (cover, analysis-model, MC1–6, lab-1/2) curated `slide-bound`; structural roles stay geometrical.
- Lessons: 10 `lesson-figure` blocks each (src/alt identical to deck); Edison lesson links the LOC 1922 film (not embedded).
- Gates: render:decks ok; validate:decks 0 errors (new warnings = the 8 flagged Fuller assets: 6 fail on a recorded death year, 2 HABS sheets on `eu_term_ok: false`); series HTML denylist 0; `verify:publication` only the pre-existing `d2-transposition-workflow.visual-check.json` finding; `node --test scripts/tests/` 83/85 (incl. the 2 new who-creates figure tests) — the 2 failures (U2 claims, U4 bank) reproduce on the baseline without this branch's changes.
- COLD-REVIEW-5 FAIL → amended: Kinetograph sheet re-dated as 1902 reissue No. 12,037; Harrison alt rewritten (men and boys, task unrecorded); both HABS sheets flagged with delineator credit; Baldwin = dismantling; MC6 = stages; museum-foundation, residents, bathroom, signature, phonograph/NPS/distribution/Wolcott/replica alts corrected; Google Patents flag reasons name the unverified scan permission; who-creates lessons added to `scripts/tests/lesson-figures.test.mjs`.
- Open: professor launch decision on 8 flagged Fuller images (see `session-prompts/who-creates-fuller.md`).
- COLD-REVIEW-6 FAIL (1 × P2: HABS `eu_term_ok` still true) → set false on both HABS records so the gate treats HABS and FSA alike; P3 alts corrected (tensegrity sheet, car views, MC6 stages, Wolcott interior), MC6 signature prompt and Norman 226 brief note fixed. Not done: G5 (naming the HABS museum house as the Wichita House) — no source in hand; captions keep “as installed at the Henry Ford Museum”.
