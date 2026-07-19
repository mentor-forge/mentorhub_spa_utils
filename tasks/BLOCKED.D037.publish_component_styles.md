# D037 – Publish component style packaging patch

**Status**: Blocked  
**Type**: Defect  
**Depends On**: D036  
**Description**: After the release PR is merged, tag the clean `main` commit for the component-style packaging patch, allow the release workflow to publish it, and verify the package in CodeArtifact includes resolvable component CSS for `CardGrid` consumers.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `CONTRIBUTING.md`, `scripts/...`, `tasks/...`

## Context

Always read these files before release:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — CodeArtifact dependency standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md` — AWS authentication
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- the shipped task records for D034 through D036
- `README.md`
- `CONTRIBUTING.md`, especially the release workflow
- `package.json`
- `package-lock.json`
- `scripts/tag-release.sh`
- `scripts/publish-package.sh`

### Blocker / promotion condition

Keep this task blocked and out of the feature-branch orchestration sequence until all of the following are true:

- D034–D036 are shipped.
- Their release PR has been reviewed and merged.
- The developer has returned to `main`, synchronized it with the remote, and confirmed a clean working tree.
- `package.json` and `package-lock.json` both contain the exact patch version produced by D036 (planned `0.5.4`).

After a human confirms those conditions, rename this task to `PENDING.D037.publish_component_styles.md` and set `Status: Pending`.

## Goals

- Confirm `@mentor-forge/mentorhub_spa_utils@<patch>` and git tag `v<patch>` do not already exist; stop rather than attempting a duplicate release if either exists.
- Re-run release-critical tests and build from the clean merged `main`.
- Run `npm run tag-release` from `main` to create and push the version tag.
- Let the repository GitHub Actions tag workflow perform the canonical CodeArtifact publication; do not run the local `publish-package` fallback unless the developer explicitly authorizes it after diagnosing a CI release failure.
- Verify the release workflow succeeded and CodeArtifact resolves the exact published patch version.
- Verify the published tarball:
  - package root / `./components` still expose `CardGrid`
  - CSS delivery from D034 is present (`dist` CSS artifact with `.mh-card-grid` rules, plus JS side-effect import and/or `exports` style entry as shipped)
- Record the tag, workflow run, CodeArtifact verification, and exact published semver in Execution Notes.
- Do not modify or bump downstream journey SPA dependencies; downstream adoption is a separate repository workflow (consumers must install this patch to receive layout CSS).

## Testing Expectations

Run all commands from this repository root.

- Confirm branch is `main`, it matches its remote, and the working tree is clean.
- Run `mh` if CodeArtifact credentials are needed.
- `npm ci`
- `npm run test`
- `npm run lint` if available
- `npm run build`
- Confirm `npm run tag-release` will target the exact D036 patch tag, then execute it once.
- Verify the tag-triggered GitHub Actions release completed successfully.
- Query the configured CodeArtifact npm registry for the published version and assert it matches exactly.
- Download/inspect the published package and confirm metadata, `CardGrid` exports, and the CSS packaging contract.

## Outputs

No product source files are changed by this release task.

External outputs:

- Git tag `v<patch>` (planned `v0.5.4`)
- Published CodeArtifact package `@mentor-forge/mentorhub_spa_utils@<patch>` (planned `0.5.4`)
- This task's status and Execution Notes updated after verification

## Execution Notes
