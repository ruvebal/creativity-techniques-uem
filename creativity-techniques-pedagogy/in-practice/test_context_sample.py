import unittest
from context_sample import window, validate


class ContextSampleTests(unittest.TestCase):
    def test_full_nodes_in_order_and_document_guard(self):
        nodes = [dict(node_id=str(i), source_order=i, document_id='a' if i<3 else 'b',
                      markdown_content='whole node') for i in range(5)]
        self.assertEqual([n['node_id'] for n in window(nodes,1)], ['0','1','2'])

    def test_no_silent_target_truncation(self):
        with self.assertRaises(ValueError):
            window([dict(markdown_content='oversized')],0,cap=2)

    def test_boolean_and_identity_validation(self):
        good = dict(actionable=True,setup_present=True,steps_present=True,ending_present=False,
                    needs_more_context=True,evidence_node_ids=['n'],limitations=['missing ending'])
        validate(good,{'n'})
        with self.assertRaises(ValueError): validate(dict(good,evidence_node_ids=['invented']),{'n'})
        with self.assertRaises(ValueError): validate(dict(good,actionable='yes'),{'n'})


if __name__ == '__main__': unittest.main()
