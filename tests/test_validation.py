import json
import subprocess
import sys

import pytest

from data_codec import compact_document
from export_parashot import ROOT, validate_document


# Paths identify one mutation per check without requiring any TF source files.
INVALID_RECORDS = [
    (('words', 1, 'id'), 1, 'Duplicate or unordered word IDs'),
    (('words', 0, 'id'), 3, 'Duplicate or unordered word IDs'),
    (('verses', 0, 'words'), [1], 'Verse membership'),
    (('words', 0, 'gloss'), 42, 'Invalid gloss'),
    (('words', 0, 'gloss'), None, 'Invalid gloss'),  # Deleted key, not a null gloss.
    (('words', 0, 'values'), {}, 'Invalid value representations'),
    (('words', 0, 'values', 'lexeme'), [1] * 4, 'Invalid numerical values'),
    (('words', 0, 'values', 'lexeme'), [1] * 6, 'Invalid numerical values'),
    (('words', 0, 'values', 'lexeme', 0), -1, 'Invalid numerical values'),
    (('words', 0, 'values', 'lexeme', 0), 1.5, 'Invalid numerical values'),
    (('words', 0, 'values', 'lexeme', 0), True, 'Invalid numerical values'),
    (('words', 0, 'forms', 'ketiv', 'start'), 0, 'Full form crosses parasha boundary'),
    (('words', 0, 'forms', 'qere', 'end'), 3, 'Full form crosses parasha boundary'),
    (('words', 0, 'forms', 'ketiv', 'start'), 2, 'Invalid full form bounds'),
    (('words', 1, 'forms', 'qere', 'end'), 1, 'Invalid full form bounds'),
    (('units', 'phrase'), [{'id': 102, 'words': [1]}, {'id': 102, 'words': [2]}], 'Duplicate unit IDs'),
    (('units', 'clause', 0, 'words'), [], 'Empty or invalid unit membership'),
    (('units', 'sentence', 0, 'words'), [3], 'Empty or invalid unit membership'),
]


@pytest.mark.parametrize('path,value,message', INVALID_RECORDS)
def test_invalid_records_are_rejected_even_with_optimization(sample_document, path, value, message):
    target = sample_document
    for key in path[:-1]:
        target = target[key]
    if path[-1] == 'gloss' and value is None:
        del target[path[-1]]
    else:
        target[path[-1]] = value

    with pytest.raises(ValueError, match=message) as error:
        validate_document(sample_document)
    assert 'Parasha 1' in str(error.value)
    child = subprocess.run(
        [sys.executable, '-O', '-c',
         'import json, sys; from export_parashot import validate_document; '
         'validate_document(json.load(sys.stdin))'],
        input=json.dumps(sample_document), text=True, capture_output=True, cwd=ROOT,
        timeout=30,
    )
    assert child.returncode != 0
    assert f'ValueError: {error.value}' in child.stderr


@pytest.mark.parametrize('compact', [False, True])
def test_valid_readable_and_compact_documents_pass(sample_document, compact):
    document = compact_document(sample_document) if compact else sample_document
    assert validate_document(document) is True
    child = subprocess.run(
        [sys.executable, '-O', '-c',
         'import json, sys; from export_parashot import validate_document; '
         'validate_document(json.load(sys.stdin))'],
        input=json.dumps(document), text=True, capture_output=True, cwd=ROOT,
        timeout=30,
    )
    assert child.returncode == 0, child.stderr
