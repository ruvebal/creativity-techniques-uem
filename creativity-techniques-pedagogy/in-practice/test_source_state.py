import copy
import unittest
from reconcile_source_state import scan_supersedes_exclusion


class SourceStateTests(unittest.TestCase):
    def fixture(self):
        p=dict(source_sha256='s', db='db', completed_at='2026-09-21T10:00:00+00:00')
        c=dict(source_sha256='s', state='scanned', classification_gate='validated-ids-bisect-v1',
               characters_expected=100, characters_scanned=100, time='2026-09-22T10:00:00+00:00',
               document=dict(source_sha256='s', preparation_state='prepared', extraction_dbs=['db']))
        e=dict(reason='ingestion not verified',document=dict(source_sha256='s'))
        return [p,c,e]

    def test_valid_recovery(self):
        self.assertTrue(scan_supersedes_exclusion('s', *self.fixture()))

    def test_cannot_retire_genre_exclusion(self):
        p,c,e=self.fixture(); e['reason']='not a monograph'
        self.assertFalse(scan_supersedes_exclusion('s',p,c,e))

    def test_wrong_identity_or_incomplete_scan(self):
        for index,key,value in [(0,'source_sha256','wrong'),(0,'db','different'),
                                (1,'characters_scanned',99),(1,'classification_gate','old'),
                                (0,'completed_at','2026-09-23T10:00:00+00:00')]:
            receipts=self.fixture(); receipts[index][key]=value
            self.assertFalse(scan_supersedes_exclusion('s',*receipts))

    def test_missing_fields(self):
        for index in (0,1,2):
            for key in self.fixture()[index]:
                receipts=copy.deepcopy(self.fixture()); del receipts[index][key]
                self.assertFalse(scan_supersedes_exclusion('s',*receipts))
