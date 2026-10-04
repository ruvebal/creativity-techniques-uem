"""Filesystem verdict store under runtime/teaching-suitability/verdicts/."""
from __future__ import annotations

import json
import re
from dataclasses import asdict
from pathlib import Path

from ..domain.models import Kind, SuitabilityVerdict


class FileVerdictStore:
    def __init__(self, verdicts_dir: Path) -> None:
        self._dir = verdicts_dir
        self._dir.mkdir(parents=True, exist_ok=True)

    def _path(self, exercise_id: str) -> Path:
        if not isinstance(exercise_id, str) or not re.fullmatch(
            r"urn:in-practice:exercise:[A-Za-z0-9_-]+", exercise_id
        ):
            raise ValueError("Invalid exercise identifier")
        digest = exercise_id.removeprefix("urn:in-practice:exercise:")
        return self._dir / f"{digest}.json"

    def has(self, exercise_id: str) -> bool:
        return self.load(exercise_id) is not None

    def load(self, exercise_id: str) -> SuitabilityVerdict | None:
        path = self._path(exercise_id)
        if not path.exists():
            return None
        verdict = self._from_dict(json.loads(path.read_text(encoding="utf-8")))
        if verdict.exercise_id != exercise_id:
            raise ValueError("Cached exercise identifier mismatch")
        return verdict

    def save(self, verdict: SuitabilityVerdict) -> None:
        self._from_dict(asdict(verdict))
        if verdict.publication_allowed or verdict.procedure_approved:
            raise ValueError("Refusing to persist approving flags")
        path = self._path(verdict.exercise_id)
        tmp = path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(asdict(verdict), indent=2, ensure_ascii=False) + "\n")
        tmp.replace(path)

    def list_all(self) -> list[SuitabilityVerdict]:
        out: list[SuitabilityVerdict] = []
        for path in sorted(self._dir.glob("*.json")):
            if path.name.endswith(".tmp"):
                continue
            verdict = self.load("urn:in-practice:exercise:" + path.stem)
            if verdict is not None:
                out.append(verdict)
        return out

    def _from_dict(self, raw: dict) -> SuitabilityVerdict:
        from ..application.score_batch import validate_verdict_fields

        if not isinstance(raw, dict):
            raise ValueError("Cached verdict must be an object")
        self._path(raw.get("exercise_id"))
        validate_verdict_fields(raw, raw["exercise_id"])
        if any(raw.get(key) is not False for key in
               ("publication_allowed", "procedure_approved")):
            raise ValueError("Cached approval flags must be explicitly false")
        if raw.get("schema_version") != "teaching-suitability/v1":
            raise ValueError("Unsupported cached verdict schema")
        return SuitabilityVerdict(
            exercise_id=raw["exercise_id"],
            kind=raw["kind"],  # type: ignore[arg-type]
            has_steps=raw["has_steps"],
            has_inputs=raw["has_inputs"],
            has_ending=raw["has_ending"],
            duration_feasible_lab=raw["duration_feasible_lab"],
            student_can_do_without_book=raw["student_can_do_without_book"],
            professor_must_adapt=raw["professor_must_adapt"],
            shortlist_for_human=raw["shortlist_for_human"],
            reject_reason=raw["reject_reason"],
            reasoning=raw["reasoning"],
            model=raw["model"],
            prompt_sha256=raw["prompt_sha256"],
            scored_at=raw["scored_at"],
            elapsed_seconds=float(raw["elapsed_seconds"]),
            publication_allowed=False,
            procedure_approved=False,
            schema_version=raw.get("schema_version", "teaching-suitability/v1"),
        )
