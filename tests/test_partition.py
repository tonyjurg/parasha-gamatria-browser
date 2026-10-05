import json
from types import SimpleNamespace

import pytest

from data_codec import expand_document
from export_parashot import digest, export_all, partition_verses


@pytest.fixture
def sample_api():
    verses = list(range(101, 155))
    members = {9000: list(range(1, 55)), **{verse: [verse - 100] for verse in verses}}
    numbers = {verse: verse - 100 for verse in verses}
    readings = {2: '', 3: 'read'}

    def feature(function):
        return SimpleNamespace(v=function)

    def dynamic_feature(name):
        if name.startswith('gem_full_'):
            return feature(lambda word: word)
        if name.startswith('gem_text_'):
            return feature(lambda word: 'plain')
        return feature(lambda word: 42)

    fields = SimpleNamespace(
        otype=SimpleNamespace(s=lambda kind: [9000] if kind == 'book' else verses),
        parashanum=feature(numbers.get),
        parashatrans=feature(lambda verse: f'portion {verse - 100}'),
        parashahebr=feature(lambda verse: 'x'),
        parashaverse=feature(lambda verse: 1),
        gem_text_lexeme=feature(lambda word: 'lexeme'),
        gloss=feature(lambda word: 'gloss'),
        gem_has_qere=feature(lambda word: word in readings),
        gem_qere_error=feature(lambda word: None),
        qere_utf8=feature(readings.get),
        qere_trailer_utf8=feature(lambda word: '!' if word == 3 else None),
        g_word_utf8=feature(lambda word: 'written'),
        trailer_utf8=feature(lambda word: ' '),
    )
    return SimpleNamespace(
        F=fields, Fs=dynamic_feature,
        T=SimpleNamespace(sectionFromNode=lambda node: ('Genesis', 1, max(1, node - 100))),
        L=SimpleNamespace(d=lambda node, otype: members[node], u=lambda word, otype: []),
        members=members, numbers=numbers,
    )


def test_partition_covers_all_54_portions(sample_api):
    groups = partition_verses(sample_api)
    assert groups == {number: [number + 100] for number in range(1, 55)}


@pytest.mark.parametrize('failure,message', [
    ('empty', 'empty portions: 1'),
    ('missing', 'missing: 1'),
    ('outside', 'outside Torah: 1'),
    ('overlap', 'overlapping words: 1'),
    ('unexpected', 'Unexpected parasha number 55'),
])
def test_partition_rejects_incomplete_or_overlapping_coverage(sample_api, failure, message):
    if failure == 'empty':
        sample_api.numbers[101] = None
    elif failure == 'missing':
        sample_api.members[9000].append(55)
    elif failure == 'outside':
        sample_api.members[101].append(55)
    elif failure == 'overlap':
        sample_api.members[102].append(1)
    else:
        sample_api.numbers[101] = 55
    with pytest.raises(ValueError, match=message):
        partition_verses(sample_api)


def test_export_preserves_absent_empty_and_explicit_qere(sample_api, tmp_path):
    manifest = export_all(sample_api, {}, tmp_path)
    assert manifest['schemaVersion'] == 2
    assert len(manifest['parashot']) == 54
    for entry in manifest['parashot']:
        path = tmp_path / entry['file']
        stored = json.loads(path.read_text(encoding='utf-8'))
        assert stored['schemaVersion'] == 2
        assert digest(path) == entry['sha256']
        assert entry['words'] == entry['verses'] == 1
    words = [expand_document(json.loads((tmp_path / f'{number:02d}.json').read_text(encoding='utf-8')))
             ['words'][0] for number in (1, 2, 3)]
    assert words[0]['forms']['qere'] == words[0]['forms']['ketiv']
    assert words[0]['hasQere'] is False
    assert words[1]['forms']['qere'] == {'text': '', 'after': '', 'plain': 'plain', 'start': 2, 'end': 2}
    assert words[2]['forms']['qere'] == {'text': 'read', 'after': '!', 'plain': 'plain', 'start': 3, 'end': 3}
    assert words[1]['hasQere'] is words[2]['hasQere'] is True
    assert words[1]['forms']['ketiv']['text'] == words[2]['forms']['ketiv']['text'] == 'written'
