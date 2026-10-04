"""Ahmes neighborhood context + Chicago heading + DH classification (private)."""
from __future__ import annotations

import json
import re
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote as url_quote


AHMES_LIBRARY_ROOT = Path.home() / "ahmes-library"


@dataclass(frozen=True)
class ConceptRef:
    pref_label: str
    uri: str
    scheme: str | None = None
    source: str = "record"  # record | ahmes_anchor | ahmes_keyword | entity


@dataclass(frozen=True)
class QuoteContext:
    chicago_heading: str
    bibliography_safe: bool
    page_label: str | None
    page_index: int | None  # 0-based Ahmes page_index
    target_node_id: str
    quote_verbatim: str
    context_blocks: tuple[tuple[bool, str, str], ...]  # (is_target, block_type, text)
    source_file: str | None
    extraction_db: str | None
    pdf_path: str | None
    pdf_uri: str | None  # file://…#page=N when possible
    cidoc_type: str | None
    concepts: tuple[ConceptRef, ...]
    keywords: tuple[str, ...]
    entities: tuple[str, ...]  # "type: label"


_FILENAME_RE = re.compile(
    r"^(?P<author>.+?)\s+-\s+(?P<title>.+?)\s+\((?P<year>(?:19|20)\d{2})(?:,\s*(?P<publisher>[^)]+))?\)",
    re.I,
)


def chicago_from_pdf_filename(file_name: str | None) -> str | None:
    if not file_name:
        return None
    stem = Path(file_name).name
    m = _FILENAME_RE.match(stem)
    if not m:
        return None
    author = m.group("author").strip()
    title = m.group("title").replace("_", ":").strip()
    year = m.group("year")
    publisher = (m.group("publisher") or "").strip()
    parts = author.split()
    if len(parts) >= 2 and "," not in author:
        author_fmt = f"{parts[-1]}, {' '.join(parts[:-1])}"
    else:
        author_fmt = author
    pub = f" {publisher}." if publisher else "."
    return f"{author_fmt}. {year}. *{title}*.{pub}"


def chicago_from_coat(coat: str | None) -> str | None:
    if not coat:
        return None
    m = re.search(r"_(19|20)\d{2}_", coat)
    year = m.group(0).strip("_") if m else None
    pretty = coat.rsplit("_", 1)[0].replace("_", " ")
    if year:
        return f"{pretty} ({year})."
    return f"{pretty}."


def chicago_from_metadata(
    *,
    title: str | None,
    authors_json: str | None,
    year: str | None,
    publisher: str | None = None,
) -> str | None:
    """Build a short Chicago-like heading from Ahmes metadata rows."""
    if not title:
        return None
    author_bit = ""
    if authors_json:
        try:
            rows = json.loads(authors_json)
            if isinstance(rows, list) and rows:
                names: list[str] = []
                for a in rows[:3]:
                    if not isinstance(a, dict):
                        continue
                    family = (a.get("family") or "").strip()
                    given = (a.get("given") or "").strip()
                    if family and given:
                        names.append(f"{family}, {given}")
                    elif family:
                        names.append(family)
                if names:
                    author_bit = "; ".join(names) + ". "
        except json.JSONDecodeError:
            pass
    year_bit = f" {year}." if year else "."
    pub = f" {publisher}." if publisher else ""
    return f"{author_bit}*{title}*{year_bit}{pub}".replace("..", ".")


def best_chicago(
    *,
    citation_stdout: str,
    file_name: str | None,
    coat: str | None,
    page_from_quote: int | None = None,
    meta_chicago: str | None = None,
) -> tuple[str, bool]:
    """Return (heading, bibliography_safe)."""
    head = (citation_stdout or "").strip().split("\n", 1)[0].strip()
    from_file = chicago_from_pdf_filename(file_name)
    built = from_file or meta_chicago
    safe_head = bool(head and not head.startswith("[BIBLIO-GAP]"))

    if safe_head:
        paren = re.match(r"^\(([^)]+)\)", head)
        short = f"({paren.group(1)})" if paren else head.split("  [")[0].strip()
        if built:
            return f"{built} In-text: {short}", True
        return short, True

    if built:
        page = f" p. {page_from_quote}." if page_from_quote else ""
        if from_file:
            return (
                f"{built.rstrip('.')}{page} "
                "[BIBLIO-GAP — filename-derived; verify before student use]",
                False,
            )
        # meta-only coat without live cite — still gap until cite refreshes
        return f"{built.rstrip('.')}{page} [BIBLIO-GAP]", False

    coat_c = chicago_from_coat(coat)
    if coat_c:
        return f"{coat_c} [BIBLIO-GAP]", False
    return "[BIBLIO-GAP] unresolved source", False


def teaching_reuse_label(*, kind: str, quote: str, shortlist: bool) -> str:
    if shortlist:
        return "lab_exercise_candidate"
    q = quote or ""
    if kind in {"classroom_exercise", "incomplete"} and (
        "?" in q or "What if" in q or "what if" in q or re.match(r"^\s*\d+\.", q)
    ):
        return "critical_prompt_or_puzzle"
    if kind == "technique_description":
        return "technique_note"
    if kind == "theory":
        return "theory_passage"
    if kind == "protocol_transcript":
        return "protocol_excerpt"
    return "teaching_fragment"


def _file_uri(path: Path, page_one_based: int | None) -> str:
    # RFC 8089-ish: file:///abs/path — encode spaces but keep /
    abs_path = path.resolve()
    encoded = url_quote(str(abs_path), safe="/:")
    if not encoded.startswith("/"):
        encoded = "/" + encoded
    uri = f"file://{encoded}"
    if page_one_based and page_one_based > 0:
        uri = f"{uri}#page={page_one_based}"
    return uri


def concepts_from_record(raw: dict | None) -> list[ConceptRef]:
    out: list[ConceptRef] = []
    if not raw:
        return out
    sem = raw.get("semantics") or {}
    for c in sem.get("concepts") or []:
        label = (c.get("prefLabel") or "").strip()
        if not label:
            continue
        out.append(
            ConceptRef(
                pref_label=label,
                uri=str(c.get("uri") or ""),
                scheme=c.get("inScheme"),
                source="record",
            )
        )
    # proposal tags as fallback labels
    for prop in raw.get("proposals") or []:
        for tag in prop.get("tags") or []:
            t = str(tag).strip()
            if t and t not in {x.pref_label for x in out}:
                out.append(
                    ConceptRef(
                        pref_label=t,
                        uri=f"urn:in-practice:concept:{t}",
                        scheme="urn:in-practice:scheme:creativity-v1",
                        source="record",
                    )
                )
    return out


class AhmesContextLoader:
    """Read-only Ahmes extraction.db neighborhood + DH classification fields."""

    def __init__(
        self,
        before: int = 10,
        after: int = 6,
        *,
        scan_radius: int = 40,
        max_block_chars: int = 2800,
    ) -> None:
        self._before = before
        self._after = after
        self._scan_radius = scan_radius
        self._max_block_chars = max_block_chars

    def load(
        self,
        *,
        extraction_db: str | None,
        target_node_id: str,
        quote_text: str,
        citation_stdout: str,
        coat: str | None,
        quote_pages: list | None = None,
        raw_record: dict | None = None,
    ) -> QuoteContext:
        db_path = Path(extraction_db) if extraction_db else None
        file_name = None
        page_label = None
        page_num = None  # 1-based display
        page_index = None  # 0-based
        blocks: list[tuple[bool, str, str]] = []  # (is_target, block_type, text)
        verbatim = quote_text
        pdf_path: str | None = None
        pdf_uri: str | None = None
        keywords: list[str] = []
        entities: list[str] = []
        ahmes_concepts: list[ConceptRef] = []

        if quote_pages:
            try:
                page_index = int(quote_pages[0])
                page_num = page_index + 1
            except (TypeError, ValueError):
                page_index = None
                page_num = None

        record_concepts = concepts_from_record(raw_record)
        cidoc_type = None
        if raw_record:
            cidoc_type = (raw_record.get("semantics") or {}).get("@type")

        if db_path and db_path.is_file():
            try:
                conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
                conn.row_factory = sqlite3.Row
                src = conn.execute(
                    "SELECT file_name, original_observed_path, library_original_rel_path "
                    "FROM source LIMIT 1"
                ).fetchone()
                if src:
                    file_name = src["file_name"]
                    pdf_path, pdf_uri = self._resolve_pdf(
                        observed=src["original_observed_path"],
                        library_rel=src["library_original_rel_path"],
                        page_one_based=page_num,
                    )

                kw_row = conn.execute(
                    "SELECT value FROM metadata WHERE key='keywords'"
                ).fetchone()
                if kw_row and kw_row["value"]:
                    keywords = self._parse_keywords(kw_row["value"])

                # Node-level lexicum / thesaurus / syllabum (CIDOC-aligned anchors)
                for a in conn.execute(
                    "SELECT term_uri, taxonomy, confidence FROM anchor_semantic "
                    "WHERE node_id=? ORDER BY confidence DESC LIMIT 12",
                    (target_node_id,),
                ):
                    label = a["term_uri"].rsplit("/", 1)[-1].rsplit(":", 1)[-1]
                    ahmes_concepts.append(
                        ConceptRef(
                            pref_label=label.replace("_", "-"),
                            uri=a["term_uri"],
                            scheme=f"ahmes:{a['taxonomy']}",
                            source="ahmes_anchor",
                        )
                    )

                for em in conn.execute(
                    """
                    SELECT e.type, COALESCE(e.normalized, e.surface_form) AS label
                    FROM entity_mention em
                    JOIN entity e ON e.entity_id = em.entity_id
                    WHERE em.node_id = ?
                    ORDER BY em.confidence DESC
                    LIMIT 10
                    """,
                    (target_node_id,),
                ):
                    entities.append(f"{em['type']}: {em['label']}")

                row = conn.execute(
                    "SELECT rowid, original_content, markdown_content "
                    "FROM fission_node WHERE node_id=?",
                    (target_node_id,),
                ).fetchone()
                if row:
                    node_text = (
                        (row["original_content"] or "").strip()
                        or (row["markdown_content"] or "").strip()
                    )
                    # Prefer catalogue quote when it spans neighbors / is richer
                    # (e.g. puzzle + Reflect + solution restored for framing).
                    qt = (quote_text or "").strip()
                    if qt and len(qt) > len(node_text) + 40:
                        verbatim = qt
                    elif node_text:
                        verbatim = node_text
                    rid = row["rowid"]
                    sp = conn.execute(
                        "SELECT page_index FROM anchor_spatial WHERE node_id=? LIMIT 1",
                        (target_node_id,),
                    ).fetchone()
                    if sp and sp["page_index"] is not None:
                        page_index = int(sp["page_index"])
                        page_num = page_index + 1
                        page_label = f"p. {page_num}"
                        # refresh URI with definitive page
                        if pdf_path:
                            pdf_uri = _file_uri(Path(pdf_path), page_num)

                    neigh = conn.execute(
                        """
                        SELECT rowid, node_id, block_type,
                               COALESCE(NULLIF(original_content,''), markdown_content, '') AS body
                        FROM fission_node
                        WHERE rowid BETWEEN ? AND ?
                        ORDER BY rowid
                        """,
                        (rid - self._scan_radius, rid + self._scan_radius),
                    ).fetchall()
                    usable: list[tuple[str, str, str]] = []
                    for n in neigh:
                        body = (n["body"] or "").strip()
                        btype = n["block_type"] or ""
                        if not body and btype in {"figure", "image", "heading"}:
                            body = f"[{btype}]"
                        if not body:
                            continue
                        if (
                            n["node_id"] != target_node_id
                            and len(body) < 28
                            and btype not in {"heading", "figure", "image"}
                        ):
                            continue
                        usable.append((n["node_id"], btype, body))
                    target_i = next(
                        (i for i, u in enumerate(usable) if u[0] == target_node_id),
                        None,
                    )
                    if target_i is None:
                        usable = [(target_node_id, "text", verbatim)]
                        target_i = 0
                    lo = max(0, target_i - self._before)
                    hi = min(len(usable), target_i + self._after + 1)
                    figure_trail = 0
                    for i, (node_id, btype, body) in enumerate(usable[lo:hi]):
                        abs_i = lo + i
                        is_fig_stub = body in {"[figure]", "[image]"} or (
                            btype in {"figure", "image"} and body.startswith("[")
                        )
                        if is_fig_stub and node_id != target_node_id:
                            if abs_i < target_i:
                                continue
                            figure_trail += 1
                            if figure_trail > 1:
                                continue
                        flat = re.sub(r"\s+", " ", body)
                        if len(flat) > self._max_block_chars:
                            flat = flat[: self._max_block_chars].rstrip() + "…"
                        blocks.append((node_id == target_node_id, btype or "text", flat))
                conn.close()
            except sqlite3.Error:
                blocks = []

        # Merge concepts: record (thematic scheme) first, then Ahmes anchors
        seen_labels = {c.pref_label.lower() for c in record_concepts}
        merged = list(record_concepts)
        for c in ahmes_concepts:
            if c.pref_label.lower() not in seen_labels:
                merged.append(c)
                seen_labels.add(c.pref_label.lower())
        # Keywords as soft thematic tags when not already a concept
        for kw in keywords:
            if kw.lower() not in seen_labels:
                merged.append(
                    ConceptRef(
                        pref_label=kw,
                        uri="",
                        scheme="ahmes:metadata.keywords",
                        source="ahmes_keyword",
                    )
                )
                seen_labels.add(kw.lower())

        # Prefer Ahmes metadata Chicago when filename cannot be parsed (e.g. Fisher PDF)
        meta_title = meta_authors = meta_year = meta_pub = None
        if db_path and db_path.is_file():
            try:
                conn_m = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
                conn_m.row_factory = sqlite3.Row
                def _mv(k: str) -> str | None:
                    r = conn_m.execute(
                        "SELECT value FROM metadata WHERE key=? LIMIT 1", (k,)
                    ).fetchone()
                    return r["value"] if r else None
                meta_title = _mv("title")
                meta_authors = _mv("authors")
                meta_year = _mv("year")
                meta_pub = _mv("publisher")
                conn_m.close()
            except sqlite3.Error:
                pass
        meta_chicago = chicago_from_metadata(
            title=meta_title,
            authors_json=meta_authors,
            year=meta_year,
            publisher=meta_pub,
        )

        chicago, safe = best_chicago(
            citation_stdout=citation_stdout,
            file_name=file_name,
            coat=coat,
            page_from_quote=page_num,
            meta_chicago=meta_chicago,
        )
        if page_label and "p. " not in chicago:
            chicago = f"{chicago.rstrip('.')} ({page_label})."
        if page_num and not page_label:
            page_label = f"p. {page_num}"

        return QuoteContext(
            chicago_heading=chicago,
            bibliography_safe=safe,
            page_label=page_label,
            page_index=page_index,
            target_node_id=target_node_id,
            quote_verbatim=verbatim,
            context_blocks=tuple(blocks),
            source_file=file_name,
            extraction_db=str(db_path) if db_path else None,
            pdf_path=pdf_path,
            pdf_uri=pdf_uri,
            cidoc_type=cidoc_type,
            concepts=tuple(merged),
            keywords=tuple(keywords),
            entities=tuple(entities),
        )

    @staticmethod
    def _parse_keywords(raw: str) -> list[str]:
        raw = raw.strip()
        if not raw:
            return []
        if raw.startswith("["):
            try:
                data = json.loads(raw)
                if isinstance(data, list):
                    return [str(x).strip() for x in data if str(x).strip()]
            except json.JSONDecodeError:
                pass
        return [p.strip() for p in re.split(r"[,;]", raw) if p.strip()]

    @staticmethod
    def _resolve_pdf(
        *,
        observed: str | None,
        library_rel: str | None,
        page_one_based: int | None,
    ) -> tuple[str | None, str | None]:
        candidates: list[Path] = []
        if library_rel:
            candidates.append(AHMES_LIBRARY_ROOT / library_rel)
        if observed:
            candidates.append(Path(observed))
        for path in candidates:
            if path.is_file():
                return str(path), _file_uri(path, page_one_based)
        # Prefer library path even if missing (stable URI for when coat is present)
        if library_rel:
            path = AHMES_LIBRARY_ROOT / library_rel
            return str(path), _file_uri(path, page_one_based)
        if observed:
            path = Path(observed)
            return str(path), _file_uri(path, page_one_based)
        return None, None
