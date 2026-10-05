import json
from pathlib import Path
import pytest
from data_codec import compact_document, expand_document


def test_expansion_is_idempotent_and_preserves_readable_identity(sample_document):
    assert expand_document(sample_document) is sample_document
    assert expand_document(expand_document(sample_document)) is sample_document
    packed = compact_document(sample_document)
    assert packed['schemaVersion'] == 2
    readable = expand_document(packed)
    assert readable['schemaVersion'] == 1
    assert readable == sample_document
    assert expand_document(readable) is readable
    assert compact_document(readable) == packed


def test_all_committed_documents_roundtrip_with_the_expected_schema_versions():
    directory = Path(__file__).resolve().parents[1] / 'site/data'
    paths = sorted(directory.glob('*.json'))
    assert len(paths) == 54
    for path in paths:
        stored = json.loads(path.read_text(encoding='utf-8'))
        assert stored['schemaVersion'] == 2
        readable = expand_document(stored)
        assert readable['schemaVersion'] == 1
        assert expand_document(readable) is readable
        compact = compact_document(readable)
        assert compact == stored
        assert expand_document(compact) == readable


def test_null_empty_qere_discontinuous_membership_and_clipping_survive():
    methods = ['a', 'b', 'c', 'd', 'e']
    values = dict.fromkeys(['lexeme', 'word_ketiv', 'word_qere', 'full_ketiv', 'full_qere'], [None, 0, 1, 2, 3])
    written = {'text':'x', 'after':' ', 'plain':'x', 'start':1, 'end':3}
    read = {**written, 'text':'', 'plain':None}
    doc = {'schemaVersion':1, 'id':1, 'name':'sample', 'hebrew':'x', 'methods':methods, 'range':[],
           'words':[{'id':1, 'verse':10, 'lexeme':None, 'gloss':'', 'hasQere':True, 'error':None,
                     'forms':{'ketiv':written, 'qere':read}, 'values':values}],
           'verses':[{'id':10, 'ref':['Genesis', 1, 1], 'words':[1], 'sourceParashaVerse':None}],
           'units':{'phrase':[{'id':20, 'words':[1, 3], 'clipped':True}]}}
    packed = compact_document(doc)
    assert len(packed['values']) == 1
    decoded = expand_document(packed)
    assert decoded == doc
    assert decoded['words'][0]['values']['lexeme'] is not decoded['words'][0]['values']['word_ketiv']
    assert compact_document(packed) == packed


@pytest.mark.parametrize('row', ['forms', 'values', 'verses'])
def test_truncated_compact_rows_are_rejected(row):
    path = Path(__file__).resolve().parents[1] / 'site/data/01.json'
    packed = json.loads(path.read_text(encoding='utf-8'))
    if row == 'values':
        packed['words'][0][8].pop()
    else:
        packed[row][0].pop()
    with pytest.raises(ValueError, match='zip'):
        expand_document(packed)
