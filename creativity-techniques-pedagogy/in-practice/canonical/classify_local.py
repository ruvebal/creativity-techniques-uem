#!/usr/bin/env python3
"""EX7 step 3: local Qwen classification of AMBIGUOUS record names only.

Ambiguous = on-topic names that map_records.py left unmapped and that either
occur in >= 3 records or contain a technique hint word. Everything else stays
unmapped (no model call). Runs local Ollama only (LOCAL-EXECUTION.md rule 3):
plain HTTP /api/generate, stream false, temperature 0.1, plain delimited output
(no JSON mode). One model, small batches, sequential.

Before running: no in-practice worker alive (runtime/process.json pid + ps) and
no other heavy model loaded (`curl localhost:11434/api/ps`).

Writes canonical/model-decisions.json and appends canonical/model-calls.jsonl
(one line per call: batch, names, prompt/eval tokens, seconds).

Usage: classify_local.py <records.jsonl> [--batch 25] [--limit N]
"""
import json, re, sys, time, pathlib, collections, urllib.request
import yaml

HERE = pathlib.Path(__file__).resolve().parent
MODEL = "qwen2.5:32b-instruct"
URL = "http://localhost:11434/api/generate"
HINT = re.compile(r"hat|random|analog|metaphor|vote|voting|select|journal|prototyp|sketch|story|map|matrix|walk|writ|"
                  r"collage|combin|checklist|question|assumption|revers|brainstorm|evaluat|observ|empath|interview|"
                  r"reframe|reframing|alternativ|right answer|incubat|meditat|mindful|draw|play|improv|perspective|"
                  r"provok|judg|criteria|rank|decision|lotus|circle|word", re.I)


def short_coat(coat):
    return re.sub(r"_[0-9a-f]{8}$", "", coat or "")[:60]


def ambiguous(records_path):
    mapping = json.load(open(HERE / "mapping.json"))["mapping"]
    meta = {}
    for line in open(records_path, encoding="utf-8"):
        r = json.loads(line)
        if "unmapped" in mapping.get(r["id"], {}):
            meta.setdefault(r["name"], (short_coat(r["coat"]), (r["reason"] or "")[:110]))
    counts = collections.Counter(v["unmapped"] for v in mapping.values() if "unmapped" in v)
    names = sorted(n for n, k in counts.items() if k >= 3 or HINT.search(n))
    return [(n, *meta[n]) for n in names]


def prompt(cands, batch):
    lines = ["You classify creativity-exercise labels into a fixed catalogue.",
             "Catalogue (id: name):"]
    lines += [f"{t['id']}: {t['name']}" for t in cands]
    lines += ["", "For each numbered label below, answer with the ONE catalogue id it is an instance of,",
              "or NONE if it is not clearly the same technique (be strict; when unsure answer NONE).",
              "Answer format, one line per label, nothing else:", "<number>|<id or NONE>", "", "Labels:"]
    lines += [f"{i}|{n} (source: {c}; note: {r})" for i, (n, c, r) in enumerate(batch, 1)]
    return "\n".join(lines)


def call(text):
    body = json.dumps({"model": MODEL, "prompt": text, "stream": False,
                       "options": {"temperature": 0.1, "num_ctx": 8192}}).encode()
    req = urllib.request.Request(URL, data=body, headers={"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=900) as resp:
        out = json.load(resp)
    return out, time.time() - t0


def main():
    recs = sys.argv[1]
    bs = int(sys.argv[sys.argv.index("--batch") + 1]) if "--batch" in sys.argv else 25
    lim = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    cands = yaml.safe_load(open(HERE / "techniques.base.yml"))["techniques"]
    ids = {t["id"] for t in cands}
    items = ambiguous(recs)
    if lim:
        items = items[:lim]
    dec_path = HERE / "model-decisions.json"
    state = json.load(open(dec_path)) if dec_path.exists() else {"model": MODEL, "decisions": {}, "none": [], "invalid": []}
    done = set(state["decisions"]) | set(state["none"]) | {x["name"] for x in state["invalid"]}
    todo = [it for it in items if it[0] not in done]
    print(f"ambiguous names: {len(items)}; to classify: {len(todo)}", file=sys.stderr)
    log = open(HERE / "model-calls.jsonl", "a")
    for b in range(0, len(todo), bs):
        batch = todo[b:b + bs]
        out, secs = call(prompt(cands, batch))
        got = {}
        for line in out.get("response", "").splitlines():
            m = re.match(r"\s*(\d+)\s*\|\s*([A-Za-z0-9-]+)", line)
            if m:
                got[int(m.group(1))] = m.group(2).strip()
        for i, (n, _, _) in enumerate(batch, 1):
            v = got.get(i)
            if v in ids:
                state["decisions"][n] = v
            elif v and v.upper() == "NONE":
                state["none"].append(n)
            else:
                state["invalid"].append({"name": n, "answer": v})
        log.write(json.dumps({"ts": time.strftime("%Y-%m-%dT%H:%M:%S"), "model": MODEL, "batch_size": len(batch),
                              "prompt_tokens": out.get("prompt_eval_count"), "output_tokens": out.get("eval_count"),
                              "seconds": round(secs, 1), "parsed": len(got)}) + "\n")
        log.flush()
        json.dump(state, open(dec_path, "w"), indent=1, ensure_ascii=False)
        print(f"batch {b // bs + 1}: {len(got)}/{len(batch)} parsed, {secs:.0f}s", file=sys.stderr)


if __name__ == "__main__":
    main()
