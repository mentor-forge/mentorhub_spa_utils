# F046 – Patch version 1.0.1 for navigation updates

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F045  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` to **1.0.1** (patch: hamburger catalog, logout `return_to`, hosting Settings `/config`, Token claim labels) and verify the distributable before release.

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
- `CONTRIBUTING.md` — Versioning and release (`npm run patch`, no git tag from the version script)
- the status-prefixed task records matching F041–F045
- `tasks/SHIPPED.F032.patch_version_responsive_card_grid.md` — prior patch verification pattern
- `README.md` — install example currently `@mentor-forge/mentorhub_spa_utils@1.0.0`
- `package.json`
- `package-lock.json`
- `src/components/index.ts`
- `src/utils/index.ts`

GitHub: https://github.com/mentor-forge/mentorhub_spa_utils/issues/31 (patch-level update).

The planned starting version is `1.0.0`. Re-read both package files at execution time. Maintainer decision: ship as **patch `1.0.1`**. Use **`npm run patch`**. Stop and ask the developer if repository state would make `npm run patch` produce any other version.

## Goals

- Confirm F041–F045 are shipped: catalog/logout/padding, Token claims, demo/Cypress `/config`, docs, downstream ISSUE seeds.
- Run the repository patch-version command so `package.json` and `package-lock.json` are synchronized at exactly `1.0.1`.
- Update README install/version examples to `@mentor-forge/mentorhub_spa_utils@1.0.1`.
- Verify declarations still export `PageFrame`, `buildJourneyUrl`, `resolveAlbOrigin`, `hostingConfigHref` (or the F041 helper name), `visibleUniversalNavItems`, `AdminPage`, `TokenClaimsCard`.
- Perform complete pre-release test/build verification before any tag or CodeArtifact publication.
- Do not publish, tag, push a release tag, or change downstream SPA dependencies in this task. The orchestrator opens the PR after this workflow; a human tags and publishes from `main` per `CONTRIBUTING.md`.

### Craftsmanship Expectations

- Version metadata only plus README install pins. Do not mix in further catalog or Token edits.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch` and confirm the result is exactly `1.0.1`.
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint`
- `npm run build`
- Inspect `dist/index.d.ts`, `dist/components/index.d.ts`, and `dist/utils` for `PageFrame`, journey URL helpers including the F041 hosting-config export, and `TokenClaimsCard`.
- Confirm `package.json`, the root package entry in `package-lock.json`, and README install examples all say `1.0.1`.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references only

The agent must not edit implementation, tests, demo/Cypress behavior, ISSUE seeds, release scripts, tags, downstream repositories, or CodeArtifact in this task.

## Execution Notes

### Plan

1. Confirmed F041–F045 are `SHIPPED.*`; `package.json` / lockfile root are **1.0.0**. `npm run patch` (`npm version patch --no-git-tag-version`) should yield exactly **1.0.1**.
2. Run `mh` if CodeArtifact auth is needed, then `npm run patch`. Abort if result ≠ `1.0.1`.
3. Update README install/adopt pins `@mentor-forge/mentorhub_spa_utils@1.0.0` → `@1.0.1` only. Leave historical notes (“Removed in 1.0.0”, “added in 1.0.0”, “Universal PageFrame (1.0.0)”).
4. Verify: `npm run test`, `test:coverage`, `lint`, `build`; inspect dist for PageFrame, journey URL helpers, hosting-config export, TokenClaimsCard, AdminPage.
5. No publish/tag/push/downstream SPA or implementation edits. Record Results here.

### Results

- **Version**: `npm run patch` from 1.0.0 produced exactly **v1.0.1**. `package.json` version, lockfile root (`""` package), and README install/adopt pins are **1.0.1**. Historical notes (“Removed in 1.0.0”, “added in 1.0.0”, “Universal PageFrame (1.0.0)”) left unchanged.
- **Edited files**: `package.json`, `package-lock.json`, `README.md` (install/adopt pins only), plus this Execution Notes section. No implementation, tests, demo/Cypress, ISSUE seeds, or release scripts.
- **Not done** (by design): no publish, tag, push, or downstream SPA dependency changes.

### Commands

- `mh` — CodeArtifact auth refreshed
- `npm run patch` — `v1.0.1`
- `npm run test` — 40 files, 435 tests passed
- `npm run test:coverage` — 435 tests passed; **pre-existing** `src/utils/**` threshold failures only (`admin.ts` 32% stmts / 16.66% funcs, `urlAuthBootstrap.ts` 12% lines — untested modules; `idpRedirect.ts` 83.92% lines also under the 100% utils threshold). Exit code 1 from thresholds only.
- `npm run lint` — **blocked**: `eslint: command not found` (same pre-existing tooling gap as F026/F028/F032/F040; eslint is not a package.json dependency)
- `npm run build` — succeeded (`dist/index.js` 94.88 kB, `dist/index.css` 5.56 kB)

### Dist export verification

- `dist/index.d.ts` re-exports `./composables`, `./components`, `./utils`.
- `dist/components/index.d.ts` exports `PageFrame`, `AdminPage`, `TokenClaimsCard`.
- `dist/composables` exports `visibleUniversalNavItems`.
- `dist/utils/journeyUrls.d.ts` exports `buildJourneyUrl`, `resolveAlbOrigin`, `hostingConfigHref`.
- `dist/index.js` named exports include `PageFrame`, `AdminPage`, `TokenClaimsCard`, `buildJourneyUrl`, `hostingConfigHref`, `resolveAlbOrigin`, `visibleUniversalNavItems`.

**Orchestrator confirmation:** Re-ran `npm run test` (40 files, 435 passed) and `npm run build`. `package.json`, lockfile root, and README install/adopt pins are **1.0.1**. Dist exports `PageFrame`, `AdminPage`, `TokenClaimsCard`, `buildJourneyUrl`, `resolveAlbOrigin`, `hostingConfigHref`, and `visibleUniversalNavItems`.
