import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import reconcile


class ReconcileTests(unittest.TestCase):
    def test_missing_directories_fail_closed(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(reconcile, 'OUT', Path(tmp)):
            with self.assertRaisesRegex(ValueError, 'Missing required'):
                reconcile.main()

    def test_empty_coverage_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(reconcile, 'OUT', Path(tmp)):
            for name in ('coverage', 'coverage-spans', 'batches', 'records'):
                (Path(tmp)/name).mkdir()
            with self.assertRaisesRegex(ValueError, 'No coverage'):
                reconcile.main()


if __name__ == '__main__':
    unittest.main()
