# F059 – Replace AWS release Actions and add package validation CI

**Status**: Pending

**Type**: Feature

**Depends On**: F058

**Description**: Remove AWS/CodeArtifact and deliver versioned SPA utils through GitHub — replace aws release actions and add package validation ci.

**Issue**: [I-US01](https://github.com/mentor-forge/mentorhub_spa_utils/issues/43)

## Path anchoring

All output paths are relative to this repository root. Sibling references are read-only context permitted by the repo planning guide.

## Context

- `README.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `../mentorhub/DeveloperEdition/standards/ArchitecturePrinciples.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `.github/workflows/publish-package.yml`

Source issue is authoritative for this migration. The agreed migration supersedes old CodeArtifact-auth prerequisites only in the paths explicitly migrated by these tasks; do not rewrite unrelated framework rules.

## Goals

- Configure setup-node registry-url https://npm.pkg.github.com, correct scope and token. Publish with workflow GITHUB_TOKEN and packages: write, contents: read; remove AWS secrets/OIDC/auth steps.
- Require tag/package-version agreement, tests/build and packed artifact checks before publish. Validate npm lifecycle/prepare behavior does not produce a different artifact at publication.
- Add separate PR CI for npm ci, tests, build and package-content checks with no publish permissions. Grant consumer repos package access via documented maintainer steps; GitHub npm packages default private, so public visibility must be explicitly verified after first publication.

### Craftsmanship Expectations

Keep package, auth and deployment ownership in the existing shared modules. Preserve APIs and runtime contracts unless the recorded migration decision explicitly requires a change; remove obsolete AWS auth knowledge rather than duplicate it. Keep every dependency reference reproducible.

## Testing Expectations

These checks are for future execution; none were run while creating this plan.

- Check workflow syntax, least privilege and tag versus PR triggers; no AWS env/roles or token echo. Exercise npm ci/test/build and inspect packed artifact. Actual registry publication/access verification is after authorized merge/tag, not during planning or dry-run checks.

## Outputs

- `.github/workflows/publish-package.yml`
- `.github/workflows/ci.yml`
- `docs/github-package-distribution.md`

Only these implementation files may change. The orchestrator may also update/rename this task record under the established lifecycle.

## Execution boundary

This is a reviewable plan, not an execution record. Execute only this task's listed outputs when orchestration is separately authorized. Do not touch excluded MongoDB/Runbook utility repos, publish packages/tags, mutate issue/project state, or delete/provision AWS resources as a side effect. Future workflow publication happens only through the reviewed maintainer release path.

Where a task requires an unpublished release, an undecided production contract, unavailable live schema or operator evidence, stop execution at that prerequisite and report it; do not guess values or substitute the unrelated PyPI api-utils package. Pending status describes the plan's review state, not proof that external execution gates are satisfied.

## External prerequisites

System runtime decisions are coordinated in https://github.com/mentor-forge/mentorhub/issues/80. Consumer cutover follows the maintainer-authorized publication of this repo's release; editing consumer repos is outside this plan.

## Execution Notes

Reserved for the execution agent. No implementation, tests, service changes or publication have been performed.
