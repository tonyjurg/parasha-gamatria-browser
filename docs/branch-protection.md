# Require quality checks before merging

The versioned [main ruleset](../.github/rulesets/main.json) requires a pull request,
all four standalone Code Quality checks from GitHub Actions, an up-to-date branch,
and resolved review conversations. It prevents force pushes and deletion of main.
No approving review is required, so the repository owner can merge their own PR
after its checks pass. The bypass list is empty: administrators and bots must
also use PRs and satisfy the checks. This does not enable a merge queue.

## Activate after merging

Merging the JSON file does **not** change GitHub settings. A repository administrator
must import it under **Settings > Rules > Rulesets > New ruleset > Import a ruleset**,
review it, and save with enforcement **Active**. If this named ruleset already
exists, update it rather than creating another one.

Alternatively, from the repository root with an authenticated GitHub CLI and
repository administration permission, first inspect existing rulesets:

```sh
gh api repos/tonyjurg/parasha-gematria-browser/rulesets
```

If none has the name `Require Code Quality on main`, create it:

```sh
gh api --method POST repos/tonyjurg/parasha-gematria-browser/rulesets --input .github/rulesets/main.json
```

To update an existing ruleset, use `--method PUT` and append its numeric ID to
the endpoint instead. Review the existing policy before replacing it.

The configuration uses the standalone PR check names, without the `quality /`
prefix used by Pages. Integration ID 15368 is GitHub Actions. If the production
matrix changes, update these names and the active ruleset together. Separate
Ubuntu compatibility runs do not change the required production check names.

## Verify enforcement before closing issue #3

1. Read the effective rules with
   `gh api repos/tonyjurg/parasha-gematria-browser/rules/branches/main` and verify
   the PR requirement, four status checks, strict up-to-date policy, and no bypass.
2. On a disposable PR branch, introduce a failing lint or pytest change. Confirm
   its quality check fails and GitHub blocks merging. Do not merge that change.
3. Remove the deliberate failure and rerun the checks. Confirm an up-to-date PR
   with all four checks successful and no unresolved conversations can merge.
4. Close the test PR and record the evidence in issue #3 before closing the issue.

Until activation and these checks are complete, deployment is gated but merge
protection remains a follow-up. See GitHub's [ruleset documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets)
and [repository rules REST API](https://docs.github.com/en/rest/repos/rules).
