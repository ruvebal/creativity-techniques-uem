"""Ports — protocols at the domain boundary."""
from __future__ import annotations

from typing import Protocol

from .models import ExerciseSnippet, SuitabilityVerdict


class CandidateRepository(Protocol):
    def list_snippets(
        self,
        *,
        witness_substrings: tuple[str, ...],
        limit: int,
        seed_ids: tuple[str, ...] = (),
    ) -> list[ExerciseSnippet]:
        ...

    def iter_snippets(
        self,
        *,
        witness_substrings: tuple[str, ...],
        limit: int,
        seed_ids: tuple[str, ...] = (),
    ):
        """Yield snippets one-by-one (full-catalogue friendly)."""
        ...


class SuitabilityJudge(Protocol):
    def judge(self, snippet: ExerciseSnippet) -> SuitabilityVerdict:
        ...


class VerdictStore(Protocol):
    def has(self, exercise_id: str) -> bool:
        ...

    def load(self, exercise_id: str) -> SuitabilityVerdict | None:
        ...

    def save(self, verdict: SuitabilityVerdict) -> None:
        ...

    def list_all(self) -> list[SuitabilityVerdict]:
        ...
