# COLD REVIEW — SU-CPA cycle 1 (Creative Process Analysis)

**Reviewer role:** cascade-cold-reviewer (no implementer memory; fail-closed on stated criteria)  
**Date:** 2026-09-27  
**Unit:** SU-CPA · Special · Analyse a creative process (CT / EN)  
**Artefacts reviewed:** `CREATIVE-PROCESS-ANALYSIS-FORGE.mdc` · `SU-CPA-CYCLE1-FEEDBACK.md` · student lesson · Reveal `content.json` · track wire · sibling `SU-FIA-CYCLE1-COLD-REVIEW.md` pattern  
**Decision owner:** product owner — this file does **not** mark the phase DONE.

---

## 1. Verdict

**PASS-WITH-AMENDS**

Pedagogy is pilot-ready: eight steps live in the lesson, Lens A/B stay distinct, critical step is mandatory and visible, public Chicago is Craft / Chen / Csikszentmihalyi only (three SAFE authors — stronger than SU-FIA’s one-author pilot), deck law holds (≤6 masterclass + `analysis_opener` + `analysis_model` + two labs + geometrical openers), and deck `media_selection.description` is clean (no Ahmes — **SU-FIA F2 did not recur**).

**One P0 publication-firewall leak remains** in the student-visible Editorial note (`coats` / `evaluator-safe`). Feedback self-check incorrectly claims firewall pass. Fix those before treating cycle 1 as green for exam use or de-pilot.

Craft / Chen / Csikszentmihalyi **are enough for `status: pilot`** without Steimberg SAFE Chicago. Keep Steimberg / Verón as course method until coated; require Steimberg SAFE (or equivalent circulation spine) before exam-grade discursive-circulation claims.

---

## 2. Blocking finds

### F1 — P0 · Publication firewall leak in student Editorial note

**Blocks DONE:** yes  
**Criterion:** no Ahmes / Athanor / DevIAC / `[BIBLIO-GAP]` / `evaluator_safe` / coat hash8 / resolver jargon in student lesson body, AI footer, or deck JSON `description`.

**Evidence:**

| Location | Leak |
| -------- | ---- |
| `docs/lessons/en/creativity-techniques/special-creative-process-analysis/index.md` L175 (Missing evidence) | “Munari / Werhane priority **coats** still lack **evaluator-safe** bibliography” |

Gated `{% if site.publication.publish_internal_metadata %}` curriculum-internal (L27–45) is fine. Public Editorial is **not** a dump for vault vocabulary.

**Not leaked (this cycle — good):**

- Deck `description` (L12): author names only — “Masterclass quotes from Craft, Chen, Csikszentmihalyi.”
- No hash8 coats in public body or AI footer.
- AI footer uses vault **count** + Chicago authors only (L180).

**Fix:** Rewrite Missing evidence in student language (author names + honest gap OK). Example direction: “Munari / Werhane priority sources still lack public Chicago bibliography; new-media process corpus (Alexander, dramaturgy, intermediality) still in extraction.” Drop `coats` / `evaluator-safe`.

---

### F2 — P0 · Feedback self-check falsely claims firewall pass

**Blocks DONE:** yes (process / honesty gate)  
**Evidence:** `forge/receipts/SU-CPA-CYCLE1-FEEDBACK.md` L42:

| Gate | Status |
| ---- | ------ |
| Firewall (no Ahmes names in body/deck description) | **pass** (description uses author names only) |

Deck description pass is real. Body pass is **false** given F1. Forge law is wider than “Ahmes names” — coat / `evaluator-safe` also fail. Cold-review ask #2 (“Any firewall leak?”) → **yes (Editorial only)**.

**Fix:** Flip firewall row to fail → pass only after F1; broaden the gate wording to match forge `.mdc` publication-firewall bullet.

---

### F3 — P1 · Studio “SAFE” jargon on student-visible surfaces

**Blocks DONE:** yes for *firewall cleanliness* before de-pilot; pedagogy can stay pilot with amend.

**Evidence:**

| Location | Text |
| -------- | ---- |
| Lesson L119 (Circulation) | “until public Chicago is **SAFE**” |
| Lesson L176 (Addressed-to-editor) | “**SAFE** public spine” / “add Steimberg **SAFE**” |

Not as severe as coat hash8, but student HTML should not teach vault resolver status labels.

**Fix:** “until a public Chicago reference is available” / “public cite-ready spine” / “add Steimberg Chicago before exam-grade claims.”

---

## 3. Non-blocking improvements

### F4 — P2 · Shared-frame masterclass spine remapped to psychology cites

Forge `.mdc` ideas 3–6 = forms / making conditions / meaning-as-hypothesis / reception remakes next process. Shipped masterclass 3–6 = Craft open-close · Chen divergent · Csikszentmihalyi two ways · Chen critical score. Forms, brief/power conditions, and reception-as-next-production live in steps 3–5 / 8 and Lens B opener, not as masterclass beats.

**Acceptable adaptation** for a process-literacy pilot with the available SAFE spine. Optional cycle-2: one prompt line on idea 4 (conditions) or idea 6 (reception) without inventing Steimberg Chicago.

### F5 — P2 · Quote length for ~19yo EN cohort

Craft + Chen paper-clip quotes are short and plain. Csikszentmihalyi slide/lesson quote (`content.json` L83; lesson L105) is one long sentence — pedagogically sound; optional trim or “read on lesson” for the slide.

**Answer to feedback ask #3:** Quote length is **OK overall**; only the Csikszentmihalyi line is heavy for a first pass.

### F6 — P2 · Provenance note admits spacing insertion

Curriculum-internal L41: `note="slide quote inserts spaces in convergent/divergent"`. Slide still marked `quote_origin: page_verified`. Optional: confirm against vault page or label the spacing as editorial orthography in the gated note only — do not surface that note publicly.

### F7 — P2 · `analysis_model` slide

Deck inserts `analysis_model` between `analysis_opener` and masterclass (same pattern as SU-FIA). Not a 7th idea; spine still legal. Document in CT `STUDENT-SLIDESHOW-FORGE` if not already explicit for guide units.

### F8 — P2 · Declared gap names Steimberg / “Verónian”

L174 honest gap is correct policy. “Verónian” is mild theorist jargon for ~19yo Editorial; keep full Verón primary cite professor-only until SAFE (same answer as SU-FIA F7). Author names in Declared gap are allowed.

---

## 4. Specific amend list

### A. Student lesson (`special-creative-process-analysis/index.md`)

1. **Missing evidence (L175):** Remove `coats` / `evaluator-safe`; keep Munari / Werhane / Alexander corpus as named gaps.
2. **Circulation (L119) + Addressed-to-editor (L176):** Replace “SAFE” with student/editor plain English.
3. Leave gated curriculum-internal untouched; leave AI footer vault-count pattern as-is after A1–A2.

### B. Deck (`…/data/content.json`)

1. **No required firewall amend** — `description` is clean.
2. (Optional) Shorten Csikszentmihalyi quote on masterclass 5 (F5).
3. (Optional) One prompt on making conditions or reception to rebalance shared-frame ideas 4/6 (F4).

### C. Feedback receipt

1. Flip firewall row to fail until A is done; then pass with accurate wording (body + description + no coat/`evaluator_safe`).
2. Record cold-review answers below.

### D. Pilot policy (forge / editor)

1. **Three SAFE authors OK for `status: pilot`** without Steimberg.
2. Steimberg SAFE (or equivalent) required before exam / de-pilot for circulation theory claims.
3. Do not copy SU-FIA’s pre-amend firewall mistakes — this cycle already avoided the deck-Ahmes leak.

---

## 5. Numbers check

| Feedback metric | Claimed | Cold-check vs artefacts | Result |
| --------------- | ------: | ----------------------- | ------ |
| Athanor project slugs | 2 | Named in gated curriculum-internal | Unverified process claim (not contradicted) |
| Queries this unit | 4 | Same | Unverified |
| Hits inspected | ~28 | Same | Unverified |
| `evaluator_safe=yes` public | 4 passages / 3 authors | 4 VERIFIED `PROVENANCE_LINE`s; References = Craft + Chen + Csikszentmihalyi | **OK** |
| BIBLIO-GAP gated | Steimberg (+ Munari/Werhane coats still gap) | 1 BIBLIO-GAP `PROVENANCE_LINE` (Steimberg); Munari/Werhane named as gap only | **OK** (ledger prose, not a false count) |
| Verbatim slide quotes | 4 | 4× `page_verified` + citation.href → lesson `#references` | **OK** |
| Tao inventeds (`quote_origin`) | 1 | 1× `tao_invented` (cover) | **OK** |
| Masterclass ideas | 6 | 6× `slide_role: masterclass` | **OK** |
| Labs | 2 | 2× `lab_exercise`, both `portfolio_bound` | **OK** |
| Public Chicago authors | 3 | References list matches | **OK** |

**Slideshow law checklist (this review):**

- [x] ≤ 6 masterclass ideas  
- [x] `unit_cover` → `analysis_opener` (geometrical) → `analysis_model` → 6 ideas → `lab_opener` (geometrical) → 2 labs → `outro` (geometrical)  
- [x] Critical mandatory (lesson L92; deck `analysis_model` + idea 6 prompt / C1–C3)  
- [x] Lenses distinct (lesson B1 table; deck `analysis_opener`)  
- [x] Citation links to `#references` (deck) / `#ref-*` anchors under References (lesson)  
- [ ] Publication firewall clean — **fail until F1 (+ F3) amended**  
- [x] Honest gaps (Declared gap / Missing evidence present; Missing evidence wording needs scrub)  
- [x] Track Units table wired (`docs/tracks/en/creativity-techniques/index.md` SU row)  
- [x] `deck_url` set on lesson front matter  

---

## 6. Answers to feedback “Cold-review asks”

1. **Craft / Chen / Csikszentmihalyi enough without Steimberg SAFE?** Yes for **pilot**. Not enough to drop `status: pilot` or claim exam-grade discursive circulation until Steimberg (or Verón primary) clears public Chicago.  
2. **Any firewall leak?** Yes — F1 Editorial `coats` / `evaluator-safe`; also F3 “SAFE” jargon. Deck description is clean. Feedback firewall “pass” was wrong (F2).  
3. **Quote length OK for ~19yo EN?** Mostly yes; trim or soften only the Csikszentmihalyi line if desired (F5).

---

## 7. Findings index

| ID | Severity | Blocks DONE | Summary |
| -- | -------- | ----------- | ------- |
| F1 | P0 | yes | Editorial Missing evidence: coats / evaluator-safe |
| F2 | P0 | yes | Feedback firewall “pass” false |
| F3 | P1 | yes* | “SAFE” jargon on student Circulation + Editorial |
| F4 | P2 | no | Shared-frame MC ideas 3–6 remapped to psychology cites |
| F5 | P2 | no | Long Csikszentmihalyi quote |
| F6 | P2 | no | Spacing note vs `page_verified` |
| F7 | P2 | no | Document `analysis_model` role |
| F8 | P2 | no | “Verónian” in Declared gap — keep primary cite professor-only |

\*F3 blocks *firewall cleanliness / de-pilot*, not classroom pilot delivery after F1.

---

*Cold review complete. No lesson/deck rewrite performed in this pass — amends belong to implementer / next forge cycle.*
