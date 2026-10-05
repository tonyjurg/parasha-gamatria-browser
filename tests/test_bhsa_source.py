import hashlib
from io import BytesIO
from urllib.error import URLError
import pytest
import export_parashot as exporter


def spec(data):
    return {'repository':'https://github.com/ETCBC/bhsa', 'commit':'a'*40, 'version':'2021',
            'sha256':{'sample.tf':hashlib.sha256(data).hexdigest()}}


def test_fetch_uses_upstream_pinned_revision_even_when_local_file_exists(tmp_path, monkeypatch):
    payload = b'@node\n@valueType=str\n\ngloss\n'
    calls = []
    def download(url, timeout):
        calls.append(url)
        assert timeout == 120
        return BytesIO(payload.replace(b'\n', b'\r\n'))
    monkeypatch.setattr(exporter, 'urlopen', download)
    (tmp_path/'sample.tf').write_bytes(b'stale cached content')
    exporter.fetch_bhsa(spec(payload), tmp_path)
    exporter.fetch_bhsa(spec(payload), tmp_path)
    assert calls == [f'https://raw.githubusercontent.com/ETCBC/bhsa/{"a"*40}/tf/2021/sample.tf']*2
    assert exporter.digest(tmp_path/'sample.tf') == spec(payload)['sha256']['sample.tf']


def test_changed_upstream_file_is_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(exporter, 'urlopen', lambda *args, **kwargs: BytesIO(b'wrong data'))
    with pytest.raises(ValueError, match='Checksum mismatch'):
        exporter.fetch_bhsa(spec(b'correct data'), tmp_path)
    assert not (tmp_path/'sample.tf').exists()


def test_download_failure_does_not_fall_back_to_local_file(tmp_path, monkeypatch):
    (tmp_path/'sample.tf').write_bytes(b'local data')
    def offline(*args, **kwargs):
        raise URLError('offline')
    monkeypatch.setattr(exporter, 'urlopen', offline)
    with pytest.raises(URLError):
        exporter.fetch_bhsa(spec(b'local data'), tmp_path)


def test_local_bhsa_override_is_rejected():
    assert 'bhsa' not in exporter.default_sources()
    with pytest.raises(ValueError, match='remove the local bhsa path'):
        exporter.load_sources({'bhsa':'old-cache'})
