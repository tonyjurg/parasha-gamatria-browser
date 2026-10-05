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
        for step in job['steps']:
            if 'run' in step:
                assert isinstance(step['run'], str)
            if 'uses' in step:
                assert re.fullmatch(r'actions/[a-z-]+@[0-9a-f]{40}', step['uses'])


def test_dependabot_checks_actions_weekly():
    document = yaml.safe_load((ROOT / '.github/dependabot.yml').read_text(encoding='utf-8'))
    assert document['version'] == 2
    actions = next(update for update in document['updates'] if update['package-ecosystem'] == 'github-actions')
    assert actions['directory'] == '/'
    assert actions['schedule']['interval'] == 'weekly'
