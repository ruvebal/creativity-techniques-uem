"""Durable human review notes — edit in EXERCISES-*.md; re-export harvests them.

Primary UX: fill the ```hitl fence under each match in the Markdown you are reading.
On `export_reports`, those fences are harvested into `review-notes/<digest>.yml`
so comments survive rebuilds. YAML files remain a secondary edit surface.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


# mark_as — what this match is useful as (independent of model kind)
MARK_AS_HELP = (
    "pending | lab_exercise | critical_prompt | context_keep | theory_keep | discard"
)
# decision — workflow disposition
DECISION_HELP = "pending | keep | adapt | reject | shelve"


@dataclass(frozen=True)
class HumanReviewNotes:
    decision: str
    mark_as: str
    unit_fit: tuple[str, ...]
    adaptation: str
    notes: str
    reviewed_by: str | None
    reviewed_at: str | None
    path: Path | None
    exists: bool
    exercise_id: str | None = None
    # Optional display overrides (survive re-export)
    catalogue_override: str | None = None
    quotation_role: str = "quotation"  # quotation | worked_example
    lab_quote_from: str | None = None  # sibling exercise id → Quotation text

    @classmethod
    def empty(
        cls, path: Path | None = None, *, exercise_id: str | None = None
    ) -> HumanReviewNotes:
        return cls(
            decision="pending",
            mark_as="pending",
            unit_fit=(),
            adaptation="",
            notes="",
            reviewed_by=None,
            reviewed_at=None,
            path=path,
            exists=False,
            exercise_id=exercise_id,
            catalogue_override=None,
            quotation_role="quotation",
            lab_quote_from=None,
        )

    def is_blank(self) -> bool:
        return (
            self.decision in {"", "pending"}
            and self.mark_as in {"", "pending"}
            and not self.unit_fit
            and not self.adaptation
            and not self.notes
            and not self.reviewed_by
            and not self.catalogue_override
            and self.quotation_role in {"", "quotation"}
            and not self.lab_quote_from
        )


def review_notes_dir(out_dir: Path) -> Path:
    return out_dir / "review-notes"


def notes_path_for(out_dir: Path, exercise_id: str) -> Path:
    digest = exercise_id.removeprefix("urn:in-practice:exercise:")
    return review_notes_dir(out_dir) / f"{digest}.yml"


def _parse_scalar(raw: str) -> str | None:
    v = raw.strip()
    if not v or v == "null" or v == "~":
        return None
    if (v.startswith('"') and v.endswith('"')) or (
        v.startswith("'") and v.endswith("'")
    ):
        return v[1:-1]
    if " #" in v:
        v = v.split(" #", 1)[0].rstrip()
    return v


def _parse_list(raw: str) -> tuple[str, ...]:
    v = raw.strip()
    if not v or v == "[]":
        return ()
    if v.startswith("[") and v.endswith("]"):
        inner = v[1:-1].strip()
        if not inner:
            return ()
        parts = [p.strip().strip("'\"") for p in inner.split(",")]
        return tuple(p for p in parts if p)
    return (v.strip("'\""),)


def parse_review_yaml(text: str) -> dict[str, object]:
    """Minimal YAML subset parser for review stubs / hitl fences."""
    data: dict[str, object] = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][\w]*)\s*:\s*(.*)$", line)
        if not m:
            continue
        key, rest = m.group(1), m.group(2)
        if rest.strip() == "|":
            block: list[str] = []
            while i < len(lines):
                nxt = lines[i]
                if nxt.startswith("  ") or nxt.startswith("\t") or nxt.strip() == "":
                    block.append(
                        nxt[2:] if nxt.startswith("  ") else nxt.lstrip("\t")
                    )
                    i += 1
                    continue
                if re.match(r"^[A-Za-z_][\w]*\s*:", nxt):
                    break
                break
            while block and block[-1].strip() == "":
                block.pop()
            data[key] = "\n".join(block).strip()
            continue
        if key == "unit_fit":
            data[key] = list(_parse_list(rest))
        else:
            data[key] = _parse_scalar(rest)
    return data


def notes_from_data(
    data: dict[str, object],
    *,
    path: Path | None,
    exists: bool,
) -> HumanReviewNotes:
    unit = data.get("unit_fit") or []
    if isinstance(unit, str):
        unit = [unit]
    eid = data.get("id")
    cat_ov = data.get("catalogue_override")
    lab_from = data.get("lab_quote_from")
    q_role = str(data.get("quotation_role") or "quotation").strip().lower()
    if q_role not in {"quotation", "worked_example"}:
        q_role = "quotation"
    return HumanReviewNotes(
        decision=str(data.get("decision") or "pending").strip().lower(),
        mark_as=str(data.get("mark_as") or "pending").strip().lower(),
        unit_fit=tuple(str(u).strip() for u in unit if str(u).strip()),
        adaptation=str(data.get("adaptation") or "").strip(),
        notes=str(data.get("notes") or "").strip(),
        reviewed_by=(
            str(data["reviewed_by"]).strip() if data.get("reviewed_by") else None
        ),
        reviewed_at=(
            str(data["reviewed_at"]).strip() if data.get("reviewed_at") else None
        ),
        path=path,
        exists=exists,
        exercise_id=str(eid).strip() if eid else None,
        catalogue_override=str(cat_ov).strip() if cat_ov else None,
        quotation_role=q_role,
        lab_quote_from=str(lab_from).strip() if lab_from else None,
    )


def serialize_review_yaml(notes: HumanReviewNotes, *, exercise_id: str) -> str:
    def pipe(s: str) -> str:
        if not s:
            return "|\n  \n"
        body = "\n".join(f"  {ln}" if ln else "  " for ln in s.splitlines())
        return f"|\n{body}\n"

    units = "[" + ", ".join(notes.unit_fit) + "]"
    who = notes.reviewed_by if notes.reviewed_by else "null"
    when = notes.reviewed_at if notes.reviewed_at else "null"
    cat = notes.catalogue_override if notes.catalogue_override else "null"
    lab = notes.lab_quote_from if notes.lab_quote_from else "null"
    return (
        f"id: {exercise_id}\n"
        f"decision: {notes.decision}   # {DECISION_HELP}\n"
        f"mark_as: {notes.mark_as}   # {MARK_AS_HELP}\n"
        f"unit_fit: {units}\n"
        f"catalogue_override: {cat}   # optional display name when model mislabelled\n"
        f"quotation_role: {notes.quotation_role}   # quotation | worked_example\n"
        f"lab_quote_from: {lab}   # optional sibling urn → Lab Quotation text\n"
        f"adaptation: {pipe(notes.adaptation)}"
        f"notes: {pipe(notes.notes)}"
        f"reviewed_by: {who}\n"
        f"reviewed_at: {when}\n"
    )


def load_review_notes(out_dir: Path, exercise_id: str) -> HumanReviewNotes:
    path = notes_path_for(out_dir, exercise_id)
    if path.name.startswith("_") or "EXAMPLE" in path.name.upper():
        return HumanReviewNotes.empty(path, exercise_id=exercise_id)
    if not path.is_file():
        return HumanReviewNotes.empty(path, exercise_id=exercise_id)
    data = parse_review_yaml(path.read_text(encoding="utf-8"))
    if "id" not in data:
        data["id"] = exercise_id
    return notes_from_data(data, path=path, exists=True)


def save_review_notes(out_dir: Path, exercise_id: str, notes: HumanReviewNotes) -> Path:
    d = review_notes_dir(out_dir)
    d.mkdir(parents=True, exist_ok=True)
    path = notes_path_for(out_dir, exercise_id)
    path.write_text(
        serialize_review_yaml(notes, exercise_id=exercise_id), encoding="utf-8"
    )
    return path


def ensure_stub(out_dir: Path, exercise_id: str, *, force: bool = False) -> Path:
    path = notes_path_for(out_dir, exercise_id)
    if force or not path.exists():
        empty = HumanReviewNotes.empty(path, exercise_id=exercise_id)
        return save_review_notes(out_dir, exercise_id, empty)
    return path


_HITL_FENCE_RE = re.compile(
    r"```hitl\s*\n(.*?)```",
    re.DOTALL | re.IGNORECASE,
)


def harvest_hitl_from_markdown(md_path: Path, out_dir: Path) -> int:
    """Pull ```hitl fences from a scored MD into review-notes/*.yml.

    Returns number of non-blank reviews written. Blank pending fences are skipped
    so they do not clobber richer YAML already on disk. Optional display fields
    (`catalogue_override`, `quotation_role`, `lab_quote_from`) are preserved from
    existing YAML when the fence omits them (older stubs).
    """
    if not md_path.is_file():
        return 0
    text = md_path.read_text(encoding="utf-8")
    written = 0
    for m in _HITL_FENCE_RE.finditer(text):
        data = parse_review_yaml(m.group(1))
        eid = data.get("id")
        if not eid or not str(eid).startswith("urn:in-practice:exercise:"):
            continue
        eid_s = str(eid).strip()
        existing = load_review_notes(out_dir, eid_s)
        notes = notes_from_data(data, path=notes_path_for(out_dir, eid_s), exists=True)
        if notes.is_blank():
            continue
        if existing.exists and not existing.is_blank():
            notes = HumanReviewNotes(
                decision=notes.decision,
                mark_as=notes.mark_as,
                unit_fit=notes.unit_fit or existing.unit_fit,
                adaptation=notes.adaptation or existing.adaptation,
                notes=notes.notes or existing.notes,
                reviewed_by=notes.reviewed_by or existing.reviewed_by,
                reviewed_at=notes.reviewed_at or existing.reviewed_at,
                path=notes.path,
                exists=True,
                exercise_id=eid_s,
                catalogue_override=(
                    notes.catalogue_override
                    if "catalogue_override" in data
                    else existing.catalogue_override
                ),
                quotation_role=(
                    notes.quotation_role
                    if "quotation_role" in data
                    else existing.quotation_role
                ),
                lab_quote_from=(
                    notes.lab_quote_from
                    if "lab_quote_from" in data
                    else existing.lab_quote_from
                ),
            )
        save_review_notes(out_dir, eid_s, notes)
        written += 1
    return written


def hitl_fence_lines(notes: HumanReviewNotes, *, exercise_id: str) -> list[str]:
    """Editable block embedded in EXERCISES-*.md — edit here, then re-export."""
    body = serialize_review_yaml(notes, exercise_id=exercise_id).rstrip("\n")
    return [
        "### Human review notes",
        "",
        "_Edit the `hitl` fence below **in this document**. "
        "Before / Exact excerpt / After is context only — your mark applies to the "
        "**Quotation** (this whole match). "
        "`mark_as: context_keep` / `theory_keep` = useful later even if not a Lab exercise. "
        "Re-export harvests this fence into `review-notes/`._",
        "",
        "```hitl",
        body,
        "```",
        "",
    ]
