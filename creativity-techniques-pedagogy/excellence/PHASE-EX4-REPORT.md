# PHASE-EX4 Report

| Field | Value |
| --- | --- |
| **status** | VERIFYING |
| **started_at** | 2026-10-04 (evening; interrupted once by an API rate limit, resumed 2026-10-05) |
| **finished_at** | 2026-10-05 (implementation done; awaiting `cascade-harness.sh verify` and cold review) |
| **cold_review** | not yet filed |
| **cascade_amended** | none |
| **branch / worktree** | `cascade/excellence-4` · `creativity-techniques-uem-integration-excellence-4` (`.cascade-lane` = `excellence`) |
| **mode** | AUTOPILOT (§0: all sources usable, rights flagged not blocking; §2 EX4 row) |

## Outcome

| Deck | Image slides bound | Core (masterclass + lab) imaged | Flagged |
| --- | --- | --- | --- |
| U1 | 9 / 10 | 7 / 8 (88%) | 2 |
| U2 | 9 / 10 | 7 / 8 (88%) | 2 |
| U3 | 9 / 10 | 7 / 8 (88%) | 0 |
| ML-CPA | 9 / 10 | 7 / 8 (88%) | 4 |

36 distinct assets, none reused within a deck (none reused across decks either). 40/40 image slides carry a real one-sentence `image_brief` (subject + period + why it carries the idea). 4 slides stay on diagram fallback because no candidate scored ≥ 4. U4 untouched (`git diff 89ecfad -- …/u-4-*` empty).

## What changed (files)

| File | Change |
| --- | --- |
| `scripts/lib/media-rules.mjs` | A6/F1: death year contradicting a PD/EU-term claim always fails (`HOLDER_LICENCES` exempt); A6/F3: `requireRegistry` rule; A6/F6: `RENDITION_EXTENSIONS` (raw SVG in deck-media is an issue) |
| `scripts/lib/rendition.mjs` | `looksLikeSvg` + SVG rasterised at 1920 px on white, then WebP |
| `scripts/rehydrate-student-media.mjs` | never copies raw SVG (rasterises; also converts a leftover raw SVG in place); asset without registry `raw_title` can never be `ok`; curator `rights_status: flagged` in the registry wins |
| `scripts/validate-decks.mjs` | `requireRegistry` on v2 decks; raw `.svg` in deck-media is an error |
| `scripts/tests/*.test.mjs` | +4 tests (A6/F1 death-year contradiction incl. the gate's exact case; A6/F3 registry; A6/F6 validator SVG; SVG rasterisation) — 30/30 green |
| `forge/STUDENT-SLIDESHOW-FORGE.mdc` | A6/F2: under `--rights=flag` a failing asset publishes as `flagged`, not dropped; A6/F1, F3, F6 rules stated |
| U1, U2, U3, ML `data/content.json` | 40 briefs, 36 `asset_id` bindings, public asset records (rehydrated) |
| `docs/assets/images/deck-media/` | 36 WebP renditions (≤ 1920 px, all ≤ 600 KB, 6.7 MB total); the raw SVG is gone |
| `excellence/curation/autopilot-assets.json` | 36 records: raw_title, assignments, alt_text, author, death year, licence (+URL), source page, 1920-px file URL, EU-term verdict, rights_status (+reason), vision score/description, approved_by |
| `excellence/curation/{u-1…,u-2…,u-3…,ml-…}-SHORTLIST.md`, `shortlists.json` | private shortlists: 70 candidates (≤ 3 per slide), thumbnail + file page, author (d.), licence, EU verdict, fit score |
| `excellence/curation/CURATION-SIGNOFF.md` | `approved_by: autopilot (final review pending)`, `approved_on: 2026-10-04`, deck list |
| `excellence/curation/rights-report.json` | rewritten by the validator |
| `excellence/evidence/EX4/` | discovery, rights, binding and vision scripts; queries; `vision_raw.json` (every local call); `vision.json` (scores) |
| `FINAL-REVIEW.md` §2, `DECISIONS-LOG.md` | P0 table of every bound image (flagged first); 6 decisions |

## Per-deck binding table

### U1

| slide_id | Heading | Bound image | Fit | rights_status |
| --- | --- | --- | --- | --- |
| `cover` | U1 · Introduction to creativity | [Leonardo da Vinci, studies of the Virgin and Child with a cat, c. 1478–81](https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_-_1860,0616.98,_Two_studies_of_the_Virgin_and_Child_with_a_cat_and_three_studies_of_the_Child_with_a_cat.jpg) | 5/5 | ok |
| `analysis-model` | How to analyse (model) | [El Lissitzky, Beat the Whites with the Red Wedge, 1919–20](https://commons.wikimedia.org/wiki/File:Beat_the_Whites_with_the_Red_Wedge.jpg) | 5/5 | ok |
| `masterclass-1` | 1 · Open, then close | [Michelangelo, a sheet of studies connected with the Libyan Sibyl, c. 1510–11](https://commons.wikimedia.org/wiki/File:Studies_for_the_Libyan_Sibyl_(recto);_Studies_for_the_Libyan_Sibyl_and_a_small_Sketch_for_a_Seated_Figure_(verso)_MET_DP807402.jpg) | 4/5 | ok |
| `masterclass-2` | 2 · Four skills tests measure | diagram fallback (best candidate 3/5) | — | — |
| `masterclass-3` | 3 · Tests are not the whole story | [The Gem paper clip (1890s)](https://commons.wikimedia.org/wiki/File:GemPaperClipAdvertisementJan1893.png) | 4/5 | ok |
| `masterclass-4` | 4 · Name the problem first | [Auguste Rodin, The Thinker (modelled 1880–81)](https://commons.wikimedia.org/wiki/File:Auguste_Rodin_-_The_Thinker_-_1917.42_-_Cleveland_Museum_of_Art.tif) | 4/5 | ok |
| `masterclass-5` | 5 · Techniques are tools, not scripts | [A pocket set of drawing instruments by Peter Dollond, London, c. 1755](https://commons.wikimedia.org/wiki/File:Pocket_set_of_drawing_instruments_MET_DP232308.jpg) | 5/5 | ok |
| `masterclass-6` | 6 · “Design thinking” is debated | [A Post-it 'Teamwork Tools' display wall at a 2018 innovation festival](https://commons.wikimedia.org/wiki/File:Post-It_Notes_Wall_at_the_Fast_Company_Innovation_Festival_(30772875917).jpg) | 4/5 | flagged |
| `lab-1` | Exercise 1 · Research Marcel Duchamp | [Marcel Duchamp, Fountain, 1917, in Alfred Stieglitz's photograph](https://commons.wikimedia.org/wiki/File:Marcel_Duchamp,_1917,_Fountain,_photograph_by_Alfred_Stieglitz.jpg) | 5/5 | flagged |
| `lab-2` | Exercise 2 · Research the Dada movement | [Theo van Doesburg and Kurt Schwitters, Kleine Dada Soirée poster, 1922](https://commons.wikimedia.org/wiki/File:Theo_van_Doesburg_and_Kurt_Schwitters,_Kleine_Dada_Soir%C3%A9e_(Small_Dada_Evening),_1922,_NGA_154076.jpg) | 5/5 | ok |

### U2

| slide_id | Heading | Bound image | Fit | rights_status |
| --- | --- | --- | --- | --- |
| `cover` | U2 · Idea generation and selection techniques | [Charles Darwin's 'I think' sketch in Notebook B, 1837](https://commons.wikimedia.org/wiki/File:Darwin_Tree_1837.png) | 5/5 | ok |
| `analysis-model` | How to analyse (rolling model) | [Georges Seurat, oil study for A Sunday on La Grande Jatte, 1884](https://commons.wikimedia.org/wiki/File:Study_for_%22A_Sunday_on_La_Grande_Jatte%22_MET_DP259921.jpg) | 4/5 | ok |
| `masterclass-1` | 1 · Generate, then select | [Concept-art sheet for the Blender Studio short Sprite Fright (2021)](https://commons.wikimedia.org/wiki/File:Sprite_Fright-concept_art-Victoria_01.png) | 5/5 | flagged |
| `masterclass-2` | 2 · Fluency with flexibility | diagram fallback (best candidate 2/5) | — | — |
| `masterclass-3` | 3 · Get past the obvious | [A brainstorming wall of sticky notes (2014)](https://commons.wikimedia.org/wiki/File:Stickies_to_brainstorm_Edit.2014..jpg) | 4/5 | ok |
| `masterclass-4` | 4 · Role and constraint tools | [A Six Thinking Hats session board for the black hat ('doubts'](https://commons.wikimedia.org/wiki/File:Sombrero_negro_(Dudas).jpg) | 5/5 | ok |
| `masterclass-5` | 5 · Name selection criteria | [A Pugh concept-selection matrix](https://commons.wikimedia.org/wiki/File:Pugh_Concept_Selection.png) | 5/5 | ok |
| `masterclass-6` | 6 · Workshops are means, not genius | [Vincent van Gogh, Self-Portrait with Bandaged Ear, 1889](https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Self-portrait_with_bandaged_ear_(1889,_Courtauld_Institute).jpg) | 5/5 | ok |
| `lab-1` | Exercise 1 · Guided concentration | [Kōdō Sawaki seated in zazen, c. 1920](https://commons.wikimedia.org/wiki/File:Kodo_Sawaki_Zazen.jpg) | 4/5 | flagged |
| `lab-2` | Exercise 2 · Automatic writing after concentration | [Trance writing produced by the medium 'Margery' (Mina Crandon) in 1927 and reproduced in 1930](https://commons.wikimedia.org/wiki/File:Mina_Crandon_automatic_writing.png) | 4/5 | ok |

### U3

| slide_id | Heading | Bound image | Fit | rights_status |
| --- | --- | --- | --- | --- |
| `cover` | U3 · Development techniques and solutions | [The Wright brothers' 1902 glider in flight at Kitty Hawk](https://commons.wikimedia.org/wiki/File:Gliding_flight,_Wright_Glider,_Kitty_Hawk,_NC._1902.10459_A.S..jpg) | 5/5 | ok |
| `analysis-model` | Read the development | [Theo van Doesburg, a study for Composition (The Cow), c. 1917–18](https://commons.wikimedia.org/wiki/File:Cow_by_Theo_van_Doesburg_Museum_of_Modern_Art_25.1969.jpg) | 4/5 | ok |
| `masterclass-1` | 1 · Make it rough, make it early | [Antoni Gaudí's hanging string-and-weight model for the Colonia Güell church, photographed c. 1908](https://commons.wikimedia.org/wiki/File:Maqueta_polifunicular.jpg) | 5/5 | ok |
| `masterclass-2` | 2 · Defer judgement | [Beethoven's sketchbook for the Seventh Symphony, 1812](https://commons.wikimedia.org/wiki/File:Sketches_for_the_second_movement_of_Symphony_no._7,_op._92,_Beethoven,_Petter_Sketchbook,_1812,_musical_autograph_-_Morgan_Library_%26_Museum_-_New_York_City_-_DSC06691.jpg) | 4/5 | ok |
| `masterclass-3` | 3 · Iterate with an exit | diagram fallback (best candidate 3/5) | — | — |
| `masterclass-4` | 4 · Sketch to think | [Alexander Graham Bell's laboratory notebook, March 1876](https://commons.wikimedia.org/wiki/File:AGBell_Notebook.jpg) | 5/5 | ok |
| `masterclass-5` | 5 · Open the solution space | [Paul Klee, a page of the Pedagogical Sketchbook (1925)](https://commons.wikimedia.org/wiki/File:Paul_Klee_P%C3%A4dagogisches_Skizzenbuch_10.jpg) | 4/5 | ok |
| `masterclass-6` | 6 · Reflect at checkpoints | [Orville Wright's diary entry for 17 December 1903](https://commons.wikimedia.org/wiki/File:Wright_diary.jpg) | 5/5 | ok |
| `lab-1` | Exercise 1 · Same problem, three entry points | [An early-19th-century design sheet with three chairs with curved backs](https://commons.wikimedia.org/wiki/File:Design_for_Three_Chairs_with_Curved_Backs_(verso-_Sketch_for_a_Sideboard)_MET_DP807145.jpg) | 5/5 | ok |
| `lab-2` | Exercise 2 · Delay judgement, then checkpoint and exit | [The Wright brothers' 1900 glider flown unmanned as a kite](https://commons.wikimedia.org/wiki/File:Wright_Glider_being_flown_as_a_kite._-1900_10457_A.S..jpg) | 4/5 | ok |

### ML-CPA

| slide_id | Heading | Bound image | Fit | rights_status |
| --- | --- | --- | --- | --- |
| `cover` | Master Lecture · Creative process analysis | [A generic iterative-process diagram (plan, design, implement, test, evaluate, loop back)](https://commons.wikimedia.org/wiki/File:Iterative_Process_Diagram.svg) | 4/5 | flagged |
| `analysis-model` | Eight steps (guide) | [Frank and Lillian Gilbreth's standard symbols for process charts, 1921](https://commons.wikimedia.org/wiki/File:Standard_Symbols_for_Process_Charts_(1),_1921.jpg) | 4/5 | flagged |
| `masterclass-1` | 1 · Describe the process first | [Gilbreth process chart of the 'present method' for ordering blank forms, 1921](https://commons.wikimedia.org/wiki/File:Process_Chart_for_Ordering_Blank_Forms_-_Present_Method,_1921.jpg) | 5/5 | flagged |
| `masterclass-2` | 2 · Language ≠ medium ≠ support | [A Jacquard loom with its chain of punched cards (19th-century mechanism, National Museum of Scotland)](https://commons.wikimedia.org/wiki/File:A_Jacquard_loom_showing_information_punchcards,_National_Museum_of_Scotland.jpg) | 4/5 | ok |
| `masterclass-3` | 3 · Open, then close | diagram fallback (best candidate 3/5) | — | — |
| `masterclass-4` | 4 · Divergent is a hallmark — not the whole job | [An early-19th-century design for six chairs with scarlet upholstery](https://commons.wikimedia.org/wiki/File:Design_for_Six_Chairs_with_Scarlet_Upholstery_(verso-_Sketch_for_Sofa)_MET_DP807166.jpg) | 4/5 | ok |
| `masterclass-5` | 5 · Process is also material | [Loïe Fuller's Serpentine Dance, Folies-Bergère poster/photograph, 1890s](https://commons.wikimedia.org/wiki/File:La_danse_serpentine,_Lo%C3%AFe_Fuller_et_ses_transformations.jpg) | 4/5 | ok |
| `masterclass-6` | 6 · Critical: a score is not the designer | [Alfred Binet's 1911 results table for the Binet–Simon scale](https://commons.wikimedia.org/wiki/File:Tableau_de_r%C3%A9sultats_au_test_de_Binet-Simon.jpg) | 4/5 | ok |
| `lab-1` | Exercise 1 · Shared process | [Gilbreth's proposed process chart for first orders, 1921](https://commons.wikimedia.org/wiki/File:Proposed_Process_Chart_for_First_Orders,_1921.jpg) | 4/5 | flagged |
| `lab-2` | Exercise 2 · Your Lab trail | [A page of Paul Klee's Bauhaus teaching notebook, 1922](https://commons.wikimedia.org/wiki/File:Paul_Klee_Notebook_BF_149.jpg) | 4/5 | ok |

## Flagged images (8)

| Deck · slide | Image | Reason |
| --- | --- | --- |
| U1 `lab-1` | Duchamp, *Fountain*, 1917 (Stieglitz photograph) | photo PD (Stieglitz d. 1946); readymade by Duchamp d. 1968 → EU term to 2038 (copyright in a mass-produced urinal is doubtful; not cleared) |
| U1 `masterclass-6` | Post-it "Teamwork Tools" wall, 2018 | CC BY 2.0, not on the accepted-licence list |
| U2 `masterclass-1` | Sprite Fright concept sheet | CC BY 4.0, prospector `modern_rights_review_required` tag not cleared (kept from EX3) |
| U2 `lab-1` | Kōdō Sawaki in zazen, c. 1920 | anonymous photo (PD), identifiable sitter |
| ML `cover` | Iterative Process Diagram | CC BY-SA 4.0, prospector review tag not cleared (kept from EX3; now rasterised) |
| ML `analysis-model`, `masterclass-1`, `lab-1` | Gilbreth process charts, 1921 | co-author Lillian Gilbreth d. 1972 → EU term to 2042 (PD in the US only) |

## Discovery

Wikimedia Commons search API (namespace 6, `filetype:bitmap`, ~115 queries in `evidence/EX4/q*.txt`), which mirrors Met Open Access, Rijksmuseum, NGA, NYPL, LoC/NASA and DPLA files; the existing media-prospector indexes in `~/src/profield/runs/media-prospector` were grepped read-only (they confirmed the Duchamp/Dada pool but held no better technique images). Licence, artist, date and file URL come from `imageinfo.extmetadata` on the file page (`evidence/EX4/commons.py`), never from search snippets. Death years are standard biographical dates (`evidence/EX4/rights.py`). Searches for Osborn's checklist, 6-3-5 brainwriting sheets, Zwicky's morphological box, Tzara's cut-up recipe and Höch's *Cut with the Kitchen Knife* returned no usable file on Commons; technique images were found instead as a Pugh selection matrix, a Six Thinking Hats session board, Gaudí's hanging model, Bell's and the Wrights' notebooks and Gilbreth process charts.

## Vision checks (image–brief fit)

Method: the model was asked only for a literal description (what it shows, medium, visible text, identifiable faces; no names). I compared each description with the brief and scored 1–5; bound only ≥ 4. Two candidates whose descriptions were ambiguous (Gaudí model, Michelangelo sheet) I also checked by eye; the Michelangelo brief was rewritten to the verso it really shows.

| Deck · slide | Candidate | Fit | Note |
| --- | --- | --- | --- |
| U1 `cover` | Leonardo da Vinci - 1860,0616.98, Two studies of the Virgin and C | 5/5 | BOUND. several trial poses of mother, child and cat on one sheet |
| U1 `cover` | Leonardo da Vinci, Study for the Madonna of the Cat (verso).jpg | 3/5 | single group; fewer alternatives visible |
| U1 `analysis-model` | Beat the Whites with the Red Wedge.jpg | 5/5 | BOUND. geometric poster, Cyrillic text legible |
| U1 `analysis-model` | Klinom Krasnym Bej Belych.JPG | 4/5 | same poster, weaker reproduction |
| U1 `masterclass-1` | Studies for the Libyan Sibyl (recto); Studies for the Libyan Siby | 4/5 | BOUND. verso: large leg study + two small seated-figure sketches; brief rewritten to match |
| U1 `masterclass-1` | Album of Forty-five Figure Studies MET DP102546.jpg | 3/5 | only one strong study visible on the spread |
| U1 `masterclass-2` | Schetsen van Hokusai - deel 2 Hokusai manga Katsushika iitsu ibok | 1/5 | actually two book covers (Fuji Hyakkei) |
| U1 `masterclass-2` | Hokusai Manga 04.jpg | 2/5 | one ghost scene, not many varied figures |
| U1 `masterclass-2` | Hokusai manga vol.8.jpg | 3/5 | six framed scenes plus a title page; variety weakly visible |
| U1 `masterclass-3` | GemPaperClipAdvertisementJan1893.png | 4/5 | BOUND. paper-clip drawing + 1893 advert text |
| U1 `masterclass-3` | Büroklammern -- 2021 -- 6481.jpg | 4/5 | pile of modern clips; no period |
| U1 `masterclass-3` | Paperclip 1900.jpg | 3/5 | Niagara clip, not Gem |
| U1 `masterclass-4` | Auguste Rodin - The Thinker - 1917.42 - Cleveland Museum of Art.t | 4/5 | BOUND. bronze seated figure, chin on hand |
| U1 `masterclass-5` | Pocket set of drawing instruments MET DP232308.jpg | 5/5 | BOUND. open case of brass and steel instruments |
| U1 `masterclass-5` | Draughtsman's instruments MET 125791.jpg | 4/5 | black-and-white catalogue photo |
| U1 `masterclass-6` | Post-It Notes Wall at the Fast Company Innovation Festival (30772 | 4/5 | BOUND. branded 'Teamwork Tools' sticky-note wall; brief rewritten to the commercial angle |
| U1 `masterclass-6` | Stickies to brainstorm Edit.2014..jpg | 4/5 | working brainstorm wall; kept for U2 |
| U1 `lab-1` | Marcel Duchamp, 1917, Fountain, photograph by Alfred Stieglitz.jp | 5/5 | BOUND. urinal on plinth, 'R. Mutt 1917' legible |
| U1 `lab-1` | Duchamp Fountaine.jpg | 5/5 | same photograph, cropped |
| U1 `lab-2` | Theo van Doesburg and Kurt Schwitters, Kleine Dada Soirée (Small  | 5/5 | BOUND. jumbled typography over red diagonals |
| U1 `lab-2` | 1916 Marcel Słodki Cabaret-Voltaire.jpg | 3/5 | expressionist woodcut; Dada tactic less visible |
| U1 `lab-2` | Grand opening of the first Dada exhibition, Berlin, 5 June 1920.j | 4/5 | exhibition view; identifiable people |
| U2 `cover` | Darwin Tree 1837.png | 5/5 | BOUND. full notebook page, 'I think' and branching tree |
| U2 `cover` | Darwins first tree.jpg | 4/5 | cropped, lower contrast |
| U2 `analysis-model` | Study for "A Sunday on La Grande Jatte" MET DP259921.jpg | 4/5 | BOUND. oil study of the riverbank scene |
| U2 `analysis-model` | Georges Seurat - Étude pour "La Grande Jatte" (Study for "La Gran | 4/5 | smaller sketch |
| U2 `masterclass-1` | Sprite Fright-concept art-Victoria 01.png | 5/5 | BOUND. 16 labelled expression variants of one character |
| U2 `masterclass-2` | Atlanticus Folio 132 133.jpg | 2/5 | modern composite of four photos with labels |
| U2 `masterclass-2` | Hokusai Manga 04.jpg | 2/5 | one scene |
| U2 `masterclass-3` | Stickies to brainstorm Edit.2014..jpg | 4/5 | BOUND. wall of handwritten sticky notes in columns |
| U2 `masterclass-3` | Brainstorming Customer Feedback (1).jpg | 3/5 | hands sorting notes on a table |
| U2 `masterclass-4` | Oblique Strategies deck, PO Box, The Barbican, London, UK.jpg | 3/5 | box and edition card; no prompt visible |
| U2 `masterclass-4` | Sombrero negro (Dudas).jpg | 5/5 | BOUND. black-hat board: doubts and risks with sticky notes |
| U2 `masterclass-5` | Pugh Concept Selection.png | 5/5 | BOUND. weighted criteria and scores for concepts A–D |
| U2 `masterclass-5` | Pugh Matrix Concepts.png | 4/5 | criteria table, symbols |
| U2 `masterclass-6` | Vincent van Gogh - Self-portrait with bandaged ear (1889, Courtau | 5/5 | BOUND. bandaged head, Japanese print behind |
| U2 `masterclass-6` | Vincent van Gogh - Self portrait with bandaged ear F529.jpg | 4/5 | pipe version |
| U2 `lab-1` | Kodo Sawaki Zazen.jpg | 4/5 | BOUND. monk seated in zazen; identifiable face |
| U2 `lab-1` | Zazen dans le dojo.jpg | 4/5 | group in rows; people identifiable |
| U2 `lab-2` | Mina Crandon automatic writing.png | 4/5 | BOUND. trance-writing sample page with caption |
| U2 `lab-2` | HélèneSmith martien01.jpg | 3/5 | invented script; less legible as 'writing without correcting' |
| U2 `lab-2` | Francis Ward Monck psychograph 2.png | 2/5 | drawing with spiral text |
| U3 `cover` | Gliding flight, Wright Glider, Kitty Hawk, NC. 1902.10459 A.S..jp | 5/5 | BOUND. glider in flight, pilot visible from behind |
| U3 `cover` | 1902 Wright Brothers' Glider Tests - GPN-2002-000125.jpg | 4/5 | men holding glider on sand |
| U3 `analysis-model` | Cow by Theo van Doesburg Museum of Modern Art 25.1969.jpg | 4/5 | BOUND. skeletal cow, lines and masses |
| U3 `analysis-model` | Cow by Theo van Doesburg Museum of Modern Art 227.1948.6.jpg | 3/5 | already fully abstract; cow not readable alone |
| U3 `masterclass-1` | Maqueta polifunicular.jpg | 5/5 | BOUND. Gaudí's hanging string model with weights (checked by eye too) |
| U3 `masterclass-1` | Maqueta funicular.jpg | 4/5 | modern reconstruction; reads as installation |
| U3 `masterclass-1` | Paper prototype of website user interface, 2015-04-16.jpg | 3/5 | hands writing on a form |
| U3 `masterclass-2` | Sketches for the second movement of Symphony no. 7, op. 92, Beeth | 4/5 | BOUND. handwritten sketch staves with trial versions |
| U3 `masterclass-2` | Sketches for the first movement of the Fifth Piano Concerto, op.  | 4/5 | similar, wrong work for brief |
| U3 `masterclass-3` | Wright Brothers Wind Tunnel Replica.jpg | 3/5 | reads as a printing press; idea not legible |
| U3 `masterclass-3` | WB Wind Tunnel.jpg | 1/5 | statue and desk, not the tunnel |
| U3 `masterclass-4` | AGBell Notebook.jpg | 5/5 | BOUND. notebook spread with transmitter sketch |
| U3 `masterclass-4` | Design for a Flying Machine.jpg | 4/5 | technical sketch |
| U3 `masterclass-5` | Paul Klee Pädagogisches Skizzenbuch 10.jpg | 4/5 | BOUND. 'first/second/third case': one form developed three ways |
| U3 `masterclass-6` | Wright diary.jpg | 5/5 | BOUND. handwritten diary page on flight tests |
| U3 `masterclass-6` | Thomas Edison in the Chemistry Laboratory writing in his notebook | 4/5 | man writing in notebook in lab; identifiable |
| U3 `lab-1` | Design for Three Chairs with Curved Backs (verso- Sketch for a Si | 5/5 | BOUND. three chair variants in a row |
| U3 `lab-2` | Wright Glider being flown as a kite. -1900 10457 A.S..jpg | 4/5 | BOUND. biplane aloft, no pilot visible |
| ML-CPA `cover` | Iterative Process Diagram.svg | 4/5 | BOUND. cycle of stages with arrows |
| ML-CPA `analysis-model` | Standard Symbols for Process Charts (1), 1921.jpg | 4/5 | BOUND. symbol list with labels |
| ML-CPA `masterclass-1` | Process Chart for Ordering Blank Forms - Present Method, 1921.jpg | 5/5 | BOUND. step-by-step chart with labelled actions |
| ML-CPA `masterclass-2` | A Jacquard loom showing information punchcards, National Museum o | 4/5 | BOUND. loom with stack of punched cards |
| ML-CPA `masterclass-2` | Punch cards industrial loom.jpg | 4/5 | industrial cards; CC BY-SA 2.0 |
| ML-CPA `masterclass-3` | Album of Forty-five Figure Studies MET DP102546.jpg | 3/5 | only one strong study visible |
| ML-CPA `masterclass-4` | Design for Six Chairs with Scarlet Upholstery (verso- Sketch for  | 4/5 | BOUND. six chair variants, one upholstery |
| ML-CPA `masterclass-5` | La danse serpentine, Loïe Fuller et ses transformations.jpg | 4/5 | BOUND. eight labelled poses of the dancer |
| ML-CPA `masterclass-5` | Folies-Bergère, La Loïe Fuller (NYPL b12156457-5226881).tiff | 4/5 | single poster |
| ML-CPA `masterclass-6` | Tableau de résultats au test de Binet-Simon.jpg | 4/5 | BOUND. table of tasks against children's results |
| ML-CPA `masterclass-6` | Test du carré.jpg | 3/5 | copied squares; Simon d. 1961 |
| ML-CPA `lab-1` | Proposed Process Chart for First Orders, 1921.jpg | 4/5 | BOUND. flowchart with numbered steps |
| ML-CPA `lab-2` | Paul Klee Notebook BF 149.jpg | 4/5 | BOUND. handwritten notebook page with diagram |

## Local model call log

Before loading: `ollama ps` empty; in-practice `runtime/process.json` PID 48350 not alive. One model at a time. `llama3.2-vision` (the runbook's model) cannot load on the installed Ollama 0.34.1 (`unknown model architecture: 'mllama'`); the run used `qwen3.8:27b` (vision capability) with `think:false`, temperature 0.1, `num_predict` 200, plain text (DECISIONS-LOG). Totals for the batch: 73 calls, 61,228 prompt tokens, 7,629 output tokens, 14.8 min wall time; plus 2 failed `llama3.2-vision` calls and 1 probe call.

| # | Model | Deck · slide | Candidate | Prompt tok | Output tok | Wall s |
| --- | --- | --- | --- | --- | --- | --- |
| a | llama3.2-vision:latest | U1 `cover` | (first batch call) | — | — | 0.3 (HTTP 500: unknown architecture 'mllama') |
| b | llama3.2-vision:latest | diagnostic | AGBell Notebook | — | — | 0.3 (same HTTP 500) |
| c | qwen3.8:27b (think:false) | probe | AGBell Notebook | 565 | 125 | 21.5 |
| 1 | qwen3.8:27b (think:false) | U1 `cover` | Leonardo da Vinci - 1860,0616.98, Two studies of the Vi | 1236 | 131 | 16.7 |
| 2 | qwen3.8:27b (think:false) | U1 `cover` | Leonardo da Vinci, Study for the Madonna of the Cat (ve | 1266 | 121 | 15.9 |
| 3 | qwen3.8:27b (think:false) | U1 `analysis-model` | Beat the Whites with the Red Wedge.jpg | 816 | 133 | 14.0 |
| 4 | qwen3.8:27b (think:false) | U1 `analysis-model` | Klinom Krasnym Bej Belych.JPG | 786 | 92 | 11.4 |
| 5 | qwen3.8:27b (think:false) | U1 `masterclass-1` | Studies for the Libyan Sibyl (recto); Studies for the L | 1296 | 95 | 13.8 |
| 6 | qwen3.8:27b (think:false) | U1 `masterclass-1` | Album of Forty-five Figure Studies MET DP102546.jpg | 666 | 124 | 11.8 |
| 7 | qwen3.8:27b (think:false) | U1 `masterclass-2` | Schetsen van Hokusai - deel 2 Hokusai manga Katsushika  | 666 | 105 | 11.3 |
| 8 | qwen3.8:27b (think:false) | U1 `masterclass-2` | Hokusai Manga 04.jpg | 1255 | 152 | 18.6 |
| 9 | qwen3.8:27b (think:false) | U1 `masterclass-2` | Hokusai manga vol.8.jpg | 541 | 138 | 13.8 |
| 10 | qwen3.8:27b (think:false) | U1 `masterclass-3` | GemPaperClipAdvertisementJan1893.png | 636 | 148 | 13.7 |
| 11 | qwen3.8:27b (think:false) | U1 `masterclass-3` | Büroklammern -- 2021 -- 6481.jpg | 666 | 49 | 7.2 |
| 12 | qwen3.8:27b (think:false) | U1 `masterclass-3` | Paperclip 1900.jpg | 186 | 97 | 7.8 |
| 13 | qwen3.8:27b (think:false) | U1 `masterclass-4` | Auguste Rodin - The Thinker - 1917.42 - Cleveland Museu | 1146 | 89 | 12.6 |
| 14 | qwen3.8:27b (think:false) | U1 `masterclass-5` | Pocket set of drawing instruments MET DP232308.jpg | 756 | 87 | 11.8 |
| 15 | qwen3.8:27b (think:false) | U1 `masterclass-5` | Draughtsman's instruments MET 125791.jpg | 726 | 87 | 10.6 |
| 16 | qwen3.8:27b (think:false) | U1 `masterclass-6` | Post-It Notes Wall at the Fast Company Innovation Festi | 756 | 80 | 9.4 |
| 17 | qwen3.8:27b (think:false) | U1 `masterclass-6` | Stickies to brainstorm Edit.2014..jpg | 756 | 107 | 12.6 |
| 18 | qwen3.8:27b (think:false) | U1 `lab-1` | Marcel Duchamp, 1917, Fountain, photograph by Alfred St | 1236 | 74 | 11.8 |
| 19 | qwen3.8:27b (think:false) | U1 `lab-1` | Duchamp Fountaine.jpg | 1026 | 74 | 10.8 |
| 20 | qwen3.8:27b (think:false) | U1 `lab-2` | Theo van Doesburg and Kurt Schwitters, Kleine Dada Soir | 966 | 94 | 13.4 |
| 21 | qwen3.8:27b (think:false) | U1 `lab-2` | 1916 Marcel Słodki Cabaret-Voltaire.jpg | 1506 | 178 | 21.1 |
| 22 | qwen3.8:27b (think:false) | U1 `lab-2` | Grand opening of the first Dada exhibition, Berlin, 5 J | 816 | 117 | 13.3 |
| 23 | qwen3.8:27b (think:false) | U2 `cover` | Darwin Tree 1837.png | 1536 | 71 | 12.9 |
| 24 | qwen3.8:27b (think:false) | U2 `cover` | Darwins first tree.jpg | 484 | 97 | 9.5 |
| 25 | qwen3.8:27b (think:false) | U2 `analysis-model` | Study for "A Sunday on La Grande Jatte" MET DP259921.jp | 666 | 73 | 9.3 |
| 26 | qwen3.8:27b (think:false) | U2 `analysis-model` | Georges Seurat - Étude pour "La Grande Jatte" (Study fo | 636 | 110 | 11.6 |
| 27 | qwen3.8:27b (think:false) | U2 `masterclass-1` | Sprite Fright-concept art-Victoria 01.png | 396 | 134 | 12.7 |
| 28 | qwen3.8:27b (think:false) | U2 `masterclass-2` | Atlanticus Folio 132 133.jpg | 1116 | 135 | 16.0 |
| 29 | qwen3.8:27b (think:false) | U2 `masterclass-2` | Hokusai Manga 04.jpg | 1255 | 100 | 7.8 |
| 30 | qwen3.8:27b (think:false) | U2 `masterclass-3` | Stickies to brainstorm Edit.2014..jpg | 756 | 116 | 9.6 |
| 31 | qwen3.8:27b (think:false) | U2 `masterclass-3` | Brainstorming Customer Feedback (1).jpg | 756 | 82 | 11.4 |
| 32 | qwen3.8:27b (think:false) | U2 `masterclass-4` | Oblique Strategies deck, PO Box, The Barbican, London,  | 756 | 116 | 13.4 |
| 33 | qwen3.8:27b (think:false) | U2 `masterclass-4` | Sombrero negro (Dudas).jpg | 726 | 105 | 11.3 |
| 34 | qwen3.8:27b (think:false) | U2 `masterclass-5` | Pugh Concept Selection.png | 396 | 92 | 9.1 |
| 35 | qwen3.8:27b (think:false) | U2 `masterclass-5` | Pugh Matrix Concepts.png | 313 | 117 | 10.6 |
| 36 | qwen3.8:27b (think:false) | U2 `masterclass-6` | Vincent van Gogh - Self-portrait with bandaged ear (188 | 1146 | 90 | 13.0 |
| 37 | qwen3.8:27b (think:false) | U2 `masterclass-6` | Vincent van Gogh - Self portrait with bandaged ear F529 | 1086 | 82 | 11.7 |
| 38 | qwen3.8:27b (think:false) | U2 `lab-1` | Kodo Sawaki Zazen.jpg | 1356 | 73 | 12.9 |
| 39 | qwen3.8:27b (think:false) | U2 `lab-1` | Zazen dans le dojo.jpg | 666 | 88 | 11.6 |
| 40 | qwen3.8:27b (think:false) | U2 `lab-2` | Mina Crandon automatic writing.png | 976 | 101 | 12.3 |
| 41 | qwen3.8:27b (think:false) | U2 `lab-2` | HélèneSmith martien01.jpg | 406 | 66 | 7.6 |
| 42 | qwen3.8:27b (think:false) | U2 `lab-2` | Francis Ward Monck psychograph 2.png | 654 | 114 | 13.2 |
| 43 | qwen3.8:27b (think:false) | U3 `cover` | Gliding flight, Wright Glider, Kitty Hawk, NC. 1902.104 | 552 | 89 | 9.6 |
| 44 | qwen3.8:27b (think:false) | U3 `cover` | 1902 Wright Brothers' Glider Tests - GPN-2002-000125.jp | 696 | 90 | 11.1 |
| 45 | qwen3.8:27b (think:false) | U3 `analysis-model` | Cow by Theo van Doesburg Museum of Modern Art 227.1948. | 726 | 118 | 13.2 |
| 46 | qwen3.8:27b (think:false) | U3 `analysis-model` | Cow by Theo van Doesburg Museum of Modern Art 25.1969.j | 696 | 119 | 12.4 |
| 47 | qwen3.8:27b (think:false) | U3 `masterclass-1` | Maqueta polifunicular.jpg | 1266 | 104 | 14.0 |
| 48 | qwen3.8:27b (think:false) | U3 `masterclass-1` | Maqueta funicular.jpg | 1266 | 86 | 13.3 |
| 49 | qwen3.8:27b (think:false) | U3 `masterclass-1` | Paper prototype of website user interface, 2015-04-16.j | 666 | 66 | 8.2 |
| 50 | qwen3.8:27b (think:false) | U3 `masterclass-2` | Sketches for the second movement of Symphony no. 7, op. | 516 | 87 | 9.4 |
| 51 | qwen3.8:27b (think:false) | U3 `masterclass-2` | Sketches for the first movement of the Fifth Piano Conc | 726 | 88 | 10.0 |
| 52 | qwen3.8:27b (think:false) | U3 `masterclass-3` | Wright Brothers Wind Tunnel Replica.jpg | 606 | 74 | 8.7 |
| 53 | qwen3.8:27b (think:false) | U3 `masterclass-3` | WB Wind Tunnel.jpg | 756 | 103 | 10.5 |
| 54 | qwen3.8:27b (think:false) | U3 `masterclass-4` | AGBell Notebook.jpg | 606 | 106 | 11.7 |
| 55 | qwen3.8:27b (think:false) | U3 `masterclass-4` | Design for a Flying Machine.jpg | 290 | 130 | 11.9 |
| 56 | qwen3.8:27b (think:false) | U3 `masterclass-5` | Paul Klee Pädagogisches Skizzenbuch 10.jpg | 696 | 188 | 18.1 |
| 57 | qwen3.8:27b (think:false) | U3 `masterclass-6` | Wright diary.jpg | 996 | 79 | 11.3 |
| 58 | qwen3.8:27b (think:false) | U3 `masterclass-6` | Thomas Edison in the Chemistry Laboratory writing in hi | 1206 | 105 | 12.6 |
| 59 | qwen3.8:27b (think:false) | U3 `lab-1` | Design for Three Chairs with Curved Backs (verso- Sketc | 756 | 112 | 12.7 |
| 60 | qwen3.8:27b (think:false) | U3 `lab-2` | Wright Glider being flown as a kite. -1900 10457 A.S..j | 552 | 73 | 9.0 |
| 61 | qwen3.8:27b (think:false) | ML-CPA `cover` | Iterative Process Diagram.svg | 576 | 100 | 9.4 |
| 62 | qwen3.8:27b (think:false) | ML-CPA `analysis-model` | Standard Symbols for Process Charts (1), 1921.jpg | 678 | 120 | 11.7 |
| 63 | qwen3.8:27b (think:false) | ML-CPA `masterclass-1` | Process Chart for Ordering Blank Forms - Present Method | 738 | 113 | 12.7 |
| 64 | qwen3.8:27b (think:false) | ML-CPA `masterclass-2` | A Jacquard loom showing information punchcards, Nationa | 666 | 83 | 9.9 |
| 65 | qwen3.8:27b (think:false) | ML-CPA `masterclass-2` | Punch cards industrial loom.jpg | 1416 | 121 | 15.4 |
| 66 | qwen3.8:27b (think:false) | ML-CPA `masterclass-3` | Album of Forty-five Figure Studies MET DP102546.jpg | 666 | 124 | 12.4 |
| 67 | qwen3.8:27b (think:false) | ML-CPA `masterclass-4` | Design for Six Chairs with Scarlet Upholstery (verso- S | 786 | 106 | 13.0 |
| 68 | qwen3.8:27b (think:false) | ML-CPA `masterclass-5` | La danse serpentine, Loïe Fuller et ses transformations | 1326 | 138 | 17.2 |
| 69 | qwen3.8:27b (think:false) | ML-CPA `masterclass-5` | Folies-Bergère, La Loïe Fuller (NYPL b12156457-5226881) | 1356 | 84 | 12.6 |
| 70 | qwen3.8:27b (think:false) | ML-CPA `masterclass-6` | Tableau de résultats au test de Binet-Simon.jpg | 1446 | 119 | 17.7 |
| 71 | qwen3.8:27b (think:false) | ML-CPA `masterclass-6` | Test du carré.jpg | 636 | 86 | 8.9 |
| 72 | qwen3.8:27b (think:false) | ML-CPA `lab-1` | Proposed Process Chart for First Orders, 1921.jpg | 370 | 138 | 12.1 |
| 73 | qwen3.8:27b (think:false) | ML-CPA `lab-2` | Paul Klee Notebook BF 149.jpg | 1206 | 146 | 18.0 |

## Commands run and results

```text
$ node --test scripts/tests/index.js           → tests 30, pass 30, fail 0
$ node scripts/rehydrate-student-media.mjs --rights=flag
  tc/U1: 9 bound · tc/U2: 9 · tc/U3: 9 · ml/ML-CPA: 9 · rasterised 1b014b8e74a8b772.svg → .webp (1920x1075)
  Media rehydration (rights=flag): 6 deck file(s), changed 4, orphans removed 0.
$ node scripts/validate-decks.mjs --strict --rights=flag
  validate-decks: 6 deck file(s), 0 error(s), 12 warning(s)   (7 rights flags in v2 decks, 5 legacy U4)
$ bash …/PHASE-EX4.exit-gate.sh  → failures: 0
$ bash …/PHASE-EX0..EX3.exit-gate.sh → failures: 0, 0, 0, 0
```

(The caller asked me to run the gates; this is not self-certification — the runner's `cascade-harness.sh verify` log is the record.)

## Open issues / uncertainty

1. **Vision model substitution** — fit checks used `qwen3.8:27b`, not `llama3.2-vision`; the cold reviewer should spot-check 5 bindings against their briefs as the runbook asks.
2. **Fit scores are my judgement** on the model's description; the vision model misread two images (Gaudí model as a "ceremonial object", wind-tunnel replica as a "printing press"); I unbound the latter.
3. **Rights calls:** Fountain and the Gilbreth charts are flagged on EU term; the Post-it wall on licence; Sawaki on identifiable person. Anonymous items (Gaudí model photograph c. 1908, Gem paper-clip advert 1893, Loïe Fuller print before 1900, the early-19th-century chair designs) are treated as anonymous works whose EU term from publication has expired; the Wright photographs are attributed to the brothers (Orville d. 1948).
4. **Public titles** come from the brief's subject clause and are long on some slides (e.g. the ML cover); EX5's caption work may shorten them.
5. **Not found as images:** Osborn's checklist, a 6-3-5 sheet, Zwicky's morphological box, a Tzara cut-up — the 4 diagram slides list their briefs so a later pass can fill them.
6. The validator warning list does not show curator-only flags (Sawaki passes `rightsVerdict`); the deck's public `rights_status` is `flagged` and FINAL-REVIEW lists it.

## Resume point

Run `cascade-harness.sh verify <integration>/creativity-techniques-pedagogy/excellence PHASE-EX4.md <this worktree>`, then a fresh `cascade-cold-reviewer`. Do not open EX5 until EX4 is closed by the reviewer and professor.
