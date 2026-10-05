import json
import subprocess
import sys

import pytest

from export_parashot import ROOT, digest


@pytest.mark.parametrize('optimized', [False, True])
@pytest.mark.parametrize('failure,message', [
    ('checksum', 'Checksum mismatch'),
    ('roundtrip', 'Lossy compaction'),
])
def test_compaction_guards_fail_before_any_write(tmp_path, sample_document, optimized, failure, message):
    directory = tmp_path / 'site/data'
    directory.mkdir(parents=True)
    (tmp_path / 'docs').mkdir()
    entries = []
    for number in (1, 2):
        path = directory / f'{number:02d}.json'
        document = {**sample_document, 'id': number}
        path.write_text(json.dumps(document), encoding='utf-8')
        entries.append({'file': path.name, 'sha256': digest(path)})
    catalogue = directory / 'catalogue.js'
    catalogue.write_text('export default ' + json.dumps({'schemaVersion': 1, 'parashot': entries}) + ';',
                         encoding='utf-8')
    if failure == 'checksum':
        path.write_text(json.dumps({**document, 'name': 'changed'}), encoding='utf-8')
    before = {path.name: path.read_bytes() for path in directory.iterdir()}
    code = '''
import sys
from pathlib import Path
import compact_dataset as compactor
compactor.ROOT = Path(sys.argv[1])
if sys.argv[2] == 'roundtrip':
    original_compact = compactor.compact_document
    def lossy(document):
        packed = original_compact(document)
        if document['id'] == 2:
            packed['name'] = 'changed'
        return packed
    compactor.compact_document = lossy
compactor.compact_dataset()
'''
    command = [sys.executable, *(['-O'] if optimized else []), '-c', code, str(tmp_path), failure]
    child = subprocess.run(command, text=True, capture_output=True, cwd=ROOT, timeout=30)
    assert child.returncode != 0
    assert f'ValueError: {message}:' in child.stderr
    assert '02.json' in child.stderr
    assert {path.name: path.read_bytes() for path in directory.iterdir()} == before
    assert not list((tmp_path / 'docs').iterdir())
