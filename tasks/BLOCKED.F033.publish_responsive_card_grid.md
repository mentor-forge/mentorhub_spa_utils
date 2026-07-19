# F033 – Publish responsive CardGrid release

**Status**: Blocked  
**Type**: Feature  
**Depends On**: F032  
**Description**: After the release PR is merged, tag the clean `main` commit for exact version `0.5.3`, allow the release workflow to publish it, and verify the package in CodeArtifact.

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
- the shipped task records for F029 through F032
- `README.md`
- `CONTRIBUTING.md`, especially the release workflow
- `package.json`
- `package-lock.json`
- `scripts/tag-release.sh`
- `scripts/publish-package.sh`

### Blocker / promotion condition

Keep this task blocked and out of the feature-branch orchestration sequence until all of the following are true:

- F029–F032 are shipped.
- Their release PR has been reviewed and merged.
- The developer has returned to `main`, synchronized it with the remote, and confirmed a clean working tree.
- `package.json` and `package-lock.json` both contain exact version `0.5.3`.

After a human confirms those conditions, rename this task to `PENDING.F033.publish_responsive_card_grid.md` and set `Status: Pending`.

## Goals

- Confirm `@mentor-forge/mentorhub_spa_utils@0.5.3` and git tag `v0.5.3` do not already exist; stop rather than attempting a duplicate release if either exists.
- Re-run release-critical tests and build from the clean merged `main`.
- Run `npm run tag-release` from `main` to create and push `v0.5.3`.
- Let the repository GitHub Actions tag workflow perform the canonical CodeArtifact publication; do not run the local `publish-package` fallback unless the developer explicitly authorizes it after diagnosing a CI release failure.
- Verify the release workflow succeeded and CodeArtifact resolves exact package version `0.5.3`.
- Verify package root and `./components` imports from the published tarball expose `CardGrid`.
- Record the tag, workflow run, CodeArtifact verification, and exact published semver in Execution Notes.
- Do not modify or bump downstream journey SPA dependencies; downstream adoption is a separate repository workflow.

## Testing Expectations

Run all commands from this repository root.

- Confirm branch is `main`, it matches its remote, and the working tree is clean.
- Run `mh` if CodeArtifact credentials are needed.
- `npm ci`
- `npm run test`
- `npm run lint`
- `npm run build`
- Confirm `npm run tag-release` will target exactly `v0.5.3`, then execute it once.
- Verify the tag-triggered GitHub Actions release completed successfully.
- Query the configured CodeArtifact npm registry for `@mentor-forge/mentorhub_spa_utils@0.5.3` and assert the returned version is exactly `0.5.3`.
- Download/inspect the published package and confirm its package metadata and `CardGrid` root/`./components` declarations.

## Outputs

No product source files are changed by this release task.

External outputs:

- Git tag `v0.5.3`
- Published CodeArtifact package `@mentor-forge/mentorhub_spa_utils@0.5.3`
- This task's status and Execution Notes updated after verification

## Execution Notes
