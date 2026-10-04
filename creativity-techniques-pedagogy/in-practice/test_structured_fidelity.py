import copy
import unittest
import json
from unittest.mock import patch, MagicMock
import structured_fidelity as verifier
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

    def test_invalid_image_only(self):
        for with_node in (False, True):
            old,fresh,live=self.fixture()
            if with_node:
                old[9]['ahmes_matches']=[live['0']]
            else:
                old[9]['image_refs']=fresh[9]['image_refs']=[]
            with self.assertRaisesRegex(ValueError, 'Invalid image-only'):
                check_elements(old,fresh,live)

    def test_missing_or_unexpected_label(self):
        for text in ('Help.', '7. Help.'):
            old,fresh,live=self.fixture()
            old[-1]['source_text']=fresh[-1]['source_text']=text
            live['11']['markdown_content']=text
            with self.assertRaisesRegex(ValueError, 'step labels'):
                check_elements(old,fresh,live)

    def test_table_block(self):
        old,fresh,live=self.fixture()
        live['1']['block_type']='table'
        with self.assertRaisesRegex(ValueError, 'Non-procedure'):
            check_elements(old,fresh,live)

    def test_main_rejects_changed_source_before_save(self):
        witness=json.dumps(dict(source_file='/private/tmp/test-witness.epub',
                                source_sha256=verifier.digest(b'original'))).encode()
        with patch.object(verifier.Path, 'read_bytes', side_effect=[witness,b'changed']), \
             patch.object(verifier, 'save') as save:
            with self.assertRaisesRegex(ValueError, 'Source hash changed'):
                verifier.main()
            save.assert_not_called()

    def test_main_rejects_stale_prose_audit_before_save(self):
        old,fresh,live=self.fixture()
        member=('<html>'+''.join(
            '<p id="'+e['epub_fragment']+'">'+e['source_text']+
            ''.join('<img src="'+src+'"/>' for src in e['image_refs'])+'</p>'
            for e in fresh)+'</html>').encode()
        source=b'archive fixture'
        witness=json.dumps(dict(source_file='/private/tmp/test-witness.epub',
            source_sha256=verifier.digest(source),
            epub_member='LateralThinking/xhtml/chapter007.html',
            member_sha256=verifier.digest(member), extraction_db='fixture',
            elements=old)).encode()
        archive=MagicMock()
        archive.__enter__.return_value.read.return_value=member
        database=MagicMock()
        database.__enter__.return_value.execute.return_value=list(live.values())
        with patch.object(verifier.Path, 'read_bytes', side_effect=[witness,source,
                  json.dumps(dict(witness_sha256='stale')).encode()]), \
             patch.object(verifier.zipfile, 'ZipFile', return_value=archive), \
             patch.object(verifier, 'connect', return_value=database), \
             patch.object(verifier, 'save') as save:
            with self.assertRaisesRegex(ValueError, 'Stale prose-gate audit'):
                verifier.main()
            save.assert_not_called()


if __name__=='__main__': unittest.main()
