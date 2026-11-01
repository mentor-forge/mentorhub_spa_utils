# F057 – Audit npm distribution, exports and provider-neutral auth contract

**Status**: Pending

**Type**: Feature

**Depends On**: none

**Description**: Remove AWS/CodeArtifact and deliver versioned SPA utils through GitHub — audit npm distribution, exports and provider-neutral auth contract.

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

Source issue is authoritative for this migration. The agreed migration supersedes old CodeArtifact-auth prerequisites only in the paths explicitly migrated by these tasks; do not rewrite unrelated framework rules.

## Goals

- Record current 1.0.6, package exports, prepare/build lifecycle, .npmrc.example, existing release workflow and locks. Dist must contain JS, declarations, CSS and exported Cypress helpers.
- Document GitHub npm package identity, public visibility, repository association, read:packages onboarding, packages: write publication and explicit consumer Actions access. Public npm remains the default for third-party dependencies.
- Audit useAuth/idpRedirect/urlAuthBootstrap and tests for actual AWS dependencies versus example URLs; preserve configurable commercial IdP routing and claim contracts. Do not add an IdP implementation or change auth APIs for a delivery-only migration.

### Craftsmanship Expectations

Keep package, auth and deployment ownership in the existing shared modules. Preserve APIs and runtime contracts unless the recorded migration decision explicitly requires a change; remove obsolete AWS auth knowledge rather than duplicate it. Keep every dependency reference reproducible.

## Testing Expectations

These checks are for future execution; none were run while creating this plan.

- Review package export map and npm pack --dry-run expectations; record runtime coupling or evidence of absence without selecting a new provider.

## Outputs

- `docs/github-package-distribution.md`

Only these implementation files may change. The orchestrator may also update/rename this task record under the established lifecycle.

## Execution boundary

This is a reviewable plan, not an execution record. Execute only this task's listed outputs when orchestration is separately authorized. Do not touch excluded MongoDB/Runbook utility repos, publish packages/tags, mutate issue/project state, or delete/provision AWS resources as a side effect. Future workflow publication happens only through the reviewed maintainer release path.

Where a task requires an unpublished release, an undecided production contract, unavailable live schema or operator evidence, stop execution at that prerequisite and report it; do not guess values or substitute the unrelated PyPI api-utils package. Pending status describes the plan's review state, not proof that external execution gates are satisfied.

## External prerequisites

System runtime decisions are coordinated in https://github.com/mentor-forge/mentorhub/issues/80. Consumer cutover follows the maintainer-authorized publication of this repo's release; editing consumer repos is outside this plan.

## Execution Notes

Reserved for the execution agent. No implementation, tests, service changes or publication have been performed.
