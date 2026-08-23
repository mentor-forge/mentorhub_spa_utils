# F040 – Major version 1.0.0

**Status**: Shipped  
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

### Plan

1. Confirmed F033–F039 are `SHIPPED.*`; starting version in `package.json` / lockfile root is **0.5.7** (major → **1.0.0**).
2. Run `mh` if needed, then `npm run major`; abort if result ≠ `1.0.0`.
3. Update README: install example `@1.0.0`; label infinite-scroll section **Removed in 1.0.0**; note **1.0.0** on PageFrame / `buildJourneyUrl` (breaking chrome replacement). Leave historical **Release 0.5.7** IdP note unchanged.
4. Verify: `npm run test`, `test:coverage`, `lint`, `build`; inspect dist exports for PageFrame/buildJourneyUrl/resolveAlbOrigin and absence of infinite-scroll names.
5. No publish/tag/push/downstream changes.

### Commands

- `mh` — not required (no CodeArtifact install during this task)
- Starting version in `package.json` / lockfile root: **0.5.7**
- `npm run major` → **v1.0.0** (`package.json`, `package-lock.json` root, and `packages[""].version` all **1.0.0**)
- README updates:
  - install example: `@mentor-forge/mentorhub_spa_utils@1.0.0`
  - infinite-scroll heading: **Removed in 1.0.0**
  - Universal PageFrame section: **1.0.0** breaking chrome replacement note
  - Cross-SPA URLs / `buildJourneyUrl`: **added in 1.0.0** + breaking chrome note
  - **Release 0.5.7** IdP note left unchanged
- `npm install --include=dev` — not required (lockfile synchronized by `npm version major`)
- `npm run test` — **418/418 passed** (39 files)
- `npm run test:coverage` — tests passed; **pre-existing** `src/utils/**` threshold failures only (`admin.ts` 16% lines, `urlAuthBootstrap.ts` 12% lines — untested modules). Exit code 1 from thresholds only.
- `npm run lint` — **blocked**: `eslint: command not found` (same tooling gap as F026/F028/F032)
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`)

### Export verification (dist)

- `dist/components/index.d.ts`: exports `PageFrame`
- `dist/utils/journeyUrls.d.ts`: exports `buildJourneyUrl`, `resolveAlbOrigin`
- `dist/utils/index.d.ts`: re-exports `./journeyUrls`
- `dist/index.d.ts`: re-exports `./components` and `./utils` (package-root consumers get all three)
- `dist/index.js`: exports `PageFrame`, `buildJourneyUrl`, `resolveAlbOrigin`
- No `useInfiniteScroll`, `InfiniteScrollResponse`, `InfiniteScrollParams`, or `UseInfiniteScrollOptions` in dist

### Version confirmation

- `package.json`: **1.0.0**
- `package-lock.json` root + `packages[""].version`: **1.0.0**
- README install example: **1.0.0**

### Blockers

None for version bump / README / verification. Lint blocked by missing eslint binary (pre-existing environment gap).

**Orchestrator confirmation:** Re-ran `npm run test` (39 files, 418 tests) and `npm run build` as `@mentor-forge/mentorhub_spa_utils@1.0.0`. Dist exports `PageFrame`, `buildJourneyUrl`, `resolveAlbOrigin`; infinite-scroll names absent. `package.json`, lockfile root, and README install example are **1.0.0**. `npx eslint` failed with CodeArtifact 401 (pre-existing lint gap).
