"""Load slim snippets from private per-record JSON (not the 5GB aggregate)."""
from __future__ import annotations

import json
from collections.abc import Iterator
from pathlib import Path

from ..domain.models import ExerciseSnippet


class RecordCandidateRepository:
    def __init__(self, records_dir: Path) -> None:
        self._dir = records_dir

    def list_snippets(
        self,
        *,
        witness_substrings: tuple[str, ...],
        limit: int,
        seed_ids: tuple[str, ...] = (),
    ) -> list[ExerciseSnippet]:
        return list(
            self.iter_snippets(
                witness_substrings=witness_substrings,
                limit=limit,
                seed_ids=seed_ids,
            )
        )

    def iter_snippets(
        self,
        *,
        witness_substrings: tuple[str, ...],
        limit: int,
        seed_ids: tuple[str, ...] = (),
    ) -> Iterator[ExerciseSnippet]:
        if limit < 0:
            raise ValueError("limit must be ≥ 0 (0 = unlimited)")
        unlimited = limit == 0
        seen: set[str] = set()
        yielded = 0

        for seed in seed_ids:
            if not unlimited and yielded >= limit:
                return
            snippet = self._load_seed(seed)
            if snippet.id in seen:
                continue
            seen.add(snippet.id)
            yield snippet
            yielded += 1

        for path in sorted(self._dir.glob("*.json")):
            if not unlimited and yielded >= limit:
                return
            digest = path.stem
            if any(digest in sid for sid in seen):
                continue
            if witness_substrings:
                head = path.read_text(encoding="utf-8", errors="replace")[:4096]
                if not any(s in head for s in witness_substrings):
                    continue
            try:
                snippet = self._load(path)
            except (json.JSONDecodeError, KeyError, TypeError, ValueError):
                continue
            if snippet.id in seen:
                continue
            if witness_substrings and not any(s in snippet.witness for s in witness_substrings):
                continue
            seen.add(snippet.id)
            yield snippet
            yielded += 1

    def _load_seed(self, seed: str) -> ExerciseSnippet:
        digest = seed.removeprefix("urn:in-practice:exercise:")
        path = self._dir / f"{digest}.json"
        if not path.exists():
            raise FileNotFoundError(f"Seed record not found: {seed}")
        return self._load(path)

    def _load(self, path: Path) -> ExerciseSnippet:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if raw.get("publication_allowed") is not False:
            raise ValueError("Unsafe publication flag")
        quote = raw.get("quote") or {}
        proposals = raw.get("proposals") or []
        p0 = proposals[0] if proposals and isinstance(proposals[0], dict) else {}
        tags = p0.get("tags") or []
        if not isinstance(tags, list):
            tags = []
        prov = raw.get("provenance") or {}
        return ExerciseSnippet(
            id=str(raw["id"]),
            name=str(raw.get("name") or ""),
            status=str(raw.get("status") or ""),
            witness=str(prov.get("coat") or ""),
            source_sha256=str(raw.get("source_sha256") or ""),
            quote_ok=bool(quote.get("ok")),
            quote_text=str(quote.get("quote") or ""),
            citation_stdout=str(raw.get("citation_resolver_stdout") or ""),
            proposal_kind=(str(p0["kind"]) if p0.get("kind") else None),
            proposal_reason=(str(p0["reason"]) if p0.get("reason") else None),
            tags=tuple(str(t) for t in tags),
        )
