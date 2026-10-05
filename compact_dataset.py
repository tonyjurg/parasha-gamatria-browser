"""Convert an existing export to compact JSON, checking lossless expansion first."""
import json
import hashlib
from data_codec import compact_document, expand_document
from export_parashot import ROOT, digest, validate_document


def compact_dataset():
    directory = ROOT/'site/data'
    catalogue_path = directory/'catalogue.js'
    catalogue = json.loads(catalogue_path.read_text(encoding='utf-8').removeprefix('export default ').strip().removesuffix(';'))
    prepared, report = [], []
    for entry in catalogue['parashot']:
        path = directory/entry['file']
        if digest(path) != entry['sha256']:
            raise ValueError(f'Checksum mismatch: {path}')
        original = expand_document(json.loads(path.read_text(encoding='utf-8')))
        validate_document(original)
        compact = compact_document(original)
        if expand_document(compact) != original:
            raise ValueError(f'Lossy compaction: {path}')
        readable = (json.dumps(original, ensure_ascii=False, separators=(',', ':'))+'\n').encode('utf-8')
        text = json.dumps(compact, ensure_ascii=False, separators=(',', ':'))+'\n'
        report.append({'file':entry['file'], 'originalBytes':len(readable),
                       'originalSha256':hashlib.sha256(readable).hexdigest(),
                       'compactBytes':len(text.encode('utf-8'))})
        prepared.append((path, text, entry))
    for path, text, entry in prepared:
        temporary = path.with_suffix('.tmp')
        temporary.write_text(text, encoding='utf-8', newline='\n')
        temporary.replace(path)
        entry.update(bytes=path.stat().st_size, sha256=digest(path))
    catalogue['schemaVersion'] = 2
    temporary = catalogue_path.with_suffix('.tmp')
    temporary.write_text('export default '+json.dumps(catalogue, ensure_ascii=False, indent=2)+';\n', encoding='utf-8', newline='\n')
    temporary.replace(catalogue_path)
    (ROOT/'docs/compaction-report.json').write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
    before, after = sum(r['originalBytes'] for r in report), sum(r['compactBytes'] for r in report)
    print(f'{len(report)} files: {before:,} -> {after:,} bytes ({100*(1-after/before):.1f}% smaller)')


if __name__ == '__main__':
    compact_dataset()
