"""Rebuild Markdown reports from stored verdicts + Ahmes neighborhood context."""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from teaching_suitability.infrastructure.ahmes_context import (  # noqa: E402
    AhmesContextLoader,
    teaching_reuse_label,
)
from teaching_suitability.infrastructure.file_verdict_store import FileVerdictStore  # noqa: E402
from teaching_suitability.infrastructure.review_notes import (  # noqa: E402
    ensure_stub,
    harvest_hitl_from_markdown,
    hitl_fence_lines,
    load_review_notes,
    notes_path_for,
)


def _load_raw_record(records_dir: Path, exercise_id: str) -> dict | None:
    digest = exercise_id.removeprefix("urn:in-practice:exercise:")
    path = records_dir / f"{digest}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _md_escape_prose(text: str) -> str:
    """Escape raw [ ] so source brackets are not parsed as Markdown links."""
    return text.replace("[", "\\[").replace("]", "\\]")


def _blockquote(text: str) -> list[str]:
    """Verbatim quotation only — one continuous blockquote line (editor soft-wraps)."""
    flat = _md_escape_prose(" ".join(text.split()))
    return [f"> {flat}"] if flat else [">"]


def _plain_wrap(text: str) -> list[str]:
    """Plain prose as one continuous line — no mid-sentence hard wraps."""
    flat = _md_escape_prose(" ".join(text.split()))
    return [flat] if flat else [""]


def _render_context_chunk(block_type: str, body: str) -> list[str]:
    """Render one Ahmes neighbor: headings as headings, else plain prose."""
    btype = (block_type or "text").lower()
    flat = " ".join(body.split())
    if not flat:
        return []
    if btype == "heading" or (
        flat.startswith("[") and flat.endswith("]") and btype in {"figure", "image"}
    ):
        # Source section title, or ornamental figure cue
        if btype in {"figure", "image"}:
            return [f"*\\[{btype}\\]*", ""]
        return [f"##### {_md_escape_prose(flat)}", ""]
    # Numbered exercise / body — plain paragraph
    out = _plain_wrap(flat)
    out.append("")
    return out


def _surrounding_context_lines(context_blocks: tuple) -> list[str]:
    """Before / Exact excerpt / After — headings, not nested blockquotes."""
    before: list[tuple[str, str]] = []
    excerpt: tuple[str, str] | None = None
    after: list[tuple[str, str]] = []
    seen_target = False
    for is_target, btype, body in context_blocks:
        if is_target:
            excerpt = (btype, body)
            seen_target = True
        elif not seen_target:
            before.append((btype, body))
        else:
            after.append((btype, body))

    lines = [
        "### Surrounding context",
        "",
        "_Ahmes neighbors. Structure only — blockquote is reserved for the Quotation above._",
        "",
    ]
    lines += ["#### Before", ""]
    if before:
        for btype, body in before:
            lines += _render_context_chunk(btype, body)
    else:
        lines += ["_(none)_", ""]

    lines += ["#### Exact excerpt", ""]
    if excerpt:
        lines += _render_context_chunk(excerpt[0], excerpt[1])
    else:
        lines += ["_(same as Quotation)_", ""]

    lines += ["#### After", ""]
    if after:
        for btype, body in after:
            lines += _render_context_chunk(btype, body)
    else:
        lines += ["_(none)_", ""]
    return lines


def _anchor_id(exercise_id: str) -> str:
    digest = exercise_id.removeprefix("urn:in-practice:exercise:")
    return f"ex-{digest[:12]}"


def _entry_lines(
    *,
    v,
    raw: dict | None,
    ctx,
    reuse: str,
    out_dir: Path,
    write_review_stub: bool = False,
) -> list[str]:
    name = (raw or {}).get("name") or v.exercise_id
    status = (raw or {}).get("status") or "?"
    aid = _anchor_id(v.exercise_id)
    name_md = _md_escape_prose(str(name))

    if write_review_stub:
        ensure_stub(out_dir, v.exercise_id)

    review = load_review_notes(out_dir, v.exercise_id)
    stub_rel = notes_path_for(out_dir, v.exercise_id).name

    if review.catalogue_override:
        name_md = _md_escape_prose(review.catalogue_override)
        name_note = f" _(model catalogue was: {_md_escape_prose(str(name))})_"
    else:
        name_note = ""

    # Thematic: prefer record-scheme concepts; show keywords separately if soft
    scheme_concepts = [
        c for c in ctx.concepts if c.source in {"record", "ahmes_anchor"}
    ]
    soft_keywords = [c.pref_label for c in ctx.concepts if c.source == "ahmes_keyword"]
    if not soft_keywords and ctx.keywords:
        soft_keywords = list(ctx.keywords)

    lines = [
        f"## {ctx.chicago_heading}",
        "",
        f'<a id="{aid}"></a>',
        "",
        f"**Catalogue name:** {name_md}{name_note}  ",
        f"**Reuse as:** `{reuse}` · model kind `{v.kind}` · shortlist={v.is_classroom_shortlist()}  ",
        f"**id:** `{v.exercise_id}` · catalogue `{status}`  ",
        f"**flags:** steps/inputs/ending={v.has_steps}/{v.has_inputs}/{v.has_ending} · "
        f"lab_ok={v.duration_feasible_lab} · without_book={v.student_can_do_without_book} · "
        f"must_adapt={v.professor_must_adapt}  ",
        f"**biblio_safe:** {ctx.bibliography_safe}"
        + (f" · {ctx.page_label}" if ctx.page_label else ""),
        "",
    ]

    if review.lab_quote_from or review.quotation_role == "worked_example":
        see = review.lab_quote_from or ""
        see_aid = _anchor_id(see) if see else ""
        lab_label = review.catalogue_override or "Lab procedure (see Before)"
        lines += [
            f"> **Human correction:** Model Quotation was a *worked example*, not the Lab. "
            f"**Lab:** {lab_label}"
            + (f" · sibling [#{see_aid}](#{see_aid})" if see_aid else "")
            + ". Original anecdote kept below as worked example.",
            "",
        ]

    # --- Classification (DH) ---
    lines += [
        "### Classification (DH / Ahmes)",
        "",
    ]
    if ctx.cidoc_type:
        short_crm = ctx.cidoc_type.rsplit("/", 1)[-1]
        lines.append(f"- **CIDOC-CRM:** `{short_crm}` · `{ctx.cidoc_type}`")
    if scheme_concepts:
        labels = ", ".join(f"`{c.pref_label}`" for c in scheme_concepts[:12])
        lines.append(f"- **Thematic concepts:** {labels}")
        # URIs for first few (compact)
        uris = [c for c in scheme_concepts if c.uri][:6]
        if uris:
            lines.append(
                "- **Concept URIs:** "
                + "; ".join(f"`{c.uri}`" for c in uris)
            )
    if soft_keywords:
        lines.append(
            "- **Ahmes keywords:** "
            + ", ".join(f"`{k}`" for k in soft_keywords[:12])
        )
    if ctx.entities:
        lines.append(
            "- **Entities (node):** "
            + "; ".join(f"`{e}`" for e in ctx.entities[:8])
        )
    if not (ctx.cidoc_type or scheme_concepts or soft_keywords or ctx.entities):
        lines.append("- _(no thematic metadata on this node yet)_")
    lines.append("")

    # --- Source PDF ---
    lines += ["### Source PDF", ""]
    if ctx.pdf_uri:
        label = ctx.source_file or "Open PDF"
        page_bit = f" · {ctx.page_label}" if ctx.page_label else ""
        lines.append(f"- [{label}{page_bit}]({ctx.pdf_uri})")
        if ctx.pdf_path:
            lines.append(f"- Path: `{ctx.pdf_path}`")
        lines.append(
            "- _Tip: `file://…#page=N` opens in browsers / Preview that honour PDF page fragments._"
        )
    else:
        lines.append("- _(PDF path unresolved)_")
    lines.append("")

    # --- Quotation (only blockquote in the entry) ---
    lab_quote_text: str | None = None
    if review.lab_quote_from:
        dig = review.lab_quote_from.removeprefix("urn:in-practice:exercise:")
        for cand in (
            out_dir.parent / "records" / f"{dig}.json",
            ROOT / "runtime" / "records" / f"{dig}.json",
        ):
            if cand.is_file():
                try:
                    sib = json.loads(cand.read_text(encoding="utf-8"))
                    lab_quote_text = (
                        str((sib.get("quote") or {}).get("quote") or "") or None
                    )
                except Exception:
                    lab_quote_text = None
                break

    if lab_quote_text and review.quotation_role == "worked_example":
        lines += ["### Quotation (Lab procedure)", ""]
        lines += _blockquote(lab_quote_text)
        lines.append("")
        lines += [
            "### Worked example (keep)",
            "",
            "_Illustration of a finished interpretation — not the Lab steps._",
            "",
        ]
        lines += _blockquote(ctx.quote_verbatim)
        lines.append("")
    elif review.quotation_role == "worked_example":
        lines += [
            "### Worked example (keep — not the Lab procedure)",
            "",
            "_Lab procedure is in **Before** (and/or `lab_quote_from` sibling)._",
            "",
        ]
        lines += _blockquote(ctx.quote_verbatim)
        lines.append("")
    else:
        lines += ["### Quotation (verbatim span)", ""]
        lines += _blockquote(ctx.quote_verbatim)
        lines.append("")

    # --- Surrounding context: Before / Exact excerpt / After ---
    if ctx.context_blocks:
        lines += _surrounding_context_lines(ctx.context_blocks)

    # --- Model notes ---
    lines += [
        "### Model notes",
        "",
        v.reasoning.strip() or "_(none)_",
        "",
        f"**Reject / gate notes:** {v.reject_reason or '_(none)_'}",
        "",
    ]

    # --- Human review (edit the hitl fence in this MD) ---
    lines += hitl_fence_lines(review, exercise_id=v.exercise_id)
    mirror = (
        f"_Mirror file: `review-notes/{stub_rel}`"
        + (
            " (populated)_"
            if review.exists and not review.is_blank()
            else " (filled on harvest)_"
        )
    )
    lines.append(mirror)
    lines += ["", "---", ""]
    return lines


def _thematic_index(entries: list[tuple[str, str, tuple]]) -> list[str]:
    """entries: (anchor_id, catalogue_name, concepts)."""
    by_theme: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for aid, name, concepts in entries:
        labels = [c.pref_label for c in concepts if c.source in {"record", "ahmes_anchor"}]
        if not labels:
            labels = ["_unclassified_"]
        for lab in labels:
            by_theme[lab].append((aid, name))
    lines = [
        "## Thematic index",
        "",
        "Grouped by in-practice / Ahmes concept labels (CIDOC `E73` carriers). "
        "Click through to the match.",
        "",
    ]
    for theme in sorted(by_theme.keys(), key=lambda s: (s.startswith("_"), s.lower())):
        items = by_theme[theme]
        lines.append(f"### `{theme}` ({len(items)})")
        lines.append("")
        # de-dupe by anchor within theme
        seen = set()
        for aid, name in items:
            if aid in seen:
                continue
            seen.add(aid)
            safe_name = name.replace("[", "\\[").replace("]", "\\]")
            lines.append(f"- [{safe_name}](#{aid})")
        lines.append("")
    return lines


def _live_cite_stdout(extraction_db: str | None, node_id: str) -> str:
    """Refresh Ahmes cite when record cache is stale (e.g. post BIBLIO-GAP repair)."""
    if not extraction_db or not node_id:
        return ""
    db = Path(extraction_db)
    if not db.is_file():
        return ""
    ahmes = Path.home() / "src" / "ahmes" / ".venv" / "bin" / "ahmes"
    if not ahmes.is_file():
        ahmes_bin = "ahmes"
    else:
        ahmes_bin = str(ahmes)
    try:
        import subprocess

        proc = subprocess.run(
            [
                ahmes_bin,
                "query",
                str(db),
                "--cite",
                f"{db}:{node_id}",
                "--style",
                "chicago-author-date",
            ],
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )
        out = (proc.stdout or "").strip()
        return out
    except Exception:
        return ""


def _load_ctx(loader: AhmesContextLoader, raw: dict):
    prov = raw.get("provenance") or {}
    quote = raw.get("quote") or {}
    node_id = str(
        prov.get("target_node_id") or (quote.get("node_ids") or [""])[0]
    )
    cached = str(raw.get("citation_resolver_stdout") or "")
    cite = cached
    if (not cite) or cite.lstrip().startswith("[BIBLIO-GAP]"):
        live = _live_cite_stdout(prov.get("extraction_db"), node_id)
        if live and not live.lstrip().startswith("[BIBLIO-GAP]"):
            cite = live
    return loader.load(
        extraction_db=prov.get("extraction_db"),
        target_node_id=node_id,
        quote_text=str(quote.get("quote") or ""),
        citation_stdout=cite,
        coat=prov.get("coat"),
        quote_pages=quote.get("pages"),
        raw_record=raw,
    )


def export_scored(
    out_dir: Path,
    store: FileVerdictStore,
    records_dir: Path,
    *,
    write_review_stubs: bool = False,
) -> Path:
    loader = AhmesContextLoader()
    all_v = store.list_all()
    dest = out_dir / "EXERCISES-SCORED.md"

    prepared: list[tuple] = []  # (priority, kind, id, v, raw, ctx, reuse)
    index_entries: list[tuple[str, str, tuple]] = []

    def sort_key(v):
        raw = _load_raw_record(records_dir, v.exercise_id) or {}
        q = ((raw.get("quote") or {}).get("quote") or "")
        reuse = teaching_reuse_label(
            kind=v.kind, quote=q, shortlist=v.is_classroom_shortlist()
        )
        priority = (
            0
            if v.is_classroom_shortlist()
            else (1 if reuse == "critical_prompt_or_puzzle" else 2)
        )
        return (priority, v.kind, v.exercise_id)

    for v in sorted(all_v, key=sort_key):
        raw = _load_raw_record(records_dir, v.exercise_id)
        if not raw:
            prepared.append((v, None, None, "teaching_fragment"))
            continue
        ctx = _load_ctx(loader, raw)
        reuse = teaching_reuse_label(
            kind=v.kind,
            quote=ctx.quote_verbatim,
            shortlist=v.is_classroom_shortlist(),
        )
        prepared.append((v, raw, ctx, reuse))
        index_entries.append(
            (_anchor_id(v.exercise_id), raw.get("name") or v.exercise_id, ctx.concepts)
        )

    lines = [
        "# In-practice — scored teaching material (Ahmes context)",
        "",
        "Private. Not approved. Not the full catalogue — only scored verdicts in this store.",
        "",
        "- Each **heading** is the best available Chicago / filename-derived reference.",
        "- **Classification** pulls CIDOC-CRM `@type`, in-practice thematic concepts, "
        "Ahmes `metadata.keywords`, and node `anchor_semantic` / entities when present.",
        "- **Surrounding context** uses **Before / Exact excerpt / After** headings "
        "(source headings preserved; plain prose — not nested blockquotes).",
        "- **Source PDF** uses a local `file://` link with `#page=` when known.",
        "- **Human review:** edit the ```hitl fence **in this file** under each match "
        "(Before/After = context only). `mark_as: context_keep` / `theory_keep` for "
        "non-exercises worth keeping. Re-export harvests fences → `review-notes/`.",
        "",
        f"Total scored: {len(all_v)}  ",
        f"Shortlisted: {sum(1 for v in all_v if v.is_classroom_shortlist())}",
        "",
        "---",
        "",
    ]
    lines += _thematic_index(index_entries)
    lines += ["---", ""]

    for item in prepared:
        v, raw, ctx, reuse = item
        if ctx is None:
            lines += [
                f"## {v.exercise_id}",
                "",
                "_(record missing)_",
                "",
                "---",
                "",
            ]
            continue
        lines += _entry_lines(
            v=v,
            raw=raw,
            ctx=ctx,
            reuse=reuse,
            out_dir=out_dir,
            write_review_stub=write_review_stubs,
        )

    dest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return dest


def export_validated(
    out_dir: Path,
    store: FileVerdictStore,
    records_dir: Path,
    *,
    write_review_stubs: bool = False,
) -> Path:
    loader = AhmesContextLoader()
    all_v = store.list_all()
    shortlisted = [v for v in all_v if v.is_classroom_shortlist()]
    # HITL can promote non-shortlisted matches (insight puzzles, etc.) without
    # rewriting model shortlist flags (which require steps/inputs/ending).
    hitl_promote = {"lab_exercise", "critical_prompt", "context_keep", "theory_keep"}
    hitl_decision = {"keep", "adapt"}
    promoted: list = []
    for v in all_v:
        if v.is_classroom_shortlist():
            continue
        review = load_review_notes(out_dir, v.exercise_id)
        if (
            review.mark_as in hitl_promote
            and review.decision in hitl_decision
            and not review.is_blank()
        ):
            promoted.append(v)
    selected = {v.exercise_id: v for v in shortlisted}
    for v in promoted:
        selected[v.exercise_id] = v
    ordered = sorted(selected.values(), key=lambda x: x.exercise_id)

    dest = out_dir / "EXERCISES-VALIDATED.md"
    lines = [
        "# In-practice — model shortlist with Ahmes context (NOT approved)",
        "",
        "Advisory only. `procedure_approved` remains false until human audit.",
        "",
        f"Shortlisted: {len(shortlisted)} · HITL-promoted: {len(promoted)} · "
        f"entries in this file: {len(ordered)}",
        "",
    ]
    for v in ordered:
        raw = _load_raw_record(records_dir, v.exercise_id)
        if not raw:
            lines += [
                f"## {v.exercise_id}",
                "",
                "_(source record missing; cannot render evidence or approve reuse)_",
                "",
                "---",
                "",
            ]
            continue
        ctx = _load_ctx(loader, raw)
        reuse = teaching_reuse_label(
            kind=v.kind,
            quote=ctx.quote_verbatim,
            shortlist=v.is_classroom_shortlist(),
        )
        lines += _entry_lines(
            v=v,
            raw=raw,
            ctx=ctx,
            reuse=reuse,
            out_dir=out_dir,
            write_review_stub=write_review_stubs,
        )
    dest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return dest


def export_prompts(
    out_dir: Path,
    store: FileVerdictStore,
    records_dir: Path,
    *,
    write_review_stubs: bool = False,
) -> Path:
    loader = AhmesContextLoader()
    dest = out_dir / "EXERCISES-PROMPTS.md"
    kept = []
    for v in store.list_all():
        raw = _load_raw_record(records_dir, v.exercise_id)
        if not raw:
            continue
        q = ((raw.get("quote") or {}).get("quote") or "")
        reuse = teaching_reuse_label(
            kind=v.kind, quote=q, shortlist=v.is_classroom_shortlist()
        )
        if reuse in {
            "lab_exercise_candidate",
            "critical_prompt_or_puzzle",
        } or (v.kind == "classroom_exercise" and ("?" in q or "What if" in q)):
            kept.append((reuse, v, raw))

    lines = [
        "# In-practice — recyclable teaching prompts & puzzles",
        "",
        "Subset of scored items useful as Lab prompts, critical questions, mental puzzles,",
        "or visualization cues — even when not procedure-complete. Still private / not approved.",
        "",
        f"Entries: {len(kept)}",
        "",
    ]
    index_entries: list[tuple[str, str, tuple]] = []
    prepared = []
    for reuse, v, raw in sorted(kept, key=lambda t: (t[0], t[1].exercise_id)):
        ctx = _load_ctx(loader, raw)
        prepared.append((reuse, v, raw, ctx))
        index_entries.append(
            (_anchor_id(v.exercise_id), raw.get("name") or v.exercise_id, ctx.concepts)
        )
    lines += _thematic_index(index_entries)
    lines += ["---", ""]
    for reuse, v, raw, ctx in prepared:
        lines += _entry_lines(
            v=v,
            raw=raw,
            ctx=ctx,
            reuse=reuse,
            out_dir=out_dir,
            write_review_stub=write_review_stubs,
        )

    dest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return dest


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "runtime" / "teaching-suitability",
    )
    parser.add_argument(
        "--records",
        type=Path,
        default=ROOT / "runtime" / "records",
    )
    parser.add_argument(
        "--stubs",
        action="store_true",
        help="Create empty review-notes/*.yml stubs for every exported entry",
    )
    args = parser.parse_args(argv)
    # Harvest any in-document hitl fences before rebuild (do not lose comments)
    harvested = 0
    for name in (
        "EXERCISES-SCORED.md",
        "EXERCISES-VALIDATED.md",
        "EXERCISES-PROMPTS.md",
    ):
        harvested += harvest_hitl_from_markdown(args.out / name, args.out)
    store = FileVerdictStore(args.out / "verdicts")
    kwargs = {"write_review_stubs": args.stubs}
    vpath = export_validated(args.out, store, args.records, **kwargs)
    spath = export_scored(args.out, store, args.records, **kwargs)
    ppath = export_prompts(args.out, store, args.records, **kwargs)
    print(
        json.dumps(
            {
                "validated_md": str(vpath),
                "scored_md": str(spath),
                "prompts_md": str(ppath),
                "n_verdicts": len(store.list_all()),
                "review_stubs": args.stubs,
                "harvested_hitl": harvested,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
