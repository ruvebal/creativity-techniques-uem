"""CLI — wire hexagonal adapters and run suitability scoring."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from teaching_suitability.application.score_batch import ScoreTeachingSuitability
from teaching_suitability.domain.models import ScoreBatchRequest
from teaching_suitability.infrastructure.file_verdict_store import FileVerdictStore
from teaching_suitability.infrastructure.ollama_suitability_judge import OllamaSuitabilityJudge
from teaching_suitability.infrastructure.record_candidate_repo import RecordCandidateRepository

DEFAULT_SEEDS = (
    "urn:in-practice:exercise:110b4bef0fe99bdcceced6f7",
    "urn:in-practice:exercise:3e08ef870723bc01b7c7bb81",
    "urn:in-practice:exercise:0049830bfe4b42534c105edd",
    "urn:in-practice:exercise:9cabf14828b596f8ae016ac4",
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Advisory teaching-suitability scoring via local Qwen 32B (never approves)."
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Score the full active catalogue: no witness filter, no limit (resume skips cached).",
    )
    parser.add_argument(
        "--witness",
        default="lateral_thinking,designerly",
        help="Comma-separated coat substrings (ignored with --all). Empty string = no filter.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=36,
        help="Max candidates (ignored with --all). 0 = unlimited under --witness filter.",
    )
    parser.add_argument("--model", default="qwen2.5:32b-instruct")
    parser.add_argument("--no-resume", action="store_true")
    parser.add_argument(
        "--seed",
        action="append",
        default=None,
        help="Force-include exercise URN (repeatable). Default calibration seeds omitted with --all.",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "runtime" / "teaching-suitability",
    )
    args = parser.parse_args(argv)

    records_dir = ROOT / "runtime" / "records"
    if not records_dir.is_dir():
        print(json.dumps({"error": f"missing records dir: {records_dir}"}))
        return 2

    if args.all:
        witnesses: tuple[str, ...] = ()
        limit = 0
        seeds: tuple[str, ...] = tuple(args.seed) if args.seed else ()
    else:
        witnesses = tuple(s.strip() for s in args.witness.split(",") if s.strip())
        limit = args.limit
        seeds = tuple(args.seed) if args.seed else DEFAULT_SEEDS

    n_records = sum(1 for _ in records_dir.glob("*.json"))
    print(
        json.dumps(
            {
                "mode": "all" if args.all else "bounded",
                "records_on_disk": n_records,
                "limit": limit,
                "witness_substrings": list(witnesses),
                "resume": not args.no_resume,
                "model": args.model,
                "note": "Full catalogue ~hours; resume skips existing verdicts/",
            },
            indent=2,
        ),
        flush=True,
    )

    request = ScoreBatchRequest(
        witness_substrings=witnesses,
        limit=limit,
        model=args.model,
        resume=not args.no_resume,
        seed_ids=seeds,
    )

    use_case = ScoreTeachingSuitability(
        candidates=RecordCandidateRepository(records_dir),
        judge=OllamaSuitabilityJudge(model=args.model),
        store=FileVerdictStore(args.out / "verdicts"),
        out_dir=args.out,
    )
    result = use_case.run(request)
    print(
        json.dumps(
            {
                "scored": result.scored,
                "skipped_cached": result.skipped_cached,
                "shortlisted": result.shortlisted,
                "rejected": result.rejected,
                "errors": list(result.errors),
                "receipt": result.receipt_path,
                "validated_md": result.validated_md_path,
                "publication_allowed": False,
                "procedure_approved": False,
            },
            indent=2,
        )
    )
    return 1 if result.errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
