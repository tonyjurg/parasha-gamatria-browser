import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]


def test_main_ruleset_requires_all_standalone_quality_checks_without_bypass():
    policy = json.loads((ROOT / '.github/rulesets/main.json').read_text(encoding='utf-8'))
    workflow = yaml.safe_load((ROOT / '.github/workflows/quality.yml').read_text(encoding='utf-8'))
    assert policy['target'] == 'branch'
    assert policy['enforcement'] == 'active'
    assert policy['conditions'] == {'ref_name': {'include': ['refs/heads/main'], 'exclude': []}}
    assert policy['bypass_actors'] == []
    rules = {rule['type']: rule.get('parameters', {}) for rule in policy['rules']}
    assert {'pull_request', 'required_status_checks', 'deletion', 'non_fast_forward'} <= rules.keys()
    assert rules['pull_request']['required_approving_review_count'] == 0
    checks = rules['required_status_checks']
    assert checks['strict_required_status_checks_policy'] is True
    assert checks['do_not_enforce_on_create'] is False
    expected = {workflow['jobs']['javascript']['name']}
    for entry in workflow['jobs']['python']['strategy']['matrix']['include']:
        expected.add(
            workflow['jobs']['python']['name']
            .replace('${{ matrix.python-version }}', entry['python-version'])
            .replace('${{ matrix.os }}', entry['os'])
        )
    assert {check['context'] for check in checks['required_status_checks']} == expected
    assert all(check['integration_id'] == 15368 for check in checks['required_status_checks'])
