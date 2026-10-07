# Per-file rights facts (author / death year) — author from Commons file page; death years are standard biographical dates.
# key: substring of title -> (author, death_year, note)
R = {
 "1860,0616.98": ("Leonardo da Vinci", 1519, ""),
 "Madonna of the Cat (verso)": ("Leonardo da Vinci", 1519, ""),
 "Atlanticus Folio": ("Leonardo da Vinci and workshop", 1519, ""),
 "Design for a Flying Machine": ("Leonardo da Vinci", 1519, ""),
 "Beat the Whites": ("El Lissitzky", 1941, ""),
 "Klinom Krasnym": ("El Lissitzky", 1941, ""),
 "Libyan Sibyl": ("Michelangelo Buonarroti", 1564, ""),
 "Forty-five Figure": ("Edgar Degas", 1917, ""),
 "Schetsen van Hokusai": ("Katsushika Hokusai", 1849, ""),
 "Hokusai Manga 04": ("Katsushika Hokusai", 1849, ""),
 "Hokusai manga vol.8": ("Katsushika Hokusai", 1849, ""),
 "GemPaperClip": ("Unknown advertiser (1893)", None, "anonymous work published 1893; EU term for anonymous works (70 years from publication) expired"),
 "Büroklammern": ("Dietmar Rabich", None, "photographer's own CC BY-SA 4.0 licence"),
 "Paperclip 1900": ("Unknown author (1900)", None, "anonymous work c. 1900; term from publication expired"),
 "The Thinker - 1917.42": ("Auguste Rodin (sculpture); Cleveland Museum of Art (photograph, CC0)", 1917, ""),
 "Pocket set of drawing": ("Peter Dollond (instrument maker); The Metropolitan Museum of Art (photograph, CC0)", 1820, ""),
 "Draughtsman's instruments": ("Le Maire fils (instrument maker); The Metropolitan Museum of Art (photograph, CC0)", None, "18th-century object; Met Open Access CC0 photograph"),
 "Post-It Notes Wall": ("Nan Palmero", None, "CC BY 2.0 is not on the accepted-licence list"),
 "Stickies to brainstorm": ("Victor Grigas", None, "photographer's own CC BY-SA 3.0 licence"),
 "Brainstorming Customer Feedback": ("Steveonmz", None, "photographer's own CC BY-SA 4.0 licence"),
 "Fountain, photograph by Alfred Stieglitz": ("Alfred Stieglitz (photograph) / Marcel Duchamp (readymade)", 1968, "photograph: Stieglitz d. 1946 (EU term expired 2016); depicted readymade: Duchamp d. 1968 (EU term to 2038) — whether a mass-produced urinal carries Duchamp's copyright is doubtful, but the claim cannot be cleared here"),
 "Duchamp Fountaine": ("Alfred Stieglitz (photograph) / Marcel Duchamp (readymade)", 1968, "same as the Stieglitz photograph"),
 "Kleine Dada Soir": ("Theo van Doesburg and Kurt Schwitters", 1948, "van Doesburg d. 1931, Schwitters d. 1948"),
 "Słodki": ("Marcel Słodki", 1944, ""),
 "Grand opening of the first Dada": ("Unknown photographer (1920)", None, "anonymous photograph 1920; identifiable people at a public art event"),
 "Darwin Tree 1837": ("Charles Darwin", 1882, ""),
 "Darwins first tree": ("Charles Darwin", 1882, ""),
 "MET DP259921": ("Georges Seurat", 1891, ""),
 "Albright": ("Georges Seurat", 1891, ""),
 "Sprite Fright": ("Julien Kaspar / Blender Foundation", None, "CC BY 4.0 from the Blender Studio; prospector title carries modern_rights_review_required"),
 "Oblique Strategies": ("Cory Doctorow (photograph); Brian Eno and Peter Schmidt (cards)", None, "photo CC BY-SA 2.0 (not on accepted list); card design and text by living author (Eno)"),
 "Sombrero negro": ("NMontoya (WMCO)", None, "own CC BY 4.0"),
 "Pugh Concept Selection": ("Chattons2", None, "own CC BY-SA 3.0"),
 "Pugh Matrix Concepts": ("Herko60", None, "own CC BY-SA 3.0"),
 "Courtauld": ("Vincent van Gogh", 1890, ""),
 "F529": ("Vincent van Gogh", 1890, ""),
 "Kodo Sawaki Zazen.jpg": ("Unknown photographer (c. 1920)", None, "anonymous photograph c. 1920; identifiable sitter (Kōdō Sawaki, public religious teacher, d. 1965)"),
 "Zazen dans le dojo": ("Daiko Shōgen", None, "own CC0; people in a dojo"),
 "Mina Crandon": ("Stanley De Brath (publisher of the reproduction)", 1937, "reproduction of a séance writing sample published 1930"),
 "HélèneSmith": ("Hélène Smith", 1929, ""),
 "Monck psychograph": ("George Henslow (publisher)", 1925, ""),
 "Gliding flight, Wright Glider": ("Wilbur and Orville Wright", 1948, "Orville Wright d. 1948 (EU term expired 2018)"),
 "GPN-2002-000125": ("Wright brothers (NASA archive)", 1948, ""),
 "Cow by Theo van Doesburg Museum of Modern Art 227": ("Theo van Doesburg", 1931, ""),
 "Cow by Theo van Doesburg Museum of Modern Art 25": ("Theo van Doesburg", 1931, ""),
 "Maqueta polifunicular": ("Unknown photographer (Gaudí workshop, c. 1908)", None, "anonymous photograph c. 1898–1908; model by Antoni Gaudí (d. 1926)"),
 "Maqueta funicular.jpg": ("Canaan", None, "photo CC BY-SA 4.0 of a reconstruction model"),
 "Paper prototype of website": ("Sage Ross", None, "own CC BY-SA 4.0"),
 "Symphony no. 7": ("Ludwig van Beethoven (sketchbook); Daderot (photograph, public-domain dedication)", 1827, ""),
 "Fifth Piano Concerto": ("Ludwig van Beethoven (sketchbook); Daderot (photograph, public-domain dedication)", 1827, ""),
 "Wind Tunnel Replica": ("MLWatts", None, "own CC BY-SA 3.0"),
 "WB Wind Tunnel": ("Axda0002 (English Wikipedia)", None, "CC BY-SA 2.5 not on accepted list"),
 "AGBell Notebook": ("Alexander Graham Bell", 1922, ""),
 "Pädagogisches Skizzenbuch 10": ("Paul Klee", 1940, ""),
 "Klee Notebook BF 149": ("Paul Klee", 1940, ""),
 "Wright diary": ("Orville Wright", 1948, ""),
 "Thomas Edison in the Chemistry": ("Unknown photographer (1928)", None, "anonymous photograph 1928 (US NPS); identifiable public figure"),
 "Three Chairs with Curved Backs": ("Anonymous designer (early 19th century); The Metropolitan Museum of Art (CC0)", None, "anonymous 19th-century drawing; Met Open Access CC0"),
 "Six Chairs with Scarlet": ("Anonymous designer (early 19th century); The Metropolitan Museum of Art (CC0)", None, "anonymous 19th-century drawing; Met Open Access CC0"),
 "Wright Glider being flown as a kite": ("Wilbur and Orville Wright", 1948, ""),
 "Iterative Process Diagram": ("Krupadeluxe", None, "own CC BY-SA 4.0; prospector title carries modern_rights_review_required"),
 "Standard Symbols for Process Charts": ("Frank B. Gilbreth and Lillian M. Gilbreth", 1972, "Lillian Gilbreth d. 1972: EU term runs to 2042; PD in the US only (pre-1929)"),
 "Process Chart for Ordering": ("Frank B. Gilbreth and Lillian M. Gilbreth", 1972, "Lillian Gilbreth d. 1972: EU term runs to 2042; PD in the US only"),
 "Proposed Process Chart": ("Frank B. Gilbreth and Lillian M. Gilbreth", 1972, "Lillian Gilbreth d. 1972: EU term runs to 2042; PD in the US only"),
 "A Jacquard loom showing": ("Stephen C. Dickson", None, "own CC BY-SA 4.0"),
 "Punch cards industrial loom": ("Sunfox", None, "CC BY-SA 2.0 not on accepted list"),
 "La danse serpentine": ("Unknown author (before 1900)", None, "anonymous image before 1900"),
 "Folies-Bergère, La Loïe Fuller": ("Unknown author (1897); NYPL scan", None, "anonymous poster 1897"),
 "Tableau de résultats": ("Alfred Binet", 1911, ""),
 "Test du carré": ("Alfred Binet and Théodore Simon", 1961, "Simon d. 1961: EU term runs to 2031"),
}
LIC = {"Public domain":"PD-old-70","CC0":"CC0","CC BY-SA 4.0":"CC-BY-SA-4.0","CC BY 4.0":"CC-BY-4.0","CC BY-SA 3.0":"CC-BY-SA-3.0","CC BY 3.0":"CC-BY-3.0","CC BY 2.0":"CC-BY-2.0","CC BY-SA 2.0":"CC-BY-SA-2.0","CC BY-SA 2.5":"CC-BY-SA-2.5"}
LICURL = {"CC-BY-SA-4.0":"https://creativecommons.org/licenses/by-sa/4.0/","CC-BY-4.0":"https://creativecommons.org/licenses/by/4.0/","CC-BY-SA-3.0":"https://creativecommons.org/licenses/by-sa/3.0/","CC-BY-3.0":"https://creativecommons.org/licenses/by/3.0/","CC-BY-2.0":"https://creativecommons.org/licenses/by/2.0/","CC-BY-SA-2.0":"https://creativecommons.org/licenses/by-sa/2.0/","CC-BY-SA-2.5":"https://creativecommons.org/licenses/by-sa/2.5/","CC0":"https://creativecommons.org/publicdomain/zero/1.0/","PD-old-70":"https://creativecommons.org/publicdomain/mark/1.0/"}
OK_LIC = {"PD-old-70","CC0","CC-BY-4.0","CC-BY-SA-4.0","CC-BY-3.0","CC-BY-SA-3.0"}
def rights(title, m, year=2026):
    key = next((k for k in R if k in title), None)
    author, dy, note = R[key]
    lic = LIC.get(m['licence'], m['licence'])
    if lic == "PD-old-70" and dy is None:
        lic = "PD-EU"  # anonymous / pre-term: term from publication
    reasons = []
    if lic not in OK_LIC and lic != "PD-EU": reasons.append(f"licence {lic} not on the accepted list")
    if lic in ("PD-old-70","PD-EU","CC0") and dy is not None and dy + 70 >= year:
        reasons.append(f"author death year {dy}: EU term runs through {dy+70}")
    if any(w in note for w in ("doubtful","living author","identifiable","modern_rights_review_required","not on the accepted")) : reasons.append(note)
    eu_ok = not any("EU term" in r for r in reasons) and not (lic in ("PD-old-70",) and dy is None)
    if lic in ("PD-old-70","PD-EU"):
        reason_txt = (f"Author died {dy}; {dy}+70 < {year}: public domain in the EU." if dy and dy+70<year else note or "Anonymous work published more than 70 years ago: EU term expired.")
    elif lic == "CC0":
        reason_txt = f"CC0 dedication by the rights holder (file page). {('Underlying work: author died '+str(dy)+'.') if dy else note}"
    else:
        reason_txt = f"Licensed by the rights holder under {lic} (file page); publication relies on the licence, not on an expired term."
    status = "flagged" if reasons else "ok"
    return dict(author=author, author_death_year=dy, licence=lic, licence_url=LICURL.get(lic,""), eu_term_ok=eu_ok and not reasons or (status=="ok"), eu_term_reason=reason_txt if eu_ok else "; ".join(reasons), rights_status=status, flag_reasons=reasons, rights_note=note)
