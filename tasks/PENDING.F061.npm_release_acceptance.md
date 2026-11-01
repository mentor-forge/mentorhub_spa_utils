# F061 – Verify published npm consumption and auth contracts

**Status**: Pending

**Type**: Feature

**Depends On**: F060

**Description**: Remove AWS/CodeArtifact and deliver versioned SPA utils through GitHub — verify published npm consumption and auth contracts.

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
- `tests/utils/idpRedirect.test.ts`
- `tests/composables/universalNav.test.ts`

Source issue is authoritative for this migration. The agreed migration supersedes old CodeArtifact-auth prerequisites only in the paths explicitly migrated by these tasks; do not rewrite unrelated framework rules.

## Goals

- Use an isolated consumer to install the actual exact GitHub npm version and commit a lock; verify public third-party registry resolution and required read:packages authentication.
- Confirm clean imports for JS/types, style.css and Cypress helper subpaths, plus login URL precedence, URL bootstrap and logout behavior. Replace Cognito-only example URLs only if necessary to express provider independence without changing behavior.
- Record package visibility, workflow/consumer access and clean-install evidence. Maintainer publication is a prerequisite; no fake success or consumer repo edits.

### Craftsmanship Expectations

Keep package, auth and deployment ownership in the existing shared modules. Preserve APIs and runtime contracts unless the recorded migration decision explicitly requires a change; remove obsolete AWS auth knowledge rather than duplicate it. Keep every dependency reference reproducible.

## Testing Expectations

These checks are for future execution; none were run while creating this plan.

- npm ci, npm run test, npm run test:coverage, npm run build; demo Cypress packaging verification with existing non-AWS backing services when required. Clean consumer install succeeds with read:packages and fails clearly without credentials. External prerequisite: authorized matching-tag publication.

## Outputs

- `docs/github-package-distribution.md`
- `tests/utils/idpRedirect.test.ts`
- `tests/composables/universalNav.test.ts`

Only these implementation files may change. The orchestrator may also update/rename this task record under the established lifecycle.

## Execution boundary

This is a reviewable plan, not an execution record. Execute only this task's listed outputs when orchestration is separately authorized. Do not touch excluded MongoDB/Runbook utility repos, publish packages/tags, mutate issue/project state, or delete/provision AWS resources as a side effect. Future workflow publication happens only through the reviewed maintainer release path.

Where a task requires an unpublished release, an undecided production contract, unavailable live schema or operator evidence, stop execution at that prerequisite and report it; do not guess values or substitute the unrelated PyPI api-utils package. Pending status describes the plan's review state, not proof that external execution gates are satisfied.

## External prerequisites

System runtime decisions are coordinated in https://github.com/mentor-forge/mentorhub/issues/80. Consumer cutover follows the maintainer-authorized publication of this repo's release; editing consumer repos is outside this plan.

## Execution Notes

Reserved for the execution agent. No implementation, tests, service changes or publication have been performed.
