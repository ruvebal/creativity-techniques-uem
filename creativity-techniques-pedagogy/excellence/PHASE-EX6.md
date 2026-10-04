# PHASE-EX6: Research grounding and a single bibliography source

> **Track:** Ahmes vault (via `ahmes-athanor-vault` agent), `docs/_data/references.yml`,
> lesson References, professor briefs
> **Status:** BLOCKED (EX5 DONE). PARTIAL allowed while books are procured.
> **Autopilot:** any human gate or STOP-for-the-professor step in this file is
> replaced by the pre-registered rule in AUTOPILOT.md §2; log the decision in
> DECISIONS-LOG.md and continue.

## Goal

Give each unit the core research of its topic, page-verified, from one
bibliography file. Live failing cases: FINDINGS C9 (the same works cited
three different ways across pages), C12 (U1 has three sources and no
definition of creativity; U2 names no brainstorming evidence; U3 Exercise 1
reproduces Dow et al. 2010 without citing it), A5 (guía core bibliography unused).

## Required works (manifest)

Write `creativity-techniques-pedagogy/excellence/research-manifest.yml`. Each
entry: `key`, `unit`, `claim` it supports, `status: verified | gap`, and for
verified entries the provenance line location. Minimum set:

| Unit | Works |
| --- | --- |
| U1 | Runco and Jaeger 2012; Rhodes 1961; Kaufman and Beghetto 2009; Csikszentmihalyi 1988 or 1999 (systems model); Amabile 1983; Boden 2004; Wallas 1926; Guilford 1950; Torrance 1966; Benedek et al. 2021; Scott, Leritz and Mumford 2004; OECD PISA 2022 Creative Thinking results (2024); Getzels and Csikszentmihalyi 1976; Buchanan 1992; Schön 1983; Kimbell 2011 |
| U2 | Osborn 1953; Diehl and Stroebe 1987; Mullen, Johnson and Salas 1991; Rohrbach 1969; Eberle 1971; Zwicky 1969; Gordon 1961; Koestler 1964; Jansson and Smith 1991; Ward 1994; Beaty and Silvia 2012; Rietzschel, Nijstad and Stroebe 2006; Amabile 1982; Puccio, Mance and Murdock 2011; de Bono 1985; Rodari 1973; Young 1940/1965; Colzato et al. 2012 |
| U3 | Dow et al. 2010; Houde and Hill 1997; Buxton 2007; Goldschmidt 1991; Dorst and Cross 2001; Schön 1983; Osborn 1953; Knapp, Zeratsky and Kowitz 2016; Brown 2009 |
| Master lecture | Verón 1988; Steimberg 1993; Ericsson and Simon 1993 |

## Deliverables

1. Ingest each obtainable work into the vault through the sanctioned agent;
   resolve page-verified quotes; record PROVENANCE_LINEs in the lesson's
   curriculum-internal block. Unobtainable → `status: gap` in the manifest and
   in the unit's professor brief; never cited in student text.
2. `docs/_data/references.yml`: one canonical Chicago entry per work (original
   year; edition used noted), keyed `surname-year`. Existing refs migrated.
3. `docs/_includes/references.html`: renders the References list of a lesson
   from the keys it cites (`page.references` front matter or a scan).
   Lessons stop hand-writing `<span id="ref-…">` lists.
4. Lesson text: integrate the verified works where the audit placed them
   (U1 definition/models/importance/myths/problem finding; U2 generation
   evidence, fixation, serial order, selection research; U3 prototyping
   evidence and Osborn for deferred judgement; master lecture Lens B = Verón).
   Plain register, Chicago author-date links.

(Amendment A2/F2: update `probe/excellence-probe.mjs` so `uncited_references` compares keys listed for a lesson in `references.yml`/front matter with keys it cites; add a probe test showing an uncited key is reported.)

(Amendment A3/F2–F4: re-verify every existing pin cite against the printed page — Chen 2012 pins are PDF indexes (PDF 41 = printed 26); EPUB sources (Rubin, Csikszentmihalyi, de Bono 1970) get the edition's real page or a chapter/section locator, never synthetic index+1; add citations for U2's "push past the obvious by producing more": Osborn 1953, Beaty and Silvia 2012, Ward 1994. Every verified PROVENANCE_LINE declares `page_basis=printed` or `page_basis=section`.)

(Amendment A4/F7: the master-lecture works Verón 1988, Steimberg (reconcile 1993 vs 2013), Chion and Alexander go into `research-manifest.yml` as verified or gap.)

## Prompt (Implementation Agent)

```text
Implement PHASE-EX6 per creativity-techniques-pedagogy/excellence/PHASE-EX6.md.

## Deliver
1. Manifest first. Then vault work through the ahmes-athanor-vault agent
   only (sanctioned commands; no hand SQL). Cite Ahmes nodes only.
2. references.yml + include; migrate U1–U3 and the master lecture.
3. Integrate verified works into lessons. A gap never appears in student text.
4. Run the exit gate; PARTIAL is fine if the manifest records gaps honestly.
5. Hand off for cold review — do NOT mark DONE.

## Constraints
- Local-only AI; no cloud model drafting
- Publication firewall: provenance stays in switch-gated comments
- Commit only on this phase branch (autopilot); never on main
```

## Acceptance

- Exit gate passes: manifest has every required key with a status; every
  verified key exists in `references.yml` and is cited in its unit; every
  cited key exists in `references.yml`; no lesson hand-writes `id="ref-`;
  each U1–U3 lesson cites ≥ 8 distinct works; PROVENANCE_LINE count ≥ number
  of verified keys per lesson
- Cold reviewer samples 5 new citations and checks quote, page and claim

## Risks

- Several works are journal articles not yet in the vault: PARTIAL with a
  procurement list is success; an unverified citation in student text is not.
