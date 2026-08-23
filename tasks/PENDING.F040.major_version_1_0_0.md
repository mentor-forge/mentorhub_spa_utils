# F040 – Major version 1.0.0

**Status**: Pending  
**Type**: Feature  
**Depends On**: F039  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` to **1.0.0** (major: infinite-scroll API removed; universal `PageFrame` / ALB nav added), sync lockfile and README install examples, and verify the distributable before release.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `src/...`, `dist/...` (generated), `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — dependency and packaging standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `CONTRIBUTING.md` — Versioning and release (`npm run major`, no git tag from the version script)
- the status-prefixed task records matching F033–F039
- `tasks/SHIPPED.F032.patch_version_responsive_card_grid.md` — prior version-verification pattern (this task is **major**)
- `README.md` — install example currently `@mentor-forge/mentorhub_spa_utils@0.5.7`; F034 Removed note and F038 PageFrame docs without a 1.0.0 pin
- `package.json`
- `package-lock.json`
- `src/components/index.ts`
- `src/utils/index.ts`

The planned starting version is `0.5.7`. Re-read both package files at execution time. Maintainer decision: ship as **major `1.0.0`**. Use **`npm run major`**. Stop and ask the developer if repository state would make `npm run major` produce any other version.

## Goals

- Confirm F033–F039 are shipped: infinite-scroll gone, PageFrame/nav present, demo/Cypress/docs/ISSUE seeds done.
- Run the repository major-version command so `package.json` and `package-lock.json` are synchronized at exactly `1.0.0`.
- Update README install/version examples to `@mentor-forge/mentorhub_spa_utils@1.0.0`.
- Label the infinite-scroll note **Removed in 1.0.0**.
- Note **1.0.0** on the PageFrame / `buildJourneyUrl` docs (breaking chrome replacement for journey SPAs).
- Verify declarations export `PageFrame`, `buildJourneyUrl`, `resolveAlbOrigin` and still omit `useInfiniteScroll` / `InfiniteScroll*`.
- Perform complete pre-release test/build verification before any tag or CodeArtifact publication.
- Do not publish, tag, push a release tag, or change downstream SPA dependencies in this task. The orchestrator opens the PR after this workflow; a human tags and publishes from `main` per `CONTRIBUTING.md`.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run major` and confirm the result is exactly `1.0.0`.
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint`
- `npm run build`
- Inspect `dist/index.d.ts`, `dist/components/index.d.ts`, and `dist/utils` for the expected exports and the four removed infinite-scroll names.
- Confirm `package.json`, the root package entry in `package-lock.json`, and README install examples all say `1.0.0`.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references and **1.0.0** labels only

The agent must not edit implementation, tests, demo/Cypress behavior, ISSUE seeds, release scripts, tags, downstream repositories, or CodeArtifact in this task.

## Execution Notes

Reserved for the task execution agent.
