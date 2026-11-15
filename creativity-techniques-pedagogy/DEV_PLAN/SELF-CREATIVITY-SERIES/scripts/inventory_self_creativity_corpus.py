#!/usr/bin/env python3
"""Inventory Ahmes vaults + bibliographies for the Self–Creativity series.
Discover only — cite from Ahmes nodes after page read. Postgres/Athanor optional.
"""
from __future__ import annotations

import json
import sqlite3
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

AHMES_DOCS = Path("/Users/ruvebal/ahmes-library/scholar/documents")
BIB = Path("/Users/ruvebal/projects/ruvebal/scholar/bibliographies")
OUT = Path(__file__).resolve().parents[1] / "receipts" / "CORPUS-INVENTORY.json"

TARGETS = {
    "colzato_2012": {
        "ahmes_substr": ["colzato", "meditate_to_create", "fpsyg_2012_00116"],
        "bib_glob": ["creativity/*Colzato*", "creativity/*meditate*"],
        "role": "empirical FA/OM → divergent/convergent",
    },
    "csikszentmihalyi_flow": {
        "ahmes_substr": ["csikszentmihalyi", "creativity_flow"],
        "bib_glob": ["creativity/*Csikszentmihalyi*"],
        "role": "flow / personal creative life",
    },
    "jung": {
        "ahmes_substr": ["jung"],
        "bib_glob": ["psychology/*Jung*", "alchemy/*jung*", "psychology/*Red Book*"],
        "role": "collective unconscious / imaginal self",
    },
    "castoriadis": {
        "ahmes_substr": ["castoriadis"],
        "bib_glob": ["castoriadis_cornelius/*"],
        "role": "social imaginary / magma",
    },
    "plotinus": {
        "ahmes_substr": ["plotin"],
        "bib_glob": ["plotino/*"],
        "role": "One / contemplative ascent",
    },
    "corbin_imaginal": {
        "ahmes_substr": ["corbin", "mundus_imaginalis"],
        "bib_glob": ["corbin-henry/*", "cheetham_tom/*", "hillman-james/*Imaginal*"],
        "role": "mundus imaginalis bridge",
    },
    "kelley_confidence": {
        "ahmes_substr": ["creative_confidence", "kelley"],
        "bib_glob": ["creativity/*Creative Confidence*", "creativity/*Kelley*"],
        "role": "practiced confidence (U6 adjacency)",
    },
    "beghetto_agency": {
        "ahmes_substr": ["beghetto", "creative_agency"],
        "bib_glob": ["creativity/*Beghetto*", "**/creative_agency*"],
        "role": "creative agency / education",
    },
}


@dataclass
class Hit:
    key: str
    role: str
    ahmes_dirs: list[str]
    ahmes_node_counts: dict[str, int]
    bib_files: list[str]
    status: str  # extracted | bib_only | missing


def find_dirs(substrs: list[str]) -> list[Path]:
    if not AHMES_DOCS.is_dir():
        return []
    out = []
    for d in AHMES_DOCS.iterdir():
        name = d.name.lower()
        if any(s in name for s in substrs):
            out.append(d)
    return sorted(out)


def node_count(doc: Path) -> int:
    db = doc / "extract" / "extraction.db"
    if not db.exists():
        return 0
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
    try:
        return int(con.execute("SELECT COUNT(*) FROM fission_node").fetchone()[0])
    finally:
        con.close()


def bib_hits(globs: list[str]) -> list[str]:
    hits: list[str] = []
    for pattern in globs:
        hits.extend(str(p.relative_to(BIB)) for p in BIB.glob(pattern) if p.is_file())
    # also recursive for some patterns without slash quirks
    return sorted(set(hits))


def main() -> None:
    rows: list[Hit] = []
    for key, spec in TARGETS.items():
        dirs = find_dirs(spec["ahmes_substr"])
        counts = {d.name: node_count(d) for d in dirs}
        bibs = bib_hits(spec["bib_glob"])
        if dirs and any(counts.values()):
            status = "extracted"
        elif bibs:
            status = "bib_only"
        else:
            status = "missing"
        rows.append(
            Hit(
                key=key,
                role=spec["role"],
                ahmes_dirs=[d.name for d in dirs],
                ahmes_node_counts=counts,
                bib_files=bibs[:20],
                status=status,
            )
        )

    # Colzato claim seeds (page-backed discovery list for forgers)
    colzato_dirs = find_dirs(TARGETS["colzato_2012"]["ahmes_substr"])
    claim_seeds = []
    if colzato_dirs:
        db = colzato_dirs[0] / "extract" / "extraction.db"
        con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
        q = """
        SELECT n.node_id, a.page_index, substr(n.markdown_content, 1, 280)
        FROM fission_node n
        LEFT JOIN anchor_spatial a ON a.node_id = n.node_id
        WHERE n.markdown_content LIKE '%divergent%'
           OR n.markdown_content LIKE '%open-monitoring%'
           OR n.markdown_content LIKE '%focused-attention%'
        LIMIT 24
        """
        for node_id, page_index, excerpt in con.execute(q):
            claim_seeds.append(
                {
                    "node_id": node_id,
                    "page_index": page_index,
                    "excerpt": excerpt,
                    "coat_hint": "a9393760",
                    "cite_gate": "manual-page-read required; resolver may BIBLIO-GAP",
                }
            )
        con.close()

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "postgres_vectors": "offline_at_run",
        "athanor_broadcast": "offline_at_run",
        "rule": "Discover here; cite Ahmes nodes only after page read.",
        "inventory": [asdict(r) for r in rows],
        "colzato_claim_seeds": claim_seeds,
        "series_readiness": {
            "part_a_attention_empirical": "ready" if any(r.key == "colzato_2012" and r.status == "extracted" for r in rows) else "blocked",
            "part_b_self_depth": "partial",
            "part_c_collective_transpersonal": "blocked_pending_ahmes_extract",
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT}")
    for r in rows:
        print(f"{r.status:12} {r.key:24} ahmes={len(r.ahmes_dirs)} bib={len(r.bib_files)} nodes={sum(r.ahmes_node_counts.values())}")


if __name__ == "__main__":
    main()
