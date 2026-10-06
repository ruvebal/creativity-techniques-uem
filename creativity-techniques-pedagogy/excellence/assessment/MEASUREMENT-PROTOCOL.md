# Measurement protocol — pre/post study for the Teaching Innovation Practice (DRAFT)

> **Status: DRAFT — NOT STARTED.** Written under AUTOPILOT.md §2 (EX10 row):
> `approved_by: autopilot (drafts — not for use before professor approval)`.
> Under autopilot the measurement **never starts** (AUTOPILOT.md §1). Nothing in
> this file has been used with students; no student has been contacted and no
> data exist. Private file: `creativity-techniques-pedagogy/` is outside the
> published site.

## 0 · Preconditions (all required before week 1)

1. The professor approves this protocol, the consent forms
   (`creativity-techniques-pedagogy/consent/`) and the question bank
   (`assessment/question-bank.yml`), and records it in `assessment/APPROVAL.md`.
2. The ethics route in §8 is complete (written approval, or a written statement
   from the committee that approval is not required for this use).
3. The two pending sources in §3 are obtained and checked page by page; the
   instrument wording is taken from them, not from this draft.
4. Storage outside this repository is arranged (§6). **No student data ever enter
   this repository.**

If any precondition is missing in week 1, the study does not run this term. The
course itself runs unchanged: the alternative-uses Lab in U1 is a class
exercise, not a measurement.

## 1 · Question and design

**Question.** Over one term of Técnicas de Creatividad (Grado en Diseño), do
students' divergent-thinking performance and their creative self-beliefs change
between the first and the last week?

**Design.** One group, pre/post, two time points (week 1 and week 14). There is
no control group, so the study **cannot attribute a change to the course**:
maturation, other courses, and practice with the task itself are open
explanations. Results are reported as a descriptive evaluation of a teaching
innovation, not as evidence that the course causes creativity gains.

**Known threat — task practice.** The U1 Lab (Exercise 1) practises an
alternative-uses task, and U2 practises idea counting. A post-test gain in
fluency may therefore reflect familiarity with the task. Mitigations: different
objects at pre and post (§3), objects never used in class, and originality rated
by peers rather than counted (§4). The report must state this threat.

## 2 · Participants

- Students enrolled in the course who are 18 or older and give written consent.
  Participation is voluntary.
- Not taking part, or withdrawing, has **no effect on any mark**. The tasks are
  never graded and are not part of D1–D5 or the knowledge tests.
- The professor is also the person who grades the course. To reduce pressure:
  consent forms are handed out and collected by a third person (a colleague or
  the coordinator, to be named), in a sealed box; the professor does not learn
  who took part until final marks are published.
- Students who do not take part spend the same 20 minutes on an ordinary class
  task (for example, reading the U1 lesson Analysis section).

## 3 · Instruments

### 3.1 Alternative Uses Task (AUT), timed

- Two parallel forms, two everyday objects each, **3 minutes per object**,
  written alone and in silence:
  - Form A: a tin can · a sock
  - Form B: a cardboard box · an umbrella
- None of these objects is used in class (the U1 Lab uses a brick, a paper clip
  or a shoe). Form order is counterbalanced: half the participants (assigned by
  the last digit of their participant code, §6) take A at pre and B at post; the
  other half the reverse.
- Instruction (read aloud, identical both times): "List as many different uses
  for this object as you can. Write one use per line. You have three minutes.
  There are no wrong answers."
- Background in the course reading: Chen 2011, 26 describes alternate-uses tests
  and cautions that such scores may say little about talent in a specific
  domain. The original AUT sources (Guilford, Torrance) are gaps in
  `research-manifest.yml`; this protocol makes no claim about their norms.

### 3.2 Short Scale of Creative Self (SSCS) — SOURCE PENDING

- Intended: the Short Scale of Creative Self (Karwowski 2012), a short
  self-report of creative self-efficacy and creative personal identity.
- **Pending.** Karwowski 2012 is **not** in the library: an EX10 search found
  only a reference-list entry to a later Karwowski et al. paper inside Beghetto
  and Karwowski 2025, which does not verify the 2012 scale. Item wording, item
  count, response scale and scoring are therefore **not reproduced here** and
  must be taken from the original publication (and, if used, a published
  validated Spanish version) once obtained. Recorded as gap `karwowski-2012` in
  `research-manifest.yml`.
- If the scale cannot be obtained and checked before week 1, the study runs
  with the AUT only and says so.

## 4 · Rating originality — peer consensual assessment (CAT)

**Source pending.** The consensual assessment technique is attributed to
Amabile 1982, which is a gap in `research-manifest.yml` (not in the library).
The procedure below is the course's own description and must be checked against
the paper before use; the report may not cite Amabile 1982 until it is verified.
(Amabile 1979, which is verified, uses judged creativity but is not the source
for this procedure.)

Procedure:

1. All responses (pre and post, both forms) are typed into one sheet by an
   assistant, keyed only by participant code and object. Spelling is not
   corrected beyond legibility.
2. Responses are rated **after week 14**, pre and post together, in a random
   order, with the time point and the code hidden from raters.
3. **Raters:** at least five students per rating set, from a different class
   group where possible, who consented to rate (rating is optional and ungraded).
   Nobody rates a set that contains their own responses. The professor does not
   rate.
4. Each rater works **alone and in silence** with the rules of the public,
   printable peer rating sheet (`/practice/en/peer-rating-sheet/`), on a study
   copy that carries no rater name and is collected (the class version of the
   sheet is never collected): each participant's list for one object is one item; raters first read every item in the set, then rate
   each on "how creative, compared with this set" (1–5) using the whole scale,
   without discussion and without any definition imposed beyond the sheet.
   The sheet's "fit to the brief" column is not used for AUT items.
5. **Agreement:** inter-rater reliability for each object is computed (intraclass
   correlation, two-way random, average measures, or Cronbach's alpha across
   raters). Ratings are averaged only if reliability is at least 0.70; otherwise
   the object is reported as unreliably rated and left out of the primary analysis.

**Fluency** = number of valid, non-repeated uses (two independent coders;
disagreements resolved by discussion; agreement reported). **Flexibility** =
number of distinct categories, using a category list built from the pooled
responses before unblinding.

## 5 · Timing

| When | What | Time |
| --- | --- | --- |
| Before week 1 | Consent information handed out; questions answered by the third person; sealed consent box | — |
| Week 1, session 1, **before** the U1 Lab | Pre: AUT form A or B (2 × 3 min) + SSCS (if obtained) | about 20 min including instructions |
| Week 14, last ordinary session | Post: the other AUT form (2 × 3 min) + SSCS | about 20 min |
| After week 14 and after final marks | Peer CAT rating (§4), coding, analysis | outside class time |

## 6 · Anonymisation and data handling

- **Participant code**, self-generated so that pre and post can be linked
  without names (for example: first two letters of the mother's first name +
  day of birth + last letter of the street where you grew up). No list linking
  codes to names is ever made.
- No names, student numbers, e-mails or photographs are collected. Free-text
  answers are checked for self-identifying details, which are removed.
- Paper sheets are kept locked by the third person, transcribed, checked, and
  destroyed after transcription is verified.
- The dataset lives only in university-approved storage named in the ethics
  application — **never in this repository, never in the course site, never in
  a cloud AI service, never processed by a local model**.
- Results are reported only in aggregate; no group smaller than five is shown.
- Retention period and the data controller's contact (university data-protection
  officer) are set in the ethics application, under the EU General Data
  Protection Regulation and Spanish data-protection law.
- Withdrawal: a participant can withdraw by giving their code to the third
  person until the date the codes are dropped from the dataset (stated on the
  consent form); after that, data cannot be identified and so cannot be removed.

## 7 · Analysis plan (fixed before any data exist)

- **Primary outcome:** change in mean CAT originality rating (participant mean
  across the two objects), post minus pre.
  - Test: paired t-test; Wilcoxon signed-rank if the differences are clearly
    non-normal (checked by a plot, decided before unblinding).
  - Report the mean difference with a 95% confidence interval and Cohen's d_z.
- **Secondary outcomes:** fluency, flexibility, SSCS subscales (if obtained).
  Same tests; Holm correction across secondary outcomes.
- **Fluency confound:** because more uses give more chances of a creative item,
  originality is also reported with fluency as a covariate (or as the mean
  rating of the participant's two highest-rated uses) as a sensitivity check.
- **Form effect:** form (A/B order) is entered as a between-participant factor
  in a sensitivity analysis; if forms differ, both orders are reported apart.
- **Missing data:** complete-case analysis; the number who took the pre-test but
  not the post-test is reported, with their pre-test means compared to completers.
- **Sample:** one class group; no power claim is made. Confidence intervals, not
  p-values alone, carry the result.
- **What the report may say:** whether scores changed, by how much, and with what
  uncertainty — not that the course caused the change.

## 8 · Ethics route

1. Before any recruitment: submit this protocol, the consent forms and the
   information sheet to the university's research ethics committee (exact
   committee name, forms and timeline to be confirmed by the professor with
   the faculty). This is required for publishing any result, and under this
   protocol it is required **before data collection even for internal use**.
2. Confirm with the data-protection officer: lawful basis (consent), storage
   location, retention, and the third-person arrangement in §2.
3. Record the approval reference on both consent forms and in `APPROVAL.md`.
4. Any change to instruments, timing or analysis after approval goes back to
   the committee before use.

## 9 · Open items for the professor (P0 in FINAL-REVIEW)

- Approve or reject this protocol, the consent forms and the question bank.
- Obtain Karwowski 2012 (and any Spanish validated version) and Amabile 1982;
  check §3.2 and §4 against them.
- Name the third person for consent handling and rating logistics.
- Decide the comparison: one-group pre/post only, or a second group if one
  becomes available (changes §1 and §7).
