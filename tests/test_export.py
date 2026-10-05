import json
import pytest
from export_parashot import ROOT, digest, validate_document, validate_sources
from data_codec import expand_document

def documents():
    return [expand_document(json.loads(p.read_text(encoding='utf-8'))) for p in sorted((ROOT/'site/data').glob('*.json'))]

def test_all_54_documents_have_complete_consistent_structure():
    docs=documents()
    assert [d['id'] for d in docs] == list(range(1,55))
    for doc in docs:
        assert validate_document(doc)
    ids=[w['id'] for d in docs for w in d['words']]
    assert len(ids)==len(set(ids))==112927
    assert docs[0]['range'][0]==['Genesis',1,1]
    assert docs[-1]['range'][-1]==['Deuteronomy',34,12]

def test_catalogue_checksums_and_counts():
    source=(ROOT/'site/data/catalogue.js').read_text(encoding='utf-8')
    catalogue=json.loads(source.removeprefix('export default ').strip().removesuffix(';'))
    for entry in catalogue['parashot']:
        path=ROOT/'site/data'/entry['file']
        assert digest(path)==entry['sha256']
        doc=json.loads(path.read_text(encoding='utf-8'))
        assert len(doc['words'])==entry['words']
        assert len(doc['verses'])==entry['verses']
    assert catalogue['sources']['gematria']['version']=='0.2.0'

def test_source_changes_are_rejected(tmp_path):
    (tmp_path/'sample.tf').write_text('one',encoding='utf-8')
    lock={'sample':{'sha256':{'sample.tf':digest(tmp_path/'sample.tf')}}}
    validate_sources({'sample':tmp_path},lock)
    (tmp_path/'sample.tf').write_text('two',encoding='utf-8')
    with pytest.raises(ValueError,match='changed'):
        validate_sources({'sample':tmp_path},lock)

def test_duplicate_word_ids_are_rejected():
    doc=documents()[0]
    doc['words'].append(doc['words'][0])
    with pytest.raises(AssertionError,match='Duplicate'):
        validate_document(doc)

def test_invalid_full_form_boundaries_are_rejected():
    doc=documents()[0]
    doc['words'][0]['forms']['ketiv']['end']=99999999
    with pytest.raises(AssertionError,match='boundary'):
        validate_document(doc)

def test_glosses_are_exported_and_invalid_types_are_rejected():
    doc = documents()[0]
    assert [w['gloss'] for w in doc['words'][:2]] == ['in', 'beginning']
    doc['words'][0]['gloss'] = 42
    with pytest.raises(AssertionError, match='gloss'):
        validate_document(doc)
