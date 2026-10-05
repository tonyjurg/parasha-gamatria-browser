import ast
from copy import deepcopy
import json
from types import SimpleNamespace

import pytest

from data_codec import expand_document
from export_parashot import ROOT, digest, validate_document


def code_cells():
    notebook = json.loads((ROOT / 'create_parasha_json.ipynb').read_text(encoding='utf-8'))
    return [''.join(cell['source']) for cell in notebook['cells'] if cell['cell_type'] == 'code']


def test_runtime_validation_does_not_rely_on_assertions():
    sources = code_cells() + [
        (ROOT / filename).read_text(encoding='utf-8')
        for filename in ('export_parashot.py', 'compact_dataset.py')
    ]
    for source in sources:
        tree = ast.parse(source)
        compile(tree, '<validation-source>', 'exec', optimize=2)
        assert not any(isinstance(node, ast.Assert) for node in ast.walk(tree))


@pytest.mark.parametrize('failure', [None, 'checksum', 'known_value', 'total'])
def test_optimized_notebook_validation_without_source_data(failure):
    source = next(cell for cell in code_cells() if 'stored_document =' in cell)
    catalogue = (ROOT / 'site/data/catalogue.js').read_text(encoding='utf-8')
    manifest = deepcopy(json.loads(catalogue.removeprefix('export default ').strip().removesuffix(';')))
    if failure == 'checksum':
        manifest['parashot'][0]['sha256'] = '0' * 64
    elif failure == 'total':
        manifest['parashot'][0]['words'] += 1
    validated = []

    def validate(document):
        validated.append(document['id'])
        assert document['schemaVersion'] == 1
        return validate_document(document)

    namespace = {
        'manifest': manifest, 'output': ROOT / 'site/data',
        'json': json, 'digest': digest, 'expand_document': expand_document,
        'validate_document': validate,
        'api': SimpleNamespace(F=SimpleNamespace(gem_hechrechi_full_ketiv_ident=SimpleNamespace(
            v=lambda word: 0 if failure == 'known_value' else 913))),
    }
    compiled = compile(source, '<notebook-validation>', 'exec', optimize=2)
    if failure:
        message = {'checksum': 'Checksum mismatch', 'known_value': 'Unexpected standard value',
                   'total': 'Expected exactly 112927'}[failure]
        with pytest.raises(ValueError, match=message):
            exec(compiled, namespace)
    else:
        exec(compiled, namespace)
        assert validated == list(range(1, 55))
