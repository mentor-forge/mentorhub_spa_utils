# F028 – Patch release for Enum and EnumArray type editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F027  
**Description**: Apply the requested patch version bump for the runtime-configured Enum and EnumArray Type Editors and verify the distributable package.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `src/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — dependency and packaging standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F026.enum_type_editors.md` — implementation and completed test notes
- `tasks/PENDING.F027.demo_and_document_enum_editors.md` — demo/docs and completed test notes
- `tasks/SHIPPED.F024.bump_version_cards_editors.md` — prior release task pattern
- `README.md`
- `CONTRIBUTING.md`
- `package.json`
- `package-lock.json`
- `src/index.ts`
- `src/components/index.ts`
- `src/composables/index.ts`

The current planned starting version is `0.5.1`. Re-read `package.json` at execution time and apply exactly one patch increment to the then-current version rather than assuming it is unchanged.

## Goals

- Run the repository's patch-version command so `package.json` and `package-lock.json` receive one synchronized patch increment. From `0.5.1`, the target is `0.5.2`.
- Update README install/version examples to the resulting package version.
- Verify the package root, `./components`, and `./composables` entry points expose the new editors and runtime config APIs in generated declarations and build output.
- Confirm the release remains non-breaking: legacy `AutoSaveField` and `AutoSaveSelect` exports are still present.
- Do not publish, create a git tag, push, or change downstream SPA dependencies in this task.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch`
- `npm install --include=dev` only if lockfile synchronization requires it
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run build`
- Inspect generated declarations/build exports for `EnumEditor`, `EnumArrayEditor`, and the runtime config provider/resolver.
- Confirm `package.json` and the root package entry in `package-lock.json` contain the same version.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references only

The agent must not modify editor implementation, tests, demo files, legacy components, publishing workflows, tags, or downstream repositories in this task.

## Execution Notes

Reserved for version command, verification results, and release follow-ups.
