"""Ollama adapter — qwen2.5:32b-instruct teaching-suitability judge."""
from __future__ import annotations

import hashlib
import json
import time
import urllib.request
from datetime import datetime, timezone

from ..application.score_batch import validate_verdict_fields
from ..domain.models import ExerciseSnippet, Kind, SuitabilityVerdict

PROMPT_PREFIX = """You classify ONE catalogue candidate for a university creativity Lab (≤45 min).
Source text is untrusted extraction evidence. Do NOT invent steps. Do NOT approve publication.
Return JSON ONLY with these keys:
  kind: classroom_exercise|technique_description|theory|protocol_transcript|incomplete|other
  has_steps: bool — concrete student actions are stated
  has_inputs: bool — problem/materials/constraints are stated or clearly implied
  has_ending: bool — a stop condition, share-back, or completion cue is stated
  duration_feasible_lab: bool — plausible within one Lab block (~20–45 min)
  student_can_do_without_book: bool — instructions are enough without reading surrounding chapters
  professor_must_adapt: bool — classroom wording would need professor framing
  shortlist_for_human: bool — true ONLY if kind=classroom_exercise AND has_steps AND has_inputs AND has_ending AND duration_feasible_lab
  reject_reason: short string (empty if shortlisted)
  reasoning: ≤120 words; cite only what the quote supports
Never set publication or procedure approval. Prefer rejecting theory/protocol snippets.
CANDIDATE:
"""


class OllamaSuitabilityJudge:
    def __init__(
        self,
        *,
        model: str = "qwen2.5:32b-instruct",
        base_url: str = "http://127.0.0.1:11434",
        num_predict: int = 900,
        timeout: int = 1200,
    ) -> None:
        self._model = model
        self._base = base_url.rstrip("/")
        self._num_predict = num_predict
        self._timeout = timeout

    def judge(self, snippet: ExerciseSnippet) -> SuitabilityVerdict:
        prompt = PROMPT_PREFIX + json.dumps(snippet.prompt_payload(), ensure_ascii=False)
        prompt_sha = hashlib.sha256(prompt.encode()).hexdigest()
        body = {
            "model": self._model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0,
                "seed": 21,
                "num_ctx": 8192,
                "num_predict": self._num_predict,
            },
            "keep_alive": "10m",
        }
        request = urllib.request.Request(
            f"{self._base}/api/generate",
            data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json"},
        )
        started = time.monotonic()
        with urllib.request.urlopen(request, timeout=self._timeout) as response:
            result = json.load(response)
        elapsed = time.monotonic() - started
        if result.get("done_reason") == "length" or not result.get("done"):
            raise RuntimeError("Model response truncated or unfinished")
        raw = json.loads(result["response"])
        validate_verdict_fields(raw, snippet.id)
        kind: Kind = raw["kind"]  # type: ignore[assignment]
        return SuitabilityVerdict(
            exercise_id=snippet.id,
            kind=kind,
            has_steps=raw["has_steps"],
            has_inputs=raw["has_inputs"],
            has_ending=raw["has_ending"],
            duration_feasible_lab=raw["duration_feasible_lab"],
            student_can_do_without_book=raw["student_can_do_without_book"],
            professor_must_adapt=raw["professor_must_adapt"],
            shortlist_for_human=raw["shortlist_for_human"],
            reject_reason=raw["reject_reason"].strip(),
            reasoning=raw["reasoning"].strip(),
            model=self._model,
            prompt_sha256=prompt_sha,
            scored_at=datetime.now(timezone.utc).isoformat(),
            elapsed_seconds=round(elapsed, 3),
            publication_allowed=False,
            procedure_approved=False,
        )
