# F032 – Patch version for responsive CardGrid

**Status**: Pending  
**Type**: Feature  
**Depends On**: F031  
**Description**: Apply the exact `0.5.3` package version for the CardGrid layout harvest, then verify the complete distributable before release.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `src/...`, `demo/...`, `tests/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — dependency and packaging standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- the status-prefixed task records matching F029, F030, and F031
- `tasks/SHIPPED.F028.patch_version_enum_editors.md` — prior version verification pattern
- `README.md`
- `CONTRIBUTING.md` — release workflow
- `package.json`
- `package-lock.json`
- `src/index.ts`
- `src/components/index.ts`

The planned starting version is `0.5.2`. Re-read both package files at execution time. Maintainer decision: ship as a **patch** (`0.5.3`) even though `CardGrid` changes expanded-card height defaults and removes Vuetify breakpoint props — early-dev consumers are expected to adopt the intended layout. The exact target version is `0.5.3`; stop and ask the developer if repository state would make `npm run patch` produce any other version.

## Goals

- Confirm F029–F031 are shipped and their implementation, tests, demo, Cypress coverage, and README are present before changing package metadata.
- Run the repository patch-version command so `package.json` and `package-lock.json` are synchronized at exactly `0.5.3`.
- Update README install/version examples to `@mentor-forge/mentorhub_spa_utils@0.5.3`.
- Verify generated declarations and build output still export `CardGrid` from package root and `./components`.
- Verify the public `CardGrid` declaration no longer advertises `cols`, `sm`, `md`, `lg`, or `xl`, while retaining `automationId`.
- Perform the complete pre-release test/build/demo verification before any tag or CodeArtifact publication.
- Do not publish, tag, push a release tag, or change downstream SPA dependencies in this task. Publishing is gated by F033 after the release PR is merged to `main`.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch` and confirm the result is exactly `0.5.3`.
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint`
- `npm run build`
- Run the dashboard Cypress spec against `npm run dev`.
- Inspect `dist/index.js`, package-root declarations, and `dist/components/index.d.ts` for the expected `CardGrid` export and prop surface.
- Confirm `package.json`, the root package entry in `package-lock.json`, and README install examples all say `0.5.3`.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references only

The agent must not edit implementation, tests, demo/Cypress behavior, release scripts, tags, downstream repositories, or CodeArtifact in this task.

## Execution Notes
