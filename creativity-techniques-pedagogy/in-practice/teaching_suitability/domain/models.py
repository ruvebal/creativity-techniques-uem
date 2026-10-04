"""Domain entities — frozen, stdlib only."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

Kind = Literal[
    "classroom_exercise",
    "technique_description",
    "theory",
    "protocol_transcript",
    "incomplete",
    "other",
]


@dataclass(frozen=True)
class ExerciseSnippet:
    """Slim view of an active catalogue record for suitability scoring."""

    id: str
    name: str
    status: str
    witness: str
    source_sha256: str
    quote_ok: bool
    quote_text: str
    citation_stdout: str
    proposal_kind: str | None
    proposal_reason: str | None
    tags: tuple[str, ...] = ()

    def prompt_payload(self) -> dict:
        """Minimal facts for the judge — no vault dumps."""
        return {
            "id": self.id,
            "name": self.name,
            "catalogue_status": self.status,
            "source_witness": self.witness,
            "quote_ok": self.quote_ok,
            "quote_text": self.quote_text[:1800],
            "citation_stdout_head": self.citation_stdout.strip().split("\n", 1)[0][:240],
            "proposal_kind": self.proposal_kind,
            "proposal_reason": self.proposal_reason,
            "tags": list(self.tags),
        }


@dataclass(frozen=True)
class SuitabilityVerdict:
    """Advisory teaching-suitability judgement for one candidate."""

    exercise_id: str
    kind: Kind
    has_steps: bool
    has_inputs: bool
    has_ending: bool
    duration_feasible_lab: bool
    student_can_do_without_book: bool
    professor_must_adapt: bool
    shortlist_for_human: bool
    reject_reason: str
    reasoning: str
    model: str
    prompt_sha256: str
    scored_at: str
    elapsed_seconds: float
    publication_allowed: bool = False
    procedure_approved: bool = False
    schema_version: str = "teaching-suitability/v1"

    def is_classroom_shortlist(self) -> bool:
        return (
            self.kind == "classroom_exercise"
            and self.shortlist_for_human
            and self.has_steps
            and self.has_inputs
            and self.has_ending
            and self.duration_feasible_lab
            and not self.procedure_approved  # approval is human-only
        )


@dataclass(frozen=True)
class ScoreBatchRequest:
    witness_substrings: tuple[str, ...]
    limit: int  # 0 = no limit (full catalogue under filters)
    model: str
    resume: bool = True
    seed_ids: tuple[str, ...] = ()


@dataclass(frozen=True)
class ScoreBatchResult:
    scored: int
    skipped_cached: int
    shortlisted: int
    rejected: int
    errors: tuple[str, ...] = ()
    receipt_path: str = ""
    validated_md_path: str = ""
