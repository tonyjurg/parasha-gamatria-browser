from pathlib import Path
import re
import tomllib
import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]


def needs_list(job):
    needs = job['needs']
    return [needs] if isinstance(needs, str) else needs


@pytest.mark.parametrize('workflow', ['pages', 'quality'])
def test_workflows_parse_and_use_pinned_actions(workflow):
    document = yaml.safe_load((ROOT / f'.github/workflows/{workflow}.yml').read_text(encoding='utf-8'))
    assert document['permissions'] == {'contents': 'read'}
    for job in document['jobs'].values():
        if 'uses' in job:
            assert job['uses'] == './.github/workflows/quality.yml'
        for step in job.get('steps', []):
            if 'run' in step:
                assert isinstance(step['run'], str)
            if 'uses' in step:
                assert re.fullmatch(r'actions/[a-z-]+@[0-9a-f]{40}', step['uses'])


def test_pages_requires_successful_quality_before_upload_and_deployment():
    pages = yaml.safe_load((ROOT / '.github/workflows/pages.yml').read_text(encoding='utf-8'))
    quality = yaml.safe_load((ROOT / '.github/workflows/quality.yml').read_text(encoding='utf-8'))
    # Accept both a quoted "on" and PyYAML's YAML 1.1 interpretation as True.
    triggers = quality.get('on', quality.get(True))
    assert set(triggers) == {'pull_request', 'workflow_dispatch', 'workflow_call'}
    assert triggers['pull_request']['branches'] == ['main']
    assert set(quality['jobs']) == {'javascript', 'python'}
    for job in quality['jobs'].values():
        assert 'if' not in job
    jobs = pages['jobs']
    assert jobs['quality']['uses'] == './.github/workflows/quality.yml'
    assert jobs['quality']['permissions'] == {'contents': 'read'}
    assert jobs['quality']['if'] == "github.ref == 'refs/heads/main'"
    assert needs_list(jobs['build']) == ['quality']
    assert jobs['build']['if'] == "github.ref == 'refs/heads/main'"
    assert needs_list(jobs['deploy']) == ['build']
    assert 'if' not in jobs['deploy']
    for job in jobs.values():
        assert 'always()' not in str(job.get('if', ''))
        assert '!cancelled()' not in str(job.get('if', ''))
    for job in [*jobs.values(), *quality['jobs'].values()]:
        assert not job.get('continue-on-error', False)
        for step in job.get('steps', []):
            assert not step.get('continue-on-error', False)
    commands = [step['run'] for step in quality['jobs']['javascript']['steps'] if 'run' in step]
    assert 'npm run lint' in commands
    assert 'npm test' in commands
    commands = [step['run'] for step in quality['jobs']['python']['steps'] if 'run' in step]
    assert 'python -m ruff check . --output-format=github' in commands
    assert 'python -m pytest -q' in commands


@pytest.mark.parametrize('ecosystem', ['github-actions', 'npm', 'uv'])
def test_dependabot_checks_dependencies_weekly(ecosystem):
    document = yaml.safe_load((ROOT / '.github/dependabot.yml').read_text(encoding='utf-8'))
    assert document['version'] == 2
    update = next(update for update in document['updates'] if update['package-ecosystem'] == ecosystem)
    assert update['directory'] == '/'
    assert update['schedule'] == {
        'interval': 'weekly', 'day': 'monday', 'time': '09:00', 'timezone': 'Europe/Amsterdam',
    }
    assert update['open-pull-requests-limit'] == 5


def test_dependabot_uv_compile_retains_runtime_constraint_and_no_build_policy():
    config = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    assert config['tool']['uv']['no-build'] is True
    assert '-c requirements.txt' in (ROOT / 'requirements-dev.in').read_text(encoding='utf-8').splitlines()
    for filename in ['requirements.txt', 'requirements-dev.txt']:
        lock = (ROOT / filename).read_text(encoding='utf-8')
        header = lock.splitlines()[1]
        assert 'uv pip compile' in header
        assert '--universal' in header
        assert '--python-version 3.11' in header
        assert '--generate-hashes' in header


def test_quality_workflow_runs_the_full_source_independent_python_suite():
    document = yaml.safe_load((ROOT / '.github/workflows/quality.yml').read_text(encoding='utf-8'))
    job = document['jobs']['python']
    assert job['strategy']['matrix']['include'] == [
        {'os': 'ubuntu-latest', 'python-version': '3.11'},
        {'os': 'ubuntu-latest', 'python-version': '3.13'},
        {'os': 'windows-latest', 'python-version': '3.13'},
    ]
    commands = [step['run'] for step in job['steps'] if 'run' in step]
    assert 'python -m pytest -q' in commands
    assert 'python -m pip install --require-hashes --only-binary=:all: -r requirements-dev.txt' in commands
