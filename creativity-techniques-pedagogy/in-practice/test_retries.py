"""Offline tests: no Ollama calls, private data, or shared-store writes."""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import pipeline


class RetryTests(unittest.TestCase):
    def test_exact_contiguous_coverage(self):
        pipeline.validate_spans([dict(node_id='a', markdown_content='abcd')],
                                [dict(node_id='a', start=0, end=2), dict(node_id='a', start=2, end=4)])

    def test_equal_totals_cannot_hide_overlap_and_gap(self):
        with self.assertRaises(RuntimeError):
            pipeline.validate_spans([dict(node_id='a', markdown_content='abcd')],
                                    [dict(node_id='a', start=0, end=2), dict(node_id='a', start=1, end=3)])

    def run_case(self, batch, responder):
        with tempfile.TemporaryDirectory() as tmp, patch.object(pipeline, 'local_json', responder), patch.object(pipeline, 'event'):
            return pipeline.classify_resilient('', batch, Path(tmp))

    def test_truncated_batch_splits_without_losing_nodes(self):
        batch = [dict(node_id=str(i), offset=0, text='text') for i in range(4)]
        def respond(prompt):
            items = json.loads(prompt)
            if len(items) > 1:
                raise RuntimeError('truncated')
            return dict(prompt_sha256=pipeline.digest(prompt.encode()),
                        output={'exercises':[dict(node_ids=[items[0]['node_id']], tags=[])]})
        result = self.run_case(batch, respond)
        self.assertEqual([e['node_ids'][0] for e in result['output']['exercises']], ['0','1','2','3'])

    def test_long_node_offsets_are_preserved(self):
        spans = []
        def respond(prompt):
            item = json.loads(prompt)[0]
            if len(item['text']) > 1000:
                return dict(output={'wrong': []})
            spans.append((item['offset'], len(item['text'])))
            return dict(prompt_sha256=pipeline.digest(prompt.encode()), output={'exercises':[]})
        self.run_case([dict(node_id='a', offset=40, text='x'*2000)], respond)
        self.assertEqual(spans, [(40,1000),(1040,1000)])

    def test_small_invalid_output_fails_closed(self):
        with self.assertRaises(RuntimeError):
            self.run_case([dict(node_id='a',offset=0,text='text')], lambda _: dict(output={'exercises':[{'node_ids':['invented']}]}))

    def test_network_failure_is_not_bisected(self):
        def unavailable(_):
            raise ConnectionError('offline')
        with self.assertRaises(ConnectionError):
            self.run_case([dict(node_id='a',offset=0,text='text')], unavailable)


if __name__ == '__main__':
    unittest.main()
