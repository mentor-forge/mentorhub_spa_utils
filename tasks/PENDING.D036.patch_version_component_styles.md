# D036 – Patch version for component style packaging

**Status**: Pending  
**Type**: Defect  
**Depends On**: D035  
**Description**: Apply the exact next patch package version for the CardGrid / component stylesheet packaging fix, then verify the complete distributable before release.

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
- the status-prefixed task records matching D034 and D035
- `tasks/SHIPPED.F032.patch_version_responsive_card_grid.md` — prior patch verification pattern
- `README.md`
- `CONTRIBUTING.md` — release workflow
- `package.json`
- `package-lock.json`
- `src/index.ts`
- `src/components/index.ts`

The planned starting version is `0.5.3`. Re-read both package files at execution time. Ship as a **patch** (expected `0.5.4`) because this is a packaging defect fix with no intentional public API behavior change. Stop and ask the developer if repository state would make `npm run patch` produce any other version, or if `0.5.3` was never published and they prefer to release the CSS fix under a different semver decision.

## Goals

- Confirm D034–D035 are shipped and their packaging fix, tests, and README are present before changing package metadata.
- Run the repository patch-version command so `package.json` and `package-lock.json` are synchronized at exactly one patch increment (expected `0.5.4`).
- Update README install/version examples to the new exact version.
- Verify generated declarations and build output still export `CardGrid` from package root and `./components`.
- Verify the chosen CSS delivery mechanism from D034 is present in the built package (JS side-effect import and/or `exports` style entry + `dist` CSS artifact with CardGrid rules).
- Perform the complete pre-release test/build verification before any tag or CodeArtifact publication.
- Do not publish, tag, push a release tag, or change downstream SPA dependencies in this task. Publishing is gated by D037 after the release PR is merged to `main`.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch` and confirm the result is exactly the expected next patch (planned `0.5.4`).
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint` if available; record pre-existing tooling gaps separately
- `npm run build`
- Inspect `dist/index.js`, `dist/index.css` (or chosen CSS path), package-root declarations, and `package.json` `exports` for `CardGrid` plus the style-delivery contract from D034.
- Confirm `package.json`, the root package entry in `package-lock.json`, and README install examples all say the new patch version.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references only (unless a version pin in prose must match)

The agent must not edit implementation, packaging approach, tests, demo/Cypress behavior, release scripts, tags, downstream repositories, or CodeArtifact in this task.

## Execution Notes
