from copy import deepcopy
from pathlib import Path
import re

import yaml

ROOT = Path(__file__).resolve().parents[1]


def load_workflow(name):
    return yaml.safe_load((ROOT / f'.github/workflows/{name}.yml').read_text(encoding='utf-8'))


def test_ubuntu_26_runs_the_production_quality_steps_and_pages_build_without_deploying():
    compatibility = load_workflow('ubuntu-26')
    production = load_workflow('quality')
    pages = load_workflow('pages')
    triggers = compatibility.get('on', compatibility.get(True))
    assert set(triggers) == {'pull_request', 'workflow_dispatch'}
    assert triggers['pull_request']['branches'] == ['main']
    assert compatibility['permissions'] == {'contents': 'read'}
    assert compatibility['concurrency']['group'] != production['concurrency']['group']
    jobs = compatibility['jobs']
    assert set(jobs) == {'javascript', 'python', 'pages-build'}
    assert jobs['javascript']['runs-on'] == 'ubuntu-26.04'
    assert jobs['python']['strategy']['matrix']['include'] == [
        {'os': 'ubuntu-26.04', 'python-version': '3.11'},
        {'os': 'ubuntu-26.04', 'python-version': '3.13'},
    ]
    for name in ['javascript', 'python']:
        actual = deepcopy(jobs[name])
        expected = deepcopy(production['jobs'][name])
        actual.pop('name')
        expected.pop('name')
        if name == 'javascript':
            actual.pop('runs-on')
            expected.pop('runs-on')
        else:
            actual['strategy'].pop('matrix')
            expected['strategy'].pop('matrix')
        assert actual == expected
    build = jobs['pages-build']
    assert build['runs-on'] == 'ubuntu-26.04'
    assert build['needs'] == ['javascript', 'python']
    assert build['permissions'] == pages['jobs']['build']['permissions']
    actual_steps = deepcopy(build['steps'])
    assert actual_steps[-1]['with'].pop('name') == 'ubuntu-26-pages-smoke-test'
    assert actual_steps[-1]['with'].pop('retention-days') == 1
    assert actual_steps == pages['jobs']['build']['steps']
    for job in jobs.values():
        assert 'if' not in job
        assert not job.get('continue-on-error', False)
        assert 'environment' not in job
        assert 'id-token' not in job.get('permissions', {})
        for step in job['steps']:
            assert not step.get('continue-on-error', False)
            if 'uses' in step:
                assert re.fullmatch(r'actions/[a-z-]+@[0-9a-f]{40}', step['uses'])
                assert not step['uses'].startswith('actions/deploy-pages@')
