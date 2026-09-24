"""Mechanical comparison of private canaries, never approval or recall scoring."""
import json
from pipeline import OUT, save, now


def main():
    rows = []
    for name in ('thinkertoys', 'steal', 'lateral'):
        runs = []
        for directory in ('context-sample', 'context-sample-v2'):
            root = OUT/directory
            packet = json.loads((root/(name+'-packet.json')).read_text())
            result = json.loads((root/(name+'-judgement.json')).read_text())
            ids = {n['node_id'] for n in packet['nodes']}
            opinion = result['output']
            if not set(opinion['evidence_node_ids']) <= ids:
                raise ValueError('Unbound evidence IDs')
            figures = [n['node_id'] for n in packet['nodes'] if n.get('block_type')=='figure']
            headings = [n['node_id'] for n in packet['nodes'] if n.get('block_type')=='heading']
            runs.append(dict(run=directory,target_node_id=packet['target_node_id'],
                             source_sha256=packet['source_sha256'],
                             node_ids=[n['node_id'] for n in packet['nodes']],
                             figure_nodes=figures,heading_nodes=headings,opinion=opinion,
                             mandatory_visual_review=bool(figures),
                             section_boundary_review=len(headings)>1,
                             boundary_flag_tension=not opinion['ending_present'] and not opinion['needs_more_context'],
                             elapsed_seconds=result.get('elapsed_seconds')))
        if any(runs[0][key]!=runs[1][key] for key in ('target_node_id','source_sha256','node_ids')):
            raise ValueError('Not a same-target comparison')
        rows.append(dict(source=name,actionability_changed=runs[0]['opinion']['actionable']!=runs[1]['opinion']['actionable'],runs=runs))
    report = dict(time=now(),publication_allowed=False,approved_exercises=0,
                  scope='Three purposively selected targets, not recall or accuracy measurement',comparisons=rows)
    save(OUT/'review'/'context-comparison.json',report)
    print(json.dumps(dict(targets=len(rows), actionability_changes=sum(r['actionability_changed'] for r in rows),
                          approved_exercises=0)))


if __name__ == '__main__':
    main()
