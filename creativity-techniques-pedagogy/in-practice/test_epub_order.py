import copy
import unittest
from epub_order_canary import normalized, validate_alignment


class SourceOrderTests(unittest.TestCase):
    def rows(self):
        return [dict(epub_fragment=str(i),source_text='text '+str(i),ahmes_matches=[
            dict(node_id=str(i),markdown_content='text '+str(i),insertion_order=100-i)])
            for i in range(11)]+[dict(epub_fragment='image',source_text='',ahmes_matches=[])]

    def test_source_order_independent_of_rowid(self):
        validate_alignment(self.rows())

    def test_missing_or_ambiguous_matches_fail(self):
        for count in (0,2):
            rows=self.rows()
            rows[0]['ahmes_matches']*=count
            with self.assertRaises(ValueError): validate_alignment(rows)

    def test_changed_text_and_duplicate_fragment_fail(self):
        rows=self.rows()
        rows[0]['source_text']='different'
        with self.assertRaises(ValueError): validate_alignment(rows)
        rows=self.rows()
        rows[1]['epub_fragment']=rows[0]['epub_fragment']
        with self.assertRaises(ValueError): validate_alignment(rows)

    def test_normalization_does_not_rewrite_words(self):
        self.assertEqual(normalized(' a\n b '),'a b')
        self.assertNotEqual(normalized('not acceptable'),normalized('acceptable'))


if __name__=='__main__': unittest.main()
