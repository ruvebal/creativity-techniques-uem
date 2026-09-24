import copy
import unittest
from structured_fidelity import check_elements,FRAGMENTS


class StructuredTests(unittest.TestCase):
    def fixture(self):
        texts=['Setup.','1. Do this.','2. Do that.','3. Collect.','4a. Branch A',
               'Discuss.','4b. Branch B','Read.','Count.','','5. Accept.','6. Help.']
        old=[]; fresh=[]; live={}
        for i,(fragment,text) in enumerate(zip(FRAGMENTS,texts)):
            node=dict(node_id=str(i),markdown_content=text,block_type='text',block_subtype=None)
            images=['image.jpg'] if not text else []
            old.append(dict(epub_fragment=fragment,source_text=text,image_refs=images,ahmes_matches=[node] if text else []))
            fresh.append(dict(epub_fragment=fragment,source_text=text,image_refs=images))
            live[str(i)]=node
        return old,fresh,live

    def test_pass(self): self.assertEqual(check_elements(*self.fixture())['text_nodes'],11)
    def test_reordered(self):
        old,fresh,live=self.fixture(); fresh[1],fresh[2]=fresh[2],fresh[1]
        with self.assertRaises(ValueError): check_elements(old,fresh,live)
    def test_changed_negation(self):
        old,fresh,live=self.fixture(); live['1']['markdown_content']='1. Do not do this.'
        with self.assertRaises(ValueError): check_elements(old,fresh,live)
    def test_missing_image(self):
        old,fresh,live=self.fixture(); fresh[9]['image_refs']=[]
        with self.assertRaises(ValueError): check_elements(old,fresh,live)
    def test_footnote(self):
        old,fresh,live=self.fixture(); live['1']['block_type']='footnote'
        with self.assertRaises(ValueError): check_elements(old,fresh,live)
    def test_missing_or_ambiguous(self):
        for count in (0,2):
            old,fresh,live=self.fixture(); old[1]['ahmes_matches']*=count
            with self.assertRaises(ValueError): check_elements(old,fresh,live)
    def test_duplicate_label(self):
        old,fresh,live=self.fixture()
        for row in (old[2],fresh[2]): row['source_text']='1. Do that.'
        live['2']['markdown_content']='1. Do that.'
        with self.assertRaises(ValueError): check_elements(old,fresh,live)


if __name__=='__main__': unittest.main()
