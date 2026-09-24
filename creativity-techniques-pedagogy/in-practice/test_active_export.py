import json
from pathlib import Path
import tempfile
import unittest
from export_active import load_active
from pipeline import digest


class ActiveExportTests(unittest.TestCase):
    def test_valid_identity_and_duplicate_refusal(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)/'record.json'
            path.write_text(json.dumps(dict(id='a',source_sha256='s',publication_allowed=False,
                                           provenance=dict(target_node_id='n'))))
            member = dict(path=str(path), record_id='a',source_sha256='s',node_id='n',record_sha256=digest(path.read_bytes()))
            audit = dict(publication_allowed=False,errors=[],unaccounted=[],superseded=[],active=[member])
            self.assertEqual(len(load_active(audit,Path(tmp))),1)
            audit['active'].append(member)
            with self.assertRaises(ValueError): load_active(audit,Path(tmp))
            audit['active'] = [member]
            path.write_text(path.read_text()+'\n')
            with self.assertRaisesRegex(ValueError, 'changed since'):
                load_active(audit,Path(tmp))

    def test_missing_fields_fail_closed(self):
        with self.assertRaisesRegex(ValueError, 'required list'):
            load_active(dict(publication_allowed=False,active=[]),Path('/tmp'))

    def test_unaccounted_fails_closed(self):
        with self.assertRaises(ValueError):
            load_active(dict(publication_allowed=False,unaccounted=['x']),Path('/tmp'))

    def test_path_escape_refused_before_read(self):
        with self.assertRaises(ValueError):
            load_active(dict(publication_allowed=False, errors=[], unaccounted=[], superseded=[],
                             active=[dict(path='/outside/record.json')]),Path('/tmp'))


if __name__ == '__main__': unittest.main()
