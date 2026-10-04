"""Application use case — score teaching suitability (advisory only)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from ..domain.models import ScoreBatchRequest, ScoreBatchResult, SuitabilityVerdict
from ..domain.ports import CandidateRepository, SuitabilityJudge, VerdictStore

KINDS = {
    "classroom_exercise",
    "technique_description",
    "theory",
    "protocol_transcript",
    "incomplete",
    "other",
}


def validate_verdict_fields(raw: dict, exercise_id: str) -> None:
    """Fail closed on schema — used by infra after model parse."""
    if not isinstance(raw, dict):
        raise ValueError("Verdict must be an object")
    kind = raw.get("kind")
    if kind not in KINDS:
        raise ValueError(f"Invalid kind: {kind!r}")
    for key in (
        "has_steps",
        "has_inputs",
        "has_ending",
        "duration_feasible_lab",
        "student_can_do_without_book",
        "professor_must_adapt",
        "shortlist_for_human",
    ):
        if type(raw.get(key)) is not bool:
            raise ValueError(f"{key} must be bool")
    if not isinstance(raw.get("reject_reason"), str):
        raise ValueError("reject_reason must be string")
    if not isinstance(raw.get("reasoning"), str) or len(raw["reasoning"]) > 800:
        raise ValueError("reasoning must be a string ≤ 800 chars")
    if raw["shortlist_for_human"] and kind != "classroom_exercise":
        raise ValueError("shortlist_for_human only allowed when kind=classroom_exercise")
    if raw["shortlist_for_human"] and not (
        raw["has_steps"] and raw["has_inputs"] and raw["has_ending"] and raw["duration_feasible_lab"]
    ):
        raise ValueError("shortlist requires steps, inputs, ending, and lab-feasible duration")


class ScoreTeachingSuitability:
    def __init__(
        self,
        candidates: CandidateRepository,
        judge: SuitabilityJudge,
        store: VerdictStore,
        *,
        out_dir: Path,
    ) -> None:
        self._candidates = candidates
        self._judge = judge
        self._store = store
        self._out = out_dir

    def run(self, request: ScoreBatchRequest) -> ScoreBatchResult:
        self._out.mkdir(parents=True, exist_ok=True)
        process_path = self._out / "process.json"
        iter_fn = getattr(self._candidates, "iter_snippets", None)
        if callable(iter_fn):
            stream = iter_fn(
                witness_substrings=request.witness_substrings,
                limit=request.limit,
                seed_ids=request.seed_ids,
            )
        else:
            stream = self._candidates.list_snippets(
                witness_substrings=request.witness_substrings,
                limit=request.limit,
                seed_ids=request.seed_ids,
            )
        receipt: dict = {
            "schema": "teaching-suitability-run/v1",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "publication_allowed": False,
            "procedure_approved": False,
            "model": request.model,
            "witness_substrings": list(request.witness_substrings),
            "limit": request.limit,
            "seed_ids": list(request.seed_ids),
            "mode": "all" if request.limit == 0 and not request.witness_substrings else "bounded",
            "progress": {"seen": 0, "scored": 0, "skipped_cached": 0, "errors": 0},
            "completed_tail": [],
            "errors": [],
            "stage": "running",
        }
        self._write_process(process_path, receipt)

        scored = skipped = 0
        errors: list[str] = []
        seen = 0
        for snippet in stream:
            seen += 1
            try:
                if request.resume and self._store.has(snippet.id):
                    skipped += 1
                    entry = {"id": snippet.id, "cached": True, "name": snippet.name}
                else:
                    verdict = self._judge.judge(snippet)
                    if verdict.exercise_id != snippet.id:
                        raise ValueError("Judge returned mismatched exercise_id")
                    if verdict.procedure_approved or verdict.publication_allowed:
                        raise ValueError(
                            "Judge must never set procedure_approved or publication_allowed"
                        )
                    self._store.save(verdict)
                    scored += 1
                    entry = {
                        "id": snippet.id,
                        "cached": False,
                        "name": snippet.name,
                        "kind": verdict.kind,
                        "shortlist_for_human": verdict.shortlist_for_human,
                        "prompt_sha256": verdict.prompt_sha256,
                        "elapsed_seconds": verdict.elapsed_seconds,
                    }
                receipt["completed_tail"] = (receipt.get("completed_tail") or [])[-40:] + [entry]
                receipt["progress"] = {
                    "seen": seen,
                    "scored": scored,
                    "skipped_cached": skipped,
                    "errors": len(errors),
                }
            except Exception as exc:  # noqa: BLE001 — batch continues; errors audited
                msg = f"{snippet.id}: {exc}"
                errors.append(msg)
                receipt["errors"].append(msg)
                receipt["progress"] = {
                    "seen": seen,
                    "scored": scored,
                    "skipped_cached": skipped,
                    "errors": len(errors),
                }
            if seen % 5 == 0 or scored <= 3:
                self._write_process(process_path, receipt)

        self._write_process(process_path, receipt)

        all_verdicts = self._store.list_all()
        shortlisted = [v for v in all_verdicts if v.is_classroom_shortlist()]
        rejected = [v for v in all_verdicts if not v.is_classroom_shortlist()]
        # Rich Markdown: Chicago heading + Ahmes neighbors + prompts digest
        from teaching_suitability.export_reports import (
            export_prompts,
            export_scored,
            export_validated,
        )

        records_dir = self._out.parent / "records"
        # Preserve in-document HITL edits before rebuild
        from teaching_suitability.infrastructure.review_notes import (
            harvest_hitl_from_markdown,
        )

        try:
            for name in (
                "EXERCISES-SCORED.md",
                "EXERCISES-VALIDATED.md",
                "EXERCISES-PROMPTS.md",
            ):
                harvest_hitl_from_markdown(self._out / name, self._out)
            validated_md = export_validated(self._out, self._store, records_dir)
            scored_md = export_scored(self._out, self._store, records_dir)
            prompts_md = export_prompts(self._out, self._store, records_dir)
        except Exception as exc:
            receipt.update(
                stage="export-failed",
                finished_at=datetime.now(timezone.utc).isoformat(),
                export_error={"type": type(exc).__name__, "message": str(exc)},
            )
            self._write_process(process_path, receipt)
            raise
        summary = {
            "scored_this_run": scored,
            "skipped_cached": skipped,
            "store_total": len(all_verdicts),
            "shortlisted": len(shortlisted),
            "not_shortlisted": len(rejected),
            "errors": errors,
            "scored_md": str(scored_md),
            "prompts_md": str(prompts_md),
        }
        receipt.update(
            stage="awaiting-human-audit",
            finished_at=datetime.now(timezone.utc).isoformat(),
            summary=summary,
            validated_md=str(validated_md),
            scored_md=str(scored_md),
            prompts_md=str(prompts_md),
        )
        self._write_process(process_path, receipt)
        (self._out / "SUMMARY.json").write_text(
            json.dumps(summary, indent=2, ensure_ascii=False) + "\n"
        )
        return ScoreBatchResult(
            scored=scored,
            skipped_cached=skipped,
            shortlisted=len(shortlisted),
            rejected=len(rejected),
            errors=tuple(errors),
            receipt_path=str(process_path),
            validated_md_path=str(validated_md),
        )

    def _write_process(self, path: Path, receipt: dict) -> None:
        tmp = path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n")
        tmp.replace(path)
