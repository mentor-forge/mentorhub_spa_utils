# F060 – Prepare npm patch release and contributor documentation

**Status**: Pending

**Type**: Feature

**Depends On**: F059

**Description**: Remove AWS/CodeArtifact and deliver versioned SPA utils through GitHub — prepare npm patch release and contributor documentation.

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
- `package.json`
- `package-lock.json`
- `CONTRIBUTING.md`

Source issue is authoritative for this migration. The agreed migration supersedes old CodeArtifact-auth prerequisites only in the paths explicitly migrated by these tasks; do not rewrite unrelated framework rules.

## Goals

- Run the existing patch version command during implementation, advancing from observed 1.0.6 to next unused patch (1.0.7 candidate). Match package.json and lock root; do not reuse an existing published version.
- Update README, CONTRIBUTING and active dependency guidance in tasks/_PLANNING.md for exact GitHub npm versions, environment token setup, public transitives and rollback. Keep repo framework instructions static except stale dependency guidance.
- Provide maintainer merge/tag/publication handoff and independent SemVer policy. Do not tag, publish, push or alter consumers here.

### Craftsmanship Expectations

Keep package, auth and deployment ownership in the existing shared modules. Preserve APIs and runtime contracts unless the recorded migration decision explicitly requires a change; remove obsolete AWS auth knowledge rather than duplicate it. Keep every dependency reference reproducible.

## Testing Expectations

These checks are for future execution; none were run while creating this plan.

- npm install --include=dev, npm run test, npm run build, npm pack inspection and version consistency; npm run lint where available (record existing missing eslint separately, do not broaden scope).

## Outputs

- `package.json`
- `package-lock.json`
- `README.md`
- `CONTRIBUTING.md`
- `tasks/_PLANNING.md`
- `docs/github-package-distribution.md`

Only these implementation files may change. The orchestrator may also update/rename this task record under the established lifecycle.

## Execution boundary

This is a reviewable plan, not an execution record. Execute only this task's listed outputs when orchestration is separately authorized. Do not touch excluded MongoDB/Runbook utility repos, publish packages/tags, mutate issue/project state, or delete/provision AWS resources as a side effect. Future workflow publication happens only through the reviewed maintainer release path.

Where a task requires an unpublished release, an undecided production contract, unavailable live schema or operator evidence, stop execution at that prerequisite and report it; do not guess values or substitute the unrelated PyPI api-utils package. Pending status describes the plan's review state, not proof that external execution gates are satisfied.

## External prerequisites

System runtime decisions are coordinated in https://github.com/mentor-forge/mentorhub/issues/80. Consumer cutover follows the maintainer-authorized publication of this repo's release; editing consumer repos is outside this plan.

## Execution Notes

Reserved for the execution agent. No implementation, tests, service changes or publication have been performed.
