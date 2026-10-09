# Ubuntu 26.04 compatibility

[Ubuntu 26 Compatibility](../.github/workflows/ubuntu-26.yml) runs on pull requests
to main and manual dispatch. It explicitly selects `ubuntu-26.04`, independently
of the version selected by `ubuntu-latest`.

It runs the production Node.js 24 install, ESLint, and browser tests; Python 3.11
and 3.13 hashed wheel-only installs, `pip check`, Ruff, and the full pytest suite;
then the production Pages configuration and static `site/` artifact upload.
It uses committed datasets without regeneration or private source access.
The artifact has a distinct name and expires after one day. This workflow has
no deployment job, Pages write permission, or OIDC permission.

The checks remain separate from the production matrix so its four required PR
status names stay unchanged. There is no push trigger, so Pages continues to run
its full quality matrix once per push to main. Tests compare compatibility steps
against the production workflows to prevent the copies drifting apart.

GitHub announced the [`ubuntu-latest` migration](https://github.com/actions/runner-images/issues/14748)
starting October 19, 2026. Before merging this change, verify the explicit Ubuntu
26.04 quality jobs and Pages artifact job are all green. Keep production on
`ubuntu-latest` if they pass. If they fail, document the failure and pin affected
production runners to `ubuntu-24.04` until the incompatibility is resolved.

After the rollout, rerun this workflow for runner-image or dependency changes.
Review whether the extra compatibility runs are still useful once production
consistently uses Ubuntu 26.04.
