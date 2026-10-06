#!/usr/bin/env python3
"""EX7 step 1: stream runtime/exercises-active.json (READ ONLY, ~5 GB) and
write a compact index (id, name, status, kind, tags, coat, reason) as JSONL.

Stdlib only: skips to the "exercises" array and raw_decodes one object at a
time, so memory stays bounded. Never writes under runtime/.

Usage: extract_records.py <exercises-active.json> <out.jsonl>
"""
import json, sys

def stream_exercises(path, chunk=1 << 22):
    dec = json.JSONDecoder()
    with open(path, "r", encoding="utf-8") as fh:
        buf = ""
        # find the start of the exercises array
        while True:
            data = fh.read(chunk)
            if not data:
                raise SystemExit("no exercises array")
            buf += data
            i = buf.find('"exercises"')
            if i >= 0:
                j = buf.find("[", i)
                if j >= 0:
                    buf = buf[j + 1:]
                    break
        eof = False
        while True:
            buf = buf.lstrip().lstrip(",").lstrip()
            if buf.startswith("]"):
                return
            try:
                obj, end = dec.raw_decode(buf)
            except json.JSONDecodeError:
                if eof:
                    raise
                data = fh.read(chunk)
                if not data:
                    eof = True
                buf += data
                continue
            yield obj
            buf = buf[end:]

def main(src, out):
    n = 0
    with open(out, "w", encoding="utf-8") as fo:
        for ex in stream_exercises(src):
            props = ex.get("proposals") or []
            tags, kinds, reasons = [], [], []
            for p in props:
                for t in p.get("tags") or []:
                    if t not in tags:
                        tags.append(t)
                if p.get("kind"):
                    kinds.append(p["kind"])
                if p.get("reason"):
                    reasons.append(p["reason"])
            prov = ex.get("provenance") or {}
            fo.write(json.dumps({
                "id": ex.get("id"), "name": ex.get("name"),
                "status": ex.get("status"), "kinds": kinds, "tags": tags,
                "coat": prov.get("coat"), "reason": reasons[0] if reasons else "",
            }, ensure_ascii=False) + "\n")
            n += 1
    print(n, "records", file=sys.stderr)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
