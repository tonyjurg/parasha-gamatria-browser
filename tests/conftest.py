import pytest

from export_parashot import METHODS, REPRESENTATIONS


@pytest.fixture
def sample_document():
    words = []
    for node in (1, 2):
        words.append({
            'id': node, 'verse': 10, 'lexeme': 'x', 'gloss': None,
            'hasQere': False, 'error': None,
            'forms': {
                reading: {'text': 'x', 'after': ' ', 'plain': 'x', 'start': 1, 'end': 2}
                for reading in ('ketiv', 'qere')
            },
            'values': {representation: [None, 0, 1, 2, 3] for representation in REPRESENTATIONS},
        })
    return {
        'schemaVersion': 1, 'id': 1, 'name': 'sample', 'hebrew': 'x',
        'methods': METHODS.copy(), 'range': [['Genesis', 1, 1], ['Genesis', 1, 1]],
        'words': words,
        'verses': [{'id': 10, 'ref': ['Genesis', 1, 1], 'words': [1, 2], 'sourceParashaVerse': 1}],
        'units': {
            kind: [{'id': node, 'words': [1, 2], 'clipped': False}]
            for kind, node in (('sentence', 100), ('clause', 101), ('phrase', 102))
        },
    }
