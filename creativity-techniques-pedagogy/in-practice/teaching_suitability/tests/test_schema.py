"""Offline tests — schema + domain rules (no Ollama)."""
from __future__ import annotations

import sys
import json
import tempfile
import unittest
from unittest.mock import patch
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from teaching_suitability.application.score_batch import (  # noqa: E402
    ScoreTeachingSuitability,
    validate_verdict_fields,
)
from teaching_suitability.domain.models import (  # noqa: E402
    ExerciseSnippet,
    ScoreBatchRequest,
    SuitabilityVerdict,
)
from teaching_suitability.infrastructure.file_verdict_store import FileVerdictStore  # noqa: E402


class FakeJudge:
    def __init__(self, kind: str = "classroom_exercise", shortlist: bool = True) -> None:
        self.kind = kind
        self.shortlist = shortlist
        self.calls = 0

    def judge(self, snippet: ExerciseSnippet) -> SuitabilityVerdict:
        self.calls += 1
        return SuitabilityVerdict(
            exercise_id=snippet.id,
            kind=self.kind,  # type: ignore[arg-type]
            has_steps=True,
            has_inputs=True,
            has_ending=True,
            duration_feasible_lab=True,
            student_can_do_without_book=True,
            professor_must_adapt=True,
            shortlist_for_human=self.shortlist and self.kind == "classroom_exercise",
            reject_reason="" if self.shortlist else "demo reject",
            reasoning="fixture",
            model="fake",
            prompt_sha256="abc",
            scored_at="2026-09-28T00:00:00+00:00",
            elapsed_seconds=0.1,
        )


class FakeRepo:
    def __init__(self, snippets: list[ExerciseSnippet]) -> None:
        self._snippets = snippets

    def list_snippets(self, **kwargs):  # noqa: ANN003
        return self._snippets[: kwargs.get("limit", 10) or 10]

    def iter_snippets(self, **kwargs):  # noqa: ANN003
        yield from self.list_snippets(**kwargs)


class SchemaTests(unittest.TestCase):
    def test_shortlist_requires_classroom_kind(self) -> None:
        with self.assertRaises(ValueError):
            validate_verdict_fields(
                {
                    "kind": "theory",
                    "has_steps": True,
                    "has_inputs": True,
                    "has_ending": True,
                    "duration_feasible_lab": True,
                    "student_can_do_without_book": False,
                    "professor_must_adapt": True,
                    "shortlist_for_human": True,
                    "reject_reason": "",
                    "reasoning": "x",
                },
                "urn:in-practice:exercise:x",
            )

    def test_is_classroom_shortlist(self) -> None:
        v = SuitabilityVerdict(
            exercise_id="urn:in-practice:exercise:x",
            kind="classroom_exercise",
            has_steps=True,
            has_inputs=True,
            has_ending=True,
            duration_feasible_lab=True,
            student_can_do_without_book=True,
            professor_must_adapt=False,
            shortlist_for_human=True,
            reject_reason="",
            reasoning="ok",
            model="fake",
            prompt_sha256="a",
            scored_at="t",
            elapsed_seconds=1.0,
        )
        self.assertTrue(v.is_classroom_shortlist())
        self.assertFalse(asdict(v)["procedure_approved"])


class UseCaseTests(unittest.TestCase):
    def test_cache_rejects_invalid_flags_types_and_identity(self) -> None:
        raw = asdict(SuitabilityVerdict(
            exercise_id="urn:in-practice:exercise:abc", kind="classroom_exercise",
            has_steps=True, has_inputs=True, has_ending=True,
            duration_feasible_lab=True, student_can_do_without_book=True,
            professor_must_adapt=False, shortlist_for_human=True,
            reject_reason="", reasoning="fixture", model="fake",
            prompt_sha256="abc", scored_at="fixture", elapsed_seconds=0.1))
        with tempfile.TemporaryDirectory() as tmp:
            store = FileVerdictStore(Path(tmp))
            changes = [
                {"procedure_approved": True}, {"publication_allowed": "false"},
                {"has_steps": "true"}, {"schema_version": "unknown"},
                {"exercise_id": "urn:in-practice:exercise:other"},
            ]
            for change in changes:
                with self.subTest(change=change), patch.object(Path, "exists", return_value=True), \
                     patch.object(Path, "read_text", return_value=json.dumps(raw | change)):
                    with self.assertRaises(ValueError):
                        store.has(raw["exercise_id"])
            with patch.object(Path, "exists", return_value=True), \
                 patch.object(Path, "read_text", return_value="{"):
                with self.assertRaises(json.JSONDecodeError):
                    store.has(raw["exercise_id"])
            with self.assertRaises(ValueError):
                store.has("urn:in-practice:exercise:../outside")

    def test_export_failure_receipt(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            store = FileVerdictStore(out / "verdicts")
            uc = ScoreTeachingSuitability(FakeRepo([]), FakeJudge(), store, out_dir=out)
            request = ScoreBatchRequest(witness_substrings=(), limit=1, model="fake")
            with patch("teaching_suitability.export_reports.export_validated",
                       side_effect=TypeError("fixture export failure")):
                with self.assertRaisesRegex(TypeError, "fixture export failure"):
                    uc.run(request)
            receipt = json.loads((out / "process.json").read_text())
            self.assertEqual(receipt["stage"], "export-failed")
            self.assertEqual(receipt["export_error"]["type"], "TypeError")
            self.assertIn("fixture export failure", receipt["export_error"]["message"])
            self.assertFalse(receipt["procedure_approved"])
            self.assertFalse(receipt["publication_allowed"])
            self.assertIn("finished_at", receipt)
            self.assertFalse((out / "SUMMARY.json").exists())

    def test_resume_skips_cached(self) -> None:
        snippet = ExerciseSnippet(
            id="urn:in-practice:exercise:deadbeef",
            name="Demo",
            status="candidate",
            witness="lateral_thinking_demo",
            source_sha256="0" * 64,
            quote_ok=True,
            quote_text="Do steps 1 then 2 then share.",
            citation_stdout="(Demo 1970, 1)",
            proposal_kind="exercise",
            proposal_reason="demo",
            tags=("analogy",),
        )
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            store = FileVerdictStore(out / "verdicts")
            judge = FakeJudge()
            uc = ScoreTeachingSuitability(FakeRepo([snippet]), judge, store, out_dir=out)
            r1 = uc.run(
                ScoreBatchRequest(
                    witness_substrings=("lateral",),
                    limit=1,
                    model="fake",
                    resume=True,
                )
            )
            self.assertEqual(r1.scored, 1)
            r2 = uc.run(
                ScoreBatchRequest(
                    witness_substrings=("lateral",),
                    limit=1,
                    model="fake",
                    resume=True,
                )
            )
            self.assertEqual(r2.scored, 0)
            self.assertEqual(r2.skipped_cached, 1)
            self.assertEqual(judge.calls, 1)
            md = (out / "EXERCISES-VALIDATED.md").read_text()
            self.assertIn("NOT approved", md)
            self.assertIn(snippet.id, md)
            self.assertIn("source record missing", md)
            self.assertIn("cannot render evidence or approve reuse", md)
            self.assertNotIn(snippet.quote_text, md)


if __name__ == "__main__":
    unittest.main()
