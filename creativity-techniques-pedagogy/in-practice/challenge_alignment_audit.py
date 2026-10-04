"""Private span discovery against saved Ahmes witnesses; not a quotation gate."""
import json
from pipeline import OUT, digest, save, now


def main():
    raw=(OUT/'review'/'creative-confidence-vault-comparison.json').read_bytes()
    comparison=json.loads(raw)
    selected=[v for v in comparison['vaults'] if v['db'].endswith('_2013_crown_business_64e9e459/extract/extraction.db')]
    if len(selected)!=1: raise ValueError('Ambiguous witness')
    normalize=lambda text:' '.join(text.split())
    nodes=[(n,normalize(n['markdown_content'] or '')) for n in selected[0]['nodes']]
    entries=[]
    for path in sorted((OUT/'challenge-review').glob('challenge-*.json')):
        packet=json.loads(path.read_text())
        for element in packet['elements']:
            if element['ahmes_matches'] or not element['text'].strip(): continue
            text=normalize(element['text'])
            candidates=[]
            for node,haystack in nodes:
                offset=haystack.find(text)
                if offset>=0:
                    candidates.append(dict(node=node,normalized_start=offset,
                        normalized_end=offset+len(text),occurrences=haystack.count(text)))
            compact_candidates=[]
            if not candidates:
                compact=''.join(text.split())
                for node,haystack in nodes:
                    if compact==''.join(haystack.split()):
                        compact_candidates.append(node)
            entries.append(dict(challenge=packet['number'],ordinal=element['ordinal'],
                source_text=element['text'],candidates=candidates,
                whitespace_loss_candidates=compact_candidates,
                state='unique-containing-node' if len(candidates)==1 and candidates[0]['occurrences']==1
                      else 'ambiguous' if candidates else 'whitespace-loss-candidate' if len(compact_candidates)==1
                      else 'ambiguous-whitespace-loss' if compact_candidates else 'unresolved'))
    summary={s:sum(e['state']==s for e in entries) for s in ('unique-containing-node','ambiguous','whitespace-loss-candidate','ambiguous-whitespace-loss','unresolved')}
    save(OUT/'review'/'challenge-alignment-audit.json',dict(time=now(),publication_allowed=False,
        snapshot_sha256=digest(raw),summary=summary,entries=entries,
        limitations=['Offsets refer to whitespace-normalized text, never original byte offsets.',
                    'Whitespace-removal matches are diagnostic only; they do not pass verbatim fidelity.',
                    'Candidate alignment only; no automatic quote acceptance or approval.',
                    'Uses preserved Ahmes snapshot; live validation required before promotion.']))
    print(json.dumps(summary))

if __name__=='__main__': main()
