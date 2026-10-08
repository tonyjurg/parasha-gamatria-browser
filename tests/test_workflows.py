from pathlib import Path
import re
import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]


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
    # PyYAML's YAML 1.1 loader interprets the unquoted "on" key as True.
    assert 'workflow_call' in quality[True]
    jobs = pages['jobs']
    assert jobs['quality']['uses'] == './.github/workflows/quality.yml'
    assert jobs['quality']['permissions'] == {'contents': 'read'}
    assert jobs['quality']['if'] == "github.ref == 'refs/heads/main'"
    assert jobs['build']['needs'] == 'quality'
    assert jobs['build']['if'] == "github.ref == 'refs/heads/main'"
    assert jobs['deploy']['needs'] == 'build'
    assert 'if' not in jobs['deploy']
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


def test_dependabot_checks_actions_weekly():
    document = yaml.safe_load((ROOT / '.github/dependabot.yml').read_text(encoding='utf-8'))
    assert document['version'] == 2
    actions = next(update for update in document['updates'] if update['package-ecosystem'] == 'github-actions')
    assert actions['directory'] == '/'
    assert actions['schedule']['interval'] == 'weekly'


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
