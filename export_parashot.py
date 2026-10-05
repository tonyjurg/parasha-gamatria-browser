"""Export pinned BHSA, gematria_TF and BHSaddons to a static browser dataset."""
from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
from tempfile import TemporaryDirectory
from urllib.parse import quote
from urllib.request import urlopen
from weakref import finalize
from data_codec import compact_document, expand_document

ROOT = Path(__file__).resolve().parent
METHODS = ['hechrechi', 'gadol', 'sidduri', 'katan', 'katan_mispari']
METHOD_LABELS = ['Standard · Hechrechi', 'Final letters · Gadol', 'Alphabet order · Sidduri', 'Reduced letters · Katan', 'Single digit · Katan Mispari']
READINGS = ['ketiv', 'qere']
REPRESENTATIONS = ['lexeme', 'word_ketiv', 'word_qere', 'full_ketiv', 'full_qere']
TORAH = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy']


def digest(path):
    return hashlib.sha256(Path(path).read_bytes().replace(b'\r\n', b'\n')).hexdigest()


def default_sources():
    parent = ROOT.parent
    return {'gematria': parent/'gematria_TF/tf/2021', 'addons': parent/'BHSaddons/tf/2021'}


def fetch_bhsa(spec, directory):
    """Fetch every locked BHSA feature directly from ETCBC on each source load."""
    if spec['repository'].rstrip('/') != 'https://github.com/ETCBC/bhsa':
        raise ValueError('BHSA must come from the ETCBC/bhsa repository')
    if not re.fullmatch(r'[0-9a-f]{40}', spec['commit']) or not re.fullmatch(r'[0-9A-Za-z_-]+', spec['version']):
        raise ValueError('Invalid pinned BHSA revision or version')
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    for filename, expected in spec['sha256'].items():
        if Path(filename).name != filename or not filename.endswith('.tf'):
            raise ValueError(f'Invalid BHSA feature filename: {filename}')
        url = f"https://raw.githubusercontent.com/ETCBC/bhsa/{spec['commit']}/tf/{spec['version']}/{quote(filename)}"
        with urlopen(url, timeout=120) as response:
            data = response.read()
        if hashlib.sha256(data.replace(b'\r\n', b'\n')).hexdigest() != expected:
            raise ValueError(f'Checksum mismatch downloading BHSA feature: {filename}')
        (directory/filename).write_bytes(data)
    return directory


def validate_sources(paths, lock):
    for source, spec in lock.items():
        for filename, expected in spec['sha256'].items():
            path = Path(paths[source])/filename
            if not path.is_file() or digest(path) != expected:
                raise ValueError(f'Missing or changed pinned source: {path}')


def load_sources(paths=None):
    from tf.fabric import Fabric
    paths = dict(default_sources() if paths is None else paths)
    if 'bhsa' in paths:
        raise ValueError('BHSA is fetched directly from ETCBC; remove the local bhsa path')
    lock = json.loads((ROOT/'source-lock.json').read_text(encoding='utf-8'))
    if 'gloss.tf' not in lock['bhsa']['sha256']:
        raise ValueError('Pin BHSA gloss.tf in source-lock.json before exporting glosses')
    if 'book@en.tf' not in lock['bhsa']['sha256']:
        raise ValueError('Pin BHSA book@en.tf in source-lock.json for English verse references')
    features = set()
    for spec in lock.values():
        features.update(Path(f).stem for f in spec['sha256'] if f.endswith('.tf') and Path(f).stem not in {'otype', 'oslots', 'otext'})
    validate_sources(paths, {k: spec for k, spec in lock.items() if k != 'bhsa'})
    directory = TemporaryDirectory(prefix='parasha-bhsa-')
    try:
        paths['bhsa'] = fetch_bhsa(lock['bhsa'], directory.name)
        validate_sources(paths, lock)
        api = Fabric(locations=[str(Path(paths[k]).resolve()) for k in ['bhsa','addons','gematria']], silent='deep').load(sorted(features), silent='deep')
        if not api:
            raise RuntimeError('Text-Fabric could not load the pinned source data')
    except Exception:
        directory.cleanup()
        raise
    # Text-Fabric can load additional data lazily; retain fresh files for the API's lifetime.
    finalize(api, directory.cleanup)
    return api, lock


def partition_verses(api):
    groups = {i: [] for i in range(1, 55)}
    torah_words = set()
    for book in api.F.otype.s('book'):
        if api.T.sectionFromNode(book)[0] in TORAH:
            torah_words.update(api.L.d(book, otype='word'))
    for verse in api.F.otype.s('verse'):
        number = api.F.parashanum.v(verse)
        if number:
            if number not in groups:
                raise ValueError(f'Unexpected parasha number {number}')
            groups[number].append(verse)
    coverage = Counter(w for verses in groups.values() for v in verses for w in api.L.d(v, otype='word'))
    if any(not verses for verses in groups.values()) or set(coverage) != torah_words or any(n != 1 for n in coverage.values()):
        raise ValueError(f'BHSaddons must divide the Torah into exactly 54 non-overlapping, complete portions '
                         f'(empty portions: {sum(not vs for vs in groups.values())}, '
                         f'Torah words: {len(torah_words)}, covered: {len(coverage)}, '
                         f'missing: {len(torah_words - set(coverage))}, '
                         f'outside Torah: {len(set(coverage) - torah_words)})')
    return groups


def validate_document(doc):
    doc = expand_document(doc)
    ids = [w['id'] for w in doc['words']]
    available = set(ids)
    assert ids == sorted(available), 'Duplicate or unordered word IDs'
    verse_words = [w for v in doc['verses'] for w in v['words']]
    assert verse_words == ids, 'Verse membership does not cover the parasha exactly'
    for word in doc['words']:
        assert 'gloss' in word and (word['gloss'] is None or isinstance(word['gloss'], str)), 'Invalid gloss'
        assert set(word['values']) == set(REPRESENTATIONS)
        for values in word['values'].values():
            assert len(values) == 5 and all(v is None or type(v) is int and v >= 0 for v in values)
        for form in word['forms'].values():
            assert form['start'] in available and form['end'] in available, 'Full form crosses parasha boundary'
            assert form['start'] <= word['id'] <= form['end']
    for units in doc['units'].values():
        assert len({u['id'] for u in units}) == len(units)
        assert all(u['words'] and set(u['words']) <= available for u in units)
    return True


def export_all(api, lock, output=None):
    output = Path(output or ROOT/'site/data').resolve()
    # Never write into a TF source directory.
    if list(output.glob('*.tf')):
        raise ValueError('Output contains TF features; choose a separate data directory')
    output.mkdir(parents=True, exist_ok=True)
    groups = partition_verses(api)
    features = {f'gem_{m}_{rep}_ident': api.Fs(f'gem_{m}_{rep}_ident') for rep in REPRESENTATIONS for m in METHODS}
    summary, counter_audit = [], []
    for number, verses in groups.items():
        words = [w for v in verses for w in api.L.d(v, otype='word')]
        word_set = set(words)
        names = {api.F.parashatrans.v(v) for v in verses}
        hebrew_names = {api.F.parashahebr.v(v) for v in verses}
        if len(names) != 1 or len(hebrew_names) != 1 or None in names or None in hebrew_names:
            raise ValueError(f'Inconsistent BHSaddons names for parasha {number}')
        supplied = [api.F.parashaverse.v(v) for v in verses]
        missing = sum(value is None for value in supplied)
        mismatched = sum(value is not None and value != i for i,value in enumerate(supplied,1))
        if missing or mismatched:
            counter_audit.append({'parasha':number,'missing':missing,'differentFromTextOrder':mismatched})
        verse_lookup = {w: v for v in verses for w in api.L.d(v, otype='word')}
        doc = {'schemaVersion': 1, 'id': number, 'name': next(iter(names)), 'hebrew': next(iter(hebrew_names)),
               'methods': METHODS, 'range': [list(api.T.sectionFromNode(v)) for v in (verses[0],verses[-1])],
               'words': [], 'verses': [], 'units': {}}
        for v in verses:
            doc['verses'].append({'id': v, 'ref': list(api.T.sectionFromNode(v)), 'words': list(api.L.d(v, otype='word')), 'sourceParashaVerse':api.F.parashaverse.v(v)})
        for w in words:
            item = {'id': w, 'verse': verse_lookup[w], 'lexeme': api.F.gem_text_lexeme.v(w),
                    'gloss': api.F.gloss.v(w),
                    'hasQere': bool(api.F.gem_has_qere.v(w)), 'error': api.F.gem_qere_error.v(w), 'forms': {}, 'values': {}}
            qere = api.F.qere_utf8.v(w)
            for reading in READINGS:
                use_qere = reading == 'qere' and qere is not None
                item['forms'][reading] = {
                    'text': qere if use_qere else api.F.g_word_utf8.v(w),
                    'after': (api.F.qere_trailer_utf8.v(w) or '') if use_qere else (api.F.trailer_utf8.v(w) or ''),
                    'plain': api.Fs(f'gem_text_word_{reading}').v(w),
                    'start': api.Fs(f'gem_full_start_{reading}').v(w),
                    'end': api.Fs(f'gem_full_end_{reading}').v(w)}
            for rep in REPRESENTATIONS:
                item['values'][rep] = [features[f'gem_{m}_{rep}_ident'].v(w) for m in METHODS]
            doc['words'].append(item)
        for kind in ('sentence','clause','phrase'):
            nodes = sorted({u for w in words for u in api.L.u(w, otype=kind)})
            units = []
            for node in nodes:
                complete = api.L.d(node, otype='word')
                within = [w for w in complete if w in word_set]
                units.append({'id': node, 'words': within, 'clipped': len(within) != len(complete)})
            doc['units'][kind] = units
        validate_document(doc)
        filename = f'{number:02d}.json'
        compact = compact_document(doc)
        if expand_document(compact) != doc:
            raise ValueError(f'Compaction changed parasha {number}')
        text = json.dumps(compact, ensure_ascii=False, separators=(',', ':'))+'\n'
        path = output/filename
        temporary = path.with_suffix('.tmp')
        temporary.write_text(text, encoding='utf-8', newline='\n')
        temporary.replace(path)
        summary.append({'id': number, 'name': doc['name'], 'hebrew': doc['hebrew'], 'range': doc['range'],
                        'verses': len(verses), 'words': len(words), 'file': filename, 'bytes': path.stat().st_size,
                        'sha256': digest(path)})
        print(f'{number:02d} {doc["name"]}: {len(verses)} verses, {len(words)} word units', flush=True)
    expected = {f'{i:02d}.json' for i in range(1,55)}
    if {p.name for p in output.glob('*.json')} != expected:
        raise ValueError('Data directory contains unexpected JSON files; use a clean directory')
    manifest = {'schemaVersion': 2, 'title': 'Parasha Gamatria Browser',
                'methods': [{'id':m,'label':label} for m,label in zip(METHODS,METHOD_LABELS,strict=True)],
                'sources': lock, 'parashot': summary, 'sourceVerseCounterAudit':counter_audit, 'license': 'CC BY-NC 4.0'}
    (output/'catalogue.js').write_text('export default '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8',newline='\n')
    print(f'Export complete: 54 JSON files, {sum(x["words"] for x in summary):,} Torah word units',flush=True)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name,path in default_sources().items():
        parser.add_argument('--'+name,type=Path,default=path)
    parser.add_argument('--output',type=Path,default=ROOT/'site/data')
    args = parser.parse_args()
    api, lock = load_sources({k:getattr(args,k) for k in default_sources()})
    export_all(api,lock,args.output)


if __name__ == '__main__':
    main()
