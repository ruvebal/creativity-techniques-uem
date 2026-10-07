#!/usr/bin/env python3
"""EX7 step 2: map in-practice records onto canonical techniques (local, rule-based).

Input:  records.jsonl from extract_records.py (compact index of the READ-ONLY
        runtime/exercises-active.json) and, optionally, model-decisions.json
        written by classify_local.py for names the rules left ambiguous.
Output: canonical/mapping.json  (urn -> technique id, method, or drop reason)
        canonical/mapping-stats.json

Order per record: off-topic rules (dropped) -> name rules (method "rule") ->
model decision for the exact name (method "model") -> unmapped.
Names are model-proposed labels from the IP cascade, not author wording; a
coat guard removes records whose source book is known not to contain the
technique (checked against the book's chapter list).

Usage: map_records.py <records.jsonl> [--model canonical/model-decisions.json]
"""
import json, re, sys, collections, pathlib

HERE = pathlib.Path(__file__).resolve().parent

# ---------------------------------------------------------------- off-topic
# (reason, coat prefix or None, name regex or None). First match wins.
OFFTOPIC = [
    ("medicine/therapy", None, r"medic|diagnos|retinopathy|clinical|patient|therap|stroke surviv|health and well"),
    ("network-security", None, r"network security|anomaly detection|privacy and security|cyber"),
    ("cloud-setup", None, r"\bGCP\b|google colab|cloud|aws|azure|deploy|account setup|setup gcp"),
    ("ml-engineering", None, r"\bGANs?\b|stylegan|tensorflow|pytorch|neural network|\bDNN\b|reinforcement learning|\bRL\b|"
                              r"data augmentation|quantization|pruning|hyperparameter|transformer|\bVAEs?\b|gpt-?\d|chatbot|"
                              r"language model|machine learning|retrain|ensemble model|model optimi[sz]ation|"
                              r"dynamic optimization pipeline|self-driving|style transfer|texture synthesis|image morphing|"
                              r"\bML\b|inference|fine-?tun"),
    # The Generative AI Essentials book is an ML-engineering manual; every record
    # from it is dropped (sub-reasons above are counted first where they apply).
    ("ml-engineering", "generative_ai_essentials", None),
    ("ip-law", "ai_versus_ip", None),
    ("theology", None, r"\bgod\b|biblic|holy|\bchrist(?!mas)|theolog|liturg|sacrament|doctrin|revelat|faith|religio|scripture|incarnation|divine"),
    ("scientometrics", None, r"citation|citespace|co-citation|betweenness|bibliometric|science map"),
    # Amendment A11/F5 (EX7 cold review): the library's second Six Thinking Hats
    # copy (coat ...7e7ba834) is a machine back-translation with garbled text;
    # its records are excluded from every count and never used for steps.
    ("unreliable-copy (machine back-translation)", "edward_de_bono_six_thinking_hats_1985_little_brown_and_company_7e7ba834", None),
]

# Record-level exclusions (Amendment A11/F2): records whose label names a
# canonical technique but whose text describes something else. Left unmapped.
EXCLUDE_URNS = {
    # Michalko 2010, intuition chapter: "Brainwriting" there is solo intuitive
    # free writing, not group brainwriting.
    "urn:in-practice:exercise:a5cbef20829202b47f4ea5f3": "solo intuitive writing, not group brainwriting",
}

# ---------------------------------------------------------------- name rules
# technique id -> list of regexes on the record name (case-insensitive).
RULES = {
    "six-thinking-hats": [r"\bhats?\b.*think|think.*\bhats?\b|\b(red|black|white|yellow|green|blue) hat\b|six hats|thinking hats|put the hat|wear the green hat"],
    "random-word": [r"random word|random stimul|random magazine|formal random|random concept list|random object combination"],
    "po-provocation": [r"\bPO\b|provocat|movement (and|instead)"],
    "reversal-method": [r"revers(al|e) (method|thinking|practice|your viewpoint|perspective|approach)|reverse and opposite"],
    # Michalko's "Cherry Split" is his name for fractionation (A11/F2).
    "fractionation": [r"fractionat|cherry split"],
    "alternatives-quota": [r"generat\w* alternatives|search for alternatives|alternative (thinking|generation)|idea quota|balanced search for alternatives|alternative descriptions"],
    "why-technique": [r"\bwhy (technique|questions)\b|challeng\w* assumption|reverse assumption|forget assumption|starting with .why|challenge labels|rule-challenging|challenge obsolete rules"],
    "entry-point-attention-area": [r"entry point"],
    "dominant-idea": [r"dominant idea|crucial factor"],
    "analogy-transfer": [r"^analog(ies|y|ical)\b|analogies for problem|analogies practice|analogous situation|metaphors? for (a )?problem|conceptual blending through analog"],
    "synectics-excursion": [r"synect|direct analog|personal analog|fantasy analog"],
    "scamper": [r"scamper|^(modify|magnify|minify) idea|put to other uses|rearrange components|omit unnecessary elements|adaptation questions"],
    "phoenix-checklist": [r"phoenix"],
    "morphological-box": [r"morpholog|idea box|matrix technique"],
    "brainwriting-635": [r"brainwrit|6-3-5|635"],
    "brainstorming-osborn": [r"brainstorm|think-?up conference|deferred judgment rule|^evaluation session$"],
    "delay-judgement-checkpoint": [r"suspended judg|delay(ed)? judg"],
    "mind-map": [r"mind ?map"],
    "attribute-listing": [r"attribute (listing|analysis)"],
    "tzara-cut-up": [r"cut-?up"],
    "exquisite-corpse": [r"exquisite"],
    "readymade-recontextualisation": [r"readymade|ready-made"],
    "automatic-writing": [r"automatic writing|free ?writing"],
    "fantastic-binomial": [r"binomial"],
    "crazy-8s": [r"crazy ?8"],
    "what-if-prompts": [r"what[- ]if"],
    "thirty-circles": [r"thirty circles|30 circles"],
    "circle-of-opportunity": [r"circle of opportunity"],
    "seed-collection": [r"collect(ing)? seeds|seed phase"],
    "lightning-demos": [r"lightning demo"],
    "swipe-file": [r"steal like an artist|swipe file"],
    "how-might-we": [r"how might we"],
    "five-whys": [r"five whys|5 whys"],
    "problem-finding": [r"problem[- ]finding|discovered problem|presented problem"],
    "wicked-reframe": [r"wicked"],
    "force-field-analysis": [r"tug-of-war|force[- ]field"],
    "empathy-map": [r"empathy map"],
    "mental-locks-audit": [r"mental locks?"],
    "double-diamond": [r"double[- ]diamond"],
    # A11/F2: Csikszentmihalyi's "Observation of Creative Environments" (office
    # layout at Bell Labs etc.) is not contextual user observation; removed.
    "contextual-observation": [r"observation (for innovation|practice|in the field)|do observations in the field|user observation"],
    "hits-dot-voting": [r"dot vot|heat map|straw poll|supervote|sticky decision"],
    "note-and-vote": [r"note-and-vote|note and vote"],
    "cocd-box": [r"cocd"],
    "pmi": [r"\bPMI\b|plus,? minus,? interesting"],
    "alu": [r"\bALU\b"],
    "weighted-decision-matrix": [r"decision matrix|weighted (criteria|matrix)"],
    "peer-cat": [r"consensual assessment"],
    "parallel-prototyping": [r"parallel prototyp"],
    "storyboarding": [r"storyboard"],
    "question-led-prototype": [r"prototype quickly|rapid prototyp|fake it|prototype mindset"],
    "seeing-as-sketch-cycles": [r"seeing[- ]as|sketching for design|reflective sketching"],
    "five-user-interviews": [r"small data|five[- ]user|interview some customers"],
    "mom-test-interview": [r"mom test"],
    "young-five-steps": [r"technique for producing ideas|young'?s (five|5)"],
    "creative-journal": [r"journal(ing)?\b(?!.*(journals_use|interdisciplinary))|morning pages|notebook practice|notebooks for reflection|reread your diary|keep a problem journal"],
    "reflection-in-action-log": [r"reflection-in-action|reflective conversation|on-the-spot reflection"],
    "process-trail": [r"process trail|creative process journals?"],
    "open-monitoring-warm-up": [r"open[- ]monitoring"],
    "bodystorming": [r"bodystorm"],
    "constraint-writing": [r"oulipo|writing with constraints"],
    "thought-walk": [r"thought walk|walking for creativity|daydreaming walk|take leisurely walks|daily walks"],
    "improv-yes-and": [r"yes,? and|improvis"],
    "pure-contour-drawing": [r"contour drawing"],
}

# Coat guards: records whose source book is known not to contain the technique
# (book chapter list checked on 2026-10-06). Mapped to `unmapped` instead.
COAT_GUARDS = {
    # de Bono 1970 has no automatic-writing chapter; its "Automatic Writing
    # Practice" records are suspended-judgement practice sessions.
    "automatic-writing": {"de_bono_edward_lateral_thinking"},
}
# The de Bono 1970 "Automatic Writing Practice" records are re-routed here.
REROUTE = {("automatic-writing", "de_bono_edward_lateral_thinking"): "delay-judgement-checkpoint"}

import yaml  # noqa: E402
BASE_IDS = {t["id"] for t in yaml.safe_load(open(HERE / "techniques.base.yml"))["techniques"]}
unknown_rule_ids = set(RULES) - BASE_IDS
assert not unknown_rule_ids, unknown_rule_ids
COMPILED = {k: [re.compile(r, re.I) for r in v] for k, v in RULES.items()}
OFF = [(why, coat, re.compile(rx, re.I) if rx else None) for why, coat, rx in OFFTOPIC]


def offtopic(rec):
    name, coat = rec["name"] or "", rec["coat"] or ""
    for why, cp, rx in OFF:
        if (cp is None or coat.startswith(cp)) and (rx is None or rx.search(name)):
            return why
    return None


def rule_match(name):
    hits = [tid for tid, rxs in COMPILED.items() if any(r.search(name) for r in rxs)]
    return hits


def main():
    recs_path = sys.argv[1]
    model = {}
    if "--model" in sys.argv:
        model = json.load(open(sys.argv[sys.argv.index("--model") + 1]))["decisions"]
    # Reviewer vetoes of model decisions (name -> reason); vetoed names stay unmapped.
    veto_path = HERE / "model-vetoes.json"
    vetoes = json.load(open(veto_path))["vetoes"] if veto_path.exists() else {}
    model = {k: v for k, v in model.items() if k not in vetoes}
    out, stats = {}, collections.Counter()
    drop_reasons, multi = collections.Counter(), []
    per_tech = collections.defaultdict(list)
    names_per_tech = collections.defaultdict(set)
    n = 0
    for line in open(recs_path, encoding="utf-8"):
        r = json.loads(line); n += 1
        urn, name, coat = r["id"], r["name"] or "", r["coat"] or ""
        why = offtopic(r)
        if why:
            out[urn] = {"drop": why}; drop_reasons[why] += 1; continue
        if urn in EXCLUDE_URNS:
            out[urn] = {"unmapped": name, "excluded": EXCLUDE_URNS[urn]}; stats["unmapped"] += 1; continue
        hits = rule_match(name)
        if len(hits) > 1:
            # Most specific wins: prefer the rule whose regex matched the longest span.
            best = max(hits, key=lambda t: max((m.end() - m.start()) for rx in COMPILED[t] for m in [rx.search(name)] if m))
            multi.append((name, hits, best)); hits = [best]
        tid, method = (hits[0], "rule") if hits else (None, None)
        if tid is None and name in model and model[name] in BASE_IDS:
            tid, method = model[name], "model"
        if tid:
            for guard in COAT_GUARDS.get(tid, ()):
                if coat.startswith(guard):
                    tid = REROUTE.get((tid, guard)); method = "rule+coat-guard" if tid else None
                    break
        if tid:
            out[urn] = {"technique": tid, "method": method, "name": name}
            per_tech[tid].append(urn); names_per_tech[tid].add(name); stats[method] += 1
        else:
            out[urn] = {"unmapped": name}; stats["unmapped"] += 1
    kept = n - sum(drop_reasons.values())
    mapped = sum(len(v) for v in per_tech.values())
    summary = {
        "records_total": n,
        "dropped_offtopic": sum(drop_reasons.values()),
        "dropped_by_reason": dict(drop_reasons.most_common()),
        "on_topic": kept,
        "mapped_records": mapped,
        "mapped_by_method": {k: v for k, v in stats.items() if k != "unmapped"},
        "unmapped_on_topic": stats["unmapped"],
        "distinct_names_mapped": sum(len(v) for v in names_per_tech.values()),
        "duplicates_collapsed": mapped - len(per_tech),
        "techniques_with_records": len(per_tech),
        "per_technique": {k: {"records": len(per_tech[k]), "distinct_names": len(names_per_tech[k])} for k in sorted(per_tech)},
        "model_vetoed_names": len(vetoes),
        "multi_rule_hits": [{"name": a, "rules": b, "chosen": c} for a, b, c in sorted(set((a, tuple(b), c) for a, b, c in multi))],
    }
    json.dump({"mapping": out}, open(HERE / "mapping.json", "w"), indent=0, ensure_ascii=False)
    json.dump(summary, open(HERE / "mapping-stats.json", "w"), indent=2, ensure_ascii=False)
    print(json.dumps({k: v for k, v in summary.items() if k not in ("per_technique", "multi_rule_hits")}, indent=2))


if __name__ == "__main__":
    main()
